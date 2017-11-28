---
title: Azure Site Recovery deployment planner Site Recovery limit| Microsoft Docs
description: This article describes Azure Site Recovery limits.
services: site-recovery
documentationcenter: ''
author: nsoneji
manager: garavd
editor:

ms.assetid:
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 11/27/2017
ms.author: nisoneji

---

# Azure Site Recovery limits
The following table provides the Azure Site Recovery limits. These limits are based on our tests, but they cannot cover all possible application I/O combinations. Actual results can vary based on your application I/O mix. For best results, even after deployment planning, we always recommend that you perform extensive application testing by issuing a test failover to get the true performance picture of the application.
 
**Replication storage target** | **Average source disk I/O size** |**Average source disk data churn** | **Total source disk data churn per day**
---|---|---|---
Standard storage | 8 KB	| 2 MBps | 168 GB per disk
Premium P10 or P15 disk | 8 KB	| 2 MBps | 168 GB per disk
Premium P10 or P15 disk | 16 KB | 4 MBps |	336 GB per disk
Premium P10 or P15 disk | 32 KB or greater | 8 MBps | 672 GB per disk
Premium P20 or P30 disk | 8 KB	| 5 MBps | 421 GB per disk
Premium P20 or P30 disk | 16 KB or greater |10 MBps | 842 GB per disk

These limits are average numbers assuming a 30 percent I/O overlap. Azure Site Recovery is capable of handling higher throughput based on overlap ratio, larger write sizes, and actual workload I/O behavior. The preceding numbers assume a typical backlog of approximately five minutes. That is, after data is uploaded, it is processed and a recovery point is created within five minutes.


## Next steps
* [Download](site-recovery-hyper-v-deployment-panner-download.md) and run Azure Site Recovery deployment planner to understand the data churn and IOPS of your VMs.
