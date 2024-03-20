---
title: Azure NetApp Files large volume performance benchmarks for Linux
description: Describes the tested performance capabilities of a single Azure NetApp Files large volume as it pertains to Linux use cases.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 05/01/2023
ms.author: anfdocs
---
# Azure NetApp Files large volume performance benchmarks for Linux

This article describes the tested performance capabilities of a single [Azure NetApp Files large volumes](large-volumes-requirements-considerations.md) as it pertains to Linux use cases. The tests explored scenarios for both scale-out and scale-up read and write workloads, involving one and many virtual machines (VMs). Knowing the performance envelope of large volumes helps you facilitate volume sizing.

## Test methodologies

* The Azure NetApp Files large volumes feature offers three service levels, each with throughput limits. The service levels can be scaled up or down nondisruptively as your performance needs change.  

    * Ultra service level: 10,240 MiB/s
    * Premium service level: 6,400 MiB/s
    * Standard service level: 1,600 MiB/s
    * The Ultra service level was used for these tests. 

* Sequential I/O: 100% sequential writes max out at 8,500 MiB/second, while a single large volume is capable of 10 GiB/second (10,240 MiB/second) throughput. 

* Random I/O: The same single large volume delivers over 700,000 operations per second. 

* Metadata-heavy workloads are advantageous for Azure NetApp File large volumes due to the large volume’s increased parallelism. Performance benefits are noticeable in workloads heavy in file creation, unlink, and file renames as typical with VCS applications, and EDA workloads where there are high file counts present. For more information on performance of high metadata workloads, see [Benefits of using Azure NetApp Files for electronic design automation](electronic-design-automation-benefits.md).

