---
title: 'About BGP peering with a virtual hub'
titleSuffix: Azure Virtual WAN
description: Learn about BGP peering with an Azure Virtual WAN virtual hub.
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 09/06/2022
ms.author: cherylmc

---
# Scenario: BGP peering with a virtual hub

Azure Virtual WAN hub router, also called as virtual hub router, acts as a route manager and provides simplification in routing operation within and across virtual hubs. In other words, a virtual hub router does the following:

* Simplifies routing management by being the central routing engine talking to gateways such as VPN, ExpressRoute, P2S, and Network Virtual Appliances (NVA). 
* Enables advance routing scenarios of custom route tables, association, and propagation of routes.
* Acts as the router for traffic transiting between/to virtual networks connected to a virtual hub.

The virtual hub router now also exposes the ability to peer with it, thereby exchanging routing information directly through Border Gateway Protocol (BGP) routing protocol. NVA or a BGP end point provisioned in a virtual network connected to a virtual hub, can directly peer with the virtual hub router if it supports the BGP routing protocol and ensures that ASN on the NVA is set up to be different from the virtual hub ASN.

## Benefits and considerations

**Key benefits**

* You no longer need to manually update the routing table on your NVA whenever your virtual network addresses are updated.
* You no longer need to update user-defined routes manually whenever your NVA announces new routes or withdraws old ones.
* NVA in virtual networks connected to a virtual hub can learn virtual hub gateway (VPN, ExpressRoute, or Managed NVA) routes.
* You can peer multiple instances of your NVA with a virtual hub router. You can configure BGP attributes in your NVA and, depending on your design (active-active or active-passive), let the virtual hub router know which NVA instance is active or passive.

**Considerations**

* You can't peer a virtual hub router with Azure Route Server provisioned in a virtual network.
* The virtual hub router only supports 16-bit (2 bytes) ASN.
* The virtual network connection that has the NVA BGP connection endpoint must always be associated and propagating to defaultRouteTable. Custom route tables are not supported at this time.
* The virtual hub router supports transit connectivity between virtual networks connected to virtual hubs. This has nothing to do with this feature for BGP peering capability as Virtual WAN already supports transit connectivity. Examples:
  * VNET1: NVA1 connected to Virtual Hub 1 -> (transit connectivity) -> VNET2: NVA2 connected to Virtual Hub 1.
  * VNET1: NVA1 connected to Virtual Hub 1 -> (transit connectivity) -> VNET2: NVA2 connected to Virtual Hub 2.
* You can use your own public ASNs or private ASNs in your network virtual appliance. You can't use the ranges reserved by Azure or IANA. The following ASNs are reserved by Azure or IANA:
   * ASNs reserved by Azure:
     * Public ASNs: 8074, 8075, 12076
     * Private ASNs: 65515, 65517, 65518, 65519, 65520
   * ASNs reserved by IANA: 23456, 64496-64511, 65535-65551
* While the virtual hub router exchanges BGP routes with your NVA and propagates them to your virtual network, it directly facilitates propagating routes from on-premises via the virtual hub hosted gateways (VPN gateway/ExpressRoute gateway/Managed NVA gateways). 

   The virtual hub router has the following limits:

   | Resource | Limit |
   |---|---|
   |  Number of routes each BGP peer can advertise to the virtual hub.| The hub can only accept a maximum number of 10,000 routes (total) from its connected resources. For example, if a virtual hub has a total of 6000 routes from the connected virtual networks, branches, virtual hubs etc., then when a new BGP peering is configured with an NVA, the NVA can only advertise up to 4000 routes. |
* Routes from NVA in a virtual network that are more specific than the virtual network address space, when advertised to the virtual hub through BGP are not propagated further to on-premises.
* Currently we only support 4,000 routes from the NVA to the virtual hub.
* Traffic destined for addresses in the virtual network directly connected to the virtual hub cannot be configured to route through the NVA using BGP peering between the hub and NVA. This is because the virtual hub automatically learns about system routes associated with addresses in the spoke virtual network when the spoke virtual network connection is created. These automatically learned system routes are preferred over routes learned by the hub through BGP.
* BGP peering between an NVA in a spoke VNet and a secured virtual hub (hub with an integrated security solution) is supported if Routing Intent **is** configured on the hub. BGP peering feature is not supported for secured virtual hubs where routing intent is **not** configured. 
* In order for the NVA to exchange routes with VPN and ER connected sites, branch to branch routing must be turned on.

* When configuring BGP peering with the hub, you will see two IP addresses. Peering with both these addresses is required. Not peering with both addresses can cause routing issues. The same routes must be advertised to both of these addresses. Advertising different routes will cause routing issues. 

* The next hop IP address on the routes being advertised from the NVA to the virtual HUB route server has to be the same as the IP address of the NVA, the IP address configured on the BGP peer. Having a different IP address advertised as next hop IS NOT supported on virtual WAN at the moment.
## BGP peering scenarios

This section describes scenarios where BGP peering feature can be utilized to configure routing.

## <a name="vnet-vnet"></a>Transit VNet connectivity

:::image type="content" source="./media/scenario-bgp-peering-hub/vnet-vnet.png" alt-text="Graphic with VNet-to-VNet routing.":::

