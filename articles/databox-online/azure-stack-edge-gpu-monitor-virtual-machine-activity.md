---
title: Monitor VM activity on Azure Stack Edge Pro GPU device
description: Learn how to monitor metrics (CPU, memory) and view activity logs on your Azure Stack Edge Pro GPU via the Azure portal.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/12/2021
ms.author: alkohli
# Customer intent: As an IT admin, I need to be able to review VM activity in real-time for the compute workloads on my Azure Stack Edge Pro GPU device.
---

# Monitor VM activity on your Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to view activity logs in the Azure portal for virtual machines on you Azure Stack Edge Pro GPU device.

## View activity logs

To view activity logs for the virtual machines on your Azure Stack Edge Pro GPU device, do these steps:

1. Go to the device and then to **Virtual Machines**. Select **Activity log**.

    ![Screenshot showing the Activity logs view for virtual machines on an Azure Stack Edge device in the Azure portal](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/activity-log-01.png)

    You'll see the VM guest logs for virtual machines on the device. *Verify this.*

1. Use filters above the list to target the activity you need to see.

    ![Screenshot showing the Timespan filter for Activity for virtual machines on an Azure Stack Edge device in the Azure portal](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/activity-log-02.png)

1. Click the down arrow by an operation name to view the associated activity.

    ![Screenshot showing Activity logs view for virtual machines on an Azure Stack Edge device](./media/azure-stack-edge-gpu-monitor-virtual-machine-metrics-activity/activity-log-03.png)

On any **Activity log** pane in Azure, you can filter and sort activities, select columns to display, drill down to details for a specific activity, and get **Quick Insights** into errors, failed deployments, alerts, service health, and security changes over the last 24 hours. For more information about the logs and the filtering options, see [View activity logs](/azure/azure-resource-manager/management/view-activity-logs).

## Next steps

- [Collect VM guest logs in a Support package](azure-stack-edge-gpu-collect-virtual-machine-guest-logs.md)
- [Troubleshoot VM deployment](azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning.md)