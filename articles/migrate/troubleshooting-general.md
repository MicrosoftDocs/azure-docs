---
title: Troubleshoot Azure Migrate issues | Microsoft Docs
description: Provides an overview of known issues in the Azure Migrate service, and troubleshooting tips for common errors.
services: migrate
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 40faffa3f-1f44-4a72-94bc-457222ed7ac8
ms.service: migrate
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 11/22/2017
ms.author: raynew

---
# Troubleshoot Azure Migrate

## Troubleshoot common errors

[Azure Migrate](migrate-overview.md) assesses on-premises workloads for migration to Azure. Use this article to troubleshoot issues when deploying and using Azure Migrate.


**The collector can't connect to the project using the project ID and key I copied from the portal.**

Make sure you've copied and pasted the right information. To troubleshoot, install the Microsoft Monitoring Agent (MMA) as follows:

1. On the collector VM, download the [MMA](https://go.microsoft.com/fwlink/?LinkId=828603).
2. To start the installation, double-click the downloaded file.
3. In setup, on the **Welcome** page, click **Next**. On the **License Terms** page, click **I Agree** to accept the license.
4. In **Destination Folder**, keep or modify the default installation folder > **Next**.
5. In **Agent Setup Options**, select **Azure Log Analytics (OMS)** > **Next**.
6. Click **Add** to add a new Log Analytics workspace. Paste in project ID and key that you copied. Then click **Next**.
7. Verify that the agent can connect to the project. If it can't, verify the settings. If the agent can connect but the collector can't, contact Support.


**I installed the agent as described in the previous issue, but when I connect to the project I get a date and time synchronization error.**

The server clock might be out-of-synchronization with the current time by more than five minutes. Change the clock time on the collector VM to match the current time, as follows:

1. Open an admin command prompt on the VM.
2. To check the time zone, run w32tm /tz.
3. To synchronize the time, run w32tm /resync.

**My project key has “==” symbols towards the end. These are encoded to other alphanumeric characters by the collector. Is this expected?**

Yes, every project key ends with “==”. The collector encrypts the project key before processing it.

**Performance data for disks and networks adapters shows as zeros**

This can occur if the statistics setting level on the vCenter server is set to less than three. At level three or higher, vCenter stores VM performance history for compute, storage, and network. For less than level three, vCenter doesn't store storage and network data, but CPU and memory data only. In this scenario, performance data shows as zero in Azure Migrate, and Azure Migrate provides size recommendation for disks and networks based on the metadata collected from the on-premises machines.

To enable collection of disk and network performance data, change the statistics settings level to three. Then, wait at least a day to discover your environment and assess it. 


## Troubleshoot readiness issues

**Issue** | **Fix**
--- | ---
Boot type not supported | Change to BIOS before you run a migration.
Disk count exceeds limit | Remove unused disks from the machine before migration.
Disk size exceeds limit | Shrink disks to less than 4 TB before migration. 
Disk unavailable in the specified location | Make sure the disk is in your target location before you migrate.
Disk unavailable for the specified redundancy | The disk should use the redundancy storage type defined in the assessment settings (LRS by default).
Could not determine disk suitability due to an internal error | Try creating a new assessment for the group. 
VM with required cores and memory not found | Azure couldn't fine a suitable VM type. Reduce the memory and number of cores of the on-premises machine before you migrate. 
One or more unsuitable disks. | Make sure on-premises disks are 4 TB or under before you run a migration.
One or more unsuitable network adapters. | Remove unused network adapters from the machine before migration.
Could not determine VM suitability due to an internal error. | Try creating a new assessment for the group. 
Could not determine suitability for one or more disks due to an internal error. | Try creating a new assessment for the group.
Could not determine suitability for one or more network adapters due to an internal error. | Try creating a new assessment for the group.
VM not found for the required storage performance. | The storage performance (IOPS/throughput) required for the machine exceeds Azure VM support. Reduce storage requirements for the machine before migration.
VM not found for the required network performance. | The network performance (in/out) required for the machine exceeds Azure VM support. Reduce the networking requirements for the machine. 
VM not found for the specified pricing tier. | Check the pricing tier settings. 
VM not found in the specified location. | Use a different target location before migration.
Linux OS support issues | Make sure you're running 64-bit with these supported [operating systems](../virtual-machines/linux/endorsed-distros.md).
Windows OS support issues | Make sure you're running a supported operating system. [Learn more](concepts-assessment-calculation.md#azure-suitability-analysis)
Unknown operating system. | Check that the operating system specified in vCenter is correct and repeat the discovery process.
Requires Visual Studio subscription. | Windows client operating systems are only supported on Visual Studio (MSDN) subscriptions.


## Collect logs

**How do I collect logs on the collector VM?**

Logging is enabled by default. Logs are located as follows:

- C:\Profiler\ProfilerEngineDB.sqlite
- C:\Profiler\Service.log
- C:\Profiler\WebApp.log

To collect Event Tracing for Windows, do the following:

1. On the collector VM, open a PowerShell command window.
2. Run **Get-EventLog -LogName Application | export-csv eventlog.csv**.

**How do I collect portal network traffic logs?**

1. Open the browser and navigate and log in [to the portal](https://portal.azure.com).
2. Press F12 to start the Developer Tools. If needed, clear the setting **Clear entries on navigation**.
3. Click the **Network** tab, and start capturing network traffic:
 - In Chrome, select **Preserve log**. The recording should start automatically. A red circle indicates that traffic is being capture. If it doesn't appear, click the black circle to start
 - In Edge/IE, recording should start automatically. If it doesn't, click the green play button.
4. Try to reproduce the error.
5. After you've encountered the error while recording, stop recording, and save a copy of the recorded activity:
 - In Chrome, right-click and click **Save as HAR with content**. This zips and exports the logs as a .har file.
 - In Edge/IE, click the **Export captured traffic** icon. This zips and exports the log.
6. Navigate to the **Console** tab to check for any warnings or errors. To save the console log:
 - In Chrome, right-click anywhere in the console log. Select **Save as**, to export and zip the log.
 - In Edge/IE, right-click on the errors and select **Copy all**. 
7. Close Developer Tools.
 



