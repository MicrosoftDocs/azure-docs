---
title: Fail back Azure VMware Solution VMsfrom Azure with Azure Site Recovery 
description: Learn how to failback to the Azure VMware Solution private cloud after failover to Azure, during disaster recovery.
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 09/30/2020
ms.author: ankitadutta
ms.custom: MVC

---
# Fail back VMs to Azure VMware Solution private cloud

This article describes how to failback Azure VMs to an Azure VMware Solution private cloud, following [failover](avs-tutorial-failover.md) of Azure VMware Solution VMs to Azure with [Azure Site Recovery](site-recovery-overview.md). After failback, you enable replication so that the Azure VMware Solution VMs start replicating to Azure.

## Before you start

1. Learn about [VMware vSphere failback](failover-failback-overview.md#vmwarephysical-reprotectionfailback). 
2. Make sure you've reviewed and completed the steps to [prepare for failback](vmware-azure-prepare-failback.md), and that all the required components are deployed. Components include a process server in Azure, a master target server, and a VPN site-to-site connection (or ExpressRoute private peering) for failback.
3. Make sure you've completed the [requirements](avs-tutorial-reprotect.md#before-you-begin) for reprotection and failback, and that you've [enabled reprotection](avs-tutorial-reprotect.md#enable-reprotection) of Azure VMs, so that they're replicating from Azure to the Azure VMware Solution private cloud. VMs must be in a replicated state in order to fail back.




## Run a failover to fail back

1. Make sure that Azure VMs are reprotected and replicating to the Azure VMware Solution private cloud.
    - A VM needs at least one recovery point in order to fail back.
    - If you fail back a recovery plan, then all machines in the plan should have at least one recovery point.
2. In the vault > **Replicated items**, select the VM. Right-click the VM > **Unplanned Failover**.
3. In **Confirm Failover**, verify the failover direction (from Azure).
4. Select the recovery point that you want to use for the failover.
    - We recommend that you use the **Latest** recovery point. The app-consistent point is behind the latest point in time, and causes some data loss.
    - **Latest** is a crash-consistent recovery point.
    - With **Latest**, a VM fails over to its latest available point in time. If you have a replication group for multi-VM consistency within a recovery plan, each VM in the group fails over to its independent latest point in time.
    - If you use an app-consistent recovery point, each VM fails back to its latest available point. If a recovery plan has a replication group, each group recovers to its common available recovery point.
5. Failover begins. Azure Site Recovery shuts down the Azure VMs.
6. After failover completes, check everything's working as expected. Check that the Azure VMs are shut down. 
7. With everything verified, right-click  the VM > **Commit**, to finish the failover process. Commit removes the failed-over Azure VM. 

> [!NOTE]
> For Windows VMs, Azure Site Recovery disables the VMware tools during failover. During failback of the Windows VM, the VMware tools are enabled again. 




## Reprotect from Azure VMware Solution to Azure

After committing the failback, the Azure VMs are deleted. The VM is back in the Azure VMware Solution private cloud, but it isn't protected. To start replicating VMs to Azure again,as follows:

1. In the vault > **Replicated items**, select failed back VMs, and then select **Re-Protect**.
2. Specify the process server that's used to send data back to Azure.
3. Select **OK** to begin the reprotect job.

> [!NOTE]
> After an Azure VMware Solution VM starts, it takes up to 15 minutes for the agent to register back to the configuration server. During this time, reprotect fails and returns an error message stating that the agent isn't installed. If this occurs, wait for a few minutes, and reprotect.

## Next steps

After the reprotect job finishes, the Azure VMware Solution VM is replicating to Azure. As needed, you can [run another failover](avs-tutorial-failover.md) to Azure.

