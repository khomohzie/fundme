import { useState } from "react";
import type { NextPage } from "next";
import Router from "next/router";
import { Button, Message } from "semantic-ui-react";
import Campaign from "../utils/campaign";
import web3 from "../utils/web3";
import styled from "styled-components";

interface Props {
	address: string;
}

const ContributeForm: NextPage<Props> = ({ address }) => {
	const [minimumContribution, setMinimumContribution] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const onSubmit = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const campaign = Campaign(address);
			const accounts = await web3.eth.getAccounts();

			await campaign.methods.contribute().send({
				from: accounts[0],
				value: web3.utils.toWei(minimumContribution, "ether"),
			});

			Router.replace("/campaigns/[campaign]", `/campaigns/${address}`);

			Router.push("/");
		} catch (err) {
			const error = err as Error;
			setError(error.message);
			setIsLoading(false);
		}
	};

	return (
		<>
			<Form onSubmit={onSubmit}>
				<div>
					<label htmlFor="amount">Amount to Contribute</label>

					<InputContainer>
						<Input
							id="amount"
							placeholder="Enter an amount to contribute."
							value={minimumContribution}
							onChange={(event) =>
								setMinimumContribution(event.target.value)
							}
						/>
						<WeiLabel disabled>ether</WeiLabel>
					</InputContainer>
				</div>

				{error && <Message error header="Oops!" content={error} />}

				<Button primary loading={isLoading}>
					Contribute!
				</Button>
			</Form>
		</>
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

export default ContributeForm;
