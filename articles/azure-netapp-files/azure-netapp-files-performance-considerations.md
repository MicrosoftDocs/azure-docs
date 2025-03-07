---
title: General performance considerations for Azure NetApp Files | Microsoft Docs
description: Learn about performance for Azure NetApp Files, including the relationship of quota and throughput limit and how to dynamically increase/decrease volume quota.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 10/17/2024
ms.author: anfdocs
---
# General performance considerations for Azure NetApp Files

> [!IMPORTANT]   
> This article addresses performance considerations for *regular volumes* only.   
> For *large volumes*, see [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md#requirements-and-considerations). 

The combination of the quota assigned to the volume and the selected service level determines the [throughput limit](azure-netapp-files-service-levels.md) for a volume with automatic QoS. For volumes with manual QoS, the throughput limit can be defined individually. When you make performance plans about Azure NetApp Files, you need to understand several considerations. 

## Quota and throughput  

Throughput limits are a combination of read and write speed. The throughput limit is only one determinant of the actual performance to be realized.  

Typical storage performance considerations contribute to the total performance delivered. The considerations include read and write mix, the transfer size, random or sequential patterns, and many other factors.

Metrics are reported as aggregates of multiple data points collected during a five-minute interval. For more information about metrics aggregation, see [Azure Monitor Metrics aggregation and display explained](/azure/azure-monitor/essentials/metrics-aggregation-explained). 

The maximum empirical throughput that has been observed in testing is 4,500 MiB/s. At the Premium storage tier, an automatic QoS volume quota of 70.31 TiB provisions a throughput limit high enough to achieve this performance level.  

For automatic QoS volumes, if you're considering assigning volume quota amounts beyond 70.31 TiB, additional quota may be assigned to a volume for storing more data. However, the added quota doesn't result in a further increase in actual throughput.  

The same empirical throughput ceiling applies to volumes with manual QoS. The maximum throughput can assign to a volume is 4,500 MiB/s.

## Automatic QoS volume quota and throughput

Learn about quota management and throughput for volumes with the automatic QoS type.

### Overprovisioning the volume quota

If a workload’s performance is throughput-limit bound, it's possible to overprovision the automatic QoS volume quota to set a higher throughput level and achieve higher performance.  

For example, if an automatic QoS volume in the Premium storage tier has only 500 GiB of data but requires 128 MiB/s of throughput, you can set the quota to 2 TiB so the throughput level is set accordingly (64 MiB/s per TB * 2 TiB = 128 MiB/s).  

If you consistently overprovision a volume for achieving a higher throughput, consider using the manual QoS volumes or using a higher service level instead. In this example, you can achieve the same throughput limit with half the automatic QoS volume quota by using the Ultra storage tier instead (128 MiB/s per TiB * 1 TiB = 128 MiB/s).

### Dynamically increasing or decreasing volume quota

If your performance requirements are temporary in nature, or if you have increased performance needs for a fixed period of time, you can dynamically increase or decrease volume quota to instantaneously adjust the throughput limit.  Note the following considerations: 

* Volume quota can be increased or decreased without any need to pause IO, and access to the volume is not interrupted or impacted.  

    You can adjust the quota during an active I/O transaction against a volume.  Volume quota can never be decreased below the amount of logical data that is stored in the volume.

* When volume quota is changed, the corresponding change in throughput limit is nearly instantaneous. 

    The change does not interrupt or impact the volume access or I/O.  

* Adjusting volume quota might require a change in capacity pool size.  

    The capacity pool size can be adjusted dynamically and without impacting volume availability or I/O.

## Manual QoS volume quota and throughput 

If you use manual QoS volumes, you don’t have to overprovision the volume quota to achieve a higher throughput because the throughput can be assigned to each volume independently. However, you still need to ensure that the capacity pool is pre-provisioned with sufficient throughput for your performance needs. The throughput of a capacity pool is provisioned according to its size and service level. See [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md) for more details.

## Monitoring volumes for performance 

Azure NetApp Files volumes can be monitored using available [Performance metrics](azure-netapp-files-metrics.md#performance-metrics-for-volumes). 

When volume throughput reaches its maximum (as determined by the QoS setting), the volume response times (latency) increase. This effect can be incorrectly perceived as a performance issue caused by the storage. Increasing the volume QoS setting (manual QoS) or increasing  the volume size (auto QoS) increases the allowable volume throughput. 

To check if the maximum throughput limit has been reached, monitor the metric [Throughput limit reached](azure-netapp-files-metrics.md#volumes). For more recommendations, see [Performance FAQs for Azure NetApp Files](faq-performance.md#what-should-i-do-to-optimize-or-tune-azure-netapp-files-performance). 

## Next steps

- [Azure NetApp Files Performance Calculator](https://docs.netapp.com/us-en/netapp-solutions/ehc/azure-storage-options.html?hs_preview=tIKQbfoF-41214739590)
- [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
- [Performance benchmarks for Linux](performance-benchmarks-linux.md)
