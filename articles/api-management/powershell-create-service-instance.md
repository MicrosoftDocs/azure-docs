---
title: Create an Azure API Management instance using PowerShell | Microsoft Docs
description: Follow the steps of this tutorial to create a new Azure API Management instance.
services: api-management
documentationcenter: ''
author: vladvino
manager: cflower
editor: ''

ms.service: api-management
ms.workload: integration
ms.topic: quickstart
ms.custom: mvc
ms.date: 11/15/2017
ms.author: apimpm
---

# Create a new Azure API Management service instance

Azure API Management (APIM) helps organizations publish APIs to external, partner, and internal developers to unlock the potential of their data and services. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection. APIM  enables you to create and manage modern API gateways for existing backend services hosted anywhere. For more information, see the [Overview](api-management-key-concepts.md) topic.

This quickstart describes the steps for creating a new API Management instance using the PowerShell scripts. The quickstart shows you how to use the **Azure Cloud Shell** that you can run from Azure portal.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 3.6 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.


## Create resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. 

```azurepowershell-interactive
New-AzureRmResourceGroup -Name myResourceGroup -Location WestUS
```

## Create an API Management service

This is a long running operation and could take up to 15 minutes.

```azurepowershell-interactive
New-AzureRmApiManagement -ResourceGroupName "myResourceGroup" -Location "West US" -Name "apim-name" -Organization "myOrganization" -AdminEmail "myEmail" -Sku "Developer"
```

## Clean up resources

When no longer needed, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command to remove the resource group and all related resources.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Import and publish your first API](import-and-publish.md)
