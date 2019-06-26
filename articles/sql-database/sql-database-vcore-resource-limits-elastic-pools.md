---
title: Azure SQL Database vCore-based resource limits - elastic pools| Microsoft Docs
description: This page describes some common vCore-based resource limits for elastic pools in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: elastic-pools
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: oslake
ms.author: moslake
ms.reviewer: carlrab
manager: craigg
ms.date: 06/26/2019
---
# Resource limits for elastic pools using the vCore-based purchasing model limits

This article provides the detailed resource limits for Azure SQL Database elastic pools and pooled databases using the vCore-based purchasing model.

For DTU-based purchasing model limits, see [SQL Database DTU-based resource limits - elastic pools](sql-database-dtu-resource-limits-elastic-pools.md).

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md).

You can set the service tier, compute size, and storage amount using the [Azure portal](sql-database-elastic-pool-manage.md#azure-portal-manage-elastic-pools-and-pooled-databases), [PowerShell](sql-database-elastic-pool-manage.md#powershell-manage-elastic-pools-and-pooled-databases), the [Azure CLI](sql-database-elastic-pool-manage.md#azure-cli-manage-elastic-pools-and-pooled-databases), or the [REST API](sql-database-elastic-pool-manage.md#rest-api-manage-elastic-pools-and-pooled-databases).

> [!IMPORTANT]
> For scaling guidance and considerations, see [Scale an elastic pool](sql-database-elastic-pool-scale.md)
> [!NOTE]
> The resource limits of individual databases in elastic pools are generally the same as for single databases outside of pools that has the same compute size. For example, the max concurrent workers for an GP_Gen4_1 database is 200 workers. So, the max concurrent workers for a database in a GP_Gen4_1 pool is also 200 workers. Note, the total number of concurrent workers in GP_Gen4_1 pool is 210.

## General Purpose service tier: Storage sizes and compute sizes

> [!IMPORTANT]
> New Gen4 databases are no longer supported in the AustraliaEast region.

### General Purpose service tier: Generation 4 compute platform (part 1)

|Compute size|GP_Gen4_1|GP_Gen4_2|GP_Gen4_3|GP_Gen4_4|GP_Gen4_5|GP_Gen4_6
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|1|2|3|4|5|6|
|Memory (GB)|7|14|21|28|35|42|
|Max number DBs per pool|100|200|500|500|500|500|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|512|756|756|1536|1536|1536|
|Max log size|154|227|227|461|461|461|
|TempDB size (GB)|32|64|96|128|160|192|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Target IOPS (64 KB)|500|1000|1500|2000|2500|3000|
|Log rate limits (MBps)|4.6875|9.375|14.0625|18.75|23.4375|28.125|
|Max concurrent workers per pool (requests) * |210|420|630|840|1050|1260|
|Max concurrent logins per pool * |210|420|630|840|1050|1260|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1|0, 0.25, 0.5, 1, 2|0, 0.25, 0.5, 1...3|0, 0.25, 0.5, 1...4|0, 0.25, 0.5, 1...5|0, 0.25, 0.5, 1...6|
|Number of replicas|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* For the max concurrent workers (requests) for any individual database, see [Single database resource limits](sql-database-vcore-resource-limits-single-databases.md). For example, if the elastic pool is using Gen5 and its max vCore per database is 2, then the max concurrent workers is 200.  If max vCore per database is 0.5, then the max concurrent workers is 50 since on Gen5 there are a max of 100 concurrent workers per vcore.  For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### General Purpose service tier: Generation 4 compute platform (part 2)

|Compute size|GP_Gen4_7|GP_Gen4_8|GP_Gen4_9|GP_Gen4_10|GP_Gen4_16|GP_Gen4_24|
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|7|8|9|10|16|24|
|Memory (GB)|49|56|63|70|112|168|
|Max number DBs per pool|500|500|500|500|500|500|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|1536|2048|2048|2048|3584|4096|
|Max log size (GB)|461|614|614|614|1075|1229|
|TempDB size (GB)|224|256|288|320|384|384|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Target IOPS (64 KB)|3500|4000|4500|5000|7000|7000|
|Log rate limits (MBps)|32.8125|37.5|37.5|37.5|37.5|37.5|
|Max concurrent workers per pool (requests) *|1470|1680|1890|2100|3360|5040|
|Max concurrent logins pool (requests) *|1470|1680|1890|2100|3360|5040|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1...7|0, 0.25, 0.5, 1...8|0, 0.25, 0.5, 1...9|0, 0.25, 0.5, 1...10|0, 0.25, 0.5, 1...10, 16|0, 0.25, 0.5, 1...10, 16, 24|
|Number of replicas|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* For the max concurrent workers (requests) for any individual database, see [Single database resource limits](sql-database-vcore-resource-limits-single-databases.md). For example, if the elastic pool is using Gen5 and its max vCore per database is 2, then the max concurrent workers is 200.  If max vCore per database is 0.5, then the max concurrent workers is 50 since on Gen5 there are a max of 100 concurrent workers per vcore.  For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### General Purpose service tier: Generation 5 compute platform (part 1)

|Compute size|GP_Gen5_2|GP_Gen5_4|GP_Gen5_6|GP_Gen5_8|GP_Gen5_10|GP_Gen5_12|GP_Gen5_14|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|H/W generation|5|5|5|5|5|5|5|
|vCores|2|4|6|8|10|12|14|
|Memory (GB)|10.2|20.4|30.6|40.8|51|61.2|71.4|
|Max number DBs per pool|100|200|500|500|500|500|500|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|512|756|756|1536|1536|1536|
|Max log size (GB)|154|227|227|461|461|461|461|
|TempDB size (GB)|64|128|192|256|320|384|384|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Target IOPS (64 KB)|1000|2000|3000|4000|5000|6000|7000|
|Log rate limits (MBps)|4.6875|9.375|14.0625|18.75|23.4375|28.125|32.8125|
|Max concurrent workers per pool (requests) *|210|420|630|840|1050|1260|1470|
|Max concurrent logins per pool (requests) *|210|420|630|840|1050|1260|1470|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1, 2|0, 0.25, 0.5, 1...4|0, 0.25, 0.5, 1...6|0, 0.25, 0.5, 1...8|0, 0.25, 0.5, 1...10|0, 0.25, 0.5, 1...12|0, 0.25, 0.5, 1...14|
|Number of replicas|1|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* For the max concurrent workers (requests) for any individual database, see [Single database resource limits](sql-database-vcore-resource-limits-single-databases.md). For example, if the elastic pool is using Gen5 and its max vCore per database is 2, then the max concurrent workers is 200.  If max vCore per database is 0.5, then the max concurrent workers is 50 since on Gen5 there are a max of 100 concurrent workers per vcore.  For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### General Purpose service tier: Generation 5 compute platform (part 2)

|Compute size|GP_Gen5_16|GP_Gen5_18|GP_Gen5_20|GP_Gen5_24|GP_Gen5_32|GP_Gen5_40|GP_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|H/W generation|5|5|5|5|5|5|5|
|vCores|16|18|20|24|32|40|80|
|Memory (GB)|81.6|91.8|102|122.4|163.2|204|408|
|Max number DBs per pool|500|500|500|500|500|500|500|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|2048|2048|3072|3072|4096|4096|4096|
|Max log size (GB)|614|614|922|922|1229|1229|1229|
|TempDB size (GB)|384|384|384|384|384|384|384|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Target IOPS (64 KB)|7000|7000|7000|7000|7000|7000|7000|
|Log rate limits (MBps)|37.5|37.5|37.5|37.5|37.5|37.5|37.5|
|Max concurrent workers per pool (requests) *|1680|1890|2100|2520|33600|4200|8400|
|Max concurrent logins per pool (requests) *|1680|1890|2100|2520|33600|4200|8400|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1...16|0, 0.25, 0.5, 1...18|0, 0.25, 0.5, 1...20|0, 0.25, 0.5, 1...20, 24|0, 0.25, 0.5, 1...20, 24, 32|0, 0.25, 0.5, 1...16, 24, 32, 40|0, 0.25, 0.5, 1...16, 24, 32, 40, 80|
|Number of replicas|1|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* For the max concurrent workers (requests) for any individual database, see [Single database resource limits](sql-database-vcore-resource-limits-single-databases.md). For example, if the elastic pool is using Gen5 and its max vCore per database is 2, then the max concurrent workers is 200.  If max vCore per database is 0.5, then the max concurrent workers is 50 since on Gen5 there are a max of 100 concurrent workers per vcore.  For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

## Business Critical service tier: Storage sizes and compute sizes

> [!IMPORTANT]
> New Gen4 databases are no longer supported in the AustraliaEast region.

### Business Critical service tier: Generation 4 compute platform (part 1)

|Compute size|BC_Gen4_1|BC_Gen4_2|BC_Gen4_3|BC_Gen4_4|BC_Gen4_5|BC_Gen4_6|
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|1|2|3|4|5|6|
|Memory (GB)|7|14|21|28|35|42|
|Max number DBs per pool|Only single DBs are supported for this compute size|50|100|100|100|100|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1|2|3|4|5|6|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (GB)|650|650|650|650|650|650|
|Max log size (GB)|195|195|195|195|195|195|
|TempDB size (GB)|32|64|96|128|160|192|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Target IOPS (64 KB)|5000|10000|15000|20000|25000|30000|
|Log rate limits (MBps)|10|20|30|40|50|60|
|Max concurrent workers per pool (requests) *|210|420|630|840|1050|1260|
|Max concurrent logins per pool (requests) *|210|420|630|840|1050|1260|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Min/max elastic pool vCore choices per database|N/A|0, 0.25, 0.5, 1, 2|0, 0.25, 0.5, 1...3|0, 0.25, 0.5, 1...4|0, 0.25, 0.5, 1...5|0, 0.25, 0.5, 1...6|
|Number of replicas|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* For the max concurrent workers (requests) for any individual database, see [Single database resource limits](sql-database-vcore-resource-limits-single-databases.md). For example, if the elastic pool is using Gen5 and its max vCore per database is 2, then the max concurrent workers is 200.  If max vCore per database is 0.5, then the max concurrent workers is 50 since on Gen5 there are a max of 100 concurrent workers per vcore.  For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### Business Critical service tier: Generation 4 compute platform (part 2)

|Compute size|BC_Gen4_7|BC_Gen4_8|BC_Gen4_9|BC_Gen4_10|BC_Gen4_16|BC_Gen4_24|
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|7|8|9|10|16|24|
|Memory (GB)|81.6|91.8|102|122.4|163.2|204|
|Max number DBs per pool|100|100|100|100|100|100|
|Columnstore support|N/A|N/A|N/A|N/A|N/A|N/A|
|In-memory OLTP storage (GB)|7|8|9.5|11|20|36|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (GB)|650|650|650|650|1024|1024|
|Max log size (GB)|195|195|195|195|307|307|
|TempDB size (GB)|224|256|288|320|384|384|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Target IOPS (64 KB)|35000|40000|45000|50000|80000|120000|
|Log rate limits (MBps)|70|80|80|80|80|80|
|Max concurrent workers per pool (requests) *|1470|1680|1890|2100|3360|5040|
|Max concurrent logins per pool (requests) *|1470|1680|1890|2100|3360|5040|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1...7|0, 0.25, 0.5, 1...8|0, 0.25, 0.5, 1...9|0, 0.25, 0.5, 1...10|0, 0.25, 0.5, 1...10, 16|0, 0.25, 0.5, 1...10, 16, 24|
|Number of replicas|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* For the max concurrent workers (requests) for any individual database, see [Single database resource limits](sql-database-vcore-resource-limits-single-databases.md). For example, if the elastic pool is using Gen5 and its max vCore per database is 2, then the max concurrent workers is 200.  If max vCore per database is 0.5, then the max concurrent workers is 50 since on Gen5 there are a max of 100 concurrent workers per vcore.  For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

#### Business Critical service tier: Generation 5 compute platform (part 1)

|Compute size|BC_Gen5_2|BC_Gen5_4|BC_Gen5_6|BC_Gen5_8|BC_Gen5_10|BC_Gen5_12|BC_Gen5_14|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|H/W generation|5|5|5|5|5|5|5|
|vCores|2|4|6|8|10|12|14|
|Memory (GB)|10.2|20.4|30.6|40.8|51|61.2|71.4|
|Max number DBs per pool|Only single DBs are supported for this compute size|50|100|100|100|100|100|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1.571|3.142|4.713|6.284|8.655|11.026|13.397|
|Max data size (GB)|1024|1024|1536|1536|1536|3072|3072|
|Max log size (GB)|307|307|307|461|461|922|922|
|TempDB size (GB)|64|128|192|256|320|384|384|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Target IOPS (64 KB)|5000|10000|15000|20000|25000|30000|35000|
|Log rate limits (MBps)|15|30|45|60|75|90|105|
|Max concurrent workers per pool (requests) *|210|420|630|840|1050|1260|1470|
|Max concurrent logins per pool (requests) *|210|420|630|840|1050|1260|1470|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|
|Min/max elastic pool vCore choices per database|N/A|0, 0.25, 0.5, 1...4|0, 0.25, 0.5, 1...6|0, 0.25, 0.5, 1...8|0, 0.25, 0.5, 1...10|0, 0.25, 0.5, 1...12|0, 0.25, 0.5, 1...14|
|Number of replicas|4|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* For the max concurrent workers (requests) for any individual database, see [Single database resource limits](sql-database-vcore-resource-limits-single-databases.md). For example, if the elastic pool is using Gen5 and its max vCore per database is 2, then the max concurrent workers is 200.  If max vCore per database is 0.5, then the max concurrent workers is 50 since on Gen5 there are a max of 100 concurrent workers per vcore.  For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

#### Business Critical service tier: Generation 5 compute platform (part 2)

|Compute size|BC_Gen5_16|BC_Gen5_18|BC_Gen5_20|BC_Gen5_24|BC_Gen5_32|BC_Gen5_40|BC_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|H/W generation|5|5|5|5|5|5|5|
|vCores|16|18|20|24|32|40|80|
|Memory (GB)|81.6|91.8|102|122.4|163.2|204|408|
|Max number DBs per pool|100|100|100|100|100|100|100|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|15.768|18.139|20.51|25.252|37.936|52.22|131.64|
|Max data size (GB)|3072|3072|3072|4096|4096|4096|4096|
|Max log size (GB)|922|922|922|1229|1229|1229|1229|
|TempDB size (GB)|384|384|384|384|384|384|384|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Target IOPS (64 KB)|40000|45000|50000|60000|80000|100000|200000|
|Log rate limits (MBps)|120|120|120|120|120|120|120|
|Max concurrent workers per pool (requests) *|1680|1890|2100|2520|3360|4200|8400|
|Max concurrent logins per pool (requests) *|1680|1890|2100|2520|3360|4200|8400|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1...16|0, 0.25, 0.5, 1...18|0, 0.25, 0.5, 1...20|0, 0.25, 0.5, 1...20, 24|0, 0.25, 0.5, 1...20, 24, 32|0, 0.25, 0.5, 1...20, 24, 32, 40|0, 0.25, 0.5, 1...20, 24, 32, 40, 80|
|Number of replicas|4|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* For the max concurrent workers (requests) for any individual database, see [Single database resource limits](sql-database-vcore-resource-limits-single-databases.md). For example, if the elastic pool is using Gen5 and its max vCore per database is 2, then the max concurrent workers is 200.  If max vCore per database is 0.5, then the max concurrent workers is 50 since on Gen5 there are a max of 100 concurrent workers per vcore.  For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

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

- For vCore resource limits for a single database, see [resource limits for single databases using the vCore-based purchasing model](sql-database-vcore-resource-limits-single-databases.md)
- For DTU resource limits for a single database, see [resource limits for single databases using the DTU-based purchasing model](sql-database-dtu-resource-limits-single-databases.md)
- For DTU resource limits for elastic pools, see [resource limits for elastic pools using the DTU-based purchasing model](sql-database-dtu-resource-limits-elastic-pools.md)
- For resource limits for managed instances, see [managed instance resource limits](sql-database-managed-instance-resource-limits.md).
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
- For information about resource limits on a database server, see [overview of resource limits on a SQL Database server](sql-database-resource-limits-database-server.md) for information about limits at the server and subscription levels.
