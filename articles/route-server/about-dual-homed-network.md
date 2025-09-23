---
title: About dual-homed networks with Azure Route Server
description: Learn how to use Azure Route Server in a dual-homed network architecture where you can connect a spoke virtual network to more than one hub virtual network.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: concept-article
ms.date: 09/17/2025
ai-usage: ai-assisted
#CustomerIntent: As an Azure administrator, I want to peer spoke virtual networks to more than one hub virtual network so that the resources in the spoke virtual networks can communicate through either of the hub virtual networks.
---

# About dual-homed networks with Azure Route Server

A dual-homed network architecture allows spoke virtual networks to connect to multiple hub virtual networks, providing redundancy and improved availability for your network infrastructure. This design pattern is particularly useful when you need multiple paths for connectivity, whether for high availability, load distribution, or different types of network connections.

In traditional hub-and-spoke architectures, spoke virtual networks are connected to a single hub virtual network that contains shared resources like VPN gateways, ExpressRoute gateways, and network virtual appliances (NVAs). However, in certain scenarios, you might need to connect a spoke to multiple hubs to achieve:

- **High availability**: Automatic failover between different connectivity paths
- **Load distribution**: Traffic can be distributed across multiple paths
- **Different connectivity types**: Separate hubs for different connection methods (VPN, ExpressRoute, internet)
- **Multi-region connectivity**: Connection to hubs in different Azure regions

Azure Route Server enables this dual-homed architecture by facilitating dynamic routing between the spoke virtual network and multiple hub virtual networks. This article explains how dual-homed networks work with Azure Route Server and provides guidance on implementation patterns.

## Dual-homed network overview

In a dual-homed network topology with Azure Route Server, a spoke virtual network is connected to two or more hub virtual networks simultaneously. Each hub virtual network typically contains:

- Network virtual appliances (NVAs) for traffic inspection, security, or routing
- Connectivity gateways (VPN gateways, ExpressRoute gateways)
- Shared services and resources

The spoke virtual network contains an Azure Route Server that facilitates dynamic route exchange between the spoke and all connected hub virtual networks. This setup allows workloads in the spoke virtual network to communicate through any of the hub virtual networks it's connected to.

### Benefits of dual-homed networks

Dual-homed network architectures provide several advantages:

- **Redundancy and high availability**: If one hub becomes unavailable, traffic can automatically failover to another hub
- **Performance optimization**: Traffic can be load-balanced across multiple paths
- **Flexible connectivity options**: Different hubs can provide different types of connectivity (VPN, ExpressRoute, internet breakout)
- **Simplified management**: Centralized routing policies and security controls in hub virtual networks

## Configuration requirements

To implement a dual-homed network with Azure Route Server, you need the following components:

### Prerequisites

- An Azure subscription with appropriate permissions
- Multiple hub virtual networks in the same or different regions
- A spoke virtual network that will be dual-homed
- Network virtual appliances deployed in each hub virtual network

### Architecture components

As shown in the following diagram, the dual-homed topology requires:

- **Azure Route Server**: Deployed in the spoke virtual network to manage dynamic routing
- **Network virtual appliances (NVAs)**: Deployed in each hub virtual network for traffic processing and routing
- **Virtual network peering**: Configured between the spoke and each hub virtual network
- **BGP peering**: Established between the route server and each NVA

:::image type="content" source="./media/about-dual-homed-network/dual-homed-topology.png" alt-text="Diagram showing Azure Route Server in a dual-homed network topology with multiple hub virtual networks.":::

### Configuration steps

To set up a dual-homed network:

1. **Deploy Azure Route Server** in the spoke virtual network
2. **Deploy network virtual appliances** in each hub virtual network
3. **Configure virtual network peering** between the spoke and each hub virtual network
4. **Establish BGP peering** between the route server and each NVA

## How dual-homed networks work

The dual-homed network operates in two planes: the control plane for route exchange and the data plane for actual traffic flow.

### Control plane operations

In the control plane, Azure Route Server facilitates dynamic route exchange:

