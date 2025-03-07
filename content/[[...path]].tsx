import { GetStaticPaths, GetStaticProps } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import parse from '../lib/markdown';
import DataRichDocument from '../components/DataRichDocument';
import clientPromise from '../lib/mddb';

interface ContentPageProps {
  mdxSource: any;
  frontMatter: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const contentDir = path.join(process.cwd(), '/content/');
  
  try {
    const contentFiles = await fs.readdir(contentDir, 'utf8');
    
    const paths = contentFiles
      .filter(file => 
        file !== 'index.md' && 
        !file.startsWith('.') && 
        (file.endsWith('.md') || file.endsWith('.mdx'))
      )
      .map((file: string) => {
        const slug = path.basename(file, path.extname(file));
        return { params: { path: [slug] } };
      });

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error reading content directory:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps = async (context) => {
  // Prevent this route from handling the root
  if (!context.params || !context.params.path) {
    return { 
      notFound: true 
    };
  }

  try {
    // Construct file path
    const pathSegments = context.params.path as string[];
    const fileName = `${pathSegments}.md`;
    const filePath = path.join(process.cwd(), 'content', fileName);

    // Read file content
    const fileContent = await fs.readFile(filePath, 'utf8');

    // Prepare datasets
    const mddbFileExists = require('fs').existsSync('markdown.db');
    let datasets = [];

    if (mddbFileExists) {
      const mddb = await clientPromise;
      const datasetsFiles = await mddb.getFiles({
        extensions: ['md', 'mdx'],
      });

      datasets = datasetsFiles
        .filter((dataset) => dataset.url_path !== '/')
        .map((dataset) => ({
          _id: dataset._id,
          url_path: dataset.url_path,
          metadata: dataset.metadata,
        }));
    }

    // Parse markdown
    const { mdxSource, frontMatter } = await parse(fileContent, '.md', { datasets });

    return {
      props: {
        mdxSource,
        frontMatter: JSON.stringify(frontMatter),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error processing content page:', error);
    return {
      notFound: true,
    };
  }
};

export default function ContentPage({ mdxSource, frontMatter }: ContentPageProps) {
  const parsedFrontMatter = JSON.parse(frontMatter);

  return (
    <div className="prose dark:prose-invert mx-auto py-8">
      <DataRichDocument source={mdxSource} />
    </div>
  );
}