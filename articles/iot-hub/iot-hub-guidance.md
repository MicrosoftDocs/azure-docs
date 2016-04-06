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
 ms.date="02/03/2016"
 ms.author="dobett"/>

# Design your solution

This article provides guidance for how to design the following capabilities in your Internet of Things (IoT) solution:

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

The device data that a given IoT solution stores depends on the specific requirements of that solution. But, as a minimum, a solution must store device identities and authentication keys. Azure IoT Hub includes an [identity registry][lnk-devguide-identityregistry] that can store values for each device such as IDs, authentication keys, and status codes. A solution can use other Azure services such as tables, blobs, or Azure DocumentDB to store any additional device data.

*Device provisioning* is the process of adding the initial device data to the stores in your solution. To enable a new device to connect to your hub, you must add a new device ID and keys to the
[IoT Hub identity registry][lnk-devguide-identityregistry]. As part of the provisioning process, you might need to initialize device-specific data in other solution stores.

The [IoT Hub identity registry APIs][lnk-devguide-identityregistry] enable you to integrate IoT Hub into your provisioning process.

## Field gateways

In an IoT solution, a *field gateway* sits between your devices and your IoT hub. It is typically located close to your devices. Your devices communicate directly with the field gateway by using a protocol supported by the devices. The field gateway communicates with IoT Hub using a protocol that is supported by IoT Hub. A field gateway can be a specialized standalone device or software that runs on an existing piece of hardware.

A field gateway differs from a simple traffic routing device (such as a network address translation (NAT) device or firewall) because it typically performs an active role in managing access and information flow in your solution. For example, a field gateway may:

- Manage local devices. For example, a field gateway could perform event rule processing and send commands to devices in response to specific telemetry data.
- Filter or aggregate telemetry data before it forwards it to IoT Hub. This can reduce the amount of data that is sent to IoT Hub and potentially reduce costs in your solution.
- Help to provision devices.
- Transform telemetry data to facilitate processing in your solution back end.
- Perform protocol translation to enable devices to communicate with IoT Hub--even when they do not use the transport protocols that IoT Hub supports.

> [AZURE.NOTE] While you typically deploy a field gateway that is local to your devices, in some scenarios, you might deploy a [protocol gateway][lnk-gateway] in the cloud.

### Types of field gateways

A field gateway can be *transparent* or *opaque*:

| &nbsp; | Transparent gateway | Opaque gateway|
|--------|-------------|--------|
| Identities that are stored in the IoT Hub identity registry | Identities of all connected devices | Only the identity of the field gateway |
| IoT Hub can provide [device identity anti-spoofing][lnk-devguide-antispoofing] | Yes | No |
| [Throttles and quotas][lnk-throttles-quotas] | Apply to each device | Apply to the field gateway |

> [AZURE.IMPORTANT]  When using an opaque gateway pattern, all devices connecting through that gateway share the same cloud-to-device queue, which can contain at most 50 messages. It follows that the opaque gateway pattern should be used only when very few devices are connecting through each field gateway, and their cloud-to-device traffic is low.

### Other considerations

You can use the [Azure IoT device SDKs][lnk-device-sdks] to implement a field gateway. Some device SDKs offer specific functionality that helps you to implement a field gateway--such as the ability to multiplex the communication from multiple devices onto the same connection to IoT Hub. As explained in [IoT Hub developer guide - Choosing your communication protocol][lnk-devguide-protocol], you should avoid using HTTP/1 as the transport protocol for a field gateway.

## Custom device authentication

You can use the IoT Hub [device identity registry][lnk-devguide-identityregistry] to configure per-device security credentials and access control. However, if an IoT solution already has a significant investment in a custom device identity registry and/or authentication scheme, you can integrate this existing infrastructure with IoT Hub by creating a *token service*. In this way, you can use other IoT features in your solution.

A token service is a custom cloud service. It uses an IoT Hub *shared access policy* with **DeviceConnect** permissions to create *device-scoped* tokens. These tokens enable a device to connect to your IoT hub.

  ![Steps of the token service pattern][img-tokenservice]

These are the main steps of the token service pattern:

