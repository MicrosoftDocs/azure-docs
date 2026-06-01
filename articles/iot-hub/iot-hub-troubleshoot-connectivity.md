---
title: Monitor and Troubleshoot Azure IoT Hub Device Connectivity
description: Learn to monitor and troubleshoot common errors with device connectivity for Azure IoT Hub.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
ms.topic: troubleshooting-general
ms.date: 04/27/2026
ms.custom:
  - mqtt
  - 'Role: Cloud Development'
  - 'Role: IoT Device'
  - 'Role: Technical Support'
  - fasttrack-edit
  - iot
  - sfi-image-nochange
#Customer intent: As an operator for Azure IoT Hub, I need to know how to find out when devices are disconnecting unexpectedly and troubleshoot resolve those issues right away.
---

# Monitor, diagnose, and troubleshoot Azure IoT Hub device connectivity

Connectivity issues for IoT devices can be difficult to troubleshoot because there are many possible points of failure. Application logic, physical networks, protocols, hardware, IoT Hub, and other cloud services can all cause problems. The ability to detect and pinpoint the source of an issue is critical. However, an IoT solution at scale could have thousands of devices, so it's not practical to check individual devices manually. IoT Hub integrates with two Azure services to help you:

* **Azure Monitor**: Azure Monitor enables you to collect, analyze, and act on telemetry from IoT Hub. To help you detect, diagnose, and troubleshoot these issues at scale, use the monitoring capabilities IoT Hub provides through Azure Monitor. This approach includes setting up alerts to trigger notifications and actions when disconnects occur and configuring logs that you can use to discover the conditions that caused disconnects.

* **Azure Event Grid**: For critical infrastructure and per-device disconnects, use Azure Event Grid to subscribe to device connect and disconnect events emitted by IoT Hub. Azure Event Grid enables you to use any of the following event handlers:
  - Azure Functions
  - Logic Apps
  - Azure Automation
  - WebHooks
  - Queue Storage
  - Hybrid Connections
  - Event Hubs

## Protocols and ports

A device can use any of the following protocols to connect to your IoT hub. If the outbound port is blocked by a firewall, the device can't connect.

| Protocol | Outbound port |
| --- | --- |
| MQTT | 8883 |
| MQTT over WebSockets | 443 |
| AMQP | 5671 |
| AMQP over WebSockets | 443 |
| HTTPS | 443 |

