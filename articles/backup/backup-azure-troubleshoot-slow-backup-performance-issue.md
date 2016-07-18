<properties
   pageTitle="Troubleshooting Azure Backup slow performance issue | Microsoft Azure"
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

# Troubleshooting Azure Backup slow performance issue

This article provides troubleshooting guidance to help you diagnose and narrow down the cause of the Azure Backup performance issue. When you use Azure Backup agent to back up the files, the backup process may take longer than expected. This issue can be caused by the following:

-	The performance bottlenecks in the machine that running the Backup agent. The bottleneck usually occurs in network bandwidth or hard disk I/O.
-	Other Process is interfering with the Azure Backup.
-	The Backup agent is running in a Virtual Machine (VM).  
-	You are trying to back up a large number of files.

The next section will help you to troubleshoot and determine which cause is right for your issue. Before you start troubleshooting the issue, it is always recommended to go back to the Azure portal,  and download the latest Azure Backup agent.  We make frequent updated to Backup agent to fix various issues, add features and improve performance.

It is also strongly recommended that you review the Azure Backup service- FAQ to make sure you are not falling into any of the common configuration type issues.

## Troubleshooting steps

### Cause 1 The performance bottlenecks in the machine that running the Backup agent

## How to determine and the resolution

Network speed between the server and Azure storage affect overall backup time. The following table details optimal data transfer time that's based on the network speed and 10% overhead. However, Azure backup won't consume 100% of the network bandwidth. Therefore, it takes longer data transfer time than the following details.

| Data Size | 1000base-T (1 Gbs) | 100base-T (100 Mbs) | DS3, T3 (45 Mbs) | 10base-T (10 Mbs) | 512 Kbs  |
|-----------|--------------------|---------------------|------------------|-------------------|----------|
| 1 GB      | < 1 minute         | < 2 minutes         | < 5 minutes      | < 15 minutes      | 5 hrs    |
| 50 GB     | < 10 minutes       | 1.5 hours           | 3 hours          | < 13 hours        | 10 days  |
| 200 GB    | < 35 minutes       | 5 hours             | 11 hours         | 2 days 1 hour     | 40 days  |
| 500 GB    | 1.5 hours          | 12 hours            | 27 hours         | 5 days 2 hours    | 99 days  |
| 1TB       | 2.5 hours          | 24 hours            | 2 days 6 hours   | 10 days 4 hours   | 198 days |

As with any other system process, maybe there's a bottleneck causing delays. These delays could affect the computer's ability to read or write to disk, even the ability to send data over the network. These bottlenecks can most frequently be diagnosed with many tools, but Windows has one built-in tool that calls Perfmon. See how to set up Perfmon and determine whether there are any bottlenecks that can be investigated.
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


Note If the infrastructure is a possible culprit, it's frequently to make sure that any drives being protected are defragged on a semiregular basis.

## Cause 2 Other Process is interfering with the Azure Backup process

### How to determine and the resolution

We have seen several instances where other processes within the Windows system that can have negative effects on the performance of Azure Backup Agent process.  We have seen where people are using both Azure Backup agent as well as another software to back up some data.  While it doesn’t always happen, we have seen where the multiple locks on files cause contention which either causes the backup to fail or makes the job take longer than expected.

For this, the best recommendation would be to turn off the other backup to see if the backup time with Azure Backup agent changes.  Usually making sure that the backup jobs are not running at the same time is sufficient to be sure they are not stepping on each other.

Similarly, if an antivirus software is running and has a lock on files to be backed up, or is scanning everything that MAB Agent does, by nature that can lend to extended backup times.  
For antivirus, we recommend to exclude following files/locations:

- Exclude C:\Program Files\Microsoft Azure Recovery Services Agent\bin\cbengine.exe as a process.
- Exclude C:\Program Files\Microsoft Azure Recovery Services Agent\ folders.
- Exclude Scratch location (if not using standard location above).

## Cause 3 The Backup agent is running in a Virtual Machine (VM)

### How to determine and the resolution

If you are running the Backup Agent in a VM, the performance will be slower than running the Backup agent in a physical machine. This is expected.  

In some scenarios, the performance will get better by switching the data drives being backed up to premium storage.  However, the ideal solution is to migrate backup workload to our VM backup solution.  We are working on a feature to enable item level recovery from VM backup so you can restore individual files/folders like Azure Backup agent but with much better backup performance.  I will update this article when it is available.

## Cause 4 Backing up a Large number of files

### How to determine and the resolution

This is one of the common scenarios.  A larger amount of data being moved anywhere will take a longer time.  What may not be so obvious is that backup time is not just related to the size of data but also large number of files or folders cause may cause longer backup time.

If you compare the backup time for a folder that contains multiple files with the backup time for a file of the same size, backing up the folder will always require more time. This is expected behavior. And the more files that are in the folder, the slower the file-backup process.

The reason this happens is that while we are backing up the data and moving it to Azure, we are simultaneously cataloging your files.  We will use this catalog to allow you to browse and find files for restore later.  If there is a very large number of these files, then the catalog job will take longer than the actual data transfer.  This will cause a backup job to sit there and appear to be “stuck” while in reality it is continuing to catalog files and then move that data to Azure (this is done in phases).
This allows us to take a deeper look into the logs for the backup job.  In order to do this, I usually will pull a list of all jobs done on the server being backed up by following these steps:

1. Open an admin command prompt and navigate to:

    C:\Program Files\Microsoft Azure Recovery Services Agent\Temp
2. From here, you should see the errlog files created during different actions of MAB Agent.  At the command prompt, type:

    **find /i “backup progress” *.errlog > progress.txt**

3.	This will create a progress.txt file in that same directory.  This can be opened up to view the backup jobs as they have been run.  You can tell a backup job start with “Prebackup started” and a finish with “UnInitialize Storage finished”.  In between, you should see either a line with “Succeeded” or “Failed: Hr: =”.  Since we are focusing on slow backups, this assumes they are working and thus we see it succeeded and you would see something similar to this:

  NOTE: I have removed the time/date and some other info to focus on these lines.

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
4.	From here, we know the taskID of the job was F3E32129-DC79-4A28-9ACC-3F30CB5810B6.  This tells us that all parts of this job will have that task ID in them.  We can then do another search at the command prompt to pull out all of the data for this job by searching on just the first string in that taskID:

      **find /i “F3E32129” *.errlog > F3E32129.txt**

      This creates a file with the job pulled out in its entirety.  For this job, there were two datasources (or volumes) being backed up to Azure.  So, I will look for the job to finish with the data transfer which is shown with FileProvider::EndData.  Look for this entry after the data transfer started phase to see when the data move finished.  If it is long before the data transfer finished phase, then you can look to see if it is still creating and uploading the catalog.
      ```
      06/07	07:27:46.139	32	fileprovider.cpp(1479)	[000000001A1DACF0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	==>FileProvider::EndData

      06/07	07:27:53.767	32	fileprovider.cpp(1479)	[000000001A1DACF0]	F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	<--FileProvider::EndData
      ```
      Above, you can see we call and return the EndData at 07:27, yet we can see that the data transfer doesn’t finish until 10:28.  So, searching the time in-between, we can see there are many instances of the catalog uploading 500 entries at a time.  These then continue until finished at which time the data transfer phase is completed.

      06/07	10:27:40.993	70	itemcatalogupdater.cpp(652)		F3E32129-DC79-4A28-9ACC-3F30CB5810B6	NORMAL	Uploading 500 RO entries

5.	With this, even if a job looks to be “hung”, you can look at the logs and if you see that it is still doing catalog tasks, then likely you will see these jobs continuing after the data transfer is done.  
One other entry to look at in the errlog files is the Last completed state for Ds Id.  This will give you an indicator of the last state which completed for each datasource.  While it is listed as a WARNING, it is actually more informational and should only be used as such.

    Here are the states which may be the most visible.  

|  State |Stage   |Details   |
|---|---|---|
| 2  |SNAPSHOT_VOLUMES   | OS has completed the snapshot of the volumes.  |
| 5  | TRANSFERRING_DATA  |  In the process of transferring data (can include catalog process) |
| 6  | TRANSFERRING_DATA_DONE  |  Data transfer has completed |
| 7  | VERIFYING_BACKUP  |  Backup has been verified |  |



## TERMINOLOGY

**Initial replication**:  The initial replication is simply a bulk copy of the data you are backing up to Azure.  In the background, we are also creating a VHD which will then be used to track the changes of the data, but the bulk of the heavy lifting here is done by simply moving data from your computer to your Azure Recovery Services Vault.

**Delta replication**: A delta replication is simply the act of moving changed bits from the data you are protecting to the vault.  For this, we want to make sure we are only getting things that have changed in order to minimize the data moved over the network.

**Data transfer**: We have two methods of looking at the data and moving it over the wire.  
Un-optimized: In an un-optimized transfer, MAB does a file scan of each file and folder to compare it to the original.  When it finds changes, that file is marked and moved to Azure.  By default, initial replication has to use un-optimized data transfer.  There are a couple of other possible reasons for use of an un-optimized backup.

- A failed backup leaves the data in Azure in potentially inconsistent state.  Here we need to cleanly revert to older state to be able to reapply the journal in the next backup.

-	USN journal has issues (most commonly high churn may cause it to wrap which then nullifies the previously captured data).

**Optimized**: With an optimized transfer, MAB uses USN Journal to track changes to files and folders.  When it is time to create a recovery point, the changed files will already be identified and MAB will simply transfer those files to Azure. MAB will attempt to use the optimized workflow in every situation.  There are however some corner cases (like USN journal wrap) in which the only option is to use the un-optimized path.

**Catalog**: The other large part of a backup of data to Azure is to catalog what files and folders you are backing up.  Ultimately, this allows a user to browse the directory structure through the recovery UI in MAB and find/select the file(s) to be restored.  A failure to catalog doesn’t affect the backup of the data, so it is often possible that the backup is done, but a catalog may continue to run.  These are done concurrently and often the catalog job will take considerably longer than the backup itself if there is a large number of files or folders to be cataloged.

**Churn rate**: The churn rate is an indicator of the amount of changes over a given time frame (between recovery points).  Churn rate for a given set of backed up data is driven by the amount of change to files as well as new files added to the protected folder(s).
