import { useRouter } from 'next/router';

import styles from '~/styles/homepage.module.css';

import Button from '~/components/Button';

const Home = () => {
  const router = useRouter();

  const onGoToBasicAuth = () => {
    router.push('/basic/auth');
  };

  const onGoToBusinessAuth = () => {
    router.push('/business/auth');
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="border border-[#EAEAEA] rounded-lg shadow-lg w-full max-w-[500px] p-4">
          <div className="text-center">
            <h1 className={styles['homepage-title']}>
              Instagram
            </h1>
            <h2 className="text-sm mt-2">
              Generate Token
            </h2>
          </div>

          <div className="flex space-x-4 mt-5">
            <div className="flex-1">
              <Button className="shadow-lg bg-white hover:bg-white focus:outline-[#EAEAEA] focus:ring-1 focus:ring-offset-2 focus:ring-indigo-500 w-full" onClick={onGoToBasicAuth}>
                <div>
                  <p className="text-lg text-black mb-1">
                    Basic API
                  </p>
                  <p className="text-xs text-black">
                    Get access token for<br />Instagram Basic Display API
                  </p>
                </div>
              </Button>
            </div>
            <div className="flex-1">
              <Button className="shadow-lg bg-white hover:bg-white focus:outline-[#EAEAEA] focus:ring-1 focus:ring-offset-2 focus:ring-indigo-500 w-full" onClick={onGoToBusinessAuth}>
                <div>
                  <p className="text-lg text-black mb-1">
                    Business API
                  </p>
                  <p className="text-xs text-black">
                    Get access token for<br />Instagram Graph API
                  </p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
