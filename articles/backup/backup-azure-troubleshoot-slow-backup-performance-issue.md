<properties
   pageTitle="Troubleshooting slow backup of files and folders in Azure Backup| Microsoft Azure"
   description="Provides troubleshooting guidance to help you diagnose and narrow down the cause of the Azure Backup performance issue"
   services="backup"
   documentationCenter=""
   authors="genlin"
   manager="markgal"
   editor=""/>

<tags
    ms.service="backup"
    ms.workload="storage-backup-recovery"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="07/20/2016"
    ms.author="genli"/>

# Troubleshooting slow backup of files and folders in Azure Backup

This article provides troubleshooting guidance to help you diagnose and narrow down the cause of slow backup performance for files and folder backups using Azure Backup. When you use the Azure Backup agent to back up files, the backup process may take longer than expected. This issue may be caused by one or more of the following:

-	[Performance bottlenecks on the computer that’s being backed up](#cause1).
-	[Another process or antivirus software is interfering with Azure Backup](#cause2).
-	[The Backup agent is running on an Azure virtual machine (VM)](#cause3).  
-	[You are trying to back up a large number of files (multi millions)](#cause4).

The next section helps you determine the specific cause of the issue.

Before you start troubleshooting the issue, we recommend that you download and install the [latest Azure Backup agent](http://aka.ms/azurebackup_agent). We make frequent
updates to the Backup agent to fix various issues, add features, and improve performance.  

We also strongly recommend that you review the [Azure Backup service- FAQ](backup-azure-backup-faq.md) to make sure you’re not experiencing any of the common configuration issues.

## Troubleshooting steps
<a id="cause1"></a>
## Cause 1: Backup slow due to performance bottlenecks on the computer that’s being backed up

### Solution

There may be some bottlenecks on the machine being backed up that can cause delays. For example, computer's ability to read or write to disk, and even to send data over the network etc.

Windows provide a built-in tool that’s called [Performance Monito](https://technet.microsoft.com/en-us/magazine/2008.08.pulse.aspx)(Perfmon) to detect these bottlenecks, below table summarizes the performance counters and ranges for Backups to be optimal.

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

## Cause 2 Another process or antivirus software is interfering with the Azure Backup process

We have seen several instances where other processes within the Windows system have negatively affected performance of the Azure Backup agent process. For example, if you use both the Azure Backup agent and another program to back up data or  antivirus software is running and has a lock on files to be backed up, the multiple locks on files may cause contention. In this situation, the backup may fail, or the job may take longer than expected.

### Solution

The best recommendation in this scenario is to turn off the other backup program to see whether the backup time for the Azure Backup agent changes. Usually, making sure that multiple backup jobs are not running at the same time is sufficient to prevent them from stepping on each other.

For antivirus programs, we recommend that you exclude the following files and locations:

- Exclude C:\Program Files\Microsoft Azure Recovery Services Agent\bin\cbengine.exe as a process.
- Exclude C:\Program Files\Microsoft Azure Recovery Services Agent\ folders.
- Exclude Scratch location (if not using standard location above).

<a id="cause3"></a>
## Cause 3 The Backup agent is running in an Azure Virtual Machine (VM)

### Solution

If you are running the Backup agent on a VM, performance will be slower than when you run it on a physical machine, this is expected due to IOPS limitations.  However, you can optimize the performance by switching the data drives that are being backed up to premium storage. We are working on fixing this issue and the fix will be available in future release.

<a id="cause4"></a>
## Cause 4 Backing up a large number(multi millions) of files

### Solution

It is expected that moving a large volume of data will take a longer time than a smaller volume. But in some cases backup time is not related to only the size of the data but also to the number of files or folders, especially for the scenario where multi millions of small files (few Bytes to few Kilobyte).

This behavior occurs because while we are backing up the data and moving it to Azure, we are simultaneously cataloging your files, and in some rare scenarios the catalog operation may take longer.

Follow the below steps to understand the bottleneck and accordingly work on the next steps:

a. **UI is showing progress for the amount of data transferred**- In this case, the data is still getting transferred and the network bandwidth or the size of data might be causing delays.

b.	**UI is not showing progress**- In that case, open the logs located at “C:\Microsoft Azure Recovery Services Agent\Temp”, and then check for “FileProvider::EndData” entry in the logs. This entry signifies that data transfer completed and catalog operation is happening. Do not cancel the backup jobs instead wait for some more time for catalog to finish. If problem persists, contact [Azure support](https://portal.azure.com/#create/Microsoft.Support).
