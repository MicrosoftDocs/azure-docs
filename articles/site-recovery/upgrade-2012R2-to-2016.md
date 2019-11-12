---
title: Upgrade Windows Server/System Center VMM 2012 R2 to Windows Server 2016-Azure Site Recovery 
description: Learn how to set up disaster recovery to Azure for Azure Stack VMs with the Azure Site Recovery service.
services: site-recovery
author: rajani-janaki-ram
manager: rochakm
ms.topic: conceptual
ms.service: site-recovery
ms.date: 12/03/2018
ms.author: rajanaki
---

# Upgrade Windows Server Server/System Center 2012 R2 VMM to Windows Server/VMM 2016 

This article shows you how to upgrade Windows Server 2012 R2 hosts & SCVMM 2012 R2 that are configured with Azure Site Recovery, to Windows Server 2016 & SCVMM 2016

Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy. The service ensures that your VM workloads remain available when expected and unexpected outages occur.

> [!IMPORTANT]
> When you upgrade Windows Server 2012 R2 hosts that are already configured for replication with Azure Site Recovery, you must follow the steps mentioned in this document. Any alternate path chosen for upgrade can result in unsupported states and can result in a break in replication or ability to perform failover.


In this article, you learn how to upgrade the following configurations in your environment:

> [!div class="checklist"]
> * **Windows Server 2012 R2 hosts which aren't managed by SCVMM** 
> * **Windows Server 2012 R2 hosts which are managed by a standalone SCVMM 2012 R2 server** 
> * **Windows Server 2012 R2 hosts which are managed by highly available SCVMM 2012 R2 server**


## Prerequisites & factors to consider

Before you upgrade, note the following:-

- If you have Windows Server 2012 R2 hosts that are not managed by SCVMM, and its a stand-alone environment setup, there will be a break in replication if you try to perform the upgrade.
- If you had selected "*not store my Keys in Active Directory under Distributed Key Management*" while installing SCVMM 2012 R2 in the first place, the upgrades will not complete successfully.

- If you are using System Center 2012 R2 VMM, 

    - Check the database information on VMM: **VMM console** -> **settings** -> **General** -> **Database connection**
    - Check the service accounts being used for System Center Virtual Machine Manager Agent service
    - Make sure that you have a backup of the VMM Database.
    - Note down the database name of the SCVMM servers involved. This can be done by navigating to **VMM console** -> **Settings** -> **General** -> **Database connection**
    - Note down the VMM ID of both the 2012R2 primary and recovery VMM servers. VMM ID can be found from the registry "HKLM:\SOFTWARE\Microsoft\Microsoft System Center Virtual Machine Manager Server\Setup”.
    - Ensure that you the new SCVMMs that you add to the cluster has the same names as was before. 

- If you are replicating between two of your sites managed by SCVMMs on both sides, ensure that you upgrade your recovery side first before you upgrade the primary side.
  > [!WARNING]
  > While upgrading the SCVMM 2012 R2, under Distributed Key Management, select to **store encryption keys in Active Directory**. Choose the settings for the service account and distributed key management carefully. Based on your selection, encrypted data such as passwords in templates might not be available after the upgrade, and can potentially affect replication with Azure Site Recovery

