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

If you prefer, you can complete this guide using the [PowerShell](howto-legacydirect-arm.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Direct Peering walkthrough](workflows-direct.md) before you begin configuration.


## Convert legacy Direct Peering to Azure resource

### Sign in to  Azure portal  and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Convert legacy Direct Peering
[!INCLUDE [direct-peering-basic](./includes/direct-portal-basic.md)]

[!INCLUDE [direct-peering-configuration](./includes/direct-portal-configuration-legacy.md)]

### <a name=get></a>Verify Direct Peering
[!INCLUDE [peering-direct-get-portal](./includes/direct-portal-get.md)]

## Additional resources

For more information, please visit [Peering FAQs](faqs.md)

[!INCLUDE [peering-feedback](./includes/feedback.md)]

## Next steps

* [Create or modify a Direct Peering using Azure portal](howto-directpeering-arm-portal.md).

