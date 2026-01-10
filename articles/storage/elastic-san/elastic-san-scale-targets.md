---
title: Azure Elastic SAN Scalability and Performance Targets
description: Learn about the capacity, IOPS, and throughput rates for Azure Elastic SAN. Learn which regions support higher capacities.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: concept-article
ms.date: 01/08/2026
ms.author: rogarana
ms.custom: references_regions
# Customer intent: "As a storage administrator, I want to understand the scalability and performance targets of Elastic SAN, so that I can optimize capacity, IOPS, and throughput for my deployment requirements in different regions."
---

# Scale targets for Elastic SAN

An Elastic SAN has three main components: the SAN itself, volume groups, and volumes.

## The Elastic SAN

An Elastic SAN has three attributes that determine its performance: total capacity, IOPS, and throughput.

### Capacity

Two different capacities determine the total capacity of your Elastic SAN: the base capacity and the additional capacity. Increasing the base capacity also increases the SAN's IOPS and throughput but costs more than increasing the additional capacity. Increasing the additional capacity doesn't increase IOPS or throughput.

The region your SAN is located in and your SAN's redundancy determines its maximum total capacity. The minimum total capacity for an Elastic SAN is 1 tebibyte (TiB). You can increase base or additional capacity in increments of 1 TiB.

### IOPS

The IOPS of an Elastic SAN increases by 5,000 per base TiB. So if you had an Elastic SAN that has 6 TiB of base capacity, that SAN could still provide up to 30,000 IOPS. That same SAN would still provide 30,000 IOPS whether it had 50 TiB of additional capacity or 500 TiB of additional capacity, since the SAN's performance is only determined by the base capacity. The IOPS of an Elastic SAN are distributed among all its volumes.

### Throughput

The throughput of an Elastic SAN increases by 200 MB/s per base TiB. So if you had an Elastic SAN that has 6 TiB of base capacity, that SAN could still provide up to 1,200 MB/s. That same SAN would provide 1,200 MB/s throughput whether it had 50 TiB of additional capacity or 500 TiB of additional capacity, since the SAN's performance is only determined by the base capacity. The throughput of an Elastic SAN is distributed among all its volumes.

### Elastic SAN scale targets

The appliance scale targets vary depending on region and redundancy of the SAN itself. The following table breaks out the scale targets based on whether the SAN's [redundancy](elastic-san-planning.md#redundancy) is set to locally redundant storage (LRS) or zone-redundant storage (ZRS), and what region the SAN is in.

#### LRS

Different regions have varying levels of base storage capacity available. We break them down into two sets, regions with a higher base storage capacity available, and regions with a lower base storage capacity available. Other than the base storage capacity differences, which directly affect the available performance that a SAN can distribute to its volumes and volume groups, there are no differences between these sets of regions.

##### Higher available base storage capacity

The following regions have higher base storage capacity available. The table following the regions outlines their scale targets: Australia East, Brazil South, Canada Central, Germany West, North Europe, West Europe, UK South, East US, East US 2, South Central US, US Central, West US 2, Australia Southeast, West Central US, West US, UK West.


|Resource  |Values  |
|---------|---------|
|Maximum number of Elastic SANs that can be deployed per subscription per region     | 5         |
|Maximum capacity-only units (TiB)     | 600         |
|Maximum base capacity units (TiB)     | 400         |
|Minimum total SAN capacity (TiB)     | 1         |
|Maximum total IOPS     |2,000,000         |
|Maximum total throughput (MB/s)     |80,000         |


##### Lower available base storage capacity


The following regions have lower base storage capacity available. The table following the regions outlines their scale targets: East Asia, Korea Central, South Africa North, France Central, Southeast Asia, West US 3, Sweden Central, Switzerland North, Canada East, Japan West, North Central US, Australia Central, Southeast Brazil, Korea South, UAE Central, Switzerland West, Germany North, France South, Norway West, Sweden South.


|Resource  |Values  |
|---------|---------|
|Maximum number of Elastic SANs that can be deployed per subscription per region     | 5         |
|Maximum capacity-only units (TiB)     | 100         |
|Maximum base capacity units (TiB)     | 100         |
|Minimum total SAN capacity (TiB)     | 1         |
|Maximum total IOPS     |500,000         |
|Maximum total throughput (MB/s)     |20,000         |

#### ZRS

ZRS is only available in France Central, North Europe, West Europe, and West US 2.

|Resource  |France Central  |North Europe | West Europe |West US 2    |
|---------|---------|---------|---------|
|Maximum number of Elastic SAN that can be deployed per subscription per region     |5         |5        |5        |5        |
|Maximum capacity-only units (TiB)     |200         |200        |200        |200        |
|Maximum base capacity units (TiB)    |100         |100        |100        |100        |
|Minimum total SAN capacity (TiB)    |1         |1        |1        |1        |
|Maximum total IOPS     |500,000         |500,000        |500,000        |500,000        |
|Maximum total throughput (MB/s)    |20,000         |20,000        |20,000        |20,000        |

#### Quota and capacity increases
To increase quota, create a support ticket with the subscription ID and region information to request an increase in quota for the “Maximum number of Elastic SAN that can be deployed per subscription per region.”

For capacity increase requests, create a support ticket with the subscription ID and the region information. The request will be evaluated.

## Volume group

An Elastic SAN can have up to 200 volume groups, and each volume group can hold as many as 1,000 volumes.

## Volume

The capacity of a volume determines its performance. The maximum IOPS of a volume increases by 750 per GiB, up to 80,000 IOPS. The maximum throughput goes up by 60 MB/s per GiB, up to 1,280 MB/s. A volume needs at least 106 GiB to reach the maximum 80,000 IOPS. A volume needs at least 21 GiB to reach the maximum 1,280 MB/s. The combined IOPS and throughput of all your volumes can't exceed the IOPS and throughput of your SAN.

### Volume scale targets

|Supported capacities  |Maximum potential IOPS  |Maximum potential throughput (MB/s)  |
|---------|---------|---------|
|1 GiB - 64 TiB     |750 - 80,000 (increases by 750 per GiB)         |60 - 1,280 (increases by 60 per GiB)         |

## Next steps

[Plan for deploying an Elastic SAN](elastic-san-planning.md)
