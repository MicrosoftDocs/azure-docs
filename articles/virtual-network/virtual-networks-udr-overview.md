---
title: Azure virtual network traffic routing
titlesuffix: Azure Virtual Network
description: Learn how Azure routes virtual network traffic and how you can customize routing for Azure.
services: virtual-network
author: asudbring
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 10/30/2024
ms.author: allensu
---

# Virtual network traffic routing

In this article, you learn how Azure routes traffic between Azure, on-premises, and internet resources. Azure automatically creates a route table for each subnet within an Azure virtual network and adds system default routes to the table. To learn more about virtual networks and subnets, see [Virtual network overview](virtual-networks-overview.md). You can override some of the Azure system routes with [custom routes](#custom-routes) and add more custom routes to route tables. Azure routes outbound traffic from a subnet based on the routes in a subnet's route table.

## System routes

Azure automatically creates system routes and assigns the routes to each subnet in a virtual network. You can't create system routes, and you can't remove system routes, but you can override some system routes with [custom routes](#custom-routes). Azure creates default system routes for each subnet and adds more [optional default routes](#optional-default-routes) to specific subnets, or every subnet, when you use specific Azure capabilities.

### Default

Each route contains an address prefix and next hop type. When traffic leaving a subnet is sent to an IP address within the address prefix of a route, the route that contains the prefix is the route that Azure uses. Learn more about [how Azure selects a route](#how-azure-selects-a-route) when multiple routes contain the same prefixes or overlapping prefixes. Whenever a virtual network is created, Azure automatically creates the following default system routes for each subnet within the virtual network:

|Source |Address prefixes                                        |Next hop type  |
|-------|---------                                               |---------      |
|Default|Unique to the virtual network                           |Virtual network|
|Default|0.0.0.0/0                                               |Internet       |
|Default|10.0.0.0/8                                              |None           |
|Default|172.16.0.0/12                                           |None           |
|Default|192.168.0.0/16                                          |None           |
|Default|100.64.0.0/10                                           |None           |

The next hop types listed in the previous table represent how Azure routes traffic destined for the address prefix listed. Here are explanations for the next hop types:

* **Virtual network**: Routes traffic between address ranges within the [address space](manage-virtual-network.yml#add-or-remove-an-address-range) of a virtual network. Azure creates a route with an address prefix that corresponds to each address range defined within the address space of a virtual network. If the virtual network address space has multiple address ranges defined, Azure creates an individual route for each address range. By default, Azure routes traffic between subnets. You don't need to define route tables or gateways for Azure to route traffic between subnets. Azure doesn't create default routes for subnet address ranges. Each subnet address range is within an address range of the address space of a virtual network.
* **Internet**: Routes traffic specified by the address prefix to the internet. The system default route specifies the 0.0.0.0/0 address prefix. If you don't override the Azure default routes, Azure routes traffic for any address not specified by an address range within a virtual network to the internet. There's one exception to this routing. If the destination address is for an Azure service, Azure routes the traffic directly to the service over the Azure backbone network instead of routing the traffic to the internet. Traffic between Azure services doesn't traverse the internet. It doesn't matter which Azure region the virtual network exists in or which Azure region an instance of the Azure service is deployed in. You can override the Azure default system route for the 0.0.0.0/0 address prefix with a [custom route](#custom-routes).
* **None**: Traffic routed to the **None** next hop type is dropped rather than routed outside the subnet. Azure automatically creates default routes for the following address prefixes:

    * **10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16**: Reserved for private use in RFC 1918.
    * **100.64.0.0/10**: Reserved in RFC 6598.

    If you assign any of the previous address ranges within the address space of a virtual network, Azure automatically changes the next hop type for the route from **None** to **Virtual network**. If you assign an address range to the address space of a virtual network that includes, but isn't the same as, one of the four reserved address prefixes, Azure removes the route for the prefix and adds a route for the address prefix you added, with **Virtual network** as the next hop type.

### Optional default routes

Azure adds more default system routes for different Azure capabilities, but only if you enable the capabilities. Depending on the capability, Azure adds optional default routes to either specific subnets within the virtual network or to all subnets within a virtual network. The following table lists the other system routes and next hop types that Azure might add when you enable different capabilities.

|Source                 |Address prefixes                       |Next hop type|Subnet within virtual network that route is added to|
|-----                  |----                                   |---------                    |--------|
|Default                |Unique to the virtual network, for example: 10.1.0.0/16|Virtual network peering                 |All|
|Virtual network gateway|Prefixes advertised from on-premises via Border Gateway Protocol (BGP) or configured in the local network gateway     |Virtual network gateway      |All|
|Default                |Multiple                               |`VirtualNetworkServiceEndpoint`|Only the subnet for which a service endpoint is enabled|

* **Virtual network peering**: When you create a virtual network peering between two virtual networks, the system adds a route for each address range within the address space of each virtual network involved in the peering. Learn more about [virtual network peering](virtual-network-peering-overview.md).
* **Virtual network gateway**: One or more routes with **Virtual network gateway** listed as the next hop type are added when a virtual network gateway is added to a virtual network. The source is also **Virtual network gateway** because the gateway adds the routes to the subnet. If your on-premises network gateway exchanges BGP routes with a virtual network gateway, the system adds a route for each route. These routes are propagated from the on-premises network gateway. We recommend that you summarize on-premises routes to the largest address range possible so that you propagate the fewest number of routes to an Azure virtual network gateway. There are limits to the number of routes you can propagate to an Azure virtual network gateway. For more information, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-networking-limits).
* `VirtualNetworkServiceEndpoint`: The public IP addresses for certain services are added to the route table by Azure when you enable a service endpoint to the service. Service endpoints are enabled for individual subnets within a virtual network, so the route is added only to the route table of a subnet for which a service endpoint is enabled. The public IP addresses of Azure services change periodically. Azure manages the addresses in the route table automatically when the addresses change. Learn more about [virtual network service endpoints](virtual-network-service-endpoints-overview.md) and the services for which you can create service endpoints.

    > [!NOTE]
    > The **Virtual network peering** and `VirtualNetworkServiceEndpoint` next hop types are added only to route tables of subnets within virtual networks created through the Azure Resource Manager deployment model. The next hop types aren't added to route tables that are associated to virtual network subnets created through the classic deployment model. Learn more about Azure [deployment models](../azure-resource-manager/management/deployment-models.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Custom routes

You create custom routes by either creating [user-defined](#user-defined) routes (UDRs) or exchanging [BGP](#border-gateway-protocol) routes between your on-premises network gateway and an Azure virtual network gateway.

### User-defined

To customize your traffic routes, you shouldn't modify the default routes. You should create custom or user-defined (static) routes, which override the Azure default system routes. In Azure, you create a route table and then associate the route table to zero or more virtual network subnets. Each subnet can have zero or one route table associated to it. To learn about the maximum number of routes that you can add to a route table and the maximum number of UDR tables you can create per Azure subscription, see [Azure limits](../azure-resource-manager/management/azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-networking-limits).

By default, a route table can contain up to 400 UDRs. With the Azure Virtual Network Manager [routing configuration](../virtual-network-manager/concept-user-defined-route.md), this number can expand to 1,000 UDRs per route table. This increased limit supports more advanced routing setups. An example is directing traffic from on-premises datacenters through a firewall to each spoke virtual network in a hub-and-spoke topology when you have a higher number of spoke virtual networks.

When you create a route table and associate it to a subnet, the table's routes are combined with the subnet's default routes. If there are conflicting route assignments, UDRs override the default routes.

You can specify the following next hop types when you create a UDR:

* **Virtual appliance**: A virtual appliance is a virtual machine that typically runs a network application, such as a firewall. To learn about various preconfigured network virtual appliances that you can deploy in a virtual network, see [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/networking?page=1&subcategories=appliances). When you create a route with the **Virtual appliance** hop type, you also specify a next hop IP address. The IP address can be:

    * The [private IP address](./ip-services/private-ip-addresses.md) of a network interface attached to a virtual machine. Any network interface attached to a virtual machine that forwards network traffic to an address other than its own must have the Azure **Enable IP forwarding** option enabled for it. The setting disables the check of the source and destination for a network interface by Azure. Learn more about how to [enable IP forwarding for a network interface](virtual-network-network-interface.md#enable-or-disable-ip-forwarding). **Enable IP forwarding** is an Azure setting.

      You might need to enable IP forwarding within the virtual machine's operating system for the appliance to forward traffic between private IP addresses assigned to Azure network interfaces. If the appliance needs to route traffic to a public IP address, it must either proxy the traffic or perform network address translation (NAT) from the source's private IP address to its own private IP address. Azure then performs NAT to a public IP address before sending the traffic to the internet. To determine required settings within the virtual machine, see the documentation for your operating system or network application. To understand outbound connections in Azure, see [Understanding outbound connections](../load-balancer/load-balancer-outbound-connections.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

      > [!NOTE]
      > Deploy a virtual appliance into a different subnet than the resources that route through the virtual appliance. Deploying the virtual appliance to the same subnet and then applying a route table to the subnet that routes traffic through the virtual appliance can result in routing loops where traffic never leaves the subnet.
      >
      > A next hop private IP address must have direct connectivity without having to route through an Azure ExpressRoute gateway or through Azure Virtual WAN. Setting the next hop to an IP address without direct connectivity results in an invalid UDR configuration.

    * The private IP address of an Azure [internal load balancer](../load-balancer/quickstart-load-balancer-standard-internal-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json). A load balancer is often used as part of a [high-availability strategy for network virtual appliances](/azure/architecture/reference-architectures/dmz/nva-ha?toc=%2fazure%2fvirtual-network%2ftoc.json).

    You can define a route with 0.0.0.0/0 as the address prefix and a next hop type of virtual appliance. This configuration allows the appliance to inspect the traffic and determine whether to forward or drop the traffic. If you intend to create a UDR that contains the 0.0.0.0/0 address prefix, read [0.0.0.0/0 address prefix](#default-route) first.

* **Virtual network gateway**: Specify when you want traffic destined for specific address prefixes routed to a virtual network gateway. The virtual network gateway must be created with the type **VPN**. You can't specify a virtual network gateway created as the type **ExpressRoute** in a UDR because with ExpressRoute, you must use BGP for custom routes. You can't specify virtual network gateways if you have virtual private network (VPN) and ExpressRoute coexisting connections either. You can define a route that directs traffic destined for the 0.0.0.0/0 address prefix to a route-based virtual network gateway.

   On your premises, you might have a device that inspects the traffic and determines whether to forward or drop the traffic. If you intend to create a UDR for the 0.0.0.0/0 address prefix, read [0.0.0.0/0 address prefix](#default-route) first. Instead of configuring a UDR for the 0.0.0.0/0 address prefix, you can advertise a route with the 0.0.0.0/0 prefix via BGP if the [BGP for a VPN virtual network gateway](../vpn-gateway/vpn-gateway-bgp-resource-manager-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json) is enabled.

* **None**: Specify when you want to drop traffic to an address prefix, rather than forwarding the traffic to a destination. Azure might show **None** for some of the optional system routes if a capability isn't configured. For example, if you see that **Next hop IP address** shows **None** and **Next hop type** shows **Virtual network gateway** or **Virtual appliance**, it might be because the device isn't running or isn't fully configured. Azure creates system [default routes](#default) for reserved address prefixes with **None** as the next hop type.
* **Virtual network**: Specify the **Virtual network** option when you want to override the default routing within a virtual network. For an example of why you might create a route with the **Virtual network** hop type, see [Routing example](#routing-example).
* **Internet**: Specify the **Internet** option when you want to explicitly route traffic destined to an address prefix to the internet. Or use it if you want traffic destined for Azure services with public IP addresses kept within the Azure backbone network.

You can't specify **Virtual network peering** or `VirtualNetworkServiceEndpoint` as the next hop type in UDRs. Azure creates routes with **Virtual network peering** or `VirtualNetworkServiceEndpoint` next hop types only when you configure a virtual network peering or a service endpoint.

### Service tags for user-defined routes

You can now specify a [service tag](service-tags-overview.md) as the address prefix for a UDR instead of an explicit IP range. A service tag represents a group of IP address prefixes from a specific Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change. This support minimizes the complexity of frequent updates to UDRs and reduces the number of routes that you need to create. You can currently create 25 or fewer routes with service tags in each route table. With this release, using service tags in routing scenarios for containers is also supported. </br>

#### Exact match

The system gives preference to the route with the explicit prefix when there's an exact prefix match between a route with an explicit IP prefix and a route with a service tag. When multiple routes with service tags have matching IP prefixes, routes are evaluated in the following order:

   1. Regional tags (for example, `Storage.EastUS` or `AppService.AustraliaCentral`)

   1. Top-level tags (for example, `Storage` or `AppService`)

   1. `AzureCloud` regional tags (for example, `AzureCloud.canadacentral` or `AzureCloud.eastasia`)

   1. The `AzureCloud` tag

To use this feature, specify a service tag name for the address prefix parameter in route table commands. For example, in PowerShell you can create a new route to direct traffic sent to an Azure Storage IP prefix to a virtual appliance by using this command:

```azurepowershell-interactive
$param = @{
    Name = 'StorageRoute'
    AddressPrefix = 'Storage'
    NextHopType = 'VirtualAppliance'
    NextHopIpAddress = '10.0.100.4'
}
New-AzRouteConfig @param
```

The same command for the Azure CLI is:

```azurecli-interactive
az network route-table route create \
    --resource-group MyResourceGroup \
    --route-table-name MyRouteTable \
    --name StorageRoute \
    --address-prefix Storage \
    --next-hop-type VirtualAppliance \
    --next-hop-ip-address 10.0.100.4
```

## Next hop types across Azure tools

The name displayed and referenced for next hop types is different between the Azure portal and command-line tools, and the Resource Manager and classic deployment models. The following table lists the names used to refer to each next hop type with the different tools and [deployment models](../azure-resource-manager/management/deployment-models.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

|Next hop type                   |Azure CLI and PowerShell (Resource Manager) |Azure classic CLI and PowerShell (classic)|
|-------------                   |---------                                       |-----|
|Virtual network gateway         |`VirtualNetworkGateway`                           | `VPNGateway` |
|Virtual network                 |`VNetLocal`                                       | `VNETLocal` (not available in the classic CLI in classic deployment model mode)|
|Internet                        |Internet                                        |Internet (not available in the classic CLI in classic deployment model mode)|
|Virtual appliance               |`VirtualAppliance`                                |`VirtualAppliance`|
|None                            |None                                            |Null (not available in the classic CLI in classic deployment model mode)|
|Virtual network peering         |Virtual network peering                                    |Not applicable|
|Virtual network service endpoint|`VirtualNetworkServiceEndpoint`                   |Not applicable|

### Border gateway protocol

An on-premises network gateway can exchange routes with an Azure virtual network gateway by using the BGP. Using BGP with an Azure virtual network gateway is dependent on the type you selected when you created the gateway:

* **ExpressRoute**: You must use BGP to advertise on-premises routes to the Microsoft edge router. You can't create UDRs to force traffic to the ExpressRoute virtual network gateway if you deploy a virtual network gateway deployed as the type **ExpressRoute**. You can use UDRs for forcing traffic from the express route to, for example, a network virtual appliance.
* **VPN**: Optionally, you can use BGP. For more information, see [BGP with site-to-site VPN connections](../vpn-gateway/vpn-gateway-bgp-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

When you exchange routes with Azure by using BGP, a separate route is added to the route table of all subnets in a virtual network for each advertised prefix. The route is added with **Virtual network gateway** listed as the source and next hop type.

You can disable ExpressRoute and Azure VPN Gateway route propagation on a subnet by using a property on a route table. When you disable route propagation, the system doesn't add routes to the route table of all subnets with virtual network gateway route propagation disabled. This process applies to both static routes and BGP routes. Connectivity with VPN connections is achieved by using [custom routes](#custom-routes) with a next hop type of **Virtual network gateway**. For more information, see [Disable virtual network gateway route propagation](manage-route-table.yml#create-a-route-table).

> [!NOTE]
> Route propagation shouldn't be disabled on `GatewaySubnet`. The gateway won't function if this setting is disabled.

## How Azure selects a route

When outbound traffic is sent from a subnet, Azure selects a route based on the destination IP address by using the longest prefix match algorithm. For example, a route table has two routes. One route specifies the 10.0.0.0/24 address prefix, and the other route specifies the 10.0.0.0/16 address prefix.

Azure directs traffic destined for 10.0.0.5 to the next hop type specified in the route with the 10.0.0.0/24 address prefix. This process occurs because 10.0.0.0/24 is a longer prefix than 10.0.0.0/16, even though 10.0.0.5 falls within both address prefixes.

Azure directs traffic destined for 10.0.1.5 to the next hop type specified in the route with the 10.0.0.0/16 address prefix. This process occurs because 10.0.1.5 isn't included in the 10.0.0.0/24 address prefix, which makes the route with the 10.0.0.0/16 address prefix the longest matching prefix.

If multiple routes contain the same address prefix, Azure selects the route type based on the following priority:

1. User-defined route

1. BGP route

1. System route

> [!NOTE]
> System routes for traffic related to virtual network, virtual network peerings, or virtual network service endpoints are preferred routes. They're preferred, even if BGP routes are more specific. Routes with a virtual network service endpoint as the next hop type can't be overridden, even when you use a route table.

For example, a route table contains the following routes:

|Source   |Address prefixes  |Next hop type           |
|---------|---------         |-------                 |
|Default  | 0.0.0.0/0        |Internet                |
|User     | 0.0.0.0/0        |Virtual network gateway |

When traffic is destined for an IP address outside the address prefixes of any other routes in the route table, Azure selects the route with the **User** source. Azure makes this choice because UDRs are a higher priority than system default routes.

For a comprehensive routing table with explanations of the routes in the table, see [Routing example](#routing-example).

## <a name="default-route"></a>0.0.0.0/0 address prefix

A route with the 0.0.0.0/0 address prefix gives instructions to Azure. Azure uses these instructions to route traffic destined for an IP address that doesn't fall within the address prefix of any other route in a subnet's route table. When a subnet is created, Azure creates a [default](#default) route to the 0.0.0.0/0 address prefix, with the **Internet** next hop type. If you don't override this route, Azure routes all traffic destined to IP addresses not included in the address prefix of any other route to the internet.

The exception is that traffic to the public IP addresses of Azure services remains on the Azure backbone network and isn't routed to the internet. When you override this route with a [custom](#custom-routes) route, traffic destined for addresses not within the address prefixes of any other route in the route table is directed. The destination depends on whether you specify a network virtual appliance or virtual network gateway in the custom route.

When you override the 0.0.0.0/0 address prefix, outbound traffic from the subnet flows through the virtual network gateway or virtual appliance. The following changes also occur with Azure default routing:

* Azure sends all traffic to the next hop type specified in the route, including traffic destined for public IP addresses of Azure services.

   When the next hop type for the route with the 0.0.0.0/0 address prefix is **Internet**, traffic from the subnet destined to the public IP addresses of Azure services never leaves the Azure backbone network, regardless of the Azure region in which the virtual network or Azure service resource exist.

   When you create a UDR or a BGP route with a **Virtual network gateway** or **Virtual appliance** next hop type, all traffic is sent to the next hop type specified in the route. This includes traffic sent to public IP addresses of Azure services for which you haven't enabled [service endpoints](virtual-network-service-endpoints-overview.md).

   When you enable a service endpoint for a service, Azure creates a route with address prefixes for the service. Traffic to the service doesn't route to the next hop type in a route with the 0.0.0.0/0 address prefix. The address prefixes for the service are longer than 0.0.0.0/0.

* You can no longer directly access resources in the subnet from the internet. You can access resources in the subnet from the internet indirectly. The device specified by the next hop type for a route with the 0.0.0.0/0 address prefix must process inbound traffic. After the traffic traverses the device, the traffic reaches the resource in the virtual network. If the route contains the following values for the next hop type:

    * **Virtual appliance**: The appliance must:

        * Be accessible from the internet.
        * Have a public IP address assigned to it.
        * Not have a network security group rule associated to it that prevents communication to the device.
        * Not deny the communication.
        * Be able to network address translate and forward, or proxy the traffic to the destination resource in the subnet and return the traffic back to the internet.

    * **Virtual network gateway**: If the gateway is an ExpressRoute virtual network gateway, an internet-connected device on-premises can network address translate and forward, or proxy the traffic to the destination resource in the subnet, via ExpressRoute [private peering](../expressroute/expressroute-circuit-peerings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#privatepeering).

If your virtual network is connected to an Azure VPN gateway, don't associate a route table to the [gateway subnet](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md?toc=%2fazure%2fvirtual-network%2ftoc.json#gwsub) that includes a route with a destination of 0.0.0.0/0. Doing so can prevent the gateway from functioning properly. For more information, see [Why are certain ports opened on my VPN gateway?](../vpn-gateway/vpn-gateway-vpn-faq.md?toc=%2fazure%2fvirtual-network%2ftoc.json#gatewayports).

For implementation details when you use virtual network gateways between the internet and Azure, see [DMZ between Azure and your on-premises datacenter](/azure/architecture/reference-architectures/dmz/secure-vnet-hybrid?toc=%2fazure%2fvirtual-network%2ftoc.json).

## Routing example

To illustrate the concepts in this article, the following sections describe:

* A scenario, with requirements.
* The custom routes that are necessary to meet the requirements.
* The route table that exists for one subnet that includes the default and custom routes that are necessary to meet the requirements.

> [!NOTE]
> This example isn't intended to be a recommended or best practices implementation. It's provided only to illustrate concepts in this article.

### Requirements

1. Implement two virtual networks in the same Azure region and enable resources to communicate between the virtual networks.

1. Enable an on-premises network to communicate securely with both virtual networks through a VPN tunnel over the internet. *Alternatively, you can use an ExpressRoute connection, but this example uses a VPN connection.*

1. For one subnet in one virtual network:

    * Route all outbound traffic from the subnet through a network virtual appliance for inspection and logging. Exclude traffic to Azure Storage and within the subnet from this routing.
    * Don't inspect traffic between private IP addresses within the subnet. Allow traffic to flow directly between all resources.
    * Drop any outbound traffic destined for the other virtual network.
    * Enable outbound traffic to Azure Storage to flow directly to storage, without forcing it through a network virtual appliance.

1. Allow all traffic between all other subnets and virtual networks.

### Implementation

The following diagram shows an implementation through the Resource Manager deployment model that meets the previous requirements.

:::image type="content" source="./media/virtual-networks-udr-overview/routing-example.png" alt-text="Diagram that shows a network implementation.":::

Arrows show the flow of traffic.

### Route tables

Here are the route tables for the preceding routing example.

#### Subnet1

The route table for *Subnet1* in the preceding diagram contains the following routes:

|ID  |Source |State  |Address prefixes    |Next hop type          |Next hop IP address|UDR name      |
|----|-------|-------|------              |-------                |--------           |--------      |
|1   |Default|Invalid|10.0.0.0/16         |Virtual network        |                   |              |
|2   |User   |Active |10.0.0.0/16         |Virtual appliance      |10.0.100.4         |Within-VNet1  |
|3   |User   |Active |10.0.0.0/24         |Virtual network        |                   |Within-Subnet1|
|4   |Default|Invalid|10.1.0.0/16         |Virtual network peering           |                   |              |
|5   |Default|Invalid|10.2.0.0/16         |Virtual network peering           |                   |              |
|6   |User   |Active |10.1.0.0/16         |None                   |                   |ToVNet2-1-Drop|
|7   |User   |Active |10.2.0.0/16         |None                   |                   |ToVNet2-2-Drop|
|8   |Default|Invalid|10.10.0.0/16        |Virtual network gateway|[X.X.X.X]          |              |
|9   |User   |Active |10.10.0.0/16        |Virtual appliance      |10.0.100.4         |To-On-Prem    |
|10  |Default|Active |[X.X.X.X]           |`VirtualNetworkServiceEndpoint`    |         |              |
|11  |Default|Invalid|0.0.0.0/0           |Internet               |                   |              |
|12  |User   |Active |0.0.0.0/0           |Virtual appliance      |10.0.100.4         |Default-NVA   |

Here's an explanation of each route ID:  

* **ID1**: Azure automatically added this route for all subnets within *Virtual-network-1* because 10.0.0.0/16 is the only address range defined in the address space for the virtual network. If you don't create the UDR in route ID2, traffic sent to any address between 10.0.0.1 and 10.0.255.254 is routed within the virtual network. This process occurs because the prefix is longer than 0.0.0.0/0 and doesn't fall within the address prefixes of any other routes.

   Azure automatically changed the state from **Active** to **Invalid**, when ID2, a UDR, was added. It has the same prefix as the default route, and UDRs override default routes. The state of this route is still **Active** for *Subnet2* because the route table that the UDR, ID2, is in isn't associated to *Subnet2*.

* **ID2**: Azure added this route when a UDR for the 10.0.0.0/16 address prefix was associated to the *Subnet1* subnet in the *Virtual-network-1* virtual network. The UDR specifies 10.0.100.4 as the IP address of the virtual appliance because the address is the private IP address assigned to the virtual appliance virtual machine. The route table in which this route exists isn't associated to *Subnet2*, so the route doesn't appear in the route table for *Subnet2*.

   This route overrides the default route for the 10.0.0.0/16 prefix (ID1), which automatically routed traffic addressed to 10.0.0.1 and 10.0.255.254 within the virtual network through the virtual network next hop type. This route exists to meet [requirement](#requirements) 3, which is to force all outbound traffic through a virtual appliance.

* **ID3**: Azure added this route when a UDR for the 10.0.0.0/24 address prefix was associated to the *Subnet1* subnet. Traffic destined for addresses between 10.0.0.1 and 10.0.0.254 remains within the subnet. The traffic isn't routed to the virtual appliance specified in the previous rule (ID2) because it has a longer prefix than the ID2 route.

   This route wasn't associated to *Subnet2*, so the route doesn't appear in the route table for *Subnet2*. This route effectively overrides the ID2 route for traffic within *Subnet1*. This route exists to meet [requirement](#requirements) 3.

* **ID4**: Azure automatically added the routes in IDs 4 and 5 for all subnets within *Virtual-network-1* when the virtual network was peered with *Virtual-network-2.* *Virtual-network-2* has two address ranges in its address space, 10.1.0.0/16 and 10.2.0.0/16, so Azure added a route for each range. If you don't create the UDRs in route IDs 6 and 7, traffic sent to any address between 10.1.0.1-10.1.255.254 and 10.2.0.1-10.2.255.254 is routed to the peered virtual network. This process occurs because the prefix is longer than 0.0.0.0/0 and doesn't fall within the address prefixes of any other routes.

   When you added the routes in IDs 6 and 7, Azure automatically changed the state from **Active** to **Invalid**. This process occurs because they have the same prefixes as the routes in IDs 4 and 5, and UDRs override default routes. The state of the routes in IDs 4 and 5 are still **Active** for *Subnet2* because the route table in which the UDRs in IDs 6 and 7 isn't associated to *Subnet2*. A virtual network peering was created to meet [requirement](#requirements) 1.

* **ID5**: Same explanation as ID4.
* **ID6**: Azure added this route and the route in ID7 when UDRs for the 10.1.0.0/16 and 10.2.0.0/16 address prefixes were associated to the *Subnet1* subnet. Azure drops traffic destined for addresses between 10.1.0.1-10.1.255.254 and 10.2.0.1-10.2.255.254, rather than being routed to the peered virtual network, because UDRs override default routes. The routes aren't associated to *Subnet2*, so the routes don't appear in the route table for *Subnet2*. The routes override the ID4 and ID5 routes for traffic leaving *Subnet1*. The ID6 and ID7 routes exist to meet [requirement](#requirements) 3 to drop traffic destined to the other virtual network.
* **ID7**: Same explanation as ID6.
* **ID8**: Azure automatically added this route for all subnets within *Virtual-network-1* when a VPN type virtual network gateway was created within the virtual network. Azure added the public IP address of the virtual network gateway to the route table. Traffic sent to any address between 10.10.0.1 and 10.10.255.254 is routed to the virtual network gateway. The prefix is longer than 0.0.0.0/0 and not within the address prefixes of any of the other routes. A virtual network gateway was created to meet [requirement](#requirements) 2.
* **ID9**: Azure added this route when a UDR for the 10.10.0.0/16 address prefix was added to the route table associated to *Subnet1*. This route overrides ID8. The route sends all traffic destined for the on-premises network to a network virtual appliance for inspection, rather than routing traffic directly on-premises. This route was created to meet [requirement](#requirements) 3.
* **ID10**: Azure automatically added this route to the subnet when a service endpoint to an Azure service was enabled for the subnet. Azure routes traffic from the subnet to a public IP address of the service, over the Azure infrastructure network. The prefix is longer than 0.0.0.0/0 and not within the address prefixes of any of the other routes. A service endpoint was created to meet [requirement](#requirements) 3 to enable traffic destined for Azure Storage to flow directly to Azure Storage.
* **ID11**: Azure automatically added this route to the route table of all subnets within *Virtual-network-1* and *Virtual-network-2.* The 0.0.0.0/0 address prefix is the shortest prefix. Any traffic sent to addresses within a longer address prefix are routed based on other routes.

   By default, Azure routes all traffic destined for addresses other than the addresses specified in one of the other routes to the internet. Azure automatically changed the state from **Active** to **Invalid** for the *Subnet1* subnet when a UDR for the 0.0.0.0/0 address prefix (ID12) was associated to the subnet. The state of this route is still **Active** for all other subnets within both virtual networks because the route isn't associated to any other subnets within any other virtual networks.

* **ID12**: Azure added this route when a UDR for the 0.0.0.0/0 address prefix was associated to the *Subnet1* subnet. The UDR specifies 10.0.100.4 as the IP address of the virtual appliance. This route isn't associated to *Subnet2*, so the route doesn't appear in the route table for *Subnet2*. All traffic for any address not included in the address prefixes of any of the other routes is sent to the virtual appliance.

   The addition of this route changed the state of the default route for the 0.0.0.0/0 address prefix (ID11) from **Active** to **Invalid** for *Subnet1* because a UDR overrides a default route. This route exists to meet [requirement](#requirements) 3.

#### Subnet2

The route table for *Subnet2* in the preceding diagram contains the following routes:

|Source  |State  |Address prefixes    |Next hop type             |Next hop IP address|
|------- |-------|------              |-------                   |--------           
|Default |Active |10.0.0.0/16         |Virtual network           |                   |
|Default |Active |10.1.0.0/16         |Virtual network peering              |                   |
|Default |Active |10.2.0.0/16         |Virtual network peering              |                   |
|Default |Active |10.10.0.0/16        |Virtual network gateway   |[X.X.X.X]          |
|Default |Active |0.0.0.0/0           |Internet                  |                   |
|Default |Active |10.0.0.0/8          |None                      |                   |
|Default |Active |100.64.0.0/10       |None                      |                   |
|Default |Active |192.168.0.0/16      |None                      |                   |

The route table for *Subnet2* contains all Azure-created default routes and the optional virtual network peering and virtual network gateway optional routes. Azure added the optional routes to all subnets in the virtual network when the gateway and peering were added to the virtual network.

Azure removed the routes for the 10.0.0.0/8, 192.168.0.0/16, and 100.64.0.0/10 address prefixes from the *Subnet1* route table when the UDR for the 0.0.0.0/0 address prefix was added to *Subnet1*.

## Related content

* [Create a UDR table with routes and a network virtual appliance](tutorial-create-route-table-portal.md).
* [Configure BGP for an Azure VPN Gateway](../vpn-gateway/vpn-gateway-bgp-resource-manager-ps.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
* [Use BGP with ExpressRoute](../expressroute/expressroute-routing.md?toc=%2fazure%2fvirtual-network%2ftoc.json#route-aggregation-and-prefix-limits). 
* [View all routes for a subnet](diagnose-network-routing-problem.md). A UDR table shows you only the UDRs, not the default, and BGP routes for a subnet. Viewing all routes shows you the default, BGP, and UDRs for the subnet in which a network interface is located.
* [Determine the next hop type](../network-watcher/diagnose-vm-network-routing-problem.md?toc=%2fazure%2fvirtual-network%2ftoc.json) between a virtual machine and a destination IP address. You can use the Azure Network Watcher next hop feature to determine whether traffic is leaving a subnet and being routed to where you think it should be.
