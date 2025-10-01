
import React from 'react';

export function LoadingSpinner(): React.ReactNode {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"></div>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mt-6">지금 여행 계획을 짜고 있습니다...</h2>
      <p className="text-gray-500 mt-2">최고의 경험을 위해 잠시만 기다려주세요!</p>
    </div>
  );
}