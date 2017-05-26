---
title: Prepare machines to setup Diaster Recovery between Azure regions after migration to Azure using Site Recovery | Microsoft Docs
description: This article describes how to prepare machines to setup Diaster Recovery between Azure regions after migration to Azure using Azure Site Recovery.
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
# Prepare machines to setup Diaster Recovery between Azure regions after migration to Azure using Azure Site Recovery

## Overview

This article details the guidance to prepare machines for setting up Disaster Recovery between two Azure regions after these machines have been migrated from on-premises environment to Azure using Azure Site Recovery.

## Why setup Disaster Recovery in Azure after migration?
Today, more and more enterprises are moving their workloads to Azure. With enterprises moving mission-critial on-premises production workloads to Azure, setting up disaster recovery for these workloads is mandatory for compliance reasons and to safeguard against any outages in an Azure region.

##Preparatory steps
Below are the steps to prepare migrated machines for DR.

a) Complete migration.

b) Install the Azure agent if needed.

c) Remove the mobility service  


### Migrate workloads running on on-premises Hyper-V VMs, VMware VMs, and physical servers, to run on Azure VMs:

Follow the steps detailed in this [article](site-recovery-migrate-to-azure.md) to setup replication and migrate your on-premises Hyper-V, VMware and physical workloads to Azure.

After migration, you don't need to commit a failover, or delete it. Instead, you select the **Complete Migration** option for each machine you want to migrate.
     - In **Replicated Items**, right-click the VM, and click **Complete Migration**. Click **OK** to complete. You can track progress in the VM properties, in by monitoring the Complete Migration job in **Site Recovery jobs**.
     - The **Complete Migration** action finishes up the migration process, removes replication for the machine, and stops Site Recovery billing for the machine.

![completemigration](./media/site-recovery-hyper-v-site-to-azure/migrate.png)

### Install the Azure VM Agent on the virtual machine
The Azure VM Agent must be installed on the virtual machine for the Site Recovery extension to work and to protect the machine. The Azure VM agent needs to be manually installed if the mobility service installed on the migrated machine is of version 9.6 and below.

>[!IMPORTANT]
>Beginning with version 9.7.0.0, on Windows virtual machines (VMs), the Mobility Service installer > also installs the latest available Azure VM agent. On migration, the virtual machine meets the
> agent installation prerequisite for using any VM extension, including the Site Recovery extension

 Learn about the [VM Agent](../virtual-machines/windows/classic/agents-and-extensions.md#azure-vm-agents-for-windows-and-linux).

The following table provides additional information about installing and validating that the VM Agent for Windows and Linux VMs is installed.

| **Operation** | **Windows** | **Linux** |
| --- | --- | --- |
| Installing the VM Agent |Download and install the [agent MSI](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You will need Administrator privileges to complete the installation. |<li> Install the latest [Linux agent](../virtual-machines/linux/agent-user-guide.md). You will need Administrator privileges to complete the installation. We recommend installing agent from your distribution repository. We **do not recommend** installing Linux VM agent directly from github.  |
| Validating the VM Agent installation |<li>Navigate to the *C:\WindowsAzure\Packages* folder in the Azure VM. <li>You should find the WaAppAgent.exe file present.<li> Right-click the file, go to **Properties**, and then select the **Details** tab. The Product Version field should be 2.6.1198.718 or higher. |N/A |


###Remove Mobility Service from the migrated virtual machine

If you have migrated your on-premises VMware machines or physical servers on Windows/Linux, you need to manually remove/uninstall the mobility service from the migrated virtual machine.

#### Uninstall Mobility Service on a Windows Server computer
Use one of the following methods to uninstall Mobility Service on a Windows Server computer.

##### Uninstall by using the GUI
1. In Control Panel, select **Programs**.
2. Select **Microsoft Azure Site Recovery Mobility Service/Master Target server**, and then select **Uninstall**.

##### Uninstall at a command prompt
1. Open a Command Prompt window as an administrator.
2. To uninstall Mobility Service, run the following command:

```
MsiExec.exe /qn /x {275197FC-14FD-4560-A5EB-38217F80CBD1} /L+*V "C:\ProgramData\ASRSetupLogs\UnifiedAgentMSIUninstall.log"
```

#### Uninstall Mobility Service on a Linux computer
1. On your Linux server, sign in as a **root** user.
2. In a terminal, go to /user/local/ASR.
3. To uninstall Mobility Service, run the following command:

```
uninstall.sh -Y
```
####


###Set up Disaster Recovery between Azure regions:

After the agent is removed, setup DR replication for the machine using the steps mentioned  in [this document](site-recovery-azure-to-azure.md)


## Next steps
- Start protecting your workloads by [replicating Azure virtual machines](site-recovery-azure-to-azure.md)
* Lear more about [networking guidance for replicating Azure virtual machines](site-recovery-azure-to-azure-networking-guidance.md)
