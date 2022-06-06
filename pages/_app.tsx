import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<ToastContainer />
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
