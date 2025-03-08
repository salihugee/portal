import React, { useState, useEffect } from 'react';
import {
    fetchDatasets,
    fetchCKANOrganizations,
    fetchCKANGroups,
    CKANDataset,
    CKANOrganization,
    CKANGroup
} from '../../lib/ckan';
import StatCard from '../../components/dashboard/StatCard';
import DatasetBarChart from '../../components/dashboard/DatasetBarChart';
import OrganizationPieChart from '../../components/dashboard/OrganizationPieChart';
import RecentDatasetsList from '../../components/dashboard/RecentDatasetsList';
import DateRangeSelector from '../../components/dashboard/DateRangeSelector';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import LoadingOverlay from '../../components/common/LoadingOverlay';

// Enhanced interface to include more metadata
interface DashboardStats {
    totalDatasets: number;
    totalOrganizations: number;
    totalGroups: number;
    newDatasetsLastMonth: number;
    datasetsLastUpdated?: string;
}

interface DashboardProps {
    initialDatasets: CKANDataset[];
    initialOrganizations: CKANOrganization[];
    initialGroups: CKANGroup[];
    initialStats: DashboardStats;
}

export default function Dashboard({
    initialDatasets,
    initialOrganizations,
    initialGroups,
    initialStats
}: DashboardProps) {
    // State management
    const [datasets, setDatasets] = useState(initialDatasets);
    const [organizations, setOrganizations] = useState(initialOrganizations);
    const [groups, setGroups] = useState(initialGroups);
    const [stats, setStats] = useState(initialStats);

    // Enhanced loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Date range state
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date()
    });

    // Comprehensive data refresh method
    const refreshDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch data with more comprehensive parameters
            const [datasetsResult, orgsResult, groupsResult] = await Promise.all([
                fetchDatasets({
                    rows: 100,
                    start: 0,
                    sort: 'metadata_modified desc'
                }),
                fetchCKANOrganizations(),
                fetchCKANGroups()
            ]);

            // Calculate enhanced statistics
            const newStats: DashboardStats = {
                totalDatasets: datasetsResult.count,
                totalOrganizations: orgsResult.items.length,
                totalGroups: groupsResult.items.length,
                newDatasetsLastMonth: datasetsResult.results.filter(
                    d => new Date(d.metadata_created) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length,
                datasetsLastUpdated: new Date().toISOString()
            };

            // Update state
            setDatasets(datasetsResult.results);
            setOrganizations(orgsResult.items);
            setGroups(groupsResult.items);
            setStats(newStats);
        } catch (err) {
            console.error('Dashboard refresh error:', err);
            setError('Failed to refresh dashboard. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter datasets based on date range
    const filteredDatasets = datasets.filter(dataset => {
        const createdDate = new Date(dataset.metadata_created);
        return (
            createdDate >= dateRange.startDate &&
            createdDate <= dateRange.endDate
        );
    });

    return (
        <ErrorBoundary>
            <div className="container mx-auto px-4 py-6 relative">
                {loading && <LoadingOverlay />}

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <DateRangeSelector
                            startDate={dateRange.startDate}
                            endDate={dateRange.endDate}
                            onDateRangeChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
                        />
                        <button
                            onClick={refreshDashboardData}
                            className="btn btn-primary flex items-center"
                            disabled={loading}
                        >
                            {loading ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Top Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Total Datasets"
                        value={stats.totalDatasets}
                        icon="📊"
                        trend={
                            filteredDatasets.length / stats.totalDatasets * 100
                        }
                    />
                    <StatCard
                        title="Organizations"
                        value={stats.totalOrganizations}
                        icon="🏢"
                    />
                    <StatCard
                        title="Groups"
                        value={stats.totalGroups}
                        icon="🔖"
                    />
                    <StatCard
                        title="New Datasets"
                        value={stats.newDatasetsLastMonth}
                        icon="🆕"
                    />
                </div>

                {/* Charts and Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Datasets by Organization</h2>
                        <DatasetBarChart datasets={filteredDatasets} />
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Organization Distribution</h2>
                        <OrganizationPieChart
                            organizations={organizations}
                            datasets={filteredDatasets}
                        />
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Recent Datasets</h2>
                        <RecentDatasetsList datasets={filteredDatasets} />
                    </div>
                </div>

                {/* Last Updated Timestamp */}
                <div className="text-sm text-gray-500 mt-4 text-right">
                    Last Updated: {stats.datasetsLastUpdated
                        ? new Date(stats.datasetsLastUpdated).toLocaleString()
                        : 'N/A'}
                </div>
            </div>
        </ErrorBoundary>
    );
}

// Enhanced Server-side data fetching
export async function getServerSideProps() {
    try {
        const [datasetsResult, orgsResult, groupsResult] = await Promise.all([
            fetchDatasets({
                rows: 100,
                start: 0,
                sort: 'metadata_modified desc'
            }),
            fetchCKANOrganizations(),
            fetchCKANGroups()
        ]);

        // Calculate initial statistics
        const initialStats: DashboardStats = {
            totalDatasets: datasetsResult.count,
            totalOrganizations: orgsResult.items.length,
            totalGroups: groupsResult.items.length,
            newDatasetsLastMonth: datasetsResult.results.filter(
                d => new Date(d.metadata_created) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length,
            datasetsLastUpdated: new Date().toISOString()
        };

        return {
            props: {
                initialDatasets: datasetsResult.results,
                initialOrganizations: orgsResult.items,
                initialGroups: groupsResult.items,
                initialStats
            }
        };
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        return {
            props: {
                initialDatasets: [],
                initialOrganizations: [],
                initialGroups: [],
                initialStats: {
                    totalDatasets: 0,
                    totalOrganizations: 0,
                    totalGroups: 0,
                    newDatasetsLastMonth: 0
                }
            }
        };
    }
}