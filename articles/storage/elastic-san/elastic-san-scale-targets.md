---
title: Elastic SAN (preview) scalability and performance targets
description: Learn about the capacity, IOPS, and throughput rates for Azure Elastic SAN.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 10/12/2022
ms.author: rogarana
ms.subservice: elastic-san
---

# Elastic SAN (preview) scale targets

There are three main components to an elastic storage area network (SAN): the SAN itself, volume groups, and volumes.

## The Elastic SAN

An elastic SAN (preview) has three attributes that determine its performance: total capacity, IOPS, and throughput.

### Capacity

The total capacity of your elastic SAN is determined by two different capacities, the base capacity and the additional capacity. Increasing the base capacity also increases the SAN's IOPS and throughput but is more costly than increasing the additional capacity. Increasing additional capacity doesn't increase IOPS or throughput.

The maximum total capacity of your SAN is determined by the region where it's located and by its redundancy configuration. The minimum total capacity for an elastic SAN is 64 tebibyte (TiB). Base or additional capacity can be increased in increments of 1 TiB.

### IOPS

The IOPS of an elastic SAN increases by 5,000 per base TiB. So if you had an elastic SAN that has 6 TiB of base capacity, that SAN could still provide up to 30,000 IOPS. That same SAN would still provide 30,000 IOPS whether it had 50 TiB of additional capacity or 500 TiB of additional capacity, since the SAN's performance is only determined by the base capacity. The IOPS of an elastic SAN are distributed among all its volumes.

### Throughput

The throughput of an elastic SAN increases by 80 MB/s per base TiB. So if you had an elastic SAN that has 6 TiB of base capacity, that SAN could still provide up to 480 MB/s. That same SAN would provide 480-MB/s throughput whether it had 50 TiB of additional capacity or 500 TiB of additional capacity, since the SAN's performance is only determined by the base capacity. The throughput of an elastic SAN is distributed among all its volumes.

### Elastic SAN scale targets

The appliance scale targets vary depending on region and redundancy of the SAN itself. The following table breaks out the scale targets based on the SAN's [redundancy](elastic-san-planning.md#redundancy) and the region where it's located.

|Resource  |West US 2  |France Central  |Southeast Asia  |
|---------|---------|---------|---------|
|Maximum number of Elastic SAN that can be deployed per subscription per region     |5         |5         |5         |
|Maximum total capacity (TiB)     | LRS - 600 <br/> ZRS - 200         |LRS - 100 <br/> ZRS - 200         |LRS - 100         |
|Maximum base capacity (TiB)    |LRS - 400 <br/> ZRS - 100         |LRS - 100 <br/> ZRS - 100         |LRS - 100         |
|Minimum total capacity (TiB)    |64          |64         |64         |
|Maximum total IOPS     |LRS - 2,000,000 <br/> ZRS - 500,000         |LRS/ZRS - 500,000         |LRS - 500,000         |
|Maximum total throughput (MB/s)    |LRS - 32,000 <br/> ZRS - 8,000         |LRS/ZRS - 8,000         |LRS - 8,000         |


## Volume group

An elastic SAN can have a maximum of 20 volume groups, and a volume group can contain up to 1,000 volumes.

## Volume

The performance of an individual volume is determined by its capacity. The maximum IOPS of a volume increase by 750 per GiB, up to a maximum of 64,000 IOPS. The maximum throughput increases by 60 MB/s per GiB, up to a maximum of 1,024 MB/s. A volume needs at least 86 GiB to be capable of using 64,000 IOPS. A volume needs at least 18 GiB in order to be capable of using the maximum 1,024 MB/s. The combined IOPS and throughput of all your volumes can't exceed the IOPS and throughput of your SAN.

### Volume scale targets

| Resource | Target |
|-|-|
| Maximum volume capacity | 64 TiB |
| Minimum volume capacity | 1 GiB |
| Maximum total IOPS | 64,000 |
| Maximum total MB/s | 1,024 |