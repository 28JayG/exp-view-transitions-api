import { useLayoutEffect, useRef, useState } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router';
import './App.css';
import HeroProvider, { useHeroProvider } from './providers/hero.provider';
import { flushSync } from 'react-dom';

type Item = {
  id: number;
  emoji: string;
  title: string;
  color: string;
  description: string;
};

const ITEMS: Item[] = [
  {
    id: 1,
    emoji: '🍋',
    title: 'Lemon',
    color: '#f7d84a',
    description: 'Sour, bright, and great in nearly everything.',
  },
  {
    id: 2,
    emoji: '🫐',
    title: 'Blueberry',
    color: '#6c7ee1',
    description: 'Small, sweet, and packed with antioxidants.',
  },
  {
    id: 3,
    emoji: '🍉',
    title: 'Watermelon',
    color: '#f0697a',
    description: 'Mostly water, entirely summer.',
  },
  {
    id: 4,
    emoji: '🥝',
    title: 'Kiwi',
    color: '#8bc34a',
    description: 'Fuzzy outside, tangy green inside.',
  },
];

const ItemList = () => {
  const { setElement } = useHeroProvider();
  // const navigate = useNavigate();

  return (
    <ul className='list'>
      {ITEMS.map((item) => (
        <li key={item.id}>
          <Link
            className='card'
            onClick={(e) => {
              // e.preventDefault();
              // document.startViewTransition(() => {
              //   flushSync(() => navigate(`/items/${item.id}`));
              // });
              setElement(e.currentTarget.firstElementChild as HTMLElement);
            }}
            to={`/items/${item.id}`}
          >
            <span
              id={`hero-element-${item.id}`}
              className='card-emoji'
              style={{
                background: item.color,
                viewTransitionName: `hero-${item.id}`,
              }}
            >
              {item.emoji}
            </span>
            <span>{item.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const ItemDetail = () => {
  const [style, setStyle] = useState<
    React.HTMLAttributes<HTMLElement>['style']
  >({});

  const { id } = useParams();
  const selected = ITEMS.find((item) => item.id === Number(id));

  const heroRef = useRef<HTMLDivElement>(null);

  const { element: elementRect } = useHeroProvider();

  useLayoutEffect(() => {
    if (!elementRect || !heroRef.current) return;

    const currentRect = elementRect;
    const heroRect = heroRef.current?.getBoundingClientRect();

    const deltaY = currentRect?.y - heroRect?.y;
    const deltaX = currentRect?.x - heroRect?.x;
    const scaleX = currentRect.width / heroRect.width;
    const scaleY = currentRect.height / heroRect.height;

    setStyle({
      transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`,
      transformOrigin: 'top left',
      transition: 'none',
    });

    const rafId = requestAnimationFrame(() => {
      setStyle({
        transform: 'translate3d(0, 0, 0) scale(1, 1)',
        transformOrigin: 'top left',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [elementRect]);

  if (!selected) return <Navigate to='/' replace />;

  return (
    <article className='detail'>
      <div
        ref={heroRef}
        className='detail-hero'
        // style={{
        //   background: selected.color,
        //   viewTransitionName: `hero-${selected.id}`,
        // }}
        style={{ background: selected.color, ...style }}
      >
        {selected.emoji}
      </div>
      <h2>{selected.title}</h2>
      <p className='detail-text'>{selected.description}</p>
      <Link className='back' to='/'>
        ← Back
      </Link>
    </article>
  );
};

const HeroOverlay = () => {
  const { element: elementRect } = useHeroProvider();

  return (
    <aside className='hero-overlay'>
      <h3>Hero provider</h3>
      {elementRect ? (
        <dl>
          <dt>rect</dt>
          <dd>
            {Math.round(elementRect.x)}, {Math.round(elementRect.y)} ·{' '}
            {Math.round(elementRect.width)}×{Math.round(elementRect.height)}
          </dd>
        </dl>
      ) : (
        <p>No element set</p>
      )}
    </aside>
  );
};

const App = () => {
  return (
    <main className='app'>
      <h1>View Transitions API</h1>

      <div>
        <HeroProvider>
          <Routes>
            <Route path='/' element={<ItemList />} />
            <Route path='/items/:id' element={<ItemDetail />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>

          <HeroOverlay />
        </HeroProvider>
      </div>
    </main>
  );
};

export default App;
