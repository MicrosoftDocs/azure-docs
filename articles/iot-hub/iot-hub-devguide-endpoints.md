---
title: Understand Azure IoT Hub endpoints | Microsoft Docs
description: Developer guide - reference information about IoT Hub device-facing and service-facing endpoints.
services: iot-hub
documentationcenter: .net
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 57ba52ae-19c6-43e4-bc6c-d8a5c2476e95
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/16/2017
ms.author: dobett

---
# Reference - IoT Hub endpoints
## List of built-in IoT Hub endpoints
Azure IoT Hub is a multi-tenant service that exposes its functionality to various actors. The following diagram shows the various endpoints that IoT Hub exposes.

![IoT Hub endpoints][img-endpoints]

The following list describes the endpoints:

* **Resource provider**. The IoT Hub resource provider exposes an [Azure Resource Manager][lnk-arm] interface that enables Azure subscription owners to create and delete IoT hubs, and update IoT hub properties. IoT Hub properties govern [hub-level security policies][lnk-accesscontrol], as opposed to device-level access control, and functional options for cloud-to-device and device-to-cloud messaging. The IoT Hub resource provider also enables you to [export device identities][lnk-importexport].
* **Device identity management**. Each IoT hub exposes a set of HTTP REST endpoints to manage device identities (create, retrieve, update, and delete). [Device identities][lnk-device-identities] are used for device authentication and access control.
* **Device twin management**. Each IoT hub exposes a set of service-facing HTTP REST endpoint to query and update [device twins][lnk-twins] (update tags and properties).
* **Jobs management**. Each IoT hub exposes a set of service-facing HTTP REST endpoint to query and manage [jobs][lnk-jobs].
* **Device endpoints**. For each device provisioned in the identity registry, IoT Hub exposes a set of endpoints that a device can use to send and receive messages:
  
  * *Send device-to-cloud messages*. Use this endpoint to [send device-to-cloud messages][lnk-d2c].
  * *Receive cloud-to-device messages*. A device uses this endpoint to receive targeted [cloud-to-device messages][lnk-c2d].
  * *Initiate file uploads*. A device uses this endpoint to receive an Azure Storage SAS URI from IoT Hub to [upload a file][lnk-upload].
  * *Retrieve and update device twin properties*. A device uses this endpoint to access its [device twin][lnk-twins]'s properties.
  * *Receive direct method requests*. A device uses this endpoint to listen for [direct method][lnk-methods]'s requests.
    
    These endpoints are exposed using [MQTT v3.1.1][lnk-mqtt], HTTP 1.1, and [AMQP 1.0][lnk-amqp] protocols. AMQP is also available over [WebSockets][lnk-websockets] on port 443.
    
    The device twins and methods endpoints are available only using [MQTT v3.1.1][lnk-mqtt].
* **Service endpoints**. Each IoT hub exposes a set of endpoints your solution back end can use to communicate with your devices. These endpoints are currently only exposed using the [AMQP][lnk-amqp] protocol, except for the method invocation endpoint that is exposed via HTTP 1.1.
  
  * *Receive device-to-cloud messages*. This endpoint is compatible with [Azure Event Hubs][lnk-event-hubs]. A back-end service can use it to read the [device-to-cloud messages][lnk-d2c] sent by your devices. You can create custom endpoints on your IoT hub in addition to this built-in endpoint.
  * *Send cloud-to-device messages and receive delivery acknowledgments*. These endpoints enable your solution back end to send reliable [cloud-to-device messages][lnk-c2d], and to receive the corresponding delivery or expiration acknowledgments.
  * *Receive file notifications*. This messaging endpoint allows you to receive notifications of when your devices successfully upload a file. 
  * *Direct method invocation*. This endpoint allows a back-end service to invoke a [direct method][lnk-methods] on a device.
  * *Receive operations monitoring events*. This endpoint allows you to receive operations monitoring events if your IoT hub has been configured to emit them. For more information, see [IoT Hub operations monitoring][lnk-operations-mon].

The [Azure IoT SDKs][lnk-sdks] article describes the various ways to access these endpoints.

Finally, it is important to note that all IoT Hub endpoints use the [TLS][lnk-tls] protocol, and no endpoint is ever exposed on unencrypted/unsecured channels.

## Custom endpoints
You can link existing Azure services in your subscription to your IoT hub to act as endpoints for message routing. These endpoints act as service endpoints and are used as sinks for message routes. Devices cannot write directly to the additional endpoints. To learn more about message routes, see the developer guide entry on [sending and receiving messages with IoT hub][lnk-devguide-messaging].

IoT Hub currently supports the following Azure services as additional endpoints:

* Event Hubs
* Service Bus Queues
* Service Bus Topics

IoT Hub needs write access to these service endpoints for message routing to work. If you configure your endpoints through the Azure portal, the necessary permissions are added for you. Make sure you configure your services to support the expected throughput. You may need to monitor your additional endpoints when you first configure your IoT solution and then make any necessary adjustments for the actual load.

If a message matches multiple routes that all point to the same endpoint, IoT Hub delivers message to that endpoint only once. Therefore, you do not need to configure deduplication on your Service Bus queue or topic. In partitioned queues, partition affinity guarantees message ordering.

> [!NOTE]
> Service Bus queues and topics used as IoT Hub endpoints must not have **Sessions** or **Duplicate Detection** enabled. If either of those options are enabled, the endpoint appears as **Unreachable** in the Azure portal.

For the limits on the number of endpoints you can add, see [Quotas and throttling][lnk-devguide-quotas].

## Field gateways
In an IoT solution, a *field gateway* sits between your devices and your IoT Hub endpoints. It is typically located close to your devices. Your devices communicate directly with the field gateway by using a protocol supported by the devices. The field gateway connects to an IoT Hub endpoint using a protocol that is supported by IoT Hub. A field gateway can be highly specialized hardware or a low-power computer running software that accomplishes the end-to-end scenario for which the gateway is intended.

You can use [Azure IoT Edge][lnk-iot-edge] to implement a field gateway. IoT Edge offers specific functionality such as the ability to multiplex communications from multiple devices onto the same IoT Hub connection.

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
