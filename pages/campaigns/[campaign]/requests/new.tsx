/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";
import { Button, Message } from "semantic-ui-react";
import { Layout } from "../../../../components";
import Campaign from "../../../../utils/campaign";
import web3 from "../../../../utils/web3";
import styled from "styled-components";
import Head from "next/head";

interface Props {
	address: string;
}

const RequestNew: NextPage<Props> = ({ address }) => {
	const [description, setDescription] = useState("");
	const [value, setValue] = useState("");
	const [recipient, setRecipient] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const onSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const campaign = Campaign(address);
			const accounts = await web3.eth.getAccounts();

			await campaign.methods
				.createRequest(
					description,
					web3.utils.toWei(value, "ether"),
					recipient
				)
				.send({ from: accounts[0] });

			Router.push(
				"/campaigns/[campaign]/requests",
				`/campaigns/${address}/requests`
			);
		} catch (err) {
			const error = err as Error;
			setError(error.message);
			setIsLoading(false);
		}
	};

	return (
		<>
			<Head>
				<title>New Request</title>
				<meta
					name="description"
					content={"Create a new request for " + address}
				/>
			</Head>

			<Layout>
				<Link
					href="/campaigns/[campaign]/requests"
					as={`/campaigns/${address}/requests`}
				>
					<a>Back</a>
				</Link>

				<h3>Create a Request</h3>

				<Form onSubmit={onSubmit}>
					<div>
						<label htmlFor="description">Description</label>

						<InputContainer>
							<Input
								value={description}
								onChange={(event) =>
									setDescription(event.target.value)
								}
								id="description"
							/>
						</InputContainer>
					</div>

					<div>
						<label htmlFor="value">Value in Ether</label>

						<InputContainer>
							<Input
								type="number"
								value={value}
								onChange={(event) =>
									setValue(event.target.value)
								}
								id="value"
							/>
						</InputContainer>
					</div>

					<div>
						<label htmlFor="recipient">Recipient</label>

						<InputContainer>
							<Input
								value={recipient}
								onChange={(event) =>
									setRecipient(event.target.value)
								}
								id="recipient"
							/>
						</InputContainer>
					</div>

					{error && <Message error header="Oops!" content={error} />}

					<Button primary loading={isLoading}>
						Create!
					</Button>
				</Form>
			</Layout>
		</>
	);
};

RequestNew.getInitialProps = async (props) => {
	const campaignAddress = props.query.campaign as string;

	return { address: campaignAddress };
};

const Form = styled.form`
	width: 100%;
`;

const Input = styled.input`
	width: 100%;
	padding: 10px 16px;
	border-radius: 4px;
	border: 1px solid gray;
	outline-color: gray;
`;

const InputContainer = styled.div`
	width: 100%;
	margin: 12px 0;
	box-sizing: border-box;
`;

export default RequestNew;
