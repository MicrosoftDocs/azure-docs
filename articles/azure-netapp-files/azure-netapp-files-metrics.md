---
title: Metrics for Azure NetApp Files | Microsoft Docs
description: Azure NetApp Files provides metrics on allocated storage, actual storage usage, volume IOPS, and latency. Use these metrics to understand usage and performance.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 07/19/2023
ms.author: anfdocs
---
# Metrics for Azure NetApp Files

Azure NetApp Files provides metrics on allocated storage, actual storage usage, volume IOPS, and latency. By analyzing these metrics, you can gain a better understanding on the usage pattern and volume performance of your NetApp accounts.  

## Definitions 

Understanding the terminology related to performance and capacity in Azure NetApp Files is essential to understanding the metrics available:  

- **Capacity pool**: A capacity pool is how capacity is billed in Azure NetApp Files. Capacity pools contain volume. 
- **Volume quota**: The amount of capacity provisioned to an Azure NetApp Files volume. Volume quota is directly tied to automatic Quality of Service (QoS), which impacts the volume performance. For more information, see [QoS types for capacity pools](azure-netapp-files-understand-storage-hierarchy.md#qos_types).
- **Throughput**: The amount of data transmitted across the wire (read/write/other) between Azure NetApp Files and the client. Throughput in Azure NetApp Files is measured in bytes per second. 
- **Latency**: Latency is the amount of time for a storage operation to complete within storage from the time it arrives to the time it's processed and is ready to be sent back to the client. Latency in Azure NetApp Files is measured in milliseconds (ms). 

## About storage performance operation metrics 

An operation in Azure NetApp Files is defined as _something_ that happens during a client/server conversation. For instance, when a client requests a file to be read from Azure NetApp Files, read and other operations are sent and received between the client and server.  

When monitoring the Azure NetApp Files volume, read and write operations are self-explanatory. Also included in the metrics is a metric called **Other IOPS**, meaning any operation that isn't a read or write. **Other IOPS** encompasses operations such as metadata, which is present alongside most read and write operations.

The following types of metadata operations are included in the **Other IOPS** metric: 

**NFSv3** 

NFSv3 metadata calls included in **Other IOPS** as covered in [RFC-1813](https://www.rfc-editor.org/rfc/rfc1813): 

- Procedure 0: NULL - Do nothing 
- Procedure 1: GETATTR - Get file attributes 
- Procedure 2: SETATTR - Set file attributes 
- Procedure 3: LOOKUP - Lookup filename 
- Procedure 4: ACCESS - Check Access Permission 
- Procedure 5: READLINK - Read from symbolic link 
- Procedure 8: CREATE - Create a file 
- Procedure 9: MKDIR - Create a directory 
- Procedure 10: SYMLINK - Create a symbolic link 
- Procedure 11: MKNOD - Create a special device 
- Procedure 12: REMOVE - Remove a File 
- Procedure 13: RMDIR - Remove a Directory 
- Procedure 14: RENAME - Rename a File or Directory 
- Procedure 15: LINK - Create Link to an object 
- Procedure 16: READDIR - Read From Directory 
- Procedure 17: READDIRPLUS - Extended read from directory 
- Procedure 18: FSSTAT - Get dynamic file system information 
- Procedure 19: FSINFO - Get static file system Information 
- Procedure 20: PATHCONF - Retrieve POSIX information 
- Procedure 21: COMMIT - Commit cached data on a server to stable storage 

**NFSv4.1** 

NFSv4.1 metadata calls included in **Other IOPS** as covered in [RFC-7530](https://www.rfc-editor.org/rfc/rfc7530): 

- Procedure 0: NULL – Do nothing 
- Procedure 1: COMPOUND – Combining multiple NFS operations into a single request 
- Operation 3: ACCESS – Check access rights 
- Operation 4: CLOSE – Close file 
- Operation 5: COMMIT – Commit cached data 
- Operation 6: CREATE - Create a nonregular file object 
- Operation 7: DELEGPURGE - Purge delegations awaiting recovery 
- Operation 8: DELEGRETURN - Return delegation 
- Operation 9: GETATTR - Get attributes 
- Operation 10: GETFH - Get current filehandle 
- Operation 11: LINK - Create link to a file 
- Operation 12: LOCK - Create lock 
- Operation 13: LOCKT - Test for Lock 
- Operation 14: LOCKU - Unlock file 
- Operation 15: LOOKUP - Look Up filename 
- Operation 16: LOOKUPP - Look Up parent directory 
- Operation 17: NVERIFY - Verify difference in attributes 
- Operation 18: OPEN - Open a regular file 
- Operation 19: OPENATTR - Open named attribute directory 
- Operation 20: OPEN_CONFIRM - Confirm open 
- Operation 21: OPEN_DOWNGRADE - Reduce open file access 
- Operation 22: PUTFH - Set current filehandle 
- Operation 23: PUTPUBFH - Set public filehandle 
- Operation 24: PUTROOTFH - Set root filehandle 
- Operation 26: READDIR - Read directory 
- Operation 27: READLINK - Read symbolic link 
- Operation 28: REMOVE - Remove file system object 
- Operation 29: RENAME - Rename directory entry 
- Operation 30: RENEW - Renew a lease 
- Operation 32: SAVEFH - Save current filehandle 
- Operation 33: SECINFO - Obtain available security 
- Operation 34: SETATTR - Set attributes 
- Operation 35: SETCLIENTID - Negotiate client ID 
- Operation 36: SETCLIENTID_CONFIRM - Confirm client ID 
- Operation 37: VERIFY - Verify same attributes 
- Operation 39: RELEASE_LOCKOWNER – Release lock-owner state 

**SMB (includes SMB2 and SMB3.x)** 

SMB commands included in **Other IOPS** with opcode value: 

| SMB command | Opcode value | 
| - | - |
| SMB2 NEGOTIATE | 0x0000 |
| SMB2 SESSION_SETUP | 0x0001 |
| SMB2 LOGOFF | 0x0002 |
| SMB2 TREE_CONNECT | 0x0003 |
| SMB2 TREE_DISCONNECT | 0x0004 |
| SMB2 CREATE | 0x0005 |
| SMB2 CLOSE | 0x0006 |
| SMB2 FLUSH | 0x0007 |
| SMB2 LOCK | 0x000A |
| SMB2 IOCTL | 0x000B |
| SMB2 CANCEL | 0x000C |
| SMB2 ECHO | 0x000D |
| SMB2 QUERY_DIRECTORY | 0x000E |
| SMB2 CHANGE_NOTIFY | 0x000F | 
| SMB2 QUERY_INFO | 0x0010 |
| SMB2 SET_INFO | 0x0011 |
| SMB2 OPLOCK_BREAK | 0x0012 | 

## Ways to access metrics 

Azure NetApp Files metrics are natively integrated into Azure monitor. From within the Azure portal, you can find metrics for Azure NetApp Files capacity pools and volumes from two locations:

- From Azure monitor, select **Metrics**, select a capacity pool or volume. Then select **Metric** to view the available metrics:
   
    :::image type="content" source="./media/azure-netapp-files-metrics/metrics-select-pool-volume.png" alt-text="Screenshot that shows how to access Azure NetApp Files metrics for capacity pools or volumes." lightbox="./media/azure-netapp-files-metrics/metrics-select-pool-volume.png":::
  	
- From the Azure NetApp Files capacity pool or volume, select **Metrics**. Then select **Metric** to view the available metrics:
   
    :::image type="content" source="./media/azure-netapp-files-metrics/metrics-navigate-volume.png" alt-text="Snapshot that shows how to navigate to the Metric pull-down." lightbox="./media/azure-netapp-files-metrics/metrics-navigate-volume.png":::
    
## <a name="capacity_pools"></a>Usage metrics for capacity pools

- *Pool Allocated Size*   
    The provisioned size of the pool.

- *Pool Allocated to Volume Size*  
    The total of volume quota (GiB) in a given capacity pool (that is, the total of the volumes' provisioned sizes in the capacity pool).  
    This size is the size you selected during volume creation.  

- *Pool Consumed Size*  
    The total of logical space (GiB) used across volumes in a capacity pool.  

- *Total Snapshot Size for the Pool*    
    The sum of snapshot size from all volumes in the pool.

## <a name="volumes"></a>Usage metrics for volumes

- *Percentage Volume Consumed Size*    
    The percentage of the volume consumed, including snapshots.  
    Aggregation metrics (for example, min, max) aren't supported for percentage volume consumed size.
- *Volume Allocated Size*   
    The provisioned size of a volume
- *Volume Quota Size*    
    The quota size (GiB) the volume is provisioned with.   
- *Volume Consumed Size*   
    Logical size of the volume (used bytes).  
    This size includes logical space used by active file systems and snapshots.  
- *Volume Snapshot Size*   
   The size of all snapshots in a volume.  
- *Throughput limit reached*
    
    Throughput limit reached is a boolean metric that denotes the volume is hitting its QoS limits. The value 1 means that the volume has reached its maximum throughput, and throughput for this volume will be throttled. The value 0 means this limit hasn't yet been reached.

     > [!NOTE] 
     > The Throughput limit reached metrics is collected every 5 minutes and is displayed as a hit if it has been collected in the last 5 minutes.
    
    If the volume is hitting the throughput limit, it's not sized appropriately for the application's demands. To resolve throughput issues:

    - Resize the volume: 

        Increase the volume size to allocate more throughput to the volume so it's not throttled.
    - Modify the service level:
    
        The Premium and Ultra service levels in Azure NetApp Files cater to workloads with higher throughput requirements. [Moving the volume to a capacity pool in a higher service level](dynamic-change-volume-service-level.md) automatically increases these limits for the volume. 
    - Change the workloads/application:

        Consider repurposing the volume and delegating a different volume with a larger size and/or in a higher service level to meet your application requirements. If it's an NFS volume, consider changing mount options to reduce data flow if your application supports those changes.

    :::image type="content" source="./media/azure-netapp-files-metrics/throughput-limit-reached.png" alt-text="Screenshot that shows Azure NetApp Files metrics a line graph demonstrating throughput limit reached." lightbox="./media/azure-netapp-files-metrics/throughput-limit-reached.png":::


## Performance metrics for volumes

> [!NOTE] 
> Volume latency for *Average Read Latency* and *Average Write Latency* is measured within the storage service and does not include network latency.

- *Average Read Latency*   
    The average roundtrip time (RTT) for reads from the volume in milliseconds.
- *Average Write Latency*   
    The average roundtrip time (RTT) for writes from the volume in milliseconds.
- *Read IOPS*   
    The number of read operations to the volume per second.
- *Write IOPS*   
    The number of write operations to the volume per second.
- ***Other IOPS*** 
    The number of [other operations](#about-storage-performance-operation-metrics) to the volume per second. 
- *Total IOPS* 
    A sum of the write, read, and other operations to the volume per second. 

## <a name="replication"></a>Volume replication metrics

> [!NOTE] 
> * Network transfer size (for example, the *Volume replication total transfer* metrics) might differ from the source or destination volumes of a cross-region replication. This behavior is a result of efficient replication engine being used to minimize the network transfer cost.
> * Volume replication metrics are currently populated for replication destination volumes and not the source of the replication relationship.

- *Is volume replication status healthy*   
    The condition of the replication relationship. A healthy state is denoted by `1`. An unhealthy state is denoted by `0`.

- *Is volume replication transferring*    
    Whether the status of the volume replication is transferring. 

- *Volume replication lag time* <br>
    Lag time is the actual amount of time the replication lags behind the source. It indicates the age of the replicated data in the destination volume relative to the source volume.

> [!NOTE]
> When assessing the health status of the volume replication, consider the volume replication lag time. If the lag time is greater than the replication schedule, the replication volume will not catch up to the source. To resolve this issue, adjust the replication speed or the replication schedule. 

- *Volume replication last transfer duration*   
    The amount of time in seconds it took for the last transfer to complete. 

- *Volume replication last transfer size*    
    The total number of bytes transferred as part of the last transfer. 

- *Volume replication progress*    
    The total amount of data transferred for the current transfer operation. 

- *Volume replication total transfer*   
    The cumulative bytes transferred for the relationship. 

## Throughput metrics for capacity pools   

* *Pool allocated throughput*    
    Sum of the throughput of all the volumes belonging to the pool.
    
* *Provisioned throughput for the pool*   
    Provisioned throughput of this pool.


## Throughput metrics for volumes   

* *Read throughput*   
    Read throughput in bytes per second.
    
* *Total throughput*   
    Sum of all throughput in bytes per second.

* *Write throughput*    
    Write throughput in bytes per second.

* *Other throughput*   
    Other throughput (that isn't read or write) in bytes per second.

* *Total throughput*
    Sum of all throughput (read, write, and other) in bytes per second.

## Volume backup metrics  

* *Is Volume Backup Enabled*   
    Shows whether backup is enabled for the volume. `1` is enabled. `0` is disabled.

* *Is Volume Backup Operation Complete*   
    Shows whether the last volume backup or restore operation is successfully completed.  `1` is successful. `0` is unsuccessful.

* *Is Volume Backup Suspended*   
    Shows whether the backup policy is suspended for the volume.  `1` isn't suspended. `0` is suspended.

* *Volume Backup Bytes*   
    The total bytes backed up for this volume.

* *Volume Backup Last Transferred Bytes*   
    The total bytes transferred for the last backup or restore operation.  

* *Volume Backup Operation Last Transferred Bytes*   
    Total bytes transferred for last backup operation.

* *Volume Backup Restore Operation Last Transferred Bytes*   
    Total bytes transferred for last backup restore operation.

## Cool access metrics

* *Volume cool tier size*   
    Volume footprint for the cool tier.

* *Volume cool tier data read size*   
    Data read in using `GET` per volume.

* *Volume cool tier data write size*   
    Data tiered out using `PUT` per volume. 
 
## Next steps

* [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Create a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
* [Create a volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
