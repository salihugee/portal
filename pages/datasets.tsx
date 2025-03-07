import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { 
    FaDatabase, 
    FaTag, 
    FaCalendar, 
    FaSearch, 
    FaFilter 
} from 'react-icons/fa';

// TypeScript Interface for Dataset
interface Dataset {
    id: string;
    title: string;
    notes: string;
    metadata_created: string;
    organization: {
        name: string;
        title: string;
    };
    tags: Array<{name: string}>;
    num_tags: number;
    num_resources: number;
}

const Datasets = () => {
    // State Management
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Filtering and Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrganization, setSelectedOrganization] = useState('');
    const [organizations, setOrganizations] = useState<string[]>([]);

    // Fetch Datasets
    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const response = await axios.get('/api/datasets');
                const fetchedDatasets = response.data.result.results;
                
                setDatasets(fetchedDatasets);
                
                // Extract unique organizations
                const uniqueOrgs = [...new Set(
                    fetchedDatasets.map((dataset: Dataset) => dataset.organization?.title || 'Unknown')
                )];
                setOrganizations(uniqueOrgs);
            } catch (error) {
                console.error('Error fetching datasets:', error);
                setError('Error fetching datasets');
            } finally {
                setLoading(false);
            }
        };

        fetchDatasets();
    }, []);

    // Filtering Logic
    const filteredDatasets = datasets.filter(dataset => 
        dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedOrganization ? dataset.organization?.title === selectedOrganization : true)
    );

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse">
                    <FaDatabase className="mx-auto text-6xl text-blue-500" />
                    <p className="text-center mt-4 text-gray-600">Loading Datasets...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-red-600 mb-4">Oops!</h2>
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Datasets Catalog
                    </h1>
                    <p className="text-xl text-gray-600">
                        Explore and discover valuable datasets from various organizations
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-12 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <input 
                            type="text"
                            placeholder="Search datasets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Organization Filter */}
                    <div className="relative">
                        <select
                            value={selectedOrganization}
                            onChange={(e) => setSelectedOrganization(e.target.value)}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Organizations</option>
                            {organizations.map(org => (
                                <option key={org} value={org}>{org}</option>
                            ))}
                        </select>
                        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Datasets Grid */}
                {filteredDatasets.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow">
                        <p className="text-xl text-gray-600">
                            No datasets found matching your search criteria.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDatasets.map((dataset) => (
                            <div 
                                key={dataset.id} 
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6"
                            >
                                {/* Dataset Title */}
                                <h2 className="text-xl font-bold text-gray-800 mb-3 truncate">
                                    {dataset.title}
                                </h2>

                                {/* Dataset Description */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {dataset.notes || 'No description available'}
                                </p>

                                {/* Dataset Metadata */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaCalendar className="mr-2" />
                                        <span>
                                            Created: {new Date(dataset.metadata_created).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaTag className="mr-2" />
                                        <span>
                                            Tags: {dataset.num_tags}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaDatabase className="mr-2" />
                                        <span>
                                            Resources: {dataset.num_resources}
                                        </span>
                                    </div>
                                </div>

                                {/* Organization */}
                                {dataset.organization && (
                                    <div className="text-sm font-medium text-blue-600 mb-4">
                                        {dataset.organization.title}
                                    </div>
                                )}

                                {/* View Details Link */}
                                <Link 
                                    href={`/dataset/${dataset.id}`}
                                    className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    View Dataset Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Datasets;