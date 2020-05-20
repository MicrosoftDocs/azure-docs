---
title: Create an Azure Blockchain Service member - Azure CLI
description: Create an Azure Blockchain Service member for a blockchain consortium using the Azure CLI.
ms.date: 03/30/2020
ms.topic: quickstart
ms.reviewer: ravastra
#Customer intent: As a network operator, I want use Azure Blockchain Service so that I can create a blockchain member on Azure
---

# Quickstart: Create an Azure Blockchain Service blockchain member using Azure CLI

In this quickstart, you deploy a new blockchain member and consortium in Azure Blockchain Service using Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

None.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.51 or later. Run `az --version` to find the version. If you need to install or upgrade, see [install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with the [az group create](https://docs.microsoft.com/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create \
                 --name myResourceGroup \
                 --location westus2
```

## Create a blockchain member

An Azure Blockchain Service member is a blockchain node in a private consortium blockchain network. When provisioning a member, you can create or join a consortium network. You need at least one member for a consortium network. The number of blockchain members needed by participants depends on your scenario. Consortium participants may have one or more blockchain members or they may share members with other participants. For more information on consortia, see [Azure Blockchain Service consortium](consortium.md).

There are several parameters and properties you need to pass. Replace the example parameters with your values.

```azurecli-interactive
az resource create \
                    --resource-group myResourceGroup \
                    --name myblockchainmember \
                    --resource-type Microsoft.Blockchain/blockchainMembers \
                    --is-full-object \
                    --properties '{"location":"westus2", "properties":{"password":"strongMemberAccountPassword@1", "protocol":"Quorum", "consortium":"myConsortiumName", "consortiumManagementAccountPassword":"strongConsortiumManagementPassword@1"}, "sku":{"name":"S0"}}'
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources are created. Use the resource group you created in the previous section.
| **name** | A unique name that identifies your Azure Blockchain Service blockchain member. The name is used for the public endpoint address. For example, `myblockchainmember.blockchain.azure.com`.
| **location** | Azure region where the blockchain member is created. For example, `westus2`. Choose the location that is closest to your users or your other Azure applications.
| **password** | The password for the member's default transaction node. Use the password for basic authentication when connecting to blockchain member's default transaction node public endpoint.
| **consortium** | Name of the consortium to join or create. For more information on consortia, see [Azure Blockchain Service consortium](consortium.md).
| **consortiumAccountPassword** | The consortium account password is also known as the member account password. The member account password is used to encrypt the private key for the Ethereum account that is created for your member. You use the member account and member account password for consortium management.
| **skuName** | Tier type. Use S0 for Standard and B0 for Basic. Use the *Basic* tier for development, testing, and proof of concepts. Use the *Standard* tier for production grade deployments. You should also use the *Standard* tier if you are using Blockchain Data Manager or sending a high volume of private transactions. Changing the pricing tier between basic and standard after member creation is not supported.

It takes about 10 minutes to create the blockchain member and supporting resources.

## Clean up resources

You can use the blockchain member you created for the next quickstart or tutorial. When no longer needed, you can delete the resources by deleting the `myResourceGroup` resource group you created for the quickstart.

Run the following command to remove the resource group and all related resources.

```azurecli-interactive
az group delete \
                 --name myResourceGroup \
                 --yes
```

## Next steps

In this quickstart, you deployed an Azure Blockchain Service member and a new consortium. Try the next quickstart to use Azure Blockchain Development Kit for Ethereum to attach to an Azure Blockchain Service member.

> [!div class="nextstepaction"]
> [Use Visual Studio Code to connect to Azure Blockchain Service](connect-vscode.md)
