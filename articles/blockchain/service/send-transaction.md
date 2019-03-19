---
title: Deploy a Smart Contract and Send Transaction using Azure Blockchain Service
description: Tutorial on how to use Azure Blockchain Service to deploy a smart contract and send a transaction 
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 03/13/2019
ms.topic: tutorial
ms.service: azure-blockchain
ms.reviewer: jackyhsu
manager: femila
#Customer intent: As a developer, I want to deploy a smart contract using Azure Blockchain Service so that I can try sending a blockchain transaction.
---

# Tutorial: Create an Azure Blockchain Service member and send a transaction

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Deploy a smart contract
> * Send transactions using Remix and MetaMask

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* [Create a blockchain member using Azure portal](create-member-portal.md)
* [Connect to MetaMask](connect-metamask.md)

## Deploy a smart contract

After setting up MetaMask, we can use Injected Web3 in Remix. [Remix](https://remix.ethereum.org/) is an online solidity IDE that enables you to write and debug smart contracts.

Open [Remix](https://remix.ethereum.org/), write the solidity code on the left pane. In this article, we are using a simple contract: `sample.sol`

``` solidity
pragma solidity^0.4.24;

contract sample{
    uint balance;
    
    constructor() public{
        balance = 0;
    }
    
    function add(uint _num) public {
        balance += _num;
    }
    
    function get() public view returns (uint){
        return balance;
    }
}
```

1. Copy the smart contract in the left pane and select **Start to compile**.
1. Go to the **Run** tab, select **Injected Web3**, and select **deploy**. The account is set in MetaMask.
1. Edit the **gas price** to 0, and select **confirm**.
1. If remix shows a deployed contract with function buttons, the deployment is successful.

## Send transactions

1. To call the add function, enter the number you wish to add to the balance, and select add.
1. Edit the gas price to 0 and select confirm.
1. Click the get button, it should return 100, which is the number we just added.

## Clean up resources

When no longer needed, you can delete the resources by deleting the `myresourcegroup` resource group you created by the Azure Blockchain Service.

To delete the resource group:

1. In the Azure portal, navigate to **Resource group** in the left navigation pane and select the resource group you want to delete.
1. Select **Delete resource group**. Verify deletion by entering the resource group name and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Developing blockchain applications using Azure Blockchain Service]()