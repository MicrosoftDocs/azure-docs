---
title: 'Azure for Network Engineers'
description: This page explains to traditional network engineers how networks work in Azure.
documentationcenter: na
services: networking
author: osamazia
manager: tracsman
ms.service: virtual-network
ms.topic: article
ms.workload: infrastructure-services
ms.date: 06/25/2020
ms.author: osamaz

---
# Azure for network engineers
As a conventional network engineer you have dealt with physical assets such as routers, switches, cables, firewalls to build infrastructure. At a logical layer you have configured virtual LAN (VLAN), Spanning Tree Protocol (STP), routing protocols (RIP, OSPF, BGP). You have managed your network using management tools and CLI. Networking in the cloud is different where network endpoints are logical and use of routing protocols is minimum. You will work with Azure Resource Manager API, Azure CLI, and PowerShell for configuring and managing assets in Azure. You will start your network journey in the cloud by understanding basic tenants of Azure networking. 
## Virtual network
When you design a network from bottom up, you gather some basic information. This information could be number of hosts, network devices, number of subnets, routing between subnets, isolation domains such as VLANs. This information helps in sizing the network and security devices as well creating the architecture to support applications and services.

When you plan to deploy your applications and services in Azure, you will start by creating a logical boundary in Azure, which is called a virtual network. This virtual network is akin to a physical network boundary. As it is a virtual network, you don't need physical gear but still have to plan for the logical entities such as IP addresses, IP subnets, routing, and policies.

When you create a virtual network in Azure, it's pre-configured with an IP range (10.0.0.0/16). This range isn't fixed, you can define your own IP range. You can define both IPv4 and IPv6 address ranges. IP ranges defined for the virtual network are not advertised to Internet. You can create multiple subnets from your IP range. These subnets will be used to assign IP addresses to virtual network interfaces (vNICs). First four IP addresses from each subnet are reserved and can't be used for IP allocation. There is no concept of VLANs in a public cloud. However, you can create isolation within a virtual network based on your defined subnets.

You can create one large subnet encompassing all the virtual network address space or choose to create multiple subnets. However, if you are using a virtual network gateway, Azure requires you to create a subnet with the name "gateway subnet". Azure will use this subnet to assign IP addresses to virtual network gateways. 

## IP allocation

When you assign an IP address to a host, you actually assign IP to a network interface card (NIC). You can assign two types of IP addresses to a NIC in Azure:

- Public IP addresses - Used to communicate inbound and outbound (without network address translation (NAT)) with the Internet and other Azure resources not connected to a virtual network. Assigning a public IP address to a NIC is optional. Public IP addresses belong to Microsoft IP address space.
- Private IP addresses - Used for communication within a virtual network, your on-premises network, and the Internet (with NAT). IP address space that you define in the virtual network is considered private even if you configure your public IP address space. Microsoft does not advertise this space to Internet. You must assign at least one private IP address to a VM.

As with physical hosts or devices, there are two ways to allocate an IP address to a resource - dynamic or static. In Azure, default allocation method is dynamic, where an IP address is allocated when you create a virtual machine (VM) or start a stopped VM. The IP address is released when you stop or delete the VM. To ensure the IP address for the VM remains the same, you can set the allocation method explicitly to static. In this case, an IP address is assigned immediately. It is released only when you delete the VM or change its allocation method to dynamic. 

Private IP addresses are allocated from the subnets you have defined within a virtual network. For a VM, you choose a subnet for the IP allocation. If a VM contains multiple NICs, you can choose a different subnet for each NIC.

## Routing
When you create a virtual network, Azure creates a routing table for your network. This routing table contains following types of routes.
- System routes
- Subnet default routes
- Routes from other virtual networks
- BGP routes
- Service endpoint routes
- User Defined Routes (UDR)

When you create a virtual network for the first time without defining any subnets, Azure creates routing entries in the routing table. These routes are called system routes. System routes are defined at this location. You cannot modify these routes. However, you can override systems routes by configuring UDRs.

When you create one or multiple subnets inside a virtual network, Azure creates default entries in the routing table to enable communication between these subnets within a virtual network. These routes can be modified by using static routes, which are User Defined Routes (UDR) in Azure.

When you create a virtual network peering between two virtual networks, a route is added for each address range within the address space of each virtual network a peering is created for.

If your on-premises network gateway exchanges border gateway protocol (BGP) routes with an Azure virtual network gateway, a route is added for each route propagated from the on-premises network gateway. These routes appear in the routing table as BGP routes.

The public IP addresses for certain services are added to the route table by Azure when you enable a service endpoint to the service. Service endpoints are enabled for individual subnets within a virtual network. When you enable a service endpoint, route is only added to the route table of for the subnet that belongs to this service. Azure manages the addresses in the route table automatically when the addresses change.

User-defined routes are also called Custom routes. You create UDR in Azure to override Azure's default system routes, or to add additional routes to a subnet's route table. In Azure, you create a route table, then associate the route table to virtual network subnets.

When you have competing entries in a routing table, Azure selects the next hop based on the longest prefix match similar to traditional routers. However, if there are multiple next hop entries with the same address prefix then Azure selects the routes in following order.
1. User-defined routes (UDR)
1. BGP routes
1. System routes

## Security

You can filter network traffic to and from resources in a virtual network using network security groups. You can also use network virtual appliances (NVA) such as Azure Firewall or firewalls from other vendors. You can control how Azure routes traffic from subnets. You can also limit who in your organization can work with resources in virtual networks.

A network security group (NSG) contains a list of Access Control List (ACL) rules that allow or deny network traffic to subnets, NICs, or both. NSGs can be associated with either subnets or individual NICs connected to a subnet. When an NSG is associated with a subnet, the ACL rules apply to all the VMs in that subnet. In addition, traffic to an individual NIC can be restricted by associating an NSG directly to a NIC.

NSGs contain two sets of rules: inbound and outbound. The priority for a rule must be unique within each set. Each rule has properties of protocol, source and destination port ranges, address prefixes, direction of traffic, priority, and access type. All NSGs contain a set of default rules. The default rules cannot be deleted, but because they are assigned the lowest priority, they can be overridden by the rules that you create.

## Verification
### Routes in virtual network
The combination of routes you create, Azure's default routes, and any routes propagated from your on-premises network through an Azure VPN gateway (if your virtual network is connected to your on-premises network) via the border gateway protocol (BGP), are the effective routes for all network interfaces in a subnet. You can see these effective routes by navigating to NIC either via Portal, PowerShell, or CLI.
### Network Security Groups
The effective security rules applied to a network interface are an aggregation of the rules that exist in the NSG associated to a network interface, and the subnet the network interface is in. You can view all the effective security rules from NSGs that are applied on your VM's network interfaces by navigating to the NIC via Portal, PowerShell, or CLI.

## Next steps

Learn about [virtual network][VNet].

Learn about [virtual network routing][vnet-routing].

Learn about the [network security groups][network-security].

<!--Link References-->
[VNet]: ../virtual-network/tutorial-connect-virtual-networks-portal.md
[vnet-routing]: ../virtual-network/virtual-networks-udr-overview.md
[network-security]: ../virtual-network/network-security-groups-overview.md
