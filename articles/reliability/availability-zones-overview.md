---
title: What are Azure availability zones?
description: Learn about availability zones and how to use them to design resilient solutions.
ms.service: azure
ms.subservice: azure-availability-zones
ms.topic: conceptual
ms.date: 01/29/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: references_regions, subject-reliability, ai-video-concept
---

# What are availability zones?


>[!VIDEO https://learn-video.azurefd.net/vod/player?id=d36b5b2d-8bd2-43df-a796-b0c77b2f82fc]


Many [Azure regions](./regions-overview.md) provide *availability zones*, which are separated groups of datacenters within a region. Each availability zone has independent power, cooling, and networking infrastructure, so that if one zone experiences an outage, then regional services, capacity, and high availability are supported by the remaining zones. 

Availability zones are connected by a high-performance network with a round-trip latency of less than approximately 2 ms. They are close enough to have low-latency connections to other availability zones, but are far enough apart to reduce the possibility of more than one being affected by a localized outage, such as a power failure or a storm. 

Datacenter locations are selected by using rigorous vulnerability risk assessment criteria. This process identifies all significant datacenter-specific risks and considers shared risks between availability zones.

The following diagram shows several example Azure regions. Regions 1 and 2 support availability zones, and regions 3 and 4 don't have availability zones.

:::image type="content" source="media/regions-availability-zones.png" alt-text="Diagram of physically separate availability zone locations within an Azure region." border="false":::

To see which regions support availability zones, see [Azure regions with availability zone support](availability-zones-region-support.md).

<a name='zonal-and-zone-redundant-services'></a>
## Types of availability zone support

Azure services can provide two types of availability zone support: *zone-redundant* and *zonal*. Each service might support one or both types. When designing your reliability strategy, make sure that you understand how each service in your workload supports availability zones. 

- **Zone-redundant deployments**: Zone-redundant resources are replicated or distributed across multiple availability zones automatically. For example, zone-redundant data services replicate the data across multiple zones so that a failure in one zone doesn't affect the availability of the data. For some services you can select the set of zones that your resource uses, while in other services Microsoft selects the zones.

    With zone-redundant deployments, Microsoft manages spreading requests across zones and the replication of data across zones. If an outage occurs in an availability zone, Microsoft manages failover to another zone automatically.

- **Zonal deployments**: A zonal resource is deployed to a single, self-selected availability zone. This approach doesn't provide a resiliency benefit, but it helps you to achieve more stringent latency or performance requirements. For example, virtual machines, managed disks, and standard IP addresses can be deployed zonally to the same zone.

   To improve the resiliency of zonal resources, you need to design an architecture with separate resources in multiple availability zones within the region, but Microsoft doesn't manage the process for you. If an outage occurs in an availability zone, you're responsible for failover to another zone.

Some services don't use availability zones until you configure them to do so. If you don't explicitly configure a service for availability zone support, it's called a *nonzonal* or *regional* deployment. Resources configured in this way might be placed in any availability zone in the region, and might be moved. If any availability zone in the region experiences an outage, non-zonal resources might be in the affected zone and could experience downtime.

>[!IMPORTANT]
>Some services may have extra requirements to meet for availability zone support. For example, some may only support availability zones for certain tiers or SKUs, or in a subset of Azure regions.

## Configuring resources for availability zone support

Each service has its own method for configuring availability zone support. To learn about how each service supports availability zones and how to configure that support, see [Azure reliability guides by service](overview-reliability-guidance.md).

## Physical and logical availability zones

Each datacenter is assigned to a physical zone. Physical zones are mapped to logical zones in your Azure subscription, and different subscriptions might have a different mapping order. Azure subscriptions are automatically assigned their mapping at the time the subscription is created. Because of this, the zone mapping for one subscription could be different for other subscriptions.

For example, subscription A may have physical zone 1 mapped to logical zone 2, while subscription B has physical zone 1 mapped to logical zone 3:

:::image type="content" source="media/availability-zones-logical-physical.svg" alt-text="Diagram of logical to physical availability zone mapping." border="false":::

To understand the mapping between logical and physical zones for your subscription, use the [List Locations Azure Resource Manager API](/rest/api/resources/subscriptions/list-locations). You can use the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/what-is-azure-powershell) to retrieve the information from the API.

# [CLI](#tab/azure-cli)

```azurecli
az rest --method get \
    --uri '/subscriptions/{subscriptionId}/locations?api-version=2022-12-01' \
    --query 'value[?availabilityZoneMappings != `null`].{displayName: displayName, name: name, availabilityZoneMappings: availabilityZoneMappings}'
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$subscriptionId = (Get-AzContext).Subscription.ID
$response = Invoke-AzRestMethod -Method GET -Path "/subscriptions/$subscriptionId/locations?api-version=2022-12-01"
$locations = ($response.Content | ConvertFrom-Json).value
```

---

## Availability zones and Azure updates

For each region, Microsoft aims to deploy updates to Azure services within a single availability zone at a time. This approach reduces the impact that updates might have on an active workload, allowing the workload to continue to run in other zones while the update is in process. To take advantage of sequenced zone updates, your workload must be already configured to run across multiple zones. For more information about how Azure deploys updates, see [Advancing safe deployment practices](https://azure.microsoft.com/blog/advancing-safe-deployment-practices/).

## Availability zone architectural guidance

To achieve reliable workloads:

- Production workloads should be configured to use multiple availability zones if the region they are in supports availability zones.
- For mission-critical workloads, you should consider a solution that is *both* multi-region and multi-zone.

For more detailed information on how to use regions and availability zones in a solution architecture, see [Recommendations for using availability zones and regions](/azure/well-architected/resiliency/regions-availability-zones).

## Next steps

- [Azure services with availability zones](availability-zones-service-support.md)

- [Azure regions with availability zones](availability-zones-region-support.md)

- [Availability zone migration guidance](availability-zones-migration-overview.md)

- [Microsoft commitment to expand Azure availability zones to more regions](https://azure.microsoft.com/blog/our-commitment-to-expand-azure-availability-zones-to-more-regions/)

- [Recommendations for using availability zones and regions](/azure/well-architected/reliability/regions-availability-zones)
