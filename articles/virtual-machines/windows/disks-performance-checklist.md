---
title: Azure Disks performance checklist - Microsoft Azure | Microsoft Docs
description: Learn about how to design for a high performance application.
services: "virtual-machines-windows,storage"
author: roygara
ms.author: rogarana
ms.date: 12/04/2018
ms.topic: article
ms.service: virtual-machines-windows
ms.tgt_pltfrm: windows
ms.component: disks
---

# Performance Application Checklist for Disks

The first step in designing high-performance applications running on Azure Premium Storage is understanding the performance requirements of your application. After you have gathered performance requirements, you can optimize your application to achieve the most optimal performance.

In the [terminology article](disks-common-terms.md), we explained the common performance indicators, IOPS, Throughput, and Latency. You must identify which of these performance indicators are critical to your application to deliver the desired user experience. For example, high IOPS matters most to OLTP applications processing millions of transactions in a second. Whereas, high Throughput is critical for Data Warehouse applications processing large amounts of data in a second. Extremely low Latency is crucial for real-time applications like live video streaming websites.

Next, measure the maximum performance requirements of your application throughout its lifetime. Use the sample checklist below as a start. Record the maximum performance requirements during normal, peak, and off-hours workload periods. By identifying requirements for all workloads levels, you will be able to determine the overall performance requirement of your application. For example, the normal workload of an e-commerce website will be the transactions it serves during most days in a year. The peak workload of the website will be the transactions it serves during holiday season or special sale events. The peak workload is typically experienced for a limited period, but can require your application to scale two or more times its normal operation. Find out the 50 percentile, 90 percentile, and 99 percentile requirements. This helps filter out any outliers in the performance requirements and you can focus your efforts on optimizing for the right values.

## Application Performance Requirements Checklist

| **Performance requirements** | **50 Percentile** | **90 Percentile** | **99  Percentile** |
| --- | --- | --- | --- |
| Max. Transactions per second | | | |
| % Read operations | | | |
| % Write operations | | | |
| % Random operations | | | |
| % Sequential operations | | | |
| IO request size | | | |
| Average Throughput | | | |
| Max. Throughput | | | |
| Min. Latency | | | |
| Average Latency | | | |
| Max. CPU | | | |
| Average CPU | | | |
| Max. Memory | | | |
| Average Memory | | | |
| Queue Depth | | | |

> [!NOTE]
> You should consider scaling these numbers based on expected future growth of your application. It is a good idea to plan for growth ahead of time, because it could be harder to change the infrastructure for improving performance later.

If you have an existing application and want to move to Premium Storage, first build the checklist above for the existing application. Then, build a prototype of your application on Premium Storage and design the application based on guidelines described in *Optimizing Application Performance* in a later section of this document. The next article describes the tools you can use to gather the performance measurements.