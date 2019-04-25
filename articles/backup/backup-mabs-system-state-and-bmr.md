---
title: Azure Backup Server protects system state and restores to bare metal
description: Use Azure Backup Server to back up your system state and provide bare metal recovery (BMR) protection.
services: backup
author: rayne-wiselman
manager: carmonm
keywords: 
ms.service: backup
ms.topic: conceptual
ms.date: 05/15/2017
ms.author: raynew
---

# Back up system state and restore to bare metal with Azure Backup Server

Azure Backup Server backs up system state and provides bare-metal recovery (BMR) protection.

*   **System state backup**: Backs up operating system files, so you can recover when a computer starts, but system files and the registry are lost. A system state backup includes:
    * Domain member: Boot files, COM+ class registration database, registry
    * Domain controller: Windows Server Active Directory (NTDS), boot files, COM+ class registration database, registry, system volume (SYSVOL)
    * Computer that runs cluster services: Cluster server metadata
    * Computer that runs certificate services: Certificate data
* **Bare-metal backup**: Backs up operating system files and all data on critical volumes (except user data). By definition, a BMR backup includes a system state backup. It provides protection when a computer won't start and you have to recover everything.

The following table summarizes what you can back up and recover. For detailed information about app versions that can be protected with system state and BMR, see [What does Azure Backup Server back up?](backup-mabs-protection-matrix.md).

|Backup|Issue|Recover from Azure Backup Server backup|Recover from system state backup|BMR|
|----------|---------|---------------------------|------------------------------------|-------|
|**File data**<br /><br />Regular data backup<br /><br />BMR/system state backup|Lost file data|Y|N|N|
|**File data**<br /><br />Azure Backup Server backup of file data<br /><br />BMR/system state backup|Lost or damaged operating system|N|Y|Y|
|**File data**<br /><br />Azure Backup Server backup of file data<br /><br />BMR/system state backup|Lost server (data volumes intact)|N|N|Y|
|**File data**<br /><br />Azure Backup Server backup of file data<br /><br />BMR/system state backup|Lost server (data volumes lost)|Y|No|Yes (BMR, followed by regular recovery of backed-up file data)|
|**SharePoint data**:<br /><br />Azure Backup Server backup of farm data<br /><br />BMR/system state backup|Lost site, lists, list items, documents|Y|N|N|
|**SharePoint data**:<br /><br />Azure Backup Server backup of farm data<br /><br />BMR/system state backup|Lost or damaged operating system|N|Y|Y|
|**SharePoint data**:<br /><br />Azure Backup Server backup of farm data<br /><br />BMR/system state backup|Disaster recovery|N|N|N|
|Windows Server 2012 R2 Hyper-V<br /><br />Azure Backup Server backup of Hyper-V host or guest<br /><br />BMR/system state backup of host|Lost VM|Y|N|N|
|Hyper-V<br /><br />Azure Backup Server backup of Hyper-V host or guest<br /><br />BMR/system state backup of host|Lost or damaged operating system|N|Y|Y|
|Hyper-V<br /><br />Azure Backup Server backup of Hyper-V host or guest<br /><br />BMR/system state backup of host|Lost Hyper-V host (VMs intact)|N|N|Y|
|Hyper-V<br /><br />Azure Backup Server backup of Hyper-V host or guest<br /><br />BMR/system state backup of host|Lost Hyper-V host (VMs lost)|N|N|Y<br /><br />BMR, followed by regular Azure Backup Server recovery|
|SQL Server/Exchange<br /><br />Azure Backup Server app backup<br /><br />BMR/system state backup|Lost app data|Y|N|N|
|SQL Server/Exchange<br /><br />Azure Backup Server app backup<br /><br />BMR/system state backup|Lost or damaged operating system|N|y|Y|
|SQL Server/Exchange<br /><br />Azure Backup Server app backup<br /><br />BMR/system state backup|Lost server (database/transaction logs intact)|N|N|Y|
|SQL Server/Exchange<br /><br />Azure Backup Server app backup<br /><br />BMR/system state backup|Lost server (database/transaction logs lost)|N|N|Y<br /><br />BMR recovery, followed by regular Azure Backup Server recovery|

## How system state backup works

When a system state backup runs, Backup Server communicates with Windows Server Backup to request a backup of the server's system state. By default, Backup Server and Windows Server Backup use the drive that has the most available free space. Information about this drive is saved in the PSDataSourceConfig.xml file. This is the drive that Windows Server Backup uses for backups.

