---
title: Disable monitoring in Azure Monitor for VMs
description: This article describes how to stop monitoring your virtual machines in Azure Monitor for VMs.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/12/2020

---

# Disable monitoring of your VMs in Azure Monitor for VMs

After you enable monitoring of your virtual machines (VMs), you can later choose to disable monitoring in Azure Monitor for VMs. This article shows how to disable monitoring for one or more VMs.  

Currently, Azure Monitor for VMs doesn't support selective disabling of VM monitoring. Your Log Analytics workspace might support Azure Monitor for VMs and other solutions. It might also collect other monitoring data. If your Log Analytics workspace provides these services, you need to understand the effect and methods of disabling monitoring before you start.

Azure Monitor for VMs relies on the following components to deliver its experience:

* A Log Analytics workspace, which stores monitoring data from VMs and other sources.
* A collection of performance counters configured in the workspace. The collection updates the monitoring configuration on all VMs connected to the workspace.
* `VMInsights`, which is a monitoring solution configured in the workspace. This solution updates the monitoring configuration on all VMs connected to the workspace.
* `MicrosoftMonitoringAgent` and `DependencyAgent`, which are Azure VM extensions. These extensions collect and send data to the workspace.

As you prepare to disable monitoring of your VMs, keep these considerations in mind:

* If you evaluated with a single VM and used the preselected default Log Analytics workspace, you can disable monitoring by uninstalling the Dependency agent from the VM and disconnecting the Log Analytics agent from this workspace. This approach is appropriate if you intend to use the VM for other purposes and decide later to reconnect it to a different workspace.
* If you selected a preexisting Log Analytics workspace that supports other monitoring solutions and data collection from other sources, you can remove solution components from the workspace without interrupting or affecting your workspace.  

>[!NOTE]
> After removing the solution components from your workspace, you might continue to see performance and map data for your Azure VMs. Data will eventually stop appearing in the **Performance** and **Map** views. The **Enable** option will be available from the selected Azure VM so you can re-enable monitoring in the future.  

## Remove Azure Monitor for VMs completely

If you still need the Log Analytics workspace, follow these steps to completely remove Azure Monitor for VMs. You'll remove the `VMInsights` solution from the workspace.  

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the Azure portal, select **All services**. In the list of resources, type **Log Analytics**. As you begin typing, the list filters suggestions based on your input. Select **Log Analytics**.
3. In your list of Log Analytics workspaces, select the workspace you chose when you enabled Azure Monitor for VMs.
4. On the left, select **Solutions**.  
5. In the list of solutions, select **VMInsights(workspace name)**. On the **Overview** page for the solution, select **Delete**. When prompted to confirm, select **Yes**.

## Disable monitoring and keep the workspace  

If your Log Analytics workspace still needs to support monitoring from other sources, following these steps to disable monitoring on the VM that you used to evaluate Azure Monitor for VMs. For Azure VMs, you'll remove the dependency agent VM extension and the Log Analytics agent VM extension for Windows or Linux directly from the VM. 

>[!NOTE]
>Don't remove the Log Analytics agent if: 
>
> * Azure Automation manages the VM to orchestrate processes or to manage configuration or updates. 
> * Azure Security Center manages the VM for security and threat detection. 
>
> If you do remove the Log Analytics agent, you will prevent those services and solutions from proactively managing your VM. 

1. Sign in to the [Azure portal](https://portal.azure.com). 
2. In the Azure portal, select **Virtual Machines**. 
3. From the list, select a VM. 
4. On the left, select **Extensions**. On the **Extensions** page, select **DependencyAgent**.
5. On the extension properties page, select **Uninstall**.
6. On the **Extensions** page, select **MicrosoftMonitoringAgent**. On the extension properties page, select **Uninstall**.  
