import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
// import '../../styles/datasets.css';

const DatasetDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [dataset, setDataset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchDataset = async () => {
                try {
                    const response = await axios.get(`/api/dataset/${id}`);
                    setDataset(response.data.result);
                } catch (error) {
                    console.error('Error fetching dataset details:', error);
                    setError('Error fetching dataset details');
                } finally {
                    setLoading(false);
                }
            };

            fetchDataset();
        }
    }, [id]);

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!dataset) {
        return <p className="text-center">No dataset found.</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{dataset.title}</h1>
            <p>{dataset.notes}</p>
            {/* Add more dataset details as needed */}
        </div>
    );
};

export default DatasetDetails;