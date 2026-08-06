---
title: Understand Azure IoT Hub endpoints
description: This article provides information about IoT Hub device-facing and service-facing endpoints.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 05/26/2026
ai-usage: ai-assisted
ms.custom: [amqp, mqtt, 'Role: Cloud Development', 'Role: System Architecture']
---

# IoT Hub endpoints

Azure IoT Hub exposes various endpoints to support the devices and services that interact with it.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## IoT Hub names

You can find the hostname of an IoT hub in the Azure portal, on your IoT hub's **Overview** pane. By default, the DNS name of an IoT hub looks like the following example:

`{your iot hub name}.azure-devices.net`

## TLS 1.3-enabled endpoints (preview)

Azure IoT Hub provides additional endpoints to support TLS 1.3 with enhanced security requirements. These endpoints are available alongside the existing endpoint to allow gradual and non-disruptive adoption.

There's no planned change to the existing IoT Hub endpoint (`<hub>.azure-devices.net`), commonly referred to as the *classic endpoint*. This endpoint remains fully supported, including for Private Link scenarios, and continues to be the default for existing workloads.

The new endpoints are additive, not a replacement, and enable customers to adopt stronger security configurations at their own pace.

### Endpoint types

| Endpoint type     | Hostname                              | Protocol support                |
|------------------|----------------------------------------|--------------------------------|
| Classic          | `<hub>.azure-devices.net`              | TLS 1.2 (existing behavior)    |
| Device endpoint (preview)  | `<hub>.device.azure-devices.net`       | TLS 1.2 (restricted) + TLS 1.3 |
| Service endpoint (preview) | `<hub>.service.azure-devices.net`      | TLS 1.2 (restricted) + TLS 1.3 |

### Key considerations

- Existing applications and devices that use the classic endpoint keep working without any changes.
- New endpoints support TLS 1.3 and enhanced security requirements.
- Both endpoint models coexist to support gradual migrations with no service disruption.

## IoT Hub endpoints for development and management

Azure IoT Hub is a multitenant service that exposes its functionality to various actors. The following diagram shows the various endpoints that IoT Hub exposes.

:::image type="content" source="./media/iot-hub-devguide-endpoints/endpoints.png" alt-text="Diagram showing the list of built-in IoT Hub endpoints." border="false":::

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

