import Link from 'next/link';
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { FaFolder, FaSearch } from 'react-icons/fa';
import {
    fetchCKANGroups,
    CKANGroup,
    PaginatedResponse
} from '../lib/ckan';

interface GroupsPageProps {
    initialGroups: PaginatedResponse<CKANGroup>;
}

export default function GroupsPage({
    initialGroups
}: GroupsPageProps) {
    const [groups, setGroups] = useState(initialGroups.items);
    const [pagination, setPagination] = useState({
        page: initialGroups.page,
        total: initialGroups.total,
        pages: initialGroups.pages
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const loadMore = async () => {
        setLoading(true);
        try {
            const nextPage = pagination.page + 1;
            const result = await fetchCKANGroups(nextPage);

            setGroups(prev => [...prev, ...result.items]);
            setPagination({
                page: result.page,
                total: result.total,
                pages: result.pages
            });
        } catch (error) {
            console.error('Failed to load more groups', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredGroups = groups.filter(group =>
        group.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        Data Groups
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Explore datasets categorized by thematic groups
                    </p>
                </div>

                {/* Search Section */}
                <div className="max-w-xl mx-auto mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Groups Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredGroups.map((group) => (
                        <Link
                            key={group.id}
                            href={`/group/${group.name}`}
                            className="group"
                        >
                            <div className={`
                bg-green-100 
                p-6 
                rounded-lg 
                shadow-md 
                hover:shadow-xl 
                transition-all 
                duration-300 
                transform 
                hover:-translate-y-2
              `}>
                                <div className={`
                  bg-green-100 
                  text-green-600 
                  w-16 
                  h-16 
                  rounded-full 
                  flex 
                  items-center 
                  justify-center 
                  mb-4 
                  group-hover:animate-pulse
                `}>
                                    <FaFolder className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold text-green-600 mb-2">
                                    {group.title}
                                </h2>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                    {group.description}
                                </p>
                                <div className="mt-4 flex items-center text-sm font-medium">
                                    <span className="text-green-600">
                                        {group.package_count} Datasets
                                    </span>
                                    <svg
                                        className="ml-2 w-4 h-4 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Load More Button */}
                {pagination.page < pagination.pages && (
                    <div className="text-center mt-12">
                        <button
                            onClick={loadMore}
                            disabled={loading}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Load More Groups'}
                        </button>
                    </div>
                )}

                {/* No Results */}
                {filteredGroups.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-500">No groups found</p>
                        <p className="text-gray-400 mt-2">Try adjusting your search term</p>
                    </div>
                )}

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                        Discover Meaningful Datasets
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Explore curated groups of datasets that provide insights across various domains
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            href="/datasets"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                        >
                            Browse Datasets
                        </Link>
                        <Link
                            href="/about"
                            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const initialGroups = await fetchCKANGroups();

    return {
        props: {
            initialGroups
        }
    };
};