import { useState } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    fetchCKANOrganizations,
    CKANOrganization,
    PaginatedResponse
} from '../../lib/ckan';

interface OrganizationsPageProps {
    initialOrganizations: PaginatedResponse<CKANOrganization>;
}

export default function OrganizationsPage({
    initialOrganizations
}: OrganizationsPageProps) {
    const [organizations, setOrganizations] = useState(initialOrganizations.items);
    const [pagination, setPagination] = useState({
        page: initialOrganizations.page,
        total: initialOrganizations.total,
        pages: initialOrganizations.pages
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const loadMore = async () => {
        setLoading(true);
        try {
            const nextPage = pagination.page + 1;
            const result = await fetchCKANOrganizations(nextPage);

            setOrganizations(prev => [...prev, ...result.items]);
            setPagination({
                page: result.page,
                total: result.total,
                pages: result.pages
            });
        } catch (error) {
            console.error('Failed to load more organizations', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrganizations = organizations.filter(org =>
        org.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Organizations
            </h1>

            {/* Search Input */}
            <div className="mb-6 max-w-md mx-auto">
                <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Organizations Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrganizations.map((org) => (
                    <Link
                        key={org.id}
                        href={`/organization/${org.name}`}
                        className="block"
                    >
                        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                            {org.image_url && (
                                <div className="mb-4 flex justify-center">
                                    <Image
                                        src={org.image_url}
                                        alt={org.title}
                                        width={100}
                                        height={100}
                                        className="rounded-full object-cover"
                                    />
                                </div>
                            )}
                            <h2 className="text-xl font-semibold mb-2 text-center">
                                {org.title}
                            </h2>
                            <p className="text-gray-600 text-center line-clamp-3">
                                {org.description}
                            </p>
                            <div className="mt-4 text-center">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                    {org.package_count} Datasets
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Load More Button */}
            {pagination.page < pagination.pages && (
                <div className="text-center mt-8">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}

            {/* No Results */}
            {filteredOrganizations.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No organizations found</p>
                </div>
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const initialOrganizations = await fetchCKANOrganizations();

    return {
        props: {
            initialOrganizations
        }
    };
};