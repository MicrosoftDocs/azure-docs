---
title: Fail over and fail back Hyper-V VMs replicated to Azure with Site Recovery | Microsoft Docs
description: Learn how to fail over Hyper-V VMs to Azure, and fail back to the on-premises site, with Azure Site Recovery
services: site-recovery
author: rayne-wiselman
ms.service: site-recovery
ms.topic: article
ms.date: 03/8/2018
ms.author: raynew
---

# Fail over and fail back Hyper-V VMs replicated to Azure

This tutorial describes how to fail over a Hyper-V VM to Azure. After you've failed over, you fail back to your on-premises site when it's available. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Verify the Hyper-V VM properties to check conform with Azure requirements
> * Run a failover to Azure
> * Reprotect Azure VMs to the on-premises site
> * Fail back from Azure to on-premises
> * Reprotect on-premises VMs, to start replicating to Azure again

This is the fifth tutorial in a series. This tutorial assumes that you have already completed the
tasks in the previous tutorials.

1. [Prepare Azure](tutorial-prepare-azure.md)
2. [Prepare on-premises VMware](tutorial-prepare-on-premises-hyper-v.md)
3. Set up disaster recovery for [Hyper-V VMs](tutorial-hyper-v-to-azure.md), or for [Hyper-V VMs managed in System Center VMM clouds](tutorial-hyper-v-vmm-to-azure.md)
4. [Run a disaster recovery drill](tutorial-dr-drill-azure.md)

## Prepare for failover and failback

Make sure there are no snapshots on the VM, and that the on-premises VM is turned off during reprotection. This helps ensure data consistency during replication. Don't turn on the VM after reprotection finishes. 

Failover and failback has four stages:

1. **Fail over to Azure**: Fail machines over from the on-premises site to Azure.
2. **Reprotect Azure VMs**: Reprotect the Azure VMs, so that they start replicating back to the
   on-premises Hyper-V VMs.
3. **Fail over to on-premises**: Run a failover from Azure to your on-premises site, when it's available.
4. **Reprotect on-premises VMs**: After data has failed back, reprotect the on-premises VMs to start replicating them to Azure.

## Verify VM properties

Verify the VM properties, and make sure that the VM complies with [Azure requirements](hyper-v-azure-support-matrix.md#replicated-vms).

1. In **Protected Items**, click **Replicated Items** > <VM-name>.

2. In the **Replicated item** pane, review the VM information, health status, and the latest available recovery points. Click **Properties** to view more details.
     - In **Compute and Network**, you can modify the VM settings, and network settings, including the network/subnet in which the Azure VM. Managed disks aren't supported for failback from Azure to Hyper-V.
   will be located after failover, and the IP address that will be assigned to it.
    - In **Disks**, you can see information about the operating system and data disks on the VM.

## Fail over to Azure

1. In **Settings** > **Replicated items** click the VM > **Failover**.
2. In **Failover** select the **Latest** recovery point. 
3. Select **Shut down machine before beginning failover**. Site Recovery attempts to do a shutdown of source VMs before triggering the failover. Failover continues even if shutdown fails. You
   can follow the failover progress on the **Jobs** page.
4. After you verify the failover click **Commit**. This deletes all the available recovery points.

> [!WARNING]
> **Don't cancel a failover in progress**: Before failover is started, VM replication is stopped. If you cancel in progress, failover stops, but the VM won't replicate again.

## Reprotect Azure VMs

1. In the **AzureVMVault** > **Replicated items**, right-click the VM that was failed over, and select **Re-Protect**.
2. Verify that the protection direction is set to **Azure to On-premises**.
3. The on-premises VM is turned off during reprotection, to help ensure data consistency. Don't turn it on after reprotection finished.
4. After the reprotection process, the VM starts replicating from Azure to the on-premises site.



## Fail over from Azure and reprotect the on-premises VM

Fail over from Azure to the on-premises site, and start replicating VMs from the on-premises site to Azure.

1. In **Settings** > **Replicated items**, click the VM > **Planned Failover**.
2. In **Confirm Planned Failover**, verify the failover direction (from Azure), and select the source and target locations.
3. Select **Synchronize data before failover (synchronize delta changes only)**. This option minimizes VM downtime because it synchronizes without shutting down the VM.
4. Initiate the failover. You can follow the failover progress on the **Jobs** tab.
5. After the initial data synchronization is done and you're ready to shut down the Azure VMs click **Jobs** > planned-failover-job-name > **Complete Failover**. This shuts down the Azure VM, transfers the latest changes on-premises, and starts the on-premises VM.
6. Log on to the on-premises VM to check it's available as expected.
7. The on-premises VM is now in a **Commit Pending** state. Click **Commit**. This deletes the Azure VMs and its disks, and prepares the on-premises VM for reverse replication.
To start replicating the on-premises VM to Azure, enable **Reverse Replicate**. This triggers replication of delta changes that have occurred since the Azure VM was switched off.  
