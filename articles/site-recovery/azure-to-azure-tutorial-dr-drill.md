---
title: Run an Azure VM disaster recovery drill with Azure Site Recovery
description: Learn how to run a disaster recovery drill to a secondary region for Azure VMs using the Azure Site Recovery service.
services: site-recovery
ms.topic: tutorial
ms.date: 01/16/2020
ms.custom: mvc
---

# Run a disaster recovery drill to a secondary region for Azure VMs

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business apps up and running available during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VMs), including replication, failover, and recovery.

This tutorial shows you how to run a disaster recovery drill for an Azure VM, from one Azure region to another, with a test failover. A drill validates your replication strategy without data loss or downtime, and doesn't affect your production environment. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Check the prerequisites
> * Run a test failover for a single VM

> [!NOTE]
> This tutorial helps you to perform a disaster recovery drill with minimal steps. To learn more about the various functions related to doing a disaster recovery drill, see the documentation for Azure VMs [replication](azure-to-azure-how-to-enable-replication.md), [networking](azure-to-azure-about-networking.md), [automation](azure-to-azure-powershell.md), or [troubleshooting](azure-to-azure-troubleshoot-errors.md).

## Prerequisites

Check the following items before you do this tutorial:

- Before you run a test failover, we recommend that you check the VM's properties to make sure it's configured for disaster recovery. Go to the VM's **Operations** > **Disaster Recovery** > **Properties** to view the replication and failover properties.
- **We recommend you use a separate Azure VM network for the test failover**, and not the default network that was set up when you enabled replication.
- Depending on your source networking configurations for each NIC, you can specify **Subnet**, **Private IP address**, **Public IP**, **Network security group**, or **Load balancer** to attach to each NIC under test failover settings in **Compute and Network** before doing a disaster recovery drill.

## Run a test failover

This example shows how to use a Recovery Services vault to do a VM test failover.

1. Select a vault and go to **Protected items** > **Replicated items** and select a VM.
1. In **Test Failover**, select a recovery point to use for the failover:
   - **Latest**: Processes all the data in Site Recovery and provides the lowest RTO (Recovery Time Objective).
   - **Latest processed**: Fails the VM over to the latest recovery point that was processed by Site Recovery. The time stamp is shown. With this option, no time is spent processing data, so it provides a low RTO.
   - **Latest app-consistent**: This option fails over all VMs to the latest app-consistent recovery point. The time stamp is shown.
   - **Custom**: Fail over to particular recovery point. Custom is only available when you fail over a single VM, and not for failover with a recovery plan.
1. Select the target Azure virtual network that Azure VMs in the secondary region will connect to after the failover.

   > [!NOTE]
   > If the test failover settings are pre-configured for the replicated item, the dropdown menu to select an Azure virtual network isn't visible.

1. To start the failover, select **OK**. To track the progress from the vault, go to **Monitoring** > **Site Recovery jobs** and select the **Test Failover** job.
1. After the failover finishes, the replica Azure VM appears in the Azure portal's **Virtual Machines**. Make sure that the VM is running, sized appropriately, and connected to the appropriate network.
1. To delete the VMs that were created during the test failover, select **Cleanup test failover** on the replicated item or the recovery plan. In **Notes**, record and save any observations associated with the test failover.

## Next steps

> [!div class="nextstepaction"]
> [Run a production failover](azure-to-azure-tutorial-failover-failback.md)
