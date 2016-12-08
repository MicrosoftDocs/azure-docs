---
title: Configure StorSimple with Veritas NetBackup | Microsoft Docs
description: Describes the StorSimple Backup Target configuration with Veritas NetBackup.
services: storsimple
documentationcenter: ''
author: hkanna
manager: matd
editor: ''

ms.assetid:
ms.service: storsimple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/2/2016
ms.author: hkanna
---

# Configure StorSimple with Veritas NetBackup&#8482;

## Overview

Microsoft Azure StorSimple is a hybrid cloud storage solution that addresses the complexities of exponential data growth by using an Azure storage account as an extension of the on-premises solution and automatically tiering data across on-premises storage and cloud storage.

This article discusses StorSimple integration with Veritas NetBackup and the best practices for integrating both the solutions. We also present recommendations on how to configure Veritas NetBackup to best integrate with StorSimple. We defer to Veritas best practices, backup architects, and administrators on how to best configure Veritas NetBackup to meet your backup requirements and SLAs.


This article illustrates configuration steps and key concepts but is by no means a step-by-step configuration or installation guide. The article assumes that the basic components and infrastructure are in working order and ready to support the concepts that we describe.

## Why StorSimple as a backup target?

StorSimple is a great backup target for the following reasons:

-   It provides standard local storage for backup applications to use without any changes to provide a fast backup destination. StorSimple is also available for quick restore of recent backups.

-   Its cloud tiering is seamlessly integrated with a cloud storage account to use cost-effective Microsoft Azure storage.

-   It automatically provides offsite storage for disaster recovery.


## Target audience

The audience for this paper includes backup administrators, storage administrators, and storage architects with knowledge of storage, Windows Server 2012 R2, Ethernet, cloud services, and NetBackup.

## Supported versions

-   NetBackup 7.7.x and above

