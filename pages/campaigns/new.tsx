import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styled from "styled-components";
import { Button, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../utils/factory";
import web3 from "../../utils/web3";
import Router from "next/router";

const CampaignNew: NextPage = () => {
	const [minimumContribution, setMinimumContribution] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const onSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const accounts = await web3.eth.getAccounts();

			const createCampaign = await factory.methods
				.createCampaign(minimumContribution)
				.send({ from: accounts[0] });

			Router.push("/");
		} catch (err) {
			const error = err as Error;

			setError(error.message);
			setIsLoading(false);
		}
	};

	return (
		<div>
			<Head>
				<title>FundMe</title>
				<meta name="description" content="Create Campaign" />
			</Head>

			<Layout>
				<h3>Create a Campaign</h3>

				<Form onSubmit={onSubmit}>
					<div>
						<label htmlFor="wei">Minimum contribution</label>

						<InputContainer>
							<Input
								id="wei"
								placeholder="Enter a minimum value for contribution."
								value={minimumContribution}
								onChange={(e) =>
									setMinimumContribution(e.target.value)
								}
							/>
							<WeiLabel disabled>Wei</WeiLabel>
						</InputContainer>
					</div>

					{error && <Message error header="Oops!" content={error} />}

					<Button loading={isLoading} primary>
						Create!
					</Button>
				</Form>
			</Layout>
		</div>
	);
};

const Form = styled.form`
	width: 100%;
`;

const Input = styled.input`
	flex: 1;
	padding: 10px 16px;
	border-radius: 4px;
	border: 1px solid gray;
	border-right: none;
	outline-color: gray;
`;

const WeiLabel = styled.button`
	padding: 10px 16px;
	border-radius: 4px;
	border: none;
	background: lightgray;
	color: #636363;
	font-weight: bold;
`;

const InputContainer = styled.div`
	width: 100%;
	display: flex;
	margin: 12px 0;
	box-sizing: border-box;
`;

export default CampaignNew;
