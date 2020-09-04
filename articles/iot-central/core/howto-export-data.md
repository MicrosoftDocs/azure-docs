---
title: Export data from Azure IoT Central (preview) | Microsoft Docs
description: How to use the new data export to export your IoT data to Azure and custom cloud destinations.
services: iot-central
author: viv-liu
ms.author: viviali
ms.date: 09/02/2020
ms.topic: how-to
ms.service: iot-central
ms.custom: contperfq1
---

# Export IoT data to cloud destinations using data export (preview)

> [!Note]
> This article describes the preview data export features in IoT Central.
>
> - For information about the legacy data export features, see [Export IoT data to cloud destinations using data export (legacy)](./howto-export-data-legacy.md).
> - To learn about the differences between the preview data export and legacy data export features, see the [comparison table](#comparison-of-legacy-data-export-and-preview-data-export) below.

This article describes how to use the new data export preview feature in Azure IoT Central. Use this feature to continuously export filtered and enriched IoT data from your IoT Central application. Data export pushes changes in near real time to other parts of your cloud solution for warm-path insights, analytics, and storage.

For example, you can:

- Continuously export telemetry data and property changes in JSON format in near-real time.
- Filter the data streams to export data that matches custom conditions.
- Enrich the data streams with custom values and property values from the device.
- Send the data to destinations such as Azure Event Hubs, Azure Service Bus, Azure Blob Storage, and webhook endpoints.

> [!Tip]
> When you turn on data export, you get only the data from that moment onward. Currently, data can't be retrieved for a time when data export was off. To retain more historical data, turn on data export early.

## Prerequisites

To use the preview data export features, you must have a [V3 application](howto-get-app-info.md), and you must have the [Data export](howto-manage-users-roles.md) permission.

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

### Create a Service Bus queue or topic destination

If you don't have an existing Service Bus namespace to export to, follow these steps:

1. Create a [new Service Bus namespace in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.ServiceBus.1.0.5). You can learn more in [Azure Service Bus docs](../../service-bus-messaging/service-bus-create-namespace-portal.md).

1. To create a queue or topic to export to, go to your Service Bus namespace, and select **+ Queue** or **+ Topic**.

1. Generate a key to use when you to set up your data export in IoT Central:

    - Select the queue or topic you created.
    - Select **Settings/Shared access policies**.
    - Create a new key or choose an existing key that has **Send** permissions.
    - Copy either the primary or secondary connection string. You use this connection string to set up a new destination in IoT Central.

### Create an Azure Blob Storage destination

If you don't have an existing Azure storage account to export to, follow these steps:

1. Create a [new storage account in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). You can learn more about creating new [Azure Blob storage accounts](https://aka.ms/blobdocscreatestorageaccount) or [Azure Data Lake Storage v2 storage accounts](../../storage/blobs/data-lake-storage-quickstart-create-account.md). Data export can only write data to storage accounts that support block blobs. The following list shows the known compatible storage account types:

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

1. In the left pane, select **Data export (preview)**.

    > [!Tip]
    > If you don't see **Data export (preview)** in the left pane, then you don't have permissions to configure data export in your app. Talk to an administrator to set up data export.

1. Select **+ New export**.

1. Enter a display name for your new export, and make sure the data export is **Enabled**.

1. Choose the type of data to export. The following table lists the supported data export types:

    | Data type | Description | Data format |
    | :------------- | :---------- | :----------- |
    |  Telemetry | Export telemetry messages from devices in near-real time. Each exported message contains the full contents of the original device message, normalized.   |  [Telemetry message format](#telemetry-format)   |
    | Property changes | Export changes to device and cloud properties in near-real time. For read-only device properties, changes to the reported values are exported. For read-write properties, both reported and desired values are exported. | [Property change message format](#property-changes-format) |

1. Optionally, add filters to reduce the amount of data exported. There are different types of filter available for each data export type:

    To filter telemetry, use a:

    - **Capability filter**: If you choose a telemetry item in the **Name** dropdown, the exported stream only contains telemetry that meets the filter condition. If you choose a device or cloud property item in the **Name** dropdown, the exported stream only contains telemetry from devices with properties matching the filter condition.
    - **Message property filter**: Devices that use the device SDKs can send *message properties* or *application properties* on each telemetry message. The properties are a bag of key-value pairs that tag the message with custom identifiers. To create a message property filter, enter the message property key you're looking for, and specify a condition. Only telemetry messages with properties that match the specified filter condition are exported. The following string comparison operators are supported: equals, does not equal, contains, does not contain, exists, does not exist. [Learn more about application properties from IoT Hub docs](../../iot-hub/iot-hub-devguide-messages-construct.md).

    To filter property changes, use a **Capability filter**. Choose a property item in the dropdown. The exported stream only contains changes to the selected property that meets the filter condition.

1. Optionally, enrich exported messages with additional key-value pair metadata. The following enrichments are available for the telemetry and property changes data export types:

    - **Custom string**: Adds a custom static string to each message. Enter any key, and enter any string value.
    - **Property**: Adds the current device reported property or cloud property value to each message. Enter any key, and choose a device or cloud property. If the exported message is from a device that doesn't have the specified property, the exported message doesn't get the enrichment.

1. Add a new destination or add a destination that you've already created. Select the **Create a new one** link and add the following information:

    - **Destination name**: the display name of the destination in IoT Central.
    - **Destination type**: choose the type of destination. If you haven't already set up your destination, see [Set up export destination](#set-up-export-destination).
    - For Azure Event Hubs, Azure Service Bus queue or topic, paste the connection string for your resource.
    - For Azure Blob Storage, paste the connection string for your resource and enter the case-sensitive container name.
    - For Webhook, paste the callback URL for your webhook endpoint.
    - Select **Create**.

1. Select **+ Destination** and choose a destination from the dropdown. You can add up to five destinations to a single export.

1. When you've finished setting up your export, select **Save**. After a few minutes, your data appears in your destinations.

## Export contents and format

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

### Telemetry format

Each exported message contains a normalized form of the full message the device sent in the message body. The message is in JSON format and encoded as UTF-8. Information in each message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `telemetry`.
- `deviceId`:  The ID of the device that sent the telemetry message.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template associated with the device.
- `enrichments`: Any enrichments set up on the export.
- `messageProperties`: Additional properties that the device sent with the message. These properties are sometimes referred to as *application properties*. [Learn more from IoT Hub docs](../../iot-hub/iot-hub-devguide-messages-construct.md).

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

Each message or record represents one change to a device or cloud property. For device properties, only changes in the reported value are exported as a separate message. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `properties`.
- `messageType`: Either `cloudPropertyChange`, `devicePropertyDesiredChange`,  or `devicePropertyReportedChange`.
- `deviceId`:  The ID of the device that sent the telemetry message.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template associated with the device.
- `enrichments`: Any enrichments set up on the export.

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

## Comparison of legacy data export and preview data export

The following table shows the differences between the [legacy data export](howto-export-data-legacy.md) and preview data export features:

| Capabilities  | Legacy data export | New data export |
| :------------- | :---------- | :----------- |
| Available data types | Telemetry, Devices, Device templates | Telemetry, Property changes |
| Filtering | None | Depends on the data type exported. For telemetry, filtering by telemetry, message properties, property values |
| Enrichments | None | Enrich with a custom string or a property value on the device |
| Destinations | Azure Event Hubs, Azure Service Bus queues and topics, Azure Blob Storage | Same as for legacy data export plus webhooks|
| Supported application versions | V2, V3 | V3 only |
| Notable limits | 5 exports per app, 1 destination per export | 10 exports-destination connections per app |

## Next steps

Now that you know how to use the new data export, a suggested next step is to learn [How to use analytics in IoT Central](./howto-create-analytics.md)
