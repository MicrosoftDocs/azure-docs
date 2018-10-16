---
title: Understand Azure IoT Hub MQTT support | Microsoft Docs
description: Developer guide - support for devices connecting to an IoT Hub device-facing endpoint using the MQTT protocol. Includes information about built-in MQTT support in the Azure IoT device SDKs.
author: rezasherafat
manager: 
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 10/12/2018
ms.author: rezas
---

# Communicate with your IoT hub using the MQTT protocol

IoT Hub enables devices to communicate with the IoT Hub device endpoints using:

* [MQTT v3.1.1][lnk-mqtt-org] on port 8883
* MQTT v3.1.1 over WebSocket on port 443.

IoT Hub is not a full-featured MQTT broker and does not support all the behaviors specified in the MQTT v3.1.1 standard. This article describes how devices can use supported MQTT behaviors to communicate with IoT Hub.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

All device communication with IoT Hub must be secured using TLS/SSL. Therefore, IoT Hub doesn’t support non-secure connections over port 1883.

## Connecting to IoT Hub

A device can use the MQTT protocol to connect to an IoT hub using:

* Either the libraries in the [Azure IoT SDKs][lnk-device-sdks].
* Or the MQTT protocol directly.

## Using the device SDKs

[Device SDKs][lnk-device-sdks] that support the MQTT protocol are available for Java, Node.js, C, C#, and Python. The device SDKs use the standard IoT Hub connection string to establish a connection to an IoT hub. To use the MQTT protocol, the client protocol parameter must be set to **MQTT**. By default, the device SDKs connect to an IoT Hub with the **CleanSession** flag set to **0** and use **QoS 1** for message exchange with the IoT hub.

When a device is connected to an IoT hub, the device SDKs provide methods that enable the device to exchange messages with an IoT hub.

The following table contains links to code samples for each supported language and specifies the parameter to use to establish a connection to IoT Hub using the MQTT protocol.

