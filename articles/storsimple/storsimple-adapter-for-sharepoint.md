---
title: Install StorSimple Adapter for SharePoint | Microsoft Docs
description: Describes how to install and configure or remove the StorSimple Adapter for SharePoint in a SharePoint server farm.
services: storsimple
documentationcenter: NA
author: twooley
manager: timlt
editor: ''

ms.assetid: 36c20b75-f2e5-4184-a6b5-9c5e618f79b2
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 06/06/2017
ms.author: twooley

---
# Install and configure the StorSimple Adapter for SharePoint
## Overview
The StorSimple Adapter for SharePoint is a component that lets you provide Microsoft Azure StorSimple flexible storage and data protection to SharePoint server farms. You can use the adapter to move Binary Large Object (BLOB) content from the SQL Server content databases to the Microsoft Azure StorSimple hybrid cloud storage device.

The StorSimple Adapter for SharePoint functions as a Remote BLOB Storage (RBS) provider and uses the SQL Server Remote BLOB Storage feature to store unstructured SharePoint content (in the form of BLOBs) on a file server that is backed by a StorSimple device.

> [!NOTE]
> The StorSimple Adapter for SharePoint supports SharePoint Server 2010 Remote BLOB Storage (RBS). It does not support SharePoint Server 2010 External BLOB Storage (EBS).


* To download the StorSimple Adapter for SharePoint, go to [StorSimple Adapter for SharePoint][1] in the Microsoft Download Center.
* For information about planning for RBS and RBS limitations, go to [Deciding to use RBS in SharePoint 2013][2] or [Plan for RBS (SharePoint Server 2010)][3].

