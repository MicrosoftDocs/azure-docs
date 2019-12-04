---
title: Enable Peering Service on a Direct Peering using Azure portal
description: Enable Peering Service on a Direct Peering using Azure portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Enable Peering Service on a Direct Peering using Azure portal

This article describes how to Enable Peering Service [Peering Service](internet-peering-service-overview.md) on a Direct Peering by using Azure portal

If you prefer, you can complete this guide using the [PowerShell](internet-peering-howto-peering-service.md).

## Before you begin
* Review [prerequisites](internet-peering-prerequisites.md) before you begin configuration.
* Choose a Direct Peering in your subscription you want to enable Peering Service on. If you do not have one, either convert a legacy Direct Peering or create a new Direct Peering.
    * To convert a legacy Direct Peering, follow the instructions in [Convert a legacy Direct Peering to Azure resource using Azure portal](internet-peering-howto-legacydirect-arm-portal.md).
    * To create a new Direct Peering, follow the instructions in [Create or modify a Direct Peering using Azure portal](internet-peering-howto-directpeering-arm-portal.md).

## Enable Peering Service on a Direct Peering

### <a name= get></a>1. View Direct Peering
[!INCLUDE [peering-direct-get-portal](./includes/internet-peering-direct-portal-get.md)]

### <a name= get></a>2. Enable the Direct Peering for Peering Service

After opening Direct Peering in the previous step, enable it for Peering Service.
[!INCLUDE [peering-direct-modify](./includes/internet-peering-direct-peeringservice-portal.md)]

## Modify a Direct Peering connection

If you need to modify connection settings, please refer to **Modify a Direct Peering** section in [Create or modify a Direct Peering using Azure portal](internet-peering-howto-directpeering-arm-portal.md)

## Next steps

* [Create or modify Exchange Peering using Azure portal](internet-peering-howto-exchangepeering-arm-portal.md)
* [Convert a legacy Exchange Peering to Azure resource using Azure portal](internet-peering-howto-legacyexchange-arm-portal.md)

## Additional Resources

For frequently asked questions, see [Peering Service FAQ](internet-peering-service-faqs.md).