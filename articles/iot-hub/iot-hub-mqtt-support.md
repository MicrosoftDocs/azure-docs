<properties
 pageTitle="IoT Hub MQTT support | Microsoft Azure"
 description="Description of MQTT support in IoT hub-level"
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
 ms.date="04/29/2016"
 ms.author="dobett"/>

# IoT Hub MQTT support

IoT Hub enables devices to communicate with the IoT Hub device endpoints using the [MQTT v3.1.1][lnk-mqtt-org] protocol on port 8883. IoT Hub requires all device communication to be secured using TLS/SSL.

## Connecting to IoT Hub

A device can connect to an IoT hub using the MQTT protocol either by using the libraries in the [Microsoft Azure IoT SDKs][lnk-device-sdks] or by using the MQTT protocol directly.

## Using the device client SDKs

[Device client SDKs][lnk-device-sdks] that support the MQTT protocol are available for Java, Node.js, C and C#. The device client SDKs use the standard IoT Hub connection string to establish a connection to an IoT hub. To use the MQTT protocol, the client protocol parameter must be set to **MQTT**. By default, the device client SDKs connect to an IoT Hub with the **CleanSession** flag set to **0** and use **QoS 1** for message exchange with the IoT hub.

When a device is connected to an IoT hub, the device client SDKs provide methods that enable the device to send messages to and receive messages from an IoT hub.

The following table contains links to code samples for each supported language and specifies the parameter to use to establish a connection to IoT Hub using the MQTT protocol.

| Language                   | Protocol parameter        |
| -------------------------- | ------------------------- |
| [Node.js][lnk-sample-node] | azure-iot-device-mqtt     |
| [Java][lnk-sample-java]    | IotHubClientProtocol.MQTT |
| [C][lnk-sample-c]          | MQTT_Protocol             |
| [C#][lnk-sample-csharp]    | TransportType.Mqtt        |

## Using the MQTT protocol directly

If a device cannot use the device client SDKs, it can still connect to the public device endpoints using the MQTT protocol. In the **CONNECT** packet the device should use the following values:

- For the **ClientId** field use the **deviceId**. 
- For the **Username** field use `{iothubhostname}/{device_id}`, where {iothubhostname} is the full CName of the IoT hub.

    For example, if the name of your IoT hub is **contoso.azure-devices.net** and if the name of your device is **MyDevice01**, the full **Username** field should contain `contoso.azure-devices.net/MyDevice01`.

- For the **Password** field use a SAS token. The format of the SAS token is the same as for both the HTTP and AMQP protocols:<br/>`SharedAccessSignature sig={signature-string}&se={expiry}&sr={URL-encoded-resourceURI}`.

    For more information about how to generate SAS tokens, see the device section of [Using IoT Hub security tokens][lnk-sas-tokens].
    
    When testing, you can also use the [Device Explorer][lnk-device-explorer] tool to quickly generate a SAS token that you can copy and paste into your own code:
    
    1. Go to the **Management** tab in Device Explorer.
    2. Click **SAS Token** (top right).
    3. On **SASTokenForm**, select your device in the **DeviceID** drop down. Set your **TTL**.
    4. Click **Generate** to create your token.
    
    The SAS token that's generated looks like this:
    `HostName={your hub name}.azure-devices.net;DeviceId=javadevice;SharedAccessSignature=SharedAccessSignature sr={your hub name}.azure-devices.net%2fdevices%2fMyDevice01&sig=vSgHBMUG.....Ntg%3d&se=1456481802`.

    The part of this to use as in the **Password** field to connect using MQTT is:
    `SharedAccessSignature sr={your hub name}.azure-devices.net%2fdevices%2fyDevice01&sig=vSgHBMUG.....Ntg%3d&se=1456481802g%3d&se=1456481802`.

For MQTT connect and disconnect packets, IoT Hub issues an event on the **Operations Monitoring** channel.

### Sending messages to IoT Hub

After making a successful connection, a device can send messages to IoT Hub using `devices/{device_id}/messages/events/` or `devices/{device_id}/messages/events/{property_bag}` as a **Topic Name**. The `{property_bag}` element enables the device to send messages with additional properties in a url-encoded format. For example:

```
RFC 2396-encoded(<PropertyName1>)=RFC 2396-encoded(<PropertyValue1>)&RFC 2396-encoded(<PropertyName2>)=RFC 2396-encoded(<PropertyValue2>)…
```

> [AZURE.NOTE] This is the same encoding as that used for query strings in the HTTP protocol.

The device client application can also use `devices/{device_id}/messages/events/{property_bag}` as the **Will topic name** to define *Will messages* to be forwarded as a telemetry message.

### Receiving messages

To receive messages from IoT Hub a device should subscribe using `devices/{device_id}/messages/devicebound/#”` as a **Topic Filter**. IoT Hub delivers messages with the **Topic Name** `devices/{device_id}/messages/devicebound/`, or `devices/{device_id}/messages/devicebound/{property_bag}` if there are any message properties. `{property_bag}` contains url-encoded key/value pairs of message properties. Only application properties and user-settable system properties (such as **messageId** or **correlationId**) are included in the property bag. System property names have the prefix **$**, application properties use the original property name with no prefix.

## Next steps

For additional information about MQTT support with the IoT Device SDKs, see [Notes on MQTT support][lnk-mqtt-devguide] in the Azure IoT Hub developer guide.

To learn more about the MQTT protocol, see the [MQTT documentation][lnk-mqtt-docs].

To learn more about planning your IoT Hub deployment, see:

- [Supported devices][lnk-devices]
- [Support additional protocols][lnk-protocols]
- [Compare with Event Hubs][lnk-compare]
- [Scaling, HA and DR][lnk-scaling]

To further explore the capabilities of IoT Hub, see:

- [Developer guide][lnk-devguide]
- [Exploring device management using the sample UI][lnk-dmui]
- [Simulating a device with the Gateway SDK][lnk-gateway]
- [Using the Azure Portal to manage IoT Hub][lnk-portal]

[lnk-device-sdks]: https://github.com/Azure/azure-iot-sdks/blob/master/readme.md
[lnk-mqtt-org]: http://mqtt.org/
[lnk-mqtt-docs]: http://mqtt.org/documentation
[lnk-sample-node]: https://github.com/Azure/azure-iot-sdks/blob/develop/node/device/samples/simple_sample_device.js
[lnk-sample-java]: https://github.com/Azure/azure-iot-sdks/blob/develop/java/device/samples/send-receive-sample/src/main/java/samples/com/microsoft/azure/iothub/SendReceive.java
[lnk-sample-c]: https://github.com/Azure/azure-iot-sdks/tree/master/c/iothub_client/samples/iothub_client_sample_mqtt
[lnk-sample-csharp]: https://github.com/Azure/azure-iot-sdks/tree/master/csharp/device/samples
[lnk-device-explorer]: https://github.com/Azure/azure-iot-sdks/blob/master/tools/DeviceExplorer/readme.md
[lnk-sas-tokens]: iot-hub-sas-tokens.md#using-sas-tokens-as-a-device
[lnk-mqtt-devguide]: iot-hub-devguide.md#mqtt-support

[lnk-devices]: iot-hub-tested-configurations.md
[lnk-protocols]: iot-hub-protocol-gateway.md
[lnk-compare]: iot-hub-compare-event-hubs.md
[lnk-scaling]: iot-hub-scaling.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-dmui]: iot-hub-device-management-ui-sample.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-portal]: iot-hub-manage-through-portal.md