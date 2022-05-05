---
title: Export data from Azure IoT Central | Microsoft Docs
description: How to use the new data export to export your IoT data to Azure and custom cloud destinations.
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 01/31/2022
ms.topic: how-to
ms.service: iot-central
ms.custom: contperf-fy21q1, contperf-fy21q3
---

# Export IoT data to cloud destinations using data export

This article describes how to use data export in Azure IoT Central. Use this feature to continuously export filtered and enriched IoT data from your IoT Central application. Data export pushes changes in near real time to other parts of your cloud solution for warm-path insights, analytics, and storage.

For example, you can:

- Continuously export telemetry, property changes, device connectivity, device lifecycle, and device template lifecycle data in JSON format in near real time.
- Filter the data streams to export data that matches custom conditions.
- Enrich the data streams with custom values and property values from the device.
- [Transform the data](howto-transform-data-internally.md) streams to modify their shape and content.
- Send the data to destinations such as Azure Event Hubs, Azure Data Explorer, Azure Service Bus, Azure Blob Storage, and webhook endpoints.

> [!Tip]
> When you turn on data export, you get only the data from that moment onward. Currently, data can't be retrieved for a time when data export was off. To retain more historical data, turn on data export early.

## Prerequisites

To use data export features, you must have the [Data export](../core/howto-manage-users-roles.md) permission.

## Set up an export destination

Your export destination must exist before you configure your data export. Choose from the following destination types:

- [Blob storage](howto-export-to-blob-storage.md).
- [Service Bus](howto-export-to-service-bus.md).
- [Event Hubs](howto-export-to-event-hubs.md).
- [Azure Data Explorer](howto-export-to-azure-data-explorer.md).
- [Webhook](howto-export-to-webhook.md).

## Set up a data export

Now that you have a destination to export your data to, set up data export in your IoT Central application:

1. Sign in to your IoT Central application.

1. In the left pane, select **Data export**.

    > [!Tip]
    > If you don't see **Data export** in the left pane, then you don't have permissions to configure data export in your app. Talk to an administrator to set up data export.

1. Select **+ New export**.

1. Enter a display name for your new export, and make sure the data export is **Enabled**.

