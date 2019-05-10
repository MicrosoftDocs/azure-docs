---
title: Diagnose and troubleshoot disconnects with Azure IoT Hub
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
# Detect and troubleshoot disconnects with Azure IoT Hub

Connectivity issues for IoT devices can be difficult to troubleshoot because there are many possible points of failure. Device-side application logic, physical networks, protocols, hardware, and Azure IoT Hub can all cause problems. This article provides recommendations on how to detect and troubleshoot device connectivity issues from the cloud side (as opposed to device side).

## Get alerts and error logs

Use Azure Monitor to get alerts and write logs when device connections drop.

### Turn on diagnostic logs

To log device connection events and errors, turn on diagnostics for IoT Hub.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Browse to your IoT hub.

3. Select **Diagnostics settings**.

4. Select **Turn on diagnostics**.

5. Enable **Connections** logs to be collected.

6. For easier analysis, turn on **Send to Log Analytics** ([see pricing](https://azure.microsoft.com/pricing/details/log-analytics/)). See the example under [Resolve connectivity errors](#resolve-connectivity-errors).

   ![Recommended settings](./media/iot-hub-troubleshoot-connectivity/diagnostic-settings-recommendation.png)

To learn more, see [Monitor the health of Azure IoT Hub and diagnose problems quickly](iot-hub-monitor-resource-health.md).

### Set up alerts for the _connected devices_ count metric

To get alerts when devices disconnect, configure alerts on the **connected devices (preview)** metric.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Browse to your IoT hub.

3. Select **Alerts**.

4. Select **New alert rule**.

5. Select **Add condition**, then select "Connected devices (preview)".

6. Finish setting up your desired thresholds and alerting options by following prompts.

To learn more, see [What are classic alerts in Microsoft Azure?](../azure-monitor/platform/alerts-overview.md).

## Resolve connectivity errors

When you turn on diagnostic logs and alerts for connected devices, you get alerts when errors occur. This section describes how to resolve common issues when you receive an alert. The steps below assume you've set up Azure Monitor logs for your diagnostic logs.

1. Go your workspace for **Log Analytics** in the Azure portal.

2. Select **Log Search**.

3. To isolate connectivity error logs for IoT Hub, enter the following query and then select **Run**:

    ```
    search *
    | where ( Type == "AzureDiagnostics" and ResourceType == "IOTHUBS")
    | where ( Category == "Connections" and Level == "Error")
    ```

1. If there are results, look for `OperationName`, `ResultType` (error code), and `ResultDescription` (error message) to get more detail on the error.

   ![Example of error log](./media/iot-hub-troubleshoot-connectivity/diag-logs.png)

2. Use this table to understand and resolve common errors.

    | Error | Root cause | Resolution |
    |-------|------------|------------|
    | 404104 DeviceConnectionClosedRemotely | The connection was closed by the device, but IoT Hub doesn't know why. Common causes include MQTT/AMQP timeout and internet connectivity loss. | Make sure the device can connect to IoT Hub by [testing the connection](tutorial-connectivity.md). If the connection is fine, but the device disconnects intermittently, make sure to implement proper keep alive device logic for your choice of protocol (MQTT/AMPQ). |
    | 401003 IoTHubUnauthorized | IoT Hub couldn't authenticate the connection. | Make sure that the SAS or other security token you use isn't expired. [Azure IoT SDKs](iot-hub-devguide-sdks.md) automatically generate tokens without requiring special configuration. |
    | 409002 LinkCreationConflict | A device has more than one connection. When a new connection request comes for a device, IoT Hub closes the previous one with this error. | In the most common case, a device detects a disconnect and tries to reestablish the connection, but IoT Hub still considers the device connected. IoT Hub closes the previous connection and logs this error. This error usually appears as a side effect of a different, transient issue, so look for other errors in the logs to troubleshoot further. Otherwise, make sure to issue a new connection request only if the connection drops. |
    | 500001 ServerError | IoT Hub ran into a server-side issue. Most likely, the issue is transient. While the IoT Hub team works hard to maintain [the SLA](https://azure.microsoft.com/support/legal/sla/iot-hub/), small subsets of IoT Hub nodes can occasionally experience transient faults. When your device tries to connect to a node that's having issues, you receive this error. | To mitigate the transient fault, issue a retry from the device. To [automatically manage retries](iot-hub-reliability-features-in-sdks.md#connection-and-retry), make sure you use the latest version of the [Azure IoT SDKs](iot-hub-devguide-sdks.md).<br><br>For best practice on transient fault handling and retries, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).  <br><br>If the problem persists after retries, check [Resource Health](iot-hub-monitor-resource-health.md#use-azure-resource-health) and [Azure Status](https://azure.microsoft.com/status/history/) to see if IoT Hub has a known problem. If there's no known problems and the issue continues, [contact support](https://azure.microsoft.com/support/options/) for further investigation. |
    | 500008 GenericTimeout | IoT Hub couldn't complete the connection request before timing out. Like a 500001 ServerError, this error is likely transient. | Follow troubleshooting steps for a 500001 ServerError to the root cause and resolve this error.|

## Other steps to try

If the previous steps didn't help, you can try:

* If you have access to the problematic devices, either physically or remotely (like SSH), follow the [device-side troubleshooting guide](https://github.com/Azure/azure-iot-sdk-node/wiki/Troubleshooting-Guide-Devices) to continue troubleshooting.

* Verify that your devices are **Enabled** in the Azure portal > your IoT hub > IoT devices.

* Get help from [Azure IoT Hub forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=azureiothub), [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-iot-hub), or [Azure support](https://azure.microsoft.com/support/options/).

To help improve the documentation for everyone, leave a comment in the feedback section below if this guide didn't help you.

## Next steps

* To learn more about resolving transient issues, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).

* To learn more about Azure IoT SDK and managing retries, see [How to manage connectivity and reliable messaging using Azure IoT Hub device SDKs](iot-hub-reliability-features-in-sdks.md#connection-and-retry).
