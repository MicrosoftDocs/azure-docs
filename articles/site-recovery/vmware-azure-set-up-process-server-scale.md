---
title: Set up a process server in Azure to fail back during disaster recovery of VMware VMs and physical servers with Azure Site Recovery | Microsoft Docs'
description: This article describes how to set up a process server in Azure, to fail back from Azure to on-premises during disaster recovery of VMware VMs and physical servers.
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 4/23/2019
ms.author: ramamill
---

# Scale with additional process servers

By default, when you're replicating VMware VMs or physical servers to Azure using [Site Recovery](site-recovery-overview.md), a process server is installed on the configuration server machine, and is used to coordinate data transfer between Site Recovery and your on-premises infrastructure. To increase capacity and scale out your replication deployment, you can add additional standalone process servers. This article describes how to do this.

## Process Server selection guidance

Azure Site Recovery automatically identifies if Process Server is approaching it's usage limits and guide you to set up a scale out process server.

|Health Status  |Explanation  | Resource availability  | Recommendation|
|---------|---------|---------|---------|
| Healthy (Green)    |   Process server is connected and is healthy      |CPU and memory utilization is below 80%; Free space availability is above 30%| This process server can be used to protect additional servers. Ensure that the new workload is within the [defined process server limits](#sizing-requirements).
|Warning (Orange)    |   Process server is connected but certain resources are about to reach maximum limits  |   CPU and memory utilization is between 80% - 95%; Free space availability is between 25% - 30%       | Usage of process server is close to threshold values. Adding new servers to same process server will lead to crossing the threshold values and can impact existing protected items. So, it is advised to [setup a scale-out process server](#before-you-start) for new replications.
|Warning (Orange)   |   Process server is connected but data wasn't uploaded to Azure in last 30 min  |   Resource utilization is within threshold limits       | Troubleshoot [data upload failures](vmware-azure-troubleshoot-replication.md#monitor-process-server-health-to-avoid-replication-issues) before adding new workloads to same process server OR [setup a scale-out process server](#before-you-start) for new replications.
|Critical (Red)    |     Process server might be disconnected  |  Resource utilization is within threshold limits      | Troubleshoot [Process server connectivity issues](vmware-azure-troubleshoot-replication.md#monitor-process-server-health-to-avoid-replication-issues) OR [setup a scale-out process server](#before-you-start) for new replications.
|Critical (Red)    |     Resource utilization has crossed threshold limits |  CPU and memory utilization is above 95%; Free space availability is less than 25%.   | Adding new workloads to same process server is disabled as resource threshold limits are already met. So, [setup a scale-out process server](#before-you-start) for new replications.
Critical (Red)    |     Data wasn't uploaded from Azure to Azure in last 45 min. |  CPU and memory utilization is above 95%; Free space availability is less than 25%.      | Troubleshoot [data upload failures](vmware-azure-troubleshoot-replication.md#monitor-process-server-health-to-avoid-replication-issues) before adding new workloads to same process server OR [setup a scale-out process server](#before-you-start)

### 

A process server selected during Prepare Source step is marked green if

- it is in a connected state
- has sufficient resources (CPU, Memory, Free space) to handle on-going replication workload and is capable to handling at least 30% more of additional workload.


## Before you start

### Capacity planning

Make sure you've performed [capacity planning](site-recovery-plan-capacity-vmware.md) for VMware replication. This helps you to identify how and when you should deploy additional process servers.

> [!NOTE]
> Use of a cloned Process Server component is not supported. Follow the steps in this article for each PS scale-out.

### Sizing requirements 

Verify the sizing requirements summarized in the table. In general, if you have to scale your deployment to more than 200 source machines, or you have a total daily churn rate of more than 2 TB, you need additional process servers to handle the traffic volume.

| **Additional process server** | **Cache disk size** | **Data change rate** | **Protected machines** |
| --- | --- | --- | --- |
|4 vCPUs (2 sockets * 2 cores \@ 2.5 GHz), 8-GB memory |300 GB |250 GB or less |Replicate 85 or less machines. |
|8 vCPUs (2 sockets * 4 cores \@ 2.5 GHz), 12-GB memory |600 GB |250 GB to 1 TB |Replicate between 85-150 machines. |
|12 vCPUs (2 sockets * 6 cores \@ 2.5 GHz) 24-GB memory |1 TB |1 TB to 2 TB |Replicate between 150-225 machines. |

Where each protected source machine is configured with 3 disks of 100 GB each.

### Prerequisites

The prerequisites for the additional process server are summarized in the following table.

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-and-scaleout-process-server-requirements.md)]

## Download installation file

Download the installation file for the process server as follows:

1. Sign in to the Azure portal, and browse to your Recovery Services Vault.
2. Open **Site Recovery Infrastructure** > **VMWare and Physical Machines** > **Configuration Servers** (under For VMware & Physical Machines).
3. Select the configuration server to drill down into the server details. Then click **+ Process Server**.
4. In **Add Process server** >  **Choose where you want to deploy your process server**, select **Deploy a Scale-out Process Server on-premises**.

   ![Add Servers Page](./media/vmware-azure-set-up-process-server-scale/add-process-server.png)
1. Click **Download the Microsoft Azure Site Recovery Unified Setup**. This downloads the latest version of the installation file.

   > [!WARNING]
   > The process server installation version should be the same as, or earlier than, the configuration server version you have running. A simple way to ensure version compatibility is to use the same installer, that you most recently used to install or update your configuration server.

## Install from the UI

Install as follows. After setting up the server, you migrate source machines to use it.

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-add-process-server.md)]


## Install from the command line

Install by running the following command:

```
UnifiedSetup.exe [/ServerMode <CS/PS>] [/InstallDrive <DriveLetter>] [/MySQLCredsFilePath <MySQL credentials file path>] [/VaultCredsFilePath <Vault credentials file path>] [/EnvType <VMWare/NonVMWare>] [/PSIP <IP address to be used for data transfer] [/CSIP <IP address of CS to be registered with>] [/PassphraseFilePath <Passphrase file path>]
```

Where command line parameters are as follows:

[!INCLUDE [site-recovery-unified-setup-parameters](../../includes/site-recovery-unified-installer-command-parameters.md)]

For example:

```
MicrosoftAzureSiteRecoveryUnifiedSetup.exe /q /x:C:\Temp\Extracted
cd C:\Temp\Extracted
UNIFIEDSETUP.EXE /AcceptThirdpartyEULA /servermode "PS" /InstallLocation "D:\" /EnvType "VMWare" /CSIP "10.150.24.119" /PassphraseFilePath "C:\Users\Administrator\Desktop\Passphrase.txt" /DataTransferSecurePort 443
```
### Create a proxy settings file

If you need to set up a proxy, the ProxySettingsFilePath parameter takes a file as input. You can create the file as follows, and pass it as input ProxySettingsFilePath parameter.

```
* [ProxySettings]
* ProxyAuthentication = "Yes/No"
* Proxy IP = "IP Address"
* ProxyPort = "Port"
* ProxyUserName="UserName"
* ProxyPassword="Password"
```

## Next steps
Learn about [managing process server settings](vmware-azure-manage-process-server.md)
