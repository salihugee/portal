import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { fetchCKANDatasetDetails } from '../../lib/ckan'; // Adjust path as needed

interface DatasetDetailsProps {
    initialDataset?: any;
}

export default function DatasetDetailsPage({ initialDataset }: DatasetDetailsProps) {
    const router = useRouter();
    const { id } = router.query;
    const [dataset, setDataset] = useState(initialDataset);
    const [loading, setLoading] = useState(!initialDataset);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDatasetDetails() {
            // Ensure id exists and is a string
            if (!id || typeof id !== 'string') return;

            try {
                setLoading(true);
                const fullDetails = await fetchCKANDatasetDetails(id);
                setDataset(fullDetails);
            } catch (err) {
                setError('Failed to fetch dataset details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        // Only fetch if id is available and dataset is not already loaded
        if (id && (!dataset || Object.keys(dataset).length === 0)) {
            fetchDatasetDetails();
        }
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div>Loading...</div>
            </div>
        );
    }

    // Error state
    if (error || !dataset) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl text-red-500">Error Loading Dataset</h1>
                <p>{error || 'No dataset found'}</p>
                <button
                    onClick={() => router.push('/datasets')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Back to Datasets
                </button>
            </div>
        );
    }

    // Render dataset details
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold">{dataset.title}</h1>
            <p>{dataset.notes}</p>

            {/* Add more detailed rendering as needed */}
            <div>
                <h2>Resources</h2>
                {dataset.resources?.map((resource) => (
                    <div key={resource.id} className="mb-4">
                        <h3>{resource.name}</h3>
                        <p>Format: {resource.format}</p>
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            Download
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Server-side props fetching
export const getServerSideProps: GetServerSideProps = async (context) => {
    // Safely extract id with type checking
    const id = context.params?.id;

    // Early return if no id
    if (!id || Array.isArray(id)) {
        return {
            notFound: true
        };
    }

    try {
        // Fetch dataset details
        const initialDataset = await fetchCKANDatasetDetails(id);

        return {
            props: {
                initialDataset: initialDataset || null
            }
        };
    } catch (error) {
        console.error('Dataset fetch error:', error);

        return {
            notFound: true // This will render a 404 page
        };
    }
};