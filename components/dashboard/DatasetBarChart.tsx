import { useState, useEffect } from 'react';
import { CKANDataset } from '../../lib/ckan';

export default function DatasetBarChart({ datasets }: { datasets: CKANDataset[] }) {
    const [chartData, setChartData] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        // Group datasets by organization
        const organizationCounts = datasets.reduce((acc, dataset) => {
            if (dataset.organization) {
                const orgName = dataset.organization.title || dataset.organization.name;
                acc[orgName] = (acc[orgName] || 0) + 1;
            }
            return acc;
        }, {} as { [key: string]: number });

        setChartData(organizationCounts);
    }, [datasets]);

    return (
        <div className="space-y-2">
            {Object.entries(chartData)
                .sort((a, b) => b - a)
                .slice(0, 10) // Top 10 organizations
                .map(([org, count]) => (
                    <div key={org} className="flex items-center">
                        <div className="w-1/3 text-sm">{org}</div>
                        <div className="flex-grow bg-blue-200 rounded-full h-4 mr-2">
                            <div
                                className="bg-blue-500 rounded-full h-4"
                                style={{ width: `${(count / datasets.length) * 100}%` }}
                            ></div>
                        </div>
                        <div className="text-sm">{count}</div>
                    </div>
                ))}
        </div>
    );
}