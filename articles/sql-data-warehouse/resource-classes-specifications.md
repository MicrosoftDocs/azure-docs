---
title: Resource class specifications - Azure SQL Data Warehouse | Microsoft Docs
description: View memory and concurrency allocations for resource classes in Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: jrowlandjones
manager: jhubbard
editor: ''

ms.assetid: ef170f39-ae24-4b04-af76-53bb4c4d16d3
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: performance
ms.date: 09/29/2017
ms.author: jrj;barbkess

---

# Resource classes specifications
View memory and concurrency allocations for resource classes in Azure SQL Data Warehouse.

## Memory and concurrency specifications for resource classes
These tables show the memory and concurrency slot specifications for resource classes in Azure SQL Data Warehouse. 


### Optimized for Compute - memory per distribution (MB)

The following table shows the memory allocated to each distribution by cDWU and static resource class. 

| Service Level | staticrc10 | staticrc20 | staticrc30 | staticrc40 | staticrc50 | staticrc60 | staticrc70 | staticrc80 |
|:-------------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|
| DW1000c       | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 11,200     | 11,200     |
| DW1500c       | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 16,800     | 16,800     |
| DW2000c       | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 22,400     |
| DW2500c       | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 28,000     |
| DW3000c       | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 33,600     |
| DW5000c       | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 35,840     |
| DW6000c       | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 35,840     |
| DW7500c       | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 35,840     |
| DW10000c      | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 35,840     |

This table shows the memory allocations in MB for the dynamic resource classes.

| Service Level | smallrc | mediumrc | largerc | xlargerc |
|:-------------:|:-------:|:--------:|:-------:|:--------:|
| DW1000c       | 280     | 2,240    | 4,480   | 8,960    |
| DW1500c       | 280     | 2,240    | 4,480   | 8,960    |
| DW2000c  | 560     | 4,480    | 8,960   | 17,920   |
| DW2500c  | 560     | 4,480    | 8,960   | 17,920   |
| DW3000c  | 1,120   | 4,480    | 8,960   | 17,920   |
| DW5000c  | 1,120   | 8,960    | 17,920  | 35,840   |
| DW6000c  | 1,120   | 8,960    | 17,920  | 35,840   |
| DW7500c  | 2,240   | 17,920   | 35,840  | 71,680   |
| DW10000c | 2,240   | 17,920   | 35,840  | 71,680   |
| DW15000c | 4,480   | 17,920   | 35,840  | 71,680   |
| DW30000c | 8,960   | 17,920   | 35,840  | 71,680   |

Since there are 60 distributions, queries are actually running system-wide with 60 times the memory shown in the preceding tables.

### Memory per data warehouse (GB)

This table shows the system-wide memory allocations in GB for queries in the dynamic resource classes.

| cDWU     | smallrc | mediumrc | largerc | xlargerc |
|:-------- |:-------:|:--------:|:-------:|:--------:|
| DW1000c  | 16      | 131      | 263     | 525      |
| DW1500c  | 16      | 131      | 263     | 525      |
| DW2000c  | 33      | 263      | 525     | 1,050    |
| DW2500c  | 33      | 263      | 525     | 1,050    |
| DW3000c  | 66      | 263      | 525     | 1,050    |
| DW5000c  | 66      | 525      | 1,050   | 2,100    |
| DW6000c  | 66      | 525      | 1,050   | 2,100    |
| DW7500c  | 131     | 1,050    | 2,100   | 4,200    |
| DW10000c | 131     | 1,050    | 2,100   | 4,200    |
| DW15000c | 263     | 1,050    | 2,100   | 4,200    |
| DW30000c | 525     | 1,050    | 2,100   | 4,200    |


From this table of system-wide memory allocations, you can see that a query running on a DW2000c in the xlargerc resource class is allocated a total of 1,050 GB of memory (17,920 MB * 60 distributions / 1,024 to convert to GB) over the entirety of your SQL Data Warehouse. One query has over a TB of memory.

The same calculation applies to static resource classes.
 

## Optimized for Compute - concurrency slots
The following table reiterates all of the previous concepts in a single view that shows the number of concurrency slots available by DWU and the slots consumed by each resource class.  


