---
title: Create an Azure Blockchain Service member by using Azure Resource Manager template
description: Learn how to create an Azure Blockchain Service member by using Azure Resource Manager template.
services: azure-resource-manager
author: PatAltimore
ms.service: azure-resource-manager
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: patricka
ms.date: 04/15/2020
---

# Create an Azure Blockchain Service member using an Azure Resource Manager template

In this quickstart, you deploy a new blockchain member and consortium in Azure Blockchain Service using an Azure Resource Manager template.

An Azure Blockchain Service member is a blockchain node in a private consortium blockchain network. When provisioning a member, you can create or join a consortium network. You need at least one member for a consortium network. The number of blockchain members needed by participants depends on your scenario. Consortium participants may have one or more blockchain members or they may share members with other participants. For more information on consortia, see [Azure Blockchain Service consortium](consortium.md).

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/201-blockchain-asaservice/).

[!code-json[<Azure Resource Manager template create blockchain member>](~/quickstart-templates/201-blockchain-asaservice/azuredeploy.json)]

Azure resources defined in the template:

* [**Microsoft.Blockchain/blockchainMembers**](https://docs.microsoft.com/azure/templates/microsoft.blockchain/blockchainmembers)

## Deploy the template

1. Select the following link to sign in to Azure and open a template.

    [![Deploy to Azure](./media/create-member-template/deploy-to-azure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-blockchain-asaservice%2Fazuredeploy.json)

1. Specify the Blockchain **Member name** and **Member password**.

    Available locations for the deployment are *westeurope, eastus, southeastasia, westeurope, northeurope, westus2*, and *japaneast*.

    By default, the example template uses the *Basic* pricing tier, a consortium name based on the member name, and the same value for the member and consortium management account password.

1. Select **Purchase** to deploy the template.

  The Azure portal is used here to deploy the template. You can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../../azure-resource-manager/templates/deploy-powershell.md).

## Clean up resources

You can use the blockchain member you created for the next quickstart or tutorial. When no longer needed, you can delete the resources by deleting the resource group you created for the quickstart.

To delete the resource group:

1. In the Azure portal, navigate to **Resource group** in the left navigation pane and select the resource group you want to delete.
2. Select **Delete resource group**. Verify deletion by entering the resource group name and select **Delete**.

## Next steps

In this quickstart, you deployed an Azure Blockchain Service member and a new consortium. Try the next quickstart to use Azure Blockchain Development Kit for Ethereum to attach to an Azure Blockchain Service member.

> [!div class="nextstepaction"]
> [Use Visual Studio Code to connect to Azure Blockchain Service](connect-vscode.md)