You can customize the drive that Backup Server uses for the system state backup. On the protected server, go to C:\Program Files\Microsoft Data Protection Manager\MABS\Datasources. Open the PSDataSourceConfig.xml file for editing. Change the \<FilesToProtect\> value for the drive letter. Save and close the file. If there's a protection group set to protect the system state of the computer, run a consistency check. If an alert is generated, select **Modify protection group** in the alert, and then complete the wizard. Then, run another consistency check.

Note that if the protection server is in a cluster, it's possible that a cluster drive will be selected as the drive with the most free space. If that drive ownership has been switched to another node and a system state backup runs, the drive isn't available and the backup fails. In this scenario, modify PSDataSourceConfig.xml to point to a local drive.

Next, Windows Server Backup creates a folder called WindowsImageBackup in the root of the restore folder. As Windows Server Backup creates the backup, all the data is placed in this folder. When the backup is finished, the file is transferred to the Backup Server computer. Note the following information:

* This folder and its contents are not cleaned up when the backup or transfer is finished. The best way to think of this is that the space is being reserved for the next time a backup is finished.
* The folder is created every time a backup is made. The time and date stamp reflect the time of your last system state backup.

## BMR backup

For BMR (including a system state backup), the backup job is saved directly to a share on the Backup Server computer. It is not saved to a folder on the protected server.

Backup Server calls Windows Server Backup and shares out the replica volume for that BMR backup. In this case, it doesn't tell Windows Server Backup to use the drive with the most free space. Instead, it uses the share that was created for the job.

When the backup is finished, the file is transferred to the Backup Server computer. Logs are stored in C:\Windows\Logs\WindowsServerBackup.

## Prerequisites and limitations

-   BMR isn't supported for computers that run Windows Server 2003 or for computers that run a client operating system.

-   You can't protect BMR and system state for the same computer in different protection groups.

-   A Backup Server computer can't protect itself for BMR.

-   Short-term protection to tape (disk-to-tape, or D2T) isn't supported for BMR. Long-term storage to tape (disk-to-disk-to-tape, or D2D2T) is supported.

-   For BMR protection, Windows Server Backup must be installed on the protected computer.

-   For BMR protection, unlike for system state protection, Backup Server doesn't have any space requirements on the protected computer. Windows Server Backup directly transfers backups to the Backup Server computer. The backup transfer job doesn't appear in the Backup Server **Jobs** view.

-   Backup Server reserves 30 GB of space on the replica volume for BMR. You can change this on the **Disk Allocation** page in the Modify Protection Group wizard or by using the Get-DatasourceDiskAllocation and Set-DatasourceDiskAllocation PowerShell cmdlets. On the recovery point volume, BMR protection requires about 6 GB for a retention of five days.
    * Note that you can't reduce the replica volume size to less than 15 GB.
    * Backup Server doesn't calculate the size of the BMR data source. It assumes 30 GB for all servers. Change the value based on the size of BMR backups that you expect in your environment. The size of a BMR backup can be roughly calculated as the sum of used space on all critical volumes. Critical volumes = boot volume + system volume + volume hosting system state data, such as Active Directory.

-   If you change from system state protection to BMR protection, BMR protection requires less space on the *recovery point volume*. However, the extra space on the volume is not reclaimed. You can manually shrink the volume size on the **Modify Disk Allocation** page of the Modify Protection Group wizard or by using the Get-DatasourceDiskAllocation and Set-DatasourceDiskAllocation PowerShell cmdlets.

    If you change from system state protection to BMR protection, BMR protection requires more space on the *replica volume*. The volume is automatically extended. If you want to change the default space allocations, use the Modify-DiskAllocation PowerShell cmdlet.

-   If you change from BMR protection to system state protection, you need more space on the recovery point volume. Backup Server might try to automatically increase the volume. If there is insufficient space in the storage pool, an error occurs.

    If you change from BMR protection to system state protection, you need space on the protected computer. This is because system state protection first writes the replica to the local computer, and then transfers it to the Backup Server computer.

## Before you begin

