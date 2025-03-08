import React, { useState } from 'react';
import { formatDate, formatFileSize } from '../utils/formatters';

interface DatasetDetailsViewProps {
    dataset: any;
}

const DatasetDetailsView: React.FC<DatasetDetailsViewProps> = ({ dataset }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedResource, setSelectedResource] = useState(null);

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
                            <strong>Created:</strong> {formatDate(dataset.metadata_created)}
                        </li>
                        <li>
                            <strong>Updated:</strong> {formatDate(dataset.metadata_modified)}
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
            <div className="col-span-1 bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold mb-4">Available Resources</h3>
                {dataset.resources?.map((resource) => (
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
                                <strong>Last Modified:</strong> {formatDate(selectedResource.last_modified)}
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
                    </div>
                ) : (
                    <p className="text-gray-500">Select a resource to view details</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-6">
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

            {activeTab === 'overview' ? renderOverview() : renderResources()}
        </div>
    );
};

export default DatasetDetailsView;