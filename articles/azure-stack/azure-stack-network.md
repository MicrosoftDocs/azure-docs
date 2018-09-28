---
title: Network integration considerations for Azure Stack integrated systems | Microsoft Docs
description: Learn what you can do to plan for datacenter network integration with multi-node Azure Stack.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/30/2018
ms.author: jeffgilb
ms.reviewer: wamota
---

# Network connectivity
This article provides Azure Stack network infrastructure information to help you decide how to best integrate Azure Stack into your existing networking environment. 

> [!NOTE]
> To resolve external DNS names from Azure Stack (for example, www.bing.com), you need to provide DNS servers to forward DNS requests. For more information about Azure Stack DNS requirements, see [Azure Stack datacenter integration - DNS](azure-stack-integrate-dns.md).

## Physical network design
The Azure Stack solution requires a resilient and highly available physical infrastructure to support its operation and services. Uplinks from ToR to Border switches are limited to SFP+ or SFP28 media and 1 GB, 10 GB, or 25 GB speeds. Check with your original equipment manufacturer (OEM) hardware vendor for availability. The following diagram presents our recommended design:

![Recommended Azure Stack network design](media/azure-stack-network/recommended-design.png)


## Logical Networks
Logical networks represent an abstraction of the underlying physical network infrastructure. They are used to organize and simplify network assignments for hosts, virtual machines, and services. As part of logical network creation, network sites are created to define the virtual local area networks (VLANs), IP subnets, and IP subnet/VLAN pairs that are associated with the logical network in each physical location.

The following table shows the logical networks and associated IPv4 subnet ranges that you must plan for:

| Logical Network | Description | Size | 
| -------- | ------------- | ------------ | 
| Public VIP | Azure Stack uses a total of 31 addresses from this network. Eight public IP addresses are used for a small set of Azure Stack services, and the rest are used by tenant virtual machines. If you plan to use App Service and the SQL resource providers, 7 more addresses are used. The remaining 15 IPs are reserved for future Azure services. | /26 (62 hosts) - /22 (1022 hosts)<br><br>Recommended = /24 (254 hosts) | 
| Switch infrastructure | Point-to-point IP addresses for routing purposes, dedicated switch management interfaces, and loopback addresses assigned to the switch. | /26 | 
| Infrastructure | Used for Azure Stack internal components to communicate. | /24 |
| Private | Used for the storage network and private VIPs. | /24 | 
| BMC | Used to communicate with the BMCs on the physical hosts. | /26 | 
| | | |

## Network infrastructure
The network infrastructure for Azure Stack consists of several logical networks that are configured on the switches. The following diagram shows these logical networks, and how they integrate with the top-of-rack (TOR), baseboard management controller (BMC), and border (customer network) switches.

![Logical network diagram and switch connections](media/azure-stack-network/NetworkDiagram.png)

### BMC network
This network is dedicated to connecting all the baseboard management controllers (also known as service processors, for example, iDRAC, iLO, iBMC, etc.) to the management network. If present, the Hardware Lifecycle Host (HLH) is located on this network and may provide OEM-specific software for hardware maintenance or monitoring. 

The HLH also hosts the Deployment VM (DVM). The DVM is used during Azure Stack deployment and is removed when deployment completes. The DVM requires internet access in connected deployment scenarios to test, validate, and access multiple components. These components can be inside and outside of your corporate network; for example, NTP, DNS, and Azure. For more information about connectivity requirements, see the [NAT section in Azure Stack firewall integration](azure-stack-firewall.md#network-address-translation). 

### Private network
This /24 (254 host IPs) network is private to the Azure Stack region (does not expand beyond the border switch devices of the Azure Stack region) and is divided into two subnets:

- **Storage network**. A /25 (126 host IPs) network used to support the use of Spaces Direct and Server Message Block (SMB) storage traffic and virtual machine live migration. 
- **Internal virtual IP network**. A /25 network dedicated to internal-only VIPs for the software load balancer.

### Azure Stack infrastructure network
This /24 network is dedicated to internal Azure Stack components so that they can communicate and exchange data among themselves. This subnet requires routable IP addresses, but is kept private to the solution by using Access Control Lists (ACLs). It isn’t expected to be routed beyond the border switches except for a small range equivalent in size to a /27 network utilized by some of these services when they require access to external resources and/or the internet. 

### Public infrastructure network
This /27 network is the small range from the Azure Stack infrastructure subnet mentioned earlier, it does not require public IP addresses, but it does require internet access through a NAT or Transparent Proxy. This network will be allocated for the Emergency Recovery Console System (ERCS), the ERCS VM requires internet access during registration to Azure and during infrastructure backups. The ERCS VM should be routable to your management network for troubleshooting purposes.

### Public VIP network
The Public VIP Network is assigned to the network controller in Azure Stack. It’s not a logical network on the switch. The SLB uses the pool of addresses and assigns /32 networks for tenant workloads. On the switch routing table, these /32 IPs are advertised as an available route via BGP. This network contains the external-accessible or public IP addresses. The Azure Stack infrastructure reserves the first 31 addresses from this Public VIP Network while the remainder is used by tenant VMs. The network size on this subnet can range from a minimum of /26 (64 hosts) to a maximum of /22 (1022 hosts), we recommend that you plan for a /24 network.

### Switch infrastructure network
This /26 network is the subnet that contains the routable point-to-point IP /30 (2 host IPs) subnets and the loopbacks, which are dedicated /32 subnets for in-band switch management and BGP router ID. This range of IP addresses must be routable externally of the Azure Stack solution to your datacenter, they may be private or public IPs.

### Switch management network
This /29 (6 host IPs) network is dedicated to connecting the management ports of the switches. It allows out-of-band access for deployment, management, and troubleshooting. It is calculated from the switch infrastructure network mentioned above.

## Publish Azure Stack services
You'll need to make Azure Stack services available to users from outside Azure Stack. Azure Stack sets up various endpoints for its infrastructure roles. These endpoints are assigned VIPs from the public IP address pool. A DNS entry is created for each endpoint in the external DNS zone, which was specified at deployment time. For example, the user portal is assigned the DNS host entry of portal.*&lt;region>.&lt;fqdn>*.

### Ports and URLs
To make Azure Stack services (such as the portals, Azure Resource Manager, DNS, etc.) available to external networks, you must allow inbound traffic to these endpoints for specific URLs, ports, and protocols.
 
In a deployment where a transparent proxy uplinks to a traditional proxy server, you must allow specific ports and URLs for both [inbound](https://docs.microsoft.com/azure/azure-stack/azure-stack-integrate-endpoints#ports-and-protocols-inbound) and [outbound](https://docs.microsoft.com/azure/azure-stack/azure-stack-integrate-endpoints#ports-and-urls-outbound) communication. These include ports and URLs for identity, the marketplace, patch and update, registration, and usage data.

## Next steps
[Border connectivity](azure-stack-border-connectivity.md)