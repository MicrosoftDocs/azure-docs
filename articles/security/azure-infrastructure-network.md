---
title: Azure network architecture
description: This article provides a general description of the Microsoft Azure infrastructure network.
services: security
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: TomSh

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/25/2018
ms.author: terrylan

---

# Azure network architecture
The Azure network architecture follows a modified version of the industry standard Core/Distribution/Access model, with distinct hardware layers. The layers include:

- Core (Datacenter Routers)
- Distribution (Access Routers and L2 Aggregation) - the Distribution layer separates L3 routing from L2 switching
- Access (L2 Host switches)

The network architecture has two levels of layer 2 switches, one layer aggregating traffic from the other and layer 2 loops to incorporate redundancy. This provides benefits such as a more flexible VLAN footprint, and improves port scaling. The architecture keeps L2 and L3 distinct, which allows the use of hardware in each of the distinct layers in the network, and minimizes fault in one layer from affecting the other layer(s). The use of trunks allows for resource sharing, such as the connectivity to the L3 infrastructure.

## Network configuration
The network architecture of a Microsoft Azure cluster within a datacenter consists of the following devices:

- Routers (Datacenter, Access Router, and Border Leaf Routers)
- Switches (Aggregation and Top of Rack Switches)
- Digi CMs
- PDUs or Nucleons

The figure below provides a high-level overview of Azure’s network architecture within a cluster. Azure has two separate architectures. Some existing Azure customers and shared services reside on the Default LAN architecture (DLA) whereas new regions and virtual customers will be accessed through Quantum 10 (Q10) architecture. The DLA architecture is a traditional tree design with active passive access routers and security ACLs applied to the access routers. The Quantum 10 Architecture is a clos/mesh design of routers where ACLs are not applied at the routers but below the routing through Software Load Balancing (SLB) or software defined VLANs.

![Azure network][1]

### Quantum 10 Devices
The Quantum 10 design conducts layer 3 switching spread over multiple devices in a CLOS/mesh design. The advantages of the Q10 design include larger capability and greater ability to scale existing network infrastructure. The design employs border leaf routers, spine switches, and Top of Rack Routers to pass traffic to clusters across multiple routes allowing for fault tolerance. Security services such as network address translation are handled through Software Load Balancing instead of on hardware devices.

### Access Routers
The distribution/access L3 routers (ARs) perform the primary routing functionality for the distribution and access layers. These devices are deployed as a pair, and are the default gateway for subnets. Each AR pair can support multiple L2 Aggregation switch pairs, depending on capacity. The maximum number depends on the capacity of the device, as well as failure domains. A typical number based on expected capacity would be three L2 Aggregation switch pairs per AR pair.

### L2 Aggregation Switches  
These devices serve as an aggregation point for L2 traffic. They are the distribution layer for the L2 fabric and can handle large amounts of traffic. Because these devices aggregate traffic, 802.1q functionality is required and high bandwidth technologies such as port aggregation and 10GE are used.

### L2 Host Switches
Hosts connect directly to these switches. They can be rack mounted switches, or chassis deployments. The 802.1q standard allows for the designation of one VLAN as a native VLAN, treating that VLAN as normal (untagged) Ethernet framing. Under normal circumstances, frames on the native VLAN are transmitted and received untagged on an 802.1q trunk port. This feature was designed for migration to 802.1q and compatibility with non-802.1q capable devices. In this architecture, only the network infrastructure utilizes the native VLAN.

This architecture specifies a standard for native VLAN selection that ensures, where possible, that the AR devices have a unique native VLAN for every trunk and the L2Aggregation to L2Aggregation trunks. The L2Aggregation to L2Host Switch trunks have a non-default native VLAN.

### Link Aggregation (802.3ad)
Link Aggregation (LAG) allows multiple individual links to be bundled together and treated as a single logical link. The number used to designate port-channel interfaces needs to be standardized so to make operational debugging easier, the rest of the network will use the same number at both ends of a port-channel. This requires a standard to determine which end of the port-channel to use to define the next available number.

The numbers specified for the L2Agg to L2Host switch are the port-channel numbers used on the L2Agg side. Because the range of numbers is more limited at the L2Host side, the standard is to use numbers 1 and 2 at the L2Host side to refer to the port-channel going to the “a” side and the “b” respectively.

### VLANs
The network architecture uses VLANs to group servers together into a single broadcast domain. VLAN numbers conform to 802.1q standards, which supports VLANs numbered 1 – 4094.

### Customer VLANS
Customers have various VLAN implementation options they can deploy through the Azure Portal to meet the separation and architecture needs of their solution. These solutions are deployed through virtual machines. For customer reference architecture examples visit [Azure Reference Architectures](https://docs.microsoft.com/azure/architecture/reference-architectures/).

### Edge Architecture
Azure datacenters are built upon highly redundant and well-provisioned network infrastructures. Networks within the Azure datacenters are implemented with “need plus one” (N+1) redundancy architectures or better. Full failover features within and between datacenters help to ensure network and service availability. Externally, datacenters are served by dedicated, high-bandwidth network circuits that redundantly connect properties with over 1200 Internet Service Providers globally at multiple peering points, providing in excess of 2,000 Gbps of potential edge capacity across the network.

Filtering routers at the edge and access layer of the Microsoft Azure network provide well established security at the packet level to prevent unauthorized attempts to connect to Azure. They help to ensure that the actual contents of the packets contain data in the expected format and conform to the expected client/server communication scheme. Azure implements a tiered architecture consisting of the following network segregation and access control components:

- Edge Routers - Segregate the application environment from the Internet. Edge routers are designed to provide anti-spoof protection and limit access using Access Control Lists (ACLs).
- Distribution (Access) Routers - Access routers are designed to allow only Microsoft approved IP addresses, provide anti-spoofing, and established connections using ACLs.

### A10 DDOS Mitigation Architecture
Denial of service attacks continue to present a real threat to the reliability of Microsoft’s online services. As attacks become more targeted, more sophisticated, and as Microsoft’s services become more geographically diverse, the ability to provide effective mechanisms to identify and minimize the impact of these attacks is a high priority.

The following details explain how the A10 DDOS mitigation system is implemented from a network architecture perspective.  
Microsoft Azure uses A10 network devices at the DCR (Datacenter Router) that provide automated detection and mitigation. The A10 solution utilizes Azure Network Monitoring to sample Net flow packets and determine if there is an attack. Once the attack is detected, A10 devices are used as scrubbers to mitigate attacks. After mitigation, further clean traffic is allowed into the Azure datacenter directly from the DCR. The A10 solution is used to protect the Azure network infrastructure.

DDoS protections in the A10 solution include:

- UDP IPv4 and IPv6 flood protection
- ICMP IPv4 and IPv6 flood protection
- TCP IPv4 and IPv6 flood protection
- TCP SYN attack protection for IPv4 and IPv6
- Fragmentation attack

> [!NOTE]
> DDoS protection is provided by default for all Azure customers.
>
>

## Network Connection Rules
Azure deploys edge routers on its network that provide security at the packet level to prevent unauthorized attempts to connect to Microsoft Azure. They ensure that the actual contents of the packets contain data in the expected format and conform to the expected client/server communication scheme.

Edge Routers segregate the application environment from the Internet. Edge routers are designed to provide anti-spoof protection and limit access using Access Control Lists (ACLs). These edge routers are configured using a tiered ACL approach to limit network protocols that are allowed to transit the edge routers and access routers.

Network devices are positioned at access and edge locations and act as boundary points where ingress and/or egress filters are applied.

## Next steps

<!--Image references-->
[1]: ./media/azure-infrastructure-network/network-arch.png
