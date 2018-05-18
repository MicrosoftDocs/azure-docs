---
title: Quickstart - Azure Firewall
description: Learn how use Azure PowerShell to create an Azure Firewall
services: firewall
author: vhorne
manager: jpconnock
editor: ''

ms.service: firewall
ms.topic: quickstart
ms.date: 05/18/2018
ms.author: victorh
ms.custom: mvc
---

# Quickstart: Azure Firewall

Intro...

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 3.6 or later. To find the version, run `Get-Module -ListAvailable AzureRM` . If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure.

## Create a resource group

You need to always create resources in a resource group. Create an Azure resource group using [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). 

```azurepowershell-interactive
New-AzureRmResourceGroup -Name myResourceGroupAG -Location eastus
```



## Test the firewall

Test

## Clean up resources

First explore the resources that were created with the firewall, and then when no longer needed, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command to remove the resource group, firewall, and all related resources.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroupAG
```

## Next steps

> [!div class="nextstepaction"]
> [Manage web traffic with an application gateway using Azure PowerShell](./tutorial-manage-web-traffic-powershell.md)

