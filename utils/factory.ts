import web3 from "./web3";
import { AbiItem } from "web3-utils";
import campaignFactory from "./ethereum/build/CampaignFactory.json";

const contractAddress = "0x15438efA99c4753FcdC7588bF3f2E8a5ed4e5e94";

const instance = new web3.eth.Contract(
	campaignFactory.abi as AbiItem[],
	contractAddress
);

export default instance;
