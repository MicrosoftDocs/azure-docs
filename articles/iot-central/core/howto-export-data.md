---
title: Export data from Azure IoT Central | Microsoft Docs
description: How to use the new data export to export your IoT data to Azure and custom cloud destinations.
services: iot-central
author: viv-liu
ms.author: viviali
ms.date: 03/24/2021
ms.topic: how-to
ms.service: iot-central
ms.custom: contperf-fy21q1, contperf-fy21q3
---

# Export IoT data to cloud destinations using data export

> [!Note]
> This article describes the data export features in IoT Central. For information about the legacy data export features, see [Export IoT data to cloud destinations using data export (legacy)](./howto-export-data-legacy.md).

This article describes how to use the new data export feature in Azure IoT Central. Use this feature to continuously export filtered and enriched IoT data from your IoT Central application. Data export pushes changes in near real time to other parts of your cloud solution for warm-path insights, analytics, and storage.

For example, you can:

- Continuously export telemetry, property changes, device lifecycle, and device template lifecycle data in JSON format in near-real time.
- Filter the data streams to export data that matches custom conditions.
- Enrich the data streams with custom values and property values from the device.
- Send the data to destinations such as Azure Event Hubs, Azure Service Bus, Azure Blob Storage, and webhook endpoints.

> [!Tip]
> When you turn on data export, you get only the data from that moment onward. Currently, data can't be retrieved for a time when data export was off. To retain more historical data, turn on data export early.

## Prerequisites

To use data export features, you must have a [V3 application](howto-get-app-info.md), and you must have the [Data export](howto-manage-users-roles.md) permission.

If you have a V2 application, see [Migrate your V2 IoT Central application to V3](howto-migrate.md).

## Set up export destination

Your export destination must exist before you configure your data export. The following destination types are currently available:

- Azure Event Hubs
- Azure Service Bus queue
- Azure Service Bus topic
- Azure Blob Storage
- Webhook

### Create an Event Hubs destination

If you don't have an existing Event Hubs namespace to export to, follow these steps:

1. Create a [new Event Hubs namespace in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.EventHub). You can learn more in [Azure Event Hubs docs](../../event-hubs/event-hubs-create.md).

1. Create an event hub in your Event Hubs namespace. Go to your namespace, and select **+ Event Hub** at the top to create an event hub instance.

1. Generate a key to use when you to set up your data export in IoT Central:

    - Select the event hub instance you created.
    - Select **Settings > Shared access policies**.
    - Create a new key or choose an existing key that has **Send** permissions.
    - Copy either the primary or secondary connection string. You use this connection string to set up a new destination in IoT Central.
    - Alternatively, you can generate a connection string for the entire Event Hubs namespace:
        1. Go to your Event Hubs namespace in the Azure portal.
        2. Under **Settings**, select **Shared Access Policies**
        3. Create a new key or choose an existing key that has **Send** permissions.
        4. Copy either the primary or secondary connection string
        
### Create a Service Bus queue or topic destination

If you don't have an existing Service Bus namespace to export to, follow these steps:

1. Create a [new Service Bus namespace in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.ServiceBus.1.0.5). You can learn more in [Azure Service Bus docs](../../service-bus-messaging/service-bus-create-namespace-portal.md).

1. To create a queue or topic to export to, go to your Service Bus namespace, and select **+ Queue** or **+ Topic**.

1. Generate a key to use when you to set up your data export in IoT Central:

    - Select the queue or topic you created.
    - Select **Settings/Shared access policies**.
    - Create a new key or choose an existing key that has **Send** permissions.
    - Copy either the primary or secondary connection string. You use this connection string to set up a new destination in IoT Central.
    - Alternatively, you can generate a connection string for the entire Service Bus namespace:
        1. Go to your Service Bus namespace in the Azure portal.
        2. Under **Settings**, select **Shared Access Policies**
        3. Create a new key or choose an existing key that has **Send** permissions.
        4. Copy either the primary or secondary connection string

### Create an Azure Blob Storage destination

If you don't have an existing Azure storage account to export to, follow these steps:

1. Create a [new storage account in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). You can learn more about creating new [Azure Blob storage accounts](../../storage/blobs/storage-quickstart-blobs-portal.md) or [Azure Data Lake Storage v2 storage accounts](../../storage/common/storage-account-create.md). Data export can only write data to storage accounts that support block blobs. The following list shows the known compatible storage account types:

    |Performance Tier|Account Type|
    |-|-|
    |Standard|General Purpose V2|
    |Standard|General Purpose V1|
    |Standard|Blob storage|
    |Premium|Block Blob storage|

1. To create a container in your storage account, go to your storage account. Under **Blob Service**, select **Browse Blobs**. Select **+ Container** at the top to create a new container.

