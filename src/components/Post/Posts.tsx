import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { firestore } from '@/Firebase/clientApp';

import type { Community } from '../../atoms/communitiesAtom';
import type { Post } from '../../atoms/postsAtom';
import usePosts from '../../hooks/usePosts';
import PostLoader from './Loader';
import PostItem from './PostItem';

type PostsProps = {
  communityData?: Community;
  userId?: string;
  loadingUser: boolean;
};

const Posts: React.FC<PostsProps> = ({ communityData, userId }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { postStateValue, setPostStateValue, onVote, onDeletePost } =
    usePosts();

  const onSelectPost = (post: Post, postIdx: number) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: { ...post, postIdx },
    }));
    router.push(`/r/${communityData?.id!}/comments/${post.id}`);
  };

  const getPosts = async () => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityData?.id!),
        orderBy('createdAt', 'desc')
      );
      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
        postsCache: {
          ...prev.postsCache,
          [communityData?.id!]: posts as Post[],
        },
        postUpdateRequired: false,
      }));
    } catch (error: any) {
      console.log('getPosts error', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (
      postStateValue.postsCache[communityData?.id!] &&
      !postStateValue.postUpdateRequired
    ) {
      setPostStateValue((prev) => ({
        ...prev,
        posts: postStateValue.postsCache[communityData?.id!] as Post[],
      }));
      return;
    }

    getPosts();
  }, [communityData, postStateValue.postUpdateRequired]);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post: Post) => (
            <PostItem
              key={post.id}
              post={post}
              // postIdx={index}
              onVote={onVote}
              onDeletePost={onDeletePost}
              userVoteValue={
                postStateValue.postVotes.find((item) => item.postId === post.id)
                  ?.voteValue
              }
              userIsCreator={userId === post.creatorId}
              onSelectPost={onSelectPost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
