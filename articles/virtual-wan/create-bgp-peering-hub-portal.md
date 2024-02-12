---
title: 'Configure BGP peering to an NVA: Azure portal'
titleSuffix: Azure Virtual WAN
description: Learn how to create a BGP peering with Virtual WAN hub router.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 10/30/2023
ms.author: cherylmc

---
# Configure BGP peering to an NVA - Azure portal

This article helps you configure an Azure Virtual WAN hub router to peer with a Network Virtual Appliance (NVA) in your virtual network using BGP Peering using the Azure portal. The virtual hub router learns routes from the NVA in a spoke VNet that is connected to a virtual WAN hub. The virtual hub router also advertises the virtual network routes to the NVA. For more information, see [Scenario: BGP peering with a virtual hub](scenario-bgp-peering-hub.md). You can also create this configuration using [Azure PowerShell](create-bgp-peering-hub-powershell.md).

:::image type="content" source="./media/create-bgp-peering-hub-portal/diagram.png" alt-text="Diagram of configuration.":::

## Prerequisites

Verify that you've met the following criteria before beginning your configuration:

[!INCLUDE [Before you begin](../../includes/virtual-wan-before-include.md)]

## Create a virtual WAN

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## Create a hub

A hub is a virtual network that can contain gateways for site-to-site, ExpressRoute, or point-to-site functionality. Once the hub is created, you'll be charged for the hub, even if you don't attach any sites.

[!INCLUDE [Create a hub](../../includes/virtual-wan-hub-basics.md)]

Once you have the settings configured, click **Review + Create** to validate, then click **Create**. The hub will begin provisioning. After the hub is created, go to the hub's **Overview** page. When provisioning is completed, the **Routing status** is **Provisioned**.

## Connect the VNet to the hub

After your hub router status is provisioned, create a connection between your hub and VNet.

[!INCLUDE [Connect a VNet to a hub](../../includes/virtual-wan-connect-vnet-hub-include.md)]

## Configure a BGP peer

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the portal page for your virtual WAN, in the left pane, select **Hubs** to view the list of hubs. Click a hub to configure a BGP peer.

1. On the **Virtual Hub** page, in the left pane, select **BGP Peers**. On the **BGP Peers** page, click **+ Add** to add a BGP peer.

    :::image type="content" source="./media/create-bgp-peering-hub-portal/bgp-peers.png" alt-text="Screenshot of BGP Peers page.":::

1. On the **Add BGP Peer** page, complete the following fields.

    * **Name** – Resource name to identify a specific BGP peer.
    * **ASN** – The ASN for the BGP peer.
    * **IPv4 address** – The IPv4 address of the BGP peer.
    * **Virtual Network connection** – Choose the connection identifier that corresponds to the Virtual network that hosts the BGP peer.

1. Click **Add** to complete the BGP peer configuration. You can view the peer on the **BGP Peers** page.

    :::image type="content" source="./media/create-bgp-peering-hub-portal/view-peer.png" alt-text="Screenshot of the BGP peers page with the new peer.":::

### Modify a BGP peer

1. On the **Virtual Hub** resource, go to the **BGP Peers** page.
1. Select the BGP peer.
1. Click **…** at the end of the line for the peer, then select **Edit** from the dropdown.
1. On the **Edit BGP Peer** page, make any necessary changes, then click **Add**.

### Delete a BGP peer

1. On the **Virtual Hub** resource, go to the **BGP Peers** page.
1. Select the BGP peer.
1. Click **…** at the end of the line for the peer, then select **Delete** from the dropdown.
1. Click **Confirm** to confirm that you want to delete this resource.

## Next steps

For more information about BGP scenarios, see [Scenario: BGP peering with a virtual hub](scenario-bgp-peering-hub.md).
