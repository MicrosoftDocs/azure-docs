---
title: Azure SQL Database vCore-based resource limits - single database | Microsoft Docs
description: This page describes some common vCore-based resource limits for a single database in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: 
manager: craigg
ms.date: 04/22/2019
---
# Resource limits for single databases using the vCore-based purchasing model

This article provides the detailed resource limits for Azure SQL Database single databases using the vCore-based purchasing model.

For DTU-based purchasing model limits for single databases on a SQL Database server, see [Overview of resource limits on a SQL Database server](sql-database-resource-limits-database-server.md).

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md).

You can set the service tier, compute size, and storage amount for a single database using the [Azure portal](sql-database-single-databases-manage.md#manage-an-existing-sql-database-server), [Transact-SQL](sql-database-single-databases-manage.md#transact-sql-manage-sql-database-servers-and-single-databases), [PowerShell](sql-database-single-databases-manage.md#powershell-manage-sql-database-servers-and-single-databases), the [Azure CLI](sql-database-single-databases-manage.md#azure-cli-manage-sql-database-servers-and-single-databases), or the [REST API](sql-database-single-databases-manage.md#rest-api-manage-sql-database-servers-and-single-databases).

> [!IMPORTANT]
> For scaling guidance and considerations, see [Scale a single database](sql-database-single-database-scale.md).

## General Purpose service tier: Storage sizes and compute sizes

> [!IMPORTANT]
> New Gen4 databases are no longer supported in the AustraliaEast region.

### General Purpose service tier: Generation 4 compute platform (part 1)

|Compute size|GP_Gen4_1|GP_Gen4_2|GP_Gen4_3|GP_Gen4_4|GP_Gen4_5|GP_Gen4_6
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|1|2|3|4|5|6|
|Memory (GB)|7|14|21|28|35|42|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|1024|1024|1024|1536|1536|1536|
|Max log size (GB)|307|307|307|461|461|461|
|TempDB size (GB)|32|64|96|128|160|192|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Target IOPS (64 KB)|500|1000|1500|2000|2500|3000|
|Log rate limits (MBps)|3.75|7.5|11.25|15|18.75|22.5|
|Max concurrent workers (requests)|200|400|600|800|1000|1200|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Number of replicas|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

### General Purpose service tier: Generation 4 compute platform (part 2)

|Compute size|GP_Gen4_7|GP_Gen4_8|GP_Gen4_9|GP_Gen4_10|GP_Gen4_16|GP_Gen4_24
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|7|8|9|10|16|24|
|Memory (GB)|49|56|63|70|112|168|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|1536|3072|3072|3072|4096|4096|
|Max log size (GB)|461|922|922|922|1229|1229|
|TempDB size (GB)|224|256|288|320|384|384|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)
|Target IOPS (64 KB)|3500|4000|4500|5000|7000|7000|
|Log rate limits (MBps)|26.25|30|30|30|30|30|
|Max concurrent workers (requests)|1400|1600|1800|2000|3200|4800|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Number of replicas|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

### General Purpose service tier: Generation 5 compute platform (part 1)

|Compute size|GP_Gen5_2|GP_Gen5_4|GP_Gen5_6|GP_Gen5_8|GP_Gen5_10|GP_Gen5_12|GP_Gen5_14|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|H/W generation|5|5|5|5|5|5|5|
|vCores|2|4|6|8|10|12|14|
|Memory (GB)|10.2|20.4|30.6|40.8|51|61.2|71.4|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|1024|1024|1536|1536|1536|3072|3072|
|Max log size (GB)|307|307|307|461|461|461|461|
|TempDB size (GB)|64|128|192|256|320|384|384|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Target IOPS (64 KB)|1000|2000|3000|4000|5000|6000|7000|
|Log rate limits (MBps)|3.75|7.5|11.25|15|18.75|22.5|26.25|
|Max concurrent workers (requests)|200|400|600|800|1000|1200|1400|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|
|Number of replicas|1|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

### General Purpose service tier: Generation 5 compute platform (part 2)

