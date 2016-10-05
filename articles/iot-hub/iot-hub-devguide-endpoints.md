<properties
 pageTitle="Developer guide - IoT Hub endpoints | Microsoft Azure"
 description="Azure IoT Hub developer guide - reference information about IoT Hub endpoints"
 services="iot-hub"
 documentationCenter=".net"
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="multiple"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/30/2016" 
 ms.author="dobett"/>

# Reference - IoT Hub endpoints

## List of IoT Hub endpoints

Azure IoT Hub is a multi-tenant service that exposes its functionality to various actors. The following diagram shows the various endpoints that IoT Hub exposes.

![IoT Hub endpoints][img-endpoints]

The following is a description of the endpoints:

* **Resource provider**. The IoT Hub resource provider exposes an [Azure Resource Manager][lnk-arm] interface that enables Azure subscription owners to create and delete IoT hubs, and update IoT hub properties. IoT Hub properties govern [hub-level security policies][lnk-accesscontrol], as opposed to device-level access control, and functional options for cloud-to-device and device-to-cloud messaging. The resource provider also enables you to [export device identities][lnk-importexport].
* **Device identity management**. Each IoT hub exposes a set of HTTP REST endpoints to manage device identities (create, retrieve, update, and delete). [Device identities][lnk-device-identities] are used for device authentication and access control.
* **Device twin management**. Each IoT hub exposes a set of service-facing HTTP REST endpoint to query and update [device twins][lnk-twins] (update tags and properties).
* **Jobs management**. Each IoT hub exposes a set of service-facing HTTP REST endpoint to query and manage [jobs][lnk-jobs].
* **Device endpoints**. For each device provisioned in the device identity registry, IoT Hub exposes a set of endpoints that a device can use to send and receive messages:
    - *Send device-to-cloud messages*. Use this endpoint to [send device-to-cloud messages][lnk-d2c].
    - *Receive cloud-to-device messages*. A device uses this endpoint to receive targeted [cloud-to-device messages][lnk-c2d].
    - *Initiate file uploads*. A device uses this endpoint to receive an Azure Storage SAS URI from IoT Hub to [upload a file][lnk-upload].
    - *Retrieve and update twin's properties*. A device uses this endpoints to access its [device twin][lnk-twins]'s properties.
    - *Receive direct methods requests*. A device uses this endpoints to listen to [direct methods][lnk-methods]'s requests.

    These endpoints are exposed using [MQTT v3.1.1][lnk-mqtt], HTTP 1.1, and [AMQP 1.0][lnk-amqp] protocols. Note that AMQP is also available over [WebSockets][lnk-websockets] on port 443.
    
    The twins' and methods' endpoins are available only using [MQTT v3.1.1][lnk-mqtt].

* **Service endpoints**. Each IoT hub exposes a set of endpoints your application back end can use to communicate with your devices. These endpoints are currently only exposed using the [AMQP][lnk-amqp] protocol, except for the method invocation endpoint that is exposed via HTTP 1.1.
    - *Receive device-to-cloud messages*. This endpoint is compatible with [Azure Event Hubs][lnk-event-hubs]. A back-end service can use it to read all the [device-to-cloud messages][lnk-d2c] sent by your devices.
    - *Send cloud-to-device messages and receive delivery acknowledgments*. These endpoints enable your application back end to send reliable [cloud-to-device messages][lnk-c2d], and to receive the corresponding delivery or expiration acknowledgments.
    - *Receive file notifications*. This messaging endpoint allows you to receive notifications of when your devices successfully upload a file. 
    - *Direct method invocation*. This endpoint allows a back-end service to invoke a [direct method][lnk-methods] on a device.

The [IoT Hub APIs and SDKs][lnk-sdks] article describes the various ways to access these endpoints.

Finally, it is important to note that all IoT Hub endpoints use the [TLS][lnk-tls] protocol, and no endpoint is ever exposed on unencrypted/unsecured channels.

## Field gateways

In an IoT solution, a *field gateway* sits between your devices and your IoT Hub endpoints. It is typically located close to your devices. Your devices communicate directly with the field gateway by using a protocol supported by the devices. The field gateway connects to an IoT Hub endpoint using a protocol that is supported by IoT Hub. A field gateway can be highly specialized hardware or a low power computer running software that accomplishes the end-to-end scenario for which the gateway is intended.

You can use the [Azure IoT Gateway SDK][lnk-gateway-sdk] to implement a field gateway. This SDK offers specific functionality such as the ability to multiplex the communication from multiple devices onto the same connection to IoT Hub.

## Next steps

Other reference topics in this IoT Hub developer guide include:

- [Query language for twins, methods, and jobs][lnk-devguide-query]
- [Quotas and throttling][lnk-devguide-quotas]
- [IoT Hub MQTT support][lnk-devguide-mqtt]

[lnk-gateway-sdk]: https://github.com/Azure/azure-iot-gateway-sdk

[img-endpoints]: ./media/iot-hub-devguide-endpoints/endpoints.png
[lnk-amqp]: https://www.amqp.org/
[lnk-mqtt]: http://mqtt.org/
[lnk-websockets]: https://tools.ietf.org/html/rfc6455
[lnk-arm]: ../resource-group-overview.md
[lnk-event-hubs]: http://azure.microsoft.com/documentation/services/event-hubs/

[lnk-tls]: https://tools.ietf.org/html/rfc5246


[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-accesscontrol]: iot-hub-devguide-security.md#access-control-and-permissions
[lnk-importexport]: iot-hub-devguide-identity-registry.md#import-and-export-device-identities
[lnk-d2c]: iot-hub-devguide-messaging.md#device-to-cloud-messages
[lnk-device-identities]: iot-hub-devguide-identity-registry.md
[lnk-upload]: iot-hub-devguide-file-upload.md
[lnk-c2d]: iot-hub-devguide-messaging.md#cloud-to-device-messages
[lnk-methods]: iot-hub-devguide-direct-methods.md
[lnk-twins]: iot-hub-devguide-device-twins.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-jobs]: iot-hub-devguide-jobs.md

[lnk-devguide-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-devguide-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md