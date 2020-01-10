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

# Convert a legacy Direct peering to Azure resource using the portal

This article describes how to convert an existing legacy Direct peering to Azure resource using the portal.

If you prefer, you can complete this guide using the [PowerShell](howto-legacy-direct-powershell.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Direct peering walkthrough](walkthrough-direct-all.md) before you begin configuration.


## Convert legacy Direct peering to Azure resource

### Sign in to portal and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Convert legacy Direct peering

You can convert legacy peering connections using **Peering** resource.

#### Launch resource and configure basic settings
[!INCLUDE [direct-peering-basic](./includes/direct-portal-basic.md)]

#### Configure connections and submit
[!INCLUDE [direct-peering-configuration](./includes/direct-portal-configuration-legacy.md)]

### <a name=get></a>Verify Direct peering
[!INCLUDE [peering-direct-get-portal](./includes/direct-portal-get.md)]

## Additional resources

For more information, visit [Internet peering FAQs](faqs.md)

## Next steps

* [Create or modify a Direct peering using the portal](howto-direct-portal.md).
