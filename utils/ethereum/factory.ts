import web3 from "../web3";
import { AbiItem } from "web3-utils";
import { abi } from "./build/CampaignFactory.json";

const contractAddress = "0xdb74df105bf13730e5afc0cbfc03cb7d502140ab";

const instance = new web3.eth.Contract(abi as AbiItem[], contractAddress);

export default instance;
