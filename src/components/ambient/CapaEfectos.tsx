import React from 'react';

export const CapaEfectos: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
      {/* Deep corner ambient vignettes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-indigo-950/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse-slow" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-violet-950/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-12 w-80 h-80 bg-fuchsia-950/10 rounded-full blur-3xl animate-float-reverse" />

      {/* Ambient Vignette Border */}
      <div className="absolute inset-0 ambient-vignette" />

      {/* Ethereal Floating Constellation Points */}
      <div className="absolute top-12 left-1/4 w-1.5 h-1.5 rounded-full bg-purple-300/40 blur-[1px] animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-200/35 blur-[1px] animate-pulse-slow" />
      <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-violet-400/30 blur-[1px] animate-ping duration-1000" style={{ animationDuration: '6s' }} />
      <div className="absolute top-2/3 right-12 w-1.5 h-1.5 rounded-full bg-fuchsia-200/40 blur-[1px] animate-pulse" />
    </div>
  );
};
