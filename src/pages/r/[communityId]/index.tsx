import { doc, getDoc } from 'firebase/firestore';
import type { GetServerSidePropsContext, NextPage } from 'next';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
import safeJsonStringify from 'safe-json-stringify';

import About from '@/components/Community/About';
import CreatePostLink from '@/components/Community/CreatePostLink';
import Header from '@/components/Community/Header';
import PageContentLayout from '@/components/Layout/PageContent';
import Posts from '@/components/Post/Posts';
// import safeJsonStringify from "safe-json-stringify";
import { auth, firestore } from '@/Firebase/clientApp';

import type { Community } from './communitiesAtom';
import { communityState } from './communitiesAtom';

interface CommunityPageProps {
  communityData: Community;
}

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
  const setCommunityStateValue = useSetRecoilState(communityState);
  const [user, loadingUser] = useAuthState(auth);

  if (!communityData) {
    return (
      <>
        <Header communityData={communityData} />
        <PageContentLayout>
          <>
            <CreatePostLink />
            <Posts
              communityData={communityData}
              userId={user?.uid}
              loadingUser={loadingUser}
            />
          </>
          {/* Right Content */}
          <>
            <About communityData={communityData} />
          </>
        </PageContentLayout>
      </>
    );
  }

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, []);

  return <div>welcome to {communityData.id}</div>;
};

export default CommunityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log('GET SERVER SIDE PROPS RUNNING');

  try {
    const communityDocRef = doc(
      firestore,
      'communities',
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);
    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // needed for dates
            )
          : '',
      },
    };
  } catch (error) {
    // Could create error page here
    console.log('getServerSideProps error - [community]', error);
  }
}
