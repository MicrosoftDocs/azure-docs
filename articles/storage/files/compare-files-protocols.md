---
title: Select a protocol
description: Select a protocol before creating an Azure file share
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 07/31/2020
ms.author: rogarana
ms.subservice: files
---

# Select a protocol

Azure Files is a serverless distributed file system that provides access to the same data from multiple Azure VMs, on prem clients or multiple container pods. Azure Files guarantees data consistency and exclusive locks during shared access.  

Azure Files offers two protocols for connecting and mounting your Azure file shares. Server Message Block (SMB) and Network File System (NFS) (preview). Before you create a storage account and Azure file shares, we recommend determining which protocol best suits your needs.

## Differences at a glance

|Feature  |NFS (preview)  |SMB  |
|---------|---------|---------|
|Access protocols     |NFS 4.1         |SMB 2.1, SMB 3.0, REST         |
|Supported OS     |Linux kernel version 4.3+         |Windows 2008 R2+, Linux kernel version 4.11+         |
|Available tiers     |Premium storage         |Premium storage, standard storage         |
|Replication     |LRS, ZRS         |LRS, ZRS, GRS         |
|Authentication     |Host-based authentication only        |Identity-based authentication, user-based authentication         |
|Permissions     |UNIX-style permissions         |NTFS-style permissions         |
|File system semantics     |POSIX compliant         |Not POSIX compliant         |
|Case sensitivity     |Case sensitive         |Not case sensitive         |
|Hardlinks support     |Supported         |Not supported         |
|Symbolic links support     |Supported         |Not supported         |
|Deleting or modifying open files     |Supported         |Not supported         |
|Locking     |Byte-range advisory network lock manager         |Supported         |

## SMB

SMB description here.

### Features

- Azure file sync
- Identity-based authentication
- Azure Backup support
- Snapshots
- Soft delete
- Encryption-in-transit and encryption-at-rest

### Use cases

SMB use cases here.

## NFS (preview)

NFS description here. NFS is currently in preview and should not be used for production data.

### Restrictions

The following Azure Files features are not available with NFS shares:

- Azure File Sync
- Identity-based authentication
- Azure Backup support
- Snapshots
- Soft delete

- Currently only available in East US
- Both encryption-in-transit and encryption-at-rest are not currently available
- Must create a new storage account in order to create an NFS share.
- Does not currently support storage explorer, Databox, or AzCopy.

### Use cases

Enterprise Applications (Databases, CRM, LOB apps) 

With high scalability, elasticity, availability, and persistence, NFS can be used to store the files of enterprise applications and the applications delivered as services.   

Container storage 

Containers deliver "build once, run anywhere" capabilities that enable developers to accelerate innovation. For the containers that access raw data at every start, a shared file system is required to allow these containers to access the file system no matter which instance they run on. NFS is ideal for container storage because it provides persistent shared access to file data and has very low attach-detach latencies. 

Many More 

Web applications, DevOps, HPC, Log Directories, Video Streaming etc. Basically, any application ever written for Linux, assumes POSIX semantics. NFS is the native choice for any Linux applications. 