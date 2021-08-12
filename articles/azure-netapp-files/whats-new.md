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
ms.date: 08/12/2021
ms.author: b-juche
---

# What's new in Azure NetApp Files

Azure NetApp Files is updated regularly. This article provides a summary about the latest new features and enhancements. 


* [Encrypted SMB connection to domain controller](create-active-directory-connections.md#create-an-active-directory-connection) 



## August 2021

* [Snapshot policy](azure-netapp-files-manage-snapshots.md#manage-snapshot-policies) now generally available (GA)  

    The snapshot policy feature is now generally available. You no longer need to register the feature before using it.

* [NFS `Chown Mode` export policy and UNIX export permissions](configure-unix-permissions-change-ownership-mode.md) (Preview)   

    You can now set the Unix permissions and the change ownership mode (`Chown Mode`) options on Azure NetApp Files NFS volumes or dual-protocol volumes with the Unix security style. You can specify these settings during volume creation or after volume creation.   

    The change ownership mode (`Chown Mode`) functionality enables you to set the ownership management capabilities of files and directories. You can specify or modify the setting under a volume's export policy. Two options for `Chown Mode` are available: *Restricted* (default),  where only the root user can change the ownership of files and directories, and *Unrestricted*, where non-root users can change the ownership for files and directories that they own.   

    The Azure NetApp Files Unix Permissions functionality enables you to specify change permissions for the mount path. 

    These new features provide options to move access control of certain files and directories into the hands of the data user instead of the service operator.   

* [Dual-protocol (NFSv4.1 and SMB) volume](create-volumes-dual-protocol.md) (Preview)   

    Azure NetApp Files already supports dual-protocol access to NFSv3 and SMB volumes as of [July 2020](#july-2020). You can now create an Azure NetApp Files volume that allows simultaneous dual-protocol (NFSv4.1 and SMB) access with support for LDAP user mapping. This feature enables use cases where you might have a Linux-based workload using NFSv4.1 for its access, and the workload generates and stores data in an Azure NetApp Files volume. At the same time, your staff might need to use Windows-based clients and software to analyze the newly generated data from the same Azure NetApp Files volume. The simultaneous dual-protocol access feature removes the need to copy the workload-generated data to a separate volume with a different protocol for post-analysis, saving storage cost and operational time. This feature is free of charge (normal Azure NetApp Files storage cost still applies) and is generally available. Learn more from the [simultaneous dual-protocol NFSv4.1/SMB access](create-volumes-dual-protocol.md) documentation.

## June 2021  

* [Azure NetApp Files storage service add-ons](storage-service-add-ons.md)

    The new Azure NetApp Files **Storage service add-ons** menu option provides an Azure portal “launching pad” for available third-party, ecosystem add-ons to the Azure NetApp Files storage service. With this new portal menu option, you can enter a landing page by clicking an add-on tile to quickly access the add-on.  

    **NetApp add-ons** is the first category of add-ons introduced under **Storage service add-ons**. It provides access to **NetApp Cloud Compliance**. Clicking the **NetApp Cloud Compliance** tile opens a new browser and directs you to the add-on installation page. 

* [Manual QoS capacity pool](manual-qos-capacity-pool-introduction.md) now generally available (GA)   

    The Manual QoS capacity pool feature is now generally available. You no longer need to register the feature before using it. 

* [Shared AD support for multiple accounts to one Active Directory per region per subscription](create-active-directory-connections.md#shared_ad) (Preview)   

    To date, Azure NetApp Files supports only a single Active Directory (AD) per region, where only a single NetApp account could be configured to access the AD. The new **Shared AD** feature enables all NetApp accounts to share an AD connection created by one of the NetApp accounts that belong to the same subscription and the same region. For example, using this feature, all NetApp accounts in the same subscription and region can use the common AD configuration to create an SMB volume, a NFSv4.1 Kerberos volume, or a dual-protocol volume. When you use this feature, the AD connection will be visible in all NetApp accounts that are under the same subscription and same region.

## May 2021 

* Azure NetApp Files Application Consistent Snapshot tool [(AzAcSnap)](azacsnap-introduction.md) is now generally available. 

    AzAcSnap is a command-line tool that enables you to simplify data protection for third-party databases (SAP HANA) in Linux environments (for example, SUSE and RHEL). See [Release Notes for AzAcSnap](azacsnap-release-notes.md) for the latest changes about the tool.   

* [Support for capacity pool billing tags](manage-billing-tags.md)   

    Azure NetApp Files now supports billing tags to help you cross-reference cost with business units or other internal consumers. Billing tags are assigned at the capacity pool level and not volume level, and they appear on the customer invoice.

* [ADDS LDAP over TLS](configure-ldap-over-tls.md) (Preview) 

    By default, LDAP communications between client and server applications are not encrypted. This means that it is possible to use a network monitoring device or software to view the communications between an LDAP client and server computers. This scenario might be problematic in non-isolated or shared VNets when an LDAP simple bind is used, because the credentials (user name and password) used to bind the LDAP client to the LDAP server are passed over the network unencrypted. LDAP over TLS (also known as LDAPS) is a protocol that uses TLS to secure communication between LDAP clients and LDAP servers. Azure NetApp Files now supports the secure communication between an Active Directory Domain Server (ADDS) using LDAP over TLS. Azure NetApp Files can now use LDAP over TLS for setting up authenticated sessions between the Active Directory-integrated LDAP servers. You can enable the LDAP over TLS feature for NFS, SMB, and dual-protocol volumes. By default, LDAP over TLS is disabled on Azure NetApp Files.  

* Support for throughput [metrics](azure-netapp-files-metrics.md)    

    Azure NetApp Files adds support for the following metrics:   
    * Capacity pool throughput metrics
        * *Pool Allocated to Volume Throughput*
        * *Pool Consumed Throughput*
        * *Percentage Pool Allocated to Volume Throughput*
        * *Percentage Pool Consumed Throughput*
    * Volume throughput metrics
        * *Volume Allocated Throughput*
        * *Volume Consumed Throughput*
        * *Percentage Volume Consumed Throughput*

* Support for [dynamic change of service level](dynamic-change-volume-service-level.md) of replication volumes   

    Azure NetApp Files now supports dynamically changing the service level of replication source and destination volumes.

## April 2021

* [Manual volume and capacity pool management](volume-quota-introduction.md) (hard quota) 

    The behavior of Azure NetApp Files volume and capacity pool provisioning has changed to a manual and controllable mechanism. The storage capacity of a volume is limited to the set size (quota) of the volume. When volume consumption maxes out, neither the volume nor the underlying capacity pool grows automatically. Instead, the volume will receive an “out of space” condition. However, you can [resize the capacity pool or a volume](azure-netapp-files-resize-capacity-pools-or-volumes.md) as needed. You should actively [monitor the capacity of a volume](monitor-volume-capacity.md) and the underlying capacity pool.

    This behavior change is a result of the following key requests indicated by many users:

    * Previously, VM clients would see the thinly provisioned (100 TiB) capacity of any given volume when using OS space or capacity monitoring tools.  This situation could result in inaccurate capacity visibility on the client or application side. This behavior has now been corrected.  
    * The previous auto-grow behavior of capacity pools gave application owners no control over the provisioned capacity pool space (and the associated cost). This behavior was especially cumbersome in environments where “run-away processes” could rapidly fill up and grow the provisioned capacity. This behavior has been corrected.  
    * Users want to see and maintain a direct correlation between volume size (quota) and performance. The previous behavior allowed for (implicit) over-subscription of a volume (capacity) and capacity pool auto-grow. As such, users could not make a direct correlation until the volume quota had been actively set or reset. This behavior has now been corrected.

    Users have requested direct control over provisioned capacity. Users want to control and balance storage capacity and utilization. They also want to control cost along with the application-side and client-side visibility of available, used, and provisioned capacity and the performance of their application volumes. With this new behavior, all this capability has now been enabled.

* [SMB Continuous Availability (CA) shares support for FSLogix user profile containers](azure-netapp-files-create-volumes-smb.md#continuous-availability) (Preview)  

    [FSLogix](/fslogix/overview) is a set of solutions that enhance, enable, and simplify non-persistent Windows computing environments. FSLogix solutions are appropriate for virtual environments in both public and private clouds. FSLogix solutions can also be used to create more portable computing sessions when you use physical devices. FSLogix can be used to provide dynamic access to persistent user profile containers stored on SMB shared networked storage, including Azure NetApp Files. To further enhance FSLogix resiliency to storage service maintenance events, Azure NetApp Files has extended support for SMB Transparent Failover via [SMB Continuous Availability (CA) shares on Azure NetApp Files](azure-netapp-files-create-volumes-smb.md#continuous-availability) for user profile containers. See Azure NetApp Files [Azure Virtual Desktop solutions](azure-netapp-files-solution-architectures.md#windows-virtual-desktop) for additional information.  

* [SMB3 Protocol Encryption](azure-netapp-files-create-volumes-smb.md#smb3-encryption) (Preview) 

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

* [AES encryption for AD authentication](create-active-directory-connections.md#create-an-active-directory-connection) (Preview)

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

    Azure NetApp Files now supports NFS client encryption in Kerberos modes (krb5, krb5i, and krb5p) with AES-256 encryption, providing you with more data security. This feature is free of charge (normal [Azure NetApp Files storage cost](https://azure.microsoft.com/pricing/details/netapp/) still applies) and is generally available. Learn more from the [NFS v4.1 Kerberos encryption documentation](configure-kerberos-encryption.MD).

* [Dynamic volume service level change](dynamic-change-volume-service-level.MD) (Preview) 

    Cloud promises flexibility in IT spending. You can now change the service level of an existing Azure NetApp Files volume by moving the volume to another capacity pool that uses the service level you want for the volume. This in-place service-level change for the volume does not require that you migrate data. It also does not impact the data plane access to the volume. You can change an existing volume to use a higher service level for better performance, or to use a lower service level for cost optimization. This feature is free of charge (normal [Azure NetApp Files storage cost](https://azure.microsoft.com/pricing/details/netapp/) still applies). It is currently in preview. You can register for the feature preview by following the [dynamic volume service level change documentation](dynamic-change-volume-service-level.md).

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
