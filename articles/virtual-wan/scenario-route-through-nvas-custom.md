---
title: Route traffic through NVAs by using custom settings
titleSuffix: Azure Virtual WAN
description: This scenario helps you route traffic through NVAs by using a different NVA for internet-bound traffic.
services: virtual-wan
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 09/22/2020
ms.author: cherylmc
ms.custom: fasttrack-edit
---

# Scenario: Route traffic through NVAs by using custom settings

When you're working with Azure Virtual WAN virtual hub routing, you have a number of options available to you. The focus of this article is when you want to route traffic through a network virtual appliance (NVA) for communication between virtual networks and branches, and use a different NVA for internet-bound traffic. For more information, see [About virtual hub routing](about-virtual-hub-routing.md).

## Design

* **Spokes** for virtual networks connected to the virtual hub. (For example, VNet 1, VNet 2, and VNet 3 in the diagram later in this article.)
* **Service VNet** for virtual networks where users have deployed an NVA to inspect non-internet traffic, and possibly with common services accessed by spokes. (For example, VNet 4 in the diagram later in this article.) 
* **Perimeter VNet** for virtual networks where users have deployed an NVA to be used to inspect internet-bound traffic. (For example, VNet 5 in the diagram later in this article.)
* **Hubs** for Virtual WAN hubs managed by Microsoft.

The following table summarizes the connections supported in this scenario:

| From          | To|Spokes|Service VNet|Branches|Internet|
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Spokes**| ->| directly |directly | through Service VNet |through Perimeter VNet |
| **Service VNet**| ->| directly |n/a| directly | |
| **Branches** | ->| through Service VNet |directly| directly |  |

Each of the cells in the connectivity matrix describes whether connectivity flows directly over Virtual WAN or over one of the virtual networks with an NVA. 

Note the following details:
* Spokes:
  * Spokes will reach other spokes directly over Virtual WAN hubs.
  * Spokes will get connectivity to branches via a static route pointing to the Service VNet. They don't learn specific prefixes from the branches, because those are more specific and override the summary.
  * Spokes will send internet traffic to the Perimeter VNet through a direct VNet peering.
* Branches will get to spokes via a static routing pointing to the Service VNet. They don't learn specific prefixes from the virtual networks that override the summarized static route.
* The Service VNet will be similar to a Shared Services VNet that needs to be reachable from every virtual network and every branch.
* The Perimeter VNet doesn't need to have connectivity over Virtual WAN, because the only traffic it will support comes over direct virtual network peerings. To simplify configuration, however, use the same connectivity model as for the Perimeter VNet.

There are three distinct connectivity patterns, which translates to three route tables. The associations to the different virtual networks are:

* Spokes:
  * Associated route table: **RT_V2B**
  * Propagating to route tables: **RT_V2B** and **RT_SHARED**
* NVA VNets (Service VNet and DMZ VNet):
  * Associated route table: **RT_SHARED**
  * Propagating to route tables: **RT_SHARED**
* Branches:
  * Associated route table: **Default**
  * Propagating to route tables: **RT_SHARED** and **Default**

These static routes ensure that traffic to and from the virtual network and branch goes through the NVA in the Service VNet (VNet 4):

| Description | Route table | Static route              |
| ----------- | ----------- | ------------------------- |
| Branches    | RT_V2B      | 10.2.0.0/16 -> vnet4conn  |
| NVA spokes  | Default     | 10.1.0.0/16 -> vnet4conn  |

Now you can use Virtual WAN to select the correct connection to send the packets to. You also need to use Virtual WAN to select the correct action to take when receiving those packets. You use the connection route tables for this, as follows:

| Description | Connection | Static route            |
| ----------- | ---------- | ----------------------- |
| VNet2Branch | vnet4conn  | 10.2.0.0/16 -> 10.4.0.5 |
| Branch2VNet | vnet4conn  | 10.1.0.0/16 -> 10.4.0.5 |

For more information, see [About virtual hub routing](about-virtual-hub-routing.md).

## Architecture

Here is a diagram of the architecture described earlier in the article.

There's one hub, called **Hub 1**.

* **Hub 1** is directly connected to NVA VNets **VNet 4** and **VNet 5**.

* Traffic between VNets 1, 2, and 3 and branches is expected to go via **VNet 4 NVA** 10.4.0.5.

* All internet bound traffic from VNets 1, 2, and 3 is expected to go via **VNet 5 NVA** 10.5.0.5.

:::image type="content" source="./media/routing-scenarios/nva-custom/figure-1.png" alt-text="Diagram of network architecture.":::

## Workflow

To set up routing via NVA, here are the steps to consider:

1. For internet-bound traffic to go via VNet 5, you need VNets 1, 2, and 3 to directly connect via virtual network peering to VNet 5. You also need a user-defined route set up in the virtual networks for 0.0.0.0/0 and next hop 10.5.0.5. Currently, Virtual WAN doesn't allow a next hop NVA in the virtual hub for 0.0.0.0/0.

1. In the Azure portal, go to your virtual hub and create a custom route table called **RT_Shared**. This table learns routes via propagation from all virtual networks and branch connections. You can see this empty table in the following diagram.

   * **Routes:** You don't need to add any static routes.

   * **Association:** Select VNets 4 and 5, which mean that the connections of these virtual networks associate to the route table **RT_Shared**.

   * **Propagation:** Because you want all branches and virtual network connections to propagate their routes dynamically to this route table, select branches and all virtual networks.

1. Create a custom route table called **RT_V2B** for directing traffic from VNets 1, 2, and 3 to branches.

   * **Routes:** Add an aggregated static route entry for branches, with next hop as the VNet 4 connection. Configure a static route in VNet 4’s connection for branch prefixes, and indicate the next hop to be the specific IP of the NVA in VNet 4.

   * **Association:** Select all VNets 1, 2, and 3. This implies that VNet connections 1, 2, and 3 will associate to this route table and be able to learn routes (static and dynamic via propagation) in this route table.

   * **Propagation:** Connections propagate routes to route tables. Selecting VNets 1, 2, and 3 enable propagating routes from VNets 1, 2, and 3 to this route table. There's no need to propagate routes from branch connections to **RT_V2B**, because branch virtual network traffic goes via the NVA in VNet 4.
  
1. Edit the default route table, **DefaultRouteTable**.

   All VPN, Azure ExpressRoute, and user VPN connections are associated to the default route table. All VPN, ExpressRoute, and user VPN connections propagate routes to the same set of route tables.

   * **Routes:** Add an aggregated static route entry for VNets 1, 2, and 3, with next hop as the VNet 4 connection. Configure a static route in VNet 4’s connection for VNet 1, 2, and 3 aggregated prefixes, and indicate the next hop to be the specific IP of the NVA in VNet 4.

   * **Association:** Make sure the option for branches (VPN/ER/P2S) is selected, ensuring that on-premises branch connections are associated to the default route table.

   * **Propagation from:** Make sure the option for branches (VPN/ER/P2S) is selected, ensuring that on-premises connections are propagating routes to the default route table.

:::image type="content" source="./media/routing-scenarios/nva-custom/figure-2.png" alt-text="Diagram of workflow." lightbox="./media/routing-scenarios/nva-custom/figure-2.png":::

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
