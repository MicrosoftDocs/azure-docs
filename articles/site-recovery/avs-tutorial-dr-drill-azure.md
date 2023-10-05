---
title: Run a disaster recovery drill from Azure VMware Solution to Azure by using Azure Site Recovery 
description: Learn how to run a disaster recovery drill from an Azure VMware Solution private cloud to Azure, by using Azure Site Recovery.
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 08/29/2023
ms.author: ankitadutta
ms.custom: MVC

---
# Run a disaster recovery drill from Azure VMware Solution to Azure

This tutorial describes how to run a disaster recovery drill for an Azure VMware Solution virtual machine (VM) to Azure by using the [Azure Site Recovery](site-recovery-overview.md) service. A drill validates your replication strategy without data loss.

This is the fourth tutorial in a series that shows you how to set up disaster recovery to Azure for Azure VMware Solution machines.

In this tutorial, learn how to:

> [!div class="checklist"]
>
> * Set up an isolated network for the test failover.
> * Prepare to connect to the Azure VM after failover.
> * Run a test failover for a single machine.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario. They use default options where possible, and they don't show all possible settings and paths. If you want to learn about the steps for a disaster recovery drill in more detail, review [this article](site-recovery-test-failover-to-azure.md).

## Prerequisites

Before you begin, complete the previous tutorials. Confirm that you finished these tasks:

1. [Set up Azure](avs-tutorial-prepare-azure.md) for disaster recovery to Azure.
2. [Prepare your Azure VMware Solution deployment](avs-tutorial-prepare-avs.md) to  for disaster recovery to Azure.
3. [Set up disaster recovery](avs-tutorial-replication.md) for Azure VMware Solution VMs.

## Verify VM properties

Before you run a test failover, verify the VM properties and make sure that the [VMware vSphere VM](vmware-physical-azure-support-matrix.md#replicated-machines) complies with Azure requirements:

1. In **Protected Items**, select **Replicated Items**, and then select the VM.
2. On the **Replicated item** pane, there's a summary of VM information, health status, and the latest available recovery points. Select **Properties** to view more details.
3. In **Compute and Network**, you can modify these properties as needed:

   * Azure name
   * Resource group
   * Target size
   * Availability set
   * Managed disk settings

   You can also view and modify network settings, including:

   * The network and subnet in which the Azure VM will be located after failover.
   * The IP address that will be assigned to the network and subnet.

4. In **Disks**, you can get information about the operating system and data disks on the VM.

## Create a network for test failover

We recommend that for test failover, you choose a network that's isolated from the production recovery site network that's specified in the **Compute and Network** settings for each VM. By default, when you create an Azure virtual network, it's isolated from other networks. The test network should mimic your production network as follows:

* The test network should have same number of subnets as the production network. Subnets should have the same names.
* The test network should use same IP address class and subnet range as the production network.
* Update the DNS of the test network with the IP address specified for the DNS VM in **Compute and Network** settings. For details, read [Test failover considerations](site-recovery-active-directory.md#test-failover-considerations).

## Run a test failover for a single VM

When you run a test failover, the following actions happen:

1. A prerequisites check runs to make sure that all of the conditions required for failover are in place.
2. Failover processes the data, so that an Azure VM can be created. If you select the latest recovery point, a recovery point is created from the data.
3. An Azure VM is created from the data processed in the previous step.

Run the test failover as follows:

1. In **Settings** > **Replicated Items**, select the VM, and then select **+Test Failover**.
2. Select the **Latest processed** recovery point for this tutorial. This step fails over the VM to the latest available point in time. The time stamp is shown.

   With this option, no time is spent processing data, so it provides a low recovery time objective (RTO).
3. In **Test Failover**, select the target Azure network to which Azure VMs will be connected after failover.
4. Select **OK** to begin the failover.

   You can track progress by selecting the VM to open its properties. Or you can select the **Test Failover** job in *vault name* > **Settings** > **Jobs** > **Site Recovery jobs**.
5. After the failover finishes, the replica Azure VM appears in the Azure portal, under **Virtual Machines**. Check that the VM is the appropriate size, that it's connected to the right network, and that it's running.

   You should now be able to connect to the replicated VM in Azure.
6. To delete Azure VMs created during the test failover, select **Cleanup test failover** on the VM. In **Notes**, record and save any observations associated with the test failover.

In some scenarios, failover requires additional processing that takes around 8 to 10 minutes to complete. You might notice longer test failover times for:

* VMware Linux machines.
* VMware VMs that don't have the DHCP service enabled.
* VMware VMs that don't have the following boot drivers: storvsc, vmbus, storflt, intelide, atapi.

## Connect after failover

If you want to connect to Azure VMs by using Remote Desktop Protocol (RDP) or Secure Shell (SSH) after failover, [prepare to connect](site-recovery-test-failover-to-azure.md#prepare-to-connect-to-azure-vms-after-failover). If you encounter any connectivity problems after failover, follow the [troubleshooting guide](site-recovery-failover-to-azure-troubleshoot.md).

## Next step

> [!div class="nextstepaction"]
> [Learn more about running a failover](avs-tutorial-failover.md)
