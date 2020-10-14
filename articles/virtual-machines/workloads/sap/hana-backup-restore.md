---
title: HANA backup and restore on SAP HANA on Azure (Large Instances) | Microsoft Docs
description: How to perform HANA backup and restore on SAP HANA on Azure (Large Instances)
services: virtual-machines-linux
documentationcenter:
author: saghorpa
manager: gwallace
editor:

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/30/2019
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# Backup and restore on SAP HANA on Azure

>[!IMPORTANT]
>This article isn't a replacement for the SAP HANA administration documentation or SAP Notes. We expect that you have a solid understanding of and expertise in SAP HANA administration and operations, especially for backup, restore, high availability, and disaster recovery. In this article, screenshots from SAP HANA Studio are shown. Content, structure, and the nature of the screens of SAP administration tools and the tools themselves might change from SAP HANA release to release.

It's important that you exercise steps and processes taken in your environment and with your HANA versions and releases. Some processes described in this article are simplified for a better general understanding. They aren't meant to be used as detailed steps for eventual operation handbooks. If you want to create operation handbooks for your configurations, test and exercise your processes and document the processes related to your specific configurations. 

One of the most important aspects of operating databases is to protect them from catastrophic events. The cause of these events can be anything from natural disasters to simple user errors.

Backing up a database, with the ability to restore it to any point in time, such as before someone deleted critical data, enables restoration to a state that's as close as possible to the way it was prior to the disruption.

Two types of backups must be performed to achieve the capability to restore:

- Database backups: Full, incremental, or differential backups
- Transaction log backups

In addition to full-database backups performed at an application level, you can perform backups with storage snapshots. Storage snapshots don't replace transaction log backups. Transaction log backups remain important to restore the database to a certain point in time or to empty the logs from already committed transactions. Storage snapshots can accelerate recovery by quickly providing a roll-forward image of the database. 

SAP HANA on Azure (Large Instances) offers two backup and restore options:

- **Do it yourself (DIY).** After you make sure that there's enough disk space, perform full database and log backups by using one of the following disk backup methods. You can back up either directly to volumes attached to the HANA Large Instance units or to NFS shares that are set up in an Azure virtual machine (VM). In the latter case, customers set up a Linux VM in Azure, attach Azure Storage to the VM, and share the storage through a configured NFS server in that VM. If you perform the backup against volumes that directly attach to HANA Large Instance units, copy the backups to an Azure storage account. Do this after you set up an Azure VM that exports NFS shares that are based on Azure Storage. You can also use either an Azure Backup vault or Azure cold storage. 

   Another option is to use a third-party data protection tool to store the backups after they're copied to an Azure storage account. The DIY backup option also might be necessary for data that you need to store for longer periods of time for compliance and auditing purposes. In all cases, the backups are copied into NFS shares represented through a VM and Azure Storage.

- **Infrastructure backup and restore functionality.** You also can use the backup and restore functionality that the underlying infrastructure of SAP HANA on Azure (Large Instances) provides. This option fulfills the need for backups and fast restores. The rest of this section addresses the backup and restore functionality that's offered with HANA Large Instances. This section also covers the relationship that backup and restore have to the disaster recovery functionality offered by HANA Large Instances.

> [!NOTE]
>   The snapshot technology that's used by the underlying infrastructure of HANA Large Instances has a dependency on SAP HANA snapshots. At this point, SAP HANA snapshots don't work in conjunction with multiple tenants of SAP HANA multitenant database containers. If only one tenant is deployed, SAP HANA snapshots do work and you can use this method.

## Use storage snapshots of SAP HANA on Azure (Large Instances)

The storage infrastructure underlying SAP HANA on Azure (Large Instances) supports storage snapshots of volumes. Both backup and restoration of volumes is supported, with the following considerations:

- Instead of full database backups, storage volume snapshots are taken on a frequent basis.
- When a snapshot is triggered over /hana/data and /hana/shared, which includes /usr/sap, volumes, the snapshot technology initiates an SAP HANA snapshot before it runs the storage snapshot. This SAP HANA snapshot is the setup point for eventual log restorations after recovery of the storage snapshot. For an HANA snapshot to be successful, you need an active HANA instance. In an HSR scenario, a storage snapshot isn't supported on a current secondary node where an HANA snapshot can’t be performed.
- After the storage snapshot runs successfully, the SAP HANA snapshot is deleted.
- Transaction log backups are taken frequently and stored in the /hana/logbackups volume or in Azure. You can trigger the /hana/logbackups volume that contains the transaction log backups to take a snapshot separately. In that case, you don't need to run an HANA snapshot.
- If you must restore a database to a certain point in time, for a production outage, request that Microsoft Azure Support or SAP HANA on Azure restore to a certain storage snapshot. An example is a planned restoration of a sandbox system to its original state.
- The SAP HANA snapshot that's included in the storage snapshot is an offset point for applying transaction log backups that ran and were stored after the storage snapshot was taken.
- These transaction log backups are taken to restore the database back to a certain point in time.

You can perform storage snapshots that target three classes of volumes:

- A combined snapshot over /hana/data and /hana/shared, which includes /usr/sap. This snapshot requires the creation of an SAP HANA snapshot as preparation for the storage snapshot. The SAP HANA snapshot ensures that the database is in a consistent state from a storage point of view. For the restore process, that's a point to set up on.
- A separate snapshot over /hana/logbackups.
- An operating system partition.

To get the latest snapshot scripts and documentation, see [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md). When you download the snapshot script package from [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/release.md), you get three files. One of the files is documented in a PDF for the functionality provided. After you download the tool set, follow the instructions in "Get the snapshot tools."

## Storage snapshot considerations

>[!NOTE]
>Storage snapshots consume storage space that's allocated to the HANA Large Instance units. Consider the following aspects of scheduling storage snapshots and how many storage snapshots to keep. 

The specific mechanics of storage snapshots for SAP HANA on Azure (Large Instances) include:

- A specific storage snapshot at the point in time when it's taken consumes little storage.
- As data content changes and the content in SAP HANA data files change on the storage volume, the snapshot needs to store the original block content and the data changes.
- As a result, the storage snapshot increases in size. The longer the snapshot exists, the larger the storage snapshot becomes.
- The more changes that are made to the SAP HANA database volume over the lifetime of a storage snapshot, the larger the space consumption of the storage snapshot.

SAP HANA on Azure (Large Instances) comes with fixed volume sizes for the SAP HANA data and log volumes. Performing snapshots of those volumes eats into your volume space. You need to:

- Determine when to schedule storage snapshots.
- Monitor the space consumption of the storage volumes. 
- Manage the number of snapshots that you store. 

You can disable the storage snapshots when you either import masses of data or perform other significant changes to the HANA database. 


The following sections provide information for performing these snapshots and include general recommendations:

- Although the hardware can sustain 255 snapshots per volume, you want to stay well below this number. The recommendation is 250 or less.
- Before you perform storage snapshots, monitor and keep track of free space.
- Lower the number of storage snapshots based on free space. You can lower the number of snapshots that you keep, or you can extend the volumes. You can order additional storage in 1-terabyte units.
- During activities such as moving data into SAP HANA with SAP platform migration tools (R3load) or restoring SAP HANA databases from backups, disable storage snapshots on the /hana/data volume. 
- During larger reorganizations of SAP HANA tables, avoid storage snapshots if possible.
- Storage snapshots are a prerequisite to taking advantage of the disaster recovery capabilities of SAP HANA on Azure (Large Instances).

