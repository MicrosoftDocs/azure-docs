---
title: Overview of IPv6 for Azure Virtual Network
titlesuffix: Azure Virtual Network
description: IPv6 description of IPv6 endpoints and data paths in an Azure virtual network.
services: virtual-network
documentationcenter: na
author: KumudD
manager: twooley
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.workload: infrastructure-services
ms.date: 03/31/2020
ms.author: kumud
---

# What is IPv6 for Azure Virtual Network?

IPv6 for Azure Virtual Network (VNet) enables you to host applications in Azure with IPv6 and IPv4 connectivity both within a virtual network and to and from the Internet. Due to the exhaustion of public IPv4 addresses, new networks for mobility and Internet of Things (IoT) are often built on IPv6. Even long established ISP and mobile networks are being transformed to IPv6. IPv4-only services can find themselves at a real disadvantage in both existing and emerging markets. Dual stack IPv4/IPv6 connectivity enables Azure-hosted services to traverse this technology gap with globally available, dual-stacked services that readily connect with both the existing IPv4 and these new IPv6 devices and networks.

Azure's original IPv6 connectivity makes it easy to provide dual stack (IPv4/IPv6) Internet connectivity for applications hosted in Azure. It allows for simple deployment of VMs with load balanced IPv6 connectivity for both inbound and outbound initiated connections. This feature is still available and more information is available [here](../load-balancer/load-balancer-ipv6-overview.md).
IPv6 for Azure virtual network is much more full featured- enabling full IPv6 solution architectures to be deployed in Azure.


The following diagram depicts a simple dual stack (IPv4/IPv6) deployment in Azure:

![IPv6 network deployment diagram](./media/ipv6-support-overview/ipv6-sample-diagram.png)

## Benefits

IPv6 for Azure VNET benefits:

- Helps expand the reach of your Azure-hosted applications into the growing mobile and Internet of Things markets.
- Dual stacked IPv4/IPv6 VMs provide maximum service deployment flexibility. A single service instance can connect with both IPv4 and IPv6-capable Internet clients.
- Builds on long-established, stable Azure VM-to-Internet IPv6 connectivity.
- Secure by default since IPv6 connectivity to the Internet is only established when you explicitly request it in your deployment.

## Capabilities

IPv6 for Azure VNet includes the following capabilities:

- Azure customers can define their own IPv6 virtual network address space to meet the needs of their applications, customers, or seamlessly integrate into their on-premises IP space.
- Dual stack (IPv4 and IPv6) virtual networks with dual stack subnets enable applications to connect with both IPv4 and IPv6 resources in their virtual network or - the Internet.
    > [!IMPORTANT]
    > The subnets for IPv6 must be exactly /64 in size.  This ensures future compatibility should you decide to enable routing of the subnet to an on-premises network since some routers can only accept /64 IPv6 routes.  
- Protect your resources with IPv6 rules for Network Security Groups.
    - And the Azure platform's Distributed Denial of Service (DDoS) protections are extended to Internet-facing Public IP's
- Customize the routing of IPv6 traffic in your virtual network with User-Defined Routes- especially when leveraging Network Virtual Appliances to augment your application.
- Linux and Windows Virtual Machines can all use IPv6 for Azure VNET
- [Standard IPv6 public Load Balancer](virtual-network-ipv4-ipv6-dual-stack-standard-load-balancer-powershell.md) support to create resilient, scalable applications, which include:
    - Optional IPv6 health probe to determine which backend pool instances are health and thus can receive new flows.
    - Optional outbound rules which provide full declarative control over outbound connectivity to scale and tune this ability to your specific needs.
    - Optional multiple front-end configurations which enable a single load balancer to use multiple IPv6 public IP addresses- the same frontend protocol and port can be reused across frontend addresses.
    - Optional IPv6 ports can be reused on backend instances using the *Floating IP* feature of load-balancing rules 
    - Note: Load balancing does not perform any protocol translation (no NAT64). 
    - Note: IPv6 can be load balanced only to the primary network interface (NIC) on Azure VMs. 
