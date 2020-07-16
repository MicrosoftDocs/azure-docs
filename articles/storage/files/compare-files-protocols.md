---
title: Enable NFS
description: How to enable nfs
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 10/19/2019
ms.author: rogarana
ms.subservice: files
---

# Choose a protocol

Azure Files is a serverless distributed file system that provides access to the same data from multiple Azure VMs, on prem clients or multiple container pods. Azure Files guarantees data consistency and exclusive locks during shared access.  

Azure Files offers two protocols for connecting and mounting your Azure file shares. Server Message Block (SMB) and Network File System (NFS) (preview). Before you create a storage account and Azure file shares, you need to determine which protocol best suits your needs.

## Limitations

## Use cases

Home Directories 

NFS shares allows directories to be shared across multiple client VMs. That said, users to access their home directories from any VM that has access to NFS shares. The data will be persistent even if the client VM is compromised or corrupted. 

Enterprise Applications (Databases, CRM, LOB apps) 

With high scalability, elasticity, availability, and persistence, NFS can be used to store the files of enterprise applications and the applications delivered as services.   

Container storage 

Containers deliver "build once, run anywhere" capabilities that enable developers to accelerate innovation. For the containers that access raw data at every start, a shared file system is required to allow these containers to access the file system no matter which instance they run on. NFS is ideal for container storage because it provides persistent shared access to file data and has very low attach-detach latencies. 

Many More 

Web applications, DevOps, HPC, Log Directories, Video Streaming etc. Basically, any application ever written for Linux, assumes POSIX semantics. NFS is the native choice for any Linux applications. 

## Differences between protocols


|Category  |Feature  |NFS  |SMB  |
|---------|---------|---------|---------|
|     |Access protocols on same dataset         |NFS 4.1         |SMB 2.1, SMB 3.0, REST         |
|     |Supported OS         |Linux kernel version 4.3+         |Windows 2008 R2+, Linux kernel version 4.11+         |
|Performance and cost     |Available tiers         |Premium storage         |Premium storage, standard storage         |
|Durability     |Replication         |LRS, ZRS         |LRS, ZRS, GRS         |
|Security     |Authentication         |Host-based authentication         |Identity-based authentication, user-based authentication         |
|Security     |Permissions         |UNIX-style permissions         |NTFS-style permissions         |
|Security     |Encryption in transit         |Not currently supported         |Supported         |
|Data protection     |Backup         |Third-party support available         |First and third party support available         |
|Data protection     |Snapshots         |Not currently supported         |Supported         |
|Data protection     |Soft delete         |Not currently supported         |Supported         |
|Data protection     |Monitoring         |Azure monitor based monitoring/diagnostics         |Azure monitor based monitoring/diagnostics         |
|Data access and data movement     |REST API         |Management plane only         |Management and data plane         |
|Data access and data movement     |Storage explorer         |Not currently supported         |Supported         |
|Data access and data movement     |Databox support         |Not currently supported         |Supported         |
|Data access and data movement     |AzCopy support         |Not currently supported         |Supported         |
|Data access and data movement     |Azure file sync         |Not currently supported         |Supported         |
|File system features     |File system semantics         |Fully POSIX compliant         |Not POSIX compliant         |
|File system features     |Case sensitivity         |NFS is case sensitive         |SMB is not case sensitive         |
|File system features     |Hardlinks support         |Supported         |Not supported         |
|File system features     |Symbolic links support         |Supported         |Not supported         |
|File system features     |Deleting or modifying open files         |Supported         |Not supported         |
|File system features     |Locking         |Byte-range advisory network Lock Manager         |[Supported](https://docs.microsoft.com/en-us/rest/api/storageservices/managing-file-locks)         |
