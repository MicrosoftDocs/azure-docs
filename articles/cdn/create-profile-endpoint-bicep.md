---
title: 'Quickstart: Create a profile and endpoint - Bicep'
titleSuffix: Azure Content Delivery Network
description: In this quickstart, learn how to create an Azure Content Delivery Network profile and endpoint by using a Bicep file
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
ms.date: 03/20/2024
ms.author: duau
---

# Quickstart: Create an Azure Content Delivery Network profile and endpoint - Bicep

Get started with Azure Content Delivery Network by using a Bicep file. The Bicep file deploys a profile and an endpoint.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/cdn-with-custom-origin/).

This Bicep file is configured to create a:

- Profile
- Endpoint

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.cdn/cdn-with-custom-origin/main.bicep":::

One Azure resource is defined in the Bicep file:

- **[Microsoft.Cdn/profiles](/azure/templates/microsoft.cdn/profiles)**

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either the Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters profileName=<profile-name> endpointName=<endpoint-name> originUrl=<origin-url>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -profileName "<profile-name>" -endpointName "<endpoint-name>" -originUrl "<origin-url>"
    ```

    ---

    > [!NOTE]
    > Replace **\<profile-name\>** with the name of the content delivery network profile. Replace **\<endpoint-name\>** with a unique content delivery network endpoint name. Replace **\<origin-url\>** with the URL of the origin.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, the Azure CLI, or Azure PowerShell to list the deployed resources in the resource group. Verify that an Endpoint and content delivery network profile were created in the resource group.

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

When no longer needed, use the Azure portal, the Azure CLI, or Azure PowerShell to delete the resource group and its resources.

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

In this quickstart, you created a:

- Content delivery network Profile
- Endpoint

To learn more about Azure Content Delivery Network, continue to the article below.

> [!div class="nextstepaction"]
> [Tutorial: Use content delivery network to serve static content from a web app](cdn-add-to-web-app.md)
