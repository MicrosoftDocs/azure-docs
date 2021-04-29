---
title: What's new in Azure NetApp Files | Microsoft Docs
description: Provides a summary about the latest new features and enhancements of Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 04/21/2021
ms.author: b-juche
---

# What's new in Azure NetApp Files

Azure NetApp Files is updated regularly. This article provides a summary about the latest new features and enhancements. 

## April 2021

* [SMB Continuous Availability (CA) shares support for FSLogix user profile containers](azure-netapp-files-create-volumes-smb.md#add-an-smb-volume) (Preview)  

    [FSLogix](/fslogix/overview) is a set of solutions that enhance, enable, and simplify non-persistent Windows computing environments. FSLogix solutions are appropriate for virtual environments in both public and private clouds. FSLogix solutions can also be used to create more portable computing sessions when you use physical devices. FSLogix can be used to provide dynamic access to persistent user profile containers stored on SMB shared networked storage, including Azure NetApp Files. To further enhance FSLogix resiliency to storage service maintenance events, Azure NetApp Files has extended support for SMB Transparent Failover via [SMB Continuous Availability (CA) shares on Azure NetApp Files](azure-netapp-files-create-volumes-smb.md#add-an-smb-volume) for user profile containers. See Azure NetApp Files [Windows Virtual Desktop solutions](azure-netapp-files-solution-architectures.md#windows-virtual-desktop) for additional information.  

* [SMB3 Protocol Encryption](azure-netapp-files-create-volumes-smb.md#add-an-smb-volume) (Preview) 

    You can now enable SMB3 Protocol Encryption on Azure NetApp Files SMB and dual-protocol volumes. This feature enables encryption for in-flight SMB3 data, using the [AES-CCM algorithm on SMB 3.0, and the AES-GCM algorithm on SMB 3.1.1](/windows-server/storage/file-server/file-server-smb-overview#features-added-in-smb-311-with-windows-server-2016-and-windows-10-version-1607) connections. SMB clients not using SMB3 encryption will not be able to access this volume. Data at rest is encrypted regardless of this setting. SMB encryption further enhances security. However, it might impact the client (CPU overhead for encrypting and decrypting messages). It might also impact storage resource utilization (reductions in throughput). You should test the encryption performance impact against your applications before deploying workloads into production.

* [Active Directory Domain Services (ADDS) LDAP user-mapping with NFS extended groups](configure-ldap-extended-groups.md) (Preview)   

    By default, Azure NetApp Files supports up to 16 group IDs when handling NFS user credentials, as defined in [RFC 5531](https://tools.ietf.org/html/rfc5531). With this new capability, you can now increase the maximum up to 1,024 if you have users who are members of more than the default number of groups. To support this capability, NFS volumes can now also be added to ADDS LDAP, which enables Active Directory LDAP users with extended groups entries (with up to 1024 groups) to access the volume. 

## March 2021
 
* [SMB Continuous Availability (CA) shares](azure-netapp-files-create-volumes-smb.md#add-an-smb-volume) (Preview)  

    SMB Transparent Failover enables maintenance operations on the Azure NetApp Files service without interrupting connectivity to server applications storing and accessing data on SMB volumes. To support SMB Transparent Failover, Azure NetApp Files now supports the SMB Continuous Availability shares option for use with SQL Server applications over SMB running on Azure VMs. This feature is currently supported on Windows SQL Server. Linux SQL Server is not currently supported. Enabling this feature provides significant SQL Server performance improvements and scale and cost benefits for [Single Instance, Always-On Failover Cluster Instance and Always-On Availability Group deployments](azure-netapp-files-solution-architectures.md#sql-server). See [Benefits of using Azure NetApp Files for SQL Server deployment](solutions-benefits-azure-netapp-files-sql-server.md).

* [Automatic resizing of a cross-region replication destination volume](azure-netapp-files-resize-capacity-pools-or-volumes.md#resize-a-cross-region-replication-destination-volume)

    In a cross-region replication relationship, a destination volume is automatically resized based on the size of the source volume. As such, you don’t need to resize the destination volume separately. This automatic resizing behavior is applicable when the volumes are in an active replication relationship, or when replication peering is broken with the resync operation. For this feature to work, you need to ensure sufficient headroom in the capacity pools for both the source and the destination volumes.

## December 2020

* [Azure Application Consistent Snapshot Tool](azacsnap-introduction.md) (Preview)    

    Azure Application Consistent Snapshot Tool (AzAcSnap) is a command-line tool that enables you to simplify data protection for third-party databases (SAP HANA) in Linux environments (for example, SUSE and RHEL).   

    AzAcSnap leverages the volume snapshot and replication functionalities in Azure NetApp Files and Azure Large Instance. It provides the following benefits:

    * Application-consistent data protection 
    * Database catalog management 
    * *Ad hoc* volume protection 
    * Cloning of storage volumes 
    * Support for disaster recovery 

## November 2020

* [Snapshot revert](azure-netapp-files-manage-snapshots.md#revert-a-volume-using-snapshot-revert)

    The snapshot revert functionality enables you to quickly revert a volume to the state it was in when a particular snapshot was taken. In most cases, reverting a volume is much faster than restoring individual files from a snapshot to the active file system. It is also more space efficient compared to restoring a snapshot to a new volume.

## September 2020

* [Azure NetApp Files cross-region replication](cross-region-replication-introduction.md) (Preview)

  Azure NetApp Files now supports cross-region replication. With this new disaster recovery capability, you can replicate your Azure NetApp Files volumes from one Azure region to another in a fast and cost-effective way, protecting your data from unforeseeable regional failures. Azure NetApp Files cross region replication leverages NetApp SnapMirror® technology; only changed blocks are sent over the network in a compressed, efficient format. This proprietary technology minimizes the amount of data required to replicate across the regions, therefore saving data transfer costs. It also shortens the replication time, so you can achieve a smaller Restore Point Objective (RPO).

* [Manual QoS Capacity Pool](manual-qos-capacity-pool-introduction.md) (Preview)  

    In a manual QoS capacity pool, you can assign the capacity and throughput for a volume independently. The total throughput of all volumes created with a manual QoS capacity pool is limited by the total throughput of the pool. It is determined by the combination of the pool size and the service-level throughput. Alternatively, a capacity pool’s [QoS type](azure-netapp-files-understand-storage-hierarchy.md#qos_types) can be auto (automatic), which is the default. In an auto QoS capacity pool, throughput is assigned automatically to the volumes in the pool, proportional to the size quota assigned to the volumes.

* [LDAP signing](azure-netapp-files-create-volumes-smb.md) (Preview)   

    Azure NetApp Files now supports LDAP signing for secure LDAP lookups between the Azure NetApp Files service and the user-specified Active Directory Domain Services domain controllers. This feature is currently in preview.

* [AES encryption for AD authentication](azure-netapp-files-create-volumes-smb.md) (Preview)

    Azure NetApp Files now supports AES encryption on LDAP connection to DC to enable AES encryption for an SMB volume. This feature is currently in preview. 

* New [metrics](azure-netapp-files-metrics.md):   

    * New volume metrics: 
        * *Volume allocated size*: The provisioned size of a volume
    * New pool metrics: 
        * *Pool Allocated size*: The provisioned size of the pool 
        * *Total snapshot size for the pool*: The sum of snapshot size from all volumes in the pool

## July 2020

* [Dual-protocol (NFSv3 and SMB) volume](create-volumes-dual-protocol.md)

    You can now create an Azure NetApp Files volume that allows simultaneous dual-protocol (NFS v3 and SMB) access with support for LDAP user mapping. This feature enables use cases where you may have a Linux-based workload that generates and stores data in an Azure NetApp Files volume. At the same time, your staff needs to use Windows-based clients and software to analyze the newly generated data from the same Azure NetApp Files volume. The simultaneous dual-protocol access feature removes the need to copy the workload-generated data to a separate volume with a different protocol for post-analysis, saving storage cost, and operational time. This feature is free of charge (normal [Azure NetApp Files storage cost](https://azure.microsoft.com/pricing/details/netapp/) still applies) and is generally available. Learn more from the [simultaneous dual-protocol access documentation](create-volumes-dual-protocol.MD).

* [NFS v4.1 Kerberos encryption in transit](configure-kerberos-encryption.MD)

    Azure NetApp Files now supports NFS client encryption in Kerberos modes (krb5, krb5i, and krb5p) with AES-256 encryption, providing you with additional data security. This feature is free of charge (normal [Azure NetApp Files storage cost](https://azure.microsoft.com/pricing/details/netapp/) still applies) and is generally available. Learn more from the [NFS v4.1 Kerberos encryption documentation](configure-kerberos-encryption.MD).

* [Dynamic volume service level change](dynamic-change-volume-service-level.MD)

    Cloud promises flexibility in IT spending. You can now change the service level of an existing Azure NetApp Files volume by moving the volume to another capacity pool that uses the service level you want for the volume. This in-place service-level change for the volume does not require that you migrate data. It also does not impact the data plane access to the volume. You can change an existing volume to use a higher service level for better performance, or to use a lower service level for cost optimization. This feature is free of charge (normal [Azure NetApp Files storage cost](https://azure.microsoft.com/pricing/details/netapp/) still applies) and is currently in public preview. You can register for the feature preview by following the [dynamic volume service level change documentation](dynamic-change-volume-service-level.md).

* [Volume snapshot policy](azure-netapp-files-manage-snapshots.md#manage-snapshot-policies) (Preview) 

    Azure NetApp Files allows you to create point-in-time snapshots of your volumes. You can now create a snapshot policy to have Azure NetApp Files automatically create volume snapshots at a frequency of your choice. You can schedule the snapshots to be taken in hourly, daily, weekly, or monthly cycles. You can also specify the maximum number of snapshots to keep as part of the snapshot policy. This feature is free of charge (normal [Azure NetApp Files storage cost](https://azure.microsoft.com/pricing/details/netapp/) still applies) and is currently in preview. You can register for the feature preview by following the [volume snapshot policy documentation](azure-netapp-files-manage-snapshots.md#manage-snapshot-policies).

* [NFS root access export policy](azure-netapp-files-configure-export-policy.md)

    Azure NetApp Files now allows you to specify whether the root account can access the volume. 

* [Hide snapshot path](azure-netapp-files-manage-snapshots.md#restore-a-file-from-a-snapshot-using-a-client)

    Azure NetApp Files now allows you to specify whether a user can see and access the `.snapshot` directory (NFS clients) or `~snapshot` folder (SMB clients) on a mounted volume.

## May 2020

* [Backup policy users](create-active-directory-connections.md) (Preview)

    Azure NetApp Files allows you to include additional accounts that require elevated privileges to the computer account created for use with Azure NetApp Files. The specified accounts will be allowed to change the NTFS permissions at the file or folder level. For example, you can specify a non-privileged service account used for migrating data to an SMB file share in Azure NetApp Files. The Backup policy users feature is currently in preview.

## Next steps
* [What is Azure NetApp Files](azure-netapp-files-introduction.md)
* [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md) 
