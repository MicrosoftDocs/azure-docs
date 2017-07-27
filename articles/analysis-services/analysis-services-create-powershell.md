---
title: Azure PowerShell: Create an Analysis Services server | Microsoft Docs
description: Learn how to create an Azure Analysis Services server instance in by using PowerShell
services: sql-database
documentationcenter: ''
author: minewiskan
manager: erikre
editor: ''

ms.assetid: 
ms.service: analysis-services
ms.custom: mvc, intelligence & analytics
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: PowerShell
ms.topic: hero-article
ms.date: 07/25/2017
ms.author: owend
---

# Create an Analysis Services server by using PowerShell

PowerShell is used to create and manage Azure resources from the command line or in scripts. This guide details using PowerShell to create an Analysis Services server in an [Azure resource group](../azure-resource-manager/resource-group-overview.md).

This tutorial requires the Azure PowerShell module version 4.0 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). 

## Log in to Azure

Log in to your Azure subscription using the [Add-AzureRmAccount](/powershell/module/azurerm.profile/add-azurermaccount) command and follow the on-screen directions.

```powershell
Add-AzureRmAccount
```

## Create variables

Define variables for use in the scripts in this quick start.

```powershell
# The data center and resource name for your resources
$resourcegroupname = "myResourceGroup"
$name = "myServerName
$location = "WestUS"
# The logical server name: Use a random value or replace with your own value (do not capitalize)
$servername = "server-$(Get-Random)"
# Set an admin login and password for your database
# The login information for the server
$adminlogin = "ServerAdmin"
$password = "ChangeYourAdminPassword1"
# The ip address range that you want to allow to access your server - change as appropriate
$startip = "0.0.0.0"
$endip = "0.0.0.0"
# The database name
$databasename = "mySampleDatabase"
```

## Create a resource group

If you do not already have a resource group in which you want to create your server, you can create a new resource group.
Create an [Azure resource group](../azure-resource-manager/resource-group-overview.md) using the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command. A resource group is a logical container into which Azure resources are deployed and managed as a group. The following example creates a resource group named `myResourceGroup` in the `westeurope` location.

```powershell
New-AzureRmResourceGroup -Name $resourcegroupname -Location $location
```

## Create a server

Create a new server by using the [New-AzureRmAnalysisServicesServer](/powershell/module/azurerm.analysisservices/new-azurermanalysisservicesserver) command. 

```powershell
New-AzureRmAnalysisServicesServer
   [-ResourceGroupName] <String>
   [-Name] <String>
   [-Location] <String>
   [-Sku] <String>
   [[-Administrator] <String>]
   [[-Tag] <Hashtable>]
   [-Confirm]
   [-WhatIf]
   [<CommonParameters>]
```


## Clean up resources

Other quickstarts in this collection build upon this quickstart. 

Remove-AzureRmAnalysisServicesServer

> [!TIP]
> If you plan to continue on to work with subsequent quickstarts, do not clean up the resources created in this quick start. If you do not plan to continue, use the following steps to delete all resources created by this quickstart in the Azure portal.
>

```powershell
Remove-AzureRmAnalysisServicesServer
      [-Name] <String>
      [[-ResourceGroupName] <String>]
      [-PassThru]
      [-Confirm]
      [-WhatIf]
      [<CommonParameters>]
```

## Next steps



