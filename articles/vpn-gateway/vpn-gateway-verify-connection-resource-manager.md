---
title: Verify a VPN Gateway connection | Microsoft Docs
description: This article shows you how to verify a virtual network VPN Gateway connection.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: 7e3d1043-caa9-4472-96d3-832f4e2c91ee
ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/30/2017
ms.author: cherylmc

---
# Verify a VPN Gateway connection
You can verify your virtual network VPN Gateway connection by using the portal and by using PowerShell. This article contains steps for both the Resource Manager and classic deployment models.

## Verify using the Azure portal

[!INCLUDE [Azure portal](../../includes/vpn-gateway-verify-connection-portal-rm-include.md)]

## Verify using PowerShell

To verify by using PowerShell, install the latest version of the Azure Resource Manager PowerShell cmdlets. For information on installing PowerShell cmdlets, see [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs). For more information about using Resource Manager cmdlets, see [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

### Log in to your Azure account
1. Open your PowerShell console with elevated privileges and connect to your account.
   
        Login-AzureRmAccount
2. Check the subscriptions for the account.
   
        Get-AzureRmSubscription 
3. Specify the subscription that you want to use.
   
        Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"

### Verify your connection

[!INCLUDE [Powershell](../../includes/vpn-gateway-verify-connection-ps-rm-include.md)]

## Verify using the Azure portal (classic)
[!INCLUDE [Azure portal](../../includes/vpn-gateway-verify-connection-azureportal-classic-include.md)]


## Verify using PowerShell (classic)
To verify by using PowerShell, install the latest versions of the Azure PowerShell cmdlets. Be sure to download and install both the Resource Manager and Service Management (SM) versions. For information on installing PowerShell cmdlets, see [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs). 

### Log in to your Azure account
1. Open your PowerShell console with elevated privileges and connect to your account.
   
        Login-AzureRmAccount
2. Check the subscriptions for the account.
   
        Get-AzureRmSubscription 
3. Specify the subscription that you want to use.
   
        Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"
4. Log in to use the Service Management cmdlets for the classic deployment model.

		Add-AzureAccount

### Verify your connection
[!INCLUDE [Classic PowerShell](../../includes/vpn-gateway-verify-connection-ps-classic-include.md)]

## Next steps
* You can add virtual machines to your virtual networks. See [Create a Virtual Machine](../virtual-machines/virtual-machines-windows-hero-tutorial.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) for steps.

