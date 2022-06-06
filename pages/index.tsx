import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { Button, Card } from "semantic-ui-react";
import factory from "../utils/factory";
import { useEffect, useState } from "react";
import { Layout } from "../components";

interface props {
	campaigns: string[];
}

const Home: NextPage<props> = ({ campaigns }) => {
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		(async function () {
			const { ethereum } = window;

			// Check to see if user is already connected.
			try {
				const accounts = await ethereum.request({
					method: "eth_accounts",
				});
				if (accounts.length > 0 && ethereum.isConnected()) {
					setConnected(true);
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}, [connected]);

	const renderCampaigns = () => {
		const items = campaigns.map((campaign) => {
			return {
				header: campaign,
				description: (
					<Link
						href="/campaigns/[campaign]"
						as={`/campaigns/${campaign}`}
					>
						<a>View Campaign</a>
					</Link>
				),
				fluid: true,
				style: {
					marginLeft: "0",
				},
			};
		});

		return <Card.Group items={items} />;
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>FundMe</title>
				<meta name="description" content="Fundme - Homepage" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Layout>
				{!connected && (
					<div className={styles.connect_div}>
						<h3>Connect your wallet</h3>
						<Button
							id="connect_btn"
							content="Connect"
							icon="add circle"
							positive
						/>
					</div>
				)}

				<div>
					<h3>Open Campaigns</h3>

					<Link href="/campaigns/new">
						<a>
							<Button
								floated="right"
								content="Create Campaign"
								icon="add circle"
								primary
							/>
						</a>
					</Link>

					{renderCampaigns()}
				</div>
			</Layout>
		</div>
	);
};

Home.getInitialProps = async () => {
	const campaigns = await factory.methods.getDeployedCampaigns().call();

	return { campaigns };
};

export default Home;
