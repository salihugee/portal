import { useState, useEffect } from 'react';
import { CKANOrganization } from '../../lib/ckan';

export default function OrganizationPieChart({ organizations }: { organizations: CKANOrganization[] }) {
    const [chartData, setChartData] = useState<{ name: string; value: number; color: string }[]>([]);

    useEffect(() => {
        // Generate color palette
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#C9CBCF', '#36A2EB', '#FFCE56'
        ];

        // Sort organizations by package count
        const sortedOrgs = organizations
            .sort((a, b) => (b.package_count || 0) - (a.package_count || 0))
            .slice(0, 10); // Top 10 organizations

        const data = sortedOrgs.map((org, index) => ({
            name: org.title || org.name,
            value: org.package_count || 0,
            color: colors[index % colors.length]
        }));

        setChartData(data);
    }, [organizations]);

    const totalDatasets = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="flex">
            {/* Pie Chart Visualization */}
            <div className="w-1/2 relative" style={{ height: '250px' }}>
                <svg viewBox="0 0 32 32" className="w-full h-full">
                    {chartData.reduce((acc, item, index) => {
                        const percentage = item.value / totalDatasets;
                        const startAngle = acc.endAngle;
                        const endAngle = startAngle + percentage * 360;

                        const x1 = 16 + 16 * Math.cos(startAngle * Math.PI / 180);
                        const y1 = 16 + 16 * Math.sin(startAngle * Math.PI / 180);
                        const x2 = 16 + 16 * Math.cos(endAngle * Math.PI / 180);
                        const y2 = 16 + 16 * Math.sin(endAngle * Math.PI / 180);

                        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

                        const pathData = `
              M 16 16
              L ${x1} ${y1}
              A 16 16 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z
            `;

                        acc.paths.push(
                            <path
                                key={index}
                                d={pathData}
                                fill={item.color}
                            />
                        );

                        acc.endAngle = endAngle;
                        return acc;
                    }, { paths: [], endAngle: -90 }).paths}
                </svg>
            </div>

            {/* Legend */}
            <div className="w-1/2 pl-4 overflow-auto max-h-64">
                {chartData.map((item, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <div
                            className="w-4 h-4 mr-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                        ></div>
                        <div className="flex-grow">{item.name}</div>
                        <div>{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}