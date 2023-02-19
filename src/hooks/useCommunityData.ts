import { doc, getDoc, increment, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { authModalState } from '@/atoms/AuthModalAtom';
import type { Community, CommunitySnippet } from '@/atoms/communitiesAtom';
import { communityState, defaultCommunity } from '@/atoms/communitiesAtom';
import { auth, firestore } from '@/Firebase/clientApp';
import { getMySnippets } from '@/helpers/firestore';

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getSnippets = async () => {
    setLoading(true);
    try {
      const snippets = await getMySnippets(user?.uid!);
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        initSnippetsFetched: true,
      }));
      setLoading(false);
    } catch (error: any) {
      console.log('Error getting user snippets', error);
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user || !!communityStateValue.mySnippets.length) return;

    getSnippets();
  }, [user]);

  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(
        firestore,
        'communities',
        communityId as string
      );
      const communityDoc = await getDoc(communityDocRef);

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error: any) {
      console.log('getCommunityData error', error.message);
    }
    setLoading(false);
  };

  const joinCommunity = async (community: Community) => {
    console.log('JOINING COMMUNITY: ', community.id);
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: community.id,
        imageURL: community.imageURL || '',
      };
      batch.set(
        doc(firestore, `users/${user?.uid}/communitySnippets`, community.id),
        newSnippet
      );

      batch.update(doc(firestore, 'communities', community.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error) {
      console.log('joinCommunity error', error);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets/${communityId}`)
      );

      batch.update(doc(firestore, 'communities', communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
    } catch (error) {
      console.log('leaveCommunity error', error);
    }
    setLoading(false);
  };

  const onJoinLeaveCommunity = (community: Community, isJoined?: boolean) => {
    console.log('ON JOIN LEAVE', community.id);

    if (!user) {
      setAuthModalState({ open: true, view: 'login' });
      return;
    }

    setLoading(true);
    if (isJoined) {
      leaveCommunity(community.id);
      return;
    }
    joinCommunity(community);
  };

  useEffect(() => {
    const { community } = router.query;
    if (community) {
      const communityData = communityStateValue.currentCommunity;

      if (!communityData.id) {
        getCommunityData(community as string);
      }
    } else {
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: defaultCommunity,
      }));
    }
  }, [router.query, communityStateValue.currentCommunity]);

  return {
    communityStateValue,
    onJoinLeaveCommunity,
    loading,
    setLoading,
    error,
  };
};

export default useCommunityData;
