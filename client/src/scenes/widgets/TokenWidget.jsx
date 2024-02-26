import React, { useState } from 'react';
import { Box, Typography, Button, useTheme, Divider, InputBase } from '@mui/material';
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { ethers } from 'ethers';
const MetaMaskWidget = () => {

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const [account, setAccount] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const API_URL ="https://sepolia.infura.io/v3/6b9db45bfbd74afead8f5a40b72bcf44";
    const PRIVATE_KEY = "68558adab1eae71c42228993d3dfe225c8c4dd602073ed0c9858133daf1d9760";
    const CONTRACT_ADDRESS = "0x06821763Bd70583d7D4B1C32b08a23fE1ce946F1"
    const {abi} = require("../../Token.json")
    const provider = new ethers.AlchemyProvider('sepolia',API_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    const connectToMetaMask = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                setAccount(accounts[0] || 'Not connected');
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('MetaMask extension not detected');
        }
    };
    const shortenAccount = (acc) => {
        if (!acc) return '';
        const maxLength = 10;
        return acc.length > maxLength ? acc.substr(0, maxLength) + '...' : acc;
    };
    const disconnectFromMetaMask = () => {
        setAccount('');
    };
    const transferTokens = async () => {
        try {
            await contract.transfer(recipientAddress, ethers.parseEther(amount));
            console.log('Transfer successful');
        } catch (error) {
            console.error('Error transferring tokens:', error);
        }
    };
    return (
        <WidgetWrapper m="2rem 0">
            <Box mt="1rem 0">
                <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                   ERC20
                </Typography>
                {!account && (

                        <Box display="flex" flexDirection="column" gap="1.5rem">
                            <Button  sx={{
                                color: palette.background.alt,
                                backgroundColor: palette.primary.main,
                                borderRadius: "3rem",
                            }} onClick={connectToMetaMask}>
                                Connect to MetaMask
                            </Button>
                        </Box>
                )}

                {account && (
                    <FlexBetween gap="1rem">
                        <FlexBetween gap="1rem">
                            <Box>
                                <Typography
                                    color={palette.neutral.dark}
                                    variant="h5"
                                    fontWeight="500"
                                    sx={{ mb: "1.5rem"}}
                                    >
                                    Connected Account: {shortenAccount(account)}
                                </Typography>
                            </Box>
                        </FlexBetween>
                    </FlexBetween>
                )}
                {!account && (
                    <Typography
                    fontSize="1rem" color={main} fontWeight="500" mb="1rem" mt="1rem">
                Transfer Coins
            </Typography>
                )}
                {account && (
                    <Typography
                    fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                Transfer Coins
            </Typography>
                )}
                <Box display="flex" flexDirection="column" gap="1.5rem">
                    <InputBase
                        placeholder="Put Adress Here"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        sx={{
                            width: "100%",
                            backgroundColor: palette.neutral.light,
                            borderRadius: "2rem",
                            padding: "1rem 2rem",
                        }}
                    />
                    <InputBase
                        placeholder="Tokens in AYM"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        sx={{
                            width: "100%",
                            backgroundColor: palette.neutral.light,
                            borderRadius: "2rem",
                            padding: "1rem 2rem",
                        }}
                    />
                    <Button
                        onClick={transferTokens}
                        sx={{
                            color: palette.background.alt,
                            backgroundColor: palette.primary.main,
                            borderRadius: "3rem",
                            mb:"1rem",
                        }}
                    >
                        Send
                    </Button>
                </Box>

            </Box>
            {account && (
                <Box display="flex" flexDirection="column" gap="1.5rem">
                <Divider />
                <Button sx={{
                    color: palette.background.alt,
                    backgroundColor: palette.primary.main,
                    borderRadius: "3rem",
                }} onClick={disconnectFromMetaMask}>
                    Disconnect
                </Button>
                </Box>
            )}
        </WidgetWrapper>
    );
};

export default MetaMaskWidget;