All IoT Hub endpoints use the [TLS](https://tools.ietf.org/html/rfc5246) protocol, and no endpoint is ever exposed on unencrypted or unsecured channels.


## Custom endpoints for message routing

You can link existing Azure services in your Azure subscriptions to your IoT hub to act as endpoints for message routing. These endpoints act as service endpoints and are used as sinks for message routes. Devices can't write directly to these endpoints. For more information about message routing, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](../iot-hub/iot-hub-devguide-messages-d2c.md).

IoT Hub supports the following Azure services as custom endpoints:

* Storage containers
* Event Hubs
* Service Bus queues
* Service Bus topics
* Cosmos DB
* Microsoft Fabric Eventstreams (preview)
   
For the limits on endpoints per hub, see [Quotas and throttling](iot-hub-devguide-quotas-throttling.md).

### Built-in endpoint

You can use standard [Event Hubs integration and SDKs](iot-hub-devguide-messages-read-builtin.md) to receive device-to-cloud messages from the built-in endpoint (**messages/events**). Once you create any route, data stops flowing to the built-in endpoint unless a route is created to that endpoint. Even if you don't create any routes, you must enable a fallback route to route messages to the built-in endpoint. The fallback is enabled by default if you create your hub by using the portal or the CLI.

The message payload isn't base64 encoded at the built-in endpoint.

### Azure Storage as a routing endpoint

IoT Hub can route messages to two storage services: [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md) and [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) (ADLS Gen2) accounts. Both of these services use blobs for their storage. To use Azure Data Lake Gen2, your storage account must have hierarchical namespaces enabled. For more information, see [Create a storage account to use with Azure Data Lake Storage](../storage/blobs/create-data-lake-storage-account.md).

IoT Hub supports writing data to Azure Storage in the [Apache Avro](https://avro.apache.org/) format and the JSON format. The default format is Avro. To use JSON encoding, set the `contentType` property to **application/json** and the `contentEncoding` property to **UTF-8** in the message [system properties](iot-hub-devguide-routing-query-syntax.md#system-properties). Both of these values are case-insensitive. 

If you don't set the necessary system properties, IoT Hub applies base64 encoding. To avoid base64 encoding, set both the `contentType` property to **application/json** and the `contentEncoding` property to **UTF-8** in the message system properties. If these properties aren't set, IoT Hub writes the messages in base64 encoded format.

You can set the encoding format only when you configure the blob storage endpoint. You can't edit the encoding format for an existing endpoint.

IoT Hub batches messages and writes data to storage whenever the batch reaches a certain size or a certain amount of time elapses. IoT Hub defaults to the following file naming convention: `{iothub}/{partition}/{YYYY}/{MM}/{DD}/{HH}/{mm}`.

You can use any file naming convention, but you must use all listed tokens. IoT Hub writes to an empty blob if there's no data to write.

To ensure that all blobs or files are read without making any assumptions about partition, list the blobs or files and then iterate over them. The partition range could potentially change during a Microsoft-initiated failover or IoT Hub manual failover. You can use the [List Blobs API](/rest/api/storageservices/list-blobs) to enumerate the list of blobs or [List ADLS Gen2 API](/rest/api/storageservices/datalakestoragegen2/path) for the list of files. For example:

```csharp
public void ListBlobsInContainer(string containerName, string iothub)
{
    var storageAccount = CloudStorageAccount(Microsoft.Azure.Storage.Auth.StorageCredentials storageCredentials, bool useHttps);
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

### Service Bus queues and Service Bus topics as a routing endpoint

Service Bus queues and topics that you use as IoT Hub endpoints must not have **Sessions** or **Duplicate Detection** enabled. If you enable either of those options, the endpoint appears as **Unreachable** in the Azure portal.

Base64 encoding never happens when routing to Service Bus queues or topics. Messages are written as-is to the endpoint.

### Event Hubs as a routing endpoint

Apart from the built-in Event Hubs compatible endpoint, you can also route data to custom endpoints of type Event Hubs.

Base64 encoding never happens when routing to custom Event Hubs endpoints. Messages are written as-is to the endpoint.

### Azure Cosmos DB as a routing endpoint

You can send data directly to Azure Cosmos DB from IoT Hub. IoT Hub supports writing to Cosmos DB in JSON (if specified in the message content-type) or as base64 encoded binary.

Base64 encoding is applied if the necessary system properties aren't set. To write as JSON, set the `contentType` property to **application/json** and the `contentEncoding` property to **UTF-8** in the message system properties. If these properties aren't set, data is base64 encoded when written to Cosmos DB.

To support high-scale scenarios, you can enable [synthetic partition keys](/azure/cosmos-db/synthetic-partition-keys) for the Cosmos DB endpoint. As Cosmos DB is a hyperscale data store, all data/documents written to it must contain a field that represents a logical partition. Each logical partition has a maximum size of 20 GB. You can specify the partition key property name in **Partition key name**. The partition key property name is defined at the container level and can't be updated.  

You can configure the synthetic partition key value by specifying a template in **Partition key template** based on your estimated data volume. For example, in manufacturing scenarios, your logical partition might be expected to approach its maximum limit of 20 GB within a month. In that case, you can define a synthetic partition key as a combination of the device ID and the month. The generated partition key value is automatically added to the partition key property for each new Cosmos DB record, ensuring logical partitions are created each month for each device.

> [!CAUTION]
> If you're using the system assigned managed identity for authenticating to Cosmos DB, you must use Azure CLI or Azure PowerShell to assign the Cosmos DB Built-in Data Contributor built-in role definition to the identity. Role assignment for Cosmos DB isn't currently supported from the Azure portal. For more information about the various roles, see [Configure role-based access for Azure Cosmos DB](/azure/cosmos-db/how-to-setup-rbac). To understand assigning roles via CLI, see [Manage Azure Cosmos DB SQL role resources.](/cli/azure/cosmosdb/sql/role)

### Microsoft Fabric Eventstreams as a routing endpoint (preview)

You can route device-to-cloud messages to a [Microsoft Fabric eventstream](/fabric/real-time-intelligence/event-streams/overview) by adding a Fabric Eventstream custom endpoint to your IoT hub. This integration brings IoT Hub telemetry directly into Fabric Real-Time Intelligence for downstream processing and analytics.

> [!NOTE]
> Routing to Microsoft Fabric Eventstreams is in public preview. This capability applies to both IoT Hub and IoT Hub Gen 2 instances.

To route messages to a Fabric eventstream, create a route in IoT Hub, add a Fabric Eventstream endpoint, and connect it to a Fabric eventstream that uses a custom endpoint (custom app) source.

In your Microsoft Fabric workspace, select the custom endpoint source tile you want to connect to on your published Eventstream. If a custom endpoint source tile doesn't exist on your Eventstream, [create a new custom endpoint source tile](/fabric/real-time-intelligence/event-streams/add-source-custom-app?pivots=basic-features). Once the source tile is selected, navigate to the **Details** pane. Select **Event Hub** as the **Protocol**. Select **Entra ID Authentication** and access the connection details. To ensure Entra ID Authentication is set up correctly for your Fabric workspace, see [Connect to Eventstream using Microsoft Entra ID authentication](/fabric/real-time-intelligence/event-streams/custom-endpoint-entra-id-auth).

#### Authentication

The Fabric Eventstream endpoint supports Microsoft Entra ID authentication only. Shared access signature (SAS) key authentication isn't supported. You can use either a system-assigned or a user-assigned managed identity for the IoT hub. For more information, see [Egress connectivity from IoT Hub to other Azure resources](./iot-hub-managed-identity.md#egress-connectivity-from-iot-hub-to-other-azure-resources).

#### Message schema

Messages routed to a Fabric Eventstream endpoint conform to the [CloudEvents](https://cloudevents.io/) schema, which differs from the schema used by other routing endpoints such as Event Hubs. Device identity and event metadata are preserved in the CloudEvents envelope. For IoT hubs that use Azure Device Registry (ADR), the event payload includes ADR identifiers. For a comparison with the default routed-message schema, see [message schema at routing endpoints](iot-hub-devguide-messages-construct.md#message-schema-at-routing-endpoints).

<!-- TODO (WI 599257): Add the full CloudEvents schema, field mappings, and configuration guidance. Pending cleaned-up schema and field-mapping details from the feature team, plus confirmation of any additional Fabric-side configuration. -->

#### Enrichment property restrictions

[Message enrichment](iot-hub-message-enrichments-overview.md) property names for Fabric Eventstream endpoints have the following restrictions:

- Names must start with a lowercase letter.
- Names can contain only lowercase letters and digits.
- Hyphens, underscores, periods, and camelCase aren't allowed.
- Names can be at most 20 characters long.

#### Tooling

You can create and configure a Fabric Eventstream endpoint by using the Azure CLI and Bicep.

<!-- TODO (WI 599257): Add Azure CLI and Bicep examples, and portal screenshots (requires test-environment access). -->

## Endpoint Health

[!INCLUDE [iot-hub-endpoint-health](../../includes/iot-hub-include-endpoint-health.md)]

## Next steps

Learn more about these topics:

* [IoT Hub query language for device and module twins, jobs, and message routing](iot-hub-devguide-query-language.md)
* [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md)
* [Communicate with your IoT hub using the MQTT protocol](iot-mqtt-connect-to-iot-hub.md)
* [IoT Hub IP addresses](iot-hub-understand-ip-address.md)
