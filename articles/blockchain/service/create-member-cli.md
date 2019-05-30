---
title: Create an Azure Blockchain Service using Azure CLI
description: Use Azure Blockchain Service to create a blockchain member using Azure CLI.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 05/29/2019
ms.topic: quickstart
ms.service: azure-blockchain
ms.reviewer: seal
manager: femila
#Customer intent: As a network operator, I want use Azure Blockchain Service so that I can create a blockchain member on Azure
---

# Quickstart: Create an Azure Blockchain Service blockchain member using Azure CLI

Azure Blockchain Service is a blockchain platform you can use to execute your business logic within a smart contract. This quickstart shows you how to get started by creating a blockchain member using Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.51 or later. Run `az --version` to find the version. If you need to install or upgrade, see [install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with the [az group create](https://docs.microsoft.com/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create a blockchain member

Create a blockchain member in Azure Blockchain Service that runs the Quorum ledger protocol in a new consortium. There are several parameters and properties you need to pass. Replace the example parameters with your values.

```azurecli-interactive
az resource create --resource-group myResourceGroup --name myblockchainmember --resource-type Microsoft.Blockchain/blockchainMembers --is-full-object --properties "{ \"location\": \"eastus\", \"properties\": {\"password\": \"strongMemberAccountPassword@1\", \"protocol\": \"Quorum\", \"consortium\": \"myConsortiumName\", \"consortiumManagementAccountPassword\": \"strongConsortiumManagementPassword@1\" }, \"sku\": { \"name\": \"S0\" } }"
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources are created. Use the resource group you created in the previous section.
| **name** | A unique name that identifies your Azure Blockchain Service blockchain member. The name is used for the public endpoint address. For example, `myblockchainmember.blockchain.azure.com`.
| **location** | Azure region where the blockchain member is created. For example, `eastus`. Choose the location that is closest to your users or your other Azure applications.
| **password** | The password for the member's default transaction node. Use the password for basic authentication when connecting to blockchain member's default transaction node public endpoint.
| **consortium** | Name of the consortium to join or create.
| **consortiumAccountPassword** | The consortium account password is also known as the member account password. The member account password is used to encrypt the private key for the Ethereum account that is created for your member. You use the member account and member account password for consortium management.
| **skuName** | Tier type. Use S0 for Standard and B0 for Basic.

It takes about 10 minutes to create the blockchain member and supporting resources.

## Clean up resources

You can use the blockchain member you created for the next quickstart or tutorial. When no longer needed, you can delete the resources by deleting the `myResourceGroup` resource group you created by the Azure Blockchain Service.

Run the following command to remove the resource group and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes
```

## Next steps

Now that you have created a blockchain member, try one of the connection quickstarts for [Geth](connect-geth.md), [MetaMask](connect-metamask.md), or [Truffle](connect-truffle.md).

> [!div class="nextstepaction"]
> [Use Truffle to connect to a an Azure Blockchain Service network](connect-truffle.md)
