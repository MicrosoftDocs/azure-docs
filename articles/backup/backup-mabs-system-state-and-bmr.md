---
title: Azure Backup Server protects system state and restores to bare metal | Microsoft Docs
description: Use Azure Backup Server to back up your system state and provide bare metal recovery (BMR) protection.
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
keywords:  

ms.assetid:  
ms.service: backup
ms.workload: storage-backup-recovery
ms.targetplatform: na
ms.devlang: na
ms.topic: article
ms.date: 05/15/2017
ms.author: markgal,masaran
---

# Back up system state and restore to bare metal with Azure Backup Server

Azure Backup Server backs up system state and provides bare metal recovery (BMR) protection.

-   **System state backup**:  Backs up operating system files, enabling you to recover when a machine starts but you've lost system files and registry. A system state backup includes:

    -   Domain member: Boot files, COM+ class registration database, registry

    -   Domain controller: Active Directory (NTDS), boot files, COM+ class registration database, registry, system volume (SYSVOL)

    -   Machine running cluster services: Additionally backs up cluster server metadata

    -   Machine running certificate services: Additionally backs up certificate data

-   **Bare metal backup**: Backs up operating system files and all data except user data on critical volumes. By definition a BMR backup includes a system state backup. Provides protection when a machine won't start and you have to recover everything.

This table summarizes what you can back up and recover. You can see detailed information about app versions that can be protected with system state and BMR in [What can Azure Backup Server back up?](backup-mabs-protection-matrix.md)