> [!IMPORTANT]
> Please refer to the detailed SCVMM documentation of [prerequisites](https://docs.microsoft.com/system-center/vmm/upgrade-vmm?view=sc-vmm-2016#requirements-and-limitations)

## Windows Server 2012 R2 hosts which aren't managed by SCVMM 
The list of steps mentioned below applies to the user configuration from [Hyper-V hosts to Azure](https://docs.microsoft.com/azure/site-recovery/hyper-v-azure-architecture) executed by following this [tutorial](https://docs.microsoft.com/azure/site-recovery/hyper-v-prepare-on-premises-tutorial)

> [!WARNING]
> As mentioned in the prerequisites, these steps only apply to a clustered environment scenario, and not in a stand-alone Hyper-V host configuration.

1. Follow the steps to perform the [rolling cluster upgrade.](https://docs.microsoft.com/windows-server/failover-clustering/cluster-operating-system-rolling-upgrade#cluster-os-rolling-upgrade-process) to execute the rolling cluster upgrade process.
2. With every new Windows Server 2016 host that is introduced in the cluster, remove the reference of a Windows Server 2012 R2 host from Azure Site Recovery by following steps mentioned [here]. This should be the host you chose to drain & evict from the cluster.
3. Once the *Update-VMVersion* command has been executed for all virtual machines, the upgrades have been completed. 
4. Use the steps mentioned [here](https://docs.microsoft.com/azure/site-recovery/hyper-v-azure-tutorial#set-up-the-source-environment) to register the new Windows Server 2016 host to Azure Site Recovery. Please note that the Hyper-V site is already active and you just need to register the new host in the cluster. 
5. 	Go to Azure portal and verify the replicated health status inside the Recovery Services

## Upgrade Windows Server 2012 R2 hosts managed by stand-alone SCVMM 2012 R2 server
Before you upgrade your Windows Sever 2012 R2 hosts,  you need to upgrade the SCVMM 2012 R2 to SCVMM 2016. Follow the below steps:-

**Upgrade standalone SCVMM 2012 R2 to SCVMM 2016**

1.  Uninstall ASR provider by navigating to Control Panel -> Programs -> Programs and Features ->Microsoft Azure Site Recovery , and click on Uninstall
2. [Retain the SCVMM database and upgrade the operating system](https://docs.microsoft.com/system-center/vmm/upgrade-vmm?view=sc-vmm-2016#back-up-and-upgrade-the-operating-system)
3. In **Add remove programs**, select **VMM** > **Uninstall**. b. Select **Remove Features**, and then select V**MM management Server and VMM Console**. c. In **Database Options**, select **Retain database**. d. Review the summary and click **Uninstall**.

4. [Install VMM 2016](https://docs.microsoft.com/system-center/vmm/upgrade-vmm?view=sc-vmm-2016#install-vmm-2016)
5. Launch SCVMM  and check status of each hosts under **Fabrics** tab. Click **Refresh** to get the most recent status. You should see status as “Needs Attention”. 
17.	Install the latest [Microsoft Azure Site Recovery Provider](https://aka.ms/downloaddra) on the SCVMM.
16.	Install the latest [Microsoft Azure Recovery Service (MARS) agent](https://aka.ms/latestmarsagent) on each host of the cluster. Refresh to ensure SCVMM is able to successfully query the hosts.

**Upgrade Windows Server 2012 R2 hosts to Windows Server 2016**

1. Follow the steps mentioned [here](https://docs.microsoft.com/windows-server/failover-clustering/cluster-operating-system-rolling-upgrade#cluster-os-rolling-upgrade-process) to execute the rolling cluster upgrade process. 
2. After adding the new host to the cluster, refresh the host from the SCVMM console to install the VMM Agent on this updated host.
3. Execute *Update-VMVersion* to update the VM versions of the Virtual machines. 
4. 	Go to Azure portal and verify the replicated health status of the virtual machines inside the Recovery Services Vault. 

## Upgrade Windows Server 2012 R2 hosts are managed by highly available SCVMM 2012 R2 server
Before you upgrade your Windows Sever 2012 R2 hosts,  you need to upgrade the SCVMM 2012 R2 to SCVMM 2016. The following modes of upgrade are supported while upgrading SCVMM 2012 R2 servers configured with Azure Site Recovery - Mixed mode with no additional VMM servers & Mixed mode with additional VMM servers.

**Upgrade SCVMM 2012 R2 to SCVMM 2016**

1.  Uninstall ASR provider by navigating to Control Panel -> Programs -> Programs and Features ->Microsoft Azure Site Recovery , and click on Uninstall
2. Follow the steps mentioned [here](https://docs.microsoft.com/system-center/vmm/upgrade-vmm?view=sc-vmm-2016#upgrade-a-standalone-vmm-server) based on the mode of upgrade you wish to execute.
3. Launch SCVMM console and check status of each hosts under **Fabrics** tab. Click **Refresh** to get the most recent status. You should see status as “Needs Attention”.
4. Install the latest [Microsoft Azure Site Recovery Provider](https://aka.ms/downloaddra) on the SCVMM.
5. Update the latest [Microsoft Azure Recovery Service (MARS) agent](https://aka.ms/latestmarsagent) on each host of the cluster. Refresh to ensure SC VMM is able to successfully query the hosts.


**Upgrade Windows Server 2012 R2 hosts to Windows Server 2016**

1. Follow the steps mentioned [here](https://docs.microsoft.com/windows-server/failover-clustering/cluster-operating-system-rolling-upgrade#cluster-os-rolling-upgrade-process) to execute the rolling cluster upgrade process.
2. After adding the new host to the cluster, refresh the host from the SCVMM console to install the VMM Agent on this updated host.
3. Execute *Update-VMVersion* to update the VM versions of the Virtual machines. 
4. 	Go to Azure portal and verify the replicated health status of the virtual machines inside the Recovery Services Vault. 

## Next steps
Once the upgrade of the hosts is performed, you can perform a [test failover](tutorial-dr-drill-azure.md) to test the health of your replication and disaster recovery status.

