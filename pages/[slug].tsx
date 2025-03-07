import { GetStaticPaths, GetStaticProps } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import { MDXRemote } from 'next-mdx-remote';
import parse from '../lib/markdown';

export const getStaticPaths: GetStaticPaths = async () => {
    const contentDir = path.join(process.cwd(), 'content');

    try {
        const files = await fs.readdir(contentDir);

        const paths = files
            .filter(file =>
                file !== 'index.md' &&
                (file.endsWith('.md') || file.endsWith('.mdx'))
            )
            .map(file => ({
                params: {
                    slug: path.basename(file, path.extname(file))
                }
            }));

        return {
            paths,
            fallback: false
        };
    } catch (error) {
        console.error('Error reading content directory:', error);
        return {
            paths: [],
            fallback: false
        };
    }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    if (!params || !params.slug) {
        return { notFound: true };
    }

    try {
        const filePath = path.join(
            process.cwd(),
            'content',
            `${params.slug}.md`
        );

        const fileContent = await fs.readFile(filePath, 'utf8');

        const { mdxSource, frontMatter } = await parse(fileContent, '.md');

        return {
            props: {
                mdxSource,
                frontMatter
            }
        };
    } catch (error) {
        return { notFound: true };
    }
};

export default function ContentPage({ mdxSource, frontMatter }) {
    return (
        <div className="prose mx-auto">
            {frontMatter.title && <h1>{frontMatter.title}</h1>}
            <MDXRemote {...mdxSource} />
        </div>
    );
}