1. **Route learning**: The NVA in each hub virtual network learns about spoke virtual network addresses from the route server
2. **Route advertisement**: The route server learns routes from each NVA and advertises them accordingly
3. **Route programming**: The route server programs all virtual machines in the spoke virtual network with the learned routes
4. **Dynamic updates**: Route changes are automatically propagated across the network as topology changes occur

### Data plane operations

In the data plane, traffic flows through the established paths:

1. **Traffic routing**: Virtual machines in the spoke virtual network route traffic to NVAs in hub virtual networks based on the programmed routes
2. **Hub selection**: Traffic can be directed to different hubs based on routing policies, destination, or availability
3. **Failover capability**: When an active hub fails, traffic automatically fails over to available alternative hubs

### High availability modes

You can configure the dual-homed network for different availability patterns:

- **Active/active**: Both hubs process traffic simultaneously, providing load distribution
- **Active/passive**: One hub serves as the primary path while others remain standby for failover scenarios

This setup ensures network resilience against various failure scenarios, including NVA failures, connectivity issues, or complete hub virtual network outages.

## ExpressRoute integration in dual-homed networks

You can extend the dual-homed network architecture to include ExpressRoute connectivity, enabling hybrid connectivity through multiple paths. This configuration is particularly useful for scenarios requiring redundant on-premises connectivity or different ExpressRoute circuits.

### Additional requirements for ExpressRoute integration

To integrate ExpressRoute with your dual-homed network, you need:

- **Azure Route Server in hub virtual networks**: Deploy a route server in each hub virtual network that contains an ExpressRoute gateway
- **ExpressRoute gateways**: Deploy ExpressRoute gateways in hub virtual networks as needed
- **BGP peering**: Configure BGP peering between NVAs and route servers in hub virtual networks
- **Route exchange**: Enable route exchange between ExpressRoute gateways and route servers in hub virtual networks
- **Peering configuration**: Disable "Use Remote Gateway or Remote Route Server" in the spoke virtual network peering configuration

:::image type="content" source="./media/about-dual-homed-network/dual-homed-topology-expressroute.png" alt-text="Diagram showing Azure Route Server in a dual-homed network topology with ExpressRoute connectivity.":::

### How ExpressRoute integration works

The integration operates across both control and data planes:

#### Control plane with ExpressRoute

1. **Route learning**: NVAs in hub virtual networks learn on-premises routes from ExpressRoute gateways through route exchange with route servers
2. **Route advertisement**: NVAs advertise spoke virtual network addresses to ExpressRoute gateways through the same route servers
3. **Route distribution**: Route servers in both spoke and hub virtual networks program on-premises network addresses to virtual machines in their respective virtual networks

#### Data plane with ExpressRoute

1. **Outbound traffic**: Virtual machines in the spoke virtual network send on-premises-destined traffic to NVAs in hub virtual networks
2. **Traffic forwarding**: NVAs forward traffic to on-premises networks through ExpressRoute connections
3. **Inbound traffic**: Traffic from on-premises networks follows the reverse path back to spoke virtual networks

> [!IMPORTANT]
> BGP loop prevention requires special configuration. BGP prevents loops by checking the AS number in the AS Path. When a route server receives a BGP packet containing its own AS number in the AS Path, it drops the packet. Since both route servers use the same AS number (65515), you must configure the NVA to apply the **as-override** BGP policy when peering with each route server. This prevents route servers from dropping routes from each other.

### Best practices for ExpressRoute integration

- Configure route filters to control which routes are advertised between on-premises and Azure
- Monitor BGP sessions to ensure proper route exchange
- Test failover scenarios to validate high availability
- Consider route preferences and metrics to control traffic flow patterns

## Next steps

- Learn about [Azure Route Server support for ExpressRoute and Azure VPN](expressroute-vpn-support.md)
- Learn how to [configure peering between Azure Route Server and network virtual appliances](peer-route-server-with-virtual-appliance.md)
- Learn how to [configure Azure Route Server](configure-route-server.md)