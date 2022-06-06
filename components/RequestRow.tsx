import type { NextPage } from "next";
import { Button, Table } from "semantic-ui-react";
import { Request } from "../pages/campaigns/[campaign]/requests";
import Campaign from "../utils/campaign";
import web3 from "../utils/web3";
import { toast } from "react-toastify";
import { useState } from "react";
import Router from "next/router";

interface Props {
	id: number;
	request: Request;
	address: string;
	approversCount: string;
}

const RequestRow: NextPage<Props> = ({
	id,
	request,
	address,
	approversCount,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isFinalizeLoading, setIsFinalizeLoading] = useState(false);

	const handleApprove = async () => {
		setIsLoading(true);

		try {
			const campaign = Campaign(address);

			const accounts = await web3.eth.getAccounts();

			await campaign.methods.approveRequest(id).send({
				from: accounts[0],
			});

			Router.replace(
				"/campaigns/[campaign]/requests",
				`/campaigns/${address}/requests`
			);

			setIsLoading(false);
			toast.success(`Approval successful.`);
		} catch (error: any) {
			toast.error(error);
			setIsLoading(false);
		}
	};

	const handleFinalize = async () => {
		setIsFinalizeLoading(true);

		try {
			const campaign = Campaign(address);

			const accounts = await web3.eth.getAccounts();

			await campaign.methods.finalizeRequest(id).send({
				from: accounts[0],
			});

			Router.replace(
				"/campaigns/[campaign]/requests",
				`/campaigns/${address}/requests`
			);

			setIsFinalizeLoading(false);
			toast.success(`Payment sent to ${request.recipient}`);
		} catch (error: any) {
			toast.error(error);
			setIsFinalizeLoading(false);
		}
	};

	const { Row, Cell } = Table;

	const readyToFinalize =
		Number(request.approvalCount) > Number(approversCount) / 2;

	return (
		<Row
			disabled={request.complete}
			positive={readyToFinalize && !request.complete}
		>
			<Cell>{id}</Cell>

			<Cell>{request.description}</Cell>

			<Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>

			<Cell>{request.recipient}</Cell>

			<Cell>
				{request.approvalCount}/{approversCount}
			</Cell>

			<Cell>
				{request.complete ? null : (
					<Button
						color="green"
						inverted
						onClick={handleApprove}
						loading={isLoading}
					>
						Approve
					</Button>
				)}
			</Cell>

			<Cell>
				{request.complete ? null : (
					<Button
						color="blue"
						inverted
						onClick={handleFinalize}
						loading={isFinalizeLoading}
					>
						Finalize
					</Button>
				)}
			</Cell>
		</Row>
	);
};

export default RequestRow;
