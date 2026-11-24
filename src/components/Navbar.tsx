import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Search, SunMedium } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchModal from './SearchModal';
import NotificationsMenu from './NotificationsMenu';
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { user, logout, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  // Derive scope: if we're on a profile page /u/:username, scope search to that user
  const profileMatch = location.pathname.match(/^\/u\/([^/]+)/);
  const scopeUsername = profileMatch ? profileMatch[1] : undefined;

  const initial = user?.username?.[0]?.toUpperCase() || user?.firstName?.[0]?.toUpperCase() || '?';

  const toggleSearch = useCallback(() => setSearchOpen(prev => !prev), []);

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleSearch]);

  return (
    <>
      <nav
        className={`navbar w-full flex items-center ${searchOpen ? 'navbar-search-open' : ''}`}
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(18px)',
          height: '48px',
          padding: '0 40px',
        }}
      >
        <div className="navbar-brand flex items-center">
          <button
            type="button"
            aria-label="Go to feed"
            title="Go to feed"
            onClick={() => navigate('/feed')}
            className="navbar-logo cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="28" cy="10" r="5" fill="var(--color-yellow)" />
              <circle cx="42" cy="18" r="5" fill="var(--color-orange)" />
              <circle cx="44" cy="34" r="5" fill="var(--accent)" />
              <circle cx="34" cy="46" r="5" fill="var(--color-blue)" />
              <circle cx="18" cy="44" r="5" fill="var(--color-purple)" />
              <circle cx="12" cy="28" r="5" fill="var(--color-pink)" />
              <circle cx="18" cy="16" r="5" fill="var(--color-aqua)" />
              <circle cx="30" cy="28" r="3.5" fill="var(--accent)" />
            </svg>
          </button>
          <span className="navbar-wordmark">scholic</span>
        </div>

        <div className="navbar-search-slot flex items-center justify-center">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
            aria-expanded={searchOpen}
            title="Search (⌘K / Ctrl+K)"
            className={`navbar-search flex items-center cursor-pointer transition-colors ${searchOpen ? 'navbar-search-expanded' : ''}`}
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '4px 8px',
              color: 'var(--text-dim)',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-soft)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)';
            }}
          >
            <Search style={{ width: 12, height: 12 }} />
            <span className="navbar-search-label">Search</span>
          </button>
        </div>

        <div className="navbar-actions flex items-center gap-4">
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="navbar-theme theme-icon-button flex items-center justify-center rounded-full cursor-pointer"
            style={{ width: '30px', height: '30px' }}
          >
            {theme === 'dark' ? <SunMedium style={{ width: 15, height: 15 }} /> : <Moon style={{ width: 15, height: 15 }} />}
          </button>
          {user && (
            <>
              <div className="navbar-notifications"><NotificationsMenu /></div>
              <button
                onClick={logout}
                aria-label="Sign out"
                className="navbar-signout text-xs transition-colors cursor-pointer"
                style={{ color: 'var(--text-dim)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-dim)';
                }}
              >
                Sign out
              </button>
              <button
                onClick={() => navigate(`/u/${user.username}`)}
                aria-label={`Open ${user.username}'s profile`}
                title={`Open ${user.username}'s profile`}
                className="flex items-center justify-center rounded-full overflow-hidden cursor-pointer transition-opacity hover:opacity-80"
                style={{
                  width: '28px',
                  height: '28px',
                  background: user.profilePicture ? 'transparent' : 'var(--avatar-gradient)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-inverse)',
                  border: location.pathname === `/u/${user.username}` ? '2px solid var(--accent)' : '2px solid transparent',
                }}
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  initial
                )}
              </button>
            </>
          )}
          {!user && (
            <button
              onClick={login}
              className="navbar-auth transition-colors cursor-pointer"
              style={{
                padding: '8px 16px',
                minHeight: '34px',
                borderRadius: '999px',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg-elevated)',
                color: 'var(--text)',
                fontSize: '12px',
                fontWeight: 650,
                lineHeight: 1,
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-hover)';
                e.currentTarget.style.borderColor = 'var(--accent-border)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-elevated)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.color = 'var(--text)';
              }}
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        currentUserId={user?.id}
        scopeUsername={scopeUsername}
      />
    </>
  );
};

export default Navbar;
