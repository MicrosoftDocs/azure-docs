---
title: Monitor CPU, memory for VM on Azure Stack Edge Pro GPU device
description: Learn to monitor CPU, memory metrics for VMs on Azure Stack Edge Pro GPU devices in Azure portal.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/13/2021
ms.author: alkohli
# Customer intent: As an IT admin, I need to be able to get a quick read of CPU and memory usage by a virtual machine on my Azure Stack Edge Pro GPU device.
---

# Monitor VM metrics for CPU, memory on Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to monitor CPU and memory metrics for a virtual machine on your Azure Stack Edge Pro GPU device.

## About VM metrics

You can view CPU and memory metrics for a virtual machine in the Azure portal. The VM metrics are based on performance data collected from the Azure Stack Edge device. *QUERY: What agent/service is used to collect the data? This is guest OS data collected by what?*

*QUERY: What's the sampling interval for the data?*

Metrics aren't limited to any length of time, but they are limited by the size of data that can be cached. *QUERY: What factors affect the cache space - the number of VMs deployed on the device?*

If a device is disconnected, metrics are cached on the device. As soon as the device is reconnected, the metrics are pushed from the cache and displayed in the VM details.

*QUERY: Are there any costs associated with these metrics?*

*QUERY: If they want more comprehensive performance data/diagnostics, where do we expect the customer to go next? They can view VM activity on the device. Then what?*

## Monitor CPU and memory metrics

1. Open the device in the Azure portal, and go to **Virtual Machines**. Select the virtual machine, and select **Metrics**.

    ![Metrics tab on the dashboard for a virtual machine](media/azure-stack-edge-gpu-monitor-virtual-machine-metrics/metrics-01.png)

2. By default, the graphs show average CPU and memory usage for the previous hour. To see data for a different time period, select a different option beside **Show data for last**.

    ![Metrics tab showing average CPU and memory usage for the last 12 hours](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics/metrics-02.png)

3. Point anywhere in either chart with your mouse to display a vertical line with a hand that you can move left or right to view an earlier or later data sample.

    ![Screenshot showing how to hover over the 0 percent data line to view an earlier or later data sample.](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics/metrics-03.png)

## Next steps

- [Monitor VM activity on your device](azure-stack-edge-gpu-monitor-virtual-machine-activity.md)
- TBD: More comprehensive diagnostics for an ASE VM
