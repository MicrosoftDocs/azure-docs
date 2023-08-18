---
title: Exchange peering walkthrough
titleSuffix: Internet Peering
description: Get started with Exchange peering.
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 02/23/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
---

# Exchange peering walkthrough

In this article, you learn how to set up and manage an Exchange peering.

## Create an Exchange peering

:::image type="content" source="./media/walkthrough-exchange-all/exchange-peering.png" alt-text="Diagram showing Exchange peering workflow and connection states." lightbox="./media/walkthrough-exchange-all/exchange-peering.png":::

The following steps must be followed in order to provision an Exchange peering:
1. Review Microsoft [peering policy](policy.md) to understand requirements for Exchange peering.
1. Find Microsoft peering location and peering facility ID in [PeeringDB](https://www.peeringdb.com/net/694)
1. Request Exchange peering for a peering location using the instructions in [Create and modify an Exchange peering](howto-exchange-portal.md).
1. After you submit a peering request, Microsoft will review the request and contact you if necessary.
1. Once peering request is approved, connection state changes to *Approved*.
1. Configure BGP session at your end and notify Microsoft.
1. Microsoft provisions BGP session with DENY ALL policy and validate end-to-end.
1. If successful, you receive a notification that peering connection state is *Active*.
1. Traffic will then be allowed through the new peering.

> [!NOTE]
> Connection states aren't to be confused with standard BGP session states.

## Convert a legacy Exchange peering to Azure resource
The following steps must be followed in order to convert a legacy Exchange peering to Azure resource:
1. Follow the instructions in [Convert a legacy Exchange peering to Azure resource](howto-legacy-exchange-portal.md)
1. After you submit the conversion request, Microsoft will review the request and contact you if necessary.
1. Once approved, you see your Exchange peering with a connection state as *Active*.

## Deprovision Exchange peering

Contact [Microsoft peering](mailto:peering@microsoft.com) to deprovision Exchange peering.

When an Exchange peering is set for deprovision, you see the connection state as *PendingRemove*.

> [!NOTE]
> If you run PowerShell cmdlet to delete the Exchange peering when the connection state is *ProvisioningStarted* or *ProvisioningCompleted*, the operation will fail.

## Next steps

* Learn about the [Prerequisites to set up peering with Microsoft](prerequisites.md).
