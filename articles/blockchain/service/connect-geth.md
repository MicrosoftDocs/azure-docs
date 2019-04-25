---
title: Connect Using Geth
description: Connect to an Azure Blockchain Service network using Geth
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

# Quickstart: Use Geth to connect to a consortium network

Geth is a Go Ethereum client you can use to connect to an Azure Blockchain Service node.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* Install [Geth](https://github.com/ethereum/go-ethereum/wiki/geth)
* [Create an Azure Blockchain member](create-member.md)

## Get node details

You can find the username and endpoint address and change your password in Node Security in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to one of your Azure Blockchain managed ledger member transaction nodes.
1. Select **Connection security > Access keys**.
1. Copy the endpoint address from **Access key > HTTPS**. You need the address for the next section.

## Connect to Geth

Using a command prompt, run:

```
geth attach <Azure Blockchain Service endpoint URL>
```

## Next steps

> [!div class="nextstepaction"]
> [Send a transaction](send-transaction.md)