---
title: Use Azure Blockchain Development Kit for Ethereum to connect to Azure Blockchain Service
description: Connect to an Azure Blockchain Service consortium network using the Azure Blockchain Development Kit for Ethereum extension in Visual Studio Code
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 09/10/2019
ms.topic: quickstart
ms.service: azure-blockchain
ms.reviewer: chrisseg
manager: femila
#Customer intent: As a developer, I want to connect to my blockchain consortium so that I can perform actions on a blockchain.
---

# Quickstart: Use Visual Studio Code to connect to a Azure Blockchain Service consortium network

In this quickstart, you install and use the Azure Blockchain Development Kit for Ethereum Visual Studio Code extension to attach to a consortium on Azure Blockchain Service. The Azure Blockchain Development Kit simplifies how you create, connect, build, and deploy smart contracts on Ethereum ledgers. 

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* Complete [Quickstart: Create a blockchain member using the Azure portal](create-member.md) or [Quickstart: Create an Azure Blockchain Service blockchain member using Azure CLI](create-member-cli.md)
* [Visual Studio Code](https://code.visualstudio.com/Download)
* [Azure Blockchain Development Kit for Ethereum extension](https://marketplace.visualstudio.com/items?itemName=AzBlockchain.azure-blockchain)
* [Node.js](https://nodejs.org)
* [Git](https://git-scm.com)
* [Python](https://www.python.org/downloads/release/python-2715/). Add python.exe to your path. Python in your path is required for Azure Blockchain Development Kit.
* [Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation)
* [Ganache CLI](https://github.com/trufflesuite/ganache-cli)

### Verify Azure Blockchain Development Kit environment

Azure Blockchain Development Kit verifies your development environment prerequisites have been met. To verify your development environment:

From the VS Code command palette, choose **Azure Blockchain: Show Welcome Page**.

Azure Blockchain Development Kit runs a validation script that takes about a minute to complete. You can view the output by selecting **Terminal > New Terminal**. In the terminal menu bar, select the **Output** tab and **Azure Blockchain** in the dropdown. Successful validation looks like the following image:

![Valid dev environment](./media/connect-vscode/valid-environment.png)

 If you are missing a required tool, a new tab named **Azure Blockchain Development Kit - Preview** lists the required apps to install and links to download the tools.

![Dev kit required apps](./media/connect-vscode/required-apps.png)

## Connect to consortium member

You can connect to consortium members using the Azure Blockchain Development Kit VS Code extension. Once connected to a consortium, you can compile, build, and deploy smart contracts to an Azure Blockchain Service consortium member.

If you don't have access to an Azure Blockchain Service consortium member, complete the prerequisite [Quickstart: Create a blockchain member using the Azure portal](create-member.md) or [Quickstart: Create an Azure Blockchain Service blockchain member using Azure CLI](create-member-cli.md).

1. In the Visual Studio Code (VS Code) explorer pane, expand the **Azure Blockchain** extension.
1. Select **Connect to Consortium**.

   ![Connect to consortium](./media/connect-vscode/connect-consortium.png)

    If prompted for Azure authentication, follow the prompts to authenticate using a browser.
1. Choose **Connect to Azure Blockchain Service consortium** in the command palette dropdown.
1. Choose the subscription and resource group associated with your Azure Blockchain Service consortium member.
1. Choose your consortium from the list.

The consortium and blockchain members are listed in the Visual Studio explorer side bar.

![Consortium displayed in explorer](./media/connect-vscode/consortium-node.png)

## Next steps

In this quickstart, you used Azure Blockchain Development Kit for Ethereum Visual Studio Code extension to attach to a consortium on Azure Blockchain Service. Try the next tutorial to use Azure Blockchain Development Kit for Ethereum and Truffle to create, build, deploy, and execute a smart contract function via a transaction.

> [!div class="nextstepaction"]
> [Use Visual Studio Code to create, build, and deploy smart contracts using Azure Blockchain Service](send-transaction.md)