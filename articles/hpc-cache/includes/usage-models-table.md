---
ms.service: hpc-cache
ms.topic: include
ms.date: 03/15/2021
author: ekpgh
ms.author: v-erkel
---


| Usage model | Caching mode | Back-end verification | Maximum write-back delay |
|--|--|--|--|
| Read heavy, infrequent writes | Read | Never | None |
| Greater than 15% writes | Read/write | 8 hours | 20 minutes |
| Clients bypass the cache | Read | 30 seconds | None |
| Greater than 15% writes, frequent back-end checking (30 seconds) | Read/write | 30 seconds | 20 minutes |
| Greater than 15% writes, frequent back-end checking (60 seconds) | Read/write | 60 seconds | 20 minutes |
| Greater than 15% writes, frequent write-back | Read/write | 30 seconds | 30 seconds |
| Read heavy, checking the backing server every 3 hours | Read | 3 hours | None |
