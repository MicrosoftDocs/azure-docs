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
   ms.date="04/04/2016"
   ms.author="alkohli" />

# StorSimple Virtual Array best practices

## Overview

Microsoft Azure StorSimple Virtual Array is an integrated storage solution that manages storage tasks between an on-premises virtual device running in a hypervisor and Microsoft Azure cloud storage. The 1200 series virtual array is an efficient, cost-effective alternative to the 8000 series physical array. Unlike the 8000 series physical array that comes with an enterprise-grade custom hardware, the 1200 series virtual array can run on your existing hypervisor infrastructure. The 1200 series virtual array supports both the iSCSI and the SMB protocols, the 8000 series physical array is a block storage device. Both the solutions provide tiering to the cloud, cloud backup, fast restore, and disaster recovery features. The Virtual Array is particularly well-suited for remote office/branch office scenarios. For more information on the StorSimple solutions, go to

This article covers the best practices implemented during the initial setup, deployment and management of the StorSimple Virtual Array. These best practices provide validated guidelines to ensure the most optimal setup and management of your virtual array. This article is targeted towards the IT administrators responsible for deploying and managing these virtual arrays in their datacenters.

We recommend a periodic review of the best practices to ensure your device is still in compliance when changes are made to the setup or operation flow. Should you encounter any issues while implementing these best practices on your virtual array, [contact Microsoft Support](storsimple-contact-microsoft-support) for assistance.

## Configuration best practices

### Provisioning 

Your virtual array is a virtual machine provisioned in a virtualized environment (Hyper-V or VMware) running on your server. When provisioning the virtual machine on your host system, ensure that your host is able to dedicate the following resources for your virtual device:

-   A minimum of 4 cores.

-   At least 8 GB of RAM.

-   One network interface.

-   A 500 GB virtual disk for system data.

