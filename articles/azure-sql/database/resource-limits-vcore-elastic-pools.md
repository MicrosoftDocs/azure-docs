---
title: Elastic pool vCore resource limits
description: This page describes some common vCore resource limits for elastic pools in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: elastic-pools
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: oslake
ms.author: moslake
ms.reviewer: carlrab, sstein
ms.date: 06/10/2020
---
# Resource limits for elastic pools using the vCore purchasing model
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article provides the detailed resource limits for Azure SQL Database elastic pools and pooled databases using the vCore purchasing model.

For DTU purchasing model limits, see [SQL Database DTU resource limits - elastic pools](resource-limits-dtu-elastic-pools.md).

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](file-space-manage.md).

You can set the service tier, compute size (service objective), and storage amount using the [Azure portal](elastic-pool-manage.md#azure-portal), [PowerShell](elastic-pool-manage.md#powershell), the [Azure CLI](elastic-pool-manage.md#azure-cli), or the [REST API](elastic-pool-manage.md#rest-api).

> [!IMPORTANT]
> For scaling guidance and considerations, see [Scale an elastic pool](elastic-pool-scale.md).

## General purpose - provisioned compute - Gen4

> [!IMPORTANT]
> New Gen4 databases are no longer supported in the Australia East or Brazil South regions.

### General purpose service tier: Generation 4 compute platform (part 1)

|Compute size (service objective)|GP_Gen4_1|GP_Gen4_2|GP_Gen4_3|GP_Gen4_4|GP_Gen4_5|GP_Gen4_6
|:--- | --: |--: |--: |--: |--: |--: |
|Compute generation|Gen4|Gen4|Gen4|Gen4|Gen4|Gen4|
|vCores|1|2|3|4|5|6|
|Memory (GB)|7|14|21|28|35|42|
|Max number DBs per pool <sup>1</sup>|100|200|500|500|500|500|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|512|756|1536|1536|1536|2048|
|Max log size|154|227|461|461|461|614|
|TempDB max data size (GB)|32|64|96|128|160|192|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data IOPS per pool <sup>2</sup> |400|800|1200|1600|2000|2400|
|Max log rate per pool (MBps)|4.7|9.4|14.1|18.8|23.4|28.1|
|Max concurrent workers per pool (requests) <sup>3</sup> |210|420|630|840|1050|1260|
|Max concurrent logins per pool <sup>3</sup> |210|420|630|840|1050|1260|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1|0, 0.25, 0.5, 1, 2|0, 0.25, 0.5, 1...3|0, 0.25, 0.5, 1...4|0, 0.25, 0.5, 1...5|0, 0.25, 0.5, 1...6|
|Number of replicas|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### General purpose service tier: Generation 4 compute platform (part 2)

|Compute size (service objective)|GP_Gen4_7|GP_Gen4_8|GP_Gen4_9|GP_Gen4_10|GP_Gen4_16|GP_Gen4_24|
|:--- | --: |--: |--: |--: |--: |--: |
|Compute generation|Gen4|Gen4|Gen4|Gen4|Gen4|Gen4|
|vCores|7|8|9|10|16|24|
|Memory (GB)|49|56|63|70|112|159.5|
|Max number DBs per pool <sup>1</sup>|500|500|500|500|500|500|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|2048|2048|2048|2048|3584|4096|
|Max log size (GB)|614|614|614|614|1075|1229|
|TempDB max data size (GB)|224|256|288|320|512|768|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data IOPS per pool <sup>2</sup>|2800|3200|3600|4000|6400|9600|
|Max log rate per pool (MBps)|32.8|37.5|37.5|37.5|37.5|37.5|
|Max concurrent workers per pool (requests) <sup>3</sup>|1470|1680|1890|2100|3360|5040|
|Max concurrent logins pool (requests) <sup>3</sup>|1470|1680|1890|2100|3360|5040|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1...7|0, 0.25, 0.5, 1...8|0, 0.25, 0.5, 1...9|0, 0.25, 0.5, 1...10|0, 0.25, 0.5, 1...10, 16|0, 0.25, 0.5, 1...10, 16, 24|
|Number of replicas|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).    

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

## General purpose - provisioned compute - Gen5

### General purpose service tier: Generation 5 compute platform (part 1)

