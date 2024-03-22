---
title: Quickstart - Create Azure API Management instance - Bicep
description: Use this quickstart to create an Azure API Management instance in the Developer tier by using Bicep.
services: azure-resource-manager
author: mumian
ms.service: api-management
tags: azure-resource-manager, bicep
ms.custom: devx-track-bicep, subject-bicepqs, devx-track-azurecli, devx-track-azurepowershell
ms.topic: quickstart-bicep
ms.author: jgao
ms.date: 12/12/2023
---

# Quickstart: Create a new Azure API Management service instance using Bicep

This quickstart describes how to use a Bicep file to create an Azure API Management instance. You can also use Bicep for common management tasks such as importing APIs in your API Management instance.

[!INCLUDE [api-management-quickstart-intro](../../includes/api-management-quickstart-intro.md)]

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- For Azure CLI:

    [!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- For Azure PowerShell:


    [!INCLUDE [azure-powershell-requirements-no-header](../../includes/azure-powershell-requirements-no-header.md)]

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-api-management-create/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.apimanagement/azure-api-management-create/main.bicep":::

The following resource is defined in the Bicep file:

- **[Microsoft.ApiManagement/service](/azure/templates/microsoft.apimanagement/service)**

In this example, the Bicep file configures the API Management instance in the Developer tier, an economical option to evaluate Azure API Management. This tier isn't for production use.

More Azure API Management Bicep samples can be found in [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Apimanagement&pageNumber=1&sort=Popular).

## Deploy the Bicep file

You can use Azure CLI or Azure PowerShell to deploy the Bicep file.  For more information about deploying Bicep files, see [Deploy](../azure-resource-manager/bicep/deploy-cli.md).

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus

    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters publisherEmail=<publisher-email> publisherName=<publisher-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus

    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -publisherEmail "<publisher-email>" -publisherName "<publisher-name>"
    ```

    ---

    Replace **\<publisher-name\>** and **\<publisher-email\>** with the name of the API publisher's organization and the email address to receive notifications.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI or Azure PowerShell to list the deployed App Configuration resource in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

When your API Management service instance is online, you're ready to use it. Start with the tutorial to [import and publish](import-and-publish.md) your first API.

## Clean up resources

If you plan to continue working with subsequent tutorials, you might want to leave the API Management instance in place. When no longer needed, delete the resource group, which deletes the resources in the resource group.

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

> [!div class="nextstepaction"]
> [Tutorial: Import and publish your first API](import-and-publish.md)
