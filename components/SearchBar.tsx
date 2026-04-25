'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';

const SearchBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        if (val) {
            params.set('query', val);
        } else {
            params.delete('query');
        }
        router.replace(`/?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="library-search-wrapper">
            <IconSearch className="w-5 h-5 ml-4 text-[var(--text-muted)]" />
            <input
                type="text"
                placeholder="Search books by title or author"
                value={query}
                onChange={handleSearch}
                className="library-search-input"
            />
        </div>
    );
};

export default SearchBar;