1. Generate a connection string for your storage account by going to **Settings > Access keys**. Copy one of the two connection strings.

### Create a webhook endpoint

You can export data to a publicly available HTTP webhook endpoint. You can create a test webhook endpoint using [RequestBin](https://requestbin.net/). RequestBin throttles request when the request limit is reached:

1. Open [RequestBin](https://requestbin.net/).
2. Create a new RequestBin and copy the **Bin URL**. You use this URL when you test your data export.

## Set up data export

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
    | Device lifecycle changes | Export device registered, provisioned, enabled, disabled, display name changed, device template changed, and deleted events. | [Device lifecycle changes message format](#device-lifecycle-changes-format) |
    | Device template lifecycle changes | Export published device template changes including created, updated, and deleted. | [Device template lifecyle changes message format](#device-template-lifecycle-changes-format) | 

<a name="DataExportFilters"></a>
1. Optionally, add filters to reduce the amount of data exported. There are different types of filter available for each data export type:

    To filter telemetry, you can:

    - **Filter** the exported stream to only contain telemetry from devices that match the device name, device ID, and device template filter condition.
    - **Filter** over capabilities: If you choose a telemetry item in the **Name** dropdown, the exported stream only contains telemetry that meets the filter condition. If you choose a device or cloud property item in the **Name** dropdown, the exported stream only contains telemetry from devices with properties matching the filter condition.
    - **Message property filter**: Devices that use the device SDKs can send *message properties* or *application properties* on each telemetry message. The properties are a bag of key-value pairs that tag the message with custom identifiers. To create a message property filter, enter the message property key you're looking for, and specify a condition. Only telemetry messages with properties that match the specified filter condition are exported. The following string comparison operators are supported: equals, does not equal, contains, does not contain, exists, does not exist. [Learn more about application properties from IoT Hub docs](../../iot-hub/iot-hub-devguide-messages-construct.md).

    To filter property and device lifecycle changes, use a **Capability filter**. Choose a property item in the dropdown. The exported stream only contains changes to the selected property that meets the filter condition.

<a name="DataExportEnrichmnents"></a>
1. Optionally, enrich exported messages with additional key-value pair metadata. The following enrichments are available for the telemetry and property changes data export types:

    - **Custom string**: Adds a custom static string to each message. Enter any key, and enter any string value.
    - **Property**: Adds the current device reported property or cloud property value to each message. Enter any key, and choose a device or cloud property. If the exported message is from a device that doesn't have the specified property, the exported message doesn't get the enrichment.

1. Add a new destination or add a destination that you've already created. Select the **Create a new one** link and add the following information:

    - **Destination name**: the display name of the destination in IoT Central.
    - **Destination type**: choose the type of destination. If you haven't already set up your destination, see [Set up export destination](#set-up-export-destination).
    - For Azure Event Hubs, Azure Service Bus queue or topic, paste the connection string for your resource, and enter the case-sensitive event hub, queue, or topic name if necessary.
    - For Azure Blob Storage, paste the connection string for your resource and enter the case-sensitive container name if necessary.
    - For Webhook, paste the callback URL for your webhook endpoint. You can optionally configure webhook authorization (OAuth 2.0 and Authorization token) and add custom headers. 
        - For OAuth 2.0, only the client credentials flow is supported. When the destination is saved, IoT Central will communicate with your OAuth provider to retrieve an authorization token. This token will be attached to the "Authorization" header for every message sent to this destination.
        - For Authorization token, you can specify a token value that will be directly attached to the "Authorization" header for every message sent to this destination.
    - Select **Create**.

1. Select **+ Destination** and choose a destination from the dropdown. You can add up to five destinations to a single export.

1. When you've finished setting up your export, select **Save**. After a few minutes, your data appears in your destinations.

## Monitor your export

In addition to seeing the status of your exports in IoT Central, you can use [Azure Monitor](../../azure-monitor/overview.md) to see how much data you're exporting and any export errors. You can access export and device health metrics in charts in the Azure portal, with a REST API, or with queries in PowerShell or the Azure CLI. Currently, you can monitor the following data export metrics in Azure Monitor:

- Number of messages incoming to export before filters are applied.
- Number of messages that pass through filters.
- Number of messages successfully exported to destinations.
- Number of errors encountered.

To learn more, see [Monitor the overall health of an IoT Central application](howto-monitor-application-health.md).

## Destinations

### Azure Blob Storage destination

Data is exported once per minute, with each file containing the batch of changes since the previous export. Exported data is saved in JSON format. The default paths to the exported data in your storage account are:

- Telemetry: _{container}/{app-id}/{partition_id}/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}_
- Property changes: _{container}/{app-id}/{partition_id}/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}_

To browse the exported files in the Azure portal, navigate to the file and select **Edit blob**.

### Azure Event Hubs and Azure Service Bus destinations

Data is exported in near real time. The data is in the message body and is in JSON format encoded as UTF-8.

The annotations or system properties bag of the message contains the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` fields that have the same values as the corresponding fields in the message body.

### Webhook destination

For webhooks destinations, data is also exported in near real time. The data in the message body is in the same format as for Event Hubs and Service Bus.

## Telemetry format

Each exported message contains a normalized form of the full message the device sent in the message body. The message is in JSON format and encoded as UTF-8. Information in each message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `telemetry`.
- `deviceId`:  The ID of the device that sent the telemetry message.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template associated with the device.
- `enqueuedTime`: The time at which this message was received by IoT Central.
- `enrichments`: Any enrichments set up on the export.
- `messageProperties`: Additional properties that the device sent with the message. These properties are sometimes referred to as *application properties*. [Learn more from IoT Hub docs](../../iot-hub/iot-hub-devguide-messages-construct.md).

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
    "messageProperties": {
      "messageProp": "value"
    }
}
```
### Message properties

Telemetry messages have properties for metadata in addition to the telemetry payload. The previous snippet shows examples of system messages such as `deviceId` and `enqueuedTime`. To learn more about the system message properties, see [System Properties of D2C IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md#system-properties-of-d2c-iot-hub-messages).

You can add properties to telemetry messages if you need to add custom metadata to your telemetry messages. For example, you need to add a timestamp when the device creates the message.

The following code snippet shows how to add the `iothub-creation-time-utc` property to the message when you create it on the device:

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

## Property changes format

Each message or record represents one change to a device or cloud property. For device properties, only changes in the reported value are exported as a separate message. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `properties`.
- `messageType`: Either `cloudPropertyChange`, `devicePropertyDesiredChange`,  or `devicePropertyReportedChange`.
- `deviceId`:  The ID of the device that sent the telemetry message.
- `schema`: The name and version of the payload schema.
- `enqueuedTime`: The time at which this change was detected by IoT Central.
- `templateId`: The ID of the device template associated with the device.
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
        "value": "abc"
    }],
    "enrichments": {
        "userSpecifiedKey" : "sampleValue"
    }
}
```

# Device lifecycle changes format

Each message or record represents one change to a single device. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `deviceLifecycle`.
- `messageType`: Either `registered`, `provisioned`, `enabled`, `disabled`, `displayNameChanged`, `deviceTemplateChanged`, or `deleted`.
- `deviceId`:  The ID of the device that sent the telemetry message.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template associated with the device.
- `enqueuedTime`: The time at which this change was detected by IoT Central.
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
# Device template lifecycle changes format

Each message or record represents one change to a single published device template. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `deviceTemplateLifecycle`.
- `messageType`: Either `created`, `updated`, or `deleted`.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template associated with the device.
- `enqueuedTime`: The time at which this change was detected by IoT Central.
- `enrichments`: Any enrichments set up on the export.

For Event Hubs and Service Bus, IoT Central exports new messages data to your event hub or Service Bus queue or topic in near real time. In the user properties (also referred to as application properties) of each message, the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` are included automatically.

