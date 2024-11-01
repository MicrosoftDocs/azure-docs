---
title: Azure NetApp Files performance benchmarks for Linux | Microsoft Docs
description: Describes performance benchmarks Azure NetApp Files delivers for Linux with a regular volume.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.custom: linux-related-content
ms.topic: conceptual
ms.date: 10/31/2024
ms.author: anfdocs
---
# Azure NetApp Files regular volume performance benchmarks for Linux

This article describes performance benchmarks Azure NetApp Files delivers for Linux with a [regular volume](azure-netapp-files-understand-storage-hierarchy.md#volumes).


## Whole file streaming workloads (scale-out benchmark tests)

The intent of a scale-out test is to show the performance of an Azure NetApp File volume when scaling out (or increasing) the number of clients generating simultaneous workload to the same volume. These tests are generally able to push a volume to the edge of its performance limits and are indicative of workloads such as media rendering, AI/ML, and other workloads that utilize large compute farms to perform work. 

## High IOP scale-out benchmark configuration 

These benchmarks used the following: 
- A single Azure NetApp Files 100-TiB regular volume with a 1-TiB dataset using the Ultra performance tier 
- [FIO (with and without setting randrepeat=0)](testing-methodology.md)
- 4-KiB and 8-KiB block sizes 
- 6 D32s_v5 virtual machines running RHEL 9.3 
- NFSv3  
- [Manual QoS](manage-manual-qos-capacity-pool.md)
- Mount options: rw,nconnect=8,hard,rsize=262144,wsize=262144,vers=3,tcp,bg 

## High throughput scale-out benchmark configuration 

These benchmarks used the following: 

- A single Azure NetApp Files regular volume with a 1-TiB dataset using the Ultra performance tier 
FIO (with and without setting randrepeat=0) 
- [FIO (with and without setting randrepeat=0)](testing-methodology.md)
- 64-KiB and 256-KiB block size 
- 6 D32s_v5 virtual machines running RHEL 9.3 
- NFSv3  
- [Manual QoS](manage-manual-qos-capacity-pool.md)
- Mount options: rw,nconnect=8,hard,rsize=262144,wsize=262144,vers=3,tcp,bg 

## Parallel network connection (`nconnect`) benchmark configuration 

These benchmarks used the following: 
- A single Azure NetApp Files regular volume with a 1-TiB dataset using the Ultra performance tier 
- FIO (with and without setting randrepeat=0) 
- 4-KiB and 64-KiB wsize/rsize 
- A single D32s_v4 virtual machine running RHEL 9.3 
- NFSv3 with and without `nconnect` 
- Mount options: rw,nconnect=8,hard,rsize=262144,wsize=262144,vers=3,tcp,bg 

## Scale-up benchmark tests

The scale-up test’s intent is to show the performance of an Azure NetApp File volume when scaling up (or increasing) the number of jobs generating simultaneous workload across multiple TCP connections on a single client to the same volume (such as with [`nconnect`](performance-linux-mount-options.md#nconnect)). 

Without `nconnect`, these workloads can't push the limits of a volume’s maximum performance, since the client can't generate enough IO or network throughput. These tests are generally indicative of what a single user’s experience might be in workloads such as media rendering, databases, AI/ML, and general file shares.

## High IOP scale-out benchmarks

The following benchmarks show the performance achieved for Azure NetApp Files with a high IOP workload using: 

- 32 clients 
- 4-KiB and 8-KiB random reads and writes 
- 1-TiB dataset 
- Read/write ratios as follows: 100%:0%, 90%:10%, 80%:20%, and so on 
- With and without filesystem caching involved (using `randrepeat=0` in FIO) 

For more information, see [Testing methodology](testing-methodology.md).

## Results: 4-KiB, random, client caching included

In this benchmark, FIO ran without the `randrepeat` option to randomize data. Thus, an indeterminate amount of caching came into play. This configuration results in slightly better overall performance numbers than tests run without caching with the entire IO stack being utilized. 

In the following graph, testing shows an Azure NetApp Files regular volume can handle between approximately 130,000 pure random 4-KiB writes and approximately 460,000 pure random 4 KiB reads during this benchmark. Read-write mix for the workload adjusted by 10% for each run.  

As the read-write IOP mix increases towards write-heavy, the total IOPS decrease.  

<!-- 4k random iops graph -->

## Results: 4-KiB, random, client caching excluded

In this benchmark, FIO was run with the setting `randrepeat=0` to randomize data, reducing the caching influence on performance. This resulted in an approximately 8% reduction in write IOPS and an approximately 17% reduction in read IOPS, but displays performance numbers more representative of what the storage can actually do. 

In the following graph, testing shows an Azure NetApp Files regular volume can handle between approximately 120,000 pure random 4-KiB writes and approximately 388,000 pure random 4-KiB reads. Read-write mix for the workload adjusted by 25% for each run. 

As the read-write IOP mix increases towards write-heavy, the total IOPS decrease.   
<!-- -->

## Results: 8-KiB, random, client caching excluded

Larger read and write sizes will result in fewer total IOPS, as more data can be sent with each operation. An 8-KiB read and write size was used to more accurately simulate what most modern applications use. For instance, many EDA applications utilize 8-KiB reads and writes. 

In this benchmark, FIO ran with `randrepeat=0` to randomize data so the client caching impact was reduced. In the following graph, testing shows that an Azure NetApp Files regular volume can handle between approximately 111,000 pure random 8-KiB writes and approximately 293,000 pure random 8-KiB reads. Read-write mix for the workload adjusted by 25% for each run. 

As the read-write IOP mix increases towards write-heavy, the total IOPS decrease. 

## Side-by-side comparisons 

To illustrate how caching can influence the performance benchmark tests, the following graph shows total I/OPS for 4-KiB tests with and without caching mechanisms in place. As shown, caching provides a slight performance boost for I/OPS fairly consistent trending. 

## Specific offset, streaming random read/write workloads: scale-up tests using parallel network connections (`nconnect`)

The following tests show a high IOP benchmark using a single client with 4-KiB random workloads and a 1-TiB dataset. The workload mix generated uses a different I/O depth each time. To boost the performance for a single client workload, the [`nconnect` mount option](performance-linux-mount-options.md#nconnect) was used to improve parallelism in comparison to client mounts without the `nconnect` mount option. 

When using a standard TCP connection that provides only a single path to the storage, fewer total operations are sent per second than when a mount is able to leverage more TCP connections (such as with `nconnect`) per mount point. When using `nconnect`, the total latency for the operations is generally lower. These tests are also run with `randrepeat=0` to intentionally avoid caching. For more information on this option, see [Testing methodology](testing-methodology.md).

### Results: 4-KiB, random, with and without `nconnect`, caching excluded

The following graphs show a side-by-side comparison of 4-KiB reads and writes with and without `nconnect` to highlight the performance improvements seen when using `nconnect`: higher overall IOPS, lower latency. 

## High throughput benchmarks 

The following benchmarks show the performance achieved for Azure NetApp Files with a high throughput workload. 

High throughput workloads are more sequential in nature and often are read/write heavy with low metadata. Throughput is generally more important than I/OPS. These workloads typically leverage larger read/write sizes (64K to 256K), which generate higher latencies than smaller read/write sizes, since larger payloads will naturally take longer to be processed. 

Examples of high throughput workloads include: 

- Media repositories 
- High performance compute 
- AI/ML/LLP 

The following tests show a high throughput benchmark using both 64-KiB and 256-KiB sequential workloads and a 1-TiB dataset. The workload mix generated decreases a set percentage at a time and demonstrates what you can expect when using varying read/write ratios (for instance, 100%:0%, 90%:10%, 80%:20%, and so on). 

### Results: 64-KiB sequential I/O, caching included

In this benchmark, FIO ran using looping logic that more aggressively populated the cache, so an indeterminate amount of caching influenced the results. This results in slightly better overall performance numbers than tests run without caching.  

In the graph below, testing shows that an Azure NetApp Files regular volume can handle between approximately 4,500MiB/s pure sequential 64-KiB reads and approximately 1,600MiB/s pure sequential 64-KiB writes. The read-write mix for the workload was adjusted by 10% for each run.  


### Results: 64-KiB sequential I/O, caching excluded

In this benchmark, FIO ran using looping logic that less aggressively populated the cache. Client caching didn't influence the results. This configuration results in slightly better write performance numbers, but lower read numbers than tests without caching.  

In the following graph, testing demonstrates that an Azure NetApp Files regular volume can handle between approximately 3,600MiB/s pure sequential 64-KiB reads and approximately 2,400MiB/s pure sequential 64-KiB writes. During the tests, a 50/50 mix showed total throughput on par with a pure sequential read workload. 

The read-write mix for the workload was adjusted by 25% for each run.  

### Results: 256-KiB sequential I/O, caching excluded

In this benchmark, FIO ran using looping logic that less aggressively populated the cache, so caching didn't influence the results. This configuration results in slightly less write performance numbers than 64-KiB tests, but higher read numbers than the same 64-KiB tests run without caching.  

In the graph below, testing shows that an Azure NetApp Files regular volume can handle between approximately 3,500MiB/s pure sequential 256-KiB reads and approximately 2,500MiB/s pure sequential 256-KiB writes. During the tests, a 50/50 mix showed total throughput peaked higher than a pure sequential read workload. 

The read-write mix for the workload was adjusted in 25% increments for each run.  

### Side-by-side comparison 

To better show how caching can influence the performance benchmark tests, the following graph shows total MiB/s for 64-KiB tests with and without caching mechanisms in place. Caching provides an initial slight performance boost for total MiB/s because caching generally improves reads more so than writes. As the read/write mix changes, the total throughput without caching exceeds the results that utilize client caching.  

## Parallel network connections (`nconnect`) 

The following tests show a high IOP benchmark using a single client with 64-KiB random workloads and a 1-TiB dataset. The workload mix generated uses a different I/O depth each time. To boost the performance for a single client workload, the `nconnect` mount option was leveraged for better parallelism in comparison to client mounts that didn't use the `nconnect` mount option. These tests were run only with caching excluded. 

### Results: 64-KiB, sequential, caching excluded, with and without `nconnect`

The following results show a scale-up test’s results when reading and writing in 4-KiB chunks on a NFSv3 mount on a single client with and without parallelization of operations (`nconnect`). The graphs show that as the I/O depth grows, the I/OPS also increase. But when using a standard TCP connection that provides only a single path to the storage, fewer total operations are sent per second than when a mount is able to leverage more TCP connections per mount point. In addition, the total latency for the operations is generally lower when using `nconnect`. 

### Side-by-side comparison (with and without `nconnect`) 

The following graphs show a side-by-side comparison of 64-KiB sequential reads and writes with and without `nconnect` to highlight the performance improvements seen when using `nconnect`: higher overall throughput, lower latency. 

## More information

- [Testing methodology](testing-methodology.md)

<!-- -->


## Linux scale-out

This section describes performance benchmarks of Linux workload throughput and workload IOPS.

### Linux workload throughput  

This graph represents a 64 kibibyte (KiB) sequential workload and a 1 TiB working set. It shows that a single Azure NetApp Files volume can handle between approximately 1,600 MiB/s pure sequential writes and approximately 4,500 MiB/s pure sequential reads.  

The graph illustrates decreases in 10% at a time, from pure read to pure write. It demonstrates what you can expect when using varying read/write ratios (100%:0%, 90%:10%, 80%:20%, and so on).

![Linux workload throughput](./media/performance-benchmarks-linux/performance-benchmarks-linux-workload-throughput.png)  

### Linux workload IOPS  

The following graph represents a 4-KiB random workload and a 1 TiB working set. The graph shows that an Azure NetApp Files volume can handle between approximately 130,000 pure random writes and approximately 460,000 pure random reads.  

This graph illustrates decreases in 10% at a time, from pure read to pure write. It demonstrates what you can expect when using varying read/write ratios (100%:0%, 90%:10%, 80%:20%, and so on).

![Linux workload IOPS](./media/performance-benchmarks-linux/performance-benchmarks-linux-workload-iops.png)  

## Linux scale-up  

The graphs in this section show the validation testing results for the client-side mount option with NFSv3. For more information, see [`nconnect` section of Linux mount options](performance-linux-mount-options.md#nconnect).

The graphs compare the advantages of `nconnect` to a non-`connected` mounted volume. In the graphs, FIO generated the workload from a single D32s_v4 instance in the us-west2 Azure region using a 64-KiB sequential workload – the largest I/O size supported by Azure NetApp Files at the time of the testing represented here. Azure NetApp Files now supports larger I/O sizes. For more information, see [`rsize` and `wsize` section of Linux mount options](performance-linux-mount-options.md#rsize-and-wsize).

### Linux read throughput  

The following graphs show 64-KiB sequential reads of approximately 3,500 MiB/s reads with `nconnect`, roughly 2.3X non-`nconnect`.

![Linux read throughput](./media/performance-benchmarks-linux/performance-benchmarks-linux-read-throughput.png)  

### Linux write throughput  

The following graphs show sequential writes. They indicate that `nconnect` has no noticeable benefit for sequential writes. The sequential write volume upper limit is approximately 1,500 MiB/s; the D32s_v4 instance egress limit is also approximately 1,500 MiB/s.

![Linux write throughput](./media/performance-benchmarks-linux/performance-benchmarks-linux-write-throughput.png)  

### Linux read IOPS  

The following graphs show 4-KiB random reads of approximately 200,000 read IOPS with `nconnect`, roughly 3X non-`nconnect`.

![Linux read IOPS](./media/performance-benchmarks-linux/performance-benchmarks-linux-read-iops.png)  

### Linux write IOPS  

The following graphs show 4-KiB random writes of approximately 135,000 write IOPS with `nconnect`, roughly 3X non-`nconnect`.

![Linux write IOPS](./media/performance-benchmarks-linux/performance-benchmarks-linux-write-iops.png)  

## Next steps

- [Azure NetApp Files: Getting the Most Out of Your Cloud Storage](https://cloud.netapp.com/hubfs/Resources/ANF%20PERFORMANCE%20TESTING%20IN%20TEMPLATE.pdf?hsCtaTracking=f2f560e9-9d13-4814-852d-cfc9bf736c6a%7C764e9d9c-9e6b-4549-97ec-af930247f22f)
