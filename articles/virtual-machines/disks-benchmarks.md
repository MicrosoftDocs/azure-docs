---
title: Benchmark your application on Azure Disk Storage
description: Learn about the process of benchmarking your application on Azure.
author: roygara
ms.author: rogarana
ms.date: 06/29/2021
ms.topic: how-to
ms.service: azure-disk-storage
---
# Benchmark a disk

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Benchmarking is the process of simulating different workloads on your application and measuring the application performance for each workload. Using the steps described in the [designing for high performance article](premium-storage-performance.md), you have gathered the application performance requirements. By running benchmarking tools on the VMs hosting the application, you can determine the performance levels that your application can achieve with premium SSDs. In this article, we provide you examples of benchmarking a Standard_D8ds_v4 VM provisioned with Azure premium SSDs.

We have used common benchmarking tools DiskSpd and FIO, for Windows and Linux respectively. These tools spawn multiple threads simulating a production like workload, and measure the system performance. Using the tools you can also configure parameters like block size and queue depth, which you normally cannot change for an application. This gives you more flexibility to drive the maximum performance on a high scale VM provisioned with premium SSDs for different types of application workloads. To learn more about each benchmarking tool visit [DiskSpd](https://github.com/Microsoft/diskspd/wiki/) and [FIO](https://github.com/axboe/fio).

To follow the examples below, create a Standard_D8ds_v4 and attach four premium SSDs to the VM. Of the four disks, configure three with host caching as "None" and stripe them into a volume called NoCacheWrites. Configure host caching as "ReadOnly" on the remaining disk and create a volume called CacheReads with this disk. Using this setup, you are able to see the maximum Read and Write performance from a Standard_D8ds_v4 VM. For detailed steps about creating a Standard_D8ds_v4 with premium SSDs, see [Designing for high performance](premium-storage-performance.md).

[!INCLUDE [virtual-machines-disks-benchmarking](../../includes/virtual-machines-managed-disks-benchmarking.md)]

## Next steps

Proceed to our article on [designing for high performance](premium-storage-performance.md).

In that article, you create a checklist similar to your existing application for the prototype. Using Benchmarking tools you can simulate the workloads and measure performance on the prototype application. By doing so, you can determine which disk offering can match or surpass your application performance requirements. Then you can implement the same guidelines for your production application.
