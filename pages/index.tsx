import Head from 'next/head';
import React from 'react';
import { useTranslation } from 'react-i18next';
import  UserProfileForm  from "src/components/UserProfileForm/UserProfileForm";


export default function Home() {
  const { t } = useTranslation();

  const onClick = () => {
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('clicked');
    }, 2000);
  };

  return (
    <div>
      <Head>
        <title>Frontend SSR template</title>
        <meta
          name="description"
          content="Frontend SSR template is used for bootstrapping a project."
        />
      </Head>
      <UserProfileForm/>
    </div>
  );
}
