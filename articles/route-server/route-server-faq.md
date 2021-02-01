---
title: Frequently asked questions about Azure Route Server
description: Find answers to frequently asked questions about Azure Route Server.
services: route-server
author: duongau
ms.service: route-server
ms.topic: article
ms.date: 02/23/2021
ms.author: duau
---

# Azure Route Server FAQ

## What is Azure Route Server?

Azure Route Server is a fully managed service that allows you to easily manage routing between your network virtual appliance (NVA) and your virtual network.

### Is Azure Route Server just a VM?

No. Azure Route Server is a service designed with high availability. If it is deployed in an Azure region that supports [Availability Zones](../availability-zones/az-overview.md), it will have zone-level redundancy.

### What routing protocols does Azure Route Server support?

Azure Route Server supports Border Gateway Protocol (BGP) only. Your NVA needs to support multi-hop external BGP because you’ll need to deploy Azure Route Server in a dedicated subnet in your virtual network. The [ASN](https://en.wikipedia.org/wiki/Autonomous_system_(Internet)) you choose must be different from the one Azure Route Server uses when you configure the BGP on your NVA.

### Does Azure Route Server route data traffic between my NVA and my VMs?

No. Azure Route Server only exchanges BGP routes with your NVA. The data traffic goes directly from the NVA to the designated VM and directly from the VM to the NVA.

### If Azure Route Server receives the same route from more than one NVA, will it program all copies of the route (but each with a different next hop) to the VMs in the virtual network?

Yes, only if the route has the same AS path length. When the VMs send traffic to the destination of this route, the VM hosts will do Equal-Cost Multi-Path (ECMP) routing. However, if one NVA sends the route with a shorter AS path length than other NVAs, Azure Route Server will only program the route that has the next hop set to this NVA to the VMs in the virtual network.

### Does Azure Route Server support VNet Peering?

Yes. If you peer a VNet hosting the Azure Route Server to another VNet and you enable Use Remote Gateway on that VNet. Azure Route Server will learn the address spaces of that VNet and send them to all the peered NVAs.

### What are the limits of Azure Route Server?

Azure Route Server has the following limits (per deployment).

| Resource | Limit |
|----------|-------|
| Number of BGP peers supported | 8 |
| Number of routes each BGP peer can advertise to Azure Route Server | 200 |
| Number of routes that Azure Route Server can advertise to ExpressRoute or VPN gateway | 200 |

## Troubleshooting

### Why does my NVA not receive routes from Azure Route Server even though the BGP peering is up?

The ASN that Azure Route Server uses is 65515. Make sure you configure a different ASN for your NVA so that an “eBGP” session can be established between your NVA and Azure Route Server so route propagation can happen automatically.

### Why is the BGP peering between my NVA and the Azure Route Server going up and down (“flapping”)?

The cause of the flapping could be because of the BGP timer setting. By default, the Keep-alive timer on Azure Route Server is set to 60 seconds and the Hold-down timer is 180 seconds.

### Why can I ping from my NVA to the BGP peer IP on Azure Route Server but after I set up the BGP peering between them, I can’t ping the same IP anymore (and the BGP peering goes down shortly)?

In some NVA, you need to add a static route for the Azure Route Server subnet. For example, if Azure Route Server is in 10.0.255.0/27 and your NVA is in 10.0.1.0/24, you need to add the following route to the routing table in the NVA:

| Route | Next Hop |
|-------|----------|
| 10.0.255.0/27 | 10.0.1.1 |

10.0.1.1 is the default gateway IP in the subnet where your NVA (or more precisely, one of the NICs) is hosted.

### The BGP peering between my NVA and Azure Route Server is up. I can see routes exchanged correctly between them. Why aren’t the NVA routes in the effective routing table of my VM? 

* If your VM is in the same VNet as your NVA and Azure Route Server:

    Azure Route Server exposes two BGP peer IPs, which are hosted on two VMs that share the responsibility of sending the routes to all other VMs running in your virtual network. Each of your NVA must set up two identical BGP sessions (e.g., use the same AS number, the same AS path and advertise the same set of routes) to the two VMs so that your VMs in the virtual network can get consistent routing info from Azure Route Server. See the diagram below.

    :::image type="content" source="./media/faq/network-virtual-appliances.png" alt-text="Configuring Network Virtual Appliance with Route Server":::

    If you have two or more instances of the NVA, you *can* advertise different AS paths for the same route from different NVA instances if you want to designate one NVA instance as active and the other passive.

* If your VM is in a different VNet than the one that hosts your NVA and Azure Route Server:***

    In addition to the above verification, please check if VNet Peering is enabled between the two VNets *and* if Use Remote Route Server is enabled on your VM’s VNet.

See [Diagnose an Azure virtual machine routing problem](../virtual-network/diagnose-network-routing-problem.md) for more information.