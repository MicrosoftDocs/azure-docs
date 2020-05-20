---
title: Convert a legacy Exchange peering to an Azure resource by using the Azure portal
titleSuffix: Azure
description: Convert a legacy Exchange peering to an Azure resource by using the Azure portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Convert a legacy Exchange peering to an Azure resource by using the Azure portal

This article describes how to convert an existing legacy Exchange peering to an Azure resource by using the Azure portal.

If you prefer, you can complete this guide by using [PowerShell](howto-legacy-exchange-powershell.md).

## Before you begin
* Review the [prerequisites](prerequisites.md) and the [Exchange peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.

## Convert a legacy Exchange peering to an Azure resource

### Sign in to the portal and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Convert legacy Exchange peering

You can convert legacy peering connections by using the **Peering** resource.

#### Launch the resource and configure basic settings
[!INCLUDE [direct-peering-basic](./includes/direct-portal-basic.md)]

#### Configure connections and submit
[!INCLUDE [exchange-peering-configuration](./includes/exchange-portal-configuration-legacy.md)]

### <a name=get></a>Verify Exchange peering
[!INCLUDE [peering-exchange-get-portal](./includes/exchange-portal-get.md)]

## Additional resources

For more information, see [Internet peering FAQs](faqs.md).

## Next steps

* [Create or modify an Exchange peering by using the portal](howto-exchange-portal.md)
