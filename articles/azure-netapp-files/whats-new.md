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
ms.date: 09/30/2020
ms.author: b-juche
---

# What's new in Azure NetApp Files

Azure NetApp Files is updated on a regular basis. This article provides a summary about the latest new features and enhancements. 

## September 2020

* [Azure NetApp Files cross-region replication](cross-region-replication-introduction.md) (Public Preview)

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

* [Backup policy users](azure-netapp-files-create-volumes-smb.md#create-an-active-directory-connection) (Preview)

    Azure NetApp Files allows you to include additional accounts that require elevated privileges to the computer account created for use with Azure NetApp Files. The specified accounts will be allowed to change the NTFS permissions at the file or folder level. For example, you can specify a non-privileged service account used for migrating data to an SMB file share in Azure NetApp Files. The Backup policy users feature is currently in preview.

## Next steps
* [What is Azure NetApp Files](azure-netapp-files-introduction.md)
* [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md) 
