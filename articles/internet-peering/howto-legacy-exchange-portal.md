---
title: Convert a legacy Direct peering to Azure resource using the portal
titleSuffix: Azure
description: Convert a legacy Direct peering to Azure resource using the portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Convert a legacy Exchange peering to Azure resource using the portal

This article describes how to convert an existing legacy Exchange peering to Azure resource using the portal.

If you prefer, you can complete this guide using the [PowerShell](howto-legacy-exchange-powershell.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Exchange peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.

## Convert a legacy Exchange peering to Azure resource

### Sign in to portal and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Convert legacy Exchange peering

You can convert legacy peering connections using **Peering** resource.

#### Launch resource and configure basic settings
[!INCLUDE [direct-peering-basic](./includes/direct-portal-basic.md)]

#### Configure connections and submit
[!INCLUDE [exchange-peering-configuration](./includes/exchange-portal-configuration-legacy.md)]

### <a name=get></a>Verify Exchange peering
[!INCLUDE [peering-exchange-get-portal](./includes/exchange-portal-get.md)]

## Additional resources

For more information, visit [Internet peering FAQs](faqs.md)

## Next steps

* [Create or modify an Exchange peering using the portal](howto-exchange-portal.md)
