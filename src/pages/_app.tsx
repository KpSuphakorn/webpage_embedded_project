// src/pages/_app.tsx
import { AppProps } from 'next/app';
import './global.css'
import '@/pages/index'


function MyApp({ Component, pageProps } : AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
