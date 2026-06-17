import { useState, useEffect, useCallback } from 'react';
import { 
    Cpu, Search, Loader2, Terminal, User, BookOpen, 
    Key, Fingerprint, Copy, Check, Database, Lock, 
    AlertCircle, FileX2 
} from 'lucide-react';

// --- 3. SERVICE (DATA FETCHING) ---
const SPREADSHEET_ID = '1SCZdXFK4EI6umxDkQtdGE2W9q1fJUQ6ZrmRYIofaNlA';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;

const parseCSV = (csvText: string) => {
    const lines = csvText.split(/\r?\n/);
    const students = [];

    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(',').map(col => col.replace(/^"|"$/g, '').trim());

        if (columns.length >= 5) {
            const noMyKidClean = columns[4].replace(/[^0-9]/g, ''); 

            students.push({
                kelas: columns[0],
                nama: columns[1],
                idDelima: columns[2],
                kataLaluan: columns[3],
                noMyKid: noMyKidClean
            });
        }
    }
    return students;
};

const fetchStudentData = async () => {
    try {
        const timestamp = new Date().getTime();
        const urlWithTimestamp = `${CSV_URL}&t=${timestamp}`;

        const response = await fetch(urlWithTimestamp);

        if (!response.ok) {
            throw new Error('Gagal memuat turun data.');
        }
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// --- 4. COMPONENTS ---

const Header = () => {
    return (
        <div className="bg-slate-900 border-b border-cyan-900/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-5xl mx-auto py-8 px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6 justify-center text-center md:text-left">
                    
                    {/* Logo */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-cyan-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="bg-slate-800 p-4 rounded-full border border-slate-700 relative z-10 ring-1 ring-cyan-500/30">
                            <img 
                                src="https://i.postimg.cc/85t7Jtgb/LOGO-SEKOLAH-SKTK-removebg-preview.png" 
                                alt="Logo Sekolah Kebangsaan Tanah Kebun" 
                                className="h-24 w-auto object-contain drop-shadow-lg"
                            />
                        </div>
                    </div>
                    
                    {/* School Info */}
                    <div className="flex flex-col items-center md:items-start">
                        <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wide text-white tech-font drop-shadow-md">
                            Sekolah Kebangsaan Tanah Kebun
                        </h2>
                        <p className="text-slate-300 text-sm md:text-base font-medium tracking-wide mb-1">
                            34200 Parit Buntar, Perak Darul Ridzuan.
                        </p>
                        <p className="text-slate-400 text-xs font-medium tracking-wide flex items-center gap-2">
                            <Cpu size={14} className="text-blue-500" />
                            <span>Pangkalan Data DELIMa Murid</span>
                        </p>
                    </div>
                </div>

                {/* Title Divider */}
                <div className="mt-8 flex items-center gap-4">
                    <div className="h-px bg-slate-700 flex-grow"></div>
                    <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 tech-font border px-4 py-1 rounded border-slate-700 bg-slate-800/50">
                        SISTEM SEMAKAN ID DELIMa
                    </h1>
                    <div className="h-px bg-slate-700 flex-grow"></div>
                </div>
            </div>
        </div>
    );
};

// @ts-ignore
const SearchInput = ({ value, onChange, onSearch, isLoading }) => {
    // @ts-ignore
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto -mt-6 relative z-20 px-4">
            <div className="bg-slate-800/90 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-cyan-500/30 ring-4 ring-slate-900/50">
                
                <div className="flex items-center gap-2 mb-3 text-cyan-400">
                    <Terminal size={16} />
                    <label htmlFor="mykid" className="text-xs font-bold uppercase tracking-widest code-font">
                        Input Carian MyKid
                    </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-0 rounded-lg overflow-hidden border border-slate-600 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400 transition-all shadow-inner bg-slate-900">
                    <div className="flex-grow relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 code-font select-none">{'>'}</span>
                        <input
                            type="text"
                            id="mykid"
                            className="w-full pl-8 pr-4 py-4 bg-transparent text-white placeholder-slate-600 outline-none text-lg code-font tracking-wide"
                            placeholder="100101012345"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            maxLength={12}
                        />
                    </div>
                    <button
                        onClick={onSearch}
                        disabled={isLoading || !value}
                        className="flex items-center justify-center gap-2 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-800 text-white px-8 py-3 font-semibold transition-all border-l border-slate-700 sm:w-auto w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin text-cyan-200" size={20} />
                                <span className="tech-font">MEMPROSES...</span>
                            </>
                        ) : (
                            <>
                                <Search size={20} className="text-cyan-200" />
                                <span className="tech-font tracking-wider">SEMAK DATA</span>
                            </>
                        )}
                    </button>
                </div>
                
                <div className="mt-3 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                    <span>Status: Pangkalan Data Bersambung</span>
                    <span>Versi Sistem 2.0</span>
                </div>
            </div>
        </div>
    );
};

