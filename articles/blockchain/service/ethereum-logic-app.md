---
title: How to use the Ethereum blockchain connector with Azure Logic Apps
description: How to use the Ethereum blockchain connector with Azure Logic Apps to trigger smart contract functions and respond to smart contract events.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 09/13/2019
ms.topic: tutorial
ms.service: azure-blockchain
ms.reviewer: chrisseg
manager: femila
#Customer intent: As a developer, I want to use Azure Logic Apps and Azure Blockchain Service so that I can trigger smart contract functions and respond to smart contract events.
---

# How to use Ethereum Blockchain connector with Azure Logic Apps

Use Ethereum Blockchain connector with Azure Logic App connector to perform smart contract actions and respond to smart contract events.

## Prerequisites

Complete use smart contract quickstart.

## Create connection

Logic apps require a connection. To set up a connection to an Azure Blockchain Service member, you need the following information

### RPC endpoint
from DevKit
from portal

### Private key 
from devkit F1 Azure Blockchain: Retrieve private key
Select mnemonic 

### Account address and password

## Get smart contract details

### ABI
From devkit - right click contract, get ABI.
From compiler json output - abi section.

### Contract address
from truffle deployment output. 
From build>contract> contract.json > networks > number > address file .

### Get the byte code

from devkit - right click contract, get bytecode
solc --bin sourcefile.sol

## Create a logic app

1. In the [Azure portal](https://portal.azure.com), choose **Create a resource > Integration > Logic App**.
1. Under **Create logic app**, provide details about your logic app as shown here. After you're done, select **Create**.

    [Provide logic app details]

    | Property | Value | Description |
    |----------|-------|-------------|
    | **Name** | BlockchainSendRequest | The name for your logic app |
    | **Subscription** | <*your-Azure-subscription-name*> | The name for your Azure subscription |
    | **Resource group** | Blockchain-LogicApp-rg | The name for the [Azure resource group](../azure-resource-manager/resource-group-overview.md) used to organize related resources |
    | **Location** | West US 2 | The region where to store your logic app information |
    | **Log Analytics** | Off | Monitoring isn't required for the tutorial |

1. After Azure deploys your app, the Logic Apps Designer opens and shows a page with an introduction video and commonly used triggers. Under **Templates**, choose **Blank Logic App**.

Next, add a trigger that fires when a new HTTP POST request is made to the logic app. Every logic app must start with a trigger, which fires when a specific event happens or when a specific condition is met. Each time the trigger fires, the Logic Apps engine creates a logic app instance that starts and runs your workflow.

In Logic App Designer, under the search box, choose **All**.

In the search box, enter "Ethereum". From the triggers list, select **When a HTTP request is received**.

## Deploy smart contract

Use a logic app to deploy a smart contract.

ABI
Bytecode

## Execute smart contract function

ABI
Smart contract address

## Get smart contract state

ABI
Smart contract address

## Query smart contract function

ABI
Smart contract address

## Respond to a smart contract event

ABI
Smart contract name

## HTTP request trigger



In **Request Body JSON Schema**

``` json
{
    "type": "object",
    "properties": {
        "message": {
            "type": "string"
        }
    }
}
```
[screenshot]

Select **Save**.

After save, note HTTP POST URL.

Select **New step**.

In **Choose an action**, search for "Ethereum".

Choose **Ethereum Blockchain**.

Choose **Execute smart contract function**.

In **Ethereum Blockchain**, first you need to create a connection to the blockchain transaction node.
Provide the following for the connection:


| Property | Value | Description |
|----------|-------|-------------|
| **Connection Name** | contosofood |  |
| **Ethereum RPC Endpoint** | <*rpc endpoint*> | RPC endpoint. Right click consortium in dev kit pane. |
| **Private Key** |<*your-private-key*> | Either the private key or the account address/password is needed to sign transactions. From signature field in smartcontract.json |
| **Account Address** |  | Not needed. |
| **Account Password** |  | Not needed. |

Contract ABI - right click contract in build folder
Smart contract address from last network address.
Function name - SendRequest

Select **New step**

In **Choose an action**, search for **Response**.

Choose Action **Response**.

Set

| Property | Value | Description |
|----------|-------|-------------|
| **Status code** | 200 | HTTP status code returned. |
| **Body** | | Add dynamic content. Select **Transaction Hash** |


## Trigger Logic App

Use cURL to create an HTTP POST request.

``` bash
curl -d "{'message':'Hello, blockchain!'}" -H "Content-Type: application/json" -X POST "<HTTP POST URL>"
```

Response shows transaction hash.

View logic app log in portal.

## Query value

Query the contract. Call a contract function.

Create logic app resource.
Name: BlockchainGetMessage.
Select **Create**.

Choose Blank Logic App template.

Choose **When a HTTP request is received**.
Defaults.
Add method GET.
Select **Save**.

**New step**.
**Ethereum Blockchain**.
Choose **Query smart contract function**.

Contract ABI - right click contract in build folder
Smart contract address from last network address.
Function name - GetMessage

Select **New step**

In **Choose an action**, search for **Response**.

Choose Action **Response**.

Set

| Property | Value | Description |
|----------|-------|-------------|
| **Status code** | 200 | HTTP status code returned. |
| **Body** | | Add dynamic content. Select **Function output** |

Make a request in a browser.  Use HTTP POST URL.

## Event

Respond to event

Create logic app.


Choose Ethereum Blockchain.

Enter contract function details.


## Event?

Make request in browser.

## Clean up resources

## Next steps
