---
title: Understand Azure IoT Hub endpoints | Microsoft Docs
description: Developer guide - reference information about IoT Hub device-facing and service-facing endpoints.
author: dominicbetts
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/18/2018
ms.author: dobett
---

# Reference - IoT Hub endpoints

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## IoT Hub names

You can find the hostname of the IoT hub that hosts your endpoints in the portal on your hub's  **Overview** page. By default, the DNS name of an IoT hub looks like: `{your iot hub name}.azure-devices.net`.

You can use Azure DNS to create a custom DNS name for your IoT hub. For more information, see [Use Azure DNS to provide custom domain settings for an Azure service](../dns/dns-custom-domain.md).

## List of built-in IoT Hub endpoints

Azure IoT Hub is a multi-tenant service that exposes its functionality to various actors. The following diagram shows the various endpoints that IoT Hub exposes.

![IoT Hub endpoints][img-endpoints]

The following list describes the endpoints:

* **Resource provider**. The IoT Hub resource provider exposes an [Azure Resource Manager][lnk-arm] interface. This interface enables Azure subscription owners to create and delete IoT hubs, and to update IoT hub properties. IoT Hub properties govern [hub-level security policies][lnk-accesscontrol], as opposed to device-level access control, and functional options for cloud-to-device and device-to-cloud messaging. The IoT Hub resource provider also enables you to [export device identities][lnk-importexport].
* **Device identity management**. Each IoT hub exposes a set of HTTPS REST endpoints to manage device identities (create, retrieve, update, and delete). [Device identities][lnk-device-identities] are used for device authentication and access control.
* **Device twin management**. Each IoT hub exposes a set of service-facing HTTPS REST endpoint to query and update [device twins][lnk-twins] (update tags and properties).
* **Jobs management**. Each IoT hub exposes a set of service-facing HTTPS REST endpoint to query and manage [jobs][lnk-jobs].
* **Device endpoints**. For each device in the identity registry, IoT Hub exposes a set of endpoints:

  * *Send device-to-cloud messages*. A device uses this endpoint to [send device-to-cloud messages][lnk-d2c].
  * *Receive cloud-to-device messages*. A device uses this endpoint to receive targeted [cloud-to-device messages][lnk-c2d].
  * *Initiate file uploads*. A device uses this endpoint to receive an Azure Storage SAS URI from IoT Hub to [upload a file][lnk-upload].
  * *Retrieve and update device twin properties*. A device uses this endpoint to access its [device twin][lnk-twins]'s properties.
  * *Receive direct method requests*. A device uses this endpoint to listen for [direct method][lnk-methods]'s requests.

    These endpoints are exposed using [MQTT v3.1.1][lnk-mqtt], HTTPS 1.1, and [AMQP 1.0][lnk-amqp] protocols. AMQP is also available over [WebSockets][lnk-websockets] on port 443.

* **Service endpoints**. Each IoT hub exposes a set of endpoints  for your solution back end to communicate with your devices. With one exception, these endpoints are only exposed using the [AMQP][lnk-amqp] protocol. The method invocation endpoint is exposed over the HTTPS protocol.
  
  * *Receive device-to-cloud messages*. This endpoint is compatible with [Azure Event Hubs][lnk-event-hubs]. A back-end service can use it to read the [device-to-cloud messages][lnk-d2c] sent by your devices. You can create custom endpoints on your IoT hub in addition to this built-in endpoint.
  * *Send cloud-to-device messages and receive delivery acknowledgments*. These endpoints enable your solution back end to send reliable [cloud-to-device messages][lnk-c2d], and to receive the corresponding delivery or expiration acknowledgments.
  * *Receive file notifications*. This messaging endpoint allows you to receive notifications of when your devices successfully upload a file. 
  * *Direct method invocation*. This endpoint allows a back-end service to invoke a [direct method][lnk-methods] on a device.
  * *Receive operations monitoring events*. This endpoint allows you to receive operations monitoring events if your IoT hub has been configured to emit them. For more information, see [IoT Hub operations monitoring][lnk-operations-mon].

The [Azure IoT SDKs][lnk-sdks] article describes the various ways to access these endpoints.

All IoT Hub endpoints use the [TLS][lnk-tls] protocol, and no endpoint is ever exposed on unencrypted/unsecured channels.

