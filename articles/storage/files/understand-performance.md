---
title: Understand Azure Files performance
description: Learn about the factors that can impact Azure file share performance and how to optimize performance for your workload.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 07/06/2023
ms.author: kendownie
---

# Understand Azure Files performance

Azure Files can satisfy performance requirements for most applications and use cases. This article explains the different factors that can affect file share performance and how to optimize the performance of Azure file shares for your workload.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## Glossary
Before reading this article, it's helpful to understand some key terms relating to storage performance:

-   **IO operations per second (IOPS)**

    IOPS, or input/output operations per second, measures the number of file system operations per second. The term "IO" is interchangable with the terms "operation" and "transaction" in the Azure Files documentation.

-   **I/O size**

    I/O size, sometimes referred to as block size, is the size of the request that an application uses to perform a single input/output (I/O) operation on storage. Depending on the application, I/O size can range from very small sizes such as 4 KiB to much larger sizes. I/O size plays a major role in achievable throughput.

-  **Throughput**

    Throughput measures the number of bits read from or written to the storage per second, and is measured in mebibytes per second (MiB/s). To calculate throughput, multiply IOPS by I/O size. For example, 10,000 IOPS * 1 MiB I/O size = 10 GiB/s, while 10,000 IOPS * 4 KiB I/O size = 38 MiB/s.