|Compute size (service objective)|GP_Gen5_2|GP_Gen5_4|GP_Gen5_6|GP_Gen5_8|GP_Gen5_10|GP_Gen5_12|GP_Gen5_14|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|Compute generation|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|
|vCores|2|4|6|8|10|12|14|
|Memory (GB)|10.4|20.8|31.1|41.5|51.9|62.3|72.7|
|Max number DBs per pool <sup>1</sup>|100|200|500|500|500|500|500|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|512|756|1536|1536|1536|2048|2048|
|Max log size (GB)|154|227|461|461|461|614|614|
|TempDB max data size (GB)|64|128|192|256|320|384|448|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data IOPS per pool <sup>2</sup>|800|1600|2400|3200|4000|4800|5600|
|Max log rate per pool (MBps)|9.4|18.8|28.1|37.5|37.5|37.5|37.5|
|Max concurrent workers per pool (requests) <sup>3</sup>|210|420|630|840|1050|1260|1470|
|Max concurrent logins per pool (requests) <sup>3</sup>|210|420|630|840|1050|1260|1470|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|30,000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1, 2|0, 0.25, 0.5, 1...4|0, 0.25, 0.5, 1...6|0, 0.25, 0.5, 1...8|0, 0.25, 0.5, 1...10|0, 0.25, 0.5, 1...12|0, 0.25, 0.5, 1...14|
|Number of replicas|1|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### General purpose service tier: Generation 5 compute platform (part 2)

|Compute size (service objective)|GP_Gen5_16|GP_Gen5_18|GP_Gen5_20|GP_Gen5_24|GP_Gen5_32|GP_Gen5_40|GP_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|Compute generation|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|
|vCores|16|18|20|24|32|40|80|
|Memory (GB)|83|93.4|103.8|124.6|166.1|207.6|415.2|
|Max number DBs per pool <sup>1</sup>|500|500|500|500|500|500|500|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Max data size (GB)|2048|3072|3072|3072|4096|4096|4096|
|Max log size (GB)|614|922|922|922|1229|1229|1229|
|TempDB max data size (GB)|512|576|640|768|1024|1280|2560|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data IOPS per pool <sup>2</sup> |6,400|7,200|8,000|9,600|12,800|16,000|16,000|
|Max log rate per pool (MBps)|37.5|37.5|37.5|37.5|37.5|37.5|37.5|
|Max concurrent workers per pool (requests) <sup>3</sup>|1680|1890|2100|2520|3360|4200|8400|
|Max concurrent logins per pool (requests) <sup>3</sup>|1680|1890|2100|2520|3360|4200|8400|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|30,000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1...16|0, 0.25, 0.5, 1...18|0, 0.25, 0.5, 1...20|0, 0.25, 0.5, 1...20, 24|0, 0.25, 0.5, 1...20, 24, 32|0, 0.25, 0.5, 1...16, 24, 32, 40|0, 0.25, 0.5, 1...16, 24, 32, 40, 80|
|Number of replicas|1|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

## General purpose - provisioned compute - Fsv2-series

### Fsv2-series compute generation (preview)

|Compute size (service objective)|GP_Fsv2_72|
|:--- | --: |
|Compute generation|Fsv2-series|
|vCores|72|
|Memory (GB)|136.2|
|Max number DBs per pool <sup>1</sup>|500|
|Columnstore support|Yes|
|In-memory OLTP storage (GB)|N/A|
|Max data size (GB)|4096|
|Max log size (GB)|1024|
|TempDB max data size (GB)|333|
|Storage type|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|
|Max data IOPS per pool <sup>2</sup>|16,000|
|Max log rate per pool (MBps)|37.5|
|Max concurrent workers per pool (requests) <sup>3</sup>|3780|
|Max concurrent logins per pool (requests) <sup>3</sup>|3780|
|Max concurrent sessions|30,000|
|Min/max elastic pool vCore choices per database|0-72|
|Number of replicas|1|
|Multi-AZ|N/A|
|Read Scale-out|N/A|
|Included backup storage|1X DB size|

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

## Business critical - provisioned compute - Gen4

> [!IMPORTANT]
> New Gen4 databases are no longer supported in the Australia East or Brazil South regions.

### Business critical service tier: Generation 4 compute platform (part 1)

|Compute size (service objective)|BC_Gen4_2|BC_Gen4_3|BC_Gen4_4|BC_Gen4_5|BC_Gen4_6|
|:--- | --: |--: |--: |--: |--: |--: |
|Compute generation|Gen4|Gen4|Gen4|Gen4|Gen4|
|vCores|2|3|4|5|6|
|Memory (GB)|14|21|28|35|42|
|Max number DBs per pool <sup>1</sup>|50|100|100|100|100|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|2|3|4|5|6|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (GB)|1024|1024|1024|1024|1024|
|Max log size (GB)|307|307|307|307|307|
|TempDB max data size (GB)|64|96|128|160|192|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max data IOPS per pool <sup>2</sup>|9,000|13,500|18,000|22,500|27,000|
|Max log rate per pool (MBps)|20|30|40|50|60|
|Max concurrent workers per pool (requests) <sup>3</sup>|420|630|840|1050|1260|
|Max concurrent logins per pool (requests) <sup>3</sup>|420|630|840|1050|1260|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1, 2|0, 0.25, 0.5, 1...3|0, 0.25, 0.5, 1...4|0, 0.25, 0.5, 1...5|0, 0.25, 0.5, 1...6|
|Number of replicas|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### Business critical service tier: Generation 4 compute platform (part 2)

