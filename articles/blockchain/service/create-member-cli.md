---
title: Create an Azure Blockchain Service member - Azure CLI
description: Create an Azure Blockchain Service member for a blockchain consortium using the Azure CLI.
ms.date: 07/23/2020
ms.topic: quickstart
ms.reviewer: ravastra
ms.custom: references_regions, devx-track-azurecli
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

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.51 or later. Run `az --version` to find the version. If you need to install or upgrade, see [install Azure CLI](/cli/azure/install-azure-cli).

## Prepare your environment

1. Sign in.

    Sign in using the [az login](/cli/azure/reference-index#az_login) command if you're using a local install of the CLI.

    ```azurecli
    az login
    ```

    Follow the steps displayed in your terminal to complete the authentication process.

1. Install the Azure CLI extension.

    When working with extension references for the Azure CLI, you must first install the extension.  Azure CLI extensions give you access to experimental and pre-release commands that have not yet shipped as part of the core CLI.  To learn more about extensions including updating and uninstalling, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).

    Install the [extension for Azure Blockchain Service](/cli/azure/blockchain) by running the following command:

    ```azurecli-interactive
    az extension add --name blockchain
    ```

1. Create a resource group.

    Azure Blockchain Service, like all Azure resources, must be deployed into a resource group. Resource groups allow you to organize and manage related Azure resources.

    For this quickstart, create a resource group named _myResourceGroup_ in the _eastus_ location with the following [az group create](/cli/azure/group#az_group_create) command:

    ```azurecli-interactive
    az group create \
                     --name "myResourceGroup" \
                     --location "eastus"
    ```

## Create a blockchain member

An Azure Blockchain Service member is a blockchain node in a private consortium blockchain network. When provisioning a member, you can create or join a consortium network. You need at least one member for a consortium network. The number of blockchain members needed by participants depends on your scenario. Consortium participants may have one or more blockchain members or they may share members with other participants. For more information on consortia, see [Azure Blockchain Service consortium](consortium.md).

There are several parameters and properties you need to pass. Replace the example parameters with your values.

```azurecli-interactive
az blockchain member create \
                            --resource-group "MyResourceGroup" \
                            --name "myblockchainmember" \
                            --location "eastus" \
                            --password "strongMemberAccountPassword@1" \
                            --protocol "Quorum" \
                            --consortium "myconsortium" \
                            --consortium-management-account-password "strongConsortiumManagementPassword@1" \
                            --sku "Basic"
```

| Parameter | Description |
|---------|-------------|
| **resource-group** | Resource group name where Azure Blockchain Service resources are created. Use the resource group you created in the previous section.
| **name** | A unique name that identifies your Azure Blockchain Service blockchain member. The name is used for the public endpoint address. For example, `myblockchainmember.blockchain.azure.com`.
| **location** | Azure region where the blockchain member is created. For example, `westus2`. Choose the location that is closest to your users or your other Azure applications. Features may not be available in some regions. Azure Blockchain Data Manager is available in the following Azure regions: East US and West Europe.
| **password** | The password for the member's default transaction node. Use the password for basic authentication when connecting to blockchain member's default transaction node public endpoint.
| **protocol** | Blockchain protocol. Currently, *Quorum* protocol is supported.
| **consortium** | Name of the consortium to join or create. For more information on consortia, see [Azure Blockchain Service consortium](consortium.md).
| **consortium-management-account-password** | The consortium account password is also known as the member account password. The member account password is used to encrypt the private key for the Ethereum account that is created for your member. You use the member account and member account password for consortium management.
| **sku** | Tier type. *Standard* or *Basic*. Use the *Basic* tier for development, testing, and proof of concepts. Use the *Standard* tier for production grade deployments. Also use the *Standard* tier if you are using Blockchain Data Manager or sending a high volume of private transactions. Changing the pricing tier between basic and standard after member creation is not supported.

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
