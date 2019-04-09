---
title: Monitor your Azure Data Box Edge device | Microsoft Docs 
description: Describes how to use the Azure portal and local web UI to monitor your Azure Data Box Edge.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 04/09/2019
ms.author: alkohli
---
# Monitor your Azure Data Box Edge

This article describes how to monitor your Azure Data Box Edge. To monitor your device, you can use Azure portal or the local web UI. Use the Azure portal to view device events and configure and view alerts. Use the local web UI to view the hardware status of the various device components.

In this article, you learn how to:

> [!div class="checklist"]
> * View device events
> * View hardware status
> * View alerts

## View device events

Take the following steps in the Azure portal to view a device event.

1. In the Azure portal, go to your Data Box Edge/ Data Box Gateway resource and then go to **Monitoring > Device events**.
2. Select an event and view the alert details. Take appropriate action to resolve the alert condition.

    ![Select event and view details](media/data-box-edge-monitor/view-device-events.png)

## View hardware status

Take the following steps in the local web UI to view the hardware status of your device components.

1. Connect to the local web UI of your device.
2. Go to **Maintenance > Hardware status**. You can view the health of the various device components.

    ![View hardware status](media/data-box-edge-monitor/view-hardware-status.png)

## View alerts

Configure alert rules to inform you of alert conditions related to the consumption of resources on your device. You can configure alert rules to monitor your device for alert conditions. For more detailed information on alerts, go to [Create, view, and manage metric alerts in Azure monitor](../../azure-monitor/platform/alerts-metric.md).


## Next steps

- Learn how to [Manage bandwidth](data-box-edge-manage-bandwidth-schedules.md).
