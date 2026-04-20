import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ className = '' }) => {
  return (
    <div className={`flex justify-center items-center py-8 ${className}`}>
      <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
    </div>
  );
};

export default Loader;