1.  **Deploy Azure Backup Server**. Verify that Backup Server is correctly deployed. For more information, see:
    * [System requirements for Azure Backup Server](https://docs.microsoft.com/system-center/dpm/install-dpm#setup-prerequisites)
    * [Backup Server protection matrix](backup-mabs-protection-matrix.md)

2.  **Set up storage**. You can store backup data on disk, on tape, and in the cloud with Azure. For more information, see [Prepare data storage](https://docs.microsoft.com/system-center/dpm/plan-long-and-short-term-data-storage).

3.  **Set up the protection agent**. Install the protection agent on the computer that you want to back up. For more information, see [Deploy the DPM protection agent](https://docs.microsoft.com/system-center/dpm/deploy-dpm-protection-agent).

## Back up system state and bare metal
Set up a protection group as described in [Deploy protection groups](https://docs.microsoft.com/system-center/dpm/create-dpm-protection-groups). Note that you can't protect BMR and system state for the same computer in different groups. Also, when you select BMR, system state is automatically enabled.


1.  To open the Create New Protection Group wizard in the Backup Server Administrator Console, select **Protection** > **Actions** > **Create Protection Group**.

2.  On the **Select Protection Group Type** page, select **Servers**, and then select **Next**.

3.  On the **Select Group Members** page, expand the computer, and then select either **BMR** or **system state**.

    Remember that you can't protect both BMR and system state for the same computer in different groups. Also, when you select BMR, system state is automatically enabled. For more information, see [Deploy protection groups](https://docs.microsoft.com/system-center/dpm/create-dpm-protection-groups).

4.  On the **Select Data Protection Method** page, select how you want to handle short-term and long-term backup. Short-term backup is always to disk first, with the option of backing up from the disk to the Azure cloud by using Azure Backup (short-term or long-term). An alternative to long-term backup to the cloud is to set up long-term backup to a standalone tape device or tape library that's connected to Backup Server.

5.  On the **Select Short-Term Goals** page, select how you want to back up to short-term storage on disk:
    1. For **Retention range**, select how long you want to keep the data on disk. 
    2. For **Synchronization frequency**, select how often you want to run an incremental backup to disk. If you don't want to set a backup interval, you can check the **Just before a recovery point** option. Backup Server will run an express, full backup just before each recovery point is scheduled.

6.  If you want to store data on tape for long-term storage, on the **Specify Long-Term Goals** page, select how long you want to keep tape data (1-99 years). 
    1. For **Frequency of backup**, select how often backup to tape should run. The frequency is based on the retention range you've selected:
        * When the retention range is 1-99 years, you can select backups to occur daily, weekly, biweekly, monthly, quarterly, half-yearly, or yearly.
        * When the retention range is 1-11 months, you can select backups to occur daily, weekly, biweekly, or monthly.
        * When the retention range is 1-4 weeks, you can select backups to occur daily or weekly.

    2. On the **Select Tape and Library Details** page, select the tape and library to use, and whether data should be compressed and encrypted.

7.  On the **Review Disk Allocation** page, review the storage pool disk space that's allocated for the protection group.

    1. **Total Data size** is the size of the data you want to back up.
    2. **Disk space to be provisioned on Azure Backup Server** is the space that Backup Server recommends for the protection group. Backup Server chooses the ideal backup volume based on the settings. However, you can edit the backup volume choices in **Disk allocation details**. 
    3. For workloads, in the drop-down menu, select the preferred storage. Your edits change the values for **Total Storage** and **Free Storage** in the **Available Disk Storage** pane. Underprovisioned space is the amount of storage that Backup Server suggests you add to the volume, to ensure smooth backups.

8.  On the **Choose Replica Creation Method** page, select how you want to handle the initial full data replication. If you choose to replicate over the network, we recommend that you choose an off-peak time. For large amounts of data or for network conditions that are less than optimal, consider replicating the data offline by using removable media.

9. On the **Choose Consistency Check Options** page, select how you want to automate consistency checks. You can choose to run a check only when replica data becomes inconsistent, or on a schedule. If you don't want to configure automatic consistency checking, you can run a manual check at any time. To run a manual check, in the **Protection** area of the Backup Server Administrator Console, right-click the protection group, and then select **Perform Consistency Check**.

10. If you've selected to back up to the cloud by using Azure Backup, on the **Specify Online Protection Data** page, make sure that you select the workloads you want to back up to Azure.

11. On the **Specify Online Backup Schedule** page, select how often incremental backups to Azure will occur. You can schedule backups to run every day, week, month, and year, and select the time and date at which they should run. Backups can occur up to twice a day. Each time a backup runs, a data recovery point is created in Azure from the copy of the backup data stored on the Backup Server disk.

12. On the **Specify Online Retention Policy** page, select how the recovery points that are created from the daily, weekly, monthly, and yearly backups are retained in Azure.

13. On the **Choose Online Replication** page, select how the initial full replication of data occurs. You can replicate over the network or do an offline backup (offline seeding). Offline backup uses the Azure Import feature. For more information, see [Offline backup workflow in Azure Backup](backup-azure-backup-import-export.md).

14. On the  **Summary** page, review your settings. After you select **Create Group**, initial replication of the data occurs. When data replication finishes, on the **Status** page, the protection group status is **OK**. Backup then takes place per the protection group settings.

## Recover system state or BMR
You can recover BMR or system state to a network location. If you've backed up BMR, use Windows Recovery Environment (WinRE) to start your system and connect it to the network. Then, use Windows Server Backup to recover from the network location. If you've backed up system state, just use Windows Server Backup to recover from the network location.

### Restore BMR
Run recovery on the Backup Server computer:

1.  In the **Recovery** pane, find the computer you want to recover, and then select **Bare Metal Recovery**.

2.  Available recovery points are indicated in bold on the calendar. Select the date and time for the recovery point that you want to use.

3.  On the  **Select Recovery Type** page, select **Copy to a network folder.**

4.  On the **Specify Destination** page, select where you want to copy the data to. Remember that the selected destination needs to have enough room. We recommend that you create a new folder.

5.  On the **Specify Recovery Options** page, select the security settings to apply. Then, select whether you want to use storage area network (SAN)-based hardware snapshots, for quicker recovery. (This is an option only if you have a SAN with this functionality available, and the ability to create and split a clone to make it writable. In addition, the protected computer and Backup Server computer must be connected to the same network.)

6.  Set up notification options. On the **Confirmation** page, select **Recover**.

Set up the share location:

1.  In the restore location, go to the folder that has the backup.

2.  Share the folder that is one level above WindowsImageBackup so that the root of the shared folder is the WindowsImageBackup folder. If you don't do this, restore won't find the backup. To connect by using Windows Recovery Environment (WinRE), you need a share that you can access in WinRE with the correct IP address and credentials.

Restore the system:

1.  Start the computer on which you want to restore the image by using the Windows DVD for the system you are restoring.

2.  On the first page, verify language and locale settings. On the **Install** page, select **Repair your computer**.

3.  On the **System Recovery Options** page, select **Restore your computer using a system image that you created earlier**.

4.  On the **Select a system image backup** page,  select **Select a system image** > **Advanced** > **Search for a system image on the network**. If a warning appears, select **Yes**. Go to the share path, enter the credentials, and then select the recovery point. This scans for specific backups that are available in that recovery point. Select the recovery point that you want to use.

5.  On  the **Choose how to restore the backup** page, select **Format and repartition disks**. On the next page, verify settings. 

6.  To begin the restore, select **Finish**. A restart is required.

### Restore system state

Run recovery in Backup Server:

1.  In the **Recovery** pane, find the computer that you want to recover, and then select **Bare Metal Recovery**.

2.  Available recovery points are indicated in bold on the calendar. Select the date and time for the recovery point that you want to use.

3.  On the  **Select Recovery Type** page, select **Copy to a network folder**.

4.  On the **Specify Destination** page, select where you want to copy the data. Remember that the selected destination needs enough room. We recommend that you create a new folder.

5.  On the **Specify Recovery Options** page, select the security settings to apply. Then, select whether you want to use SAN-based hardware snapshots for quicker recovery. (This is an option only if you have a SAN with this functionality and the ability to create and split a clone to make it writable. In addition, the protected computer and Backup Server server must be connected to the same network.)

6.  Set up notification options. On the **Confirmation** page, select **Recover**.

Run Windows Server Backup:

1.  Select **Actions** > **Recover** > **This Server** > **Next**.

2.  Select **Another Server**, select the **Specify Location Type** page, and then select **Remote shared folder**. Enter the path to the folder that contains the recovery point.

3.  On the **Select Recovery Type** page, select **System state**. 

4. On the **Select Location for System State Recovery** page,  select  **Original Location**.

5.  On the **Confirmation** page, select **Recover**. After the restore, restart the server.

6.  You also can run the system state restore at a command prompt. To do this, start Windows Server Backup on the computer you want to recover. To get the version identifer, at a command prompt, enter:
  ```wbadmin get versions -backuptarget \<servername\sharename\>```

    Use the version identifier to start the system state restore. At the command prompt, enter: ```wbadmin start systemstaterecovery -version:<versionidentified> -backuptarget:<servername\sharename>```

    Confirm that you want to start the recovery. You can see the process in the Command Prompt window. A restore log is created. After the restore, restart the server.

