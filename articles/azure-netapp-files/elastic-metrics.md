---
title: Metrics for Azure NetApp Files Elastic zone-redundant service level
description: Learn about the metrics available for Elastic zone-redundant storage.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 01/26/2026
ms.author: anfdocs
# Customer intent: As an IT administrator managing Azure NetApp Files, I want to understand the monitoring capabilities for my Elastic zone-redundant service level deployment. 
---

# Metrics for Azure NetApp Files' Elastic zone-redundant service level 

Azure NetApp Files provides metrics on allocated storage, actual storage usage, volume I/OPS, and latency. By analyzing these metrics, you can gain a better understanding on the usage pattern and volume performance of your NetApp accounts. 

>[!IMPORTANT]
>These metrics are for Elastic zone-redundant service level. For the Flexible, Standard, Premium, and Ultra services levels, see [Azure NetApp Files metrics](azure-netapp-files-metrics.md).

## Usage metrics for capacity pools

- **Pool allocated size**
    The provisioned size of the pool.

- **Pool Allocated to Volume Size**  

    The total of volume quota (GiB) in a given capacity pool (that is, the total of the volumes' provisioned sizes in the capacity pool).  
    This size is the size you selected during volume creation.  

- **Pool Consumed Size**  
    The total of logical space (GiB) used across volumes in a capacity pool.  

- **Total Snapshot Size for the Pool**    
    The sum of snapshot size from all volumes in the pool.

## Usage metrics for volumes 

- **Percentage Volume Consumed Size**

    The percentage of the volume consumed, including snapshots.  
    Aggregation metrics (for example, min, max) aren't supported for percentage volume consumed size.

- **Volume Allocated Size** 
  
    The provisioned size of a volume

- **Volume Consumed Size**   

    Logical size of the volume (used bytes).  
    This size includes logical space used by active file systems and snapshots. 

- **Volume Snapshot Size**   
 
   The size of all snapshots in a volume.  

## Performance metrics for volumes

> [!NOTE] 
> Volume latency for Average Read Latency and Average Write Latency is measured within the storage service and doesn't include network latency.

- **Average Read Latency**   
    The average roundtrip time (RTT) for reads from the volume in milliseconds.
- **Average Write Latency**   
    The average roundtrip time (RTT) for writes from the volume in milliseconds.
- **Read IOPS**   
    The number of read operations to the volume per second.
- **Write IOPS**   
    The number of write operations to the volume per second.
- **Other IOPS** 

    The number of [other operations](azure-netapp-files-metrics.md#about-storage-performance-operation-metrics) to the volume per second. 

- **Total IOPS**

    A sum of the write, read, and other operations to the volume per second. 

## Throughput metrics for capacity pools

- **Pool allocated throughput**    
    Sum of the throughput of all the volumes belonging to the pool.
    
- **Provisioned throughput for the pool**   
    Provisioned throughput of this pool.


## Throughput metrics for volumes

- **Read throughput**   

    Read throughput in bytes per second.
    
- **Write throughput**    

    Write throughput in bytes per second.

- **Other throughput**   

    Other throughput (that isn't read or write) in bytes per second.

- **Total throughput**

    Sum of all throughput (read, write, and other) in bytes per second.

## Volume backup metrics 

- **Is Volume Backup Enabled**   

    Shows whether backup is enabled for the volume. `1` is enabled. `0` is disabled.

- **Is Volume Backup Operation Complete**   

    Shows whether the last volume backup or restore operation is successfully completed.  `1` is successful. `0` is unsuccessful.

- **Is Volume Backup Suspended**   

    Shows whether the backup policy is suspended for the volume. A value of  `1` means it's not suspended. A value of `0` means it's suspended.

- **Volume Backup Bytes**   

    The total bytes backed up for this volume.

- **Volume Backup Operation Last Transferred Bytes**   

    Total bytes transferred for last backup operation.

- **Volume Backup Restore Operation Last Transferred Bytes**   

    Total bytes transferred for last backup restore operation.
