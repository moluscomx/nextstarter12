/* eslint-disable @next/next/no-img-element */
import {
  getProviders,
  signIn,
  getCsrfToken,
  getSession,
} from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Seo from "@/components/common/Seo";

const SignInPage = ({ providers, csrfToken, errorMessage }) => {
  const [badBrowser, setBadBrowser] = useState(false);
  const [redirect, setRedirect] = useState("/");

  useEffect(() => {
    //CHECK browser...
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("instagram") > -1 || ua.indexOf("fb_iab") > -1) {
      setBadBrowser(true);
    } else {
      setBadBrowser(false);
    }

    //CHECK redirect
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");
    if (redirect) {
      setRedirect(redirect);
    }
  }, []);

  const handleGoogleSignin = async (callbackUrl = "/") => {
    if (badBrowser) {
      alert(
        "Por favor, abre la página en un navegador como chrome o safari. Instagram no te quiere u.u"
      );
      return;
    } else {
      signIn(providers.google.id, {
        callbackUrl,
      });
    }
  };

  return (
    <div>
      <Seo subtitle="Iniciar Sesión" />
      <div className="-mt-20 flex min-h-screen flex-col items-center justify-center py-2 px-8  text-center">
        <div className="mx-auto w-full lg:w-96 ">
          <div className="flex w-full justify-center">
            <Link href="/">
              <a className="topsearchbar wrapper flex items-center justify-center">
                <div className="logo">{/* logo her.... */}</div>
                <h1 className="text-4xl font-bold uppercase ">BisniBots</h1>
              </a>
            </Link>
          </div>
          <div>
            <h2 className="mt-6 text-center text-base  font-extrabold text-black">
              Para continuar, por favor inicia sesión.
            </h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              {providers.google && (
                <div className="w-full">
                  <div
                    className="inline-flex w-full cursor-pointer justify-center rounded-md border border-gray-300 bg-buttonbg py-4 px-4 text-base  font-medium  text-buttontxt shadow-sm md:max-w-md "
                    onClick={() => handleGoogleSignin(redirect)}
                  >
                    <span className="sr-only">Sign in with google</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 488 512"
                    >
                      <path
                        fillRule="evenodd"
                        d="M488 261.8C488 403.3 391.1 504 248 504C110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="mx-2">Iniciar sesión con Google</p>
                  </div>
                </div>
              )}
              {errorMessage && (
                <div className="mt-3 text-sm text-red-600">{errorMessage}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  //getting providers and csfr token
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  const session = await getSession({ req: context.req });

  const { error } = context.query;
  let errorMessage = "";

  //if user is logged in, redirect to home
  if (session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (error) {
    const errors = {
      Signin: "Intenta iniciar sesión con una cuenta diferente.",
      OAuthSignin: "Intenta iniciar sesión con una cuenta diferente",
      OAuthCallback: "Intenta iniciar sesión con una cuenta diferente",
      OAuthCreateAccount: "Intenta iniciar sesión con una cuenta diferente",
      EmailCreateAccount: "Intenta iniciar sesión con una cuenta diferente",
      Callback: "Intenta iniciar sesión con una cuenta diferente",
      OAuthAccountNotLinked:
        "Inicia sesión con el método de autenticación que utilizaste para crear tu cuenta.",
      EmailSignin: "Revisa tu correo electrónico",
      default: "Ocurrió un error desconocido y misterioso.",
    };

    errorMessage = errors[error] || errors.default;
  }

  return {
    props: { errorMessage, providers, csrfToken },
  };
}

export default SignInPage;
