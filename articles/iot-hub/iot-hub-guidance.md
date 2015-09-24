<properties
 pageTitle="Azure IoT Hub Guidance | Microsoft Azure"
 description="A collection of guidance topics for solutions using Azure IoT Hub."
 services="iot-hub"
 documentationCenter=".net"
 authors="fsautomata"
 manager="kevinmil"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="09/29/2015"
 ms.author="elioda"/>

# Azure IoT Hub - Guidance

## Comparison: IoT Hub and Event Hubs
One of the main use cases for Azure IoT Hub is to gather telemetry from devices. For this reason, IoT Hub is often compared to [Event Hubs], which is an event processing service that provides event and telemetry ingress to the cloud at massive scale, with low latency and high reliability.

The services, however, have many differences, that are detailed in the following sections.

| Area | IoT Hub | Event Hubs |
| ---- | ------- | ---------- |
| Communication patterns | Device-to-cloud event ingress and cloud-to-device messaging. | Only event ingress (usually considered for device-to-cloud scenarios). |
| Security | Per-device identity and revokable access control. Refer to [Azure IoT Hub Developer Guide - Security]. | Event Hub-wide [Shared Access Policies][Event Hub - security], with limited revokation support using [publisher's policies][Event Hub publisher policies]. In the context of IoT solutions, it is often required to implment custom solution to support per-device credentials, and anti-spoofing measures. |
| Scale | IoT Hubs is optimized to support millions of simultaneously connected devices. | Event Hubs can support a more limited number of simultaneous connections: up tp 5.000 AMQP connection, as per [Service Bus Quotas]. On the other hand, Event Hubs lets users specify the partition for each message sent. |
| Device SDKs | IoT Hub provides [device SDKs][Azure IoT Hub SDKs] for a large variety of platforms and languages | Event Hubs is supported on .NET, C, and provides AMQP and HTTP send interfaces. |

In conclusion, even if the only use case is device-to-cloud telemetry ingress, IoT Hub provides a service that is specifically designed for IoT device connectivity, and will continue to expand the value propositions for these scenarios with IoT-specific features. Event Hubs is designed for event ingress at massive scale, both in the context of inter and intra-data center scenarios.
It is not uncommon to use IoT Hub and Event Hubs in conjunction, letting the former handle the device-to-cloud communication, and the latter later-stage event ingress into real-time processing engines.

## Device provisioning <a id="provisioning"></a>

// device registry (orchestration process) and bootstrap (how to import/export lots of devcie identities)

## Field gateways <a id="fieldgateways"></a>

// what are they (typical functionality), use device sdk, prefer AMQP. device identity. // not full guide.

## Using custom device authentication schemes/services. <a id="customauth"></a>
Azure IoT Hub allows to configure per-device security credentials and access control through the use of the [device identity registry][IoT Hub Developer Guide - identity registry].
If an IoT solution, already has significant investment in a custom device identity registry and/or authentication scheme, it can still take advantage of other IoT Hub's features by creating a *token service* for IoT Hub.

The token service, is a self-deployed cloud service, which uses an IoT Hub Shared Access Policy with **DeviceConnect** permissions to create *device-scoped* tokens.

    ![][img-tokenservice]

Here are the main steps of the token service pattern.

1. Create an [IoT Hub Shared Access Policy][IoT Hub Developer Guide - Security] with **DeviceConnect** permissions for your IoT hub. This policy will be used by the token service to sign the tokens.
2. When a device wants to access the IoT hub, it requests your token service a signed token. The device can use your custom device identity registry/authentication scheme.
3. The token service returns a token, created as per [IoT Hub Developer Guide - Security], using `/devices/{deviceId}` as `resourceURI`, with `deviceId` being the device being authenticated.
4. The device uses the token directly with the IoT hub.

The token service can set the token expiration as desired. At expiration the IoT hub will server the connection, and the device will have to request a new token to the token service. Clearly a short expiration time will increase the load on both the device and the token service.

It is worth specifying that the device identity still has to be created in the IoT hub, for the device to be able to connect. This also means that per-device access control (by disabling device identities as per [IoT Hub Developer Guide - identity registry], is still functinal, even if the device authenticates with a token. This mitigates the existence of long lasting tokens.

### Comparison with a custom gateway
The token servcie pattern is the reccommended way to implement a custom identity registry/authentication scheme with IoT Hub, as it lets IoT Hub handle most of the solution traffic. There are cases, though, where the custom authentication scheme is so intertwined with the protocol (e.g. [TLS-PSK]) that a service processing all the traffic (*custom gateway*) is required. Refert to the [Protocol Gateway] article for more information.



## Scaling IoT Hub <a id="scale"></a>
// sharding

## HA

[img-tokenservice]: media/iot-hub-guidance/tokenservice.png



[IoT Hub Developer Guide - identity registry]: iot-hub-devguide.md#identityregistry
[IoT Hub Developer Guide - Security]: iot-hub-devguide.md#security
[Protocol Gateway]: iot-hub-protocol-gateway.md