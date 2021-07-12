---
title: Monitor virtual machine metrics for CPU, memory on Azure Stack Edge Pro GPU device
description: Learn to monitor CPU, memory metrics for VMs on Azure Stack Edge Pro GPU devices in Azure portal.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/12/2021
ms.author: alkohli
# Customer intent: As an IT admin, I need to be able to get a quick read of CPU and memory usage by a virtual machine on my Azure Stack Edge Pro GPU device.
---

# Monitor CPU and memory metrics for a VM on an Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to view CPU and memory metrics for a virtual machine on your Azure Stack Edge Pro GPU device.

## About VM metrics

CPU and memory metrics are displayed on the **Metrics** tab for a VM in the Azure portal. The VM metrics are based on performance data collected from the Azure Stack Edge device. They are not based on the VM size.

SAMPLING INTERVAL?

Metrics aren't limited to any length of time, but they are limited by the size of data that can be cached. DOES THIS VARY - BY WHAT FACTORS?

If a device is disconnected, metrics are cached on the device. As soon as the device is reconnected, the metrics are pushed from the cache and displayed in the VM details.

ANY COST ASSOCIATED?

## Monitor CPU and memory metrics

1. Open the device in the Azure portal, and go to **Virtual Machines**. Select the virtual machine, and select **Metrics**.

    ![Metrics tab on the dashboard for a virtual machine](media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/metrics-01.png)

2. By default, the graphs show average CPU and memory usage for the previous hour. To see data for a different time period, select a different option by **Show data for last**.

    ![Metrics tab showing average CPU and memory usage for the last 12 hours](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/metrics-02.png)

3. Point anywhere in either chart to display a vertical line with a hand that you can move left or right to view an earlier or later data sample.

    ![Screenshot showing how to hover over the 0 percent data line to view an earlier or later data sample.](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/metrics-03.png)

## Next steps

- [View VM activity on your device]()
- More comprehensive diagnostics for a VM?
