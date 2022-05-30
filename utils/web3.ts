import { toast } from "react-toastify";
import Web3 from "web3";
import { config } from "../config";

let web3: Web3;

if (typeof window.ethereum !== undefined) {
	const { ethereum } = window;

	web3 = new Web3(ethereum);

	// Request approval from the user to use an ethereum address they can be identified by.
	ethereum
		.enable()
		.then((_accounts: any) => {})
		.catch((error: any) => {
			console.error(error);
			toast.error(
				"Sorry, this application requires user approval to function correctly."
			);
		});
} else {
	// We are on the server OR MetaMask is not running.
	const { providerUrl } = config;

	if (!providerUrl) throw new Error("Please provide a provider url");

	const provider = new Web3.providers.HttpProvider(providerUrl);

	web3 = new Web3(provider);
}

export default web3;
