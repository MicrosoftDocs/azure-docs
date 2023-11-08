---
title: 'Quickstart: Deploy using Bicep'
titleSuffix: Azure AI Search
description: You can quickly deploy an Azure AI Search service instance using Bicep.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
ms.date: 06/29/2023
---

# Quickstart: Deploy Azure AI Search using Bicep

This article walks you through the process for using a Bicep file to deploy an Azure AI Search resource in the Azure portal.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

Only those properties included in the template are used in the deployment. If more customization is required, such as [setting up network security](search-security-overview.md#network-security), you can update the service as a post-deployment task. To customize an existing service with the fewest steps, use [Azure CLI](search-manage-azure-cli.md) or [Azure PowerShell](search-manage-powershell.md). If you're evaluating preview features, use the [Management REST API](search-manage-rest.md).

> [!TIP]
> For an alternative Bicep template that deploys Azure AI Search with a pre-configured indexer to Cosmos DB for NoSQL, see [Bicep deployment of Azure AI Search](https://github.com/Azure-Samples/azure-search-deployment-template). The template creates an indexer, index, and data source. The indexer runs on a schedule that refreshes from Cosmos DB on a 5-minute interval.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-search-create/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.search/azure-search-create/main.bicep":::

The Azure resource defined in this Bicep file:

- [Microsoft.Search/searchServices](/azure/templates/Microsoft.Search/searchServices): create an Azure AI Search service

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters serviceName=<service-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -serviceName "<service-name>"
    ```

    ---

    > [!NOTE]
    > Replace **\<service-name\>** with the name of the Search service. The service name must only contain lowercase letters, digits, or dashes. You can't use a dash as the first two characters or the last character. The name has a minimum length of 2 characters and a maximum length of 60 characters.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

Other Azure AI Search quickstarts and tutorials build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave this resource in place. When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you created an Azure AI Search service using a Bicep file, and then validated the deployment. To learn more about Azure AI Search and Azure Resource Manager, continue on to the articles below.

- Read an [overview of Azure AI Search](search-what-is-azure-search.md).
- [Create an index](search-get-started-portal.md) for your search service.
- [Create a demo app](search-create-app-portal.md) using the portal wizard.
- [Create a skillset](cognitive-search-quickstart-blob.md) to extract information from your data.
