/* eslint-disable no-unsafe-optional-chaining */
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { authModalState } from '@/atoms/AuthModalAtom';
import type { Post } from '@/atoms/postsAtom';
import { postState } from '@/atoms/postsAtom';
import { firestore } from '@/Firebase/clientApp';

import type { Comment } from './CommentItem';
import CommentItem from './CommentItem';
import CommentInput from './Input';

type CommentsProps = {
  user?: User | null;
  selectedPost: Post;
  community: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  community,
}) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentFetchLoading, setCommentFetchLoading] = useState(false);
  const [commentCreateLoading, setCommentCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState('');
  const setAuthModalState = useSetRecoilState(authModalState);
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async () => {
    if (!user) {
      setAuthModalState({ open: true, view: 'login' });
      return;
    }

    setCommentCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      const commentDocRef = doc(collection(firestore, 'comments'));
      batch.set(commentDocRef, {
        postId: selectedPost.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split('@')[0],
        creatorPhotoURL: user.photoURL,
        communityId: community,
        text: comment,
        postTitle: selectedPost.title,
        createdAt: serverTimestamp(),
      } as Comment);

      batch.update(doc(firestore, 'posts', selectedPost.id), {
        numberOfComments: increment(1),
      });
      await batch.commit();

      setComment('');
      const { id: postId, title } = selectedPost;
      setComments((prev) => [
        {
          id: commentDocRef.id,
          creatorId: user.uid,
          creatorDisplayText: user.email!.split('@')[0],
          creatorPhotoURL: user.photoURL,
          communityId: community,
          postId,
          postTitle: title,
          text: comment,
          createdAt: {
            seconds: Date.now() / 1000,
          },
        } as Comment,
        ...prev,
      ]);

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
        postUpdateRequired: true,
      }));
    } catch (error: any) {
      console.log('onCreateComment error', error.message);
    }
    setCommentCreateLoading(false);
  };

  const onDeleteComment = useCallback(
    async (commentItem: Comment) => {
      setDeleteLoading(commentItem.id as string);
      try {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        if (!commentItem.id) throw 'Comment has no ID';
        const batch = writeBatch(firestore);
        const commentDocRef = doc(firestore, 'commentItem', commentItem.id);
        batch.delete(commentDocRef);

        batch.update(doc(firestore, 'posts', commentItem.postId), {
          numberOfComments: increment(-1),
        });

        await batch.commit();

        setPostState((prev) => ({
          ...prev,
          selectedPost: {
            ...prev.selectedPost,
            numberOfComments: prev.selectedPost?.numberOfComments! - 1,
          } as Post,
          postUpdateRequired: true,
        }));

        setComments((prev) =>
          prev.filter((item) => item.id !== commentItem.id)
        );
      } catch (error) {
        console.log(error);
      }
      setDeleteLoading('');
    },
    [setComments, setPostState]
  );

  const getPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, 'comments'),
        where('postId', '==', selectedPost.id),
        orderBy('createdAt', 'desc')
      );
      const commentDocs = await getDocs(commentsQuery);
      const commentItem = commentDocs.docs.map((docs) => ({
        id: docs.id,
        ...docs.data(),
      }));
      setComments(commentItem as Comment[]);
    } catch (error: any) {
      console.log('getPostComments error', error.message);
    }
    setCommentFetchLoading(false);
  };

  useEffect(() => {
    console.log('HERE IS SELECTED POST', selectedPost.id);

    getPostComments();
  }, []);

  return (
    <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        <CommentInput
          comment={comment}
          setComment={setComment}
          loading={commentCreateLoading}
          user={user}
          onCreateComment={onCreateComment}
        />
      </Flex>
      <Stack spacing={6} p={2}>
        {commentFetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length ? (
              <>
                {comments.map((item: Comment) => (
                  <CommentItem
                    key={item.id}
                    comment={item}
                    onDeleteComment={onDeleteComment}
                    isLoading={deleteLoading === (item.id as string)}
                    userId={user?.uid}
                  />
                ))}
              </>
            ) : (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
