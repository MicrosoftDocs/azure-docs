---
title: Enable Peering Service on a Direct Peering using Portal
description: Enable Peering Service on a Direct Peering using Portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Enable Peering Service on a Direct Peering using Portal
> [!div class="op_single_selector"]
> * [Portal](peering-howto-peering-service-portal.md)
> * [PowerShell](peering-howto-peering-service.md)
>

This article describes how to Enable Peering Service [Peering Service](peering-service-overview.md) on a Direct Peering by using Azure Portal

## Before you begin
* Review [prerequisites](peering-prerequisites.md) before you begin configuration.
* Choose a Direct Peering in your subscription you want to enable Peering Service on. If you do not have one, either convert a legacy Direct Peering or create a new Direct Peering.
    * To convert a legacy Direct Peering, follow the instructions in [Convert a legacy Direct Peering to Azure resource using Portal](peering-howto-legacydirect-arm-portal.md).
    * To create a new Direct Peering, follow the instructions in [Create or modify a Direct Peering using Portal](peering-howto-directpeering-arm-portal.md).

## Enable Peering Service on a Direct Peering

### <a name= get></a>1. View Direct Peering
[!INCLUDE [peering-direct-get-portal](peering-direct-portal-get.md)]

### <a name= get></a>2. Enable the Direct Peering for Peering Service

After opening Direct Peering in the previous step, enable it for Peering Service.
[!INCLUDE [peering-direct-modify](peering-direct-peeringservice-portal.md)]

## Modify a Direct Peering connection

If you need to modify connection settings, please refer to **Modify a Direct Peering** section in [Create or modify a Direct Peering using Portal](peering-howto-directpeering-arm-portal.md)

## Additional Resources

For frequently asked questions, see [Peering Service FAQ](peering-service-faqs.md).