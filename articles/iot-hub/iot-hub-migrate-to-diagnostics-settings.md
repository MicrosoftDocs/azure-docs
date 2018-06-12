---
title: Azure IoT Hub migrate to diagnostics settings | Microsoft Docs
description: How to update Azure IoT Hub to use Azure diagnostics settings instead of operations monitoring to monitor the status of operations on your IoT hub in real time.
author: kgremban
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 10/10/2017
ms.author: kgremban
---

# Migrate your IoT Hub from operations monitoring to diagnostics settings

Customers using [operations monitoring][lnk-opsmon] to track the status of operations in IoT Hub can migrate that workflow to [Azure diagnostics settings][lnk-diagnostics-settings], a feature of Azure Monitor. Diagnostics settings supply resource-level diagnostic information for many Azure services.

The operations monitoring functionality of IoT Hub is deprecated, and will be removed in the future. This article provides steps to move your workloads from operations monitoring to diagnostics settings. For more information about the deprecation timeline, see [Monitor your Azure IoT solutions with Azure Monitor and Azure Resource Health][lnk-blog-announcement].

## Update IoT Hub

To update your IoT Hub in the Azure portal, first turn on diagnostics settings, then turn off operations monitoring.  

[!INCLUDE [iot-hub-diagnostics-settings](../../includes/iot-hub-diagnostics-settings.md)]

### Turn off operations monitoring

Once you have tested the new diagnostics settings on your workflow, you can turn off the operations monitoring feature. 

1. In your IoT Hub menu, select **Operations monitoring**.
1. Under each monitoring category, select **None**.
1. Save the operations monitoring changes.

## Update applications that use operations monitoring

The schemas for operations monitoring and diagnostics settings vary slightly. It's important that you update the applications that use operations monitoring today to map to the schema used by diagnostics settings. 

Also, diagnostics settings offers tracking for five new categories. After you update applications for the existing schema, add the new categories as well:

- Cloud-to-device twin operations
- Device-to-cloud twin operations
- Twin queries
- Jobs operations
- Direct Methods

For the specific schema structures, see [Understand the schema for diagnostics settings][lnk-diagnostics-schema].

## Next steps

- [Monitor the health of Azure IoT Hub and diagnose problems quickly][lnk-monitor]

[lnk-opsmon]: iot-hub-operations-monitoring.md
[lnk-diagnostics-settings]: ../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md
[lnk-diagnostics-schema]: iot-hub-monitor-resource-health.md#understand-the-logs
[lnk-blog-announcement]: https://azure.microsoft.com/blog/monitor-your-azure-iot-solutions-with-azure-monitor-and-azure-resource-health/
[lnk-monitor]: iot-hub-monitor-resource-health.md
