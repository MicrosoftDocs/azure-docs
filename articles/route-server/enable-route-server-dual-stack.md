---
title: Enable IPv4/IPv6 dual-stack mode on Azure Route Server
description: Learn how to add an IPv6 prefix to an existing Azure Route Server subnet and enable dual-stack mode in the Azure portal.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: how-to
ms.date: 11/05/2026
ms.custom: references_regions
ai-usage: ai-assisted
#CustomerIntent: As an Azure network administrator, I want to enable dual-stack mode on an existing route server so that it can exchange IPv4 and IPv6 routes with configured connections.
---

# Enable IPv4/IPv6 dual-stack mode on Azure Route Server

Use the Azure portal to enable IPv4/IPv6 dual-stack mode on an existing IPv4-only Azure Route Server in a subscription where preview access is enabled. Add an IPv6 prefix to **RouteServerSubnet** before you change the route server configuration.

> [!IMPORTANT]
> Azure Route Server IPv4/IPv6 dual-stack mode is in public preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features in preview.

## Regional availability

Azure Route Server IPv4/IPv6 dual-stack mode is available in public preview only in the following Azure regions:

| Region | Programmatic name |
| --- | --- |
| East US 2 EUAP | `eastus2euap` |
| Central US EUAP | `centraluseuap` |
| West Central US | `westcentralus` |
| East Asia | `eastasia` |
| UK South | `uksouth` |
| Central US | `centralus` |
| Australia Central | `australiacentral` |
| Korea Central | `koreacentral` |
| Central India | `centralindia` |
| Brazil South | `brazilsouth` |
| Malaysia West | `malaysiawest` |

## Prerequisites

- An Azure Route Server deployed in a **RouteServerSubnet** that has only an IPv4 address prefix.
- The route server must be in a region listed in [Regional availability](#regional-availability).
- An IPv4/IPv6 dual-stack virtual network with an available IPv6 /64 prefix for **RouteServerSubnet**. The IPv6 prefix must be within the virtual network's IPv6 address space.

You can enable dual-stack mode with or without a network virtual appliance (NVA) peering, an ExpressRoute gateway connection, or a VPN gateway connection. Existing IPv4-only connections remain unchanged.

> [!IMPORTANT]
> Enabling dual-stack mode on an existing route server is irreversible. To return to IPv4-only mode, you must delete and recreate the route server. Review your routing dependencies before you make this change.

## Add an IPv6 prefix to RouteServerSubnet

1. In the [Azure portal](https://portal.azure.com), open the virtual network that contains your route server.
1. Under **Settings**, select **Subnets**, and then select **RouteServerSubnet**.

   :::image type="content" source="./media/enable-dual-stack/add-ipv6.png" alt-text="Screenshot of the Azure portal Edit subnet pane for RouteServerSubnet, with Add IPv6 highlighted." lightbox="./media/enable-dual-stack/add-ipv6.png":::

1. Select **Add IPv6**. Enter an available IPv6 /64 prefix from the virtual network's address space.

   :::image type="content" source="./media/enable-dual-stack/ipv6-subnet-prefix.png" alt-text="Screenshot of the Azure portal subnet form with an IPv6 starting address, a /64 size, and a /48 virtual network range." lightbox="./media/enable-dual-stack/ipv6-subnet-prefix.png":::

1. Select **Save** to update the subnet.

## Enable dual-stack mode

1. Open your Azure Route Server resource. Under **Settings**, select **Configuration**.
1. Set **Dual Stack Mode** to **Enabled**. Read the portal confirmation about the irreversible change, and then select **Save**.

The portal warns that enabling dual-stack mode is permanent and can take up to 40 minutes to complete.

> [!IMPORTANT]
> In a hub-and-spoke virtual network topology, adding an IPv6 address space to the hub virtual network and an IPv6 prefix to RouteServerSubnet causes the spoke virtual network peerings to become out of sync. Resync each peering to restore the correct peering configuration between the hub and spoke virtual networks.

## Verify the configuration

On the route server **Overview** page, confirm that **Provisioning state** and **Connectivity status** show **Succeeded**. On **Configuration**, confirm that **Dual Stack Mode** is **Enabled**.

:::image type="content" source="./media/dual-stack-enabled.png" alt-text="Screenshot of Azure Route Server Configuration with Dual Stack Mode set to Enabled." lightbox="./media/dual-stack-enabled.png":::

If you have connected peers or gateways, check the expected routes for each configured address family. An IPv4-only connection doesn't need to exchange IPv6 routes to complete this task. Route learning doesn't verify packet delivery.

If provisioning doesn't reach **Succeeded**, don't assume the route server is ready to exchange routes. Contact [Azure support](https://azure.microsoft.com/support/) for help before making further routing changes.

## Next steps

- To filter and summarize IPv4 and IPv6 routes, see [Configure dual-stack route maps by using the Azure portal](route-maps-dual-stack-portal.md).
- For an example of BGP peering with an NVA, see [Tutorial: Configure BGP peering between Azure Route Server and network virtual appliance (NVA)](peer-route-server-with-virtual-appliance.md).
- To inspect routes learned by Route Server, see [View effective routes](view-route-server-effective-routes.md).
