---
title: Enable a single Azure virtual machine or virtual machine scale set   | Microsoft Docs
description: This article describes how you enable Azure Monitor for VMs for a single Azure virtual machine or virtual machine scale set.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 
ms.assetid: 
ms.service: azure-monitor
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/09/2019
ms.author: magoedte
---

# Enable Azure Monitor for VMs (preview) for a single Azure virtual machine or virtual machine scale set

When evaluating Azure Monitor for VMs (preview) for a small number of Azure virtual machines or a single virtual machine or virtual machine scale set, the easiest and most direct approach to enable monitoring is from the Azure portal. At the end of this process, you will have successfully begun monitoring them and learn if they are experiencing any performance or availability issues. 

Before getting started, be sure to review the [prerequisites](vminsights-enable-overview.md) and verify your subscription and resources meet the requirements.  

## Enable monitoring for a single Azure VM
To enable monitoring of your Azure VM in the Azure portal, do the following:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Virtual Machines**.

1. From the list, select a VM.

1. On the VM page, in the **Monitoring** section, select **Insights (preview)**.

1. On the **Insights (preview)** page, select **Try now**.

    ![Enable Azure Monitor for VMs for a VM](./media/vminsights-enable-single-vm/enable-vminsights-vm-portal-01.png)

1. On the **Azure Monitor Insights Onboarding** page, if you have an existing Log Analytics workspace in the same subscription, select it in the drop-down list.  

    The list preselects the default workspace and location that the virtual machine is deployed to in the subscription. 

    >[!NOTE]
    >If you want to create a new Log Analytics workspace for storing the monitoring data from the VM, follow the instructions in [Create a Log Analytics workspace](../../azure-monitor/learn/quick-create-workspace.md) in one of the supported regions listed earlier.

After you've enabled monitoring, it might take about 10 minutes before you can view the health metrics for the virtual machine.

![Enable Azure Monitor for VMs monitoring deployment processing](./media/vminsights-enable-single-vm/onboard-vminsights-vm-portal-status.png)

## Enable monitoring for a single virtual machine scale set

To enable monitoring of your Azure virtual machine scale set in the Azure portal, do the following:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **Virtual Machine Scale Sets**.

3. From the list, select a virtual machine scale set.

4. On the virtual machine scale set page, in the **Monitoring** section, select **Insights (preview)**.

5. On the **Insights (preview)** page, if you have an existing Log Analytics workspace you want to use, select it in the drop-down list.

    The list preselects the default workspace and location that the virtual machine is deployed to in the subscription. 

    ![Enable Azure Monitor for VMs for a virtual machine scale set](./media/vminsights-enable-single-vm/enable-vminsights-vmss-portal-01.png)

    >[!NOTE]
    >If you want to create a new Log Analytics workspace for storing the monitoring data from the VM, follow the instructions in [Create a Log Analytics workspace](../learn/quick-create-workspace.md) in one of the supported regions listed earlier.

After you've enabled monitoring, it might take about 10 minutes before you can view the monitoring data for the scale set.

>[!NOTE]
>If you are using a manual upgrade model for your scale set you will need to upgrade the instances to complete the setup.  This can be done from the Instances page under the **Settings** section.

![Enable Azure Monitor for VMs monitoring deployment processing](./media/vminsights-enable-single-vm/onboard-vminsights-vmss-portal-status-01.png)

## Next steps

Now that monitoring is enabled for your virtual machine or virtual machine scale set, this information is available for analysis with Azure Monitor for VMs. To learn how to use the Health feature, see [View Azure Monitor for VMs Health](vminsights-health.md). To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md). To identify bottlenecks and overall utilization with your VMs performance, see [View Azure VM Performance](vminsights-performance.md), or to view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).