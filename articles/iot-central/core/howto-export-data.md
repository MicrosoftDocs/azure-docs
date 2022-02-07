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
- Transform the data streams to modify their shape and content.
- Send the data to destinations such as Azure Event Hubs, Azure Data Explorer, Azure Service Bus, Azure Blob Storage, and webhook endpoints.

> [!Tip]
> When you turn on data export, you get only the data from that moment onward. Currently, data can't be retrieved for a time when data export was off. To retain more historical data, turn on data export early.

## Prerequisites

To use data export features, you must have a [V3 application](howto-faq.yml#how-do-i-get-information-about-my-application-), and you must have the [Data export](howto-manage-users-roles.md) permission.

If you have a V2 application, see [Migrate your V2 IoT Central application to V3](howto-migrate.md).

## Set up an export destination

Your export destination must exist before you configure your data export. Choose from the following destination types:

# [Blob Storage](#tab/blob-storage)

IoT Central exports data once per minute, with each file containing the batch of changes since the previous export. Exported data is saved in JSON format. The default paths to the exported data in your storage account are:

- Telemetry: _{container}/{app-id}/{partition_id}/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}_
- Property changes: _{container}/{app-id}/{partition_id}/{YYYY}/{MM}/{dd}/{hh}/{mm}/{filename}_

To browse the exported files in the Azure portal, navigate to the file and select **Edit blob**.

### Connection options

Blob Storage destinations let you configure the connection with a *connection string* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

[!INCLUDE [iot-central-managed-identities](../../../includes/iot-central-managed-identities.md)]

# [Service Bus](#tab/service-bus)

Both queues and topics are supported for Azure Service Bus destinations.

IoT Central exports data in near real time. The data is in the message body and is in JSON format encoded as UTF-8.

The annotations or system properties bag of the message contains the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` fields that have the same values as the corresponding fields in the message body.

### Connection options

Service Bus destinations let you configure the connection with a *connection string* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

[!INCLUDE [iot-central-managed-identities](../../../includes/iot-central-managed-identities.md)]

# [Event Hubs](#tab/event-hubs)

IoT Central exports data in near real time. The data is in the message body and is in JSON format encoded as UTF-8.

The annotations or system properties bag of the message contains the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` fields that have the same values as the corresponding fields in the message body.

### Connection options

Event Hubs destinations let you configure the connection with a *connection string* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

[!INCLUDE [iot-central-managed-identities](../../../includes/iot-central-managed-identities.md)]

# [Azure Data Explorer](#tab/data-explorer)