## Prerequisites for using self-service storage snapshots

To make sure that the snapshot script runs successfully, make sure that Perl is installed on the Linux operating system on the HANA Large Instances server. Perl comes preinstalled on your HANA Large Instance unit. To check the Perl version, use the following command:

`perl -v`

![The public key is copied by running this command](./media/hana-overview-high-availability-disaster-recovery/perl_screen.png)


## Set up storage snapshots

To set up storage snapshots with HANA Large Instances, follow these steps.
1. Make sure that Perl is installed on the Linux operating system on the HANA Large Instances server.
1. Modify the /etc/ssh/ssh\_config to add the line _MACs hmac-sha1_.
1. Create an SAP HANA backup user account on the master node for each SAP HANA instance you run, if applicable.
1. Install the SAP HANA HDB client on all the SAP HANA Large Instances servers.
1. On the first SAP HANA Large Instances server of each region, create a public key to access the underlying storage infrastructure that controls snapshot creation.
1. Copy the scripts and configuration file from [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/release.md) to the location of **hdbsql** in the SAP HANA installation.
1. Modify the *HANABackupDetails.txt* file as necessary for the appropriate customer specifications.

Get the latest snapshot scripts and documentation from [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/release.md). For the steps listed previously, see [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).

### Consideration for MCOD scenarios
If you run an [MCOD scenario](https://launchpad.support.sap.com/#/notes/1681092) with multiple SAP HANA instances on one HANA Large Instance unit, you have separate storage volumes provisioned for each of the SAP HANA instances. For more information on MDC and other considerations, see "Important things to remember" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).
 

### Step 1: Install the SAP HANA HDB client

The Linux operating system installed on SAP HANA on Azure (Large Instances) includes the folders and scripts necessary to run SAP HANA storage snapshots for backup and disaster recovery purposes. Check for more recent releases in [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/release.md). 

It's your responsibility to install the SAP HANA HDB client on the HANA Large Instance units while you install SAP HANA.

### Step 2: Change the /etc/ssh/ssh\_config

This step is described in "Enable communication with storage" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).


### Step 3: Create a public key

To enable access to the storage snapshot interfaces of your HANA Large Instance tenant, establish a sign-in procedure through a public key. 

On the first SAP HANA on Azure (Large Instances) server in your tenant, create a public key to access the storage infrastructure. With a public key, a password isn't required to sign in to the storage snapshot interfaces. You also don't need to maintain password credentials with a public key. 

To generate a public key, see "Enable communication with storage" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).


### Step 4: Create an SAP HANA user account

To start the creation of SAP HANA snapshots, create a user account in SAP HANA that the storage snapshot scripts can use. Create an SAP HANA user account within SAP HANA Studio for this purpose. The user must be created under the SYSTEMDB and *not* under the SID database for MDC. In the single container environment, the user is created in the tenant database. This account must have **Backup Admin** and **Catalog Read** privileges. 

To set up and use a user account, see "Enable communication with SAP HANA" in [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).


### Step 5: Authorize the SAP HANA user account

In this step, you authorize the SAP HANA user account that you created so that the scripts don't need to submit passwords at runtime. The SAP HANA command `hdbuserstore` enables the creation of an SAP HANA user key. The key is stored on one or more SAP HANA nodes. The user key lets the user access SAP HANA without having to manage passwords from within the scripting process. The scripting process is discussed later in this article.

>[!IMPORTANT]
>Run these configuration commands with the same user context that the snapshot commands are run in. Otherwise, the snapshot commands won't work properly.


### Step 6: Get the snapshot scripts, configure the snapshots, and test the configuration and connectivity

Download the most recent version of the scripts from [GitHub](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/release.md). 
The way the scripts are installed changed with release 4.1 of the scripts. For more information, see "Enable communication with SAP HANA" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).

For the exact sequence of commands, see "Easy installation of snapshot tools (default)" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md). We recommend the use of the default installation. 

To upgrade from version 3.x to 4.1, see "Upgrade an existing install" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md). To uninstall the 4.1 tool set, see "Uninstallation of the snapshot tools" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).

Don't forget to run the steps described in "Complete setup of snapshot tools" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).

The purpose of the different scripts and files as they got installed is described in "What are these snapshot tools?" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).

Before you configure the snapshot tools, make sure that you also configured HANA backup locations and settings correctly. For more information, see "SAP HANA Configuration" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).

The configuration of the snapshot tool set is described in "Config file - HANABackupCustomerDetails.txt" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).

#### Test connectivity with SAP HANA

After you put all the configuration data into the *HANABackupCustomerDetails.txt* file, check whether the configurations are correct for the HANA instance data. Use the script `testHANAConnection`, which is independent of an SAP HANA scale-up or scale-out configuration.

For more information, see "Check connectivity with SAP HANA - testHANAConnection" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).

#### Test storage connectivity

The next test step is to check the connectivity to the storage based on the data you put into the *HANABackupCustomerDetails.txt* configuration file. Then run a test snapshot. Before you run the `azure_hana_backup` command, you must run this test. For the sequence of commands for this test, see "Check connectivity with storage - testStorageSnapshotConnection"" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).

After a successful sign-in to the storage virtual machine interfaces, the script continues with phase 2 and creates a test snapshot. The output is shown here for a three-node scale-out configuration of SAP HANA.

If the test snapshot runs successfully with the script, you can schedule the actual storage snapshots. If it isn't successful, investigate the problems before you move forward. The test snapshot should stay around until the first real snapshots are done.


### Step 7: Perform snapshots

When the preparation steps are finished, you can start to configure and schedule the actual storage snapshots. The script to be scheduled works with SAP HANA scale-up and scale-out configurations. For periodic and regular execution of the backup script, schedule the script by using the cron utility. 

For the exact command syntax and functionality, see "Perform snapshot backup - azure_hana_backup" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md). 

When the script `azure_hana_backup` runs, it creates the storage snapshot in the following three phases:

1. It runs an SAP HANA snapshot.
1. It runs a storage snapshot.
1. It removes the SAP HANA snapshot that was created before the storage snapshot ran.

To run the script, call it from the HDB executable folder to which it was copied. 

The retention period is administered with the number of snapshots that are submitted as a parameter when you run the script. The amount of time that's covered by the storage snapshots is a function of the period of execution, and of the number of snapshots submitted as a parameter when the script runs. 

If the number of snapshots that are kept exceeds the number that are named as a parameter in the call of the script, the oldest storage snapshot of the same label is deleted before a new snapshot runs. The number you give as the last parameter of the call is the number you can use to control the number of snapshots that are kept. With this number, you also can control, indirectly, the disk space that's used for snapshots. 


## Snapshot strategies
The frequency of snapshots for the different types depends on whether you use the HANA Large Instance disaster recovery functionality. This functionality relies on storage snapshots, which might require special recommendations for the frequency and execution periods of the storage snapshots. 