For a list of virtualized environments supported on your StorSimple virtual array, go to [software requirements](storsimple-ova-system-requirements.md#software-requirements).

When provisioning your virtual machine in the hypervisor, we recommend that you follow these best practices:

-   Provision a **Generation 1** virtual machine when using VHD and a **Generation 2** virtual when using a VHDX in your Hyper-V environment.

-   Configure **static memory** for your virtual machine (minimum requirement is 8192 MB) so that this physical memory is available exclusively to it regardless of fluctuations in memory demands. No other virtual machine on your host can use this memory unless this virtual machine is turned off. Do not provision a virtual machine with the **dynamic memory** option.

-   Provision the data disk based on your anticipated storage needs accounting for some buffer. Once you have provisioned a data disk of a certain specified size in your hypervisor and created the corresponding StorSimple virtual device, you must not expand or shrink the data disk. Attempting to do so will result in a loss of all the data in the local tiers of the device.

-   When provisioning a data disk for your virtual machine, we recommend that you set the virtual hard disk type as **dynamically expanding** on Hyper-V. If you choose a **fixed** size disk on Hyper-V, as it is thickly provisioned, you may need to wait a long time. Do not use the **differencing** option.

-   If using VMware, use the **thin provision** option.

-   Configure monitoring in your hypervisor to track the usage of your virtual array data disk as well as that of your guest OS disk. A combination of System Center Virtual Machine Manager (SCVMM) and System Center Operations Manager (SCOM) will allow you to monitor your virtualization hosts for both Hyper-V and VMware.  

-   Preferably configure email alert notifications on your array to send alerts at certain usage levels.

### Sizing

Total usable disk size = Total provisioned volume size + (Max (Provisioned volume size) for all the existing volumes) + some buffer

Examples

### Networking

The network configuration for your virtual array is done through the local web UI. The [Network Settings](storsimple-ova-deploy3-fs-setup) page allows the user to configure the network interface IP address, subnet, and gateway. A virtual network interface is enabled through the hypervisor in which the virtual array is provisioned. You can also configure the primary and secondary DNS server, time settings, and optional proxy settings for your device. Most of the network configuration is a one-time setup. Review the [StorSimple networking requirements](storsimple-ova-system-requirements.md#networking-requirements) prior to deploying the virtual array.

When deploying your virtual array, we recommend that you follow these best practices:

-   Ensure that the network in which the virtual array is deployed has the capacity to dedicate 5 Mbps bandwidth (or more) at all times. This bandwidth should not be shared with any other applications (allocation can be guaranteed through the application of QoS rules).

    -   Be aware that the Internet need will very depending on your workload characteristics and rate of data churn.

    -   As an example, over a period of 8 hours, a 5 Mbps bandwidth can accommodate a data churn of up to XX whereas with 20 Mbps bandwidth, you can have a YY data churn.


-   Ensure network connectivity to the Internet is available at all times. Sporadic or unreliable Internet connections to the devices will result in loss of access to data in the cloud and thereby result in an unsupported configuration.

-   If you plan to deploy your device as an iSCSI server, we recommend that you disable the **Get IP address automatically** option and configure static IP addresses. A primary and secondary DNS server will automatically be configured if using the DHCP option. If configuring as an iSCSI server with static IP addresses, you will need to configure a primary and a secondary DNS server.

-   If defining multiple network interfaces on your virtual array, note that only the first network interface (by default, this is **Ethernet**) can reach the cloud. To control the type of traffic, you can create multiple virtual network interfaces on your virtual array (configured as an iSCSI server) and connect those to different subnets.

-   Bandwidth throttling is not available in this release. If only the cloud bandwidth needs to be controlled, configure throttling on the router or the firewall. We prefer that you do not define throttling in your hypervisor as it will throttle all the protocols including iSCSI and SMB whereas in this instance only the Internet bandwidth needs to be throttled. If running Hyper-V, check if you are using the [bandwidth management feature for Hyper-V](http://www.techrepublic.com/blog/data-center/set-bandwidth-limits-for-hyper-v-vms-with-windows-server-2012/) on Windows Server 2012. If so, you will need to disable it.

-   Ensure that time synchronization for hypervisors is enabled. If using Hyper-V, select your virtual array in the Hyper-V Manager, go to **Settings &gt; Integration Services** and ensure that the **Time synchronization** is checked.

### Storage accounts

Your StorSimple Virtual Array can be associated with a single storage account at any point in time. This storage account could be an automatically generated storage account, an account in the same subscription as the service or an account that is outside of the service subscription. Additionally, there is a 500 TB limit for a storage account.

Use the following recommendations when creating storage accounts for your virtual array.

-   Factor in capacity planning when associating multiple virtual arrays with a single storage account. Given the maximum capacity of a virtual array is 64 TB and there is a 500 TB limit for a storage account, that would cap the number of full-sized virtual arrays (~7) that can be associated with that storage account.

-   When creating a storage account, we recommend that you create it in the region closest to the remote office/branch office where your StorSimple Virtual Array is deployed to minimize latencies.

-   While creating a storage account, be aware that you cannot move a storage account across different regions. Also you cannot move a service across subscriptions.

-   Use a storage account that implements redundancy between the datacenters. Geo-Redundant Storage (GRS), Zone Redundant Storage (ZRS), and Locally Redundant Storage (LRS) are all supported for use with your virtual array. For more information on the different types of storage accounts, go to [Azure storage replication](storage-redundancy).

-   If possible, choose a storage account within the same subscription as the StorSimple Manager service for your virtual array. This has the benefit of simplifying and streamlining the workflow associated with the management of the storage account.

### Shares and volumes

For your StorSimple Virtual Array, you can provision shares when it is configured as a file server and volumes when configured as an iSCSI server. The best practices for creating shares and volumes are related to the size as well as the type configured.

#### Volume/Share size

For your virtual array, you can provision a 50 GB to 2 TB locally pinned volume/share and a 500 GB to 20 TB tiered volume/share. Keep in mind the following best practices when provisioning shares or volumes on your virtual device.

-   The file sizes in the data relative to the provisioned size of a tiered share can impact the tiering performance. Working with large files could result in slow tier out. When working with large files, we recommend that the largest file is smaller than 3% of the share size.

-   Create the volume size as close to the anticipated usage as possible. This is true for both locally pinned and tiered volumes.

    -   In a thinly provisioned tiered volume, while the space is consumed on an as-needed basis, the actual configured size of the volume does result in overhead with regards to the amount of time it takes to create or restore from a cloud snapshot. The amount of overhead is correlated to the volume size as the entire volume space needs to be scanned.

    -   For a thickly provisioned locally pinned volume, the entire local space needs to be provisioned and sometimes this results in pushing the data in the existing tiered volumes to the cloud. Locally pinned volume creation can be a very time consuming process.

-   When creating a volume, factor in the expected data consumption as well as future growth. Note that while the volume cannot be expanded later, you can always restore to a larger volume.

-   For disaster recovery use cases, provision small x-y TB volumes to help meet expected RPO and RTOs.

-   Once the volume has been created, you cannot shrink the size of the volume on StorSimple.

-   When writing to a tiered volume on StorSimple, note that when the volume data reaches a certain threshold (relative to the local space reserved for the volume), the IO will be throttled. Continuing to write to this volume will slow down the IO significantly. Though you can write to a tiered volume beyond its provisioned capacity (we do not actively stop the user from writing beyond the provisioned capacity), you will see an alert notification to the effect that you have oversubscribed. Once you see the alert, it is imperative that you take remedial measures such as delete the volume data or restore the volume to a larger volume (volume expansion is currently not supported).

#### Volume/Share type

StorSimple supports two volume types based on the usage: locally pinned and tiered. Locally pinned volumes are thickly provisioned whereas the tiered volumes are thinly provisioned. Be aware that creating local volumes affects the space required for tiered volumes. Also provisioning a locally pinned volume may take considerable time as it could potentially involve pushing existing data from tiered volumes into the cloud. Your device performance may be adversely impacted in that duration.

We recommend that you implement the following best practices when configuring StorSimple:

-   Select the correct volume usage type: locally pinned or tiered based on your workload. Use locally pinned volumes for workloads that require local guarantees of data (even during a cloud outage) and low cloud latencies.

-   Identify the volume type based on the workloads that you intend to deploy before you create a volume. Once you create volume on your virtual array, you cannot change the volume type from locally pinned to tiered or vice-versa. As an example, create locally pinned volumes when deploying SQL workloads or workloads hosting virtual machines (VMs). Use tiered volumes for file share workloads

-   As creating locally pinned volumes affects available space for tiered volumes, work with small local volumes.

-   Locally pinned volume creation can be slower if the existing volumes on the device have not been backed up. Prior to creating a locally pinned volume, take a cloud snapshot of your device data.

-   Check the option for less frequently used archival data when dealing with large file sizes. A larger deduplication chunk size of 512 K is used when this option is enabled to expedite the data transfer to the cloud.

#### Volume format

After you create StorSimple volumes on your iSCSI server, you will need to initialize, mount and format the volumes. This operation is performed on the host connected to your StorSimple device. Following best practices are recommended when mounting and formatting volumes on the StorSimple host.

-   Perform a quick format on all StorSimple volumes.

-   When formatting a StorSimple volume, use an allocation unit size of 64 KB (default is 4 KB). The 64 KB AUS is based on testing done in-house for common StorSimple workloads as well as other workloads.

-   Windows Server 2012 uses GUID Partition Table (GPT) disks by default. For more information on best practices and usage of these drives, go to [using GPT Drives](http://msdn.microsoft.com/en-us/windows/hardware/gg463524.aspx#EHD).

-   When using the StorSimple Virtual Array configured as an iSCSI server, do not use spanned volumes or dynamic disks as these are not supported by StorSimple.

### Share access

-   When creating a share, it is a recommended best practice that the share administrator be a user group instead of a single user.

-   NTFS permissions on shares can be managed by editing the shares through Windows Explorer.

#### Volume access

When configuring the iSCSI volumes on your StorSimple Virtual Array, it is important to control access wherever necessary. Create and associate access control records (ACRs) with StorSimple volumes to determine which host servers can access volume(s).

Use the following best practices when configuring ACRs for StorSimple volumes:

-   Always associate at least one ACR with a volume.

-   Multiple ACRs should only be defined in the clustered environment.

-   When assigning more than one ACR to a volume, ensure that the volume is not exposed in a way where it can be concurrently accessed by more than one non-clustered host. If you have assigned multiple ACRs to a volume, then a warning message will pop-up for you to review your configuration.

## Data security and encryption

-   When configuring the storage account via the StorSimple Manager service, make sure that you enable the SSL mode to create a secure channel for network communication between your StorSimple device and the cloud.

-   We recommend that you also regenerate the keys for your storage accounts (by accessing the Azure Storage service) periodically to account for any changes to access based on the changed list of administrators.

-   Data on your StorSimple is compressed and deduplicated before it is sent to Azure. We recommend that you do not enable Windows Server deduplication on the data.

-   Define a cloud storage encryption key to generate AES-256 encryption before the data is sent from your virtual array to the cloud. This key is not required if your data is encrypted to being with. The key can be generated and kept safe using a key management system such as [Azure key vault](key-vault-whatis).

-   Service registration key

-   Service data encryption key

## Operational best practices

### Backups

The data on your virtual array is backed up to the cloud in two ways, a default automated daily backup of the entire device starting at 22:30 or via a manual on-demand backup. By default, the device automatically creates daily cloud snapshots of all the data residing on it. For more information, go to [back up your StorSimple Virtual Array](storsimple-ova-backup).

The frequency, retention associated with the default backups cannot be changed but you can configure the time at which the daily backups are initiated every day. When configuring the start time for the automated backups, we recommend that:

-   Schedule your backups for off-peak hours. Backup start time should not coincide with a lot of host IOPs.

-   Initiate a manual on-demand backup when planning to perform a device failover or prior to the maintenanace window, to protect the data on your virtual array.

### Restore

You can restore from a backup set in two ways: restore to another volume or share or perform an item-level recovery (ILR) (available only on a virtual array configured as a file server). ILR allows you to do a granular recovery of files and folders from a cloud backup of all the shares on the StorSimple device. For more information, go to restore from a backup.

When performing a restore, keep the following guidelines in mind:

-   Your StorSimple Virtual Array does not support in-place restore. This can however be readily achieved by a two step process: make space on the virtual array and then restore to another volume/share.

-   When restoring from a local volumes, keep in mind the restore will be a long running operation. Though the volume may be online quickly, the data will continue to be hydrated in the background.

-   The volume type remains the same during the restore process. A tiered volume is restored to another tiered volume and a locally pinned volume to another locally pinned volume.

-   When trying to restore a volume or a share from a backup set, if the restore job fails, a target volume or share may still be created in the portal. It is important that you delete this target volume or share in the portal to minimize any future issues arising from this element.

### Failover

A device failover allows you to migrate your data from a *source* device in the datacenter to another *target* device located in the same or a different geographical location. The device failover is for the entire device. During failover, the cloud data for the source device changes ownership to that of the target device.

For your StorSimple Virtual Array, you can only fail over to another virtual array managed by the same StorSimple Manager service. A failover to 8000 series device or an array managed by a different StorSimple Manager service (than the one for the source device) is not allowed. To learn more about the failover considerations, go to [prerequisites for the device failover](storsimple-ova-failover-dr).

When performing a fail over for your virtual array, keep the following in mind:

-   For a planned failover, it is a recommended best practice to take all the volumes/shares offline prior to initiating the failover. Take the volumes/shares offline on the host first, follow the operating system specific instructions and then take the volumes/shares offline on your virtual device.

-   For a file server DR, we recommend that you join the target device to the same domain as that of the source so that the share permissions are automatically resolved. Only the failover to a target device in the same domain is supported in this release.

-   Once the DR is successfully completed, the source device is automatically deleted. Though the device is no longer available, the virtual machine that you provisioned on the host system is still consuming resources. We recommend that you delete this virtual machine from your host system to prevent any charges from accruing.

-   Do note that even if the failover is unsuccessful, *the data is always safe in the cloud*. Consider the following three scenarios in which the failover does not complete successfully:

    -   The failure occurred in the initial stages of the failover such as when the DR pre-checks are being performed. In this situation, your target device is still usable. You can retry the failover on the same target device.

    -   The failure occurred during the actual failover process. In this case, the target device is marked unusable. You will need to provision and configure another target virtual array and use that for failover.

    -   The failover was complete following which the source device was deleted but the target device has issues and the user cannot access any data. The data is still safe in the cloud and can be easily retrieved by quickly creating another virtual array and then using it as target for the DR.

### Deactivation

When you deactivate a StorSimple Virtual Array, you sever the connection between the device and the corresponding StorSimple Manager service. Deactivation is a PERMANENT operation and cannot be undone. A deactivated device cannot be registered with the StorSimple Manager service again. For more information, go to [deactivate and delete your StorSimple Virtual Array](storsimple-deactivate-and-delete-device).

Keep the following best practices in mind when deactivating your virtual array:

-   Take a cloud snapshot of all the data prior to deactivating a virtual device. When you deactivate a virtual array, all the local device data will be lost. Taking a cloud snapshot will allow you to recover data at a later stage.

-   Before you deactivate a StorSimple virtual array, make sure to stop or delete clients and hosts that depend on that device.

-   Delete a deactivated device if you are no longer using it else it will accrue charges.

## Multiple arrays

Multiple virtual arrays may need to be deployed to account for a growing working set of data that could spill onto the cloud thus affecting the performance of the device. In these instances, it is best to scale devices as the working set grows. This will require one or more devices to be added in the on-premises data center. This can be done in the one of the following two ways:

-   split the current set of data.

-   deploy new workloads to the new appliance(s).

Multiple virtual arrays when configured as a file server can be deployed under a DFS namespace. In this instance, DFS-R is not supported.

## Miscellaneous

### Byte range locking

Applications can lock a specified range of bytes within the files. If byte range locking is enabled on the applications that are writing to your StorSimple, then tiering will not work on your virtual array. For the tiering to work, all areas of the files accessed should be unlocked. Byte range locking is not supported with tiered volumes on your virtual array.

Recommended measures to alleviate this include:

-   Turn off byte range locking in your application logic.

-   Use locally pinned volumes (instead of tiered) for the data associated with this application. Locally pinned volumes do not tier into the cloud.

-   When using locally pinned volumes with byte range locking enabled, note that the volume can be online even before the restore is complete. In these instances, you must wait for the restore to be complete.

### Group policy

Group Policy is an infrastructure that allows you to implement specific configurations for users and computers. Group Policy settings are contained in Group Policy objects (GPOs), which are linked to the following Active Directory directory service containers: sites, domains, or organizational units (OUs). If your virtual array is domain-joined, then GPOs can be applied to it. These GPOs can adversely affect the operation of your StorSimple Virtual Array.

Hence, we recommend that you:

-   Ensure that your virtual array is in its own organizational unit (OU) for Active Directory. Alternatively you can block inheritance if it is a part of a larger OU. This will ensure that the virtual array (child-node) will not automatically inherit any GPOs from the parent. For more information, go to [block inheritance](https://technet.microsoft.com/en-us/library/cc731076.aspx).

-   Make sure that no group policy objects (GPO) are applied to your virtual array.

### Index search and virus scan applications

A StorSimple Virtual Array can automatically tier data from the local tier to the Azure cloud. When an application such as an index search or a virus scan is used to scan the data stored on StorSimple, you need to take care that the cloud data does not get accessed and pulled back to the local tier.

We recommend that you implement the following best practices when configuring the index search or virus scan on your virtual array:

-   Disable any automatically configured full scan operations.

-   For tiered volumes, configure the index search or virus scan application to perform an incremental scan. This would scan only the new data likely residing on the local tier. The data that is tiered to the cloud is not accessed during an incremental operation.

-   Ensure the correct search filters and settings are configured so that only the intended types of files get scanned. For example, image files (JPEG, GIF, and TIFF) and engineering drawings should not be scanned during the incremental or full index rebuild.

If using Windows indexing process, follow these guidelines:

-   Do not use the Windows Indexer for tiered volumes as this will recall large amounts of data (TBs) from the cloud if the index needs to be rebuilt frequently. Rebuilding the index would retrieve all file types to index their content.

-   Use the Windows indexing process for locally pinned volumes as this would only access data on the local tiers to build the index (the cloud data will not be accessed).

## See also

<http://searchservervirtualization.techtarget.com/tip/Optimizing-virtual-hard-disk-performance-in-Hyper-V>

<http://blogs.technet.com/b/matthewms/archive/2013/03/29/20-days-of-server-virtualization-keeping-an-eye-monitoring-your-hyper-v-servers-part-20-of-20ish.aspx>
