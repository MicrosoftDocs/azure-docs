<properties 
   pageTitle="What are the StorSimple components?" 
   description="Describes the StorSimple device, services, and management technologies." 
   services="storsimple" 
   documentationCenter="NA" 
   authors="SharS" 
   manager="AdinaH" 
   editor=""/>

<tags
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD" 
   ms.date="02/17/2015"
   ms.author="v-sharos@microsoft.com"/>


# What are the StorSimple components? 

Welcome to Microsoft Azure StorSimple, an integrated storage solution that manages storage tasks between on-premises devices and Microsoft Azure cloud storage.  StorSimple is designed to reduce storage costs, simplify storage management, improve disaster recovery capability and efficiency, and provide data mobility.

The following sections describe the Microsoft Azure StorSimple components, and explain how the solution arranges data, allocates storage, and facilitates storage management and data protection. 

> [AZURE.NOTE] The StorSimple deployment information published on the Microsoft Azure website applies to the StorSimple 8000 series devices only. For information about the 7000 series device, go to: [StorSimple Help](http://onlinehelp.storsimple.com/).

## StorSimple device

The Microsoft Azure StorSimple device is an on-premises hybrid storage array that provides primary storage and iSCSI access to data stored elsewhere. It manages communication with cloud storage, and helps to ensure the security and confidentiality of all data that is stored on the Microsoft Azure StorSimple solution.

The StorSimple device includes solid state drives (SSDs) and hard disk drives (HDDs), as well as support for clustering and automatic failover. It contains a shared processor, shared storage, and two mirrored controllers. Each controller provides the following:

- Connection to a host computer
- Up to six network ports to connect to the local area network (LAN)
- Hardware monitoring
- Non-volatile random access memory (NVRAM), which retains information even if power is interrupted
- Cluster-aware updating to manage software updates on servers in a failover cluster so that the updates have minimal or no effect on service availability
- Cluster service, which functions like a back-end cluster, providing high availability and minimizing any adverse effects that might occur if an HDD or SSD fails or is taken offline

Only one controller is active at any point in time. If the active controller fails, the second controller becomes active automatically. 

For more information, see [StorSimple Devices](https://msdn.microsoft.com/library/azure/dn772363.aspx).

## StorSimple virtual device

You can use StorSimple to create a virtual device that replicates the architecture and capabilities of the actual hybrid storage device. 

The StorSimple virtual device (also known as the StorSimple Virtual Appliance) runs on a single node in an Azure virtual machine. (A virtual device can only be created on an Azure virtual machine. You cannot create one on a StorSimple device or an on-premises server.) A StorSimple virtual device differs from a physical StorSimple device as follows: 

- The virtual device has only one interface, whereas the physical device has six network interfaces. 
- You register the virtual device during device configuration, rather than as a separate task.
- You cannot regenerate the service data encryption key from a virtual device. During key rollover, you regenerate the key on the physical device, and then update the virtual device with the new key.
- If you need to apply updates to the virtual device, you will experience some down time. This does not occur with a physical StorSimple device.

We recommend that you use the StorSimple virtual device for disaster recovery scenarios in which a physical device is not available, such as test and small pilot deployments.

For more information, see [StorSimple Virtual Device](https://msdn.microsoft.com/library/azure/dn772390.aspx).


## Storage management technologies
 
In addition to the dedicated StorSimple device and virtual device, Microsoft Azure StorSimple uses the following software technologies to provide quick access to data and reduce storage consumption:

- Automatic storage tiering 
- Thin provisioning 
- Deduplication and compression 

### Automatic storage tiering

Microsoft Azure StorSimple automatically arranges data in logical tiers based on current usage, age, and relationship to other data. Data that is most active is stored locally, while less active and inactive data is automatically migrated to the cloud. The following diagram illustrates this storage approach.
 
![StorSimple storage tiers](./media/storsimple-components/hcs-data-services-storsimple-components-tiers.png)

**StorSimple storage tiers**

To enable quick access, StorSimple stores very active data (hot data) on SSDs in the StorSimple device. It stores data that is used occasionally (warm data) on HDDs in the device or on servers at the datacenter. It moves inactive data, backup data, and data retained for archival or compliance purposes to the cloud. 

StorSimple adjusts and rearranges data and storage assignments as usage patterns change. For example, some information might become less active over time. As it becomes progressively less active, it is migrated from SSD to HDD and then to the cloud. If that same data becomes active again, it is migrated back to the storage device.

### Thin provisioning

Thin provisioning is a virtualization technology in which available storage appears to exceed physical resources. Instead of reserving sufficient storage in advance,  StorSimple uses thin provisioning to allocate just enough space to meet current requirements. The elastic nature of cloud storage facilitates this approach because  StorSimple can increase or decrease cloud storage to meet changing demands. 

### Deduplication and compression

Microsoft Azure StorSimple uses deduplication and data compression to further reduce storage requirements.

Deduplication reduces the overall amount of data stored by eliminating redundancy in the stored data set. As information changes, StorSimple ignores the unchanged data and captures only the changes. In addition, StorSimple reduces the amount of stored data by identifying and removing unnecessary information. 

## Windows PowerShell for StorSimple

Windows PowerShell for StorSimple provides a command-line interface that you can use to create and manage the Microsoft Azure StorSimple service and set up and monitor StorSimple devices. It is a Windows PowerShell–based, command-line interface that includes dedicated cmdlets for managing your StorSimple device. Windows PowerShell for StorSimple has features that allow you to:

- Register a device.
- Configure the network interface on a device.
- Install certain types of updates.
- Troubleshoot your device by accessing the support session.
- Change the device state.

You can access Windows PowerShell for StorSimple from a serial console (on a host computer connected directly to the device) or remotely by using Windows PowerShell remoting. Note that some Windows PowerShell for StorSimple tasks, such as initial device registration, can only be done on the serial console. 

For more information, see [Windows PowerShell for StorSimple](https://msdn.microsoft.com/library/azure/dn772425.aspx).

## StorSimple Manager service

Microsoft Azure StorSimple provides a web-based user interface (the StorSimple Manager service) that enables you to centrally manage datacenter and cloud storage. You can use the StorSimple Manager service to perform the following tasks:

- Configure system settings for StorSimple devices.
- Configure and manage security settings for StorSimple devices.
- Configure cloud credentials and properties.
- Configure and manage volumes on a server.
- Configure volume groups.
- Back up and restore data.
- Monitor performance.
- Review system settings and identify possible problems.

You can use the StorSimple Manager service to perform all administration tasks except those that require system down time, such as initial setup and installation of updates.

For more information, see [StorSimple Manager service](https://msdn.microsoft.com/library/azure/dn772396.aspx).

## StorSimple Snapshot Manager

StorSimple Snapshot Manager is a Microsoft Management Console (MMC) snap-in that you can use to create consistent, point-in-time backup copies of local and cloud data. The snap-in runs on a Windows Server–based host. You can use StorSimple Snapshot Manager to:

- Configure, back up, and delete volumes.
- Configure volume groups to ensure that backed up data is application-consistent.
- Manage backup policies so that data is backed up on a predetermined schedule and stored in a designated location (locally or in the cloud).
- Restore volumes and individual files.

Backups are captured as snapshots, which record only the changes since the last snapshot was taken and require far less storage space than full backups. You can create backup schedules or take immediate backups as needed. Additionally, you can use StorSimple Snapshot Manager to establish retention policies that control how many snapshots will be saved. If you subsequently need to restore data from a backup, StorSimple Snapshot Manager lets you select from the catalog of local or cloud snapshots. 

If a disaster occurs or if you need to restore data for another reason, StorSimple Snapshot Manager restores it incrementally as it is needed. Data restoration does not require that you shut down the entire system while you restore a file, replace equipment, or move operations to another site.

For more information, see [StorSimple Snapshot Manager](https://msdn.microsoft.com/library/azure/dn772365.aspx).

## StorSimple Adapter for SharePoint

Microsoft Azure StorSimple includes the StorSimple Adapter for SharePoint, an optional component that transparently extends StorSimple storage and data protection features to SharePoint server farms. The adapter works with a Remote Blob Storage (RBS) provider and the SQL Server RBS feature, allowing you to move BLOBs to a server backed up by the Microsoft Azure StorSimple system. Microsoft Azure StorSimple then stores the BLOB data locally or in the cloud, based on usage.

The StorSimple Adapter for SharePoint is managed from within the SharePoint Central Administration portal. Consequently, SharePoint management remains centralized, and all storage appears to be in the SharePoint farm.

For more information, see [StorSimple Adapter for SharePoint](https://msdn.microsoft.com/library/azure/dn757737.aspx). 


## Next steps

Review the [StorSimple release notes](https://msdn.microsoft.com/library/azure/dn772367.aspx)




