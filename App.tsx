import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Search, Menu, User, Grid, Star, Download, ChevronRight, Mic, Share2, MoreVertical, ArrowLeft, Home, Gamepad2, Film, Library, Github, Sparkles } from 'lucide-react';
import { MOCK_APPS, CATEGORIES } from './constants';
import { AppData, Review } from './types';
import { generateAppSuggestions, generateAppReviews } from './services/geminiService';

// --- Shared Components ---

const StarRating: React.FC<{ rating: number; size?: number; showCount?: boolean; count?: string }> = ({ rating, size = 16, showCount = false, count }) => {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-600">
      <span className="font-medium">{rating.toFixed(1)}</span>
      <Star size={size} className="fill-current text-green-700" />
      {showCount && count && <span className="ml-1 text-gray-500">{count} reviews</span>}
    </div>
  );
};

const AppCard: React.FC<{ app: AppData; onClick: () => void }> = ({ app, onClick }) => {
  return (
    <div onClick={onClick} className="group cursor-pointer min-w-[100px] w-[100px] md:min-w-[120px] md:w-[120px] flex flex-col gap-2">
      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
        <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover" />
        {app.isAiGenerated && (
          <div className="absolute top-1 right-1 bg-purple-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase">
            AI
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight">{app.name}</span>
        <span className="text-[10px] text-gray-500 line-clamp-1">{app.rating} ★</span>
      </div>
    </div>
  );
};

const WideAppCard: React.FC<{ app: AppData; onClick: () => void }> = ({ app, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors">
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm relative">
        <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover" />
         {app.isAiGenerated && (
          <div className="absolute top-0 right-0 bg-purple-600 text-white text-[8px] px-1 py-0.5 rounded-bl-md font-bold uppercase">
            AI
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{app.name}</h3>
        <p className="text-xs text-gray-500 truncate">{app.category} • {app.developer}</p>
        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={app.rating} size={10} />
          <span className="text-[10px] text-gray-400">• {app.downloads}</span>
        </div>
      </div>
    </div>
  );
};

// --- Layout Components ---

const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 pt-20 border-r border-gray-200 bg-white z-10">
      <div className="flex flex-col gap-1 px-2">
        <NavItem icon={<Gamepad2 size={24} />} label="Games" active />
        <NavItem icon={<Grid size={24} />} label="Apps" />
        <NavItem icon={<Film size={24} />} label="Movies & TV" />
        <NavItem icon={<Library size={24} />} label="Books" />
        <NavItem icon={<Star size={24} />} label="Children" />
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`flex items-center gap-4 px-6 py-3 rounded-full text-sm font-medium transition-colors ${active ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const Navbar = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white z-50 flex items-center px-4 md:px-8 gap-4 md:gap-8 border-b border-gray-100 shadow-sm md:shadow-none">
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 rounded-lg flex items-center justify-center text-white">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.5 19.5v-15l17.5 7.5-17.5 7.5z" /></svg>
        </div>
        <span className="hidden md:block font-google text-xl text-gray-600 tracking-tight">Google Play <span className="text-gray-400 text-sm">Clone</span></span>
      </Link>

      <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-600">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for apps & games" 
          className="w-full bg-gray-100 text-gray-700 h-11 pl-11 pr-12 rounded-full border-none focus:ring-2 focus:ring-green-100 focus:bg-white transition-all outline-none shadow-sm"
        />
        <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">
           <Mic size={20} />
        </button>
      </form>

      <div className="flex items-center gap-4 shrink-0">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full hidden sm:block">
          <Github size={20} />
        </button>
        <button className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          A
        </button>
      </div>
    </div>
  );
};

// --- Pages ---

const HomePage: React.FC<{ apps: AppData[] }> = ({ apps }) => {
  const navigate = useNavigate();
  const featured = apps.slice(0, 4);
  const recommended = apps.slice(0, 6);

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Categories Tabs */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map((cat, i) => (
          <button key={cat} className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${i === 0 ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Slider Mockup */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-google text-lg font-medium text-gray-900">Featured Apps</h2>
          <button className="text-green-700 text-sm font-medium hover:bg-green-50 px-3 py-1 rounded">See all</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {featured.map(app => (
             <div key={app.id} onClick={() => navigate(`/app/${app.id}`, { state: { app } })} className="shrink-0 w-[280px] h-[160px] rounded-xl relative overflow-hidden cursor-pointer shadow-md group">
               <img src={`https://picsum.photos/seed/${app.id}banner/500/300`} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="banner" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-medium text-lg">{app.name}</h3>
                  <p className="text-gray-300 text-xs line-clamp-1">{app.shortDescription}</p>
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* Recommended For You */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-google text-lg font-medium text-gray-900">Recommended for you</h2>
          <button className="text-green-700 text-sm font-medium hover:bg-green-50 px-3 py-1 rounded">See all</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {recommended.map(app => (
            <AppCard key={app.id} app={app} onClick={() => navigate(`/app/${app.id}`, { state: { app } })} />
          ))}
        </div>
      </section>

      {/* Top Charts */}
       <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-google text-lg font-medium text-gray-900">Top Charts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
          {apps.slice(0, 9).map((app, i) => (
            <div key={app.id} onClick={() => navigate(`/app/${app.id}`, { state: { app } })} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
               <span className="text-gray-500 font-medium w-4">{i + 1}</span>
               <img src={app.iconUrl} className="w-14 h-14 rounded-xl shadow-sm" alt={app.name} />
               <div className="flex flex-col min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{app.name}</h4>
                  <p className="text-xs text-gray-500">{app.category}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-gray-600">{app.rating}</span>
                    <Star size={10} className="fill-current text-gray-600" />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const AppDetailsPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [app, setApp] = useState<AppData | null>((location.state as any)?.app || null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // If accessed directly without state, we would fetch ID from mock or API.
    // For now, fallback to finding in MOCK_APPS if state is null
    if (!app && id) {
       const found = MOCK_APPS.find(a => a.id === id);
       if (found) setApp(found);
    }
  }, [id, app]);

  useEffect(() => {
    if (app) {
      // If AI generated and no reviews, or if mock and empty reviews (we didn't mock reviews), generate them
      if (app.reviews.length === 0) {
        setLoadingReviews(true);
        generateAppReviews(app.name).then(res => {
          setReviews(res);
          setLoadingReviews(false);
        });
      } else {
        setReviews(app.reviews);
      }
    }
  }, [app]);

  const handleInstall = () => {
    setInstalling(true);
    setTimeout(() => {
      setInstalling(false);
      setInstalled(true);
    }, 2500);
  };

  if (!app) return <div className="p-10 text-center">App not found</div>;

  return (
    <div className="animate-fade-in pb-20">
      <button onClick={() => navigate(-1)} className="md:hidden mb-4 text-gray-600">
        <ArrowLeft size={24} />
      </button>

      {/* Header Section */}
      <div className="flex gap-5 mb-8">
        <img src={app.iconUrl} alt={app.name} className="w-24 h-24 md:w-32 md:h-32 rounded-2xl shadow-md" />
        <div className="flex flex-col pt-1">
          <h1 className="font-google text-2xl md:text-3xl font-medium text-gray-900 leading-tight mb-1">{app.name}</h1>
          <p className="text-green-700 font-medium text-sm md:text-base mb-2">{app.developer}</p>
          <div className="text-gray-500 text-xs md:text-sm mb-4">Contains ads • In-app purchases</div>
          
          <div className="hidden md:flex gap-8 mb-4">
             <div className="flex flex-col items-center border-r pr-8 border-gray-200">
                <div className="flex items-center gap-1 font-medium text-gray-800">
                   <span>{app.rating}</span> <Star size={12} className="fill-current" />
                </div>
                <span className="text-xs text-gray-500">2M reviews</span>
             </div>
             <div className="flex flex-col items-center border-r pr-8 border-gray-200">
                <div className="font-medium text-gray-800">{app.downloads}</div>
                <span className="text-xs text-gray-500">Downloads</span>
             </div>
             <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center rounded-sm">E</div>
                <span className="text-xs text-gray-500">Everyone</span>
             </div>
          </div>
          
          <button 
            onClick={handleInstall}
            className={`w-full md:w-auto px-12 py-2.5 rounded-full font-medium transition-all ${installed ? 'bg-gray-100 text-green-700' : 'bg-green-700 text-white hover:bg-green-800'} flex items-center justify-center gap-2`}
          >
            {installing ? 'Installing...' : installed ? 'Open' : 'Install'}
          </button>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="flex md:hidden justify-between mb-6 pb-6 border-b border-gray-100 overflow-x-auto">
         <div className="flex flex-col items-center px-4 min-w-[90px]">
            <div className="flex items-center gap-1 font-medium text-gray-800">
               <span>{app.rating}</span> <Star size={12} className="fill-current" />
            </div>
            <span className="text-xs text-gray-500">2M reviews</span>
         </div>
         <div className="flex flex-col items-center px-4 border-l border-gray-200 min-w-[90px]">
            <div className="font-medium text-gray-800">{app.downloads}</div>
            <span className="text-xs text-gray-500">Downloads</span>
         </div>
         <div className="flex flex-col items-center px-4 border-l border-gray-200 min-w-[90px]">
            <div className="w-5 h-5 bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center rounded-sm">E</div>
            <span className="text-xs text-gray-500">Everyone</span>
         </div>
      </div>

      {/* Screenshots */}
      <section className="mb-8 overflow-x-auto no-scrollbar -mx-4 md:mx-0 px-4 md:px-0">
         <div className="flex gap-3">
           {app.screenshots.map((src, i) => (
             <img key={i} src={src} className="h-[280px] md:h-[350px] rounded-xl shadow-sm object-cover" alt="screenshot" />
           ))}
         </div>
      </section>

      {/* About */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
           <h2 className="font-google text-lg font-medium text-gray-900">About this app</h2>
           <ArrowLeft size={20} className="transform rotate-180 text-gray-500" />
        </div>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {app.description}
        </p>
        
        {app.tags && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {app.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full border border-gray-300 text-xs text-gray-600 font-medium">{tag}</span>
            ))}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section>
         <h2 className="font-google text-lg font-medium text-gray-900 mb-4">Ratings and reviews</h2>
         {loadingReviews ? (
           <div className="flex items-center gap-2 text-gray-500 text-sm"><span className="animate-spin">⌛</span> Loading AI reviews...</div>
         ) : (
           <div className="flex flex-col gap-6">
             {reviews.map((rev, i) => (
               <div key={i} className="flex gap-4">
                 <img src={rev.avatar} className="w-8 h-8 rounded-full" alt="user" />
                 <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{rev.user}</span>
                      <div className="flex text-green-700 text-[10px]">
                        {[...Array(5)].map((_, si) => (
                          <Star key={si} size={10} className={si < Math.round(rev.rating) ? "fill-current" : "text-gray-300"} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{rev.date}</span>
                   </div>
                   <p className="text-sm text-gray-600 leading-snug">{rev.text}</p>
                 </div>
               </div>
             ))}
             {reviews.length === 0 && <p className="text-gray-500 italic">No reviews yet.</p>}
           </div>
         )}
      </section>
    </div>
  );
};

const SearchPage: React.FC = () => {
  const [params] = useLocation().search.split('?q=');
  const query = decodeURIComponent(params[1] || '');
  const [results, setResults] = useState<AppData[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [localResults, setLocalResults] = useState<AppData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;
    
    // Filter local mock apps
    const local = MOCK_APPS.filter(app => 
      app.name.toLowerCase().includes(query.toLowerCase()) || 
      app.category.toLowerCase().includes(query.toLowerCase()) ||
      app.tags?.some(t => t.toLowerCase().includes(query.toLowerCase()))
    );
    setLocalResults(local);

    // Always fetch AI suggestions to make it "explorable"
    setAiLoading(true);
    generateAppSuggestions(query).then(aiApps => {
      setResults(aiApps);
      setAiLoading(false);
    });
  }, [query]);

  return (
    <div className="pb-20">
      <h1 className="font-google text-lg mb-4">Search results for "{query}"</h1>
      
      {localResults.length > 0 && (
        <div className="mb-8">
           <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Installed & Available</h2>
           <div className="flex flex-col gap-2">
             {localResults.map(app => (
               <WideAppCard key={app.id} app={app} onClick={() => navigate(`/app/${app.id}`, { state: { app } })} />
             ))}
           </div>
        </div>
      )}

      <div>
         <div className="flex items-center gap-2 mb-3">
           <Sparkles size={16} className="text-purple-600" />
           <h2 className="text-sm font-medium text-gray-900">AI Generated Suggestions</h2>
           <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Gemini</span>
         </div>
         
         {aiLoading ? (
           <div className="flex flex-col gap-4">
             {[1,2,3].map(i => (
               <div key={i} className="animate-pulse flex gap-4 p-2">
                 <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                 <div className="flex-1 flex flex-col gap-2 pt-1">
                   <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
                   <div className="h-3 bg-gray-200 w-1/4 rounded"></div>
                 </div>
               </div>
             ))}
           </div>
         ) : results.length > 0 ? (
           <div className="flex flex-col gap-2">
             {results.map(app => (
               <WideAppCard key={app.id} app={app} onClick={() => navigate(`/app/${app.id}`, { state: { app } })} />
             ))}
           </div>
         ) : (
            <div className="text-center py-10 text-gray-500">
               <p>No AI results found. Try a different query!</p>
            </div>
         )}
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [allApps, setAllApps] = useState<AppData[]>(MOCK_APPS);

  const handleSearch = (q: string) => {
    // Search is handled by navigation to /search page
    console.log("Searching for", q);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar onSearch={handleSearch} />
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="md:ml-64 pt-16 px-4 md:px-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage apps={allApps} />} />
            <Route path="/app/:id" element={<AppDetailsPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 pb-safe z-40">
           <Link to="/" className="flex flex-col items-center gap-1 text-green-700">
              <Gamepad2 size={24} />
              <span className="text-[10px] font-medium">Games</span>
           </Link>
           <Link to="/" className="flex flex-col items-center gap-1 text-gray-500">
              <Grid size={24} />
              <span className="text-[10px] font-medium">Apps</span>
           </Link>
           <div className="flex flex-col items-center gap-1 text-gray-500">
              <Film size={24} />
              <span className="text-[10px] font-medium">Movies</span>
           </div>
           <div className="flex flex-col items-center gap-1 text-gray-500">
              <Library size={24} />
              <span className="text-[10px] font-medium">Books</span>
           </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
