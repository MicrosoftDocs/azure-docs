---
title: 'Tutorial: Monitor network communication between two VMs - Azure portal'
titleSuffix: Azure Network Watcher
description: In this tutorial, learn how to monitor network communication between two Azure virtual machines with Azure Network Watcher's connection monitor capability.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: tutorial
ms.date: 09/29/2023

#CustomerIntent: As an Azure administrator, I want to monitor the communication between two virtual machines in Azure so I can be alerted if the communication fails to take actions. I alow want to know why the communication failed, so that I can resolve the problem. 
---

# Tutorial: Monitor network communication between two virtual machines using the Azure portal

Successful communication between a virtual machine (VM) and an endpoint such as another VM, can be critical for your organization. Sometimes, configuration changes break communication.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create two virtual machines
> * Monitor communication between the two virtual machines
> * Diagnose a communication problem between the two virtual machines

:::image type="content" source="./media/monitor-vm-communication/monitor-vm-connection-tutorial-diagram.png" alt-text="Diagram shows the resources created in the tutorial.":::

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription.

## Create a virtual network

In this section, you create **myVNet** virtual network with two subnets and an Azure Bastion host. The first subnet is used for the virtual machine, and the second subnet is used for the Bastion host.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *virtual networks*. Select **Virtual networks** from the search results.

    :::image type="content" source="./media/monitor-vm-communication/virtual-network-azure-portal.png" alt-text="Screenshot shows searching for virtual networks in the Azure portal.":::

1. Select **+ Create**. In **Create virtual network**, enter or select the following values in the **Basics** tab:

    | Setting | Value |
    | --- | --- |
    | **Project details** |  |
    | Subscription | Select your Azure subscription. |
    | Resource Group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. |
    | **Instance details** |  |
    | Virtual network name | Enter *myVNet*. |
    | Region | Select **(US) East US**. |

1. Select the **IP Addresses** tab, or select the **Next** button at the bottom of the page twice. 

1. Accept the default IP address space **10.0.0.0/16**.

1. Select the pencil icon next to **default** subnet to rename it. Under **Subnet details** in the **Edit subnet** page, enter *mySubnet* for the **Name** and then select **Save**.

1. Select **Review + create**.

1. Review the settings, and then select **Create**. 

## Create two virtual machines

In this section, you create two virtual machines: **myVM1** and **myVM2** to test the connection between them.

### Create the first virtual machine

1. In the search box at the top of the portal, enter *virtual machine*. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **+ Create** then **+ Azure virtual machine**.

1. Enter or select the following information in the **Basics** tab of **Create a virtual machine**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. | 
    | **Instance details** |   |
    | Virtual machine name | Enter *myVM1*. |
    | Region | Select **(US) East US**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Leave the default of **Standard**. |
    | Image | Select **Ubuntu Server 20.04 LTS - x64 Gen2**. |
    | Size | Choose a size or leave the default setting. |
    | **Administrator account** |   |
    | Authentication type | Select **Password**. |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |

1. Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

1. In the Networking tab, select the following values:

    | Setting | Value |
    | --- | --- |
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **mySubnet**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **None**. |

1. Select **Review + create**.

1. Review the settings, and then select **Create**. 

### Create the second virtual machine

Repeat the steps in the previous section to create the second virtual machine and enter *myVM2* for the virtual machine name.

## Create a connection monitor

In this section, you create a connection monitor to monitor communication over TCP port 3389 from *myVm1* to *myVm2*.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher**.

1. Under **Monitoring**, select **Connection monitor**.

1. Select **+ Create**.

    :::image type="content" source="./media/monitor-vm-communication/connection-monitor.png" alt-text="Screenshot shows Connection monitor page in the Azure portal.":::

1. Enter or select the following information in the **Basics** tab of **Create Connection Monitor**:

    | Setting | Value |
    | ------- | ----- |
    | Connection Monitor Name | Enter *myConnectionMonitor*. |
    | Subscription | Select your subscription. |
    | Region | Select **East US**. | 
    | **Workspace configuration** |   |
    | Virtual machine name | Enter *myVM1*. |
    | Region | Select **(US) East US**. |
    | Workspace configuration | Leave the default. |

    :::image type="content" source="./media/monitor-vm-communication/create-connection-monitor-basics.png" alt-text="Screenshot shows the Basics tab of creating a connection monitor in the Azure portal.":::

1. Select the **Test groups** tab, or select **Next: Test groups** button.

