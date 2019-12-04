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

# Convert a legacy Direct Peering to Azure Resource using Portal
> [!div class="op_single_selector"]
> * [Portal](internet-peering-howto-legacydirect-arm-portal.md)
> * [PowerShell](internet-peering-howto-legacydirect-arm.md)
>

This article describes how to convert an existing legacy Direct Peering to Azure resource using Azure Portal.


## Before you begin
* Review [Prerequisites](internet-peering-prerequisites.md) and [Direct Peering Walkthrough](internet-peering-workflows-direct.md) before you begin configuration.


## Convert legacy Direct Peering to Azure Resource

### 1. Sign in to Azure portal and select your subscription
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

* [Create or modify a Direct Peering using Portal](internet-peering-howto-directpeering-arm-portal.md).

