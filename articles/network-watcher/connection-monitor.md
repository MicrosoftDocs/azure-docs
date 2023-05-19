---
title: 'Tutorial: Monitor network communication between two virtual machines using the Azure portal'
description: In this tutorial, you learn how to monitor network communication between two virtual machines with Azure Network Watcher's connection monitor capability.
services: network-watcher
author: halkazwini
tags: azure-resource-manager
ms.service: network-watcher
ms.topic: tutorial
ms.workload: infrastructure-services
ms.date: 10/28/2022
ms.author: halkazwini
ms.custom: template-tutorial, mvc, engagement-fy23
# Customer intent: I need to monitor communication between a VM and another VM. If the communication fails, I need to know why, so that I can resolve the problem. 
---

# Tutorial: Monitor network communication between two virtual machines using the Azure portal

> [!NOTE]
> This tutorial covers Connection Monitor (classic). Try the new and improved [Connection Monitor](connection-monitor-overview.md) to experience enhanced connectivity monitoring.

> [!IMPORTANT]
> Starting 1 July 2021, you will not be able to add new connection monitors in Connection Monitor (classic) but you can continue to use existing connection monitors created prior to 1 July 2021. To minimize service disruption to your current workloads, [migrate from Connection Monitor (classic) to the new Connection Monitor](migrate-to-connection-monitor-from-connection-monitor-classic.md) in Azure Network Watcher before 29 February 2024.

Successful communication between a virtual machine (VM) and an endpoint such as another VM, can be critical for your organization. Sometimes, configuration changes break communication. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create two VMs
> * Monitor communication between VMs with the Connection Monitor capability of Network Watcher
> * Generate alerts on Connection Monitor metrics
> * Diagnose a communication problem between two VMs, and learn how you can resolve it

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create VMs

Create two VMs.

### Create the first VM

1. In the search box at the top of the portal, enter *virtual machine*. Select **Virtual machines**.

1. In **Virtual machines**, select **+ Create** then **+ Azure virtual machine**.

1. Enter or select the following information in **Create a virtual machine**.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter *myResourceGroup* in **Name**. </br> Select **OK**. | 
    | **Instance details** |   |
    | Virtual machine name | Enter *myVM1*. |
    | Region | Select **(US) East US**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Security type | Leave the default of **Standard**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen2**. |
    | Azure Spot instance | Leave the default. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Confirm password. |
    | **Inbound port rules** |   |
    | Public inbound ports | Leave the default of **Allow selected ports**. |
    | Select inbound ports | Leave the default of **RDP (3389)**. |

1. Select **Advanced** tab, then select **Select an extension to install**.

1. Enter *Network Watcher Agent for Windows* in the search box. Select **Network Watcher Agent for Windows** and then select **Next**.

    :::image type="content" source="./media/connection-monitor/network-watcher-agent-for-windows.png" alt-text="Screenshot of installing Network Watcher Agent for Windows when creating a Windows VM.":::

1. In **Configure Network Watcher Agent for Windows Extension** page, select **Create**.

1. In **Create a virtual machine** page, select **Review + create** and then **Create** to start VM deployment.

### Create the second VM

