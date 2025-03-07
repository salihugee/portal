import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const CKAN_URL = 'http://kdbs-sas.mooo.com/api/3/action/package_search';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await axios.get(CKAN_URL, {
            params: {
                rows: 10,
                start: 0
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching datasets' });
    }
}