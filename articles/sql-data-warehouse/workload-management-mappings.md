---
title: Workload management mappings | Microsoft Docs
description: Understand concurrency and workload management in Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: ''

ms.assetid: ef170f39-ae24-4b04-af76-53bb4c4e16d4
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: performance
ms.date: 12/14/2018
ms.author: elbutter

---

# Workload Management mappings

This page covers various table which map resource class assignments with the effects on concurrency, system resource usage, and query importance.

## Memory Allocations

The following table maps the memory allocated to each distribution by DWU and resource class. For information on the impact of memory allocation and resource classes, see the workload management overview page. Note that the higher resource classes have their memory reduced to honor the global DWU limits.

### Static Resource Class memory allocation

#### Per distribution (MB)
| DWU    | staticrc10 | staticrc20 | staticrc30 | staticrc40 | staticrc50 | staticrc60 | staticrc70 | staticrc80 |
| :----- | :--------: | :--------: | :--------: | :--------: | :--------: | :--------: | :--------: | :--------: |
| DW100  |    100     |    200     |    400     |    400     |    400     |    400     |    400     |    400     |
| DW200  |    100     |    200     |    400     |    800     |    800     |    800     |    800     |    800     |
| DW300  |    100     |    200     |    400     |    800     |    800     |    800     |    800     |    800     |
| DW400  |    100     |    200     |    400     |    800     |   1,600    |   1,600    |   1,600    |   1,600    |
| DW500  |    100     |    200     |    400     |    800     |   1,600    |   1,600    |   1,600    |   1,600    |
| DW600  |    100     |    200     |    400     |    800     |   1,600    |   1,600    |   1,600    |   1,600    |
| DW1000 |    100     |    200     |    400     |    800     |   1,600    |   3,200    |   3,200    |   3,200    |
| DW1200 |    100     |    200     |    400     |    800     |   1,600    |   3,200    |   3,200    |   3,200    |
| DW1500 |    100     |    200     |    400     |    800     |   1,600    |   3,200    |   3,200    |   3,200    |
| DW2000 |    100     |    200     |    400     |    800     |   1,600    |   3,200    |   6,400    |   6,400    |
| DW3000 |    100     |    200     |    400     |    800     |   1,600    |   3,200    |   6,400    |   6,400    |
| DW6000 |    100     |    200     |    400     |    800     |   1,600    |   3,200    |   6,400    |   12,800   |

#### System-wide (GB)
| DWU    | staticrc10 | staticrc20 | staticrc30 | staticrc40 | staticrc50 | staticrc60 | staticrc70 | staticrc80 |
| :----- | :--------: | :--------: | :--------: | :--------: | :--------: | :--------: | :--------: | :--------: |
| DW100  |     6      |     12     |     24     |     24     |     24     |     24     |     24     |     24     |
| DW200  |     6      |     12     |     24     |     48     |     48     |     48     |     48     |     48     |
| DW300  |     6      |     12     |     24     |     48     |     48     |     48     |     48     |     48     |
| DW400  |     6      |     12     |     24     |     48     |     96     |     96     |     96     |     96     |
| DW500  |     6      |     12     |     24     |     48     |     96     |     96     |     96     |     96     |
| DW600  |     6      |     12     |     24     |     48     |     96     |     96     |     96     |     96     |
| DW1000 |     6      |     12     |     24     |     48     |     96     |    192     |    192     |    192     |
| DW1200 |     6      |     12     |     24     |     48     |     96     |    192     |    192     |    192     |
| DW1500 |     6      |     12     |     24     |     48     |     96     |    192     |    192     |    192     |
| DW2000 |     6      |     12     |     24     |     48     |     96     |    192     |    384     |    384     |
| DW3000 |     6      |     12     |     24     |     48     |     96     |    192     |    384     |    384     |
| DW6000 |     6      |     12     |     24     |     48     |     96     |    192     |    384     |    768     |

### Dynamic Resource Class memory allocation

#### Per distribution  (MB)

