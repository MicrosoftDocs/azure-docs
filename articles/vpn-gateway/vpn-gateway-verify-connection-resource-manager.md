---
title: Verify a gateway connection | Microsoft Docs
description: This article shows you how to verify a gateway connection in the Resource Manager deployment model
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: carmonm
editor: ''
tags: azure-resource-manager

ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/14/2016
ms.author: cherylmc

---
# Verify a gateway connection
You can verify your gateway connection in a few different ways. This article will show you how to verify the status of a Resource Manager gateway connection by using the Azure portal and by using PowerShell.

## Verify using PowerShell
You'll need to install the latest version of the Azure Resource Manager PowerShell cmdlets. For information on installing PowerShell cmdlets, see [How to install and configure Azure PowerShell](../powershell-install-configure.md). For more information about using Resource Manager cmdlets, see [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

### Step 1: Log in to your Azure account
1. Open your PowerShell console with elevated privileges and connect to your account.
   
        Login-AzureRmAccount
2. Check the subscriptions for the account.
   
        Get-AzureRmSubscription 
3. Specify the subscription that you want to use.
   
        Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"

### Step 2: Verify your connection
[!INCLUDE [verify connection powershell](../../includes/vpn-gateway-verify-connection-ps-rm-include.md)]

## Verify using the Azure portal
[!INCLUDE [verify connection portal](../../includes/vpn-gateway-verify-connection-portal-rm-include.md)]

## Next steps
* You can add virtual machines to your virtual networks. See [Create a Virtual Machine](../virtual-machines/virtual-machines-windows-hero-tutorial.md) for steps.