|Compute size|GP_Gen5_16|GP_Gen5_18|GP_Gen5_20|GP_Gen5_24|GP_Gen5_32|GP_Gen5_40|GP_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|H/W generation|5|5|5|5|5|5|5|
|vCores|16|18|20|24|32|40|80|
|Memory (GB)|81.6|91.8|102|122.4|163.2|204|408|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|3072|3072|3072|4096|4096|4096|4096|
|Max log size (GB)|922|922|922|1229|1229|1229|1229|
|TempDB size (GB)|384|384|384|384|384|384|384|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Target IOPS (64 KB)|7000|7000|7000|7000|7000|7000|7000|
|Log rate limits (MBps)|30|30|30|30|30|30|30|
|Max concurrent workers (requests)|1600|1800|2000|2400|3200|4000|8000|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|
|Number of replicas|1|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

### Serverless compute tier

The [serverless compute tier](sql-database-serverless.md) is in preview and is only for single databases using the vCore purchasing model.

#### Generation 5 compute platform

|Compute size|GP_S_Gen5_1|GP_S_Gen5_2|GP_S_Gen5_4|
|:--- | --: |--: |--: |
|H/W generation|5|5|5|
|Min-max vCores|0.5-1|0.5-2|0.5-4|
|Min-max memory (GB)|2.02-3|2.05-6|2.10-12|
|Min auto-pause delay (hours)|6|6|6|
|Columnstore support|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|
|Max data size (GB)|512|1024|1024|
|Max log size (GB)|12|24|48|
|TempDB size (GB)|32|64|128|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Target IOPS (64 KB)|500|1000|2000|
|Log rate limits (MBps)|2.5|5.6|10|
|Max concurrent workers (requests)|75|150|300|
|Max allowed sessions|30000|30000|30000|
|Number of replicas|1|1|1|
|Multi-AZ|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|

## Business Critical service tier for provisioned compute tier

> [!IMPORTANT]
> New Gen4 databases are no longer supported in the AustraliaEast region.

### Business Critical service tier: Generation 4 compute platform (part 1)

|Compute size|BC_Gen4_1|BC_Gen4_2|BC_Gen4_3|BC_Gen4_4|BC_Gen4_5|BC_Gen4_6|
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|1|2|3|4|5|6|
|Memory (GB)|7|14|21|28|35|42|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1|2|3|4|5|6|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (GB)|650|650|650|650|650|650|
|Max log size (GB)|195|195|195|195|195|195|
|TempDB size (GB)|32|64|96|128|160|192|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Target IOPS (64 KB)|5000|10000|15000|20000|25000|30000|
|Log rate limits (MBps)|8|16|24|32|40|48|
|Max concurrent workers (requests)|200|400|600|800|1000|1200|
|Max concurrent logins|200|400|600|800|1000|1200|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Number of replicas|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

### Business Critical service tier: Generation 4 compute platform (part 2)

|Compute size|BC_Gen4_7|BC_Gen4_8|BC_Gen4_9|BC_Gen4_10|BC_Gen4_16|BC_Gen4_24|
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|7|8|9|10|16|24|
|Memory (GB)|49|56|63|70|112|168|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|7|8|9.5|11|20|36|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (GB)|650|650|650|650|1024|1024|
|Max log size (GB)|195|195|195|195|307|307|
|TempDB size (GB)|224|256|288|320|384|384|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Target IOPS (64 KB)|35000|40000|45000|50000|80000|120000|
|Log rate limits (MBps)|56|64|64|64|64|64|
|Max concurrent workers (requests)|1400|1600|1800|2000|3200|4800|
|Max concurrent logins (requests)|1400|1600|1800|2000|3200|4800|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Number of replicas|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

### Business Critical service tier: Generation 5 compute platform (part 1)