| cDWU | Maximum concurrent queries | Concurrency slots allocated | Slots used by smallrc | Slots used by mediumrc | Slots used by largerc | Slots used by xlargerc |
|:--- |:---:|:---:|:---:|:---:|:---:|:---:|
| DW1000c  | 24  |   | 1 |  4 |   8 |  16 |
| DW1500c  | 32  |   | 1 |  8 |  16 |  32 |
| DW2000c  | 32  |   | 1 |  8 |  16 |  32 |
| DW2500c  | 32  |   | 1 |  8 |  16 |  32 |
| DW3000c  | 36  |   | 2 | 16 |  32 |  64 |
| DW5000c  | 60  |   | 2 | 16 |  32 |  64 |
| DW6000c  | 36  |   | 4 | 32 |  64 | 128 |
| DW7500c  | 45  |   | 4 | 32 |  64 | 128 |
| DW10000c | 60  |   | 4 | 32 |  64 | 128 |
| DW15000c | 45  |   | 8 | 64 | 128 | 256 |
| DW30000c | 45  |   | 8 | 64 | 128 | 256 |

 
| DWU | Maximum concurrent queries | Concurrency slots allocated |staticrc10 | staticrc20 | staticrc30 | staticrc40 | staticrc50 | staticrc60 | staticrc70 | staticrc80 |
|:--- |:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| DW1000c  | 24 | | | | | | | | | |
| DW1500c  | 32 | | | | | | | | | |
| DW2000c  | 32 | | | | | | | | | |
| DW2500c  | 32 | | | | | | | | | |
| DW3000c  | 36 | | | | | | | | | |
| DW5000c  | 60 | | | | | | | | | |
| DW6000c  | 36 | | | | | | | | | |
| DW7500c  | 45 | | | | | | | | | |
| DW10000c | 60 | | | | | | | | | |
| DW15000c | 45 | | | | | | | | | |
| DW30000c | 45 | | | | | | | | | |


From these tables, you can see that SQL Data Warehouse running as DW2000c allocates a maximum of 32 concurrent queries and a total of 40 concurrency slots. If all users are running in smallrc, 32 concurrent queries would be allowed because each query would consume 1 concurrency slot. If all users on a DW1000 were running in mediumrc, each query would be allocated 800 MB per distribution for a total memory allocation of 47 GB per query, and concurrency would be limited to 5 users (40 concurrency slots / 8 slots per mediumrc user).

### Optimized for Elasticity - memory per distribution (MB)

The following table shows the memory allocated to each distribution by cDWU and static resource class. 

| cDWU      | staticrc10 | staticrc20 | staticrc30 | staticrc40 | staticrc50 | staticrc60 | staticrc70 | staticrc80 |
|:-------- |:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|
| DW1000c  | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 11,200     | 11,200     |
| DW1500c  | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 16,800     | 16,800     |
| DW2000c  | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 22,400     |
| DW2500c  | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 28,000     |
| DW3000c  | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 33,600     |
| DW5000c  | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 35,840     |
| DW6000c  | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 35,840     |
| DW7500c  | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 35,840     |
| DW10000c | 280        | 560        | 1,120      | 2,240      | 4,480      | 8,960      | 17,920     | 35,840     |


This table shows the memory allocations in MB for the dynamic resource classes.

| cDWU     | smallrc | mediumrc | largerc | xlargerc |
|:-------- |:-------:|:--------:|:-------:|:--------:|
| DW1000c  | 280     | 2,240    | 4,480   | 8,960    |
| DW1500c  | 280     | 2,240    | 4,480   | 8,960    |
| DW2000c  | 560     | 4,480    | 8,960   | 17,920   |
| DW2500c  | 560     | 4,480    | 8,960   | 17,920   |
| DW3000c  | 1,120   | 4,480    | 8,960   | 17,920   |
| DW5000c  | 1,120   | 8,960    | 17,920  | 35,840   |
| DW6000c  | 1,120   | 8,960    | 17,920  | 35,840   |
| DW7500c  | 2,240   | 17,920   | 35,840  | 71,680   |
| DW10000c | 2,240   | 17,920   | 35,840  | 71,680   |
| DW15000c | 4,480   | 17,920   | 35,840  | 71,680   |
| DW30000c | 8,960   | 17,920   | 35,840  | 71,680   |

Since there are 60 distributions, queries are actually running system-wide with 60 times the memory shown in the preceding tables.

