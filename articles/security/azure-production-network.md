---
title: Azure production network
description: This article provides a general description of the Microsoft Azure production network.
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
ms.date: 06/27/2018
ms.author: terrylan

---

# Azure production network
The users of the Azure production network include external customers accessing their own Microsoft Azure Applications as well as internal Microsoft Azure support personnel that manage the production network. The security access methods and protection mechanisms for establishing connections to the Azure production network are discussed in this article.

## Internet Routing and Fault Tolerance
A globally redundant internal and external Microsoft Azure Domain Name Service (WADNS) infrastructure along with multiple primary and secondary Domain Name Service (DNS) server clusters provide for fault tolerance while additional Microsoft Azure network security controls such as NetScaler are used to prevent Distributed Denial of Service (DDoS) attacks and protect the integrity of Microsoft Azure DNS services.

The WADNS servers are located at multiple datacenter facilities. The WADNS implementation incorporates a hierarchy of secondary/primary DNS servers to publicly resolve Azure customer domain names. The domain names typically resolve to a CloudApp.net address, which wraps the Virtual IP (VIP) address for the customer’s service. Unique to Azure, the VIP corresponding to internal Dedicated IP (DIP) address of the tenant translation is done by the Microsoft load balancers responsible for that VIP.

Azure is hosted in geographically distributed Azure datacenters within the U.S. and is built on state-of-the-art routing platforms implementing robust and scalable architectural standards. Some of the notable features are:

- Multiprotocol Label Switching (MPLS) based traffic engineering providing efficient link utilization and graceful degradation of service if there is an outage
- Networks are implemented with “need plus one” (N+1) redundancy architectures or better.
- Externally, datacenters are served by dedicated, high-bandwidth network circuits that redundantly connect properties with over 1,200 Internet service providers globally at multiple peering points providing in excess of 2,000 gigabytes per second (Gbps) of edge capacity.

As Microsoft owns its own network circuits between datacenters, these attributes help the Azure offering achieve 99.9+% network availability without the need for traditional third-party Internet service providers.

## Connection to Production Network and Associated Firewalls
The Azure network Internet traffic flow policy directs traffic to the Azure Production network located in the nearest regional datacenter within the United States. Since the Azure Production datacenters maintain consistent network architecture and hardware, the below traffic flow description applies consistently to all datacenters.

Once Internet traffic for Azure is routed to the nearest datacenter, a connection is established to the access routers. These access routers serve to isolate traffic between Azure nodes and customer-instantiated VMs. Network infrastructure devices at the access and edge locations are the boundary points where ingress and/or egress filters are applied. These routers are configured through a tiered ACL to filter unwanted network traffic and apply traffic rate limits, if necessary. Traffic that is allowed by ACL is routed to the load balancers. Distribution routers are designed to allow only Microsoft-approved IP addresses, provide anti-spoofing, and established TCP connections using ACLs.

External Load Balancing devices are located behind the access routers to perform Network Address Translation (NAT) from Internet-routable IPs to Azure internal IPs. They also route packets to valid Production internal IPs and ports, and act as a protection mechanism to limit exposing internal Production Network address space.

By default, Microsoft enforces Hypertext Transfer Protocol Secure (HTTPS) for all traffic being transmitted to the customer’s web browsers, including sign in and all traffic thereafter. The use of TLS v1.2 enables a secure tunnel for traffic to flow through. ACLs on access and core routers ensure the source of the traffic is consistent with what is expected.

An important distinction in this architecture compared to traditional security architecture is that there are no dedicated hardware firewalls, specialized intrusion detection/prevention devices, or other security appliances normally expected before connections are made to the Azure Production environment. Customers typically expect these hardware firewall devices in the Azure network; however, there are none employed within Azure. Almost exclusively, those security features are built into the software running the Azure environment to provide robust multi-layered security mechanisms including firewall capabilities. Additionally, the scope of the boundary and associated sprawl of critical security devices is easier to manage and inventory as shown in the illustration above because it is managed by the software running Azure.

## Core security and firewall features
Azure implements robust software security and firewall features at various levels to enforce security features typically expected in a traditional environment to protect the core Security Authorization boundary.

### Azure Security Features
Azure implements host-based software firewalls inside the Production network. Several core security and firewall features reside within the core Azure environment. These security features reflect a defense-in-depth strategy within the Azure environment. Customer’s data in Microsoft Azure is protected by the following firewalls:

**Hypervisor Firewall (Packet Filter)**: This firewall is implemented in the Hypervisor and configured by the FC agent. This firewall protects the tenant running inside the VM from unauthorized access. By default, when a VM is created all traffic is blocked and then the FC agent adds rules/exceptions in the filter to allow authorized traffic.

There are two categories of rules that are programmed here:

- Machine Config or Infrastructure Rules: By default, all communication is blocked. There are exceptions to allow a VM to send and receive Dynamic Host Configuration Protocol (DHCP) communications, DNS information, send traffic to the “public” Internet, outbound to other VMs within the FC cluster and OS Activation server. Since the VMs’ allowed list of outgoing destinations does not include Microsoft Azure router subnets and other Microsoft properties, the rules act as a layer of defense for them.
- Role Configuration File: Defines the inbound ACLs based on the tenants’ service model. For example, if a tenant has a web front end on port 80 on a certain VM, then port 80 is opened to all IP addresses. If the VM has a worker role running, then the worker role is opened only to the VM within the same tenant.

**Native Host Firewall**: Microsoft Azure Fabric and Storage run on a Native OS, which has no Hypervisor and hence the Windows Firewall is configured with the above two sets of rules.

**Host Firewall**: The host firewall protects the Host partition, which runs the Hypervisor. The rules are programmed to allow only the FC and jump boxes to talk to the host partition on a specific port. The other exceptions are to allow DHCP response and DNS Replies. Azure uses a Machine Configuration file, which has the template of firewall rules for the host partition. There is also a host firewall exception that allows VMs to communicate to Host components, wire server & metadata server, through specific protocol/ports.

**Guest Firewall**: Windows Firewall piece of the Guest OS, which is configurable by the customer on customer VMs and storage.

Additional security features built-into the Azure capabilities:

- Infrastructure components are assigned IP addresses that are from Dedicated IPs (DIPs). An attacker on the Internet cannot address traffic to those addresses because they would not reach Microsoft. Internet Gateway routers filter packets addressed solely to internal addresses, so they would not enter the Production network. The only components that accept traffic directed to VIPs are load balancers.
- The firewalls implemented on all internal nodes have three primary security architecture considerations for any given scenario:

   - They are placed behind the Load Balancer (LB) and accept packets from anywhere. These are intended to be externally exposed and would correspond to the open ports in a traditional perimeter firewall.
   - Only accept packets from a limited set of addresses. This is part of the defense in-depth strategy against denial of service attacks. Such connections are cryptographically authenticated.
   - Firewalls can only be accessed from select internal nodes, in which case they accept packets only from an enumerated list of source IP addresses, all of which are DIPs within the Azure network. For example, an attack on the corporate network could direct requests to these addresses, but they would be blocked unless the source address of the packet was one in the enumerated list within the Azure network.
   - The access router at the perimeter blocks outbound packets addressed to an address that is inside the Azure network because of its configured static routes.

## Next steps