For Blob storage, messages are batched and exported once per minute.

The following example shows an exported device lifecycle message received in Azure Blob Storage.

```json
{
  "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
  "messageSource": "deviceTemplateLifecycle",
  "messageType": "created",
  "deviceId": "1vzb5ghlsg1",
  "schema": "default@v1",
  "templateId": "urn:qugj6vbw5:___qbj_27r",
  "enqueuedTime": "2021-01-01T22:26:55.455Z",
  "enrichments": {
    "userSpecifiedKey": "sampleValue"
  }
}
```

## Comparison of legacy data export and data export

The following table shows the differences between the [legacy data export](howto-export-data-legacy.md) and the new data export features:

| Capabilities  | Legacy data export | New data export |
| :------------- | :---------- | :----------- |
| Available data types | Telemetry, Devices, Device templates | Telemetry, Property changes, Device lifecycle changes, Device template lifecycle changes |
| Filtering | None | Depends on the data type exported. For telemetry, filtering by telemetry, message properties, property values |
| Enrichments | None | Enrich with a custom string or a property value on the device |
| Destinations | Azure Event Hubs, Azure Service Bus queues and topics, Azure Blob Storage | Same as for legacy data export plus webhooks|
| Supported application versions | V2, V3 | V3 only |
| Notable limits | 5 exports per app, 1 destination per export | 10 exports-destination connections per app |

## Next steps

Now that you know how to use the new data export, a suggested next step is to learn [How to use analytics in IoT Central](./howto-create-analytics.md)
