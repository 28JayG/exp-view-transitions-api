import { useRef } from 'react';
import { flushSync } from 'react-dom';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router';
import './App.css';

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
  const navigate = useNavigate();

  return (
    <ul className='list'>
      {ITEMS.map((item) => (
        <li key={item.id}>
          <Link
            className='card'
            onClick={(e) => {
              e.preventDefault();
              document.startViewTransition(() => {
                flushSync(() => navigate(`/items/${item.id}`));
              });
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
  const { id } = useParams();
  const selected = ITEMS.find((item) => item.id === Number(id));

  const heroRef = useRef<HTMLDivElement>(null);

  if (!selected) return <Navigate to='/' replace />;

  return (
    <article className='detail'>
      <div
        ref={heroRef}
        className='detail-hero'
        style={{
          background: selected.color,
          viewTransitionName: `hero-${selected.id}`,
        }}
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

const App = () => {
  return (
    <main className='app'>
      <h1>View Transitions API</h1>

      <Routes>
        <Route path='/' element={<ItemList />} />
        <Route path='/items/:id' element={<ItemDetail />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </main>
  );
};

export default App;
