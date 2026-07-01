---
title: Understand resizing guidelines for cache volumes in Azure NetApp Files
description: Describes the resizing guidelines you must be aware of before resizing a cache volume.
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 12/18/2025
ms.author: anfdocs
ms.custom: references_regions
# Customer intent: As a data administrator, I want to understand the guidelines to resize a cache volume.
---

# Understand resizing guidelines for cache volumes in Azure NetApp Files

This article describes the guidelines you need to be aware of before resizing an Azure NetApp Files cache volume.

When a cache volume is created, one or more constituent volumes (CVs) are provisioned based on the size and the service level. The resize range of a cache volume is based on the number of CVs provisioned at creation time and the CV count cannot be changed.

The following table shows CV count, minimum and maximum cache volume size and resize ranges per service level:

|  Service Level | CV count | Cache Size at Creation (Minimum GiB) | Cache Size at Creation (Maximum GiB) | Resize Range (Minimum GiB) | Resize Range (Maximum GiB)  |
|:---: |:---:|:---: |:---: |:---: |:---: |
|     Standard     |      1     |      50        |     99           |       50        |        307,200        |
|                  |      2     |      100       |     1,023        |       100       |        614,400        |
|                  |      4     |      1,024     |     10,239       |       200       |        1,048,576      |
|                  |      8     |      10,240    |     25,843       |       800       |        1,048,576      |
|                  |      12    |      25,844    |     65,226       |       1,800     |        1,048,576      |
|                  |      16    |      65,227    |     164,622      |       3,200     |        1,048,576      |
|                  |      20    |      164,623   |     415,483      |       5,000     |        1,048,576      |
|                  |      24    |      415,484   |     1,048,576    |       7,200     |        1,048,576      |
|  Service Level | CV count | Cache Size at Creation (Minimum GiB)  | Cache Size at Creation (Maximum GiB) | Resize Range (Minimum GiB) | Resize Range (Maximum GiB)  |
|     Premium      |      1     |      50        |     99           |       50        |        307,200        |
|                  |      2     |      100       |     1,023        |       100       |        614,400        |
|                  |      4     |      1,024     |     10,239       |       200       |        1,048,576      |
|                  |      8     |      10,240    |     22,148       |       400       |        1,048,576      |
|                  |      16    |      22,149    |     47,905       |       1,600     |        1,048,576      |
|                  |      24    |      47,906    |    103,618       |       3,600     |        1,048,576      |
|                  |      32    |      103,619   |     224,122      |       6,400     |        1,048,576      |
|                  |      40    |      224,123   |     484,765      |       10,000    |        1,048,576      |
|                  |      48    |      484,766   |     1,048,576    |       14,400    |        1,048,576      |
|  Service Level   | CV count   | Cache Size at Creation (Minimum GiB) | Cache Size at Creation (Maximum GiB) | Resize Range (Minimum GiB) | Resize Range (Maximum GiB)  |
| Ultra, Flexible  |      1     |      50        |     99           |       50        |        307,200        |
|                  |      2     |      100       |     1,023        |       100       |        614,400        |
|                  |      4     |      1,024     |     10,239       |       200       |        1,048,576      |
|                  |      8     |      10,240    |     19,836       |       400       |        1,048,576      |
|                  |      16    |      19,837    |     38,429       |       800       |        1,048,576      |
|                  |      32    |      38,430    |    74,448        |       3,200     |        1,048,576      |
|                  |      48    |      74,449    |     144,225      |       7,200     |        1,048,576      |
|                  |      64    |      144,226   |     279,400      |       12,800    |        1,048,576      |
|                  |      80    |      279,401   |     541,269      |       20,000    |        1,048,576      |
|                  |      96    |      541,270   |     1,048,576    |       28,800    |        1,048,576      |


**Example:**

* Cache volume size at creation = 12,288 GiB
* CV Count = 8
* Service level = Premium
* Cache volume size can be decreased to 400 GiB
* Cache volume size can be increased to 1,048,576 GiB

If the desired size is larger or smaller than the resize range for that cache volume, then a new cache volume needs to be created with the desired size.



