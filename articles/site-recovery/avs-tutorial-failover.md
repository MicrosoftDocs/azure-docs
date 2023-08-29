---
title: Fail over Azure VMware Solution VMs to Azure by using Site Recovery 
description: Learn how to fail over Azure VMware Solution VMs to Azure in Azure Site Recovery.
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 08/29/2023
ms.author: ankitadutta
ms.custom: MVC, engagement-fy23
---
# Fail over Azure VMware Solution VMs

This tutorial describes how to fail over Azure VMware Solution virtual machines (VMs) to Azure by using [Azure Site Recovery](site-recovery-overview.md).

This is the fifth tutorial in a series that shows you how to set up disaster recovery to Azure for Azure VMware Solution VMs.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Verify that the Azure VMware Solution VM properties conform with Azure requirements.
> * Fail over specific VMs to Azure.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario. They use default options where possible, and they don't show all possible settings and paths. If you want to learn about failover in detail, see [Fail over VMs](site-recovery-failover.md).

To better understand the following tasks, you can learn about the [types of failover](failover-failback-overview.md#types-of-failover). If you want to fail over multiple VMs in a recovery plan, review [this article](site-recovery-failover.md).

## Prerequisites

Before you begin, complete the previous tutorials. Confirm that you finished these tasks:

1. [Set up Azure](avs-tutorial-prepare-azure.md) for disaster recovery to Azure.
2. [Prepare your Azure VMware Solution deployment](avs-tutorial-prepare-avs.md) for disaster recovery to Azure.
3. [Set up disaster recovery](avs-tutorial-replication.md) for Azure VMware Solution VMs.
4. [Run a disaster recovery drill](avs-tutorial-dr-drill-azure.md) to make sure that everything works as expected.

## Verify VM properties

Before you run a failover, check the VM properties to make sure that the VMs meet [Azure requirements](vmware-physical-azure-support-matrix.md#replicated-machines):

1. In **Protected Items**, select **Replicated Items**, and then select the VM that you want to verify.

2. On the **Replicated item** pane, there's a summary of VM information, health status, and the latest available recovery points. Select **Properties** to view more details.

3. In **Compute and Network**, you can modify these properties as needed:

   * Azure name
   * Resource group
   * Target size
   * [Availability set](../virtual-machines/windows/tutorial-availability-sets.md)
   * Managed disk settings

   You can also view and modify network settings, including:

    * The network and subnet in which the Azure VM will be located after failover.
    * The IP address that will be assigned to the network and subnet.

4. In **Disks**, you can get information about the operating system and data disks on the VM.

## Run a failover to Azure

1. In **Settings** > **Replicated items**, select the VM that you want to fail over, and then select **Failover**.
2. In **Failover**, for **Recovery Point**, select a recovery point to fail over to. You can use one of the following options:
   * **Latest**: This option first processes all the data sent to Site Recovery. It provides the lowest recovery point objective (RPO) because the Azure VM that's created after failover has all the data that was replicated to Site Recovery when the failover was triggered.
   * **Latest processed**: This option fails over the VM to the latest recovery point that Site Recovery processed. This option provides a low recovery time objective (RTO) because no time is spent processing unprocessed data.
   * **Latest app-consistent**: This option fails over the VM to the latest app-consistent recovery point that Site Recovery processed.
   * **Custom**: This option lets you specify a recovery point.

3. Select **Shut down machine before beginning failover** to try to shut down source VMs before triggering the failover. Failover continues even if the shutdown fails. You can follow the failover progress on the **Jobs** page.

In some scenarios, failover requires additional processing that takes around 8 to 10 minutes to complete. You might notice longer test failover times for:

* VMware vSphere VMs running a Mobility service version older than 9.8.
* VMware vSphere Linux VMs.
* VMware vSphere VMs that don't have the DHCP service enabled.
* VMware vSphere VMs that don't have the following boot drivers: storvsc, vmbus, storflt, intelide, atapi.

> [!WARNING]
> Don't cancel a failover in progress. Before failover is started, VM replication stops. If you cancel a failover in progress, failover stops, but the VM won't replicate again.

## Connect to a failed-over VM

If you want to connect to an Azure VM after failover by using Remote Desktop Protocol (RDP) and Secure Shell (SSH):

1. Verify that you meet [the requirements](failover-failback-overview.md#connect-to-azure-after-failover).
2. After failover, go to the VM and validate by [connecting](../virtual-machines/windows/connect-logon.md) to it.
3. Use **Change recovery point** if you want to use a different recovery point after failover. After you commit the failover in the next step, this option will no longer be available.
4. After validation, select **Commit** to finalize the recovery point of the VM after failover.

   After you commit, all the other available recovery points are deleted. This step completes the failover.

If you encounter any connectivity problems after failover, follow the [troubleshooting guide](site-recovery-failover-to-azure-troubleshoot.md).

## Next steps

After failover, reprotect the Azure VMs to the Azure VMware Solution private cloud. Then, after the VMs are reprotected and replicating to the Azure VMware Solution private cloud, fail back from Azure when you're ready.

> [!div class="nextstepaction"]
> [Reprotect Azure VMs](avs-tutorial-reprotect.md)

> [!div class="nextstepaction"]
> [Fail back from Azure](avs-tutorial-failback.md)