-   [StorSimple Update 3 and above](storsimple-overview.md#storsimple-workload-summary).

## Key concepts

As with any other storage solution, a careful assessment of the solution’s storage performance, SLAs, rate of change, and capacity growth needs is critical to success. The main idea is that by introducing a cloud tier, your access times and throughputs to the cloud play a fundamental role in the ability of StorSimple to do its job.

StorSimple is designed to provide storage to applications that operate on a well-defined working set of data (hot data). In this model, the working set of data is stored on the local tiers, and the remaining non-working/cold/archived set of data is tiered to the cloud. This model is represented in the following figure. The nearly flat green line represents the data stored on the local tiers of the StorSimple device. The red line represents the total amount of data stored on the StorSimple solution across all the tiers. The space between the flat green line and the exponential red curve represents the total amount of data stored in the cloud.

**StorSimple tiering**
![Storsimple tiering diagram](./media/storsimple-configure-backup-target-using-netbackup/image1.jpg)


With this architecture in mind, you will find that StorSimple is ideally suited to operate as a backup target. StorSimple lets you:

-   Perform most frequent restores from the local working set of data.

-   Use the cloud for offsite disaster recovery and older data where restores are less frequent.

## StorSimple benefits

StorSimple provides an on-premises solution that is seamlessly integrated with Microsoft Azure, by taking advantage of seamless access to on-premises and cloud storage.

StorSimple uses automatic tiering between the on-premises device, which contains solid-state device (SSD) and serial-attached SCSI (SAS) storage, and Azure Storage. Automatic tiering keeps frequently accessed data local, on the SSD and SAS tiers, and it moves infrequently accessed data to Azure Storage.

StorSimple offers the following benefits:

-   Unique deduplication and compression algorithms that use the cloud to achieve unprecedented deduplication levels

-   High availability

-   Geo-replication by leveraging Azure geo-replication

-   Azure integration

-   Data encryption in the cloud

-   Improved disaster recovery and compliance

Although StorSimple presents two main deployment scenarios (primary and secondary backup target), keep in mind that it is fundamentally a plain block storage device. StorSimple does all the compression and deduplication, and it sends and retrieves data from the cloud seamlessly to both the application and the file system.

For more information about StorSimple, see [StorSimple 8000 series: hybrid cloud storage solution](storsimple-overview.md) and review the [technical StorSimple 8000 series specifications](storsimple-technical-specifications-and-compliance.md).

> [!IMPORTANT]
> StorSimple device as backup target is only supported with StorSimple 8000 Update 3 or later.

## Architecture overview

The following tables contain the appliance model-to-architecture initial guidance.

#### StorSimple capacities for local and cloud storage


| Storage capacity       | 8100          | 8600            |
|------------------------|---------------|-----------------|
| Local storage capacity | &lt; 10 TiB\*  | &lt; 20 TiB\*  |
| Cloud storage capacity | &gt; 200 TiB\* | &gt; 500 TiB\* |

\* Storage size assumes no deduplication or compression.

#### StorSimple capacities for primary and secondary backups


| Backup scenario  | Local storage capacity                                         | Cloud storage capacity                      |
|------------------|----------------------------------------------------------------|---------------------------------------------|
| Primary backup   | Recent backups stored on local storage for fast recovery (RPO) | Backup history (RPO) fits in cloud capacity |
| Secondary backup | Secondary copy of backup data can be stored in cloud capacity  |

## StorSimple as a primary backup target

In this scenario, the StorSimple volumes are presented to the backup application as the sole repository for backups. The following figure illustrates the solution architecture where all the backups use StorSimple tiered volumes for both backups and restores.

![StorSimple as a primary backup target logical diagram](./media/storsimple-configure-backup-target-using-netbackup/primarybackuptargetlogicaldiagram.png)

### Primary target backup logical steps

1.  Backup server contacts the target backup agent and backup agent transmits data to backup server.

2.  Backup server writes data to StorSimple tiered volumes.

3.  Backup server updates catalog database and completes the backup job.

4.  Snapshot script triggers the StorSimple cloud snapshot management (start-delete).

5.  Based on a retention policy, the backup server deletes the expired backups.

###  Primary target restore logical steps

1.  Backup server starts restoring the appropriate data from the storage repository.

2.  Backup agent receives the data from Backup server.

3.  Backup server completes the restore job.

## StorSimple as a secondary backup target

In this scenario, the StorSimple volumes are primarily used for mostly long-term retention or archiving.

The following figure illustrates the architecture where the initial backups and restores target a high-performance volume. These backups are copied and archived to a StorSimple tiered volume at a given schedule.

It is important to size your high-performance volume with ample space and performance to handle the retention policy capacity and performance requirements.

![StorSimple as a secondary backup target logical diagram](./media/storsimple-configure-backup-target-using-netbackup/secondarybackuptargetlogicaldiagram.png)

### Secondary target backup logical steps

1.  Backup server contacts the target backup agent and backup agent transmits data to backup server.

2.  Backup server writes data to high-performance storage.

3.  Backup server updates catalog database and completes the backup job.

4.  Based on a retention policy the backup server copies backups to StorSimple.

5.  Snapshot script triggers StorSimple cloud snapshot management (start-delete).

6.  Based on a retention policy, the backup server deletes the expired backups.

### Secondary target restore logical steps

1.  Backup server starts restoring the appropriate data from the storage repository.

2.  Backup agent receives the data from backup server.

3.  Backup server completes the restore job.

## Deploy the solution

The deployment of this solution consists of three steps: preparing the network infrastructure, deploying your StorSimple device as a backup target, and finally deploying the Veritas NetBackup. Each of these steps is discussed in detail in the following sections.

### Configure the network

StorSimple as an integrated solution with the Azure cloud requires an active and working connection to the Azure cloud. This connection is used for operations such as cloud snapshots, management, metadata transfer, and to tier older, less accessed data to the Azure cloud storage.

For the solution to perform optimally, we recommend that you adhere to the following networking best practices:

-   The link that connects the StorSimple tiering to Azure must meet your bandwidth requirements by applying the proper the Quality of Service (QoS) to your infrastructure switches to match your RPO/RTO SLAs.

-   The maximum Azure Blob Storage access latencies should be in the 80 ms range.

### Deploy StorSimple

For a step-by-step StorSimple deployment guidance, go to [Deploy your on-premises StorSimple device](storsimple-deployment-walkthrough-u2.md).

### Deploy NetBackup

A step by step NetBackup 7.7.x deployment guidance can be found at [NetBackup 7.7.x Documentation](https://www.veritas.com/support/article.000094423)

## Configure the solution

In this section, we demonstrate some configuration examples. The following examples/recommendations illustrate the most basic and fundamental implementation. This implementation may not apply directly to your specific backup requirements.

### Configure StorSimple

| StorSimple deployment tasks                                                                                                                 | Additional comments                                                                                                                                                                                                                                                                                      |
|---------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Deploy   your on-premises StorSimple device                                                                                                 | Supported version: Update 3 and   above.                                                                                                                                                                                                                                                                 |
| Enable backup target mode                                                                                                                   | Use  the following commands to enable/disable and get status. For more information, go to [connect remotely to a StorSimple](storsimple-remote-connect.md).</br> Enable backup mode:`Set-HCSBackupApplianceMode -enable`</br>  Disable backup mode:`Set-HCSBackupApplianceMode -disable`</br> Current state of backup mode settings`Get-HCSBackupApplianceMode` |
| Create a common volume container for your volume that stores the backup data.   All data in a volume container is de-duplicated. | StorSimple volume containers define deduplication domains.                                                                                                                                                                                                                                             |
| Creating StorSimple volumes                                                                                                                 | Create volumes with sizes as close to the anticipated usage as possible as volume size affects cloud snapshot duration time. For more information on how to size a volume, go to [Retention policies](#retention-policies).</br> </br> Use StorSimple tiered volumes and check **Use this volume for less frequently accessed archival data**. </br> Locally pinned volumes only are not supported.|
| Create a unique StorSimple backup policy for all the backup target volumes.                                                               | A StorSimple backup policy defines the volume consistency group.                                                                                                                                                                                                                                       |
| Disable the schedule as the snapshots.                                                                                                    | Snapshots are triggered as a post-processing operation.                                                                                                                                                                                                                                                         |
|                                                                                                     |                                             |



### Configure host backup server storage

Ensure that the host backup server storage is configured as per the following guidelines.  

- Spanned volumes (created by Windows Disk manager) are not supported.
- Format your volumes using NTFS with 64 KB allocation size.
- Map the StorSimple volumes directly to the “Veeam” server.
    - Use iSCSI in case of physical servers.
    - Use pass-through disks for virtual servers.



## Best practices for StorSimple and NetBackup

Configure your solution as per the following guidelines.

### Operating system

-   Disable Windows Server encryption and deduplication for the NTFS file system.

-   Disable Windows Server defragmentation on the StorSimple volumes.

-   Disable Windows Server indexing on the StorSimple volumes.

-   Perform an antivirus scan at the source host (not against the StorSimple volumes).

-   Disable the default [Windows Server maintenance](https://msdn.microsoft.com/library/windows/desktop/hh848037.aspx) in task manager.

    - Disable Maintenance configurator in Windows Task Scheduler.

        Or

    - Download: [PSEXEC – Microsoft Sysinternals](https://technet.microsoft.com/sysinternals/bb897553.aspx)

      - After downloading PSEXEC, run Windows PowerShell as an administrator, and type:

            `psexec \\%computername% -s schtasks /change /tn “MicrosoftWindowsTaskSchedulerMaintenance Configurator" /disable`

### StorSimple

-   Ensure the StorSimple device is updated to [Update 3 or later](storsimple-install-update-3.md).

-   Isolate iSCSI and cloud traffic. Use dedicated iSCSI connections for traffic between StorSimple and backup server.

-   Ensure StorSimple device is a dedicated backup target. Mixed workloads are not supported as these impact your RTO/RPO.

### NetBackup

-   NetBackup database should be local to the server and not reside on a StorSimple Volume.

-   For DR, back up NetBackup database on a StorSimple Volume.

-   We support NetBackup full and incremental backups for this solution. We recommend that you do not use synthetic and differential backups.

-   Backup data files should only contain data for a specific job. For example, no media appends across different jobs are allowed.

Refer to NetBackup’s documentation for the latest NetBackup settings and best practices on how to implement these requirements by visiting [www.veritas.com](https://www.veritas.com).


## Retention policies

One of the most used backup retention policies is the Grandfather, Father, and Son (GFS). In this policy, an incremental backup is performed daily. The full backups are done weekly and monthly. This policy results in 6 StorSimple tiered volumes.

-   One volume contains the weekly, monthly, and yearly full backups.

-   The other 5 volumes store daily incremental backups.

In the following example, we are a GFS rotation. The example assumes the following:

-   Non-deduped or compressed data is used.

-   Full backups are 1 TiB each.

-   Daily incremental backups are 500 GiB each.

-   4 weekly backups kept for a month.

-   12 monthly backups kept for a year.

-   1 yearly backup kept for 10 years.

Based on the preceeding assumptions, create a 26 TiB StorSimple tiered volume for the monthly and yearly full backups. Create a 5 TiB StorSimple tiered volume for each of the incremental daily backups.

| Backup type retention | Size TiB | GFS multiplier\*                                       | Total capacity TiB          |
|-----------------------|----------|--------------------------------------------------------|-----------------------------|
| Weekly full           | 1        | 4                                                      | 4                           |
| Daily incremental     | 0.5      | 20 (cycles equal number of weeks per month) | 12 (2 for additional quota) |
| Monthly full          | 1        | 12                                                     | 12                          |
| Yearly full           | 1        | 10                                                     | 10                          |
| GFS requirement       |          |                                                        | 38                          |
| Additional quota      | 4        |                                                        | 42 total GFS requirement   |

\*The GFS multiplier is the number of copies you need to protect and keep to meet your backup policies.

## Configure NetBackup storage


1.  In NetBackup management console, select Devices\> start the Disk Pool Configuration Wizard\> select\> AdvancedDisk\>click Next

    ![NetBackup management console Disk pool configuration](./media/storsimple-configure-backup-target-using-netbackup/nbimage1.png)

1.  Then Select your Server

    ![NetBackup management console, select server](./media/storsimple-configure-backup-target-using-netbackup/nbimage2.png)

1.  Then Next and Select your StorSimple Volume

    ![NetBackup management console, select the storsimple disk](./media/storsimple-configure-backup-target-using-netbackup/nbimage3.png)

1.  Then give it a name and click next and next to finish

    ![NetBackup management console Name and description screen](./media/storsimple-configure-backup-target-using-netbackup/nbimage4.png)

    After reviewing the settings click Finish.

    1.  At the end of each assignment change the storage device settings to match
        those recommended in the best practices list.

    2.  Repeat steps 1-4 until you are finished assigning your StorSimple Volumes.

    ![NetBackup management console Disk configuration](./media/storsimple-configure-backup-target-using-netbackup/nbimage5.png)

## StorSimple as a primary backup target

> [!NOTE]
> Be aware that if you need to restore data from a backup that has been tiered to the cloud, the restore occurs at cloud speeds.

In the following figure, we illustrate mapping of a typical volume to a backup job. In this case, all the weekly backups map to Saturday Full disk, and the incremental backups map to Monday-Friday Incremental disks. All the backups and restores happen from a StorSimple tiered volume.

![Primary backup target configuration logical diagram ](./media/storsimple-configure-backup-target-using-netbackup/primarybackuptargetdiagram.png)

#### StorSimple as a primary backup target Grandfather, Father, and Son (GFS) schedule example

| GFS Rotation Schedule for 4 weeks, Monthly and Yearly |               |             |
|--------------------------------------------------------------------------|---------------|-------------|
| Frequency/Backup Type   | Full          | Incremental (Day 1 - 5)  |
| Weekly (week 1 - 4)    | Saturday | Monday - Friday |
| Monthly     | Saturday  |             |
| Yearly      | Saturday  |             |


### Assigning StorSimple volumes to a NetBackup backup job

The following sequence assumes that NetBackup, the target host are configured in accordance with the NetBackup agent guidelines.

1.  In the NetBackup management console select a Policy\> right-click\>New Policy

    ![NetBackup management console screen](./media/storsimple-configure-backup-target-using-netbackup/nbimage6.png)

1.  Select a policy name and Use the policy wizard

    ![NetBackup management console, new policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage7.png)

1.  Select the appropriate backup type, in our case File Systems and then Next

    ![NetBackup management console, new policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage8.png)

1.  Then select standard

    ![NetBackup management console, new policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage9.png)

1.  Select your host, check detect client operating system and add

    ![NetBackup management console, new policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage10.png)

1.  Then Next

2.  Then select the drive(s) you need to backup, in our case G:\\DataChange3\\

    ![NetBackup management console, new policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage11.png)

1.  Select the rotation that meets your requirements

    ![NetBackup management console, new policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage12.png)

1.  Then Next and Next and finish. We will modify the schedule after the policy is created.

2.  Expand the policy you created and select schedules.

    ![NetBackup management console, new policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage13.png)

1.  Right-click differential-inc and select copy to new, in our case Mon-inc,
    and click ok

    ![NetBackup management console, new policy schedule](./media/storsimple-configure-backup-target-using-netbackup/nbimage14.png)

1.  Then right-click the newly created schedule and select change.

2.  In the Attributes tab check Override policy storage selection and select the
    volume where Monday incremental backups go. In our case SS1

    ![NetBackup management console, change schedule](./media/storsimple-configure-backup-target-using-netbackup/nbimage15.png)

1.  In the Start Window select the window for your backups. In our case Mondays
    from 8pm till 9pm

    ![NetBackup management console, change schedule](./media/storsimple-configure-backup-target-using-netbackup/nbimage16.png)

1.  Select OK

2.  Repeat steps 11-15 for each of incremental backups and select the
    appropriate volume and schedule.

3.  Then right-click on the Differential-inc schedule and delete it.

4.  After deleting the Differential-inc schedule, modify your Full schedule to
    meet your needs.

    ![NetBackup management console, change schedule](./media/storsimple-configure-backup-target-using-netbackup/nbimage17.png)

1.  Change the startup window in our case Saturday 6am

    ![NetBackup management console, change schedule](./media/storsimple-configure-backup-target-using-netbackup/nbimage18.png)

1.  The final schedule should look like this

    ![NetBackup management console, change schedule](./media/storsimple-configure-backup-target-using-netbackup/nbimage19.png)

## StorSimple as a secondary backup target

> [!NOTE]
> Be aware that if you need to restore data from a backup that has been tiered to the cloud, the restore occurs at cloud speeds.

In this model, you must have a storage media (other than StorSimple) to serve as a temporary cache. For example, you could use a RAID volume to accommodate space, IOs, and bandwidth. We recommend using RAID 5, 50 and 10.

In the following figure, we illustrate typical short retention local (to the server) volumes and long-term retention archive volumes. In this case, all the backups run on the local (to the server) RAID volume. These backups are periodically duplicated and archived to an archive volume. It is important to size your local (to the server) RAID volume to handle the short-term retention capacity and performance requirements.

#### StorSimple as a secondary backup target GFS example

![Storsimple as secondary backup target logical diagram ](./media/storsimple-configure-backup-target-using-netbackup/secondarybackuptargetdiagram.png)

The following table illustrates how the backups should be configured to run on the local and StorSimple disks including the individual and the total capacity requirements.

#### Backup configuration and capacity requirements

| Backup type and retention                    |Configured storage| Size (TiB) | GFS multiplier | Total Capacity (TiB)        |
|----------------------------------------------|-----|----------|----------------|------------------------|
| Week 1 (Full and incremental) |Local disk (short term)| 1        | 1              | 1           |
| StorSimple Week 2-4           |StorSimple disk (long term) | 1        | 4              | 4                   |
| Monthly Full                                 |StorSimple disk (long term) | 1        | 12             | 12                   |
| Yearly Full                               |StorSimple disk (long term) | 1        | 1              | 1                   |
|GFS Volumes Size Requirement | |          |                | 18*|

\* the total capacity includes 17 TiB of StorSimple disks and 1 TiB of local RAID volume


#### GFS example schedule

|GFS rotation Weekly, Monthly, and Yearly schedule|                    |                   |                   |                   |                   |                   |
|--------------------------------------------------------------------------|--------------------|-------------------|-------------------|-------------------|-------------------|-------------------|
| Week                                                                     | Full               | Incremental Day 1        | Incremental Day 2        | Incremental Day 3        | Incremental Day 4        | Incremental Day 5        |
| Week 1                                                                   | Local RAID Volume  | Local RAID Volume | Local RAID Volume | Local RAID Volume | Local RAID Volume | Local RAID Volume |
| Week 2                                                                   | StorSimple Week 2-4 |                   |                   |                   |                   |                   |
| Week 3                                                                   | StorSimple Week 2-4 |                   |                   |                   |                   |                   |
| Week 4                                                                   | StorSimple Week 2-4 |                   |                   |                   |                   |                   |
| Monthly                                                                  | StorSimple Monthly |                   |                   |                   |                   |                   |
| Yearly                                                                   | StorSimple Yearly  |                   |                   |                   |                   |                   |


### Assign StorSimple volumes to NetBackup archive/duplication job.

Given the broad range option for storage and media management that NetBackup offers please consult with Veritas or your NetBackup Architect to properly assess the SLP requirements.

1.  Once the initial Disk pools have been defined, proceed to define 3 Storage Lifecycle Policies:

    1.  LocalRAIDVolume

    2.  StorSimpleWeek2-4

    3.  StorSimpleMonthlyFulls

    4.  StorSimpleYearlyFulls

    In the management console under Storage, select Storage Lifecycle Policies and select New Storage Lifecycle Policy

    [NetBackup management console, storage lifecycle policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage20.png)

1.  Select a name, and click Add

    ![NetBackup management console, storage lifecycle policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage21.png)

1.  In the properties tab select Backup, Destination Storage, the appropriate retention and OK. In our case LocalRAIDVolume and one week retention.

    ![NetBackup management console, storage lifecycle policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage22.png)

1.  This defined the first backup operation/repository

2.  While highlighting the previous operation, click Add, and select the Destination Storage, and proper retention. In our case from LocalRAIDVolume to StorSimpleWeek2-4, and a 1 month retention

    ![NetBackup management console, new storage lifecycle policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage23.png)

1.  While Highlighting the previous Operation select Add, now adding the monthly backups for a year

    ![NetBackup management console, change storage lifecycle policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage24.png)

1.  Repeat steps 5-6 until you have the appropriate SLP-retention policy.

    ![NetBackup management console, storage lifecycle policy](./media/storsimple-configure-backup-target-using-netbackup/nbimage25.png)

1.  Once you are done defining the appropriate SLP-Retention Policy, under Policy define a backup policy as illustrated on StorSimple as a Primary Target section.

1.  Under the Schedules select the Full and right-click, and select Change.

    ![NetBackup management console, change schedule](./media/storsimple-configure-backup-target-using-netbackup/nbimage26.png)

1.  The select Overwrite policy storage selection, and select the SLP you created on steps 1-8

    ![NetBackup management console, change schedule](./media/storsimple-configure-backup-target-using-netbackup/nbimage27.png)

1.  Click OK, then repeat for the Incremental backup schedule.

    ![NetBackup management console, change schedule](./media/storsimple-configure-backup-target-using-netbackup/nbimage28.png)

1.  Click OK, then repeat for the Incremental backup schedule.

| Backup Type retention | Size TiB | GFS multiplier\*                                       | Total Capacity TiB          |
|-----------------------|----------|--------------------------------------------------------|-----------------------------|
| Weekly Full           | 1        | 4                                                      | 4                           |
| Daily incremental     | 0.5      | 20 “cycles are equal to the number of weeks per month” | 12 (2 for additional quota) |
| Monthly Full          | 1        | 12                                                     | 12                          |
| Yearly Full           | 1        | 10                                                     | 10                          |
| GFS Requirement       |          |                                                        | 38                          |
| Additional Quota      | 4        |                                                        | 42 total GFS requirement.   |
\*The GFS multiplier is the number of copies you need to protect and keep to meet your backup policies.

### StorSimple cloud snapshots

StorSimple cloud snapshots protect the data that resides in StorSimple device. This is equivalent to shipping tapes to an offsite facility and if using Azure geo-redundant storage (GRS), as shipping tapes to multiple sites. If a device restore was needed in a disaster, you could bring another StorSimple device online and do a failover. Following the failover, you would be able to access the data (at cloud speeds) from the most recent cloud snapshot.

The following section illustrates how to create a short script to trigger and delete StorSimple cloud snapshots during backup post-processing.

> [!NOTE]
> Snapshots that are manually or programmatically created do not follow the StorSimple snapshot expiration policy. These must be manually or programmatically deleted.

### Start-Delete cloud snapshots with a script

> [!NOTE]
> Carefully assess the compliance and data retention repercussions before you delete a StorSimple snapshot. For more information on how to run a post-backup script, refer to [NetBackup documentation](https://www.veritas.com/support/article.000094423).

#### Backup lifecycle

![Backup Lifecycle diagram](./media/storsimple-configure-backup-target-using-netbackup/backuplifecycle.png)

#### Requirements:

-   The server that runs the script must have access to Azure cloud.

-   The user account must have the necessary permissions.

-   A StorSimple Backup Policy with the associated StorSimple Volumes configured but not enabled.

-   StorSimple Resource Name, Registration Key, Device Name, and Backup policy ID.

#### Steps:

1.  [Install Azure PowerShell](/powershell-install-configure/).

2.  [Download and import publish Settings and subscription information.](https://msdn.microsoft.com/library/dn385850.aspx)

3.  In the Azure classic portal, get the resource name and [registration key for your StorSimple Manager service](storsimple-deployment-walkthrough-u2.md#step-2-get-the-service-registration-key).

4.  On the server that runs the script, run Windows PowerShell as Administrator. Type:

    -   `Get-AzureStorSimpleDeviceBackupPolicy –DeviceName <device name>`

    Make a note of the Backup Policy ID.

5.  In Notepad, create a new Windows PowerShell Script and save it in the same location where you saved the Azure publish settings. For example, `C:\CloudSnapshot\StorSimpleCloudSnapshot.ps1`.

    Copy and paste the following code snippet:
      ```
      Import-AzurePublishSettingsFile "c:\\CloudSnapshot Snapshot\\myAzureSettings.publishsettings"
      Disable-AzureDataCollection
      $ApplianceName = <myStorSimpleApplianceName>
      $RetentionInDays = 20
      $RetentionInDays = -$RetentionInDays
      $Today = Get-Date
      $ExpirationDate = $Today.AddDays($RetentionInDays)
      Select-AzureStorSimpleResource -ResourceName "myResource" –RegistrationKey
      Start-AzureStorSimpleDeviceBackupJob –DeviceName $ApplianceName -BackupType CloudSnapshot -BackupPolicyId <BackupId> -Verbose
      $CompletedSnapshots =@()
      $CompletedSnapshots = Get-AzureStorSimpleDeviceBackup -DeviceName $ApplianceName
      Write-Host "The Expiration date is " $ExpirationDate
      Write-Host

      ForEach ($SnapShot in $CompletedSnapshots)
      {
          $SnapshotStartTimeStamp = $Snapshot.CreatedOn
          if ($SnapshotStartTimeStamp -lt $ExpirationDate)

          {
              $SnapShotInstanceID = $SnapShot.InstanceId
              Write-Host "This snpashotdate was created on " $SnapshotStartTimeStamp.Date.ToShortDateString()
              Write-Host "Instance ID " $SnapShotInstanceID
              Write-Host "This snpashotdate is older and needs to be deleted"
              Write-host "\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#"
              Remove-AzureStorSimpleDeviceBackup -DeviceName $ApplianceName -BackupId $SnapShotInstanceID -Force -Verbose
          }
      }

      ```
6.  Add the script to your backup job in NetBackup, by editing your NetBackup job options pre-post commands

> [!NOTE]
> We recommend that you run your StorSimple cloud snapshot backup policy at the end of your daily backup’s job as post process script. For more information on how to backup and restore your backup application environment to meet your RPO/RTO please consult with your backup architect.

## StorSimple as a restore source


Restores from a StorSimple work similar to restores from any block storage device. When restoring data that is tiered to the cloud, restores occur at cloud speeds. For local date, restores occur at local disk speed of the device. For information on how to perform a restore, refer to [NetBackup documentation](https://www.veritas.com/support/article.000094423) and conform to NetBackup restore best practices.

## StorSimple failover and disaster recovery

> [!NOTE]
> For backup target scenarios, StorSimple Cloud Appliance is not supported as a restore target.

A disaster could occur due to various factors. The following table lists common disaster recovery (DR) scenarios.

| Scenario                                                                    | Impact                                             | How to recover                                                                                                                                                                               | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|-----------------------------------------------------------------------------|----------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| StorSimple appliance failure                                                | Backup and restore operations will be interrupted. | Replace the failed appliance and perform [StorSimple failover and disaster recovery](storsimple-device-failover-disaster-recovery.md) | If there’s a need to perform a restore after appliance recovery the full data working sets are being retrieved from the cloud to the new appliance, which will result in all operations to be at cloud speed rate. This indexing and cataloging rescanning process could cause all backup sets to be scanned and pulled from cloud tier to local appliance tier which might be a time-consuming process.                                                 |
| NetBackup Server Failure                                              | Backup and restore operations are interrupted. | Rebuild the backup server and perform Database restore                                                                                                                                       | The NetBackup server will need to be rebuilt or restored at the DR site. The database needs to be restored to the most recent point. If the restored NetBackup database is not in sync with your latest backup jobs, indexing and cataloging is required. This index and catalog rescanning process could cause all backup sets to be scanned and pulled from cloud tier to local device tier. This makes it further time-sensitive. |
| Site failure that results in the loss of both Backup server and StorSimple. | Backup and restore operations are interrupted. | Restore StorSimple first and then NetBackup.                                                                                                                                          | Restore StorSimple first and then NetBackup.                                                                 If there is a need to perform a restore after device recovery, the full data working sets are retrieved from the cloud to the new device. As a result, all operations are at cloud speed rate.|

## References

The following documents have been referenced in this article:

- [StorSimple MPIO setup](storsimple-configure-mpio-windows-server.md)

- [Storage scenarios: Thin provisioning](http://msdn.microsoft.com/library/windows/hardware/dn265487.aspx)

- [Using GPT drives](http://msdn.microsoft.com/windows/hardware/gg463524.aspx#EHD)

- [Enable and configure shadow copies for shared folders](http://technet.microsoft.com/library/cc771893.aspx)
