---
title: HANA backup and restore on SAP HANA on Azure (Large Instances) | Microsoft Docs
description: How to perform HANA backup and restore on SAP HANA on Azure (Large Instances)
services: virtual-machines-linux
documentationcenter:
author: saghorpa
manager: jeconnoc
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/22/2019
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# Backup and restore

>[!IMPORTANT]
>This documentation is no replacement of the SAP HANA administration documentation or SAP Notes. It's expected that the reader has a solid understanding of and expertise in SAP HANA administration and operations, especially with the topics of backup, restore, high availability, and disaster recovery. In this documentation, screenshots from SAP HANA Studio are shown. Content, structure, and the nature of the screens of SAP administration tools and the tools themselves might change from SAP HANA release to release.

It's important that you exercise steps and processes taken in your environment and with your HANA versions and releases. Some processes described in this documentation are simplified for a better general understanding and are not meant to be used as detailed steps for eventual operation handbooks. If you want to create operation handbooks for your configurations, you need to test and exercise your processes and document the processes related to your specific configurations. 

One of the most important aspects to operating databases is to protect them from catastrophic events. The cause of these events can be anything from natural disasters to simple user errors.

Backing up a database, with the ability to restore it to any point in time (such as before someone deleted critical data), enables restoration to a state that is as close as possible to the way it was prior to the disruption.

Two types of backups must be performed to achieve such a capability to restore:

- Database backups: Full, incremental, or differential backups
- Transaction log backups

In addition to full-database backups performed at an application level, you can perform backups with storage snapshots. Storage snapshots do not replace transaction log backups. Transaction log backups remain important to restore the database to a certain point in time or to empty the logs from already committed transactions. However, storage snapshots can accelerate recovery by quickly providing a roll-forward image of the database. 

SAP HANA on Azure (Large Instances) offers two backup and restore options:

- Do-it-yourself (DIY). After you ensure that there is enough disk space, perform full database and log backups by using one of the following disk backup methods. You can back up either directly to volumes attached to the HANA Large Instance units, or to Network File Shares (NFS) that are set up in an Azure virtual machine (VM). In the latter case, customers set up a Linux VM in Azure, attach Azure Storage to the VM, and share the storage through a configured NFS server in that VM. If you perform the backup against volumes that directly attach to HANA Large Instance units, you need to copy the backups to an Azure storage account (after you set up an Azure VM that exports NFS shares that are based on Azure Storage). You can also use either an Azure backup vault or Azure cold storage. 

   Another option is to use a third-party data protection tool to store the backups after they are copied to an Azure storage account. The DIY backup option might also be necessary for data that you need to store for longer periods of time for compliance and auditing purposes. In all cases, the backups are copied into NFS shares represented through a VM and Azure Storage.

- Infrastructure backup and restore functionality. You can also use the backup and restore functionality that the underlying infrastructure of SAP HANA on Azure (Large Instances) provides. This option fulfills the need for backups and fast restores. The rest of this section addresses the backup and restore functionality that's offered with HANA Large Instances. This section also covers the relationship backup and restore has to the disaster recovery functionality offered by HANA Large Instances.

> [!NOTE]
>   The snapshot technology that is used by the underlying infrastructure of HANA Large Instances has a dependency on SAP HANA snapshots. At this point, SAP  HANA snapshots do not work in conjunction with multiple tenants of SAP HANA multitenant database containers. If only one tenant is deployed, SAP HANA snapshots do work and this method can be used.

## Using storage snapshots of SAP HANA on Azure (Large Instances)

The storage infrastructure underlying SAP HANA on Azure (Large Instances) supports storage snapshots of volumes. Both backup and restoration of volumes is supported, with the following considerations:

