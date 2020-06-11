---
title: Single database vCore resource limits 
description: This page describes some common vCore resource limits for a single database in Azure SQL Database. 
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: carlrab
ms.date: 06/10/2020
---
# Resource limits for single databases using the vCore purchasing model
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article provides the detailed resource limits for single databases in Azure SQL Database using the vCore purchasing model.

For DTU purchasing model limits for single databases on a server, see [Overview of resource limits on a server](resource-limits-logical-server.md).

You can set the service tier, compute size (service objective), and storage amount for a single database using the [Azure portal](single-database-manage.md#the-azure-portal), [Transact-SQL](single-database-manage.md#transact-sql-t-sql), [PowerShell](single-database-manage.md#powershell), the [Azure CLI](single-database-manage.md#the-azure-cli), or the [REST API](single-database-manage.md#rest-api).

> [!IMPORTANT]
> For scaling guidance and considerations, see [Scale a single database](single-database-scale.md).

## General purpose - serverless compute - Gen5

The [serverless compute tier](serverless-tier-overview.md) is currently available on Gen5 hardware only.

### Gen5 compute generation (part 1)

|Compute size (service objective)|GP_S_Gen5_1|GP_S_Gen5_2|GP_S_Gen5_4|GP_S_Gen5_6|GP_S_Gen5_8|
|:--- | --: |--: |--: |--: |--: |
|Compute generation|Gen5|Gen5|Gen5|Gen5|Gen5|
|Min-max vCores|0.5-1|0.5-2|0.5-4|0.75-6|1.0-8|
|Min-max memory (GB)|2.02-3|2.05-6|2.10-12|2.25-18|3.00-24|
|Min-max auto-pause delay (minutes)|60-10080|60-10080|60-10080|60-10080|60-10080|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|512|1024|1024|1024|1536|
|Max log size (GB)|154|307|307|307|461|
|TempDB max data size (GB)|32|64|128|192|256|
|Storage type|Remote SSD|Remote SSD|Remote SSD|Remote SSD|Remote SSD|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data IOPS *|320|640|1280|1920|2560|
|Max log rate (MBps)|3.8|7.5|15|22.5|30|
|Max concurrent workers (requests)|75|150|300|450|600|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|
|Number of replicas|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

### Gen5 compute generation (part 2)

|Compute size (service objective)|GP_S_Gen5_10|GP_S_Gen5_12|GP_S_Gen5_14|GP_S_Gen5_16|
|:--- | --: |--: |--: |--: |
|Compute generation|Gen5|Gen5|Gen5|Gen5|
|Min-max vCores|1.25-10|1.50-12|1.75-14|2.00-16|
|Min-max memory (GB)|3.75-30|4.50-36|5.25-42|6.00-48|
|Min-max auto-pause delay (minutes)|60-10080|60-10080|60-10080|60-10080|
|Columnstore support|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|
|Max data size (GB)|1536|3072|3072|3072|
|Max log size (GB)|461|461|461|922|
|TempDB max data size (GB)|320|384|448|512|
|Storage type|Remote SSD|Remote SSD|Remote SSD|Remote SSD|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data IOPS *|3200|3840|4480|5120|
|Max log rate (MBps)|30|30|30|30|
|Max concurrent workers (requests)|750|900|1050|1200|
|Max concurrent sessions|30,000|30,000|30,000|30,000|
|Number of replicas|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

### Gen5 compute generation (part 3)

|Compute size (service objective)|GP_S_Gen5_18|GP_S_Gen5_20|GP_S_Gen5_24|GP_S_Gen5_32|GP_S_Gen5_40|
|:--- | --: |--: |--: |--: |--:|
|Compute generation|Gen5|Gen5|Gen5|Gen5|Gen5|
|Min-max vCores|2.25-18|2.5-20|3-24|4-32|5-40|
|Min-max memory (GB)|6.75-54|7.5-60|9-72|12-96|15-120|
|Min-max auto-pause delay (minutes)|60-10080|60-10080|60-10080|60-10080|60-10080|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|3072|3072|4096|4096|4096|
|Max log size (GB)|922|922|1229|1229|1229|
|TempDB max data size (GB)|576|640|768|1024|1280|
|Storage type|Remote SSD|Remote SSD|Remote SSD|Remote SSD|Remote SSD|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data IOPS *|5760|6400|7680|10240|12800|
|Max log rate (MBps)|30|30|30|30|30|
|Max concurrent workers (requests)|1350|1500|1800|2400|3000|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|
|Number of replicas|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).


