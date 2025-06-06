---
title: 'How to convert your legacy ExpressRoute gateway connections'
titleSufffix: Azure ExpressRoute
description: Learn how to delete your legacy connections and recreate them on improved hardware.
services: expressroute
author: mekaylamoore
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 02/13/2025
ms.author: duau
# Customer intent: As a network administrator, I want to convert my legacy ExpressRoute gateway connections to new configurations so that I can enhance performance, increase bandwidth, and avoid potential connectivity issues.
---

# How to convert your legacy ExpressRoute gateway connections

ExpressRoute gateways created or connected to circuits before 2017 have limitations that affect performance. This guide provides step-by-step instructions to migrate from legacy gateway connections. These limitations include restricted bandwidth, inability to upgrade to higher bandwidth SKUs, and inability to migrate to zone-redundant gateways. Converting to newer connections is recommended to avoid lower throughput and potential connectivity loss.


To begin the conversion, you need to delete all existing connections associated with the identified gateway.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to the virtual network gateway with legacy connections.
3. Identify and delete **all** existing connections. If you have multiple connections, delete each one individually, ensuring the previous connection is fully deleted before proceeding to the next.

    :::image type="content" source="media/howto-recreate-connections/delete-connections.png" alt-text="Screenshot of deleting ExpressRoute gateway connections.":::

> [!IMPORTANT]
> Ensure all connections are removed before recreating new connections.

For more information on how to delete connections, see Link a virtual network to ExpressRoute circuits ([Portal](expressroute-howto-linkvnet-portal-resource-manager.md), [PowerShell](expressroute-howto-linkvnet-arm.md), and [CLI](expressroute-howto-linkvnet-cli.md)).


## Recreate connections

After deleting the connections, you can proceed to recreate them.

1. Create new connections from the ExpressRoute virtual network gateway.

    :::image type="content" source="media/howto-recreate-connections/add-connections.png" alt-text="Screenshot of adding a ExpressRoute gateway connections.":::

2. Configure the new ExpressRoute connections based on the resiliency model of your previous connections.

    :::image type="content" source="media/howto-recreate-connections/create-connections.png" alt-text="Screenshot of creating ExpressRoute gateway connections.":::

3. Validate the new connections to ensure they're functioning correctly. Perform tests to verify that the connections are established and traffic is flowing as expected.

    :::image type="content" source="media/howto-recreate-connections/validate-connections.png" alt-text="Screenshot of validating new ExpressRoute gateway connections.":::

For more information on how to create connections, see Link a virtual network to ExpressRoute circuits ([Portal](expressroute-howto-linkvnet-portal-resource-manager.md#to-create-a-connection), [PowerShell](expressroute-howto-linkvnet-arm.md#connect-a-virtual-network), and [CLI](expressroute-howto-linkvnet-cli.md#connect-a-virtual-network-in-the-same-subscription-to-a-circuit)).

> [!NOTE]
> ExpressRoute gateway connections that aren't converted by February 28, 2025, might experience potential connectivity loss.
    
## Next steps

To learn more about ExpressRoute redundant gateways, see [About zone redundant virtual network gateway](../vpn-gateway/about-zone-redundant-vnet-gateways.md?toc=%2Fazure%2Fexpressroute%2Ftoc.json).
