import { createContext, useContext, useState } from 'react';

interface HeroContextProps {
  element: DOMRect | null;
  setElement: (element: HTMLElement | null) => void;
}

const HeroContext = createContext<HeroContextProps | null>(null);

interface HeroProviderProps {
  children: React.ReactNode;
}

const HeroProvider = ({ children }: HeroProviderProps) => {
  const [heroElement, setHeroElement] = useState<DOMRect | null>(null);

  const setElement = (element: HTMLElement | null) => {
    if (element) {
      setHeroElement(element.getBoundingClientRect());
    } else {
      setHeroElement(null);
    }
  };

  return (
    <HeroContext.Provider value={{ element: heroElement, setElement }}>
      {children}
    </HeroContext.Provider>
  );
};

export default HeroProvider;

export const useHeroProvider = () => {
  const ctx = useContext(HeroContext);

  if (ctx === null) {
    throw new Error('HeroProvider must be used within a HeroProvider');
  }
  return ctx;
};
