---
title: Elastic SAN Preview scalability and performance targets
description: Learn about the capacity, IOPS, and throughput rates for Azure Elastic SAN.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: conceptual
ms.date: 10/19/2023
ms.author: rogarana
ms.custom: references_regions, ignite-2022
---

# Scale targets for Elastic SAN Preview

There are three main components to an elastic storage area network (SAN): the SAN itself, volume groups, and volumes.

## The Elastic SAN

An Elastic SAN Preview has three attributes that determine its performance: total capacity, IOPS, and throughput.

### Capacity

The total capacity of your Elastic SAN is determined by two different capacities, the base capacity and the additional capacity. Increasing the base capacity also increases the SAN's IOPS and throughput but is more costly than increasing the additional capacity. Increasing additional capacity doesn't increase IOPS or throughput.

The maximum total capacity of your SAN is determined by the region where it's located and by its redundancy configuration. The minimum total capacity for an Elastic SAN is 1 tebibyte (TiB). Base or additional capacity can be increased in increments of 1 TiB.

### IOPS

The IOPS of an Elastic SAN increases by 5,000 per base TiB. So if you had an Elastic SAN that has 6 TiB of base capacity, that SAN could still provide up to 30,000 IOPS. That same SAN would still provide 30,000 IOPS whether it had 50 TiB of additional capacity or 500 TiB of additional capacity, since the SAN's performance is only determined by the base capacity. The IOPS of an Elastic SAN are distributed among all its volumes.

### Throughput

The throughput of an Elastic SAN increases by 200 MB/s per base TiB. So if you had an Elastic SAN that has 6 TiB of base capacity, that SAN could still provide up to 1200 MB/s. That same SAN would provide 1200 MB/s throughput whether it had 50 TiB of additional capacity or 500 TiB of additional capacity, since the SAN's performance is only determined by the base capacity. The throughput of an Elastic SAN is distributed among all its volumes.

### Elastic SAN scale targets

The appliance scale targets vary depending on region and redundancy of the SAN itself. The following table breaks out the scale targets based on whether the SAN's [redundancy](elastic-san-planning.md#redundancy) is set to locally redundant storage (LRS) or zone-redundant storage (ZRS), and what region the SAN is in.

#### LRS

|Resource  |France Central   |Southeast Asia |Australia East |North Europe | West Europe | UK South | East US | East US 2 | South Central US| West US 2   | West US 3 | Sweden Central |
|---------|---------|---------|---------|
|Maximum number of Elastic SAN that can be deployed per subscription per region     |5         |5         |5        |5        |5        |5        |5        |5        |5        | 5 | 5|5|
|Maximum total capacity (TiB)     |100         |100         |600        |600|600|600|        |600        |600        |600        | 100 | 100 |
|Maximum base capacity (TiB)    |100         |100         |400        |400 | 400|400       |400        |400        |400        |400        | 100 |100 |
|Minimum total capacity (TiB)    |1         |1         |1        |1        |1        |1        |1        |1        | 1 | 1 | 1 |1|
|Maximum total IOPS     |500,000         |500,000         |2,000,000        |2,000,000|2,000,000   |2,000,000        |2,000,000        |2,000,000        |2,000,000        |2,000,000        | 500,000 |500,000 |
|Maximum total throughput (MB/s)    |8,000         |8,000         |32,000        |32,000 |32,000|32,000        |32,000        |32,000        |32,000        |32,000        | 8,000|8,000|


#### ZRS

ZRS is only available in France Central, North Europe, West Europe and West US 2.

|Resource  |France Central  |North Europe | West Europe |West US 2    |
|---------|---------|---------|---------|
|Maximum number of Elastic SAN that can be deployed per subscription per region     |5         |5        |5        |5        |
|Maximum total capacity (TiB)     |200         |200        |200        |200        |
|Maximum base capacity (TiB)    |100         |100        |100        |100        |
|Minimum total capacity (TiB)    |1         |1        |1        |1        |
|Maximum total IOPS     |500,000         |500,000        |500,000        |500,000        |
|Maximum total throughput (MB/s)    |8,000         |8,000        |8,000        |8,000        |


## Volume group

An Elastic SAN can have a maximum of 200 volume groups, and a volume group can contain up to 1,000 volumes.

## Volume

The performance of an individual volume is determined by its capacity. The maximum IOPS of a volume increases by 750 per GiB, up to a maximum of 80,000 IOPS. The maximum throughput increases by 60 MB/s per GiB, up to a maximum of 1,280 MB/s. A volume needs at least 106 GiB to be capable of using the maximum 80,000 IOPS. A volume needs at least 21 GiB in order to be capable of using the maximum 1,280 MB/s. The combined IOPS and throughput of all your volumes can't exceed the IOPS and throughput of your SAN.

### Volume scale targets

|Supported capacities  |Maximum potential IOPS  |Maximum potential throughput (MB/s)  |
|---------|---------|---------|
|1 GiB - 64 TiB     |750 - 80,000 (increases by 750 per GiB)         |60 - 1,280 (increases by 60 per GiB)         |

## Next steps

[Plan for deploying an Elastic SAN Preview](elastic-san-planning.md)
