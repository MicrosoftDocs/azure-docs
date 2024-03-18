---
title: Manually failover an ExpressRoute circuits configured with maximum resiliency
description: This article shows you how to manually failover an ExpressRoute circuit that is configured with maximum resiliency.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 03/18/2024
ms.author: duau
---

# Manually failover an ExpressRoute circuit configured with maximum resiliency

When configuring an ExpressRoute circuit with maximum resiliency, you can manually failover the circuit to the secondary path. This article shows you how to manually failover an ExpressRoute circuit that is configured with maximum resiliency.

## Prerequisites

Before you can manually failover an ExpressRoute circuit, you must have the following:
* An ExpressRoute circuit that is configured with maximum resiliency. For more information, see [Configure maximum resiliency for an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md?pivots=expressroute-preview).

## Manually failover an ExpressRoute circuit

To manually failover an ExpressRoute circuit that is configured with maximum resiliency, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box, enter **ExpressRoute circuits** and select **ExpressRoute circuits** from the search results.

1. In the **ExpressRoute circuits** page, select the primary ExpressRoute circuit that you want to disable peering for to failover to the secondary path.

1. On the **Overview** page, select the peering that you want to disable.

    :::image type="content" source="./media/manual-failover/primary-circuit.png" alt-text="Screenshot of the the peering section of an ExpressRoute circuit on the overview page.":::

1.  Uncheck the checkbox next to **Enable IPv4 Peering** or **Enable IPv6 Peering** to disconnect the BGP peering. Then select **Save**. After you disable the peering, the primary path is disconnected and the secondary path becomes the active path.

    :::image type="content" source="./media/manual-failover/disable-private-peering-primary.png" alt-text="Screenshot of the private peering settings page for an ExpressRoute circuit.":::

1. To fail back over to the primary path, select the checkbox next to **Enable IPv4 Peering** or **Enable IPv6 Peering** to reconnect the BGP peering. Then select **Save**.

1. Go to the secondary ExpressRoute circuit and repeat steps 4 to disable the peering and failover to the primary path.

1. Once you have confirmed that failover is successful, ensure to enable peering again for the secondary circuit.

## Next steps

* Learn how to [plan and managed cost for Azure ExpressRoute](plan-manage-cost.md)
