---
title: Connect MetaMask to network
description: Connect to an Azure Blockchain Service network using MetaMask
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 03/12/2019
ms.topic: quickstart
ms.service: azure-blockchain
ms.reviewer: jackyhsu
manager: femila
#Customer intent: As a developer, I want to connect to my consortium member node so that I can perform actions on a blockchain.
---

# Quickstart: Use MetaMask to connect to a consortium network

MetaMask is an easy way to interact with blockchain. It provides a browser extension to manage an Ether wallet and perform smart contract actions.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* Install [MetaMask browser extension](https://metamask.io)
* A MetaMask [wallet](https://metamask.zendesk.com/hc/en-us/articles/360015488971-New-to-MetaMask-Learn-How-to-Setup-MetaMask-the-First-Time)
* [Create an Azure Blockchain member](create-member.md)

## Get node details

You can find the username and endpoint address and change your password in Node Security in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to one of your Azure Blockchain Service managed ledger member transaction nodes.
1. Select **Connection security > Access keys**.
1. Copy the endpoint address from **Access key > HTTPS**. You need the address for the next section.

## Connect MetaMask

1. Open MetaMask browser extension.
1. Select the network dropdown and change your network to  **Custom RPC**.

    If connection was successful, you see the private network displayed in the network dropdown.

## Next steps

> [!div class="nextstepaction"]
> [Send a transaction](send-transaction.md)