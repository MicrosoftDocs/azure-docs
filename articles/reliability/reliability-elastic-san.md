---
title: Reliability in Azure Elastic SAN
description: Learn how to ensure storage reliability with Azure Elastic SAN by using zone-redundant storage, availability zones, and snapshot-based disaster recovery.
author: roygara
ms.author: rogarana
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-elastic-san-storage
ms.date: 1/15/2025
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

When deploying an Elastic SAN, if you select ZRS for your SAN's redundancy option, zonal failover is supported by the platform. If you use a Private Endpoint to connect to your Elastic SAN, this failover happens without manual intervention. A ZRS Elastic SAN using Private Endpoints and is designed to self-heal and rebalance itself to take advantage of healthy zones automatically. There may be availability and performance degradation for a few minutes after a failover, until the SAN rebalances itself.

If you connect using storage service endpoints, zonal failover is supported but might need manual intervention. A ZRS Elastic SAN using storage service endpoints won't switch to a healthy zone automatically. You might need to restart the iSCSI initiator to initiate a failover to a different, healthy zone.

If you deployed an LRS Elastic SAN, you may need to deploy a new SAN using snapshots exported to managed disks.

### Low-latency design

Deploying a ZRS Elastic SAN provides more reliability than an LRS Elastic SAN, but adds more write latency. Benchmark your Elastic SAN and simulate the workload of your application to compare the latency between LRS and ZRS, to see if it affects your workload.

### Availability zone migration

To migrate an Elastic SAN on LRS to ZRS, snapshot your Elastic SAN volumes, export them to managed disk snapshots, deploy an Elastic SAN on ZRS, and then create volumes on the SAN on ZRS using those disk snapshots. To learn how to use snapshots, see [Snapshot Azure Elastic SAN volumes](../storage/elastic-san/elastic-san-snapshots.md).

## Disaster recovery and business continuity

[!INCLUDE [reliability-disaster-recovery-description-include](includes/reliability-disaster-recovery-description-include.md)]

### Single and Multi-region disaster recovery

For Elastic SAN, you're responsible for the disaster recovery (DR) experience. You can [take snapshots](../storage/elastic-san/elastic-san-snapshots.md) of your volumes and [export them](../storage/elastic-san/elastic-san-snapshots.md#export-volume-snapshot) to managed disk snapshots. Then, you can [copy an incremental snapshot to a new region](/azure/virtual-machines/disks-copy-incremental-snapshot-across-regions) to store your data is in a region other than the region your Elastic SAN is in. You should export to regions that are geographically distant from your primary region to reduce the possibility of multiple regions being affected due to a disaster.

#### Outage detection, notification, and management

You can find outage declarations in [Service Health - Microsoft Azure](https://portal.azure.com/#view/Microsoft_Azure_Health/AzureHealthBrowseBlade/~/serviceIssues). 

### Capacity and proactive disaster recovery resiliency

Microsoft and its customers operate under the [Shared Responsibility Model](./concept-shared-responsibility.md). Shared responsibility means that for customer-enabled DR (customer-responsible services), you must address DR for any service you deploy and control. Pre-validate any service you deploy works with Elastic SAN. To ensure that recovery is proactive, pre-deploy secondaries to make sure there's no capacity issues if your environments are impacted.

## Next steps

- [Plan for deploying an Elastic SAN](../storage/elastic-san/elastic-san-planning.md)
- [Snapshot Azure Elastic SAN volumes](../storage/elastic-san/elastic-san-snapshots.md)
