import Head from 'next/head';

import '../styles/globals.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Instagram Auth Token Generator</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
        <link href="https://fonts.googleapis.com/css2?family=Oleo+Script&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Rubik&display=swap" rel="stylesheet"></link>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
