---
title: Plan capacity and scaling for Hyper-V VM replication (Without VMM) to Azure with Azure Site Recovery | Microsoft Docs
description: Use this article to plan capacity and scale when replicating  Hyper-V VMs to Azure with Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 8687af60-5b50-481c-98ee-0750cbbc2c57
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/21/2017
ms.author: raynew
---

# Step 3: Plan capacity and scaling for Hyper-V to Azure replication

Use this article to figure out planning for capacity and scaling, when replicating on-premises Hyper-V VMs (without System Center VMM) to Azure with [Azure Site Recovery](site-recovery-overview.md).

After reading this article, post any comments at the bottom, or ask technical questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## How do I start capacity planning?


You gather information about your replication environment, and then plan capacity using this information, together with the considerations highlighted in this article.


## Gather information

1. Gather information about your replication environment, including VMs, disks per VMs, and storage per disk.
2. Identify your daily change (churn) rate for replicated data. Download the [Hyper-V capacity planning tool](https://www.microsoft.com/download/details.aspx?id=39057) to get the change rate. We recommend you run this tool over a week to capture averages.
 

## Figure out capacity

Based on the information you've gather, you run the [Site Recovery Capacity Planner Tool](http://aka.ms/asr-capacity-planner-excel) to analyze your source environment and workloads, estimate bandwidth needs and server resources for the source location, and the resources (virtual machines and storage etc), that you need in the target location. You can run the tool in a couple of modes:

- Quick planning: Run the tool in this mode to get network and server projections based on an average number of VMs, disks, storage, and change rate.
- Detailed planning: Run the tool in this mode, and provide details of each workload at VM level. Analyze VM compatibility and get network and server projections.


1. Download the [tool](http://aka.ms/asr-capacity-planner-excel)
2. To run the quick planner, follow [these instructions](site-recovery-capacity-planner.md#run-the-quick-planner), and select the scenario **Hyper-V to Azure**.
3. To run the detailed planner, follow [these instructions](site-recovery-capacity-planner.md#run-the-detailed-planner), and select the scenario **Hyper-V to Azure**.

## Control network bandwidth

After you've calculated the bandwidth you need, you have a couple of options for controlling the amount of bandwidth used for replication:

* **Throttle bandwidth**: Hyper-V traffic that replicates to Azure goes through a specific Hyper-V host. You can throttle bandwidth on the host server.
* **Influence bandwidth**: You can influence the bandwidth used for replication using a couple of registry keys.

### Throttle bandwidth
1. Open the Microsoft Azure Backup MMC snap-in on the Hyper-V host server. By default a shortcut for Microsoft Azure Backup is available on the desktop or in C:\Program Files\Microsoft Azure Recovery Services Agent\bin\wabadmin.
2. In the snap-in click **Change Properties**.
3. On the **Throttling** tab select **Enable internet bandwidth usage throttling for backup operations**, and set the limits for work and non-work hours. Valid ranges are from 512 Kbps to 102 Mbps per second.

    ![Throttle bandwidth](./media/hyper-v-site-walkthrough-capacity/throttle2.png)

You can also use the [Set-OBMachineSetting](https://technet.microsoft.com/library/hh770409.aspx) cmdlet to set throttling. Here's a sample:

    $mon = [System.DayOfWeek]::Monday
    $tue = [System.DayOfWeek]::Tuesday
    Set-OBMachineSetting -WorkDay $mon, $tue -StartWorkHour "9:00:00" -EndWorkHour "18:00:00" -WorkHourBandwidth  (512*1024) -NonWorkHourBandwidth (2048*1024)

**Set-OBMachineSetting -NoThrottle** indicates that no throttling is required.

### Influence network bandwidth
1. In the registry navigate to **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Replication**.
   * To influence the bandwidth traffic on a replicating disk, modify the value the **UploadThreadsPerVM**, or create the key if it doesn't exist.
   * To influence the bandwidth for failback traffic from Azure, modify the value **DownloadThreadsPerVM**.
2. The default value is 4. In an “overprovisioned” network, these registry keys should be changed from the default values. The maximum is 32. Monitor traffic to optimize the value.

## Next steps

Go to [Step 4: Plan networking](hyper-v-site-walkthrough-network.md).
