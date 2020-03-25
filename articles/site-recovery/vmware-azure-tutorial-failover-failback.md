---
title: Fail over VMware VMs to Azure with Site Recovery 
description: Learn how to fail over VMware VMs to Azure in Azure Site Recovery
ms.service: site-recovery
ms.topic: tutorial
ms.date: 12/16/2019
ms.custom: MVC
---
# Fail over  VMware VMs

This article describes how to fail over an on-premises VMware virtual machine (VM) to Azure with [Azure Site Recovery](site-recovery-overview.md).

This is the fifth tutorial in a series that shows you how to set up disaster recovery to Azure for on-premises machines.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Verify that the VMware VM properties conform with Azure requirements.
> * Fail over specific VMs to Azure.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario. They use default options where possible and don't show all possible settings and paths. If you want to learn about failover in detail, see [Fail over VMs and physical servers](site-recovery-failover.md).

[Learn about](failover-failback-overview.md#types-of-failover) different types of failover. If you want to fail over multiple VMs in a recovery plan, review [this article](site-recovery-failover.md).

## Before you start

Complete the previous tutorials:

1. Make sure you've [set up Azure](tutorial-prepare-azure.md) for on-premises disaster recovery of VMware VMs, Hyper-V VMs, and physical machines to Azure.
2. Prepare your on-premises [VMware](vmware-azure-tutorial-prepare-on-premises.md) environment for disaster recovery. 
3. Set up disaster recovery for [VMware VMs](vmware-azure-tutorial.md).
4. Run a [disaster recovery drill](tutorial-dr-drill-azure.md) to make sure that everything's working as expected.

## Verify VM properties

Before you run a failover, check the VM properties to make sure that the VMs meet [Azure requirements](vmware-physical-azure-support-matrix.md#replicated-machines).

Verify properties as follows:

1. In **Protected Items**, select **Replicated Items**, and then select the VM you want to verify.

2. In the **Replicated item** pane, there's a summary of VM information, health status, and the
   latest available recovery points. Select **Properties** to view more details.

3. In **Compute and Network**, you can modify these properties as needed:
    * Azure name
    * Resource group
    * Target size
    * [Availability set](../virtual-machines/windows/tutorial-availability-sets.md)
    * Managed disk settings

4. You can view and modify network settings, including:

    * The network and subnet in which the Azure VM will be located after failover.
    * The IP address that will be assigned to it.

5. In **Disks**, you can see information about the operating system and data disks on the VM.

## Run a failover to Azure

1. In **Settings** > **Replicated items**, select the VM you want to fail over, and then select **Failover**.
2. In **Failover**, select a **Recovery Point** to fail over to. You can use one of the following options:
   * **Latest**: This option first processes all the data sent to Site Recovery. It provides the lowest Recovery Point Objective (RPO) because the Azure VM that's created after failover has all the data that was replicated to Site Recovery when the failover was triggered.
   * **Latest processed**: This option fails the VM over to the latest recovery point processed by Site Recovery. This option provides a low RTO (Recovery Time Objective) because no time is spent processing unprocessed data.
   * **Latest app-consistent**: This option fails the VM over to the latest app-consistent recovery point processed by Site Recovery.
   * **Custom**: This option lets you specify a recovery point.

3. Select **Shut down machine before beginning failover** to attempt to shut down source VMs before triggering the failover. Failover continues even if the shutdown fails. You can follow the failover progress on the **Jobs** page.

In some scenarios, failover requires additional processing that takes around 8 to 10 minutes to complete. You might notice longer test failover times for:

* VMware VMs running a Mobility service version older than 9.8.
* Physical servers.
* VMware Linux VMs.
* Hyper-V VMs protected as physical servers.
* VMware VMs that don't have the DHCP service enabled.
* VMware VMs that don't have the following boot drivers: storvsc, vmbus, storflt, intelide, atapi.

> [!WARNING]
> Don't cancel a failover in progress. Before failover is started, VM replication is stopped. If you cancel a failover in progress, failover stops, but the VM won't replicate again.

## Connect to failed-over VM

1. If you want to connect to Azure VMs after failover by using Remote Desktop Protocol (RDP) and Secure Shell (SSH), [verify that the requirements have been met]((ailover-failback-overview.md#connect-to-azure-after-failover).
2. After failover, go to the VM and validate by [connecting](../virtual-machines/windows/connect-logon.md) to it.
3. Use **Change recovery point** if you want to use a different recovery point after failover. After you commit the failover in the next step, this option will no longer be available.
4. After validation, select **Commit** to finalize the recovery point of the VM after failover.
5. After you commit, all the other available recovery points are deleted. This step completes the failover.

>[!TIP]
> If you encounter any connectivity issues after failover, follow the [troubleshooting guide](site-recovery-failover-to-azure-troubleshoot.md).

## Next steps

After failover, reprotect the Azure VMs to on-premises. Then, after the VMs are reprotected and replicating to the on-premises site, fail back from Azure when you're ready.

> [!div class="nextstepaction"]
> [Reprotect Azure VMs](vmware-azure-reprotect.md)
> [Fail back from Azure](vmware-azure-failback.md)
