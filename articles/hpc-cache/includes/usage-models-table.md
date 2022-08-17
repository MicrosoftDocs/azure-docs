---
ms.service: hpc-cache
ms.topic: include
ms.date: 06/17/2021
author: ekpgh
ms.author: v-erkel
---


| Usage model | Caching mode | Back-end verification | Maximum write-back delay |
|--|--|--|--|
| Read heavy, infrequent writes <!--read_heavy_infreq-->| Read | Never | None |
| Greater than 15% writes <!--write_workload_15-->| Read/write | 8 hours | 1 hour |
| Clients bypass the cache <!--write_around-->| Read | 30 seconds | None |
| Greater than 15% writes, frequent back-end checking (30 seconds) <!--write_workload_check_30-->| Read/write | 30 seconds | 1 hour |
| Greater than 15% writes, frequent back-end checking (60 seconds) <!--write_workload_check_60-->| Read/write | 60 seconds | 1 hour |
| Greater than 15% writes, frequent write-back <!--write_workload_cloudws-->| Read/write | 30 seconds | 30 seconds |
| Read heavy, checking the backing server every 3 hours <!--read_heavy_check_180-->| Read | 3 hours | None |
