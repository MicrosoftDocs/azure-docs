---
title: 'Connecting Azure to public clouds | Microsoft Docs'
description: Describe various ways to connect Azure to other public clouds 
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: article
ms.date: 06/30/2023
ms.author: duau
---

# Connecting Azure with public clouds

Many enterprises are pursuing a multicloud strategy because of business and technical goals. These include cost, flexibility, feature availability, redundancy, data sovereignty etc. This strategy helps them use the best of both clouds. 

This approach also poses challenges for the enterprise in terms of network and application architecture. Some of these challenges are latency and data throughput. To address these challenges you are looking to connect to multiple clouds directly. Some service providers provide a solution to connect multiple cloud providers for their customers. In other cases, customer can deploy their own router to connect multiple public clouds.
## Connectivity via ExpressRoute
ExpressRoute lets you extend their on-premises networks into the Microsoft cloud over a private connection facilitated by a connectivity provider. With ExpressRoute, you can establish connections to Microsoft cloud services.

There are three ways to connect via ExpressRoute.

1. Layer3 provider
1. Layer2 provider
1. Direct connection

### Layer 3 Provider

Layer 3 providers are commonly known as IP VPN or MPLS VPN providers. You use these providers for multipoint connectivity between their data centers, branches and the cloud. you connect to the L3 provider via BGP or via static default route. Service provider advertises routes between the customer sites, datacenters and public cloud. 
 
When you're connecting through Layer 3 provider, Microsoft will advertise customer VNET routes to the service provider over BGP. The provider can have two different implementations.

![Diagram that shows a Layer3 provider.](media/expressroute-connect-azure-to-public-cloud/azure-to-public-clouds-l3.png)

Provider may be landing each cloud provider in a separate VRF, if traffic from all the cloud providers reach at customer router. If customer is running BGP with service provider, then these routes are readvertised to other cloud providers by default. 

If service provider is landing all the cloud providers in the same VRF, then routes are advertised to other cloud providers from the service provider directly. This set up is assuming standard BGP operation where eBGP routes are advertised to other eBGP neighbors by default.

Each public cloud has different prefix limit so while distributing the routes service provider should take caution in distributing the routes.

### Layer 2 Provider and Direct connection

Although physical connectivity in both models is different, but at layer3 BGP is established directly between MSEE and the customer router. For ExpressRoute Direct, you connect to the MSEE directly. While in Layer 2, service provider extends VLAN from your on-premises to the cloud you run BGP on top of layer2 network to connect their DCs to the cloud.

![Diagram that shows a Layer2 provider and Direct connection.](media/expressroute-connect-azure-to-public-cloud/azure-to-public-clouds-l2.png)

In both cases, customer has point-to-point connections to each of the public clouds. Customer establishes separate BGP connection to each public cloud. Routes received by one cloud provider get advertised to other cloud provider by default. Each cloud provider has different prefix limit so while advertising the routes customer should take care of these limits. Customer can use usual BGP knobs with Microsoft while advertising routes from other public clouds.

## Direct connection with ExpressRoute

You can choose to connect ExpressRoute directly to the cloud provider's direct connectivity offering. Two cloud providers are connected back to back and BGP gets established directly between their routers. This type of connection is available with Oracle today.

## Site-to-site VPN

You can use the Internet to connect their instances in Azure with other public clouds. Almost all the cloud providers offer site-to-site VPN capabilities. However, there could be incompatibilities because of lack of certain variants. For example, some cloud providers only support IKEv1 so there's a VPN termination endpoint required in that cloud. For those cloud providers supporting IKEv2, a direct tunnel can be established between VPN gateways at both cloud providers.

Site-to-site VPN isn't considered a high throughput and low latency solution. However, it can be used as a backup to physical connectivity.

## Next steps
See [ExpressRoute FAQ][ER-FAQ] for any further questions on ExpressRoute and virtual network connectivity.

See [Set up direct connection between Azure and Oracle Cloud][ER-OCI] for connectivity between Azure and Oracle

<!--Link References-->
[ER-FAQ]: ./expressroute-faqs.md
[ER-OCI]: ../virtual-machines/workloads/oracle/configure-azure-oci-networking.md