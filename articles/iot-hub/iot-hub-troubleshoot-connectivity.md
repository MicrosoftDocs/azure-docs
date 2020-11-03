---
title: Monitor and troubleshoot disconnects with Azure IoT Hub
description: Learn to monitor and troubleshoot common errors with device connectivity for Azure IoT Hub 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/30/2020
ms.author: jlian
ms.custom: [mqtt, 'Role: Cloud Development', 'Role: IoT Device', 'Role: Technical Support']

# As an operator for Azure IoT Hub, I need to know how to find out when devices are disconnecting unexpectedly and troubleshoot resolve those issues right away
---
# Monitor, diagnose, and troubleshoot disconnects with Azure IoT Hub

Connectivity issues for IoT devices can be difficult to troubleshoot because there are many possible points of failure. Application logic, physical networks, protocols, hardware, IoT Hub, and other cloud services can all cause problems. The ability to detect and pinpoint the source of an issue is critical. However, an IoT solution at scale could have thousands of devices, so it's not practical to check individual devices manually. IoT Hub integrates with two Azure services to help you:

* To help you detect, diagnose, and troubleshoot these issues at scale, use the monitoring capabilities IoT Hub provides through Azure Monitor. This includes setting up alerts to trigger notifications and actions when disconnects occur and configuring logs that you can use to discover the conditions that caused disconnects.

* For critical infrastructure and to help you detect disconnects on a per-device basis, use Azure Event Grid to subscribe to events emitted by IoT Hub for device connect and disconnect.

These capabilities are limited to what IoT Hub can observe, so we also recommend that you follow monitoring best practices for your devices and other Azure services.

## Get alerts and error logs

Use Azure Monitor to get alerts and write logs when devices disconnect.

## Route connection events to logs

