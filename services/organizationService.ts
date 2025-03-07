// services/organizationService.ts
import axios from 'axios';

interface OrganizationsResponse {
    items: Organization[];
    page: number;
    total: number;
    pages: number;
}

interface Organization {
    id: string;
    name: string;
    title: string;
    description: string;
    logo_url?: string;
    package_count: number;
}

export const fetchCKANOrganizations = async (page = 1, limit = 12): Promise<OrganizationsResponse> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_CKAN_API_URL}/organization`, {
            params: {
                page,
                limit
            }
        });

        return {
            items: response.data.result.results.map((org: any) => ({
                id: org.id,
                name: org.name,
                title: org.title,
                description: org.description || 'No description available',
                logo_url: org.image_url || undefined,
                package_count: org.package_count || 0
            })),
            page: response.data.result.page,
            total: response.data.result.total,
            pages: Math.ceil(response.data.result.total / limit)
        };
    } catch (error) {
        console.error('Failed to fetch organizations:', error);
        throw error;
    }
};