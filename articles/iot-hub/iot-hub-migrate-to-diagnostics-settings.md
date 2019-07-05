---
title: Azure IoT Hub migrate to diagnostics settings | Microsoft Docs
description: How to update Azure IoT Hub to use Azure diagnostics settings instead of operations monitoring to monitor the status of operations on your IoT hub in real time.
author: kgremban
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 03/11/2019
ms.author: kgremban
---

# Migrate your IoT Hub from operations monitoring to diagnostics settings

Customers using [operations monitoring](iot-hub-operations-monitoring.md) to track the status of operations in IoT Hub can migrate that workflow to [Azure diagnostics settings](../azure-monitor/platform/diagnostic-logs-overview.md), a feature of Azure Monitor. Diagnostics settings supply resource-level diagnostic information for many Azure services.

**The operations monitoring functionality of IoT Hub is deprecated**, and has been removed from the portal. This article provides steps to move your workloads from operations monitoring to diagnostics settings. For more information about the deprecation timeline, see [Monitor your Azure IoT solutions with Azure Monitor and Azure Resource Health](https://azure.microsoft.com/blog/monitor-your-azure-iot-solutions-with-azure-monitor-and-azure-resource-health/).

## Update IoT Hub

To update your IoT Hub in the Azure portal, first turn on diagnostics settings, then turn off operations monitoring.  

[!INCLUDE [iot-hub-diagnostics-settings](../../includes/iot-hub-diagnostics-settings.md)]

### Turn off operations monitoring

> [!NOTE]
> As of March 11, 2019, the operations monitoring feature is removed from IoT Hub's Azure portal interface. The steps below no longer apply. To migrate, make sure that the correct categories are turned on in Azure Monitor diagnostic settings above.

Once you test the new diagnostics settings in your workflow, you can turn off the operations monitoring feature. 

1. In your IoT Hub menu, select **Operations monitoring**.

2. Under each monitoring category, select **None**.

3. Save the operations monitoring changes.

## Update applications that use operations monitoring

The schemas for operations monitoring and diagnostics settings vary slightly. It's important that you update the applications that use operations monitoring today to map to the schema used by diagnostics settings. 

Also, diagnostics settings offers five new categories for tracking. After you update applications for the existing schema, add the new categories as well:

* Cloud-to-device twin operations
* Device-to-cloud twin operations
* Twin queries
* Jobs operations
* Direct Methods

For the specific schema structures, see [Understand the schema for diagnostics settings](iot-hub-monitor-resource-health.md#understand-the-logs).

## Monitoring device connect and disconnect events with low latency

To monitor device connect and disconnect events in production, we recommend subscribing to the [**device disconnected** event](iot-hub-event-grid.md#event-types) on Event Grid to get alerts and monitor the device connection state. Use this [tutorial](iot-hub-how-to-order-connection-state-events.md) to learn how to integrate Device Connected and Device Disconnected events from IoT Hub in your IoT solution.

## Next steps

[Monitor the health of Azure IoT Hub and diagnose problems quickly](iot-hub-monitor-resource-health.md)