- [Standard IPv6 internal Load Balancer](ipv6-dual-stack-standard-internal-load-balancer-powershell.md) support to create resilient multi-tier applications within Azure VNETs.   
- Basic IPv6 public Load Balancer support for compatibility with legacy deployments
- [Reserved IPv6 Public IP addresses and address ranges](ipv6-public-ip-address-prefix.md) provide stable, predictable IPv6 addresses which ease whitelisting of your azure-hosted applications for your company and your customers.
- Instance-level Public IP provides IPv6 Internet connectivity directly to individual VMs.
- [Add IPv6 to Existing IPv4-only deployments](ipv6-add-to-existing-vnet-powershell.md)- this feature enables you to easily add IPv6 connectivity to existing IPv4-only deployments without the need to recreate deployments.  The IPv4 network traffic is unaffected during this process so depending on your application and OS you may be able to add IPv6 even to live services.    
- Let Internet clients seamlessly access your dual stack application using their protocol of choice with Azure DNS support for IPv6 (AAAA) records. 
- Create dual stack applications that automatically scale to your load with virtual machine scale sets with IPv6.
- [Virtual Network (VNET) Peering](virtual-network-peering-overview.md) - both within-regional and global peering - enables you to seemlessly connect dual stack VNETs- both the IPv4 and IPv6 endpoints on VMs in the peered networks will be able to communicate with each other. You can even peer dual stack with IPv4-only VNETs as you are transitioning your deployments to dual stack. 
- IPv6 Troubleshooting and Diagnostics are available with load balancer metrics/alerting and Network Watcher features such as packet capture, NSG flow logs, connection troubleshooting and connection monitoring.   

## Scope
IPv6 for Azure VNET is a foundational feature set which enables customers to host dual stack (IPv4+IPv6) applications in Azure.  We intend to add IPv6 support to more Azure networking features over time and eventually to offer dual stack versions of Azure PaaS services but in the meantime all Azure PaaS services can be accessed via the IPv4 endpoints on dual stack Virtual Machines.   

## Limitations
The current IPv6 for Azure virtual network release has the following limitations:
- IPv6 for Azure virtual network is available in all global Azure Commercial and US Government regions using all deployment methods.  
- ExpressRoute gateways CAN be used for IPv4-only traffic in a VNET with IPv6 enabled.  Support for IPv6 traffic is on our roadmap.   
- VPN gateways CANNOT be used in a VNET with IPv6 enabled, either directly or peered with "UseRemoteGateway".
- The Azure platform (AKS, etc.) does not support IPv6 communication for Containers.  
- IPv6 can be load balanced only to the primary network interface (NIC) on Azure VMs. Load balancing IPv6 traffic to secondary NICs is not supported.    
- IPv6-only Virtual Machines or Virtual Machines Scale Sets are not supported, each NIC must include at least one IPv4 IP configuration. 
- When adding IPv6 to existing IPv4 deployments, IPv6 ranges can not be added to a VNET with existing resource navigation links.  
- Forward DNS for IPv6 is supported for Azure public DNS today but Reverse DNS is not yet supported.   

## Pricing

IPv6 Azure resources and bandwidth are charged at the same rates as IPv4. There are no additional or different charges for IPv6. You can find details about pricing for [public IP addresses](https://azure.microsoft.com/pricing/details/ip-addresses/), [network bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/), or [Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/).

## Next steps

- Learn how to [deploy an IPv6 dual stack application using Azure PowerShell](virtual-network-ipv4-ipv6-dual-stack-standard-load-balancer-powershell.md).
- Learn how to [deploy an IPv6 dual stack application using Azure CLI](virtual-network-ipv4-ipv6-dual-stack-standard-load-balancer-cli.md).
- Learn how to [deploy an IPv6 dual stack application using Resource Manager Templates (JSON)](ipv6-configure-standard-load-balancer-template-json.md)
