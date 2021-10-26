---
title: Export data from Azure IoT Central | Microsoft Docs
description: How to use the new data export to export your IoT data to Azure and custom cloud destinations.
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 06/04/2021
ms.topic: how-to
ms.service: iot-central
ms.custom: contperf-fy21q1, contperf-fy21q3
---

# Export IoT data to cloud destinations using data export

This article describes how to use data export in Azure IoT Central. Use this feature to continuously export filtered and enriched IoT data from your IoT Central application. Data export pushes changes in near real time to other parts of your cloud solution for warm-path insights, analytics, and storage.

For example, you can:

- Continuously export telemetry, property changes, device connectivity, device lifecycle, and device template lifecycle data in JSON format in near-real time.
- Filter the data streams to export data that matches custom conditions.
- Enrich the data streams with custom values and property values from the device.
- Transform the data streams to modify its shape and contents. 
- Send the data to destinations such as Azure Event Hubs, Azure Data Explorer, Azure Service Bus, Azure Blob Storage, and webhook endpoints.

> [!Tip]
> When you turn on data export, you get only the data from that moment onward. Currently, data can't be retrieved for a time when data export was off. To retain more historical data, turn on data export early.

## Prerequisites

To use data export features, you must have a [V3 application](howto-faq.yml#how-do-i-get-information-about-my-application-), and you must have the [Data export](howto-manage-users-roles.md) permission.

If you have a V2 application, see [Migrate your V2 IoT Central application to V3](howto-migrate.md).

## Set up export destination

Your export destination must exist before you configure your data export. The following destination types are currently available:

- Azure Event Hubs
- Azure Service Bus queue
- Azure Service Bus topic
- Azure Blob Storage
- Azure Data Explorer
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

### Create an Azure Data Explorer destination

If you don't have an existing [Azure Data Explorer](https://docs.microsoft.com/en-us/azure/data-explorer/data-explorer-overview) cluster and database to export to, follow these steps:

1. Create a new Azure Data Explorer cluster and database. You can learn more about creating new Azure Data Explorer cluster by following this [Quickstart](https://docs.microsoft.com/en-us/azure/data-explorer/create-cluster-database-portal).

2.  Create a Service Principal that you can use to connect IoT Central to Azure Data Explorer. Go to Azure Cloud Shell and run the following command. Keep a note of the Service Principal credentials (appId, password, tenant).
```azurecli
az ad sp create-for-rbac --skip-assignment --name "$NAME"
```
3. Vist Azure Data Explorer portal and add the Service Principal by running the following query on the database in Azure Data Explorer cluster.
```kusto
.add database $DATABASE admins ('aadapp=$APPID;$TENANT')
```

4. Create a table in Azure Data Explorer cluster using the following query.
```kusto
.create table $TABLENAME ('$COLUMNNAME:$COLUMNTYPE')
```

5. (Optional) For faster ingestion of data into Azure Data Explorer, turn ON the ‘Streaming ingestion’ by going to Configurations under Settings section of your Azure Data Explorer. Then, alter the table policy to enable streaming ingestion by running the following query on the database in ADX cluster.
```kusto
.alter table $TABLENAME policy
 streamingingestion enable
```

6. Add Azure Data Explorer as destination in IoT Central using Azure Data Explorer cluster, database and table details along with Service Principal credentials.

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
    | Device connectivity | Export device connected and disconnected events. | [Device connectivity message format](#device-connectivity-changes-format) |
    | Device lifecycle | Export device registered, deleted, provisioned, enabled, disabled, displayNameChanged, and deviceTemplateChanged events. | [Device lifecycle changes message format](#device-lifecycle-changes-format) |
    | Device template lifecycle | Export published device template changes including created, updated, and deleted. | [Device template lifecycle changes message format](#device-template-lifecycle-changes-format) | 

1. Optionally, add filters to reduce the amount of data exported. There are different types of filter available for each data export type:
    <a name="DataExportFilters"></a>
    
    | Type of data | Available filters| 
    |--------------|------------------|
    |Telemetry|<ul><li>Filter by device name, device ID, device template, and if the device is simulated</li><li>Filter stream to only contain telemetry that meets the filter conditions</li><li>Filter stream to only contain telemetry from devices with properties matching the filter conditions</li><li>Filter stream to only contain telemetry that have *message properties* meeting the filter condition. *Message properties* (also known as *application properties*) are sent in a bag of key-value pairs on each telemetry message optionally sent by devices that use the device SDKs. To create a message property filter, enter the message property key you're looking for, and specify a condition. Only telemetry messages with properties that match the specified filter condition are exported. [Learn more about application properties from IoT Hub docs](../../iot-hub/iot-hub-devguide-messages-construct.md) </li></ul>|
    |Property changes|<ul><li>Filter by device name, device ID, device template, and if the device is simulated</li><li>Filter stream to only contain property changes that meet the filter conditions</li></ul>|
    |Device connectivity|<ul><li>Filter by device name, device ID, device template, organizations, and if the device is simulated</li><li>Filter stream to only contain changes from devices with properties matching the filter conditions</li></ul>|
    |Device lifecycle|<ul><li>Filter by device name, device ID, device template, and if the device is provisioned, enabled, or simulated</li><li>Filter stream to only contain changes from devices with properties matching the filter conditions</li></ul>|
    |Device template lifecycle|<ul><li>Filter by device template</li></ul>|
    
1. Optionally, enrich exported messages with additional key-value pair metadata. The following enrichments are available for the telemetry, property changes, device connectivity, and device lifecycle data export types:
<a name="DataExportEnrichmnents"></a>
    - **Custom string**: Adds a custom static string to each message. Enter any key, and enter any string value.
    - **Property**, which adds to each message:
       - Device metadata such as device name, device template name, enabled, organizations, provisioned, and simulated.
       - The current device reported property or cloud property value to each message. If the exported message is from a device that doesn't have the specified property, the exported message doesn't get the enrichment.

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

To learn more, see [Monitor application health](howto-manage-iot-central-from-portal.md#monitor-application-health).

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
- `module`: The IoT Edge module that sent this message. This field only appears if the message came from an IoT Edge module.
- `component`: The component that sent this message. This field only appears if the capabilities sent in the message were modeled as a component in the device template
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
    "module": "VitalsModule",
    "component": "DeviceComponent",
    "messageProperties": {
      "messageProp": "value"
    }
}
```
### Message properties

Telemetry messages have properties for metadata in addition to the telemetry payload. The previous snippet shows examples of system messages such as `deviceId` and `enqueuedTime`. To learn more about the system message properties, see [System Properties of D2C IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md#system-properties-of-d2c-iot-hub-messages).

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

## Property changes format

Each message or record represents changes to device and cloud properties. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `properties`.
- `messageType`: Either `cloudPropertyChange`, `devicePropertyDesiredChange`,  or `devicePropertyReportedChange`.
- `deviceId`:  The ID of the device that sent the telemetry message.
- `schema`: The name and version of the payload schema.
- `enqueuedTime`: The time at which this change was detected by IoT Central.
- `templateId`: The ID of the device template associated with the device.
- `properties`: An array of properties that changed, including the names of the properties and values that changed. The component and module information is included if the property is modeled within a component or an IoT Edge module.
- `enrichments`: Any enrichments set up on the export.
- 
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
## Device connectivity changes format

Each message or record represents a connectivity event encountered by a single device. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `deviceConnectivity`.
- `messageType`: Either `connected` or `disconnected`.
- `deviceId`:  The ID of the device that was changed.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template associated with the device.
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
## Device lifecycle changes format

Each message or record represents one change to a single device. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `deviceLifecycle`.
- `messageType`: The type of change that occurred. One of: `registered`, `deleted`, `provisioned`, `enabled`, `disabled`, `displayNameChanged`, and `deviceTemplateChanged`.
- `deviceId`:  The ID of the device that was changed.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template associated with the device.
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
## Device template lifecycle changes format

Each message or record represents one change to a single published device template. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `deviceTemplateLifecycle`.
- `messageType`: Either `created`, `updated`, or `deleted`.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template associated with the device.
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

## Transform and export data
Transforms in IoT Central data export enable you to manipulate the device data including the data format prior to exporting the data to a destination. In your data export, you can specify a transform for each of your destination. Each message being exported will pass through the transform creating an output, which will be exported to the destination. 

You can leverage transforms to restructure JSON payloads, rename fields, filter out fields, and run simple calculations on telemetry values before exporting the data to a destination. For example, you can use the transforms to map your messages into tabular format so your data can match the schema of your destination (example: a table in Azure Data Explorer).

### Specify a Transform
The transform engine is powered by [JQ](https://stedolan.github.io/jq/) – an open-source JSON transformation engine that specializes in restructuring and formatting JSON payloads. You can specify a Transform by writing a query in JQ and can leverage different in-built filters, functions, and features of JQ. For query examples, see below section ‘Transform query examples’ and visit [JQ manual](https://stedolan.github.io/jq/manual/) for more information on writing queries using JQ.

### Pre-transformation message structure
Each stream of data (telemetry, properties, device connectivity, device lifecycle) contains information including telemetry values, application info, device metadata, and property values.

Following message is the overall shape of the input message for the telemetry stream. You can use all this data in your transformation. The overall structure of the message is similar for other streams (properties, device lifecycle, etc.) but there are some stream-specific fields for each stream type. Try using the “Generate sample input message” feature in the IoT Central application UI to see sample message structures for other stream types.
```json
{
"applicationId": "93d68c98-9a22-4b28-94d1-06625d4c3d0f",
    "device": {
      "id": "31edabe6-e0b9-4c83-b0df-d12e95745b9f",
      "name": "Scripted Device - 31edabe6-e0b9-4c83-b0df-d12e95745b9f",
      "cloudProperties": [],
      "properties": {
        "reported": [
          {
            "id": "urn:smartKneeBrace:Smart_Vitals_Patch_wr:FirmwareVersion:1",
            "name": "FirmwareVersion",
            "value": 1.0
          }
        ]
      },
      "templateId": "urn:sbq3croo:modelDefinition:nf7st1wn3",
      "templateName": "Smart Knee Brace"
    },
    "telemetry": [
        {
          "id": "urn:continuousPatientMonitoringTemplate:Smart_Knee_Brace_6wm:Acceleration:1",
          "name": "Acceleration",
          "value": {
            "x": 19.212770659918583,
            "y": 20.596296675217335,
            "z": 54.04859440697045
          }
        },
        {
          "id": "urn:continuousPatientMonitoringTemplate:Smart_Knee_Brace_6wm:RangeOfMotion:1",
          "name": "RangeOfMotion",
          "value": 110
        }
    ],
    "enqueuedTime": "2021-03-23T19:55:56.971Z",
    "enrichments": {
        "your-enrichment-key": "enrichment-value"
    },
    "messageProperties": {
        "prop1": "prop-value"
    },
    "messageSource": "telemetry"
}
```

### Transform query examples

In the following examples, we will use the above pre-transformed message as input device message.

Example-1: Following JQ query outputs each piece of telemetry from the input message as a separate output message/row (to output them as an array in a single message, change your query to .telemetry)

``` transform query
.telemetry[]
```

Output, in JSON format:
```json
{
"id": "urn:continuousPatientMonitoringTemplate:Smart_Knee_Brace_6wm:Acceleration:1",
    "name": "Acceleration",
    "value": {
        "x": 19.212770659918583,
        "y": 20.596296675217335,
        "z": 54.04859440697045
    }
},
{
    "id": "urn:continuousPatientMonitoringTemplate:Smart_Knee_Brace_6wm:RangeOfMotion:1",
    "name": "RangeOfMotion",
    "value": 110
}
```

Example-2: Following JQ query converts the telemetry array into an object keyed on the telemetry name    

``` transform query
     .telemetry | map({ key: .name, value: .value }) | from_entries
```

Output, in JSON format:
```json
{
    "Acceleration": {
        "x": 19.212770659918583,
        "y": 20.596296675217335,
        "z": 54.04859440697045
    },
    "RangeOfMotion": 110
}
```

Example-3: Following JQ query finds the telemetry value for "RangeOfMotion" and converts it from degree to radian (formula: rad = degree * pi / 180)

``` transform query
import "iotc" as iotc;
{
    rangeOfMotion: (
        .telemetry
        | iotc::find(.name == "RangeOfMotion").value
        | . * 3.14159265358979323846 / 180
    )
}
```

Output, in JSON format:
```json
{
    "rangeOfMotion": 1.9198621771937625
}
```

### IoT Central Module

A module in JQ is a collection of custom functions. As part of your transform query, you can import a built-in IoT Central specific module containing functions that makes it easier for you to write transform queries. To import the IoT Central module, use the following directive before you write the query.

``` transform query
import "iotc" as iotc;
```

#### Supported functions in “iotc” module:
a.	find(expression): The “find” function helps you find a specific array element such as telemetry or property entry in your payload. The input to it is an array and the parameter defines a JQ filter which is run against each element in the array and evaluates to true for the element you want to return 

Example: find a specific telemetry value with name “RangeOfMotion”:
``` transform query
.telemetry | iotc::find(.name == “RangeOfMotion”)
```

Example-4: To manipulate the input message into a tabular format (e.g. when exporting to Azure Data Explorer), you can map each exported message into one or more “rows”. A row output is logically represented as a JSON object where the column name is the key and the column value is the value, like this:
{
    <column 1 name>: <column 1 value>,
    <column 2 name>: <column 2 value>,
    ...
}

Following JQ query writes rows into a table that stores range of motion telemetry across different devices. It maps device ID, enqueuedTime, RangeOfMotion into a table with these 3 columns.

``` transform query
import "iotc" as iotc;
{
    deviceId: .deviceId,
    timestamp: .enqueuedTime,
    rangeOfMotion: .telemetry | iotc::find(.name == "RangeOfMotion").value
}
```

Output in JSON format:
```json
{
    "deviceId": "31edabe6-e0b9-4c83-b0df-d12e95745b9f",
    "timestamp": "2021-03-23T19:55:56.971Z",
    "rangeOfMotion": 110
}
```

### Scenarios
Following scenarios leverage the Transform functionality in IoT Central data export to customize the format of device data specific to a destination.

### Scenario 1: Export device data to ADX

In this scenario, the device data is transformed to match the following fixed schema in Azure Data Explorer, where each telemetry value appears as a column in the table and each row represents a single message.
| DeviceId | Timestamp | T1 |	T2 |T3 |
| :------------- | :---------- | :----------- | :---------- | :----------- |
| "31edabe6-e0b9-4c83-b0df-d12e95745b9f" |"2021-03-23T19:55:56.971Z	| 1.18898	| 1.434709	| 2.97008 |

To export data that is compatible with this table, each message needs to look like the following object. The object represents a single row, where object keys are column names and object values are the value to place in each column:

```json
{
    "Timestamp": <value-of-Timestamp>,
    "DeviceId": <value-of-deviceId>,
    "T1": <value-of-T1>,
    "T2": <value-of-T2>,
    "T3": <value-of-T3>,
}
```
In this example, the device sends three telemetry values (T1, T2, and T3) and the input message is in the following format

```json
{
    "applicationId": "c57fe8d9-d15d-4659-9814-d3cc38ca9e1b",
    "enqueuedTime": "1933-01-26T03:10:44.480001324Z",
    "messageSource": "telemetry",
    "telemetry": [
        {
            "id": "dtmi:sekharjsonbugbash288:sekharbugbash1lr:t1;1",
            "name": "t1",
            "value": 1.1889838348731093e+308
        },
        {
            "id": "dtmi:sekharjsonbugbash288:sekharbugbash1lr:t2;1",
            "name": "t2",
            "value": 1.4347093391531383e+308
        },
        {
            "id": "dtmi:sekharjsonbugbash288:sekharbugbash1lr:t3;1",
            "name": "t3",
            "value": 2.9700885230380616e+307
        }
    ],
    "device": {
        "id": "oozrnl1zs857",
        "name": "haptic alarm",
        "templateId": "dtmi:modelDefinition:nhhbjotee:qytxnp8hi",
        "templateName": "sekharbugbash",
        "properties": {
            "reported": []
        },
        "cloudProperties": [],
        "simulated": true,
        "approved": false,
        "blocked": false,
        "provisioned": true
    }
}
```

Following JQ query outputs the telemetry values (T1, T2 and T3) along with ‘enqueuedTime’ and the device id. The query then creates a message with key-value pairs that matches the ADX table schema.

``` transform query
import "iotc" as iotc;
{
    deviceId: .device.id,
    Timestamp: .enqueuedTime,
    T1: .telemetry | iotc::find(.name == "t1").value,
    T2: .telemetry | iotc::find(.name == "t2").value,
    T3: .telemetry | iotc::find(.name == "t3").value,
}
```

Output, in JSON format:

```json
{
    "T1": 1.1889838348731093e+308,
    "T2": 1.4347093391531383e+308,
    "T3": 2.9700885230380616e+307,
    "Timestamp": "1933-01-26T03:10:44.480001324Z",
    "deviceId": "oozrnl1zs857"
}
```
For more details on adding an Azure Data Explorer cluster and database as destination, See Creating Azure Data Explorer as destination.

### Scenario 2: Breaking apart array telemetry

In this scenario, the device sends the following array of telemetry in one message.

```json
{
    "applicationId": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "enqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "messageSource": "telemetry",
    "telemetry": [
        {
            "id": "dtmi:sample1:data;1",
            "name": "data",
            "value": [
                {
                    "id": "subdevice1",
                    "values": {
                        "running": true,
                        "cycleCount": 2315
                    }
                },
                {
                    "id": "subdevice2",
                    "values": {
                        "running": false,
                        "cycleCount": 824567
                    }
                }
            ]
        },
        {
            "id": "dtmi:sample1:parentStatus;1",
            "name": "parentStatus",
            "value": "healthy"
        }
    ],
    "device": {
        "id": "9xwhr7khkfri",
        "name": "wireless port",
        "templateId": "dtmi:hpzy1kfcbt2:umua7dplmbd",
        "templateName": "Smart Vitals Patch",
        "properties": {
            "reported": [
                {
                    "id": "dtmi:sample1:prop;1",
                    "name": "Connectivity",
                    "value": "Tenetur ut quasi minus ratione voluptatem."
                }
            ]
        },
        "cloudProperties": [],
        "simulated": true,
        "approved": true,
        "blocked": false,
        "provisioned": false
    }
}
```

This device data is transformed to match the following table schema 

Field1	Field2	Field3
Value1	Value2	Value3
AnotherValue1	AnotherValue2	AnotherValue3

Following JQ query creates a separate output message/row for each subdevice entry in the message, while also including some common information from the base message and parent device in each output message. This allows you to flatten the output and separate out logical divisions in your data which may have arrived as a single message.

``` transform query
import "iotc" as iotc;
{
    enqueuedTime: .enqueuedTime,
    deviceId: .device.id,
    parentStatus: .telemetry | iotc::find(.name == "parentStatus").value
} + (
    .telemetry
    | iotc::find(.name == "data").value[]
    | {
        subdeviceId: .id,
        running: .values.running,
        cycleCount: .values.cycleCount
    }
)
```

Output, in JSON format:

```json
{
    "cycleCount": 2315,
    "deviceId": "9xwhr7khkfri",
    "enqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "parentStatus": "healthy",
    "running": true,
    "subdeviceId": "subdevice1"
},
{
    "cycleCount": 824567,
    "deviceId": "9xwhr7khkfri",
    "enqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "parentStatus": "healthy",
    "running": false,
    "subdeviceId": "subdevice2"
}
```

### Scenario 3: Power BI Streaming
Power BI real-time streaming feature allows you to view data in a dashboard, which is updated in real-time with ultra-low latency. Visit [this page](https://docs.microsoft.com/en-us/power-bi/connect-data/service-real-time-streaming) for more information 
To use IoT Central with Power BI Streaming, we need to set up a webhook export which sends request bodies in a specific format. In this example, a Power BI Streaming dataset has been set up with the following schema:

We will set up a transform to the webhook destination so that we can output a message that matches this schema. In this example, we use the following input message 

```json
{
    "applicationId": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "enqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "messageSource": "telemetry",
    "telemetry": [
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:HeartRate;1",
            "name": "HeartRate",
            "value": -633994413
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:RespiratoryRate;1",
            "name": "RespiratoryRate",
            "value": 1582211310
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:HeartRateVariability;1",
            "name": "HeartRateVariability",
            "value": -37514094
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:BodyTemperature;1",
            "name": "BodyTemperature",
            "value": 5.323322666478241e+307
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:FallDetection;1",
            "name": "FallDetection",
            "value": "Earum est nobis at voluptas id qui."
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:BloodPressure;1",
            "name": "BloodPressure",
            "value": {
                "Diastolic": 161438124,
                "Systolic": -966387879
            }
        }
    ],
    "device": {
        "id": "9xwhr7khkfri",
        "name": "wireless port",
        "templateId": "dtmi:hpzy1kfcbt2:umua7dplmbd",
        "templateName": "Smart Vitals Patch",
        "properties": {
            "reported": [
                {
                    "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_wr:DeviceStatus;1",
                    "name": "DeviceStatus",
                    "value": "Id optio iste vero et neque sit."
                }
            ]
        },
        "cloudProperties": [],
        "simulated": true,
        "approved": true,
        "blocked": false,
        "provisioned": false
    }
}
```

Following JQ query provides an output that can be exported to a webhook for Power BI streaming of the data. In this example, we only want to export data from the single template which has the appropriate information, so we add an additional condition which will only produce output messages for the template we want. You can also use the filter feature of Data Export to perform this filtering.

``` transform query
import "iotc" as iotc;
if .device.templateId == "dtmi:hpzy1kfcbt2:umua7dplmbd" then 
    [{
        deviceId: .device.id,
        timestamp: .enqueuedTime,
        deviceName: .device.name,
        bloodPressureSystolic: .telemetry | iotc::find(.name == "BloodPressure").value.Systolic,
        bloodPressureDiastolic: .telemetry | iotc::find(.name == "BloodPressure").value.Diastolic,
        heartRate: .telemetry | iotc::find(.name == "HeartRate").value,
        heartRateVariability: .telemetry | iotc::find(.name == "HeartRateVariability").value,
        respiratoryRate: .telemetry | iotc::find(.name == "RespiratoryRate").value
    }]
else
    empty
end
```

Output in JSON format

```json
{
        "bloodPressureDiastolic": 161438124,
        "bloodPressureSystolic": -966387879,
        "deviceId": "9xwhr7khkfri",
        "deviceName": "wireless port",
        "heartRate": -633994413,
        "heartRateVariability": -37514094,
        "respiratoryRate": 1582211310,
        "timestamp": "1909-10-10T07:11:56.078161042Z"
    }
```
PowerBI dashboard view of the data

### Scenario 4: Export data to Azure Data Explorer and visualize in Power BI

In this scenario, we export data to ADX and then use a connector to visualize the ADX data in Power BI.
Firstly, set up ADX by referring to the section ADX as IoT Central destination, including setting up a table with the schema shown in the example setup instructions.

This schema/transform is generalized to allow us to represent arbitrary telemetry in tabular form using an EAV (entity-attribute-value) schema where each row holds a single telemetry value and the name of the telemetry is a value in a separate column in the same row. Achieving this involves separating the single input message out into separate output messages/rows for each telemetry value.

Input message:

```json
{
    "applicationId": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "enqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "messageSource": "telemetry",
    "telemetry": [
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:HeartRate;1",
            "name": "HeartRate",
            "value": -633994413
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:RespiratoryRate;1",
            "name": "RespiratoryRate",
            "value": 1582211310
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:HeartRateVariability;1",
            "name": "HeartRateVariability",
            "value": -37514094
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:BodyTemperature;1",
            "name": "BodyTemperature",
            "value": 5.323322666478241e+307
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:FallDetection;1",
            "name": "FallDetection",
            "value": "Earum est nobis at voluptas id qui."
        },
        {
            "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_37p:BloodPressure;1",
            "name": "BloodPressure",
            "value": {
                "Diastolic": 161438124,
                "Systolic": -966387879
            }
        }
    ],
    "device": {
        "id": "9xwhr7khkfri",
        "name": "wireless port",
        "templateId": "dtmi:hpzy1kfcbt2:umua7dplmbd",
        "templateName": "Smart Vitals Patch",
        "properties": {
            "reported": [
                {
                    "id": "dtmi:smartVitalsPatch:Smart_Vitals_Patch_wr:DeviceStatus;1",
                    "name": "DeviceStatus",
                    "value": "Id optio iste vero et neque sit."
                }
            ]
        },
        "cloudProperties": [],
        "simulated": true,
        "approved": true,
        "blocked": false,
        "provisioned": false
    }
}
```
Following JQ query transforms the input message to a separate output message for each telemetry value

``` transform query
. as $in | .telemetry[] | {
    EnqueuedTime: $in.enqueuedTime,
    Message: $in.messageId,
    Application: $in.applicationId,
    Device: $in.device.id,
    Simulated: $in.device.simulated,
    Template: ($in.device.templateName // ""),
    Module: ($in.module // ""),
    Component: ($in.component // ""),
    Capability: .name,
    Value: .value
}
```

Output in JSON format

```json
{
    "Application": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "Capability": "HeartRate",
    "Component": "",
    "Device": "9xwhr7khkfri",
    "EnqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "Message": null,
    "Module": "",
    "Simulated": true,
    "Template": "Smart Vitals Patch",
    "Value": -633994413
},
{
    "Application": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "Capability": "RespiratoryRate",
    "Component": "",
    "Device": "9xwhr7khkfri",
    "EnqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "Message": null,
    "Module": "",
    "Simulated": true,
    "Template": "Smart Vitals Patch",
    "Value": 1582211310
},
{
    "Application": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "Capability": "HeartRateVariability",
    "Component": "",
    "Device": "9xwhr7khkfri",
    "EnqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "Message": null,
    "Module": "",
    "Simulated": true,
    "Template": "Smart Vitals Patch",
    "Value": -37514094
},
{
    "Application": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "Capability": "BodyTemperature",
    "Component": "",
    "Device": "9xwhr7khkfri",
    "EnqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "Message": null,
    "Module": "",
    "Simulated": true,
    "Template": "Smart Vitals Patch",
    "Value": 5.323322666478241e+307
},
{
    "Application": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "Capability": "FallDetection",
    "Component": "",
    "Device": "9xwhr7khkfri",
    "EnqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "Message": null,
    "Module": "",
    "Simulated": true,
    "Template": "Smart Vitals Patch",
    "Value": "Earum est nobis at voluptas id qui."
},
{
    "Application": "570c2d7b-d72e-4ad1-aaf4-ad9b727daa47",
    "Capability": "BloodPressure",
    "Component": "",
    "Device": "9xwhr7khkfri",
    "EnqueuedTime": "1909-10-10T07:11:56.078161042Z",
    "Message": null,
    "Module": "",
    "Simulated": true,
    "Template": "Smart Vitals Patch",
    "Value": {
        "Diastolic": 161438124,
        "Systolic": -966387879
    }
}
```

The output data can be exported to ADX. To visualize the exported data stored in ADX in the Power BI, follow these steps
1. Ensure you the Power BI application. You can download a desktop Power BI from here
2. Download file - IoT Central ADX connector 
3. Open the file downloaded in step-2 using Power BI app and enter the ADX cluster/database/table information when prompted
Now you can visualize the data in Power BI. 

Now you can visualize the data in Power BI. 

## Comparison of legacy data export and data export

The following table shows the differences between the [legacy data export](howto-export-data-legacy.md) and data export features:

| Capabilities  | Legacy data export | New data export |
| :------------- | :---------- | :----------- |
| Available data types | Telemetry, Devices, Device templates | Telemetry, Property changes, Device connectivity changes, Device lifecycle changes, Device template lifecycle changes |
| Filtering | None | Depends on the data type exported. For telemetry, filtering by telemetry, message properties, property values |
| Enrichments | None | Enrich with a custom string or a property value on the device |
| Destinations | Azure Event Hubs, Azure Service Bus queues and topics, Azure Blob Storage | Same as for legacy data export plus webhooks|
| Supported application versions | V2, V3 | V3 only |
| Notable limits | 5 exports per app, 1 destination per export | 10 exports-destination connections per app |

## Next steps

Now that you know how to use the new data export, a suggested next step is to learn [How to use analytics in IoT Central](./howto-create-analytics.md)
