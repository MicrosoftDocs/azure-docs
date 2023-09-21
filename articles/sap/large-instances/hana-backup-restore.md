---
title: HANA backup and restore on SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Learn how to back up and restore SAP HANA on HANA Large Instances.
services: virtual-machines-linux
documentationcenter:
author: lauradolan
manager: gwallace
editor:
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 7/02/2021
ms.author: ladolan
ms.custom: H1Hack27Feb2017

---
# Backup and restore of SAP HANA on HANA Large Instances

>[!IMPORTANT]
>This article doesn't replace the SAP HANA administration documentation or SAP Notes. We expect you have expertise in SAP HANA administration and operations, especially with the topics of backup, restore, high availability, and disaster recovery. In this article, screenshots from SAP HANA Studio are shown. Content, structure, and the nature of the screens of SAP administration tools and the tools themselves might change from SAP HANA release to release.

In this article, we'll walk through the steps of backing up and restoring SAP HANA on HANA Large Instances (otherwise known as BareMetal Infrastructure). 

Some of the processes described in this article are simplified. They aren't intended as detailed steps to be included in operation handbooks. To create operation handbooks for your configurations, run and test your processes with your specific HANA versions and releases. You can then document the processes for your configurations.

One of the most important aspects of operating databases is to protect them from catastrophic events. Such events may be caused by anything from natural disasters to simple user errors. Backing up a database, with the ability to restore it to any point in time, such as before someone deleted critical data, offers critical protection. You can restore your database to a state that's as close as possible to the way it was prior to the disruption.

Two types of backups must be performed to achieve the capability to restore:

- Database backups: Full, incremental, or differential backups
- Transaction log backups

You can do full-database backups at an application level or do backups with storage snapshots. Storage snapshots don't replace transaction log backups. Transaction log backups remain important to restore the database to a certain point in time or to empty the logs from already committed transactions. Storage snapshots can accelerate recovery by quickly providing a roll-forward image of the database. 

SAP HANA on Azure (Large Instances) offers two backup and restore options:

- You can use a third-party data protection tool to create backups. This tool should be able to create application consistent snapshots or it must be able to use the backing interface to stream with multiple sessions to a proper backup location. There are several supported tools available. The choice of the tool should be discussed and designed with the project team to meet the customer backup windows requirements. And very important is to test the backup and restore procedure during the project phase.
- You can use storage snapshot backups with a utility provided by Microsoft as described in the next chapter

>[!NOTE]
>Before HANA2.0 SPS4 it was not supported to take database snapshots of multi-tenant database container databases (more than one tenant).
With SPS4 and newer SAP is fully supporting this snapshot feature.



## Use storage snapshots of SAP HANA on Azure (Large Instances)

The storage infrastructure underlying SAP HANA on Azure (Large Instances) supports storage snapshots of volumes. Both backup and restoration of volumes is supported, with the following considerations:

- Instead of full database backups, storage volume snapshots are taken on a frequent basis.
- Before a storage snapshot is triggered over /hana/data volume(s), the snapshot tool (azacsnap) starts an SAP HANA snapshot. This SAP HANA snapshot is the consistency point for eventual log restorations after recovery of the storage snapshot. 
- For a HANA snapshot to be successful, you need an active HANA instance. In a scenario with HANA System Replication (HSR), a storage snapshot isn't supported on a current secondary node where a HANA snapshot can’t be performed.
- After the storage snapshot runs successfully, the SAP HANA snapshot is deleted
- Other volumes like /hana/shared (incl. /usr/sap) can be snapshotted anytime without any database interaction

Transaction log backups are taken frequently and stored in the /hana/logbackups volume or in Azure. You can trigger the /hana/logbackups volume that contains the transaction log backups to take a snapshot separately. In that case, you don't need to run a HANA data snapshot. Since all files in /hana/logbackup are consistent, because they are “offline”, you can backup them also anytime to a different backup location to archive them.
If you must restore a database to a certain point in time, for a production outage, the azacsnap tool can either clone any data snapshot to a new volume to recover the database (preferred restore way) or restore a snapshot to the same data volume where the database is located

>[!NOTE]
> If you restore a older snapshot (snaprevert) to the original datavolume all newer created snapshots will be deleted. The storage system is doing this because the data points for the newer created snapshots will be invalid. Always start to revert the latest snapshot or even better clone the snapshot to a new volume. By the clone process nothing will be deleted.


## Storage snapshot considerations

>[!NOTE]
>Storage snapshots consume storage space that's allocated to the HANA Large Instance units. Consider the following aspects of scheduling storage snapshots and how many storage snapshots to keep. 

The specific mechanics of storage snapshots for SAP HANA on Azure (Large Instances) include:

- A specific storage snapshot at the point in time when it's taken consumes little storage.
- As data content changes and the content in SAP HANA data files change on the storage volume, the snapshot needs to store the original block content and the data changes.
- As a result, the storage snapshot increases in size. The longer the snapshot exists, the larger the storage snapshot becomes.
- The more changes made to the SAP HANA database volume over the lifetime of a storage snapshot, the larger the space consumption of the storage snapshot.

SAP HANA on Azure (Large Instances) comes with fixed volume sizes for the SAP HANA data and log volumes. Taking snapshots of those volumes eats into your volume space. You need to:

- Determine when to schedule storage snapshots.
- Monitor the space consumption of the storage volumes. 
- Manage the number of snapshots that you store. 

You can disable the storage snapshots when you either import masses of data or make other significant changes to the HANA database. 


The following sections provide information for taking these snapshots and include general recommendations:

- Although the hardware can sustain 255 snapshots per volume, you want to stay well below this number. The recommendation is 250 or less.
- Before you do storage snapshots, monitor and keep track of free space.
- Lower the number of storage snapshots based on free space. You can lower the number of snapshots that you keep, or you can extend the volumes. You can order more storage in 1-terabyte units.
- During activities such as moving data into SAP HANA with SAP platform migration tools (R3load) or restoring SAP HANA databases from backups, disable storage snapshots on the /hana/data volume. 
- During larger reorganizations of SAP HANA tables, avoid storage snapshots if possible.
- Storage snapshots are a prerequisite to take advantage of the DR capabilities of SAP HANA on Azure (Large Instances).

## Prerequisites for using self-service storage snapshots

Read the documentation [What is Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-introduction.md)

There are two ways of implementing this tool. 
1)	Locally on the database server
2)	Remotely on a “backup” VM

If you create a backup VM make sure the latest HANA client is installed in that VM. With this method azacsnap must be able open a remote database connection to a HANA instance running in a different VM.
You need to request a ssh-key and a storage user from the Microsoft Support team to be able to access the storage. Without this ssh-key and the user it is not possible to create snapshots.

## Download and set up azacsnap

To set up storage snapshots with HANA Large Instances, start with downloading the and installing the azacsnap tool as described in [Get started with Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-get-started.md)

Azacsnap is creating an user called azacsnap by default. If you prefer another name, you can specify this during the installation. Check the above documentation for details.

## Subsequent next steps
Follow the documentation of azacsnap to:

- [Install Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-installation.md)
- [Configure Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-configure.md)
- [Test Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-test.md)
- [Back up using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-backup.md)
- [Obtain details using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-details.md)
- [Delete using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-delete.md)
- [Restore using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-cmd-ref-restore.md)
- [Disaster recovery using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-disaster-recovery.md)
- [Troubleshoot Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-troubleshoot.md)
- [Tips and tricks for using Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-tips.md)


## Next steps

Read the article [What is Azure Application Consistent Snapshot tool](../../azure-netapp-files/azacsnap-introduction.md)

  



