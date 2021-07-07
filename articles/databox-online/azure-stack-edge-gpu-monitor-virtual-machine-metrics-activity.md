---
title: Monitor VM GPU, memory, and activity on your Azure Stack Edge Pro GPU device
description: Learn how to monitor metrics (GPU, memory) and view activity logs on your Azure Stack Edge Pro GPU via the Azure portal.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/07/2021
ms.author: alkohli
# Customer intent: As an IT admin, I need to get a quick read of resource usage and activity for the compute workloads on my Azure Stack Edge GPU device.
---

# Monitor VM GPU and memory metrics, activity logs on Azure Stack Edge Pro GPU devices

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

INTRO TK

## Monitor GPU and memory metrics

1. Open the device in the Azure portal, and go to **Virtual Machines**. Select the virtual machine. Select **Activity log**.
 
    ![Metrics tab on the dashboard for a virtual machine](media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/metrics-01.png)

    By default, the graphs show average CPU and memory usage for the previous hour. To see data for a different period of time, select a different option by **Show data for last**.

    ![Metrics tab showing average CPU and memory usage for the last 12 hours](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/metrics-02.png)

    Point anywhere in either chart to display a vertical line with a hand that you can move left or right to view an earlier or later data sample.

    ![Screenshot showing how to hover over the 0 percent data line to view an earlier or later data sample.](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/metrics-03.png)

*Is there any cost associated with viewing and manipulating these metrics?*

*This is a simple implementation of Azure Metrics, with a slightly different display from the custom displays in the Azure Monitor Metrics "Getting started" article. Is there a good source to point to for advanced Metrics features (available when metrics detail is displayed?*  

## View activity logs

To view activity logs for the virtual machines on your Azure Stack Edge Pro GPU device, do these steps:

1. Open the device in the Azure portal, and go to **Virtual Machines**. Then select **Activity log**.




    ![Screenshot showing the Activity logs view for virtual machines on an Azure Stack Edge device in the Azure portal](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/activity-log-01.png)


You'll see the VM guest logs for all virtual machines on the device. 

Use the filters to target the activity you need to see.

![Screenshot showing the Timespan filter for Activity for virtual machines on an Azure Stack Edge device in the Azure portal](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/activity-log-02.png)

Click the down arrow by an operation name to view a list of operations.

![Screenshot showing the Activity logs view for virtual machines on an Azure Stack Edge device in the Azure portal](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/activity-log-03
.png)

For more information, see [View activity logs to monitor actions on resources](/azure/azure-resource-manager/management/view-activity-logs). 

## Next steps

To learn how to administer your Azure Stack Edge Pro GPU device, see [Use local web UI to administer an Azure Stack Edge Pro GPU](azure-stack-edge-manage-access-power-connectivity-mode.md).