---
title: Exchange peering walkthrough
titleSuffix: Internet Peering
description: Get started with Exchange peering. Learn about the steps that you need to follow to provision and manage an Exchange peering.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 02/09/2024

#CustomerIntent: As an administrator, I want to learn about the requirements to create an Exchange peering so I can provision and manage Exchange peerings.
---

# Exchange peering walkthrough

In this article, you learn how to set up and manage an Exchange peering.

## Create an Exchange peering

:::image type="content" source="./media/walkthrough-exchange-all/exchange-peering.png" alt-text="Diagram showing Exchange peering workflow and connection states." lightbox="./media/walkthrough-exchange-all/exchange-peering.png":::

To provision an Exchange peering, complete the following steps:

1. Review Microsoft [peering policy](policy.md) to understand requirements for Exchange peering.
1. Find Microsoft peering location and peering facility ID in [PeeringDB](https://www.peeringdb.com/net/694)
1. Request Exchange peering for a peering location using the instructions in [Create and modify an Exchange peering](howto-exchange-portal.md).
1. After you submit a peering request, Microsoft will review the request and contact you if necessary.
1. Once peering request is approved, connection state changes to ***Approved***.
1. Configure BGP session at your end and notify Microsoft.
1. Microsoft provisions BGP session with DENY ALL policy and validate end-to-end.
1. If successful, you receive a notification that peering connection state is ***Active***.
1. Traffic is then allowed through the new peering.

> [!NOTE]
> Connection states are different than standard BGP session states.

## Convert a legacy Exchange peering to Azure resource

To convert a legacy Exchange peering to an Azure resource, complete the following steps:

1. Follow the instructions in [Convert a legacy Exchange peering to Azure resource](howto-legacy-exchange-portal.md)
1. After you submit the conversion request, Microsoft will review the request and contact you if necessary.
1. Once approved, you see your Exchange peering with a connection state as ***Active***.

## Deprovision an Exchange peering

Contact [Microsoft peering](mailto:peering@microsoft.com) to deprovision an Exchange peering.

When an Exchange peering is set for deprovision, the connection state changes to ***PendingRemove***.

> [!IMPORTANT]
> If you run PowerShell cmdlet to delete the Exchange peering when the connection state is ***ProvisioningStarted*** or ***ProvisioningCompleted***, the operation will fail.

## Related content

- Learn about the [Prerequisites to set up peering with Microsoft](prerequisites.md).
- Learn about the [Peering policy](policy.md).