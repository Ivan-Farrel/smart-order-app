import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar - Floating & Blur */}
            <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-lg border-b border-zinc-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between items-center">
                        <div className="flex items-center">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="bg-zinc-900 p-2 rounded-xl">
                                        <ApplicationLogo className="block h-6 w-auto fill-current text-white" />
                                    </div>
                                    <span className="font-black tracking-tighter text-xl italic text-zinc-900">ALINEA.</span>
                                </Link>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden space-x-4 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="text-[10px] font-black uppercase tracking-widest"
                                >
                                    Dashboard
                                </NavLink>

                                {/* LINK QR GENERATOR DESKTOP */}
                                <NavLink
                                    href={route('qr.index')}
                                    active={route().current('qr.index')}
                                    className="text-[10px] font-black uppercase tracking-widest"
                                >
                                    QR Generator
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-2xl border border-zinc-100 bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none"
                                        >
                                            {user.name}
                                            <svg className="-me-0.5 ms-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-2 bg-white rounded-2xl shadow-2xl ring-1 ring-black/5">
                                        <Dropdown.Link href={route('profile.edit')} className="text-[10px] font-bold uppercase tracking-wider">Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="text-[10px] font-bold uppercase tracking-wider text-red-500">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Hamburger untuk Mobile */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-xl p-3 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none"
                            >
                                <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-white border-b border-zinc-100'}>
                    <div className="space-y-1 pb-3 pt-2 px-4">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')} className="rounded-xl font-bold">
                            Dashboard
                        </ResponsiveNavLink>
                        
                        {/* LINK QR GENERATOR MOBILE */}
                        <ResponsiveNavLink href={route('qr.index')} active={route().current('qr.index')} className="rounded-xl font-bold">
                            QR Generator
                        </ResponsiveNavLink>
                    </div>
                    <div className="border-t border-zinc-100 pb-1 pt-4 px-4">
                        <div className="px-4 py-2 bg-zinc-50 rounded-2xl mb-2">
                            <div className="text-xs font-black text-zinc-900 uppercase tracking-tight">{user.name}</div>
                            <div className="text-[10px] font-medium text-zinc-400">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-red-500">Log Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white border-b border-zinc-100">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="relative">{children}</main>
        </div>
    );
}