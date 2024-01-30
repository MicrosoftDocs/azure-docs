---
title: Upgrade Windows Server and System Center VMM 2012 R2 to 2016 
description: Learn how to upgrade Windows Server 2012 R2 hosts and System Center Virtual Machine Manager 2012 R2 configured with Azure Site Recovery to Windows Server 2016 and Virtual Machine Manager 2016.
services: site-recovery
author: ankitaduttaMSFT
manager: gaggupta
ms.topic: conceptual
ms.service: site-recovery
ms.date: 03/02/2023
ms.author: ankitadutta
ms.custom: engagement-fy23
---

# Upgrade Windows Server and System Center VMM 2012 R2 to 2016

This article shows you how to upgrade Windows Server 2012 R2 hosts and System Center Virtual Machine Manager (VMM) 2012 R2 configured with Azure Site Recovery to Windows Server 2016 and VMM 2016.

Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy. The service ensures that your virtual machine (VM) workloads remain available when expected and unexpected outages occur.

> [!IMPORTANT]
> When you upgrade Windows Server 2012 R2 hosts that are already configured for replication with Azure Site Recovery, you must follow the steps mentioned in this article. Any alternative path chosen for upgrade can result in unsupported states and can affect replication or the ability to perform failover.

In this article, you learn how to upgrade the following configurations in your environment:

> [!div class="checklist"]
> * Windows Server 2012 R2 hosts that VMM doesn't manage
> * Windows Server 2012 R2 hosts that a standalone VMM 2012 R2 server manages
> * Windows Server 2012 R2 hosts that a highly available VMM 2012 R2 server manages

## Prerequisites and factors to consider

Before you upgrade, note the following:

- If you have Windows Server 2012 R2 hosts that VMM doesn't manage, and it's a standalone environment setup, there will be a break in replication if you try to perform the upgrade.
- If you selected **Do not store my keys in Active Directory under Distributed Key Management** while installing VMM 2012 R2, the upgrades won't finish successfully.

- If you're using VMM 2012 R2:

  - Check the database information on VMM. You can find it by going to the VMM console and selecting **Settings** > **General** > **Database connection**.
  - Check the service accounts that you're using for the System Center Virtual Machine Manager Agent service.
  - Make sure that you have a backup of the VMM database.
  - Note down the database names of the VMM servers involved. You can find them by going to the VMM console and selecting **Settings** > **General** > **Database connection**.
  - Note down the VMM IDs of the 2012 R2 primary and recovery VMM servers. You can find the VMM IDs in the registry: *HKLM:\SOFTWARE\Microsoft\Microsoft System Center Virtual Machine Manager Server\Setup*.
  - Ensure that the new VMM instances that you add to the cluster have the same names as before.

- If you're replicating between two sites managed by VMM on both sides, ensure that you upgrade the recovery side before you upgrade the primary side.
  > [!WARNING]
  > When you're upgrading VMM 2012 R2, under **Distributed Key Management**, select **Store encryption keys in Active Directory**. Choose the settings for the service account and distributed key management carefully. Based on your selections, encrypted data such as passwords in templates might not be available after the upgrade and can potentially affect replication with Azure Site Recovery.

