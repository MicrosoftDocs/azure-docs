---
title: General performance considerations for Azure NetApp Files
description: Learn about performance for Azure NetApp Files, including the relationship of quota and throughput limit and how to dynamically increase/decrease volume quota.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 10/14/2026
ms.author: anfdocs
# Customer intent: As a cloud architect, I want to understand how to manage quota and throughput for Azure NetApp Files, so that I can optimize storage performance based on my workload requirements.
---
# General performance considerations for Azure NetApp Files

> [!IMPORTANT]
> This article addresses performance considerations for *regular volumes* only. 
> For *large volumes*, see [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md#requirements-and-considerations). 

The combination of the quota assigned to the volume and the selected service level determines the [throughput limit](azure-netapp-files-service-levels.md) for a volume with automatic QoS. For volumes with manual QoS, the throughput limit can be defined individually. When you make performance plans about Azure NetApp Files, you need to understand several considerations. 

> [!NOTE]
> Azure NetApp Files is built on NetApp's bare metal with ONTAP storage OS running inside the Azure datacenter. Azure NetApp Files is a PaaS and does not present the storage efficiencies to the customer, it's transparent and self-managed. 

## Quota and throughput

Throughput limits are a combination of read and write speed. The throughput limit is only one determinant of the actual performance to be realized.

Typical storage performance considerations contribute to the total performance delivered. The considerations include read and write mix, the transfer size, random or sequential patterns, and many other factors.

Metrics are reported as aggregates of multiple data points collected during a five-minute interval. For more information about metrics aggregation, see [Azure Monitor Metrics aggregation and display explained](/azure/azure-monitor/essentials/metrics-aggregation-explained). 

The maximum empirical volume throughput observed in testing is 4,500 MiB/s. At the Premium storage tier, an automatic QoS volume quota of 70.31 TiB provisions a throughput limit high enough to achieve this performance level.

For automatic QoS volumes, if you're considering assigning volume quota amounts beyond 70.31 TiB, additional quota may be assigned to a volume for storing more data. However, the added quota doesn't result in a further increase in actual throughput.

The same empirical throughput ceiling applies to volumes with manual QoS. The maximum throughput you should assign to a regular volume is 4,500 MiB/s.

## Automatic QoS volume quota and throughput

Learn about quota management and throughput for volumes with the automatic QoS type.

### Overprovisioning the volume quota

If a workload’s performance is throughput-limit bound, it's possible to overprovision the automatic QoS volume quota to set a higher throughput level and achieve higher performance.

For example, if an automatic QoS volume in the Premium storage tier has only 500 GiB of data but requires 128 MiB/s of throughput, you can set the quota to 2 TiB so the throughput level is set accordingly (64 MiB/s per TB * 2 TiB = 128 MiB/s).

If you consistently overprovision a volume for achieving a higher throughput, consider using the manual QoS volumes or using a higher service level instead. In this example, you can achieve the same throughput limit with half the automatic QoS volume quota by using the Ultra storage tier instead (128 MiB/s per TiB * 1 TiB = 128 MiB/s).

### Dynamically increasing or decreasing volume quota

If your performance requirements are temporary or if you have increased performance needs for a fixed period of time, you can dynamically increase or decrease volume quota to instantaneously adjust the throughput limit. Note the following considerations: 

* Volume quota can be increased or decreased without any need to pause IO, and access to the volume is not interrupted or impacted.  

    You can adjust the quota during an active I/O transaction against a volume. Volume quota can never be decreased below the amount of logical data stored in the volume.

* When volume quota is changed, the corresponding change in throughput limit is nearly instantaneous. 

    The change does not interrupt or impact the volume access or I/O.  

* Adjusting volume quota might require a change in capacity pool size.  

    The capacity pool size can be adjusted dynamically and without impacting volume availability or I/O.

## Manual QoS volume quota and throughput 

If you use manual QoS volumes, you don’t have to overprovision the volume quota to achieve a higher throughput because the throughput can be assigned to each volume independently. However, you still need to ensure that the capacity pool is pre-provisioned with sufficient throughput for your performance needs. The throughput of a capacity pool is provisioned according to its size and service level. See [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md) for more details.

## Monitoring volumes for performance 

Azure NetApp Files volumes can be monitored using available [Performance metrics](azure-netapp-files-metrics.md#performance-metrics-for-volumes). 

:::image type="content" source="./media/performance-considerations/monitor-volume-performance.png" alt-text="Screenshot providing information about the performance of volumes." lightbox="./media/performance-considerations/monitor-volume-performance.png":::

As the graph shows, latency typically stays low and predictable as throughput increases. When a volume approaches its configured QoS throughput limit, latency starts to increase. After the volume throughput limit is reached, the system queues extra I/O requests and latency can rise rapidly while throughput stays capped. This behavior is expected and is a strong indicator that the volume exhausted its available performance headroom rather than experiencing a storage service issue.

To verify this condition, monitor the Throughput limit reached metric. Non-zero values indicate that the volume reached its throughput ceiling. Increasing the volume QoS setting (manual QoS), increasing volume size (automatic QoS), or moving to a higher service level increases the allowable throughput and can reduce latency caused by throughput throttling.

For a comprehensive workflow to identify and isolate latency caused by throughput throttling, cool-tier data retrieval, client-side bottlenecks, network-path issues, and other factors, see [Troubleshoot latency issues on Azure NetApp Files volumes](troubleshoot-latency-issues.md).

For more recommendations, see [Performance FAQs for Azure NetApp Files](faq-performance.md#what-should-i-do-to-optimize-or-tune-azure-netapp-files-performance). 

## Volume placement and throughput considerations

For high-throughput workloads, performance planning should consider not only volume-level throughput limits but also workload demand.

Azure NetApp Files volumes are delivered through a shared infrastructure platform with resource allocations designed to deliver predictable performance and scale. When multiple volumes supporting the same application are deployed together, their combined activity can increase demand on shared service resources. This scenario is more likely with sustained, throughput-intensive workloads such as Oracle, SAP HANA, and other large database platforms.

To reduce the risk of backend resource concentration and to optimize workload distribution across the service:

* Use application volume groups for supported workloads.
* Use zonal deployment patterns where low latency and predictable placement are required.
* Monitor volume throughput, latency, and the throughput limit reached metric where applicable.

Application volume groups help improve placement, optimization, and predictability for supported workloads by organizing related volumes by using application-aware deployment rules following best practices.

## Troubleshoot performance issues

The throughput limit is only one factor that determines actual performance. To troubleshoot volume throughput or IOPS that's lower than expected, review the following recommendations:

* Understand application performance requirements before mapping them to Azure NetApp Files volumes.
* Ensure the virtual machines (VMs) are sized appropriately. See [Azure virtual machine SKUs best practices for Azure NetApp Files](performance-virtual-machine-sku.md).
* Enable [accelerated networking](/azure/virtual-network/create-vm-accelerated-networking-powershell) for the VMs.
* Select the desired [service level](azure-netapp-files-service-levels.md) and size for the capacity pool. Use a capacity pool with the [flexible service level](azure-netapp-files-service-levels.md) for the highest flexibility in capacity and throughput sizing.
* Use a capacity pool with [manual QoS](manage-manual-qos-capacity-pool.md) to set throughput and capacity independently.
* Create a volume with the desired quota size and throughput. See the [Azure NetApp Files performance calculator](https://azure.github.io/azure-netapp-files/calc/).
* Understand the performance impacts of [Kerberos](performance-impact-kerberos.md).
* Follow the [server message block (SMB) performance best practices](azure-netapp-files-smb-performance.md#smb-multichannel) for Azure NetApp Files.
* Enable [SMB Multichannel](azure-netapp-files-smb-performance.md#smb-multichannel).
* Disable [SMB signing](azure-netapp-files-smb-performance.md#performance-impact-of-smb-signing) where possible to improve I/O performance.
* For Linux performance consideration and tuning:
    * Enable [`nconnect`](performance-linux-mount-options.md#nconnect) for high-performance, single-instance workloads.
    * Cap [`rsize` and `wsize`](performance-linux-mount-options.md#rsize-and-wsize) at 256 KiB.
    * In Linux, the default maximum number of remote procedure call (RPC) slots is 65,536. Azure NetApp Files volumes allow 128 RPCs at any given time. If a client launches more than 128 concurrent operations, performance might be degraded.
* Use the [FIO](https://github.com/axboe/fio) tool for performance benchmark testing with Azure NetApp Files. See [Azure NetApp Files performance benchmark test recommendations](azure-netapp-files-performance-metrics-volumes.md).

    > [!NOTE]
    > Using tools such as `dd` isn't recommended for Azure NetApp Files benchmark testing. They generate single-threaded sequential reads and writes only, which aren't representative of application workloads.

## Deploy SAP HANA scale-out workloads and Azure NetApp Files in proximity

For SAP HANA scale-out workloads to achieve low latency, work with your Microsoft representative to ensure the VMs and the Azure NetApp Files volumes are deployed in proximity.

* Use [application volume group for SAP HANA](application-volume-group-introduction.md) to deploy volumes with an optimal layout in the infrastructure.
* Deploy Azure NetApp Files volumes in the same availability zone as the SAP HANA VMs for optimal latency and performance.
* Very specific conditions might require a proximity placement group with VM pinning. Use the [SAP HANA VM Pinning Requirements Form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRxjSlHBUxkJBjmARn57skvdUQlJaV0ZBOE1PUkhOVk40WjZZQVJXRzI2RC4u) to address this requirement. To provide feedback on pinning or related features, send an email to anffeedback@microsoft.com, or talk to your Azure NetApp Files sales representative.

For more information, see:

* [Azure proximity placement groups for optimal network latency with SAP applications](/azure/virtual-machines/workloads/sap/sap-proximity-placement-scenarios)
* [Deploy a SAP HANA scale-out system with standby node on Azure VMs by using Azure NetApp Files on SUSE Linux Enterprise Server](/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-suse)
* [Deploy a SAP HANA scale-out system with standby node on Azure VMs by using Azure NetApp Files on Red Hat Enterprise Linux](/azure/virtual-machines/workloads/sap/sap-hana-scale-out-standby-netapp-files-rhel)

## Performance metrics aggregation

* Metrics are reported as aggregates of multiple data points collected during a five-minute interval. For more information about metrics aggregation, see [Azure Monitor Metrics aggregation and display explained](/azure/azure-monitor/essentials/metrics-aggregation-explained). 
* Individual metric streams are aggregated across time to produce statistical summaries at different data granularities.

## Resources

* [Throughput metrics for capacity pool](azure-netapp-files-metrics.md#throughput-metrics-for-capacity-pools) and [volumes](azure-netapp-files-metrics.md#throughput-metrics-for-volumes)
* [Performance FAQs](faq-performance.md)
* [Performance benchmarks for Linux](performance-benchmarks-linux.md)

## Next steps

- [Azure NetApp Files Performance Calculator](https://azure.github.io/azure-netapp-files/calc/)
- [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
- [Performance benchmarks for Linux](performance-benchmarks-linux.md)
