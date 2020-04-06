---
title: Convert a legacy Direct peering to an Azure resource by using the Azure portal
titleSuffix: Azure
description: Convert a legacy Direct peering to an Azure resource by using the Azure portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Convert a legacy Direct peering to an Azure resource by using the Azure portal

This article describes how to convert an existing legacy Direct peering to an Azure resource by using the Azure portal.

If you prefer, you can complete this guide by using [PowerShell](howto-legacy-direct-powershell.md).

## Before you begin
* Review the [prerequisites](prerequisites.md) and the [Direct peering walkthrough](walkthrough-direct-all.md) before you begin configuration.


## Convert a legacy Direct peering to an Azure resource

### Sign in to the portal and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Convert a legacy Direct peering

You can convert legacy peering connections by using the **Peering** resource.

#### Launch the resource and configure basic settings
[!INCLUDE [direct-peering-basic](./includes/direct-portal-basic.md)]

#### Configure connections and submit
[!INCLUDE [direct-peering-configuration](./includes/direct-portal-configuration-legacy.md)]

### <a name=get></a>Verify Direct peering
[!INCLUDE [peering-direct-get-portal](./includes/direct-portal-get.md)]

## Additional resources

For more information, see [Internet peering FAQs](faqs.md).

## Next steps

* [Create or modify a Direct peering by using the portal](howto-direct-portal.md)