In the considerations and recommendations that follow, the assumption is that you do *not* use the disaster recovery functionality that HANA Large Instances offers. Instead, you use the storage snapshots to have backups and be able to provide point-in-time recovery for the last 30 days. Given the limitations of the number of snapshots and space, consider the following requirements:

- The recovery time for point-in-time recovery.
- The space used.
- The recovery point and recovery time objectives for potential recovery from a disaster.
- The eventual execution of HANA full-database backups against disks. Whenever a full-database backup against disks or the **backint** interface is performed, the execution of the storage snapshots fails. If you plan to run full-database backups on top of storage snapshots, make sure that the execution of the storage snapshots is disabled during this time.
- The number of snapshots per volume, which is limited to 250.

<!-- backint is term for a SAP HANA interface and not a spelling error not spelling errors -->

If you don't use the disaster recovery functionality of HANA Large Instances, the snapshot period is less frequent. In such cases, perform the combined snapshots on /hana/data and /hana/shared, which includes /usr/sap, in 12-hour or 24-hour periods. Keep the snapshots for a month. The same is true for the snapshots of the log backup volume. The execution of SAP HANA transaction log backups against the log backup volume occurs in 5-minute to 15-minute periods.

Scheduled storage snapshots are best performed by using cron. Use the same script for all backups and disaster recovery needs. Modify the script inputs to match the various requested backup times. These snapshots are all scheduled differently in cron depending on their execution time. It can be hourly, every 12 hours, daily, or weekly. 

The following example shows a cron schedule in /etc/crontab:
```
00 1-23 * * * ./azure_hana_backup --type=hana --prefix=hourlyhana --frequency=15min --retention=46
10 00 * * *  ./azure_hana_backup --type=hana --prefix=dailyhana --frequency=15min --retention=28
00,05,10,15,20,25,30,35,40,45,50,55 * * * * ./azure_hana_backup --type=logs --prefix=regularlogback --frequency=3min --retention=28
22 12 * * *  ./azure_hana_backup --type=logs --prefix=dailylogback --frequncy=3min --retention=28
30 00 * * *  ./azure_hana_backup --type=boot --boottype=TypeI --prefix=dailyboot --frequncy=15min --retention=28
```
In the previous example, an hourly combined snapshot covers the volumes that contain the /hana/data and /hana/shared/SID, which includes /usr/sap, locations. Use this type of snapshot for a faster point-in-time recovery within the past two days. There's also a daily snapshot on those volumes. So, you have two days of coverage by hourly snapshots plus four weeks of coverage by daily snapshots. The transaction log backup volume also is backed up daily. These backups are kept for four weeks. 

As you see in the third line of crontab, the backup of the HANA transaction log is scheduled to run every 5 minutes. The start times of the different cron jobs that run storage snapshots are staggered. In this way, the snapshots don't run all at once at a certain point in time. 

In the following example, you perform a combined snapshot that covers the volumes that contain the /hana/data and /hana/shared/SID, which includes /usr/sap, locations on an hourly basis. You keep these snapshots for two days. The snapshots of the transaction log backup volumes run on a 5-minute basis and are kept for four hours. As before, the backup of the HANA transaction log file is scheduled to run every 5 minutes. 

The snapshot of the transaction log backup volume is performed with a 2-minute delay after the transaction log backup has started. Under normal circumstances, the SAP HANA transaction log backup finishes within those 2 minutes. As before, the volume that contains the boot LUN is backed up once per day by a storage snapshot and is kept for four weeks.

```
10 0-23 * * * ./azure_hana_backup --type=hana ==prefix=hourlyhana --frequency=15min --retention=48
0,5,10,15,20,25,30,35,40,45,50,55 * * * * ./azure_hana_backup --type=logs --prefix=regularlogback --frequency=3min --retention=28
2,7,12,17,22,27,32,37,42,47,52,57 * * * *  ./azure_hana_backup --type=logs --prefix=logback --frequency=3min --retention=48
30 00 * * *  ./azure_hana_backup --type=boot --boottype=TypeII --prefix=dailyboot --frequency=15min --retention=28
```

The following graphic illustrates the sequences of the previous example. The boot LUN is excluded.

![Relationship between backups and snapshots](./media/hana-overview-high-availability-disaster-recovery/backup_snapshot_updated0921.PNG)

SAP HANA performs regular writes against the /hana/log volume to document the committed changes to the database. On a regular basis, SAP HANA writes a savepoint to the /hana/data volume. As specified in crontab, an SAP HANA transaction log backup runs every 5 minutes. 

You also see that an SAP HANA snapshot runs every hour as a result of triggering a combined storage snapshot over the /hana/data and /hana/shared/SID volumes. After the HANA snapshot succeeds, the combined storage snapshot runs. As instructed in crontab, the storage snapshot on the /hana/logbackup volume runs every 5 minutes, around 2 minutes after the HANA transaction log backup.

> 

>[!IMPORTANT]
> The use of storage snapshots for SAP HANA backups is valuable only when the snapshots are performed in conjunction with SAP HANA transaction log backups. These transaction log backups need to cover the time periods between the storage snapshots. 

If you've set a commitment to users of a point-in-time recovery of 30 days, you need to:

- Access a combined storage snapshot over /hana/data and /hana/shared/SID that's 30 days old, in extreme cases. 
- Have contiguous transaction log backups that cover the time between any of the combined storage snapshots. So, the oldest snapshot of the transaction log backup volume needs to be 30 days old. This isn't the case if you copy the transaction log backups to another NFS share that's located on Azure Storage. In that case, you might pull old transaction log backups from that NFS share.

To benefit from storage snapshots and the eventual storage replication of transaction log backups, change the location to which SAP HANA writes the transaction log backups. You can make this change in HANA Studio. 

Although SAP HANA backs up full log segments automatically, specify a log backup interval to be deterministic. This is especially true when you use the disaster recovery option because you usually want to run log backups with a deterministic period. In the following case, 15 minutes is set as the log backup interval.

![Schedule SAP HANA backup logs in SAP HANA Studio](./media/hana-overview-high-availability-disaster-recovery/image5-schedule-backup.png)

You also can choose backups that are more frequent than every 15 minutes. A more frequent setting is often used in conjunction with disaster recovery functionality of HANA Large Instances. Some customers perform transaction log backups every 5 minutes.

If the database has never been backed up, the final step is to perform a file-based database backup to create a single backup entry that must exist within the backup catalog. Otherwise, SAP HANA can't initiate your specified log backups.

![Make a file-based backup to create a single backup entry](./media/hana-overview-high-availability-disaster-recovery/image6-make-backup.png)


After your first successful storage snapshots run, delete the test snapshot that ran in step 6. For more information, see "Remove test snapshots - removeTestStorageSnapshot" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md). 


### Monitor the number and size of snapshots on the disk volume

On a specific storage volume, you can monitor the number of snapshots and the storage consumption of those snapshots. The `ls` command doesn't show the snapshot directory or files. The Linux OS command `du` shows details about those storage snapshots because they're stored on the same volumes. Use the command with the following options:

