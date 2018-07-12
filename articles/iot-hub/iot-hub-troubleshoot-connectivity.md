---
title: Diagnose and troubleshoot connectivity issues with Azure IoT Hub
description: Learn to diagnose and troubleshoot common errors with device connectivity for Azure IoT Hub 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/05/2018
ms.author: jlian
# As an operator for Azure IoT Hub, I need to know how to find out when devices are disconnecting unexpectedly and troubleshoot resolve those issues right away
---

# Detect and troubleshoot connectivity issues with Azure IoT Hub

Connectivity between device and cloud can be tricky to deal with. This article guides you through steps to take to detect and troubleshoot connectivity issues from the cloud side.  

## Detect device to IoT Hub connectivity issues using Azure Monitor

### Turn on Diagnostic Logs 

To store and analyse device connection server-side logs (for both informational and errors), we recommend turning on Diagnostic Logs from Azure Monitor. 

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Navigate to your IoT Hub
1. Select **Diagnostics settings**
1. Then select **Turn on diagnostics**
1. Make sure you enable **Connections** logs to be collected. 
1. To make analysis easier, we also recommend turning on **Send to Log Analytics** ([see pricing](https://azure.microsoft.com/pricing/details/log-analytics/)). An example later in the article uses Log Analytics.

   ![Recommended settings][2]

To learn more about using Azure Monitor with IoT Hub, see [Monitor the health of Azure IoT Hub and diagnose problems quickly](iot-hub-monitor-resource-health.md).

### Set up alerts for connected devices count metric

To be notified when the number of connected devices unexpectedly drops below a certain number, we recommend configuring alerts on the "connected devices" metric. For example, if you have 10 devices that should be connected to your IoT Hub at all times, you should set up an alert for when the "connected devices" metric drops below 10. 

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Navigate to your IoT Hub
1. Select **Alerts (classic)**
1. Click **Add metric alert (classic)**
1. Fill in the form and select **OK**. 

   ![Recommended metric alert][3]

## Troubleshooting device to IoT Hub connectivity issues

After Diagnostic Logs and alert for connected devices are turned on, you could start getting alerts when things go wrong. Learn what to do when you get an alert in this section. The steps below assume you've set up Log Analytics for your diagnostic logs.

1. Go to **Log Analytics** in Azure portal
1. Click **Log Search**
1. To isolate diagnostic logs for IoT Hub, enter this query

    ```
    search *
    | where ( Type == "AzureDiagnostics" and ResourceType == "IOTHUBS")
    ```

1. To isolate only errors on connection and disconnections, also enter

    ```
    | where ( Category == "Connections" and Level == "Error")
    ```

1. If there are results, look for the `OperationName`, `ResultType` (error code), and `ResultDescription` (error message) to get more detail on the error.

   ![Example of error log][4]

1. Use this table to understand and mitigate common errors

| Error | Root cause | Resolution |
|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 404104 DeviceConnectionClosedRemotely | The connection was closed by the device but IoT Hub doesn't know why. Common causes include MQTT/AMQP timeout and internet connectivity loss. | Make sure the device can connect to IoT Hub by testing the connection. If the connection is fine but the device disconnects intermittently, make sure to implement proper keep alive device logic for your choice of protocol (MQTT/AMPQ). |
| 401003 IoTHubUnauthorized | IoT Hub couldn't authorize the connection. | Make sure that the SAS or other security token you use isn't expired. Note that Azure IoT SDKs automatically generate tokens without requiring special configuration. |
| 409002 LinkCreationConflict | There are multiple connections for the same device. When a new connection attempt come for a device IoT Hub closes the previous one with this error. | Make sure to issue a new connection request only if the connection drops. |
| 500001 ServerError | The particular IoT Hub instance encountered a server-side issue. This can occasionally happen due to planned maintenance and upgrade on the underlying infrastructure of IoT Hub, which is necessary for making sure fixes and improvements are consistently rolled out.  | IoT Hub is designed to be redundant and two instances would never be faulty at once. To connect to a new instance automatically, issue a reconnect from the device. Note that Azure IoT SDKs automatically manage reconnects. Learn more about handling transient faults.  |
| 500008 GenericTimeout |  |  |

### Other things you can do

i.	Check the service health in the region where your hub is in, using the service health dashboard. Link to service health dashboard <TBD>. If there are any notifications from the IoT Hub service indicating an outage, wait for further notifications on the issue.
ii.	If there are no notifications in the service health dashboard, check the status of your IoT Hub resource using Azure resource health blade. Link to doc on how to use resource health <TBD>

To get more details, you may have to get device-side logs to troubleshoot further.

## Next steps

Use our SDK which has a great retry policy built in. Helps you recover from transient errors.

<!-- Images -->
[1]: ../../includes/media/iot-hub-diagnostics-settings/turnondiagnostics.png
[2]: ./media/iot-hub-troubleshoot-connectivity/diagnostic-settings-recommendation.png
[3]: ./media/iot-hub-troubleshoot-connectivity/metric-alert.png
[4]: ./media/iot-hub-troubleshoot-connectivity/diag-logs.png