- Instead of full database backups, storage volume snapshots are taken on a frequent basis.
- When triggering a snapshot over /hana/data and /hana/shared (includes /usr/sap) volumes, the snapshot technology initiates an SAP HANA snapshot before it executes the storage snapshot. This SAP HANA snapshot is the setup point for eventual log restorations after recovery of the storage snapshot. For HANA snapshot to be successful, you need an active HANA instance.  In HSR scenario, storage snapshot is not supported on current secondary node where HANA snapshot can’t be performed.
- After the storage snapshot has been executed successfully, the SAP HANA snapshot is deleted.
- Transaction log backups are taken frequently and are stored in the /hana/logbackups volume, or in Azure. You can trigger the /hana/logbackups volume that contains the transaction log backups to take a snapshot separately. In that case, you do not need to execute an HANA snapshot.
- If you must restore a database to a certain point in time, request that Microsoft Azure Support (for a production outage) or SAP HANA on Azure restore to a certain storage snapshot. An example is a planned restoration of a sandbox system to its original state.
- The SAP HANA snapshot that's included in the storage snapshot is an offset point for applying transaction log backups that have been executed and stored after the storage snapshot was taken.
- These transaction log backups are taken to restore the database back to a certain point in time.

You can perform storage snapshots targeting three classes of volumes:

- A combined snapshot over /hana/data, and /hana/shared (includes /usr/sap). This snapshot requires the creation of an SAP HANA snapshot as preparation for the storage snapshot. The SAP HANA snapshot makes sure that the database is in a consistent state from a storage point of view. And that for the restore process that is a point to set up on.
- A separate snapshot over /hana/logbackups.
- An operating system partition.

Get the latest snapshot scripts and documentation from [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/tree/master/snapshot_tools_v4.0). When you download the snapshot script package from the [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/tree/master/snapshot_tools_v4.0), you get three files of which one is a PDF documentation for the functionality provided. Make sure that you proceed along the instruction in the chapter 'Getting the snapshot tools' when downloading the tool set.

## Storage snapshot considerations

>[!NOTE]
>Storage snapshots consume storage space that has been allocated to the HANA Large Instance units. You need to consider the following aspects of scheduling storage snapshots and how many storage snapshots to keep. 

The specific mechanics of storage snapshots for SAP HANA on Azure (Large Instances) include:

- A specific storage snapshot (at the point in time when it is taken) consumes little storage.
- As data content changes and the content in SAP HANA data files change on the storage volume, the snapshot needs to store the original block content, as well as the data changes.
- As a result, the storage snapshot increases in size. The longer the snapshot exists, the larger the storage snapshot becomes.
- The more changes that are made to the SAP HANA database volume over the lifetime of a storage snapshot, the larger the space consumption of the storage snapshot.

SAP HANA on Azure (Large Instances) comes with fixed volume sizes for the SAP HANA data and log volumes. Performing snapshots of those volumes eats into your volume space. You need to determine, when to schedule storage snapshots. You also need to monitor the space consumption of the storage volumes, as well as manage the number of snapshots that you store. You can disable the storage snapshots when you either import masses of data or perform other significant changes to the HANA database. 


The following sections provide information for performing these snapshots, including general recommendations:

- Though the hardware can sustain 255 snapshots per volume, you want to stay well below this number. Recommendation is 250 or less.
- Before you perform storage snapshots, monitor and keep track of free space.
- Lower the number of storage snapshots based on free space. You can lower the number of snapshots that you keep, or you can extend the volumes. You can order additional storage in 1-terabyte units.
- During activities such as moving data into SAP HANA with SAP platform migration tools (R3load) or restoring SAP HANA databases from backups, disable storage snapshots on the /hana/data volume. 
- During larger reorganizations of SAP HANA tables, storage snapshots should be avoided, if possible.
- Storage snapshots are a prerequisite to taking advantage of the disaster recovery capabilities of SAP HANA on Azure (Large Instances).

## Prerequisites for using self-service storage snapshots

To ensure that the snapshot script executes successfully, make sure that Perl is installed on the Linux operating system on the HANA Large Instances server. Perl comes pre-installed on your HANA Large Instance unit. To check the Perl version, use the following command:

`perl -v`

![The public key is copied by running this command](./media/hana-overview-high-availability-disaster-recovery/perl_screen.png)


## Set up storage snapshots

To set up storage snapshots with HANA Large Instances, follow these steps:
1. Make sure that Perl is installed on the Linux operating system on the HANA Large Instances server.
1. Modify the /etc/ssh/ssh\_config to add the line _MACs hmac-sha1_.
1. Create an SAP HANA backup user account on the master node for each SAP HANA instance you are running, if applicable.
1. Install the SAP HANA HDB client on all the SAP HANA Large Instances servers.
1. On the first SAP HANA Large Instances server of each region, create a public key to access the underlying storage infrastructure that controls snapshot creation.
1. Copy the scripts and configuration file from [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/tree/master/snapshot_tools_v4.0) to the location of **hdbsql** in the SAP HANA installation.
1. Modify the *HANABackupDetails.txt* file as necessary for the appropriate customer specifications.