You can use an [Azure Data Explorer cluster](/azure/data-explorer/data-explorer-overview) or an [Azure Synapse Data Explorer pool](../../synapse-analytics/data-explorer/data-explorer-overview.md). To learn more, see [What is the difference between Azure Synapse Data Explorer and Azure Data Explorer?](../..//synapse-analytics/data-explorer/data-explorer-compare.md).

IoT Central exports data in near real time to a database table in the Azure Data Explorer cluster. The data is in the message body and is in JSON format encoded as UTF-8. You can add a [Transform](howto-transform-data-internally.md) in IoT Central to export data that matches the table schema.

To query the exported data in the Azure Data Explorer portal, navigate to the database and select **Query**.

### Connection options

Azure Data Explorer destinations let you configure the connection with a *service principal* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

Managed identities are more secure because:

- You don't store the credentials for your resource in your IoT Central application.
- The credentials are automatically tied to the lifetime of your IoT Central application.
- Managed identities automatically rotate their security keys regularly.

IoT Central currently uses [system-assigned managed identities](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

When you configure a managed identity, the configuration includes a *scope* and a *role*:

- The scope defines where you can use the managed identity.
- The role defines what permissions the IoT Central application is granted in the destination service.

This article shows how to create a managed identity using the Azure CLI. You can also use the Azure portal to create a manged identity.

# [Webhook](#tab/webhook)

For webhook destinations, IoT Central exports data in near real time. The data in the message body is in the same format as for Event Hubs and Service Bus.

### Create a webhook destination

You can export data to a publicly available HTTP webhook endpoint. You can create a test webhook endpoint using [RequestBin](https://requestbin.net/). RequestBin throttles request when the request limit is reached:

1. Open [RequestBin](https://requestbin.net/).
1. Create a new RequestBin and copy the **Bin URL**. You use this URL when you test your data export.

To create the Azure Data Explorer destination in IoT Central on the **Create new destination** page:

1. Enter a **Destination name**.

1. Select **Webhook** as the destination type.

1. Paste the callback URL for your webhook endpoint. You can optionally configure webhook authorization and add custom headers.

    - For **OAuth2.0**, only the client credentials flow is supported. When you save the destination, IoT Central communicates with your OAuth provider to retrieve an authorization token. This token is attached to the `Authorization` header for every message sent to this destination.
    - For **Authorization token**, you can specify a token value that's directly attached to the `Authorization` header for every message sent to this destination.

1. Select **Save**.

---

# [Service principal](#tab/service-principal/data-explorer)

### Create an Azure Data Explorer destination

If you don't have an existing Azure Data Explorer database to export to, follow these steps:

1. You have two choices to create an Azure Data Explorer database:

    - Create a new Azure Data Explorer cluster and database. To learn more, see the [Azure Data Explorer quickstart](/azure/data-explorer/create-cluster-database-portal). Make a note of the cluster URI and the name of the database you create, you need these values in the following steps.
    - Create a new Azure Synapse Data Explorer pool and database. To learn more, see the [Azure Data Explorer quickstart](../../synapse-analytics/get-started-analyze-data-explorer.md). Make a note of the pool URI and the name of the database you create, you need these values in the following steps.

1. Create a service principal that you can use to connect your IoT Central application to Azure Data Explorer. Use the Azure Cloud Shell to run the following command:

    ```azurecli
    az ad sp create-for-rbac --skip-assignment --name "My SP for IoT Central"
    ```

    Make a note of the `appId`, `password`, and `tenant` values in the command output, you need them in the following steps.

1. To add the service principal to the database, navigate to the Azure Data Explorer portal and run the following query on your database. Replace the placeholders with the values you made a note of previously:

    ```kusto
    .add database ['<YourDatabaseName>'] admins ('aadapp=<YourAppId>;<YourTenant>');
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

To create the Azure Data Explorer destination in IoT Central on the **Create new destination** page:

1. Enter a **Destination name**.

1. Select **Azure Data Explorer** as the destination type.

1. Enter your Azure Data Explorer cluster or pool URL, database name, and table name. The following table shows the service principal values to use for the authorization:

    | Service principal value | Destination configuration |
    | ----------------------- | ------------------------- |
    | appId                   | ClientID                  |
    | tenant                  | Tenant ID                 |
    | password                | Client secret             |

    > [!TIP]
    > The cluster URL for a standalone Azure Data Explorer looks like `https://<ClusterName>.<AzureRegion>.kusto.windows.net`. The cluster URL for an Azure Synapse Data Explorer pool looks like `https://<DataExplorerPoolName>.<SynapseWorkspaceName>.kusto.azuresynapse.net`.

    :::image type="content" source="media/howto-export-data/export-destination.png" alt-text="Screenshot of Azure Data Explorer export destination.":::

# [Managed identity](#tab/managed-identity/data-explorer)

### Create an Azure Data Explorer destination

If you don't have an existing Azure Data Explorer database to export to, follow these steps. You have two choices to create an Azure Data Explorer database:

- Create a new Azure Data Explorer cluster and database. To learn more, see the [Azure Data Explorer quickstart](/azure/data-explorer/create-cluster-database-portal). Make a note of the cluster URI and the name of the database you create, you need these values in the following steps.
- Create a new Azure Synapse Data Explorer pool and database. To learn more, see the [Azure Data Explorer quickstart](../../synapse-analytics/get-started-analyze-data-explorer.md). Make a note of the pool URI and the name of the database you create, you need these values in the following steps.

To configure the managed identity that enables your IoT Central application to securely export data to your Azure resource:

1. Create a managed identity for your IoT Central application to use to connect to your database. Use the Azure Cloud Shell to run the following command:

    ```azurecli
    az iot central app identity assign --name {your IoT Central app name} \
        --resource-group {resource group name} \
        --system-assigned
    ```

    Make a note of the `principalId` and `tenantId` output by the command. You use these values in the following step.

1. Configure the database permissions to allow connections from your IoT Central application. Use the Azure Cloud Shell to run the following command:

    ```azurecli
    az kusto database-principal-assignment create --cluster-name {name of your cluster} \
        --database-name {name of your database}    \
        --resource-group {resource group name} \
        --principal-assignment-name {name of your IoT Central application} \
        --principal-id {principal id from the previous step} \
        --principal-type App --role Admin \
        --tenant-id {tenant id from the previous step}
    ```

    > [!TIP]
    > If you're using Azure Synapse, see [`az synapse kusto database-principal-assignment`](/cli/azure/synapse/kusto/database-principal-assignment).

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

To create the Azure Data Explorer destination in IoT Central on the **Create new destination** page:

1. Enter a **Destination name**.

1. Select **Azure Data Explorer** as the destination type.

1. Enter your Azure Data Explorer cluster or pool URL, database name, and table name. Select **System-assigned managed identity** as the authorization type.

    > [!TIP]
    > The cluster URL for a standalone Azure Data Explorer looks like `https://<ClusterName>.<AzureRegion>.kusto.windows.net`. The cluster URL for an Azure Synapse Data Explorer pool looks like `https://<DataExplorerPoolName>.<SynapseWorkspaceName>.kusto.azuresynapse.net`.

    :::image type="content" source="media/howto-export-data/export-destination-managed.png" alt-text="Screenshot of Azure Data Explorer export destination.":::

# [Connection string](#tab/connection-string/event-hubs)

### Create an Event Hubs destination

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
        2. Under **Settings**, select **Shared Access Policies**.
        3. Create a new key or choose an existing key that has **Send** permissions.
        4. Copy either the primary or secondary connection string.

To create the Event Hubs destination in IoT Central on the **Create new destination** page:

1. Enter a **Destination name**.

1. Select **Azure Event Hubs** as the destination type.

1. Select **Connection string** as the authorization type.

1. Paste in the connection string for your Event Hubs resource, and enter the case-sensitive event hub name if necessary.

1. Select **Save**.

# [Managed identity](#tab/managed-identity/event-hubs)

### Create an Event Hubs destination

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

To create the Event Hubs destination in IoT Central on the **Create new destination** page:

1. Enter a **Destination name**.

1. Select **Azure Event Hubs** as the destination type.

1. Select **System-assigned managed identity** as the authorization type.

1. Enter the host name of your Event Hubs resource. Then enter the case-sensitive event hub name. A host name looks like: `contoso-waste.servicebus.windows.net`.

1. Select **Save**.

# [Connection string](#tab/connection-string/service-bus)

### Create a Service Bus queue or topic destination

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
        2. Under **Settings**, select **Shared Access Policies**.
        3. Create a new key or choose an existing key that has **Send** permissions.
        4. Copy either the primary or secondary connection string.

To create the Service Bus destination in IoT Central on the **Create new destination** page:

1. Enter a **Destination name**.

1. Select **Azure Service Bus Queue** or  **Azure Service Bus Topic** as the destination type.

1. Select **Connection string** as the authorization type.

1. Paste in the connection string for your Service Bus resource, and enter the case-sensitive queue or topic name if necessary.

1. Select **Save**.

# [Managed identity](#tab/managed-identity/service-bus)

### Create a Service Bus queue or topic destination

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

To create the Service Bus destination in IoT Central on the **Create new destination** page:

1. Enter a **Destination name**.

1. Select **Azure Service Bus Queue** or  **Azure Service Bus Topic** as the destination type.

1. Select **System-assigned managed identity** as the authorization type.

1. Enter the host name of your Service Bus resource. Then enter the case-sensitive queue or topic name. A host name looks like: `contoso-waste.servicebus.windows.net`.

1. Select **Save**.

# [Connection string](#tab/connection-string/blob-storage)

### Create an Azure Blob Storage destination

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

To create the Blob Storage destination in IoT Central on the **Create new destination** page:

1. Enter a **Destination name**.

1. Select **Azure Blob Storage** as the destination type.

1. Select **Connection string** as the authorization type.

1. Paste in the connection string for your Blob Storage resource, and enter the case-sensitive container name if necessary.

1. Select **Save**.

# [Managed identity](#tab/managed-identity/blob-storage)

### Create an Azure Blob Storage destination

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

To create the Blob Storage destination in IoT Central on the **Create new destination** page:

1. Enter a **Destination name**.

1. Select **Azure Blob Storage** as the destination type.

1. Select **System-assigned managed identity** as the authorization type.

1. Enter the endpoint URI for your storage account and the case-sensitive container name. An endpoint URI looks like: `https://contosowaste.blob.core.windows.net`.

1. Select **Save**.

---

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

### Device connectivity changes format

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

### Device lifecycle changes format

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

### Device template lifecycle changes format

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
