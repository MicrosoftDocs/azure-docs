---
title: Azure SQL Database vCore-based resource limits - elastic pools| Microsoft Docs
description: This page describes some common vCore-based resource limits for elastic pools in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: elastic-pool
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: oslake
ms.author: moslake
ms.reviewer: carlrab
manager: craigg
ms.date: 10/15/2018
---
# Azure SQL Database vCore-based purchasing model limits for elastic pools

This article provides the detailed resource limits for Azure SQL Database elastic pools and pooled databases using the vCore-based purchasing model.

For DTU-based purchasing model limits, see [SQL Database DTU-based resource limits - elastic pools](sql-database-dtu-resource-limits-elastic-pools.md).

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md).

You can set the service tier, compute size, and storage amount using the [Azure portal](sql-database-elastic-pool-manage.md#azure-portal-manage-elastic-pools-and-pooled-databases), [PowerShell](sql-database-elastic-pool-manage.md#powershell-manage-elastic-pools-and-pooled-databases), the [Azure CLI](sql-database-elastic-pool-manage.md#azure-cli-manage-elastic-pools-and-pooled-databases), or the [REST API](sql-database-elastic-pool-manage.md#rest-api-manage-elastic-pools-and-pooled-databases).

> [!NOTE]
> The resource limits of individual databases in elastic pools are generally the same as for single databases outside of pools that has the same compute size. For example, the max concurrent workers for an GP_Gen4_1 database is 200 workers. So, the max concurrent workers for a database in a GP_Gen4_1 pool is also 200 workers. Note, the total number of concurrent workers in GP_Gen4_1 pool is 210.

## General Purpose service tier: Storage sizes and compute sizes

### Generation 4 compute platform

|Compute size|GP_Gen4_1|GP_Gen4_2|GP_Gen4_4|GP_Gen4_8|GP_Gen4_16|GP_Gen4_24|
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|1|2|4|8|16|24|
|Memory (GB)|7|14|28|56|112|168|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|Max data size (GB)|512|756|1536|2048|3584|4096|
|Max log size|154|227|461|614|1075|1229|
|TempDB size(DB)|32|64|128|256|384|384|
|Target IOPS (64 KB)|500|1000|2000|4000|7000|7000|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max concurrent workers (requests)|210|420|840|1680|3360|5040|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Max number DBs per pool|100|200|500|500|500|500|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1|0, 0.25, 0.5, 1, 2|0, 0.25, 0.5, 1, 2, 4|0, 0.25, 0.5, 1, 2, 4, 8|0, 0.25, 0.5, 1, 2, 4, 8, 16|0, 0.25, 0.5, 1, 2, 4, 8, 16, 24|
|Number of replicas|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

### Generation 5 compute platform

|Compute size|GP_Gen5_2|GP_Gen5_4|GP_Gen5_8|GP_Gen5_16|GP_Gen5_24|GP_Gen5_32|GP_Gen5_40|GP_Gen5_80|
|:--- | --: |--: |--: |--: |--: |--: |--: |--: |
|H/W generation|5|5|5|5|5|5|5|5|
|vCores|2|4|8|16|24|32|40|80|
|Memory (GB)|11|22|44|88|132|176|220|440|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|Max data size (GB)|512|756|1536|2048|3072|4096|4096|4096|
|Max log size|154|227|461|614|922|1229|1229|1229|
|TempDB size(DB)|64|128|256|384|384|384|384|384|
|Target IOPS (64 KB)|500|1000|2000|4000|6000|7000|7000|7000|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max concurrent workers (requests)|210|420|840|1680|2520|3360|4200|8400
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|30000|
|Max number DBs per pool|100|200|500|500|500|500|500|500|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1, 2|0, 0.25, 0.5, 1, 2, 4|0, 0.25, 0.5, 1, 2, 4, 8|0, 0.25, 0.5, 1, 2, 4, 8, 16|0, 0.25, 0.5, 1, 2, 4, 8, 16, 24|0, 0.5, 1, 2, 4, 8, 16, 24, 32|0, 0.5, 1, 2, 4, 8, 16, 24, 32, 40|0, 0.5, 1, 2, 4, 8, 16, 24, 32, 40, 80|
|Number of replicas|1|1|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

## Business Critical service tier: Storage sizes and compute sizes

### Generation 4 compute platform

|Compute size|BC_Gen4_1|BC_Gen4_2|BC_Gen4_4|BC_Gen4_8|BC_Gen4_16|BC_Gen4_24|
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|1|2|4|8|16|24|
|Memory (GB)|7|14|28|56|112|168|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1|2|4|8|20|36|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (GB)|1024|1024|1024|1024|1024|1024|
|Max log size|307|307|307|307|307|307|
|TempDB size(DB)|32|64|128|256|384|384|
|Target IOPS (64 KB)|5000|10000|20000|40000|80000|120000|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max concurrent workers (requests)|210|420|840|1680|3360|5040|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Max number DBs per pool|Only single DBs are supported for this compute size|50|100|100|100|100|
|Min/max elastic pool vCore choices per database|N/A|0, 0.25, 0.5, 1, 2|0, 0.25, 0.5, 1, 2, 4|0, 0.25, 0.5, 1, 2, 4, 8|0, 0.25, 0.5, 1, 2, 4, 8, 16|0, 0.25, 0.5, 1, 2, 4, 8, 16, 24|
|Number of replicas|3|3|3|3|3|3|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

#### Generation 5 compute platform

|Compute size|BC_Gen5_2|BC_Gen5_4|BC_Gen5_8|BC_Gen5_16|BC_Gen5_24|BC_Gen5_32|BC_Gen5_40|BC_Gen5_80|
|:--- | --: |--: |--: |--: |--: |--: |--: |--: |
|H/W generation|5|5|5|5|5|5|5|5|
|vCores|2|4|8|16|24|32|40|80|
|Memory (GB)|11|22|44|88|132|176|220|440|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1.571|3.142|6.284|15.768|25.252|37.936|52.22|131.64|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max data size (GB)|1024|1024|1024|1024|2048|4096|4096|4096|
|Max log size|307|307|307|307|614|1229|1229|1229|
|TempDB size(DB)|64|128|256|384|384|384|384|384|
|Target IOPS (64 KB)|5000|10000|20000|40000|60000|80000|100000|200000
|Max concurrent workers (requests)|210|420|840|1680|2520|3360|5040|8400|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|30000|
|Max number DBs per pool|N/A|50|100|100|100|100|100|100|
|Min/max elastic pool vCore choices per database|N/A|0, 0.25, 0.5, 1, 2, 4|0, 0.25, 0.5, 1, 2, 4, 8|0, 0.25, 0.5, 1, 2, 4, 8, 16|0, 0.25, 0.5, 1, 2, 4, 8, 16, 24|0, 0.5, 1, 2, 4, 8, 16, 24, 32|0, 0.5, 1, 2, 4, 8, 16, 24, 32, 40|0, 0.5, 1, 2, 4, 8, 16, 24, 32, 40, 80|
|Number of replicas|3|3|3|3|3|3|3|3|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

If all vCores of an elastic pool are busy, then each database in the pool receives an equal amount of compute resources to process queries. The SQL Database service provides resource sharing fairness between databases by ensuring equal slices of compute time. Elastic pool resource sharing fairness is in addition to any amount of resource otherwise guaranteed to each database when the vCore min per database is set to a non-zero value.

## Database properties for pooled databases

The following table describes the properties for pooled databases.

| Property | Description |
|:--- |:--- |
| Max vCores per database |The maximum number of vCores that any database in the pool may use, if available based on utilization by other databases in the pool. Max vCores per database is not a resource guarantee for a database. This setting is a global setting that applies to all databases in the pool. Set max vCores per database high enough to handle peaks in database utilization. Some degree of over-committing is expected since the pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking.|
| Min vCores per database |The minimum number of vCores that any database in the pool is guaranteed. This setting is a global setting that applies to all databases in the pool. The min vCores per database may be set to 0, and is also the default value. This property is set to anywhere between 0 and the average vCores utilization per database. The product of the number of databases in the pool and the min vCores per database cannot exceed the vCores per pool.|
| Max storage per database |The maximum database size set by the user for a database in a pool. Pooled databases share allocated pool storage, so the size a database can reach is limited to the smaller of remaining pool storage and database size. Max database size refers to the maximum size of the data files and does not include the space used by log files. |
|||

## Next steps

- See [SQL Database FAQ](sql-database-faq.md) for answers to frequently asked questions.
- See [Overview of resource limits on a logical server](sql-database-resource-limits-logical-server.md) for information about limits at the server and subscription levels.
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
