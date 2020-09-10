---
title: 'Scenario: Route traffic through NVAs using custom settings'
titleSuffix: Azure Virtual WAN
description: This scenario helps you route traffic through NVAs using a different NVA for Internet-bound traffic.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 08/06/2020
ms.author: cherylmc
ms.custom: fasttrack-edit

---
# Scenario: Route traffic through NVAs - custom (Preview)

When working with Virtual WAN virtual hub routing, there are quite a few available scenarios. In this NVA (Network Virtual Appliance) scenario, the goal is to route traffic through an NVA for communication between VNets and branches, and use a different NVA for Internet-bound traffic. For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="design"></a>Design

In this scenario we will use the naming convention:

* "Service VNet" for virtual networks where users have deployed an NVA (VNet 4 in **Figure 1**) to inspect non-Internet traffic.
* "DMZ VNet" for virtual networks where users have deployed an NVA to be used to inspect Internet-bound traffic (VNet 5 in **Figure 1**).
* "NVA Spokes" for virtual networks connected to an NVA VNet (VNet 1, VNet 2, and VNet 3 in **Figure 1**).
* "Hubs" for Microsoft-managed Virtual WAN Hubs.

The following connectivity matrix summarizes the flows supported in this scenario:

**Connectivity matrix**

| From          | To:|*NVA Spokes*|*Service VNet*|*DMZ VNet*|*Branches Static*|
|---|---|---|---|---|---|
| **NVA Spokes**| &#8594;|      X |            X |   Peering |    Static    |
| **Service VNet**| &#8594;|    X |            X |      X    |      X       |
| **DMZ VNet** | &#8594;|       X |            X |      X    |      X       |
| **Branches** | &#8594;|  Static |            X |      X    |      X       |

Each of the cells in the connectivity matrix describes whether a Virtual WAN connection (the "From" side of the flow, the row headers) learns a destination prefix (the "To" side of the flow, the column headers in italics) for a specific traffic flow. An "X" means that connectivity is provided natively by Virtual WAN, and "Static" means that connectivity is provided by Virtual WAN using static routes. Let's go in detail over the different rows:

* NVA Spokes:
  * Spokes will reach other spokes directly over Virtual WAN hubs.
  * Spokes will get connectivity to branches via a static route pointing to the Service VNet. They should not learn specific prefixes from the branches (otherwise those would be more specific and override the summary).
  * Spokes will send Internet traffic to the DMZ VNet through a direct VNet peering.
* Branches:
  * Branches will get to spokes via a static routing pointing to the Service VNet. They should not learn specific prefixes from the VNets that override the summarized static route.
* The Service VNet will be similar to a Shared Services VNet that needs to be reachable from every VNet and every branch.
* The DMZ VNet does not really need to have connectivity over Virtual WAN, since the only traffic it will support will come over direct VNet peerings. However, we will use the same connectivity model as for the DMZ VNet to simplify configuration.

So, our connectivity matrix gives us three distinct connectivity patterns, which translates to three route tables. The associations to the different VNets will be as follows:

* NVA Spokes:
  * Associated route table: **RT_V2B**
  * Propagating to route tables: **RT_V2B** and **RT_SHARED**
* NVA VNets (internal and Internet):
  * Associated route table: **RT_SHARED**
  * Propagating to route tables: **RT_SHARED**
* Branches:
  * Associated route table: **Default**
  * Propagating to route tables: **RT_SHARED** and **Default**

We need these static routes to make sure that VNet-to-branch and branch-to-VNet traffic goes through the NVA in the Service VNet (VNet 4):

| Description | Route table | Static route              |
| ----------- | ----------- | ------------------------- |
| Branches    | RT_V2B      | 10.2.0.0/16 -> vnet4conn  |
| NVA Spokes  | Default     | 10.1.0.0/16 -> vnet4conn  |

Now Virtual WAN knows which connection to send the packets to, but the connection needs to know what to do when receiving those packets: This is where the connection route tables are used.

