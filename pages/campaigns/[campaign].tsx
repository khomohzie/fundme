import type { NextPage } from "next";
import Campaign from "../../utils/campaign";
import Head from "next/head";
import Link from "next/link";
import { Card, Grid, Button } from "semantic-ui-react";
import { Layout } from "../../components";
import web3 from "../../utils/web3";
import ContributeForm from "../../components/ContributeForm";

interface Props {
	address: string;
	minimumContribution: string;
	balance: string;
	requestsCount: string;
	approversCount: string;
	manager: string;
}

const CampaignDetails: NextPage<Props> = ({
	address,
	balance,
	manager,
	minimumContribution,
	requestsCount,
	approversCount,
}) => {
	const renderCards = () => {
		const items = [
			{
				header: manager,
				meta: "Address of Manager",
				description:
					"The manager created this campaign and can create requests to withdraw money",
				style: { overflowWrap: "break-word" },
			},
			{
				header: minimumContribution,
				meta: "Minimum Contribution (wei)",
				description:
					"You must contribute at least this much wei to become an approver",
			},
			{
				header: requestsCount,
				meta: "Number of Requests",
				description:
					"A request tries to withdraw money from the contract. Requests must be approved by approvers",
			},
			{
				header: approversCount,
				meta: "Number of Approvers",
				description:
					"Number of people who have already donated to this campaign",
			},
			{
				header: web3.utils.fromWei(balance, "ether"),
				meta: "Campaign Balance (ether)",
				description:
					"The balance is how much money this campaign has left to spend.",
			},
		];

		return <Card.Group items={items} />;
	};

	return (
		<>
			<Head>
				<title>Campaign Details</title>
			</Head>

			<Layout>
				<h3>Campaign Details</h3>

				<Grid>
					<Grid.Row>
						<Grid.Column width={10}>{renderCards()}</Grid.Column>

						<Grid.Column width={6}>
							<ContributeForm address={address} />
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column>
							<Link
								href="/campaigns/[campaign]/requests"
								as={`/campaigns/${address}/requests`}
							>
								<a>
									<Button primary>View Requests</Button>
								</a>
							</Link>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Layout>
		</>
	);
};

CampaignDetails.getInitialProps = async (props) => {
	const campaignAddress = props.query.campaign as string;

	const campaign = Campaign(campaignAddress);

	const summary = await campaign.methods.getSummary().call();

	return {
		address: campaignAddress,
		minimumContribution: summary[0],
		balance: summary[1],
		requestsCount: summary[2],
		approversCount: summary[3],
		manager: summary[4],
	};
};

export default CampaignDetails;
