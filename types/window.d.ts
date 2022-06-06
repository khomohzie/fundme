import Web3 from "web3";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";

declare global {
	interface Window {
		ethereum?: any;
		web3: IWeb3;
	}
}

interface IWeb3 extends Web3 {
	ethereum?: MetaMaskInpageProvider;
	provider?: providers.Web3Provider;
	contract?: Contract;
}
