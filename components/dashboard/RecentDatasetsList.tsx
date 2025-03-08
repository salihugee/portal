import Link from 'next/link';
import { CKANDataset } from '../../lib/ckan';

export default function RecentDatasetsList({ datasets }: { datasets: CKANDataset[] }) {
    // Sort datasets by creation date (most recent first)
    const sortedDatasets = [...datasets]
        .sort((a, b) =>
            new Date(b.metadata_created).getTime() - new Date(a.metadata_created).getTime()
        )
        .slice(0, 10); // Top 10 recent datasets

    return (
        <div className="space-y-4">
            {sortedDatasets.map((dataset) => (
                <Link
                    key={dataset.id}
                    href={`/datasets/${dataset.id}`}
                    className="block hover:bg-gray-50 p-3 rounded-lg transition-colors"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">{dataset.title}</h3>
                            <p className="text-sm text-gray-600">
                                {dataset.organization?.title || 'No Organization'}
                            </p>
                        </div>
                        <div className="text-sm text-gray-500">
                            {new Date(dataset.metadata_created).toLocaleDateString()}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}