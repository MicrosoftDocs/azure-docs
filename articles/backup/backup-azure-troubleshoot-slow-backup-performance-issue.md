<properties
   pageTitle="Troubleshooting slow performance issue in Azure Backup | Microsoft Azure"
   description="Provides troubleshooting guidance to help you diagnose and narrow down the cause of the Azure Backup performance issue"
   services="backup"
   documentationCenter=""
   authors="genlin"
   manager="jwhit"
   editor=""/>

<tags
    ms.service="backup"
    ms.workload="storage-backup-recovery"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="07/18/2016"
    ms.author="genli"/>

# Troubleshooting slow performance in Azure Backup

This article provides troubleshooting guidance to help you diagnose and narrow down the cause of performance issues in Azure Backup. When you use the Azure Backup agent to back up files, the backup process may take longer than expected. This issue may be caused by one or more of the following:

-	[Performance bottlenecks on the computer that’s running the Backup agent](#cause1). The bottleneck is usually in network bandwidth or in hard disk I/O.
-	[Another process is interfering with Azure Backup](#cause2).
-	[The Backup agent is running on a virtual machine (VM)](#cause3).  
-	[You are trying to back up a large number of files](#cause4).

The next section helps you determine the specific cause of the issue.

Before you start troubleshooting the issue, we recommend that you go to the [Azure portal](https://ms.portal.azure.com/) and download the latest Azure Backup agent. We make frequent
updates to the Backup agent to fix various issues, add features, and improve performance.  

We also strongly recommend that you review the [Azure Backup service- FAQ](backup-azure-backup-faq.md) to make sure you’re not experiencing any of the common configuration issues.

## Troubleshooting steps
<a id="cause1"></a>
## Cause 1: Performance bottlenecks on the computer that’s running the Backup agent

### How to determine and the resolution

Network speed between the server and Azure storage affects the overall backup time. The following table provides details about the optimal data transfer time, based on the network speed plus 10 percent overhead. However, Azure Backup won't consume 100 percent of the network bandwidth. Therefore, the data transfer time is greater what’s listed in this table.

| Data Size | 1000base-T (1 Gbs) | 100base-T (100 Mbs) | DS3, T3 (45 Mbs) | 10base-T (10 Mbs) | 512 Kbs  |
|-----------|--------------------|---------------------|------------------|-------------------|----------|
| 1 GB      | < 1 minute         | < 2 minutes         | < 5 minutes      | < 15 minutes      | 5 hrs    |
| 50 GB     | < 10 minutes       | 1.5 hours           | 3 hours          | < 13 hours        | 10 days  |
| 200 GB    | < 35 minutes       | 5 hours             | 11 hours         | 2 days 1 hour     | 40 days  |
| 500 GB    | 1.5 hours          | 12 hours            | 27 hours         | 5 days 2 hours    | 99 days  |
| 1TB       | 2.5 hours          | 24 hours            | 2 days 6 hours   | 10 days 4 hours   | 198 days |

As with any other system process, there may be a bottleneck that causes delays. These delays could affect the computer's ability to read or write to disk, and even to send data over the network. These bottlenecks can be diagnosed with many tools, but Windows has one built-in tool that’s called Performance Monitor (Perfmon). For more information, see [How to set up Perfmon and determine whether there are any bottlenecks that can be investigated](https://technet.microsoft.com/magazine/2008.08.pulse.aspx).

Here are some performance counters and ranges that can be helpful in diagnosing bottlenecks.

| Counter  | Status  |
|---|---|
|Logical Disk(Physical Disk)--%idle   | • 100% idle to 50% idle = Healthy</br>• 49% idle to 20% idle = Warning or Monitor</br>• 19% idle to 0% idle = Critical or Out of Spec|
|  Logical Disk(Physical Disk)--%Avg. Disk Sec Read or Write |  • 0.001ms to 0.015ms  = Healthy</br>• 0.015ms to 0.025 = Warning or Monitor</br>• 0.026ms or longer = Critical or Out of Spec|
|  Logical Disk(Physical Disk)--Current Disk Queue Length (for all instances) | 80 requests for more than 6 minutes |
| Memory--Pool Non Paged Bytes|• Less than 60% of pool consumed=Healthy<br>• 61% - 80% of pool consumed = Warning or Monitor</br>• Greater than 80% pool consumed = Critical or Out of Spec|
| Memory--Pool Paged Bytes |• Less than 60% of pool consumed=Healthy</br>• 61% - 80% of pool consumed = Warning or Monitor.</br>• Greater than 80% pool consumed = Critical or Out of Spec.|
| Memory--Available Megabytes| • 50% of free memory available or more =Healthy</br>• 25% of free memory available = Monitor.</br>• 10% of free memory available = Warning.</br>• Less than 100MB or 5% of free memory available = Critical or Out of Spec.|
|Processor--\%Processor Time (all instances)|• Less than 60% consumed = Healthy</br>• 61% - 90% consumed = Monitor or Caution</br>• 91% - 100% consumed = Critical|


> [AZURE.NOTE] If the infrastructure is a possible culprit, it's frequently to make sure that any drives being protected are defragged on a semiregular basis.
<a id="cause2"></a>

## Cause 2 Another process is interfering with the Azure Backup process

### How to determine and the resolution

We have seen several instances where other processes within the Windows system have negatively affected performance of the Azure Backup agent process. For example, if you use both the Azure Backup agent and another program to back up data, the multiple locks on files may cause contention. In this situation, the backup may fail, or the job may take longer than expected.

The best recommendation in this scenario is to turn off the other backup program to see whether the backup time for the Azure Backup agent changes. Usually, making sure that multiple backup jobs are not running at the same time is sufficient to prevent them from stepping on each other.

Similarly, if antivirus software is running and has a lock on files to be backed up, or if it is scanning everything that the MAB agent does, this can cause extended backup times.

For antivirus programs, we recommend that you exclude the following files and locations:

- Exclude C:\Program Files\Microsoft Azure Recovery Services Agent\bin\cbengine.exe as a process.
- Exclude C:\Program Files\Microsoft Azure Recovery Services Agent\ folders.
- Exclude Scratch location (if not using standard location above).

<a id="cause3"></a>
## Cause 3 The Backup agent is running in a Virtual Machine (VM)

### How to determine and the resolution

If you are running the Backup agent on a VM, performance will be slower than when you run it on a physical machine. This is expected.  

In some scenarios, performance will improve by switching the data drives that are being backed up to premium storage. However, the ideal solution is to migrate your backup workload to our [VM backup solution](backup-azure-vms-introduction.md). We are working on a feature to enable item level recovery from VM backup so that you can restore individual files and folders as you can with the Azure Backup agent but with much better backup performance. We will update this article when that information is available.
<a id="cause4"></a>
## Cause 4 Backing up a Large number of files

### How to determine and the resolution

Naturally, moving a large volume of data will take a longer time than a smaller volume. What may not be so obvious is that backup time is not related to only the size of the data but also to the number of files or folders.

If you compare the backup time for a folder that contains multiple files with the backup time for a single file of the same total size, backing up the folder will always require more time. This is the expected behavior. And the more files that are in the folder, the slower the backup process.

This behavior occurs because while we are backing up the data and moving it to Azure, we are simultaneously cataloging your files. We use this catalog to help you browse and find files for later restoration, as needed. If there is a very large number of these files, the catalog job will take longer than the actual data transfer. In this situation, a backup job may appear to be stuck or “hung,” when in fact it is continuing to catalog files and move that data to Azure (this is done in phases).

This process lets us take a deeper look into the logs for the backup job. To optimize this process, follow these steps:

1. Open an administrative command prompt and navigate to:

    C:\Program Files\Microsoft Azure Recovery Services Agent\Temp
2. From here, you should see the errlog files that were created during different actions of the Azure Backup agent.  At the command prompt, type the following:

    **find /i “backup progress” *.errlog > progress.txt**

3.	This will create a progress.txt file in that same directory.  This file can be opened to view the backup jobs as they run. You can identify a backup job start by a “Prebackup started” notation and a finished backup job by an “Uninitialize Storage finished” notation. In between, you should see either a line with “Succeeded” or “Failed: Hr: =”. Because we are focusing on slow backups, we’ll assume they are working, and therefore you should see logged information that resembles the following.

    > [AZURE.NOTE] The time/date and some other info has been removed in order to focus on the following lines.

    ```
    06/07	01:23:25.640	71	backupasync.cpp(1279)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: Prebackup started.

    06/07	01:23:42.623	71	backupasync.cpp(1281)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: Prebackup finished.

    06/07	01:23:42.623	71	backupasync.cpp(1284)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: Start: Adjusting Job start time from snapshot time

    06/07	01:23:42.623	71	backupasync.cpp(1287)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: End: Adjusting Job start time from snapshot time

    06/07	01:23:42.623	71	backupasync.cpp(1292)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: Initialize Storage started.

    06/07	01:25:28.345	71	backupasync.cpp(1295)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: Initialize Storage finished.

    06/07	01:25:28.345	71	backupasync.cpp(1299)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: Data transfer started.

    06/07	10:28:42.779	71	backupasync.cpp(1302)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: Data transfer finished

    06/07	10:28:42.779	71	backupasync.cpp(1326)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: Integrity Check Storage Initialize started.

    06/07	10:28:42.779	71	backupasync.cpp(1329)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: Integrity Check Storage Initialize finished.

    06/07	10:28:42.779	71	backupasync.cpp(1332)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: Integrity Check started.

    06/07	14:56:52.053	71	backupasync.cpp(1334)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: Integrity Check finsihed.

    06/07	14:56:52.053	71	backupasync.cpp(1338)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: Succeeded

    06/07	14:56:52.053	71	backupasync.cpp(1345)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: UnInitialize Storage started.

    06/07	14:59:26.969	71	backupasync.cpp(1347)	[000000001A12E3F0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Backup Progress: UnInitialize Storage finsihed.
  ```
4.	From here, we know that the taskID of the job was F3E32129-DC79-4A28-9ACC-3F30CB5810B6. This tells us that all parts of this job will have that task ID in them. We can then run another search at the command prompt to pull out all the data for this job by searching on just the first string in that taskID:

      **find /i “F3E32129” *.errlog > F3E32129.txt**

      This creates a file with the job pulled out in its entirety. For this job, there are two data sources (or volumes) being backed up to Azure. Therefore, we will look for the job to finish with the data transfer, which is shown with FileProvider::EndData. Look for this entry after the “data transfer started” phase to see when the data transfer is finished. If it takes a long time before the “data transfer finished” phase, you can look to see whether the process is still creating and uploading the catalog, as follows:

      ```
      06/07	07:27:46.139	32	fileprovider.cpp(1479)	[000000001A1DACF0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	==>FileProvider::EndData

      06/07	07:27:53.767	32	fileprovider.cpp(1479)	[000000001A1DACF0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	<--FileProvider::EndData
      ```
      In these log entries, you can see that we call and return the EndData at 07:27, and yet the data transfer doesn’t finish until 10:28. In between, we see many instances of the catalog uploading 500 entries at a time. These continue until they’re finished, at which time the data transfer phase is completed.

      ```
        06/07	10:27:40.993	70	itemcatalogupdater.cpp(652)		F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Uploading 500 RO entries
     ```  

5.	Even if a job looks to be “hung,” you can look at the logs and if you see that it is still doing catalog tasks, you will probably see these jobs continuing after the data transfer is finished.

    One other thing to look at in the errlog files is the Last completed state for Ds Id entry. This provides an indicator of the last state that was completed for each data source. Although it’s listed as a “warning,” it’s actually more informational and should only be used as such.

    Here are the states which may be the most visible.  

|  State |Stage   |Details   |
|---|---|---|
| 2  |SNAPSHOT_VOLUMES   | OS has completed the snapshot of the volumes.  |
| 5  | TRANSFERRING_DATA  |  In the process of transferring data (can include catalog process) |
| 6  | TRANSFERRING_DATA_DONE  |  Data transfer has completed |
| 7  | VERIFYING_BACKUP  |  Backup has been verified |  |
