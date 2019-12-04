---
title: Convert a legacy Direct Peering to Azure Resource using Portal
description: Convert a legacy Direct Peering to Azure Resource using Portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Convert a legacy Exchange Peering to Azure resource using Portal
> [!div class="op_single_selector"]
> * [Azure portal](internet-peering-howto-legacyexchange-arm-portal.md)
> * [PowerShell](internet-peering-howto-legacyexchange-arm.md)
>

This article describes how to convert an existing legacy Exchange Peering to Azure resource using Portal.

## Before you begin
* Review [Prerequisites](internet-peering-prerequisites.md) and [Exchange Peering Walkthrough](internet-peering-workflows-exchange.md) before you begin configuration.


## Convert a legacy Exchange Peering to Azure resource

### 1. Sign in to Azure portal and select your subscription
[!INCLUDE [Account](./includes/internet-peering-account-portal.md)]

### <a name=create></a> 2. Convert legacy Exchange Peering
[!INCLUDE [exchange-peering-basic](./includes/internet-peering-direct-portal-basic.md)]

[!INCLUDE [exchange-peering-configuration](./includes/internet-peering-exchange-portal-configuration-legacy.md)]

### <a name=get></a> 3. Verify Exchange Peering
[!INCLUDE [peering-exchange-get-portal](./includes/internet-peering-exchange-portal-get.md)]

## Additional Resources

For more information, please visit [Peering FAQs](internet-peering-faqs.md)

[!INCLUDE [peering-feedback](./includes/internet-peering-feedback.md)]

## Next steps

* [Create or modify an Exchange Peering using Portal](internet-peering-howto-exchangepeering-arm-portal.md)
