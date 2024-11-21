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

When deploying an Elastic SAN, if you select ZRS for your SAN's redundancy option, zonal failover is supported by the platform. If you use a Private Endpoint to connect to your Elastic SAN, this failover will happen without manual intervention. A ZRS Elastic SAN using Private Endpoints and is designed to self-heal and rebalance itself to take advantage of healthy zones automatically (you may see availability and performance degradation for a few minutes while the SAN rebalances itself).

If you connect using storage service endpoints, zonal failover is supported but may require manual intervention. A ZRS Elastic SAN using storage service endpoints will not switch to a healthy zone automatically. You may need to restart the iSCSI initiator to initiate a failover to a different, healthy zone.

If you deployed an LRS Elastic SAN, you may need to deploy a new SAN using snapshots exported to managed disks.

### Low-latency design

Elastic SANs using ZRS are identical to Elastic SANs using LRS (they have the same scale targets), but ZRS does add more write latency. Benchmark your Elastic SANs to simulate the workload of your application and compare the latency between LRS and ZRS to see if it will affect your workload.

### Availability zone migration

To migrate an Elastic SAN on LRS to ZRS, you must snapshot your Elastic SAN's volumes, export them to managed disk snapshots, deploy an Elastic SAN on ZRS, and then create volumes on the SAN on ZRS using those disk snapshots. To learn how to use snapshots (preview), see [Snapshot Azure Elastic SAN volumes (preview)](../storage/elastic-san/elastic-san-snapshots.md).

## Disaster recovery and business continuity

[!INCLUDE [reliability-disaster-recovery-description-include](includes/reliability-disaster-recovery-description-include.md)]

### Single and Multi-region disaster recovery

For Elastic SAN, you're responsible for the disaster recovery (DR) experience. You can [take snapshots](../storage/elastic-san/elastic-san-snapshots.md) of your volumes and [export them](../storage/elastic-san/elastic-san-snapshots.md#export-volume-snapshot) to managed disk snapshots. Then, you can [copy an incremental snapshot to a new region](/azure/virtual-machines/disks-copy-incremental-snapshot-across-regions) to store your data is in a region other than the region your Elastic SAN is in. You should export to regions that are geographically distant from your primary region to reduce the possibility of multiple regions being affected due to a disaster.

#### Outage detection, notification, and management

You can find outage declarations in [Service Health - Microsoft Azure](https://portal.azure.com/#view/Microsoft_Azure_Health/AzureHealthBrowseBlade/~/serviceIssues). 

### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the [Shared Responsibility Model](./availability-zones-overview.md#shared-responsibility-model). Shared responsibility means that for customer-enabled DR (customer-responsible services), you must address DR for any service you deploy and control. You should pre-validate any service you deploy will work with Elastic SAN. To ensure that recovery is proactive, you should always pre-deploy secondaries because there's no guarantee of capacity at time of impact for those who haven't pre-allocated.

## Next steps

- [Plan for deploying an Elastic SAN](../storage/elastic-san/elastic-san-planning.md)
- [Snapshot Azure Elastic SAN volumes (preview)](../storage/elastic-san/elastic-san-snapshots.md)