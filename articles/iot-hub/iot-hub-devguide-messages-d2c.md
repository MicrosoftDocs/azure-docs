---
title: Understand Azure IoT Hub message routing
titleSuffix: Azure IoT Hub
description: This article describes how to use message routing to send device-to-cloud messages. Includes information about sending both telemetry and non-telemetry data.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 02/22/2023
ms.custom: ['Role: Cloud Development', devx-track-csharp]
---

# Use IoT Hub message routing to send device-to-cloud messages to different endpoints

Message routing enables you to send messages from your devices to cloud services in an automated, scalable, and reliable manner. Message routing can be used for:

* **Sending device telemetry messages and events** to the built-in endpoint and custom endpoints. Events that can be routed include device lifecycle events, device twin change events, digital twin change events, and device connection state events.

* **Filtering data before routing it to various endpoints** by applying rich queries. Message routing allows you to query on the message properties and message body as well as device twin tags and device twin properties. For more information, see [queries in message routing](iot-hub-devguide-routing-query-syntax.md).

The IoT Hub defines a [common format](iot-hub-devguide-messages-construct.md) for all device-to-cloud messaging for interoperability across protocols.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Routing endpoints

Each IoT hub has a default built-in endpoint (**messages/events**) that is compatible with Event Hubs. You also can create [custom endpoints](iot-hub-devguide-endpoints.md#custom-endpoints) that point to other services in your Azure subscription.

Each message is routed to all endpoints whose routing queries it matches. In other words, a message can be routed to multiple endpoints.  If a message matches multiple routes that point to the same endpoint, IoT Hub delivers the message to that endpoint only once.

IoT Hub currently supports the following endpoints:

* Built-in endpoint
* Storage containers
* Service Bus queues
* Service Bus topics
* Event Hubs
* Cosmos DB (preview)

IoT Hub needs write access to these service endpoints for message routing to work. If you configure your endpoints through the Azure portal, the necessary permissions are added for you. If you configure your endpoints using PowerShell or the Azure CLI, you need to provide the write access permission.

To learn how to create endpoints, see the following articles:

* [Manage routes and endpoints using the Azure portal](how-to-routing-portal.md)
* [Manage routes and endpoints using the Azure CLI](how-to-routing-azure-cli.md)
* [Manage routes and endpoints using PowerShell](how-to-routing-powershell.md)
* [Manage routes and endpoints using Azure Resource Manager](how-to-routing-arm.md)

Make sure you configure your services to support the expected throughput. For example, if you're using Event Hubs as a custom endpoint, you must configure the **throughput units** for that event hub so it can handle the ingress of events you plan to send via IoT Hub message routing. Similarly, when using a Service Bus queue as an endpoint, you must configure the **maximum size** to ensure the queue can hold all the data ingressed, until it's egressed by consumers. When you first configure your IoT solution, you may need to monitor your other endpoints and make any necessary adjustments for the actual load.

If your custom endpoint has firewall configurations, consider using the [Microsoft trusted first party exception.](./virtual-network-support.md#egress-connectivity-from-iot-hub-to-other-azure-resources)

### Built-in endpoint

You can use standard [Event Hubs integration and SDKs](iot-hub-devguide-messages-read-builtin.md) to receive device-to-cloud messages from the built-in endpoint (**messages/events**). Once a route is created, data stops flowing to the built-in endpoint unless a route is created to that endpoint. Even if no routes are created, a fallback route must be enabled to route messages to the built-in endpoint. The fallback is enabled by default if you create your hub using the portal or the CLI.

### Azure Storage as a routing endpoint

There are two storage services IoT Hub can route messages to: [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md) and [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) (ADLS Gen2) accounts. Azure Data Lake Storage accounts are [hierarchical namespace-enabled](../storage/blobs/data-lake-storage-namespace.md) storage accounts built on top of blob storage. Both of these use blobs for their storage.

IoT Hub supports writing data to Azure Storage in the [Apache Avro](https://avro.apache.org/) format and the JSON format. The default is AVRO. When using JSON encoding, you must set the contentType property to **application/json** and contentEncoding property to **UTF-8** in the message [system properties](iot-hub-devguide-routing-query-syntax.md#system-properties). Both of these values are case-insensitive. If the content encoding isn't set, then IoT Hub writes the messages in base 64 encoded format.

The encoding format can be set only when the blob storage endpoint is configured; it can't be edited for an existing endpoint

IoT Hub batches messages and writes data to storage whenever the batch reaches a certain size or a certain amount of time has elapsed. IoT Hub defaults to the following file naming convention: `{iothub}/{partition}/{YYYY}/{MM}/{DD}/{HH}/{mm}`.

You may use any file naming convention, however you must use all listed tokens. IoT Hub writes to an empty blob if there's no data to write.

We recommend listing the blobs or files and then iterating over them, to ensure all blobs or files are read without making any assumptions of partition. The partition range could potentially change during a [Microsoft-initiated failover](iot-hub-ha-dr.md#microsoft-initiated-failover) or IoT Hub [manual failover](iot-hub-ha-dr.md#manual-failover). You can use the [List Blobs API](/rest/api/storageservices/list-blobs) to enumerate the list of blobs or [List ADLS Gen2 API](/rest/api/storageservices/datalakestoragegen2/path) for the list of files. For example:

```csharp
public void ListBlobsInContainer(string containerName, string iothub)
{
    var storageAccount = CloudStorageAccount.Parse(this.blobConnectionString);
    var cloudBlobContainer = storageAccount.CreateCloudBlobClient().GetContainerReference(containerName);
    if (cloudBlobContainer.Exists())
    {
        var results = cloudBlobContainer.ListBlobs(prefix: $"{iothub}/");
        foreach (IListBlobItem item in results)
        {
            Console.WriteLine(item.Uri);
        }
    }
}
```

To create an Azure Data Lake Gen2-compatible storage account, create a new V2 storage account and select **Enable hierarchical namespace** from the **Data Lake Storage Gen2** section of the **Advanced** tab, as shown in the following image:

:::image type="content" alt-text="Screenshot that shows how to select Azure Date Lake Gen2 storage." source="./media/iot-hub-devguide-messages-d2c/selectadls2storage.png":::

### Service Bus queues and Service Bus topics as a routing endpoint

Service Bus queues and topics used as IoT Hub endpoints must not have **Sessions** or **Duplicate Detection** enabled. If either of those options are enabled, the endpoint appears as **Unreachable** in the Azure portal.

### Event Hubs as a routing endpoint

Apart from the built-in-Event Hubs compatible endpoint, you can also route data to custom endpoints of type Event Hubs.

### Azure Cosmos DB as a routing endpoint (preview)

You can send data directly to Azure Cosmos DB from IoT Hub. Cosmos DB is a fully managed hyperscale multi-model database service. It provides low latency and high availability, making it a great choice for scenarios like connected solutions and manufacturing that require extensive downstream data analysis.

IoT Hub supports writing to Cosmos DB in JSON (if specified in the message content-type) or as Base64 encoded binary.

To effectively support high-scale scenarios, you can enable [synthetic partition keys](../cosmos-db/nosql/synthetic-partition-keys.md) for the Cosmos DB endpoint. As Cosmos DB is a hyperscale data store, all data/documents written to it must contain a field that represents a logical partition. Each logical partition has a maximum size of 20 GB. You can specify the partition key property name in **Partition key name**. The partition key property name is defined at the container level and can't be changed once it has been set.  

You can configure the synthetic partition key value by specifying a template in **Partition key template** based on your estimated data volume. For example, in manufacturing scenarios, your logical partition might be expected to approach its maximum limit of 20 GB within a month. In that case, you can define a synthetic partition key as a combination of the device ID and the month. The generated partition key value is automatically added to the partition key property for each new Cosmos DB record, ensuring logical partitions are created each month for each device.

> [!CAUTION]
> If you're using the system assigned managed identity for authenticating to Cosmos DB, you must use Azure CLI or Azure PowerShell to assign the Cosmos DB Built-in Data Contributor built-in role definition to the identity. Role assignment for Cosmos DB isn't currently supported from the Azure portal. For more information about the various roles, see [Configure role-based access for Azure Cosmos DB](../cosmos-db/how-to-setup-rbac.md). To understand assigning roles via CLI, see [Manage Azure Cosmos DB SQL role resources.](/cli/azure/cosmosdb/sql/role)

## Route to an endpoint in another subscription

If the endpoint resource is in a different subscription than your IoT hub, you need to configure your IoT hub as a trusted Microsoft service before creating a custom endpoint. When you do create the custom endpoint, set the **Authentication type** to user-assigned identity.

For more information, see [Egress connectivity from IoT Hub to other Azure resources](./iot-hub-managed-identity.md#egress-connectivity-from-iot-hub-to-other-azure-resources).

## Routing queries

IoT Hub message routing provides a querying capability to filter the data before routing it to the endpoints. Each routing query you configure has the following properties:

| Property      | Description |
| ------------- | ----------- |
| **Name**      | The unique name that identifies the query. |
| **Source**    | The origin of the data stream to be acted upon. For example, device telemetry. |
| **Condition** | The query expression for the routing query that is run against the message application properties, system properties, message body, device twin tags, and device twin properties to determine if it's a match for the endpoint. For more information about constructing a query, see the see [message routing query syntax](iot-hub-devguide-routing-query-syntax.md) |
| **Endpoint**  | The name of the endpoint where IoT Hub sends messages that match the query. We recommend that you choose an endpoint in the same region as your IoT hub. |

A single message may match the condition on multiple routing queries, in which case IoT Hub delivers the message to the endpoint associated with each matched query. IoT Hub also automatically deduplicates message delivery, so if a message matches multiple queries that have the same destination, it's only written once to that destination.

For more information, see [IoT Hub message routing query syntax](./iot-hub-devguide-routing-query-syntax.md).

## Read data that has been routed

Use the following articles to learn how to read messages from an endpoint.

* Read from a [built-in endpoint](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs)

* Read from [Blob storage](../storage/blobs/storage-blob-event-quickstart.md)

* Read from [Event Hubs](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)

* Read from [Service Bus queues](../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md)

* Read from [Service Bus topics](../service-bus-messaging/service-bus-dotnet-how-to-use-topics-subscriptions.md)

## Fallback route

The fallback route sends all the messages that don't satisfy query conditions on any of the existing routes to the built-in endpoint (**messages/events**), which is compatible with [Event Hubs](../event-hubs/index.yml). If message routing is enabled, you can enable the fallback route capability. Once a route is created, data stops flowing to the built-in endpoint, unless a route is created to that endpoint. If there are no routes to the built-in endpoint and a fallback route is enabled, only messages that don't match any query conditions on routes will be sent to the built-in endpoint. Also, if all existing routes are deleted, the fallback route capability must be enabled to receive all data at the built-in endpoint.

You can enable or disable the fallback route in the Azure portal, from the **Message routing** blade. You can also use Azure Resource Manager for [FallbackRouteProperties](/rest/api/iothub/iothubresource/createorupdate#fallbackrouteproperties) to use a custom endpoint for the fallback route.

## Non-telemetry events

In addition to device telemetry, message routing also enables sending non-telemetry events, including:

* Device twin change events
* Device lifecycle events
* Device job lifecycle events
* Digital twin change events
* Device connection state events

For example, if a route is created with the data source set to **Device Twin Change Events**, IoT Hub sends messages to the endpoint that contain the change in the device twin. Similarly, if a route is created with the data source set to **Device Lifecycle Events**, IoT Hub sends a message indicating whether the device or module was deleted or created. For more information about device lifecycle events, see [Device and module lifecycle notifications](./iot-hub-devguide-identity-registry.md#device-and-module-lifecycle-notifications). When using [Azure IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md), a developer can create routes with the data source set to **Digital Twin Change Events** and IoT Hub sends messages whenever a digital twin property is set or changed, a digital twin is replaced, or when a change event happens for the underlying device twin. Finally, if a route is created with data source set to **Device Connection State Events**, IoT Hub sends a message indicating whether the device was connected or disconnected.

[IoT Hub also integrates with Azure Event Grid](iot-hub-event-grid.md) to publish device events to support real-time integrations and automation of workflows based on these events. See key [differences between message routing and Event Grid](iot-hub-event-grid-routing-comparison.md) to learn which works best for your scenario.

### Limitations for device connection state events

Device connection state events are available for devices connecting using either the MQTT or AMQP protocol, or using either of these protocols over WebSockets. Requests made only with HTTPS won't trigger device connection state notifications. For IoT Hub to start sending device connection state events, after opening a connection a device must call either the *cloud-to-device receive message* operation or the *device-to-cloud send telemetry* operation. Outside of the Azure IoT SDKs, in MQTT these operations equate to SUBSCRIBE or PUBLISH operations on the appropriate messaging [topics](../iot/iot-mqtt-connect-to-iot-hub.md). Over AMQP these operations equate to attaching or transferring a message on the [appropriate link paths](iot-hub-amqp-support.md).

IoT Hub doesn't report each individual device connect and disconnect, but rather publishes the current connection state taken at a periodic, 60-second snapshot. Receiving either the same connection state event with different sequence numbers or different connection state events both mean that there was a change in the device connection state during the 60-second window.

## Test routes

When you create a new route or edit an existing route, you should test the route query with a sample message. You can test individual routes or test all routes at once and no messages are routed to the endpoints during the test. Azure portal, Azure Resource Manager, Azure PowerShell, and Azure CLI can be used for testing. Outcomes help identify whether the sample message matched or didn't match the query, or if the test couldn't run because the sample message or query syntax are incorrect. To learn more, see [Test Route](/rest/api/iothub/iothubresource/testroute) and [Test All Routes](/rest/api/iothub/iothubresource/testallroutes).

## Latency

When you route device-to-cloud telemetry messages using built-in endpoints, there's a slight increase in the end-to-end latency after the creation of the first route.

In most cases, the average increase in latency is less than 500 milliseconds. However, the latency you experience can vary and can be higher depending on the tier of your IoT hub and your solution architecture. You can monitor the latency using the **Routing: message latency for messages/events** or **d2c.endpoints.latency.builtIn.events** IoT Hub metrics. Creating or deleting any route after the first one doesn't impact the end-to-end latency.

## Monitor and troubleshoot

IoT Hub provides several metrics related to routing and endpoints to give you an overview of the health of your hub and messages sent. For a list of all of the IoT Hub metrics broken out by functional category, see the [Metrics](monitor-iot-hub-reference.md#metrics) section of [Monitoring Azure IoT Hub data reference](monitor-iot-hub-reference.md). You can track errors that occur during evaluation of a routing query and endpoint health as perceived by IoT Hub with the [**routes** category in IoT Hub resource logs](monitor-iot-hub-reference.md#routes). To learn more about using metrics and resource logs with IoT Hub, see [Monitoring Azure IoT Hub](monitor-iot-hub.md).

You can use the REST API [Get Endpoint Health](/rest/api/iothub/iothubresource/getendpointhealth#iothubresource_getendpointhealth) to get the [health status](iot-hub-devguide-endpoints.md#custom-endpoints) of the endpoints.

Use the [troubleshooting guide for routing](troubleshoot-message-routing.md) for more details and support for troubleshooting routing.

## Next steps

To learn how to create message routes, see:

* [Create and delete routes and endpoints by using the Azure portal](./how-to-routing-portal.md)
* [Create and delete routes and endpoints by using the Azure CLI](./how-to-routing-azure-cli.md)


