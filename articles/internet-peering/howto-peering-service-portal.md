---
title: Enable Azure Peering Service on a Direct peering - Azure portal
description: Enable Azure Peering Service on a Direct peering using the Azure portal.
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 01/23/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
---

# Enable Azure Peering Service on a Direct peering using the Azure portal

> [!div class="op_single_selector"]
> - [Azure portal](howto-peering-service-portal.md)
> - [PowerShell](howto-peering-service-powershell.md)

This article describes how to enable [Azure Peering Service](../peering-service/about.md) on a Direct peering by using the Azure portal.

If you prefer, you can complete this guide by using [PowerShell](howto-peering-service-powershell.md).

## Before you begin
* Review the [prerequisites](prerequisites.md) before you begin configuration.
* Choose a Direct peering in your subscription for which you want to enable Peering Service. If you don't have one, either convert a legacy Direct peering or create a new Direct peering:
    * To convert a legacy Direct peering, follow the instructions in [Convert a legacy Direct peering to an Azure resource by using the portal](howto-legacy-direct-portal.md).
    * To create a new Direct peering, follow the instructions in [Create or modify a Direct peering by using the portal](howto-direct-portal.md).

## Enable Peering Service on a Direct peering

### <a name= get></a>View Direct peering
[!INCLUDE [peering-direct-get-portal](./includes/direct-portal-get.md)]

### <a name= get></a>Enable the Direct peering for Peering Service

After you open a Direct peering in the previous step, enable it for Peering Service.
[!INCLUDE [peering-direct-modify](./includes/peering-service-direct-portal.md)]

## Modify a Direct peering connection

To modify connection settings, see the "Modify a Direct peering" section in [Create or modify a Direct peering by using the portal](howto-direct-portal.md).

## Next steps

- For frequently asked questions, see the [Peering Service FAQ](faqs.md#peering-service).
- To learn how to manage an Exchange peering, see [Create or modify Exchange peering using the Azure portal](howto-exchange-portal.md).
- To learn how to convert an Exchange peering to an Azure resource, see [Convert a legacy Exchange peering to an Azure resource using the Azure portal](howto-legacy-exchange-portal.md).