Get the latest snapshot scripts and documentation from [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/tree/master/snapshot_tools_v4.0). For the detailed steps listed above, refer to [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf)

### Consideration for MCOD scenarios
If you're running an [MCOD scenario](https://launchpad.support.sap.com/#/notes/1681092) with multiple SAP HANA instances on one HANA Large Instance unit, you have separate storage volumes provisioned for each of the SAP HANA instances. For details on MDC and other considerations, check [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf) chapter **'Important things to remember'**.
 

### Step 1: Install the SAP HANA HDB client

The Linux operating system installed on SAP HANA on Azure (Large Instances) includes the folders and scripts necessary to execute SAP HANA storage snapshots for backup and disaster recovery purposes. Check for more recent releases in [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/tree/master/snapshot_tools_v4.0). The most recent release version of the scripts is 4.0. Different scripts might have different minor releases within the same major release.

It is your responsibility to install the SAP HANA HDB client on the HANA Large Instance units while you are installing SAP HANA.

### Step 2: Change the /etc/ssh/ssh\_config

This step is described in detail in Check for more recent releases in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf) in chapter **'Enable communication with storage'**


### Step 3: Create a public key

To enable access to the storage snapshot interfaces of your HANA Large Instance tenant, you need to establish a sign-in procedure through a public key. On the first SAP HANA on Azure (Large Instances) server in your tenant, create a public key to be used to access the storage infrastructure. The public key ensures that a password is not required to sign in to the storage snapshot interfaces. Creating a public key also means that you do not need to maintain password credentials. The exact steps how to generate the public key is described in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf) in chapter **'Enable communication with storage'**


### Step 4: Create an SAP HANA user account

To initiate the creation of SAP HANA snapshots, you need to create a user account in SAP HANA that the storage snapshot scripts can use. Create an SAP HANA user account within SAP HANA Studio for this purpose. The user must be created under the SYSTEMDB and NOT under the SID database for MDC. In the single container environment, user is setup under the tenant database. This account must have the following privileges: **Backup Admin** and **Catalog Read**. For exact steps to set up the user and use the user, read [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/tree/master/snapshot_tools_v4.0) in chapter **'Enable communication with SAP HANA'**


### Step 5: Authorize the SAP HANA user account

In this step, you authorize the SAP HANA user account that you created, so that the scripts don't need to submit passwords at runtime. The SAP HANA command `hdbuserstore` enables the creation of an SAP HANA user key, which is stored on one or more SAP HANA nodes. The user key lets the user access SAP HANA without having to manage passwords from within the scripting process. The scripting process is discussed later in this article.

>[!IMPORTANT]
>Run these configuration commands with the same user context the snapshot commands are executed in. Otherwise, the snapshot commands cannot work properly.


### Step 6: Get the snapshot scripts, configure the snapshots, and test the configuration and connectivity

Download the most recent version of the scripts from [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/tree/master/snapshot_tools_v4.0). 
The way the scripts are going to be installed has changed majorly with release 4.0 of the scripts. For the exact details, read [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf) in chapter **'Enable communication with SAP HANA'**

For the exact sequence of commands, read chapter **'Easy installation of snapshot tools (default)'** of  the document [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf). We recommend the usage of the default installation. If you want to upgrade from version 3.x to 4.0, check the section **'Upgrading an existing install'** of [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf). For uninstalling the 4.0 tool set, follow the instructions in **'Uninstallation of the snapshot tools'** in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf).

Don't forget to execute the steps described in **'Complete setup of snapshot tools'** of [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf).

The purpose of the different scripts and files as they got installed is listed and detailed in **'What are these snapshot tools?'** of  the document [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf).

Before configuring the snapshot tools, make sure that you also configured HANA backup locations and settings correctly as described in **'SAP HANA Configuration'** of the document [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf).

The configuration of the snapshot toolset is described in detail in **'Config file - HANABackupCustomerDetails.txt'** of  the document [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf).

#### Testing connectivity with SAP HANA

