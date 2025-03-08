import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { fetchCKANDatasetDetails } from '../../lib/ckan';

interface DatasetDetailsProps {
    initialDataset: any;
}

export default function DatasetDetailsPage({ initialDataset }: DatasetDetailsProps) {
    const router = useRouter();
    const { id } = router.query;
    const [dataset, setDataset] = useState(initialDataset);
    const [activeTab, setActiveTab] = useState('overview');
    const [resources, setResources] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);

    useEffect(() => {
        async function fetchFullDatasetDetails() {
            try {
                const fullDetails = await fetchCKANDatasetDetails(id as string);
                setDataset(fullDetails);
                setResources(fullDetails.resources || []);
            } catch (error) {
                console.error('Failed to fetch dataset details', error);
            }
        }

        if (id && (!dataset || !dataset.resources)) {
            fetchFullDatasetDetails();
        }
    }, [id]);

    const renderOverview = () => (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{dataset.title}</h2>
            <p className="text-gray-600 mb-4">{dataset.notes}</p>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold">Metadata</h3>
                    <ul className="space-y-2">
                        <li>
                            <strong>Publisher:</strong> {dataset.organization?.title}
                        </li>
                        <li>
                            <strong>Created:</strong> {new Date(dataset.metadata_created).toLocaleDateString()}
                        </li>
                        <li>
                            <strong>Updated:</strong> {new Date(dataset.metadata_modified).toLocaleDateString()}
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold">Additional Information</h3>
                    {dataset.extras?.map((extra) => (
                        <div key={extra.key}>
                            <strong>{extra.key}:</strong> {extra.value}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderResources = () => (
        <div className="grid md:grid-cols-3 gap-4">
            {/* Resource List */}
            <div className="col-span-1 bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold mb-4">Available Resources</h3>
                {resources.map((resource) => (
                    <div
                        key={resource.id}
                        onClick={() => setSelectedResource(resource)}
                        className={`
              cursor-pointer 
              p-3 
              mb-2 
              rounded 
              ${selectedResource?.id === resource.id
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-200'
                            }
            `}
                    >
                        {resource.name || resource.description || 'Unnamed Resource'}
                        <span className="text-xs block">
                            {resource.format}
                        </span>
                    </div>
                ))}
            </div>

            {/* Resource Details */}
            <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
                {selectedResource ? (
                    <div>
                        <h3 className="text-xl font-bold mb-4">{selectedResource.name}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <strong>Format:</strong> {selectedResource.format}
                                <br />
                                <strong>Size:</strong> {formatFileSize(selectedResource.size)}
                                <br />
                                <strong>Last Modified:</strong> {new Date(selectedResource.last_modified).toLocaleDateString()}
                            </div>
                            <div>
                                {selectedResource.url && (
                                    <a
                                        href={selectedResource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Download Resource
                                    </a>
                                )}
                            </div>
                        </div>
                        {/* Preview or Additional Details */}
                        {renderResourcePreview(selectedResource)}
                    </div>
                ) : (
                    <p className="text-gray-500">Select a resource to view details</p>
                )}
            </div>
        </div>
    );

    const renderResourcePreview = (resource) => {
        // Implement resource preview logic based on format
        switch (resource.format.toLowerCase()) {
            case 'csv':
                return <CSVPreview url={resource.url} />;
            case 'json':
                return <JSONPreview url={resource.url} />;
            // Add more preview types
            default:
                return null;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="container mx-auto p-6">
            {/* Tabs */}
            <div className="flex mb-6">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`
            px-4 py-2 
            ${activeTab === 'overview'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'}
          `}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('resources')}
                    className={`
            px-4 py-2 
            ${activeTab === 'resources'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'}
          `}
                >
                    Resources
                </button>
            </div>

            {/* Content */}
            {activeTab === 'overview' ? renderOverview() : renderResources()}
        </div>
    );
}

// Server-side fetch initial dataset details
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params;

    try {
        const initialDataset = await fetchCKANDatasetDetails(id as string);
        return {
            props: {
                initialDataset
            }
        };
    } catch (error) {
        return {
            notFound: true
        };
    }
};