|Compute size (service objective)|BC_Gen4_7|BC_Gen4_8|BC_Gen4_9|BC_Gen4_10|BC_Gen4_16|BC_Gen4_24|
|:--- | --: |--: |--: |--: |--: |--: |
|Compute generation|Gen4|Gen4|Gen4|Gen4|Gen4|Gen4|
|vCores|7|8|9|10|16|24|
|Memory (GB)|49|56|63|70|112|159.5|
|Max number DBs per pool <sup>1</sup>|100|100|100|100|100|100|
|Columnstore support|N/A|N/A|N/A|N/A|N/A|N/A|
|In-memory OLTP storage (GB)|7|8|9.5|11|20|36|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (GB)|1024|1024|1024|1024|1024|1024|
|Max log size (GB)|307|307|307|307|307|307|
|TempDB max data size (GB)|224|256|288|320|512|768|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max data IOPS per pool <sup>2</sup>|31,500|36,000|40,500|45,000|72,000|96,000|
|Max log rate per pool (MBps)|70|80|80|80|80|80|
|Max concurrent workers per pool (requests) <sup>3</sup>|1470|1680|1890|2100|3360|5040|
|Max concurrent logins per pool (requests) <sup>3</sup>|1470|1680|1890|2100|3360|5040|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1...7|0, 0.25, 0.5, 1...8|0, 0.25, 0.5, 1...9|0, 0.25, 0.5, 1...10|0, 0.25, 0.5, 1...10, 16|0, 0.25, 0.5, 1...10, 16, 24|
|Number of replicas|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

## Business critical - provisioned compute - Gen5

### Business critical service tier: Generation 5 compute platform (part 1)

|Compute size (service objective)|BC_Gen5_4|BC_Gen5_6|BC_Gen5_8|BC_Gen5_10|BC_Gen5_12|BC_Gen5_14|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|Compute generation|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|
|vCores|4|6|8|10|12|14|
|Memory (GB)|20.8|31.1|41.5|51.9|62.3|72.7|
|Max number DBs per pool <sup>1</sup>|50|100|100|100|100|100|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|3.14|4.71|6.28|8.65|11.02|13.39|
|Max data size (GB)|1024|1536|1536|1536|3072|3072|
|Max log size (GB)|307|307|461|461|922|922|
|TempDB max data size (GB)|128|192|256|320|384|448|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max data IOPS per pool <sup>2</sup>|18,000|27,000|36,000|45,000|54,000|63,000|
|Max log rate per pool (MBps)|60|90|120|120|120|120|
|Max concurrent workers per pool (requests) <sup>3</sup>|420|630|840|1050|1260|1470|
|Max concurrent logins per pool (requests) <sup>3</sup>|420|630|840|1050|1260|1470|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1...4|0, 0.25, 0.5, 1...6|0, 0.25, 0.5, 1...8|0, 0.25, 0.5, 1...10|0, 0.25, 0.5, 1...12|0, 0.25, 0.5, 1...14|
|Number of replicas|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

### Business critical service tier: Generation 5 compute platform (part 2)

|Compute size (service objective)|BC_Gen5_16|BC_Gen5_18|BC_Gen5_20|BC_Gen5_24|BC_Gen5_32|BC_Gen5_40|BC_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |
|Compute generation|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|Gen5|
|vCores|16|18|20|24|32|40|80|
|Memory (GB)|83|93.4|103.8|124.6|166.1|207.6|415.2|
|Max number DBs per pool <sup>1</sup>|100|100|100|100|100|100|100|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|15.77|18.14|20.51|25.25|37.94|52.23|131.68|
|Max data size (GB)|3072|3072|3072|4096|4096|4096|4096|
|Max log size (GB)|922|922|922|1229|1229|1229|1229|
|TempDB max data size (GB)|512|576|640|768|1024|1280|2560|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max data IOPS per pool <sup>2</sup>|72,000|81,000|90,000|108,000|144,000|180,000|256,000|
|Max log rate per pool (MBps)|120|120|120|120|120|120|120|
|Max concurrent workers per pool (requests) <sup>3</sup>|1680|1890|2100|2520|3360|4200|8400|
|Max concurrent logins per pool (requests) <sup>3</sup>|1680|1890|2100|2520|3360|4200|8400|
|Max concurrent sessions|30,000|30,000|30,000|30,000|30,000|30,000|30,000|
|Min/max elastic pool vCore choices per database|0, 0.25, 0.5, 1...16|0, 0.25, 0.5, 1...18|0, 0.25, 0.5, 1...20|0, 0.25, 0.5, 1...20, 24|0, 0.25, 0.5, 1...20, 24, 32|0, 0.25, 0.5, 1...20, 24, 32, 40|0, 0.25, 0.5, 1...20, 24, 32, 40, 80|
|Number of replicas|4|4|4|4|4|4|4|
|Multi-AZ|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

