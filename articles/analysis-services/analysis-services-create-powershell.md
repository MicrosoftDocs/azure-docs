---
title: Create an Azure Analysis Services server by using PowerShell | Microsoft Docs
description: Learn how to create an Azure Analysis Services server by using PowerShell
services: analysis-services
documentationcenter: ''
author: minewiskan
manager: erikre
editor: ''

ms.assetid: 
ms.service: analysis-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 08/01/2017
ms.author: owend
ms.custom: mvc

---

# Create an Azure Analysis Services server by using PowerShell

This quickstart describes using PowerShell from the command line to create an Azure Analysis Services server in an [Azure resource group](../azure-resource-manager/resource-group-overview.md) in your Azure subscription.

This task requires Azure PowerShell module version 4.0 or later. To find the version, run ` Get-Module -ListAvailable AzureRM`. To install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). 

> [!NOTE]
> Creating a server might result in a new billable service. To learn more, see [Analysis Services pricing](https://azure.microsoft.com/pricing/details/analysis-services/).

## Prerequisites
To complete this quickstart, you need:

* **Azure subscription**: Visit [Azure Free Trial](https://azure.microsoft.com/offers/ms-azr-0044p/) to create an account.
* **Azure Active Directory**: Your subscription must be associated with an Azure Active Directory tenant and you must have an account in that directory. To learn more, see [Authentication and user permissions](analysis-services-manage-users.md).

## Import AzureRm.AnalysisServices module
To create a server in your subscription, you use the [AzureRM.AnalysisServices](https://www.powershellgallery.com/packages/AzureRM.AnalysisServices)  component module. Load the AzureRm.AnalysisServices module into your PowerShell session.

```powershell
Import-Module AzureRM.AnalysisServices
```

## Sign in to Azure

Sign in to your Azure subscription by using the [Add-AzureRmAccount](/powershell/module/azurerm.profile/add-azurermaccount) command. Follow the on-screen directions.

```powershell
Add-AzureRmAccount
```

## Create a resource group
 
An [Azure resource group](../azure-resource-manager/resource-group-overview.md) is a logical container where Azure resources are deployed and managed as a group. When you create your server, you must specify a resource group in your subscription. If you do not already have a resource group, you can create a new one by using the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command. The following example creates a resource group named `myResourceGroup` in the West US region.

```powershell
New-AzureRmResourceGroup -Name "myResourceGroup" -Location "West US"
```

## Create a server

Create a new server by using the [New-AzureRmAnalysisServicesServer](/powershell/module/azurerm.analysisservices/new-azurermanalysisservicesserver) command. The following example creates a server named myServer in myResourceGroup, in the West US region, at the D1 tier, and specifies philipc@adventureworks.com as a server administrator.

```powershell
New-AzureRmAnalysisServicesServer -ResourceGroupName "myResourceGroup" -Name "myServer" -Location West US -Sku D1 -Administrator "philipc@adventure-works.com"
```

## Clean up resources

You can remove the server from your subscription by using the [Remove-AzureRmAnalysisServicesServer](/powershell/module/azurerm.analysisservices/new-azurermanalysisservicesserver) command. If you continue with other quickstarts and tutorials in this collection, do not remove your server. The following example removes the server created in the previous step.


```powershell
Remove-AzureRmAnalysisServicesServer -Name "myServer" -ResourceGroupName "myResourceGroup"
```

## Next steps
[Manage Azure Analysis Services with PowerShell](analysis-services-powershell.md)   
[Deploy a model from SSDT](analysis-services-deploy.md)   
[Create a model in Azure portal](analysis-services-create-model-portal.md)