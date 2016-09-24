<properties 
   pageTitle="StorSimple Snapshot Manager administration | Microsoft Azure"
   description="Provides an overview and links to more information about StorSimple Snapshot Manager solution administration tasks and workflows."
   services="storsimple"
   documentationCenter="NA"
   authors="SharS"
   manager="carolz"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="05/18/2016"
   ms.author="v-sharos" />

# Use StorSimple Snapshot Manager to administer your StorSimple solution

## Overview

StorSimple Snapshot Manager is a Microsoft Management Console (MMC) snap-in that simplifies data protection and backup management in a Microsoft Azure StorSimple environment. With StorSimple Snapshot Manager, you can manage Microsoft Azure StorSimple data in the data center and in the cloud as a single integrated storage solution, thus simplifying backup processes and reducing costs.

The StorSimple Snapshot Manager central management console enables you to create consistent, point-in-time backup copies of local and cloud data. For example, you can use the console to:

- Configure, back up, and delete volumes.

- Configure volume groups to ensure that backed up data is application-consistent.

- Manage backup policies so that data is backed up on a predetermined schedule.

- Create independent copies of data, which can be stored in the cloud and used for disaster recovery.

This article provides links to tutorials that describe StorSimple Snapshot Manager and how to use it to complete system administration tasks and workflows.

- For more information about StorSimple Snapshot Manager components and architecture, see [What is StorSimple Snapshot Manager?](storsimple-what-is-snapshot-manager.md) 

- To download StorSimple Snapshot Manager, go to [the StorSimple Snapshot Manager download page](https://www.microsoft.com/download/details.aspx?id=44220).

- For StorSimple Snapshot Manager deployment procedures, go to [Deploy StorSimple Snapshot Manager](storsimple-snapshot-manager-deployment.md).

>[AZURE.NOTE] You cannot use StorSimple Snapshot Manager to manage Microsoft Azure StorSimple Virtual Arrays (also known as StorSimple on-premises virtual devices).

## StorSimple Snapshot Manager tasks and workflows

You can use the StorSimple Snapshot Manager to monitor and manage current, scheduled, and completed backup jobs. Additionally, StorSimple Snapshot Manager provides a catalog of up to 64 completed backups. You can use the catalog to find and restore volumes or individual files. 

| IF YOU WANT TO DO THIS...  | USE THIS TUTORIAL... |
|:---------------------------|:----------------------|
|Learn more about StorSimple Snapshot Manager | [What is StorSimple Snapshot Manager? ](storsimple-what-is-snapshot-manager.md)|
| Install StorSimple Snapshot Manager<br>Reinstall StorSimple Snapshot Manager<br>Remove StorSimple Snapshot Manager| [Deploy StorSimple Snapshot Manager](storsimple-snapshot-manager-deployment.md) |
| Use StorSimple Snapshot Manager menus and features:<ul><li>Menu bar</li><li>Tool bar</li><li>Scope pane</li><li>Results pane</li><li>Actions pane</li><li>Keyboard navigation and shortcuts</li></ul>| [StorSimple Snapshot Manager user interface](storsimple-use-snapshot-manager.md) |
| Use the common MMC features included in StorSimple Snapshot Manager:<ul><li>View</li><li>New Window from Here</li><li>Refresh</li><li>Export List</li><li>Help</li></ul>| [Use the MMC menu actions in StorSimple Snapshot Manager](storsimple-snapshot-manager-mmc-menu.md)
| Add or replace a device<br>Connect a device<br>Verify imported volume groups<br>Refresh connected devices<br>Authenticate a device<br>View device details<br>Delete a device configuration<br>Change a device password<br>Replace a failed device<br>| [Use StorSimple Snapshot Manager to connect and manage StorSimple devices](storsimple-snapshot-manager-manage-devices.md) |
| Mount volumes<br>View information about volumes<br>Delete a volume<br>Rescan volumes<br>Configure and back up a basic volume<br>Configure and backup a dynamic mirrored volume| [Use StorSimple Snapshot Manager to view and manage volumes](storsimple-snapshot-manager-manage-volumes.md) |
| View volume groups<br>Create a volume group<br>Back up a volume group<br>Edit a volume group<br>Delete a volume group | [Use StorSimple Snapshot Manager to create and manage volume groups](storsimple-snapshot-manager-manage-volume-groups.md) |
| Create a backup policy <br>Edit a backup policy<br>Delete a backup policy | [Use StorSimple Snapshot Manager to create and manage backup policies](storsimple-snapshot-manager-manage-backup-policies.md) |
| View and manage scheduled backup jobs<br>View and manage recent backup jobs<br>View and manage currently running backup jobs | [Use StorSimple Snapshot Manager to view and manage backup jobs](storsimple-snapshot-manager-manage-backup-jobs.md) |
| Restore a volume<br>Clone a volume or volume group<br>Delete a backup<br>Recover a file<br>Restore the StorSimple Snapshot Manager database| [Use StorSimple Snapshot Manager to manage the backup catalog](storsimple-snapshot-manager-manage-backup-catalog.md) |

## Next steps

[Download StorSimple Snapshot Manager](https://www.microsoft.com/download/details.aspx?id=44220).
