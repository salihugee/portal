import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

// Define a type for the CKAN dataset
interface CKANDataset {
    id: string;
    name: string;
    title: string;
    notes?: string;
    metadata_created: string;
    metadata_modified: string;
    organization: {
        name: string;
        title: string;
    };
    resources: Array<{
        id: string;
        name: string;
        url: string;
        format: string;
        description?: string;
    }>;
    tags: Array<{
        name: string;
        display_name: string;
    }>;
}

interface SuccessResponse {
    help: string;
    success: true;
    result: CKANDataset;
}

interface ErrorResponse {
    error: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
    // Validate request method
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Extract dataset ID from query
    const { id } = req.query;

    // Validate dataset ID
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing dataset ID' });
    }

    try {
        // Configurable CKAN URL with fallback
        const CKAN_URL = process.env.CKAN_API_URL || 'http://kdbs-sas.mooo.com/api/3/action/package_show';

        // Make API request with timeout and error handling
        const response = await axios.get<SuccessResponse>(CKAN_URL, {
            params: { id },
            timeout: 10000, // 10 seconds timeout
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'YourApplicationName/1.0'
            }
        });

        // Validate successful response
        if (!response.data.success) {
            return res.status(404).json({ error: 'Dataset not found' });
        }

        // Return dataset details
        res.status(200).json(response.data);

    } catch (error) {
        // Detailed error handling
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;

            if (axiosError.response) {
                // The request was made and the server responded with a status code
                console.error('Data:', axiosError.response.data);
                console.error('Status:', axiosError.response.status);

                return res.status(axiosError.response.status).json({
                    error: 'Error fetching dataset details from CKAN'
                });
            } else if (axiosError.request) {
                // The request was made but no response was received
                console.error('No response received:', axiosError.request);
                return res.status(503).json({ error: 'Service unavailable' });
            } else {
                // Something happened in setting up the request
                console.error('Error setting up request:', axiosError.message);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

        // Fallback for non-axios errors
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Unexpected error occurred' });
    }
}