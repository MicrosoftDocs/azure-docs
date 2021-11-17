---
title: Export data from Azure IoT Central | Microsoft Docs
description: How to use the new data export to export your IoT data to Azure and custom cloud destinations.
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 10/20/2021
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
- Transform the data streams to modify their shape and content.
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

### Connection options

For the Azure service destinations, you can choose to configure the connection with a *connection string* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md). Managed identities are more secure because:

- You don't store the credentials for your resource in a connection string in your IoT Central application.
- The credentials are automatically tied to the lifetime of your IoT Central application.
- Managed identities automatically rotate their security keys regularly.

IoT Central currently uses [system-assigned managed identities](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

When you configure a managed identity, the configuration includes a *scope* and a *role*:

- The scope defines where you can use the managed identity. For example, you can use an Azure resource group as the scope. In this case, both the IoT Central application and the destination must be in the same resource group.
- The role defines what permissions the IoT Central application is granted in the destination service. For example, for an IoT Central application to send data to an event hub, the managed identity needs the **Azure Event Hubs Data Sender** role assignment.

This article shows how to create a managed identity in the Azure portal. You can also use the Azure CLI to create a manged identity. To learn more, see [Assign a managed identity access to a resource using Azure CLI](../../active-directory/managed-identities-azure-resources/howto-assign-access-cli.md).

### Create an Event Hubs destination

# [Connection string](#tab/connection-string)

If you don't have an existing Event Hubs namespace to export to, follow these steps:

1. Create a [new Event Hubs namespace in the Azure portal](https://portal.azure.com/#create/Microsoft.EventHub). You can learn more in [Azure Event Hubs docs](../../event-hubs/event-hubs-create.md).

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

# [Managed identity](#tab/managed-identity)

If you don't have an existing Event Hubs namespace to export to, follow these steps:

1. Create a [new Event Hubs namespace in the Azure portal](https://portal.azure.com/#create/Microsoft.EventHub). You can learn more in [Azure Event Hubs docs](../../event-hubs/event-hubs-create.md).

1. Create an event hub in your Event Hubs namespace. Go to your namespace, and select **+ Event Hub** at the top to create an event hub instance.

[!INCLUDE [iot-central-managed-identity](../../../includes/iot-central-managed-identity.md)]

To configure the permissions:

1. On the **Add role assignment** page, select the scope and subscription you want to use.

    > [!TIP]
    > If your IoT Central application and event hub are in the same resource group, you can choose **Resource group** as the scope and then select the resource group.

1. Select **Azure Event Hubs Data Sender** as the **Role**.

1. Select **Save**. The managed identity for your IoT Central application is now configured.

To further secure your event hub and only allow access from trusted services with managed identities, see:

- [Allow access to Azure Event Hubs namespaces using private endpoints](../../event-hubs/private-link-service.md)
- [Trusted Microsoft services](../../event-hubs/private-link-service.md#trusted-microsoft-services)
- [Allow access to Azure Event Hubs namespaces from specific virtual networks](../../event-hubs/event-hubs-service-endpoints.md)

---

### Create a Service Bus queue or topic destination

# [Connection string](#tab/connection-string)

If you don't have an existing Service Bus namespace to export to, follow these steps:

1. Create a [new Service Bus namespace in the Azure portal](https://portal.azure.com/#create/Microsoft.ServiceBus.1.0.5). You can learn more in [Azure Service Bus docs](../../service-bus-messaging/service-bus-create-namespace-portal.md).

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

# [Managed identity](#tab/managed-identity)

If you don't have an existing Service Bus namespace to export to, follow these steps:

1. Create a [new Service Bus namespace in the Azure portal](https://portal.azure.com/#create/Microsoft.ServiceBus.1.0.5). You can learn more in [Azure Service Bus docs](../../service-bus-messaging/service-bus-create-namespace-portal.md).

1. To create a queue or topic to export to, go to your Service Bus namespace, and select **+ Queue** or **+ Topic**.

[!INCLUDE [iot-central-managed-identity](../../../includes/iot-central-managed-identity.md)]

To configure the permissions:

1. On the **Add role assignment** page, select the scope and subscription you want to use.

    > [!TIP]
    > If your IoT Central application and queue or topic are in the same resource group, you can choose **Resource group** as the scope and then select the resource group.

1. Select **Azure Service Bus Data Sender** as the **Role**.

1. Select **Save**. The managed identity for your IoT Central application is now configured.

To further secure your queue or topic and only allow access from trusted services with managed identities, see:

- [Allow access to Azure Service Bus namespaces using private endpoints](../../service-bus-messaging/private-link-service.md)
- [Trusted Microsoft services](../../service-bus-messaging/private-link-service.md#trusted-microsoft-services)
- [Allow access to Azure Service Bus namespace from specific virtual networks](../../service-bus-messaging/service-bus-service-endpoints.md)

---

### Create an Azure Blob Storage destination

# [Connection string](#tab/connection-string)

If you don't have an existing Azure storage account to export to, follow these steps:

1. Create a [new storage account in the Azure portal](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You can learn more about creating new [Azure Blob storage accounts](../../storage/blobs/storage-quickstart-blobs-portal.md) or [Azure Data Lake Storage v2 storage accounts](../../storage/common/storage-account-create.md). Data export can only write data to storage accounts that support block blobs. The following list shows the known compatible storage account types:

    |Performance Tier|Account Type|
    |-|-|
    |Standard|General Purpose V2|
    |Standard|General Purpose V1|
    |Standard|Blob storage|
    |Premium|Block Blob storage|

1. To create a container in your storage account, go to your storage account. Under **Blob Service**, select **Browse Blobs**. Select **+ Container** at the top to create a new container.

1. Generate a connection string for your storage account by going to **Settings > Access keys**. Copy one of the two connection strings.

# [Managed identity](#tab/managed-identity)

If you don't have an existing Azure storage account to export to, follow these steps:

1. Create a [new storage account in the Azure portal](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You can learn more about creating new [Azure Blob storage accounts](../../storage/blobs/storage-quickstart-blobs-portal.md) or [Azure Data Lake Storage v2 storage accounts](../../storage/common/storage-account-create.md). Data export can only write data to storage accounts that support block blobs. The following list shows the known compatible storage account types:

    |Performance Tier|Account Type|
    |-|-|
    |Standard|General Purpose V2|
    |Standard|General Purpose V1|
    |Standard|Blob storage|
    |Premium|Block Blob storage|

1. To create a container in your storage account, go to your storage account. Under **Blob Service**, select **Browse Blobs**. Select **+ Container** at the top to create a new container.

[!INCLUDE [iot-central-managed-identity](../../../includes/iot-central-managed-identity.md)]

To configure the permissions:

1. On the **Add role assignment** page, select the subscription you want to use and **Storage** as the scope. Then select your storage account as the resource.

1. Select **Storage Blob Data Contributor** as the **Role**.

1. Select **Save**. The managed identity for your IoT Central application is now configured.

    > [!TIP]
    > This role assignment isn't visible in the list on the **Azure role assignments** page.

To further secure your blob container and only allow access from trusted services with managed identities, see:

- [Use private endpoints for Azure Storage](../../storage/common/storage-private-endpoints.md)
- [Authorize access to blob data with managed identities for Azure resources](../../storage/blobs/authorize-managed-identity.md)
- [Configure Azure Storage firewalls and virtual networks](../../storage/common/storage-network-security.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json)

---

### Create an Azure Data Explorer destination

If you don't have an existing [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) cluster and database to export to, follow these steps:

1. Create a new Azure Data Explorer cluster and database. To learn more, see the [Azure Data Explorer quickstart](/azure/data-explorer/create-cluster-database-portal). Make a note of the name of the database you create, you need this value in the following steps.

1. Create a service principal that you can use to connect your IoT Central application to Azure Data Explorer. Use the Azure Cloud Shell to run the following command:

    ```azurecli
    az ad sp create-for-rbac --skip-assignment --name "My SP for IoT Central"
    ```

    Make a note of the `appId`, `password`, and `tenant` values in the command output, you need them in the following steps.

1. To add the service principal to the database, navigate to the Azure Data Explorer portal and run the following query on your database. Replace the placeholders with the values you made a note of previously:

    ```kusto
    .add database <YourDatabaseName> admins ('aadapp=<YourAppId>;<YourTenant>');
    ```

1. Create a table in your database with a suitable schema for the data you're exporting. The following example query creates a table called `smartvitalspatch`. To learn more, see [Transform data inside your IoT Central application for export](howto-transform-data-internally.md):

    ```kusto
    .create table smartvitalspatch (
      EnqueuedTime:datetime,
      Message:string,
      Application:string,
      Device:string,
      Simulated:boolean,
      Template:string,
      Module:string,
      Component:string,
      Capability:string,
      Value:dynamic
    )
    ```

1. (Optional) To speed up ingesting data into your Azure Data Explorer database:

    1. Navigate to the **Configurations** page for your Azure Data Explorer cluster. Then enable the **Streaming ingestion** option.
    1. Run the following query to alter the table policy to enable streaming ingestion:

        ```kusto
        .alter table smartvitalspatch policy streamingingestion enable
        ```

1. Add an Azure Data Explorer destination in IoT Central using your Azure Data Explorer cluster URL, database name, and table name. The following table shows the service principal values to use for the authorization:

    | Service principal value | Destination configuration |
    | ----------------------- | ------------------------- |
    | appId                   | ClientID                  |
    | tenant                  | Tenant ID                 |
    | password                | Client secret             |

    :::image type="content" source="media/howto-export-data/export-destination.png" alt-text="Screenshot of Azure Data Explorer export destination.":::

### Create a webhook endpoint

You can export data to a publicly available HTTP webhook endpoint. You can create a test webhook endpoint using [RequestBin](https://requestbin.net/). RequestBin throttles request when the request limit is reached:

1. Open [RequestBin](https://requestbin.net/).
2. Create a new RequestBin and copy the **Bin URL**. You use this URL when you test your data export.

## Set up data export

# [Connection string](#tab/connection-string)

[!INCLUDE [iot-central-create-export](../../../includes/iot-central-create-export.md)]

Configure the destination:

1. Add a new destination or add a destination that you've already created. Select the **Create a new one** link and add the following information:

    - **Destination name**: the display name of the destination in IoT Central.
    - **Destination type**: choose the type of destination. If you haven't already set up your destination, see [Set up export destination](#set-up-export-destination).
    - **Authorization**: Select **Connection string**.
    - For Azure Event Hubs, Azure Service Bus queue or topic, paste the connection string for your resource, and enter the case-sensitive event hub, queue, or topic name if necessary.
    - For Azure Blob Storage, paste the connection string for your resource and enter the case-sensitive container name if necessary.
    - For Webhook, paste the callback URL for your webhook endpoint. You can optionally configure webhook authorization (OAuth 2.0 and Authorization token) and add custom headers. 
        - For OAuth 2.0, only the client credentials flow is supported. When the destination is saved, IoT Central will communicate with your OAuth provider to retrieve an authorization token. This token will be attached to the `Authorization` header for every message sent to this destination.
        - For Authorization token, you can specify a token value that will be directly attached to the `Authorization` header for every message sent to this destination.
    - Select **Create**.

1. Select **+ Destination** and choose a destination from the dropdown. You can add up to five destinations to a single export.

1. When you've finished setting up your export, select **Save**. After a few minutes, your data appears in your destinations.

# [Managed identity](#tab/managed-identity)

[!INCLUDE [iot-central-create-export](../../../includes/iot-central-create-export.md)]

Configure the destination:

1. Add a new destination or add a destination that you've already created. Select the **Create a new one** link and add the following information:

    - **Destination name**: the display name of the destination in IoT Central.
    - **Destination type**: choose the type of destination. If you haven't already set up your destination, see [Set up export destination](#set-up-export-destination).
    - **Authorization**: select **System-assigned managed identity**.
    - For Azure Event Hubs and Azure Service Bus queue or topic, enter the host name for your resource. Then enter the case-sensitive event hub, queue, or topic name. A host name looks like: `contoso-waste.servicebus.windows.net`.
    - For Azure Blob Storage, enter the endpoint URI for your storage account and the case-sensitive container name. An endpoint URI looks like: `https://contosowaste.blob.core.windows.net`.
    - For Webhook, paste the callback URL for your webhook endpoint. You can optionally configure webhook authorization (OAuth 2.0 and Authorization token) and add custom headers.
        - For OAuth 2.0, only the client credentials flow is supported. When the destination is saved, IoT Central will communicate with your OAuth provider to retrieve an authorization token. This token will be attached to the `Authorization` header for every message sent to this destination.
        - For Authorization token, you can specify a token value that will be directly attached to the `Authorization` header for every message sent to this destination.
    - Select **Create**.

1. Select **+ Destination** and choose a destination from the dropdown. You can add up to five destinations to a single export.

1. When you've finished setting up your export, select **Save**. After a few minutes, your data appears in your destinations.

---

## Monitor your export

You can check the status of your exports in IoT Central. You can also use [Azure Monitor](../../azure-monitor/overview.md) to see how much data you're exporting and any export errors. You can access export and device health metrics in charts in the Azure portal, with a REST API, or with queries in PowerShell or the Azure CLI. Currently, you can monitor the following data export metrics in Azure Monitor:

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

### Azure Data Explorer destination

Data is exported in near real time to a specified database table in the Azure Data Explorer cluster. The data is in the message body and is in JSON format encoded as UTF-8. You can add a [Transform](howto-transform-data-internally.md) in IoT Central to export data that matches the table schema.

To query the exported data in the Azure Data Explorer portal, navigate to the database and select **Query**.

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

Each message or record represents a connectivity event from a single device. Information in the exported message includes:

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

## Comparison of legacy data export and data export

The following table shows the differences between the [legacy data export](howto-export-data-legacy.md) and data export features:

| Capabilities  | Legacy data export | New data export |
| :------------- | :---------- | :----------- |
| Available data types | Telemetry, Devices, Device templates | Telemetry, Property changes, Device connectivity changes, Device lifecycle changes, Device template lifecycle changes |
| Filtering | None | Depends on the data type exported. For telemetry, filtering by telemetry, message properties, property values |
| Enrichments | None | Enrich with a custom string or a property value on the device |
| Destinations | Azure Event Hubs, Azure Service Bus queues and topics, Azure Blob Storage | Same as for legacy data export plus webhooks|
| Supported application versions | V2, V3 | V3 only |
| Notable limits | Five exports per app, one destination per export | 10 exports-destination connections per app |

## Next steps

Now that you know how to configure data export, a suggested next step is to learn [Transform data inside your IoT Central application for export](howto-transform-data-internally.md).