| DWU    | smallrc | mediumrc | largerc | xlargerc |
| :----- | :-----: | :------: | :-----: | :------: |
| DW100  |   100   |   100    |   200   |   400    |
| DW200  |   100   |   200    |   400   |   800    |
| DW300  |   100   |   200    |   400   |   800    |
| DW400  |   100   |   400    |   800   |  1,600   |
| DW500  |   100   |   400    |   800   |  1,600   |
| DW600  |   100   |   400    |   800   |  1,600   |
| DW1000 |   100   |   800    |  1,600  |  3,200   |
| DW1200 |   100   |   800    |  1,600  |  3,200   |
| DW1500 |   100   |   800    |  1,600  |  3,200   |
| DW2000 |   100   |  1,600   |  3,200  |  6,400   |
| DW3000 |   100   |  1,600   |  3,200  |  6,400   |
| DW6000 |   100   |  3,200   |  6,400  |  12,800  |

#### System-wide (GB)

| DWU    | smallrc | mediumrc | largerc | xlargerc |
| :----- | :-----: | :------: | :-----: | :------: |
| DW100  |    6    |    6     |   12    |    24    |
| DW200  |    6    |    12    |   24    |    48    |
| DW300  |    6    |    12    |   24    |    48    |
| DW400  |    6    |    24    |   48    |    96    |
| DW500  |    6    |    24    |   48    |    96    |
| DW600  |    6    |    24    |   48    |    96    |
| DW1000 |    6    |    48    |   96    |   192    |
| DW1200 |    6    |    48    |   96    |   192    |
| DW1500 |    6    |    48    |   96    |   192    |
| DW2000 |    6    |    96    |   192   |   384    |
| DW3000 |    6    |    96    |   192   |   384    |
| DW6000 |    6    |   192    |   384   |   768    |

## Concurrency slot consumption

SQL Data Warehouse grants more memory to queries running in higher resource classes. Memory is a fixed resource.  Therefore, the more memory allocated per query, the fewer concurrent queries can execute. The following table reiterates all of the previous concepts in a single view that shows the number of concurrency slots available by DWU and the slots consumed by each resource class.  

### Allocation and consumption of concurrency slots for static resource classes

| DWU    | Maximum concurrent queries | Concurrency slots allocated | staticrc10 | staticrc20 | staticrc30 | staticrc40 | staticrc50 | staticrc60 | staticrc70 | staticrc80 |
| :----- | :------------------------: | :-------------------------: | :--------: | :--------: | :--------: | :--------: | :--------: | :--------: | :--------: | :--------: |
| DW100  |             4              |              4              |     1      |     2      |     4      |     4      |     4      |     4      |     4      |     4      |
| DW200  |             8              |              8              |     1      |     2      |     4      |     8      |     8      |     8      |     8      |     8      |
| DW300  |             12             |             12              |     1      |     2      |     4      |     8      |     8      |     8      |     8      |     8      |
| DW400  |             16             |             16              |     1      |     2      |     4      |     8      |     16     |     16     |     16     |     16     |
| DW500  |             20             |             20              |     1      |     2      |     4      |     8      |     16     |     16     |     16     |     16     |
| DW600  |             24             |             24              |     1      |     2      |     4      |     8      |     16     |     16     |     16     |     16     |
| DW1000 |             32             |             40              |     1      |     2      |     4      |     8      |     16     |     32     |     32     |     32     |
| DW1200 |             32             |             48              |     1      |     2      |     4      |     8      |     16     |     32     |     32     |     32     |
| DW1500 |             32             |             60              |     1      |     2      |     4      |     8      |     16     |     32     |     32     |     32     |
| DW2000 |             32             |             80              |     1      |     2      |     4      |     8      |     16     |     32     |     64     |     64     |
| DW3000 |             32             |             120             |     1      |     2      |     4      |     8      |     16     |     32     |     64     |     64     |
| DW6000 |             32             |             240             |     1      |     2      |     4      |     8      |     16     |     32     |     64     |    128     |

### Allocation and consumption of concurrency slots for dynamic resource classes

