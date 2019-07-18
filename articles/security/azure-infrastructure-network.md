---
title: Azure network architecture
description: This article provides a general description of the Microsoft Azure infrastructure network.
services: security
documentationcenter: na
author: TerryLanfear
manager: barbkess
editor: TomSh

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/20/2019
ms.author: terrylan

---

# Azure network architecture
The Azure network architecture follows a modified version of the industry standard core/distribution/access model, with distinct hardware layers. The layers include:

- Core (datacenter routers)
- Distribution (access routers and L2 aggregation). The distribution layer separates L3 routing from L2 switching.
- Access (L2 host switches)

The network architecture has two levels of layer 2 switches. One layer aggregates traffic from the other layer. The second layer loops to incorporate redundancy. The architecture provides a more flexible VLAN footprint, and improves port scaling. The architecture keeps L2 and L3 distinct, which allows the use of hardware in each of the distinct layers in the network, and minimizes fault in one layer from affecting the other layer(s). The use of trunks allows for resource sharing, such as the connectivity to the L3 infrastructure.

## Network configuration
The network architecture of an Azure cluster within a datacenter consists of the following devices:

- Routers (datacenter, access router, and border leaf routers)
- Switches (aggregation and top-of-rack switches)
- Digi CMs
- Power distribution units

Azure has two separate architectures. Some existing Azure customers and shared services reside on the default LAN architecture (DLA), whereas new regions and virtual customers reside on Quantum 10 (Q10) architecture. The DLA architecture is a traditional tree design, with active/passive access routers and security access control lists (ACLs) applied to the access routers. The Quantum 10 architecture is a Close/mesh design of routers, where ACLs are not applied at the routers. Instead, ACLs are applied below the routing, through Software Load Balancing (SLB) or software defined VLANs.

The following diagram provides a high-level overview of the network architecture within an Azure cluster:

![Diagram of Azure network][1]

### Quantum 10 devices
The Quantum 10 design conducts layer 3 switching spread over multiple devices in a Clos/mesh design. The advantages of the Q10 design include larger capability and greater ability to scale existing network infrastructure. The design employs border leaf routers, spine switches, and top-of-rack routers to pass traffic to clusters across multiple routes, allowing for fault tolerance. Software load balancing, instead of hardware devices, handles security services such as network address translation.

### Access routers
The distribution/access L3 routers (ARs) perform the primary routing functionality for the distribution and access layers. These devices are deployed as a pair, and are the default gateway for subnets. Each AR pair can support multiple L2 aggregation switch pairs, depending on capacity. The maximum number depends on the capacity of the device, as well as failure domains. A typical number is three L2 aggregation switch pairs per AR pair.

### L2 aggregation switches  
These devices serve as an aggregation point for L2 traffic. They are the distribution layer for the L2 fabric, and can handle large amounts of traffic. Because these devices aggregate traffic, they require 802.1q functionality, and high-bandwidth technologies such as port aggregation and 10GE.

### L2 host switches
Hosts connect directly to these switches. They can be rack-mounted switches, or chassis deployments. The 802.1q standard allows for the designation of one VLAN as a native VLAN, treating that VLAN as normal (untagged) Ethernet framing. Under normal circumstances, frames on the native VLAN are transmitted and received untagged on an 802.1q trunk port. This feature was designed for migration to 802.1q and compatibility with non-802.1q capable devices. In this architecture, only the network infrastructure uses the native VLAN.

This architecture specifies a standard for native VLAN selection. The standard ensures, where possible, that the AR devices have a unique, native VLAN for every trunk and the L2Aggregation to L2Aggregation trunks. The L2Aggregation to L2Host Switch trunks have a non-default native VLAN.

### Link aggregation (802.3ad)
Link aggregation allows multiple individual links to be bundled together, and treated as a single logical link. To facilitate operational debugging, the number used to designate port-channel interfaces should be standardized. The rest of the network uses the same number at both ends of a port-channel.

The numbers specified for the L2Agg to L2Host switch are the port-channel numbers used on the L2Agg side. Because the range of numbers is more limited at the L2Host side, the standard is to use numbers 1 and 2 at the L2Host side. These refer to the port-channel going to the “a” side and the “b” side, respectively.

### VLANs
The network architecture uses VLANs to group servers together into a single broadcast domain. VLAN numbers conform to 802.1q standard, which supports VLANs numbered 1–4094.

### Customer VLANs
You have various VLAN implementation options you can deploy through the Azure portal to meet the separation and architecture needs of your solution. You deploy these solutions through virtual machines. For customer reference architecture examples, see [Azure reference architectures](https://docs.microsoft.com/azure/architecture/reference-architectures/).

### Edge architecture
Azure datacenters are built upon highly redundant and well-provisioned network infrastructures. Microsoft implements networks within the Azure datacenters with “need plus one” (N+1) redundancy architectures or better. Full failover features within and between datacenters help to ensure network and service availability. Externally, datacenters are served by dedicated, high-bandwidth network circuits. These circuits redundantly connect properties with over 1200 internet service providers globally at multiple peering points. This provides in excess of 2,000 Gbps of potential edge capacity across the network.

Filtering routers at the edge and access layer of the Azure network provides well-established security at the packet level and helps to prevent unauthorized attempts to connect to Azure. The routers help to ensure that the actual contents of the packets contain data in the expected format, and conform to the expected client/server communication scheme. Azure implements a tiered architecture, consisting of the following network segregation and access control components:

- **Edge routers.** These segregate the application environment from the internet. Edge routers are designed to provide anti-spoof protection and limit access by using ACLs.
- **Distribution (access) routers.** These allow only Microsoft approved IP addresses, provide anti-spoofing, and establish connections by using ACLs.

### DDOS mitigation
Distributed denial of service (DDoS) attacks continue to present a real threat to the reliability of online services. As attacks become more targeted and sophisticated, and as the services Microsoft provides become more geographically diverse, identifying and minimizing the impact of these attacks is a high priority.

[Azure DDoS Protection Standard](../virtual-network/ddos-protection-overview.md) provides defense against DDoS attacks. See [Azure DDoS Protection: Best practices and reference architectures](azure-ddos-best-practices.md) to learn more.

> [!NOTE]
> Microsoft provides DDoS protection by default for all Azure customers.
>
>

## Network connection rules
On its network, Azure deploys edge routers that provide security at the packet level to prevent unauthorized attempts to connect to Azure. Edge routers ensure that the actual contents of the packets contain data in the expected format, and conform to the expected client/server communication scheme.

Edge routers segregate the application environment from the internet. These routers are designed to provide anti-spoof protection, and limit access by using ACLs. Microsoft configures edge routers by using a tiered ACL approach, to limit network protocols that are allowed to transit the edge routers and access routers.

Microsoft positions network devices at access and edge locations, to act as boundary points where ingress or egress filters are applied.

## Next steps
To learn more about what Microsoft does to help secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](azure-physical-security.md)
- [Azure infrastructure availability](azure-infrastructure-availability.md)
- [Azure information system components and boundaries](azure-infrastructure-components.md)
- [Azure production network](azure-production-network.md)
- [Azure SQL Database security features](azure-infrastructure-sql.md)
- [Azure production operations and management](azure-infrastructure-operations.md)
- [Azure infrastructure monitoring](azure-infrastructure-monitoring.md)
- [Azure infrastructure integrity](azure-infrastructure-integrity.md)
- [Azure customer data protection](azure-protection-of-customer-data.md)

<!--Image references-->
[1]: ./media/azure-infrastructure-network/network-arch.png