After you put all the configuration data into the *HANABackupCustomerDetails.txt* file, check whether the configurations are correct for the HANA instance data. Use the script `testHANAConnection`, which is independent of an SAP HANA scale-up or scale-out configuration.

For details see **'Check connectivity with SAP HANA - testHANAConnection'** of  the document [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf)

#### Testing storage connectivity

The next test step is to check the connectivity to the storage based on the data you put into the *HANABackupCustomerDetails.txt* configuration file, and then execute a test snapshot. Before you execute the `azure_hana_backup` command, you must run this test. The sequence of commands for this test is listed in **'Check connectivity with storage - testStorageSnapshotConnection'** of  the document [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf).

After a successful sign-in to the storage virtual machine interfaces, the script continues with phase 2 and creates a test snapshot. The output is shown here for a three-node scale-out configuration of SAP HANA:

If the test snapshot has been executed successfully with the script, you can proceed with scheduling the actual storage snapshots. If it is not successful, investigate the problems before moving forward. The test snapshot should stay around until the first real snapshots are done.


### Step 7: Perform snapshots

When the preparation steps are finished, you can start to configure and schedule the actual storage snapshots. The script to be scheduled works with SAP HANA scale-up and scale-out configurations. For periodic and regular execution of the backup script, schedule the script by using the cron utility. 

For the exact command syntax and functionality, read **'Perform snapshot backup - azure_hana_backup'** of the document [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf).  

The execution of the script `azure_hana_backup` creates the storage snapshot in the following three phases:

1. Executes an SAP HANA snapshot
1. Executes a storage snapshot
1. Removes the SAP HANA snapshot that was created before the execution of the storage snapshot

To execute the script, call it from the HDB executable folder to which it was copied. 

The retention period is administered with the number of snapshots that are submitted as a parameter when you execute the script. The amount of time that is covered by the storage snapshots is a function of the period of execution, and of the number of snapshots submitted as a parameter when executing the script. If the number of snapshots that are kept exceeds the number that are named as a parameter in the call of the script, the oldest storage snapshot of the same label is deleted before a new snapshot is executed. The number you give as the last parameter of the call is the number you can use to control the number of snapshots that are kept. With this number, you can also control, indirectly, the disk space used for snapshots. 


## Snapshot strategies
The frequency of snapshots for the different types depends on whether you use the HANA Large Instance disaster recovery functionality. This functionality relies on storage snapshots, which might require special recommendations for the frequency and execution periods of the storage snapshots. 

In the considerations and recommendations that follow, the assumption is that you do *not* use the disaster recovery functionality that HANA Large Instances offers. Instead, you use the storage snapshots to have backups and be able to provide point-in-time recovery for the last 30 days. Given the limitations of the number of snapshots and space, customers have considered the following requirements:

- The recovery time for point-in-time recovery.
- The space used.
- The recovery point and recovery time objectives for potential recovery from a disaster.
- The eventual execution of HANA full-database backups against disks. Whenever a full-database backup against disks or the **backint** interface is performed, the execution of the storage snapshots fails. If you plan to execute full-database backups on top of storage snapshots, make sure that the execution of the storage snapshots is disabled during this time.
- The number of snapshots per volume (limited to 250).

<!-- backint is term for a SAP HANA interface and not a spelling error not spelling errors -->

For customers who don't use the disaster recovery functionality of HANA Large Instances, the snapshot period is less frequent. In such cases, customers perform the combined snapshots on /hana/data and /hana/shared (includes /usr/sap) in 12-hour or 24-hour periods, and they keep the snapshots for a month. The same is true with the snapshots of the log backup volume. However, the execution of SAP HANA transaction log backups against the log backup volume occurs in five minute to 15 minute periods.

Scheduled storage snapshots are best performed by using cron. Use the same script for all backups and disaster recovery needs, and that you modify the script inputs to match the various requested backup times. These snapshots are all scheduled differently in cron depending on their execution time: hourly, 12-hour, daily, or weekly. 

