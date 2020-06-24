---
title: Understand Azure IoT Hub message routing | Microsoft Docs
description: Developer guide - how to use message routing to send device-to-cloud messages. Includes information about sending both telemetry and non-telemetry data.
author: ash2017
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 05/15/2019
ms.author: asrastog
---

# Use IoT Hub message routing to send device-to-cloud messages to different endpoints

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

Message routing enables you to send messages from your devices to cloud services in an automated, scalable, and reliable manner. Message routing can be used for: 

* **Sending device telemetry messages as well as events** namely, device lifecycle events, and device twin change events to the built-in-endpoint and custom endpoints. Learn about [routing endpoints](#routing-endpoints).

* **Filtering data before routing it to various endpoints** by applying rich queries. Message routing allows you to query on the message properties and message body as well as device twin tags and device twin properties. Learn more about using [queries in message routing](iot-hub-devguide-routing-query-syntax.md).

IoT Hub needs write access to these service endpoints for message routing to work. If you configure your endpoints through the Azure portal, the necessary permissions are added for you. Make sure you configure your services to support the expected throughput. For example, if you are using Event Hubs as a custom endpoint, you must configure the **throughput units** for that event hub so it can handle the ingress of events you plan to send via IoT Hub message routing. Similarly, when using a Service Bus Queue as an endpoint, you must configure the **maximum size** to ensure the queue can hold all the data ingressed, until it is egressed by consumers. When you first configure your IoT solution, you may need to monitor your additional endpoints and make any necessary adjustments for the actual load.

The IoT Hub defines a [common format](iot-hub-devguide-messages-construct.md) for all device-to-cloud messaging for interoperability across protocols. If a message matches multiple routes that point to the same endpoint, IoT Hub delivers message to that endpoint only once. Therefore, you don't need to configure deduplication on your Service Bus queue or topic. In partitioned queues, partition affinity guarantees message ordering. Use this tutorial to learn how to [configure message routing](tutorial-routing.md).

## Routing endpoints

An IoT hub has a default built-in-endpoint (**messages/events**) that is compatible with Event Hubs. You can create [custom endpoints](iot-hub-devguide-endpoints.md#custom-endpoints) to route messages to by linking other services in your subscription to the IoT Hub. 

Each message is routed to all endpoints whose routing queries it matches. In other words, a message can be routed to multiple endpoints.


If your custom endpoint has firewall configurations, consider using the Microsoft trusted first party exception, to give your IoT Hub access to the specific endpoint - [Azure Storage](./virtual-network-support.md#egress-connectivity-to-storage-account-endpoints-for-routing), [Azure Event Hubs](./virtual-network-support.md#egress-connectivity-to-event-hubs-endpoints-for-routing) and [Azure Service Bus](./virtual-network-support.md#egress-connectivity-to-service-bus-endpoints-for-routing). This is available in select regions for IoT Hubs with [managed service identity](./virtual-network-support.md).

IoT Hub currently supports the following endpoints:

 - Built-in endpoint
 - Azure Storage
 - Service Bus Queues and Service Bus Topics
 - Event Hubs

### Built-in endpoint

You can use standard [Event Hubs integration and SDKs](iot-hub-devguide-messages-read-builtin.md) to receive device-to-cloud messages from the built-in endpoint (**messages/events**). Once a Route is created, data stops flowing to the built-in-endpoint unless a Route is created to that endpoint.

### Azure Storage

There are two storage services IoT Hub can route messages to -- [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md) and [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) (ADLS Gen2) accounts. Azure Data Lake Storage accounts are [hierarchical namespace](../storage/blobs/data-lake-storage-namespace.md)-enabled storage accounts built on top of blob storage. Both of these use blobs for their storage.

IoT Hub supports writing data to Azure Storage in the [Apache Avro](https://avro.apache.org/) format as well as in JSON format. The default is AVRO. The encoding format can be only set when the blob storage endpoint is configured. The format cannot be edited for an existing endpoint. When using JSON encoding, you must set the contentType to **application/json** and contentEncoding to **UTF-8** in the message [system properties](iot-hub-devguide-routing-query-syntax.md#system-properties). Both of these values are case-insensitive. If the content encoding is not set, then IoT Hub will write the messages in base 64 encoded format. You can select the encoding format using the IoT Hub Create or Update REST API, specifically the [RoutingStorageContainerProperties](https://docs.microsoft.com/rest/api/iothub/iothubresource/createorupdate#routingstoragecontainerproperties), the Azure portal, [Azure CLI](https://docs.microsoft.com/cli/azure/iot/hub/routing-endpoint?view=azure-cli-latest), or the [Azure PowerShell](https://docs.microsoft.com/powershell/module/az.iothub/add-aziothubroutingendpoint?view=azps-1.3.0). The following diagram shows how to select the encoding format in the Azure portal.

![Blob storage endpoint encoding](./media/iot-hub-devguide-messages-d2c/blobencoding.png)

IoT Hub batches messages and writes data to storage whenever the batch reaches a certain size or a certain amount of time has elapsed. IoT Hub defaults to the following file naming convention: 

```
{iothub}/{partition}/{YYYY}/{MM}/{DD}/{HH}/{mm}
```

You may use any file naming convention, however you must use all listed tokens. IoT Hub will write to an empty blob if there is no data to write.

We recommend listing the blobs or files and then iterating over them, to ensure all blobs or files are read without making any assumptions of partition. The partition range could potentially change during a [Microsoft-initiated failover](iot-hub-ha-dr.md#microsoft-initiated-failover) or IoT Hub [manual failover](iot-hub-ha-dr.md#manual-failover). You can use the [List Blobs API](https://docs.microsoft.com/rest/api/storageservices/list-blobs) to enumerate the list of blobs or [List ADLS Gen2 API](https://docs.microsoft.com/rest/api/storageservices/datalakestoragegen2/path/list) for the list of files. Please see the following sample as guidance.

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

To create an Azure Data Lake Gen2-compatible storage account, create a new V2 storage account and select *enabled* on the *Hierarchical namespace* field on the **Advanced** tab as shown in the following image:

![Select Azure Date Lake Gen2 storage](./media/iot-hub-devguide-messages-d2c/selectadls2storage.png)


### Service Bus Queues and Service Bus Topics

Service Bus queues and topics used as IoT Hub endpoints must not have **Sessions** or **Duplicate Detection** enabled. If either of those options are enabled, the endpoint appears as **Unreachable** in the Azure portal.

### Event Hubs

Apart from the built-in-Event Hubs compatible endpoint, you can also route data to custom endpoints of type Event Hubs. 

## Reading data that has been routed

You can configure a route by following this [tutorial](tutorial-routing.md).

Use the following tutorials to learn how to read message from an endpoint.

* Reading from [Built-in-endpoint](quickstart-send-telemetry-node.md)

* Reading from [Blob storage](../storage/blobs/storage-blob-event-quickstart.md)

* Reading from [Event Hubs](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)

* Reading from [Service Bus Queues](../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md)

* Read from [Service Bus Topics](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-dotnet-how-to-use-topics-subscriptions)


## Fallback route

The fallback route sends all the messages that don't satisfy query conditions on any of the existing routes to the built-in-Event Hubs (**messages/events**), that is compatible with [Event Hubs](/azure/event-hubs/). If message routing is turned on, you can enable the fallback route capability. Once a route is created, data stops flowing to the built-in-endpoint, unless a route is created to that endpoint. If there are no routes to the built-in-endpoint and a fallback route is enabled, only messages that don't match any query conditions on routes will be sent to the built-in-endpoint. Also, if all existing routes are deleted, fallback route must be enabled to receive all data at the built-in-endpoint.

You can enable/disable the fallback route in the Azure portal->Message Routing blade. You can also use Azure Resource Manager for [FallbackRouteProperties](/rest/api/iothub/iothubresource/createorupdate#fallbackrouteproperties) to use a custom endpoint for fallback route.

## Non-telemetry events

In addition to device telemetry, message routing also enables sending device twin change events, device lifecycle events, and digital twin change events (in public preview). For example, if a route is created with data source set to **device twin change events**, IoT Hub sends messages to the endpoint that contain the change in the device twin. Similarly, if a route is created with data source set to **device lifecycle events**, IoT Hub sends a message indicating whether the device was deleted or created. Finally, as part of the [IoT Plug and Play public preview](../iot-pnp/overview-iot-plug-and-play.md), a developer can create routes with data source set to **digital twin change events** and IoT Hub sends messages whenever a digital twin [property](../iot-pnp/iot-plug-and-play-glossary.md) is set or changed, a [digital twin](../iot-pnp/iot-plug-and-play-glossary.md) is replaced, or when a change event happens for the underlying device twin.

[IoT Hub also integrates with Azure Event Grid](iot-hub-event-grid.md) to publish device events to support real-time integrations and automation of workflows based on these events. See key [differences between message routing and Event Grid](iot-hub-event-grid-routing-comparison.md) to learn which works best for your scenario.

## Testing routes

When you create a new route or edit an existing route, you should test the route query with a sample message. You can test individual routes or test all routes at once and no messages are routed to the endpoints during the test. Azure portal, Azure Resource Manager, Azure PowerShell, and Azure CLI can be used for testing. Outcomes help identify whether the sample message matched the query, message did not match the query, or test couldn't run because the sample message or query syntax are incorrect. To learn more, see [Test Route](/rest/api/iothub/iothubresource/testroute) and [Test all routes](/rest/api/iothub/iothubresource/testallroutes).

## Ordering guarantees with at least once delivery

IoT Hub message routing guarantees ordered and at least once delivery of messages to the endpoints. This means that there can be duplicate messages and a series of messages can be retransmitted honoring the original message ordering. For example, if the original message order is [1,2,3,4], you could receive a message sequence like [1,2,1,2,3,1,2,3,4]. The ordering guarantee is that if you ever receive message [1], it would always be followed by [2,3,4].

For handling message duplicates, we recommend stamping a unique identifier in the application properties of the message at the point of origin, which is usually a device or a module. The service consuming the messages can handle duplicate messages using this identifier.

## Latency

When you route device-to-cloud telemetry messages using built-in endpoints, there is a slight increase in the end-to-end latency after the creation of the first route.

In most cases, the average increase in latency is less than 500 ms. You can monitor the latency using **Routing: message latency for messages/events** or **d2c.endpoints.latency.builtIn.events** IoT Hub metric. Creating or deleting any route after the first one does not impact the end-to-end latency.

## Monitoring and troubleshooting

IoT Hub provides several metrics related to routing and endpoints to give you an overview of the health of your hub and messages sent. [IoT Hub metrics](iot-hub-metrics.md) lists all metrics that are enabled by default for your IoT Hub. Using the **routes** diagnostic logs in Azure Monitor [diagnostic settings](../iot-hub/iot-hub-monitor-resource-health.md), you can track errors that occur during evaluation of a routing query and endpoint health as perceived by IoT Hub. You can use the REST API [Get Endpoint Health](https://docs.microsoft.com/rest/api/iothub/iothubresource/getendpointhealth#iothubresource_getendpointhealth) to get [health status](iot-hub-devguide-endpoints.md#custom-endpoints) of the endpoints. 

Use the [troubleshooting guide for routing](troubleshoot-message-routing.md) for more details and support for troubleshooting routing.

## Next steps

* To learn how to create Message Routes, see [Process IoT Hub device-to-cloud messages using routes](tutorial-routing.md).

* [How to send device-to-cloud messages](quickstart-send-telemetry-node.md)

* For information about the SDKs you can use to send device-to-cloud messages, see [Azure IoT SDKs](iot-hub-devguide-sdks.md).
