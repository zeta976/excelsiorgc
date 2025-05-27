import "@/styles/globals.css";

import Navbar from '../components/Navbar';
import '../styles/globals.css';

function getSections(pageProps) {
  // Try to get sections from props, fallback to empty array
  return pageProps.sections || [];
}

export default function App({ Component, pageProps }) {
  const sections = getSections(pageProps);
  return (
    <>
      <Navbar sections={sections} />
      <Component {...pageProps} />
    </>
  );
}

