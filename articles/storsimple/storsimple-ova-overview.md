---
title: Microsoft Azure StorSimple Virtual Array overview
description: Describes the StorSimple Virtual Array, an integrated storage solution that manages storage tasks between an on-premises virtual array and Microsoft Azure cloud storage.
author: alkohli
ms.assetid: 169c639b-1124-46a5-ae69-ba9695525b77
ms.service: storsimple
ms.topic: conceptual
ms.date: 07/25/2019
ms.author: alkohli
---
# Introduction to the StorSimple Virtual Array

[!INCLUDE [storsimple-virtual-array-eol-banner](../../includes/storsimple-virtual-array-eol-banner.md)]

## Overview

The Microsoft Azure StorSimple Virtual Array is an integrated storage solution that manages storage tasks between an on-premises virtual array running in a hypervisor and Microsoft Azure cloud storage. The virtual array is an efficient, cost-effective, and easily managed file server or iSCSI server solution that eliminates many of the issues and expenses associated with enterprise storage and data protection. The virtual array is particularly well-suited for the storage of infrequently accessed archival data.

This article provides an overview of the virtual array - here are some other resources:

* For best practices, see [StorSimple Virtual Array best practices](storsimple-ova-best-practices.md).
* For an overview of the StorSimple 8000 series devices, go to [StorSimple 8000 series: a hybrid cloud solution](storsimple-overview.md).
* For information about the StorSimple 5000/7000 series devices, go to [StorSimple Online Help](http://onlinehelp.storsimple.com/).

The virtual array supports the iSCSI or Server Message Block (SMB) protocol. It runs on your existing hypervisor infrastructure and provides tiering to the cloud, cloud backup, fast restore, item-level recovery, and disaster recovery features.

The following table summarizes the important features of the StorSimple Virtual Array.

| Feature | StorSimple Virtual Array |
| --- | --- |
| Installation requirements |Uses virtualization infrastructure (Hyper-V or VMware) |
| Availability |Single node |
| Total capacity (including cloud) |Up to 64 TB usable capacity per virtual array |
| Local capacity |390 GB to 6.4 TB usable capacity per virtual array (need to provision 500 GB to 8 TB of disk space) |
| Native protocols |iSCSI or SMB |
| Recovery time objective (RTO) |iSCSI: less than 2 minutes regardless of size |
| Recovery point objective (RPO) |Daily backups and on-demand backups |
| Storage tiering |Uses heat mapping to determine what data should be tiered in or out |
| Support |Virtualization infrastructure supported by the supplier |
| Performance |Varies depending on underlying infrastructure |
| Data mobility |Can restore to the same device or do item-level recovery (file server) |
| Storage tiers |Local hypervisor storage and cloud |
| Share size |Tiered: up to 20 TB; locally pinned: up to 2 TB |
| Volume size |Tiered: 500 GB to 5 TB; locally pinned: 50 GB to 200 GB <br> Maximum local reservation for tiered volumes is 200 GB. |
| Snapshots |Crash consistent |
| Item-level recovery |Yes; users can restore from shares |

## Why use StorSimple?

StorSimple connects users and servers to Azure storage in minutes, with no application modification.

The following table describes some of the key benefits that the StorSimple Virtual Array solution provides.

| Feature | Benefit |
| --- | --- |
| Transparent integration |The virtual array supports the iSCSI or the SMB protocol. The data movement between the local tier and the cloud tier is seamless and transparent to the user. |
| Reduced storage costs |With StorSimple, you provision sufficient local storage to meet current demands for the most used hot data. As storage needs grow, StorSimple tiers cold data into cost-effective cloud storage. The data is deduplicated and compressed before sending to the cloud to further reduce storage requirements and expense. |
| Simplified storage management |StorSimple provides centralized management in the cloud using StorSimple Device Manager to manage multiple devices. |
| Improved disaster recovery and compliance |StorSimple facilitates faster disaster recovery by restoring the metadata immediately and restoring the data as needed. This means normal operations can continue with minimal disruption. |
| Data mobility |Data tiered to the cloud can be accessed from other sites for recovery and migration purposes. Note that you can restore data only to the original virtual array. However, you use disaster recovery features to restore the entire virtual array to another virtual array. |

## StorSimple workload summary

A summary of supported StorSimple workloads is tabulated below.

|Scenario     |Workload     |Supported      |Restrictions               | Versions applicable|
|-------------|-------------|---------------|---------------------------|--------------------|
|Remote Office/Branch Office (ROBO)  |File sharing     |Yes      |See [maximum limits for file server](storsimple-ova-limits.md).<br></br>See [system requirements for supported SMB versions](storsimple-ova-system-requirements.md).| All versions     |
|Cloud archiving  |Archival file sharing     |Yes      |See [maximum limits for file server](storsimple-ova-limits.md).<br></br>See [system requirements for supported SMB versions](storsimple-ova-system-requirements.md).| All versions     |

The StorSimple Virtual Array is best suited for infrequently accessed data. While the virtual array has a local cache to boost performance, users should assume that the device services files at the lowest tier of storage (the cloud). Each virtual array can write and read to Azure storage at approximately 100 Mbps. That link is shared across all the requests coming into the device and can become a bottleneck as shown in the diagram below.

![Cloud archiving](./media/storsimple-ova-overview/cloud-archiving.png)

When multiple concurrent users access the virtual array, they all share the connection to Azure leading to a lower performance. There is no guaranteed performance per user and the device processes individual requests as they arrive.

StorSimple Virtual Array is not suitable for workloads that require high availability. The virtual array is a single node device that experiences downtime when software updates are installed. Administrators should plan for a maintenance window of 30 minutes 3-4 times per year.

## Workflows

The StorSimple Virtual Array is particularly suitable for the following workflows:

* [Cloud-based storage management](#cloud-based-storage-management)
* [Location-independent backup](#location-independent-backup)
* [Data protection and disaster recovery](#data-protection-and-disaster-recovery)

### Cloud-based storage management
You can use the StorSimple Device Manager service running in the Azure portal to manage data stored on multiple devices and in multiple locations. This is particularly useful in distributed branch scenarios. Note that you must create separate instances of the StorSimple Device Manager service to manage virtual arrays and physical StorSimple devices. Also note that the virtual array now uses the new Azure portal instead of the Azure classic portal.

![cloud-based storage management](./media/storsimple-ova-overview/cloud-based-storage-management.png)

### Location-independent backup
With the virtual array, cloud snapshots provide a location-independent, point-in-time copy of a volume or share. Cloud snapshots are enabled by default and cannot be disabled. All volumes and shares are backup up at the same time through a single daily backup policy, and you can take additional ad hoc backups whenever necessary.

### Data protection and disaster recovery
The virtual array supports the following data protection and disaster recovery scenarios:

* **Volume or share restore** – Use the restore as new workflow to recover a volume or share. Use this approach to recover the entire volume or share.
* **Item-level recovery** – Shares allow simplified access to recent backups. You can easily recover an individual file from a special *.backup* folder available in the cloud. This restore capability is user-driven and no administrative intervention is required.
* **Disaster recovery** – Use the failover capability to recover all volumes or shares to a new virtual array. You create the new virtual array and register it with the StorSimple Device Manager service, then fail over the original virtual array. The new virtual array will then assume the provisioned resources.

## StorSimple Virtual Array components

The virtual array includes the following components:

* [Virtual array](#virtual-array) – A hybrid cloud storage device based on a virtual machine provisioned in your virtualized environment or hypervisor.
* [StorSimple Device Manager service](#storsimple-device-manager-service) – An extension of the Azure portal that lets you manage one or more StorSimple devices from a single web interface that you can access from different geographical locations. You can use the StorSimple Device Manager service to create and manage services, view and manage devices and alerts, and manage volumes, shares, and existing snapshots.
* [Local web user interface](#local-web-user-interface) – A web-based UI that is used to configure the device so that it can connect to the local network, and then register the device with the StorSimple Device Manager service. 
* [Command-line interface](#command-line-interface) – A Windows PowerShell interface that you can use to start a support session on the virtual array.
  The following sections describe each of these components in greater detail and explain how the solution arranges data, allocates storage, and facilitates storage management and data protection.

### Virtual array

The virtual array is a single-node storage solution that provides primary storage, manages communication with cloud storage, and helps to ensure the security and confidentiality of all data that is stored on the device.

The virtual array is available in one model that is available for download. The virtual array has a maximum capacity of 6.4 TB on the device (with an underlying storage requirement of 8 TB) and 64 TB including cloud storage.

The virtual array has the following features:

* It is cost effective. It makes use of your existing virtualization infrastructure and can be deployed on your existing Hyper-V or VMware hypervisor.
* It resides in the datacenter and can be configured as an iSCSI server or a file server.
* It is integrated with the cloud.
* Backups are stored in the cloud, which can facilitate disaster recovery and simplify item-level recovery (ILR).
* You can apply updates to the virtual array, just as you would apply them to a physical device.

> [!NOTE]
> A virtual array cannot be expanded. Therefore, it's important to provision adequate storage when you create the virtual array.

### StorSimple Device Manager service

Microsoft Azure StorSimple provides a web-based user interface, the StorSimple Device Manager service, that enables you to centrally manage StorSimple storage. You can use the StorSimple Device Manager service to perform the following tasks:

* Manage multiple StorSimple Virtual Arrays from a single service.
* Configure and manage security settings for StorSimple Virtual Arrays. (Encryption in the cloud is dependent on Microsoft Azure APIs.)
* Configure storage account credentials and properties.
* Configure and manage volumes or shares.
* Back up and restore data on volumes or shares.
* Monitor performance.
* Review system settings and identify possible problems.

You use the StorSimple Device Manager service to perform daily administration of your virtual array.

For more information, go to [Use the StorSimple Device Manager service to administer your StorSimple device](storsimple-virtual-array-manager-service-administration.md).

### Local web user interface

The virtual array includes a web-based UI that is used for one-time configuration and registration of the device with the StorSimple Device Manager service. You can use it to shut down and restart the virtual array, run diagnostic tests, update software, change the device administrator password, view system logs, and contact Microsoft Support to file a service request.

For information about using the web-based UI, go to [Use the web-based UI to administer your StorSimple Virtual Array](storsimple-ova-web-ui-admin.md).

### Command-line interface

The included Windows PowerShell interface enables you to initiate a support session with Microsoft Support so that they can help you troubleshoot and resolve issues that you might encounter on your virtual array.

## Storage management technologies

In addition to the virtual array and other components, the StorSimple solution uses the following software technologies to provide quick access to important data, reduce storage consumption, and protect data stored on your virtual array:

* [Automatic storage tiering](#automatic-storage-tiering) 
* [Locally pinned shares and volumes](#locally-pinned-shares-and-volumes)
* Deduplication and compression for data tiered or backed up to the cloud 
* [Scheduled and on-demand backups](#scheduled-and-on-demand-backups)

### Automatic storage tiering
The virtual array uses a new tiering mechanism to manage stored data across the virtual array and the cloud. There are only two tiers: the local virtual array and Azure cloud storage. The StorSimple Virtual Array automatically arranges data into the tiers based on a heat map, which tracks current usage, age, and relationships to other data. Data that is most active (hottest) is stored locally, while less active and inactive data is automatically migrated to the cloud. (All backups are stored in the cloud.) StorSimple adjusts and rearranges data and storage assignments as usage patterns change. For example, some information might become less active over time. As it becomes progressively less active, it is tiered out to the cloud. If that same data becomes active again, it is tiered in to the storage array.

Data for a particular tiered share or volume is guaranteed its own local tier space (approximately 10% of the total provisioned space for that share or volume). While this reduces the available storage on the virtual array for that share or volume, it ensures that tiering for one share or volume will not be affected by the tiering needs of other shares or volumes. Thus a very busy workload on one share or volume cannot force all other workloads to the cloud.

Tiered volumes created for iSCSI have a maximum local reservation of 200 GB regardless of the size of the volume.

![automatic storage tiering](./media/storsimple-ova-overview/automatic-storage-tiering.png)

> [!NOTE]
> You can specify a volume as locally pinned, in which case the data remains on the virtual array and is never tiered to the cloud. For more information, go to [Locally pinned shares and volumes](#locally-pinned-shares-and-volumes).


### Locally pinned shares and volumes

You can create appropriate shares and volumes as locally pinned. This capability ensures that data required by critical applications remains in the virtual array and is never tiered to the cloud. Locally pinned shares and volumes have the following features:

* They are not subject to cloud latencies or connectivity issues.
* They still benefit from StorSimple cloud backup and disaster recovery features.

You can restore a locally pinned share or volume as tiered or a tiered share or volume as locally pinned. 

For more information about locally pinned volumes, go to [Use the StorSimple Device Manager service to manage volumes](storsimple-virtual-array-manage-volumes.md).

### Deduplication and compression for data tiered or backed up to the cloud

StorSimple uses deduplication and data compression to further reduce storage requirements in the cloud. Deduplication reduces the overall amount of data stored by eliminating redundancy in the stored data set. As information changes, StorSimple ignores the unchanged data and captures only the changes. In addition, StorSimple reduces the amount of stored data by identifying and removing duplicate information.

> [!NOTE]
> Data stored on the virtual array is not deduplicated or compressed. All deduplication and compression occurs just before the data is sent to the cloud.

### Scheduled and on-demand backups

StorSimple data protection features enable you to create on-demand backups. Additionally, a default backup schedule ensures that data is backed up daily. Backups are taken in the form of incremental snapshots, which are stored in the cloud. Snapshots, which record only the changes since the last backup, can be created and restored quickly. These snapshots can be critically important in disaster recovery scenarios because they replace secondary storage systems (such as tape backup), and allow you to restore data to your datacenter or to alternate sites if necessary.

## Managing personal information

The StorSimple Device Manager for virtual series collects personal information in two key instances:
 - Alert user settings where email addresses of users are configured. This information can be cleared by the administrator. 
 - Users who can access the data residing on the shares. A list of users who can access the share data is displayed and can be exported. This list is also deleted when the shares is deleted.

For more information, review the [Microsoft Privacy policy at Trust Center](https://www.microsoft.com/trustcenter).

## Next steps

Learn how to [prepare the virtual array portal](storsimple-virtual-array-deploy1-portal-prep.md).
