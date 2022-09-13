---
title: Elastic SAN scalability and performance targets
description: Learn about the capacity, IOPS, and throughput rates for Azure Elastic SAN.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 09/13/2022
ms.author: rogarana
ms.subservice: elastic-san
---

# Elastic SAN scale targets

There are three main components to an elastic storage area network (SAN): The SAN itself, volume groups, and volumes.

## The SAN

An elastic SAN has three main attributes: total capacity, IOPS, and throughput.

### Capacity

The total capacity of your elastic SAN is determined by two different capacities: The base capacity, and the additional capacity. Increasing the base capacity also increases the SAN's IOPS and throughput but is more costly than increasing the additional capacity. Increasing additional capacity doesn't increase IOPS or throughput.The maximum total capacity of your SAN is determined by the region it's in and the redundancy of the SAN. The minimum total capacity an elastic SAN can have is 64 tebibyte (TiB). Base or additional capacity can be increased in increments of 1 TiB.

### IOPS

The IOPS of a SAN increases by 5,000 per base TiB. So if you had an SAN that has 6 TiB of base capacity, that SAN would have 30,000 IOPS. That same SAN would still have 30,000 IOPS whether it had 58 TiB of additional capacity or 500 TiB of additional capacity, since the SAN's performance is only determined by the base capacity. The IOPS of an SAN is distributed among all its volumes.

### Throughput

The throughput of an SAN increases by 80 MB/s per base TiB. So if you had an SAN that has 6 TiB of base capacity, that SAN would have 480 MB/s. That same SAN would have 480 MB/s throughput whether it had 58 TiB of additional capacity or 500 TiB of additional capacity, since the SAN's performance is only determined by the base capacity. The throughput of an SAN is distributed among all its volumes.

### Appliance scale targets

The appliance scale targets vary depending on region and redundancy of the SAN itself. The following table breaks out the scale targets by the [redundancy](elastic-san-planning.md#redundancy) of the SAN and the SAN's region.

|Resource  |West US 2  |France Central  |Southeast Asia  |
|---------|---------|---------|---------|
|Maximum number of Elastic SAN that can be deployed per subscription per region     |5         |5         |5         |
|Maximum total capacity (TiB)     | LRS - 600, ZRS - 200         |LRS - 100, ZRS - 200         |LRS - 100         |
|Maximum base capacity (TiB)    |LRS - 400, ZRS - 100         |LRS - 100, ZRS - 100         |LRS - 100         |
|Minimum total capacity (TiB)    |64          |64         |64         |
|Maximum total IOPS     |LRS - 2,000,000, ZRS - 500,000         |LRS/ZRS - 500,000         |LRS - 500,000         |
|Maximum total throughput (MB/s)    |LRS - 32,000, ZRS - 8,000         |LRS/ZRS - 8,000         |LRS - 8,000         |


## Volume group

An SAN can have a maximum of 20 volume groups, and a volume group can contain up to 1,000 volumes.

## Volume

The performance of an individual volume is determined by its capacity. The maximum IOPS of a volume increases by 750 per GiB, up to a maximum of 64,000 IOPS. The maximum throughput increases by 60 MB/s per GiB, up to a maximum of 1,024 MB/s. To receive the maximum IOPS, you'd need an 86 GiB volume, and for maximum throughput, you'd need a 18 GiB volume.

### Volume scale targets

| Resource | Target |
|-|-|
| Maximum volume capacity | 64 TiB |
| Minimum volume capacity | 1 GiB |
| Maximum total IOPS | 64,000 |
| Maximum total MB/s | 1,024 |
| Maximum number of connected clients | 20 |