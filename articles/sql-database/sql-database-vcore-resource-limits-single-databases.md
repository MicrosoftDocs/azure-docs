---
title: Azure SQL Database vCore-based resource limits - single database | Microsoft Docs
description: This page describes some common vCore-based resource limits for a single database in Azure SQL Database.
services: sql-database
author: CarlRabeler
manager: craigg
ms.service: sql-database
ms.custom: DBs & servers
ms.topic: conceptual
ms.date: 09/23/2018
ms.author: carlrab

---
# Azure SQL Database vCore-based purchasing model limits for a single database

This article provides the detailed resource limits for Azure SQL Database single databases using the vCore-based purchasing model.

For DTU-based purchasing model limits, see [SQL Database DTU-based resource limits](sql-database-dtu-resource-limits.md).

> [!IMPORTANT]
> Under some circumstances, you may need to shrink a database to reclaim unused space. For more information, see [Manage file space in Azure SQL Database](sql-database-file-space-management.md).


## Single database: Storage sizes and performance levels

For single databases, the following tables show the resources available for a single database at each service tier and performance level. You can set the service tier, performance level, and storage amount for a single database using the [Azure portal](sql-database-single-databases-manage.md#azure-portal-manage-logical-servers-and-databases), [Transact-SQL](sql-database-single-databases-manage.md#transact-sql-manage-logical-servers-and-databases), [PowerShell](sql-database-single-databases-manage.md#powershell-manage-logical-servers-and-databases), the [Azure CLI](sql-database-single-databases-manage.md#azure-cli-manage-logical-servers-and-databases), or the [REST API](sql-database-single-databases-manage.md#rest-api-manage-logical-servers-and-databases).

### General Purpose service tier

#### Generation 4 compute platform
|Performance level|GP_Gen4_1|GP_Gen4_2|GP_Gen4_4|GP_Gen4_8|GP_Gen4_16|GP_Gen4_24
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|1|2|4|8|16|24|
|Memory (GB)|7|14|28|56|112|168|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data size (GB)|1024|1024|1536|3072|4096|4096|
|Max log size (GB)|307|307|461|922|1229|1229|
|TempDB size (GB)|32|64|128|256|384|384|
|Target IOPS (64 KB)|500|1000|2000|4000|7000|7000|
|Max concurrent workers (requests)|200|400|800|1600|3200|4800|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Number of replicas|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|000
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

#### Generation 5 compute platform
|Performance level|GP_Gen5_2|GP_Gen5_4|GP_Gen5_8|GP_Gen5_16|GP_Gen5_24|GP_Gen5_32|GP_Gen5_40| GP_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |--: |--: |
|H/W generation|5|5|5|5|5|5|5|
|vCores|2|4|8|16|24|32|40|80|
|Memory (GB)|11|22|44|88|132|176|220|440|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Storage type|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|Premium (Remote) Storage|
|IO latency (approximate)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|5-7 ms (write)<br>5-10 ms (read)|
|Max data size (GB)|1024|1024|1536|3072|4096|4096|4096|4096|
|Max log size (GB)|307|307|461|614|1229|1229|1229|1229|
|TempDB size (GB)|64|128|256|384|384|384|384|384|
|Target IOPS (64 KB)|500|1000|2000|4000|6000|7000|7000|7000|
|Max concurrent workers (requests)|200|400|800|1600|2400|3200|4000|8000|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|30000|
|Number of replicas|1|1|1|1|1|1|1|1|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

### Business Critical service tier

#### Generation 4 compute platform
|Performance level|BC_Gen4_1|BC_Gen4_2|BC_Gen4_4|BC_Gen4_8|BC_Gen4_16|BC_Gen4_24|
|:--- | --: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|1|2|4|8|16|24|
|Memory (GB)|7|14|28|56|112|168|
|Columnstore support|N/A|N/A|N/A|N/A|N/A|N/A|
|In-memory OLTP storage (GB)|1|2|4|8|20|36|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (GB)|1024|1024|1024|1024|1024|1024|
|Max log size (GB)|307|307|307|307|307|307|
|TempDB size (GB)|32|64|128|256|384|384|
|Target IOPS (64 KB)|5000|10000|20000|40000|80000|120000|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max concurrent workers (requests)|200|400|800|1600|3200|4800|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Number of replicas|3|3|3|3|3|3|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

#### Generation 5 compute platform
|Performance level|BC_Gen5_2|BC_Gen5_4|BC_Gen5_8|BC_Gen5_16|BC_Gen5_24|BC_Gen5_32|BC_Gen5_40|BC_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |--: |--: |--: |--: |--: |--: |
|H/W generation|5|5|5|5|5|5|5|5|
|vCores|2|4|8|16|24|32|40|80|
|Memory (GB)|11|22|44|88|132|176|220|440|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|1.571|3.142|6.284|15.768|25.252|37.936|52.22|131.64|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|IO latency (approximate)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|1-2 ms (write)<br>1-2 ms (read)|
|Max data size (GB)|1024|1024|1024|1024|2048|4096|4096|4096|
|Max log size (GB)|307|307|307|307|614|1229|1229|1229|
|TempDB size (GB)|64|128|256|384|384|384|384|384|
|Target IOPS (64 KB)|5000|10000|20000|40000|60000|80000|100000|200000
|Max concurrent workers (requests)|200|400|800|1600|2400|3200|4000|8000|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|30000|
|Number of replicas|3|3|3|3|3|3|3|3|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Included backup storage|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|1X DB size|
|||

### Hyperscale service tier

#### Generation 4 compute platform
|Performance level|HS_Gen4_1|HS_Gen4_2|HS_Gen4_4|HS_Gen4_8|HS_Gen4_16|HS_Gen4_24|
|:--- | --: |--: |--: |--: |--: |--: |--: |
|H/W generation|4|4|4|4|4|4|
|vCores|1|2|4|8|16|24|
|Memory (GB)|7|14|28|56|112|168|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (TB)|100 TB|100 TB|100 TB|100 TB|100 TB|100 TB|
|Max log size (GB)|Infinite|Infinite|Infinite|Infinite|Infinite|Infinite|
|TempDB size (GB)|32|64|128|256|384|384|
|Target IOPS (64 KB)|TBD|TBD|TBD|TBD|TBD|TBD|
|IO latency (approximate)|TBD|TBD|TBD|TBD|TBD|TBD|
|Max concurrent workers (requests)|200|400|800|1600|3200|4800|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|
|Number of replicas|2|2|2|2|2|2|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage|7|7|7|7|7|7|
|||
### Generation 5 compute platform
|Performance level|HS_Gen5_2|HS_Gen5_4|HS_Gen5_8|HS_Gen5_16|HS_Gen5_24|HS_Gen5_32|HS_Gen5_40|HS_Gen5_80|
|:--- | --: |--: |--: |--: |---: | --: |--: |--: |--: |--: |--: |--: |--: |
|H/W generation|5|5|5|5|5|5|5|5|
|vCores|2|4|8|16|24|32|40|80|
|Memory (GB)|11|22|44|88|132|176|220|440|
|Columnstore support|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|In-memory OLTP storage (GB)|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Storage type|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|Local SSD|
|Max data size (TB)|100 TB|100 TB|100 TB|100 TB|100 TB|100 TB|100 TB|100 TB|
|Max log size (GB)|Infinite|Infinite|Infinite|Infinite|Infinite|Infinite|Infinite|Infinite|
|TempDB size (GB)|64|128|256|384|384|384|384|384|
|Target IOPS (64 KB)|TBD|TBD|TBD|TBD|TBD|TBD|TBD|TBD|
|IO latency (approximate)|TBD|TBD|TBD|TBD|TBD|TBD|TBD|TBD|
|Max concurrent workers (requests)|200|400|800|1600|2400|3200|4000|8000|
|Max allowed sessions|30000|30000|30000|30000|30000|30000|30000|30000|
|Number of replicas|2|2|2|2|2|2|2|2|
|Multi-AZ|N/A|N/A|N/A|N/A|N/A|N/A|N/A|N/A|
|Read Scale-out|Yes|Yes|Yes|Yes|Yes|Yes|Yes|Yes|
|Included backup storage (preview limit)|7|7|7|7|7|7|7|7|
|||

## Next steps

- See [SQL Database FAQ](sql-database-faq.md) for answers to frequently asked questions.
- For information about general Azure limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).
