import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    fetchOrganizationDetails,
    CKANOrganization
} from '../../lib/ckan';

interface OrganizationDetailsProps {
    organization: CKANOrganization | null;
}

export default function OrganizationDetailsPage({
    organization
}: OrganizationDetailsProps) {
    if (!organization) {
        return <div className="text-center py-8">Organization not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Organization Header */}
                <div className="text-center mb-8">
                    {organization.image_url && (
                        <div className="mb-6 flex justify-center">
                            <Image
                                src={organization.image_url}
                                alt={organization.title}
                                width={200}
                                height={200}
                                className="rounded-full object-cover"
                            />
                        </div>
                    )}

                    <h1 className="text-3xl font-bold mb-4">
                        {organization.title}
                    </h1>

                    <p className="text-gray-600 mb-6">
                        {organization.description}
                    </p>

                    <div className="flex justify-center space-x-4">
                        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                            {organization.package_count} Datasets
                        </span>
                    </div>
                </div>

                {/* Datasets Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Datasets</h2>
                    {organization.packages && organization.packages.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {organization.packages.map((dataset) => (
                                <Link
                                    key={dataset.id}
                                    href={`/dataset/${dataset.name}`}
                                    className="block"
                                >
                                    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                        <h3 className="text-lg font-medium mb-2">{dataset.title}</h3>
                                        <p className="text-gray-600 line-clamp-3">{dataset.notes}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No datasets available</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { name } = context.params || {};

    if (!name || typeof name !== 'string') {
        return { notFound: true };
    }

    const organization = await fetchOrganizationDetails(name);

    if (!organization) {
        return { notFound: true };
    }

    return {
        props: {
            organization
        }
    };
};