IoT hub continuously emits resource logs for several categories of operations. To collect this log data, though, you need to create a diagnostic setting to route it to a destination where it can be analyzed or archived. One such destination is Azure Monitor Logs via a Log Analytics workspace ([see pricing](https://azure.microsoft.com/pricing/details/log-analytics/)), where you can analyze the data using Kusto queries.

The IoT Hub [resource logs connections category](monitor-iot-hub-reference.md#connections) emits operations and errors having to do with device connections. The following screenshot shows a diagnostic setting to route these logs to a Log Analytics workspace:

:::image type="content" source="media/iot-hub-troubleshoot-connectivity/diagnostic-settings-recommendation.png" alt-text="Recommended setting to send connectivity logs to Log Analytics workspace.":::

We recommend creating a diagnostic setting as early as possible after you create your IoT hub, because, although IoT Hub always emits resource logs, they aren't collected by Azure Monitor until you route them to a destination.

To learn more about routing logs to a destination, see [Collection and routing](monitor-iot-hub.md#collection-and-routing). For detailed instructions to create a diagnostic setting, see the [Use metrics and logs tutorial](totorial-use-metrics-and-diags.md).

## Set up metric alerts for device disconnect at scale

You can set up alerts based on the platform metrics emitted by IoT Hub. With metric alerts, you can notify individuals that a condition of interest has occurred and also trigger actions that can respond to that condition automatically.

The [*Connected devices (preview)*](monitor-iot-hub-reference.md#device-metrics) metric tells you how many devices are connected to your IoT Hub. You can create alerts with static thresholds to trigger when this metric drops below a set value, or, with [Dynamic Thresholds](/azure/azure-monitor/platform/alerts-dynamic-thresholds), when this metric drops below a historically determined value.

You can use metric alert rules to monitor for device disconnect anomolies at-scale. That is, when a significant number of devices unexpectedly disconnect. When such an occurrence is detected you can look at logs to help troubleshoot the issue. To monitor per-device disconnects and disconnects for critical devices; however, you must use Event Grid. Event Grid also provides a more real-time experience than Azure metrics.

To learn more about alerts with IoT Hub, see [Alerts in Monitor IoT Hub](monitor-iot-hub.md#alerts). For a walk-through of creating alerts in IoT Hub, see the [Use metrics and logs tutorial](/tutorial-use-metrics-and-diags.md). For a more detailed overview of alerts, see [Overview of alerts in Microsoft Azure](../azure-monitor/platform/alerts-overview.md) in the Azure Monitor documentation.

## Per-device, low-latency  Detecting individual device disconnects

To detect *per-device* disconnects, such as when you need to know a factory just went offline, [configure device disconnect events with Event Grid](iot-hub-event-grid.md).

## Resolve connectivity errors

When you turn on logs and alerts for connected devices, you get alerts when errors occur. This section describes how to look for common issues when you receive an alert. The steps below assume you've already created a diagnostic setting to send IoT Hub connections logs to a Log Analytics workspace.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Browse to your IoT hub.

1. Select **Logs**.

1. To isolate connectivity error logs for IoT Hub, enter the following query and then select **Run**:

    ```kusto
    AzureDiagnostics
    | where ( ResourceType == "IOTHUBS" and Category == "Connections" and Level == "Error")
    ```

1. If there are results, look for `OperationName`, `ResultType` (error code), and `ResultDescription` (error message) to get more detail on the error.

   ![Example of error log](./media/iot-hub-troubleshoot-connectivity/diag-logs.png)

1. Follow the problem resolution guides for the most common errors:

    - **[404104 DeviceConnectionClosedRemotely](iot-hub-troubleshoot-error-404104-deviceconnectionclosedremotely.md)**
    - **[401003 IoTHubUnauthorized](iot-hub-troubleshoot-error-401003-iothubunauthorized.md)**
    - **[409002 LinkCreationConflict](iot-hub-troubleshoot-error-409002-linkcreationconflict.md)**
    - **[500001 ServerError](iot-hub-troubleshoot-error-500xxx-internal-errors.md)**
    - **[500008 GenericTimeout](iot-hub-troubleshoot-error-500xxx-internal-errors.md)**

## Device disconnect behavior over MQTT with Azure IoT SDKs

With the MQTT or MQTT over Web Sockets protocols, on SAS token renewal, Azure IoT SDKs disconnect from IoT Hub and then reconnect. In logs this shows up by informational device disconnect and connect events sometimes accompanied by error events. By default, the token lifespan is 60 minutes, for all SDKs.

The following table shows the token lifespan, renewal, and renewal behavior for each of the SDKs:

| SDK | Token lifespan | Token renewal | Renewal behavior |
|-----|----------|---------------------|---------|
| .NET | 60 minutes, configurable | 85% of lifespan, configurable | SDK connects and disconnects at token lifespan plus a 10 minute grace period. Informational events and errors generated in logs. |
| Java | 60 minutes, configurable | 85% of lifespan, not configurable | SDK connects and disconnects at token lifespan plus a 10 minute grace period. Informational events and errors generated in logs. |
| Node.js | 60 minutes, configurable | configurable | SDK connects and disconnects at token renewal. Only informational events are generated in logs. |
| Python | 60 minutes, not configurable | -- | SDK connects and disconnects at token lifespan. |

The following screenshots show the token renewal behavior in Azure Monitor Logs for different SDKs. The token lifespan and renewal threshold have been changed from default as noted for each screenshot. The following query was used:

```kusto
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
| where Category == "Connections"
| extend parsed_json = parse_json(properties_s)
| extend SDKVersion = tostring(parsed_json.sdkVersion) , DeviceId = tostring(parsed_json.deviceId) , Protocol =  tostring(parsed_json.protocol)
| distinct TimeGenerated, OperationName, Level, ResultType, ResultDescription, DeviceId, Protocol, SDKVersion

```

* .NET device SDK with a 1200 sec (20 min) token lifespan and renewal set to happen at 90% of lifespan. disconnects happen every 30 minutes:

    :::image type="content" source="media/iot-hub-troubleshoot-connectivity/net-mqtt.png" alt-text="Error behavior for token renewal over MQTT in Azure Monitor Logs with .NET SDK.":::

* Java SDK with a 300 second (5 min) token lifespan and default 85% of lifespan renewal. Disconnects happen every 15 minutes:

    :::image type="content" source="media/iot-hub-troubleshoot-connectivity/java-mqtt.png" alt-text="Error behavior for token renewal over MQTT in Azure Monitor Logs with Java SDK.":::

* Node SDK with a 300 sec (5 min) token lifespan and token renewal set to happen at 3 minutes. Disconnects happen on token renewal. Also, there are no errors, only informational connect/disconnect events are emitted:

    :::image type="content" source="media/iot-hub-troubleshoot-connectivity/node-mqtt.png" alt-text="Error behavior for token renewal over MQTT in Azure Monitor Logs with Node SDK.":::

As an IoT solutions developer or operator, you need to be aware of this behavior in order to interpret connect/disconnect events and errors in logs. If you want to change the token lifespan or renewal behavior for devices, check to see whether a device implements a device twin setting or a device method that makes this possible. If you're monitoring device connections with Event Hub, make sure you build in a way of filtering out disconnects due to SAS token renewal; for example, by not not triggering actions based on disconnects as long as the disconnect is followed by a connect within a certain time span.

## I tried the steps, but they didn't work

If the previous steps didn't help, try:

* If you have access to the problematic devices, either physically or remotely (like SSH), follow the [device-side troubleshooting guide](https://github.com/Azure/azure-iot-sdk-node/wiki/Troubleshooting-Guide-Devices) to continue troubleshooting.

* Verify that your devices are **Enabled** in the Azure portal > your IoT hub > IoT devices.

* If your device uses MQTT protocol, verify that port 8883 is open. For more information, see [Connecting to IoT Hub (MQTT)](iot-hub-mqtt-support.md#connecting-to-iot-hub).

* Get help from [Microsoft Q&A question page for Azure IoT Hub](/answers/topics/azure-iot-hub.html), [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-iot-hub), or [Azure support](https://azure.microsoft.com/support/options/).

To help improve the documentation for everyone, leave a comment in the feedback section below if this guide didn't help you.

## Next steps

* To learn more about resolving transient issues, see [Transient fault handling](/azure/architecture/best-practices/transient-faults).

* To learn more about Azure IoT SDK and managing retries, see [How to manage connectivity and reliable messaging using Azure IoT Hub device SDKs](iot-hub-reliability-features-in-sdks.md#connection-and-retry).