- `du –sh .snapshot`: This option provides a total of all the snapshots within the snapshot directory.
- `du –sh --max-depth=1`: This option lists all the snapshots that are saved in the **.snapshot** folder and the size of each snapshot.
- `du –hc`: This option provides the total size used by all the snapshots.

Use these commands to make sure that the snapshots that are taken and stored don't consume all the storage on the volumes.

>[!NOTE]
>The snapshots of the boot LUN aren't visible with the previous commands.

### Get details of snapshots
To get more details on snapshots, use the script `azure_hana_snapshot_details`. You can run this script in either location if there's an active server in the disaster recovery location. The script provides the following output, broken down by each volume that contains snapshots: 
   * The size of total snapshots in a volume
   * The following details in each snapshot in that volume: 
      - Snapshot name 
      - Create time 
      - Size of the snapshot
      - Frequency of the snapshot
      - HANA Backup ID associated with that snapshot, if relevant

For syntax of the command and outputs, see "List snapshots - azure_hana_snapshot_details" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md). 



### Reduce the number of snapshots on a server

As previously explained, you can reduce the number of certain labels of snapshots that you store. The last two parameters of the command to initiate a snapshot are the label and the number of snapshots you want to retain.

```
./azure_hana_backup --type=hana --prefix=dailyhana --frequency=15min --retention=28
```

In the previous example, the snapshot label is **dailyhana**. The number of snapshots with this label to be kept is **28**. As you respond to disk space consumption, you might want to reduce the number of stored snapshots. An easy way to reduce the number of snapshots to 15, for example, is to run the script with the last parameter set to **15**:

```
./azure_hana_backup --type=hana --prefix=dailyhana --frequency=15min --retention=15
```

If you run the script with this setting, the number of snapshots, which includes the new storage snapshot, is 15. The 15 most recent snapshots are kept, and the 15 older snapshots are deleted.

 >[!NOTE]
 > This script reduces the number of snapshots only if there are snapshots more than one hour old. The script doesn't delete snapshots that are less than one hour old. These restrictions are related to the optional disaster recovery functionality offered.

If you no longer want to maintain a set of snapshots with the backup prefix **dailyhana** in the syntax examples, run the script with **0** as the retention number. All snapshots that match that label are then removed. Removing all snapshots can affect the capabilities of HANA Large Instances disaster recovery functionality.

A second option to delete specific snapshots is to use the script `azure_hana_snapshot_delete`. This script is designed to delete a snapshot or set of snapshots either by using the HANA backup ID as found in HANA Studio or through the snapshot name itself. Currently, the backup ID is only tied to the snapshots created for the **hana** snapshot type. Snapshot backups of the type **logs** and **boot** don't perform an SAP HANA snapshot, so there's no backup ID to be found for those snapshots. If the snapshot name is entered, it looks for all snapshots on the different volumes that match the entered snapshot name. 

<!-- hana, logs and boot are no spelling errors as Acrolinx indicates, but terms of parameter values -->

For more information on the script, see "Delete a snapshot - azure_hana_snapshot_delete" in [Microsoft snapshot tools for SAP HANA on Azure](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).

Run the script as user **root**.

>[!IMPORTANT]
>If there's data that exists only on the snapshot you plan to delete, after the snapshot is deleted, that data is lost forever.


## File-level restore from a storage snapshot

<!-- hana, logs and boot are no spelling errors as Acrolinx indicates, but terms of parameter values -->
For the snapshot types **hana** and **logs**, you can access the snapshots directly on the volumes in the **.snapshot** directory. There's a subdirectory for each of the snapshots. Copy each file in the state it was in at the point of the snapshot from that subdirectory into the actual directory structure. 

In the current version of the script, there's *no* restore script provided for the snapshot restore as self-service. Snapshot restore can be performed as part of the self-service disaster recovery scripts at the disaster recovery site during failover. To restore a desired snapshot from the existing available snapshots, you must contact the Microsoft operations team by opening a service request.

>[!NOTE]
>Single file restore doesn't work for snapshots of the boot LUN independent of the type of the HANA Large Instance units. The **.snapshot** directory isn't exposed in the boot LUN. 
 

## Recover to the most recent HANA snapshot

In a production-down scenario, the process of recovering from a storage snapshot can be started as a customer incident with Microsoft Azure Support. It's a high-urgency matter if data was deleted in a production system and the only way to retrieve it is to restore the production database.

In a different situation, a point-in-time recovery might be low urgency and planned days in advance. You can plan this recovery with SAP HANA on Azure instead of raising a high-priority flag. For example, you might plan to upgrade the SAP software by applying a new enhancement package. You then need to revert to a snapshot that represents the state before the enhancement package upgrade.

Before you send the request, you need to prepare. The SAP HANA on Azure team can then handle the request and provide the restored volumes. Afterward, you restore the HANA database based on the snapshots.

For the possibilities for getting a snapshot restored with the new tool set, see "How to restore a snapshot" in [Manual recovery guide for SAP HANA on Azure from a storage snapshot](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).

To prepare for the request, follow these steps.

1. Decide which snapshot to restore. Only the hana/data volume is restored unless you instruct otherwise. 

1. Shut down the HANA instance.

   ![Shut down the HANA instance](./media/hana-overview-high-availability-disaster-recovery/image7-shutdown-hana.png)

1. Unmount the data volumes on each HANA database node. If the data volumes are still mounted to the operating system, the restoration of the snapshot fails.

   ![Unmount the data volumes on each HANA database node](./media/hana-overview-high-availability-disaster-recovery/image8-unmount-data-volumes.png)

1. Open an Azure support request, and include instructions about the restoration of a specific snapshot:

   - During the restoration: SAP HANA on Azure Service might ask you to attend a conference call to coordinate, verify, and confirm that the correct storage snapshot is restored. 

   - After the restoration: SAP HANA on Azure Service notifies you when the storage snapshot is restored.

1. After the restoration process is complete, remount all the data volumes.

   ![Remount all the data volumes](./media/hana-overview-high-availability-disaster-recovery/image9-remount-data-volumes.png)



Another possibility for getting, for example, SAP HANA data files recovered from a storage snapshot, is documented in step 7 in [Manual recovery guide for SAP HANA on Azure from a storage snapshot](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md).

To restore from a snapshot backup, see [Manual recovery guide for SAP HANA on Azure from a storage snapshot](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md). 

>[!Note]
>If your snapshot was restored by Microsoft operations, you don't need to do step 7.


