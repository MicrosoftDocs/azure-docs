---
title: Frequently asked questions about Azure Route Server
description: Find answers to frequently asked questions about Azure Route Server.
services: route-server
author: duongau
ms.service: route-server
ms.topic: article
ms.date: 04/16/2021
ms.author: duau
---

# Azure Route Server (Preview) FAQ

> [!IMPORTANT]
> Azure Route Server (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What is Azure Route Server?

Azure Route Server is a fully managed service that allows you to easily manage routing between your network virtual appliance (NVA) and your virtual network.

### Is Azure Route Server just a VM?

No. Azure Route Server is a service designed with high availability. If it's deployed in an Azure region that supports [Availability Zones](../availability-zones/az-overview.md), it will have zone-level redundancy.

### How many route servers can I create in a virtual network?

You can create only one route server in a VNet. It must be deployed in a designated subnet called *RouteServerSubnet*.

### Does Azure Route Server support VNet Peering?

Yes. If you peer a VNet hosting the Azure Route Server to another VNet and you enable Use Remote Gateway on the latter VNet, Azure Route Server will learn the address spaces of that VNet and send them to all the peered NVAs. It will also program the routes from the NVAs into the routing table of the VMs in the peered VNet. 


### <a name = "protocol"></a>What routing protocols does Azure Route Server support?

Azure Route Server supports Border Gateway Protocol (BGP) only. Your NVA needs to support multi-hop external BGP because you’ll need to deploy Azure Route Server in a dedicated subnet in your virtual network. The [ASN](https://en.wikipedia.org/wiki/Autonomous_system_(Internet)) you choose must be different from the one Azure Route Server uses when you configure the BGP on your NVA.

### Does Azure Route Server route data traffic between my NVA and my VMs?

No. Azure Route Server only exchanges BGP routes with your NVA. The data traffic goes directly from the NVA to the destination VM and directly from the VM to the NVA.

### Does Azure Route Server store customer data?
No. Azure Route Server only exchanges BGP routes with your NVA and then propagates them to your virtual network.

### If Azure Route Server receives the same route from more than one NVA, how does it handle them?

If the route has the same AS path length, Azure Route Server will program multiple copies of the route, each with a different next hop, to the VMs in the virtual network. When the VMs send traffic to the destination of this route, the VM hosts will do Equal-Cost Multi-Path (ECMP) routing. However, if one NVA sends the route with a shorter AS path length than other NVAs, Azure Route Server will only program the route that has the next hop set to this NVA to the VMs in the virtual network.

### Does Azure Route Server preserve the BGP communities of the route it receives?

Yes, Azure Route Server propagates the route with the BGP communities as is.

### What Autonomous System Numbers (ASNs) can I use?

You can use your own public ASNs or private ASNs in your network virtual appliance. You can't use the ranges reserved by Azure or IANA.
The following ASNs are reserved by Azure or IANA:

* ASNs reserved by Azure:
    * Public ASNs: 8074, 8075, 12076
    * Private ASNs: 65515, 65517, 65518, 65519, 65520
* ASNs [reserved by IANA](http://www.iana.org/assignments/iana-as-numbers-special-registry/iana-as-numbers-special-registry.xhtml):
    * 23456, 64496-64511, 65535-65551

### Can I use 32-bit (4 byte) ASNs?

No, Azure Route Server supports only 16-bit (2 bytes) ASNs.

## <a name = "limitations"></a>Route Server Limits

Azure Route Server has the following limits (per deployment).

| Resource | Limit |
|----------|-------|
| Number of BGP peers supported | 8 |
| Number of routes each BGP peer can advertise to Azure Route Server | 200 |
| Number of routes that Azure Route Server can advertise to ExpressRoute or VPN gateway | 200 |

If your NVA advertises more routes than the limit, the BGP session will be dropped. If this happens to the gateway and Azure Route Server, you'll lose connectivity from your on-premises network to Azure. For more information, see [Diagnose an Azure virtual machine routing problem](../virtual-network/diagnose-network-routing-problem.md).

## Next steps

Learn how to [configure Azure Route Server](quickstart-configure-route-server-powershell.md).
