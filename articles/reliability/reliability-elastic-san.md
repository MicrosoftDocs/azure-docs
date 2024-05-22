---
title: Reliability in Azure Elastic SAN
description: Find out about reliability in Azure Elastic SAN.
author: roygara
ms.author: rogarana
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-elastic-san-storage
ms.date: 02/13/2024
---

# Reliability in Elastic SAN

This article describes reliability support in Azure Elastic SAN and covers both regional resiliency with availability zones and disaster recovery and business continuity.

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure Elastic SAN supports availability zone deployment with locally redundant storage (LRS) and regional deployment with zone-redundant storage (ZRS).

### Prerequisites

LRS and ZRS Elastic SAN are currently only available in a subset of regions. For a list of regions, see [Scale targets for Elastic SAN](../storage/elastic-san/elastic-san-scale-targets.md).


#### Create a resource using availability zones

To create an Elastic SAN with an availability zone enabled, see [Deploy an Elastic SAN](../storage/elastic-san/elastic-san-create.md).


### Zone down experience

When deploying an Elastic SAN, if you select ZRS for your SAN's redundancy option, zonal failover is supported by the platform without manual intervention. An elastic SAN using ZRS is designed to self-heal and rebalance itself to take advantage of healthy zones automatically.

If you deployed an LRS elastic SAN, you may need to deploy a new SAN, using snapshots exported to managed disks.

### Low-latency design

The latency differences between an elastic SAN on LRS and an elastic SAN on ZRS isn't particularly high. However, for workloads sensitive to latency spikes, consider an elastic SAN on LRS since it offers the lowest latency.

### Availability zone migration

To migrate an elastic SAN on LRs to ZRS, you must snapshot your elastic SAN's volumes, export them to managed disk snapshots, deploy an elastic SAN on ZRS, and then create volumes on the SAN on ZRS using those disk snapshots. To learn how to use snapshots (preview), see [Snapshot Azure Elastic SAN volumes (preview)](../storage/elastic-san/elastic-san-snapshots.md).

## Disaster recovery and business continuity

[!INCLUDE [reliability-disaster-recovery-description-include](includes/reliability-disaster-recovery-description-include.md)]

### Single and Multi-region disaster recovery

For Azure Elastic SAN, you're responsible for the DR experience. You can [take snapshots](../storage/elastic-san/elastic-san-snapshots.md) of your volumes and [export them](../storage/elastic-san/elastic-san-snapshots.md#export-volume-snapshot) to managed disk snapshots. Then, you can [copy an incremental snapshot to a new region](../virtual-machines/disks-copy-incremental-snapshot-across-regions.md) to store your data is in a region other than the region your elastic SAN is in. You should export to regions that are geographically distant from your primary region to reduce the possibility of multiple regions being affected due to a disaster.

#### Outage detection, notification, and management

You can find outage declarations in [Service Health - Microsoft Azure](https://portal.azure.com/#view/Microsoft_Azure_Health/AzureHealthBrowseBlade/~/serviceIssues). 

### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the [Shared Responsibility Model](./availability-zones-overview.md#shared-responsibility-model). Shared responsibility means that for customer-enabled DR (customer-responsible services), you must address DR for any service you deploy and control. You should prevalidate any service you deploy will work with Elastic SAN. To ensure that recovery is proactive, you should always predeploy secondaries because there's no guarantee of capacity at time of impact for those who haven't preallocated.

## Next steps

- [Plan for deploying an Elastic SAN](../storage/elastic-san/elastic-san-planning.md)
- [Snapshot Azure Elastic SAN volumes (preview)](../storage/elastic-san/elastic-san-snapshots.md)