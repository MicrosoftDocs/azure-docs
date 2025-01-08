---
title: Reliability in Azure Elastic SAN
description: Find out about reliability in Azure Elastic SAN.
author: roygara
ms.author: rogarana
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-elastic-san-storage
ms.date: 12/10/2024
---

# Reliability in Elastic SAN

This article describes reliability support in Azure Elastic SAN and covers both regional resiliency with availability zones and disaster recovery and business continuity.

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure Elastic SAN supports availability zone deployment with [locally redundant storage](../storage/elastic-san/elastic-san-planning.md#locally-redundant-storage) (LRS) and regional deployment with [zone-redundant storage](../storage/elastic-san/elastic-san-planning.md#zone-redundant-storage) (ZRS).

### Prerequisites

LRS and ZRS Elastic SAN are currently only available in a subset of regions. For a list of regions, see [Scale targets for Elastic SAN](../storage/elastic-san/elastic-san-scale-targets.md).


#### Create a resource using availability zones

To create an Elastic SAN with an availability zone enabled, see [Deploy an Elastic SAN](../storage/elastic-san/elastic-san-create.md).


### Zone down experience

If you connect using [storage service endpoints](../storage/elastic-san/elastic-san-networking-concepts.md#storage-service-endpoints), zonal failover is supported but may need manual intervention. A ZRS Elastic SAN using storage service endpoints won't switch to a healthy zone automatically. You might need to restart the iSCSI initiator to initiate a failover to a different, healthy zone.

If you deployed an LRS elastic SAN, you may need to deploy a new SAN, using snapshots exported to managed disks.

### Low-latency design

Deploying a ZRS Elastic SAN provides more reliability than an LRS Elastic SAN, but adds more write latency. Benchmark your Elastic SAN and simulate the workload of your application to compare the latency between LRS and ZRS, to see if it effects your workload.

### Availability zone migration

To migrate an elastic SAN on LRs to ZRS, you must snapshot your elastic SAN's volumes, export them to managed disk snapshots, deploy an elastic SAN on ZRS, and then create volumes on the SAN on ZRS using those disk snapshots. To learn how to use snapshots (preview), see [Snapshot Azure Elastic SAN volumes (preview)](../storage/elastic-san/elastic-san-snapshots.md).

## Disaster recovery and business continuity

[!INCLUDE [reliability-disaster-recovery-description-include](includes/reliability-disaster-recovery-description-include.md)]

### Single and Multi-region disaster recovery

For Azure Elastic SAN, you're responsible for the DR experience. You can [take snapshots](../storage/elastic-san/elastic-san-snapshots.md) of your volumes and [export them](../storage/elastic-san/elastic-san-snapshots.md#export-volume-snapshot) to managed disk snapshots. Then, you can [copy an incremental snapshot to a new region](/azure/virtual-machines/disks-copy-incremental-snapshot-across-regions) to store your data is in a region other than the region your elastic SAN is in. You should export to regions that are geographically distant from your primary region to reduce the possibility of multiple regions being affected due to a disaster.

#### Outage detection, notification, and management

You can find outage declarations in [Service Health - Microsoft Azure](https://portal.azure.com/#view/Microsoft_Azure_Health/AzureHealthBrowseBlade/~/serviceIssues). 

### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the [Shared Responsibility Model](./availability-zones-overview.md#shared-responsibility-model). Shared responsibility means that for customer-enabled DR (customer-responsible services), you must address DR for any service you deploy and control. You should prevalidate any service you deploy will work with Elastic SAN. To ensure that recovery is proactive, you should always predeploy secondaries because there's no guarantee of capacity at time of impact for those who haven't preallocated.

## Next steps

- [Plan for deploying an Elastic SAN](../storage/elastic-san/elastic-san-planning.md)
- [Snapshot Azure Elastic SAN volumes (preview)](../storage/elastic-san/elastic-san-snapshots.md)