1. Create an [IoT Hub shared access policy][lnk-devguide-security] with **DeviceConnect** permissions for your IoT hub. You can create this policy in the [Azure portal][lnk-portal] or programmatically. The token service uses this policy to sign the tokens it creates.
2. When a device needs to access your IoT hub, it requests a signed token from your token service. The device can authenticate with your custom device identity registry/authentication scheme to determine the device identity that the token service uses to create the token.
3. The token service returns a token. The token is created as per the [security section of the IoT Hub developer guide][lnk-devguide-security] by using `/devices/{deviceId}` as `resourceURI`, with `deviceId` as the device being authenticated. The token service uses the shared access policy to construct the token.
4. The device uses the token directly with the IoT hub.

> [AZURE.NOTE] You can use the .NET class [SharedAccessSignatureBuilder][lnk-dotnet-sas] or the Java class [IotHubServiceSasToken][lnk-java-sas] to create a token in your token service.

The token service can set the token expiration as desired. When the token expires, the IoT hub severs the device connection. Then, the device must request a new token from the token service. If you use a short expiry time, this increases the load on both the device and the token service.

For a device to connect to your hub, you must still add it to the IoT Hub device identity registry--even though the device is using a token and not a device key to connect. Therefore, you can continue to use per-device access control by enabling or disabling device identities in the [IoT Hub identity registry][lnk-devguide-identityregistry] when the device authenticates with a token. This mitigates the risks of using tokens with long expiry times.

### Comparison with a custom gateway

The token service pattern is the recommended way to implement a custom identity registry/authentication scheme with IoT Hub. It is recommended because IoT Hub continues to handle most of the solution traffic. However, there are cases where the custom authentication scheme is so intertwined with the protocol that a service processing all the traffic (*custom gateway*) is required. An example of this is [Transport Layer Security (TLS) and pre-shared keys (PSKs)][lnk-tls-psk]. For more information, see the [protocol gateway][lnk-gateway] topic.

## Device heartbeat <a id="heartbeat"></a>

The [IoT Hub identity registry][lnk-devguide-identityregistry] contains a field called **connectionState**. You should only use the **connectionState** field during development and debugging, IoT solutions should not query the field at run time (for example, to check if a device is connected in order to decide whether to send a cloud-to-device message or an SMS).
If your IoT solution needs to know if a device is connected (either at run time, or with more accuracy than the **connectionState** property provides), your solution should implement the *heartbeat pattern*.

In the heartbeat pattern, the device sends device-to-cloud messages at least once every fixed amount of time (for example, at least once every hour). This means that even if a device does not have any data to send, it still sends an empty device-to-cloud message (usually with a property that identifies it as a heartbeat). On the service side, the solution maintains a map with the last heartbeat received for each device, and assumes that there is a problem with a device if it does not receive a heartbeat message within the expected time.

A more complex implementation could include the information from [operations monitoring][lnk-devguide-opmon] to identify devices that are trying to connect or communicate but failing. When you implement the heartbeat pattern, make sure to check [IoT Hub Quotas and Throttles][].

> [AZURE.NOTE] If an IoT solution needs the device connection state solely to determine whether to send cloud-to-device messages, and messages are not broadcast to large sets of devices, a much simpler pattern to consider is to use a short Expiry time. This achieves the same result as maintaining a device connection state registry using the heartbeat pattern, while being significantly more efficient. It is also possible, by requesting message acknowledgements, to be notified by IoT Hub of which devices are able to receive messages and which are not online or are failed. Refer to the [IoT Hub Developer Guide][lnk-devguide-messaging] for more information on C2D messages.

## Next steps

Follow these links to learn more about Azure IoT Hub:

- [Get started with IoT Hub (Tutorial)][lnk-get-started]
- [What is Azure IoT Hub?][lnk-what-is-hub]

[img-tokenservice]: ./media/iot-hub-guidance/tokenservice.png

[lnk-devguide-identityregistry]: iot-hub-devguide.md#identityregistry
[lnk-devguide-opmon]: iot-hub-operations-monitoring.md

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
[lnk-devguide-messaging]: iot-hub-devguide.md#messaging
[lnk-dotnet-sas]: https://msdn.microsoft.com/library/microsoft.azure.devices.common.security.sharedaccesssignaturebuilder.aspx
[lnk-java-sas]: http://azure.github.io/azure-iot-sdks/java/service/api_reference/com/microsoft/azure/iot/service/auth/IotHubServiceSasToken.html
[IoT Hub Quotas and Throttles]: iot-hub-devguide.md#throttling
