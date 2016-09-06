<properties 
   pageTitle="VPN Gateway planning and design| Microsoft Azure"
   description="Learn about VPN Gateway planning and design for cross-premises, hybrid, and VNet-to-VNet connections"
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-service-management,azure-resource-manager"/>
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/16/2016"
   ms.author="cherylmc"/>

# Planning and design for VPN Gateway

Planning and designing your cross-premises and VNet-to-VNet configurations can be either very simple, or quite complicated, depending on your networking needs. This article will walk you through basic planning and design considerations.

## Planning


### <a name="compare"></a>Cross-premises connectivity options

If you have decided that you want to connect your on-premises sites securely to a virtual network, you have three different ways to do so: Site-to-Site, Point-to-Site, and ExpressRoute. Compare the different cross-premises connections that are available. The option you choose can depend on a variety of considerations, such as:


- What kind of throughput does your solution require?
- Do you want to communicate over the public Internet via secure VPN, or over a private connection?
- Do you have a public IP address available to use?
- Are you planning to use a VPN device? If so, is it compatible?
- Are you connecting just a few computers, or do you want a persistent connection for your site?
- What type of VPN gateway is required for the solution you want to create?
- Which gateway SKU should you use?


The table below can help you decide the best connectivity option for your solution.


[AZURE.INCLUDE [vpn-gateway-cross-premises](../../includes/vpn-gateway-cross-premises-include.md)]



### <a name="gwrequire"></a>Gateway requirements by VPN type and SKU


When you create a VPN gateway, you'll need to specify the gateway SKU that you want to use. 
There are 3 VPN Gateway SKUs:

- Basic
- Standard
- High Performance

[AZURE.INCLUDE [vpn-gateway-table-requirements](../../includes/vpn-gateway-table-requirements-include.md)] 



### <a name="aggthroughput"></a>Gateway types and aggregate throughput estimates

The table below shows the gateway types and the estimated aggregate throughput. The estimated aggregate throughput may be a deciding factor for your design.
Pricing does differ between gateway SKUs. For information about pricing, see [VPN Gateway Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/). This table applies to both the Resource Manager and classic deployment models.

[AZURE.INCLUDE [vpn-gateway-table-gwtype-aggtput](../../includes/vpn-gateway-table-gwtype-aggtput-include.md)] 



### <a name="wf"></a>Workflow

The following list outlines the common workflow for cloud connectivity:

1.	Design and plan your connectivity topology and list the address spaces for all networks you want to connect.
2.	Create an Azure virtual network. 
3.	Create a VPN gateway for the virtual network.
4.	Create and configure connections to on-premises networks or other virtual networks (as needed).
5.	Create and configure a Point-to-Site connection for your Azure VPN gateway (as needed).
 

## Design

### <a name="topologies"></a>Connection topologies

Start by looking at the diagrams in the [Connection toplogies](vpn-gateway-topology.md) article. The article contains basic diagrams, the deployment models for each topology (Resource Manager or classic), and which deployment tools you can use to deploy your configuration. 

### <a name="designbasics"></a>Design basics

