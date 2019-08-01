---
title: Fail over and fail back Hyper-V VMs during disaster recovery to Azure with Azure Site Recovery | Microsoft Docs
description: Learn how to fail over and fail back Hyper-V VMs during disaster recovery to Azure using the Azure Site Recovery service.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 05/30/2019
ms.author: raynew
ms.custom: MVC
---

# Fail over and fail back Hyper-V VMs replicated to Azure

This tutorial describes how to fail over a Hyper-V VM to Azure. After you've failed over, you fail back to your on-premises site when it's available. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Verify the Hyper-V VM properties to check conform with Azure requirements
> * Run a failover to Azure
> * Fail back from Azure to on-premises
> * Reverse replicate on-premises VMs, to start replicating to Azure again

This tutorial is the fifth tutorial in a series. It assumes that you have already completed the tasks in the previous tutorials.    

1. [Prepare Azure](tutorial-prepare-azure.md)
2. [Prepare on-premises Hyper-V](tutorial-prepare-on-premises-hyper-v.md)
3. Set up disaster recovery for [Hyper-V VMs](tutorial-hyper-v-to-azure.md), or for [Hyper-V VMs managed in System Center VMM clouds](tutorial-hyper-v-vmm-to-azure.md)
4. [Run a disaster recovery drill](tutorial-dr-drill-azure.md)

## Prepare for failover and failback

Make sure there are no snapshots on the VM, and that the on-premises VM is turned off during failback. It helps ensure data consistency during replication. Don't turn on on-premises VM during failback. 

Failover and failback have three stages:

1. **Failover to Azure**: Failover Hyper-V VMs from the on-premises site to Azure.
2. **Failback to on-premises**: Failover Azure VMs to your on-premises site when the on-premises site is available. It starts synchronizing data from Azure to on-premises and on completion, it brings up the VMs on on-premises.  
3. **Reverse replicate on-premises VMs**: After failed back to on-premises, reverse replicate the on-premises VMs to start replicating them to Azure.

## Verify VM properties

Before failover verify the VM properties, and make sure that the VM meets with [Azure requirements](hyper-v-azure-support-matrix.md#replicated-vms).

In **Protected Items**, click **Replicated Items** > VM.

1. In the **Replicated item** pane, there's a summary of VM information, health status, and the
   latest available recovery points. Click **Properties** to view more details.

1. In **Compute and Network**, you can modify the Azure name, resource group, target size,
   [availability set](../virtual-machines/windows/tutorial-availability-sets.md), and managed disk settings.

1. You can view and modify network settings, including the network/subnet in which the Azure VM
   will be located after failover, and the IP address that will be assigned to it.

1. In **Disks**, you can see information about the operating system and data disks on the VM.

## Failover to Azure

1. In **Settings** > **Replicated items**, click the VM > **Failover**.
2. In **Failover**, select the **Latest** recovery point. 
3. Select **Shut down machine before beginning failover**. Site Recovery attempts to do a shutdown of source VMs before triggering the failover. Failover continues even if shutdown fails. You
   can follow the failover progress on the **Jobs** page.
4. After you verify the failover, click **Commit**. It deletes all the available recovery points.

> [!WARNING]
> **Don't cancel a failover in progress**: If you cancel in progress, failover stops, but the VM won't replicate again.

## Failback Azure VM to on-premises and reverse replicate the on-premises VM

Failback operation is basically a failover from Azure to the on-premises site and  in reverse replicate it again starts replicating VMs from the on-premises site to Azure.

1. In **Settings** > **Replicated items**, click the VM > **Planned Failover**.
2. In **Confirm Planned Failover**, verify the failover direction (from Azure), and select the source and target locations.
3. Select **Synchronize data before failover (synchronize delta changes only)**. This option minimizes VM downtime because it synchronizes without shutting down the VM.
4. Initiate the failover. You can follow the failover progress on the **Jobs** tab.
5. After the initial data synchronization is done and you're ready to shut down the Azure VMs click **Jobs** > planned-failover-job-name > **Complete Failover**. It shuts down the Azure VM, transfers the latest changes on-premises, and starts the on-premises VM.
6. Log on to the on-premises VM to check it's available as expected.
7. The on-premises VM is now in a **Commit Pending** state. Click **Commit**. It deletes the Azure VMs and its disks, and prepares the on-premises VM for reverse replication.
To start replicating the on-premises VM to Azure, enable **Reverse Replicate**. It triggers replication of delta changes that have occurred since the Azure VM was switched off.  
