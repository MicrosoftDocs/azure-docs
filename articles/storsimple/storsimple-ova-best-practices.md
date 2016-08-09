<properties 
   pageTitle="Best practices for StorSimple Virtual Array | Microsoft Azure"
   description="Describes the best practices for deploying and managing the StorSimple Virtual Array."
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="carmonm"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/09/2016"
   ms.author="alkohli" />

# StorSimple Virtual Array best practices

## Overview

Microsoft Azure StorSimple Virtual Array is an integrated storage solution that manages storage tasks between an on-premises virtual device running in a hypervisor and Microsoft Azure cloud storage. StorSimple Virtual Array is an efficient, cost-effective alternative to the 8000 series physical array. The virtual array can run on your existing hypervisor infrastructure, supports both the iSCSI and the SMB protocols, and is well-suited for remote office/branch office scenarios. For more information on the StorSimple solutions, go to [Microsoft Azure StorSimple Overview](https://www.microsoft.com/en-us/server-cloud/products/storsimple/overview.aspx).

This article covers the best practices implemented during the initial setup, deployment, and management of the StorSimple Virtual Array. These best practices provide validated guidelines for the setup and management of your virtual array. This article is targeted towards the IT administrators who will for deploy and manage the virtual arrays in their datacenters.

We recommend a periodic review of the best practices to help ensure your device is still in compliance when changes are made to the setup or operation flow. Should you encounter any issues while implementing these best practices on your virtual array, [contact Microsoft Support](storsimple-contact-microsoft-support.md) for assistance.

## Configuration best practices 

These best practices cover the guidelines that need to be followed during the initial setup and deployment of the virtual arrays. These include best practices related to the provisioning of the virtual machine, group policy settings, sizing, setting up the networking, configuring storage accounts, and creating shares and volumes for the virtual array. 

### Provisioning 

StorSimple Virtual Array is a virtual machine (VM) provisioned on the hypervisor (Hyper-V or VMware) of your host server. When provisioning the virtual machine, ensure that your host is able to dedicate sufficient resources. For more information, go to [minimum resource requirements](storsimple-ova-deploy2-provision-hyperv.md#step-1-ensure-that-the-host-system-meets-minimum-virtual-device-requirements) to provision an array. 

Implement the following best practices when provisioning the virtual array:


|                        | Hyper-V                                                                                                                                        | VMware                                                                                                               |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| **Virtual machine type**   | **Generation 2** VM for use with Windows Server 2012 or later and a *.vhdx* image. <br></br> **Generation 1** VM for use with a Windows Server 2008 or later and a *.vhd* image.                                                                                                              | Use virtual machine version 8 - 11 when using *.vmdk* image.                                                                      |
| **Memory type**            | Configure as **static memory**. <br></br> Do not use the **dynamic memory** option.            |                                                    |
| **Data disk type**         | Provision as **dynamically expanding**.<br></br> **Fixed size** takes a long time. <br></br> Do not use the **differencing** option.                                                                                                                   | Use the **thin provision** option.                                                                                      |
| **Data disk modification** | Expansion or shrinking is not allowed. An attempt to do so results in the loss of all the local data on device.                       | Expansion or shrinking is not allowed. An attempt to do so results in the loss of all the local data on device. |

### Sizing

When sizing your StorSimple Virtual Array, consider the following factors:

- Local reservation for volumes or shares. Approximately 12 % of the space is reserved on the local tier for each provisioned tiered volume or share. Roughly 10 % of the space is also reserved for a locally pinned volume for file system.
- Snapshot overhead. Roughly 15 % space on the local tier is reserved for snapshots.
- Need for restores. If doing restore as a new operation, sizing should account for the space needed for restore. Restore is done to a share or volume of the same size or larger.
- Some buffer should be allocated for any unexpected growth.

Based on the preceding factors, the sizing requirements can be represented by the following equation:

`Total usable local disk size = (Total provisioned locally pinned volume/share size including space for file system) + (Max (local reservation for a volume/share) for all tiered volumes/share) + (Local reservation for all tiered volumes/shares)`

`Data disk size = Total usable local disk size + Snapshot overhead + buffer for unexpected growth or new share or volume`


The following examples illustrate how you can size a virtual array based on your requirements.

#### Example 1:
On your virtual array, you want to be able to 

- provision a 2 TB tiered volume or share.
- provision a 1 TB tiered volume or share.
- provision a 300 GB of locally pinned volume or share.


For the preceding volumes or shares, let us calculate the space requirements on the local tier. 

First, for each tiered volume/share, local reservation would be equal to 12% of the volume/share size. For the locally pinned volume/share, local reservation would be 10 % of the volume/share size. In this example, you need

- 240 GB local reservation (for a 2 TB tiered volume/share)
- 120 GB local reservation (for a 1 TB tiered volume/share)
- 330 GB for locally pinned volume or share

The total space required on the local tier so far is: 240 GB + 120 GB + 330 GB = 690 GB.

Second, we need at least as much space on the local tier as the largest single reservation. This extra amount is used in case you need to restore from a cloud snapshot. In this example, the largest local reservation is 330 GB (including reservation for file system), so you would add that to the 660 GB: 660 GB + 330 GB = 990 GB.
If we performed subsequent additional restores, we can always free up the space from the previous restore operation.

Third, we need 15 % of your total local space so far to store local snapshots, so that only 85% of it will be available. In this example, that would be around 990 GB = 0.85&ast;provisioned data disk TB. So, the provisioned data disk would be (990&ast;(1/0.85))= 1164 GB = 1.16 TB ~ 1.25 TB (rounding off to nearest quartile)

Factoring in unexpected growth and new restores, you should provision a local disk of around 1.25 - 1.5 TB.

> [AZURE.NOTE] We also recommend that the local disk is thinly provisioned. This recommendation is because the restore space is only needed when you want to restore data that is older than five days. Item-level recovery allows you to restore data for the last five days without requiring the extra space for restore.

#### Example 2: 
On your virtual array, you want to be able to 

- provision a 2 TB tiered volume
- provision a 300 GB locally pinned volume

Based on 12 % of local space reservation for tiered volumes/shares and 10 % for locally pinned volumes/shares, we need

- 240 GB local reservation (for 2 TB tiered volume/share)
- 330 GB for locally pinned volume or share

Total space required on the local tier is: 240 GB + 330 GB = 570 GB

The minimum local space needed for restore is 330 GB. 

15 % of your total disk is used to store snapshots so that only 0.85 will be available. So, the disk size is (900&ast;(1/0.85)) = 1.06 TB ~ 1.25 TB (rounding off to nearest quartile) 

Factoring in any unexpected growth, you can provision a 1.25 - 1.5 TB local disk.


### Group policy

Group Policy is an infrastructure that allows you to implement specific configurations for users and computers. Group Policy settings are contained in Group Policy objects (GPOs), which are linked to the following Active Directory Domain Services (AD DS) containers: sites, domains, or organizational units (OUs). 

If your virtual array is domain-joined, GPOs can be applied to it. These GPOs can install applications such as an antivirus software that can adversely impact the operation of the StorSimple Virtual Array.

Therefore, we recommend that you:

-   Ensure that your virtual array is in its own organizational unit (OU) for Active Directory. 

-   Make sure that no group policy objects (GPOs) are applied to your virtual array. You can block inheritance to ensure that the virtual array (child node) does not automatically inherit any GPOs from the parent. For more information, go to [block inheritance](https://technet.microsoft.com/library/cc731076.aspx).


### Networking

The network configuration for your virtual array is done through the local web UI. A virtual network interface is enabled through the hypervisor in which the virtual array is provisioned. Use the [Network Settings](storsimple-ova-deploy3-fs-setup.md) page to configure the virtual network interface IP address, subnet, and gateway.  You can also configure the primary and secondary DNS server, time settings, and optional proxy settings for your device. Most of the network configuration is a one-time setup. Review the [StorSimple networking requirements](storsimple-ova-system-requirements.md#networking-requirements) prior to deploying the virtual array.

When deploying your virtual array, we recommend that you follow these best practices:

-   Ensure that the network in which the virtual array is deployed always has the capacity to dedicate 5 Mbps Internet bandwidth (or more). 

    -   Internet bandwidth need varies depending on your workload characteristics and the rate of data change.

    -   The data change that can be handled is directly proportional to your Internet bandwidth. As an example when taking a backup, a 5 Mbps bandwidth can accommodate a data change of around 18 GB in 8 hours. With four times more bandwidth (20 Mbps), you can handle four times more data change (72 GB). 

-   Ensure connectivity to the Internet is always available. Sporadic or unreliable Internet connections to the devices may result in a loss of access to data in the cloud and could result in an unsupported configuration.

-   If you plan to deploy your device as an iSCSI server: 
	-   We recommend that you disable the **Get IP address automatically** option (DHCP). 
	-   Configure static IP addresses. You must configure a primary and a secondary DNS server.

	-   If defining multiple network interfaces on your virtual array, only the first network interface (by default, this interface is **Ethernet**) can reach the cloud. To control the type of traffic, you can create multiple virtual network interfaces on your virtual array (configured as an iSCSI server) and connect those interfaces to different subnets.

-   To throttle the cloud bandwidth only (used by the virtual array), configure throttling on the router or the firewall. If you define throttling in your hypervisor, it will throttle all the protocols including iSCSI and SMB instead of just the cloud bandwidth. 

-   Ensure that time synchronization for hypervisors is enabled. If using Hyper-V, select your virtual array in the Hyper-V Manager, go to **Settings &gt; Integration Services**, and ensure that the **Time synchronization** is checked.

### Storage accounts

StorSimple Virtual Array can be associated with a single storage account. This storage account could be an automatically generated storage account, an account in the same subscription as the service, or a storage account related to another subscription. For more information, see how to [manage storage accounts for your virtual array](storsimple-ova-manage-storage-accounts.md).

Use the following recommendations for storage accounts associated with your virtual array.

-   When linking multiple virtual arrays with a single storage account, factor in the maximum capacity (64 TB) for a virtual array and the maximum size (500 TB) for a storage account. This limits the number of full-sized virtual arrays that can be associated with that storage account to about 7.

-   When creating a new storage account
	-   We recommend that you create it in the region closest to the remote office/branch office where your StorSimple Virtual Array is deployed to minimize latencies.

	-   Bear in mind that you cannot move a storage account across different regions. Also you cannot move a service across subscriptions.

	-   Use a storage account that implements redundancy between the datacenters. Geo-Redundant Storage (GRS), Zone Redundant Storage (ZRS), and Locally Redundant Storage (LRS) are all supported for use with your virtual array. For more information on the different types of storage accounts, go to [Azure storage replication](../storage/storage-redundancy.md).


### Shares and volumes

For your StorSimple Virtual Array, you can provision shares when it is configured as a file server and volumes when configured as an iSCSI server. The best practices for creating shares and volumes are related to the size and the type configured.

#### Volume/Share size

On your virtual array, you can provision shares when it is configured as a file server and volumes when configured as an iSCSI server. The best practices for creating shares and volumes relate to the size as well as the type configured. 

Keep in mind the following best practices when provisioning shares or volumes on your virtual device.

-   The file sizes relative to the provisioned size of a tiered share can impact the tiering performance. Working with large files could result in a slow tier out. When working with large files, we recommend that the largest file be smaller than 3% of the share size.

-   A maximum of 16 volumes/shares can be created on the virtual array. If locally pinned, the volumes/shares can be between 50 GB to 2 TB. If tiered, the volumes/shares must be between 500 GB to 20 TB. 

-   When creating a volume, factor in the expected data consumption as well as future growth. While the volume cannot be expanded later, you can always restore to a larger volume.

-   Once the volume has been created, you cannot shrink the size of the volume on StorSimple.
   
-   When writing to a tiered volume on StorSimple, when the volume data reaches a certain threshold (relative to the local space reserved for the volume), the IO is throttled. Continuing to write to this volume slows down the IO significantly. Though you can write to a tiered volume beyond its provisioned capacity (we do not actively stop the user from writing beyond the provisioned capacity), you see an alert notification to the effect that you have oversubscribed. Once you see the alert, it is imperative that you take remedial measures such as delete the volume data or restore the volume to a larger volume (volume expansion is currently not supported).

-   For disaster recovery use cases, as the number of allowable shares/volumes is 16 and the maximum number of shares/volumes that can be processed in parallel is also 16, the number of shares/volumes does not have a bearing on your RPO and RTOs. 

#### Volume/Share type

StorSimple supports two volume/share types based on the usage: locally pinned and tiered. Locally pinned volumes/shares are thickly provisioned whereas the tiered volumes/shares are thinly provisioned. 

We recommend that you implement the following best practices when configuring StorSimple volumes/shares:

-   Identify the volume type based on the workloads that you intend to deploy before you create a volume. Use locally pinned volumes for workloads that require local guarantees of data (even during a cloud outage) and that require low cloud latencies. Once you create a volume on your virtual array, you cannot change the volume type from locally pinned to tiered or *vice-versa*. As an example, create locally pinned volumes when deploying SQL workloads or workloads hosting virtual machines (VMs); use tiered volumes for file share workloads.


-   Check the option for less frequently used archival data when dealing with large file sizes. A larger deduplication chunk size of 512 K is used when this option is enabled to expedite the data transfer to the cloud.

#### Volume format

After you create StorSimple volumes on your iSCSI server, you will need to initialize, mount, and format the volumes. This operation is performed on the host connected to your StorSimple device. Following best practices are recommended when mounting and formatting volumes on the StorSimple host.

-   Perform a quick format on all StorSimple volumes.

-   When formatting a StorSimple volume, use an allocation unit size (AUS) of 64 KB (default is 4 KB). The 64 KB AUS is based on testing done in-house for common StorSimple workloads and other workloads.

-   When using the StorSimple Virtual Array configured as an iSCSI server, do not use spanned volumes or dynamic disks as these volumes or disks are not supported by StorSimple.

#### Share access

When creating shares on your virtual array file server, follow these guidelines:

-   When creating a share, assign a user group as a share administrator instead of a single user.

-   You can manage the NTFS permissions after the share is created by editing the shares through Windows Explorer.

#### Volume access

When configuring the iSCSI volumes on your StorSimple Virtual Array, it is important to control access wherever necessary. To determine which host servers can access volumes, create and associate access control records (ACRs) with StorSimple volumes.

Use the following best practices when configuring ACRs for StorSimple volumes:

-   Always associate at least one ACR with a volume.

-   Define multiple ACRs only in a clustered environment.

-   When assigning more than one ACR to a volume, ensure that the volume is not exposed in a way where it can be concurrently accessed by more than one non-clustered host. If you have assigned multiple ACRs to a volume, a warning message will pop up for you to review your configuration.

### Data security and encryption

Your StorSimple Virtual Array has data security and encryption features that ensure the confidentiality and integrity of your data. When using these features, it is recommended that you follow these best practices: 

-   Define a cloud storage encryption key to generate AES-256 encryption before the data is sent from your virtual array to the cloud. This key is not required if your data is encrypted to begin with. The key can be generated and kept safe using a key management system such as [Azure key vault](../key-vault/key-vault-whatis.md).

-   When configuring the storage account via the StorSimple Manager service, make sure that you enable the SSL mode to create a secure channel for network communication between your StorSimple device and the cloud.

-   Regenerate the keys for your storage accounts (by accessing the Azure Storage service) periodically to account for any changes to access based on the changed list of administrators.

-   Data on your virtual array is compressed and deduplicated before it is sent to Azure. We don't recommend using the Data Deduplication role service on your Windows Server host.


## Operational best practices

The operational best practices are guidelines that should be followed during the day-to-day management or operation of the virtual array. These will cover specific management tasks such as taking backups, restoring from a backup set, performing a failover, deactivating and deleting the array, monitoring system usage and health, and running virus scans on your virtual array.

### Backups

The data on your virtual array is backed up to the cloud in two ways, a default automated daily backup of the entire device starting at 22:30 or via a manual on-demand backup. By default, the device automatically creates daily cloud snapshots of all the data residing on it. For more information, go to [back up your StorSimple Virtual Array](storsimple-ova-backup.md).

The frequency and retention associated with the default backups cannot be changed but you can configure the time at which the daily backups are initiated every day. When configuring the start time for the automated backups, we recommend that:

-   Schedule your backups for off-peak hours. Backup start time should not coincide with a lot of host IO.

-   Initiate a manual on-demand backup when planning to perform a device failover or prior to the maintenance window, to protect the data on your virtual array.

### Restore

You can restore from a backup set in two ways: restore to another volume or share or perform an item-level recovery (available only on a virtual array configured as a file server). Item-level recovery allows you to do a granular recovery of files and folders from a cloud backup of all the shares on the StorSimple device. For more information, go to [restore from a backup](storsimple-ova-restore.md).

When performing a restore, keep the following guidelines in mind:

-   Your StorSimple Virtual Array does not support in-place restore. This can however be readily achieved by a two-step process: make space on the virtual array and then restore to another volume/share.

-   When restoring from a local volume, keep in mind the restore will be a long running operation. Though the volume may quickly come online, the data will continue to be hydrated in the background.

-   The volume type remains the same during the restore process. A tiered volume is restored to another tiered volume and a locally pinned volume to another locally pinned volume.

-   When trying to restore a volume or a share from a backup set, if the restore job fails, a target volume or share may still be created in the portal. It is important that you delete this unused target volume or share in the portal to minimize any future issues arising from this element.

### Failover and disaster recovery

A device failover allows you to migrate your data from a *source* device in the datacenter to another *target* device located in the same or a different geographical location. The device failover is for the entire device. During failover, the cloud data for the source device changes ownership to that of the target device.

For your StorSimple Virtual Array, you can only fail over to another virtual array managed by the same StorSimple Manager service. A failover to an 8000 series device or an array managed by a different StorSimple Manager service (than the one for the source device) is not allowed. To learn more about the failover considerations, go to [prerequisites for the device failover](storsimple-ova-failover-dr.md).

When performing a fail over for your virtual array, keep the following in mind:

-   For a planned failover, it is a recommended best practice to take all the volumes/shares offline prior to initiating the failover. Follow the operating system-specific instructions to take the volumes/shares offline on the host first and then take those offline on your virtual device.

-   For a file server disaster recovery (DR), we recommend that you join the target device to the same domain as that of the source so that the share permissions are automatically resolved. Only the failover to a target device in the same domain is supported in this release.

-   Once the DR is successfully completed, the source device is automatically deleted. Though the device is no longer available, the virtual machine that you provisioned on the host system is still consuming resources. We recommend that you delete this virtual machine from your host system to prevent any charges from accruing.

-   Do note that even if the failover is unsuccessful, **the data is always safe in the cloud**. Consider the following three scenarios in which the failover did not complete successfully:

    -   A failure occurred in the initial stages of the failover such as when the DR pre-checks are being performed. In this situation, your target device is still usable. You can retry the failover on the same target device.

    -   A failure occurred during the actual failover process. In this case, the target device is marked unusable. You will need to provision and configure another target virtual array and use that for failover.

    -   The failover was complete following which the source device was deleted but the target device has issues and the user cannot access any data. The data is still safe in the cloud and can be easily retrieved by creating another virtual array and then using it as a target device for the DR.

### Deactivate

When you deactivate a StorSimple Virtual Array, you sever the connection between the device and the corresponding StorSimple Manager service. Deactivation is a **permanent** operation and cannot be undone. A deactivated device cannot be registered with the StorSimple Manager service again. For more information, go to [deactivate and delete your StorSimple Virtual Array](storsimple-deactivate-and-delete-device.md).

Keep the following best practices in mind when deactivating your virtual array:

-   Take a cloud snapshot of all the data prior to deactivating a virtual device. When you deactivate a virtual array, all the local device data will be lost. Taking a cloud snapshot will allow you to recover data at a later stage.

-   Before you deactivate a StorSimple Virtual Array, make sure to stop or delete clients and hosts that depend on that device.

-   Delete a deactivated device if you are no longer using so that it doesn't accrue charges.

### Monitoring

To ensure that your StorSimple Virtual Array is in a continuous healthy state, you need to monitor the array and ensure that you receive information from the system including alerts. To monitor the overall health of the virtual array, implement the following best practices:

- Configure monitoring to track the disk usage of your virtual array data disk as well as the OS disk. If running Hyper-V, you can use a combination of System Center Virtual Machine Manager (SCVMM) and System Center Operations Manager (SCOM) to monitor your virtualization hosts.   

- Configure email notifications on your virtual array to send alerts at certain usage levels.                                                                                                                                                                                                

### Index search and virus scan applications

A StorSimple Virtual Array can automatically tier data from the local tier to the Microsoft Azure cloud. When an application such as an index search or a virus scan is used to scan the data stored on StorSimple, you need to take care that the cloud data does not get accessed and pulled back to the local tier.

We recommend that you implement the following best practices when configuring the index search or virus scan on your virtual array:

-   Disable any automatically configured full scan operations.

-   For tiered volumes, configure the index search or virus scan application to perform an incremental scan. This would scan only the new data likely residing on the local tier. The data that is tiered to the cloud is not accessed during an incremental operation.

-   Ensure the correct search filters and settings are configured so that only the intended types of files get scanned. For example, image files (JPEG, GIF, and TIFF) and engineering drawings should not be scanned during the incremental or full index rebuild.

If using Windows indexing process, follow these guidelines:

-   Do not use the Windows Indexer for tiered volumes as this will recall large amounts of data (TBs) from the cloud if the index needs to be rebuilt frequently. Rebuilding the index would retrieve all file types to index their content.

-   Use the Windows indexing process for locally pinned volumes as this would only access data on the local tiers to build the index (the cloud data will not be accessed).

### Byte range locking

Applications can lock a specified range of bytes within the files. If byte range locking is enabled on the applications that are writing to your StorSimple, then tiering won't work on your virtual array. For the tiering to work, all areas of the files accessed should be unlocked. Byte range locking is not supported with tiered volumes on your virtual array.

Recommended measures to alleviate this include:

-   Turn off byte range locking in your application logic.

-   Use locally pinned volumes (instead of tiered) for the data associated with this application. Locally pinned volumes do not tier into the cloud.

-   When using locally pinned volumes with byte range locking enabled, note that the volume can come online before the restore is complete. In these instances, you must wait for the restore to be complete.

## Multiple arrays

Multiple virtual arrays may need to be deployed to account for a growing working set of data that could spill onto the cloud thus affecting the performance of the device. In these instances, it is best to scale devices as the working set grows. This will require one or more devices to be added in the on-premises data center. When adding the devices, you could:

-   Split the current set of data.
-   Deploy new workloads to the new appliance(s).
-   If deploying multiple virtual arrays, we recommend that from load-balancing perspective, distribute the array across different hypervisor hosts.

-  Multiple virtual arrays (when configured as a file server or an iSCSI server) can be deployed in a Distributed File System Namespace. For detailed steps, go to [Distributed File System Namespace Solution with Hybrid Cloud Storage Deployment Guide](https://www.microsoft.com/download/details.aspx?id=45507). Distributed File System Replication is currently not recommended for use with the virtual array. 


## See also
Learn how to [administer your StorSimple Virtual Array](storsimple-ova-manager-service-administration.md) via the StorSimple Manager service.
