'use client';

import { useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { SpinnerIcon } from '@/components/icons';
import { useGetPhotosQuery } from '@/utils/api/hooks/useGetPhotosQuery';

import { EmptyPhoto } from './EmptyPhoto';
import { PhotoGrid } from './PhotoGrid';

export const PhotoList = () => {
  const [query, _] = useQueryState('query');
  const { ref, inView } = useInView({
    rootMargin: '0px 0px 800px 0px',
  });

  const {
    data: photos,
    isFetching,
    isPending,
    fetchNextPage,
    hasNextPage,
  } = useGetPhotosQuery(query!);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isPending) {
    return <SpinnerIcon className="animate-spin h-8 w-8 mx-auto my-20" />;
  }
  if (!photos?.pages[0].length) {
    return <EmptyPhoto />;
  }

  return <PhotoGrid ref={ref} isFetching={isFetching} photos={photos} />;
};
