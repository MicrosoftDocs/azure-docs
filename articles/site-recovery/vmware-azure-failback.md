---
title: Fail back from Azure during disaster recovery of VMware VMs to Azure with Azure Site Recovery | Microsoft Docs
description: Learn how to fail back to the on-premises site after failover to Azure, during disaster recovery of VMware VMs and physical servers to Azure.
author: mayurigupta13
manager: rochakm
ms.service: site-recovery
ms.date: 01/15/2019
ms.topic: conceptual
ms.author: mayg

---
# Fail back VMware VMs and physical servers from Azure to an on-premises site

This article describes how to fail back virtual machines from Azure Virtual Machines to an on-premises VMware environment. Follow the instructions in this article to fail back your VMware virtual machines or Windows/Linux physical servers after they've failed over from the on-premises site to Azure by using the [Failover in Azure Site Recovery](site-recovery-failover.md) tutorial.

## Prerequisites
- Make sure that you have read the details about the [different types of failback](concepts-types-of-failback.md) and corresponding caveats.

> [!WARNING]
> You can't fail back after you have either [completed migration](migrate-overview.md#what-do-we-mean-by-migration), moved a virtual machine to another resource group, or deleted the Azure virtual machine. If you disable protection of the virtual machine, you can't fail back.

> [!WARNING]
> A Windows Server 2008 R2 SP1 physical server, if protected and failed over to Azure, can't be failed back.

> [!NOTE]
> If you have failed over VMware virtual machines, you can't fail back to a Hyper-V host.


- Before you continue, complete the reprotect steps so that the virtual machines are in a replicated state and you can start a failover back to an on-premises site. For more information, see [How to reprotect from Azure to on-premises](vmware-azure-reprotect.md).

- Make sure that the vCenter is in a connected state before you do a failback. Otherwise, disconnecting disks and attaching them back to the virtual machine fails.

- During failover to Azure, the on-premises site might not be accessible, and the configuration server might be either unavailable or shut down. During reprotect and failback, the on-premises configuration server should be running and in a connected OK state. 

- During failback, the virtual machine must exist in the configuration server database or failback won't succeed. Make sure that you take regularly scheduled backups of your server. If a disaster occurs, you need to restore the server with the original IP address for failback to work.

- The master target server should not have any snapshots before triggering reprotect/failback.

## Overview of failback
After you have failed over to Azure, you can fail back to your on-premises site by executing the following steps:

1. [Reprotect](vmware-azure-reprotect.md) the virtual machines on Azure so that they start to replicate to VMware virtual machines in your on-premises site. As part of this process, you also need to:

	* Set up an on-premises master target. Use a Windows master target for Windows virtual machines and a [Linux master target](vmware-azure-install-linux-master-target.md) for Linux virtual machines.
	* Set up a [process server](vmware-azure-set-up-process-server-azure.md).
	* Start [reprotect](vmware-azure-reprotect.md) to turn off the on-premises virtual machine and synchronize the Azure virtual machine's data with the on-premises disks.

2. After your virtual machines on Azure replicate to your on-premises site, you start a failover from Azure to the on-premises site.

3. After your data fails back, you reprotect the on-premises virtual machines again so that they start replicating to Azure.

For a quick overview, watch the following video about how to fail back to an on-premises site:
> [!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/VMware-to-Azure-with-ASR-Video5-Failback-from-Azure-to-On-premises/player]


## Steps to fail back

> [!IMPORTANT]
> Before you start failback, make sure that you finished reprotection of the virtual machines. The virtual machines should be in a protected state, and their health should be **OK**. To reprotect the virtual machines, read [How to reprotect](vmware-azure-reprotect.md).

1. On the replicated items page, select the virtual machine. Right-click it to select **Unplanned Failover**.
2. In **Confirm Failover**, verify the failover direction (from Azure). Then select the recovery point (latest, or the latest app consistent) that you want to use for the failover. The app consistent point is behind the latest point in time and causes some data loss.
3. During failover, Site Recovery shuts down the virtual machines on Azure. After you check that failback completed as expected, you can check that the virtual machines on Azure shut down.
4. **Commit** is required to remove the failed-over virtual machine from Azure. Right-click the protected item, and then select **Commit**. A job removes the failed-over virtual machines in Azure.


## To what recovery point can I fail back the virtual machines?

During failback, you have two options to fail back the virtual machine/recovery plan.

- If you select the latest processed point in time, all virtual machines fail over to their latest available point in time. If there is a replication group within the recovery plan, each virtual machine of the replication group fails over to its independent latest point in time.

  You can't fail back a virtual machine until it has at least one recovery point. You can't fail back a recovery plan until all its virtual machines have at least one recovery point.

  > [!NOTE]
  > A latest recovery point is a crash-consistent recovery point.

- If you select the application-consistent recovery point, a single virtual machine failback recovers to its latest available application-consistent recovery point. In the case of a recovery plan with a replication group, each replication group recovers to its common available recovery point.
Application-consistent recovery points can be behind in time, and there might be loss in data.

## What happens to VMware tools post failback?

In the case of a Windows virtual machine, Site Recovery disables the VMware tools during failover. During failback of the Windows virtual machine, the VMware tools are reenabled. 


## Reprotect from on-premises to Azure
After failback finishes and you have started commit, the recovered virtual machines in Azure are deleted. Now, the virtual machine is back on the on-premises site, but it won’t be protected. To start to replicate to Azure again, do the following:

1. Select **Vault** > **Setting** > **Replicated items**, select the virtual machines that failed back, and then select **Re-Protect**.
2. Enter the value of the process server that needs to be used to send data back to Azure.
3. Select **OK** to begin the reprotect job.

> [!NOTE]
> After an on-premises virtual machine boots up, it takes some time for the agent to register back to the configuration server (up to 15 minutes). During this time, reprotect fails and returns an error message stating that the agent isn't installed. Wait for a few minutes, and then try reprotect again.

## Next steps

After the reprotect job finishes, the virtual machine replicates back to Azure, and you can do a [failover](site-recovery-failover.md) to move your virtual machines to Azure again.