| Description | Connection | Static route            |
| ----------- | ---------- | ----------------------- |
| VNet2Branch | vnet4conn  | 10.2.0.0/16 -> 10.4.0.5 |
| Branch2VNet | vnet4conn  | 10.1.0.0/16 -> 10.4.0.5 |

At this point, everything should be in place.

For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).

## <a name="architecture"></a>Architecture

In **Figure 1**, there is one hub, **Hub 1**.

* **Hub 1** is directly connected to NVA VNets **VNet 4** and **VNet 5**.

* Traffic between VNets 1, 2, and 3 and Branches (VPN/ER/P2S) is expected to go via **VNet 4 NVA** 10.4.0.5.

* All Internet bound traffic from VNets 1, 2, and 3 is expected to go via **VNet 5 NVA** 10.5.0.5.

**Figure 1**

:::image type="content" source="./media/routing-scenarios/nva-custom/figure-1.png" alt-text="Figure 1":::

## <a name="workflow"></a>Workflow

To set up routing via NVA, here are the steps to consider:

1. In order for Internet-bound traffic to go via VNet 5, you need VNets 1, 2, and 3 to directly connect via VNet peering to VNet 5. You also need a UDR set up in the VNets for 0.0.0.0/0 and next hop 10.5.0.5. Currently, Virtual WAN does not allow a next hop NVA in the virtual hub for 0.0.0.0/0.

1. In the Azure portal, navigate to your virtual hub and create a custom route table **RT_Shared** that will learn routes via propagation from all VNets and Branch connections. In **Figure 2**, this is depicted as an empty Custom Route Table **RT_Shared**.

   * **Routes:** You do not need to add any static routes.

   * **Association:** Select VNets 4 and 5,  which will mean that VNets 4 and 5 connections associate to route table **RT_Shared**.

   * **Propagation:** Since you want all branches and VNet connections to propagate their routes dynamically to this route table, select branches and all VNets.

1. Create a custom route table **RT_V2B** for directing traffic from VNets 1, 2, and 3 to branches.

   * **Routes:** Add an aggregated static route entry for Branches (VPN/ER/P2S) (10.2.0.0/16 in **Figure 2**) with next hop as the VNet 4 connection. You also need to configure a static route in VNet 4’s connection for branch prefixes, and indicate the next hop to be the specific IP of the NVA in VNet 4.

   * **Association:** Select all VNets 1, 2, and 3. This implies that VNet connections 1, 2, and 3 will associate to this route table and be able to learn routes (static and dynamic via propagation) in this route table.

   * **Propagation:** Connections propagate routes to route tables. Selecting VNets 1, 2, and 3 will enable propagating routes from VNets 1, 2, and 3 to this route table. There is no need to propagate routes from branch connections to RT_V2B, as branch VNet traffic goes via the NVA in VNet 4.
  
1. Edit the default route table **DefaultRouteTable**.

   All VPN, ExpressRoute, and User VPN connections are associated to the default route table. All VPN, ExpressRoute, and User VPN connections propagate routes to the same set of route tables.

   * **Routes:** Add an aggregated static route entry for VNets 1, 2, and 3 (10.1.0.0/16 in **Figure 2**) with next hop as the VNet 4 connection. You also need to configure a static route in VNet 4’s connection for VNet 1, 2, and 3 aggregated prefixes, and indicate the next hop to be the specific IP of the NVA in VNet 4.

   * **Association:** Make sure the option for branches (VPN/ER/P2S) is selected, ensuring on-premises branch connections are associated to the *defaultroutetable*.

   * **Propagation from:** Make sure the option for branches (VPN/ER/P2S) is selected, ensuring on-premise connections are propagating routes to the *defaultroutetable*.

**Figure 2**

:::image type="content" source="./media/routing-scenarios/nva-custom/figure-2.png" alt-text="Figure 2" lightbox="./media/routing-scenarios/nva-custom/figure-2.png":::

## Next steps

* For more information about Virtual WAN, see the [FAQ](virtual-wan-faq.md).
* For more information about virtual hub routing, see [About virtual hub routing](about-virtual-hub-routing.md).
