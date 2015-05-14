<properties 
   pageTitle="What is StorSimple?" 
   description="Describes StorSimple features, architecture, and components." 
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

# What is StorSimple? 

Microsoft Azure StorSimple is an efficient, cost-effective, and manageable solution that eliminates many of the issues and expense associated with enterprise storage and data protection. It uses a proprietary device (the Microsoft Azure StorSimple device) and integrated management tools to provide a seamless view of all enterprise storage, including cloud storage.

## Why use StorSimple?

Microsoft Azure StorSimple provides the following benefits:

- **Transparent integration** – Microsoft Azure StorSimple uses the Internet Small Computer System Interface (iSCSI) protocol to invisibly link data storage facilities. This ensures that data stored in the cloud, at the datacenter, or on remote servers appears to be stored at a single location.
- **Reduced storage costs** – Microsoft Azure StorSimple allocates sufficient local or cloud storage to meet current demands and extends cloud storage only when necessary. It further reduces storage requirements and expense by eliminating redundant versions of the same data (deduplication) and by using compression.
- **Simplified storage management** – Microsoft Azure StorSimple provides system administration tools that you can use to configure and manage data stored on-premises, on a remote server, and in the cloud. Additionally, you can manage backup and restore functions from a Microsoft Management Console (MMC) snap-in. StorSimple provides a separate, optional interface that you can use to extend StorSimple management and data protection services to content stored on SharePoint servers. 
- **Improved disaster recovery and compliance** – Microsoft Azure StorSimple does not require extended recovery time. Instead, it restores data as it is needed. This means normal operations can continue with minimal disruption. Additionally, you can configure policies to specify backup schedules and data retention.
- **Data mobility** – Data uploaded to Microsoft Azure cloud services can be accessed from other sites for recovery and migration purposes. Additionally, you can use StorSimple to configure StorSimple virtual devices on virtual machines (VMs) running in Microsoft Azure. The VMs can then use virtual devices to access stored data for test or recovery purposes. 

The following diagram provides a high-level view of the Microsoft Azure StorSimple solution.

![StorSimple architecture](./media/storsimple-overview/hcs-data-services-storsimple-system-architecture.png)

**Microsoft Azure StorSimple architecture**

## StorSimple components

The Microsoft Azure StorSimple solution includes the following components:

- **Microsoft Azure StorSimple device**  – an on-premises hybrid storage array that contains solid state drives (SSDs) and hard disk drives (HDDs), together with redundant controllers and automatic failover capabilities. The controllers manage storage tiering, placing currently used (or hot) data on local storage (in the device or on-premises servers), while moving less frequently used data to the cloud.
- **StorSimple virtual device**  – also known as the StorSimple Virtual Appliance, this is a software version of the StorSimple device that replicates the architecture and capabilities of the physical hybrid storage device. The StorSimple virtual device runs on a single node in an Azure virtual machine. The virtual device is appropriate for use in test and small pilot scenarios. You cannot create a StorSimple virtual device on a StorSimple device or an on-premises server.
- **Windows PowerShell for StorSimple**  – a command-line interface that you can use to manage the StorSimple device. Windows PowerShell for StorSimple has features that allow you to register your StorSimple device, configure the network interface on your device, install certain types of updates, troubleshoot your device by accessing the support session, and change the device state. You can access Windows PowerShell for StorSimple by connecting to the serial console or by using Windows PowerShell remoting.
- **StorSimple Manager service**  – an extension of the Azure Management Portal that lets you manage a StorSimple device or StorSimple virtual device from a single web interface. You can use the StorSimple Manager service to create and manage services, view and manage devices, view alerts, manage volumes, and view and manage backup policies and the backup catalog.
- **StorSimple Snapshot Manager**  – an MMC snap-in that uses volume groups and the Windows Volume Shadow Copy Service to generate application-consistent backups. In addition, you can use StorSimple Snapshot Manager to create backup schedules and clone or restore volumes. 
- **StorSimple Adapter for SharePoint**  – a tool that transparently extends Microsoft Azure StorSimple storage and data protection to SharePoint Server farms, while making StorSimple storage viewable and manageable from the SharePoint Administration Portal.

## Next steps

Read about the [StorSimple components](https://technet.microsoft.com/library/cc754482.aspx) and review the[StorSimple release notes](https://msdn.microsoft.com/library/azure/dn772367.aspx)



