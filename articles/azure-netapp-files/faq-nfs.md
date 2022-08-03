---
title: NFS FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about the NFS protocol of Azure NetApp Files.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 08/03/2022
---
# NFS FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about the NFS protocol of Azure NetApp Files.

## I want to have a volume mounted automatically when an Azure VM is started or rebooted.  How do I configure my host for persistent NFS volumes?

For an NFS volume to automatically mount at VM start or reboot, add an entry to the `/etc/fstab` file on the host. 

See [Mount a volume for Windows or Linux virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md) for details.  

## What NFS version does Azure NetApp Files support?

Azure NetApp Files supports NFSv3 and NFSv4.1. You can [create a volume](azure-netapp-files-create-volumes.md) using either NFS version. 

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

Per RFC 3530, Azure NetApp Files defines a single lease period for all state held by an NFS client. If the client does not renew its lease within the defined period, all states associated with the client's lease will be released by the server.  

For example, if a client mounting a volume becomes unresponsive or crashes beyond the timeouts, the locks will be released. The client can renew its lease explicitly or implicitly by performing operations such as reading a file.   

A grace period defines a period of special processing in which clients can try to reclaim their locking state during a server recovery. The default timeout for the leases is 30 seconds with a grace period of 45 seconds. After that time, the client's lease will be released. 

## Oracle dNFS

### Are there any Oracle patches required with dNFS?

Customers using Oracle 19c and higher must ensure they **are patched for Oracle bug 32931941**. Most of the patch bundles currently in use by Oracle customers do **\*not\*** include this patch. The patch has only been included in a subset of recent patch bundles.

If a database is exposed to this bug, network interruptions are highly likely to result in fractured block corruption. Network interruptions include events such as storage endpoint relocation, volume relocation, and storage service maintenance events. The corruption may not necessarily be detected immediately.

This is not a bug on ONTAP or the Azure NetApp Files service itself. It is the result of an Oracle dNFS bug. The response to an NFS IO during a certain networking interruption or reconfiguration events is mishandled. The database will erroneously write a block that was being updated as it was written. In some cases, the corrupted block will be silently corrected by a later overwrite of that same block. If not, it will eventually be detected by Oracle database processes. An error should be logged in the Alert logs, and the Oracle instance is likely to terminate. In addition, dbv and RMAN operations can detect the corruption.

Oracle publishes [document 1495104.1](https://support.oracle.com/knowledge/Oracle%20Cloud/1495104_1.html), which is continually updated with recommended dNFS patches. If your database uses dNFS, ensure the DBA team is checking for updates in this document.

### Are there any patches required for use of Oracle dNFS with NFSv4.1?

If your databases are using Oracle dNFS with NFSv4.1, they **need to be patched for Oracle bugs 33132050 and 33676296**. You may have to request a backport for other versions of Oracle. For example, at the time of writing, these patches are available for 19.11, but not yet 19.3. If you cite these bug numbers in the support case, Oracle's support engineers will know what to do.

This requirement applies to ONTAP-based systems and services in general, which includes both on-premises ONTAP and Azure NetApp Files.

Examples of the potential problems if these patches are not applied:

1. Database hangs on backend storage endpoint moves.
1. Database hangs on Azure NetApp Files service maintenance events.
1. Brief Oracle hangs during normal operation that may or may not be noticeable.
1. Slow Oracle shutdowns: if you monitor the shutdown process, you'll see pauses that could add up to minutes of delays as dNFS I/O times out.
1. Incorrect dNFS reply caching behavior on reads that will hang a database.

The patches include a change in dNFS session management and NFS reply caching that resolves these problems.

**If you cannot patch for these two bugs**, you _must not_ use dNFS with NFSv4.1. You can either disable dNFS or switch to NFSv3. 

### Can I use multipathing with Oracle dNFS and NFSv4.1?

dNFS will not work with multiple paths when using NFSv4.1. If you need multiple paths, you will have to use NFSv3. dNFS requires cluster-wide `clientID` and `sessionID` trunking for NFSv4.1 to work with multiple paths, and this is not supported by Azure NetApp Files. The result when trying to use this is a hang during dNFS startup

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