| Language | Protocol parameter |
| --- | --- |
| [Node.js][lnk-sample-node] |azure-iot-device-mqtt |
| [Java][lnk-sample-java] |IotHubClientProtocol.MQTT |
| [C][lnk-sample-c] |MQTT_Protocol |
| [C#][lnk-sample-csharp] |TransportType.Mqtt |
| [Python][lnk-sample-python] |IoTHubTransportProvider.MQTT |

### Migrating a device app from AMQP to MQTT

If you are using the [device SDKs][lnk-device-sdks], switching from using AMQP to MQTT requires changing the protocol parameter in the client initialization as stated previously.

When doing so, make sure to check the following items:

* AMQP returns errors for many conditions, while MQTT terminates the connection. As a result your exception handling logic might require some changes.
* MQTT does not support the *reject* operations when receiving [cloud-to-device messages][lnk-messaging]. If your back-end app needs to receive a response from the device app, consider using [direct methods][lnk-methods].

## Using the MQTT protocol directly

If a device cannot use the device SDKs, it can still connect to the public device endpoints using the MQTT protocol on port 8883. In the **CONNECT** packet the device should use the following values:

* For the **ClientId** field, use the **deviceId**.

* For the **Username** field, use `{iothubhostname}/{device_id}/api-version=2016-11-14`, where `{iothubhostname}` is the full CName of the IoT hub.

    For example, if the name of your IoT hub is **contoso.azure-devices.net** and if the name of your device is **MyDevice01**, the full **Username** field should contain:

    `contoso.azure-devices.net/MyDevice01/api-version=2016-11-14`

* For the **Password** field, use a SAS token. The format of the SAS token is the same as for both the HTTPS and AMQP protocols:

  `SharedAccessSignature sig={signature-string}&se={expiry}&sr={URL-encoded-resourceURI}`

  > [!NOTE]
  > If you use X.509 certificate authentication, SAS token passwords are not required. For more information, see [Set up X.509 security in your Azure IoT Hub][lnk-x509]

  For more information about how to generate SAS tokens, see the device section of [Using IoT Hub security tokens][lnk-sas-tokens].

  When testing, you can also use the cross-platform [Azure IoT Toolkit extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) or the [Device Explorer][lnk-device-explorer] tool to quickly generate a SAS token that you can copy and paste into your own code:

For Azure IoT Toolkit:

  1. Expand the **AZURE IOT HUB DEVICES** tab in the bottom left corner of Visual Studio Code.
  2. Right-click your device and select **Generate SAS Token for Device**.
  3. Set **expiration time** and press 'Enter'.
  4. The SAS token is created and copied to clipboard.

For Device Explorer:

  1. Go to the **Management** tab in **Device Explorer**.
  2. Click **SAS Token** (top right).
  3. On **SASTokenForm**, select your device in the **DeviceID** drop down. Set your **TTL**.
  4. Click **Generate** to create your token.

     The SAS token that's generated has the following structure:

     `HostName={your hub name}.azure-devices.net;DeviceId=javadevice;SharedAccessSignature=SharedAccessSignature sr={your hub name}.azure-devices.net%2Fdevices%2FMyDevice01%2Fapi-version%3D2016-11-14&sig=vSgHBMUG.....Ntg%3d&se=1456481802`

     The part of this token to use as the **Password** field to connect using MQTT is:

     `SharedAccessSignature sr={your hub name}.azure-devices.net%2Fdevices%2FMyDevice01%2Fapi-version%3D2016-11-14&sig=vSgHBMUG.....Ntg%3d&se=1456481802`

For MQTT connect and disconnect packets, IoT Hub issues an event on the **Operations Monitoring** channel. This event has additional information that can help you to troubleshoot connectivity issues.

The device app can specify a **Will** message in the **CONNECT** packet. The device app should use `devices/{device_id}/messages/events/` or `devices/{device_id}/messages/events/{property_bag}` as the **Will** topic name to define **Will** messages to be forwarded as a telemetry message. In this case, if the network connection is closed, but a **DISCONNECT** packet was not previously received from the device, then IoT Hub sends the **Will** message supplied in the **CONNECT** packet to the telemetry channel. The telemetry channel can be either the default **Events** endpoint or a custom endpoint defined by IoT Hub routing. The message has the **iothub-MessageType** property with a value of **Will** assigned to it.

### TLS/SSL configuration

To use the MQTT protocol directly, your client *must* connect over TLS/SSL. Attempts to skip this step fail with connection errors.

In order to establish a TLS connection, you may need to download and reference the DigiCert Baltimore Root Certificate. This certificate is the one that Azure uses to secure the connection. You can find this certificate in the [Azure-iot-sdk-c][lnk-sdk-c-certs] repository. More information about these certificates can be found on [Digicert's website][lnk-digicert-root-certs].

An example of how to implement this using the Python version of the [Paho MQTT library][lnk-paho] by the Eclipse Foundation might look like the following.

First, install the Paho library from your command-line environment:

```cmd/sh
pip install paho-mqtt
```

Then, implement the client in a Python script. Replace the placeholders as follows:

* `<local path to digicert.cer>` is the path to a local file that contains the DigiCert Baltimore Root certificate. You can create this file by copying the certificate information from [certs.c](https://github.com/Azure/azure-iot-sdk-c/blob/master/certs/certs.c) in the Azure IoT SDK for C. Include the lines `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----`, remove the `"` marks at the beginning and end of every line, and remove the `\r\n` characters at the end of every line.
* `<device id from device registry>` is the ID of a device you added to your IoT hub.
* `<generated SAS token>` is a SAS token for the device created as described previously in this article.
* `<iot hub name>` the name of your IoT hub.

```python
from paho.mqtt import client as mqtt
import ssl

path_to_root_cert = "<local path to digicert.cer>"
device_id = "<device id from device registry>"
sas_token = "<generated SAS token>"
iot_hub_name = "<iot hub name>"

def on_connect(client, userdata, flags, rc):
  print ("Device connected with result code: " + str(rc))
def on_disconnect(client, userdata, rc):
  print ("Device disconnected with result code: " + str(rc))
def on_publish(client, userdata, mid):
  print ("Device sent message")

client = mqtt.Client(client_id=device_id, protocol=mqtt.MQTTv311)

client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_publish = on_publish

client.username_pw_set(username=iot_hub_name+".azure-devices.net/" + device_id, password=sas_token)

client.tls_set(ca_certs=path_to_root_cert, certfile=None, keyfile=None, cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1, ciphers=None)
client.tls_insecure_set(False)

client.connect(iot_hub_name+".azure-devices.net", port=8883)

client.publish("devices/" + device_id + "/messages/events/", "{id=123}", qos=1)
client.loop_forever()
```

### Sending device-to-cloud messages

After making a successful connection, a device can send messages to IoT Hub using `devices/{device_id}/messages/events/` or `devices/{device_id}/messages/events/{property_bag}` as a **Topic Name**. The `{property_bag}` element enables the device to send messages with additional properties in a url-encoded format. For example:

```text
RFC 2396-encoded(<PropertyName1>)=RFC 2396-encoded(<PropertyValue1>)&RFC 2396-encoded(<PropertyName2>)=RFC 2396-encoded(<PropertyValue2>)…
```

> [!NOTE]
> This `{property_bag}` element uses the same encoding as for query strings in the HTTPS protocol.

The following is a list of IoT Hub implementation-specific behaviors:

* IoT Hub does not support QoS 2 messages. If a device app publishes a message with **QoS 2**, IoT Hub closes the network connection.
* IoT Hub does not persist Retain messages. If a device sends a message with the **RETAIN** flag set to 1, IoT Hub adds the **x-opt-retain** application property to the message. In this case, instead of persisting the retain message, IoT Hub passes it to the backend app.
* IoT Hub only supports one active MQTT connection per device. Any new MQTT connection on behalf of the same device ID causes IoT Hub to drop the existing connection.

For more information, see [Messaging developer's guide][lnk-messaging].

### Receiving cloud-to-device messages

To receive messages from IoT Hub, a device should subscribe using `devices/{device_id}/messages/devicebound/#` as a **Topic Filter**. The multi-level wildcard `#` in the Topic Filter is used only to allow the device to receive additional properties in the topic name. IoT Hub does not allow the usage of the `#` or `?` wildcards for filtering of subtopics. Since IoT Hub is not a general-purpose pub-sub messaging broker, it only supports the documented topic names and topic filters.

The device does not receive any messages from IoT Hub, until it has successfully subscribed to its device-specific endpoint, represented by the `devices/{device_id}/messages/devicebound/#` topic filter. After a subscription has been established, the device receives cloud-to-device messages that were sent to it after the time of the subscription. If the device connects with **CleanSession** flag set to **0**, the subscription is persisted across different sessions. In this case, the next time the device connects with **CleanSession 0** it receives any outstanding messages sent to it while disconnected. If the device uses **CleanSession** flag set to **1** though, it does not receive any messages from IoT Hub until it subscribes to its device-endpoint.

IoT Hub delivers messages with the **Topic Name** `devices/{device_id}/messages/devicebound/`, or `devices/{device_id}/messages/devicebound/{property_bag}` when there are message properties. `{property_bag}` contains url-encoded key/value pairs of message properties. Only application properties and user-settable system properties (such as **messageId** or **correlationId**) are included in the property bag. System property names have the prefix **$**, application properties use the original property name with no prefix.

When a device app subscribes to a topic with **QoS 2**, IoT Hub grants maximum QoS level 1 in the **SUBACK** packet. After that, IoT Hub delivers messages to the device using QoS 1.

### Retrieving a device twin's properties

First, a device subscribes to `$iothub/twin/res/#`, to receive the operation's responses. Then, it sends an empty message to topic `$iothub/twin/GET/?$rid={request id}`, with a populated value for **request ID**. The service then sends a response message containing the device twin data on topic `$iothub/twin/res/{status}/?$rid={request id}`, using the same **request ID** as the request.

Request ID can be any valid value for a message property value, as per [IoT Hub messaging developer's guide][lnk-messaging], and status is validated as an integer.

The response body contains the properties section of the device twin. The following snippet shows the body of the identity registry entry limited to the "properties" member, for example:

```json
{
    "properties": {
        "desired": {
            "telemetrySendFrequency": "5m",
            "$version": 12
        },
        "reported": {
            "telemetrySendFrequency": "5m",
            "batteryLevel": 55,
            "$version": 123
        }
    }
}
```

The possible status codes are:

|Status | Description |
| ----- | ----------- |
| 200 | Success |
| 429 | Too many requests (throttled), as per [IoT Hub throttling][lnk-quotas] |
| 5** | Server errors |

For more information, see [Device twins developer's guide][lnk-devguide-twin].

### Update device twin's reported properties

To update reported properties, the device issues a request to IoT Hub via a publication over a designated MQTT topic. After processing the request, IoT Hub responds the success or failure status of the update operation via a publication to another topic. This topic can be subscribed by the device in order to notify it about the result of its twin update request. To implment this type of request/response interaction in MQTT, we leverage the notion of request id (`$rid`) provided initially by the device in its update request. This request id is also included in the response from IoT Hub to allow the device to correlate the response to its particular earlier request.

The following sequence describes how a device updates the reported properties in the device twin in IoT Hub:

1. A device must first subscribe to the `$iothub/twin/res/#` topic to receive the operation's responses from IoT Hub.

1. A device sends a message that contains the device twin update to the `$iothub/twin/PATCH/properties/reported/?$rid={request id}` topic. This message includes a **request ID** value.

1. The service then sends a response message that contains the new ETag value for the reported properties collection on topic `$iothub/twin/res/{status}/?$rid={request id}`. This response message uses the same **request ID** as the request.

The request message body contains a JSON document, that contains new values for reported properties. Each member in the JSON document updates or add the corresponding member in the device twin’s document. A member set to `null`, deletes the member from the containing object. For example:

```json
{
    "telemetrySendFrequency": "35m",
    "batteryLevel": 60
}
```

The possible status codes are:

|Status | Description |
| ----- | ----------- |
| 200 | Success |
| 400 | Bad Request. Malformed JSON |
| 429 | Too many requests (throttled), as per [IoT Hub throttling][lnk-quotas] |
| 5** | Server errors |

The python code snippet below, demonstrates the twin reported properties update process over MQTT (using Paho MQTT client):
```python
from paho.mqtt import client as mqtt

# authenticate the client with IoT Hub (not shown here)

client.subscribe("$iothub/twin/res/#")
rid = "1"
twin_reported_property_patch = "{\"firmware_version\": \"v1.1\"}"
client.publish("$iothub/twin/PATCH/properties/reported/?$rid=" + rid, twin_reported_property_patch, qos=0)
```

Upon success of twin reported properties update operation above, the publication message from IoT Hub will have the following topic: `$iothub/twin/res/204/?$rid=1&$version=6`, where `204` is the status code indicating success, `$rid=1` corresponds to the request ID provided by the device in the code, and `$version` corresponds to the version of reported properties section of device twins after the update.

For more information, see [Device twins developer's guide][lnk-devguide-twin].

### Receiving desired properties update notifications

When a device is connected, IoT Hub sends notifications to the topic `$iothub/twin/PATCH/properties/desired/?$version={new version}`, which contain the content of the update performed by the solution back end. For example:

```json
{
    "telemetrySendFrequency": "5m",
    "route": null
}
```

As for property updates, `null` values means that the JSON object member is being deleted.

> [!IMPORTANT]
> IoT Hub generates change notifications only when devices are connected. Make sure to implement the [device reconnection flow][lnk-devguide-twin-reconnection] to keep the desired properties synchronized between IoT Hub and the device app.

For more information, see [Device twins developer's guide][lnk-devguide-twin].

### Respond to a direct method

First, a device has to subscribe to `$iothub/methods/POST/#`. IoT Hub sends method requests to the topic `$iothub/methods/POST/{method name}/?$rid={request id}`, with either a valid JSON or an empty body.

To respond, the device sends a message with a valid JSON or empty body to the topic `$iothub/methods/res/{status}/?$rid={request id}`. In this message, the **request ID** must match the one in the request message, and **status** must be an integer.

For more information, see [Direct method developer's guide][lnk-methods].

### Additional considerations

As a final consideration, if you need to customize the MQTT protocol behavior on the cloud side, you should review the [Azure IoT protocol gateway][lnk-azure-protocol-gateway]. This software enables you to deploy a high-performance custom protocol gateway that interfaces directly with IoT Hub. The Azure IoT protocol gateway enables you to customize the device protocol to accommodate brownfield MQTT deployments or other custom protocols. This approach does require, however, that you run and operate a custom protocol gateway.

## Next steps

To learn more about the MQTT protocol, see the [MQTT documentation][lnk-mqtt-docs].

To learn more about planning your IoT Hub deployment, see:

* [Azure Certified for IoT device catalog][lnk-devices]
* [Support additional protocols][lnk-protocols]
* [Compare with Event Hubs][lnk-compare]
* [Scaling, HA, and DR][lnk-scaling]

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide][lnk-devguide]
* [Deploying AI to edge devices with Azure IoT Edge][lnk-iotedge]

[lnk-device-sdks]: https://github.com/Azure/azure-iot-sdks
[lnk-mqtt-org]: http://mqtt.org/
[lnk-mqtt-docs]: http://mqtt.org/documentation
[lnk-sample-node]: https://github.com/Azure/azure-iot-sdk-node/blob/master/device/samples/simple_sample_device.js
[lnk-sample-java]: https://github.com/Azure/azure-iot-sdk-java/blob/master/device/iot-device-samples/send-receive-sample/src/main/java/samples/com/microsoft/azure/sdk/iot/SendReceive.java
[lnk-sample-c]: https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/iothub_client_sample_mqtt_dm
[lnk-sample-csharp]: https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/device/samples
[lnk-sample-python]: https://github.com/Azure/azure-iot-sdk-python/tree/master/device/samples
[lnk-device-explorer]: https://github.com/Azure/azure-iot-sdk-csharp/blob/master/tools/DeviceExplorer
[lnk-sas-tokens]: iot-hub-devguide-security.md#use-sas-tokens-in-a-device-app
[lnk-azure-protocol-gateway]: iot-hub-protocol-gateway.md

[lnk-devices]: https://catalog.azureiotsuite.com/
[lnk-protocols]: iot-hub-protocol-gateway.md
[lnk-compare]: iot-hub-compare-event-hubs.md
[lnk-scaling]: iot-hub-scaling.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-iotedge]: ../iot-edge/tutorial-simulate-device-linux.md
[lnk-x509]: iot-hub-security-x509-get-started.md

[lnk-methods]: iot-hub-devguide-direct-methods.md
[lnk-messaging]: iot-hub-devguide-messaging.md

[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-devguide-twin-reconnection]: iot-hub-devguide-device-twins.md#device-reconnection-flow
[lnk-devguide-twin]: iot-hub-devguide-device-twins.md
[lnk-sdk-c-certs]: https://github.com/Azure/azure-iot-sdk-c/blob/master/certs/certs.c
[lnk-digicert-root-certs]: https://www.digicert.com/digicert-root-certificates.htm
[lnk-paho]: https://pypi.python.org/pypi/paho-mqtt