The rest of this overview briefly describes the role of the StorSimple Adapter for SharePoint and the SharePoint capacity and performance limits that you should be aware of before you install and configure the adapter. After you review this information, go to [StorSimple Adapter for SharePoint installation](#storsimple-adapter-for-sharepoint-installation) to begin setting up the adapter.

### StorSimple Adapter for SharePoint benefits
In a SharePoint site, content is stored as unstructured BLOB data in one or more content databases. By default, these databases are hosted on computers that are running SQL Server and are located in the SharePoint server farm. BLOBs can rapidly increase in size, consuming large amounts of on-premises storage. For this reason, you might want to find another, less-expensive storage solution. SQL Server provides a technology called Remote Blob Storage (RBS) that lets you store BLOB content in the file system, outside the SQL Server database. With RBS, BLOBs can reside in the file system on the computer that is running SQL Server, or they can be stored in the file system on another server computer.

RBS requires that you use an RBS provider, such as the StorSimple Adapter for SharePoint, to enable RBS in SharePoint. The StorSimple Adapter for SharePoint works with RBS, letting you move BLOBs to a server backed up by the Microsoft Azure StorSimple system. Microsoft Azure StorSimple then stores the BLOB data locally or in the cloud, based on usage. BLOBs that are very active (typically referred to as Tier 1 or hot data) reside locally. Less active data and archival data reside in the cloud. After you enable RBS on a content database, any new BLOB content created in SharePoint is stored on the StorSimple device and not in the content database.

The Microsoft Azure StorSimple implementation of RBS provides the following benefits:

* By moving BLOB content to a separate server, you can reduce the query load on SQL Server, which can improve SQL Server responsiveness. 
* Azure StorSimple uses deduplication and compression to reduce data size.
* Azure StorSimple provides data protection in the form of local and cloud snapshots. Also, if you place the database itself on the StorSimple device, you can back up the content database and BLOBs together in a crash consistent way. (Moving the content database to the device is only supported for the StorSimple 8000 series device. This feature is not supported for the 5000 or 7000 series.)
* Azure StorSimple includes disaster recovery features including failover, file and volume recovery (including test recovery), and rapid restoration of data.
* You can use data recovery software, such as Kroll Ontrack PowerControls, with StorSimple snapshots of BLOB data to perform item-level recovery of SharePoint content. (This data recovery software is a separate purchase.)
* The StorSimple Adapter for SharePoint plugs into the SharePoint Central Administration portal, allowing you to manage your entire SharePoint solution from a central location.

Moving BLOB content to the file system can provide other cost savings and benefits. For example, using RBS can reduce the need for expensive Tier 1 storage and, because it shrinks the content database, RBS can reduce the number of databases required in the SharePoint server farm. However, other factors, such as database size limits and the amount of non-RBS content, can also affect storage requirements. For more information about the costs and benefits of using RBS, see [Plan for RBS (SharePoint Foundation 2010)][4] and [Deciding to use RBS in SharePoint 2013][5].

### Capacity and performance limits
Before you consider using RBS in your SharePoint solution, you should be aware of the tested performance and capacity limits of SharePoint Server 2010 and SharePoint Server 2013, and how these limits relate to acceptable performance. For more information, see [Software Boundaries and Limits for SharePoint 2013](https://technet.microsoft.com/library/cc262787.aspx).

Review the following before you configure RBS:

* Make sure that the total size of the content (the size of a content database plus the size of any associated externalized BLOBs) does not exceed the RBS size limit supported by SharePoint. This limit is 200 GB. 
  
    **To measure content database and BLOB size**
  
  1. Run this query on the Central Administration WFE. Start the SharePoint Management Shell, and then enter the following Windows PowerShell command to get the size of the content databases:
     
     `Get-SPContentDatabase | Select-Object -ExpandProperty DiskSizeRequired`
     
      This step gets the size of the content database on the disk.
  2. Run one of the following SQL queries in SQL Management Studio on the SQL server box on each content database, and add the result to the number obtained in step 1.
     
     On SharePoint 2013 content databases, enter:
     
     `SELECT SUM([Size]) FROM [ContentDatabaseName].[dbo].[DocStreams] WHERE [Content] IS NULL`
     
     On SharePoint 2010 content databases, enter:
     
     `SELECT SUM([Size]) FROM [ContentDatabaseName].[dbo].[AllDocs] WHERE [Content] IS NULL`
     
     This step gets the size of the BLOBs that have been externalized.
* We recommend that you store all BLOB and database content locally on the StorSimple device. The StorSimple device is a two-node cluster for high availability. Placing the content databases and BLOBs on the StorSimple device provides high availability.
  
    Use traditional SQL Server migration best practices to move the content database to the StorSimple device. Move the database only after all BLOB content from the database has been moved to the file share via RBS. If you choose to move the content database to the StorSimple device, we recommend that you configure the content database storage on the device as a primary volume.
* In Microsoft Azure StorSimple, if using tiered volumes, there is no way to guarantee that content stored locally on the StorSimple device will not be tiered to Microsoft Azure cloud storage. Hence, we recommend using StorSimple locally pinned volumes in conjunction with SharePoint RBS. This will ensure that all BLOB content remains locally on the StorSimple device, and is not moved to Microsoft Azure.
* If you do not store the content databases on the StorSimple device, use traditional SQL Server high availability best practices that support RBS. SQL Server clustering supports RBS, while SQL Server mirroring does not. 

> [!WARNING]
> If you have not enabled RBS, we do not recommend moving the content database to the StorSimple device. This is an untested configuration.

## StorSimple Adapter for SharePoint installation
Before you can install the StorSimple Adapter for SharePoint, you must configure the StorSimple device and make sure that the SharePoint server farm and SQL Server instantiation meet all prerequisites. This tutorial describes configuration requirements, as well as procedures for installing and upgrading the StorSimple Adapter for SharePoint.

## Configure prerequisites
Before you can install the StorSimple Adapter for SharePoint, make sure that the StorSimple device, SharePoint server farm, and SQL Server instantiation meet the following prerequisites.

### System requirements
The StorSimple Adapter for SharePoint works with the following hardware and software:

* Supported operating system – Windows Server 2008 R2 SP1, Windows Server 2012, or Windows Server 2012 R2
* Supported SharePoint versions – SharePoint Server 2010 or SharePoint Server 2013
* Supported SQL Server versions – SQL Server 2008 Enterprise Edition, SQL Server 2008 R2 Enterprise Edition, or SQL Server 2012 Enterprise Edition
* Supported StorSimple devices – StorSimple 8000 series, StorSimple 7000 series, or StorSimple 5000 series.

### StorSimple device configuration prerequisites
The StorSimple device is a block device and as such requires a file server on which the data can be hosted. We recommend that you use a separate server rather than an existing server from the SharePoint farm. This file server must be on the same local area network (LAN) as the SQL Server computer that hosts the content databases.

> [!TIP]
> * If you configure your SharePoint farm for high availability, you should deploy the file server for high availability also.
> * If you do not store the content database on the StorSimple device, use traditional high availability best practices that support RBS. SQL Server clustering supports RBS, while SQL Server mirroring does not. 


Make sure that your StorSimple device is configured correctly, and that appropriate volumes to support your SharePoint deployment are configured and accessible from your SQL Server computer. Go to [Deploy your on-premises StorSimple device](storsimple-8000-deployment-walkthrough-u2.md) if you have not yet deployed and configured your StorSimple device. Note the IP address of the StorSimple device; you will need it during StorSimple Adapter for SharePoint installation.

In addition, make sure that the volume to be used for BLOB externalization meets the following requirements:

* The volume must be formatted with a 64 KB allocation unit size.
* Your web front end (WFE) and application servers must be able to access the volume via a Universal Naming Convention (UNC) path.
* The SharePoint server farm must be configured to write to the volume.

> [!NOTE]
> After you install and configure the adapter, all BLOB externalization must go through the StorSimple device (the device will present the volumes to SQL Server and manage the storage tiers). You cannot use any other targets for BLOB externalization.


If you plan to use StorSimple Snapshot Manager to take snapshots of the BLOB and database data, be sure to install StorSimple Snapshot Manager on the database server so that it can use the SQL Writer Service to implement the Windows Volume Shadow Copy Service (VSS).

> [!IMPORTANT]
> StorSimple Snapshot Manager does not support the SharePoint VSS Writer and cannot take application-consistent snapshots of SharePoint data. In a SharePoint scenario, StorSimple Snapshot Manager provides only crash-consistent backups.


## SharePoint farm configuration prerequisites
Make sure that your SharePoint server farm is correctly configured, as follows:

* Verify that your SharePoint server farm is in a healthy state, and check the following:
* All SharePoint WFE and application servers registered in the farm are running and can be pinged from the server on which you will be installing the StorSimple Adapter for SharePoint.
* The SharePoint Timer service (SPTimerV3 or SPTimerV4) is running on each WFE server and application server.
* Both the SharePoint Timer service and the IIS application pool under which the SharePoint Central Administration site is running have administrative privileges.
* Make sure that Internet Explorer Enhanced Security Context (IE ESC) is disabled. Follow these steps to disable IE ESC:
  
  1. Close all instances of Internet Explorer.
  2. Start the Server Manager.
  3. In the left pane, click **Local Server**.
  4. On the right pane, next to **IE Enhanced Security Configuration**, click **On**.
  5. Under **Administrators**, click **Off**.
  6. Click **OK**.

## Remote BLOB Storage (RBS) prerequisites
Make sure that you are using a supported version of SQL Server. Only the following versions are supported and able to use RBS:

* SQL Server 2008 Enterprise Edition
* SQL Server 2008 R2 Enterprise Edition
* SQL Server 2012 Enterprise Edition

BLOBs can be externalized on only those volumes that the StorSimple device presents to SQL Server. No other targets for BLOB externalization are supported.

When you have completed all prerequisite configuration steps, go to [Install the StorSimple Adapter for SharePoint](#install-the-storsimple-adapter-for-sharepoint).

## Install the StorSimple Adapter for SharePoint
Use the following steps to install the StorSimple Adapter for SharePoint. If you are reinstalling the software, see [Upgrade or reinstall the StorSimple Adapter for SharePoint](#upgrade-or-reinstall-the-storsimple-adapter-for-sharepoint). The time required for the installation depends on the total number of SharePoint databases in your SharePoint server farm.

[!INCLUDE [storsimple-install-sharepoint-adapter](../../includes/storsimple-install-sharepoint-adapter.md)]

## Configure RBS
After you install the StorSimple Adapter for SharePoint, configure RBS as described in the following procedure.

> [!TIP]
> The StorSimple Adapter for SharePoint plugs into the SharePoint Central Administration page, allowing RBS to be enabled or disabled on each content database in the SharePoint farm. However, enabling or disabling RBS on the content database causes an IIS reset, which, depending on your farm configuration, can momentarily disrupt the availability of the SharePoint web front end (WFE). (Factors such as the use of a front-end load balancer, the current server workload, and so on, can limit or eliminate this disruption.) To protect users from a disruption, we recommend that you enable or disable RBS only during a planned maintenance window.


[!INCLUDE [storsimple-sharepoint-adapter-configure-rbs](../../includes/storsimple-sharepoint-adapter-configure-rbs.md)]

## Configure garbage collection
When objects are deleted from a SharePoint site, they are not automatically deleted from the RBS store volume. Instead, an asynchronous, background maintenance program deletes orphaned BLOBs from the file store. System administrators can schedule this process to run periodically or they can start it whenever necessary.

This maintenance program (Microsoft.Data.SqlRemoteBlobs.Maintainer.exe) is automatically installed on all SharePoint WFE servers and application servers when you enable RBS. The program is installed in the following location: *boot drive*:\Program Files\Microsoft SQL Remote Blob Storage 10.50\Maintainer\

For information about configuring and using the maintenance program, see [Maintain RBS in SharePoint Server 2013][8].

> [!IMPORTANT]
> The RBS maintainer program is resource intensive. You should schedule it to run only during periods of light activity on the SharePoint farm.


### Delete orphaned BLOBs immediately
If you need to delete orphaned BLOBs immediately, you can use the following instructions. Note that these instructions are an example of how this can be done in a SharePoint 2013 environment with the following components:

* The content database name is WSS_Content.
* The SQL Server name is SHRPT13-SQL12\SHRPT13.
* The web application name is SharePoint – 80.

[!INCLUDE [storsimple-sharepoint-adapter-garbage-collection](../../includes/storsimple-sharepoint-adapter-garbage-collection.md)]

## Upgrade or reinstall the StorSimple Adapter for SharePoint
Use the following procedure to upgrade SharePoint server and then reinstall StorSimple Adapter for SharePoint or to simply upgrade or reinstall the adapter in an existing SharePoint server farm.

> [!IMPORTANT]
> Review the following information before you attempt to upgrade your SharePoint software and/or upgrade or reinstall the StorSimple Adapter for SharePoint:
> 
> * Any files that were previously moved to external storage via RBS will not be available until the reinstallation is finished and the RBS feature is enabled again. To limit user impact, perform any upgrade or reinstallation during a planned maintenance window.
> * The time required for the upgrade/reinstallation can vary, depending on the total number of SharePoint databases in the SharePoint server farm.
> * After the upgrade/reinstallation is complete, you need to enable RBS for the content databases. See [Configure RBS](#configure-rbs) for more information.
> * If you are configuring RBS for a SharePoint farm that has a very large number of databases (greater than 200), the **SharePoint Central Administration** page might time out. If that occurs, refresh the page. This does not affect the configuration process.


[!INCLUDE [storsimple-upgrade-sharepoint-adapter](../../includes/storsimple-upgrade-sharepoint-adapter.md)]

## StorSimple Adapter for SharePoint removal
The following procedures describe how to move the BLOBs back to the SQL Server content databases and then uninstall the StorSimple Adapter for SharePoint. 

> [!IMPORTANT]
> You have to move the BLOBs back to the content databases before you uninstall the adapter software.


### Before you begin
Collect the following information before you move the data back to the SQL Server content databases and begin the adapter removal process:

* The names of all the databases for which RBS is enabled
* The UNC path of the configured BLOB store

### Move the BLOBs back to the content databases
Before you uninstall the StorSimple Adapter for SharePoint software, you must migrate all of the BLOBs that were externalized back to the SQL Server content databases. If you attempt to uninstall the StorSimple Adapter for SharePoint before you move all the BLOBs back to the content databases, you will see the following warning message.

![Warning message](./media/storsimple-adapter-for-sharepoint/sasp1.png)

#### To move the BLOBs back to the content databases
1. Download each of the externalized objects.
2. Open the **SharePoint Central Administration** page, and browse to **System Settings**.
3. Under **Azure StorSimple**, click **Configure StorSimple Adapter**.
4. On the **Configure StorSimple Adapter** page, click the **Disable** button below each of the content databases that you want to remove from external BLOB storage. 
5. Delete the objects from SharePoint, and then upload them again.

Alternatively, you can use the Microsoft `RBS Migrate()` PowerShell cmdlet included with SharePoint. For more information, see [Migrate content into or out of RBS](https://technet.microsoft.com/library/ff628255.aspx).

After you move the BLOBs back to the content database, go to the next step: [Uninstall the adapter](#uninstall-the-adapter).

### Uninstall the adapter
After you move the BLOBs back to the SQL Server content databases, use one of the following options to uninstall the StorSimple Adapter for SharePoint.

#### To use the installation program to uninstall the adapter
1. Use an account with administrator privileges to log on to the web front-end (WFE) server.
2. Double-click the StorSimple Adapter for SharePoint installer. The Setup Wizard starts.
   
    ![Setup wizard](./media/storsimple-adapter-for-sharepoint/sasp2.png)
3. Click **Next**. The following page appears.
   
    ![Setup wizard remove page](./media/storsimple-adapter-for-sharepoint/sasp3.png)
4. Click **Remove** to select the removal process. The following page appears.
   
    ![Setup wizard confirmation page](./media/storsimple-adapter-for-sharepoint/sasp4.png)
5. Click **Remove** to confirm the removal. The following progress page appears.
   
    ![Setup wizard progress page](./media/storsimple-adapter-for-sharepoint/sasp5.png)
6. When the removal is complete, the finish page appears. Click **Finish** to close the Setup Wizard.

#### To use the Control Panel to uninstall the adapter
1. Open the Control Panel, and then click **Programs and Features**.
2. Select **StorSimple Adapter for SharePoint**, and then click **Uninstall**.

## Next steps
[Learn more about StorSimple](storsimple-overview.md).

<!--Reference links-->
[1]: https://www.microsoft.com/download/details.aspx?id=44073
[2]: https://technet.microsoft.com/library/ff628583(v=office.15).aspx
[3]: https://technet.microsoft.com/library/ff628583(v=office.14).aspx
[4]: https://technet.microsoft.com/library/ff628569(v=office.14).aspx
[5]: https://technet.microsoft.com/library/ff628583(v=office.15).aspx
[8]: https://technet.microsoft.com/library/ff943565.aspx
