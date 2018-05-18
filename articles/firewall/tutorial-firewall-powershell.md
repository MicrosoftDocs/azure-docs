---
title: Firewall - Azure PowerShell
description: Learn how to create a firewall 
services: firewall
author: vhorne
manager: jpconnock

ms.service: firewall
ms.topic: tutorial
ms.date: 5/18/2018
ms.author: victorh
ms.custom: mvc
---
# Create an Azure Firewall using Azure PowerShell

Intro

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up the network
> * Create firewall
> * Other stuff

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use PowerShell locally, this tutorial requires the Azure PowerShell module version 3.6 or later. To find the version, run `Get-Module -ListAvailable AzureRM`. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure.

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create an Azure resource group using [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup).  

```azurepowershell-interactive
New-AzureRmResourceGroup -Name myResourceGroupAG -Location eastus
```

## Create network resources 


## Create firewall

Placeholder

## Test the firewall

Test

## Clean up resources

When no longer needed, remove the resource group, firewall, and all related resources using [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup).

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroupAG
```

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Set up the network
> * Create an firewall
> * Other stuff

> [!div class="nextstepaction"]
> [Overview](./overview.md)
