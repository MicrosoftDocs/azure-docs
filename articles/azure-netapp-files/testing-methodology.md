---
title: Understand performance testing methodology in Azure NetApp Files
description: Learn how Azure NetApp Files benchmark tests are conducted. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 10/31/2024
ms.author: anfdocs
---

# Understand performance testing methodology in Azure NetApp Files

The benchmark tool used in these tests is called [Flexible I/O Tester (FIO)](https://fio.readthedocs.io/en/latest/fio_doc.html).  

When testing the edges of performance limits for storage, workload generation must be **highly parallelized** to achieve the maximum results possible.  

That means: 
- one, to many clients 
- multiple CPUs 
- multiple threads  
- performing I/O to multiple files  
- multi-threaded network connections (such as nconnect) 

The end goal is to push the storage system as far as it can go before operations must begin to wait for other operations to finish. Use of a single client traversing a single network flow, or reading/writing from/to a single file (for instance, using dd or diskspd on a single client) doesn't deliver results indicative of Azure NetApp Files' capability. Instead, these setups show the performance of a single file, which generally trends with line speed and/or the Azure NetApp File [QoS settings](azure-netapp-files-understand-storage-hierarchy.md#qos_types). 

In addition, caching must be minimized as much as possible to achieve accurate, representative results of what the storage can accomplish. However, caching is a very real tool for modern applications to perform at their absolute best. These cover scenarios with some caching and with caching bypassed for random I/O workloads by using randomization of the workload via FIO options (specifically, `randrepeat=0` to prevent caching on the storage and [directio](performance-linux-direct-io.md) to prevent client caching). 

## About Flexible I/O tester 

Flexible I/O tester (FIO) is an open source workload generation tool commonly used for storage benchmarking due to its ease of use and flexibility in defining workload patterns. For information about its use with Azure NetApp Files, see [Performance benchmark test recommendations for Azure NetApp Files](azure-netapp-files-performance-metrics-volumes.md).

### Installation of FIO

Follow the Binary Packages section in the [FIO README file](https://github.com/axboe/fio#readme) to install for the platform of your choice.

### FIO examples for IOPS 

The FIO examples in this section use the following setup:
* VM instance size: D32s_v3
* Capacity pool service level and size: Premium / 50 TiB
* Volume quota size: 48 TiB

The following examples show the FIO random reads and writes.

#### FIO: 8k block size 100% random reads

`fio --name=8krandomreads --rw=randread --direct=1 --ioengine=libaio --bs=8k --numjobs=4 --iodepth=128 --size=4G --runtime=600 --group_reporting`

#### FIO: 8k block size 100% random writes

`fio --name=8krandomwrites --rw=randwrite --direct=1 --ioengine=libaio --bs=8k --numjobs=4 --iodepth=128  --size=4G --runtime=600 --group_reporting`

#### Benchmark results

For official benchmark results for how FIO performs in Azure NetApp Files, see [Azure NetApp Files performance benchmarks for Linux](performance-benchmarks-linux.md).

### FIO examples for bandwidth

The examples in this section show the FIO sequential reads and writes.

#### FIO: 64k block size 100% sequential reads

`fio --name=64kseqreads --rw=read --direct=1 --ioengine=libaio --bs=64k --numjobs=4 --iodepth=128  --size=4G --runtime=600 --group_reporting`

#### FIO: 64k block size 100% sequential writes

`fio --name=64kseqwrites --rw=write --direct=1 --ioengine=libaio --bs=64k --numjobs=4 --iodepth=128  --size=4G --runtime=600 --group_reporting`

#### Benchmark results

For official benchmark results for how FIO performs in Azure NetApp Files, see [Azure NetApp Files performance benchmarks for Linux](performance-benchmarks-linux.md).

## Caching with FIO 

FIO can be run with specific options to control how a performance benchmark reads and writes files. In the benchmarks tests with caching excluded, the FIO flag `randrepeat=0` was used to avoid caching by running a true random workload rather than a repeated pattern. 

**[`randrepeat`]https://fio.readthedocs.io/en/latest/fio_doc.html#i-o-type)**

By default, when `randrepeat` isn't defined, the FIO tool sets the value to "true," meaning that the data produced in the files isn't truly random. Thus, filesystem caches aren't utilized to improve overall performance of the workload.  

In earlier benchmarks for Azure NetApp Files, `randrepeat` wasn't defined, so some filesystem caching was implemented. In more up-to-date tests, this option is set to “0” (false) to ensure there is adequate randomness in the data to avoid filesystem caches in the Azure NetApp Files service. This modification results in slightly lower overall numbers, but is a more accurate representation of what the storage service is capable of when caching is bypassed. 

## Next steps 

* [Performance benchmark test recommendations for Azure NetApp Files](azure-netapp-files-performance-metrics-volumes.md)
* [Azure NetApp Files regular volume performance benchmarks for Linux](performance-benchmarks-linux.md)
* [Azure NetApp Files large volume performance benchmarks for Linux](performance-large-volumes-linux.md)

