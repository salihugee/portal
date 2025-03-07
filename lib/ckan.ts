import axios from 'axios';

const CKAN_BASE_URL = process.env.NEXT_PUBLIC_CKAN_BASE_URL || 'https://your-ckan-public-domain.com/api/3/action';

export interface CKANOrganization {
    id: string;
    name: string;
    title: string;
    description: string;
    image_url?: string;
    package_count: number;
}

export interface CKANGroup {
    id: string;
    name: string;
    title: string;
    description: string;
    image_url?: string;
    package_count: number;
    packages?: Array<{
        id: string;
        name: string;
        title: string;
        notes?: string;
        metadata_created: string;
    }>;
    related_groups?: Array<{
        id: string;
        name: string;
        title: string;
        description: string;
    }>;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pages: number;
}

export const fetchCKANOrganizations = async (
    page = 1,
    limit = 12
): Promise<PaginatedResponse<CKANOrganization>> => {
    try {
        const response = await axios.get(`${CKAN_BASE_URL}/organization_list`, {
            params: {
                all_fields: true,
                include_extras: true,
                limit,
                offset: (page - 1) * limit
            }
        });

        const organizations = response.data.result;

        return {
            items: organizations,
            total: organizations.length,
            page,
            pages: Math.ceil(organizations.length / limit)
        };
    } catch (error) {
        console.error('Failed to fetch organizations:', error);
        return { items: [], total: 0, page: 1, pages: 0 };
    }
};

export const fetchCKANGroups = async (
    page = 1,
    limit = 12
): Promise<PaginatedResponse<CKANGroup>> => {
    try {
        const response = await axios.get(`${CKAN_BASE_URL}/group_list`, {
            params: {
                all_fields: true,
                include_extras: true,
                limit,
                offset: (page - 1) * limit
            }
        });

        const groups = response.data.result;

        return {
            items: groups,
            total: groups.length,
            page,
            pages: Math.ceil(groups.length / limit)
        };
    } catch (error) {
        console.error('Failed to fetch groups:', error);
        return { items: [], total: 0, page: 1, pages: 0 };
    }
};

export const fetchOrganizationDetails = async (
    organizationName: string
): Promise<CKANOrganization | null> => {
    try {
        const response = await axios.get(`${CKAN_BASE_URL}/organization_show`, {
            params: {
                id: organizationName,
                include_datasets: true
            }
        });

        return response.data.result;
    } catch (error) {
        console.error(`Failed to fetch organization ${organizationName}:`, error);
        return null;
    }
};

export const fetchGroupDetails = async (
    groupName: string
): Promise<CKANGroup | null> => {
    try {
        const response = await axios.get(`${CKAN_BASE_URL}/group_show`, {
            params: {
                id: groupName,
                include_datasets: true
            }
        });

        return response.data.result;
    } catch (error) {
        console.error(`Failed to fetch group ${groupName}:`, error);
        return null;
    }
};
