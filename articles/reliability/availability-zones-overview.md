---
title: What are Azure availability zones?
description: Learn about availability zones and how they work to help you achieve reliability
ms.service: azure
ms.subservice: azure-availability-zones
ms.topic: conceptual
ms.date: 01/29/2025
ms.author: anaharris
author: anaharris-ms
ms.reviewer: asinghal
ms.custom: references_regions, subject-reliability
---

# What are availability zones?

Many Azure regions provide *availability zones*, which are separated groups of datacenters within a region. Availability zones are typically separated by several kilometers, and usually are within 100 kilometers. This distance means they're close enough to have low-latency connections to other availability zones through a high-performance network. However, they're far enough apart to reduce the likelihood that more than one will be affected by local outages or weather. Availability zones have independent power, cooling, and networking infrastructure. They're designed so that if one zone experiences an outage, then regional services, capacity, and high availability are supported by the remaining zones. They help your data stay synchronized and accessible when things go wrong.

Datacenter locations are selected by using rigorous vulnerability risk assessment criteria. This process identifies all significant datacenter-specific risks and considers shared risks between availability zones.

The following diagram shows several example Azure regions. Regions 1 and 2 support availability zones, and regions 3 and 4 don't have availability zones.

:::image type="content" source="media/regions-availability-zones.png" alt-text="Screenshot of physically separate availability zone locations within an Azure region.":::

To see which regions support availability zones, see [Azure regions with availability zone support](availability-zones-region-support.md).

## Zonal and zone-redundant services

When you deploy into an Azure region that contains availability zones, you can use multiple availability zones together. By using multiple availability zones, you can keep separate copies of your application and data within separate physical datacenters in a large metropolitan area.

There are two ways that Azure services use availability zones:

- **Zone-redundant** resources are spread across multiple availability zones. Microsoft manages spreading requests across zones and the replication of data across zones. If an outage occurs in a single availability zone, Microsoft manages failover automatically.

- **Zonal** resources are pinned to a specific availability zone. You can combine multiple zonal deployments across different zones to meet high reliability requirements. You're responsible for managing data replication and distributing requests across zones. If an outage occurs in a single availability zone, you're responsible for failover to another availability zone.

Azure services support one or both of these approaches. Platform as a service (PaaS) services typically support zone-redundant deployments. Infrastructure as a service (IaaS) services typically support zonal deployments. For more information about how Azure services work with availability zones, see [Azure regions with availability zone support](availability-zones-region-support.md).

Some services don't use availability zones until you configure them to do so. If you don't explicitly configure a service for availability zone support, it's called a *non-zonal* or *regional* deployment. Resources configured in this way might be placed in any availability zone in the region, and might be moved. If any availability zone in the region experiences an outage, non-zonal resources might be in the affected zone and could experience downtime.

For information on service-specific reliability support using availability zones as well as recommended disaster recovery guidance see [Reliability guidance overview](./reliability-guidance-overview.md).

## Physical and logical availability zones

Each datacenter is assigned to a physical zone. Physical zones are mapped to logical zones in your Azure subscription, and different subscriptions might have a different mapping order. Azure subscriptions are automatically assigned their mapping at the time the subscription is created. Because of this, the zone mapping for one subscription could be different for other subscriptions.

For example: A subscription named "finance" may have physical zone X mapped to logical zone 1, while another subscription named "engineering" has physical zone X mapped to logical zone 3, instead.

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

For each region, Microsoft aims to deploy updates to Azure services within a single availability zone at a time. This approach reduces the impact that updates might have on an active workload, because the workload can continue to run in other zones while the update is in process. You need to run your workload across multiple zones to take advantage of this benefit. For more information about how Azure deploys updates, see [Advancing safe deployment practices](https://azure.microsoft.com/blog/advancing-safe-deployment-practices/).

## Inter-zone latency

Within each region, availability zones are connected through a high-performance network. Microsoft strives for inter-zone communication to have a round-trip latency of less than approximately 2 milliseconds. Such a low latency allows for high-performance communication within a region, and for synchronous replication of data across multiple availability zones.

> [!NOTE]
> The target latency refers to the latency of the network links. Depending on the communication protocol you use and the network hops required for any specific network flow, the latency you observe might be different.

In most workloads, you can distribute components of your solution across availability zones without a noticeable effect on your performance. If you have a workload with a high degree of sensitivity to inter-zone latency, it's important to test the latency between your selected availability zones, using your actual protocols and configuration. You can use [zonal deployments](#zonal-and-zone-redundant-services) to reduce inter-zone traffic, but you should plan your reliability strategy to use multiple availability zones.

## Availability zone architectural guidance

To achieve more reliable workloads:

- Production workloads should be configured to use multiple availability zones if the region they are in supports availability zones.
- For mission-critical workloads, you should consider a solution that is *both* multi-region and multi-zone.

For more detailed information on how to use regions and availability zones in a solution architecture, see [Recommendations for using availability zones and regions](/azure/well-architected/resiliency/regions-availability-zones).

## Next steps

- [Azure services with availability zones](availability-zones-service-support.md)

- [Azure regions with availability zones](availability-zones-region-support.md)

- [Availability zone migration guidance](availability-zones-migration-overview.md)

- [Microsoft commitment to expand Azure availability zones to more regions](https://azure.microsoft.com/blog/our-commitment-to-expand-azure-availability-zones-to-more-regions/)

- [Recommendations for using availability zones and regions](/azure/well-architected/reliability/regions-availability-zones)
