---
title: What's new in Azure NetApp Files | Microsoft Docs
description: Provides a summary about the latest new features and enhancements of Azure NetApp Files.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.custom: linux-related-content
ms.topic: overview
ms.date: 02/11/2025
ms.author: anfdocs
---

# What's new in Azure NetApp Files

Azure NetApp Files is updated regularly. This article provides a summary about the latest new features and enhancements.

## February 2025

* [New volume usage metric](azure-netapp-files-metrics.md#volumes): volume inodes percentage 

    Azure NetApp Files metrics now enable you to see the percentage of a volume's total [inodes](maxfiles-concept.md) consumed. 

## January 2025 

* [Application volume group for Oracle](application-volume-group-oracle-introduction.md) and [application volume group for SAP HANA extension one](application-volume-group-introduction.md) now support customer-managed keys. (Preview)

    Azure NetApp Files application volume groups for SAP HANA (with extension 1) and Oracle now support customer-managed keys, providing increased security and compliance. This feature is now in preview.

## December 2024

* [Volume enhancement: Azure NetApp Files 50 GiB minimum volume sizes](azure-netapp-files-create-volumes.md) is now generally available (GA)

    This enhancement allows you to create an Azure NetApp Files volume as small as 50 GiB—a reduction from the initial minimum size of 100 GiB. This reduced size can save costs for workloads that require volumes smaller than 100 GiB, allowing you to appropriately size storage volumes. All volume workflows which were supported with a 100 GiB minimum volume size are now supported with this new minimum size of 50 GiB.

* [Volume enhancement: creating volumes with the same file path, share name, or volume path in different availability zones](manage-availability-zone-volume-placement.md#file-path-uniqueness) is now generally available (GA)

    Azure NetApp Files allows you to create volumes with the same file path (NFS), share name (SMB), or volume path (dual-protocol) as long as they are in different availability zones. For more information, see [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md), [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md), or [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md). This feature is now generally available. 

* [Cloud Backup for Virtual Machines on Azure NetApp Files datastores for Azure VMware Solution:](../azure-vmware/install-cloud-backup-virtual-machines.md) enhanced backup capabilities (Preview)

    Cloud Backup for Virtual Machines now integrates with [Azure NetApp Files backup](backup-introduction.md), significantly enhancing data protection by offering a fully managed backup solution for long-term recovery, archiving, and compliance. This integration allows you to mount a datastore from a snapshot or Azure NetApp Files backup to restore files. You can [mount the backup](../azure-vmware/configure-cloud-backup-virtual-machine.md) to either the Azure VMware Solution host where it was created or to an alternate host.
    
    Cloud Backup for Virtual Machines now also includes the capability to [attach one or more VMDKs](../azure-vmware/configure-cloud-backup-virtual-machine.md) from a backup to the parent VM, to an alternate VM on the same Azure VMware Solution host, or to an alternate VM on an alternate host managed by the same vCenter instance.
    
    Cloud Backup for Virtual Machines also enables you [to restore a virtual machine](../azure-vmware/restore-azure-netapp-files-vms.md) to an alternate location on the same Azure VMware Solution host or a different host managed by the same vCenter instance. Additionally, it supports [restoring guest files and folders from a snapshot or an Azure NetApp Files backup](../azure-vmware/restore-guest-files-folders.md).

## November 2024

* [Cool access support for large volumes](large-volumes-requirements-considerations.md#register-the-feature)

    Azure NetApp Files storage with [cool access](cool-access-introduction.md) is now available with [large volumes](large-volumes.md). You must be registered to use _both_ cool access and large volumes to create a cool access-enabled large volume. 

 ## October 2024

* [Edit network features enhancement: no downtime](configure-network-features.md#no-downtime) (Preview)

    Azure NetApp Files now supports the ability to edit network features (that is, upgrade from Basic to Standard network features) with no downtime for Azure NetApp Files volumes. Standard Network Features provide you with an enhanced virtual networking experience for a seamless and consistent experience along with security posture for Azure NetApp Files. 
  
## September 2024 

* [Dynamic service level change enhancement:](dynamic-change-volume-service-level.md) shortened wait time for changing to lower service levels

    To address rapidly changing performance requirements, Azure NetApp Files allows [dynamic service level changes of volumes](dynamic-change-volume-service-level.md). The wait time for moving Azure NetApp Files volumes to a lower service level (after first moving service levels upwards) is now 24 hours (a change from the original seven days) enabling you to more actively benefit from this cost optimization capability. 

* [Reserved capacity](reservations.md) is now generally available (GA)

    Pay-as-you-go pricing is the most convenient way to purchase cloud storage when your workloads are dynamic or changing over time. However, some workloads are more predictable with stable capacity usage over an extended period. These workloads can benefit from savings in exchange for a longer-term commitment. With a one-year or three-year commitment of an Azure NetApp Files reservation, you can save up to 34% on sustained usage of Azure NetApp Files. Reservations are available in stackable increments of 100 TiB and 1 PiB on Standard, Premium and Ultra service levels in a given region. Azure NetApp Files reservations benefits are automatically applied to existing Azure NetApp Files capacity pools in the matching region and service level. Azure NetApp Files reservations provide cost savings and financial predictability and stability, allowing for more effective budgeting. Additional usage is conveniently billed at the regular pay-as-you-go rate.

    For more detail, see the [Azure NetApp Files reserved capacity](reserved-capacity.md) or see reservations in the Azure portal.

* [Access-based enumeration](azure-netapp-files-create-volumes-smb.md#access-based-enumeration) is now generally available (GA)

    In environments with Azure NetApp Files volumes shared among multiple departments, projects, and users, many users can see the existence of other files and folders in directory listings even if they don't have permissions to access those items. Enabling Access-based enumeration (ABE) on Azure NetApp Files volumes ensures users only see those files and folders in directory listings that they have permission to access. If a user doesn't have read or equivalent permissions for a folder, the Windows client hides the folder from the user’s view. This capability provides an additional layer of security by only displaying files and folders a user has access to, and conversely hiding file and folder information a user has no access. You can enable ABE on Azure NetApp Files SMB volume and dual-protocol volume with NTFS security style.

* [Non-browsable shares](azure-netapp-files-create-volumes-smb.md#non-browsable-share) are now generally available (GA)

    By default, Azure NetApp Files SMB and dual-protocol volumes show up in the list of shares in Windows Files Explorer. You might want to exclude specific Azure NetApp Files volumes from being listed. You can configure these volumes as non-browsable in Azure NetApp Files. This feature prevents the Windows client from browsing the share so the share doesn't show up in the Windows File Explorer. This capability provides an additional layer of security by not displaying these shares. This setting doesn't impact permissions. Users who have access to the share maintain their existing access.

## August 2024

* [Azure NetApp Files storage with cool access](cool-access-introduction.md) is now generally available (GA) and supported with the Standard, Premium, and Ultra service levels. Cool access is also now supported for destination volumes in cross-region/cross-zone relationships. 

    With the announcement of cool access's general availability, you can now enable cool access for volumes in Premium and Ultra service level capacity pools, in addition to volumes in Standard service levels capacity pools. With cool access, you can transparently store data in a more cost effective manner on Azure storage accounts based on the data's access pattern. 

    The cool access feature provides the ability to configure a capacity pool with cool access, which moves cold (infrequently accessed) data transparently to Azure storage account to help you reduce the total cost of storage. There's a difference in data access latency as data blocks might be tiered to Azure storage account. The cool access feature provides options for the "coolness period" to optimize the days in which infrequently accessed data moves to cool tier and network transfer cost, based on your workload and read/write patterns. The "coolness period" feature is provided at the volume level. 

    In a cross-region or cross-zone replication setting, cool access can now be configured for destination only volumes to ensure data protection. This capability provides cost savings without any latency impact on source volumes.

    You still must [register the feature](manage-cool-access.md#register-the-feature) before enabling cool access. 

* [Volume encryption with customer-managed keys with managed Hardware Security Module (HSM)](configure-customer-managed-keys-hardware.md) (Preview)

    Volume encryption with customer-managed keys with managed HSM extends the [customer-managed keys](configure-customer-managed-keys.md), enabling you to store your keys in a more secure FIPS 140-2 Level 3 HSM service instead of the FIPS 140-2 Level 1 or 2 encryption offered with Azure Key Vault. 

* [Volume enhancement: Azure NetApp Files now supports 50 GiB minimum volume sizes](azure-netapp-files-create-volumes.md) (preview)

    You can now create an Azure NetApp Files volume as small as [50 GiB](azure-netapp-files-resource-limits.md)--a reduction from the initial minimum size of 100 GiB. 50 GiB volumes save costs for workloads that require volumes smaller than 100 GiB, allowing you to appropriately size storage volumes. 50 GiB volumes are supported for all protocols with Azure NetApp Files: [NFS](azure-netapp-files-create-volumes.md), [SMB](azure-netapp-files-create-volumes-smb.md), and [dual-protocol](create-volumes-dual-protocol.md). You must register for the feature before creating a volume smaller than 100 GiB. 

* [Azure NetApp Files double encryption at rest](double-encryption-at-rest.md) is now generally available (GA). 

## July 2024

* Availability zone volume placement enhancement - [**Populate existing volumes**](manage-availability-zone-volume-placement.md#populate-an-existing-volume-with-availability-zone-information) is now generally available (GA).

* [Cross-zone replication](cross-zone-replication-introduction.md) is now generally available (GA).

    Cross-zone replication allows you to replicate your Azure NetApp Files volumes asynchronously from one Azure availability zone (AZ) to another within the same region. Using technology similar to the cross-region replication feature and Azure NetApp Files availability zone volume placement feature, cross-zone replication replicates data in-region across different zones; only changed blocks are sent over the network in a compressed, efficient format. It helps you protect your data from unforeseeable zone failures without the need for host-based data replication. This feature minimizes the amount of data required to replicate across the zones, limiting data transfers required and shortens the replication time so you can achieve a smaller Restore Point Objective (RPO). Cross-zone replication doesn’t involve any network transfer costs and is highly cost-effective. 
    
    Cross-zone replication is available in all [regions with availability zones](../reliability/availability-zones-region-support.md) and with [Azure NetApp Files presence](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=netapp&regions=all&rar=true).
    
* [Transition a volume to customer-managed keys](configure-customer-managed-keys.md#transition) (Preview)

    Azure NetApp Files now supports the ability to transition an existing volume to use customer-managed keys for volume encryption. 

* [Customer-managed keys for Azure NetApp Files volume encryption](configure-customer-managed-keys.md#supported-regions) is now available in all US Gov regions

* [Azure NetApp Files large volume enhancement:](large-volumes-requirements-considerations.md) increased throughput and maximum size limit of 2-PiB volume (preview)

    Azure NetApp Files large volumes now support increased maximum throughput and size limits. This update brings an increased size limit to **one PiB,** available via Azure Feature Exposure Control (AFEC), allowing for more extensive and robust data management solutions for various workloads, including HPC, EDA, VDI, and more.
    
    This update also introduces a preview of a large volume type, starting from **one PiB** up to **two PiB**, available upon request. This **2-PiB** enhancement is subject to regional availability and capacity, ensuring that Azure NetApp Files can meet your specific needs and requirements. This feature is currently in preview. To take advantage of the 2-PiB large volume feature, contact your account team.
    
* [Azure NetApp Files backup](backup-introduction.md) is now available in Azure [US Gov regions](backup-introduction.md#supported-regions).


* [Metrics enhancement:](azure-netapp-files-metrics.md) New performance metrics for volumes

    New counters have been added to Azure NetApp Files performance metrics to increase visibility into your volumes' workloads:

    - Other IOPS: any operations other than read or write.
    - Total IOPS: a summation of all IOPS (read, write, and other)
    - Other throughput: any operations other than read or write.
    - Total throughput: Total throughput is a summation of all throughput (read, write, and other)

## June 2024

* [Application volume group for SAP HANA extension 1](application-volume-group-introduction.md#extension-1-features) (Preview)

    Extension 1 of application volume group for SAP HANA improves your volume group deployment experience for SAP HANA with:
    - The use of [availability zone volume placement](use-availability-zones.md), eliminating the need for manual AVSet pinning with proximity placement groups.
    - Support for [Standard network features](azure-netapp-files-network-topologies.md) for SAP HANA volumes. 

## May 2024

* [Large volumes](large-volumes-requirements-considerations.md) are now generally available (GA) with support for [cross-zone replication](cross-zone-replication-requirements-considerations.md) and [cross-region replication](cross-region-replication-requirements-considerations.md).

    Azure NetApp Files large volumes feature support the creation of new volumes between 50 TiB to 500 TiB in size. Regular Azure NetApp Files volumes are limited to 100 TiB in size. Large volumes enable a variety of use cases and workloads that require larger volumes with a single namespace such as High-Performance Computing (HPC) in the EDA and O&G space.
    
    Azure NetApp Files large volumes is now also supported with cross-zone and cross-region replication. This capability is particularly beneficial for HPC, AI/ML, and large file content repositories, ensuring data resilience and business continuity across various scenarios.
    
    For HPC workloads, which are essential for simulating processes and electronic design automation, this feature enhances data protection and availability, crucial for maintaining uninterrupted operations. AI/ML workloads, especially those involving large datasets for training complex models, will benefit from the added security and recovery options, ensuring data integrity for critical applications. Content repositories with large files, which often remain unchanged for extended periods but require immediate access, can now leverage the benefits of cross-zone and cross-region replication to safeguard against data loss while optimizing for cost and scale. By integrating these replication features, you can achieve a new level of data security and operational stability.

* [Support for one Active Directory connection per NetApp account](create-active-directory-connections.md#multi-ad) (Preview)

    The Azure NetApp Files support for one Active Directory (AD) connection per NetApp account feature now allows each NetApp account to connect to its own AD Forest and Domain, providing the ability to manage more than one AD connections within a single region under a subscription. This enhancement enables distinct AD connections for each NetApp account, facilitating operational isolation and specialized hosting scenarios. AD connections can be configured multiple times for multiple NetApp accounts to make use of it. With the creation of SMB volumes in Azure NetApp Files now tied to AD connections in the NetApp account, the management of AD environments becomes more scalable, streamlined and efficient. This feature is in preview.

* [Azure NetApp Files backup](backup-introduction.md) is now generally available (GA).

    Azure NetApp Files online snapshots are enhanced with backup of snapshots. With this backup capability, you can offload (vault) your Azure NetApp Files snapshots to a Backup vault in a fast and cost-effective way, further protecting your data from accidental deletion. 
     
    Backup further extends Azure NetApp Files’ built-in snapshot technology; when snapshots are vaulted to a Backup vault only changed data blocks relative to previously vaulted snapshots are copied and stored, in an efficient format. Vaulted snapshots however are still represented in full and can be restored to a new volume individually and directly, eliminating the need for an iterative full-incremental recovery process.   

    This feature is now generally available in all [supported regions](backup-introduction.md#supported-regions). 

## April 2024 

* [Application volume group for Oracle](application-volume-group-oracle-introduction.md) (Preview)

    Application volume group (AVG) for Oracle enables you to deploy all volumes required to install and operate Oracle databases at enterprise scale, with optimal performance and according to best practices in a single one-step and optimized workflow. The application volume group feature uses the Azure NetApp Files ability to place all volumes in the same availability zone as the VMs to achieve automated, latency-optimized deployments. 

    Application volume group for Oracle has implemented many technical improvements that simplify and standardize the entire process to help you streamline volume deployments for Oracle. All required volumes, such as up to eight data volumes, online redo log and archive redo log, backup and binary, are created in a single "atomic" operation (through the Azure portal, RP, or API).

    Azure NetApp Files application volume group shortens Oracle database deployment time and increases overall application performance and stability, including the use of multiple storage endpoints. The application volume group feature supports a wide range of Oracle database layouts from small databases with a single volume up to multi 100-TiB sized databases. It supports up to eight data volumes with latency-optimized performance and is only limited by the database VM's network capabilities. 

    Application volume group for Oracle is supported in all Azure NetApp Files-enabled regions.
  
## March 2024

* [Large volumes (Preview) improvement:](large-volumes-requirements-considerations.md) new minimum size of 50 TiB

    Large volumes support a minimum size of 50 TiB. Large volumes still support a maximum quota of 500 TiB. 

* [Availability zone volume placement](manage-availability-zone-volume-placement.md) is now generally available (GA).

    You can deploy new volumes in the logical availability zone of your choice to create cross-zone volumes to improve resiliency in case of zonal failures. This feature is available in all availability zone-enabled regions with Azure NetApp Files presence.
    
    The [populate existing volume](manage-availability-zone-volume-placement.md#populate-an-existing-volume-with-availability-zone-information) feature is still in preview. 

* [Capacity pool enhancement](azure-netapp-files-set-up-capacity-pool.md): The 1 TiB capacity pool feature is now generally available (GA). 

    The 1 TiB lower limit for capacity pools using Standard network features is now generally available (GA). You still must register the feature.

* [Volume enhancement: create volumes with the same file path, share name, or volume path in different availability zones](manage-availability-zone-volume-placement.md#file-path-uniqueness) (Preview)

    Azure NetApp Files now allows you to create volumes with the same file path (NFS), share name (SMB), or volume path (dual-protocol) as long as they are in different availability zones. For more information, see [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md), [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md), or [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md). This enhancement is currently in preview. 
    
## February 2024

* [Volume and protocol enhancement](understand-volume-languages.md): extended language support for file and path names

    Azure NetApp Files uses a default volume language of C.UTF-8, which provides POSIX compliant UTF-8 encoding for character sets. The C.UTF-8 language natively supports characters with a size of 0-3 bytes, which includes a majority of the world’s languages on the Basic Multilingual Plane (BMP) (including Japanese, German, and most of Hebrew and Cyrillic). 
    
    Azure NetApp Files now supports characters outside of the BMP using surrogate pair logic, where multiple character byte sets are combined to form new characters. Emoji symbols, for example, fall into this category and are now supported in Azure NetApp Files.

    To learn more about languages and special character handling in Azure NetApp Files volumes, see [Understand volume languages in Azure NetApp Files](understand-volume-languages.md).
    
    To learn more about file path lengths in relation to language and character handling in Azure NetApp Files volumes, see [Understand path lengths in Azure NetApp Files](understand-path-lengths.md).
    

* [Customer-managed keys enhancement:](configure-customer-managed-keys.md) automated managed system identity (MSI) support

    Customer-managed keys now supports automated MSI: you no longer need to manually renew certificates.

* The [Standard network features - Edit volumes](configure-network-features.md#edit-network-features-option-for-existing-volumes) feature is now generally available (GA).

    You still must register the feature before using it for the first time.

* [Large volumes (Preview) improvement:](large-volumes-requirements-considerations.md#requirements-and-considerations) volume size increase beyond 30% default limit

    For capacity and resources planning purposes the Azure NetApp Files large volume feature has a [volume size increase limit of up to 30% of the lowest provisioned size](large-volumes-requirements-considerations.md#requirements-and-considerations). This volume size increase limit is now adjustable beyond this 30% (default) limit via a support ticket. For more information, see [Resource limits](azure-netapp-files-resource-limits.md). 
    

## January 2024

* [Standard network features - Edit volumes available in US Gov regions](azure-netapp-files-network-topologies.md) (Preview)

    Azure NetApp Files now supports the capability to edit network features of existing volumes in US Gov Arizona, US Gov Texas, and US Gov Texas. This capability provides an enhanced, more standard, Microsoft Azure Virtual Network experience through various security and connectivity features that are available on Virtual Networks to Azure services. This feature is in preview in commercial and US Gov regions. 
    
* [Customer-managed keys](configure-customer-managed-keys.md) is now generally available (GA).

## November 2023

* [Capacity pool enhancement:](azure-netapp-files-set-up-capacity-pool.md) New lower limits

    * 2 TiB capacity pool: The 2 TiB lower limit for capacity pools using Standard network features is now generally available (GA).

    * 1 TiB capacity pool: Azure NetApp Files now supports a lower limit of 1 TiB for capacity pool sizing with Standard network features. This feature is currently in preview.

* [Metrics enhancement: Throughput limits](azure-netapp-files-metrics.md#volumes)

    Azure NetApp Files now supports a "throughput limit reached" metric for volumes. The metric is a Boolean value that denotes the volume is hitting its QoS limit. With this metric, you know whether or not to adjust volumes so they meet the specific needs of your workloads.

* [Standard network features in US Gov regions](azure-netapp-files-network-topologies.md) is now generally available (GA)

    Azure NetApp Files now supports Standard network features for new volumes in US Gov Arizona, US Gov Texas, and US Gov Virginia. Standard network features provide an enhanced virtual networking experience through various features for a seamless and consistent experience with security posture of all their workloads including Azure NetApp Files.

* [Volume user and group quotas](default-individual-user-group-quotas-introduction.md) is now generally available (GA).

    User and group quotas enable you to stay in control and define how much storage capacity can be used by individual users or groups can use within a specific Azure NetApp Files volume. You can set default (same for all users) or individual user quotas on all NFS, SMB, and dual protocol-enabled volumes. On all NFS-enabled volumes, you can define a default (that is, same for all users) or individual group quotas.

    This feature is Generally Available in Azure commercial regions and US Gov regions where Azure NetApp Files is available.

* [SMB Continuous Availability (CA)](azure-netapp-files-create-volumes-smb.md#add-an-smb-volume) shares now supports MSIX app attach for Azure Virtual Desktop

    In addition to Citrix App Layering, FSLogix user profiles including FSLogix ODFC containers, and Microsoft SQL Server, Azure NetApp Files now supports [MSIX app attach](../virtual-desktop/create-netapp-files.md) with SMB Continuous Availability shares to enhance resiliency during storage service maintenance operations.  Continuous Availability enables SMB transparent failover to eliminate disruptions as a result of service maintenance events and improves reliability and user experience.

* [Azure NetApp Files datastores for Azure VMware Solution](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md#supported-regions) in US Gov regions

    Azure NetApp Files now supports [Azure NetApp Files datastores for Azure VMware Solution](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md?tabs=azure-portal) in US Gov Arizona and US Gov Virginia regions. Azure NetApp Files datastores for Azure VMware Solution provide the ability to scale storage independently of compute and can go beyond the limits of the local instance storage provided by vSAN reducing total cost of ownership.

## October 2023

* [Standard storage with cool access](cool-access-introduction.md) (Preview)

    Most of unstructured data is typically infrequently accessed. It can account for more than 50% of the total storage capacity in many storage environments. Infrequently accessed data associated with productivity software, completed projects, and old datasets are an inefficient use of a high-performance storage. You can now use the cool access option in a capacity pool of Azure NetApp Files standard service level to have inactive data transparently moved from Azure NetApp Files standard service-level storage (the *hot tier*) to an Azure storage account (the *cool tier*). This option lets you free up storage that resides within Azure NetApp Files volumes by moving data blocks to the lower cost cool tier, resulting in overall cost savings. You can configure this option on a volume by specifying the number of days (the *coolness period*, ranging from 2 to 183 days) for inactive data to be considered "cool". Viewing and accessing the data stay transparent, except for a higher access time to data blocks that were moved to the cool tier.

* [Troubleshoot Azure NetApp Files using diagnose and solve problems tool](troubleshoot-diagnose-solve-problems.md)

    The **diagnose and solve problems** tool simplifies the troubleshooting process, making it effortless to identify and resolve any issues affecting your Azure NetApp Files deployment. With the tool's proactive troubleshooting, user-friendly guidance, and seamless integration with Azure Support, you can more easily manage and maintain a reliable and high-performance Azure NetApp Files storage environment. Experience enhanced issue resolution and optimization capabilities today, ensuring a smoother Azure NetApp Files management experience.

* [Snapshot manageability enhancement: Identify parent snapshot](snapshots-restore-new-volume.md)

    You can now see the name of the snapshot used to create a new volume. In the Volume overview page, the **Originated from** field identifies the source snapshot used in volume creation. If the field is empty, no snapshot was used.

## September 2023

* [Standard network features in select US Gov regions (Preview)](azure-netapp-files-network-topologies.md)

    Azure NetApp Files now supports Standard network features for new volumes in select US Gov regions. Standard network features provide an enhanced virtual networking experience through various features for a seamless and consistent experience with security posture of all their workloads including Azure NetApp Files. You can now choose Standard or Basic network features when creating a new Azure NetApp Files volume. This feature is Generally Available in Azure commercial regions and public preview US Gov region(s).

* [Troubleshooting enhancement: validate user connectivity, group membership and access to LDAP-enabled volumes](troubleshoot-user-access-ldap.md)

    Azure NetApp Files now provides you with the ability to validate user connectivity and access to LDAP-enabled volumes based on group membership. When you provide a user ID, Azure NetApp Files reports a list of primary and auxiliary group IDs that the user belongs to from the LDAP server. Validating user access is helpful for scenarios such as ensuring POSIX attributes set on the LDAP server are accurate or when you encounter permission errors.

## August 2023

* [Cross-region replication enhancement: re-establish deleted volume replication](reestablish-deleted-volume-relationships.md) (Preview)

    Azure NetApp Files now allows you to re-establish a replication relationship between two volumes in case you had previously deleted it. If the destination volume remained operational and no snapshots were deleted, the replication re-establish operation will use the last common snapshot and incrementally synchronize the destination volume based on the last known good snapshot. In that case, no baseline replication is required.

* [Backup vault](backup-vault-manage.md) (Preview)

    Azure NetApp Files backups are now organized under a backup vault. You must migrate all existing backups to a backup vault. For more information, see [Migrate backups to a backup vault](backup-vault-manage.md#migrate-backups-to-a-backup-vault).

* [SMB Continuous Availability (CA) shares](azure-netapp-files-create-volumes-smb.md#add-an-smb-volume) is now generally available (GA).

    To enhance resiliency during storage service maintenance operations, SMB volumes used by Citrix App Layering, FSLogix user profile containers and Microsoft SQL Server on Microsoft Windows Server can be enabled with Continuous Availability. Continuous Availability enables SMB Transparent Failover to eliminate disruptions as a result of service maintenance events and improves reliability and user experience.

    To learn more about Continuous Availability, see the [application resiliency FAQ](faq-application-resilience.md#do-i-need-to-take-special-precautions-for-smb-based-applications) and follow the instructions to enable it on new and existing SMB volumes.

* [Configure NFSv4.1 ID domain for non-LDAP volumes](azure-netapp-files-configure-nfsv41-domain.md) (Preview)

    To harmonize the authentication ID Domain settings in your NFSv4.1 environment, you can now configure a custom NFSv4.1 ID Domain in Azure NetApp Files for non-LDAP volumes. The ID Domain is set for all non-LDAP volumes in the same region and subscription, and can co-exist in environments with LDAP-enabled volumes. Once the ID Domain on Azure NetApp Files matches your NFSv4.1 clients, ‘root’ and non-root users will no longer be squashed to ‘nobody’. This setting helps either prepare for a future implementation of LDAP with Active Directory in the future by enabling the use of the same authentication ID Domain across all NFSv4.1 clients, or just ensures scripts and software installation routines that use ‘root’ can modify files on NFSv4.1 volumes correctly.

    For details on registering the feature and setting NFSv4.1 ID Domain in Azure NetApp Files, see [Configure NFSv4.1 ID Domain](azure-netapp-files-configure-nfsv41-domain.md).

* [Moving volumes from *manual* QoS capacity pool to *auto* QoS capacity pool](dynamic-change-volume-service-level.md)

    You can now move volumes from a manual QoS capacity pool to an auto QoS capacity pool. When you move a volume to an auto QoS capacity pool, the throughput is changed according to the allocated volume size (quota) of the target pool's service level:  `<throughput> = <volume quota> x <Service Level Throughput / TiB>`

## June 2023

* [Cloud Backup for Virtual Machines on Azure NetApp Files datastores for Azure VMware Solution](../azure-vmware/install-cloud-backup-virtual-machines.md) (Preview)

    You can now create VM consistent snapshot backups of VMs on Azure NetApp Files datastores using [Cloud Backup for Virtual Machines](../azure-vmware/backup-azure-netapp-files-datastores-vms.md). The associated virtual appliance installs in the Azure VMware Solution cluster and provides policy based automated and consistent backup of VMs integrated with Azure NetApp Files snapshot technology for fast backups and restores of VMs, groups of VMs (organized in resource groups) or complete datastores.

* [Azure NetApp Files double encryption at rest](double-encryption-at-rest.md) (Preview)

    We're excited to announce the addition of double encryption at rest for Azure NetApp Files volumes. This new feature provides an extra layer of protection for your critical data, ensuring maximum confidentiality and mitigating potential liabilities. Double encryption at rest is ideal for industries such as finance, military, healthcare, and government, where breaches of confidentiality can have catastrophic consequences. By combining hardware-based encryption with encrypted SSD drives and software-based encryption at the volume level, your data remains secure throughout its lifecycle. You can select **double** as the encryption type during capacity pool creation to easily enable this advanced security layer.

* Availability zone volume placement enhancement - [Populate existing volumes](manage-availability-zone-volume-placement.md#populate-an-existing-volume-with-availability-zone-information) (Preview)

    The Azure NetApp Files [availability zone volume placement](manage-availability-zone-volume-placement.md) feature lets you deploy *new volumes* in the availability zone of your choice, in alignment with Azure compute and other services in the same zone. With this "Populate existing volume" enhancement, you can now obtain and, if desired, populate *previously deployed, existing volumes* with the logical availability zone information. This capability automatically maps the physical zone the volumes was deployed in and maps it to the logical zone for your subscription. This feature doesn't move any volumes between zones.

* [Customer-managed keys](configure-customer-managed-keys.md) for Azure NetApp Files now supports the option to Disable public access on the key vault that contains your encryption key. Selecting this option enhances network security by denying public configurations and allowing only connections through private endpoints.

## May 2023

* Azure NetApp Files now supports [customer-managed keys](configure-customer-managed-keys.md) on both source and data replication volumes with [cross-region replication](cross-region-replication-requirements-considerations.md)  or [cross-zone replication](cross-zone-replication-requirements-considerations.md) relationships.

* [Standard network features - Edit volumes](configure-network-features.md#edit-network-features-option-for-existing-volumes) (Preview)

    Azure NetApp Files volumes have been supported with Standard network features since [October 2021](#october-2021), but only for newly created volumes. This new *edit volumes* capability lets you change *existing* volumes that were configured with Basic network features to use Standard network features. This capability provides an enhanced, more standard, Microsoft Azure Virtual Network experience through various security and connectivity features that are available on Virtual Networks to Azure services. When you edit existing volumes to use Standard network features, you can start taking advantage of networking capabilities, such as (but not limited to):
    * Increased number of client IPs in a virtual network (including immediately peered Virtual Networks) accessing Azure NetApp Files volumes - the [same as Azure VMs](azure-netapp-files-resource-limits.md#resource-limits)
    * Enhanced network security with support for [network security groups](../virtual-network/network-security-groups-overview.md) on Azure NetApp Files delegated subnets
    * Enhanced network control with support for [user-defined routes](../virtual-network/virtual-networks-udr-overview.md#user-defined) to and from Azure NetApp Files delegated subnets
    * Connectivity over Active/Active VPN gateway setup
    * [ExpressRoute FastPath](../expressroute/about-fastpath.md) connectivity to Azure NetApp Files

    This feature is now in public preview, currently available in [16 Azure regions](azure-netapp-files-network-topologies.md). It will roll out to other regions. Stay tuned for further information as more regions become available.

* [Azure Application Consistent Snapshot tool (AzAcSnap) 8](azacsnap-introduction.md) is now generally available (GA)

    Version 8 of the AzAcSnap tool is now generally available. [Azure Application Consistent Snapshot Tool](azacsnap-introduction.md) (AzAcSnap) is a command-line tool that enables you to simplify data protection for third-party databases in Linux environments. AzAcSnap 8 introduces the following new capabilities and improvements:

    * Restore change -  ability to revert volume for Azure NetApp Files
    * New global settings file (`.azacsnaprc`) to control behavior of `azacsnap`
    * Logging enhancements for failure cases and new "mainlog" for summarized monitoring
    * Backup (`-c backup`) and Details (`-c details`) fixes

    Download the latest release of the installer [here](https://aka.ms/azacsnapinstaller).

* [Single-file snapshot restore](snapshots-restore-file-single.md) is now generally available (GA)

* [Troubleshooting enhancement: break file locks](troubleshoot-file-locks.md)

    You might sometimes encounter stale file locks on NFS, SMB, or dual-protocol volumes that need to be cleared. With this new Azure NetApp Files feature, you can now break these locks. You can break file locks for all files in a volume or break all file locks initiated by a specified client.

## April 2023

* [Azure Virtual WAN](configure-virtual-wan.md) is now generally available in [all regions](azure-netapp-files-network-topologies.md#) that support standard network features

## March 2023

* [Disable `showmount`](disable-showmount.md) (Preview)

    By default, Azure NetApp Files enables [`showmount` functionality](/windows-server/administration/windows-commands/showmount) to show NFS exported paths. The setting allows NFS clients to use the `showmount -e` command to see a list of exports available on the Azure NetApp Files NFS-enabled storage endpoint. This functionality might cause security scanners to flag the Azure NetApp Files NFS service as having a vulnerability because these scanners often use `showmount` to see what is being returned. In those scenarios, you might want to disable `showmount` on Azure NetApp Files. This setting allows you to enable/disable `showmount` for your NFS-enabled storage endpoints.

* [Active Directory support improvement](create-active-directory-connections.md#preferred-server-ldap) (Preview)

    The Preferred server for LDAP client option allows you to submit the IP addresses of up to two Active Directory (AD) servers as a comma-separated list. Rather than sequentially contacting all of the discovered AD services for a domain, the LDAP client will contact the specified servers first.

## February 2023

* [Cross region replication enhancement: snapshot revert on replication source volume](snapshots-revert-volume.md)

    When using cross-region replication, reverting a snapshot in a source or destination volume with an active replication configuration wasn't initially supported. Restoring a snapshot on the source volume from the latest local snapshot wasn't possible. Instead you had to use either client copy using the `.snapshot` directory, single file snapshot restore, or needed to break the replication in order to apply a volume revert. With this new feature, a snapshot revert on a replication source volume is possible provided that you select a snapshot that is newer than the latest SnapMirror snapshot. This feature enables data recovery (revert) from a snapshot while cross region replication stays active, improving data protection SLA.

* [Access-based enumeration](azure-netapp-files-create-volumes-smb.md#access-based-enumeration) (Preview)

    Access-based enumeration (ABE) displays only the files and folders that a user has permissions to access. If a user doesn't have Read (or equivalent) permissions for a folder, the Windows client hides the folder from the user’s view. This new capability provides an additional layer of security by only displaying files and folders a user has access to, and as a result hiding file and folder information a user has no access to. You can now enable ABE on Azure NetApp Files [SMB](azure-netapp-files-create-volumes-smb.md#access-based-enumeration) and [dual-protocol](create-volumes-dual-protocol.md#access-based-enumeration) (with NTFS security style) volumes.

* [Non-browsable shares](azure-netapp-files-create-volumes-smb.md#non-browsable-share) (Preview)

    You can now configure Azure NetApp Files [SMB](azure-netapp-files-create-volumes-smb.md#non-browsable-share) or [dual-protocol](create-volumes-dual-protocol.md#non-browsable-share) volumes as non-browsable. This new feature prevents the Windows client from browsing the share, and the share doesn't show up in the Windows File Explorer. This new capability provides an additional layer of security by not displaying shares that are configured as non-browsable. Users who have access to the share will maintain access.

* Option to **delete base snapshot** when you [restore a snapshot to a new volume using Azure NetApp Files](snapshots-restore-new-volume.md)

    By default, the new volume includes a reference to the snapshot that was used for the restore operation, referred to as the *base snapshot*. If you don’t want the new volume to contain this base snapshot, you can select the **Delete base snapshot** option during volume creation.

* The [Unix permissions and change ownership mode](configure-unix-permissions-change-ownership-mode.md) features are now generally available (GA).

    You no longer need to register the features before using them.

* The `Vaults` API is deprecated starting with Azure NetApp Files REST API version 2022-09-01.

    Enabling backup of volumes doesn't require the `Vaults` API. REST API users can use `PUT` and `PATCH` [Volumes API](/rest/api/netapp/volumes) to enable backup for a volume.

* [Volume user and group quotas](default-individual-user-group-quotas-introduction.md) (Preview)

    Azure NetApp Files volumes provide flexible, large and scalable storage shares for applications and users. Storage capacity and consumption by users is only limited by the size of the volume. In some scenarios, you may want to limit this storage consumption of users and groups within the volume. With Azure NetApp Files volume user and group quotas, you can now do so. User and/or group quotas enable you to restrict the storage space that a user or group can use within a specific Azure NetApp Files volume. You can choose to set default (same for all users) or individual user quotas on all NFS, SMB, and dual protocol-enabled volumes. On all NFS-enabled volumes, you can set default (same for all users) or individual group quotas.

* [Large volumes](large-volumes-requirements-considerations.md) (Preview)

    Regular Azure NetApp Files volumes are limited to 100 TiB in size. Azure NetApp Files [large volumes](azure-netapp-files-understand-storage-hierarchy.md#large-volumes) break this barrier by enabling volumes of 100 TiB to 1 PiB in size. The large volumes capability enables various use cases and workloads that require large volumes with a single directory namespace.

* [Customer-managed keys](configure-customer-managed-keys.md) (Preview)

    Azure NetApp Files volumes now support encryption with customer-managed keys and Azure Key Vault to enable an extra layer of security for data at rest.

    Data encryption with customer-managed keys for Azure NetApp Files allows you to bring your own key for data encryption at rest. You can use this feature to implement separation of duties for managing keys and data. Additionally, you can centrally manage and organize keys using Azure Key Vault. With customer-managed encryption, you are in full control of, and responsible for, a key's lifecycle, key usage permissions, and auditing operations on keys.

* [Capacity pool enhancement](azure-netapp-files-set-up-capacity-pool.md) (Preview)

    Azure NetApp Files now supports a lower limit of 2 TiB for capacity pool sizing with Standard network features.

    You can now choose a minimum size of 2 TiB when creating a capacity pool. Capacity pools smaller than 4 TiB in size can only be used with volumes using [standard network features](configure-network-features.md#options-for-network-features). This enhancement provides a more cost effective solution for running workloads such as SAP-shared files and VDI that require lower capacity pool sizes for their capacity and performance needs. When you have less than 2-4 TiB capacity with proportional performance, this enhancement allows you to start with 2 TiB as a minimum pool size and increase with 1-TiB increments. For capacities less than 3 TiB, this enhancement saves cost by allowing you to re-evaluate volume planning to take advantage of savings of smaller capacity pools. This feature is supported in all [regions with Standard network features](azure-netapp-files-network-topologies.md).

## December 2022

* [Azure Application Consistent Snapshot tool (AzAcSnap) 7](azacsnap-introduction.md)

    Azure Application Consistent Snapshot Tool (AzAcSnap) is a command-line tool that enables customers to simplify data protection for third-party databases in Linux environments.

    The AzAcSnap 7 release includes the following fixes and improvements:
    * Shortening of snapshot names
    * Restore (`-c restore`) improvements
    * Test (`-c test`) improvements
    * Validation improvements
    * Time-out improvements
    * Azure Backup integration improvements
    * Features moved to GA (generally available):
        None
    * The following features are now in preview:
        * Preliminary support for [Azure NetApp Files backup](backup-introduction.md)
        * [IBM Db2 database](https://www.ibm.com/products/db2) support adding options to configure, test, and snapshot backup IBM Db2 in an application consistent manner

    Download the latest release of the installer [here](https://aka.ms/azacsnapinstaller).

* [Cross-zone replication](create-cross-zone-replication.md) (Preview)

    With Azure’s push towards the use of availability zones (AZs), the need for storage-based data replication is equally increasing. Azure NetApp Files now supports [cross-zone replication](cross-zone-replication-introduction.md). With this new in-region replication capability - by combining it with the new availability zone volume placement feature - you can replicate your Azure NetApp Files volumes asynchronously from one Azure availability zone to another in a fast and cost-effective way.

    Cross-zone replication helps you protect your data from unforeseeable zone failures without the need for host-based data replication. Cross-zone replication minimizes the amount of data required to replicate across the zones, therefore limiting data transfers required and also shortens the replication time, so you can achieve a smaller Restore Point Objective (RPO). Cross-zone replication doesn’t involve any network transfer costs, hence it's highly cost-effective.

    The public preview of the feature is currently available in the following regions: Australia East, Brazil South, Canada Central, Central US, East Asia, East US, East US 2, France Central, Germany West Central, Japan East, North Europe, Norway East, Southeast Asia, South Central US, UK South, West Europe, West US 2, and West US 3.

    In the future, cross-zone replication is planned for all [AZ-enabled regions](../reliability/availability-zones-region-support.md) with [Azure NetApp Files presence](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=netapp&regions=all&rar=true).

* [Azure Virtual WAN](configure-virtual-wan.md) (Preview)

    [Azure Virtual WAN](../virtual-wan/virtual-wan-about.md) is now supported on Azure NetApp Files with Standard network features. Azure Virtual WAN is a spoke-and-hub architecture, enabling cloud-hosted network hub connectivity between endpoints, creating networking, security, and routing functionalities in one interface. Use cases for Azure Virtual WAN include remote user VPN connectivity (point-to-site), private connectivity (ExpressRoute), intra-cloud connectivity, and VPN ExpressRoute inter-connectivity.

## November 2022

* [Azure NetApp Files datastores for Azure VMware Solution](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md) is now generally available (GA) with expanded regional coverage.

* [Encrypted SMB connections to Domain Controller](create-active-directory-connections.md#encrypted-smb-dc) (Preview)

    With the Encrypted SMB connections to Active Directory Domain Controller capability, you can now specify whether to use encryption for communication between SMB server and domain controller in Active Directory connections. When enabled, only SMB3 is used for encrypted domain controller connections.

## October 2022

* [Availability zone volume placement](manage-availability-zone-volume-placement.md) (Preview)

    Azure availability zones are highly available, fault tolerant, and more scalable than traditional single or multiple data center infrastructures. Using Azure availability zones lets you design and operate applications and databases that automatically transition between zones without interruption. Azure NetApp Files lets you deploy new volumes in the logical availability zone of your choice to support enterprise, mission-critical HA deployments across multiple AZs. Azure’s push towards the use of [availability zones (AZs)](../reliability/availability-zones-overview.md) has increased, and the use of high availability (HA) deployments with availability zones are now a default and best practice recommendation in Azure’s [Well-Architected Framework](/azure/architecture/framework/resiliency/design-best-practices#use-zone-aware-services).

* [Application volume group for SAP HANA](application-volume-group-introduction.md) now generally available (GA)

    The application volume group for SAP HANA feature is now generally available. You no longer need to register the feature to use it.

## August 2022

* [Standard network features](configure-network-features.md) are now generally available [in supported regions](azure-netapp-files-network-topologies.md).

    Standard network features now includes Global virtual network peering.

    Regular billing for Standard network features on Azure NetApp Files began November 1, 2022.

## July 2022

* [Azure Application Consistent Snapshot Tool (AzAcSnap) 6](azacsnap-release-notes.md)

    [Azure Application Consistent Snapshot Tool](azacsnap-introduction.md) (AzAcSnap) is a command-line tool that enables customers to simplify data protection for third-party databases (SAP HANA) in Linux environments. With AzAcSnap 6, there's a new [release model](azacsnap-release-notes.md). AzAcSnap 6 also introduces the following new capabilities:

    Now generally available:
    * Oracle Database support
    * Backint integration to work with Azure Backup
    * [RunBefore and RunAfter](azacsnap-cmd-ref-runbefore-runafter.md) CLI options to execute custom shell scripts and commands before or after taking storage snapshots

    In preview:
    * Azure Key Vault to store Service Principal content
    * Azure Managed Disk as an alternate storage back end

* [Active Directory connection enhancement: Reset Active Directory computer account password](create-active-directory-connections.md#reset-active-directory) (Preview)

## June 2022

* [Disaster Recovery with Azure NetApp Files, JetStream DR and Azure VMware Solution](../azure-vmware/deploy-disaster-recovery-using-jetstream.md#disaster-recovery-with-azure-netapp-files-jetstream-dr-and-azure-vmware-solution)

* [Azure NetApp Files datastores for Azure VMware Solution](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md) (Preview)

    [Azure NetApp Files datastores for Azure VMware Solution](https://azure.microsoft.com/blog/power-your-file-storageintensive-workloads-with-azure-vmware-solution) is now in public preview. This new integration between Azure VMware Solution and Azure NetApp Files enables you to [create datastores via the Azure VMware Solution resource provider with Azure NetApp Files NFS volumes](../azure-vmware/attach-azure-netapp-files-to-azure-vmware-solution-hosts.md) and mount the datastores on your private cloud clusters of choice. Along with the integration of Azure disk pools for Azure VMware Solution, this capability provides more choice to scale storage needs independently of compute resources. For your storage-intensive workloads running on Azure VMware Solution, the integration with Azure NetApp Files helps to easily scale storage capacity beyond the limits of the local instance storage for Azure VMware Solution provided by vSAN and lower your overall total cost of ownership for storage-intensive workloads.

* [Azure Policy built-in definitions for Azure NetApp Files](azure-policy-definitions.md#built-in-policy-definitions)

    Azure Policy helps to enforce organizational standards and assess compliance at scale. Through its compliance dashboard, it provides an aggregated view to evaluate the overall state of the environment, with the ability to drill down to the per-resource, per-policy granularity. It also helps to bring your resources to compliance through bulk remediation for existing resources and automatic remediation for new resources. Azure NetApp Files already supports Azure Policy via custom policy definitions. Azure NetApp Files now also provides built-in policy to enable organization admins to restrict creation of unsecure NFS volumes or audit existing volumes more easily.

## May 2022

* [LDAP signing](create-active-directory-connections.md#ldap-signing) now generally available (GA)

    The LDAP signing feature is now generally available. You no longer need to register the feature before using it.

* [SMB Continuous Availability (CA) shares support for Citrix App Layering](enable-continuous-availability-existing-smb.md) (Preview)

    [Citrix App Layering](https://docs.citrix.com/en-us/citrix-app-layering/4.html) radically reduces the time it takes to manage Windows applications and images. App Layering separates the management of your OS and apps from your infrastructure. You can install each app and OS patch once, update the associated templates, and redeploy your images. You can publish layered images as open standard virtual disks, usable in any environment. You can use App Layering to provide dynamic access application layer virtual disks stored on SMB shared networked storage, including Azure NetApp Files. To enhance App Layering resiliency to events of storage service maintenance, Azure NetApp Files has extended support for [SMB Transparent Failover via SMB Continuous Availability (CA) shares on Azure NetApp Files](azure-netapp-files-create-volumes-smb.md#continuous-availability) for App Layering virtual disks. For more information, see [Azure NetApp Files Azure Virtual Desktop Infrastructure solutions | Citrix](azure-netapp-files-solution-architectures.md#citrix). Azure NetApp Files doesn't support custom applications with SMB Continuous Availability.

## April 2022

* Features that are now generally available (GA)

    The following features are now GA. You no longer need to register the features before using them.
    * [Dynamic change of service level](dynamic-change-volume-service-level.md)
    * [Administrators privilege users](create-active-directory-connections.md#administrators-privilege-users)


## March 2022

* Features that are now generally available (GA)

    The following features are now GA. You no longer need to register the features before using them.
    * [Backup policy users](create-active-directory-connections.md#backup-policy-users)
    * [AES encryption for AD authentication](create-active-directory-connections.md#aes-encryption)

## January 2022

* [Azure Application Consistent Snapshot Tool (AzAcSnap) v5.1 Public Preview](azacsnap-release-notes.md)

    [Azure Application Consistent Snapshot Tool](azacsnap-introduction.md) (AzAcSnap) is a command-line tool that enables customers to simplify data protection for third-party databases (SAP HANA) in Linux environments (for example, `SUSE` and `RHEL`).

    The public preview of v5.1 brings the following new capabilities to AzAcSnap:
    * Oracle Database support
    * Backint Co-existence
    * Azure Managed Disk
    * RunBefore and RunAfter capability

* [LDAP search scope](configure-ldap-extended-groups.md#ldap-search-scope)

    You might be using the Unix security style with a dual-protocol volume or Lightweight Directory Access Protocol (LDAP) with extended groups features in combination with large LDAP topologies. In this case, you might encounter "access denied" errors on Linux clients when interacting with such Azure NetApp Files volumes. You can now use the  **LDAP Search Scope** option to specify the LDAP search scope to avoid "access denied" errors.

* [Active Directory Domain Services (AD DS) LDAP user-mapping with NFS extended groups](configure-ldap-extended-groups.md) now generally available (GA)

    The AD DS LDAP user-mapping with NFS extended groups feature is now generally available. You no longer need to register the feature before using it.

## December 2021

* [NFS protocol version conversion](convert-nfsv3-nfsv41.md) (Preview)

    In some cases, you might need to transition from one NFS protocol version to another. For example, when you want an existing NFS NFSv3 volume to take advantage of NFSv4.1 features, you might want to convert the protocol version from NFSv3 to NFSv4.1. Likewise, you might want to convert an existing NFSv4.1 volume to NFSv3 for performance or simplicity reasons. Azure NetApp Files now provides an option that enables you to convert an NFS volume between NFSv3 and NFSv4.1. This option doesn't require creating new volumes or performing data copies. The conversion operations preserve the data and update the volume export policies as part of the operation.

* [Single-file snapshot restore](snapshots-restore-file-single.md) (Preview)

    Azure NetApp Files provides ways to quickly restore data from snapshots (mainly at the volume level). See [How Azure NetApp Files snapshots work](snapshots-introduction.md). Options for user file self-restore are available via client-side data copy from the `~snapshot` (Windows) or `.snapshot` (Linux) folders. These operations require data (files and directories) to traverse the network twice (upon read and write). As such, the operations aren't time and resource efficient, especially with large data sets. If you don't want to restore the entire snapshot to a new volume, revert a volume, or copy large files across the network, you can use the single-file snapshot restore feature to restore individual files directly on the service from a volume snapshot without requiring data copy via an external client. This approach drastically reduces recovery time objective (RTO) and network resource usage when restoring large files.

* Features that are now generally available (GA)

    The following features are now GA. You no longer need to register the features before using them.

    * [Dual-protocol (NFSv4.1 and SMB) volume](create-volumes-dual-protocol.md)
    * [Enable Active Directory Domain Services (AD DS) LDAP authentication for NFS volumes](configure-ldap-over-tls.md)
    * [SMB3 Protocol Encryption](azure-netapp-files-create-volumes-smb.md#smb3-encryption)

## November 2021

* [Application volume group for SAP HANA](application-volume-group-introduction.md) (Preview)

    Application volume group (AVG) for SAP HANA enables you to deploy all volumes required to install and operate an SAP HANA database according to best practices, including the use of proximity placement group (PPG) with VMs to achieve automated, low-latency deployments. AVG for SAP HANA has implemented many technical improvements that simplify and standardize the entire process to help you streamline volume deployments for SAP HANA.

## October 2021

* [Azure NetApp Files cross-region replication](cross-region-replication-introduction.md) now generally available (GA)

    The cross-region replication feature is now generally available. You no longer need to register the feature before using it.

* [Standard network features](configure-network-features.md) (Preview)

    Azure NetApp Files now supports **Standard** network features for volumes that customers have been asking for since the inception. This capability is a result of innovative hardware and software integration. Standard network features provide an enhanced virtual networking experience through various features for a seamless and consistent experience with security posture of all their workloads including Azure NetApp Files.

    You can now choose *Standard* or *Basic* network features when creating a new Azure NetApp Files volume. Upon choosing Standard network features, you can take advantage of the following supported features for Azure NetApp Files volumes and delegated subnets:
    * Increased IP limits for the virtual networks with Azure NetApp Files volumes at par with VMs
    * Enhanced network security with support for [network security groups](../virtual-network/network-security-groups-overview.md) on the Azure NetApp Files delegated subnet
    * Enhanced network control with support for [user-defined routes](../virtual-network/virtual-networks-udr-overview.md#custom-routes) to and from Azure NetApp Files delegated subnets
    * Connectivity over Active/Active VPN gateway setup
    * [ExpressRoute FastPath](../expressroute/about-fastpath.md) connectivity to Azure NetApp Files

    This public preview is currently available starting with **North Central US** and will roll out to other regions.  Stay tuned for further information through [Azure Update](https://azure.microsoft.com/updates/) as more regions and features become available.

    To learn more, see [Configure network features for an Azure NetApp Files volume](configure-network-features.md).

## September 2021

* [Azure NetApp Files backup](backup-introduction.md) (Preview)

    Azure NetApp Files online snapshots now support backup of snapshots. With this new backup capability, you can vault your Azure NetApp Files snapshots to cost-efficient and zone redundant Azure storage in a fast and cost-effective way. This approach further protects your data from accidental deletion.

    Azure NetApp Files backup extends ONTAP's built-in snapshot technology. When snapshots are vaulted to Azure storage, only changed blocks relative to previously vaulted snapshots are copied and stored, in an efficient format. Vaulted snapshots are still represented in full. You can restore them to a new volume individually and directly, eliminating the need for an iterative, full-incremental recovery process. This advanced technology minimizes the amount of data required to store to and retrieve from Azure storage, therefore saving data transfer and storage costs. It also shortens the backup vaulting time, so you can achieve a smaller Restore Point Objective (RPO). You can keep a minimum number of snapshots online on the Azure NetApp Files service for the most immediate, near-instantaneous data-recovery needs. In doing so, you can build up a longer history of snapshots at a lower cost for long-term retention in the Azure NetApp Files backup vault.

    For more information, see [How Azure NetApp Files snapshots work](snapshots-introduction.md).

* [**Administrators**](create-active-directory-connections.md#create-an-active-directory-connection) option in Active Directory connections (Preview)

    The Active Directory connections page now includes an **Administrators** field. You can specify users or groups that will have administrator privileges on the volume.

## August 2021

* Support for [enabling Continuous Availability on existing SMB volumes](enable-continuous-availability-existing-SMB.md)

    You can already enable the SMB Continuous Availability (CA) feature when you [create a new SMB volume](azure-netapp-files-create-volumes-smb.md#continuous-availability). You can now also enable SMB CA on an existing SMB volume. See [Enable Continuous Availability on existing SMB volumes](enable-continuous-availability-existing-SMB.md).

* [Snapshot policy](snapshots-manage-policy.md) now generally available (GA)

    The snapshot policy feature is now generally available. You no longer need to register the feature before using it.

* [NFS `Chown Mode` export policy and UNIX export permissions](configure-unix-permissions-change-ownership-mode.md) (Preview)

    You can now set the Unix permissions and the change ownership mode (`Chown Mode`) options on Azure NetApp Files NFS volumes or dual-protocol volumes with the Unix security style. You can specify these settings during volume creation or after volume creation.

    The change ownership mode (`Chown Mode`) functionality enables you to set the ownership management capabilities of files and directories. You can specify or modify the setting under a volume's export policy. Two options for `Chown Mode` are available:
    * *Restricted* (default),  where only the root user can change the ownership of files and directories
    * *Unrestricted*, where non-root users can change the ownership for files and directories that they own

    The Azure NetApp Files Unix Permissions functionality enables you to specify change permissions for the mount path.

    These new features put access control of certain files and directories in the hands of the data user instead of the service operator.

* [Dual-protocol (NFSv4.1 and SMB) volume](create-volumes-dual-protocol.md) (Preview)

    Azure NetApp Files already supports dual-protocol access to NFSv3 and SMB volumes as of [July 2020](#july-2020). You can now create an Azure NetApp Files volume that allows simultaneous dual-protocol (NFSv4.1 and SMB) access with support for LDAP user mapping. This feature enables use cases where you might have a Linux-based workload using NFSv4.1 for its access, and the workload generates and stores data in an Azure NetApp Files volume. At the same time, your staff might need to use Windows-based clients and software to analyze the newly generated data from the same Azure NetApp Files volume. The simultaneous dual-protocol access removes the need to copy the workload-generated data to a separate volume with a different protocol for post-analysis, saving storage cost and operational time. This feature is free of charge (normal Azure NetApp Files storage cost still applies) and is generally available. Learn more from the [simultaneous dual-protocol NFSv4.1/SMB access](create-volumes-dual-protocol.md) documentation.

## June 2021

* [Azure NetApp Files storage service add-ons](storage-service-add-ons.md)

    The new Azure NetApp Files **Storage service add-ons** menu option provides an Azure portal “launching pad” for available third-party, ecosystem add-ons to the Azure NetApp Files storage service. With this new portal menu option, you can enter a landing page by selecting an add-on tile to quickly access the add-on.

    **NetApp add-ons** is the first category of add-ons introduced under **Storage service add-ons**. It provides access to NetApp Cloud Data Sense. Selecting the **Cloud Data Sense** tile opens a new browser and directs you to the add-on installation page.

* [Manual QoS capacity pool](azure-netapp-files-understand-storage-hierarchy.md#manual-qos-type) now generally available (GA)

    The Manual QoS capacity pool feature is now generally available. You no longer need to register the feature before using it.

* [Shared AD support for multiple accounts to one Active Directory per region per subscription](create-active-directory-connections.md#shared_ad) (Preview)

    To date, Azure NetApp Files supports only a single Active Directory (AD) per region, where only a single NetApp account could be configured to access the AD. The new **Shared AD** feature enables all NetApp accounts to share an AD connection created by one of the NetApp accounts that belong to the same subscription and the same region. For example, all NetApp accounts in the same subscription and region can use the common AD configuration to create an SMB volume, a NFSv4.1 Kerberos volume, or a dual-protocol volume. When you use this feature, the AD connection is visible in all NetApp accounts that are under the same subscription and same region.

## May 2021

* Azure NetApp Files Application Consistent Snapshot tool [(AzAcSnap)](azacsnap-introduction.md) is now generally available.

    AzAcSnap is a command-line tool that enables you to simplify data protection for third-party databases (SAP HANA) in Linux environments (for example, `SUSE` and `RHEL`). See [Release Notes for AzAcSnap](azacsnap-release-notes.md) for the latest changes about the tool.

* [Support for capacity pool billing tags](manage-billing-tags.md)

    Azure NetApp Files now supports billing tags to help you cross-reference cost with business units or other internal consumers. Billing tags are assigned at the capacity pool level and not volume level, and they appear on the customer invoice.

* [Enable Active Directory Domain Services (AD DS) LDAP authentication for NFS volumes](configure-ldap-over-tls.md) (Preview)

    By default, LDAP communications between client and server applications aren't encrypted. This setting means that it's possible to use a network-monitoring device or software to view the communications between an LDAP client and server computers. This scenario might be problematic in non-isolated or shared virtual networks when an LDAP simple bind is used, because the credentials (username and password) used to bind the LDAP client to the LDAP server are passed over the network unencrypted. LDAP over TLS (also known as LDAPS) is a protocol that uses TLS to secure communication between LDAP clients and LDAP servers. Azure NetApp Files now supports the secure communication between an Active Directory Domain Server (AD DS) using LDAP over TLS. Azure NetApp Files can now use LDAP over TLS for setting up authenticated sessions between the Active Directory-integrated LDAP servers. You can enable the LDAP over TLS feature for NFS, SMB, and dual-protocol volumes. By default, LDAP over TLS is disabled on Azure NetApp Files.

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

    * Previously, VM clients would see the thinly provisioned (100 TiB) capacity of any given volume when using OS space or capacity monitoring tools. This situation could result in inaccurate capacity visibility on the client or application side. This behavior has been corrected.
    * The previous auto-grow behavior of capacity pools gave application owners no control over the provisioned capacity pool space (and the associated cost). This behavior was especially cumbersome in environments where “run-away processes” could rapidly fill up and grow the provisioned capacity. This behavior has been corrected.
    * Users want to see and maintain a direct correlation between volume size (quota) and performance. The previous behavior allowed for (implicit) over-subscription of a volume (capacity) and capacity pool auto-grow. As such, users couldn't make a direct correlation until the volume quota had been actively set or reset. This behavior has now been corrected.

    Users have requested direct control over provisioned capacity. Users want to control and balance storage capacity and utilization. They also want to control cost along with the application-side and client-side visibility of available, used, and provisioned capacity and the performance of their application volumes. With this new behavior, all this capability has now been enabled.

* [SMB Continuous Availability (CA) shares support for FSLogix user profile containers](azure-netapp-files-create-volumes-smb.md#continuous-availability) (Preview)

    [FSLogix](/fslogix/overview) is a set of solutions that enhance, enable, and simplify non-persistent Windows computing environments. FSLogix solutions are appropriate for virtual environments in both public and private clouds. You can also use FSLogix solutions to create more portable computing sessions when you use physical devices. FSLogix can provide dynamic access to persistent user profile containers stored on SMB shared networked storage, including Azure NetApp Files. To enhance FSLogix resiliency to events of storage service maintenance, Azure NetApp Files has extended support for SMB Transparent Failover via [SMB Continuous Availability (CA) shares on Azure NetApp Files](azure-netapp-files-create-volumes-smb.md#continuous-availability) for user profile containers. For more information, see Azure NetApp Files [Azure Virtual Desktop solutions](azure-netapp-files-solution-architectures.md#windows-virtual-desktop).

* [SMB3 Protocol Encryption](azure-netapp-files-create-volumes-smb.md#smb3-encryption) (Preview)

    You can now enable SMB3 Protocol Encryption on Azure NetApp Files SMB and dual-protocol volumes. This feature enables encryption for in-flight SMB3 data, using the [AES-CCM algorithm on SMB 3.0, and the AES-GCM algorithm on SMB 3.1.1](/windows-server/storage/file-server/file-server-smb-overview#features-added-in-smb-311-with-windows-server-2016-and-windows-10-version-1607) connections. SMB clients not using SMB3 encryption can't access this volume. Data at rest is encrypted regardless of this setting. SMB encryption further enhances security. However, it might affect the client (CPU overhead for encrypting and decrypting messages). It might also affect storage resource utilization (reductions in throughput). You should test the encryption performance impact against your applications before deploying workloads into production.

* [Active Directory Domain Services (AD DS) LDAP user-mapping with NFS extended groups](configure-ldap-extended-groups.md) (Preview)

    By default, Azure NetApp Files supports up to 16 group IDs when handling NFS user credentials, as defined in [RFC 5531](https://tools.ietf.org/html/rfc5531). With this new capability, you can now increase the maximum up to 1,024 if you have users who are members of more than the default number of groups. To support this capability, NFS volumes can now also be added to AD DS LDAP, which enables Active Directory LDAP users with extended groups entries (with up to 1024 groups) to access the volume.

## March 2021

* [SMB Continuous Availability (CA) shares](azure-netapp-files-create-volumes-smb.md#add-an-smb-volume) (Preview)

    SMB Transparent Failover enables maintenance operations on the Azure NetApp Files service without interrupting connectivity to server applications storing and accessing data on SMB volumes. To support SMB Transparent Failover, Azure NetApp Files now supports the SMB Continuous Availability shares option for use with SQL Server applications over SMB running on Azure VMs. This feature is currently supported on Windows SQL Server. Azure NetApp Files doesn't currently support Linux SQL Server. This feature provides significant performance improvements for SQL Server. It also provides scale and cost benefits for [Single Instance, Always-On Failover Cluster Instance and Always-On Availability Group deployments](azure-netapp-files-solution-architectures.md#sql-server). See [Benefits of using Azure NetApp Files for SQL Server deployment](solutions-benefits-azure-netapp-files-sql-server.md).

* [Automatic resizing of a cross-region replication destination volume](azure-netapp-files-resize-capacity-pools-or-volumes.md#resize-a-cross-region-replication-destination-volume)

    In a cross-region replication relationship, a destination volume is automatically resized based on the size of the source volume. As such, you don’t need to resize the destination volume separately. This automatic resizing behavior applies when the volumes are in an active replication relationship. It also applies when replication peering is broken with the resync operation. For this feature to work, you need to ensure sufficient headroom in the capacity pools for both the source and the destination volumes.

## December 2020

* [Azure Application Consistent Snapshot Tool](azacsnap-introduction.md) (Preview)

    Azure Application Consistent Snapshot Tool (AzAcSnap) is a command-line tool that enables you to simplify data protection for third-party databases (SAP HANA) in Linux environments (for example, `SUSE` and `RHEL`).

    AzAcSnap uses the volume snapshot and replication functionalities in Azure NetApp Files and Azure Large Instance. It provides the following benefits:

    * Application-consistent data protection
    * Database catalog management
    * *Ad hoc* volume protection
    * Cloning of storage volumes
    * Support for disaster recovery

## November 2020

* [Snapshot revert](snapshots-revert-volume.md)

    The snapshot revert functionality enables you to quickly revert a volume to the state it was in when a particular snapshot was taken. In most cases, reverting a volume is faster than restoring individual files from a snapshot to the active file system. It's also more space efficient compared to restoring a snapshot to a new volume.

## September 2020

* [Azure NetApp Files cross-region replication](cross-region-replication-introduction.md) (Preview)

  Azure NetApp Files now supports cross-region replication. With this new disaster recovery capability, you can replicate your Azure NetApp Files volumes from one Azure region to another in a fast and cost-effective way. It helps you protect your data from unforeseeable regional failures. Azure NetApp Files cross-region replication uses NetApp SnapMirror® technology; only changed blocks are sent over the network in a compressed, efficient format. This proprietary technology minimizes the amount of data required to replicate across the regions, therefore saving data transfer costs. It also shortens the replication time, so you can achieve a smaller Restore Point Objective (RPO).

* [Manual QoS Capacity Pool](azure-netapp-files-understand-storage-hierarchy.md#manual-qos-type) (Preview)

    In a manual QoS capacity pool, you can assign the capacity and throughput for a volume independently. The total throughput of all volumes created with a manual QoS capacity pool is limited by the total throughput of the pool. It's determined by the combination of the pool size and the service-level throughput. Alternatively, a capacity pool’s [QoS type](azure-netapp-files-understand-storage-hierarchy.md#qos_types) can be auto (automatic), which is the default. In an auto QoS capacity pool, throughput is assigned automatically to the volumes in the pool, proportional to the size quota assigned to the volumes.

* [LDAP signing](create-active-directory-connections.md#create-an-active-directory-connection) (Preview)

    Azure NetApp Files now supports LDAP signing for secure LDAP lookups between the Azure NetApp Files service and the user-specified Active Directory Domain Services domain controllers. This feature is currently in preview.

* [AES encryption for AD authentication](create-active-directory-connections.md#create-an-active-directory-connection) (Preview)

    Azure NetApp Files now supports AES encryption on LDAP connections to domain controllers (DC) to enable AES encryption for an SMB volume. This feature is currently in preview.

* New [metrics](azure-netapp-files-metrics.md):

    * New volume metrics:
        * *Volume allocated size*: The provisioned size of a volume
    * New pool metrics:
        * *Pool Allocated size*: The provisioned size of the pool
        * *Total snapshot size for the pool*: The sum of snapshot size from all volumes in the pool

## July 2020

* [Dual-protocol (NFSv3 and SMB) volume](create-volumes-dual-protocol.md)

    You can now create an Azure NetApp Files volume that allows simultaneous dual-protocol (NFS v3 and SMB) access with support for LDAP user mapping. This feature enables use cases where you may have a Linux-based workload that generates and stores data in an Azure NetApp Files volume. At the same time, your staff needs to use Windows-based clients and software to analyze the newly generated data from the same Azure NetApp Files volume. The simultaneous dual-protocol access removes the need to copy the workload-generated data to a separate volume with a different protocol for post-analysis. It helps you save storage cost and operational time. This feature is free of charge (normal [Azure NetApp Files storage cost](https://azure.microsoft.com/pricing/details/netapp/) still applies) and is generally available. Learn more from the [simultaneous dual-protocol access documentation](create-volumes-dual-protocol.MD).

* [NFS v4.1 Kerberos encryption in transit](configure-kerberos-encryption.MD)

    Azure NetApp Files now supports NFS client encryption in Kerberos modes (krb5, krb5i, and krb5p) with AES-256 encryption, providing you with more data security. This feature is free of charge (normal [Azure NetApp Files storage cost](https://azure.microsoft.com/pricing/details/netapp/) still applies) and is generally available. Learn more from the [NFS v4.1 Kerberos encryption documentation](configure-kerberos-encryption.MD).

* [Dynamic volume service level change](dynamic-change-volume-service-level.MD) (Preview)

    Cloud promises flexibility in IT spending. You can now change the service level of an existing Azure NetApp Files volume by moving the volume to another capacity pool that uses the service level you want for the volume. This in-place service-level change for the volume doesn't require that you migrate data. It also doesn't affect the data plane access to the volume. You can change an existing volume to use a higher service level for better performance, or to use a lower service level for cost optimization. This feature is free of charge (normal [Azure NetApp Files storage cost](https://azure.microsoft.com/pricing/details/netapp/) still applies). It's currently in preview. You can register for the feature preview by following the [dynamic volume service level change documentation](dynamic-change-volume-service-level.md).

* [Volume snapshot policy](snapshots-manage-policy.md) (Preview)

    Azure NetApp Files allows you to create point-in-time snapshots of your volumes. You can now create a snapshot policy to have Azure NetApp Files automatically create volume snapshots at a frequency of your choice. You can schedule the snapshots to be taken in hourly, daily, weekly, or monthly cycles. You can also specify the maximum number of snapshots to keep as part of the snapshot policy. This feature is free of charge (normal [Azure NetApp Files storage cost](https://azure.microsoft.com/pricing/details/netapp/) still applies) and is currently in preview. You can register for the feature preview by following the [volume snapshot policy documentation](snapshots-manage-policy.md).

* [NFS root access export policy](azure-netapp-files-configure-export-policy.md)

    Azure NetApp Files now allows you to specify whether the root account can access the volume.

* [Hide snapshot path](snapshots-edit-hide-path.md)

    Azure NetApp Files now allows you to specify whether a user can see and access the `.snapshot` directory (NFS clients) or `~snapshot` folder (SMB clients) on a mounted volume.

## May 2020

* [Backup policy users](create-active-directory-connections.md) (Preview)

    Azure NetApp Files allows you to include additional accounts that require elevated privileges to the computer account created for use with Azure NetApp Files. The specified accounts will be allowed to change the NTFS permissions at the file or folder level. For example, you can specify a non-privileged service account used for migrating data to an SMB file share in Azure NetApp Files. The Backup policy users feature is currently in preview.

## Next steps
* [What is Azure NetApp Files](azure-netapp-files-introduction.md)
* [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
