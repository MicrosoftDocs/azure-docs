---
title: 'Quickstart: Create a profile and endpoint - Resource Manager template'
titleSuffix: Azure Content Delivery Network
description: In this quickstart, learn how to create an Azure Content Delivery Network profile and endpoint a Resource Manager template
services: cdn
author: duongau
manager: KumudD
ms.service: azure-cdn
ms.tgt_pltfrm: na
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
ms.date: 02/27/2023
ms.author: duau
---

# Quickstart: Create an Azure CDN profile and endpoint - ARM template

Get started with Azure Content Delivery Network (CDN) by using an Azure Resource Manager template (ARM template). The template deploys a profile and an endpoint.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.cdn%2Fcdn-with-custom-origin%2Fazuredeploy.json)

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/cdn-with-custom-origin/).

This template is configured to create a:

* Profile
* Endpoint

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.cdn/cdn-with-custom-origin/azuredeploy.json":::

One Azure resource is defined in the template:

* **[Microsoft.Cdn/profiles](/azure/templates/microsoft.cdn/profiles)**

## Deploy the template

### Azure CLI

```azurecli-interactive
read -p "Enter the location (i.e. eastus): " location
resourceGroupName="myResourceGroupCDN"
templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.cdn/cdn-with-custom-origin/azuredeploy.json"

az group create \
--name $resourceGroupName \
--location $location

az deployment group create \
--resource-group $resourceGroupName \
--template-uri  $templateUri
```

### PowerShell

```azurepowershell-interactive
$location = Read-Host -Prompt "Enter the location (i.e. eastus)"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.cdn/cdn-with-custom-origin/azuredeploy.json"

$resourceGroupName = "myResourceGroupCDN"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri
```

### Portal

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.cdn%2Fcdn-with-custom-origin%2Fazuredeploy.json)

## Review deployed resources

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **Resource groups** from the left pane.

3. Select the resource group that you created in the previous section. The default resource group name is **myResourceGroupCDN**

4. Verify the following resources were created in the resource group:

    :::image type="content" source="media/create-profile-endpoint-template/cdn-profile-template-rg.png" alt-text="Azure CDN resource group" border="true":::

## Clean up resources

### Azure CLI

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group and all resources contained within.

```azurecli-interactive
  az group delete \
    --name myResourceGroupCDN
```

### PowerShell

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group and all resources contained within.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroupCDN
```

### Portal

When no longer needed, delete the resource group, CDN profile, and all related resources. Select the resource group **myResourceGroupCDN** that contains the CDN profile and endpoint, and then select **Delete**.

## Next steps

In this quickstart, you created a:

* CDN Profile
* Endpoint

To learn more about Azure CDN and Azure Resource Manager, continue to the next article:

> [!div class="nextstepaction"]
> [Tutorial: Use CDN to serve static content from a web app](cdn-add-to-web-app.md)
