---
title: Reliability in Azure Communications Gateway
description: Find out about reliability in Azure Communications Gateway
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.custom:
  - subject-reliability
  - references_regions
ms.date: 01/12/2023
---

# What is reliability in Azure Communications Gateway?

Azure Communication Gateway ensures your service is reliable by using Azure redundancy mechanisms and SIP-specific retry behavior. Your network must also meet specific requirements to ensure service availability.

## Azure Communications Gateway's redundancy model

Each Azure Communications Gateway deployment consists of three separate regions: a Management Region and two Service Regions. This article describes the two different region types and their distinct redundancy models. It covers both regional reliability with availability zones and cross-region reliability with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

:::image type="complex" source="media/communications-gateway/communications-gateway-management-and-service-regions.png" alt-text="Diagram of two service regions, a management region and two operator sites.":::
    Diagram showing two operator sites and the Azure regions for Azure Communications Gateway. Azure Communications Gateway has two service regions and one management region. The service regions connect to the management region and to the operator sites. The management region can be co-located with a service region.
:::image-end:::

## Service regions

Service regions contain the voice and API infrastructure used for handling traffic between Microsoft Teams Phone System and your network. Each instance of Azure Communications Gateway consists of two service regions that are deployed in an active-active mode. This geo-redundancy is mandated by the Operator Connect and Microsoft Teams Phone System Mobile programs. Fast failover between the service regions is provided at the infrastructure/IP level and at the application (SIP/RTP/HTTP) level.

> [!TIP]
> You must always have two service regions, even if one of the service regions chosen is in a single-region Azure Geography (for example, Qatar). If you choose a single-region Azure Geography, choose a second Azure region in a different Azure Geography.

These service regions are identical in operation and provide resiliency to both Zone and Regional failures. Each service region can carry 100% of the traffic using the Azure Communications Gateway instance. As such, end-users should still be able to make and receive calls successfully during any Zone or Regional downtime.

### Call routing requirements

Azure Communications Gateway offers a 'successful redial' redundancy model: calls handled by failing peers are terminated, but new calls are routed to healthy peers. This model mirrors the redundancy model provided by Microsoft Teams itself.

The cross-connectivity between regions within Azure Communications Gateway and your network is crucial for this redundancy model. Each Azure Communications Gateway service region provides an SRV record containing all SIP peers within the region. Your network should:

- Address peers within Azure Communications Gateway using the behavior specified in RFC 2782.
- Use SIP OPTIONS (or a combination of OPTIONs and SIP traffic) to monitor the health of your Azure Communication Gateway peers.
- Send new calls to healthy peers.
- Reroute INVITEs for failed call attempts to a healthy peer, so that the calls are retried.

It's expected that your network consists of two geographically redundant sites. Each site should be paired with an Azure Communications Gateway region. Ensure that:

- Each site in your network must first try to send traffic to its local Azure Communications Gateway service region.
- Your sites use the following retry behavior if a call fails to connect:
  - If the first service region's Azure Communications Gateway sends a SIP 503 (indicating congestion), hunt to the second service region immediately.
  - Otherwise, try all the other results returned by the SRV record for the first site. Hunt to the second service region only if all those results have failed,

The details of this hunting behavior but will be specific to your network. You must agree them with your onboarding team during your integration project.

:::image type="complex" source="media/communications-gateway/communications-gateway-service-region-redundancy.png" alt-text="Diagram of two operator sites and two service regions. Both service regions connect to both sites, with primary and secondary routes.":::
    Diagram of two operator sites (operator site A and operator site B) and two service regions (service region A and service region B). Operator site A has a primary route to service region A and a secondary route to service region B. Operator site B has a primary route to service region B and a secondary route to service region A.
:::image-end:::

Your infrastructure must:

> [!div class="checklist"]
> - Use OPTIONS polling towards Azure Communications Gateway.
> - Only send new calls to healthy peers.
> - Re-route INVITE requests to an alternative Azure Communications Gateway endpoint on failure.
> - Be capable of re-routing INVITE requests to the second service region if all peers in the local region return an error or fail to respond.

## Management regions

Management regions contain the infrastructure used for the ordering, monitoring and billing of Azure Communications Gateway. All infrastructure within these regions is deployed in a zonally redundant manner, meaning that all data is automatically replicated across each Availability Zone within the region. All critical configuration data is also replicated to each of the Service Regions to ensure the proper functioning of the service during an Azure region failure.

## Availability zone support

Azure availability zones have a minimum of three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. If a local zone fails, regional services, capacity, and high availability are supported by the other zones in the region. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Regions and availability zones](/azure/availability-zones/az-overview.md).

### Zone down experience for service regions

During a zone-wide outage, calls handled by the affected zone are terminated, with a brief loss of capacity within the region until the service's self-healing rebalances underlying resources to healthy zones. This self-healing isn't dependent on zone restoration; it's expected that the Microsoft-managed service self-healing state will compensate for a lost zone, using capacity from other zones. Traffic carrying resources are deployed in a zone-redundant manner but at the lowest scale traffic might be handled by a single resource. In this case, the failover mechanisms described in this article rebalance all traffic to the other service region while the resources that carry traffic are redeployed in a healthy zone.

### Zone down experience for the management region

 During a zone-wide outage, no action is required during zone recovery. The management region self-heals and rebalances itself to take advantage of the healthy zone automatically.

## Disaster recovery: fallback to other regions

This section describes the behavior of Azure Communications Gateway during a region-wide outage.

### Disaster recovery: cross-region failover for service regions

During a region-wide outage, the failover mechanisms described in this article (OPTIONS polling and SIP retry on failure) will rebalance all traffic to the other service region, maintaining availability. Microsoft will start restoring regional redundancy. Restoring regional redundancy during extended downtime might require using other Azure regions. If we need to migrate a failed region to another region, we'll consult you before starting any migrations.

### Disaster recovery: cross-region failover for management regions

Voice traffic and the API Bridge are unaffected by failures in the management region, because the corresponding Azure resources are hosted in service regions. Users of the API Bridge Number Management Portal might need to sign in again.

Monitoring services might be temporarily unavailable until service has been restored. If the management region experiences extended downtime, Microsoft will migrate the impacted resources to another available region.

## Choosing management and service regions

A single deployment of Azure Communications Gateway is designed to handle the Operator Connect and Teams Phone Mobile traffic within a geographic area. Both service regions should be deployed within the same geographic area (for example North America) to ensure that latency on voice calls remain within the limits required by the Operator Connect and Teams Phone Mobile programs. Consider the following points when you choose your service region locations:

- Select from the list of available Azure regions. You can see the Azure regions that can be selected as service regions on the [Products by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/) page.
- Choose regions near to your own premises and the peering locations between your network and Microsoft to reduce call latency.
- Prefer [regional pairs](/azure/reliability/cross-region-replication-azure#azure-cross-region-replication-pairings-for-all-geographies) to minimize the recovery time if a multi-region outage occurs.

Choose a management region from the following list:

- East US
- West Central US
- West Europe
- UK South
- India Central
- Southeast Asia
- Australia East

Management regions can be co-located with service regions. We recommend choosing the management region nearest to your service regions.

## Service-level agreements

The reliability design described in this document is implemented by Microsoft and isn't configurable. For more information on the Azure Communications Gateway service-level agreements (SLAs), see the Azure Communications Gateway SLA.

## Next steps

> [!div class="nextstepaction"]
> [Prepare to deploy an Azure Communications Gateway resource](../communications-gateway/prepare-to-deploy.md)
