interface StatCardProps {
    title: string;
    value: number;
    icon: string;
    trend?: number; // Optional trend percentage
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
            <div>
                <h3 className="text-gray-500 text-sm">{title}</h3>
                <p className="text-2xl font-bold">{value}</p>
                {trend !== undefined && (
                    <div className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend > 0 ? '▲' : '▼'} {trend.toFixed(1)}%
                    </div>
                )}
            </div>
            <div className="text-3xl">{icon}</div>
        </div>
    );
}