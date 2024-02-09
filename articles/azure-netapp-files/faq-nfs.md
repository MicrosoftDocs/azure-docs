---
title: NFS FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about the NFS protocol of Azure NetApp Files.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 03/15/2023
---
# NFS FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about the NFS protocol of Azure NetApp Files.

## I want to have a volume mounted automatically when an Azure VM is started or rebooted. How do I configure my host for persistent NFS volumes?

For an NFS volume to automatically mount at VM start or reboot, add an entry to the `/etc/fstab` file on the host. 

See [Mount a volume for Windows or Linux virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md) for details.  

## What NFS version does Azure NetApp Files support?

Azure NetApp Files supports NFSv3 and NFSv4.1. You can [create a volume](azure-netapp-files-create-volumes.md) using either NFS version. 

## Does Azure NetApp Files officially support NFSv4.2?

Currently, Azure NetApp Files does not officially support NFSv4.2 nor its ancillary features (including sparse file ops, extended attributes, and security labels). However, the functionality is turned on for the NFS server when NFSv4.1 is used, which means NFS clients are able to mount using the NFSv4.2 protocol in one of two ways:

* Explicitly specifying `vers=4.2`, `nfsvers=4.2`, or `nfsvers=4,minorversion=2` in the mount options.
* Not specifying an NFS version in the mount options and allowing the NFS client to negotiate to the highest supported NFS version allowed.

In most cases, if a client mounts using NFSv4.2, no issues can be seen. However, some clients can experience problems if they don’t fully support NFSv4.2 or the NFSv4.2 extended attributes functionality. Further, since NFSv4.2 is currently unsupported with Azure NetApp Files, any issues with NFSv4.2 are out of scope.

To avoid any issues with clients mounting NFSv4.2 and to comply with supportability, ensure the NFSv4.1 version is specified in mount options or the client’s NFS client configuration is set to cap the NFS version at NFSv4.1.

## How do I enable root squashing?

You can specify whether the root account can access the volume or not by using the volume’s export policy. See [Configure export policy for an NFS volume](azure-netapp-files-configure-export-policy.md) for details.

## Can I use the same file path (volume creation token) for multiple volumes?

Yes, you can. However, the file path must be unique within each subnet.     

## When I try to access NFS volumes through a Windows client, why does the client take a long time to search folders and subfolders?

Make sure that `CaseSensitiveLookup` is enabled on the Windows client to speed up the look-up of folders and subfolders:

1. Use the following PowerShell command to enable CaseSensitiveLookup:   
	`Set-NfsClientConfiguration -CaseSensitiveLookup 1`    
2. Mount the volume on the Windows server.   
	Example:   
	`Mount -o rsize=1024 -o wsize=1024 -o mtype=hard \\10.x.x.x\testvol X:*`

## How does Azure NetApp Files support NFSv4.1 file-locking? 

For NFSv4.1 clients, Azure NetApp Files supports the NFSv4.1 file-locking mechanism that maintains the state of all file locks under a lease-based model. 

Per RFC 3530, Azure NetApp Files defines a single lease period for all state held by an NFS client. If the client doesn't renew its lease within the defined period, all states associated with the client's lease will be released by the server.  

For example, if a client mounting a volume becomes unresponsive or crashes beyond the timeouts, the locks will be released. The client can renew its lease explicitly or implicitly by performing operations such as reading a file.   

A grace period defines a period of special processing in which clients can try to reclaim their locking state during a server recovery. The default timeout for the leases is 30 seconds with a grace period of 45 seconds. After that time, the client's lease will be released. 

Azure NetApp Files also supports [breaking file locks](troubleshoot-file-locks.md).

To learn more about file locking in Azure NetApp Files, see [file locking](understand-file-locks.md).

## Why is the `.snapshot` directory not visible in an NFSv4.1 volume, but it's visible in an NFSv3 volume?

By design, the .snapshot directory is never visible to NFSv4.1 clients. By default, the `.snapshot `directory is visible to NFSv3 clients. To hide the `.snapshot` directory from NFSv3 clients, edit the properties of the volume to [hide the snapshot path](snapshots-edit-hide-path.md).

