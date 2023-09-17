---
title: Understand file locking and lock types in Azure NetApp Files | Microsoft Docs
description: Understand the concept of file locking and the different types of NFS locks.
services: azure-netapp-files
documentationcenter: ''
author: netapp-manishc
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 06/12/2023
ms.author: anfdocs
---
# Understand file locking and lock types in Azure NetApp Files

In NAS environments, multiple clients access files in the same volume. The NAS volume isn't application aware, so to protect data against potential corruption when more than one client attempts to write to the same file at the same time, applications send lock requests to the NAS server to prevent other clients from making changes while the file is in use. With NFS, file locking mechanisms depend on the NFS version being used.  

## Lock types

There are several types of NFS locks, which include:

**Shared locks:**
Shared locks can be used by multiple processes at the same time and can only be issued if there are no exclusive locks on a file. These locks are intended for read-only work but can be used for writes (such as with a database).

**Exclusive locks:**
Exclusive locks operate the same as exclusive locks in CIFS/SMB: only one process can use the file when there is an exclusive lock. If any other processes have locked the file, an exclusive lock can't be issued unless that process was [forked](http://linux.die.net/man/2/fork).

**Delegations:**
Delegations are used only with NFSv4.x and are assigned when the NFS server options are enabled and the client supports NFSv4.x delegations. Delegations provide a way to cache operations on the client side by creating a “soft” lock to the file being used by a client. This improves the performance of specific workloads by reducing the number of calls between the client and server and are similar to SMB opportunistic locks. Azure NetApp Files currently doesn't support NFSv4.x delegations.

**Byte-range locks:**
Rather than locking an entire file, byte-range locks only lock a portion of a file.

Locking behavior is dependent on the type of lock, the client operating system version and the NFS version being used. Be sure to test locking in your environment to gauge the expected behavior.

## NFSv3 locking

NFSv3 uses ancillary protocols like Network Lock Manager (NLM) and Network Status Monitor (NSM) to coordinate file locks between the NFS client and server. These ancillary protocols are defined in [RFC-1813](https://www.ietf.org/rfc/rfc1813.txt), which Azure NetApp Files adheres to.

NLM helps establish and release locks, while NSM notifies peers of server reboots. With NFSv3 locking, when a client reboots, the server must release the locks. When a server reboots, the client reminds the server of the locks it held

> [!NOTE]
> In some cases, the NFS lock mechanisms don’t communicate properly (such as in the event of a network outage), and stale locks are leftover on the server and must be manually cleared. For more information on this task, see [troubleshoot file locks](troubleshoot-file-locks.md).

## NFSv4.x locking

NFSv4.x uses a lease-based locking model that is integrated within the NFS protocol. This means there are no ancillary services to maintain or worry about; all the locking is encapsulated in the NFSv4.x communication.

Azure NetApp Files supports the NFSv4.x file-locking mechanism, maintaining the state of all file locks under a lease-based model. In accordance with [RFC 8881](https://www.rfc-editor.org/rfc/rfc8881), Azure NetApp Files will "define a single lease period for all state held by an NFS client. If the client doesn't renew its lease within the defined period, all state associated with the client's lease may be released by the server." 

This means the client can renew its lease explicitly or implicitly by performing an operation, such as reading a file. In addition, Azure NetApp Files defines a grace period, which is a period of special processing in which clients attempt to reclaim their locking state during a server recovery.

| Term | Definition |
|--| - | 
|Lease | The time period in which Azure NetApp Files irrevocably grants a lock to a client.|
| Grace period | The time period in which clients attempt to reclaim their locking state during server recovery in the event of a server outage.|

## How Azure NetApp Files handles NFSv4.x locks

Locks are issued by Azure NetApp Files upon client request on a lease basis. The Azure NetApp Files server checks the lease on each client every 30 seconds for changes. In the case of a client reboot, the client can reclaim all the valid locks from the server after it has restarted. If the Azure NetApp Files server reboots, then upon restarting it doesn't issue any new locks to the clients for a grace period of 45 seconds. After that time, locks can be issued to the requesting clients. If the lock can't be re-established during the specified grace period, then the lock expires on its own. This behavior differs from NFSv3 locking, as there won't be stale locks that need to be manually broken.

## Manually establishing locks on a client

To test NFS locks, the client must tell the NFS server to establish a lock. However, not all applications use locks. For example, the application “vi” won't lock a file. It creates a hidden swap file, using a dot naming convention, in the same folder and then commits writes to that file when the application is closed. Then the old file is deleted and the swap file gets renamed to the filename.

There are utilities to manually establish locks, however. For example, [flock](http://man7.org/linux/man-pages/man1/flock.1.html) can lock files. 

To establish a lock on a file, first run exec to assign a numeric ID.

```# exec 4<>v4user_file```

Use flock to create a shared or exclusive lock on the file. 

```output
# flock

Usage:
 flock [options] <file|directory> <command> [command args]
 flock [options] <file|directory> -c <command>
 flock [options] <file descriptor number>

Options:
 -s  --shared             get a shared lock
 -x  --exclusive          get an exclusive lock (default)
 -u  --unlock             remove a lock
 -n  --nonblock           fail rather than wait
 -w  --timeout <secs>     wait for a limited amount of time
 -E  --conflict-exit-code <number>  exit code after conflict or timeout
 -o  --close              close file descriptor before running command
 -c  --command <command>  run a single command string through the shell

 -h, --help     display this help and exit
 -V, --version  output version information and exit

# flock -n 4
```

To unlock the file.

```# flock -u -n 4```

Manually locking files allows you to test file open and edit interactions and test the lock break functionality in Azure NetApp Files.

## Next steps 
* [NFS FAQs for Azure NetApp Files](faq-nfs.md)
* [SMB FAQs for Azure NetApp Files](faq-smb.md)
* [Troubleshoot file locks on an Azure NetApp Files volume](troubleshoot-file-locks.md)
* [Application resilience FAQs for Azure NetApp Files](faq-application-resilience.md)

