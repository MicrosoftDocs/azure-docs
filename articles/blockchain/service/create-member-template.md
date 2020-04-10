---
title: Create an Azure Blockchain Service member by using Azure Resource Manager template
description: Learn how to create an Azure Blockchain Service member by using Azure Resource Manager template.
services: azure-resource-manager
author: PatAltimore
ms.service: azure-resource-manager
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: patricka
ms.date: 04/07/2020
---

<!-- ms.topic and ms.custom in the metadata section are required -->

# Create an Azure Blockchain Service member using an Azure Resource Manager template

In this quickstart, you deploy a new blockchain member and consortium in Azure Blockchain Service using an Azure Resource Manager template.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites

None.

## Create a blockchain member

### Review the template

<!-- The first sentence must be the following sentence. The link is the quickstart template from GitHub. The link must begin with https://github.com/Azure/azure-quickstart-templates/. -->

The template used in this quickstart is from [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/201-blockchain-asaservice/).

<!-- After the first sentence, add a JSON codefence that links to the quickstart template. Customers have provided feedback that they prefer to see the whole template; therefore, we recommend you include the whole template in your article. If your template is too long to show in the quickstart, you can instead add a sentence that says "The template for this article is too long to show here. To view the template, see ..."

The syntax for the codefence is: -->

[!code-json[<Azure Resource Manager template create blockchain member>](~/quickstart-templates/201-blockchain-asaservice/azuredeploy.json)]

Azure resources defined in the template:

* [**Microsoft.Blockchain/blockchainMembers**](https://docs.microsoft.com/azure/templates/microsoft.blockchain/blockchainmembers)

## Deploy the template

1. Select the following link to sign in to Azure and open a template.

    ```markdown
    [![Deploy to Azure](./media/create-member-template/deploy-to-azure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-blockchain-asaservice%2Fazuredeploy.json)
    ```

1. Specify the **x**: provide the Y and add .
1. Select **Purchase** to deploy the template.

  The Azure portal is used here to deploy the template. You can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md).

## Review deployed resources

<!-- You can also use the title "Validate the deployment"-->

## Clean up resources

When no longer needed, delete the resource group, which deletes the resources in the resource group.

<!--

Choose Azure CLI, Azure PowerShell, or Azure portal to delete the resource group. Use [Zone pivots](https://review.docs.microsoft.com/help/contribute/zone-pivots?branch=master) if you want to use multiple options.  Here are the samples for Azure CLI and Azure PowerShell:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

-->

## Next steps

<!-- You can either make the next steps similar to the next steps in your other quickstarts, or point users to the following tutorial.-->

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [ Tutorial: Create and deploy your first Azure Resource Manager template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template.md)