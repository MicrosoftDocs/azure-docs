---
title: include file
description: include file
services: private-link
author: mbender
ms.service: azure-private-link
ms.topic: include
ms.date: 07/09/2026
ms.author: mbender-ms
ms.custom: include file
---

To begin your configuration, sign in to your Azure account:

```azurepowershell
# Sign in to your Azure account
Connect-AzAccount
```

Then, connect to your subscription:

```azurepowershell
# List all subscriptions
Set-AzContext -Subscription <subscriptionId>

# Register the Microsoft.Network resource provider
Register-AzResourceProvider -ProviderNamespace Microsoft.Network
```