---
title: Set up and monitor a direct peering
titleSuffix: Internet peering
description: Learn how to provision and manage a direct peering in Azure Peering Service.
ms.author: halkazwini
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 02/09/2024

#CustomerIntent: As an administrator, I want to learn about the requirements to create a direct peering in Azure Peering Service, so I can provision and manage direct peerings.
---

# Set up and monitor a direct peering

In this article, you learn how to set up and manage a direct peering in Azure Peering Service.

## Create a direct peering

:::image type="content" source="./media/walkthrough-direct-all/direct-peering.png" alt-text="Diagram showing the direct peering workflow and connection states." lightbox="./media/walkthrough-direct-all/direct-peering.png":::

To provision a direct peering:

1. Review the Microsoft [peering policy](policy.md) to understand requirements for direct peering.
1. Complete the steps in [Create or modify a direct peering](howto-direct-powershell.md) to submit a peering request.
1. After you submit a peering request, Microsoft contacts you by using your registered email address to provide a Letter of Authorization (LOA) or to provide other information.
1. When your peering request is approved, the connection state changes to **ProvisioningStarted**.

   Then, you complete these steps:

    1. Complete wiring according to the LOA.
    1. (Optional) Complete a link test by using the IP address range 169.254.0.0/16.
    1. Configure a Border Gateway Protocol (BGP) session.
    1. Notify Microsoft.

1. Microsoft provisions the BGP session with a DENY ALL policy and completes an end-to-end session validation.
1. If the provisioning is successful, you're notified that the peering connection state is **Active**.

Traffic is then allowed through the new peering.

> [!NOTE]
> Connection states are different from standard BGP session states.

## Convert a legacy direct peering to an Azure resource

To convert a legacy direct peering, complete the steps to [convert a legacy direct peering to an Azure resource](howto-legacy-direct-portal.md).

After you submit the conversion request, Microsoft reviews the request and contacts you if necessary.

If the request is approved, your direct peering appears with a connection state of **Active**.

## Deprovision a direct peering

To deprovision a direct peering, contact the [Microsoft peering](mailto:peering@microsoft.com) team.

When a direct peering is set to deprovision, the connection state changes to **PendingRemove**.

> [!NOTE]
> If you run a PowerShell cmdlet to delete a direct peering when the connection state is **ProvisioningStarted** or **ProvisioningCompleted**, the operation fails.

## Related content

- Learn about the [prerequisites to set up peering with Microsoft](prerequisites.md).
- Learn about [peering policy](policy.md).
