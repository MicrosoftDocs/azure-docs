---
title: 'Azure SQL Database DTU to vCore migration | Microsoft Docs'
description: Learn about best practices for migrating to the vCore-based purchasing model from the DTU-based purchasing model.  
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: carlrab
manager: craigg
ms.date: 03/22/2019
---
# DTU to vCore migration guidance

Why migrate? The vCore-based purchasing model gives you more flexibility and control over your processor, memory, and storage resources compared with the DTU-based purchasing model. The vCore-based purchasing model also provides cost savings via [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) and [reserved capacity](sql-database-reserved-capacity.md). For vCore model pricing and discounts refer to [single database pricing](https://azure.microsoft.com/pricing/details/sql-database/single/) and [elastic pool pricing](https://azure.microsoft.com/en-us/pricing/details/sql-database/elastic/).

## Mapping of resource between purchasing models

To migrate to an equivalent hardware generation, use the following information to understand the hardware generation and SQL online scheduler for a given DTU level to map to a vCore count and hardware type.

### Online schedulers

The online schedulers can be found by connecting to a database as server administrator and running:

```sql
SELECT count(*) from sys.dm_os_schedulers WHERE status = 'VISIBLE ONLINE'
```

### Additional information

Gen4 processors come with a restriction of <= 1TB for the Business Critical service tier. If existing DTU service tier uses Gen4 hardware, consider shrinking your databases to fit in these Gen4 hardware restrictions before attempting a migration. See [File space management](sql-database-file-space-management.md).

Existing elastic pools may have established a min/max for pooled databases. Use the single database tables for finding the appropriate vCore cap.

The conversion tables provide 3 possible vCore options (sometimes they are the same value)

- Price sensitive vCores: minimum vCore value ensures similar resource availability as the DTU source compute level. This option is intended for cost sensitive migrations.
- Performance vCores: a larger vCore value providing the same or more resources than the DTU source compute level.
- Suggested vCores: a blended suggested vCore value where the cost per performance is minimized while ensuring same or close CPU / memory with the DTU source compute level.

## Standard to General Purpose

### Single database

|DTU|Name|Online Schedulers|HW|Price Sensitive vCores|Performance vCores|Suggested vCores|
|:-:|:--:|:---------------:|:-:|:--------------------:|:----------------:|:--------------:|
|100|S3|1|Gen4|1|1|1|
|100|S3|2|Gen5|2|2|2|
|200|S4|2|Gen4|2|2|2|
|200|S4|4|Gen5|4|4|4|
|400|S6|3|Gen4|3|3|3|
|400|S6|4|Gen4|3|3|3|
|400|S6|6|Gen5|6|6|6|
|800|S7|6|Gen4|6|6|6|
|800|S7|8|Gen4|6|6|6|
|800|S7|12|Gen5|12|12|12|
|1600|S9|12|Gen4|10|16|16|
|1600|S9|24|Gen5|24|24|24|
|3000|S12|22|Gen4|16|24|24|
|3000|S12|44|Gen5|40|80|40|

### Elastic pools

Before migration check maximum number of databases per elastic pool for anything below 4 vCores. If current number of databases density is not supported for the minimum desired Gen4 cores, then use Gen5 or increase vCores. See [Elastic pool vCore resource limits](sql-database-vcore-resource-limits-elastic-pools.md) for latest supported levels.

|eDTU|Online Schedulers|HW|Price Sensitive vCores|Performance vCores|Suggested vCores|
|:-:|:--:|:---------------:|:-:|:--------------------:|:----------------:|:--------------:|
|50|1|Gen4|1|1|1|
|50|2|Gen5|2|2|2|
|100|2|Gen4|2|2|2|
|100|4|Gen5|4|4|4|
|200|3|Gen4|3|3|3|
|200|6|Gen5|6|6|6|
|300|3|Gen4|3|3|3|
|300|6|Gen5|6|6|6|
|400|3|Gen4|3|3|3|
|400|6|Gen5|6|6|6|
|800|6|Gen4|6|6|6|
|800|8|Gen4|6|6|6|
|800|12|Gen5|12|12|12|
|1200|8|Gen4|8|9|8|
|1200|12|Gen4|8|9|8|
|1200|16|Gen5|16|18|16|
|1600|12|Gen4|10|16|16|
|1600|24|Gen5|24|24|24|
|2000|15|Gen4|10|16|16|
|2000|30|Gen5|24|32|32|
|2500|18|Gen4|16|24|24|
|2500|36|Gen5|32|40|40|
|3000|22|Gen4|16|24|24|
|3000|44|Gen5|40|80|40|

## Basic to General Purpose

There is no vCore option that matches the cost/performance of a single database in the Basic service tier. Basic elastic pools can be converted to vCore-based service tiers. 

There are few more limitations than for Standard:

- The 50 and 100 eDTU compute levels have no Gen5 equivalent in vCore elastic pools. Gen4 sizing can be used instead.
- The 100 eDTU Basic compute level supports 200 databases while a 1 vCore Gen4 compute level supports only 100.

|eDTU|Online Schedulers|HW|Price Sensitive vCores|Performance vCores|Suggested vCores|
|:-:|:--:|:---------------:|:-:|:--------------------:|:----------------:|:--------------:|
|50|1|Gen4|1|1|1|
|100|1|Gen4|1|1|1|
|200|2|Gen4|2|2|2|
|200|4|Gen5|4|4|4|
|300|3|Gen4|3|3|3|
|300|6|Gen5|6|6|6|
|400|3|Gen4|3|3|3|
|400|4|Gen4|3|3|3|
|400|6|Gen5|6|6|6|
|800|6|Gen4|6|6|6|
|800|8|Gen4|6|6|6|
|800|12|Gen5|12|12|12|
|1200|8|Gen4|8|9|8|
|1200|12|Gen4|8|9|8|
|1200|16|Gen5|16|18|16|
|1600|12|Gen4|10|16|16|
|1600|24|Gen5|24|24|24|

## Premium to Business Critical

### Single database

DTU|Name|Online Schedulers|HW|Price Sensitive vCores|Performance vCores|Suggested vCores|
|:-:|:--:|:---------------:|:-:|:--------------------:|:----------------:|:--------------:|
|125|P1|1|Gen4|1|1|1|
|125|P1|2|Gen5|2|2|2|
|250|P2|2|Gen4|2|2|2|
|250|P2|4|Gen5|4|4|4|
|500|P4|3|Gen4|3|4|4|
|500|P4|6|Gen5|6|8|8|
|1000|P6|6|Gen4|6|7|6|
|1000|P6|8|Gen4|6|7|6|
|1000|P6|12|Gen5|12|14|12|
|1750|P11|9|Gen4|9|16|16|
|1750|P11|18|Gen5|18|24|24|
|4000|P15|21|Gen4|16|24|24|
|4000|P15|22|Gen4|16|24|24|
|4000|P15|42|Gen5|40|80|40|

### Elastic Pools

|eDTU|Online Schedulers|HW|Price Sensitive vCores|Performance vCores|Suggested vCores|
|:-:|:--:|:---------------:|:-:|:--------------------:|:----------------:|:--------------:|
|125|1|Gen4|2|2|2|
|125|2|Gen4|2|2|2|
|125|4|Gen5|4|4|4|
|250|3|Gen4|3|3|3|
|250|4|Gen5|4|6|4|
|500|3|Gen4|3|3|3|
|500|4|Gen4|3|3|3|
|500|6|Gen5|6|6|6|
|1000|6|Gen4|6|6|6|
|1000|8|Gen4|6|6|6|
|1000|12|Gen5|12|12|12|
|1500|8|Gen4|8|9|8|
|1500|9|Gen4|8|9|8|
|1500|16|Gen5|16|18|16|
|1750|9|Gen4|9|16|16|
|1750|18|Gen5|18|24|24|
|2000|11|Gen4|10|16|16|
|2000|12|Gen4|10|16|16|
|2000|22|Gen5|20|24|24|
|2500|14|Gen4|10|16|16|
|2500|16|Gen4|10|16|16|
|2500|28|Gen5|24|32|32|
|3000|16|Gen4|16|24|16|
|3000|32|Gen5|32|40|32|
|3500|19|Gen4|16|24|24|
|3500|20|Gen4|16|24|24|
|3500|38|Gen5|32|80|40|
|4000|21|Gen4|16|24|24|
|4000|42|Gen5|40|80|40|

## Frequently asked questions (FAQ)

### What are the key differences between Gen 5 and Gen 4 hardware?

The key benefits of Gen 5 hardware are accelerated network, support of > 1TB database size for Business Critical service tier, and the ability to sale to higher levels of compute and memory. It also supports higher density in elastic pools. If these are important for your application, you should migrate to Gen 5. Refer to this article for details.

### What are the reasons the same DTU SLO may have a different number of schedulers?

Same DTU SLO will have different schedulers based on h/w generation on which the SLO is placed. Gen3 processors are less powerful than Gen4 and so on. Our benchmarking shows that we can achieve the target DTU using fewer processors and lesser memory.

### What is the recommended way to evaluate the performance difference between Gen 4 vCores and Gen 5 vCores?

Industry standard benchmarks like TPC-E and TPC-H.

## Next steps

- [vCore-based purchase model](sql-database-service-tiers-vcore.md)
- [Single database vCore resource limits](sql-database-vcore-resource-limits-single-databases.md)
- [Elastic pool vCore resource limits](sql-database-vcore-resource-limits-elastic-pools.md)