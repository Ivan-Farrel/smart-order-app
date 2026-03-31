import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
            <Head title="Admin Login - Alinea" />

            {/* LEFT SIDE: Branding & Visual */}
            <div className="hidden md:flex md:w-1/2 bg-zinc-900 p-16 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <div className="bg-white inline-block p-3 rounded-2xl mb-6">
                        <svg className="w-8 h-8 text-zinc-900 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
                        </svg>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter italic uppercase leading-none">
                        ALINEA <br />
                        <span className="text-zinc-600 italic">SYSTEM.</span>
                    </h1>
                </div>

                <div className="relative z-10">
                    <p className="text-zinc-400 text-sm font-bold uppercase tracking-[0.3em] mb-4">Internal Access Only</p>
                    <p className="text-zinc-500 text-xs leading-relaxed max-w-sm font-medium">
                        Secure management portal for Alinea Smart Order. Authorized personnel only. 
                        Please contact the system administrator for account issues.
                    </p>
                </div>

                {/* Decorative BG Element */}
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-zinc-800 rounded-full opacity-20 blur-3xl"></div>
            </div>

            {/* RIGHT SIDE: Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="md:hidden mb-12">
                        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter italic uppercase">ALINEA.</h1>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase italic">WELCOME BACK.</h2>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Sign in to manage your coffee empire</p>
                    </div>

                    {status && <div className="mb-6 font-bold text-sm text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest">Admin Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full bg-white border-zinc-100 rounded-[1.5rem] py-4 px-6 mt-1.5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all shadow-sm"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-[10px] font-black uppercase mt-2 ml-2 tracking-wider">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full bg-white border-zinc-100 rounded-[1.5rem] py-4 px-6 mt-1.5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all shadow-sm"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="text-red-500 text-[10px] font-black uppercase mt-2 ml-2 tracking-wider">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded-lg border-zinc-200 text-zinc-900 shadow-sm focus:ring-zinc-900"
                                />
                                <span className="ms-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <button
                            disabled={processing}
                            className="w-full bg-zinc-900 text-white py-5 rounded-[1.5rem] mt-4 font-black uppercase tracking-widest text-[11px] active:scale-[0.98] transition-all shadow-2xl shadow-zinc-200 hover:shadow-zinc-300 disabled:opacity-70 flex items-center justify-center gap-3"
                        >
                            {processing ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : 'Access Dashboard'}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <Link href="/" className="text-[10px] font-black text-zinc-300 uppercase tracking-widest hover:text-zinc-500 transition-colors">
                            ← Back to Customer Menu
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}