-  **Latency**

    Latency is a synonym for delay and is usually measured in milliseconds (ms). There are two types of latency: end-to-end latency and service latency. For more information, see [Latency](#latency).

-  **Queue depth**

    Queue depth is the number of pending I/O requests that a storage resource can handle at any one time. For more information, see [Queue depth](#queue-depth).

## Choosing a performance tier based on usage patterns

Azure Files provides a range of storage tiers that help reduce costs by allowing you to store data at the appropriate level of performance and price. At the highest level, Azure Files offers two performance tiers: standard and premium. Standard file shares are hosted on a storage system backed by hard disk drives (HDD), while premium file shares are backed by solid-state drives (SSD) for better performance. Standard file shares have several storage tiers (transaction optimized, hot, and cool) that you can seamlessly move between to maximize the data at-rest storage and transaction prices. However, you can't move between standard and premium tiers without physically migrating your data between different [storage accounts](../common/storage-account-overview.md#types-of-storage-accounts).

When choosing between standard and premium file shares, it's important to understand the requirements of the expected usage pattern you're planning to run on Azure Files. If you require large amounts of IOPS, extremely fast data transfer speeds, or very low latency, then you should choose premium Azure file shares.

The following table summarizes the expected performance targets between standard and premium. For details, see [Azure Files scalability and performance targets](storage-files-scale-targets.md). 

| **Usage pattern requirements**                | **Standard** | **Premium** |
|-----------------------------------------------|--------------|-------------|
| Write latency (single-digit milliseconds)     | Yes          | Yes         |
| Read latency (single-digit milliseconds)      | No           | Yes         |

Premium file shares offer a provisioning model that guarantees the following performance profile based on share size. For more information, see [Provisioned model](understanding-billing.md#provisioned-model). Burst credits accumulate in a burst bucket whenever traffic for your file share is below baseline IOPS. Earned credits are used later to enable bursting when operations would exceed the baseline IOPS.

| **Capacity (GiB)** | **Baseline IOPS** | **Burst IOPS** | **Burst credits** | **Throughput (ingress + egress)** |
|--------------------|-------------------|----------------|-------------------|---------------------------------------------|
| 100                | 3,100             | Up to 10,000   | 24,840,000        | 110 MiB/s                                   |
| 500                | 3,500             | Up to 10,000   | 23,400,000        | 150 MiB/s                                   |
| 1,024              | 4,024             | Up to 10,000   | 21,513,600        | 203 MiB/s                                   |
| 5,120              | 8,120             | Up to 15,360   | 26,064,000        | 613 MiB/s                                   |
| 10,240             | 13,240            | Up to 30,720   | 62,928,000        | 1,125 MiB/s                                 |
| 33,792             | 36,792            | Up to 100,000  | 227,548,800       | 3,480 MiB/s                                 |
| 51,200             | 54,200            | Up to 100,000  | 164,880,000       | 5,220 MiB/s                                 |
| 102,400            | 100,000           | Up to 100,000  | 0                 | 10,340 MiB/s                                |

### Performance checklist

Whether you're assessing performance requirements for a new or existing workload, understanding your usage patterns will help you achieve predictable performance. Consult with your storage admin or application developer to determine the following usage patterns.

- **Latency sensitivity:** Are users opening files or interacting with virtual desktops that run on Azure Files? These are examples of workloads that are sensitive to read latency and also have high visibility to end users. These types of workloads are more suitable for premium Azure file shares, which can provide single-millisecond latency for both read and write operations (< 2 ms for small I/O size).

- **IOPS and throughput requirements:** Premium file shares support larger IOPS and throughput limits than standard file shares. See [file share scale targets](./storage-files-scale-targets.md#azure-file-share-scale-targets) for more information.

- **Workload duration and frequency:** Short (minutes) and infrequent (hourly) workloads will be less likely to achieve the upper performance limits of standard file shares compared to long-running, frequently occurring workloads. On premium file shares, workload duration is helpful when determining the correct performance profile to use based on the provisioning size. Depending on how long the workload needs to [burst](understanding-billing.md#bursting) for and how long it spends below the baseline IOPS, you can determine if you're accumulating enough bursting credits to consistently satisfy your workload at peak times. Finding the right balance will reduce costs compared to over-provisioning the file share. A common mistake is to run performance tests for only a few minutes, which is often misleading. To get a realistic view of performance, be sure to test at a sufficiently high frequency and duration. 

- **Workload parallelization:** For workloads that perform operations in parallel, such as through multiple threads, processes, or application instances on the same client, premium file shares provide a clear advantage over standard file shares: SMB Multichannel. See [Improve SMB Azure file share performance](smb-performance.md) for more information.

- **API operation distribution**: Is the workload metadata heavy with file open/close operations? This is common for workloads that are performing read operations against a large number of files. See [Metadata or namespace heavy workload](/troubleshoot/azure/azure-storage/files-troubleshoot-performance?toc=/azure/storage/files/toc.json#cause-2-metadata-or-namespace-heavy-workload).

## Latency

When thinking about latency, it's important to first understand how latency is determined with Azure Files. The most common measurements are the latency associated with **end-to-end latency** and **service latency** metrics. Using these [transaction metrics](storage-files-monitoring-reference.md#metrics) can help identify client-side latency and/or networking issues by determining how much time your application traffic spends in transit to and from the client.

- **End-to-end latency (SuccessE2ELatency)** is the total time it takes for a transaction to perform a complete round trip from the client, across the network, to the Azure Files service, and back to the client.

- **Service Latency (SuccessServerLatency)** is the time it takes for a transaction to round-trip only within the Azure Files service. This doesn't include any client or network latency.

  :::image type="content" source="media/understand-performance/storage-latency-diagram.png" alt-text="Diagram comparing client latency and service latency for Azure Files.":::

The difference between **SuccessE2ELatency** and **SuccessServerLatency** values is the latency likely caused by the network and/or the client.

It's common to confuse client latency with service latency (in this case, Azure Files performance). For example, if the service latency is reporting low latency and the end-to-end is reporting [very high latency for requests](/troubleshoot/azure/azure-storage/files-troubleshoot-performance?toc=/azure/storage/files/toc.json#very-high-latency-for-requests), that suggests that all the time is spent in transit to and from the client, and not in the Azure Files service.

Furthermore, as the diagram illustrates, the farther you are away from the service, the slower the latency experience will be, and the more difficult it will be to achieve performance scale limits with any cloud service. This is especially true when accessing Azure Files from on premises. While options like ExpressRoute are ideal for on-premises, they still don't match the performance of an application (compute + storage) that's running exclusively in the same Azure region.

> [!TIP]
> Using a VM in Azure to test performance between on-premises and Azure is an effective and practical way to baseline the networking capabilities of the connection to Azure. Often a workload can be slowed down by an undersized or incorrectly routed ExpressRoute circuit or VPN gateway.

## Queue depth

Queue depth is the number of outstanding I/O requests that a storage resource can service. As the disks used by storage systems have evolved from HDD spindles (IDE, SATA, SAS) to solid state devices (SSD, NVMe), they've also evolved to support higher queue depth. A workload consisting of a single client that serially interacts with a single file within a large dataset is an example of low queue depth. In contrast, a workload that supports parallelism with multiple threads and multiple files can easily achieve high queue depth. Because Azure Files is a distributed file service that spans thousands of Azure cluster nodes and is designed to run workloads at scale, we recommend building and testing workloads with high queue depth.

High queue depth can be achieved in several different ways in combination with clients, files, and threads. To determine the queue depth for your workload, multiply the number of clients by the number of files by the number of threads (clients * files * threads = queue depth).

The table below illustrates the various combinations you can use to achieve higher queue depth. While you can exceed the optimal queue depth of 64, we don't recommend it. You won't see any more performance gains if you do, and you risk increasing latency due to TCP saturation.

| **Clients** | **Files** | **Threads** | **Queue depth** |
|-------------|-----------|-------------|-----------------|
| 1           | 1         | 1           | 1               |
| 1           | 1         | 2           | 2               |
| 1           | 2         | 2           | 4               |
| 2           | 2         | 2           | 8               |
| 2           | 2         | 4           | 16              |
| 2           | 4         | 4           | 32              |
| 1           | 8         | 8           | 64              |
| 4           | 4         | 2           | 64              |

> [!TIP]
> To achieve upper performance limits, make sure that your workload or benchmarking test is multi-threaded with multiple files.

## Single versus multi-thread applications

Azure Files is best suited for multi-threaded applications. The easiest way to understand the performance impact that multi-threading has on a workload is to walk through the scenario by I/O. In the following example, we have a workload that needs to copy 10,000 small files as quickly as possible to or from an Azure file share.

This table breaks down the time needed (in milliseconds) to create a single 16 KiB file on an Azure file share, based on a single-thread application that's writing in 4 KiB block sizes. 

| **I/O operation** | **Create** | **4 KiB write** | **4 KiB write** | **4 KiB write** | **4 KiB write** | **Close** | **Total** |
|-------------------|------------|-----------------|-----------------|-----------------|-----------------|-----------|-----------|
| Thread 1          | 3 ms       | 2 ms            | 2 ms            | 2 ms            | 2 ms            | 3 ms      | **14 ms** |

In this example, it would take approximately 14 ms to create a single 16 KiB file from the six operations. If a single-threaded application wants to move 10,000 files to an Azure file share, that translates to 140,000 ms (14 ms * 10,000) or 140 seconds because each file is moved sequentially one at a time. Keep in mind that the time to service each request is primarily determined by how close the compute and storage are located to each other, as discussed in the previous section.

By using eight threads instead of one, the above workload can be reduced from 140,000 ms (140 seconds) down to 17,500 ms (17.5 seconds). As the table below shows, when you're moving eight files in parallel instead of one file at a time, you can move the same amount of data in 87.5% less time.

| **I/O operation** | **Create** | **4 KiB write** | **4 KiB write** | **4 KiB write** | **4 KiB write** | **Close** | **Total** |
|-------------------|------------|-----------------|-----------------|-----------------|-----------------|-----------|-----------|
| Thread 1          | 3 ms       | 2 ms            | 2 ms            | 2 ms            | 2 ms            | 3 ms      | **14 ms** |
| Thread 2          | 3 ms       | 2 ms            | 2 ms            | 2 ms            | 2 ms            | 3 ms      | **14 ms** |
| Thread 3          | 3 ms       | 2 ms            | 2 ms            | 2 ms            | 2 ms            | 3 ms      | **14 ms** |
| Thread 4          | 3 ms       | 2 ms            | 2 ms            | 2 ms            | 2 ms            | 3 ms      | **14 ms** |
| Thread 5          | 3 ms       | 2 ms            | 2 ms            | 2 ms            | 2 ms            | 3 ms      | **14 ms** |
| Thread 6          | 3 ms       | 2 ms            | 2 ms            | 2 ms            | 2 ms            | 3 ms      | **14 ms** |
| Thread 7          | 3 ms       | 2 ms            | 2 ms            | 2 ms            | 2 ms            | 3 ms      | **14 ms** |
| Thread 8          | 3 ms       | 2 ms            | 2 ms            | 2 ms            | 2 ms            | 3 ms      | **14 ms** |

## See also
- [Troubleshoot Azure file shares performance issues](/troubleshoot/azure/azure-storage/files-troubleshoot-performance?toc=/azure/storage/files/toc.json)
- [Monitoring Azure Files](storage-files-monitoring.md)
- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Understanding Azure Files billing](understanding-billing.md)
- [Azure Files pricing](https://azure.microsoft.com/pricing/details/storage/files/)
