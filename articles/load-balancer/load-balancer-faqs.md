---
title: Frequently asked questions
description: Answers to frequently asked questions about the Azure Load Balancer. 
services: load-balancer
author: errobin
ms.service: load-balancer
ms.topic: article
ms.date: 04/22/2020
ms.author: errobin
---
# Frequently Asked Questions

## Are there data throughput limits for the Load Balancer?
 There are no hard limits on ingress and egress data throughput. For Standard SKU public load balancers the recommend ingress is 10 Gbps, with no egress limit. For Basic SKU public load balancers the recommended ingress is XXX Gbps, with no egress limit. With internal load balancers there are no throughput limits other than those of the backend resources.

 ## What are the differences between the Azure Load Balancer, Application Gateway, Azure Front Door and Traffic Manager?
 See [this](https://docs.microsoft.com/azure/architecture/guide/technology-choices/load-balancing-overview) article for an in-depth explanation on the differences and recommended uses for each.

 ## How can I upgrade from a Basic SKU to Standard SKU Load Balancer?
 See [this](upgrade-basic-standard.md) article for an automated script and guidance on upgrading from Basic SKU to Standard SKU.

## How is the load distributed across backend instances?
