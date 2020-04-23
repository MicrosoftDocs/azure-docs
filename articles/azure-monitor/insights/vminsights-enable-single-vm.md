---
title: Enable Azure Monitor for VMs in the Azure portal
description: Learn how to evaluate Azure Monitor for VMs on a single Azure virtual machine or on a virtual machine scale set.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/12/2020

---

# Enable Azure Monitor for VMs in the Azure portal

This article describes how to enable Azure Monitor for VMs on a small number of Azure virtual machines (VMs) using the Azure portal. Your goal is to monitor your VMs and discover any performance or availability issues. 

Before you begin, review the [prerequisites](vminsights-enable-overview.md) and make sure your subscription and resources meet the requirements.  

## Enable monitoring for a single Azure VM
To enable monitoring of your Azure VM:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Virtual Machines**.

1. From the list, select a VM.

1. On the VM page, in the **Monitoring** section, select **Insights** and then **Enable**.

    ![Enable Azure Monitor for VMs for a VM](media/vminsights-enable-single-vm/enable-vminsights-vm-portal.png)

1. On the **Azure Monitor Insights Onboarding** page, if you have an existing Log Analytics workspace in the same subscription, select it in the drop-down list.  

    The list preselects the default workspace and location where the VM is deployed in the subscription. 

    >[!NOTE]
    >To create a new Log Analytics workspace to store the monitoring data from the VM, see [Create a Log Analytics workspace](../../azure-monitor/learn/quick-create-workspace.md). Your Log Analytics workspace must belong to one of the [supported regions](vminsights-enable-overview.md#log-analytics).

6. You will receive status messages as the configuration is performed.

    ![Enable Azure Monitor for VMs monitoring deployment processing](media/vminsights-enable-single-vm/onboard-vminsights-vm-portal-status.png)

## Enable monitoring for a single virtual machine scale set

To enable monitoring of your Azure virtual machine scale set:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **Virtual Machine Scale Sets**.

3. From the list, select a virtual machine scale set.

4. On the virtual machine scale set page, in the **Monitoring** section, select **Insights** and then **Enable**.

5. On the **Insights** page, if you want to use an existing Log Analytics workspace, select it in the drop-down list.

    The list preselects the default workspace and location that the VM is deployed to in the subscription. 

    ![Enable Azure Monitor for VMs for a virtual machine scale set](media/vminsights-enable-single-vm/enable-vminsights-vmss-portal.png)

    >[!NOTE]
    >To create a new Log Analytics workspace to store the monitoring data from the virtual machine scale set, see [Create a Log Analytics workspace](../learn/quick-create-workspace.md). Your Log Analytics workspace must belong to one of the [supported regions](vminsights-enable-overview.md#log-analytics).

6. You will receive status messages as the configuration is performed.

    >[!NOTE]
    >If you use a manual upgrade model for your scale set, upgrade the instances to complete the setup. You can start the upgrades from the **Instances** page, in the **Settings** section.
    
    ![Enable Azure Monitor for VMs monitoring deployment processing](media/vminsights-enable-single-vm/onboard-vminsights-vmss-portal-status.png)

Now that you've enabled monitoring for your VM or virtual machine scale set, the monitoring information is available for analysis in Azure Monitor for VMs. 

## Next steps

* To view discovered application dependencies, see [Use Azure Monitor for VMs Map](vminsights-maps.md). 
* To identify bottlenecks, overall utilization, and your VM's performance, see [View Azure VM performance](vminsights-performance.md).
