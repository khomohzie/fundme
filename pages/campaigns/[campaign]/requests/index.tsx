import type { NextPage } from "next";
import Link from "next/link";
import { Button, Table } from "semantic-ui-react";
import RequestRow from "../../../../components/RequestRow";
import { Layout } from "../../../../components";
import Campaign from "../../../../utils/campaign";
import Head from "next/head";

export interface Request {
	description: string;
	value: string;
	recipient: string;
	complete: boolean;
	approvalCount: string;
	0: string;
	1: string;
	2: string;
	3: boolean;
	4: string;
}

interface Props {
	address: string;
	requests: Request[];
	requestCount: string;
	approversCount: string;
}

const RequestIndex: NextPage<Props> = ({
	address,
	requests,
	requestCount,
	approversCount,
}) => {
	const { Header, Row, HeaderCell, Body } = Table;

	return (
		<>
			<Head>
				<title>Campaign Requests</title>
				<meta name="description" content={"Requests for " + address} />
			</Head>

			<Layout>
				<h3>Requests</h3>

				<Link
					href="/campaigns/[campaign]/requests/new"
					as={`/campaigns/${address}/requests/new`}
				>
					<a>
						<Button
							primary
							floated="right"
							style={{ marginBottom: 10 }}
						>
							Add Request
						</Button>
					</a>
				</Link>

				<Table>
					<Header>
						<Row>
							<HeaderCell>ID</HeaderCell>

							<HeaderCell>Description</HeaderCell>

							<HeaderCell>Amount</HeaderCell>

							<HeaderCell>Recipient</HeaderCell>

							<HeaderCell>Approval Count</HeaderCell>

							<HeaderCell>Approve</HeaderCell>

							<HeaderCell>Finalize</HeaderCell>
						</Row>
					</Header>

					<Body>
						{requests.map((request: Request, index: number) => {
							return (
								<RequestRow
									key={index}
									id={index}
									request={request}
									address={address}
									approversCount={approversCount}
								/>
							);
						})}
					</Body>
				</Table>

				<div>Found {requestCount} requests.</div>
			</Layout>
		</>
	);
};

RequestIndex.getInitialProps = async (props) => {
	const campaignAddress = props.query.campaign as string;

	const campaignContract = Campaign(campaignAddress);

	const requestCount = await campaignContract.methods
		.getRequestsCount()
		.call();

	const approversCount = await campaignContract.methods
		.approversCount()
		.call();

	const requests = await Promise.all(
		Array(parseInt(requestCount))
			.fill(undefined)
			.map((element, index) => {
				return campaignContract.methods.requests(index).call();
			})
	);

	return {
		address: campaignAddress,
		requests,
		requestCount,
		approversCount,
	};
};

export default RequestIndex;