[FIO](https://fio.readthedocs.io/en/latest/fio_doc.html), a synthetic workload generator designed as a storage stress test, was used to drive these test results.

* There are fundamentally two models of storage performance testing:

    * **Scale-out compute**, which refers to using multiple VMs to generate the maximum load possible on a single Azure NetApp Files volume. 
    * **Scale-up compute**, which refers to using a large VM to test the upper boundaries of a single client on a single Azure NetApp Files volume. 
    
## Summary

* A single large volume can deliver sequential throughput up to the service level limits in all but the pure sequential write scenario. For sequential writes, the synthetic tests found the upper limit to be 8500 MiB/s.
<!-- * Using 8-KiB random workloads, 10,240 MiB/s isn't achievable. As such, more than 700,000 8-KiB operations were achieved. -->

As I/O types shift toward metadata intensive operations, the scenario changes again. Metadata workloads are particularly advantageous for Azure NetApp File large volumes. When you run workloads rich in file creation, unlink, and file renames, you can notice a significant amount of performance. Typical of such primitives are the VCS application and EDA workloads where files are created, renamed, or linked at very high rates. 

<!-- 
## Test methodologies and tools

All scenarios documented in this article used FIO, which is a synthetic workload generator designed as a storage stress test. For the purposes of this testing, we used storage stress tests.  

Fundamentally, there are two models of storage performance testing:

* **Application level**   
    For application-level testing, the efforts are to drive I/O through client buffer caches in the same way that a typical application drives I/O. In general, when testing in this manner, direct I/O isn't used.
    * Except for databases (for example, Oracle, SAP HANA, MySQL (InnoDB storage engine), PostgreSQL, and Teradata), few applications use direct I/O. Instead, most applications use a large memory cache for repeated reads and a write-behind cache for asynchronous writes.
    * SPECstorage 2020 (EDA, VDA, AI, genomics, and software build), HammerDB for SQL Server, and Login VSI are typical examples of application-level testing tools. None of them uses direct I/O.

* **Storage stress test**  
    The most common parameter used in storage performance benchmarking is direct I/O. It's supported by FIO and Vdbench. DISKSPD offers support for the similar construct of memory-mapped I/O. With direct I/O, the filesystem cache is bypassed, operations for direct memory access copy are avoided, and storage tests are made fast and simple.
    * Using the direct I/O parameter makes storage testing easy. No data is read from the filesystem cache on the client. As such, the test stresses the storage protocol and service itself rather than the memory access speeds. Also, without the DMA memory copies, read and write operations are efficient from a processing perspective.
    * Take the Linux `dd` command as an example workload. Without the optional `odirect` flag, all I/O generated by `dd` is served from the Linux buffer cache. Reads with the blocks already in memory aren't retrieved from storage. Reads resulting in a buffer-cache miss end up being read from storage using NFS read-ahead with varying results, depending on factors as mount `rsize` and client read-ahead tunables. When writes are sent through the buffer cache, they use a write-behind mechanism, which is untuned and uses a significant amount of parallelism to send the data to the storage device. You might attempt to run two independent streams of I/O, one `dd` for reads and one `dd` for writes. However, the operating system, being untuned, favors writes over reads and uses more parallelism for it.
    * Except for database, few applications use direct I/O. Instead, they take advantage of a large memory cache for repeated reads and a write-behind cache for asynchronous writes. In short, using direct I/O turns the test into a micro benchmark.
-->

## Linux scale-out test 

Tests observed performance thresholds of a single large volume on scale-out and were conducted with the following configuration:

| Component | Configuration |  
|- | - |
| Azure VM size | E32s_v5 |
| Azure VM egress bandwidth limit | 2000MiB/s (2GiB/s) |
| Operating system | RHEL 8.4 |
| Large volume size | 101 TiB Ultra (10,240 MiB/s throughput) |
| Mount options | hard,rsize=65536,wsize=65536,vers=3  <br /> **NOTE:** Use of both 262144 and 65536 had similar performance results. |

### 256 KiB sequential workloads (MiB/s) 

The graph represents a 256 KiB sequential workload and a 1 TiB working set. It shows that a single Azure NetApp Files large volume can handle between approximately 8,518 MiB/s pure sequential writes and 9,970 MiB/s pure sequential reads. 

:::image type="content" source="./media/performance-large-volumes-linux/256-kib-sequential-reads.png" alt-text="Bar chart of a 256-KiB sequential workload on a large volume." lightbox="./media/performance-large-volumes-linux/256-kib-sequential-reads.png":::

### 8-KiB random workload (IOPS)

The graph represents an 8-KiB random workload and a 1 TiB working set. The graph shows that an Azure NetApp Files large volume can handle between approximately 474,000 pure random writes and approximately 709,000 pure random reads.

:::image type="content" source="./media/performance-large-volumes-linux/random-workload-chart.png" alt-text="Bar chart of a random workload on a large volume." lightbox="./media/performance-large-volumes-linux/random-workload-chart.png":::


## Linux scale-up tests 

Whereas scale-out tests are designed to find the limits of a single large volume, scale-up tests are designed to find the upper limits of a single instance against said large volume. Azure places network egress limits on its VMs; for network attached storage that means that the write bandwidth is capped per VM. These scale-up tests demonstrate capabilities given the large available bandwidth cap and with sufficient processors to drive said workload. 

The tests in this section were run with the following configuration: 

| Component | Configuration |  
|- | - |
| Azure VM size | E104id_v5  |
| Azure VM egress bandwidth limit | 12,500MiB/s (12.2GiB/s)  |
| Operating system | RHEL 8.4 |
| Large volume size | 101 TiB Ultra (10,240 MiB/s throughput) |
| Mount options | hard,rsize=65536,wsize=65536,vers=3  <br /> **NOTE:** Use of both 262144 and 65536 had similar performance results |

The graphs in this section show the results for the client-side mount option of `nconnect` with NFSv3. For more information, see [Linux NFS mount options best practices for Azure NetApp File](performance-linux-mount-options.md#nconnect).

The following graphs compare the advantages of `nconnect` with an NFS-mounted volume without `nconnect`. In the tests, FIO generated the workload from a single E104id-v5 instance in the East US Azure region using a 64-KiB sequential workload; a 256 I/0 size was used, which is the largest I/O size recommended by Azure NetApp Files resulted in comparable performance numbers. For more information, see [`rsize` and `wsize`](performance-linux-mount-options.md#rsize-and-wsize). 


### Linux read throughput 

The following graphs show 256-KiB sequential reads of ~10,000MiB/s with `nconnect`, which is roughly ten times the throughput achieved without `nconnect`.  

Note that 10,000 MiB/s bandwidth is offered by a large volume in the Ultra service level. 

:::image type="content" source="./media/performance-large-volumes-linux/throughput-comparison-nconnect.png" alt-text="Comparison of read throughput with and without nconnect." lightbox="./media/performance-large-volumes-linux/throughput-comparison-nconnect.png":::

### Linux write throughput

The following graphs show sequential writes. Using `nconnect` provides observable benefits for sequential writes at 6,600 MiB/s, roughly four times that of mounts without `nconnect`. 

:::image type="content" source="./media/performance-large-volumes-linux/write-throughput-comparison.png" alt-text="Comparison of write throughput with and without nconnect." lightbox="./media/performance-large-volumes-linux/write-throughput-comparison.png":::


### Linux read IOPS

The following graphs show 8-KiB random reads of ~426,000 read IOPS with `nconnect`, roughly seven times what is observed without `nconnect`. 


:::image type="content" source="./media/performance-large-volumes-linux/read-iops-comparison.png" alt-text="Charts comparing read IOPS with and without IOPS." lightbox="./media/performance-large-volumes-linux/read-iops-comparison.png":::

### Linux write IOPS

The following graphs show 8-KiB random writes of ~405,000 write IOPS with `nconnect`, roughly 7.2 times that what is observed without `nconnect`.

:::image type="content" source="./media/performance-large-volumes-linux/write-iops-comparison.png" alt-text="Charts comparing write IOPS with and without IOPS." lightbox="./media/performance-large-volumes-linux/write-iops-comparison.png":::

## Next steps

* [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md)
* [Linux NFS mount options best practices for Azure NetApp Files](performance-linux-mount-options.md)
* [Benefits of using Azure NetApp Files for electronic design automation](electronic-design-automation-benefits.md)