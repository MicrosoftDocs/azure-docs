---
title: Firewall - Azure portal
description: In this tutorial , you learn how to configure application and network firewall rules 
services: firewall
author: vhorne
manager: jpconnock

ms.service: firewall
ms.topic: tutorial
ms.date: 6/1/2018
ms.author: victorh
ms.custom: mvc
#Customer intent: As an administrator I want xxx so that xxx.
---
# Tutorial: Configure Azure Firewall application and network rules using the Azure portal

Intro

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up the network
> * Create a firewall
> * Configure application and network firewall rules
> * Test the firewall

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Set up the environment

1. Create a resopurce group

    A resource group is a logical container into which Azure resources are deployed and managed. Create an Azure resource group using [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup).

   ```azurepowershell-interactive
   New-AzureRmResourceGroup -Name myResourceGroupFW -Location eastus
   ```
2. Create VNet
3. Create a subnet for the firewall
4. Create a subnet for your test servers
5. Create a test server in the server subnet
6. Create a public IP
7. Add routes for the 

## Create firewall

Placeholder

## Configure the route table

Placeholder

## Configure application rules

Placeholder - rule to allow some URLs

## Configure network rules

Placeholder - rule to allow DNS out, or perhaps RDP in

## Test the firewall

Test

## Clean up resources

When no longer needed, remove the resource group, firewall, and all related resources using [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup).

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroupFW
```

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Set up the network
> * Create a firewall
> * Configure application and network firewall rules
> * Test the firewall

Next, you can monitor the access logs, performance logs, and metrics.

> [!div class="nextstepaction"]
> [Diagnostics](./diagnostics.md)
