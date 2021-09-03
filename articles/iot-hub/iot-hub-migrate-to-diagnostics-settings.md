---
title: Migrate Azure IoT Hub operations monitoring to IoT Hub resource logs in Azure Monitor | Microsoft Docs
description: How to update Azure IoT Hub to use Azure Monitor instead of operations monitoring to monitor the status of operations on your IoT hub in real time.
author: kgremban

ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 03/11/2019
ms.author: kgremban
---

# Migrate your IoT Hub from operations monitoring to Azure Monitor resource logs

Customers using [operations monitoring](iot-hub-operations-monitoring.md) to track the status of operations in IoT Hub can migrate that workflow to [Azure Monitor resource logs](../azure-monitor/essentials/platform-logs-overview.md), a feature of Azure Monitor. Resource logs supply resource-level diagnostic information for many Azure services.

**The operations monitoring functionality of IoT Hub is deprecated**, and has been removed from the portal. This article provides steps to move your workloads from operations monitoring to Azure Monitor resource logs. For more information about the deprecation timeline, see [Monitor your Azure IoT solutions with Azure Monitor and Azure Resource Health](https://azure.microsoft.com/blog/monitor-your-azure-iot-solutions-with-azure-monitor-and-azure-resource-health/).

## Update IoT Hub

To update your IoT Hub in the Azure portal, first create a diagnostic setting, then turn off operations monitoring.  

### Create a  diagnostic setting

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.

1. On the left pane, under **Monitoring**, select **Diagnostics settings**. Then select **Add diagnostic setting**.

   :::image type="content" source="media/iot-hub-migrate-to-diagnostics-settings/open-diagnostic-settings.png" alt-text="Screenshot that highlights Diagnostic settings in the Monitoring section.":::

1. On the **Diagnostic setting** pane, give the diagnostic setting a name.

1. Under **Category details**, select the categories for the operations you want to monitor. For more information about the categories of operations available with IoT Hub, see [Resource logs](monitor-iot-hub-reference.md#resource-logs).

1. Under **Destination details**, choose where you want to send the logs. You can select any combination of these destinations:

   * Archive to a storage account
   * Stream to an event hub
   * Send to Azure Monitor Logs via a Log Analytics workspace

   The following screenshot shows a diagnostic setting that routes operations in the Connections and Device telemetry categories to a Log Analytics workspace:

   :::image type="content" source="media/iot-hub-migrate-to-diagnostics-settings/add-diagnostic-setting.png" alt-text="Screenshot showing a completed diagnostic setting.":::

1. Select **Save** to save the settings.

New settings take effect in about 10 minutes. After that, logs appear in the configured destination. For more information about configuring diagnostics, see [Collect and consume log data from your Azure resources](../azure-monitor/essentials/platform-logs-overview.md).

For more detailed information about how to create diagnostic settings, including with PowerShell and the Azure CLI, see [Diagnostic settings](../azure-monitor/essentials/diagnostic-settings.md) in the Azure Monitor documentation.

### Turn off operations monitoring

> [!NOTE]
> As of March 11, 2019, the operations monitoring feature is removed from IoT Hub's Azure portal interface. The steps below no longer apply. To migrate, make sure that the correct categories are routed to a destination with an Azure Monitor diagnostic setting above.

Once you test the new diagnostics settings in your workflow, you can turn off the operations monitoring feature. 

1. In your IoT Hub menu, select **Operations monitoring**.

2. Under each monitoring category, select **None**.

3. Save the operations monitoring changes.

## Update applications that use operations monitoring

The schemas for operations monitoring and resource logs vary slightly. It's important that you update the applications that use operations monitoring today to map to the schema used by resource logs.

Also, IoT Hub resource logs offers five new categories for tracking. After you update applications for the existing schema, add the new categories as well:

* Cloud-to-device twin operations
* Device-to-cloud twin operations
* Twin queries
* Jobs operations
* Direct Methods

For the specific schema structures, see [Resource logs](monitor-iot-hub-reference.md#resource-logs).

## Monitoring device connect and disconnect events with low latency

To monitor device connect and disconnect events in production, we recommend subscribing to the [**device disconnected** event](iot-hub-event-grid.md#event-types) on Event Grid to get alerts and monitor the device connection state. Use this [tutorial](iot-hub-how-to-order-connection-state-events.md) to learn how to integrate Device Connected and Device Disconnected events from IoT Hub in your IoT solution.

## Next steps

[Monitor IoT Hub](monitor-iot-hub.md)