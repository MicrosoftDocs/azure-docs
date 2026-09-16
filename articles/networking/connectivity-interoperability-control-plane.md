---
title: Interoperability in Azure - Control plane analysis
description: This article provides the control plane analysis of the test setup you can use to analyze interoperability between ExpressRoute, a site-to-site VPN, and virtual network peering in Azure.
author: asudbring
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 08/05/2026
ms.author: allensu
ms.custom: sfi-image-nochange
# Customer intent: As a network architect, I want to analyze control plane configurations for interoperability between ExpressRoute, VPN connections, and virtual network peering, so that I can ensure optimal network routing and connectivity across cloud and on-premises environments.
---

# Interoperability in Azure - Control plane analysis

This article describes the control plane analysis of the test setup. You can also review the test setup configuration and the data plane analysis of the test setup.

Control plane analysis essentially examines routes that are exchanged between networks within a topology. Control plane analysis can help you understand how different networks view the topology.

## Hub and spoke virtual network perspective

The following figure illustrates the network from the perspective of a hub virtual network and a spoke virtual network (highlighted in blue). The figure also shows the autonomous system number (ASN) of different networks and routes that are exchanged between different networks: 

:::image type="content" source="./media/backend-interoperability/hubview.png" alt-text="Diagram of hub and spoke virtual network perspective of the topology.":::

The ASN of the virtual network's Azure ExpressRoute gateway is different from the ASN of Microsoft Enterprise edge routers (MSEEs). An ExpressRoute gateway uses a private ASN (a value of **65515**) and MSEEs use public ASN (a value of **12076**) globally. When you configure ExpressRoute peering, because MSEE is the peer, you use **12076** as the peer ASN. On the Azure side, MSEE establishes eBGP peering with the ExpressRoute gateway. The dual eBGP peering that the MSEE establishes for each ExpressRoute peering is transparent at the control plane level. Therefore, when you view an ExpressRoute route table, you see the virtual network's ExpressRoute gateway ASN for the VNet's prefixes. 

The following figure shows a sample ExpressRoute route table: 

:::image type="content" source="./media/backend-interoperability/exr1-routetable.png" alt-text="Diagram of ExpressRoute 1 route table.":::

Within Azure, the ASN is significant only from a peering perspective. By default, the ASN of both the ExpressRoute gateway and the VPN gateway in Azure VPN Gateway is **65515**.

## On-premises Location 1 and the remote virtual network perspective via ExpressRoute 1

Both on-premises Location 1 and the remote virtual network are connected to the hub virtual network via ExpressRoute 1. They share the same perspective of the topology, as shown in the following diagram:

:::image type="content" source="./media/backend-interoperability/loc1exrview.png" alt-text="Diagram of location 1 and remote virtual network perspective of the topology via ExpressRoute 1.":::

## On-premises Location 1 and the branch virtual network perspective via a site-to-site VPN

Both on-premises Location 1 and the branch virtual network are connected to a hub virtual network's VPN gateway via a site-to-site VPN connection. They share the same perspective of the topology, as shown in the following diagram:

:::image type="content" source="./media/backend-interoperability/loc1vpnview.png" alt-text="Diagram of location 1 and branch virtual network perspective of the topology via a site-to-site VPN.":::

## On-premises Location 2 perspective

On-premises Location 2 is connected to a hub virtual network via private peering of ExpressRoute 2: 

:::image type="content" source="./media/backend-interoperability/loc2view.png" alt-text="Diagram of location 2 perspective of the topology.":::

## Next steps

- Review the [test setup](./connectivity-interoperability-preface.md) for the topology, the Azure networking components it uses, and the shared guidance about running ExpressRoute and a site-to-site VPN in tandem and extending back-end connectivity to spoke virtual networks and branch locations.

- Learn about the [data plane analysis](./connectivity-interoperability-data-plane.md) of the test setup and Azure network monitoring feature views.

- See the [ExpressRoute FAQ](../expressroute/expressroute-faqs.md) to:

    - Learn how many ExpressRoute circuits you can connect to an ExpressRoute gateway.

    - Learn how many ExpressRoute gateways you can connect to an ExpressRoute circuit.

    - Learn about other scale limits of ExpressRoute.