## Business critical - provisioned compute - M-series

### M-series compute generation (preview)

|Compute size (service objective)|BC_M_128|
|:--- | --: |
|Compute generation|M-series|
|vCores|128|
|Memory (GB)|3767.1|
|Max number DBs per pool <sup>1</sup>|100|
|Columnstore support|Yes|
|In-memory OLTP storage (GB)|1768|
|Max data size (GB)|4096|
|Max log size (GB)|2048|
|TempDB max data size (GB)|4096|
|Storage type|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|
|Max data IOPS per pool <sup>2</sup>|200,000|
|Max log rate per pool (MBps)|333|
|Max concurrent workers per pool (requests) <sup>3</sup>|13,440|
|Max concurrent logins per pool (requests) <sup>3</sup>|13,440|
|Max concurrent sessions|30,000|
|Min/max elastic pool vCore choices per database|0-128|
|Number of replicas|4|
|Multi-AZ|Yes|
|Read Scale-out|Yes|
|Included backup storage|1X DB size|

<sup>1</sup> See [Resource management in dense elastic pools](elastic-pool-resource-management.md) for additional considerations.

<sup>2</sup> The maximum value for IO sizes ranging between 8 KB and 64 KB. Actual IOPS are workload-dependent. For details, see [Data IO Governance](resource-limits-logical-server.md#resource-governance).

<sup>3</sup> For the max concurrent workers (requests) for any individual database, see [Single database resource limits](resource-limits-vcore-single-databases.md). For example, if the elastic pool is using Gen5 and the max vCore per database is set at 2, then the max concurrent workers value is 200.  If max vCore per database is set to 0.5, then the max concurrent workers value is 50 since on Gen5 there are a max of 100 concurrent workers per vCore. For other max vCore settings per database that are less 1 vCore or less, the number of max concurrent workers is similarly rescaled.

If all vCores of an elastic pool are busy, then each database in the pool receives an equal amount of compute resources to process queries. Azure SQL Database provides resource sharing fairness between databases by ensuring equal slices of compute time. Elastic pool resource sharing fairness is in addition to any amount of resource otherwise guaranteed to each database when the vCore min per database is set to a non-zero value.

## Database properties for pooled databases

The following table describes the properties for pooled databases.

> [!NOTE]
> The resource limits of individual databases in elastic pools are generally the same as for single databases outside of pools that has the same compute size (service objective). For example, the max concurrent workers for an GP_Gen4_1 database is 200 workers. So, the max concurrent workers for a database in a GP_Gen4_1 pool is also 200 workers. Note, the total number of concurrent workers in GP_Gen4_1 pool is 210.

| Property | Description |
|:--- |:--- |
| Max vCores per database |The maximum number of vCores that any database in the pool may use, if available based on utilization by other databases in the pool. Max vCores per database is not a resource guarantee for a database. This setting is a global setting that applies to all databases in the pool. Set max vCores per database high enough to handle peaks in database utilization. Some degree of over-committing is expected since the pool generally assumes hot and cold usage patterns for databases where all databases are not simultaneously peaking.|
| Min vCores per database |The minimum number of vCores that any database in the pool is guaranteed. This setting is a global setting that applies to all databases in the pool. The min vCores per database may be set to 0, and is also the default value. This property is set to anywhere between 0 and the average vCores utilization per database. The product of the number of databases in the pool and the min vCores per database cannot exceed the vCores per pool.|
| Max storage per database |The maximum database size set by the user for a database in a pool. Pooled databases share allocated pool storage, so the size a database can reach is limited to the smaller of remaining pool storage and database size. Max database size refers to the maximum size of the data files and does not include the space used by log files. |
|||

## Next steps

- For vCore resource limits for a single database, see [resource limits for single databases using the vCore purchasing model](resource-limits-vcore-single-databases.md)
- For DTU resource limits for a single database, see [resource limits for single databases using the DTU purchasing model](resource-limits-dtu-single-databases.md)
- For DTU resource limits for elastic pools, see [resource limits for elastic pools using the DTU purchasing model](resource-limits-dtu-elastic-pools.md)
- For resource limits for managed instances, see [managed instance resource limits](../managed-instance/resource-limits.md).
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).
- For information about resource limits on a logical SQL server, see [overview of resource limits on a logical SQL server](resource-limits-logical-server.md) for information about limits at the server and subscription levels.
