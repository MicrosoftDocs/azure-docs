---
title: Azure Traffic Manager overview
description: "Azure Traffic Manager is a DNS-based traffic load balancer that distributes traffic across global Azure regions with high availability and automatic failover."
services: traffic-manager
author: asudbring
ms.service: azure-traffic-manager
ms.topic: overview
ms.date: 06/01/2026
ms.author: allensu
ms.custom: template-overview
#Customer intent: As an IT admin, I want to learn about Traffic Manager and what I can use it for.
# Customer intent: As an IT admin, I want to understand Azure Traffic Manager's features and capabilities, so that I can determine if it is the right solution for load-balancing traffic across my application's endpoints.
---

# What is Azure Traffic Manager?

Azure Traffic Manager is a DNS-based traffic load balancer that distributes traffic to your public-facing applications across global Azure regions. Traffic Manager provides your public endpoints with high availability and quick responsiveness.

Traffic Manager uses DNS to direct client requests to the appropriate service endpoint based on a traffic-routing method. Traffic Manager also provides health monitoring for every endpoint. The endpoint can be any Internet-facing service hosted inside or outside of Azure. Traffic Manager provides a range of [traffic-routing methods](traffic-manager-routing-methods.md) and [endpoint monitoring options](traffic-manager-monitoring.md) to suit different application needs and automatic failover models. Traffic Manager is resilient to failure, including the failure of an entire Azure region.

>[!NOTE]
> Azure provides a suite of fully managed load-balancing solutions for your scenarios. 
> * If you want to load balance between your servers in a region at the application layer, review [Application Gateway](../application-gateway/overview.md).
> * If you need to optimize global routing of your web traffic and optimize top-tier end-user performance and reliability through quick global failover, see [Front Door](../frontdoor/front-door-overview.md).
> * To do network layer load balancing, review [Load Balancer](../load-balancer/load-balancer-overview.md). 
> 
> Your end-to-end scenarios might benefit from combining these solutions as needed.
> For an Azure load-balancing options comparison, see [Overview of load-balancing options in Azure](/azure/architecture/guide/technology-choices/load-balancing-overview).

For more information about Traffic Manager, see:
- [How Traffic Manager works](traffic-manager-how-it-works.md)
- [Traffic Manager FAQs](traffic-manager-FAQs.md)
- [Traffic Manager profiles](traffic-manager-manage-profiles.md)
- [Traffic Manager endpoints](traffic-manager-endpoint-types.md)

## Key features

### Increase application availability

Traffic Manager monitors your endpoints and provides automatic failover when an endpoint goes down, delivering high availability for your critical applications.
    
### Improve application performance

Traffic Manager improves your application's responsiveness by directing traffic to the endpoint with the lowest latency for each user.

### Service maintenance without downtime

Perform planned maintenance on your applications without downtime. Traffic Manager directs traffic to alternative endpoints while maintenance is in progress.

### Combine hybrid applications

Traffic Manager supports external, non-Azure endpoints, enabling hybrid cloud and on-premises deployments including burst-to-cloud, migrate-to-cloud, and failover-to-cloud scenarios.

### Distribute traffic for complex deployments

Combine multiple traffic-routing methods with [nested Traffic Manager profiles](traffic-manager-nested-profiles.md) to create sophisticated and flexible rules that scale to larger, more complex deployments.

### Link DNS records directly to Traffic Manager

> [!IMPORTANT]
> Traffic Manager Linked Records is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[Traffic Manager Linked Records](../dns/dns-traffic-manager-linked-records.md) is an Azure DNS feature that connects a DNS record set directly to a Traffic Manager profile. Clients receive endpoint IP addresses directly from DNS—without an intermediate CNAME lookup to `trafficmanager.net`. This means `trafficmanager.net` is never exposed in DNS responses, which simplifies firewall configurations and preserves the DNSSEC chain of trust for signed zones. Endpoint type consistency is enforced through [Strictly Typed Profiles](traffic-manager-strictly-typed-profiles.md).

## Pricing

For pricing information, see [Traffic Manager Pricing](https://azure.microsoft.com/pricing/details/traffic-manager/).


## Next steps

- Learn how to [create a Traffic Manager profile](./quickstart-create-traffic-manager-profile.md).
- Learn [how Traffic Manager Works](traffic-manager-how-it-works.md).
- Learn about [Traffic Manager Linked Records](../dns/dns-traffic-manager-linked-records.md) for direct DNS-to-Traffic Manager integration.
- View [frequently asked questions](traffic-manager-FAQs.md) about Traffic Manager.
