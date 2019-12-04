---
title: Convert a legacy Direct Peering to Azure resource using Azure portal
description: Convert a legacy Direct Peering to Azure resource using Azure portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Convert a legacy Direct Peering to Azure resource using Azure portal

This article describes how to convert an existing legacy Direct Peering to Azure resource using Azure portal.

If you prefer, you can complete this guide using the [PowerShell](internet-peering-howto-legacydirect-arm.md).

## Before you begin
* Review [Prerequisites](internet-peering-prerequisites.md) and [Direct Peering walkthrough](internet-peering-workflows-direct.md) before you begin configuration.


## Convert legacy Direct Peering to Azure resource

### 1. Sign in to  Azure portal  and select your subscription
[!INCLUDE [Account](./includes/internet-peering-account-portal.md)]

### <a name=create></a> 2. Convert legacy Direct Peering
[!INCLUDE [direct-peering-basic](./includes/internet-peering-direct-portal-basic.md)]

[!INCLUDE [direct-peering-configuration](./includes/internet-peering-direct-portal-configuration-legacy.md)]

### <a name=get></a> 3. Verify Direct Peering
[!INCLUDE [peering-direct-get-portal](./includes/internet-peering-direct-portal-get.md)]

## Additional Resources

For more information, please visit [Peering FAQs](internet-peering-faqs.md)

[!INCLUDE [peering-feedback](./includes/internet-peering-feedback.md)]

## Next steps

* [Create or modify a Direct Peering using Azure portal](internet-peering-howto-directpeering-arm-portal.md).

