---
title: Overview of IPv6 for Azure Virtual Network (Preview)
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
ms.date: 07/15/2019
ms.author: kumud
---

# What is IPv6 for Azure Virtual Network? (Preview)

IPv6 for Azure Virtual Network (VNet) enables you to host applications in Azure with IPv6 and IPv4 connectivity both within a virtual network and to and from the Internet. Due to the exhaustion of public IPv4 addresses, new networks for mobility and Internet of Things (IoT) are often built on IPv6. Even long established ISP and mobile networks are being transformed to IPv6. IPv4-only services can find themselves at a real disadvantage in both existing and emerging markets. Dual stack IPv4/IPv6 connectivity enables Azure-hosted services to traverse this technology gap with globally available, dual-stacked services that readily connect with both the existing IPv4 and these new IPv6 devices and networks.

Azure's original IPv6 connectivity makes it easy to provide dual stack (IPv4/IPv6) Internet connectivity for applications hosted in Azure. It allows for simple deployment of VMs with load balanced IPv6 connectivity for both inbound and outbound initiated connections. This feature is still available and more information is available [here](../load-balancer/load-balancer-ipv6-overview.md).
IPv6 for Azure virtual network is much more full featured- enabling full IPv6 solution architectures to be deployed in Azure.

> [!Important]
> IPv6 for Azure Virtual Network is currently in public preview. This preview is provided without a service level agreement and is not recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

The following diagram depicts a simple dual stack (IPv4/IPv6) deployment in Azure:

![IPv6 network deployment diagram](./media/ipv6-support-overview/ipv6-sample-diagram.png)

## Benefits

Azure Virtual Network IPv6 benefits:

- Helps expand the reach of your Azure-hosted applications into the growing mobile and Internet of Things markets.
- Dual stacked IPv4/IPv6 VMs provide maximum service deployment flexibility. A single service instance can connect with both IPv4 and IPv6-capable Internet clients.
- Builds on long-established, stable Azure VM-to-Internet IPv6 connectivity.
- Secure by default since IPv6 connectivity to the Internet is only established when you explicitly request it in your deployment.

## Capabilities

IPv6 for VNet includes the following capabilities:

- Azure customers can define their own IPv6 virtual network address space to meet the needs of their applications, customers, or seamlessly integrate into their on-premises IP space.
- Dual stack (IPv4 and IPv6) virtual networks with dual stack subnets enable applications to connect with both IPv4 and IPv6 resources in their virtual network or - the Internet.
    > [!IMPORTANT]
    > The subnets for IPv6 must be exactly /64 in size.  This ensures compatibility if you decide to enable routing of the subnet to an on-premises network since some routers can only accept /64 IPv6 routes.  
- Protect your resources with IPv6 rules for Network Security Groups.
- Customize the routing of IPv6 traffic in your virtual network with User-Defined Routes- especially when leveraging Network Virtual Appliances to augment your application.
- Let Internet clients seamlessly access your dual stack application using their protocol of choice with Azure DNS support for IPv6 (AAAA) records. 
- Standard IPv6 Public Load Balancer support to create resilient, scalable applications which includes:
    - Optional IPv6 health probe to determine which backend pool instances are health and thus can receive new flows. .  
    - Optional outbound rules which provide full declarative control over outbound connectivity to scale and tune this ability to your specific needs.
    - Optional multiple front-end configurations which enable a single load balancer to use multiple IPv6 public IP addresses- the same frontend protocol and port can be reused across frontend addresses.
- Instance-level public IP provides IPv6 Internet connectivity directly to individual VMs.
- Easily add IPv6 connectivity to existing IPv4-only deployments with upgrade-in-place.
- Create dual stack applications that automatically scale to your load with virtual machine scale sets.
- Portal support for the preview includes interactive create/edit/delete of dual stack (IPv4+IPv6) virtual networks and subnets, IPv6 network security group rules, IPv6 User defined routes, and IPv6 public IPs.  

## Limitations
The preview release of IPv6 for Azure virtual network has the following limitations:
- IPv6 for Azure virtual network (Preview) is available in all global Azure regions, but only in Global Azure- not the government clouds.
- Portal support for Standard Load Balancer components is view-only.  However full support and documentation (with samples) is available for Standard Load Balancer deployments using Azure Powershell and Command Line Interface (CLI).   
- Network Watcher support for the preview is limited to NSG flow logs and network packet captures.
- Virtual network peering (regionally or globally) is not supported in preview.
- When using Standard IPv6 External Load Balancer, the following limits apply: 
  - Outbound rules can reference multiple front-end public IPs but may **not** reference an IPv6 public prefix. IP public prefix supports only IPv4 prefixes.
  - IPv6 load-balancing rules may **not** use the *Floating IP* feature. Port reuse on backend instances is supported only with IPv4.
- Reserving a block of Internet-facing IPv6 addresses is not supported by the Azure Public IP Address Prefix feature.

## Pricing

IPv6 Azure resources and bandwidth are charged at the same rates as IPv4. There are no additional or different charges for IPv6. You can find details about pricing for [public IP addresses](https://azure.microsoft.com/pricing/details/ip-addresses/), [network bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/), or [Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/).

## Next steps

- Learn how to [deploy an IPv6 dual stack application using Azure PowerShell](virtual-network-ipv4-ipv6-dual-stack-powershell.md).
- Learn how to [deploy an IPv6 dual stack application using Azure CLI](virtual-network-ipv4-ipv6-dual-stack-cli.md).