### Recover to another point in time
To restore to a certain point in time, see "Recover the database to the following point in time" in [Manual recovery guide for SAP HANA on Azure from a storage snapshot](https://github.com/Azure/hana-large-instances-self-service-scripts/blob/master/latest/Microsoft%20Snapshot%20Tools%20for%20SAP%20HANA%20on%20Azure%20Guide.md). 





## SnapCenter integration in SAP HANA large instances

This section describes how customers can use NetApp SnapCenter software to take a snapshot, backup and restore SAP HANA databases hosted on Microsoft Azure HANA Large Instances (HLI). 

SnapCenter offers solutions for scenarios including backup/recovery, disaster recovery (DR) with asynchronous storage replication, system replication, and system cloning. Integrated with SAP HANA Large Instances on Azure, customers can now use SnapCenter for backup and recovery operations.

For additional references, see NetApp TR-4614 and TR-4646 on SnapCenter.

- [SAP HANA Backup/Recovery with SnapCenter (TR-4614)](https://www.netapp.com/us/media/tr-4614.pdf)
- [SAP HANA Disaster Recovery with Storage Replication (TR-4646)](https://www.netapp.com/us/media/tr-4646.pdf)
- [SAP HANA HSR with SnapCenter (TR-4719)](https://www.netapp.com/us/media/tr-4719.pdf)
- [SAP Cloning from SnapCenter (TR-4667)](https://www.netapp.com/us/media/tr-4667.pdf)

### System Requirements and Prerequisites

To run SnapCenter on Azure HLI, system requirements include:
* SnapCenter Server on Azure Windows 2016 or newer with 4-vCPU, 16 GB RAM and a minimum of 650 GB managed premium SSD storage.
* SAP HANA Large Instances system with 1.5 TB – 24 TB RAM. It's recommended to use two SAP HANA Large Instance systems for cloning operations and tests.

The steps to integrate SnapCenter in SAP HANA are: 

1. Raise a support ticket request to communicate the user-generated public key to the Microsoft Ops team. This is required to setup the SnapCenter user to access the storage system.
1. Create a VM in your VNET that has access to HLI; this VM is used for SnapCenter. 
1. Download and install SnapCenter. 
1. Backup and recovery operations. 

### Create a support ticket for user-role storage setup

1. Open the Azure portal and navigate to the **Subscriptions** page. Once on the “Subscriptions” page, select your SAP HANA subscription, outlined in red below.

   :::image type="content" source="./media/snapcenter/create-support-case-for-user-role-storage-setup.png" alt-text="Create support case for user  storage setup":::

1. On your SAP HANA subscription page, select the **Resource Groups** subpage.

   :::image type="content" source="./media/snapcenter/solution-lab-subscription-resource-groups.png" alt-text="Solution lab subscription resource group" lightbox="./media/snapcenter/solution-lab-subscription-resource-groups.png":::

1. Select on an appropriate resource group in a region.

   :::image type="content" source="./media/snapcenter/select-appropriate-resource-group-in-region.png" alt-text="Select appropriate resource group in region" lightbox="./media/snapcenter/select-appropriate-resource-group-in-region.png":::

1. Select a SKU entry corresponding to SAP HANA on Azure storage.

   :::image type="content" source="./media/snapcenter/select-sku-entry-corresponding-to-sap-hana.png" alt-text="Select SKU entry corresponding to SAP HANA" lightbox="./media/snapcenter/select-sku-entry-corresponding-to-sap-hana.png":::

1. Open a **New support ticket** request, outlined in red.

   :::image type="content" source="./media/snapcenter/open-new-support-ticket-request.png" alt-text="Open new support ticket request":::

1. On the **Basics** tab, provide the following information for the ticket:

   * **Issue type:** Technical
   * **Subscription:** Your subscription
   * **Service:** SAP HANA Large Instance
   * **Resource:** Your resource group
   * **Summary:** Provide the user-generated public key
   * **Problem type:** Configuration and Setup
   * **Problem subtype:** Setup SnapCenter for HLI


1. In the **Description** of the support ticket, on the **Details** tab, provide: 
   
   * Set up SnapCenter for HLI
   * Your public key for snapcenter user (snapcenter.pem) - see the public key create example below

   :::image type="content" source="./media/snapcenter/new-support-request-details.png" alt-text="New support request - Details tab" lightbox="./media/snapcenter/new-support-request-details.png":::

1. Select **Review + create** to review your support ticket. 

1. Generate a certificate for the *snapcenter* user on the HANA Large Instance or any Linux server.

   SnapCenter requires a username and password to access the storage virtual machine (SVM) and to create snapshots of the HANA database. Microsoft uses the public key to allow you (the customer) to set the password for accessing the storage system.

   ```bash
   openssl req -x509 -nodes -days 1095 -newkey rsa:2048 -keyout snapcenter.key -out snapcenter.pem -subj "/C=US/ST=WA/L=BEL/O=NetApp/CN=snapcenter"
   Generating a 2048 bit RSA private key
   ................................................................................................................................................+++++
   ...............................+++++
   writing new private key to 'snapcenter.key'
   -----

   sollabsjct31:~ # ls -l cl25*
   -rw-r--r-- 1 root root 1704 Jul 22 09:59 snapcenter.key
   -rw-r--r-- 1 root root 1253 Jul 22 09:59 snapcenter.pem

   ```

1. Attach the snapcenter.pem file to the support ticket and then select **Create**

   Once the public key certificate is submitted, Microsoft sets up the *snapcenter* user  for your tenant along with SVM IP address.   

1. After you receive the SVM IP, set a password to access SVM, which you control.

   The following is an example of the REST CALL (documentation) from HANA Large Instance or VM in virtual network, which has access to HANA Large Instance environment and will be used to set the password.

   ```bash
   curl --cert snapcenter.pem --key snapcenter.key -X POST -k "https://10.0.40.11/api/security/authentication/password" -d '{"name":"snapcenter","password":"test1234"}'
   ```


### Download and install SnapCenter
Now that the user  is setup for SnapCenter access to the storage system, you'll use the *snapcenter* user to configure the SnapCenter once it's installed. 

Before installing SnapCenter, review [SAP HANA Backup/Recovery with SnapCenter](https://www.netapp.com/us/media/tr-4614.pdf) to define your backup strategy. 

1. Sign in to [NetApp](https://mysupport.netapp.com) to [download](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fmysupport.netapp.com%2Fsite%2Fproducts%2Fall%2Fdetails%2Fsnapcenter%2Fdownloads-tab&data=02%7C01%7Cmadhukan%40microsoft.com%7Ca53f5e2f245a4e36933008d816efbb54%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637284566603265503&sdata=TOANWNYoAr1q5z1opu70%2FUDPHjluvovqR9AKplYpcpk%3D&reserved=0) the latest version of SnapCenter.

1. Install SnapCenter on the Windows Azure VM.

   The installer checks the prerequisites of the VM. 

   >[!IMPORTANT]
   >Pay attention to the size of the VM, especially in larger environments.

1. Configure the user credentials for the SnapCenter. By default, it populates the Windows user credentials used for installing the application. 

   :::image type="content" source="media/snapcenter/installation-user-inputs-dialog.png" alt-text="Installation user inputs dialog"::: 

1. When you start the session, save the security exemption and the GUI starts up.

1. Sign into SnapCenter on the VM (https://snapcenter-vm:8146) using the Windows credentials to configure the environment.


### Set up the storage system

1. In SnapCenter, select **Storage System**, and then select **+New**. 

   :::image type="content" source="./media/snapcenter/snapcenter-storage-connections-window.png" alt-text="SnapCenter storage connections" lightbox="./media/snapcenter/snapcenter-storage-connections-window.png":::

   The default is one SVM per tenant. If a customer has multiple tenants or HLIs in multiple regions, the recommendation is to configure all SVMs in SnapCenter

1. In Add Storage System, provide the information for the Storage System that you want to add, the *snapcenter* username and password, and then select **Submit**.

   :::image type="content" source="./media/snapcenter/new-storage-connection.png" alt-text="New storage connection":::

   >[!NOTE]
   >The default is one SVM per tenant.  If there are multiple tenants, then the recommendation is to configure all SVMs here in SnapCenter. 

1. In SnapCenter, select **Hosts** and the select **+Add** to set up the HANA plug-in and the HANA DB hosts.  The latest version of SnapCenter detects the HANA database on the host automatically.

   :::image type="content" source="media/snapcenter/managed-hosts-new-host.png" alt-text="In SnapCenter, select Hosts and then select Add." lightbox="media/snapcenter/managed-hosts-new-host.png":::

1. Provide the information for the new host:
   1. Select the operating system for the host type.
   1. Enter the SnapCenter VM hostname.
   1. Provide the credentials you want to use.
   1. Select the **Microsoft Windows** and **SAP HANA** options and then select **Submit**.

   :::image type="content" source="media/snapcenter/add-new-host-operating-system-credentials.png" alt-text="Information for new host":::

   >[!IMPORTANT]
   >Before you can install the first node, SnapCenter allows a non-root user to install plug-ins on the database.  For information on how to enable a non-root user, see [Adding a non-root user and configuring sudo privileges](https://library.netapp.com/ecmdocs/ECMLP2590889/html/GUID-A3EEB5FC-242B-4C2C-B407-510E48A8F131.html).

1. Review the host details and select **Submit** to install the plug-in on the SnapCenter server.

1. After the plug-in is installed, in SnapCenter, select **Hosts** and then select **+Add** to add a HANA node.

   :::image type="content" source="media/snapcenter/add-hana-node.png" alt-text="Add a HANA node" lightbox="media/snapcenter/add-hana-node.png":::

1. Provide the information for the HANA node:
   1. Select the operating system for the host type.
   1. Enter the HANA DB hostname or IP address.
   1. Select **+** to add the credentials configured on the HANA DB host operating system and then select **OK**.
   1. Select **SAP HANA** and then select **Submit**.

   :::image type="content" source="media/snapcenter/add-hana-node-details.png" alt-text="SAP HANA node details":::

1. Confirm the fingerprint and select **Confirm and Submit**.

   :::image type="content" source="media/snapcenter/confirm-submit-fingerprint.png" alt-text="Confirm and submit fingerprint":::

1. On the HANA node, under the system database, select **Security** > **Users** > **SNAPCENTER** to create the SnapCenter user.

   :::image type="content" source="media/snapcenter/create-snapcenter-user-hana-system-db.png" alt-text="Create the SnapCenter user in HANA (system db)":::

1. After you receive the SVM IP, set a password to access SVM, which you control.

   The following is an example of the REST CALL (documentation) from HANA Large Instance or VM in virtual network, which has access to HANA Large Instance environment and will be used to set the password.

   ```bash
   curl --cert snapcenter.pem --key snapcenter.key -X POST -k "https://10.0.40.11/api/security/authentication/password" -d '{"name":"snapcenter","password":"test1234"}'
   ```

   Ensure that there is no proxy variable active on the HANA DB system.

   ```bash
   sollabsjct31:/tmp # unset http_proxy
   sollabsjct31:/tmp # unset https_proxy
   ```

### Auto discovery
SnapCenter 4.3 enables the auto discovery function by default.  Auto discovery is not supported for HANA instances with HANA System Replication (HSR) configured. You must manually add the instance to the SnapCenter server.


### HANA set up (Manual)
If you configured HSR, you must configure the system manually.  

1. In SnapCenter, select **Resources** and **SAN HANA** (at the top), and then select **+Add SAP HANA Database** (on the right).

   :::image type="content" source="media/snapcenter/manual-hana-setup.png" alt-text="Manual HANA set up" lightbox="media/snapcenter/manual-hana-setup.png":::

1. Specify the resource details of the HANA administrator user configured on the Linux host, or on the host where the plug-ins are installed. The backup will be managed from the plug-in on the Linux system.

   :::image type="content" source="media/snapcenter/provide-resource-details-sap-hana-database.png" alt-text="Specify the resource details of the HANA administrator user configured on the Linux host.":::

1. Select the data volume for which you need to take snapshots, select **Save** and then select **Finish**.

   :::image type="content" source="media/snapcenter/provide-storage-footprint.png" alt-text="Select the data volume for which you need to take snapshots, select Save and then select Finish.":::

### Create a snapshot policy

Before you use SnapCenter to back up SAP HANA database resources, you must create a backup policy for the resource or resource group that you want to back up. During the process of creating a snapshot policy, you'll be given the option to configure pre/post commands and special SSL keys. For information on how to create a snapshot policy, see [Creating backup policies for SAP HANA databases](http://docs.netapp.com/ocsc-43/index.jsp?topic=%2Fcom.netapp.doc.ocsc-dpg-sap-hana%2FGUID-246C0810-4F0B-4BF7-9A35-B729AD69954A.html).

1. In SnapCenter, select **Resources** and then select a database.

   :::image type="content" source="media/snapcenter/select-database-create-policy.png" alt-text="In SnapCenter, select Resources and then select a database.":::

1. Follow the workflow of the configuration wizard to configure the snapshot scheduler.

   :::image type="content" source="media/snapcenter/follow-worflow-configuration-wizard.png" alt-text="Follow the wokflow of the configuration wizard to configure the snapshot scheduler." lightbox="media/snapcenter/follow-worflow-configuration-wizard.png":::

1. Provide the options for configuring pre/post commands and special SSL keys.  In this example, we're using no special settings.

   :::image type="content" source="media/snapcenter/configuration-options-pre-post-commands.png" alt-text="Provide the options for configuring pre-post commands and special SSL keys." lightbox="media/snapcenter/configuration-options-pre-post-commands.png":::

1. Select **Add** to create a snapshot policy, which can also be used for other HANA databases. 

   :::image type="content" source="media/snapcenter/select-one-or-more-policies.png" alt-text="Select Add to create a snapshot policy, which can also be used for other HANA databases.":::

1. Enter the policy name and a description.

   :::image type="content" source="media/snapcenter/new-sap-hana-backup-policy.png" alt-text="Enter the policy name and a description.":::


1. Select the backup type and frequency.

   :::image type="content" source="media/snapcenter/new-sap-hana-backup-policy-settings.png" alt-text="Select the backup type and frequency.":::

1. Configure the **On demand backup retention settings**.  In our example, we're setting the retention to three snapshot copies to keep.

   :::image type="content" source="media/snapcenter/new-sap-hana-backup-policy-retention-settings.png" alt-text="Configure the On demand backup retention settings.":::

1. Configure the **Hourly retention settings**. 

   :::image type="content" source="media/snapcenter/new-sap-hana-backup-policy-hourly-retention-settings.png" alt-text="Configure the Hourly retention settings.":::

1. If a SnapMirror setup is configured, select **Update SnapMirror after creating a local SnapShot copy**.

   :::image type="content" source="media/snapcenter/new-sap-hana-backup-policy-snapmirror.png" alt-text="If a SnapMirror is required, select Update SnapMirror after creating a local Snapshot copy.":::

1. Select **Finish** to review the summary of the new backup policy. 
1. Under **Configure Schedule**, select **Add**.

   :::image type="content" source="media/snapcenter/configure-schedules-for-selected-policies.png" alt-text="Under Configure Schedule, select Add.":::

1. Select the **Start date**, **Expires on** date, and the frequency.

   :::image type="content" source="media/snapcenter/add-schedules-for-policy.png" alt-text="Select the Start date, Expires on date, and the frequency.":::

1. Provide the email details for notifications.

   :::image type="content" source="media/snapcenter/backup-policy-notification-settings.png" alt-text="Provide the email details for notifications.":::

1.  Select **Finish** to create the backup policy.

### Disable EMS message to NetApp Autosupport
By default, EMS data collection is enabled and runs every seven days after your installation date.  You can disable data collection with the PowerShell cmdlet `Disable-SmDataCollectionEms`.

1. In PowerShell, establish a session with SnapCenter.

   ```powershell
   Open-SmConnection
   ```

1. Sign in with your credentials.
1. Disable the collection of EMS messages.

   ```powershell
   Disable-SmCollectionEms
   ```

### Restore database after crash
You can use SnapCenter to restore the database.  In this section, we'll cover the high-level steps, but for more information, see [SAP HANA Backup/Recovery with SnapCenter](https://www.netapp.com/us/media/tr-4614.pdf).


1. Stop the database and delete all the database files.

   ```
   su - h31adm
   > sapcontrol -nr 00 -function StopSystem
   StopSystem
   OK
   > sapcontrol -nr 00 -function GetProcessList
   OK
   name, description, dispstatus, textstatus, starttime, elapsedtime, pid
   hdbdaemon, HDB Daemon, GRAY, Stopped, , , 35902
 
   ```

1. Unmount the database volume.

   ```bash
   unmount /hana/data/H31/mnt00001
   ```


1. Restore the database files via SnapCenter.  Select the database and then select **Restore**.  

   :::image type="content" source="media/snapcenter/restore-database-via-snapcenter.png" alt-text="Select a database and select Restore." lightbox="media/snapcenter/restore-database-via-snapcenter.png":::

1. Select the restore type.  In our example, we're restore the complete resource. 

   :::image type="content" source="media/snapcenter/restore-database-select-restore-type.png" alt-text="Select the restore type.":::

   >[!NOTE]
   >With a default setup, you don't need to specify commands to do a local restore from the on-disk snapshot. 

   >[!TIP]
   >If you want to restore a particular LUN inside the volume, select **File Level**.

1. Follow the workflow through the configuration wizard.
   
   SnapCenter restores the data to the original location so you can start the restore process in HANA. Also, since SnapCenter isn't able to modify the backup catalog (database is down), a warning is displayed.

   :::image type="content" source="media/snapcenter/restore-database-job-details-warning.png" alt-text="Since SnapCenter isn't able to modify the backup catelog, a warning is displayed. ":::

1. Since all the database files are restored, start the restore process in HANA. In HANA Studio, under **Systems**, right-click the system database and select **Backup and Recovery** > **Recover System Database**.

   :::image type="content" source="media/snapcenter/hana-studio-backup-recovery.png" alt-text="Start the restore process in HANA.":::

1. Select a recovery type.

   :::image type="content" source="media/snapcenter/restore-database-select-recovery-type.png" alt-text="Select the recovery type.":::

1. Select the location of the backup catalog.

   :::image type="content" source="media/snapcenter/restore-database-select-location-backup-catalog.png" alt-text="Select the location of the backup catalog.":::

1. Select a backup to recover the SAP HANA database.

   :::image type="content" source="media/snapcenter/restore-database-select-backup.png" alt-text="Select a backup to recover the SAP HANA database.":::

   Once the database is recovered, a message appears with a **Recovered to Time** and **Recovered to Log Position** stamp.

1. Under **Systems**, right-click the system database and select **Backup and Recovery** > **Recover Tenant Database**.
1. Follow the workflow of the wizard to complete the recovery of the tenant database. 

For more information on restoring a database, see [SAP HANA Backup/Recovery with SnapCenter](https://www.netapp.com/us/media/tr-4614.pdf).


### Non database backups
You can restore non-data volumes, for example, a network file share (/hana/shared) or an operating system backup.  For more information on restoring a non-data volumes, see [SAP HANA Backup/Recovery with SnapCenter](https://www.netapp.com/us/media/tr-4614.pdf).

### SAP HANA system cloning

Before you can clone, you must have the same HANA version installed as the source database. The SID and ID can be different. 

:::image type="content" source="media/snapcenter/system-cloning-diagram.png" alt-text="SAP HANA system cloning" lightbox="media/snapcenter/system-cloning-diagram.png" border="false":::

1. Create a HANA database user store for the H34 database from /usr/sap/H34/HDB40.

   ```
   hdbuserstore set H34KEY sollabsjct34:34013 system manager
   ```
 
1. Disable the firewall.

   ```bash
   systemctl disable SuSEfirewall2
   systemctl stop  SuSEfirewall2
   ```

1. Install the Java SDK.

   ```bash
   zypper in java-1_8_0-openjdk
   ```

1. In SnapCenter, add the destination host on which the clone will be mounted. For more information, see [Adding hosts and installing plug-in packages on remote hosts](http://docs.netapp.com/ocsc-43/index.jsp?topic=%2Fcom.netapp.doc.ocsc-dpg-sap-hana%2FGUID-246C0810-4F0B-4BF7-9A35-B729AD69954A.html).
   1. Provide the information for the Run As Credentials you want to add. 
   1. Select the host operating system and enter the host information.
   1. Under **Plug-ins to install**, select the version, enter the install path, and select **SAP HANA**.
   1. Select **Validate** to run the pre-install checks.

1. Stop HANA and unmount the old data volume.  You will mount the clone from SnapCenter.  

   ```bash
   sapcontrol -nr 40 -function StopSystem
   umount /hana/data/H34/mnt00001

   ```
 1. Create the configuration and shell script files for the target.
 
   ```bash
   mkdir /NetApp
   chmod 777 /NetApp
   cd NetApp
   chmod 777 sc-system-refresh-H34.cfg
   chmod 777 sc-system-refresh.sh

   ```

   >[!TIP]
   >You can copy the scripts from [SAP Cloning from SnapCenter](https://www.netapp.com/us/media/tr-4667.pdf).

1. Modify the configuration file. 

   ```bash
   vi sc-system-refresh-H34.cfg
   ```

   * HANA_ARCHITECTURE="MDC_single_tenant"
   * KEY="H34KEY"
   * TIME_OUT_START=18
   * TIME_OUT_STOP=18
   * INSTANCENO="40"
   * STORAGE="10.250.101.33"

1. Modify the shell script file.

   ```bash
   vi sc-system-refresh.sh
   ```  

   * VERBOSE=NO
   * MY_NAME="`basename $0`"
   * BASE_SCRIPT_DIR="`dirname $0`"
   * MOUNT_OPTIONS="rw,vers=4,hard,timeo=600,rsize=1048576,wsize=1048576,intr,noatime,nolock"

1. Start the clone from a backup process. Select the host to create the clone. 

   >[!NOTE]
   >For more information, see [Cloning from a backup](https://docs.netapp.com/ocsc-43/index.jsp?topic=%2Fcom.netapp.doc.ocsc-dpg-cpi%2FGUID-F6E7FF73-0183-4B9F-8156-8D7DA17A8555.html).

1. Under **Scripts**, provide the following:

   * **Mount command:** /NetApp/sc-system-refresh.sh mount H34 %hana_data_h31_mnt00001_t250_vol_Clone
   * **Post clone command:** /NetApp/sc-system-refresh.sh recover H34

1. Disable (lock) the automatic mount in the /etc/fstab since the data volume of the pre-installed database isn't necessary. 

   ```bash
   vi /etc/fstab
   ```

### Delete a clone

You can delete a clone if it is no longer necessary. For more information, see [Deleting clones](https://docs.netapp.com/ocsc-43/index.jsp?topic=%2Fcom.netapp.doc.ocsc-dpg-cpi%2FGUID-F6E7FF73-0183-4B9F-8156-8D7DA17A8555.html).

The commands used to execute before clone deletion, are:
* **Pre clone delete:** /NetApp/sc-system-refresh.sh shutdown H34
* **Unmount:** /NetApp/sc-system-refresh.sh umount H34

These commands allow SnapCenter to showdown the database, unmount the volume, and delete the fstab entry.  After that, the FlexClone is deleted. 

### Cloning database logfile

```   
20190502025323###sollabsjct34###sc-system-refresh.sh: Adding entry in /etc/fstab.
20190502025323###sollabsjct34###sc-system-refresh.sh: 10.250.101.31:/Sc21186309-ee57-41a3-8584-8210297f791d /hana/data/H34/mnt00001 nfs rw,vers=4,hard,timeo=600,rsize=1048576,wsize=1048576,intr,noatime,lock 0 0
20190502025323###sollabsjct34###sc-system-refresh.sh: Mounting data volume.
20190502025323###sollabsjct34###sc-system-refresh.sh: mount /hana/data/H34/mnt00001
20190502025323###sollabsjct34###sc-system-refresh.sh: Data volume mounted successfully.
20190502025323###sollabsjct34###sc-system-refresh.sh: chown -R h34adm:sapsys /hana/data/H34/mnt00001
20190502025333###sollabsjct34###sc-system-refresh.sh: Recover system database.
20190502025333###sollabsjct34###sc-system-refresh.sh: /usr/sap/H34/HDB40/exe/Python/bin/python /usr/sap/H34/HDB40/exe/python_support/recoverSys.py --command "RECOVER DATA USING SNAPSHOT CLEAR LOG"
[140278542735104, 0.005] >> starting recoverSys (at Thu May  2 02:53:33 2019)
[140278542735104, 0.005] args: ()
[140278542735104, 0.005] keys: {'command': 'RECOVER DATA USING SNAPSHOT CLEAR LOG'}
recoverSys started: ============2019-05-02 02:53:33 ============
testing master: sollabsjct34
sollabsjct34 is master
shutdown database, timeout is 120
stop system
stop system: sollabsjct34
stopping system: 2019-05-02 02:53:33
stopped system: 2019-05-02 02:53:33
creating file recoverInstance.sql
restart database
restart master nameserver: 2019-05-02 02:53:38
start system: sollabsjct34
2019-05-02T02:53:59-07:00  P010976      16a77f6c8a2 INFO    RECOVERY state of service: nameserver, sollabsjct34:34001, volume: 1, RecoveryPrepared
recoverSys finished successfully: 2019-05-02 02:54:00
[140278542735104, 26.490] 0
[140278542735104, 26.490] << ending recoverSys, rc = 0 (RC_TEST_OK), after 26.485 secs
20190502025400###sollabsjct34###sc-system-refresh.sh: Wait until SAP HANA database is started ....
20190502025400###sollabsjct34###sc-system-refresh.sh: Status:  YELLOW
20190502025410###sollabsjct34###sc-system-refresh.sh: Status:  YELLOW
20190502025420###sollabsjct34###sc-system-refresh.sh: Status:  YELLOW
20190502025430###sollabsjct34###sc-system-refresh.sh: Status:  YELLOW
20190502025440###sollabsjct34###sc-system-refresh.sh: Status:  YELLOW
20190502025451###sollabsjct34###sc-system-refresh.sh: Status:  GREEN
20190502025451###sollabsjct34###sc-system-refresh.sh: SAP HANA database is started.
20190502025451###sollabsjct34###sc-system-refresh.sh: Recover tenant database H34.
20190502025451###sollabsjct34###sc-system-refresh.sh: /usr/sap/H34/SYS/exe/hdb/hdbsql -U H34KEY RECOVER DATA FOR H34 USING SNAPSHOT CLEAR LOG
0 rows affected (overall time 69.584135 sec; server time 69.582835 sec)
20190502025600###sollabsjct34###sc-system-refresh.sh: Checking availability of Indexserver for tenant H34.
20190502025601###sollabsjct34###sc-system-refresh.sh: Recovery of tenant database H34 succesfully finished.
20190502025601###sollabsjct34###sc-system-refresh.sh: Status: GREEN
Deleting the DB Clone – Logfile
20190502030312###sollabsjct34###sc-system-refresh.sh: Stopping HANA database.
20190502030312###sollabsjct34###sc-system-refresh.sh: sapcontrol -nr 40 -function StopSystem HDB

02.05.2019 03:03:12
StopSystem
OK
20190502030312###sollabsjct34###sc-system-refresh.sh: Wait until SAP HANA database is stopped ....
20190502030312###sollabsjct34###sc-system-refresh.sh: Status:  GREEN
20190502030322###sollabsjct34###sc-system-refresh.sh: Status:  GREEN
20190502030332###sollabsjct34###sc-system-refresh.sh: Status:  GREEN
20190502030342###sollabsjct34###sc-system-refresh.sh: Status:  GRAY
20190502030342###sollabsjct34###sc-system-refresh.sh: SAP HANA database is stopped.
20190502030347###sollabsjct34###sc-system-refresh.sh: Unmounting data volume.
20190502030347###sollabsjct34###sc-system-refresh.sh: Junction path: Sc21186309-ee57-41a3-8584-8210297f791d
20190502030347###sollabsjct34###sc-system-refresh.sh: umount /hana/data/H34/mnt00001
20190502030347###sollabsjct34###sc-system-refresh.sh: Deleting /etc/fstab entry.
20190502030347###sollabsjct34###sc-system-refresh.sh: Data volume unmounted successfully.

```

### Uninstall SnapCenter plug-ins package for Linux

You can uninstall the Linux plug-ins package from the command line. Because the automatic deployment expects a fresh system, it's easy to uninstall the plug-in.  

>[!NOTE]
>You may need to uninstall an older version of the plug-in manually. 

Uninstall the plug-ins.

```bash
cd /opt/NetApp/snapcenter/spl/installation/plugins
./uninstall
```

You can now install the latest HANA plug-in on the new node by selecting **SUBMIT** in SnapCenter. 




## Next steps
- See [Disaster recovery principles and preparation](hana-concept-preparation.md).
