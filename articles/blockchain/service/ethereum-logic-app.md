---
title: How to use the Ethereum blockchain connector with Azure Logic Apps
description: How to use the Ethereum blockchain connector with Azure Logic Apps to trigger smart contract functions and respond to smart contract events.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 09/19/2019
ms.topic: tutorial
ms.service: azure-blockchain
ms.reviewer: chrisseg
manager: femila
#Customer intent: As a developer, I want to use Azure Logic Apps and Azure Blockchain Service so that I can trigger smart contract functions and respond to smart contract events.
---

# How to use Ethereum Blockchain connector with Azure Logic Apps

Use the [Ethereum Blockchain connector](https://docs.microsoft.com/connectors/blockchainethereum/) with [Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/) to perform smart contract actions and respond to smart contract events. For example, you want to create a REST-based microservice that returns information from a blockchain ledger. Using a logic app, you can accept HTTP requests that query information stored in a blockchain ledger.

## Prerequisites

* Complete the optional prerequisite [Quickstart: Use Visual Studio Code to connect to a Azure Blockchain Service consortium network](connect-vscode.md). The quickstart guides you though installing the [Azure Blockchain Development Kit for Ethereum](https://marketplace.visualstudio.com/items?itemName=AzBlockchain.azure-blockchain) and setting up your blockchain development environment.

## Create a logic app

Azure Logic Apps help you schedule, automate business processes and workflows when you need to integrate systems and services. First, you create a logic that uses the Ethereum Blockchain connector.

1. In the [Azure portal](https://portal.azure.com), choose **Create a resource > Integration > Logic App**.
1. Under **Create logic app**, provide details where to create your logic app. After you're done, select **Create**.

    [screenshot]

    For more information on creating Azure Logic Apps, see [Create Azure Logic Apps](../../logic-apps/quickstart-create-first-logic-app-workflow.md).
1. After Azure deploys your app, select your logic app resource.
1. In the Logic Apps Designer, under **Templates**, choose **Blank Logic App**.

Every logic app must start with a trigger, which fires when a specific event happens or when a specific condition is met. Each time the trigger fires, the Logic Apps engine creates a logic app instance that starts and runs your workflow.

The Ethereum Blockchain connector has one trigger and several actions. Which trigger or action you use depends on your scenario.

If your workflow:

* Triggers when an event occurs on the blockchain, [use the event trigger](#use-the-event-trigger).
* Queries or deploys a smart contract, [use actions](#use-actions).
* Follows a common scenario, [generate a workflow using the developer kit](#generate-a-workflow).

## Use the event trigger

You use Ethereum Blockchain event triggers when you want a logic app to run after a smart contract event occurs. For example, you want to send an email when a smart contract function is called.

1. In the Logic App designer, choose the Ethereum Blockchain connector.
1. From the **Triggers** tab, choose **When a smart contract event occurs**.
1. Change or [create an API connection](#create-an-api-connection) to your Azure Blockchain Service.
1. Enter the details about the smart contract you want to check for events.

    [screenshot]

    | Property | Description |
    |----------|-------------|
    | **Contract ABI** | The contract application binary interface (ABI) defines the smart contract interfaces. How to [get the contract ABI](#get-contract-abi). |
    | **Smart contract address** | The contract address is the smart contract destination address on the Ethereum blockchain. How to [get the contract address](#get-contract-address). |
    | **Event name** | Choose a smart contract event to check. The event triggers the logic app. |
    | **Interval** and **Frequency** | Choose how often you want to check for the event. |

[screenshot]

## Use actions

You use the Ethereum Blockchain actions when you want a logic app to perform an action on the blockchain ledger. For example, you want to create a REST-based microservice that calls a smart contract function when an HTTP request is made to a logic app.

Connector actions require a trigger. You can use an Ethereum Blockchain connector action as the next step after a trigger.

1. In the Logic App designer, select **New step** following a trigger.
1. Choose the Ethereum Blockchain connector.
1. From the **Actions** tab, choose one of the available actions.

    [screenshot]

1. Change or [create an API connection](#create-an-api-connection) to your Azure Blockchain Service.
1. Depending on the action you chose, provide the following details about your smart contract function.

    | Property | Description |
    |----------|-------------|
    | **Contract ABI** | The contract application binary interface (ABI) defines the smart contract interfaces. How to [get the contract ABI](#get-contract-abi). |
    | **Contract bytecode** | The compiled smart contract bytecode. How to [get the contract bytecode](#get-contract-bytecode). |
    | **Smart contract address** | The contract address is the smart contract destination address on the Ethereum blockchain. How to [get the contract address](#get-contract-address). |
    | **Smart contract function name** | Choose the smart contract function name for the action. The list is populated from the details in the contract ABI. |

    After choosing a smart contract function name, you may see required fields for function parameters. Enter the values or dynamic content required for your scenario.

[screenshot]

## Generate a workflow

The Azure Blockchain Development Kit for Ethereum Visual Studio Code extension can generate logic app workflows for common scenarios. There are four scenarios available:

* Data publishing to an Azure SQL Database
* Event publishing to an Azure Event Grid or Azure Service Bus
* Report publishing
* REST-based microservice

 Azure Blockchain Development Kit uses Truffle to simplify blockchain development. To generate a logic app based on a smart contract, you need a Truffle solution for the smart contract. You also need to be connected to your Azure Blockchain Service consortium network. For more information, see [use Visual Studio Code to connect to an Azure Blockchain Service consortium network quickstart](connect-vscode.md).

For example, the following steps generate a REST-based microservice logic app based on the quickstart **HelloBlockchain** smart contract:

1. In the VS Code explorer sidebar, expand the **contracts** folder in your solution.
1. Right-click **HelloBlockchain.sol** and choose **Generate microservices for smart contracts** from the menu.

    [screenshot]

1. In the command palette, choose **Logic App**.
1. Enter the **contract address**. For more information, see [how to get the contract address](#get-contract-address).

    The logic app configuration and code files are generated in the **generatedLogicApp** directory.

1. View the **generatedLogicApp/HelloBlockchain** directory. There is a logic app JSON file for each smart contract function, event, and property.
1. Open the **generatedLogicApp/HelloBlockchain/Service/function.SendRequest.logicapp.json** file and copy the contents.

    [screenshot]

1. In your logic app, select **Logic app code view**. Replace the existing JSON with the generated logic app JSON.

    [screenshot]

1. Select **Designer** to switch to the designer view.
1. The logic app includes the basic steps for the scenario. However, you need to update the configuration details for Ethereum Blockchain connector.
1. Select the **Connections** step and change or [create an API connection](#create-an-api-connection) to your Azure Blockchain Service.

    [screenshot]

1. You can test the REST-based microservice by issuing an HTTP POST request to the logic app request URL. Copy the **HTTP POST URL** from the **When a HTTP request is received** step.

    [screenshot]

1. Use cURL to create an HTTP POST request. Replace the placeholder text **\<HTTP POST URL\>** with the URL from the previous step.

    ``` bash
    curl -d "{}" -H "Content-Type: application/json" -X POST "<HTTP POST URL>"
    ```

    The cURL command returns a response from the logic app. In this case, the output from the **RequestMessage** smart contract function.

    [screenshot]

## Create an API connection

An API connection to a blockchain is required for the Ethereum Blockchain connector. You can use the API connector for multiple logic apps. To set up a connection to an Azure Blockchain Service member, you need the following information:

| Property | Description |
|----------|-------------|
|**Connection name** | Name of the API connection. |
|**Ethereum RPC endpoint** | HTTP address of the Azure Blockchain Service transaction node. How to [get the RPC endpoint](#get-rpc-endpoint). |
|**Private key** | Ethereum account private key. How to [get the private key](#get-private-key). |
|**Account address** | Azure Blockchain Service member account address. How to [get the account address](#get-account-address). |
|**Account password** | The account password is set when you create the member. For information on resetting the password, see [Ethereum account](consortium.md#ethereum-account).|

> [!IMPORTANT]
> A private key or account address and password is required for creating transactions on a blockchain. Only one form of authentication is needed. You don't need to provide both the private key and account details. Querying contracts does not require a transaction. If you are using actions that query contract state, the private key or account address and password are not required.

## Get RPC endpoint

You need the Azure Blockchain Service endpoint address to connect to a blockchain network. You can get endpoint address using the Azure Blockchain Development Kit for Ethereum or the Azure portal.

**Using development kit:**

1. Under **Azure Blockchain Service** in Visual Studio Code, right-click the consortium.
1. Select **Copy RPC endpoint**.

    [screenshot]

**Using Azure portal:**

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your Azure Blockchain Service member. Select **Transaction nodes** and the default transaction node link.

    ![Select default transaction node](./media/ethereum-logic-app/transaction-nodes.png)

1. Select **Connection strings > Access keys**.
1. Copy the endpoint address from **HTTPS (Access key 1)** or access key 2.

    ![Connection string](./media/ethereum-logic-app/connection-string.png)

    The RPC endpoint is the HTTPS URL including the address and access key of your Azure Blockchain Service member transaction node.

## Get private key

Your Ethereum account public and private keys are generated from a 12 word mnemonic. Azure Blockchain Development Kit for Ethereum generates a mnemonic when you connect to an Azure Blockchain Service consortium member. You can get endpoint address using the development kit extension.

1. In Visual Studio Code, open the command palette (F1).
1. Choose **Azure Blockchain: Retrieve private key**.
1. Select mnemonic you saved when connecting to the consortium member. The private key is copied to your clipboard.

    [screenshot]

## Get account address

The member account and password is required to authenticate to the management smart contract at the root contract address. The password is set when you create the member.

1. In the Azure portal, go to your Azure Blockchain Service overview page.
1. Copy the **member account** address.

    [screenshot]

For more information on the account address and password, see [Ethereum account](consortium.md#ethereum-account).

## Get contract ABI

The contract application binary interface (ABI) defines the smart contract interfaces. It describes how to interact with the smart contract. You can get contract ABI using the Azure Blockchain Development Kit for Ethereum or from the Solidity compiler contract metadata file.

**Using development kit:**

If you used development kit or Truffle to build your smart contract, you can use the extension to copy the contract ABI to the clipboard.

1. In Visual Studio Code explorer pane, expand the **build/contracts** folder of your Solidity project.

    [screenshot]

1. Right-click the contract metadata JSON file. The file name is the smart contract name followed by the **.json** extension.
1. Choose **Copy contract ABI**. The contract ABI is copied to the clipboard.

**Using the contract metadata file:**

1. Open the contract metadata file contained in the **build/contracts** folder of your Solidity project. The file name is the smart contract name followed by the **.json** extension.
1. Find the **abi** section in the JSON file.
1. Copy the **abi** JSON array.

    [screenshot]

## Get contract bytecode

The contract bytecode is the compiled smart contract executed by the Ethereum virtual machine. You can get contract bytecode using the Azure Blockchain Development Kit for Ethereum or from the Solidity compiler.

**Using development kit:**

If you used development kit or Truffle to build your smart contract, you can use the extension to copy the contract bytecode to the clipboard.

1. In Visual Studio Code explorer pane, expand the **build/contracts** folder of your Solidity project.

    [screenshot]

1. Right-click the contract metadata JSON file. The file name is the smart contract name followed by the **.json** extension.
1. Choose **Copy contract bytecode**. The contract bytecode is copied to the clipboard.

**Using the Solidity compiler:**

Use the command `solc --bin <smart contract>.sol` to generate the contract bytecode.

## Get contract address

The contract address is the smart contract destination address on the Ethereum blockchain. You use this address to send a transaction or query state of a smart contract. You can get the contract address from the Truffle migration output or the contract metadata file.

**Using Truffle migrate output:**

Truffle displays the contract address after deployment of the smart contract. Copy the **contract address** from the output.

[screenshot]

**Using the contract metadata file:**

1. Open the contract metadata file contained in the **build/contracts** folder of your Solidity project. The file name is the smart contract name followed by the **.json** extension. 
1. Find the **networks** section in the JSON file.
1. Private networks are identified by an integer network ID. Find the address value within the network section.
1. Copy the **address** value.

    [screenshot]

## Next steps

Watch common [scenarios connecting blockchain using Azure Logic Apps](https://channel9.msdn.com/Shows/Blocktalk/Doing-more-with-Logic-Apps?term=logic%20apps%20blockchain&lang-en=true).
