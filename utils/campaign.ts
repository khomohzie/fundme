import Campaign from "./ethereum/build/Campaign.json";
import web3 from "./web3";
import { AbiItem } from "web3-utils";

const campaignContract = (address: string) => {
	return new web3.eth.Contract(Campaign.abi as AbiItem[], address);
};

export default campaignContract;
