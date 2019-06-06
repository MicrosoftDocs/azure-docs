---
title: Set up disaster recovery for Azure VMs after migration to Azure with Azure Site Recovery | Microsoft Docs
description: This article describes how to prepare machines to set up disaster recovery between Azure regions after migration to Azure using Azure Site Recovery.
services: site-recovery
author: rayne-wiselman
ms.service: site-recovery
ms.topic: article
ms.date: 05/30/2019
ms.author: raynew
---

# Set up disaster recovery for Azure VMs after migration to Azure 


Follow this article if you've [migrated on-premises machines to Azure VMs](tutorial-migrate-on-premises-to-azure.md) using the [Site Recovery](site-recovery-overview.md) service, and you now want to get the VMs set up for disaster recovery to a secondary Azure region. The article describes how to ensure that the Azure VM agent is installed on migrated VMs, and how to remove the Site Recovery Mobility service that's no longer needed after migration.



## Verify migration

Before you set up disaster recovery, make sure that migration has completed as expected. To complete a migration successfully, after the failover, you should select the **Complete Migration** option, for each machine you want to migrate. 

## Verify the Azure VM agent

Each Azure VM must have the [Azure VM agent](../virtual-machines/extensions/agent-windows.md) installed. To replicate Azure VMs, Site Recovery installs an extension on the agent.

- If the machine is running version 9.7.0.0 or later of the Site Recovery Mobility service, the Azure VM agent is automatically installed by the Mobility service on Windows VMs. On earlier versions of the Mobility service, you need to install the agent automatically.
- For Linux VMs, you must install the Azure VM agent manually.You only need to install the Azure VM agent if the Mobility service installed on the migrated machine is v9.6 or earlier.


### Install the agent on Windows VMs

If you're running a version of the Site Recovery mobility service earlier than 9.7.0.0, or you have some other need to install the agent manually, do the following:  

1. Ensure you have admin permissions on the VM.
2. Download the [VM Agent installer](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409).
3. Run the installer file.

#### Validate the installation
To check that the agent is installed:

1. On the Azure VM, in the C:\WindowsAzure\Packages folder, you should see the WaAppAgent.exe file.
2. Right-click the file, and in **Properties**, select the **Details** tab.
3. Verify that the **Product Version** field shows 2.6.1198.718 or higher.

[Learn more](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-windows) about agent installation for Windows.

### Install the agent on Linux VMs

Install the [Azure Linux VM](../virtual-machines/extensions/agent-linux.md) agent manually as follows:

1. Make sure you have admin permissions on the machine.
2. We strongly recommend that you install the Linux VM agent using an RPM or a DEB package from your distribution's package repository. All the [endorsed distribution providers](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) integrate the Azure Linux agent package into their images and repositories.
    - We strongly recommend that you update the agent only through a distribution repository.
    - We don't recommend installing the Linux VM agent directly from GitHub and updating it.
    -  If the latest agent for your distribution is not available, contact distribution support for instructions on how to install it. 

#### Validate the installation 

1. Run this command: **ps -e** to ensure that the Azure agent is running on the Linux VM.
2. If the process isn't running, restart it by using the following commands:
    - For Ubuntu: **service walinuxagent start**
    - For other distributions: **service waagent start**


## Uninstall the Mobility service

1. Manually uninstall the Mobility service from the Azure VM, using one of the following methods. 
    - For Windows, in the Control Panel > **Add/Remove Programs**, uninstall **Microsoft Azure Site Recovery Mobility Service/Master Target server**. At an elevated command prompt, run:
        ```
        MsiExec.exe /qn /x {275197FC-14FD-4560-A5EB-38217F80CBD1} /L+*V "C:\ProgramData\ASRSetupLogs\UnifiedAgentMSIUninstall.log"
        ```
    - For Linux, sign in as a root user. In a terminal, go to **/user/local/ASR**, and run the following command:
        ```
        ./uninstall.sh -Y
        ```
2. Restart the VM before you configure replication.

## Next steps

[Review troubleshooting](site-recovery-extension-troubleshoot.md) for the Site Recovery extension on the Azure VM agent.
[Quickly replicate](azure-to-azure-quickstart.md) an Azure VM to a secondary region.
