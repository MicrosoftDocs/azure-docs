<properties
 pageTitle="Guidance topics for using Azure IoT Hub | Microsoft Azure"
 description="A collection of guidance topics for developing solutions using Azure IoT Hub."
 services="iot-hub"
 documentationCenter=""
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/29/2015"
 ms.author="dobett"/>

# Azure IoT Hub guidance

To do items
[] Titles and metadata
[x] Rewrite device provisioning
[] Move device provisioning
[] Rewrite field gateways
[] Move field gateways
[] Rewrite custom authentication

## Device provisioning

IoT solutions store data about individual devices such as:

- Device identity and authentication keys
- Device hardware type and version
- Device status
- Software versions and capabilities
- Device command history

The types of data a given IoT solution stores depend on the specific requirements of that solution, but as a minimum a solution typically stores device identities and authentication keys. IoT Hub includes an [identity registry][lnk-devguide-identityregistry] that can store values for each device such as ids, authentication keys, and status codes. A solution can use other Azure services such as tables, blobs, or DocumentDB to store any additional device data.

*Device provisioning* is the process of adding the initial device data to the stores in your solution. To enable a new to device to connect to your hub you must add a new device id and keys to the 
[IoT Hub identity registry][lnk-devguide-identityregistry]. As part of the provisioning process, you may need to initialize device specific data in other solution stores.

The article [IoT Hub device management guidance][lnk-device-management] describes some common strategies for device provisioning. The [IoT Hub identity registry APIs][lnk-devguide-identityregistry] enable you to integrate IoT Hub into your provisioning process.

## Field gateways

In an IoT solution, a *field gateway* sits between your devices and your IoT hub. Your devices communicate directly with the field gateway using a protocol supported by the devices, and the field gateway communicates with IoT Hub using a protocol supported by IoT Hub. A field gateway can be a specialized standalone device or software that runs on an existing piece of hardware.

A field gateway differs from a simple traffic routing device (such as a NAT device or firewall) in that it can perform an active role in managing access and information flow in your solution. A field gateway may perform some or all of the following:

- Local device management. For example, a field gateway could perform event rule processing and send commands to devices in response to specific telemetry data.
- Filtering or aggregating telemetry data before it forwards it to IoT Hub. This can reduce the amount of data that is sent to IoT Hub and potentially reduce costs in your solution.
- Help to provision devices.
- Transformation of telemetry data to facilitate processing in your solution back end.
- Protocol translation to enable devices to communicate with IoT Hub even when they do not use the tansport protocols that IoT Hub supports.

### Device registration and field gateways

A field gateway is *transparent* if the devices that connect to IoT Hub through the field gateway have their identities stored in the IoT Hub identity registry.

A field gateway is *opaque* if the only identity stored in the IoT Hub identity registry is the identity of the field gateway.

If you use an opaque gateway:

- IoT Hub cannot provide [device identity anti-spoofing][lnk-devguide-antispoofing].
- All the devices connected to the field gateway are subject to [throttles and quotas][lnk-throttles-quotas] as a single device.

### Other considerations

You can use the [Azure IoT device SDKs][lnk-device-sdks] to implement a field gateway. Some device SDKs offer specific functionality that helps you to implement a field gateway such as the ability to multiplex the communication from multiple devices on to the same connection to IoT Hub. As explained in [IoT Hub Developer Guide - Choosing your communication protocol][lnk-devguide-protocol], you should avoid using HTTP/1 as the transport protocol for a field gateway.

## Custom device authentication

You can use the IoT Hub [device identity registry][lnk-devguide-identityregistry] to configure per-device security credentials and access control. However, if an IoT solution already has a significant investment in a custom device identity registry and/or authentication scheme, you can still use other IoT Hub features by creating a *token service* for IoT Hub.

The token service is a custom cloud service, which uses an IoT Hub *Shared Access Policy* with **DeviceConnect** permissions to create *device-scoped* tokens.

  ![][img-tokenservice]

These are the main steps of the token service pattern:

1. Create an [IoT Hub Shared Access Policy][lnk-devguide-security] with **DeviceConnect** permissions for your IoT hub. The token service uses this policy to sign the tokens.
2. When a device wants to access your IoT hub, it requests a signed token from your token service. The device can use your custom device identity registry/authentication scheme.
3. The token service returns a token, created as per [IoT Hub Developer Guide - Security][lnk-devguide-security], using `/devices/{deviceId}` as `resourceURI`, with `deviceId` as the device being authenticated.
4. The device uses the token directly with the IoT hub.

The token service can set the token expiration as desired. At expiration, the IoT hub severs the connection, and the device must request a new token to the token service. Clearly a short expiration time will increase the load on both the device and the token service.

It is worth specifying that for the device to be able to connect, the device identity still must be created in the IoT hub. This also means that per-device access control (by disabling device identities as per [IoT Hub identity registry][lnk-devguide-identityregistry]) is still functional, even if the device authenticates with a token. This mitigates the existence of long-lasting tokens.

### Comparison with a custom gateway

The token service pattern is the recommended way to implement a custom identity registry/authentication scheme with IoT Hub, as it lets IoT Hub handle most of the solution traffic. There are cases, though, where the custom authentication scheme is so intertwined with the protocol (for example, [TLS-PSK][lnk-tls-psk]) that a service processing all the traffic (*custom gateway*) is required. For more information, see the [Protocol Gateway][lnk-gateway] topic.

## Next steps

Follow these links to learn more about Azure IoT Hub:

- [Get started with IoT Hub (Tutorial)][lnk-get-started]
- [What is Azure IoT Hub?][lnk-what-is-hub]

[img-tokenservice]: ./media/iot-hub-guidance/tokenservice.png

[lnk-devguide-identityregistry]: iot-hub-devguide.md#identityregistry
[lnk-device-management]: iot-hub-device-management.md
[lnk-devguide-antispoofing]: iot-hub-devguide.md#antispoofing
[lnk-device-sdks]: iot-hub-sdks-summary.md
[lnk-devguide-protocol]: iot-hub-devguide.md#amqpvshttp
[lnk-devguide-security]: iot-hub-devguide.md#security
[lnk-tls-psk]: https://tools.ietf.org/html/rfc4279
[lnk-gateway]: iot-hub-protocol-gateway.md

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[lnk-what-is-hub]: iot-hub-what-is-iot-hub.md
[lnk-throttles-quotas]: ../azure-subscription-service-limits.md/#iot-hub-limits
