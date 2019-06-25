---
title: Performance considerations for Azure NetApp Files | Microsoft Docs
description: Describes performance considerations for Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/22/2019
ms.author: b-juche
---
# Performance considerations for Azure NetApp Files

The [throughput limit](azure-netapp-files-service-levels.md) for a volume is determined by a combination of the quota assigned to the volume and the service level selected. When you make performance plans about Azure NetApp Files, you need to understand several considerations. 

* The throughput limit is only one determinant of the actual performance that will be realized.  

    Typical storage performance considerations, including read and write mix, the transfer size, random or sequential patterns, and many other factors will contribute to the total performance delivered.  

    The maximum empirical throughput that has been observed in testing is 4,500 MiB/s.  At the Premium storage tier, a volume quota of 70.31 TiB will provision a throughput limit that is high enough to achieve this level of performance.  

    A volume quota beyond 70.31 TiB (up to the single volume limit of 100 TiB) requires that you assign additional quota for storing additional data.  However, assigning additional quota in this case will not result in further increase in actual throughput.  

    See [Performance benchmarks for Azure NetApp Files](azure-netapp-files-performance-benchmarks.md) for additional information.

* If a workload’s performance is throughput-limit bound, it is possible to overprovision the volume quota to set a higher throughput level and achieve higher performance.  

    For example, if a volume in the Premium storage tier has only 500 GiB of data but requires 128 MiB/s of throughput, you can set the quota to 2 TiB so that the throughput level is set accordingly (64 MiB/s per TB * 2 TiB = 128 MiB/s).  

    If you consistently overprovision a volume for achieving a higher throughput, consider using a higher service level instead.  In the example above, you can achieve the same throughput limit with half the volume quota by using the Ultra storage tier instead (128 MiB/s per TiB * 1 TiB = 128 MiB/s).

* If your performance requirements are temporary in nature, or if you have increased performance needs for a fixed period of time, you can dynamically increase or decrease volume quota to instantaneously adjust the throughput limit.  

    * Volume quota can be increased or decreased without any need to pause IO, and access to the volume is not interrupted or impacted.  

        You can adjust the quota during an active I/O transaction against a volume.  Note that volume quota can never be decreased below the amount of logical data that is stored in the volume.

    * When volume quota is changed, the corresponding change in throughput limit is nearly instantaneous. 

        The change does not interrupt or impact the volume access or I/O.  

    * Adjusting volume quota requires a change in capacity pool size.  

        The capacity pool size can be adjusted dynamically and without impacting volume availability or I/O.
