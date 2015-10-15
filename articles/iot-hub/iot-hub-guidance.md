<properties
 pageTitle="Guidance topics for using Azure IoT Hub | Microsoft Azure"
 description="A collection of guidance topics for developing solutions using Azure IoT Hub."
 services="iot-hub"
 documentationCenter=""
 authors="fsautomata"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/29/2015"
 ms.author="elioda"/>

# Azure IoT Hub guidance

## Device provisioning

IoT solutions maintain device information in many different systems and stores. The [IoT Hub's identity registry][IoT Hub Developer Guide - identity registry] is one of them, among other stores that maintain application-specific device information. We call *provisioning* the process of creating the required device information in all of these systems.

There are many requirements and strategies for device provisioning (see [IoT Hub device management guidance] for more information). The [IoT Hub identity registry][IoT Hub Developer Guide - identity registry] provides the APIs you need for integrating IoT Hub in your provisioning process.

## Field gateways

A field gateway is a specialized device-appliance or general-purpose software that acts as a communication enabler and potentially, as a local device control system and device data processing hub. A field gateway, can perform local processing and control functions towards the devices; on the other side it can filter or aggregate the device telemetry and thus reduce the amount of data being transferred to the back end.

The scope of a field gateway includes the field gateway itself and all devices that are attached to it. As the name implies, field gateways act outside dedicated data processing facilities and are usually location bound.
A field gateway is different from a mere traffic router in that it has an active role in managing access and information flow. This means it is an application-addressed entity and network connection or session terminal (for example, gateways in this context may assist in device provisioning, data transformation, protocol translation and event rules processing). NAT devices or firewalls, in contrast, do not qualify as field gateways since they are not explicit connection or session terminals, but rather route (or deny) connections or sessions made through them.

### Transparent vs opaque field gateways

With respect to device identities, field gateways are called *transparent* if other devices in its scope have device identity entries in the IoT hub's identity registry. They are called *opaque* if the only identity in the IoT hub's identity registry is the identity of the field gateway.

It is important to note that using *opaque* gateways prevents IoT Hub from providing [device identity anti-spoofing][IoT Hub Developer Guide - Anti-spoofing]. Moreover, since all the devices in the field gateway scope are represented as a single device in the IoT hub, they are subject to throttles and quotas as a single device.

### Other considerations

When implementing a field gateway, you can use the [Azure IoT device SDKs][]. Some SDKs provide field gateway-specific functionality such as the ability to multiplex multiple devices communication on the same connection to IoT Hub. As explained in [IoT Hub Developer Guide - Choosing your communication protocol][], you should avoid using HTTP/1 as a transport protocol for field gateways.

## Using custom device authentication schemes/services

IoT Hub enables you to configure per-device security credentials and access control through the use of the [device identity registry][IoT Hub Developer Guide - identity registry].

If an IoT solution already has a significant investment in a custom device identity registry and/or authentication scheme, it can still use other IoT Hub features by creating a *token service* for IoT Hub.

The token service is a self-deployed cloud service, which uses an IoT Hub *Shared Access Policy* with **DeviceConnect** permissions to create *device-scoped* tokens.

  ![][img-tokenservice]

These are the main steps of the token service pattern.

1. Create an [IoT Hub Shared Access Policy][IoT Hub Developer Guide - Security] with **DeviceConnect** permissions for your IoT hub. This policy will be used by the token service to sign the tokens.
2. When a device wants to access the IoT hub, it requests your token service a signed token. The device can use your custom device identity registry/authentication scheme.
3. The token service returns a token, created as per [IoT Hub Developer Guide - Security][], using `/devices/{deviceId}` as `resourceURI`, with `deviceId` as the device being authenticated.
4. The device uses the token directly with the IoT hub.

The token service can set the token expiration as desired. At expiration, the IoT hub servers the connection, and the device must request a new token to the token service. Clearly a short expiration time will increase the load on both the device and the token service.

It is worth specifying that for the device to be able to connect, the device identity still must be created in the IoT hub. This also means that per-device access control (by disabling device identities as per [IoT Hub Developer Guide - identity registry][]) is still functional, even if the device authenticates with a token. This mitigates the existence of long-lasting tokens.

### Comparison with a custom gateway

The token service pattern is the recommended way to implement a custom identity registry/authentication scheme with IoT Hub, as it lets IoT Hub handle most of the solution traffic. There are cases, though, where the custom authentication scheme is so intertwined with the protocol (for example, [TLS-PSK][]) that a service processing all the traffic (*custom gateway*) is required. For more information, see the [Protocol Gateway][] topic.

## Next steps

Follow these links to learn more about Azure IoT Hub:

- [Get started with IoT Hubs (Tutorial)][lnk-get-started]
- [What is Azure IoT Hub?][]

[img-tokenservice]: ./media/iot-hub-guidance/tokenservice.png

[IoT Hub Developer Guide - identity registry]: iot-hub-devguide.md#identityregistry
[IoT Hub device management guidance]: iot-hub-device-management.md
[IoT Hub Developer Guide - Anti-spoofing]: iot-hub-devguide.md#antispoofing
[Azure IoT device SDKs]: iot-hub-sdks-summary.md
[IoT Hub Developer Guide - Choosing your communication protocol]: iot-hub-devguide.md#amqpvshttp
[IoT Hub Developer Guide - Security]: iot-hub-devguide.md#security
[TLS-PSK]: https://tools.ietf.org/html/rfc4279
[Protocol Gateway]: iot-hub-protocol-gateway.md

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[What is Azure IoT Hub?]: iot-hub-what-is-iot-hub.md
