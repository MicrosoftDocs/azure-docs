---
title: Understand Azure IoT Hub endpoints
description: This article provides information about IoT Hub device-facing and service-facing endpoints.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 02/23/2024
ms.custom: [amqp, mqtt, 'Role: Cloud Development', 'Role: System Architecture']
---

# IoT Hub endpoints

Azure IoT Hub exposes various endpoints to support the devices and services that interact with it.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## IoT Hub names

You can find the hostname of an IoT hub in the Azure portal, on your IoT hub's **Overview** working pane. By default, the DNS name of an IoT hub looks like the following example:

`{your iot hub name}.azure-devices.net`

## IoT Hub endpoints for development and management

Azure IoT Hub is a multitenant service that exposes its functionality to various actors. The following diagram shows the various endpoints that IoT Hub exposes.

:::image type="content" source="./media/iot-hub-devguide-endpoints/endpoints.png" alt-text="Diagram showing the list of build-in IoT Hub endpoints." border="false":::

The following list describes the endpoints:

* **Resource provider**: an [Azure Resource Manager](../azure-resource-manager/management/overview.md) interface. This interface enables Azure subscription owners to create and delete IoT hubs, and to update IoT hub properties. IoT Hub properties govern [hub-level shared access policies](./authenticate-authorize-sas.md#access-control-and-permissions), as opposed to device-level access control, and functional options for cloud-to-device and device-to-cloud messaging. The IoT Hub resource provider also enables you to [export device identities](./iot-hub-devguide-identity-registry.md#import-and-export-device-identities).

* **Device identity management**: a set of HTTPS REST endpoints to manage device identities (create, retrieve, update, and delete). [Device identities](iot-hub-devguide-identity-registry.md) are used for device authentication and access control.

* **Device twin management**: a set of service-facing HTTPS REST endpoint to query and update [device twins](iot-hub-devguide-device-twins.md) (update tags and properties). 

* **Jobs management**: a set of service-facing HTTPS REST endpoint to query and manage [jobs](iot-hub-devguide-jobs.md).

* **Device endpoints**: a set of endpoints for each device in the identity registry. Except where noted, these endpoints are exposed using [MQTT v3.1.1](https://mqtt.org/), HTTPS 1.1, and [AMQP 1.0](https://www.amqp.org/) protocols. AMQP and MQTT are also available over [WebSockets](https://tools.ietf.org/html/rfc6455) on port 443. These device endpoints include:

  * Send device-to-cloud messages

  * Receive cloud-to-device messages

  * Initiate file uploads

  * Retrieve and update device twin properties (HTTPS isn't supported)

  * Receive direct method requests (HTTPS isn't supported)

* **Service endpoints**: a set of endpoints for your solution back end to communicate with your devices. With one exception, these endpoints are only exposed using the [AMQP](https://www.amqp.org/) and AMQP over WebSockets protocols. The direct method invocation endpoint is exposed over the HTTPS protocol.
  
  * Receive device-to-cloud messages: This endpoint is the built-in endpoint discussed in message routing concepts. A back-end service can use it to read the device-to-cloud messages sent by your devices. You can create custom endpoints on your IoT hub in addition to this built-in endpoint.
  
  * Send cloud-to-device messages and receive delivery acknowledgments

  * Receive file upload notifications
  
  * Invoke direct method

The [Azure IoT Hub SDKs](iot-hub-devguide-sdks.md) article describes the various ways to access these endpoints.

All IoT Hub endpoints use the [TLS](https://tools.ietf.org/html/rfc5246) protocol, and no endpoint is ever exposed on unencrypted/unsecured channels.

[!INCLUDE [iot-hub-include-x509-ca-signed-support-note](../../includes/iot-hub-include-x509-ca-signed-support-note.md)]

## Custom endpoints for message routing

You can link existing Azure services in your Azure subscriptions to your IoT hub to act as endpoints for message routing. These endpoints act as service endpoints and are used as sinks for message routes. Devices can't write directly to these endpoints. For more information about message routing, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md).

IoT Hub currently supports the following Azure services as custom endpoints:

* Storage containers
* Event Hubs
* Service Bus Queues
* Service Bus Topics
* Cosmos DB
   
For the limits on endpoints per hub, see [Quotas and throttling](iot-hub-devguide-quotas-throttling.md).

### Built-in endpoint

You can use standard [Event Hubs integration and SDKs](iot-hub-devguide-messages-read-builtin.md) to receive device-to-cloud messages from the built-in endpoint (**messages/events**). Once any route is created, data stops flowing to the built-in endpoint unless a route is created to that endpoint. Even if no routes are created, a fallback route must be enabled to route messages to the built-in endpoint. The fallback is enabled by default if you create your hub using the portal or the CLI.

### Azure Storage as a routing endpoint

There are two storage services IoT Hub can route messages to: [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md) and [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) (ADLS Gen2) accounts. Both of these use blobs for their storage.

IoT Hub supports writing data to Azure Storage in the [Apache Avro](https://avro.apache.org/) format and the JSON format. The default is AVRO. To use JSON encoding set the contentType property to **application/json** and contentEncoding property to **UTF-8** in the message [system properties](iot-hub-devguide-routing-query-syntax.md#system-properties). Both of these values are case-insensitive. If the content encoding isn't set, then IoT Hub writes the messages in base 64 encoded format.

The encoding format can be set only when the blob storage endpoint is configured; it can't be edited for an existing endpoint.

IoT Hub batches messages and writes data to storage whenever the batch reaches a certain size or a certain amount of time has elapsed. IoT Hub defaults to the following file naming convention: `{iothub}/{partition}/{YYYY}/{MM}/{DD}/{HH}/{mm}`.

You may use any file naming convention, but you must use all listed tokens. IoT Hub writes to an empty blob if there's no data to write.

We recommend listing the blobs or files and then iterating over them, to ensure that all blobs or files are read without making any assumptions of partition. The partition range could potentially change during a Microsoft-initiated failover or IoT Hub manual failover. You can use the [List Blobs API](/rest/api/storageservices/list-blobs) to enumerate the list of blobs or [List ADLS Gen2 API](/rest/api/storageservices/datalakestoragegen2/path) for the list of files. For example:

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

### Azure Cosmos DB as a routing endpoint

You can send data directly to Azure Cosmos DB from IoT Hub. IoT Hub supports writing to Cosmos DB in JSON (if specified in the message content-type) or as base 64 encoded binary.

To support high-scale scenarios, you can enable [synthetic partition keys](../cosmos-db/nosql/synthetic-partition-keys.md) for the Cosmos DB endpoint. As Cosmos DB is a hyperscale data store, all data/documents written to it must contain a field that represents a logical partition. Each logical partition has a maximum size of 20 GB. You can specify the partition key property name in **Partition key name**. The partition key property name is defined at the container level and can't be changed once it has been set.  

You can configure the synthetic partition key value by specifying a template in **Partition key template** based on your estimated data volume. For example, in manufacturing scenarios, your logical partition might be expected to approach its maximum limit of 20 GB within a month. In that case, you can define a synthetic partition key as a combination of the device ID and the month. The generated partition key value is automatically added to the partition key property for each new Cosmos DB record, ensuring logical partitions are created each month for each device.

> [!CAUTION]
> If you're using the system assigned managed identity for authenticating to Cosmos DB, you must use Azure CLI or Azure PowerShell to assign the Cosmos DB Built-in Data Contributor built-in role definition to the identity. Role assignment for Cosmos DB isn't currently supported from the Azure portal. For more information about the various roles, see [Configure role-based access for Azure Cosmos DB](../cosmos-db/how-to-setup-rbac.md). To understand assigning roles via CLI, see [Manage Azure Cosmos DB SQL role resources.](/cli/azure/cosmosdb/sql/role)

## Endpoint Health

[!INCLUDE [iot-hub-endpoint-health](../../includes/iot-hub-include-endpoint-health.md)]

## Next steps

Learn more about these topics:

* [IoT Hub query language for device and module twins, jobs, and message routing](iot-hub-devguide-query-language.md)
* [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md)
* [Communicate with your IoT hub using the MQTT protocol](../iot/iot-mqtt-connect-to-iot-hub.md)
* [IoT Hub IP addresses](iot-hub-understand-ip-address.md)
