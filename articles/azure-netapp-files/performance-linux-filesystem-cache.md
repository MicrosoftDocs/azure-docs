---
title: Linux filesystem cache best practices for Azure NetApp Files | Microsoft Docs
description: Describes Linux filesystem cache best practices to follow for Azure NetApp Files.  
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
ms.date: 07/02/2021
ms.author: anfdocs
---
# Linux filesystem cache best practices for Azure NetApp Files

This article helps you understand filesystem cache best practices for Azure NetApp Files.  

## Filesystem cache tunables

You need to understand the following factors about filesystem cache tunables:  

* Flushing a dirty buffer leaves the data in a clean state usable for future reads until memory pressure leads to eviction.  
* There are three triggers for an asynchronous flush operation:
    * Time based: When a buffer reaches the age defined by this tunable, it must be marked for cleaning (that is, flushing, or writing to storage).
    * Memory pressure: See [`vm.dirty_ratio | vm.dirty_bytes`](#vmdirty_ratio--vmdirty_bytes) for details.
    * Close: When a file handle is closed, all dirty buffers are asynchronously flushed to storage.

These factors are controlled by four tunables. Each tunable can be tuned dynamically and persistently using `tuned` or `sysctl` in the `/etc/sysctl.conf` file. Tuning these variables improves performance for applications.  

> [!NOTE]
> Information discussed in this article was uncovered during SAS GRID and SAS Viya validation exercises. As such, the tunables are based on lessons learned from the validation exercises. Many applications will similarly benefit from tuning these parameters.

### `vm.dirty_ratio | vm.dirty_bytes` 

These two tunables define the amount of RAM made usable for data modified but not yet written to stable storage.  Whichever tunable is set automatically sets the other tunable to zero; RedHat advises against manually setting either of the two tunables to zero.  The option `vm.dirty_ratio` (the default of the two) is set by Redhat to either 20% or 30% of physical memory depending on the OS, which is a significant amount considering the memory footprint of modern systems. Consideration should be given to setting `vm.dirty_bytes` instead of `vm.dirty_ratio` for a more consistent experience regardless of memory size.  For example, ongoing work with SAS GRID determined 30 MiB an appropriate setting for best overall mixed workload performance. 

### `vm.dirty_background_ratio | vm.dirty_background_bytes` 

These tunables define the starting point where the Linux write-back mechanism begins flushing dirty blocks to stable storage. Redhat defaults to 10% of physical memory, which, on a large memory system, is a significant amount of data to start flushing. Taking SAS GRID for example, historically the recommendation has been to set `vm.dirty_background` to 1/5 size of `vm.dirty_ratio`  or `vm.dirty_bytes`. Considering how aggressively the `vm.dirty_bytes` setting is set for SAS GRID, no specific value is being set here.  

### `vm.dirty_expire_centisecs` 

This tunable defines how old a dirty buffer can be before it must be tagged for asynchronously writing out.  Take  SAS Viya’s CAS workload for example. An ephemeral write-dominant workload found that setting this value to 300 centiseconds (3 seconds) was optimal, with 3000 centiseconds (30 seconds) being the default.  

SAS Viya shares CAS data into multiple small chunks of a few megabytes each.  Rather than closing these file handles after writing data to each shard, the handles are left open and the buffers within are memory-mapped by the application.  Without a close, there will be no flush until either memory pressure or 30 seconds has passed. Waiting for memory pressure proved suboptimal as did waiting for a long timer to expire. Unlike SAS GRID, which looked for the best overall throughput, SAS Viya looked to optimize write bandwidth.  

### `vm.dirty_writeback_centisecs` 

The kernel flusher thread is responsible for asynchronously flushing dirty buffers between each flush thread sleeps.  This tunable defines the amount spent sleeping between flushes.  Considering the 3-second `vm.dirty_expire_centisecs` value used by SAS Viya, SAS set this tunable to 100 centiseconds (1 second) rather than the 500 centiseconds (5 seconds) default to find the best overall performance.

## Impact of an untuned filesystem cache

Considering the default virtual memory tunables and the amount of RAM in modern systems, write-back potentially slows down other storage-bound operations from the perspective of the specific client driving this mixed workload.  The following symptoms may be expected from an untuned, write-heavy, cache-laden Linux machine.  

* Directory lists `ls` take long enough as to appear unresponsive.
* Read throughput against the filesystem decreases significantly in comparison to write throughput.
* `nfsiostat` reports write latencies **in seconds or higher**.

You might experience this behavior only by *the Linux machine* performing the mixed write-heavy workload.  Further, the experience is degraded against all NFS volumes mounted against a single storage endpoint.  If the mounts come from two or more endpoints, only the volumes sharing an endpoint exhibit this behavior.

Setting the filesystem cache parameters as described in this section has been shown to address the issues.

## Monitoring virtual memory

To understand what is going with virtual memory and the write-back, consider the following code snippet and output.  *Dirty* represents the amount dirty memory in the system, and *writeback* represents the amount of memory actively being written to storage.  

`# while true; do echo "###" ;date ; egrep "^Cached:|^Dirty:|^Writeback:|file" /proc/meminfo; sleep 5; done`

The following output comes from an experiment where the `vm.dirty_ratio` and the `vm.dirty_background` ratio were set to 2% and 1% of physical memory respectively.  In this case, flushing began at 3.8 GiB, 1% of the 384-GiB memory system.  Writeback closely resembled the write throughput to NFS. 

```
Cons
Dirty:                                    1174836 kB
Writeback:                         4 kB
###
Dirty:                                    3319540 kB
Writeback:                         4 kB
###
Dirty:                                    3902916 kB        <-- Writes to stable storage begins here
Writeback:                         72232 kB   
###
Dirty:                                    3131480 kB
Writeback:                         1298772 kB   
``` 

## Next steps  

* [Linux direct I/O best practices for Azure NetApp Files](performance-linux-direct-io.md)
* [Linux NFS mount options best practices for Azure NetApp Files](performance-linux-mount-options.md)
* [Linux concurrency best practices for Azure NetApp Files](performance-linux-concurrency-session-slots.md)
* [Linux NFS read-ahead best practices](performance-linux-nfs-read-ahead.md)
* [Azure virtual machine SKUs best practices](performance-virtual-machine-sku.md) 
* [Performance benchmarks for Linux](performance-benchmarks-linux.md) 
