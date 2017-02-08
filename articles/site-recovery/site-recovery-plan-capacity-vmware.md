---
title: Plan capacity and scaling for VMware replication to Azure | Microsoft Docs
description: Use this article to plan capacity and scale when replicating VMware VMs to Azure
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid: 0a1cd8eb-a8f7-4228-ab84-9449e0b2887b
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 02/05/2016
ms.author: rayne

---
# Plan capacity and scaling for VMware replication with Azure Site Recovery

Use this article to figure out how to plan capacity and scaling when replicating on-premises VMware VMs and physical servers to Azure, with [Azure Site Recovery](site-recovery-overview.md).

## How do I start capacity planning?

1. Gather information about your replication environment using the Azure Site Recovery Capacity Planner. This includes information about VMs, disks per VM, and storage per disk.
2. Estimate the daily change (churn rate) of replicated data in your environment.


## Gather information

1. Download and run the [Capacity Planner[(https://gallery.technet.microsoft.com/Azure-Recovery-Capacity-d01dc40e)].
2. [Get instructions](site-recovery-capacity-planner.md) for running the tool.


## Estimate the daily churn rate

The Site Recovery Capacity Planner requires you to input an average daily data change rate as a percentage. Currently you can gather this information using the [vSphere capacity planning appliance](https://labs.vmware.com/flings/vsphere-replication-capacity-planning-appliance).

In the tool, you can compute the percentage by pointing the vSphere planning tool to all the source VMs, and getting the total daily change. This is essentially the network traffic. [Learn more](https://blogs.vmware.com/vsphere/2014/04/vsphere-replication-capacity-planning-appliance.html) about running this tool.


## Capacity considerations

**Component** | **Details** |
--- | --- | ---
**Replication** | **Maximum daily change rate**—A protected machine can only use one process server, and a single process server can handle a daily change rate up to 2 TB. Thus 2 TB is the maximum daily data change rate that’s supported for a protected machine.<br/><br/> **Maximum throughput**—A replicated machine can belong to one storage account in Azure. A standard storage account can handle a maximum of 20,000 requests per second, and we recommend that you keep the number of IOPS across a source machine to 20,000. For example if you have a source machine with 5 disks and each disk generates 120 IOPS (8K size) on the source then it will be within the Azure per disk IOPS limit of 500. The number of storage accounts required = total source IOPs/20000.
**Configuration server** | The configuration server should be able to handle the daily change rate capacity across all workloads running on protected machines, and needs sufficient bandwidth to continuously replicate data to Azure storage.<br/><br/> As a best practice we recommend that the configuration server be located on the same network and LAN segment as the machines you want to protect. It can be located on a different network but machines you want to protect should have L3 network visibility to it.<br/><br/> Size recommendations for the configuration server are summarized in the table below.
**Process server** | The first process server is installed by default on the configuration server. You can deploy additional process servers to scale your environment. Note that:<br/><br/> The process server receives replication data from protected machines and optimizes it with caching, compression, and encryption before sending to Azure. The process server machine should have sufficient resources to perform these tasks.<br/><br/> The process server uses disk-based cache. We recommend a separate cache disk of 600 GB or more to handle data changes stored in the event of network bottleneck or outage.

## Size recommendations for the configuration server

**CPU** | **Memory** | **Cache disk size** | **Data change rate** | **Protected machines**
--- | --- | --- | --- | ---
8 vCPUs (2 sockets * 4 cores @ 2.5GHz) | 16 GB | 300 GB | 500 GB or less | Replicate less than 100 machines.
12 vCPUs (2 sockets * 6 cores @ 2.5GHz) | 18 GB | 600 GB | 500 GB to 1 TB | Replicate between 100-150 machines.
16 vCPUs (2 sockets * 8 cores @ 2.5GHz) | 32 GB | 1 TB | 1 TB to 2 TB | Replicate between 150-200 machines.
Deploy another process server | | | > 2 TB | Deploy additional process servers if you're replicating more than 200 machines, or if the daily data change rate exceeds 2 TB.

Where:

* Each source machine is configured with 3 disks of 100 GB each.
* We used benchmarking storage of 8 SAS drives of 10 K RPM with RAID 10 for cache disk measurements.

### Size recommendations for the process server

If you need to protect more than 200 machines, or daily change rate is greater than 2 TB, you can add additional process servers to handle the replication load. To scale out you can:

* Increase the number of configuration servers. For example, you can protect up to 400 machines with two configuration servers.
* Add additional process servers, and use these to handle traffic instead of (or in addition to) the configuration server.

This table describes a scenario in which:

* You're not planning to use the configuration server as a process server.
* You've set up an additional process server.
* You've configured protected virtual machines to use the additional process server.
* Each protected source machine is configured with three disks of 100 GB each.

**Configuration server** | **Additional process server** | **Cache disk size** | **Data change rate** | **Protected machines**
--- | --- | --- | --- | ---
8 vCPUs (2 sockets * 4 cores @ 2.5GHz), 16 GB memory | 4 vCPUs (2 sockets * 2 cores @ 2.5GHz), 8 GB memory | 300 GB | 250 GB or less | Replicate 85 or less machines.
8 vCPUs (2 sockets * 4 cores @ 2.5GHz), 16 GB memory | 8 vCPUs (2 sockets * 4 cores @ 2.5GHz), 12 GB memory | 600 GB | 250 GB to 1 TB | Replicate between 85-150 machines.
12 vCPUs (2 sockets * 6 cores @ 2.5GHz), 18 GB memory | 12 vCPUs (2 sockets * 6 cores @ 2.5GHz) 24 GB memory | 1 TB | 1 TB to 2 TB | Replicate between 150-225 machines.

The way in which you scale your servers depends on your preference for a scale up or scale out model.  You scale up by deploying a few high-end configuration and process servers, or scale out by deploying more servers with less resources. For example, if you need to protect 220 machines, you could do either of the following:

* Set up the configuration server with 12vCPU, 18 GB of memory, an additional process server with 12vCPU, 24 GB of memory, and configure protected machines to use the additional process server only.
* Alternatively, you could configure two configuration servers (2 x 8vCPU, 16 GB RAM) and two additional process servers (1 x 8vCPU and 4vCPU x 1 to handle 135 + 85 (220) machines), and configure protected machines to use the additional process servers only.

## Deploy additional process servers
If you have to scale out your deployment beyond 200 source machines, or a total daily churn rate of more than 2 TB, you’ll need additional process servers to handle the traffic volume.

Check the [size recommendations for process servers](#size-recommendations-for-the-process-server), and then follow these instructions to set up the process server. After setting up the server, you migrate source machines to use it.

## Control network bandwidth

You can use the capacity planner tool to calculate the bandwidth you need for replication (initial replication and then delta). To control the amount of bandwidth used for replication, you have a few options:

* **Throttle bandwidth**: VMware traffic that replicates to Azure goes through a specific process server. You can throttle bandwidth on the machines running as process servers.
* **Influence bandwidth**: You can influence the bandwidth used for replication using a couple of registry keys:
  * The **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\UploadThreadsPerVM** registry value specifies the number of threads that are used for data transfer (initial or delta replication) of a disk. A higher value increases the network bandwidth used for replication.
  * The **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\DownloadThreadsPerVM** specifies the number of threads used for data transfer during failback.

#### Throttle bandwidth
1. Open the Microsoft Azure Backup MMC snap-in on the machine acting as the process server. By default, a shortcut for Microsoft Azure Backup is available on the desktop or in C:\Program Files\Microsoft Azure Recovery Services Agent\bin\wabadmin.
2. In the snap-in click **Change Properties**.

    ![Throttle bandwidth](./media/site-recovery-vmware-to-azure/throttle1.png)
3. On the **Throttling** tab, select **Enable internet bandwidth usage throttling for backup operations**, and set the limits for work and non-work hours. Valid ranges are from 512 Kbps to 102 Mbps per second.

    ![Throttle bandwidth](./media/site-recovery-vmware-to-azure/throttle2.png)

You can also use the [Set-OBMachineSetting](https://technet.microsoft.com/library/hh770409.aspx) cmdlet to set throttling. Here's a sample:

    $mon = [System.DayOfWeek]::Monday
    $tue = [System.DayOfWeek]::Tuesday
    Set-OBMachineSetting -WorkDay $mon, $tue -StartWorkHour "9:00:00" -EndWorkHour "18:00:00" -WorkHourBandwidth  (512*1024) -NonWorkHourBandwidth (2048*1024)

**Set-OBMachineSetting -NoThrottle** indicates that no throttling is required.

#### Influence network bandwidth for a VM

1. In the VM's registry, navigate to **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Replication**.
   * To influence the bandwidth traffic on a replicating disk, modify the value the **UploadThreadsPerVM**, or create the key if it doesn't exist.
   * To influence the bandwidth for failback traffic from Azure, modify the value **DownloadThreadsPerVM**.
2. The default value is 4. In an “overprovisioned” network, these registry keys should be changed from the default values. The maximum is 32. Monitor traffic to optimize the value.


## Deploy additional process servers

1. In **Site Recovery servers**, click the configuration server > **Process server**.

    ![Add process server](./media/site-recovery-vmware-to-azure/migrate-ps1.png)
2. In **Server Type**, click **Process server (on-premises)**.

    ![Add process server](./media/site-recovery-vmware-to-azure/migrate-ps2.png)
3. Download the Site Recovery Unified Setup file, and run it to install the process server and register it in the vault.
4. In **Before you begin**, select **Add additional process servers to scale out deployment**.
5. Complete the wizard in the same way you did when you [set up](#step-2-set-up-the-source-environment) the configuration server.

    ![Add process server](./media/site-recovery-vmware-to-azure/add-ps1.png)
6. In **Configuration Server Details**, specify the IP address of the configuration server, and the passphrase. To obtain the passphrase, run **<SiteRecoveryInstallationFolder>\home\sysystems\bin\genpassphrase.exe –n** on the configuration server.

    ![Add process server](./media/site-recovery-vmware-to-azure/add-ps2.png)

### Migrate machines to use the new process server
1. In **Settings** > **Site Recovery servers**, click the configuration server, and then expand **Process servers**.

    ![Update process server](./media/site-recovery-vmware-to-azure/migrate-ps2.png)
2. Right-click the process server currently in use, and click **Switch**.

    ![Update process server](./media/site-recovery-vmware-to-azure/migrate-ps3.png)
3. In **Select target process server**, select the new process server you want to use, and then select the virtual machines that the new process server will handle. Click the information icon to get information about the server. To help you make load decisions, the average space that's needed to replicate each selected virtual machine to the new process server is displayed. Click the check mark to start replicating to the new process server.












The Azure Site Recovery Capacity Planner tool helps you to figure out your capacity requirements when replicating Hyper-V VMs, VMware VMs, and Windows/Linux physical servers, with Azure Site Recovery.

Use the Site Recovery Capacity Planner to analyze your source environment and workloads, estimate bandwidth needs and server resources you'll need for the source location, and the resources (virtual machines and storage etc), that you need in the target location.

You can run the tool in a couple of modes:

* **Quick planning**: Run the tool in this mode to get network and server projections based on an average number of VMs, disks, storage, and change rate.
* **Detailed planning**: Run the tool in this mode, and provide details of each workload at VM level. Analyze VM compatibility and get network and server projections.

## Before you start


1. Gather information about your environment, including VMs, disks per VM, storage per disk.
2. Identify your daily change (churn) rate for replicated data. To do this:

   * If you're replicating Hyper-V VMs, then download the [Hyper-V capacity planning tool](https://www.microsoft.com/download/details.aspx?id=39057) to get the change rate. [Learn more](site-recovery-capacity-planning-for-hyper-v-replication.md) about this tool. We recommend you run this tool over a week to capture averages.
   * If you're replicating VMware virtual machines, use the [vSphere capacity planning appliance](https://labs.vmware.com/flings/vsphere-replication-capacity-planning-appliance) to figure out the churn rate.
   * If you're replicating physical servers, you need to estimate manually.

## Run the Quick Planner
1. Download and open the [Azure Site Recovery Capacity Planner](http://aka.ms/asr-capacity-planner-excel) tool. You need to run macros, so select to enable editing and enable content when prompted.
2. In **Select a planner type** select **Quick Planner** from the list box.

   ![Getting started](./media/site-recovery-capacity-planner/getting-started.png)
3. In the **Capacity Planner** worksheet, enter the required information. You must fill in all the fields circled in red in the screenshot below.

   * In **Select your scenario**, choose **Hyper-V to Azure** or **VMware/Physical to Azure**.
   * In **Average daily data change rate (%)**, put in the information you gather using the [Hyper-V capacity planning tool](site-recovery-capacity-planning-for-hyper-v-replication.md) or the [vSphere capacity planning appliance](https://labs.vmware.com/flings/vsphere-replication-capacity-planning-appliance).  
   * **Compression** only applies to compression offered when replicating VMware VMs or physical servers to Azure. We estimate 30% or more, but you can modify the setting as required. For replicating Hyper-V VMs to Azure compression, you can use a third-party appliance such as Riverbed.
   * In **Retention Inputs**, specify how long replicas should be retained. If you're replicating VMware or physical servers, input the value in days. If you're replicating Hyper-V, specify the time in hours.
   * In **Number of hours in which initial replication for the batch of virtual machines should complete** and **Number of virtual machines per initial replication batch**, you input settings that are used to compute initial replication requirements.  When Site Recovery is deployed, the entire initial data set should be uploaded.

   ![Inputs](./media/site-recovery-capacity-planner/inputs.png)
4. After you've put in the values for the source environment, displayed output includes:

   * **Bandwidth required for delta replication** (MB/sec). Network bandwidth for delta replication is calculated on the average daily data change rate.
   * **Bandwidth required for initial replication** (MB/sec). Network bandwidth for initial replication is calculated on the initial replication values you put in.
   * **Storage required (in GBs)** is the total Azure storage required.
   * **Total IOPS on standard storage accounts** is calculated based on 8K IOPS unit size on the total standard storage accounts.  For the Quick Planner, the number is calculated based on all the source VMs disks and daily data change rate. For the Detailed Planner, the number is calculated based on total number of VMs that are mapped to standard Azure VMs, and data change rate on those VMs.
   * **Number of standard storage accounts** provides the total number of standard storage accounts needed to protect the VMs. A standard storage account can hold up to 20000 IOPS across all the VMs in a standard storage, and a maximum of 500 IOPS is supported per disk.
   * **Number of blob disks required** gives the number of disks that will be created on Azure storage.
   * **Number of premium storage accounts required** provides the total number of premium storage accounts needed to protect the VMs. A source VM with high IOPS (greater than 20000) needs  a premium storage account. A premium storage account can hold up to 80000 IOPS.
   * **Total IOPS on premium storage** is calculated based on 256K IOPS unit size on the total premium storage accounts.  For the Quick Planner, the number is calculated based on all the source VMs disks and daily data change rate. For the Detailed Planner, the number is calculated based on the total number of VMs that are mapped to premium Azure VM (DS and GS series), and the data change rate on those VMs.
   * **Number of configuration servers required** shows how many configuration servers are required for the deployment.
   * **Number of additional process servers required** shows whether additional process servers are required, in addition to the process server that's running on the configuration server by default.
   * **100% additional storage on the source** shows whether additional storage is required in the source location.

   ![Output](./media/site-recovery-capacity-planner/output.png)

## Run the Detailed Planner

1. Download and open the [Azure Site Recovery Capacity Planner](http://aka.ms/asr-capacity-planner-excel) tool. You need to run macros, so select to enable editing and enable content when prompted.
2. In **Select a planner type**, select **Detailed Planner** from the list box.

   ![Getting Started](./media/site-recovery-capacity-planner/getting-started-2.png)
3. In the **Workload Qualification** worksheet, enter the required information. You must fill in all the marked fields.

   * In **Processor cores**, specify the total number of cores on a source server.
   * In **Memory allocation in MB**, specify the RAM size of a source server.
   * The **Number of NICs**, specify the number of network adapters on a source server.
   * In **Total storage (in GB)**, specify the total size of the VM storage. For example, if the source server has 3 disks with 500 GB each, then total storage size is 1500 GB.
   * In **Number of disks attached**, specify the total number of disks of a source server.
   * In **Disk capacity utilization**, specify the average utilization.
   * In **Daily change rate (%)**, specify the daily data change rate of a source server.
   * In **Mapping Azure size**, enter the Azure VM size that you want to map. If you don't want to do this manually, click **Compute IaaS VMs**.If you input a manual setting, and then click Compute IaaS VMs, the manual setting might be overwritten because the compute process automatically identifies the best match on Azure VM size.

   ![Workload Qualification](./media/site-recovery-capacity-planner/workload-qualification.png)
4. If you click **Compute IaaS VMs** here's what it does:

   * Validates the mandatory inputs.
   * Calculates IOPS and suggests the best Azure VM aize match for each VMs that's eligible for replication to Azure. If an appropriate size of Azure VM can't be detected an error is issued. For example, if the number of disks attached in 65, an error is issued because the highest size Azure VM is 64.
   * Suggests a storage account that can be used for an Azure VM.
   * Calculates the total number of standard storage accounts and premium storage accounts required for the workload. Scroll down to view the Azure storage type, and the storage account that can be used for a source server.
   * Completes and sorts the rest of the table based on required storage type (standard or premium) assigned for a VM, and the number of disks attached. For all VMs that meet the requirements for Azure, the column **Is VM qualified?** shows **Yes**. If a VM can't be backed up to Azure, an error is shown.

Columns AA to AE are output, and provide information for each VM.

![Workload Qualification](./media/site-recovery-capacity-planner/workload-qualification-2.png)

### Example
As an example, for six VMs with the values shown in the table, the tool calculates and assigns the best Azure VM match, and the Azure storage requirements.

![Workload Qualification](./media/site-recovery-capacity-planner/workload-qualification-3.png)

* In the example output, note the following:

  * The first column is a validation column for the VMs, disks and churn.
  * Two standard storage accounts and one premium storage account are needed for five VMs.
  * VM3 doesn't qualify for protection, because one or more disks are more than 1 TB.
  * VM1 and VM2 can use the first standard storage account
  * VM4 can use the second standard storage account.
  * VM5 and VM6 need a premium storage account, and can both use a single account.

    > [!NOTE]
    > IOPS on standard and premium storage are calculated at the VM level, and not at disk level. A standard virtual machine can handle up to 500 IOPS per disk. If IOPS for a disk are greater than 500, you need premium storage. However, if IOPS for a disk are more than 500, but IOPS for the total VM disks are within the support standard Azure VM limits (VM size, number of disks, number of adapters, CPU, memory), then the planner picks a standard VM and not the DS or GS series. You need to manually update the mapping Azure size cell with appropriate DS or GS series VM.


1. After all the details are in place, click **Submit data to the planner tool** to open the **Capacity Planner** Workloads are highlighted, to show whether they're eligible for protection or not.

### Submit data in the Capacity Planner
1. When you open the **Capacity Planner** worksheet it's populated based on the settings you've specified. The word 'Workload' appears in the **Infra inputs source** cell, to show that the input is the **Workload Qualification** worksheet.
2. If you want to make changes, you need to modify the **Workload Qualification** worksheet, and click **Submit data to the planner tool** again.  

   ![Capacity Planner](./media/site-recovery-capacity-planner/capacity-planner.png)
