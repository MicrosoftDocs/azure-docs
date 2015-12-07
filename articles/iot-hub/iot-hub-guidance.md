<properties
 pageTitle="IoT Hub solution guidance | Microsoft Azure"
 description="Guidance topics on gateways, device provisioning, and authentication for developing IoT solutions using Azure IoT Hub."
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
 ms.date="11/10/2015"
 ms.author="dobett"/>

# Design your solution

This article provides guidance how to design the following capabilities in your IoT solution:

- Device provisioning
- Field gateways
- Device authentication

## Device provisioning

IoT solutions store data about individual devices such as:

- Device identity and authentication keys
- Device hardware type and version
- Device status
- Software versions and capabilities
- Device command history

The device data a given IoT solution stores depends on the specific requirements of that solution, but as a minimum a solution must store device identities and authentication keys. IoT Hub includes an [identity registry][lnk-devguide-identityregistry] that can store values for each device such as ids, authentication keys, and status codes. A solution can use other Azure services such as tables, blobs, or DocumentDB to store any additional device data.

*Device provisioning* is the process of adding the initial device data to the stores in your solution. To enable a new to device to connect to your hub you must add a new device id and keys to the 
[IoT Hub identity registry][lnk-devguide-identityregistry]. As part of the provisioning process, you may need to initialize device specific data in other solution stores.

The article [IoT Hub device management guidance][lnk-device-management] describes some common strategies for device provisioning. The [IoT Hub identity registry APIs][lnk-devguide-identityregistry] enable you to integrate IoT Hub into your provisioning process.

## Field gateways

In an IoT solution, a *field gateway* sits between your devices and your IoT hub and is typically located close to your devices. Your devices communicate directly with the field gateway using a protocol supported by the devices, and the field gateway communicates with IoT Hub using a protocol supported by IoT Hub. A field gateway can be a specialized standalone device or software that runs on an existing piece of hardware.

A field gateway differs from a simple traffic routing device (such as a NAT device or firewall) because it typically performs an active role in managing access and information flow in your solution. For example, a field gateway may:

- Manage local devices. For example, a field gateway could perform event rule processing and send commands to devices in response to specific telemetry data.
- Filter or aggregate telemetry data before it forwards it to IoT Hub. This can reduce the amount of data that is sent to IoT Hub and potentially reduce costs in your solution.
- Help to provision devices.
- Transform telemetry data to facilitate processing in your solution back end.
- Perform protocol translation to enable devices to communicate with IoT Hub even when they do not use the transport protocols that IoT Hub supports.

> [AZURE.NOTE] While you typically deploy a field gateway local to your devices, in some scenarios you might deploy a [protocol gateway][lnk-gateway] in the cloud.

### Types of field gateways

A field gateway can be *transparent* or *opaque*:

| &nbsp; | Transparent | Opaque |
|--------|-------------|--------|
| Identities stored in the IoT Hub identity registry | All connected devices | Only the identity of the field gateway |
| IoT Hub can provide [device identity anti-spoofing][lnk-devguide-antispoofing] | Yes | No |
| [Throttles and quotas][lnk-throttles-quotas] | Apply to each device | Apply to the  field gateway |

### Other considerations

You can use the [Azure IoT device SDKs][lnk-device-sdks] to implement a field gateway. Some device SDKs offer specific functionality that helps you to implement a field gateway such as the ability to multiplex the communication from multiple devices onto the same connection to IoT Hub. As explained in [IoT Hub Developer Guide - Choosing your communication protocol][lnk-devguide-protocol], you should avoid using HTTP/1 as the transport protocol for a field gateway.

## Custom device authentication

You can use the IoT Hub [device identity registry][lnk-devguide-identityregistry] to configure per-device security credentials and access control. However, if an IoT solution already has a significant investment in a custom device identity registry and/or authentication scheme, you can integrate this existing infrastructure with IoT Hub by creating a *token service*. In this way, you can use other IoT features in your solution.

A token service is a custom cloud service, which uses an IoT Hub *Shared Access Policy* with **DeviceConnect** permissions to create *device-scoped* tokens that enable a device to connect to your IoT hub.

  ![][img-tokenservice]

These are the main steps of the token service pattern:

1. Create an [IoT Hub shared access policy][lnk-devguide-security] with **DeviceConnect** permissions for your IoT hub. You can create this policy in the [Azure portal][lnk-portal] or programmatically. The token service uses this policy to sign the tokens it creates.
2. When a device needs to access your IoT hub, it requests a signed token from your token service. The device can authenticate with your custom device identity registry/authentication scheme to determine the device identity the token service uses to create the token.
3. The token service returns a token, created as per [IoT Hub Developer Guide - Security][lnk-devguide-security], using `/devices/{deviceId}` as `resourceURI`, with `deviceId` as the device being authenticated. The token service uses the shared access policy to construct the token.
4. The device uses the token directly with the IoT hub.

> [AZURE.NOTE] You can use the .NET class [SharedAccessSignatureBuilder][lnk-dotnet-sas] or the Java class [IotHubServiceSasToken][lnk-java-sas] to create a token in your token service.

The token service can set the token expiration as desired. When the token expires, the IoT hub severs the device connection, and the device must request a new token from the token service. If you use a short expiry time, this increases the load on both the device and the token service.

For a device to connect to your hub, you must still add it to the IoT Hub device identity registry even though the device is using a token and not a device key to connect. Therefore, you can continue to use per-device access control by enabling or disabling device identities in the [IoT Hub identity registry][lnk-devguide-identityregistry] when the device authenticates with a token. This mitigates the risks of using tokens with long expiry times.

### Comparison with a custom gateway

The token service pattern is the recommended way to implement a custom identity registry/authentication scheme with IoT Hub, because IoT Hub continues to handle most of the solution traffic. However, there are cases where the custom authentication scheme is so intertwined with the protocol (for example, [TLS-PSK][lnk-tls-psk]) that a service processing all the traffic (*custom gateway*) is required. For more information, see the [Protocol Gateway][lnk-gateway] topic.

## Next steps

Follow these links to learn more about Azure IoT Hub:

- [Get started with IoT Hub (Tutorial)][lnk-get-started]
- [What is Azure IoT Hub?][lnk-what-is-hub]

[img-tokenservice]: ./media/iot-hub-guidance/tokenservice.png

[lnk-devguide-identityregistry]: iot-hub-devguide.md#identityregistry
[lnk-device-management]: iot-hub-device-management.md

[lnk-device-sdks]: iot-hub-sdks-summary.md
[lnk-devguide-security]: iot-hub-devguide.md#security
[lnk-tls-psk]: https://tools.ietf.org/html/rfc4279
[lnk-gateway]: iot-hub-protocol-gateway.md

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[lnk-what-is-hub]: iot-hub-what-is-iot-hub.md
[lnk-portal]: https://portal.azure.com
[lnk-throttles-quotas]: ../azure-subscription-service-limits.md/#iot-hub-limits
[lnk-devguide-antispoofing]: iot-hub-devguide.md#antispoofing
[lnk-devguide-protocol]: iot-hub-devguide.md#amqpvshttp
[lnk-dotnet-sas]: https://msdn.microsoft.com/library/microsoft.azure.devices.common.security.sharedaccesssignaturebuilder.aspx
[lnk-java-sas]: http://azure.github.io/azure-iot-sdks/java/service/api_reference/com/microsoft/azure/iot/service/auth/IotHubServiceSasToken.html