1. Enter *myTestGroup* in **Test group name**.

1. In the **Add test group details** page, select **+ Add sources** to add the source virtual machine.

1. In the **Add sources** page, select **myVM1** as the source endpoint, and then select **Add endpoints**.

    :::image type="content" source="./media/monitor-vm-communication/add-source-endpoint.png" alt-text="Screenshot shows how to add a source endpoint for a connection monitor in the Azure portal.":::

    > [!NOTE]
    > You can use **Subscription**, **Resource group**, **VNET**, or **Subnet** filters to narrow down the list of virtual machines.

1. In the **Add test group details** page, select **Add Test configuration**, and then enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Test configuration name | Enter *SSH-from-myVM1-to-myVM2*. |
    | Protocol | Select **TCP**. |
    | Destination port | Enter *22*. | 
    | Test frequency | Select the default **Every 30 seconds**. | 

    :::image type="content" source="./media/monitor-vm-communication/add-test-configuration.png" alt-text="Screenshot shows how to add a test configuration for a connection monitor in the Azure portal.":::

1. Select **Add test configuration**.

1. In the **Add test group details** page, select **Add destinations** to add the destination virtual machine.

1. In the **Add Destinations** page, select **myVM2** as the destination endpoint, and then select **Add endpoints**.

    :::image type="content" source="./media/monitor-vm-communication/add-destination-endpoint.png" alt-text="Screenshot shows how to add a destination endpoint for a connection monitor in the Azure portal.":::

    > [!NOTE]
    > In addition to the **Subscription**, **Resource group**, **VNET**, and **Subnet** filters, you can use the **Region** filter to narrow down the list of virtual machines.

1. In the **Add test group details** page, select **Add Test Group** button.

1. Select **Review + create**, and then select **Create**.

## View the connection monitor

In this section, you view all the details of the connection monitor that you created in the previous section.

1. Go to the **Connection monitor** page. If you don't see **myConnectionMonitor** in the list of connection monitors, wait a few minutes, then select **Refresh**. 

    :::image type="content" source="./media/monitor-vm-communication/new-connection-monitor.png" alt-text="Screenshot shows the new connection monitor that you've just created." lightbox="./media/monitor-vm-communication/new-connection-monitor.png":::

1. Select **myConnectionMonitor** to see the performance metrics of the connection monitor like round trip time and percentage of failed checks
  
    :::image type="content" source="./media/monitor-vm-communication/connection-monitor-summary.png" alt-text="Screenshot shows the new connection monitor." lightbox="./media/monitor-vm-communication/connection-monitor-summary.png":::

1. Select **Time Intervals** to adjust the time range to see the performance metrics for a specific time period. Available time intervals are **Last 1 hour**, **Last 6 hours**, **Last 24 hours**, **Last 7 days**, and **Last 30 days**. You can also select **Custom** to specify a custom time range.

     :::image type="content" source="./media/monitor-vm-communication/metrics-time-intervals.png" alt-text="Screenshot shows available options to change the time interval of the performance metrics in a connection monitor." lightbox="./media/monitor-vm-communication/metrics-time-intervals.png":::

## View a problem

The connection monitor you created in the previous section monitors the connection between **myVM1** and port 22 on **myVM2**. If the connection fails for any reason, connection monitor detects and logs the failure. In this section, you simulate a problem by stopping **myVM2**.

1. In the search box at the top of the portal, enter *virtual machine*. Select **Virtual machines** in the search results.

1. In **Virtual machines**, select **myVM2**.

1. In the **Overview**, select **Stop** to stop (deallocate) **myVM2** virtual machine.

1. Go to the **Connection monitor** page. If you don't see the failure in the dashboard, select **Refresh**.

     :::image type="content" source="./media/monitor-vm-communication/connection-monitor-fail.png" alt-text="Screenshot shows the failure after stopping the virtual machine." lightbox="./media/monitor-vm-communication/connection-monitor-fail.png":::

    You can see that the number of **Fail** connection monitors became **1 out of 1** after stopping **myVM2**, and under **Reason**, you can see **ChecksFailedPercent** as the reason for this failure.

## Clean up resources

When no longer needed, delete **myResourceGroup** resource group and all of the resources it contains:

1. In the search box at the top of the portal, enter ***myResourceGroup***. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. In **Delete a resource group**, enter ***myResourceGroup***, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Next step

To learn how to monitor virtual machine scale set network communication, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Monitor network communication with a scale set](diagnose-communication-problem-between-networks.md)
