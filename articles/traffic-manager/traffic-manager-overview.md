---
title: Azure Traffic Manager | Microsoft Docs
description: This article provides an overview of Azure Traffic Manager. Find out if it is the right choice for load balancing user traffic for your application.
services: traffic-manager
author: rohinkoul
manager: twooley
ms.service: traffic-manager
customer intent: As an IT admin, I want to learn about Traffic Manager and what I can use it for. 
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/23/2019
ms.author: rohink
---

# What is Traffic Manager?
Azure Traffic Manager is a DNS-based traffic load balancer that enables you to distribute traffic optimally to services across global Azure regions, while providing high availability and responsiveness.

Traffic Manager uses DNS to direct client requests to the most appropriate service endpoint based on a traffic-routing method and the health of the endpoints. An endpoint is any Internet-facing service hosted inside or outside of Azure. Traffic Manager provides a range of [traffic-routing methods](traffic-manager-routing-methods.md) and [endpoint monitoring options](traffic-manager-monitoring.md) to suit different application needs and automatic failover models. Traffic Manager is resilient to failure, including the failure of an entire Azure region.

>[!NOTE]
> Azure provides a suite of fully managed load-balancing solutions for your scenarios. If you are looking for Transport Layer Security (TLS) protocol termination ("SSL offload") or per-HTTP/HTTPS request, application-layer processing, review [Application Gateway](../application-gateway/application-gateway-introduction.md). If you are looking for regional load balancing, review [Load Balancer](../load-balancer/load-balancer-overview.md). Your end-to-end scenarios might benefit from combining these solutions as needed.
>
> For an Azure load-balancing options comparison, see [Overview of load-balancing options in Azure](https://docs.microsoft.com/azure/architecture/guide/technology-choices/load-balancing-overview).

Traffic Manager offers the following features:

## Increase application availability

Traffic Manager delivers high availability for your critical applications by monitoring your endpoints and providing automatic failover when an endpoint goes down.
    
## Improve application performance

Azure allows you to run cloud services or websites in datacenters located around the world. Traffic Manager improves application responsiveness by directing traffic to the endpoint with the lowest network latency for the client.

## Perform service maintenance without downtime

You can perform planned maintenance operations on your applications without downtime. Traffic Manager can direct traffic to alternative endpoints while the maintenance is in progress.

## Combine hybrid applications

Traffic Manager supports external, non-Azure endpoints enabling it to be used with hybrid cloud and on-premises deployments, including the "[burst-to-cloud](https://azure.microsoft.com/overview/what-is-cloud-bursting/)," "migrate-to-cloud," and "failover-to-cloud" scenarios.

## Distribute traffic for complex deployments

Using [nested Traffic Manager profiles](traffic-manager-nested-profiles.md), multiple traffic-routing methods can be combined to create sophisticated and flexible rules to scale to the needs of larger, more complex deployments.

## Pricing

For pricing information, see [Traffic Manager Pricing](https://azure.microsoft.com/pricing/details/traffic-manager/).


## Next steps

- Learn how to [create a Traffic Manager profile](traffic-manager-create-profile.md).
- Learn [how Traffic Manager Works](traffic-manager-how-it-works.md).
- View [frequently asked questions](traffic-manager-FAQs.md) about Traffic Manager.




