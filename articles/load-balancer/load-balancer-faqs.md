---
title: Frequently asked questions - Azure Load Balancer
description: Answers to frequently asked questions about the Azure Load Balancer. 
services: load-balancer
author: erichrt
ms.service: load-balancer
ms.topic: article
ms.date: 04/22/2020
ms.author: errobin
---
# Frequently asked questions

## What types of Load Balancer exist?
Internal load balancers which balance traffic within a VNET and external load balancers which balance traffic to and from an internet connected endpoint. For more information, see [Load Balancer Types] (https://docs.microsoft.com/azure/load-balancer/concepts-limitations#load-balancer-types). 

For both these types, Azure offers a Basic SKU and Standard SKU that have different functional, performance, security and health tracking capabilities. These differences are explained in our [SKU Comparison] (https://docs.microsoft.com/azure/load-balancer/concepts-limitations#skus) article.

 ## How can I upgrade from a Basic to a Standard Load Balancer?
See the [upgrade from Basic to Standard](upgrade-basic-standard.md) article for an automated script and guidance on upgrading a Load Balancer SKU.

 ## What are the different load-balancing options in Azure?
See the [load balancer technology guide](https://docs.microsoft.com/azure/architecture/guide/technology-choices/load-balancing-overview)  for the available load-balancing services and recommended uses for each.

## Where can I find Load Balancer ARM templates?
See the [list of Azure Load Balancer quickstart templates](https://docs.microsoft.com/azure/templates/microsoft.network/loadbalancers#quickstart-templates) for ARM templates of common deployments.

## How are inbound NAT rules different from load-balancing rules?
NAT rules are used to specify a backend resource to route traffic to. For example, configuring a specific load balancer port to send RDP traffic to a specific VM. Load-balancing rules are used to specify a pool of backend resources to route traffic to, balancing the load across each instance. For example, a load balancer rule can route TCP packets on port 80 of the load balancer across a pool of web servers.

## Next Steps
If your question is not listed above, please send feedback about this page with your question. This will create a GitHub issue for the product team to ensure all of our valued customer questions are answered.
