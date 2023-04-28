---
title:  Tutorial to run an Azure VM disaster recovery drill with Azure Site Recovery
description: In this tutorial, run an Azure VM disaster recovery drill to another region using Site Recovery.
services: site-recovery
ms.topic: tutorial
ms.date: 11/05/2020
ms.custom: mvc
ms.author: ankitadutta
#Customer intent: As an Azure admin, I want to run a drill to check that VM disaster recovery is working.
---

# Tutorial: Run a disaster recovery drill for Azure VMs

Learn how to run a disaster recovery drill to another Azure region, for Azure VMs replicating with [Azure Site Recovery](site-recovery-overview.md). In this article, you:

> [!div class="checklist"]
> * Verify prerequisites
> * Check VM settings before the drill
> * Run a test failover
> * Clean up after the drill


> [!NOTE]
> This tutorial provides minimal steps for running a disaster recovery drill. If you want to run a drill with full infrastructure testing,  learn about Azure VM [networking](azure-to-azure-about-networking.md), [automation](azure-to-azure-powershell.md), and [troubleshooting](azure-to-azure-troubleshoot-errors.md).

## Prerequisites

Before you start this tutorial, you must enable disaster recovery for one or more Azure VMs. To do this, [complete the first tutorial](azure-to-azure-tutorial-enable-replication.md) in this series.

## Verify VM settings

1. In the vault > **Replicated items**, select the VM.

    ![Option to open Disaster Recovery page in VM properties](./media/azure-to-azure-tutorial-dr-drill/vm-settings.png)

2. On the **Overview** page, check that the VM is protected and healthy.
3. When you run a test failover, you select an Azure virtual network in the target region. The Azure VM created after failover is placed in this network. 

    - In this tutorial, we select an existing network when we run the test failover.
    - We recommend you choose a non-production network for the drill, so that IP addresses and networking components remain available in production networks.
   - You can also preconfigure network settings to be used for test failover. Granular settings you can assign for each NIC include subnet, private IP address, public IP address, load balancer, and network security group. We're not using this method here, but you can [review this article](azure-to-azure-customize-networking.md#customize-failover-and-test-failover-networking-configurations) to learn more.


## Run a test failover


1. On the **Overview** page, select **Test Failover**.

    
    ![Test failover button for the replicated item](./media/azure-to-azure-tutorial-dr-drill/test-failover-button.png)

2. In **Test Failover**, choose a recovery point. The Azure VM in the target region is created using data from this recovery point.
  
   - **Latest processed**: Uses the latest recovery point processed by Site Recovery. The time stamp is shown. No time is spent processing data, so it provides a low recovery time objective (RTO).
   -  **Latest**: Processes all the data sent to Site Recovery, to create a recovery point for each VM before failing over to it. Provides the lowest recovery point objective (RPO), because all data is replicated to Site Recovery when the failover is triggered.
   - **Latest app-consistent**: This option fails over VMs to the latest app-consistent recovery point. The time stamp is shown.
   - **Custom**: Fail over to particular recovery point. Custom is only available when you fail over a single VM, and don't use a recovery plan.

3. In **Azure virtual network**, select the target network in which to place Azure VMs created after failover. Select a non-production network if possible, and not the network that was created when you enabled replication.

    ![Test failover settings page](./media/azure-to-azure-tutorial-dr-drill/test-failover-settings.png)    

4. To start the failover, select **OK**.
5. Monitor the test failover in notifications.

    ![Progress notification](./media/azure-to-azure-tutorial-dr-drill/notification-start-test-failover.png)
    ![Success notification](./media/azure-to-azure-tutorial-dr-drill/notification-finish-test-failover.png)     


5. After the failover finishes, the Azure VM created in the target region appears in the Azure portal **Virtual Machines**. Make sure that the VM is running, sized appropriately, and connected to the network you selected.

## Clean up resources

1. In the **Essentials** page, select **Cleanup test failover**.

    ![Button to start the cleanup process](./media/azure-to-azure-tutorial-dr-drill/select-cleanup.png)

2. In **Test failover cleanup** > **Notes**, record and save any observations associated with the test failover. 
3. Select **Testing is complete** to delete VMs created during the test failover.

    ![Page with cleanup options](./media/azure-to-azure-tutorial-dr-drill/cleanup-failover.png)

4. Monitor cleanup progress in notifications.

    ![Cleanup progress notification](./media/azure-to-azure-tutorial-dr-drill/notification-start-cleanup.png)
    ![Cleanup success notification](./media/azure-to-azure-tutorial-dr-drill/notification-finish-cleanup.png)

## Next steps

In this tutorial, you ran a disaster recovery drill to check that failover works as expected. Now you can try out a full failover.

> [!div class="nextstepaction"]
> [Run a production failover](azure-to-azure-tutorial-failover-failback.md)
