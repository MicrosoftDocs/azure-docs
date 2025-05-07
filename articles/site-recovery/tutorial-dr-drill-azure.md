---
title: Run a disaster recovery drill to Azure with Azure Site Recovery 
description: Learn how to run a disaster recovery drill from on-premises to Azure, with Azure Site Recovery.
ms.service: azure-site-recovery
ms.topic: tutorial
ms.date: 05/23/2024
ms.custom: MVC
ms.author: ankitadutta
author: ankitaduttaMSFT

---
# Run a disaster recovery drill to Azure

This article describes how to run a disaster recovery drill for an on-premises machine to Azure using the [Azure Site Recovery](site-recovery-overview.md) service. A drill validates your replication strategy without data loss.


This is the fourth tutorial in a series that shows you how to set up disaster recovery to Azure for on-premises machines.

In this tutorial, learn how to:

> [!div class="checklist"]
> * Set up an isolated network for the test failover
> * Prepare to connect to the Azure VM after failover
> * Run a test failover for a single machine.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario. They use default options where possible, and don't show all possible settings and paths. If you want to learn about the disaster recovery drill steps in more detail, [review this article](site-recovery-test-failover-to-azure.md).

## Before you start

Complete the previous tutorials:

1. Make sure you've [set up Azure](tutorial-prepare-azure.md) for on-premises disaster recovery of VMware VMs, Hyper-V VMs, and physical machines to Azure.
2. Prepare your on-premises [VMware](vmware-azure-tutorial-prepare-on-premises.md) or [Hyper-V](hyper-v-prepare-on-premises-tutorial.md) environment for disaster recovery. If you're setting up disaster recovery for physical servers, review the [support matrix](vmware-physical-secondary-support-matrix.md).
3. Set up disaster recovery for [VMware VMs](vmware-azure-tutorial.md), [Hyper-V VMs](hyper-v-azure-tutorial.md), or [physical machines](physical-azure-disaster-recovery.md).
 

## Verify VM properties

Before you run a test failover, verify the VM properties, and make sure that the [Hyper-V VM](hyper-v-azure-support-matrix.md#replicated-vms), or [VMware VM](vmware-physical-azure-support-matrix.md#replicated-machines) complies with Azure requirements.

1. In **Protected Items**, click **Replicated Items** > and the VM.
2. In the **Replicated item** pane, there's a summary of VM information, health status, and the
   latest available recovery points. Click **Properties** to view more details.
3. In **Compute and Network**, you can modify the Azure name, resource group, target size, availability set, and managed disk settings.
4. You can view and modify network settings, including the network/subnet in which the Azure VM
   will be located after failover, and the IP address that will be assigned to it.
5. In **Disks**, you can see information about the operating system and data disks on the VM.

## Create a network for test failover

We recommended that for test failover, you choose a network that's isolated from the production recovery site network specific in the  **Compute and Network** settings for each VM. By default, when you create an Azure virtual network, it is isolated from other networks. The test network should mimic your production network:

- The test network should have same number of subnets as your production network. Subnets should have the same names.
- The test network should use the same IP address range.
- Update the DNS of the test network with the IP address specified for the DNS VM in **Compute and Network** settings. Read [test failover considerations for Active Directory](site-recovery-active-directory.md#test-failover-considerations) for more details.

## Run a test failover for a single VM

When you run a test failover, the following happens:

1. A prerequisites check runs to make sure all of the conditions required for failover are in
   place.
2. Failover processes the data, so that an Azure VM can be created. If you select the latest recovery
   point, a recovery point is created from the data.
3. An Azure VM is created using the data processed in the previous step.

Run the test failover as follows:

1. In **Settings** > **Replicated Items**, click the VM > **+Test Failover**.
2. Select the **Latest processed** recovery point for this tutorial. This fails over the VM to the latest available point in time. The time stamp is shown. With this option, no time is spent processing data, so it provides a low RTO (recovery time objective).
3. In **Test Failover**, select the target Azure network to which Azure VMs will be connected after
   failover occurs.
4. Click **OK** to begin the failover. You can track progress by clicking on the VM to open its
   properties. Or you can click the **Test Failover** job in vault name > **Settings** > **Jobs** >
   **Site Recovery jobs**.
5. After the failover finishes, the replica Azure VM appears in the Azure portal > **Virtual
   Machines**. Check that the VM is the appropriate size, that it's connected to the right network,
   and that it's running.
6. You should now be able to connect to the replicated VM in Azure.
7. To delete Azure VMs created during the test failover, click **Cleanup test failover** on the
  VM. In **Notes**, record and save any observations associated with the test failover.

In some scenarios, failover requires additional processing that takes around eight to ten minutes
to complete. You might notice longer test failover times for VMware Linux machines, VMware VMs that
don't have the DHCP service enables, and VMware VMs that don't have the following boot drivers:
storvsc, vmbus, storflt, intelide, atapi.

## Connect after failover

If you want to connect to Azure VMs using RDP/SSH after failover, [prepare to connect](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover). If you encounter any connectivity issues after failover, follow the [troubleshooting](site-recovery-failover-to-azure-troubleshoot.md) guide.

## Next steps

- [Run a failover and failback for VMware VMs](vmware-azure-tutorial-failover-failback.md)
- [Run a failover and failback for Hyper-V VMs](hyper-v-azure-failover-failback-tutorial.md)
- [Run a failover and failback for physical machines](physical-to-azure-failover-failback.md).
