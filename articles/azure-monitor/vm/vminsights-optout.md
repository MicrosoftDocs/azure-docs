---
title: Disable monitoring in VM insights
description: This article describes how to stop monitoring your virtual machines in VM insights.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 06/08/2022

---

# Disable monitoring of your VMs in VM insights

After you enable monitoring of your virtual machines (VMs), you can later choose to disable monitoring in VM insights. This article shows how to disable monitoring for one or more VMs.

Currently, VM insights doesn't support selective disabling of VM monitoring. Your Log Analytics workspace might support VM insights and other solutions. It might also collect other monitoring data. If your Log Analytics workspace provides these services, you need to understand the effect and methods of disabling monitoring before you start.

VM insights relies on the following components to deliver its experience:

* A Log Analytics workspace, which stores monitoring data from VMs and other sources.
* A collection of performance counters configured in the workspace. The collection updates the monitoring configuration on all VMs connected to the workspace.
* The `VMInsights` monitoring solution is configured in the workspace. This solution updates the monitoring configuration on all VMs connected to the workspace.
* Azure VM extensions `MicrosoftMonitoringAgent` (for Windows) or `OmsAgentForLinux` (for Linux) and `DependencyAgent`. These extensions collect and send data to the workspace.

As you prepare to disable monitoring of your VMs, keep these considerations in mind:

* If you evaluated with a single VM and used the preselected default Log Analytics workspace, you can disable monitoring by uninstalling the Dependency agent from the VM and disconnecting the Log Analytics agent from this workspace. This approach is appropriate if you intend to use the VM for other purposes and decide later to reconnect it to a different workspace.
* If you selected a preexisting Log Analytics workspace that supports other monitoring solutions and data collection from other sources, you can remove solution components from the workspace without interrupting or affecting your workspace.

>[!NOTE]
> After you remove the solution components from your workspace, you might continue to see performance and map data for your Azure VMs. Data eventually stops appearing in the **Performance** and **Map** views. The **Enable** option is available from the selected Azure VM so that you can reenable monitoring in the future.

## Remove VM insights completely

If you still need the Log Analytics workspace, you can remove the `VMInsights` solution from the workspace.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, select **All services**. In the list of resources, enter **Log Analytics**. As you begin typing, the list filters suggestions based on your input. Select **Log Analytics**.
1. In your list of Log Analytics workspaces, select the workspace you chose when you enabled VM insights.
1. On the left, select **Legacy solutions**.
1. In the list of solutions, select **VMInsights(workspace name)**. On the **Overview** page for the solution, select **Delete**. When you're prompted to confirm, select **Yes**.

## Disable monitoring and keep the workspace

If your Log Analytics workspace still needs to support monitoring from other sources, you can disable monitoring on the VM that you used to evaluate VM insights. For Azure VMs, you remove the dependency agent VM extension and the Log Analytics agent VM extension for Windows or Linux directly from the VM.

>[!NOTE]
>Don't remove the Log Analytics agent if:
>
> * Azure Automation manages the VM to orchestrate processes or to manage configuration or updates.
> * Microsoft Defender for Cloud manages the VM for security and threat detection.
>
> If you do remove the Log Analytics agent, you'll prevent those services and solutions from proactively managing your VM.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, select **Virtual Machines**.
1. From the list, select a VM.
1. On the left, select **Extensions**. On the **Extensions** page, select **DependencyAgent**.
1. On the extension properties page, select **Uninstall**.
1. On the **Extensions** page, select **MicrosoftMonitoringAgent**. On the extension properties page, select **Uninstall**.