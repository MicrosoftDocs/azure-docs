---
title: Run a disaster recovery drill for on-premises machines to Azure with Azure Site Recovery | Microsoft Docs
description: Learn about running disaster recovery drill from on-premises to Azure, with Azure Site Recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 10/10/2018
ms.author: raynew

---
# Run a disaster recovery drill to Azure

In this article, we show you how to run a disaster recovery drill for an on-premises machine to Azure, using a test failover. A drill validates your replication strategy without data loss.

This is the fourth tutorial in a series that shows you how to set up disaster recovery to Azure for on-premises VMware VMs, or Hyper-V VMs.

This tutorial presumes that you've completed the first three tutorials:
    - In the [first tutorial](tutorial-prepare-azure.md), we set up the Azure components needed for VMware disaster recovery.
    - In the [second tutorial](vmware-azure-tutorial-prepare-on-premises.md) , we prepared on-premises components for disaster recovery, and reviewed prerequisites.
    - In the [third tutorial](vmware-azure-tutorial.md) we set up and enabled replication for our on-premises VMware VM.
    - Tutorials are designed to show you the **simplest deployment path for a scenario**. They use default options where possible, and don't show all possible settings and paths. If you want to learn about the test failover steps in more detail, read the [How To Guide](site-recovery-test-failover-to-azure.md).

In this tutorial, learn how to:

> [!div class="checklist"]
> * Set up an isolated network for the test failover
> * Prepare to connect to the Azure VM after failover
> * Run a test failover for a single machine



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

## Prepare to connect to Azure VMs after failover

If you want to connect to Azure VMs using RDP/SSH after failover, follow the requirements summarized in the table [here](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover).

Follow the steps described [here](site-recovery-failover-to-azure-troubleshoot.md) to troubleshoot any connectivity issues post failover.

## Next steps

> [!div class="nextstepaction"]
> [Run a failover and failback for on-premises VMware VMs](vmware-azure-tutorial-failover-failback.md).
> [Run a failover and failback for on-premises Hyper-V VMs](hyper-v-azure-failover-failback-tutorial.md).