|Backup|Issue|Recover from Azure Backup Server backup|Recover from system state backup|BMR|
|----------|---------|---------------------------|------------------------------------|-------|
|**File data**<br /><br />Regular data backup<br /><br />BMR/system state backup|Lost file data|Y|N|N|
|**File data**<br /><br />Azure Backup Server backup of file data<br /><br />BMR/system state backup|Lost/damaged operating system|N|Y|Y|
|**File data**<br /><br />Azure Backup Server backup of file data<br /><br />BMR/system state backup|Lost server (data volumes intact|N|N|Y|
|**File data**<br /><br />Azure Backup Server backup of file data<br /><br />BMR/system state backup|Lost server (data volumes lost)|Y|No|Yes (BMR followed by regular recovery of backed up file data)|
|**SharePoint data**:<br /><br />Azure Backup Server backup of farm data<br /><br />BMR/system state backup|Lost site, lists, list items. documents|Y|N|N|
|**SharePoint data**:<br /><br />Azure Backup Server backup of farm data<br /><br />BMR/system state backup|Lost or damaged operating system|N|Y|Y|
|**SharePoint data**:<br /><br />Azure Backup Server backup of farm data<br /><br />BMR/system state backup|Disaster recovery|N|N|N|
|Hyper-V<br /><br />Azure Backup Server backup of Hyper-V host or guest<br /><br />BMR/system state backup of host|Lost VM|Y|N|N|
|Hyper-V<br /><br />Azure Backup Server backup of Hyper-V host or guest<br /><br />BMR/system state backup of host|Lost or damaged operating system|N|Y|Y|
|Hyper-V<br /><br />Azure Backup Server backup of Hyper-V host or guest<br /><br />BMR/system state backup of host|Lost Hyper-V host (VMs intact)|N|N|Y|
|Hyper-V<br /><br />Azure Backup Server backup of Hyper-V host or guest<br /><br />BMR/system state backup of host|Lost Hyper-V host (VMs lost)|N|N|Y<br /><br />BMR recovery followed by regular Azure Backup Server recovery|
|SQL Server/Exchange<br /><br />Azure Backup Server app backup<br /><br />BMR/system state backup|Lost app data|Y|N|N|
|SQL Server/Exchange<br /><br />Azure Backup Server app backup<br /><br />BMR/system state backup|Lost or damaged operating system|N|y|Y|
|SQL Server/Exchange<br /><br />Azure Backup Server app backup<br /><br />BMR/system state backup|Lost server (database/transaction logs intact)|N|N|Y|
|SQL Server/Exchange<br /><br />Azure Backup Server app backup<br /><br />BMR/system state backup|Lost server (database/transaction logs lost)|N|N|Y<br /><br />BMR recovery followed by regular Azure Backup Server recovery|

## How system state backup works

1.  When a system state back up runs Azure Backup Server communicates with WSB request a backup of the server's system state. By default Azure Backup Server and WSB will use the drive with the most available free space, and information about this drive is saved in the PSDataSourceConfig.XML file. This is the drive WSB will use to do backups to.

2.  You can customize the drive that Azure Backup Server uses for the system state backup. To do this on the protected server, go to C:\Program Files\Microsoft Data Protection Manager\MABS\Datasources. Open the PSDataSourceConfig.XML file for editing. Change the<FilesToProtect> value for the drive letter. Close and save the file. If there's a protection group protecting the system state of the computer run a consistency check. In case an alert is generated click Modify protection group link in the alert, and then step through the wizard. Then run another consistency check.

3.  Note that if the protection server is in a cluster it's possible that a cluster drive will be selected as the drive with the most free space. It's important to be aware of this because if that drive ownership has been switched to another node and a system state backup runs, the drive won't be available and the backup will fail. In this situation, you'll need to modify the PSDataSourceConfig.XML to point it to a local drive.

4.  WSB will then create a folder called WindowsImageBackup on the root of the. As it creates the backup, all of the data will be placed in this folder. When the backup completes the file will then be transferred over to the Azure Backup Server. Note that:

    -   This folder and its contents do not get cleaned up after the backup or transfer is done. The best way to think of this is that the space is being reserved for the next time a backup is done.

    -   The folder gets created every time a backup is done. The time/date stamp will reflect the time of your last system state backup..

## BMR backup

1.  For BMR (including a system state backup) the backup job is performed directly to a share on the Azure Backup Server and not to a folder on the protected server.

2.  Azure Backup Server calls WSB and shares out the replica volume for that BMR backup. In this case it doesn't tell WSB to use the drive with the most free space, but instead to use the share created for the job.

3.  When the backup finishes the file is transferred to the Azure Backup Server. Logs are stored in C:\Windows\Logs\WindowsServerBackup.

## Prerequisites and limitations

-   BMR isn't supported for computers running Windows Server 2003 or for computers running client operating systems.

-   You can't protect BMR and system state for the same computer in different protection groups.

-   An Azure Backup Server can't protect itself for BMR.

-   Short-term protection to tape (D2T) isn't supported for BMR. Long-term storage to tape (D2D2T) is supported.

-   Windows Server Backup must be installed on the protected computer for BMR.

-   For BMR protection (unlike system state protection) Azure Backup Server doesn't have any space requirements on the protected computer. WSB directly transfers the backups to the Azure Backup Server. Note that the job for this doesn't appear in the Azure Backup Server Jobs view.

-   Azure Backup Server reserves 30 GB of space on the replica volume for BMR. You can change this on the Disk Allocation page in the Modify Protection Group Wizard or using the Get-DatasourceDiskAllocation and Set-DatasourceDiskAllocation PowerShell cmdlets. On the recovery point volume, BMR protection requires about 6 GB for retention of five days.
    Note that you can't reduce the replica volume size to less than 15 GB.
    Azure Backup Server doesn't calculate the size of BMR data source, but assumes 30 GB for all servers. Admins should change the value as per the size of BMR backups expected on their environments. The size of a BMR backup can be roughly calculated sum of used space on all critical volumes: Critical volumes = Boot Volume + System Volume + Volume hosting system state data such as AD.
    Process
    System state backup

-   If you move from system state protection to BMR protection, BMR protection will require less space on the **recovery point volume.** However, the extra space on the volume is not reclaimed. You can shrink the volume size manually from the **Modify Disk Allocation** page of  the **Modify Protection Group Wizard** or using the Get-DatasourceDiskAllocation and Set-DatasourceDiskAllocation cmdlets.

    If you move from system state protection to BMR protection , BMR protection will require more space on the **replica volume**. The volume will be extended automatically. If you want to change the default space allocations you can use Modify-DiskAllocation.

-   If you move from BMR protection to system state protection you'll need more space on the recovery point volume.
    Azure Backup Server might try to automatically grow the volume. If there is insufficient space in the storage pool, an error will be issued.

    If you move from BMR protection to system state protection you'll need space on the protected computer because system state protection first writes the replica to the local computer and then transfers it to the Azure Backup Server.

## Before you start

1.  **Deploy Azure Backup Server**: Verify Azure Backup Server is deployed correctly. If you haven't see:

    -   System requirements for Azure Backup Server

    -   [Azure Backup Server protection matrix](backup-mabs-protection-matrix.md)

2.  **Set up storage**-You can store backed up data on disk, on tape, and in the cloud with Azure. Read more in [Prepare data storage](http://docs.microsoft.com/system-center/dpm/plan-long-and-short-term-data-storage.md).

3.  **Set up the protection agent**-You'll need to install the protection agent on the machine you want to back up. Read [Deploy the DPM protection agent](http://docs.microsoft.com/system-center/dpm/deploy-dpm-protection-agent.md)

## Back up system state and bare metal
Set up a protection group as described in [Deploy protection groups](http://docs.microsoft.com/system-center/dpm/create-dpm-protection-groups.md). Note that you can't protect BMR and system state for the same machine in different groups, and that when you select BMR system state is automatically enabled.


1.  Click **Protection** > **Actions** > **Create Protection Group** to open the **Create New Protection Group** wizard in the Azure Backup Server console.

2.  In **Select protection group** type click **Servers**.

3.  In **Select Group Members** expand the machine and select **BMR** or **system state**

    Remember that you can't protect BMR and system state for the same machine in different groups, and that when you select BMR system state is automatically enabled. Learn more in [Deploy protection groups](http://docs.microsoft.com/system-center/dpm/create-dpm-protection-groups.md).

4.  In **Select data protection method**  specify how you want to handle short and long-term backup. Short-term back up is always to disk first, with the option of backing up from the disk to the Azure cloud with Azure backup (for short or long-term). As an alternative to long-term backup to the cloud you can also configure long-term back up to a standalone tape device or tape library connected to the Azure Backup Server.

5.  In **Select short-term goals** specify how you want to back up to short-term storage on disk.   In Retention range you specify how long you want to keep the data on disk. In Synchronization frequency you specify how often you want to run an incremental backup to disk. If you don't want to set a back up interval you can check just before a recovery point so that Azure Backup Server will run an express full backup just before each recovery point is scheduled.

6.  If you want to store data on tape for long-term storage in **Specify long-term goals** indicate how long you want to keep tape data (1-99 years). In Frequency of backup specify how often backups to tape should run. The frequency is based on the retention range you've specified:

    -   When the retention range is 1-99 years, you can select backups to occur daily, weekly, bi-weekly, monthly, quarterly, half-yearly, or yearly.

    -   When the retention range is 1-11 months, you can select backups to occur daily, weekly, bi-weekly, or monthly.

    -   When the retention range is 1-4 weeks, you can select backups to occur daily or weekly.

    On the **Select Tape and Library Details** page specify the tape/library to use, and whether data should be compressed and encrypted.

7.  In the **Review disk allocation** page review the storage pool disk space allocated for the protection group.

    **Total Data size** is the size of the data you want to back up, and **Disk space to be provisioned on Azure Backup Server** is the space that Azure Backup Server recommends for the protection group. Azure Backup Server chooses the ideal backup volume, based on the settings. However, you can edit the backup volume choices in the **Disk allocation details**. For the workloads, select the preferred storage in the dropdown menu. Your edits change the values for **Total Storage** and **Free Storage** in the **Available Disk Storage** pane. Underprovisioned space is the amount of storage Azure Backup Server suggests you add to the volume, to continue with backups smoothly in the future.

8.  In **Choose replica creation method** select how you want to handle the initial full data replication.  If you select to replicate over the network we recommended you choose an off-peak time. For large amounts of data or less than optimal network conditions, consider replicating the data offline using removable media.

9. In **Choose consistency check options**, select how you want to automate consistency checks. You can enable a check to run only when replica data becomes inconsistent, or according to a schedule. If you don't want to configure automatic consistency checking, you can run a manual check at any time by right-clicking the protection group in the **Protection** area of the Azure Backup Server console, and selecting **Perform Consistency Check**.

10. If you've selected to back up to the cloud with Azure Backup, on the **Specify online protection data** page make sure the workloads you want to back up to Azure are selected.

11. In **Specify online backup schedule** specify how often incremental backups to Azure should occur. You can schedule backups to run every day/week/month/year and the time/date at which they should run. Backups can occur up to twice a day. Each time a back up runs a data recovery point is created in Azure from the copy of the backed up data stored on the Azure Backup Server disk.

12. In **Specify online retention policy** you can specify how the recovery points created from the daily/weekly/monthly/yearly backups are retained in Azure.

13. In **Choose online replication** specify how the initial full replication of data will occur. You can replicate over the network, or do an offline backup (offline seeding). Offline backup uses the Azure Import feature. [Read more](https://azure.microsoft.com/documentation/articles/backup-azure-backup-import-export/).

14. On the  **Summary** page review your settings. After you click **Create Group** initial replication of the data occurs. When it finishes the protection group status will show as **OK** on the **Status** page. Backup then takes place in line with the protection group settings.

## Recover system state or BMR
You can recover BMR or system state to a network location. If you've backed up BMR use the WIndows Recovery Environment (WinRE) to start up your system and connect it to the network. Then use Windows Server Backup to recover from the network location. If you've backed up system state just use Windows Server Backup to recover from the network location.

### Restore BMR
Run recovery on the Azure Backup Server:

1.  In the Recovery pane find the machine you want to recover > Bare Metal Recovery.

2.  Available recovery points are indicated in bold on the calendar. Select the date and time for the recovery point you want to use.

3.  In  **Select Recovery Type** select **Copy to a network folder.**

4.  In **Specify Destination** select where you want to copy the data to. Remember that the selected destination will need enough room. We recommend a new folder.

5.  In **Specify Recovery Options** select the security settings to apply and select whether you want to use SAN-based hardware snapshots for quicker recovery (only an option if you have a SAN with this functionality enabled and the ability to create and split a clone to make it writable. In addition the protected machine and Azure Backup Server server must be connected to the same network).

6.  Set up notification options and click **Recover** on the **Summary** page.

Set up the share location:

1.  In the restore location navigate to the folder that contains the backup.

2.  Share the folder above WindowsImageBackup so that the root of the shared folder is the WindowsImageBackup folder. If it isn't restore won't find the backup. To connect using WinRE you'll need a share that you can access in WinRE with the correct IP address and credentials.

Restore the system:

1.  Start the machine  for which you want to restore the image to using the Windows DVD to match the system you are restoring.

2.  On the first screen verify language/locale settings. .On the **Install** screen select **Repair your computer**.

3.  On the **System Recovery Options**  page select **Restore your computer using a system image that you created earlier**

4.  On the **Select a system image backup** page  select **Select a system image** > **Advanced** > **Search for a system image on the network**. Select **Yes** if a warning appears. Navigate to the share path, input the credentials, and select the recovery point.
     This scans for specific backups available in that recovery point. Select the recovery point.

5.  In **Choose how to restore the backup** select **Format and repartition disks**. In the next screen verify settings and click **Finish** to begin the restore. Restart as required.

### Restore system state
Run recovery on the Azure Backup Server:

1.  In the Recovery pane find the machine you want to recovery > Bare Metal Recovery.

2.  Available recovery points are indicated in bold on the calendar. Select the date and time for the recovery point you want to use.

3.  In  **Select Recovery Type** select **Copy to a network folder.**

4.  In **Specify Destination** select where you want to copy the data to. Remember that the selected destination will need enough room. We recommend a new folder.

5.  In **Specify Recovery Options** select the security settings to apply and select whether you want to use SAN-based hardware snapshots for quicker recovery (only an option if you have a SAN with this functionality enabled and the ability to create and split a clone to make it writable. In addition the protected machine and Azure Backup Server server must be connected to the same network).

6.  Set up notification options and click **Recover** on the **Summary** page.

Run Windows Server Backup

1.  Click **Actions** > **Recover** > **This Server** > **Next.**

2.  Click **Another Server** > **Specify Location Type** page > **Remote shared folder**. Provide the path to the folder that contains the recovery point.

3.  In **Select Recovery Type** click **System state**. In **Select Location for System State Recovery**  click  **Original Location**

4.  In **Confirmation** click **Recover**. You'll need to restart the server after the restore.

5.  You can run the system state restore from the command line. To do this start Windows Server Backup on the machine you want to recover. From a command prompt type:
  ```wbadmin get versions -backuptarget <servername\sharename>```
  to get the version identifier.

    Use the version identifier to start system state restore. At the command line type: ```wbadmin start systemstaterecovery -version:<versionidentified> -backuptarget:<servername\sharename>```

    Confirm that you want to start the recovery. You can see the process in the command window. A restore log is created. You'll need restart the server after the restore.