The sections below discuss the VPN gateway basics. Additionally, you will want to take into consideration the [Networking services limitations](../articles/azure-subscription-service-limits.md#networking-limits).


#### <a name="subnets"></a>About subnets

When planning and designing the connection that will work best for your environment, it is very important to consider the IP address ranges and subnets that you have available to use.

You'll need to create a gateway subnet for your VNet to configure a VPN gateway. All gateway subnets must be named GatewaySubnet to work properly. Be sure not to name your gateway subnet a different name, and don't deploy VMs or anything else to the gateway subnet. For more information about gateway subnets, see the [Gateway subnet](vpn-gateway-about-vpngateways.md#gwsub) section in the About VPN Gateways article.

When you are creating connections, in many cases you will need to be concerned about overlapping subnet address ranges between your connections. An overlapping subnet is when one virtual network or on-premises location contains the same address space that the other location contains. This means that you'll need your network engineers for your local on-premises networks to carve out a range for you to use for your Azure IP addressing space/subnets. You'll need address space that is not being used on the local on-premises network. 

Avoiding overlapping subnets is also important when you are working with VNet-to-VNet connections. Creating a VNet-to-VNet connection will fail If if your subnets overlap and an IP address exists in both the sending and destination VNets. In this case, Azure can't route the data to the other VNet because the destination address is part of the sending VNet. 



#### <a name="local"></a>About local network gateways

The local network gateway typically refers to your on-premises location. In the classic deployment model, the local network gateway was referred to as a Local Site. You'll give the local network gateway a name, the public IP address of the on premise VPN device, and specify the address prefixes that are located on the on-premises location. Azure will look at the destination address prefixes for network traffic, consult the configuration that you have specified for your local network gateway, and route packets accordingly. You can modify these address prefixes as needed. For more information about local network gateways, see the [Local network gateways](vpn-gateway-about-vpngateways.md#lng) section in the About VPN Gateways article.


#### <a name="gwtype"></a>About gateway types

Selecting the correct gateway type for your topology is critical. Your gateway will not work properly if you select the wrong type. The gateway type specifies how the gateway itself connects and is a required configuration setting for the Resource Manager deployment model.

The gateway types are:

- Vpn
- ExpressRoute

#### <a name="connectiontype"></a>About connection types

Each configuration requires a specific connection type. The connection types are:

- IPsec
- Vnet2Vnet
- ExpressRoute
- VPNClient


#### <a name="vpntype"></a>About VPN types

Each configuration requires a specific VPN type in order to work. If you are combining two configurations, such as creating a Site-to-Site connection and a Point-to-Site connection to the same VNet, you must use a VPN type that satisfies both connection requirements. In the case of Point-to-Site and Site-to-Site coexisting connections, you must use a route-based VPN type when working with the Azure Resource Manager deployment model, or a dynamic gateway if you are working with the classic deployment mode.

[AZURE.INCLUDE [vpn-gateway-vpntype](../../includes/vpn-gateway-vpntype-include.md)] 

The tables below show the VPN type as it maps to each connection configuration. Make sure the VPN type for your gateway matches the configuration that you want to create. 


[AZURE.INCLUDE [vpn-gateway-table-vpntype](../../includes/vpn-gateway-table-vpntype-include.md)] 

### <a name="devices"></a>VPN devices for Site-to-Site connections

To configure a Site-to-Site connection, regardless of deployment model, you will need the following items:

- A VPN device that is compatible with Azure VPN gateways
- A public-facing IPv4 IP address that is not behind a NAT

You will need to have experience configuring your VPN device. For more information about VPN devices, see [About VPN devices](vpn-gateway-about-vpn-devices.md). The VPN devices article contains information about validated devices, requirements for devices that have not been validated, and links to the device configuration documents for each device if they are available.

### <a name="forcedtunnel"></a>Consider forced tunnel routing

For most configurations, you can configure forced tunneling. Forced tunneling lets you redirect or "force" all Internet-bound traffic back to your on-premises location via a Site-to-Site VPN tunnel for inspection and auditing. This is a critical security requirement for most enterprise IT policies. 

Without forced tunneling, Internet-bound traffic from your VMs in Azure will always traverse from Azure network infrastructure directly out to the Internet, without the option to allow you to inspect or audit the traffic. Unauthorized Internet access can potentially lead to information disclosure or other types of security breaches.

For more information about configuring forced tunneling, see [About forced tunneling for the classic deployment model](vpn-gateway-about-forced-tunneling.md) and [About forced tunneling for the Resource Manager deployment model](vpn-gateway-about-forced-tunneling.md).

**Forced tunneling diagram**

![Forced Tunneling connection](./media/vpn-gateway-plan-design/forced-tunnel.png "forced tunneling")

A forced tunneling connection can be configured in both deployment models and by using different tools. See the table below for more information. We update this table as new articles, new deployment models, and additional tools become available for this configuration. When an article is available, we link directly to it from the table.

[AZURE.INCLUDE [vpn-gateway-table-forcedtunnel](../../includes/vpn-gateway-table-forcedtunnel-include.md)] 



## Next steps

See the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md) and [About VPN Gateway](vpn-gateway-about-vpngateways.md) articles for more information to help you with your design. 

For more information about connection topologies, see [Connection toplogies](vpn-gateway-topology.md).