For more information about Message Queuing Telemetry Transport (MQTT) connectivity, see [Connect to IoT Hub](iot-mqtt-connect-to-iot-hub.md#connect-to-iot-hub).

## Verify device connectivity

Use the Azure CLI and IoT Hub portal tools to verify that a device can connect and communicate with your hub. The steps in this section help you isolate whether the issue is with device authentication, device-to-cloud messaging, cloud-to-device messaging, or device twin synchronization.

### Prerequisites for connectivity verification

* The [Azure CLI](/cli/azure/install-azure-cli) with the [azure-iot extension](/cli/azure/iot) installed:

  ```azurecli
  az extension add --upgrade --name azure-iot
  ```

* A device registered in your IoT hub with a connection string. To register a test device and retrieve its connection string, run the following commands. Replace `<your-device-id>` with the name of your new device, and replace `<your-iot-hub-name>` with an IoT hub that you already created.

  ```azurecli
  az iot hub device-identity create --device-id <your-device-id> --hub-name <your-iot-hub-name>

  az iot hub device-identity connection-string show --device-id <your-device-id> --hub-name <your-iot-hub-name>
  ```

### Check device authentication

A device must authenticate with your hub before it can exchange data. To test authentication:

1. Use the Azure CLI to send a test telemetry message from the device identity. A successful send confirms the device key is valid:

   ```azurecli
   az iot device simulate --device-id <your-device-id> --hub-name <your-iot-hub-name> --msg-count 1
   ```

1. If authentication fails, verify the device connection string is current. Reset the primary key to generate a new one if needed:

   ```azurecli
   az iot hub device-identity update --device-id <your-device-id> --set authentication.symmetricKey.primaryKey="" --hub-name <your-iot-hub-name>
   ```

   Then retrieve the updated connection string:

   ```azurecli
   az iot hub device-identity connection-string show --device-id <your-device-id> --hub-name <your-iot-hub-name>
   ```

#### Generate a test SAS token

If your device uses SAS token authentication, you can generate a known-good SAS token to rule out issues with your token generation code:

```azurecli
az iot hub generate-sas-token --device-id <your-device-id> --hub-name <your-iot-hub-name>
```

A valid SAS token looks like: `SharedAccessSignature sr=your-hub.azure-devices.net%2Fdevices%2FmyDevice&sig=xxxxxx&se=111111`

For code examples showing how to generate SAS tokens programmatically, see the [Azure IoT samples for Node.js](https://github.com/Azure-Samples/azure-iot-samples-node) in the **iot-hub/Tutorials/ConnectivityTests** folder.

### Check device-to-cloud connectivity

To verify that telemetry sent by a device reaches your hub:

1. Send test telemetry messages from the device:

   ```azurecli
   az iot device simulate --device-id <your-device-id> --hub-name <your-iot-hub-name> --msg-count 5
   ```

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub. Under **Monitoring** in the sidebar menu, select **Metrics**.

1. In the **Metric** dropdown, select **Telemetry messages sent** as the metric and set the time range in the upper-right corner to **Last hour**. The chart shows the aggregate count of messages sent by the device.

   > [!NOTE]
   > It takes a few minutes for the metrics to become available after you send the messages.

### Check cloud-to-device connectivity

To verify the cloud-to-device path, use a direct method call. Run the simulated device in one terminal window, then invoke a direct method from another:

```azurecli
az iot hub invoke-device-method --device-id <your-device-id> --method-name TestMethod --timeout 10 --method-payload '{"key":"value"}' --hub-name <your-iot-hub-name>
```

A successful response confirms that the hub can reach the device. If the call times out, verify the device is connected and listening for method calls.

### Check device twin synchronization

To verify that device twin data synchronizes between the device and the hub:

1. View the current device twin to check reported properties:

   ```azurecli
   az iot hub device-twin show --device-id <your-device-id> --hub-name <your-iot-hub-name>
   ```

1. Send a desired property update and confirm the device receives it:

   ```azurecli
   az iot hub device-twin update --set properties.desired='{"mydesiredproperty":"propertyvalue"}' --device-id <your-device-id> --hub-name <your-iot-hub-name>
   ```

1. Run the twin show command again to confirm the device acknowledged the desired property in its reported properties.

## Event Grid vs. Azure Monitor

Event Grid provides a low-latency, per-device monitoring solution that you can use to track device connections for critical devices and infrastructure. Azure Monitor provides a metric called *Connected devices* that you can use to monitor the number of devices connected to your IoT Hub and trigger an alert when that number drops below a static threshold.

Consider the following issues when deciding whether to use Event Grid or Azure Monitor for a particular scenario:

* Alert latency: IoT Hub connection events are delivered much more quickly through Event Grid. This fact makes Event Grid a better choice for scenarios where quick notification is desirable.

* Per-device notifications: Event Grid provides the ability to track connects and disconnects for individual devices. This fact makes Event Grid a better choice for scenarios where you need to monitor the connections for critical devices.

* Lightweight setup: Azure Monitor metric alerts provide a lightweight setup experience that doesn't require integrating with other services to deliver notifications through Email, SMS, Voice, and other notifications. With Event Grid, you need to integrate with other Azure services to deliver notifications. Both services can integrate with other services to trigger more complex actions.

## Event Grid: Monitor connect and disconnect events

Event Grid provides lower event latency than Azure Monitor, and you can monitor on a per-device basis. These factors make Event Grid the preferred method for monitoring critical devices and infrastructure.

> [!NOTE]
> To monitor device connect and disconnect events in production, we recommend subscribing to the [**DeviceConnected** and **DeviceDisconnected** events](iot-hub-event-grid.md#event-types) in Event Grid to trigger alerts and monitor device connection state.

When you use Event Grid to monitor or trigger alerts on device disconnects, make sure you build in a way of filtering out the periodic disconnects due to SAS token renewal on devices that use the Azure IoT SDKs. To learn more, see [MQTT device disconnect behavior with Azure IoT SDKs](#mqtt-device-disconnect-behavior-with-azure-iot-sdks).

Explore the following articles to learn more about monitoring device connection events with Event Grid:

* For an overview of using Event Grid with IoT Hub, see [React to IoT Hub events with Event Grid](iot-hub-event-grid.md). Pay particular attention to the [Limitations for device connection state events](iot-hub-event-grid.md#limitations-for-device-connection-state-events) section.

* For a tutorial about ordering device connection events, see [Order device connection events from Azure IoT Hub using Azure Cosmos DB](iot-hub-how-to-order-connection-state-events.md).

* For a tutorial about sending Email notifications, see [Send email notifications about Azure IoT Hub events using Event Grid and Logic Apps](../event-grid/publish-iot-hub-events-to-logic-apps.md) in the Event Grid documentation.

## Azure Monitor: Use logs to resolve connectivity errors

When you detect device disconnects by using Azure Monitor metric alerts or Event Grid, you can use logs to help troubleshoot the reason. This section describes how to look for common issues in Azure Monitor Logs. The steps here assume that you already created a [diagnostic setting](monitor-iot-hub.md#route-connection-events-to-logs) to send IoT Hub Connections logs to a Log Analytics workspace.

After you create a diagnostic setting to route IoT Hub resource logs to Azure Monitor Logs, follow these steps to view the logs in Azure portal.

1. Navigate to your IoT hub in [Azure portal](https://portal.azure.com).

1. Under **Monitoring** on the sidebar menu of your IoT hub, select **Logs**.

1. Switch from **Simple mode** to **KQL mode**. To isolate connectivity error logs for IoT Hub, enter the following query in the query editor and then select **Run**:

    ```kusto
    AzureDiagnostics
    | where ( ResourceType == "IOTHUBS" and Category == "Connections" and Level == "Error")
    ```

1. If there are results, look for `OperationName`, `ResultType` (error code), and `ResultDescription` (error message) to get more detail.

    :::image type="content" source="media/iot-hub-troubleshoot-connectivity/diag-logs.png" alt-text="Screenshot that shows an example of an error log." lightbox="media/iot-hub-troubleshoot-connectivity/diag-logs.png":::

Use the following problem resolution guides for help with the most common errors:

* [400027 ConnectionForcefullyClosedOnNewConnection](troubleshoot-error-codes.md#400xxx-bad-request-errors)

* [404104 DeviceConnectionClosedRemotely](troubleshoot-error-codes.md#404104-deviceconnectionclosedremotely-error)

* [401003 IoTHubUnauthorized](troubleshoot-error-codes.md#401003-iothubunauthorized-error)

* [409002 LinkCreationConflict](troubleshoot-error-codes.md#409002-linkcreationconflict-error)

* [500001 ServerError](troubleshoot-error-codes.md#500xxx-internal-server-errors)

* [500008 GenericTimeout](troubleshoot-error-codes.md#500xxx-internal-server-errors)

## Azure Monitor: Use logs to monitor connectivity for a specific device

There might be situations when you want to use Azure Monitor to see connectivity errors and information for a specific device. To isolate connectivity events for a device, you can follow the same steps as in the preceding section, but enter the following query. Replace `<your-device-id>` with the name of your device.

```kusto
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
| where Category == "Connections"
| extend DeviceId = tostring(parse_json(properties_s).deviceId)
| where DeviceId == "<your-device-id>"
```

The query returns both error and informational events for your target device. The following example output shows an informational **deviceConnect** event:

:::image type="content" source="media/iot-hub-troubleshoot-connectivity/device-connect-event.png" alt-text="Screenshot of deviceConnect event in logs." lightbox="media/iot-hub-troubleshoot-connectivity/device-connect-event.png":::

## MQTT device disconnect behavior with Azure IoT SDKs

Azure IoT device SDKs disconnect from IoT Hub and then reconnect when they renew SAS tokens over the MQTT (and MQTT over WebSockets) protocol. In logs, this shows up as informational device disconnect and connect events sometimes accompanied by error events.

By default, the token lifespan is 60 minutes for all SDKs; however, developers can change it in some of the SDKs. The following table summarizes the token lifespan, token renewal, and token renewal behavior for each of the SDKs:

| SDK | Token lifespan | Token renewal | Renewal behavior |
|-----|----------|---------------------|---------| 
| .NET | 60 minutes, configurable | 85% of lifespan, configurable | SDK disconnects and reconnects at token lifespan plus a 10-minute grace period. Informational events and errors generated in logs. |
| Java | 60 minutes, configurable | 85% of lifespan, not configurable | SDK disconnects and reconnects at token lifespan plus a 10-minute grace period. Informational events and errors generated in logs. |
| Node.js | 60 minutes, configurable | configurable | SDK disconnects and reconnects at token renewal. Only informational events are generated in logs. |
| Python | 60 minutes, configurable | 120 seconds before expiration | SDK disconnects and reconnects at token lifespan. |

The following screenshots show the token renewal behavior in Azure Monitor Logs for different SDKs. The token lifespan and renewal threshold have been changed from their defaults as noted.

* .NET device SDK with a 1,200 seconds (20 minutes) token lifespan and renewal set to happen at 90% of lifespan. Disconnects happen every 30 minutes:

    :::image type="content" source="media/iot-hub-troubleshoot-connectivity/net-mqtt.png" alt-text="Screenshot showing error behavior for token renewal over MQTT in Azure Monitor Logs with dotnet SDK." lightbox="media/iot-hub-troubleshoot-connectivity/net-mqtt.png":::

* Java SDK with a 300 second (5 minutes) token lifespan and default 85% of lifespan renewal. Disconnects happen every 15 minutes:

    :::image type="content" source="media/iot-hub-troubleshoot-connectivity/java-mqtt.png" alt-text="Screenshot showing error behavior for token renewal over MQTT in Azure Monitor Logs with Java SDK." lightbox="media/iot-hub-troubleshoot-connectivity/java-mqtt.png":::

* Node SDK with a 300 second (5 minutes) token lifespan and token renewal set to happen at 3 minutes. Disconnects happen on token renewal. Also, there are no errors. Only informational connect/disconnect events are emitted:

    :::image type="content" source="media/iot-hub-troubleshoot-connectivity/node-mqtt.png" alt-text="Screenshot showing error behavior for token renewal over MQTT in Azure Monitor Logs with Node SDK." lightbox="media/iot-hub-troubleshoot-connectivity/node-mqtt.png":::

The following query was used to collect the results. The query extracts the SDK name and version from the property bag. To learn more, see [SDK version in IoT Hub logs](monitor-iot-hub.md#sdk-version-in-iot-hub-logs).

```kusto
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
| where Category == "Connections"
| extend parsed_json = parse_json(properties_s)
| extend SDKVersion = tostring(parsed_json.sdkVersion) , DeviceId = tostring(parsed_json.deviceId) , Protocol =  tostring(parsed_json.protocol)
| distinct TimeGenerated, OperationName, Level, ResultType, ResultDescription, DeviceId, Protocol, SDKVersion
```

As an IoT solutions developer or operator, you need to be aware of this behavior in order to interpret connect/disconnect events and related errors in logs. If you want to change the token lifespan or renewal behavior for devices, check to see whether the device implements a device twin setting or a device method that makes this change possible.

If you're monitoring device connections with Event Hubs, make sure you build in a way of filtering out the periodic disconnects due to SAS token renewal. For example, don't trigger actions based on disconnects as long as the disconnect event is followed by a connect event within a certain time span.

> [!NOTE]
> IoT Hub only supports one active MQTT connection per device. Any new MQTT connection on behalf of the same device ID causes IoT Hub to drop the existing connection.
>
> 400027 ConnectionForcefullyClosedOnNewConnection is logged into IoT Hub Logs

## I tried the steps, but they didn't work

If the previous steps didn't help, try:

* If you have access to the problematic devices, either physically or remotely (like SSH), follow the [device-side troubleshooting guide](https://github.com/Azure/azure-iot-sdk-node/wiki/Troubleshooting-Guide-Devices) to continue troubleshooting.

* Verify that your devices are **Enabled**. Navigate to your IoT Hub in the Azure portal, then select **Devices** under **Device management**.

* If your device uses MQTT protocol, verify that port 8883 is open. For more information, see [Protocols and ports](#protocols-and-ports) earlier in this article and [Connecting to IoT Hub (MQTT)](iot-mqtt-connect-to-iot-hub.md#connect-to-iot-hub).

* Get help from [Microsoft Q&A question page for Azure IoT Hub](/answers/tags/158/azure-iot-hub), [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-iot-hub), or [Azure support](https://azure.microsoft.com/support/).

## Related content

* [Best practices for transient fault handling](/azure/architecture/best-practices/transient-faults)
* [Retry patterns](concepts-manage-device-reconnections.md#retry-patterns)
