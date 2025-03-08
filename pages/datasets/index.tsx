import React, { useState, useEffect, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import debounce from 'lodash/debounce';
import {
    fetchDatasets,
    searchDatasets,
    fetchCKANOrganizations,
    CKANDataset,
    CKANOrganization
} from '../../lib/ckan';

// Advanced Filtering Interface
interface FilterOptions {
    organization?: string;
    groups?: string[];
    tags?: string[];
    sortBy?: 'created' | 'modified' | 'name';
    sortOrder?: 'asc' | 'desc';
}

interface DatasetsPageProps {
    initialDatasets: {
        count: number;
        results: CKANDataset[];
    };
    initialOrganizations: CKANOrganization[];
    initialPage: number;
    initialFilters?: FilterOptions;
}

export default function DatasetsPage({
    initialDatasets,
    initialOrganizations,
    initialPage,
    initialFilters = {}
}: DatasetsPageProps) {
    const router = useRouter();
    const [datasets, setDatasets] = useState(initialDatasets.results);
    const [organizations, setOrganizations] = useState(initialOrganizations);
    const [totalCount, setTotalCount] = useState(initialDatasets.count);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterOptions>(initialFilters);
    const [error, setError] = useState<string | null>(null);

    // Debounced Search Function
    const debouncedFetch = useCallback(
        debounce(async (page: number, query?: string, filterOptions?: FilterOptions) => {
            setLoading(true);
            setError(null);
            try {
                const params = {
                    start: (page - 1) * 10,
                    rows: 10,
                    ...(filterOptions?.organization ? { fq: `organization:${filterOptions.organization}` } : {}),
                };

                let result;
                if (query) {
                    result = await searchDatasets(query, params);
                } else {
                    result = await fetchDatasets(params);
                }

                setDatasets(result.results);
                setTotalCount(result.count);
                setCurrentPage(page);

                // Update URL with filters and search
                router.push({
                    pathname: '/datasets',
                    query: {
                        page,
                        ...(query ? { q: query } : {}),
                        ...(filterOptions?.organization ? { org: filterOptions.organization } : {}),
                    }
                }, undefined, { shallow: true });
            } catch (err) {
                console.error('Failed to fetch datasets:', err);
                setError('Failed to load datasets. Please try again.');
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    // Fetch Organizations
    useEffect(() => {
        const loadOrganizations = async () => {
            try {
                if (organizations.length === 0) {
                    const orgResults = await fetchCKANOrganizations();
                    setOrganizations(orgResults.items);
                }
            } catch (error) {
                console.error('Failed to fetch organizations:', error);
            }
        };

        loadOrganizations();
    }, []);

    // Pagination Component
    const Pagination = () => {
        const datasetsPerPage = 10;
        const totalPages = Math.ceil(totalCount / datasetsPerPage);

        return totalPages > 1 ? (
            <div className="flex justify-center space-x-2 mt-6">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => debouncedFetch(index + 1, searchQuery, filters)}
                        className={`
              px-4 py-2 rounded
              ${currentPage === index + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'}
            `}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        ) : null;
    };

    // Filters Sidebar
    const FilterSidebar = () => (
        <div className="w-64 bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>

            {/* Organization Filter */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                </label>
                <select
                    value={filters.organization || ''}
                    onChange={(e) => {
                        const newFilters = {
                            ...filters,
                            organization: e.target.value
                        };
                        setFilters(newFilters);
                        debouncedFetch(1, searchQuery, newFilters);
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                >
                    <option value="">All Organizations</option>
                    {organizations.map((org) => (
                        <option key={org.id} value={org.name}>
                            {org.title || org.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-6 flex">
            {/* Filters Sidebar */}
            <FilterSidebar />

            {/* Main Content */}
            <div className="flex-grow ml-6">
                {/* Search Input */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            debouncedFetch(1, e.target.value, filters);
                        }}
                        placeholder="Search datasets..."
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                {/* Error Handling */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Datasets List */}
                <div className="space-y-4">
                    {datasets.map((dataset) => (
                        <Link
                            key={dataset.id}
                            href={`/datasets/${dataset.id}`}
                            className="block"
                        >
                            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
                                <h2 className="text-xl font-semibold mb-2">
                                    {dataset.title || dataset.name}
                                </h2>
                                <p className="text-gray-600 mb-2">
                                    {dataset.notes?.substring(0, 200)}
                                    {(dataset.notes?.length || 0) > 200 ? '...' : ''}
                                </p>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>
                                        {dataset.organization?.title || 'No Organization'}
                                    </span>
                                    <span>
                                        Created: {new Date(dataset.metadata_created).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* No Results */}
                {datasets.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                        No datasets found
                    </div>
                )}

                {/* Pagination */}
                <Pagination />
            </div>
        </div>
    );
}

// Server-side Props Fetching
export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const page = Number(context.query.page) || 1;
        const searchQuery = context.query.q as string | undefined;
        const organization = context.query.org as string | undefined;

        // Fetch datasets and organizations concurrently
        const [datasetsResult, organizationsResult] = await Promise.all([
            searchQuery
                ? searchDatasets(searchQuery, {
                    start: (page - 1) * 10,
                    rows: 10,
                    ...(organization ? { fq: `organization:${organization}` } : {})
                })
                : fetchDatasets({
                    start: (page - 1) * 10,
                    rows: 10,
                    ...(organization ? { fq: `organization:${organization}` } : {})
                }),
            fetchCKANOrganizations()
        ]);

        return {
            props: {
                initialDatasets: datasetsResult,
                initialOrganizations: organizationsResult.items,
                initialPage: page,
                initialFilters: {
                    ...(organization ? { organization } : {})
                }
            }
        };
    } catch (error) {
        console.error('Failed to fetch initial data:', error);

        return {
            props: {
                initialDatasets: { count: 0, results: [] },
                initialOrganizations: [],
                initialPage: 1,
                initialFilters: {}
            }
        };
    }
};