## Hyperscale - provisioned compute - Gen4

### Gen4 compute generation (part 1)

|Compute size (service objective)|HS_Gen4_1|HS_Gen4_2|HS_Gen4_3|HS_Gen4_4|HS_Gen4_5|HS_Gen4_6|
|:--- | --: |--: |--: |---: | --: |--: |
|Compute generation|Gen4|Gen4|Gen4|Gen4|Gen4|Gen4|
|vCores|1|2|3|4|5|6|
|Memory (GB)|7|14|21|28|35|42|
|[RBPEX](service-tier-hyperscale.md#compute) Size|3X Memory|3X Memory|3X Memory|3X Memory|3X Memory|3X Memory|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (TB)|100 |100 |100 |100 |100 |100|
|Max log size (TB)|1 |1 |1 |1 |1 |1 |
|TempDB max data size (GB)|32|64|96|128|160|192|
|Storage type| [Note 1](#notes) |[Note 1](#notes)|[Note 1](#notes) |[Note 1](#notes) |[Note 1](#notes) |[Note 1](#notes) |
|Max data IOPS *|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|
|Max log rate (MBps)|100 |100 |100 |100 |100 |100 |
|IO latency (approximate)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|
|Max concurrent workers (requests)|200|400|600|800|1000|1200|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|
|Secondary replicas|0-4|0-4|0-4|0-4|0-4|0-4|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Backup storage retention|7 days|7 days|7 days|7 days|7 days|7 days|
|||

### Gen4 compute generation (part 2)

|Compute size (service objective)|HS_Gen4_7|HS_Gen4_8|HS_Gen4_9|HS_Gen4_10|HS_Gen4_16|HS_Gen4_24|
|:--- | ---: |--: |--: | --: |--: |--: |
|Compute generation|Gen4|Gen4|Gen4|Gen4|Gen4|Gen4|
|vCores|7|8|9|10|16|24|
|Memory (GB)|49|56|63|70|112|159.5|
|[RBPEX](service-tier-hyperscale.md#compute) Size|3X Memory|3X Memory|3X Memory|3X Memory|3X Memory|3X Memory|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (TB)|100 |100 |100 |100 |100 |100 |
|Max log size (TB)|1 |1 |1 |1 |1 |1 |
|TempDB max data size (GB)|224|256|288|320|512|768|
|Storage type| [Note 1](#notes) |[Note 1](#notes) |[Note 1](#notes) |[Note 1](#notes) |[Note 1](#notes) |[Note 1](#notes) |
|Max data IOPS *|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|
|Max log rate (MBps)|100 |100 |100 |100 |100 |100 |
|IO latency (approximate)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|
|Max concurrent workers (requests)|1400|1600|1800|2000|3200|4800|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|
|Secondary replicas|0-4|0-4|0-4|0-4|0-4|0-4|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Backup storage retention|7 days|7 days|7 days|7 days|7 days|7 days|
|||

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

## Hyperscale - provisioned compute - Gen5

### Gen5 compute generation (part 1)

|Compute size (service objective)|HS_Gen5_2|HS_Gen5_4|HS_Gen5_6|HS_Gen_8|HS_Gen5_10|HS_Gen5_12|HS_Gen5_14|
|:--- | --: |--: |--: |--: |---: | --: |--: |--: |
|Compute generation|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|
|vCores|2|4|6|8|10|12|14|
|Memory (GB)|10.4|20.8|31.1|41.5|51.9|62.3|72.7|
|[RBPEX](service-tier-hyperscale.md#compute) Size|3X Memory|3X Memory|3X Memory|3X Memory|3X Memory|3X Memory|3X Memory|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (TB)|100 |100 |100 |100 |100 |100 |100|
|Max log size (TB)|1 |1 |1 |1 |1 |1 |1 |
|TempDB max data size (GB)|64|128|192|256|320|384|448|
|Storage type| [Note 1](#notes) |[Note 1](#notes)|[Note 1](#notes) |[Note 1](#notes) |[Note 1](#notes) |[Note 1](#notes) |[Note 1](#notes) |
|Max data IOPS *|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|
|Max log rate (MBps)|100 |100 |100 |100 |100 |100 |100 |
|IO latency (approximate)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|
|Max concurrent workers (requests)|200|400|600|800|1000|1200|1400|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|30,000|
|Secondary replicas|0-4|0-4|0-4|0-4|0-4|0-4|0-4|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Backup storage retention|7 days|7 days|7 days|7 days|7 days|7 days|7 days|
|||

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

### Gen5 compute generation (part 2)

|Compute size (service objective)|HS_Gen5_16|HS_Gen5_18|HS_Gen5_20|HS_Gen_24|HS_Gen5_32|HS_Gen5_40|HS_Gen5_80|
|:--- | --: |--: |--: |--: |---: |--: |--: |
|Compute generation|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|
|vCores|16|18|20|24|32|40|80|
|Memory (GB)|83|93.4|103.8|124.6|166.1|207.6|415.2|
|[RBPEX](service-tier-hyperscale.md#compute) Size|3X Memory|3X Memory|3X Memory|3X Memory|3X Memory|3X Memory|3X Memory|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (TB)|100 |100 |100 |100 |100 |100 |100 |
|Max log size (TB)|1 |1 |1 |1 |1 |1 |1 |
|TempDB max data size (GB)|512|576|640|768|1024|1280|2560|
|Storage type| [Note 1](#notes) |[Note 1](#notes)|[Note 1](#notes)|[Note 1](#notes) |[Note 1](#notes) |[Note 1](#notes) |[Note 1](#notes) |
|Max data IOPS *|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|[Note 2](#notes)|
|Max log rate (MBps)|100 |100 |100 |100 |100 |100 |100 |
|IO latency (approximate)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|[Note 3](#notes)|
|Max concurrent workers (requests)|1600|1800|2000|2400|3200|4000|8000|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|30,000|
|Secondary replicas|0-4|0-4|0-4|0-4|0-4|0-4|0-4|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Backup storage retention|7 days|7 days|7 days|7 days|7 days|7 days|7 days|
|||

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

#### Notes

**Note 1**: Hyperscale is a multi-tiered architecture with separate compute and storage components: [Hyperscale Service Tier Architecture](service-tier-hyperscale.md#distributed-functions-architecture)

**Note 2**: Hyperscale multi-tiered architecture has caching at multiple levels. Effective IOPS will depend on the workload.

**Note 3**: Latency is 1-2 ms for data in the RBPEX SSD-based cache on compute replicas, which caches most used data pages. Higher latency for data retrieved from page servers.

## General purpose - provisioned compute - Gen4

> [!IMPORTANT]
> New Gen4 databases are no longer supported in the Australia East or Brazil South regions.

### Gen4 compute generation (part 1)

|Compute size (service objective)|GP_Gen4_1|GP_Gen4_2|GP_Gen4_3|GP_Gen4_4|GP_Gen4_5|GP_Gen4_6
|:--- | --: |--: |--: |--: |--: |--: |
|Compute generation|Gen4|Gen4|Gen4|Gen4|Gen4|Gen4|
|vCores|1|2|3|4|5|6|
|Memory (GB)|7|14|21|28|35|42|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|1024|1024|1536|1536|1536|3072|
|Max log size (GB)|307|307|461|461|461|922|
|TempDB max data size (GB)|32|64|96|128|160|192|
|Storage type|Remote SSD|Remote SSD|Remote SSD|Remote SSD|Remote SSD|Remote SSD|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data IOPS *|320|640|960|1280|1600|1920|
|Max log rate (MBps)|3.75|7.5|11.25|15|18.75|22.5|
|Max concurrent workers (requests)|200|400|600|800|1000|1200|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|
|Number of replicas|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

### Gen4 compute generation (part 2)

|Compute size (service objective)|GP_Gen4_7|GP_Gen4_8|GP_Gen4_9|GP_Gen4_10|GP_Gen4_16|GP_Gen4_24
|:--- | --: |--: |--: |--: |--: |--: |
|Compute generation|Gen4|Gen4|Gen4|Gen4|Gen4|Gen4|
|vCores|7|8|9|10|16|24|
|Memory (GB)|49|56|63|70|112|159.5|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|3072|3072|3072|3072|4096|4096|
|Max log size (GB)|922|922|922|922|1229|1229|
|TempDB max data size (GB)|224|256|288|320|512|768|
|Storage type|Remote SSD|Remote SSD|Remote SSD|Remote SSD|Remote SSD|Remote SSD|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)
|Max data IOPS *|2240|2560|2880|3200|5120|7680|
|Max log rate (MBps)|26.3|30|30|30|30|30|
|Max concurrent workers (requests)|1400|1600|1800|2000|3200|4800|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|
|Number of replicas|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

## General purpose - provisioned compute - Gen5

### Gen5 compute generation (part 1)

|Compute size (service objective)|GP_Gen5_2|GP_Gen5_4|GP_Gen5_6|GP_Gen5_8|GP_Gen5_10|GP_Gen5_12|GP_Gen5_14|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|Compute generation|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|
|vCores|2|4|6|8|10|12|14|
|Memory (GB)|10.4|20.8|31.1|41.5|51.9|62.3|72.7|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|1024|1024|1536|1536|1536|3072|3072|
|Max log size (GB)|307|307|461|461|461|922|922|
|TempDB max data size (GB)|64|128|192|256|320|384|384|
|Storage type|Remote SSD|Remote SSD|Remote SSD|Remote SSD|Remote SSD|Remote SSD|Remote SSD|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data IOPS *|640|1280|1920|2560|3200|3840|4480|
|Max log rate (MBps)|7.5|15|22.5|30|30|30|30|
|Max concurrent workers (requests)|200|400|600|800|1000|1200|1400|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|30,000|
|Number of replicas|1|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

### Gen5 compute generation (part 2)

|Compute size (service objective)|GP_Gen5_16|GP_Gen5_18|GP_Gen5_20|GP_Gen5_24|GP_Gen5_32|GP_Gen5_40|GP_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|Compute generation|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|
|vCores|16|18|20|24|32|40|80|
|Memory (GB)|83|93.4|103.8|124.6|166.1|207.6|415.2|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|3072|3072|3072|4096|4096|4096|4096|
|Max log size (GB)|922|922|922|1229|1229|1229|1229|
|TempDB max data size (GB)|512|576|640|768|1024|1280|2560|
|Storage type|Remote SSD|Remote SSD|Remote SSD|Remote SSD|Remote SSD|Remote SSD|Remote SSD|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data IOPS *|5120|5760|6400|7680|10240|12800|12800|
|Max log rate (MBps)|30|30|30|30|30|30|30|
|Max concurrent workers (requests)|1600|1800|2000|2400|3200|4000|8000|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|30,000|
|Number of replicas|1|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

## General purpose - provisioned compute - Fsv2-series

### Fsv2-series compute generation (preview)

|Compute size (service objective)|GP_Fsv2_72|
|:--- | --: |
|Compute generation|Fsv2-series|
|vCores|72|
|Memory (GB)|136.2|
|Columnstore support|Yes|
|In-memory OLTP storage (GB)|N/A|
|Max data size (GB)|4096|
|Max log size (GB)|1024|
|TempDB max data size (GB)|333|
|Storage type|Remote SSD|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|
|Max data IOPS *|12,800|
|Max log rate (MBps)|30|
|Max concurrent workers (requests)|3600|
|Max concurrent logins|3600|
|Max concurrent sessions|30,000|
|Number of replicas|1|
|Multi-AZ|N/A|
|Read Scale-out|N/A|
|Included backup storage|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

## Business critical - provisioned compute - Gen4

> [!IMPORTANT]
> New Gen4 databases are no longer supported in the Australia East or Brazil South regions.

### Gen4 compute generation (part 1)

|Compute size (service objective)|BC_Gen4_1|BC_Gen4_2|BC_Gen4_3|BC_Gen4_4|BC_Gen4_5|BC_Gen4_6|
|:--- | --: |--: |--: |--: |--: |--: |
|Compute generation|Gen4|Gen4|Gen4|Gen4|Gen4|Gen4|
|vCores|1|2|3|4|5|6|
|Memory (GB)|7|14|21|28|35|42|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1|2|3|4|5|6|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (GB)|1024|1024|1024|1024|1024|1024|
|Max log size (GB)|307|307|307|307|307|307|
|TempDB max data size (GB)|32|64|96|128|160|192|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max data IOPS *|4,000|8,000|12,000|16,000|20,000|24,000|
|Max log rate (MBps)|8|16|24|32|40|48|
|Max concurrent workers (requests)|200|400|600|800|1000|1200|
|Max concurrent logins|200|400|600|800|1000|1200|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|
|Number of replicas|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

### Gen4 compute generation (part 2)

|Compute size (service objective)|BC_Gen4_7|BC_Gen4_8|BC_Gen4_9|BC_Gen4_10|BC_Gen4_16|BC_Gen4_24|
|:--- | --: |--: |--: |--: |--: |--: |
|Compute generation|Gen4|Gen4|Gen4|Gen4|Gen4|Gen4|
|vCores|7|8|9|10|16|24|
|Memory (GB)|49|56|63|70|112|159.5|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|7|8|9.5|11|20|36|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (GB)|1024|1024|1024|1024|1024|1024|
|Max log size (GB)|307|307|307|307|307|307|
|TempDB max data size (GB)|224|256|288|320|512|768|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max data IOPS |28,000|32,000|36,000|40,000|64,000|76,800|
|Max log rate (MBps)|56|64|64|64|64|64|
|Max concurrent workers (requests)|1400|1600|1800|2000|3200|4800|
|Max concurrent logins (requests)|1400|1600|1800|2000|3200|4800|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|
|Number of replicas|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

## Business critical - provisioned compute - Gen5

### Gen5 compute generation (part 1)

|Compute size (service objective)|BC_Gen5_2|BC_Gen5_4|BC_Gen5_6|BC_Gen5_8|BC_Gen5_10|BC_Gen5_12|BC_Gen5_14|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|Compute generation|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|
|vCores|2|4|6|8|10|12|14|
|Memory (GB)|10.4|20.8|31.1|41.5|51.9|62.3|72.7|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1.57|3.14|4.71|6.28|8.65|11.02|13.39|
|Max data size (GB)|1024|1024|1536|1536|1536|3072|3072|
|Max log size (GB)|307|307|461|461|461|922|922|
|TempDB max data size (GB)|64|128|192|256|320|384|448|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max data IOPS *|8000|16,000|24,000|32,000|40,000|48,000|56,000|
|Max log rate (MBps)|24|48|72|96|96|96|96|
|Max concurrent workers (requests)|200|400|600|800|1000|1200|1400|
|Max concurrent logins|200|400|600|800|1000|1200|1400|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|30,000|
|Number of replicas|4|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

### Gen5 compute generation (part 2)

|Compute size (service objective)|BC_Gen5_16|BC_Gen5_18|BC_Gen5_20|BC_Gen5_24|BC_Gen5_32|BC_Gen5_40|BC_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|Compute generation|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|
|vCores|16|18|20|24|32|40|80|
|Memory (GB)|83|93.4|103.8|124.6|166.1|207.6|415.2|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|15.77|18.14|20.51|25.25|37.94|52.23|131.64|
|Max data size (GB)|3072|3072|3072|4096|4096|4096|4096|
|Max log size (GB)|922|922|922|1229|1229|1229|1229|
|TempDB max data size (GB)|512|576|640|768|1024|1280|2560|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max data IOPS *|64,000|72,000|80,000|96,000|128,000|160,000|204,800|
|Max log rate (MBps)|96|96|96|96|96|96|96|
|Max concurrent workers (requests)|1600|1800|2000|2400|3200|4000|8000|
|Max concurrent logins|1600|1800|2000|2400|3200|4000|8000|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|30,000|
|Number of replicas|4|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

## Business critical - provisioned compute - M-series

### M-series compute generation (preview)

|Compute size (service objective)|BC_M_128|
|:--- | --: |
|Compute generation|M-series|
|vCores|128|
|Memory (GB)|3767.1|
|Columnstore support|Yes|
|In-memory OLTP storage (GB)|1768|
|Max data size (GB)|4096|
|Max log size (GB)|2048|
|TempDB max data size (GB)|4096|
|Storage type|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|
|Max data IOPS *|160,000|
|Max log rate (MBps)|264|
|Max concurrent workers (requests)|12,800|
|Max concurrent logins|12,800|
|Max concurrent sessions|30000|
|Number of replicas|4|
|Multi-AZ|Yes|
|Read Scale-out|Yes|
|Included backup storage|1X DB size|

\* The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](file-space-manage.md).

## Next steps

- For DTU resource limits for a single database, see [resource limits for single databases using the DTU purchasing model](resource-limits-dtu-single-databases.md)
- For vCore resource limits for elastic pools, see [resource limits for elastic pools using the vCore purchasing model](resource-limits-vcore-elastic-pools.md)
- For DTU resource limits for elastic pools, see [resource limits for elastic pools using the DTU purchasing model](resource-limits-dtu-elastic-pools.md)
- For resource limits for SQL Managed Instance, see [SQL Managed Instance resource limits](../managed-instance/resource-limits.md).
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).
- For information about resource limits on a server, see [overview of resource limits on a server](resource-limits-logical-server.md) for information about limits at the server and subscription levels.
