---
title: What are Azure availability zones?
description: Learn about availability zones and how they work to help you achieve reliability
ms.service: reliability
ms.subservice: availability-zones
ms.topic: conceptual
ms.date: 09/20/2023
ms.author: anaharris
author: anaharris
ms.reviewer: asinghal
ms.custom: references_regions
---


# What are availability zones?

Many Azure regions provide *availability zones*, which are separated groups of datacenters within a region. Availability zones are close enough to have low-latency connections to other availability zones. They're connected by a high-performance network with a round-trip latency of less than 2ms. However, availability zones are far enough apart to reduce the likelihood that more than one will be affected by local outages or weather. Availability zones have independent power, cooling, and networking infrastructure. They're designed so that if one zone experiences an outage, then regional services, capacity, and high availability are supported by the remaining zones. They help your data stay synchronized and accessible when things go wrong.

Datacenter locations are selected by using rigorous vulnerability risk assessment criteria. This process identifies all significant datacenter-specific risks and considers shared risks between availability zones.

The following diagram shows several example Azure regions. Regions 1 and 2 support availability zones.

:::image type="content" source="media/regions-availability-zones.png" alt-text="Screenshot of physically separate availability zone locations within an Azure region.":::

To see which regions support availability zones, see [Azure regions with availability zone support](availability-zones-service-support.md#azure-regions-with-availability-zone-support).

## Zonal and zone-redundant services

When you deploy into an Azure region that contains availability zones, you can use multiple availability zones together. By using multiple availability zones, you can keep separate copies of your application and data within separate physical datacenters in a large metropolitan area.

There are two ways that Azure services use availability zones:

- **Zonal** resources are pinned to a specific availability zone. You can combine multiple zonal deployments across different zones to meet high reliability requirements. You're responsible for managing data replication and distributing requests across zones. If an outage occurs in a single availability zone, you're responsible for failover to another availability zone.

- **Zone-redundant** resources are spread across multiple availability zones. Microsoft manages spreading requests across zones and the replication of data across zones. If an outage occurs in a single availability zone, Microsoft manages failover automatically.

Azure services support one or both of these approaches. Platform as a service (PaaS) services typically support zone-redundant deployments. Infrastructure as a service (IaaS) services typically support zonal deployments. For more information about how Azure services work with availability zones, see [Azure regions with availability zone support](availability-zones-service-support.md#azure-regions-with-availability-zone-support). 

For information on service-specific reliability support using availability zones as well as recommended disaster recovery guidance see [Reliability guidance overview](./reliability-guidance-overview.md).


## Physical and logical availability zones

Each datacenter is assigned to a physical zone. Physical zones are mapped to logical zones in your Azure subscription, and different subscriptions might have a different mapping order. Azure subscriptions are automatically assigned their mapping at the time the subscription is created.

To understand the mapping between logical and physical zones for your subscription, use the [List Locations Azure Resource Manager API](/rest/api/resources/subscriptions/list-locations). You can use the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/what-is-azure-powershell) to retrieve the information from the API.

# [CLI](#tab/azure-cli)

```azurecli
az rest --method get --uri '/subscriptions/{subscriptionId}/locations?api-version=2022-12-01' --query 'value'
```
# [PowerShell](#tab/azure-powershell)

```azurepowershell
$subscriptionId = (Get-AzContext).Subscription.ID
$response = Invoke-AzRestMethod -Method GET -Path "/subscriptions/$subscriptionId/locations?api-version=2022-12-01"
$locations = ($response.Content | ConvertFrom-Json).value
```
---

## Availability zones and Azure updates

Microsoft aims to deploy updates to Azure services to a single availability zone at a time. This approach reduces the impact that updates might have on an active workload, because the workload can continue to run in other zones while the update is in process. You need to run your workload across multiple zones to take advantage of this benefit. For more information about how Azure deploys updates, see [Advancing safe deployment practices](https://azure.microsoft.com/blog/advancing-safe-deployment-practices/).


## Paired and unpaired regions

Many regions also have a [*paired region*](./cross-region-replication-azure.md#azure-paired-regions). Paired regions support certain types of multi-region deployment approaches. Some newer regions have [multiple availability zones and don't have a paired region](./cross-region-replication-azure.md#regions-with-availability-zones-and-no-region-pair). You can still deploy multi-region solutions into these regions, but the approaches you use might be different.

## Shared responsibility model

The [shared responsibility model](/azure/security/fundamentals/shared-responsibility) describes how responsibilities are divided between the cloud provider (Microsoft) and you. Depending on the type of services you use, you might take on more or less responsibility for operating the service.

Microsoft provides availability zones and regions to give you flexibility in how you design your solution to meet your requirements. When you use managed services, Microsoft takes on more of the management responsibilities for your resources, which might even include data replication, failover, failback, and other tasks related to operating a distributed system.

## Availability zone architectural guidance

To achieve more reliable workloads:

- Production workloads should be configured to use availability zones if the region they are in supports availability zones.
- For mission-critical workloads, you should consider a solution that is *both* multi-region and multi-zone.

For more detailed information on how to use regions and availability zones in a solution architecture, see [Recommendations for using availability zones and regions](/azure/well-architected/resiliency/regions-availability-zones).


## Next steps

- [Azure services and regions with availability zones](availability-zones-service-support.md)

- [Availability zone migration guidance](availability-zones-migration-overview.md)

- [Availability of service by category](availability-service-by-category.md)

- [Microsoft commitment to expand Azure availability zones to more regions](https://azure.microsoft.com/blog/our-commitment-to-expand-azure-availability-zones-to-more-regions/)

- [Build solutions for high availability using availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)