The following is an example of a cron schedule in /etc/crontab:
```
00 1-23 * * * ./azure_hana_backup --type=hana --prefix=hourlyhana --frequency=15min --retention=46
10 00 * * *  ./azure_hana_backup --type=hana --prefix=dailyhana --frequency=15min --retention=28
00,05,10,15,20,25,30,35,40,45,50,55 * * * * ./azure_hana_backup --type=logs --prefix=regularlogback --frequency=3min --retention=28
22 12 * * *  ./azure_hana_backup --type=logs --prefix=dailylogback --frequncy=3min --retention=28
30 00 * * *  ./azure_hana_backup --type=boot --boottype=TypeI --prefix=dailyboot --frequncy=15min --retention=28
```
In the previous example, there is an hourly combined snapshot that covers the volumes that contain the /hana/data and /hana/shared/SID (includes /usr/sap) locations. Use this type of snapshot for a faster point-in-time recovery within the past two days. Additionally, there is a daily snapshot on those volumes. So, you have two days of coverage by hourly snapshots, plus four weeks of coverage by daily snapshots. Additionally, the transaction log backup volume is backed up daily. These backups are kept for four weeks as well. As you see in the third line of crontab, the backup of the HANA transaction log is scheduled to execute every 5 minutes. The start times of the different cron jobs that execute storage snapshots are staggered, so that those snapshots are not executed all at once at a certain point in time. 

In the following example, you perform a combined snapshot that covers the volumes that contain the /hana/data and /hana/shared/SID (including /usr/sap) locations on an hourly basis. You keep these snapshots for two days. The snapshots of the transaction log backup volumes are executed on a 5-minute basis and are kept for 4 hours. As before, the backup of the HANA transaction log file is scheduled to execute every 5 minutes. The snapshot of the transaction log backup volume is performed with a 2-minute delay after the transaction log backup has started. Within those 2 minutes, the SAP HANA transaction log backup should finish under normal circumstances. As before, the volume that contains the boot LUN is backed up once per day by a storage snapshot and is kept for four weeks.

```
10 0-23 * * * ./azure_hana_backup --type=hana ==prefix=hourlyhana --frequency=15min --retention=48
0,5,10,15,20,25,30,35,40,45,50,55 * * * * ./azure_hana_backup --type=logs --prefix=regularlogback --frequency=3min --retention=28
2,7,12,17,22,27,32,37,42,47,52,57 * * * *  ./azure_hana_backup --type=logs --prefix=logback --frequency=3min --retention=48
30 00 * * *  ./azure_hana_backup --type=boot --boottype=TypeII --prefix=dailyboot --frequency=15min --retention=28
```

The following graphic illustrates the sequences of the previous example, excluding the boot LUN:

![Relationship between backups and snapshots](./media/hana-overview-high-availability-disaster-recovery/backup_snapshot_updated0921.PNG)

SAP HANA performs regular writes against the /hana/log volume to document the committed changes to the database. On a regular basis, SAP HANA writes a savepoint to the /hana/data volume. As specified in crontab, an SAP HANA transaction log backup is executed every 5 minutes. You also see that an SAP HANA snapshot is executed every hour as a result of triggering a combined storage snapshot over the /hana/data and /hana/shared/SID volumes. After the HANA snapshot succeeds, the combined storage snapshot is executed. As instructed in crontab, the storage snapshot on the /hana/logbackup volume is executed every 5 minutes, around 2 minutes after the HANA transaction log backup.

> 

>[!IMPORTANT]
> The use of storage snapshots for SAP HANA backups is valuable only when the snapshots are performed in conjunction with SAP HANA transaction log backups. These transaction log backups need to cover the time periods between the storage snapshots. 

If you've set a commitment to users of a point-in-time recovery of 30 days, you need to:

- In extreme cases, access a combined storage snapshot over /hana/data and /hana/shared/SID that is 30 days old.
- Have contiguous transaction log backups that cover the time between any of the combined storage snapshots. So, the oldest snapshot of the transaction log backup volume needs to be 30 days old. This is not the case if you copy the transaction log backups to another NFS share that is located on Azure storage. In that case, you might pull old transaction log backups from that NFS share.

To benefit from storage snapshots and the eventual storage replication of transaction log backups, you need to change the location to which SAP HANA writes the transaction log backups. You can make this change in HANA Studio. Though SAP HANA backs up full log segments automatically, you should specify a log backup interval to be deterministic. This is especially true when you use the disaster recovery option, because you usually want to execute log backups with a deterministic period. In the following case, 15 minutes are set as the log backup interval.