In this scenario, the virtual hub named "Hub 1" is connected to several virtual networks. The goal is to establish routing between virtual networks VNET1 and VNET5.

### Configuration steps without BGP peering

The following steps are required when BGP peering is not used on the virtual hub:

Virtual hub configuration

* On the Hub 1's defaultRouteTable, configure static route for VNET5 (subnet 10.2.1.0/24) pointing to VNET2 connection.
* On Hub 1's virtual network connection for VNET2, configure static route for VNET5 pointing to VNET2 NVA IP (subnet 10.2.0.5).
* On Hub 1, propagate routes from connections for VNET1 and VNET2 to the defaultRouteTable, and associate them to the defaultRouteTable.

Virtual network configuration

* On VNET5, set up a user-defined route (UDR) to point to VNET2 NVA IP.

### Configuration steps with BGP peering

In the previous configuration, the maintenance of the static routes and UDR can become complex if the VNET5 configuration changes frequently. To address this challenge, the BGP peering with a virtual hub feature can be used and the routing configuration must be changed to the following steps:

Virtual hub configuration

* On Hub 1, configure VNET2 NVA as a BGP peer. Also, configure VNET2 NVA, to have a BGP peering with Hub 1.
* On Hub 1, propagate routes from connections for VNET1 and VNET2 to the defaultRouteTable, and associate them to the defaultRouteTable.

Virtual network configuration

* On VNET5, set up a user-defined route (UDR) to point to VNET2 NVA IP.

#### Effective routes

The table below shows few entries from Hub 1's effective routes in the defaultRouteTable. Notice that the route for VNET5 (subnet 10.2.1.0/24) and this confirms VNET1 and VNET5 will be able to communicate with each other.

| Destination prefix |  Next hop| Origin | ASN path|
| --- | --- | --- | ---|
| 10.2.0.0/24 |eastusconn  | VNet connection ID | - |
| 10.2.1.0/24 |BGP peer connection ID for NVA  | BGP peer connection ID for NVA |  65510|
|  10.4.1.0/24 | Hub 2 | Hub 2 | - |

Configuring routing in this manner using the feature eliminates the need for static route entries on the virtual hub. Therefore, the configuration is simpler and route tables are updated dynamically when the configuration in connected virtual networks (like VNET5) changes.

## <a name="branch-vnet"></a>Branch VNet connectivity

:::image type="content" source="./media/scenario-bgp-peering-hub/branch-vnet.png" alt-text="Graphic with Branch-to-VNet routing.":::

In this scenario, the on-premises site named "NVA Branch 1" has a VPN configured to terminate on the VNET2 NVA. The goal is to configure routing between NVA Branch 1 and virtual network VNET1.

### Configuration steps without BGP peering

The following steps are required when BGP peering is not used on the virtual hub:

Virtual hub configuration

* On the Hub 1's defaultRouteTable, configure static route for NVA Branch 1 pointing to VNET2 connection.
* On Hub 1's virtual network connection for VNET2, configure static route for NVA Branch 1 pointing to VNET2 NVA IP (10.2.0.5).
* On Hub 1, propagate routes from connections for VNET1 and VNET2 to the defaultRouteTable and associate them to the defaultRouteTable.

Virtual network configuration

* BGP peering between VNET2 NVA and NVA Branch 1, and route advertisements for VNET1 from VNET2 NVA to NVA Branch 1.

### Configuration steps with BGP peering

Over time, the destination prefixes in NVA Branch 1 may change, or there may be many sites like NVA Branch 1, which need connectivity to VNET1. This would result in needing updates to the static routes on the Hub 1 and the VNET2 connection, which can get cumbersome. In such cases, we can use the BGP peering with a virtual hub feature and the configuration steps for routing connectivity would be as given below.

Virtual hub configuration

* On Hub 1, configure VNET2 NVA as a BGP peer. Also, configure VNET2 NVA, to have a BGP peering with Hub 1.
* On Hub 1, propagate routes from connections for VNET1 and VNET2 to the defaultRouteTable and associate them to the defaultRouteTable.

Virtual network configuration

* BGP peering between VNET2 NVA and NVA Branch 1, and route advertisements for VNET1 from VNET2 NVA to NVA Branch 1.

#### Effective routes

The table below shows few entries from Hub 1's effective routes in the defaultRouteTable. Notice that the route for NVA Branch 1 (subnet 192.168.1.0/24) is learned over the BGP peering with the NVA.

 | Destination prefix |  Next hop| Origin | ASN path|
| --- | --- | --- | ---|
| 10.2.0.0/24 | eastusconn  | VNet connection ID | - |
| 192.168.1.0/24 | BGP peer connection ID for NVA  | BGP peer connection ID for NVA |  65510|

To manage network changes in NVA Branch 1 or establish connectivity between new sites like NVA Branch 1, there is no additional configuration required on Hub 1 because the BGP peering between Hub 1 and NVA will dynamically update the route tables. The configuration and maintenance are, therefore, simplified.

## Next steps

* [Configure BGP peering with a virtual hub](create-bgp-peering-hub-portal.md).