|Compute size|BC_Gen5_2|BC_Gen5_4|BC_Gen5_6|BC_Gen5_8|BC_Gen5_10|BC_Gen5_12|BC_Gen5_14|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|H/W generation|5|5|5|5|5|5|5|
|vCores|2|4|6|8|10|12|14|
|Memory (GB)|10.2|20.4|30.6|40.8|51|61.2|71.4|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1.571|3.142|4.713|6.284|8.655|11.026|13.397|
|Max data size (GB)|1024|1024|1536|1536|1536|3072|3072|
|Max log size (GB)|307|307|307|461|461|922|922|
|TempDB size (GB)|64|128|192|256|320|384|384|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Target IOPS (64 KB)|8000|16000|24000|32000|40000|48000|56000|
|Log rate limits (MBps)|12|24|36|48|60|72|84|
|Max concurrent workers (requests)|200|400|600|800|1000|1200|1400|
|Max concurrent logins|200|400|600|800|1000|1200|1400|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|
|Number of replicas|4|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

### Business Critical service tier: Generation 5 compute platform (part 2)

|Compute size|BC_Gen5_16|BC_Gen5_18|BC_Gen5_20|BC_Gen5_24|BC_Gen5_32|BC_Gen5_40|BC_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|H/W generation|5|5|5|5|5|5|5|
|vCores|16|18|20|24|32|40|80|
|Memory (GB)|81.6|91.8|102|122.4|163.2|204|408|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|15.768|18.139|20.51|25.252|37.936|52.22|131.64|
|Max data size (GB)|3072|3072|3072|4096|4096|4096|4096|
|Max log size (GB)|922|922|922|1229|1229|1229|1229|
|TempDB size (GB)|384|384|384|384|384|384|384|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Target IOPS (64 KB)|64000|72000|80000|96000|128000|160000|320000|
|Log rate limits (MBps)|96|96|96|96|96|96|96|
|Max concurrent workers (requests)|1600|1800|2000|2400|3200|4000|8000|
|Max concurrent logins|1600|1800|2000|2400|3200|4000|8000|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|
|Number of replicas|4|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

## Hyperscale service tier

### Generation 5 compute platform

|Performance level|HS_Gen5_2|HS_Gen5_4|HS_Gen5_8|HS_Gen5_16|HS_Gen5_24|HS_Gen5_32|HS_Gen5_40|HS_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |--: |
|H/W generation|5|5|5|5|5|5|5|5|
|vCores|2|4|8|16|24|32|40|80|
|Memory (GB)|10.2|20.4|40.8|81.6|122.4|163.2|204|408|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (TB)|100 |100 |100 |100 |100 |100 |100 |100 |
|Max log size (TB)|1 |1 |1 |1 |1 |1 |1 |1 |
|TempDB size (GB)|64|128|256|384|384|384|384|384|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Target IOPS (64 KB)| [Note 1](#note-1) |[Note 1](#note-1)|[Note 1](#note-1) |[Note 1](#note-1) |[Note 1](#note-1) |[Note 1](#note-1) |[Note 1](#note-1) | [Note 1](#note-1) |
|IO latency (approximate)|To be determined|To be determined|To be determined|To be determined|To be determined|To be determined|To be determined|To be determined|
|Max concurrent workers (requests)|200|400|800|1600|2400|3200|4000|8000|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|30000|
|Number of replicas|2|2|2|2|2|2|2|2|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage |7|7|7|7|7|7|7|7|
|||

### Note 1

Hyperscale is a multi-tiered architecture with caching at multiple levels. Effective IOPS will depend on the workload.

### Next steps

- For DTU resource limits for a single database, see [resource limits for single databases using the DTU-based purchasing model](sql-database-dtu-resource-limits-single-databases.md)
- For vCore resource limits for elastic pools, see [resource limits for elastic pools using the vCore-based purchasing model](sql-database-vcore-resource-limits-elastic-pools.md)
- For DTU resource limits for elastic pools, see [resource limits for elastic pools using the DTU-based purchasing model](sql-database-dtu-resource-limits-elastic-pools.md)
- For resource limits for managed instances, see [managed instance resource limits](sql-database-managed-instance-resource-limits.md).
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
- For information about resource limits on a database server, see [overview of resource limits on a SQL Database server](sql-database-resource-limits-database-server.md) for information about limits at the server and subscription levels.