### Memory per data warehouse (GB)

This table shows the system-wide memory allocations in GB for queries in the dynamic resource classes.

| cDWU     | smallrc | mediumrc | largerc | xlargerc |
|:-------- |:-------:|:--------:|:-------:|:--------:|
| DW1000c  | 16      | 131      | 263     | 525      |
| DW1500c  | 16      | 131      | 263     | 525      |
| DW2000c  | 33      | 263      | 525     | 1,050    |
| DW2500c  | 33      | 263      | 525     | 1,050    |
| DW3000c  | 66      | 263      | 525     | 1,050    |
| DW5000c  | 66      | 525      | 1,050   | 2,100    |
| DW6000c  | 66      | 525      | 1,050   | 2,100    |
| DW7500c  | 131     | 1,050    | 2,100   | 4,200    |
| DW10000c | 131     | 1,050    | 2,100   | 4,200    |
| DW15000c | 263     | 1,050    | 2,100   | 4,200    |
| DW30000c | 525     | 1,050    | 2,100   | 4,200    |


From this table of system-wide memory allocations, you can see that a query running on a DW2000c in the xlargerc resource class is allocated a total of 1,050 GB of memory (17,920 MB * 60 distributions / 1,024 to convert to GB) over the entirety of your SQL Data Warehouse. One query has over a TB of memory.

The same calculation applies to static resource classes.
 

## Optimized for Compute - concurrency slots
The following table reiterates all of the previous concepts in a single view that shows the number of concurrency slots available by DWU and the slots consumed by each resource class.  

| Service Level | Maximum concurrent queries | Concurrency slots available | Slots used by smallrc | Slots used by mediumrc | Slots used by largerc | Slots used by xlargerc |
|:-------------:|:--------------------------:|:---------------------------:|:---------------------:|:----------------------:|:---------------------:|:----------------------:|
| DW1000c       | 32                         |   40                        | 1                     |  8                     |  16                   |  32                    |
| DW1500c       | 32                         |   60                        | 1                     |  8                     |  16                   |  32                    |
| DW2000c       | 32                         |   80                        | 1                     | 16                     |  32                   |  64                    |
| DW2500c       | 32                         |  100                        | 1                     | 16                     |  32                   |  64                    |
| DW3000c       | 32                         |  120                        | 1                     | 16                     |  32                   |  64                    |
| DW5000c       | 32                         |  200                        | 1                     | 32                     |  64                   | 128                    |
| DW6000c       | 32                         |  240                        | 1                     | 32                     |  64                   | 128                    |
| DW7500c       | 32                         |  300                        | 1                     | 64                     | 128                   | 128                    |
| DW10000c      | 32                         |  400                        | 1                     | 64                     | 128                   | 256                    |
| DW15000c      | 32                         |  600                        | 1                     | 64                     | 128                   | 256                    |
| DW30000c      | 32                         | 1200                        | 1                     | 64                     | 128                   | 256                    |

From these tables, you can see that SQL Data Warehouse running as DW2000c allocates a maximum of 32 concurrent queries and a total of 40 concurrency slots. If all users are running in smallrc, 32 concurrent queries would be allowed because each query would consume 1 concurrency slot. If all users on a DW1000 were running in mediumrc, each query would be allocated 800 MB per distribution for a total memory allocation of 47 GB per query, and concurrency would be limited to 5 users (40 concurrency slots / 8 slots per mediumrc user).

## Next steps
For more information about managing database users and security, see [Secure a database in SQL Data Warehouse][Secure a database in SQL Data Warehouse]. For more information about how larger resource classes can improve clustered columnstore index quality, see [Rebuilding indexes to improve segment quality].

<!--Image references-->

<!--Article references-->
[Secure a database in SQL Data Warehouse]: ./sql-data-warehouse-overview-manage-security.md
[Rebuilding indexes to improve segment quality]: ./sql-data-warehouse-tables-index.md#rebuilding-indexes-to-improve-segment-quality
[Secure a database in SQL Data Warehouse]: ./sql-data-warehouse-overview-manage-security.md

<!--MSDN references-->
[Managing Databases and Logins in Azure SQL Database]:https://msdn.microsoft.com/library/azure/ee336235.aspx

<!--Other Web references-->
