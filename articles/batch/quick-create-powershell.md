---
title: Azure Quickstart - Run Batch job - PowerShell | Microsoft Docs
description: Quickly learn to run a Batch job with PowerShell
services: batch
documentationcenter: 
author: dlepow
manager: timlt
editor: 
tags: 

ms.assetid: 
ms.service: batch
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: 
ms.workload: 
ms.date: 10/23/2017
ms.author: danlep
ms.custom: mvc
---

# Create a Linux virtual machine with PowerShell

The Azure PowerShell module is used to create and manage Azure resources from the PowerShell command line or in scripts. This guide details using the Azure PowerShell module to .

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This quick start requires the Azure PowerShell module version 3.?? or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).




## Log in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

## Create resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed.

```powershell
New-AzureRmResourceGroup -Name myResourceGroup -Location eastus
```

## Create Batch account

Create a Batch account.

```powershell

```

Log in to the Batch account (or get account context?)


## Create Batch pool



```powershell

```



## Create a Batch job


```powershell

```




## Create sample tasks

 

```powershell

```

## View task status

```powershell
```


## View task output

```powershell
```



## Clean up resources

When no longer needed, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command to remove the resource group, Batch account, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Next steps

In this quick start, you’ve .... To learn more about Azure Batcj, continue to the tutorial for ....

> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
