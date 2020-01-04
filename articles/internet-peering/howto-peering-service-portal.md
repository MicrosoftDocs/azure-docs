---
title: Enable Peering Service on a Direct Peering using the portal
description: Enable Peering Service on a Direct Peering using the portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Enable Peering Service on a Direct Peering using the portal

This article describes how to Enable Peering Service [Peering Service](service-overview.md) on a Direct Peering by using the portal

If you prefer, you can complete this guide using the [PowerShell](howto-peering-service.md).

## Before you begin
* Review [prerequisites](prerequisites.md) before you begin configuration.
* Choose a Direct Peering in your subscription you want to enable Peering Service on. If you do not have one, either convert a legacy Direct Peering or create a new Direct Peering.
    * To convert a legacy Direct Peering, follow the instructions in [Convert a legacy Direct Peering to Azure resource using the portal](howto-legacy-direct-portal.md).
    * To create a new Direct Peering, follow the instructions in [Create or modify a Direct Peering using the portal](howto-direct-peering-portal.md).

## Enable Peering Service on a Direct Peering

### <a name= get></a>View Direct Peering
[!INCLUDE [peering-direct-get-portal](./includes/direct-portal-get.md)]

### <a name= get></a>Enable the Direct Peering for Peering Service

After opening Direct Peering in the previous step, enable it for Peering Service.
[!INCLUDE [peering-direct-modify](./includes/direct-peering-service-portal.md)]

## Modify a Direct Peering connection

If you need to modify connection settings, refer to **Modify a Direct Peering** section in [Create or modify a Direct Peering using the portal](howto-direct-peering-portal.md)

## Next steps

* [Create or modify Exchange Peering using the portal](howto-exchange-peering-portal.md)
* [Convert a legacy Exchange Peering to Azure resource using the portal](howto-legacy-exchange-portal.md)

## Additional resources

For frequently asked questions, see [Peering Service FAQ](service-faqs.md).