---
title: Prepare machines to set up disaster recovery between Azure regions after migration to Azure by using Site Recovery | Microsoft Docs
description: This article describes how to prepare machines to set up disaster recovery between Azure regions after migration to Azure by using Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: ponatara
manager: abhemraj
editor: ''

ms.assetid: 9126f5e8-e9ed-4c31-b6b4-bf969c12c184
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/22/2017
ms.author: ponatara

---
# Replicate Azure VMs to another region after migration to Azure by using Azure Site Recovery

>[!NOTE]
> Azure Site Recovery replication for Azure virtual machines (VMs) is currently in preview.

## Overview

This article helps you prepare Azure virtual machines for replication between two Azure regions after these machines have been migrated from an on-premises environment to Azure by using Azure Site Recovery.

## Disaster recovery and compliance
Today, more and more enterprises are moving their workloads to Azure. With enterprises moving mission-critical on-premises production workloads to Azure, setting up disaster recovery for these workloads is mandatory for compliance and to safeguard against any disruptions in an Azure region.

## Steps for preparing migrated machines for replication
To prepare migrated machines for setting up replication to another Azure region:

1. Complete migration.
2. Install the Azure agent if needed.
3. Remove the Mobility service.  
4. Restart the VM.

These steps are described in more detail in the following sections.

### Step 1: Migrate workloads running on Hyper-V VMs, VMware VMs, and physical servers to run on Azure VMs

To set up replication and migrate your on-premises Hyper-V, VMware, and physical workloads to Azure, follow the steps in the [Migrate Azure IaaS virtual machines between Azure regions with Azure Site Recovery](site-recovery-migrate-to-azure.md) article. 

After migration, you don't need to commit or delete a failover. Instead, select the **Complete Migration** option for each machine you want to migrate:
1. In **Replicated Items**, right-click the VM, and click **Complete Migration**. Click **OK** to complete the step. You can track progress in the VM properties by monitoring the Complete Migration job in **Site Recovery jobs**.
2. The **Complete Migration** action completes the migration process, removes replication for the machine, and stops Site Recovery billing for the machine.

   ![completemigration](./media/site-recovery-hyper-v-site-to-azure/migrate.png)

### Step 2: Install the Azure VM agent on the virtual machine
The Azure [VM agent](../virtual-machines/windows/classic/agents-and-extensions.md#azure-vm-agents-for-windows-and-linux) must be installed on the virtual machine for the Site Recovery extension to work and to help protect the VM.

>[!IMPORTANT]
>Beginning with version 9.7.0.0, on Windows virtual machines, the Mobility service installer also installs the latest available Azure VM agent. On migration, the virtual machine meets the
agent installation prerequisite for using any VM extension, including the Site Recovery extension. The Azure VM agent needs to be manually installed only if the Mobility service installed on the migrated machine is version 9.6 or earlier.

The following table provides additional information about installing the VM agent and validating that it was installed:

| **Operation** | **Windows** | **Linux** |
| --- | --- | --- |
| Installing the VM agent |Download and install the [agent MSI](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You need administrator privileges to complete the installation. |Install the latest [Linux agent](../virtual-machines/linux/agent-user-guide.md). You need administrator privileges to complete the installation. We recommend installing the agent from your distribution repository. We *do not recommend* installing the Linux VM agent directly from GitHub.  |
| Validating the VM agent installation |1. Browse to the C:\WindowsAzure\Packages folder in the Azure VM. You should see the WaAppAgent.exe file. <br>2. Right-click the file, go to **Properties**, and then select the **Details** tab. The **Product Version** field should be 2.6.1198.718 or higher. |N/A |


### Step 3: Remove the Mobility service from the migrated virtual machine

If you have migrated your on-premises VMware machines or physical servers on Windows/Linux, you need to manually remove/uninstall the Mobility service from the migrated virtual machine.

>[!IMPORTANT]
>This step is not required for Hyper-V VMs migrated to Azure.

#### Uninstall the Mobility service on a Windows Server VM
Use one of the following methods to uninstall the Mobility service on a Windows Server computer.

##### Uninstall by using the Windows UI
1. In the Control Panel, select **Programs**.
2. Select **Microsoft Azure Site Recovery Mobility Service/Master Target server**, and then select **Uninstall**.

##### Uninstall at a command prompt
1. Open a Command Prompt window as an administrator.
2. To uninstall the Mobility service, run the following command:

   ```
   MsiExec.exe /qn /x {275197FC-14FD-4560-A5EB-38217F80CBD1} /L+*V "C:\ProgramData\ASRSetupLogs\UnifiedAgentMSIUninstall.log"
   ```

#### Uninstall the Mobility service on a Linux computer
1. On your Linux server, sign in as a **root** user.
2. In a terminal, go to /user/local/ASR.
3. To uninstall the Mobility service, run the following command:

   ```
   uninstall.sh -Y
   ```

### Step 4: Restart the VM

After you uninstall the Mobility service, restart the VM before you set up replication to another Azure region.


## Next steps
- Start protecting your workloads by [replicating Azure virtual machines](site-recovery-azure-to-azure.md).
- Learn more about [networking guidance for replicating Azure virtual machines](site-recovery-azure-to-azure-networking-guidance.md).
