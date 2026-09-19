import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#030107] text-purple-100 text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-amber-400/50 flex items-center justify-center text-amber-300 text-2xl shadow-[0_0_30px_rgba(245,158,11,0.4)] mb-4">
            ✨
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-200 text-gold-glow mb-2">
            El cosmos está sincronizando
          </h2>
          <p className="text-sm text-purple-300/80 font-light max-w-md mb-6 leading-relaxed">
            Se han actualizado los módulos del universo. Haz clic abajo para recargar la experiencia.
          </p>
          <button
            onClick={this.handleReload}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-800 to-amber-600 border border-amber-300 text-white font-serif text-sm tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Recargar experiencia
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
