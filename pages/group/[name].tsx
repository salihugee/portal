import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    fetchGroupDetails,
    CKANGroup
} from '../../lib/ckan';

interface GroupDetailsProps {
    group: CKANGroup | null;
}

export default function GroupDetailsPage({
    group
}: GroupDetailsProps) {
    if (!group) {
        return <div className="text-center py-8">Group not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Group Header */}
                <div className="text-center mb-8">
                    {group.image_url && (
                        <div className="mb-6 flex justify-center">
                            <Image
                                src={group.image_url}
                                alt={group.title}
                                width={200}
                                height={200}
                                className="rounded-full object-cover"
                            />
                        </div>
                    )}

                    <h1 className="text-3xl font-bold mb-4">
                        {group.title}
                    </h1>

                    <p className="text-gray-600 mb-6">
                        {group.description}
                    </p>

                    <div className="flex justify-center space-x-4">
                        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                            {group.package_count} Datasets
                        </span>
                    </div>
                </div>

                {/* Datasets Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Group Datasets</h2>
                    {group.packages && group.packages.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {group.packages.map((dataset) => (
                                <Link
                                    key={dataset.id}
                                    href={`/dataset/${dataset.name}`}
                                    className="block"
                                >
                                    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                        <h3 className="text-lg font-medium mb-2">{dataset.title}</h3>
                                        <p className="text-gray-600 line-clamp-3">{dataset.notes}</p>
                                        <div className="mt-2 flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                {dataset.metadata_created && new Date(dataset.metadata_created).toLocaleDateString()}
                                            </span>
                                            <span className="text-sm text-green-600">
                                                View Details
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No datasets available in this group</p>
                    )}
                </section>

                {/* Related Groups */}
                {group.related_groups && group.related_groups.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-2xl font-semibold mb-6">Related Groups</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {group.related_groups.map((relatedGroup) => (
                                <Link
                                    key={relatedGroup.id}
                                    href={`/group/${relatedGroup.name}`}
                                    className="block"
                                >
                                    <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
                                        <h3 className="text-lg font-medium mb-2">{relatedGroup.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            {relatedGroup.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { name } = context.params || {};

    if (!name || typeof name !== 'string') {
        return { notFound: true };
    }

    const group = await fetchGroupDetails(name);

    if (!group) {
        return { notFound: true };
    }

    return {
        props: {
            group
        }
    };
};