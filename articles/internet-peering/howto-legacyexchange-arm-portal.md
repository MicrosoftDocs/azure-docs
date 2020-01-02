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

# Convert a legacy Exchange Peering to Azure resource using Azure portal

This article describes how to convert an existing legacy Exchange Peering to Azure resource using Azure portal.

If you prefer, you can complete this guide using the [PowerShell](howto-legacyexchange-arm.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Exchange Peering walkthrough](workflows-exchange.md) before you begin configuration.


## Convert a legacy Exchange Peering to Azure resource

### Sign in to  Azure portal  and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Convert legacy Exchange Peering
[!INCLUDE [exchange-peering-basic](./includes/direct-portal-basic.md)]

[!INCLUDE [exchange-peering-configuration](./includes/exchange-portal-configuration-legacy.md)]

### <a name=get></a>Verify Exchange Peering
[!INCLUDE [peering-exchange-get-portal](./includes/exchange-portal-get.md)]

## Additional resources

For more information, please visit [Peering FAQs](faqs.md)

[!INCLUDE [peering-feedback](./includes/feedback.md)]

## Next steps

* [Create or modify an Exchange Peering using Azure portal](howto-exchangepeering-arm-portal.md)
