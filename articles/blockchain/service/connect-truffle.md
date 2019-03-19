---
title: Connect Using Truffle
description: Connect to an Azure Blockchain Service network using Truffle
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 03/12/2019
ms.topic: quickstart
ms.service: azure-blockchain
ms.reviewer: jackyhsu
manager: femila
#Customer intent: As a developer, I want to connect to my blockchain member node so that I can perform actions on a blockchain.
---

# Quickstart: Use Truffle to connect to a consortium network

Truffle is a blockchain development environment you can use to connect to an Azure Blockchain Service node.

If you don’t have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites

* Install [Node.js](https://nodejs.org)
* Install [Truffle](https://github.com/trufflesuite/truffle)
* Install [Visual Studio Code](https://code.visualstudio.com/Download)

## Get node details

You can find the username and endpoint address and change your password in Node Security in Azure portal.

1. Log in to the [Azure portal](https://portal.azure.com).
1. Navigate to one of your Azure Blockchain managed ledger member transaction nodes.
1. Select **Connection security > Access keys**.
1. Copy the endpoint address from **Access key > HTTPS**. You need the address for the next section.

## Next steps

> [!div class="nextstepaction"]
> [Send a transaction](send-transaction.md)