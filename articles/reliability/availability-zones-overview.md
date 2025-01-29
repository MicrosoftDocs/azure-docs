---
title: What are Azure availability zones?
description: Learn about availability zones and how to use them to design resilient solutions.
ms.service: azure
ms.subservice: azure-availability-zones
ms.topic: conceptual
ms.date: 01/29/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: references_regions, subject-reliability
---

# What are availability zones?


>[!VIDEO https://learn-video.azurefd.net/vod/player?id=d36b5b2d-8bd2-43df-a796-b0c77b2f82fc]


Many [Azure regions](./regions-overview.md) provide *availability zones*, which are separated groups of datacenters within a region. Each availability zone has independent power, cooling, and networking infrastructure, so that if one zone experiences an outage, then regional services, capacity, and high availability are supported by the remaining zones. 

Availability zones are connected by a high-performance network with a round-trip latency of less than approximately 2 ms. They are close enough to have low-latency connections to other availability zones, but are far enough apart to reduce the possibility of more than one being affected by a local outage, such as a storm. 

Datacenter locations are selected by using rigorous vulnerability risk assessment criteria. This process identifies all significant datacenter-specific risks and considers shared risks between availability zones.

The following diagram shows several example Azure regions. Regions 1 and 2 support availability zones, and regions 3 and 4 don't have availability zones.

:::image type="content" source="media/regions-availability-zones.png" alt-text="Screenshot of physically separate availability zone locations within an Azure region.":::

To see which regions support availability zones, see [Azure regions with availability zone support](availability-zones-region-support.md).

## Zonal and zone-redundant services

Many Azure services support availability zones,
When planning for reliable workloads, you can choose at least one of the following availability zone configurations: 

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
