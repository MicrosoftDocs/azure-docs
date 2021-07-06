---
title: Monitor VM GPU, memory, and activity on your Azure Stack Edge Pro GPU device
description: Learn how to monitor metrics (GPU, memory) and view activity logs on your Azure Stack Edge Pro GPU via the Azure portal.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/06/2021
ms.author: alkohli
# Customer intent: As an IT admin, I need to get a quick read of resource usage and activity for the compute workloads on my Azure Stack Edge GPU device.
---

# Monitor VM GPU and memory metrics, activity logs on Azure Stack Edge Pro GPU devices

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

INTRO TK

## Monitor GPU and memory metrics

1. Open the device in the Azure portal, and go to **Virtual Machines**. Select the virtual machine. Select **Activity log**.
 
    ![In Resources for virtual machines, display Disks](./media/azure-stack-edge-gpu-manage-virtual-machine-disks-portal/delete-disk-1.png)



## View activity logs

1. Open the device in the Azure portal, and go to **Virtual Machines**. Select the virtual machine. Then select **Activity log**.

    ![On the dashboard for the virtual machine, select Metrics to display CPU and memory](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/metrics-01.png)

2. By **Show data for last**, select the time span that you want to see. For example, select **7 days** to see a usage chart for the week.

   ![In Metrics view, choose a time span to view: 1 hour, 6 hours, 12 hours, 1 day, 7 days, or 30 days.](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/metrics-02.png)

## Next steps

To learn how to administer your Azure Stack Edge Pro GPU device, see [Use local web UI to administer an Azure Stack Edge Pro GPU](azure-stack-edge-manage-access-power-connectivity-mode.md).