![Schedule SAP HANA backup logs in SAP HANA Studio](./media/hana-overview-high-availability-disaster-recovery/image5-schedule-backup.png)

You can also choose backups that are more frequent than every 15 minutes. A more frequent setting is often used in conjunction with disaster recovery functionality of HANA Large Instances. Some customers perform transaction log backups every 5 minutes.  

If the database has never been backed up, the final step is to perform a file-based database backup to create a single backup entry that must exist within the backup catalog. Otherwise, SAP HANA cannot initiate your specified log backups.

![Make a file-based backup to create a single backup entry](./media/hana-overview-high-availability-disaster-recovery/image6-make-backup.png)


After your first successful storage snapshots have been executed, you need to delete the test snapshot that was executed in step 6. Read **'Remove test snapshots - removeTestStorageSnapshot'** in the document [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf) for details. 


### Monitoring the number and size of snapshots on the disk volume

On a specific storage volume, you can monitor the number of snapshots and the storage consumption of those snapshots. The `ls` command doesn't show the snapshot directory or files. However, the Linux OS command `du` shows details about those storage snapshots, because they are stored on the same volumes. The command can be used with the following options:

- `du –sh .snapshot`: This option provides a total of all the snapshots within the snapshot directory.
- `du –sh --max-depth=1`: This option lists all the snapshots that are saved in the **.snapshot** folder and the size of each snapshot.
- `du –hc`: This option provides the total size used by all the snapshots.

Use these commands to make sure that the snapshots that are taken and stored are not consuming all the storage on the volumes.

>[!NOTE]
>The snapshots of the boot LUN are not visible with the previous commands.

### Getting details of snapshots
To get more details on snapshots, you can also use the script `azure_hana_snapshot_details`. This script can be run in either location if there is an active server in the disaster recovery location. The script provides the following output, broken down by each volume that contains snapshots: 
   * The size of total snapshots in a volume
   * The following details in each snapshot in that volume: 
      - Snapshot name 
      - Create time 
      - Size of the snapshot
      - Frequency of the snapshot
      - HANA Backup ID associated with that snapshot, if relevant

For syntax of the command and outputs check **'List snapshots - azure_hana_snapshot_details'** in the document [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf). 



### Reducing the number of snapshots on a server

As explained earlier, you can reduce the number of certain labels of snapshots that you store. The last two parameters of the command to initiate a snapshot are the label and the number of snapshots you want to retain.

```
./azure_hana_backup --type=hana --prefix=dailyhana --frequency=15min --retention=28
```

In the previous example, the snapshot label is **dailyhana** and the number of snapshots with this label to be retained is **28**. As you respond to disk space consumption, you might want to reduce the number of stored snapshots. The easy way to reduce the number of snapshots to 15, for example, is to run the script with the last parameter set to **15**:

```
./azure_hana_backup --type=hana --prefix=dailyhana --frequency=15min --retention=15
```

If you run the script with this setting, the number of snapshots, including the new storage snapshot, is 15. The 15 most recent snapshots are kept, and the 15 older snapshots are deleted.

 >[!NOTE]
 > This script reduces the number of snapshots only if there are snapshots more than 1 hour old. The script does not delete snapshots that are less than 1 hour old. These restrictions are related to the optional disaster recovery functionality offered.

If you no longer want to maintain a set of snapshots with the backup prefix **dailyhana** in the syntax examples, you can execute the script with **0** as the retention number. All snapshots matching that label are then removed. However, removing all snapshots can affect the capabilities of HANA Large Instances disaster recovery functionality.

A second option to delete specific snapshots is to use the script `azure_hana_snapshot_delete`. This script is designed to delete a snapshot or set of snapshots either by using the HANA backup ID as found in HANA Studio, or through the snapshot name itself. Currently, the backup ID is only tied to the snapshots created for the **hana** snapshot type. Snapshot backups of the type **logs** and **boot** do not perform an SAP HANA snapshot and so there is no backup ID to be found for those snapshots. If the snapshot name is entered, it looks for all snapshots on the different volumes that match the entered snapshot name. 

<!-- hana, logs and boot are no spelling errors as Acrolinx indicates, but terms of parameter values -->

For details on the script refer to **'Delete a snapshot - azure_hana_snapshot_delete'** in the document [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/snapshot_tools_v4.0/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20v4.0.pdf).

