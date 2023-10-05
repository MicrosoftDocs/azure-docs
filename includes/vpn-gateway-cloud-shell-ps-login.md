---
author: cherylmc
ms.author: cherylmc
ms.date: 06/14/2023
ms.service: vpn-gateway
ms.topic: include
---
**If you're using Azure Cloud Shell** you'll automatically be directed to sign into your account after you open Cloudshell. You don't need to run `Connect-AzAccount`. Once signed in, you can still change subscriptions if necessary by using `Get-AzSubscription` and `Select-AzSubscription`.

**If you're running PowerShell locally**, open the PowerShell console with elevated privileges and connect to your Azure account. The `Connect-AzAccount` cmdlet prompts you for credentials. After you authenticate, it downloads your account settings so that they're available to Azure PowerShell. You can change subscription by using `Get-AzSubscription` and `Select-AzSubscription -SubscriptionName "Name of subscription"`.