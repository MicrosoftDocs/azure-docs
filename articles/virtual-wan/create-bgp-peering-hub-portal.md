---
title: Create a BGP peering with virtual hub - Azure portal
titleSuffix: Azure Virtual WAN
description: Learn how to create a BGP peering with Virtual WAN hub router.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 07/20/2022
ms.author: cherylmc

---
# How to create BGP peering with virtual hub- Azure portal

This article helps you configure an Azure Virtual WAN hub router to peer with a Network Virtual Appliance (NVA) in your virtual network using the Azure portal. The virtual hub router learns routes from the NVA in a spoke VNet that is connected to a virtual WAN hub. The virtual hub router also advertises the virtual network routes to the NVA. For more information, see [Scenario: BGP peering with a virtual hub](scenario-bgp-peering-hub.md).

:::image type="content" source="./media/create-bgp-peering-hub-portal/diagram.png" alt-text="Diagram of configuration.":::

## Prerequisites

Verify that you have met the following criteria before beginning your configuration:

[!INCLUDE [Before you begin](../../includes/virtual-wan-before-include.md)]

## <a name="openvwan"></a>Create a virtual WAN

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## <a name="hub"></a>Create a hub

A hub is a virtual network that can contain gateways for site-to-site, ExpressRoute, or point-to-site functionality. Once the hub is created, you'll be charged for the hub, even if you don't attach any sites.

[!INCLUDE [Create a hub](../../includes/virtual-wan-hub-basics.md)]

## <a name="vnet"></a>Connect the VNet to the hub

In this section, you create a connection between your hub and VNet.

[!INCLUDE [Connect a VNet to a hub](../../includes/virtual-wan-connect-vnet-hub-include.md)]

## Configure a BGP peer

1.	Sign in to the [Azure portal](https://portal.azure.com).

1.	On the portal page for your virtual WAN, in the **Connectivity** section, select **Hubs** to view the list of hubs. Click a hub to configure a BGP peer.

    :::image type="content" source="./media/create-bgp-peering-hub-portal/hubs.png" alt-text="Screenshot of hubs.":::

1.	On the **Virtual Hub** page, under the **Routing** section, select **BGP Peers** and click **+ Add** to add a BGP peer.

    :::image type="content" source="./media/create-bgp-peering-hub-portal/bgp-peers.png" alt-text="3.":::

1.	On the **Add BGP Peer** page, complete all the fields.

    :::image type="content" source="./media/create-bgp-peering-hub-portal/add-peer.png" alt-text="4.":::

    * **Name** – Resource name to identify a specific BGP peer. 
    * **ASN** – The ASN for the BGP peer.
    * **IPv4 address** – The IPv4 address of the BGP peer.
    * **Virtual Network connection** – Choose the connection identifier that corresponds to the Virtual network that hosts the BGP peer.

1.	Click **Add** to complete the BGP peer configuration and view the peer.

    :::image type="content" source="./media/create-bgp-peering-hub-portal/view-peer.png" alt-text="Screenshot of peer added.":::

## Modify a BGP peer

1. On the **Virtual Hub** resource, click **BGP Peers** and select the BGP peer. Click **…** then **Edit**.

    :::image type="content" source="./media/create-bgp-peering-hub-portal/modify.png" alt-text="Screenshot of edit.":::

1. Once the BGP peer is modified, click **Add** to save.

## Delete a BGP peer

1. On the **Virtual Hub** resource, click **BGP Peers** and select the BGP peer. Click **…** then **Delete**.

    :::image type="content" source="./media/create-bgp-peering-hub-portal/delete.png" alt-text="Screenshot of deleting a peer.":::

## Next steps

* For more information about BGP scenarios, see [Scenario: BGP peering with a virtual hub](scenario-bgp-peering-hub.md).
