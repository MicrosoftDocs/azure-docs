<properties
 pageTitle="Azure IoT Hub Developer guide endpoints | Microsoft Azure"
 description="Describes the available endpoints in Azure IoT Hub and how they should be used"
 services="azure-iot"
 documentationCenter=".net"
 authors="fsautomata"
 manager="timlt"
 editor=""/>

<tags
 ms.service="azure-iot"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="09/04/2015"
 ms.author="dobett"/>

# Azure IoT Hub developer guide - endpoints

Azure IoT Hub is a multi-tenant service, and exposes functionalities to a variety of actors. The picture below shows the various endpoints that are exposed by Azure IoT Hub.

![IoT Hub endpoints][img-endpoints]

Here is a description of the endpoints:

* **Resource provider**. The IoT Hub resource provider exposes an [Azure Resource Manager][lnk-arm] interface that allows Azure subscription owners to create, update properties, and delete IoT hubs. IoT Hub properties pertains hub-level security policies (as opposed to device-level access control, refer to [Access Control][lnk-accesscontrol], and functional options for cloud-to-device and device-to-cloud messaging. The resource provider also allows to [Import/Export device identities][lnk-importexport].
* **Device identity management**. IoT Hub exposes a set of HTTP REST endpoints to manage (i.e. create, retrieve, update, and delete) device identities. Device identities are used for device authentication and access control. Refer to [Device identity registry][lnk-identityregistry] for more information.
* **Device endpoints**. For each device provisioned in the device identity registry, each IoT hub exposes a set of endpoints that are used to communication to and from that device. These endpoints are currently exposed in both HTTP and [AMQP]:
    - *Send device-to-cloud messages*. This endpoint is used to send device-to-cloud messages. Refer to [Device to cloud messaging][lnk-d2c] for more information.
    - *Receive cloud-to-device messages*. This endpoint is used by the device to receive cloud-to-device messages targeted at it. Refer to [Cloud to device messaging][lnk-c2d] for more information.
* **Service endpoints**. Each IoT hub also exposes a set of endpoints used by your application back-end (*service*) to communicate with your devices. These endpoints are currently exposed only using the [AMQP][lnk-amqp] protocol.
    - *Receive device-to-cloud messages*. This endpoint is compatible with [Azure Event Hubs][lnk-event-hubs] and can be used to read all the device-to-cloud messages sent by your devices. Refer to [Device to cloud messaging][lnk-d2c] for more information.
    - *Send cloud-to-device messages and receive delivery acknowledgements*. These endpoints allow your application back-end to send cloud-to-device reliable messages, and receive the corresponding delivery or expiration acknowledgements. Refer to [Cloud to device messaging][lnk-c2d] for more information.

The [IoT Hub APIs and SDKs][lnk-apis-sdks] article describes the various ways that you can access these endpoints
.
Finally it is important to note that all IoT Hub endpoints are exposed over [TLS][lnk-tls], and no endpoint is ever exposed on unencrypted/unsecured channels.


[img-endpoints]: media/iot-hub-devguide-endpoints/endpoints.png

[lnk-accesscontrol]: iot-hub-devguide-security.md#accesscontrol
[lnk-importexport]: iot-hub-devguide-registry.md#importexport
[lnk-identityregistry]: iot-hub-devguide-registry.md
[lnk-d2c]: iot-hub-devguide-messaging.md#d2c
[lnk-c2d]: iot-hub-devguide-messaging.md#c2d
[lnk-amqp]: https://www.amqp.org/
[lnk-apis-sdks]: TBD
[lnk-arm]: https://azure.microsoft.com/en-us/documentation/articles/resource-group-overview/
[lnk-tls]: https://tools.ietf.org/html/rfc5246
[lnk-event-hubs]: http://azure.microsoft.com/en-us/services/event-hubs/