1. Choose the type of data to export. The following table lists the supported data export types:

    | Data type | Description | Data format |
    | :------------- | :---------- | :----------- |
    |  Telemetry | Export telemetry messages from devices in near-real time. Each exported message contains the full contents of the original device message, normalized.   |  [Telemetry message format](#telemetry-format)   |
    | Property changes | Export changes to device and cloud properties in near-real time. For read-only device properties, changes to the reported values are exported. For read-write properties, both reported and desired values are exported. | [Property change message format](#property-changes-format) |
    | Device connectivity | Export device connected and disconnected events. | [Device connectivity message format](#device-connectivity-changes-format) |
    | Device lifecycle | Export device registered, deleted, provisioned, enabled, disabled, displayNameChanged, and deviceTemplateChanged events. | [Device lifecycle changes message format](#device-lifecycle-changes-format) |
    | Device template lifecycle | Export published device template changes including created, updated, and deleted. | [Device template lifecycle changes message format](#device-template-lifecycle-changes-format) |

1. Optionally, add filters to reduce the amount of data exported. There are different types of filter available for each data export type:
    <a name="DataExportFilters"></a>

    | Type of data | Available filters|
    |--------------|------------------|
    |Telemetry|<ul><li>Filter by device name, device ID, device template, and if the device is simulated</li><li>Filter stream to only contain telemetry that meets the filter conditions</li><li>Filter stream to only contain telemetry from devices with properties matching the filter conditions</li><li>Filter stream to only contain telemetry that has *message properties* meeting the filter condition. *Message properties* (also known as *application properties*) are sent in a bag of key-value pairs on each telemetry message optionally sent by devices that use the device SDKs. To create a message property filter, enter the message property key you're looking for, and specify a condition. Only telemetry messages with properties that match the specified filter condition are exported. [Learn more about application properties from IoT Hub docs](../../iot-hub/iot-hub-devguide-messages-construct.md) </li></ul>|
    |Property changes|<ul><li>Filter by device name, device ID, device template, and if the device is simulated</li><li>Filter stream to only contain property changes that meet the filter conditions</li></ul>|
    |Device connectivity|<ul><li>Filter by device name, device ID, device template, organizations, and if the device is simulated</li><li>Filter stream to only contain changes from devices with properties matching the filter conditions</li></ul>|
    |Device lifecycle|<ul><li>Filter by device name, device ID, device template, and if the device is provisioned, enabled, or simulated</li><li>Filter stream to only contain changes from devices with properties matching the filter conditions</li></ul>|
    |Device template lifecycle|<ul><li>Filter by device template</li></ul>|

1. Optionally, enrich exported messages with extra key-value pair metadata. The following enrichments are available for the telemetry, property changes, device connectivity, and device lifecycle data export types:
<a name="DataExportEnrichmnents"></a>
    - **Custom string**: Adds a custom static string to each message. Enter any key, and enter any string value.
    - **Property**, which adds to each message:
       - Device metadata such as device name, device template name, enabled, organizations, provisioned, and simulated.
       - The current device reported property or cloud property value to each message. If the exported message is from a device that doesn't have the specified property, the exported message doesn't get the enrichment.

Configure the export destination:

1. Select **+ Destination** to add a destination that you've already created or select **Create a new one**.

1. To transform your data before it's exported, select **+ Transform**. To learn more, see [Transform data inside your IoT Central application for export](howto-transform-data-internally.md).

1. Select **+ Destination** to add up to five destinations to a single export.

1. When you've finished setting up your export, select **Save**. After a few minutes, your data appears in your destinations.

## Monitor your export

In IoT Central, the **Data export** page lets you check the status of your exports. You can also use [Azure Monitor](../../azure-monitor/overview.md) to see how much data you're exporting and any export errors. You can access export and device health metrics in charts in the Azure portal, with a REST API, or with queries in PowerShell or the Azure CLI. Currently, you can monitor the following data export metrics in Azure Monitor:

- Number of messages incoming to export before filters are applied.
- Number of messages that pass through filters.
- Number of messages successfully exported to destinations.
- Number of errors found.

To learn more, see [Monitor application health](howto-manage-iot-central-from-portal.md#monitor-application-health).

## Data formats

The following sections describe the formats of the exported data:
### Telemetry format

Each exported message contains a normalized form of the full message the device sent in the message body. The message is in JSON format and encoded as UTF-8. Information in each message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `telemetry`.
- `deviceId`:  The ID of the device that sent the telemetry message.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template assigned to the device.
- `enqueuedTime`: The time at which this message was received by IoT Central.
- `enrichments`: Any enrichments set up on the export.
- `module`: The IoT Edge module that sent this message. This field only appears if the message came from an IoT Edge module.
- `component`: The component that sent this message. This field only appears if the capabilities sent in the message were modeled as a component in the device template
- `messageProperties`: Other properties that the device sent with the message. These properties are sometimes referred to as *application properties*. [Learn more from IoT Hub docs](../../iot-hub/iot-hub-devguide-messages-construct.md).

For Event Hubs and Service Bus, IoT Central exports a new message quickly after it receives the message from a device. In the user properties (also referred to as application properties) of each message, the `iotcentral-device-id`, `iotcentral-application-id`, and `iotcentral-message-source` are included automatically.

For Blob storage, messages are batched and exported once per minute.

The following example shows an exported telemetry message:

```json

{
    "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
    "messageSource": "telemetry",
    "deviceId": "1vzb5ghlsg1",
    "schema": "default@v1",
    "templateId": "urn:qugj6vbw5:___qbj_27r",
    "enqueuedTime": "2020-08-05T22:26:55.455Z",
    "telemetry": {
        "Activity": "running",
        "BloodPressure": {
            "Diastolic": 7,
            "Systolic": 71
        },
        "BodyTemperature": 98.73447010562934,
        "HeartRate": 88,
        "HeartRateVariability": 17,
        "RespiratoryRate": 13
    },
    "enrichments": {
      "userSpecifiedKey": "sampleValue"
    },
    "module": "VitalsModule",
    "component": "DeviceComponent",
    "messageProperties": {
      "messageProp": "value"
    }
}
```

#### Message properties

Telemetry messages have properties for metadata as well as the telemetry payload. The previous snippet shows examples of system messages such as `deviceId` and `enqueuedTime`. To learn more about the system message properties, see [System Properties of D2C IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md#system-properties-of-d2c-iot-hub-messages).

You can add properties to telemetry messages if you need to add custom metadata to your telemetry messages. For example, you need to add a timestamp when the device creates the message.

The following code snippet shows how to add the `iothub-creation-time-utc` property to the message when you create it on the device:

> [!IMPORTANT]
> The format of this timestamp must be UTC with no timezone information. For example, `2021-04-21T11:30:16Z` is valid, `2021-04-21T11:30:16-07:00` is invalid.

# [JavaScript](#tab/javascript)

```javascript
async function sendTelemetry(deviceClient, index) {
  console.log('Sending telemetry message %d...', index);
  const msg = new Message(
    JSON.stringify(
      deviceTemperatureSensor.updateSensor().getCurrentTemperatureObject()
    )
  );
  msg.properties.add("iothub-creation-time-utc", new Date().toISOString());
  msg.contentType = 'application/json';
  msg.contentEncoding = 'utf-8';
  await deviceClient.sendEvent(msg);
}
```

# [Java](#tab/java)

```java
private static void sendTemperatureTelemetry() {
  String telemetryName = "temperature";
  String telemetryPayload = String.format("{\"%s\": %f}", telemetryName, temperature);

  Message message = new Message(telemetryPayload);
  message.setContentEncoding(StandardCharsets.UTF_8.name());
  message.setContentTypeFinal("application/json");
  message.setProperty("iothub-creation-time-utc", Instant.now().toString());

  deviceClient.sendEventAsync(message, new MessageIotHubEventCallback(), message);
  log.debug("My Telemetry: Sent - {\"{}\": {}°C} with message Id {}.", telemetryName, temperature, message.getMessageId());
  temperatureReadings.put(new Date(), temperature);
}
```

# [C#](#tab/csharp)

```csharp
private async Task SendTemperatureTelemetryAsync()
{
  const string telemetryName = "temperature";

  string telemetryPayload = $"{{ \"{telemetryName}\": {_temperature} }}";
  using var message = new Message(Encoding.UTF8.GetBytes(telemetryPayload))
  {
      ContentEncoding = "utf-8",
      ContentType = "application/json",
  };
  message.Properties.Add("iothub-creation-time-utc", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"));
  await _deviceClient.SendEventAsync(message);
  _logger.LogDebug($"Telemetry: Sent - {{ \"{telemetryName}\": {_temperature}°C }}.");
}
```

# [Python](#tab/python)

```python
async def send_telemetry_from_thermostat(device_client, telemetry_msg):
    msg = Message(json.dumps(telemetry_msg))
    msg.custom_properties["iothub-creation-time-utc"] = datetime.now(timezone.utc).isoformat()
    msg.content_encoding = "utf-8"
    msg.content_type = "application/json"
    print("Sent message")
    await device_client.send_message(msg)
```

---

The following snippet shows this property in the message exported to Blob storage:

```json
{
  "applicationId":"5782ed70-b703-4f13-bda3-1f5f0f5c678e",
  "messageSource":"telemetry",
  "deviceId":"sample-device-01",
  "schema":"default@v1",
  "templateId":"urn:modelDefinition:mkuyqxzgea:e14m1ukpn",
  "enqueuedTime":"2021-01-29T16:45:39.143Z",
  "telemetry":{
    "temperature":8.341033560421833
  },
  "messageProperties":{
    "iothub-creation-time-utc":"2021-01-29T16:45:39.021Z"
  },
  "enrichments":{}
}
```

### Property changes format

Each message or record represents changes to device and cloud properties. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `properties`.
- `messageType`: Either `cloudPropertyChange`, `devicePropertyDesiredChange`,  or `devicePropertyReportedChange`.
- `deviceId`:  The ID of the device that sent the telemetry message.
- `schema`: The name and version of the payload schema.
- `enqueuedTime`: The time at which this change was detected by IoT Central.
- `templateId`: The ID of the device template assigned to the device.
- `properties`: An array of properties that changed, including the names of the properties and values that changed. The component and module information is included if the property is modeled within a component or an IoT Edge module.
- `enrichments`: Any enrichments set up on the export.

For Event Hubs and Service Bus, IoT Central exports new messages data to your event hub or Service Bus queue or topic in near real time. In the user properties (also referred to as application properties) of each message, the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` are included automatically.

For Blob storage, messages are batched and exported once per minute.

The following example shows an exported property change message received in Azure Blob Storage.

```json
{
    "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
    "messageSource": "properties",
    "messageType": "cloudPropertyChange",
    "deviceId": "18a985g1fta",
    "schema": "default@v1",
    "templateId": "urn:qugj6vbw5:___qbj_27r",
    "enqueuedTime": "2020-08-05T22:37:32.942Z",
    "properties": [{
        "name": "MachineSerialNumber",
        "value": "abc",
        "module": "VitalsModule",
        "component": "DeviceComponent"
    }],
    "enrichments": {
        "userSpecifiedKey" : "sampleValue"
    }
}
```

### Device connectivity changes format

Each message or record represents a connectivity event from a single device. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `deviceConnectivity`.
- `messageType`: Either `connected` or `disconnected`.
- `deviceId`:  The ID of the device that was changed.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template assigned to the device.
- `enqueuedTime`: The time at which this change occurred in IoT Central.
- `enrichments`: Any enrichments set up on the export.

For Event Hubs and Service Bus, IoT Central exports new messages data to your event hub or Service Bus queue or topic in near real time. In the user properties (also referred to as application properties) of each message, the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` are included automatically.

For Blob storage, messages are batched and exported once per minute.

The following example shows an exported device connectivity message received in Azure Blob Storage.

```json
{
  "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
  "messageSource": "deviceConnectivity",
  "messageType": "connected",
  "deviceId": "1vzb5ghlsg1",
  "schema": "default@v1",
  "templateId": "urn:qugj6vbw5:___qbj_27r",
  "enqueuedTime": "2021-04-05T22:26:55.455Z",
  "enrichments": {
    "userSpecifiedKey": "sampleValue"
  }
}

```

### Device lifecycle changes format

Each message or record represents one change to a single device. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `deviceLifecycle`.
- `messageType`: The type of change that occurred. One of: `registered`, `deleted`, `provisioned`, `enabled`, `disabled`, `displayNameChanged`, and `deviceTemplateChanged`.
- `deviceId`:  The ID of the device that was changed.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template assigned to the device.
- `enqueuedTime`: The time at which this change occurred in IoT Central.
- `enrichments`: Any enrichments set up on the export.

For Event Hubs and Service Bus, IoT Central exports new messages data to your event hub or Service Bus queue or topic in near real time. In the user properties (also referred to as application properties) of each message, the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` are included automatically.

For Blob storage, messages are batched and exported once per minute.

The following example shows an exported device lifecycle message received in Azure Blob Storage.

```json
{
  "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
  "messageSource": "deviceLifecycle",
  "messageType": "registered",
  "deviceId": "1vzb5ghlsg1",
  "schema": "default@v1",
  "templateId": "urn:qugj6vbw5:___qbj_27r",
  "enqueuedTime": "2021-01-01T22:26:55.455Z",
  "enrichments": {
    "userSpecifiedKey": "sampleValue"
  }
}
```

### Device template lifecycle changes format

Each message or record represents one change to a single published device template. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `deviceTemplateLifecycle`.
- `messageType`: Either `created`, `updated`, or `deleted`.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template assigned to the device.
- `enqueuedTime`: The time at which this change occurred in IoT Central.
- `enrichments`: Any enrichments set up on the export.

For Event Hubs and Service Bus, IoT Central exports new messages data to your event hub or Service Bus queue or topic in near real time. In the user properties (also referred to as application properties) of each message, the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` are included automatically.

For Blob storage, messages are batched and exported once per minute.

The following example shows an exported device lifecycle message received in Azure Blob Storage.

```json
{
  "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
  "messageSource": "deviceTemplateLifecycle",
  "messageType": "created",
  "schema": "default@v1",
  "templateId": "urn:qugj6vbw5:___qbj_27r",
  "enqueuedTime": "2021-01-01T22:26:55.455Z",
  "enrichments": {
    "userSpecifiedKey": "sampleValue"
  }
}
```

## Next steps

Now that you know how to configure data export, a suggested next step is to learn [Transform data inside your IoT Central application for export](howto-transform-data-internally.md).
