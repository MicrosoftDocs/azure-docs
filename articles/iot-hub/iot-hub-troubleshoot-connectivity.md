---
title: Diagnose and troubleshoot connectivity drops with Azure IoT Hub
description: Learn to diagnose and troubleshoot common errors with device connectivity for Azure IoT Hub 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/19/2018
ms.author: jlian
# As an operator for Azure IoT Hub, I need to know how to find out when devices are disconnecting unexpectedly and troubleshoot resolve those issues right away
---

# Detect and troubleshoot connectivity drops with Azure IoT Hub

Connectivity for IoT devices can be difficult to troubleshoot because there are many possible points of failure. Device-side application logic, physical networks, protocols, hardware, Azure IoT Hub can all cause problems to happen. This document describes Microsoft's recommendation on how to detect and troubleshoot connectivity drops from the cloud side (as opposed to device side).

## Use Azure Monitor to get alerts and logs when device connections drop

### Turn on Diagnostic Logs 

To log device connection events and errors, turn on diagnostics for IoT Hub. 

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Navigate to your IoT Hub
1. Select **Diagnostics settings**
1. Then select **Turn on diagnostics**
1. Make sure you enable **Connections** logs to be collected. 
1. To make analysis easier, we also recommend turning on **Send to Log Analytics** ([see pricing](https://azure.microsoft.com/pricing/details/log-analytics/)). An example later in the article uses Log Analytics.

   ![Recommended settings][2]

To learn more about using Azure Monitor with IoT Hub, see [Monitor the health of Azure IoT Hub and diagnose problems quickly](iot-hub-monitor-resource-health.md).

### Set up alerts for connected devices count metric

To get alerts upon connection drops, configure alerts on the *Connected devices* metric. 

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Navigate to your IoT Hub
1. Select **Alerts (classic)**
1. Click **Add metric alert (classic)**
1. Fill in the form and select **OK**. 

   ![Recommended metric alert][3]

To learn more about metric alerts, see [What are classic alerts in Microsoft Azure?](../monitoring-and-diagnostics/monitoring-overview-alerts.md).

## Common errors and resolution for connectivity drops

After Diagnostic Logs and alert for connected devices are turned on, you start getting alerts when things go wrong. Learn what to do when you get an alert in this section. The steps below assume you've set up Log Analytics for your diagnostic logs.

1. Go your workspace for **Log Analytics** in Azure portal
1. Click **Log Search**
1. To isolate connectivity error logs for IoT Hub, enter this query in the box, then press **Run**

    ```
    search *
    | where ( Type == "AzureDiagnostics" and ResourceType == "IOTHUBS")
    | where ( Category == "Connections" and Level == "Error")
    ```

1. If there are results, look for the `OperationName`, `ResultType` (error code), and `ResultDescription` (error message) to get more detail on the error.

   ![Example of error log][4]

1. Use this table to understand and mitigate common errors

| Error | Root cause | Resolution |
|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 404104 DeviceConnectionClosedRemotely | The connection was closed by the device but IoT Hub doesn't know why. Common causes include MQTT/AMQP timeout and internet connectivity loss. | Make sure the device can connect to IoT Hub by [testing the connection](tutorial-connectivity.md). If the connection is fine but the device disconnects intermittently, make sure to implement proper keep alive device logic for your choice of protocol (MQTT/AMPQ). |
| 401003 IoTHubUnauthorized | IoT Hub couldn't authenticate the connection. | Make sure that the SAS or other security token you use isn't expired. [Azure IoT SDKs](iot-hub-devguide-sdks.md) automatically generate tokens without requiring special configuration. |
| 409002 LinkCreationConflict | There are more than one connections for the same device. When a new connection request comes for a device, IoT Hub closes the previous one with this error. | Make sure to issue a new connection request only if the connection drops. |
| 500001 ServerError | IoT Hub ran into a server-side issue. The error is likely transient. While IoT Hub team works hard to maintain [the SLA](https://azure.microsoft.com/support/legal/sla/iot-hub/), portions of IoT Hub can occasionally experience transient faults. One of the reasons is underlying infrastructure upgrade, which takes place piece by piece to make sure not all customers are affected at once. When your device tries to connect to a portion that's upgrading or having issues, you receive this error.  | To mitigate the transient fault, issue a retry from the device. To automatically manage retries, make sure you use the latest version of the [Azure IoT SDKs](iot-hub-devguide-sdks.md).<br><br>For best practice on transient fault handling and retries, see [Transient fault handling](/azure/architecture/best-practices/transient-faults.md).  <br><br>If the problem persists after retries, check [Resource Health](iot-hub-monitor-resource-health.md#use-azure-resource-health) and [Azure Status](https://azure.microsoft.com/status/history/) to see if IoT Hub has a known problem.  |
| 500008 GenericTimeout | IoT Hub couldn't complete the connection request before timing out. Like 500001 ServerError, this error is likely transient. | Follow troubleshooting steps for 500001 ServerError to root cause and resolve this error.|

## Other steps to try

If the steps above didn't help, here are few more things to try

* If you have access to the problematic devices, either physically or remotely (like SSH), follow the [device-side troubleshooting guide](https://github.com/Azure/azure-iot-sdk-node/wiki/Troubleshooting-Guide-Devices) to continue troubleshooting
* Verify that your devices are **Enabled** in Azure portal > your IoT Hub > IoT devices
* Get help from [Azure IoT Hub forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azureiothub), [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-iot-hub), or [Azure support](https://azure.microsoft.com/support/options/)

To help improve the documentation for everyone, leave a comment below if this guide didn't help you.

<!-- Images -->
[1]: ../../includes/media/iot-hub-diagnostics-settings/turnondiagnostics.png
[2]: ./media/iot-hub-troubleshoot-connectivity/diagnostic-settings-recommendation.png
[3]: ./media/iot-hub-troubleshoot-connectivity/metric-alert.png
[4]: ./media/iot-hub-troubleshoot-connectivity/diag-logs.png