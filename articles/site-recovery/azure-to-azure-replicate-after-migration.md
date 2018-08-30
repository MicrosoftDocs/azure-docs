---
title: Set up disaster recovery for Azure VMs after migration to Azure with Azure Site Recovery | Microsoft Docs
description: This article describes how to prepare machines to set up disaster recovery between Azure regions after migration to Azure using Azure Site Recovery.
services: site-recovery
author: ponatara
ms.service: site-recovery
ms.topic: article
ms.date: 07/06/2018
ms.author: ponatara
---

# Set up disaster recovery for Azure VMs after migration to Azure 


Use this article after you've [migrated on-premises machines to Azure VMs](tutorial-migrate-on-premises-to-azure.md) using the [Site Recovery](site-recovery-overview.md) service. This article helps you to prepare the Azure VMs for setting up disaster recovery to a secondary Azure region, using Site Recovery.



## Before you start

Before you set up disaster recovery, make sure that migration has completed as expected. To complete a migration successfully, after the failover, you should select the **Complete Migration** option, for each machine you want to migrate. 



## Install the Azure VM agent

The Azure [VM agent](../virtual-machines/extensions/agent-windows.md) must be installed on the VM, so that the Site Recovery can replicate it.


1. To install the VM agent on VMs running Windows, download and run the [agent installer](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You need admin privileges on the VM to complete the installation.
2. To install the VM agent on VMs running Linux, install the latest [Linux agent](../virtual-machines/extensions/agent-linux.md). You need administrator privileges to complete the installation. We recommend you install from your distribution repository. We don't recommend installing the Linux VM agent directly from GitHub. 


## Validate the installation on Windows VMs

1. On the Azure VM, in the C:\WindowsAzure\Packages folder, you should see the WaAppAgent.exe file.
2. Right-click the file, and in **Properties**, select the **Details** tab.
3. Verify that the **Product Version** field shows 2.6.1198.718 or higher.



## Migration from VMware VMs or physical servers

If you migrate on-premises VMware VMs (or physical servers) to Azure, note that:

- You only need to install the Azure VM agent if the Mobility service installed on the migrated machine is v9.6 or earlier.
- On Windows VMs running version 9.7.0.0 of the Mobility service onwards, the service installer installs the latest available Azure VM agent. When you migrate, these VMs already meet the agent installation prerequisite for any VM extension, including the Site Recovery extension.
- You need to manually uninstall the Mobility service from the Azure VM, using one of the following methods. Restart the VM before you configure replication.
    - For Windows, in the Control Panel > **Add/Remove Programs**, uninstall **Microsoft Azure Site Recovery Mobility Service/Master Target server**. At an elevated command prompt, run:
        ```
        MsiExec.exe /qn /x {275197FC-14FD-4560-A5EB-38217F80CBD1} /L+*V "C:\ProgramData\ASRSetupLogs\UnifiedAgentMSIUninstall.log"
        ```
    - For Linux, sign in as a root user. In a terminal, go to **/user/local/ASR**, and run the following command:
        ```
        uninstall.sh -Y
        ```


## Next steps

[Quickly replicate](azure-to-azure-quickstart.md) an Azure VM to a secondary region.