// @ts-ignore
const StudentCard = ({ student }) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4 animate-fade-in-up">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative group">
                
                <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

                {/* Header */}
                <div className="bg-slate-900/50 px-8 py-6 border-b border-slate-700 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-lg shadow-lg shadow-cyan-500/20">
                            <User className="text-white" size={28} />
                        </div>
                        <div>
                            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1 tech-font">Maklumat Murid Disahkan</p>
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{student.nama}</h2>
                        </div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 px-3 py-1 rounded text-green-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Aktif
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-8 grid gap-6 md:grid-cols-2">
                    
                    {/* Kelas */}
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors group/card">
                        <div className="flex items-center gap-2 mb-3 text-slate-400 group-hover/card:text-blue-400 transition-colors">
                            <BookOpen size={18} />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] tech-font">Kelas</span>
                        </div>
                        <p className="text-xl font-bold text-white code-font">{student.kelas}</p>
                    </div>

                    {/* No MyKid */}
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors group/card">
                        <div className="flex items-center gap-2 mb-3 text-slate-400 group-hover/card:text-blue-400 transition-colors">
                            <Fingerprint size={18} />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] tech-font">No. MyKid</span>
                        </div>
                        <p className="text-xl font-bold text-white code-font tracking-widest">{student.noMyKid}</p>
                    </div>

                    {/* ID Delima */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-blue-500/30 md:col-span-2 relative group/id shadow-inner">
                        <div className="absolute top-0 right-0 p-4 opacity-50">
                            <Database size={80} className="text-slate-800" />
                        </div>
                        
                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-2 mb-3 text-cyan-400">
                                <User size={18} />
                                <span className="text-xs font-bold uppercase tracking-[0.2em] tech-font">ID Delima</span>
                            </div>
                            <button 
                                onClick={() => copyToClipboard(student.idDelima, 'id')}
                                className="text-slate-400 hover:text-cyan-400 transition-colors p-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-cyan-500"
                                title="Salin ID"
                            >
                                {copiedField === 'id' ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-white break-all code-font relative z-10">{student.idDelima}</p>
                    </div>

                    {/* Kata Laluan */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-purple-500/30 md:col-span-2 relative shadow-inner">
                        <div className="absolute top-0 right-0 p-4 opacity-50">
                            <Lock size={80} className="text-slate-800" />
                        </div>

                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-2 mb-3 text-purple-400">
                                <Key size={18} />
                                <span className="text-xs font-bold uppercase tracking-[0.2em] tech-font">Kata Laluan</span>
                            </div>
                            <button 
                                onClick={() => copyToClipboard(student.kataLaluan, 'pass')}
                                className="text-slate-400 hover:text-purple-400 transition-colors p-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500"
                                title="Salin Kata Laluan"
                            >
                                {copiedField === 'pass' ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="text-2xl md:text-3xl font-bold text-white code-font tracking-wide relative z-10">{student.kataLaluan}</p>
                        </div>
                    </div>
                </div>
                
                {/* Action Footer */}
                <div className="bg-slate-900/80 px-6 py-4 border-t border-slate-700 text-center backdrop-blur-sm">
                    <a 
                        href="https://d2.delima.edu.my/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-bold uppercase tracking-widest hover:underline decoration-cyan-500 underline-offset-4"
                    >
                        <span>Akses Portal DELIMA</span>
                        <span className="text-lg">→</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

const Footer = () => {
    return (
        <footer className="mt-auto py-8 text-center border-t border-slate-800 bg-slate-900 text-slate-500">
            <p className="font-semibold tracking-wide tech-font text-sm">
                &copy; 2026 Sekolah Kebangsaan Tanah Kebun
            </p>
            <p className="text-xs mt-2 text-slate-600 uppercase tracking-widest">UNIT ICT SEKOLAH</p>
        </footer>
    );
};

// --- 5. MAIN APP ---

const App = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [dataError, setDataError] = useState<string | null>(null);
    const [searchResult, setSearchResult] = useState<any | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchStudentData();
                setStudents(data);
                setIsDataLoading(false);
            } catch (err) {
                console.error(err);
                setDataError('Gagal menyambung ke pangkalan data digital. Sila cuba sebentar lagi.');
                setIsDataLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSearch = useCallback(async () => {
        if (!searchQuery) return;
        
        setIsSearching(true);
        setHasSearched(true);
        setSearchResult(null);
        setDataError(null);

        try {
            const freshData = await fetchStudentData();
            setStudents(freshData);

            const cleanQuery = searchQuery.replace(/[^0-9]/g, '');
            const found = freshData.find(s => s.noMyKid === cleanQuery);

            if (found) {
                setSearchResult(found);
            }
        } catch (err) {
            console.error("Gagal mendapatkan data terkini:", err);
            
            const cleanQuery = searchQuery.replace(/[^0-9]/g, '');
            const found = students.find(s => s.noMyKid === cleanQuery);
            
            if (found) {
                setSearchResult(found);
                setDataError('Amaran: Sambungan pelayan lambat. Memaparkan data cache.');
            } else {
                setDataError('Gagal mengemaskini data terkini. Sila periksa sambungan internet.');
            }
        } finally {
            setIsSearching(false);
        }
    }, [searchQuery, students]);

    return (
        <div className="min-h-screen flex flex-col bg-slate-900 bg-grid-pattern text-slate-200 font-sans">
            <Header />
            
            <main className="flex-grow pb-12">
                <div className="relative pt-10">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                    
                    <SearchInput 
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={handleSearch}
                        isLoading={isSearching || isDataLoading}
                    />
                </div>

                {/* System Messages */}
                <div className="max-w-3xl mx-auto px-4 mt-8">
                    {isDataLoading && !hasSearched && (
                        <div className="text-center py-4 text-cyan-400 animate-pulse flex flex-col items-center gap-2">
                            <div className="w-12 h-1 bg-cyan-500/50 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-cyan-400 animate-loading-bar"></div>
                            </div>
                            <span className="text-xs uppercase tracking-widest font-mono">Memuat turun data pelayan...</span>
                        </div>
                    )}

                    {dataError && (
                        <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3 backdrop-blur-sm animate-fade-in">
                            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                            <p className="font-mono text-sm">{dataError}</p>
                        </div>
                    )}
                </div>

                {/* Results */}
                {searchResult && !isSearching && (
                    <StudentCard student={searchResult} />
                )}

                {/* Not Found State */}
                {hasSearched && !searchResult && !isSearching && !dataError && (
                    <div className="max-w-md mx-auto mt-12 text-center px-4 animate-fade-in">
                        <div className="bg-slate-800 p-6 rounded-full inline-block mb-4 border border-slate-700 shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-red-500/10 rounded-full animate-pulse"></div>
                            <FileX2 size={40} className="text-slate-500 relative z-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 tech-font uppercase">Tiada Rekod Ditemui</h3>
                        <p className="text-slate-400 mb-6 text-sm">
                            No. MyKid <span className="font-mono text-cyan-400 px-1">{searchQuery}</span> tiada dalam pangkalan data sistem.
                        </p>
                        <div className="bg-amber-900/20 text-amber-200/80 text-xs p-4 rounded-lg text-left border border-amber-500/30 font-mono">
                            <p className="font-bold mb-2 uppercase text-amber-500">Protokol Bantuan:</p>
                            <ul className="list-disc list-inside space-y-1 opacity-80">
                                <li>Pastikan input MyKid adalah tepat (12 digit).</li>
                                <li>Jangan masukkan sengkang (-) atau aksara lain.</li>
                                <li>Hubungi admin sistem (Guru Kelas) jika ralat berterusan.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default App;
