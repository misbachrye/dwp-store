import React from 'react';
import { Skeleton, Stack } from '@mui/material';

const TableSkeleton = () => {
  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      <Skeleton 
        variant="rectangular" 
        height={50} 
        animation="wave" 
        sx={{ borderRadius: 1, bgcolor: 'grey.200' }} 
      />
      
      {Array.from(new Array(5)).map((_, index) => (
        <Skeleton 
          key={index} 
          variant="rectangular" 
          height={60} 
          animation="wave" 
          sx={{ borderRadius: 1, bgcolor: 'grey.100' }} 
        />
      ))}
    </Stack>
  );
};

export default TableSkeleton;