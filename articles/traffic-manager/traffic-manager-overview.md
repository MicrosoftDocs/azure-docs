---
title: Azure Traffic Manager
description: This article provides an overview of Azure Traffic Manager. Find out if it's the right choice for load-balancing user traffic for your application.
services: traffic-manager
author: greg-lindsay
ms.service: traffic-manager
ms.topic: overview
ms.workload: infrastructure-services
ms.date: 08/14/2023
ms.author: greglin
ms.custom: template-overview
#Customer intent: As an IT admin, I want to learn about Traffic Manager and what I can use it for. 
---

# What is Traffic Manager?

Azure Traffic Manager is a DNS-based traffic load balancer. This service allows you to distribute traffic to your public facing applications across the global Azure regions. Traffic Manager also provides your public endpoints with high availability and quick responsiveness.

Traffic Manager uses DNS to direct client requests to the appropriate service endpoint based on a traffic-routing method. Traffic manager also provides health monitoring for every endpoint. The endpoint can be any Internet-facing service hosted inside or outside of Azure. Traffic Manager provides a range of [traffic-routing methods](traffic-manager-routing-methods.md) and [endpoint monitoring options](traffic-manager-monitoring.md) to suit different application needs and automatic failover models. Traffic Manager is [resilient](../reliability/availability-zones-service-support.md#an-icon-that-signifies-this-service-is-non-regional-non-regional-services-always-available-services) to failure, including the failure of an entire Azure region.

>[!NOTE]
> Azure provides a suite of fully managed load-balancing solutions for your scenarios. 
> * If you want to load balance between your servers in a region at the application layer, review [Application Gateway](../application-gateway/overview.md).
> * If you need to optimize global routing of your web traffic and optimize top-tier end-user performance and reliability through quick global failover, see [Front Door](../frontdoor/front-door-overview.md).
> * To do network layer load balancing, review [Load Balancer](../load-balancer/load-balancer-overview.md). 
> 
> Your end-to-end scenarios may benefit from combining these solutions as needed.
> For an Azure load-balancing options comparison, see [Overview of load-balancing options in Azure](/azure/architecture/guide/technology-choices/load-balancing-overview).

For more information about Traffic Manager, see:
- [How Traffic Manager works](traffic-manager-how-it-works.md)
- [Traffic Manager FAQs](traffic-manager-FAQs.md)
- [Traffic Manager profiles](traffic-manager-manage-profiles.md)
- [Traffic Manager endpoints](traffic-manager-endpoint-types.md)

**Traffic Manager offers the following features**:

## Increase application availability

Traffic Manager delivers high availability for your critical applications by monitoring your endpoints and providing automatic failover when an endpoint goes down.
    
## Improve application performance

Azure allows you to run cloud services and websites in datacenters located around the world. Traffic Manager can improve the responsiveness of your website by directing traffic to the endpoint with the lowest latency.

## Service maintenance without downtime

You can have planned maintenance done on your applications without downtime. Traffic Manager can direct traffic to alternative endpoints while the maintenance is in progress.

## Combine hybrid applications

Traffic Manager supports external, non-Azure endpoints enabling it to be used with hybrid cloud and on-premises deployments, including the "[burst-to-cloud](https://azure.microsoft.com/overview/what-is-cloud-bursting/)," "migrate-to-cloud," and "failover-to-cloud" scenarios.

## Distribute traffic for complex deployments

When you use [nested Traffic Manager profiles](traffic-manager-nested-profiles.md), multiple traffic-routing methods can be combined to create sophisticated and flexible rules to scale to the needs of larger, more complex deployments.

## Pricing

For pricing information, see [Traffic Manager Pricing](https://azure.microsoft.com/pricing/details/traffic-manager/).


## Next steps

- Learn how to [create a Traffic Manager profile](./quickstart-create-traffic-manager-profile.md).
- Learn [how Traffic Manager Works](traffic-manager-how-it-works.md).
- View [frequently asked questions](traffic-manager-FAQs.md) about Traffic Manager.