## Custom endpoints

You can link existing Azure services in your subscription to your IoT hub to act as endpoints for message routing. These endpoints act as service endpoints and are used as sinks for message routes. Devices cannot write directly to the additional endpoints. To learn more about message routes, see the developer guide entry on [sending and receiving messages with IoT hub][lnk-devguide-messaging].

IoT Hub currently supports the following Azure services as additional endpoints:

* Azure Storage containers
* Event Hubs
* Service Bus Queues
* Service Bus Topics

IoT Hub needs write access to these service endpoints for message routing to work. If you configure your endpoints through the Azure portal, the necessary permissions are added for you. Make sure you configure your services to support the expected throughput. When you first configure your IoT solution, you may need to monitor your additional endpoints and make any necessary adjustments for the actual load.

If a message matches multiple routes that all point to the same endpoint, IoT Hub delivers message to that endpoint only once. Therefore, you do not need to configure deduplication on your Service Bus queue or topic. In partitioned queues, partition affinity guarantees message ordering.

For the limits on the number of endpoints you can add, see [Quotas and throttling][lnk-devguide-quotas].

### When using Azure Storage containers

IoT Hub only supports writing data to Azure Storage containers as blobs in the [Apache Avro](http://avro.apache.org/) format. IoT Hub batches messages and writes data to a blob whenever:

* The batch reaches a certain size.
* Or a certain amount of time has elapsed.

IoT Hub will write to an empty blob if there is no data to write.

IoT Hub defaults to the following file naming convention:

```
{iothub}/{partition}/{YYYY}/{MM}/{DD}/{HH}/{mm}
```

You may use whatever file naming convention you wish, however you must use all listed tokens.

### When using Service Bus queues and topics

Service Bus queues and topics used as IoT Hub endpoints must not have **Sessions** or **Duplicate Detection** enabled. If either of those options are enabled, the endpoint appears as **Unreachable** in the Azure portal.

## Field gateways

In an IoT solution, a *field gateway* sits between your devices and your IoT Hub endpoints. It is typically located close to your devices. Your devices communicate directly with the field gateway by using a protocol supported by the devices. The field gateway connects to an IoT Hub endpoint using a protocol that is supported by IoT Hub. A field gateway might be a dedicated hardware device or a low-power computer running custom gateway software.

You can use [Azure IoT Edge][lnk-iot-edge] to implement a field gateway. IoT Edge offers functionality such as multiplexing communications from multiple devices onto the same IoT Hub connection.

## Next steps

Other reference topics in this IoT Hub developer guide include:

* [IoT Hub query language for device twins, jobs, and message routing][lnk-devguide-query]
* [Quotas and throttling][lnk-devguide-quotas]
* [IoT Hub MQTT support][lnk-devguide-mqtt]

[lnk-iot-edge]: https://github.com/Azure/iot-edge

[img-endpoints]: ./media/iot-hub-devguide-endpoints/endpoints.png
[lnk-amqp]: https://www.amqp.org/
[lnk-mqtt]: http://mqtt.org/
[lnk-websockets]: https://tools.ietf.org/html/rfc6455
[lnk-arm]: ../azure-resource-manager/resource-group-overview.md
[lnk-event-hubs]: http://azure.microsoft.com/documentation/services/event-hubs/

[lnk-tls]: https://tools.ietf.org/html/rfc5246


[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-accesscontrol]: iot-hub-devguide-security.md#access-control-and-permissions
[lnk-importexport]: iot-hub-devguide-identity-registry.md#import-and-export-device-identities
[lnk-d2c]: iot-hub-devguide-messages-d2c.md
[lnk-device-identities]: iot-hub-devguide-identity-registry.md
[lnk-upload]: iot-hub-devguide-file-upload.md
[lnk-c2d]: iot-hub-devguide-messages-c2d.md
[lnk-methods]: iot-hub-devguide-direct-methods.md
[lnk-twins]: iot-hub-devguide-device-twins.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-jobs]: iot-hub-devguide-jobs.md

[lnk-devguide-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-devguide-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md
[lnk-devguide-messaging]: iot-hub-devguide-messaging.md
[lnk-operations-mon]: iot-hub-operations-monitoring.md
