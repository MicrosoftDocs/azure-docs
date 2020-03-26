---
title: Enable Peering Service on a Direct peering using the portal
titleSuffix: Azure
description: Enable Peering Service on a Direct peering using the portal
services: internet-peering
author: derekolo
ms.service: internet-peering
ms.topic: article
ms.date: 3/18/2020
ms.author: derekol
---

# Enable Peering Service on a Direct peering using the portal

This article describes how to enable [Peering Service](overview-peering-service.md) on a Direct peering by using the portal.

If you prefer, you can complete this guide using the [PowerShell](howto-peering-service-powershell.md).

## Before you begin
* Review [prerequisites](prerequisites.md) before you begin configuration.
* Choose a Direct peering in your subscription you want to enable Peering Service on. If you do not have one, either convert a legacy Direct peering or create a new Direct peering.
    * To convert a legacy Direct peering, follow the instructions in [Convert a legacy Direct peering to Azure resource using the portal](howto-legacy-direct-portal.md).
    * To create a new Direct peering, follow the instructions in [Create or modify a Direct peering using the portal](howto-direct-portal.md).

## Enable Peering Service on a Direct peering

### <a name= get></a>View Direct peering
[!INCLUDE [peering-direct-get-portal](./includes/direct-portal-get.md)]

### <a name= get></a>Enable the Direct peering for Peering Service

After opening Direct peering in the previous step, enable it for Peering Service.
[!INCLUDE [peering-direct-modify](./includes/peering-service-direct-portal.md)]

## Modify a Direct peering connection

If you need to modify connection settings, refer to **Modify a Direct peering** section in [Create or modify a Direct peering using the portal](howto-direct-portal.md)

## Next steps

* [Create or modify Exchange peering using the portal](howto-exchange-portal.md)
* [Convert a legacy Exchange peering to Azure resource using the portal](howto-legacy-exchange-portal.md)

## Additional resources

For frequently asked questions, see [Peering Service FAQ](service-faqs.md).