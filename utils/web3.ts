import { toast } from "react-toastify";
import Web3 from "web3";
import { config } from "../config";

let web3: Web3;

if (
	typeof window !== "undefined" &&
	(typeof window.ethereum !== "undefined" ||
		typeof window.web3 !== "undefined")
) {
	if (typeof window.ethereum !== "undefined") {
		const { ethereum } = window;

		web3 = new Web3(ethereum);

		if (typeof ethereum.autoRefreshOnNetworkChange !== "undefined") {
			ethereum.autoRefreshOnNetworkChange = false;
		}

		ethereum.on("chainChanged", () => {
			document.location.reload();
		});

		const connectBtn = document.getElementById("connect_btn");

		connectBtn?.addEventListener("click", function () {
			// Request approval from the user to use an ethereum address they can be identified by.
			try {
				ethereum
					.request({
						method: "eth_requestAccounts",
					})
					.then((_accounts: any) => {
						window.location.reload();
					})
					.catch((error: any) => {
						console.error(error);
						toast.error(
							"Sorry, this application requires user approval to function correctly."
						);
					});
			} catch (error: any) {
				if (error.code === 4001) {
					// User rejected request.
					console.error(error);
					toast.error(
						"Sorry, this application requires user approval to function correctly."
					);
				}

				console.error(error);
			}
		});

		web3.eth.net.getNetworkType().then((networkInformation: string) => {
			if (networkInformation !== "rinkeby")
				toast.warning("Please connect to rinkeby network");
		});
	} else {
		web3 = new Web3(window.web3.currentProvider);
	}
} else {
	// We are on the server OR MetaMask is not running.
	const { providerUrl } = config;

	if (!providerUrl) throw new Error("Please provide a provider url");

	const provider = new Web3.providers.HttpProvider(providerUrl);

	web3 = new Web3(provider);
}

export default web3;
