---
title: About ExpressRoute Direct - Azure | Microsoft Docs
description: This page provides an overview of ExpressRoute Direct
services: expressroute
author: jaredr80

ms.service: expressroute
ms.topic: conceptual
ms.date: 07/10/2019
ms.author: jaredro
ms.custom: seodec18

---

# About ExpressRoute Direct

ExpressRoute Direct gives you the ability to connect directly into Microsoft’s global network at peering locations strategically distributed across the world. ExpressRoute Direct provides dual 100 Gbps or 10 Gbps connectivity, which supports Active/Active connectivity at scale.

Key features that ExpressRoute Direct provides include, but aren't limited to:

* Massive Data Ingestion into services like Storage and Cosmos DB
* Physical isolation for industries that are regulated and require dedicated and isolated connectivity like: Banking, Government, and Retail
* Granular control of circuit distribution based on business unit

## Onboard to ExpressRoute Direct

Before using ExpressRoute Direct, you must first enroll your subscription. To enroll, send an Email to <ExpressRouteDirect@microsoft.com> with your subscription ID, including the following details:

* Scenarios you're looking to accomplish with **ExpressRoute Direct**
* Location preferences - see [Partners and peering locations](expressroute-locations-providers.md) for a complete list of all locations
* Timeline for implementation
* Any other questions

## ExpressRoute using a service provider and ExpressRoute Direct

| **ExpressRoute using a service provider** | **ExpressRoute Direct** | 
| --- | --- |
| Utilizes service providers to enable fast onboarding and connectivity into existing infrastructure | Requires 100 Gbps/10 Gbps infrastructure and full management of all layers
| Integrates with hundreds of providers including Ethernet and MPLS | Direct/Dedicated capacity for regulated industries and massive data ingestion |
| Circuits SKUs from 50 Mbps to 10 Gbps | Customer may select a combination of the following circuit SKUs on 100 Gbps ExpressRoute Direct: <ul><li>5 Gbps</li><li>10 Gbps</li><li>40 Gbps</li><li>100 Gbps</li></ul> Customer may select a combination of the following circuit SKUs on 10 Gbps ExpressRoute Direct:<ul><li>1 Gbps</li><li>2 Gbps</li><li>5 Gbps</li><li>10 Gbps</li></ul>
| Optimized for single tenant | Optimized for single tenant/Cloud Service providers/multiple business units

## ExpressRoute Direct circuits

Microsoft Azure ExpressRoute lets you extend your on-premises networks into the Microsoft cloud over a private connection facilitated by a connectivity provider. With ExpressRoute, you can establish connections to Microsoft cloud services, such as Microsoft Azure, Office 365, and Dynamics 365.  

Each peering location has access to Microsoft’s global network and can access any region in a geopolitical zone by default and can access all global regions with a premium circuit.  

The functionality in most scenarios is equivalent to circuits that utilize an ExpressRoute service provider to operate. To support further granularity and new capabilities offered using ExpressRoute Direct, there are certain key capabilities that exist on ExpressRoute Direct Circuits.

## Circuit SKUs

ExpressRoute Direct supports massive data ingestion scenarios into Azure storage and other big data services. ExpressRoute circuits on 100 Gbps ExpressRoute Direct now also support **40 Gbps** and **100 Gbps** circuit SKUs. The physical port pairs are **100 or 10 Gbps** only and can have multiple virtual circuits. Circuit sizes:

| **100 Gbps ExpressRoute Direct** | **10 Gbps ExpressRoute Direct** | 
| --- | --- |
| **Subscribed Bandwidth**: 200 Gbps | **Subscribed Bandwidth**: 20 Gbps |
| <ul><li>5 Gbps</li><li>10 Gbps</li><li>40 Gbps</li><li>100 Gbps</li></ul> | <ul><li>1 Gbps</li><li>2 Gbps</li><li>5 Gbps</li><li>10 Gbps</li></ul>

## Technical Requirements

* Microsoft Enterprise Edge Router (MSEE) Interfaces:
    * Dual 10 or 100 Gigabit Ethernet ports only across router pair
    * Single Mode LR Fiber connectivity
    * IPv4 and IPv6
    * IP MTU 1500 bytes

* Switch/Router Layer 2/Layer 3 Connectivity:
    * Must support 1 802.1Q (Dot1Q) tag or two Tag 802.1Q (QinQ) tag encapsulation
    * Ethertype = 0x8100
    * Must add the outer VLAN tag (STAG) based on the VLAN ID specified by Microsoft - *applicable only on QinQ*
    * Must support multiple BGP sessions (VLANs) per port and device
    * IPv4 and IPv6 connectivity. *For IPv6 no additional sub-interface will be created. IPv6 address will be added to existing sub-interface*. 
    * Optional: [Bidirectional Forwarding Detection (BFD)](https://docs.microsoft.com/azure/expressroute/expressroute-bfd) support, which is configured by default on all Private Peerings on ExpressRoute circuits

## VLAN Tagging

ExpressRoute Direct supports both QinQ and Dot1Q VLAN tagging.

* **QinQ VLAN Tagging** allows for isolated routing domains on a per ExpressRoute circuit basis. Azure dynamically allocates an S-Tag at circuit creation and cannot be changed. Each peering on the circuit (Private and Microsoft) will utilize a unique C-Tag as the VLAN. The C-Tag is not required to be unique across circuits on the ExpressRoute Direct ports.

* **Dot1Q VLAN Tagging** allows for a single tagged VLAN on a per ExpressRoute Direct port pair basis. A C-Tag used on a peering must be unique across all circuits and peerings on the ExpressRoute Direct port pair.

## Workflow

[![workflow](./media/expressroute-erdirect-about/workflow1.png)](./media/expressroute-erdirect-about/workflow1.png#lightbox)

## SLA

ExpressRoute Direct provides the same enterprise-grade SLA with Active/Active redundant connections into the Microsoft Global Network. ExpressRoute infrastructure is redundant and connectivity into the Microsoft Global Network is redundant and diverse and scales accordingly with customer requirements. 

## Next steps

[Configure ExpressRoute Direct](expressroute-howto-erdirect.md)
