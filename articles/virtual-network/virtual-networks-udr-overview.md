---
title: Azure virtual network traffic routing
titlesuffix: Azure Virtual Network
description: Learn how Azure routes virtual network traffic, and how you can customize Azure's routing.
services: virtual-network
documentationcenter: na
author: malopMSFT
manager: 
editor: v-miegge
tags:

ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/26/2017
ms.author: malop
ms.reviewer: kumud
---

# Virtual network traffic routing

Learn about how Azure routes traffic between Azure, on-premises, and Internet resources. Azure automatically creates a route table for each subnet within an Azure virtual network and adds system default routes to the table. To learn more about virtual networks and subnets, see [Virtual network overview](virtual-networks-overview.md). You can override some of Azure's system routes with [custom routes](#custom-routes), and add additional custom routes to route tables. Azure routes outbound traffic from a subnet based on the routes in a subnet's route table.

## System routes

Azure automatically creates system routes and assigns the routes to each subnet in a virtual network. You can't create system routes, nor can you remove system routes, but you can override some system routes with [custom routes](#custom-routes). Azure creates default system routes for each subnet, and adds additional [optional default routes](#optional-default-routes) to specific subnets, or every subnet, when you use specific Azure capabilities.

### Default

Each route contains an address prefix and next hop type. When traffic leaving a subnet is sent to an IP address within the address prefix of a route, the route that contains the prefix is the route Azure uses. Learn more about [how Azure selects a route](#how-azure-selects-a-route) when multiple routes contain the same prefixes, or overlapping prefixes. Whenever a virtual network is created, Azure automatically creates the following default system routes for each subnet within the virtual network:

|Source |Address prefixes                                        |Next hop type  |
|-------|---------                                               |---------      |
|Default|Unique to the virtual network                           |Virtual network|
|Default|0.0.0.0/0                                               |Internet       |
|Default|10.0.0.0/8                                              |None           |
|Default|192.168.0.0/16                                          |None           |
|Default|100.64.0.0/10                                           |None           |

The next hop types listed in the previous table represent how Azure routes traffic destined for the address prefix listed. Explanations for the next hop types follow:

* **Virtual network**: Routes traffic between address ranges within the [address space](manage-virtual-network.md#add-or-remove-an-address-range) of a virtual network. Azure creates a route with an address prefix that corresponds to each address range defined within the address space of a virtual network. If the virtual network address space has multiple address ranges defined, Azure creates an individual route for each address range. Azure automatically routes traffic between subnets using the routes created for each address range. You don't need to define gateways for Azure to route traffic between subnets. Though a virtual network contains subnets, and each subnet has a defined address range, Azure does *not* create default routes for subnet address ranges, because each subnet address range is within an address range of the address space of a virtual network.<br>
* **Internet**: Routes traffic specified by the address prefix to the Internet. The system default route specifies the 0.0.0.0/0 address prefix. If you don't override Azure's default routes, Azure routes traffic for any address not specified by an address range within a virtual network, to the Internet, with one exception. If the destination address is for one of Azure's services, Azure routes the traffic directly to the service over Azure's backbone network, rather than routing the traffic to the Internet. Traffic between Azure services does not traverse the Internet, regardless of which Azure region the virtual network exists in, or which Azure region an instance of the Azure service is deployed in. You can override Azure's default system route for the 0.0.0.0/0 address prefix with a [custom route](#custom-routes).<br>
* **None**: Traffic routed to the **None** next hop type is dropped, rather than routed outside the subnet. Azure automatically creates default routes for the following address prefixes:<br>

    * **10.0.0.0/8 and 192.168.0.0/16**: Reserved for private use in RFC 1918.<br>
    * **100.64.0.0/10**: Reserved in RFC 6598.

    If you assign any of the previous address ranges within the address space of a virtual network, Azure automatically changes the next hop type for the route from **None** to **Virtual network**. If you assign an address range to the address space of a virtual network that includes, but isn't the same as, one of the four reserved address prefixes, Azure removes the route for the prefix and adds a route for the address prefix you added, with **Virtual network** as the next hop type.

### Optional default routes

Azure adds additional default system routes for different Azure capabilities, but only if you enable the capabilities. Depending on the capability, Azure adds optional default routes to either specific subnets within the virtual network, or to all subnets within a virtual network. The additional system routes and next hop types that Azure may add when you enable different capabilities are:

|Source                 |Address prefixes                       |Next hop type|Subnet within virtual network that route is added to|
|-----                  |----                                   |---------                    |--------|
|Default                |Unique to the virtual network, for example: 10.1.0.0/16|VNet peering                 |All|
|Virtual network gateway|Prefixes advertised from on-premises via BGP, or configured in the local network gateway     |Virtual network gateway      |All|
|Default                |Multiple                               |VirtualNetworkServiceEndpoint|Only the subnet a service endpoint is enabled for.|

* **Virtual network (VNet) peering**: When you create a virtual network peering between two virtual networks, a route is added for each address range within the address space of each virtual network a peering is created for. Learn more about [virtual network peering](virtual-network-peering-overview.md).<br>
* **Virtual network gateway**: One or more routes with *Virtual network gateway* listed as the next hop type are added when a virtual network gateway is added to a virtual network. The source is also *virtual network gateway*, because the gateway adds the routes to the subnet. If your on-premises network gateway exchanges border gateway protocol ([BGP](#border-gateway-protocol)) routes with an Azure virtual network gateway, a route is added for each route propagated from the on-premises network gateway. It's recommended that you summarize on-premises routes to the largest address ranges possible, so the fewest number of routes are propagated to an Azure virtual network gateway. There are limits to the number of routes you can propagate to an Azure virtual network gateway. For details, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits).<br>
* **VirtualNetworkServiceEndpoint**: The public IP addresses for certain services are added to the route table by Azure when you enable a service endpoint to the service. Service endpoints are enabled for individual subnets within a virtual network, so the route is only added to the route table of a subnet a service endpoint is enabled for. The public IP addresses of Azure services change periodically. Azure manages the addresses in the route table automatically when the addresses change. Learn more about [virtual network service endpoints](virtual-network-service-endpoints-overview.md), and the services you can create service endpoints for.<br>

    > [!NOTE]
    > The **VNet peering** and **VirtualNetworkServiceEndpoint** next hop types are only added to route tables of subnets within virtual networks created through the Azure Resource Manager deployment model. The next hop types are not added to route tables that are associated to virtual network subnets created through the classic deployment model. Learn more about Azure [deployment models](../azure-resource-manager/management/deployment-models.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Custom routes

You create custom routes by either creating [user-defined](#user-defined) routes, or by exchanging [border gateway protocol](#border-gateway-protocol) (BGP) routes between your on-premises network gateway and an Azure virtual network gateway. 

### User-defined

You can create custom, or user-defined, routes in Azure to override Azure's default system routes, or to add additional routes to a subnet's route table. In Azure, you create a route table, then associate the route table to zero or more virtual network subnets. Each subnet can have zero or one route table associated to it. To learn about the maximum number of routes you can add to a route table and the maximum number of user-defined route tables you can create per Azure subscription, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#networking-limits). If you create a route table and associate it to a subnet, the routes within it are combined with, or override, the default routes Azure adds to a subnet by default.

You can specify the following next hop types when creating a user-defined route:

* **Virtual appliance**: A virtual appliance is a virtual machine that typically runs a network application, such as a firewall. To learn about a variety of pre-configured network virtual appliances you can deploy in a virtual network, see the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?page=1&subcategories=appliances). When you create a route with the **virtual appliance** hop type, you also specify a next hop IP address. The IP address can be:

    * The [private IP address](virtual-network-ip-addresses-overview-arm.md#private-ip-addresses) of a network interface attached to a virtual machine. Any network interface attached to a virtual machine that forwards network traffic to an address other than its own must have the Azure *Enable IP forwarding* option enabled for it. The setting disables Azure's check of the source and destination for a network interface. Learn more about how to [enable IP forwarding for a network interface](virtual-network-network-interface.md#enable-or-disable-ip-forwarding). Though *Enable IP forwarding* is an Azure setting, you may also need to enable IP forwarding within the virtual machine's operating system for the appliance to forward traffic between private IP addresses assigned to Azure network interfaces. If the appliance must route traffic to a public IP address, it must either proxy the traffic, or network address translate the private IP address of the source's private IP address to its own private IP address, which Azure then network address translates to a public IP address, before sending the traffic to the Internet. To determine required settings within the virtual machine, see the documentation for your operating system or network application. To understand outbound connections in Azure, see [Understanding outbound connections](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json).<br>

        > [!NOTE]
        > Deploy a virtual appliance into a different subnet than the resources that route through the virtual appliance are deployed in. Deploying the virtual appliance to the same subnet, then applying a route table to the subnet that routes traffic through the virtual appliance, can result in routing loops, where traffic never leaves the subnet.

    * The private IP address of an Azure [internal load balancer](../load-balancer/load-balancer-get-started-ilb-arm-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json). A load balancer is often used as part of a [high availability strategy for network virtual appliances](/azure/architecture/reference-architectures/dmz/nva-ha?toc=%2fazure%2fvirtual-network%2ftoc.json).

    You can define a route with 0.0.0.0/0 as the address prefix and a next hop type of virtual appliance, enabling the appliance to inspect the traffic and determine whether to forward or drop the traffic. If you intend to create a user-defined route that contains the 0.0.0.0/0 address prefix, read [0.0.0.0/0 address prefix](#default-route) first.

* **Virtual network gateway**: Specify when you want traffic destined for specific address prefixes routed to a virtual network gateway. The virtual network gateway must be created with type **VPN**. You cannot specify a virtual network gateway created as type **ExpressRoute** in a user-defined route because with ExpressRoute, you must use BGP for custom routes. You can define a route that directs traffic destined for the 0.0.0.0/0 address prefix to a [route-based](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#vpntype) virtual network gateway. On your premises, you might have a device that inspects the traffic and determines whether to forward or drop the traffic. If you intend to create a user-defined route for the 0.0.0.0/0 address prefix, read [0.0.0.0/0 address prefix](#default-route) first. Instead of configuring a user-defined route for the 0.0.0.0/0 address prefix, you can advertise a route with the 0.0.0.0/0 prefix via BGP, if you've [enabled BGP for a VPN virtual network gateway](../vpn-gateway/vpn-gateway-bgp-resource-manager-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json).<br>
* **None**: Specify when you want to drop traffic to an address prefix, rather than forwarding the traffic to a destination. If you haven't fully configured a capability, Azure may list *None* for some of the optional system routes. For example, if you see *None* listed as the **Next hop IP address** with a **Next hop type** of *Virtual network gateway* or *Virtual appliance*, it may be because the device isn't running, or isn't fully configured. Azure creates system [default routes](#default) for reserved address prefixes with **None** as the next hop type.<br>
* **Virtual network**: Specify when you want to override the default routing within a virtual network. See [Routing example](#routing-example), for an example of why you might create a route with the **Virtual network** hop type.<br>
* **Internet**: Specify when you want to explicitly route traffic destined to an address prefix to the Internet, or if you want traffic destined for Azure services with public IP addresses kept within the Azure backbone network.

You cannot specify **VNet peering** or **VirtualNetworkServiceEndpoint** as the next hop type in user-defined routes. Routes with the **VNet peering** or **VirtualNetworkServiceEndpoint** next hop types are only created by Azure, when you configure a virtual network peering, or a service endpoint.

## Next hop types across Azure tools

The name displayed and referenced for next hop types is different between the Azure portal and command-line tools, and the Azure Resource Manager and classic deployment models. The following table lists the names used to refer to each next hop type with the different tools and [deployment models](../azure-resource-manager/management/deployment-models.md?toc=%2fazure%2fvirtual-network%2ftoc.json):

|Next hop type                   |Azure CLI and PowerShell (Resource Manager) |Azure classic CLI and PowerShell (classic)|
|-------------                   |---------                                       |-----|
|Virtual network gateway         |VirtualNetworkGateway                           |VPNGateway|
|Virtual network                 |VNetLocal                                       |VNETLocal (not available in the classic CLI in asm mode)|
|Internet                        |Internet                                        |Internet (not available in the classic CLI in asm mode)|
|Virtual appliance               |VirtualAppliance                                |VirtualAppliance|
|None                            |None                                            |Null (not available in the classic CLI in asm mode)|
|Virtual network peering         |VNet peering                                    |Not applicable|
|Virtual network service endpoint|VirtualNetworkServiceEndpoint                   |Not applicable|

### Border gateway protocol

An on-premises network gateway can exchange routes with an Azure virtual network gateway using the border gateway protocol (BGP). Using BGP with an Azure virtual network gateway is dependent on the type you selected when you created the gateway. If the type you selected were:

* **ExpressRoute**: You must use BGP to advertise on-premises routes to the Microsoft Edge router. You cannot create user-defined routes to force traffic to the ExpressRoute virtual network gateway if you deploy a virtual network gateway deployed as type: ExpressRoute. You can use user-defined routes for forcing traffic from the Express Route to, for example, a Network Virtual Appliance.<br>
* **VPN**: You can, optionally use BGP. For details, see [BGP with site-to-site VPN connections](../vpn-gateway/vpn-gateway-bgp-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

When you exchange routes with Azure using BGP, a separate route is added to the route table of all subnets in a virtual network for each advertised prefix. The route is added with *Virtual network gateway* listed as the source and next hop type. 

ER and VPN Gateway route propagation can be disabled on a subnet using a property on a route table. When you exchange routes with Azure using BGP, routes are not added to the route table of all subnets with Virtual network gateway route propagation disabled. Connectivity with VPN connections is achieved using [custom routes](#custom-routes) with a next hop type of *Virtual network gateway*. For details, see [How to disable Virtual network gateway route propagation](manage-route-table.md#create-a-route-table).

## How Azure selects a route

When outbound traffic is sent from a subnet, Azure selects a route based on the destination IP address, using the longest prefix match algorithm. For example, a route table has two routes: One route specifies the 10.0.0.0/24 address prefix, while the other route specifies the 10.0.0.0/16 address prefix. Azure routes traffic destined for 10.0.0.5, to the next hop type specified in the route with the 10.0.0.0/24 address prefix, because 10.0.0.0/24 is a longer prefix than 10.0.0.0/16, even though 10.0.0.5 is within both address prefixes. Azure routes traffic destined to 10.0.1.5, to the next hop type specified in the route with the 10.0.0.0/16 address prefix, because 10.0.1.5 isn't included in the 10.0.0.0/24 address prefix, therefore the route with the 10.0.0.0/16 address prefix is the longest prefix that matches.

If multiple routes contain the same address prefix, Azure selects the route type, based on the following priority:

1. User-defined route
1. BGP route
1. System route

> [!NOTE]
> System routes for traffic related to virtual network, virtual network peerings, or virtual network service endpoints, are preferred routes, even if BGP routes are more specific.

For example, a route table contains the following routes:


|Source   |Address prefixes  |Next hop type           |
|---------|---------         |-------                 |
|Default  | 0.0.0.0/0        |Internet                |
|User     | 0.0.0.0/0        |Virtual network gateway |

When traffic is destined for an IP address outside the address prefixes of any other routes in the route table, Azure selects the route with the **User** source, because user-defined routes are higher priority than system default routes.

See [Routing example](#routing-example) for a comprehensive routing table with explanations of the routes in the table.

## <a name="default-route"></a>0.0.0.0/0 address prefix

A route with the 0.0.0.0/0 address prefix instructs Azure how to route traffic destined for an IP address that is not within the address prefix of any other route in a subnet's route table. When a subnet is created, Azure creates a [default](#default) route to the 0.0.0.0/0 address prefix, with the **Internet** next hop type. If you don't override this route, Azure routes all traffic destined to IP addresses not included in the address prefix of any other route, to the Internet. The exception is that traffic to the public IP addresses of Azure services remains on the Azure backbone network, and is not routed to the Internet. If you override this route, with a [custom](#custom-routes) route, traffic destined to addresses not within the address prefixes of any other route in the route table is sent to a network virtual appliance or virtual network gateway, depending on which you specify in a custom route.

When you override the 0.0.0.0/0 address prefix, in addition to outbound traffic from the subnet flowing through the virtual network gateway or virtual appliance, the following changes occur with Azure's default routing: 

* Azure sends all traffic to the next hop type specified in the route, including traffic destined for public IP addresses of Azure services. When the next hop type for the route with the 0.0.0.0/0 address prefix is **Internet**, traffic from the subnet destined to the public IP addresses of Azure services never leaves Azure's backbone network, regardless of the Azure region the virtual network or Azure service resource exist in. When you create a user-defined or BGP route with a **Virtual network gateway** or **Virtual appliance** next hop type however, all traffic, including traffic sent to public IP addresses of Azure services you haven't enabled [service endpoints](virtual-network-service-endpoints-overview.md) for, is sent to the next hop type specified in the route. If you've enabled a service endpoint for a service, traffic to the service is not routed to the next hop type in a route with the 0.0.0.0/0 address prefix, because address prefixes for the service are specified in the route that Azure creates when you enable the service endpoint, and the address prefixes for the service are longer than 0.0.0.0/0.
* You are no longer able to directly access resources in the subnet from the Internet. You can indirectly access resources in the subnet from the Internet, if inbound traffic passes through the device specified by the next hop type for a route with the 0.0.0.0/0 address prefix before reaching the resource in the virtual network. If the route contains the following values for next hop type:<br>

    * **Virtual appliance**: The appliance must:<br>

        * Be accessible from the Internet<br>
        * Have a public IP address assigned to it,<br>
        * Not have a network security group rule associated to it that prevents communication to the device<br>
        * Not deny the communication<br>
        * Be able to network address translate and forward, or proxy the traffic to the destination resource in the subnet, and return the traffic back to the Internet.

    * **Virtual network gateway**: If the gateway is an ExpressRoute virtual network gateway, an Internet-connected device on-premises can network address translate and forward, or proxy the traffic to the destination resource in the subnet, via ExpressRoute's [private peering](../expressroute/expressroute-circuit-peerings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#privatepeering). 

If your virtual network is connected to an Azure VPN gateway, do not associate a route table to the [gateway subnet](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#gwsub) that includes a route with a destination of 0.0.0.0/0. Doing so can prevent the gateway from functioning properly. For details, see the *Why are certain ports opened on my VPN gateway?* question in the [VPN Gateway FAQ](../vpn-gateway/vpn-gateway-vpn-faq.md?toc=%2fazure%2fvirtual-network%2ftoc.json#gatewayports).

See [DMZ between Azure and your on-premises datacenter](/azure/architecture/reference-architectures/dmz/secure-vnet-hybrid?toc=%2fazure%2fvirtual-network%2ftoc.json) and [DMZ between Azure and the Internet](/azure/architecture/reference-architectures/dmz/secure-vnet-dmz?toc=%2fazure%2fvirtual-network%2ftoc.json) for implementation details when using virtual network gateways and virtual appliances between the Internet and Azure.

## Routing example

To illustrate the concepts in this article, the sections that follow describe:

* A scenario, with requirements<br>
* The custom routes necessary to meet the requirements<br>
* The route table that exists for one subnet that includes the default and custom routes necessary to meet the requirements

> [!NOTE]
> This example is not intended to be a recommended or best practice implementation. Rather, it is provided only to illustrate concepts in this article.

### Requirements

1. Implement two virtual networks in the same Azure region and enable resources to communicate between the virtual networks.
1. Enable an on-premises network to communicate securely with both virtual networks through a VPN tunnel over the Internet. *Alternatively, an ExpressRoute connection could be used, but in this example, a VPN connection is used.*
1. For one subnet in one virtual network:

    * Force all outbound traffic from the subnet, except to Azure Storage and within the subnet, to flow through a network virtual appliance, for inspection and logging.<br>
    * Do not inspect traffic between private IP addresses within the subnet; allow traffic to flow directly between all resources.<br>
    * Drop any outbound traffic destined for the other virtual network.<br>
    * Enable outbound traffic to Azure storage to flow directly to storage, without forcing it through a network virtual appliance.

1. Allow all traffic between all other subnets and virtual networks.

### Implementation

The following picture shows an implementation through the Azure Resource Manager deployment model that meets the previous requirements:

![Network diagram](./media/virtual-networks-udr-overview/routing-example.png)

Arrows show the flow of traffic. 

### Route tables

#### Subnet1

The route table for *Subnet1* in the picture contains the following routes:

|ID  |Source |State  |Address prefixes    |Next hop type          |Next hop IP address|User-defined route name| 
|----|-------|-------|------              |-------                |--------           |--------      |
|1   |Default|Invalid|10.0.0.0/16         |Virtual network        |                   |              |
|2   |User   |Active |10.0.0.0/16         |Virtual appliance      |10.0.100.4         |Within-VNet1  |
|3   |User   |Active |10.0.0.0/24         |Virtual network        |                   |Within-Subnet1|
|4   |Default|Invalid|10.1.0.0/16         |VNet peering           |                   |              |
|5   |Default|Invalid|10.2.0.0/16         |VNet peering           |                   |              |
|6   |User   |Active |10.1.0.0/16         |None                   |                   |ToVNet2-1-Drop|
|7   |User   |Active |10.2.0.0/16         |None                   |                   |ToVNet2-2-Drop|
|8   |Default|Invalid|10.10.0.0/16        |Virtual network gateway|[X.X.X.X]          |              |
|9   |User   |Active |10.10.0.0/16        |Virtual appliance      |10.0.100.4         |To-On-Prem    |
|10  |Default|Active |[X.X.X.X]           |VirtualNetworkServiceEndpoint    |         |              |
|11  |Default|Invalid|0.0.0.0/0           |Internet               |                   |              |
|12  |User   |Active |0.0.0.0/0           |Virtual appliance      |10.0.100.4         |Default-NVA   |

An explanation of each route ID follows:

1. Azure automatically added this route for all subnets within *Virtual-network-1*, because 10.0.0.0/16 is the only address range defined in the address space for the virtual network. If the user-defined route in route ID2 weren't created, traffic sent to any address between 10.0.0.1 and 10.0.255.254 would be routed within the virtual network, because the prefix is longer than 0.0.0.0/0, and not within the address prefixes of any of the other routes. Azure automatically changed the state from *Active* to *Invalid*, when ID2, a user-defined route, was added, since it has the same prefix as the default route, and user-defined routes override default routes. The state of this route is still *Active* for *Subnet2*, because the route table that user-defined route, ID2 is in, isn't associated to *Subnet2*.
2. Azure added this route when a user-defined route for the 10.0.0.0/16 address prefix was associated to the *Subnet1* subnet in the *Virtual-network-1* virtual network. The user-defined route specifies 10.0.100.4 as the IP address of the virtual appliance, because the address is the private IP address assigned to the virtual appliance virtual machine. The route table this route exists in is not associated to *Subnet2*, so doesn't appear in the route table for *Subnet2*. This route overrides the default route for the 10.0.0.0/16 prefix (ID1), which automatically routed traffic addressed to 10.0.0.1 and 10.0.255.254 within the virtual network through the virtual network next hop type. This route exists to meet [requirement](#requirements) 3, to force all outbound traffic through a virtual appliance.
3. Azure added this route when a user-defined route for the 10.0.0.0/24 address prefix was associated to the *Subnet1* subnet. Traffic destined for addresses between 10.0.0.1 and 10.0.0.254 remains within the subnet, rather than being routed to the virtual appliance specified in the previous rule (ID2), because it has a longer prefix than the ID2 route. This route was not associated to *Subnet2*, so the route does not appear in the route table for *Subnet2*. This route effectively overrides the ID2 route for traffic within *Subnet1*. This route exists to meet [requirement](#requirements) 3.
4. Azure automatically added the routes in IDs 4 and 5 for all subnets within *Virtual-network-1*, when the virtual network was peered with *Virtual-network-2.* *Virtual-network-2* has two address ranges in its address space: 10.1.0.0/16 and 10.2.0.0/16, so Azure added a route for each range. If the user-defined routes in route IDs 6 and 7 weren't created, traffic sent to any address between 10.1.0.1-10.1.255.254 and 10.2.0.1-10.2.255.254 would be routed to the peered virtual network, because the prefix is longer than 0.0.0.0/0, and not within the address prefixes of any of the other routes. Azure automatically changed the state from *Active* to *Invalid*, when the routes in IDs 6 and 7 were added, since they have the same prefixes as the routes in IDs 4 and 5, and user-defined routes override default routes. The state of the routes in IDs 4 and 5 are still *Active* for *Subnet2*, because the route table that the user-defined routes in IDs 6 and 7 are in, isn't associated to *Subnet2*. A virtual network peering was created to meet [requirement](#requirements) 1.
5. Same explanation as ID4.
6. Azure added this route and the route in ID7, when user-defined routes for the 10.1.0.0/16 and 10.2.0.0/16 address prefixes were associated to the *Subnet1* subnet. Traffic destined for addresses between 10.1.0.1-10.1.255.254 and 10.2.0.1-10.2.255.254 is dropped by Azure, rather than being routed to the peered virtual network, because user-defined routes override default routes. The routes are not associated to *Subnet2*, so the routes do not appear in the route table for *Subnet2*. The routes override the ID4 and ID5 routes for traffic leaving *Subnet1*. The ID6 and ID7 routes exist to meet [requirement](#requirements) 3 to drop traffic destined to the other virtual network.
7. Same explanation as ID6.
8. Azure automatically added this route for all subnets within *Virtual-network-1* when a VPN type virtual network gateway was created within the virtual network. Azure added the public IP address of the virtual network gateway to the route table. Traffic sent to any address between 10.10.0.1 and 10.10.255.254 is routed to the virtual network gateway. The prefix is longer than 0.0.0.0/0 and not within the address prefixes of any of the other routes. A virtual network gateway was created to meet [requirement](#requirements) 2.
9. Azure added this route when a user-defined route for the 10.10.0.0/16 address prefix was added to the route table associated to *Subnet1*. This route overrides ID8. The route sends all traffic destined for the on-premises network to an NVA for inspection, rather than routing traffic directly on-premises. This route was created to meet [requirement](#requirements) 3.
10. Azure automatically added this route to the subnet when a service endpoint to an Azure service was enabled for the subnet. Azure routes traffic from the subnet to a public IP address of the service, over the Azure infrastructure network. The prefix is longer than 0.0.0.0/0 and not within the address prefixes of any of the other routes. A service endpoint was created to meet [requirement](#requirements) 3, to enable traffic destined for Azure Storage to flow directly to Azure Storage.
11. Azure automatically added this route to the route table of all subnets within *Virtual-network-1* and *Virtual-network-2.* The 0.0.0.0/0 address prefix is the shortest prefix. Any traffic sent to addresses within a longer address prefix are routed based on other routes. By default, Azure routes all traffic destined for addresses other than the addresses specified in one of the other routes to the Internet. Azure automatically changed the state from *Active* to *Invalid* for the *Subnet1* subnet when a user-defined route for the 0.0.0.0/0 address prefix (ID12) was associated to the subnet. The state of this route is still *Active* for all other subnets within both virtual networks, because the route isn't associated to any other subnets within any other virtual networks.
12. Azure added this route when a user-defined route for the 0.0.0.0/0 address prefix was associated to the *Subnet1* subnet. The user-defined route specifies 10.0.100.4 as the IP address of the virtual appliance. This route is not associated to *Subnet2*, so the route does not appear in the route table for *Subnet2*. All traffic for any address not included in the address prefixes of any of the other routes is sent to the virtual appliance. The addition of this route changed the state of the default route for the 0.0.0.0/0 address prefix (ID11) from *Active* to *Invalid* for *Subnet1*, because a user-defined route overrides a default route. This route exists to meet the third [requirement](#requirements).

#### Subnet2

The route table for *Subnet2* in the picture contains the following routes:

|Source  |State  |Address prefixes    |Next hop type             |Next hop IP address|
|------- |-------|------              |-------                   |--------           
|Default |Active |10.0.0.0/16         |Virtual network           |                   |
|Default |Active |10.1.0.0/16         |VNet peering              |                   |
|Default |Active |10.2.0.0/16         |VNet peering              |                   |
|Default |Active |10.10.0.0/16        |Virtual network gateway   |[X.X.X.X]          |
|Default |Active |0.0.0.0/0           |Internet                  |                   |
|Default |Active |10.0.0.0/8          |None                      |                   |
|Default |Active |100.64.0.0/10       |None                      |                   |
|Default |Active |192.168.0.0/16      |None                      |                   |

The route table for *Subnet2* contains all Azure-created default routes and the optional VNet peering and Virtual network gateway optional routes. Azure added the optional routes to all subnets in the virtual network when the gateway and peering were added to the virtual network. Azure removed the  routes for the 10.0.0.0/8, 192.168.0.0/16, and 100.64.0.0/10 address prefixes from the *Subnet1* route table when the user-defined route for the 0.0.0.0/0 address prefix was added to *Subnet1*.  

## Next steps

* [Create a user-defined route table with routes and a network virtual appliance](tutorial-create-route-table-portal.md)<br>
* [Configure BGP for an Azure VPN Gateway](../vpn-gateway/vpn-gateway-bgp-resource-manager-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br>
* [Use BGP with ExpressRoute](../expressroute/expressroute-routing.md?toc=%2fazure%2fvirtual-network%2ftoc.json#route-aggregation-and-prefix-limits)<br>
* [View all routes for a subnet](diagnose-network-routing-problem.md). A user-defined route table only shows you the user-defined routes, not the default, and BGP routes for a subnet. Viewing all routes shows you the default, BGP, and user-defined routes for the subnet a network interface is in.<br>
* [Determine the next hop type](../network-watcher/diagnose-vm-network-routing-problem.md?toc=%2fazure%2fvirtual-network%2ftoc.json) between a virtual machine and a destination IP address. The Azure Network Watcher next hop feature enables you to determine whether traffic is leaving a subnet and being routed to where you think it should be.
