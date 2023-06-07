---
title: Peering Service partner walkthrough
titleSuffix: Internet Peering
description: Get started with Peering Service partner.
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 02/23/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
---

# Peering Service partner walkthrough

This article explains the steps a provider needs to follow to enable a Direct peering for Peering Service.

## Technical Requirements
The technical requirements to establish direct interconnect for Peering Services are as following:
-	The Peer MUST provide own Autonomous System Number (ASN), which MUST be public.
-	The peer MUST have redundant Interconnect (PNI) at each interconnect location to ensure local redundancy.
-	The Peer MUST have geo redundancy in place to ensure failover in event of site failures in region/ metro.
-	The Peer MUST has the BGP sessions as Active- Active to ensure high availability and faster convergence and should not be provisioned as Primary and backup.
-	The Peer MUST maintain a 1:1 ratio for Peer peering routers to peering circuits and no rate limiting is applied.
-	The Peer MUST supply and advertise their own publicly routable IPv4 address space used by Peer’s communications service endpoints (e.g. SBC). 
-	The Peer MUST supply detail of what class of traffic and endpoints are housed in each advertised subnet.
-	All communications infrastructure prefixes are registered in Azure portal and advertised with community string 8075:8007.
-	The Peer MUST NOT terminate peering on a device running a stateful firewall. 
-	Microsoft will configure all the interconnect links as LAG (link bundles) by default, so, peer MUST support LACP (Link Aggregation Control Protocol) on the interconnect links.

## Create Direct peering connection for Peering Service

Service Providers can expand their geographical reach by creating a new Direct peering that support Peering Service as follows:

1. Become a Peering Service partner.
1. Follow the instructions to [Create or modify a Direct peering](howto-direct-portal.md). Ensure it meets high-availability requirement.
1. Follow the steps to [Enable Peering Service on a Direct peering using the portal](howto-peering-service-portal.md).

## Use legacy Direct peering connection for Peering Service

If you have a legacy Direct peering that you want to use to support Peering Service:

1. Become a Peering Service partner.
1. Follow the instructions to [Convert a legacy Direct peering to Azure resource](howto-legacy-direct-portal.md). If necessary, order more circuits to meet high-availability requirement.
1. Follow the steps to [Enable Peering Service on a Direct peering](howto-peering-service-portal.md).

## Register your prefixes for Optimized Routing

Follow the instructions to [optimize routing for your prefixes using Peering Service](./optimizePrefixes.md)

## Next steps

* Learn about Microsoft's [peering policy](policy.md).
* To learn how to set up Direct peering with Microsoft, see [Direct peering walkthrough](walkthrough-direct-all.md).
* To learn how to set up Exchange peering with Microsoft, see [Exchange peering walkthrough](walkthrough-exchange-all.md).