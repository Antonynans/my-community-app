import '../styles/global.css';

import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';

import { theme } from '@/chakra/theme';
import Layout from '@/components/Layout';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <RecoilRoot>
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      s
    </ChakraProvider>
  </RecoilRoot>
);

export default MyApp;
