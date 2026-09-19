import React from 'react';

export const CapaEfectos: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
      {/* Deep corner ambient vignettes - estáticas para máximo rendimiento */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-900/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-950/15 rounded-full blur-2xl translate-x-1/3 translate-y-1/3" />

      {/* Ambient Vignette Border */}
      <div className="absolute inset-0 ambient-vignette" />
    </div>
  );
};