For more information, see the detailed VMM [documentation of prerequisites](/system-center/vmm/upgrade-vmm?view=sc-vmm-2016&preserve-view=true#requirements-and-limitations).

## Windows Server 2012 R2 hosts that VMM doesn't manage

The following steps apply to the user configuration from [Hyper-V hosts to Azure](./hyper-v-azure-architecture.md). You can complete this configuration by following [this tutorial](./hyper-v-prepare-on-premises-tutorial.md).

> [!WARNING]
> As mentioned in the prerequisites, these steps apply only to a clustered environment scenario and not in a standalone Hyper-V host configuration.

1. Follow the [steps to perform the rolling cluster upgrade](/windows-server/failover-clustering/cluster-operating-system-rolling-upgrade#cluster-os-rolling-upgrade-process).
2. With every new Windows Server 2016 host that's introduced in the cluster, remove the reference of a Windows Server 2012 R2 host from Azure Site Recovery by [following these steps](./site-recovery-manage-registration-and-protection.md). This should be the host that you chose to drain and evict from the cluster.
3. Run the `Update-VMVersion` command for all virtual machines to complete the upgrades.
4. [Use these steps](./hyper-v-azure-tutorial.md#source-settings) to register the new Windows Server 2016 host to Azure Site Recovery. Note that the Hyper-V site is already active and you just need to register the new host in the cluster.
5. Go to the Azure portal and verify the replicated health status inside the Recovery Services vault.

## Upgrade Windows Server 2012 R2 hosts that a standalone VMM 2012 R2 server manages

Before you upgrade your Windows Server 2012 R2 hosts, you need to upgrade VMM 2012 R2 to VMM 2016. Use the following steps.

### Upgrade standalone VMM 2012 R2 to VMM 2016

1. Uninstall the Azure Site Recovery provider. Go to **Control Panel** > **Programs** > **Programs and Features** > **Microsoft Azure Site Recovery**, and then select **Uninstall**.
2. [Retain the VMM database and upgrade the operating system](/system-center/vmm/upgrade-vmm?view=sc-vmm-2016&preserve-view=true#back-up-and-upgrade-the-operating-system):

   a. In **Add or remove programs**, select **VMM** > **Uninstall**. 

   b. Select **Remove Features**, and then select **VMM management Server and VMM Console**.

   c. In **Database Options**, select **Retain database**.

   d. Review the summary and select **Uninstall**.

4. [Install VMM 2016](/system-center/vmm/upgrade-vmm?view=sc-vmm-2016&preserve-view=true#install-vmm-2016).
5. Open VMM and check the status of each host under the **Fabrics** tab. Select **Refresh** to get the most recent status. You should see a status of **Needs Attention**.
6. [Install the latest Azure Site Recovery provider (direct download)](https://aka.ms/downloaddra) on VMM.
7. Install the latest [Microsoft Azure Recovery Services (MARS) agent (direct download)](https://aka.ms/azurebackup_agent) on each host of the cluster. Refresh to ensure that VMM can successfully query the hosts.

## Upgrade Windows Server 2012 R2 hosts to Windows Server 2016

1. Follow [these steps](/windows-server/failover-clustering/cluster-operating-system-rolling-upgrade#cluster-os-rolling-upgrade-process) to perform the rolling cluster upgrade.
2. After you add the new host to the cluster, refresh the host from the VMM console to install the VMM agent on this updated host.
3. Run `Update-VMVersion` to update the versions of the virtual machines.
4. Go to the Azure portal and verify the replicated health status of the virtual machines inside the Recovery Services vault.

## Upgrade Windows Server 2012 R2 hosts that a highly available VMM 2012 R2 server manages

Before you upgrade your Windows Server 2012 R2 hosts, you need to upgrade VMM 2012 R2 to VMM 2016. The following modes of upgrade are supported while you're upgrading VMM 2012 R2 servers configured with Site Recovery mixed mode (either with or without additional VMM servers).

### Upgrade VMM 2012 R2 to VMM 2016

1. Uninstall the Azure Site Recovery provider. Go to **Control Panel** > **Programs** > **Programs and Features** > **Microsoft Azure Site Recovery**, and then select **Uninstall**.
2. Follow [these steps](/system-center/vmm/upgrade-vmm?view=sc-vmm-2016&preserve-view=true#upgrade-a-standalone-vmm-server) based on the mode of upgrade that you want to execute.
3. Open the VMM console and check the status of each host under the **Fabrics** tab. Select **Refresh** to get the most recent status. You should see a status of **Needs Attention**.
4. [Install the latest Azure Site Recovery provider (direct download)](https://aka.ms/downloaddra) on VMM.
5. Update the latest [MARS agent (direct download)](https://aka.ms/azurebackup_agent) on each host of the cluster. Refresh to ensure that VMM can successfully query the hosts.

### Upgrade Windows Server 2012 R2 hosts to Windows Server 2016

1. Follow [these steps](/windows-server/failover-clustering/cluster-operating-system-rolling-upgrade#cluster-os-rolling-upgrade-process) to perform the rolling cluster upgrade.
2. After you add the new host to the cluster, refresh the host from the VMM console to install the VMM agent on this updated host.
3. Run `Update-VMVersion` to update the VM versions of the virtual machines.
4. Go to the Azure portal and verify the replicated health status of the virtual machines inside the Recovery Services vault.

## Next steps

After you upgrade the hosts, you can perform a [test failover](tutorial-dr-drill-azure.md) to test the health of your replication and disaster recovery status.