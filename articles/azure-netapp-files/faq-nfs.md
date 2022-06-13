---
title: NFS FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about the NFS protocol of Azure NetApp Files.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 10/19/2021
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