Execute the script as user **root**.

>[!IMPORTANT]
>If there is data that only exists on the snapshot you are deleting, after the snapshot is deleted, that data is lost forever.

  
## File-level restore from a storage snapshot

<!-- hana, logs and boot are no spelling errors as Acrolinx indicates, but terms of parameter values -->
For the snapshot types **hana** and **logs**, you can access the snapshots directly on the volumes in the **.snapshot** directory. There is a subdirectory for each of the snapshots. You can copy each file in the state it was in at the point of the snapshot from that subdirectory into the actual directory structure. In the current version of the script,there is **NO** restore script provided for the snapshot restore as a self-service (though snapshot restore can be performed as part of the self-service DR scripts at the DR site during failover). You must contact the Microsoft operations team by opening a service request to restore a desired snapshot from the existing available snapshots.

>[!NOTE]
>Single file restore does not work for snapshots of the boot LUN independent of the type of the HANA Large Instance units. The **.snapshot** directory is not exposed in the boot LUN. 
 

## Recover to the most recent HANA snapshot

In a production-down scenario, the process of recovering from a storage snapshot can be initiated as a customer incident with Microsoft Azure Support. It is a high-urgency matter if data was deleted in a production system, and the only way to retrieve it is to restore the production database.

In a different situation, a point-in-time recovery might be low urgency and planned days in advance. You can plan this recovery with SAP HANA on Azure instead of raising a high-priority flag. For example, you might be planning to upgrade the SAP software by applying a new enhancement package. You then need to revert to a snapshot that represents the state before the enhancement package upgrade.

Before you send the request, you need to prepare. The SAP HANA on Azure team can then handle the request and provide the restored volumes. Afterward, you restore the HANA database based on the snapshots.

The possibilities to get a snapshot restored with the new tool set are documented in section **'How to restore a snapshot'** of the document [Manual Recovery Guide For SAP HANA on Azure from Storage Snapshot](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/guides/Manual%20recovery%20of%20snapshot%20with%20HANA%20Studio.pdf).

The following shows you how to prepare for the request:

1. Decide which snapshot to restore. Only the hana/data volume is restored unless you instruct otherwise. 

1. Shut down the HANA instance.

   ![Shut down the HANA instance](./media/hana-overview-high-availability-disaster-recovery/image7-shutdown-hana.png)

1. Unmount the data volumes on each HANA database node. If the data volumes are still mounted to the operating system, the restoration of the snapshot fails.
   ![Unmount the data volumes on each HANA database node](./media/hana-overview-high-availability-disaster-recovery/image8-unmount-data-volumes.png)

1. Open an Azure support request and include instructions about the restoration of a specific snapshot.

   - During the restoration: SAP HANA on Azure might ask you to attend a conference call to ensure coordination, verification, and confirmation that the correct storage snapshot is restored. 

   - After the restoration: SAP HANA on Azure Service notifies you when the storage snapshot has been restored.

1. After the restoration process is complete, remount all the data volumes.

   ![Remount all the data volumes](./media/hana-overview-high-availability-disaster-recovery/image9-remount-data-volumes.png)



Another possibility for getting, for example, SAP HANA data files recovered from a storage snapshot is documented in step 7 of the document [Manual Recovery Guide For SAP HANA on Azure from Storage Snapshot](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/guides/Manual%20recovery%20of%20snapshot%20with%20HANA%20Studio.pdf).

The document [Manual Recovery Guide For SAP HANA on Azure from Storage Snapshot](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/guides/Manual%20recovery%20of%20snapshot%20with%20HANA%20Studio.pdf) illustrates the restore sequence from snapshot backup. Use that documentation for the execution of a restore. 

>[!Note]
>Step 7 is not necessary to execute if you got your snapshot restored by Microsoft operations.


### Recover to another point in time
The document [Manual Recovery Guide For SAP HANA on Azure from Storage Snapshot](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/guides/Manual%20recovery%20of%20snapshot%20with%20HANA%20Studio.pdf) illustrates the restore sequence to a certain point in time in the section **'Recover the database to the following point in time'**. Use that documentation for the execution of a restore to a certain point in time. 


## Next steps
- See [Disaster Recovery principles and preparation](hana-concept-preparation.md).
