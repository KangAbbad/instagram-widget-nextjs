import Head from 'next/head';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Instagram Auth Token Generator</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
