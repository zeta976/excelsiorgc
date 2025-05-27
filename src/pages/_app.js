import "@/styles/globals.css";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';
import Head from 'next/head';

function getSections(pageProps) {
  // Try to get sections from props, fallback to empty array
  return pageProps.sections || [];
}

export default function App({ Component, pageProps }) {
  const sections = getSections(pageProps);
  return (
    <>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7324780673910457"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <Navbar sections={sections} />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