Complete the steps in [Create the first VM](#create-the-first-vm) again, with the following changes:

|Setting|Value|
|---|---|
| Resource group | Select **myResourceGroup**. |
| Virtual machine name | Enter *myVM2*. |
| Image | Select **Ubuntu Server 18.04 LTS - Gen2**. |
| Public inbound ports | Select **Allow selected ports**. |
| Select inbound ports | Select **SSH (22)**. |
| Extensions | Select **Network Watcher Agent for Linux**. |

The VM takes a few minutes to deploy. Wait for the VM to finish deploying before continuing with the remaining steps.

## Create a connection monitor

Create a connection monitor to monitor communication over TCP port 22 from *myVm1* to *myVm2*.

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher**.
1. Under **Monitoring**, select **Connection monitor (classic)**.
1. Select **+ Add**.
1. Enter or select the information for the connection you want to monitor, and then select **Add**. In the example shown in the following picture, the connection monitored is from the *myVm1* VM to the *myVm2* VM over port 22:

    | Setting                  | Value               |
    | ---------                | ---------           |
    | Name                     | myVm1-myVm2(22)     |
    | **Source**               |                     |
    | Virtual machine          | myVm1               |
    | **Destination**          |                     |
    | Select a virtual machine |                     |
    | Virtual machine          | myVm2               |
    | Port                     | 22                  |

    ![Add Connection Monitor](./media/connection-monitor/add-connection-monitor.png)

## View a connection monitor

1. Complete steps 1-3 in [Create a connection monitor](#create-a-connection-monitor) to view connection monitoring. You see a list of existing connection monitors, as shown in the following picture:

    ![Connection monitors](./media/connection-monitor/connection-monitors.png)

2. Select the monitor with the name **myVm1-myVm2(22)**, as shown in the previous picture, to see details for the monitor, as shown in the following picture:

    ![Monitor details](./media/connection-monitor/vm-monitor.png)

    Note the following information:

    | Item  | Value | Details  |
    | ---------| ---------|--------|
    | Status   | Reachable   | Lets you know whether the endpoint is reachable or not.|
    | AVG. ROUND-TRIP          | Lets you know the round-trip time to make the connection, in milliseconds. Connection monitor probes the connection every 60 seconds, so you can monitor latency over time.                                         |
    | Hops                     | Connection monitor lets you know the hops between the two endpoints. In this example, the connection is between two VMs in the same virtual network, so there's only one hop, to the 10.0.0.5 IP address. If any existing system or custom routes, route traffic between the VMs through a VPN gateway, or network virtual appliance, for example, additional hops are listed.                                                                                                                         |
    | STATUS                   | The green check marks for each endpoint let you know that each endpoint is healthy.    ||

## Generate alerts

Alerts are created by alert rules in Azure Monitor and can automatically run saved queries or custom log searches at regular intervals. A generated alert can automatically run one or more actions, such as to notify someone or start another process. When setting an alert rule, the resource that you target determines the list of available metrics that you can use to generate alerts.

1. In Azure portal, select the **Monitor** service, and then select **Alerts** > **New alert rule**.
2. Select **Select target**, and then select the resources that you want to target. Select the **Subscription**, and set the **Resource type** to filter down to the Connection Monitor that you want to use.

    ![alert screen with target selected](./media/connection-monitor/set-alert-rule.png)
1. Once you've selected a resource to target, select **Add criteria**. The Network Watcher has [metrics on which you can create alerts](../azure-monitor/alerts/alerts-metric-near-real-time.md#metrics-and-dimensions-supported). Set **Available signals** to the metrics ProbesFailedPercent and AverageRoundtripMs:

    ![alert page with signals selected](./media/connection-monitor/set-alert-signals.png)
1. Fill out the alert details like alert rule name, description, and severity. You can also add an action group to the alert to automate and customize the alert response.

## View a problem

By default, Azure allows communication over all ports between VMs in the same virtual network. Over time, you, or someone in your organization, might override Azure's default rules, inadvertently causing a communication failure. Complete the following steps to create a communication problem and then view the connection monitor again:

1. In the search box at the top of the portal, enter *myResourceGroup*. When the **myResourceGroup** resource group appears in the search results, select it.
2. Select the **myVm2-nsg** network security group.
3. Select **Inbound security rules**, and then select **Add**, as shown in the following picture:

    :::image type="content" source="./media/connection-monitor/inbound-security-rules-inline.png" alt-text="Screenshot of Inbound security rules." lightbox="./media/connection-monitor/inbound-security-rules-expanded.png":::

4. The default rule that allows communication between all VMs in a virtual network is the rule named **AllowVnetInBound**. Create a rule with a higher priority (lower number) than the **AllowVnetInBound** rule that denies inbound communication over port 22. Select, or enter, the following information, accept the remaining defaults, and then select **+ Add**:

    | Setting                 | Value          |
    | ---                     | ---            |
    | Destination port ranges | 22             |
    | Action                  | Deny           |
    | Priority                | 100            |
    | Name                    | DenySshInbound |

5. Since connection monitor probes at 60-second intervals, wait a few minutes, and then on the left side of the portal, select **Network Watcher**, then **Connection monitor**, and then select the **myVm1-myVm2(22)** monitor again. The results are different now, as shown in the following picture:

    ![Monitor details fault](./media/connection-monitor/vm-monitor-fault.png)

    You can see that there's a red exclamation icon in the status column for the **myvm2529** network interface.

6. To learn why the status has changed, select 10.0.0.5, in the previous picture. Connection monitor informs you that the reason for the communication failure is: *Traffic blocked due to the following network security group rule: UserRule_DenySshInbound*.

    If you didn't know that someone had implemented the security rule you created in step 4, you'd learn from connection monitor that the rule is causing the communication problem. You could then change, override, or remove the rule, to restore communication between the VMs.

## Clean up resources

When no longer needed, delete the resource group and all of the resources it contains:

1. Enter *myResourceGroup* in the **Search** box at the top of the portal. When you see **myResourceGroup** in the search results, select it.
2. Select **Delete resource group**.
3. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME:** and select **Delete**.

## Next steps

In this tutorial, you learned how to monitor a connection between two VMs. You learned that a network security group rule prevented communication to a VM. To learn about all of the different responses connection monitor can return, see [response types](network-watcher-connectivity-overview.md#response). You can also monitor a connection between a VM, a fully qualified domain name, a uniform resource identifier, or an IP address.

At some point, you may find that resources in a virtual network are unable to communicate with resources in other networks connected by an Azure virtual network gateway. Advance to the next tutorial to learn how to diagnose a problem with a virtual network gateway.

> [!div class="nextstepaction"]
> [Diagnose communication problems between networks](diagnose-communication-problem-between-networks.md)