| DWU    | Maximum concurrent queries | Concurrency slots allocated | Slots used by smallrc | Slots used by mediumrc | Slots used by largerc | Slots used by xlargerc |
| :----- | :------------------------: | :-------------------------: | :-------------------: | :--------------------: | :-------------------: | :--------------------: |
| DW100  |             4              |              4              |           1           |           1            |           2           |           4            |
| DW200  |             8              |              8              |           1           |           2            |           4           |           8            |
| DW300  |             12             |             12              |           1           |           2            |           4           |           8            |
| DW400  |             16             |             16              |           1           |           4            |           8           |           16           |
| DW500  |             20             |             20              |           1           |           4            |           8           |           16           |
| DW600  |             24             |             24              |           1           |           4            |           8           |           16           |
| DW1000 |             32             |             40              |           1           |           8            |          16           |           32           |
| DW1200 |             32             |             48              |           1           |           8            |          16           |           32           |
| DW1500 |             32             |             60              |           1           |           8            |          16           |           32           |
| DW2000 |             32             |             80              |           1           |           16           |          32           |           64           |
| DW3000 |             32             |             120             |           1           |           16           |          32           |           64           |
| DW6000 |             32             |             240             |           1           |           32           |          64           |          128           |

## Workload group mappings

| Workload groups | Concurrency slot mapping | MB / Distribution | Importance mapping |
| :-------------- | :----------------------: | :---------------: | :----------------- |
| SloDWGroupC00   |            1             |        100        | Medium             |
| SloDWGroupC01   |            2             |        200        | Medium             |
| SloDWGroupC02   |            4             |        400        | Medium             |
| SloDWGroupC03   |            8             |        800        | Medium             |
| SloDWGroupC04   |            16            |       1,600       | High               |
| SloDWGroupC05   |            32            |       3,200       | High               |
| SloDWGroupC06   |            64            |       6,400       | High               |
| SloDWGroupC07   |           128            |      12,800       | High               |

#### Sample workload group mappings on DW500 static resource classes

| Resource class | Workload group | Concurrency slots used | MB / Distribution | Importance |
| :------------- | :------------- | :--------------------: | :---------------: | :--------- |
| staticrc10     | SloDWGroupC00  |           1            |        100        | Medium     |
| staticrc20     | SloDWGroupC01  |           2            |        200        | Medium     |
| staticrc30     | SloDWGroupC02  |           4            |        400        | Medium     |
| staticrc40     | SloDWGroupC03  |           8            |        800        | Medium     |
| staticrc50     | SloDWGroupC03  |           16           |       1,600       | High       |
| staticrc60     | SloDWGroupC03  |           16           |       1,600       | High       |
| staticrc70     | SloDWGroupC03  |           16           |       1,600       | High       |
| staticrc80     | SloDWGroupC03  |           16           |       1,600       | High       |

#### Sample workload group mappings on DW500 dynamic resource classes

| Resource class | Workload group | Concurrency slots used | MB / Distribution | Importance |
| :------------- | :------------- | :--------------------: | :---------------: | :--------- |
| smallrc        | SloDWGroupC00  |           1            |        100        | Medium     |
| mediumrc       | SloDWGroupC02  |           4            |        400        | Medium     |
| largerc        | SloDWGroupC03  |           8            |        800        | Medium     |
| xlargerc       | SloDWGroupC04  |           16           |       1,600       | High       |

## Concurrency limits

| DWU       | Max concurrent queries | Concurrency slots allocated |
| :-------- | :--------------------: | :-------------------------: |
| DW100     |           4            |              4              |
| DW200     |           8            |              8              |
| DW300     |           12           |             12              |
| DW400     |           16           |             16              |
| DW500     |           20           |             20              |
| DW600     |           24           |             24              |
| DW1000(c) |           32           |             40              |
| DW1200    |           32           |             48              |
| DW1500(c) |           32           |             60              |
| DW2000(c) |           32           |             80              |
| DW3000(c) |           32           |             120             |
| DW5000c   |           32           |             240             |
| DW6000(c) |           32           |             240             |
| DW7500c   |           32           |             240             |
| DW10000c  |           32           |             240             |
| DW15000c  |           32           |             240             |
| DW30000c  |           32           |             240             |