## Oracle dNFS

### Are there any Oracle patches required with dNFS?

>[!IMPORTANT]
> Customers using Oracle 19c and higher must ensure they **are patched for Oracle bug 32931941**. Most of the patch bundles currently in use by Oracle customers do **\*not\*** include this patch. The patch has only been included in a subset of recent patch bundles.

If a database is exposed to this bug, network interruptions are highly likely to result in fractured block corruption. Network interruptions include events such as storage endpoint relocation, volume relocation, and storage service maintenance events. The corruption may not necessarily be detected immediately.

This corruption is neither a bug on ONTAP nor the Azure NetApp Files service itself, but the result of an Oracle dNFS bug. The response to an NFS IO during a certain networking interruption or reconfiguration events is mishandled. The database will erroneously write a block that was being updated as it was written. In some cases, a later overwrite of that same block will silently corrupt the corrupted block. If not, Oracle database processes will eventually detect it. An error should be logged in the Alert logs, and the Oracle instance is likely to terminate. In addition, dbv and RMAN operations can detect the corruption.

Oracle publishes [document 1495104.1](https://support.oracle.com/knowledge/Oracle%20Cloud/1495104_1.html), which is continually updated with recommended dNFS patches. If your database uses dNFS, ensure the DBA team is checking for updates in this document.

>[!IMPORTANT]
> Customers using Oracle dNFS with NFSv4.1 on Azure NetApp Files volumes must ensure to take actions mentioned under [Are there any patches required for use of Oracle dNFS with NFSv4.1?](#are-there-any-patches-required-for-use-of-oracle-dnfs-with-nfsv41).

### Are there any patches required for use of Oracle dNFS with NFSv4.1?
>[!IMPORTANT]
> If your databases are using Oracle dNFS with NFSv4.1, they **need to be patched for Oracle bugs 33132050 and 33676296**. You may have to request a backport for other versions of Oracle. For example, at the time of writing, these patches are available for 19.11, but not yet 19.3. If you cite these bug numbers in the support case, Oracle's support engineers know what to do.

This requirement applies to ONTAP-based systems and services in general, which includes both on-premises ONTAP and Azure NetApp Files.

Examples of the potential problems if these patches aren't applied:

1. Database hangs on backend storage endpoint moves.
1. Database hangs on Azure NetApp Files service maintenance events.
1. Brief Oracle hangs during normal operation that may or may not be noticeable.
1. Slow Oracle shutdowns: if you monitor the shutdown process, you see pauses that could add up to minutes of delays as dNFS I/O times out.
1. Incorrect dNFS reply caching behavior on reads that will hang a database.

The patches include a change in dNFS session management and NFS reply caching that resolves these problems.

**If you cannot patch for these two bugs**, you _must not_ use dNFS with NFSv4.1. You can either disable dNFS or switch to NFSv3. 

### Can I use multipathing with Oracle dNFS and NFSv4.1?

When using NFSv4.1, dNFS won't work with multiple paths. If you need multiple paths, you have to use NFSv3. dNFS requires cluster-wide `clientID` and `sessionID` trunking for NFSv4.1 to work with multiple paths, which Azure NetApp Files does not support. As a result, you'll experience a hang during dNFS startup

## Next steps  

- [Microsoft Azure ExpressRoute FAQs](../expressroute/expressroute-faqs.md)
- [Microsoft Azure Virtual Network FAQ](../virtual-network/virtual-networks-faq.md)
- [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- [Azure Data Box](../databox/index.yml)
- [FAQs about SMB performance for Azure NetApp Files](azure-netapp-files-smb-performance.md)
- [Networking FAQs](faq-networking.md)
- [Security FAQs](faq-security.md)
- [Performance FAQs](faq-performance.md)
- [SMB FAQs](faq-smb.md)
- [Capacity management FAQs](faq-capacity-management.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Application resilience FAQs](faq-application-resilience.md)
- [Integration FAQs](faq-integration.md)
