---
title: Set up and manage an exchange peering
titleSuffix: Internet peering
description: Learn how to provision and manage an exchange peering in Azure Peering Service.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 02/09/2024

#CustomerIntent: As an administrator, I want to learn about the requirements to create an exchange peering in Azure Peering Service, so I can provision and manage exchange peerings.
---

# Set up and manage an exchange peering

In this article, you learn how to set up and manage an exchange peering in Azure Peering Service.

## Create an exchange peering

:::image type="content" source="./media/walkthrough-exchange-all/exchange-peering.png" alt-text="Diagram showing exchange peering workflow and connection states." lightbox="./media/walkthrough-exchange-all/exchange-peering.png":::

To provision an exchange peering:

1. Review the Microsoft [peering policy](policy.md) to understand the requirements for exchange peering.
1. Find a Microsoft peering location and peering facility ID on [PeeringDB](https://www.peeringdb.com/net/694).
1. Request exchange peering for a peering location by using the instructions in [Create and modify an exchange peering](howto-exchange-portal.md).
1. After you submit a peering request, Microsoft reviews the request and contacts you if necessary.
1. When the peering request is approved, the connection state changes to **Approved**.
1. Configure a Border Gateway Protocol (BGP) on your end and notify Microsoft.
1. Microsoft provisions the BGP session with a DENY ALL policy and completes an end-to-end session validation.
1. If validation is successful, you receive a notification that the peering connection state is **Active**.

Traffic is then allowed through the new peering.

> [!NOTE]
> Connection states are different from standard BGP session states.

## Convert a legacy exchange peering to Azure resource

To convert a legacy exchange peering to an Azure resource:

1. Complete the steps in [Convert a legacy exchange peering to Azure resource](howto-legacy-exchange-portal.md).
1. After you submit the conversion request, Microsoft reviews the request and contacts you if necessary.
1. When the conversion is approved, you see your exchange peering with a connection state of **Active**.

## Deprovision an exchange peering

To deprovision an exchange peering, contact the [Microsoft peering](mailto:peering@microsoft.com) team.

When an exchange peering is set for deprovision, the connection state changes to ***PendingRemove***.

> [!IMPORTANT]
> If you run PowerShell cmdlet to delete the exchange peering when the connection state is **ProvisioningStarted** or **ProvisioningCompleted**, the operation fails.

## Related content

- Learn about the [prerequisites to set up peering with Microsoft](prerequisites.md).
- Learn about [peering policy](policy.md).
