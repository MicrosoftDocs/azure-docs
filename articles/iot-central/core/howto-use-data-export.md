---
title: Export data from IoT Central | Microsoft Docs
description: How to use the new data export to export your IoT data to Azure and custom cloud destinations.
services: iot-central
author: viv-liu
ms.author: viviali
ms.date: 08/04/2020
ms.topic: how-to
ms.service: iot-central
manager: corywink
---

# Export IoT data to cloud destinations using data export (preview)

> [!Note]
> Looking for the legacy data export? You can find data export docs [here](./howto-export-data.md). To learn about the differences between the new data export and legacy data export, see the [comparison table](#comparison-of-legacy-data-export-and-new-data-export).

This article describes how to use the new data export preview features in Azure IoT Central. You can use this feature to continuously export your filtered and enriched IoT data to your cloud services. You can use data export to push changes in near-real time to other parts of your cloud solution for warm-path insights, analytics, and storage. 

 For example, you can:
-	Continuously export telemetry data and property changes in JSON format in near-real time
-	Filter these data streams to export specific capabilities that match custom conditions
-	Enrich the data streams with custom values and property values from the device
-	Send this data to destinations such as Azure Event Hubs, Azure Service Bus, Azure Blob Storage, and webhook endpoints

> [!Note]
> When you turn on data export, you get only the data from that moment onward. Currently, data can't be retrieved for a time when data export was off. To retain more historical data, turn on data export early.

## Prerequisites

To use data export (preview), you must have a V3 application, and you must have Data export permissions.

## Set up export destination

Your export destination must exist before you configure your data export. These are the available types of destinations:
  - Azure Event Hubs
  - Azure Service Bus queue
  - Azure Service Bus topic
  - Azure Blob Storage
  - Webhook

### Create an Event Hubs destination

If you don't have an existing Event Hubs namespace to export to, follow these steps:

1. Create a [new Event Hubs namespace in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.EventHub). You can learn more in [Azure Event Hubs docs](../../event-hubs/event-hubs-create.md).

2. Create an event hub in your Event Hubs namespace. Go to your namespace, and select **+ Event Hub** at the top to create an event hub instance.

3. Generate a key that you will use in IoT Central to set up your data export. 
    - Click on the event hub instance you created. 
    - Click on **Settings/Shared access policies**. 
    - Create a new key or choose an existing key that has **Send** permissions. 
    - Copy either the primary or secondary connection string. You'll use this to set up a new destination in IoT Central.

### Create a Service Bus queue or topic destination

If you don't have an existing Service Bus namespace to export to, follow these steps:

1. Create a [new Service Bus namespace in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.ServiceBus.1.0.5). You can learn more in [Azure Service Bus docs](../../service-bus-messaging/service-bus-create-namespace-portal.md).

2. To create a queue or topic to export to, go to your Service Bus namespace, and select **+ Queue** or **+ Topic**.

3. Generate a key that you will use in IoT Central to set up your data export. 
    - Click on the queue or topic you created. 
    - Click on **Settings/Shared access policies**. 
    - Create a new key or choose an existing key that has **Send** permissions. 
    - Copy either the primary or secondary connection string. You'll use this to set up a new destination in IoT Central.

### Create an Azure Blob Storage destination

If you don't have an existing Azure storage account to export to, follow these steps:

1. Create a [new storage account in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). You can learn more about creating new [Azure Blob storage accounts](https://aka.ms/blobdocscreatestorageaccount) or [Azure Data Lake Storage v2 storage accounts](../../storage/blobs/data-lake-storage-quickstart-create-account.md). Data export can only write data to storage accounts that support block blobs. The following list shows the known compatible storage account types:

    |Performance Tier|Account Type|
    |-|-|
    |Standard|General Purpose V2|
    |Standard|General Purpose V1|
    |Standard|Blob storage|
    |Premium|Block Blob storage|

2. Create a container in your storage account. Go to your storage account. Under **Blob Service**, select **Browse Blobs**. Select **+ Container** at the top to create a new container.

3. Generate a connection string for your storage account by going to **Settings/Access keys**. Copy one of the two connection strings.

### Create a webhook endpoint
You can provide a publicly available HTTP endpoint for data to be exported to. You can create a test webhook endpoint using RequestBin. Keep in mind that RequestBin has a set request limit before requests get throttled.

1. Open [RequestBin](https://requestbin.net/).
2. Create a new RequestBin and copy the Bin URL.

## Set up data export

Now that you have a destination to export data to, follow these steps to set up data export.

1. Sign in to your IoT Central application.

2. In the left pane, select **Data export**.

    > [!Tip]
    > If you don't see **Data export** in the left pane, then you don't have permissions to configure data export in your app. Talk to an administrator to set up data export.

3. Select the **+ New export** button. 

4. Enter a display name for your new export, and ensure the **Enabled** toggle is turned on for data to flow.

## 1. Choose the type of data to export
You can choose between continuously exporting different types of data. Here are the supported data types:

| Data type | Description | Data format |
| :------------- | :---------- | :----------- |
|  Telemetry | Export telemetry messages from devices in near-real time. Each exported message will contain the full contents of the original device message, normalized.   |  [Telemetry message format](#telemetry-format)   |
| Property changes | Export changes to device and cloud properties in near-real time. For read-only device properties, changes to the reported values will be exported. For read-write properties, both reported and desired values will be exported. | [Property change message format](#property-changes-format) |

## 2. (Optional) Add filters
Add filters to reduce the amount of data exported based on filter conditions. There are different types of filters available for each type of data to export.

### Telemetry filters
  - **Capability filter**: If you choose a telemetry item in the dropdown, the exported stream will only contain telemetry that meets the filter condition. If you choose a device or cloud property item in the dropdown, the exported stream will only contain telemetry from devices that have properties that match the filter condition.
  - **Message property filter**: Devices using the device SDKs are allowed to send *message properties* or *application properties* on each telemetry message, which is a bag of key-value pairs generally used to tag the message with custom identifiers. You can create a message property filter by typing in the message property key you are looking for, and specifying a condition. Only telemetry messages that have message properties that match the specified filter condition will be exported. Only string comparison operators are supported (equals, does not equal, contains, does not contain, exists, does not exist). [Learn more about application properties from IoT Hub docs](../../iot-hub/iot-hub-devguide-messages-construct.md).

### Property changes filters
**Property filter**: Choose a property item in the dropdown, and the exported stream will only contain changes to the selected property that meets the filter condition.

## 3. (Optional) Add enrichments
Add enrichments to enrich exported messages with additional metadata in key-value pairs. These are the available enrichments for telemetry and property changes data types:
  - **Custom string**: Adds a custom static string to each message. Enter any key, and enter any string value.
  - **Property**: Adds the current device reported property or cloud property value to each message. Enter any key, and choose a device or cloud property. If the exported message is from a device that does not have the specified device or cloud property, the exported message will not have that enrichment.

## 4. Add destinations
Create a new destination or add a destination that you have already created. 
  
1. Click on the **create a new destination** link. Fill in the following information:
    - **Destination name**: the display name of the destination in IoT Central
    - **Destination type**: choose the type of destination. If you haven't already, [set up your export destination](#set-up-export-destination)
    - For Azure Event Hubs, Azure Service Bus queue or topic, paste the connection string for your resource. 
    - For Azure Blob Storage, paste the connection string for your resource and enter the container name (case sensitive).
    - For Webhook, paste the callback URL for your webhook endpoint. 
    - Click **Create**

2. Click **+ Destination** and choose a destination from the dropdown. You an add up to 5 destinations to a single export.

3. Once you have finished setting up your export, click **Save**. After a few minutes, your data will appear in your destinations.

## Export contents and format

### Azure Blob Storage destination

Data is exported once per minute, with each file containing the batch of changes since the last exported file. Exported data is placed in three folders in JSON format. The default paths in your storage account are:

- Telemetry: _{container}/{app-id}/{partition_id}/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}_
- Property changes: _{container}/{app-id}/{partition_id}/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}_

To browse the exported files in the Azure portal, navigate to the file and select the **Edit blob** tab.

### Azure Event Hubs and Azure Service Bus destinations

Data is exported in near-realtime. The data is in the message body and is in JSON format encoded as UTF-8. 

In the annotations or system properties bag of the message, you can find `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` which have the same values as the corresponding fields in the message body.

### Webhook destination
For webhooks destinations, data is also exported in near-real time. The data is in the message body is in the same format as for Event Hubs and Service Bus.


## Telemetry format
Each exported message contains a normalized form of the full message the device sent in the message body in JSON format encoded as UTF-8. Additional information included in each message include:

- `applicationId` of the IoT Central app
- `messageSource` which is *telemetry* for exporting telemetry data
- `deviceId` of the device that sent the telemetry message
- `schema` is the name and version of the payload schema
- `templateId` is the device template ID associated to the device
- `enrichments` are any enrichments that were set up on the export
- `messageProperties` are the additional pieces of data that the device sent alongside the message. This is also known as *application properties*, [learn more from IoT Hub docs](../../iot-hub/iot-hub-devguide-messages-construct.md).

For Event Hubs and Service Bus, IoT Central exports a new message quickly after it receives the message from a device.

For Blob storage, messages are batched and exported once per minute.

The following example shows an exported telemetry message:

```json

{
    "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
    "messageSource": "telemetry",
    "deviceId": "1vzb5ghlsg1",
    "schema": "default@preview",
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

## Property changes format

Each message or record represents one change to a device or cloud property. For device properties, only changes in the reported value gets exported as a separate message. Additional information included in the exported message include:

- `applicationId` of the IoT Central app
- `messageSource` which is *properties* for exporting property changes data
- `messageType` which is either *cloudPropertyChange* or *devicePropertyDesiredChange*, *devicePropertyReportedChange*
- `deviceId` of the device whose properties changed
- `schema` is the name and version of the payload schema
- `templateId` is the device template ID associated to the device
- `enrichments` are any enrichments that were set up on the export

For Event Hubs and Service Bus, IoT Central exports new messages data to your event hub or Service Bus queue or topic in near real time.

For Blob storage, messages are batched and exported once per minute.

The following example shows an exported property change message received in Azure Blob Storage.

```json
{
    "applicationId": "1dffa667-9bee-4f16-b243-25ad4151475e",
    "messageSource": "properties",
    "messageType": "cloudPropertyChange",
    "deviceId": "18a985g1fta",
    "schema": "default@preview",
    "templateId": "urn:qugj6vbw5:___qbj_27r",
    "enqueuedTime": "2020-08-05T22:37:32.942Z",
    "properties": [{
        "fieldName": "MachineSerialNumber",
        "value": "abc"
    }],
    "enrichments": {
        "userSpecifiedKey" : "sampleValue"
    }
}
```

## Comparison of legacy data export and new data export
This is a table that highlights the differences between the legacy data export and the new data export. You can learn about the legacy data export [here](howto-export-data.md).

| Capabilities  | Legacy data export | New data export |
| :------------- | :---------- | :----------- |
| Available data types | Telemetry, Devices, Device templates | Telemetry, Property changes |
| Filtering | None | Depends on the data type exported. For telemetry, filtering by telemetry, message properties, property values |
| Enrichments | None | Enrich with a custom string or a property value on the device |
| Destinations | Azure Event Hubs, Azure Service Bus queues and topics, Azure Blob Storage | Same as for legacy data export and webhooks| 
| Supported apps | V2, V3 | V3 only |
| Notable limits | 5 exports per app, 1 destination per export | 10 exports-destination connections per app | 

## Next steps

Now that you know how to use the new data export, continue to the next step:

> [!div class="nextstepaction"]
> [How to use analytics in IoT Central](./howto-create-analytics.md)
