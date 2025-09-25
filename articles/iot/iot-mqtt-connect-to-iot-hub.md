---
title: Use MQTT to communicate with Azure IoT Hub
titleSuffix: Azure IoT Hub
description: Guidance on using the MQTT protocol to connect a device to IoT Hub. Includes using the Azure IoT device SDKs and connecting directly using MQTT.
author: dominicbetts
ms.service: azure-iot
services: iot
ms.topic: conceptual
ms.date: 03/19/2025
ms.author: dobett
ms.custom:
  - amqp
  - mqtt
  - "Role: IoT Device"
  - "Role: Cloud Development"
  - iot
  - ignite-2023
---

# Communicate with an IoT hub using the MQTT protocol

This article describes how devices can use the MQTT protocol to communicate with Azure IoT Hub. The IoT Hub device endpoints support device connectivity using:

* [MQTT v3.1.1](https://mqtt.org/) on port 8883
* [MQTT v3.1.1 over WebSocket](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718127) on port 443

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

All device communication with IoT Hub must be secured using TLS. Therefore, IoT Hub doesn't support insecure MQTT connections over port 1883.

## Compare MQTT support in IoT Hub and Event Grid

IoT Hub isn't a full-featured MQTT broker and doesn't support all the behaviors specified in the MQTT v3.1.1 standard. If your solution needs a cloud-hosted MQTT broker, use [Azure Event Grid](../event-grid/mqtt-overview.md) instead. Event Grid enables bi-directional communication between MQTT clients on flexible hierarchical topics using a publish-subscribe messaging model. It also lets you route MQTT messages to other Azure services or custom endpoints for further processing.

The following table summarizes the current differences in MQTT support between the two services:

| IoT Hub | Event Grid |
| ------- | ---------- |
| Client-server model with tight coupling between devices and cloud apps. | Publish-subscribe model that decouples publishers and subscribers. |
| Limited feature support for MQTT v3.1.1. | MQTT v3.1.1 and v5 protocol support. |
| Static, predefined topics. | Custom hierarchical topics with wildcard support. |
| No support for cloud-to-device broadcasts or device-to-device communication. | Supports device-to-cloud, high fan-out cloud-to-device broadcasts, and device-to-device communication patterns. |
| 256-KB max message size. | 512-KB max message size. |

## Connect to IoT Hub

A device can use the MQTT protocol to connect to an IoT hub using one of the following options:

* The [Azure IoT device SDKs](iot-sdks.md).
* The MQTT protocol directly.

Many corporate and educational firewalls block the MQTT port (TCP port 8883). If you can't open port 8883 in your firewall, use MQTT over WebSockets. MQTT over WebSockets communicates over port 443, which is almost always open. To learn how to specify the MQTT and MQTT over WebSockets protocols when using the Azure IoT SDKs, see [Using the device SDKs](#use-the-device-sdks).

## Use the device SDKs

[Azure IoT device SDKs](../iot/iot-sdks.md#device-sdks) that support the MQTT protocol are available for Java, Node.js, C, C#, and Python. The device SDKs use the chosen [authentication mechanism](../iot-hub/iot-concepts-and-iot-hub.md#device-identity-and-authentication) to establish a connection to an IoT hub. To use the MQTT protocol, the client protocol parameter must be set to **MQTT**. You can also specify MQTT over WebSockets in the client protocol parameter. By default, the device SDKs connect to an IoT Hub with the **CleanSession** flag set to **0** and use **QoS 1** for message exchange with the IoT hub. While it's possible to configure **QoS 0** for faster message exchange, you should note that the delivery isn't guaranteed and isn't acknowledged. For this reason, **QoS 0** is often referred as "fire and forget".

When a device connects to an IoT hub, the device SDKs provide methods that enable the device to exchange messages with an IoT hub.

The following table contains links to code samples for each supported language and specifies the parameter to use to establish a connection to IoT Hub using the MQTT or the MQTT over WebSockets protocol.

| Language | MQTT protocol parameter | MQTT over WebSockets protocol parameter |
| --- | --- | --- |
| [Node.js](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/simple_sample_device.js) | azure-iot-device-mqtt.Mqtt | azure-iot-device-mqtt.MqttWs |
| [Java](https://github.com/Azure/azure-iot-sdk-java/blob/main/iothub/device/iot-device-samples/send-receive-sample/src/main/java/samples/com/microsoft/azure/sdk/iot/SendReceive.java) | [IotHubClientProtocol](/java/api/com.microsoft.azure.sdk.iot.device.iothubclientprotocol).MQTT | IotHubClientProtocol.MQTT_WS |
| [C](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/iothub_client_sample_mqtt_dm) | [MQTT_Protocol](https://github.com/Azure/azure-iot-sdk-c/blob/main/iothub_client/inc/iothubtransportmqtt.h) | [MQTT_WebSocket_Protocol](https://github.com/Azure/azure-iot-sdk-c/blob/main/iothub_client/inc/iothubtransportmqtt_websockets.h) |
| [C#](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples) | [TransportType](/dotnet/api/microsoft.azure.devices.client.transporttype).Mqtt | TransportType.Mqtt falls back to MQTT over WebSockets if MQTT fails. To specify MQTT over WebSockets only, use TransportType.Mqtt_WebSocket_Only |
| [Python](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples) | Uses MQTT by default | To create the client, add `websockets=True` in the call |

The following fragment shows how to specify the MQTT over WebSockets protocol when you use the Azure IoT Node.js SDK:

```javascript
var Client = require('azure-iot-device').Client;
var Protocol = require('azure-iot-device-mqtt').MqttWs;
var client = Client.fromConnectionString(deviceConnectionString, Protocol);
```

The following fragment shows how to specify the MQTT over WebSockets protocol when you use the Azure IoT Python SDK:

```python
from azure.iot.device.aio import IoTHubDeviceClient
device_client = IoTHubDeviceClient.create_from_connection_string(deviceConnectionString, websockets=True)
```

[!INCLUDE [iot-authentication-device-connection-string](../../includes/iot-authentication-device-connection-string.md)]

### Default keep-alive time-out

In order to ensure a client connection to an IoT hub connection stays alive, both the service and the client regularly send a *keep-alive* ping to each other. If you use one of the device SDKs, the client sends a keep-alive message at the interval defined in the following table:

|Language  |Default keep-alive interval  |Configurable  |
|---------|---------|---------|
|Node.js     |   180 seconds      |     No    |
|Java     |    230 seconds     |     No   |
|C     | 240 seconds |  [Yes](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/Iothub_sdk_options.md#mqtt-transport)   |
|C#     | 300 seconds* |  [Yes](/dotnet/api/microsoft.azure.devices.client.transport.mqtt.mqtttransportsettings.keepaliveinseconds)   |
|Python   | 60 seconds |  [Yes](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient)   |

*The C# SDK defines the default value of the MQTT KeepAliveInSeconds property as 300 seconds. In reality, the SDK sends a ping request four times per keep-alive duration set. In other words, the SDK sends a keep-alive ping once every 75 seconds.

Following the [MQTT v3.1.1 specification](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718081), IoT Hub's keep-alive ping interval is 1.5 times the client keep-alive value; however, IoT Hub limits the maximum server-side time-out to 29.45 minutes (1,767 seconds).

For example, a device using the Java SDK sends the keep-alive ping, then loses network connectivity. 230 seconds later, the device misses the keep-alive ping because it's offline. However, IoT Hub doesn't close the connection immediately - it waits another `(230 * 1.5) - 230 = 115` seconds before disconnecting the device with the error [404104 DeviceConnectionClosedRemotely](../iot-hub/iot-hub-troubleshoot-error-404104-deviceconnectionclosedremotely.md).

The maximum client keep-alive value you can set is `1767 / 1.5 = 1177` seconds. Any traffic resets the keep-alive. For example, a successful shared access signature (SAS) token refresh resets the keep-alive.

### Migrate a device application from AMQP to MQTT

If you're using the [device SDKs](https://github.com/Azure/azure-iot-sdks), to switch from using AMQP to MQTT requires you to change the protocol parameter in the client initialization.

When you change from AMQP to MQTT, check the following items:

* AMQP returns errors for many conditions, while MQTT terminates the connection. As a result, you might need to change your exception handling logic.

* MQTT doesn't support the *reject* operation when it receives [cloud-to-device messages](../iot-hub/iot-hub-devguide-messaging.md). If your back-end application needs to receive a response from the device application, consider using [direct methods](../iot-hub/iot-hub-devguide-direct-methods.md).

* AMQP isn't supported in the Python SDK.

## Use the MQTT protocol directly from a device

If a device can't use the IoT device SDKs, it can still connect to the public device endpoints using the MQTT protocol on port 8883.

[!INCLUDE [iot-authentication-device-connection-string](../../includes/iot-authentication-device-connection-string.md)]

In the **CONNECT** packet, the device should use the following values:

* For the **ClientId** field, use the **deviceId**.

* For the **Username** field, use `{iotHub-hostname}/{device-id}/?api-version=2021-04-12`, where `{iotHub-hostname}` is the full `CName` of the IoT hub.

    For example, if the name of your IoT hub is **contoso.azure-devices.net** and if the name of your device is **MyDevice01**, the **Username** field contains:

    `contoso.azure-devices.net/MyDevice01/?api-version=2021-04-12`

    To avoid unexpected behavior, include api-version in the field.

* For the **Password** field, use a SAS token. The following snippet shows the format of the SAS token:

    `SharedAccessSignature sig={signature-string}&se={expiry}&sr={URL-encoded-resourceURI}`
  
    > [!NOTE]
    > If you use X.509 certificate authentication, SAS token passwords aren't required. For more information, see [Tutorial: Create and upload certificates for testing](../iot-hub/tutorial-x509-test-certs.md) and follow code instructions in the [TLS configuration section](#tls-configuration).
  
    For more information about how to generate SAS tokens, see the [Use SAS tokens as a device](../iot-hub/iot-hub-dev-guide-sas.md#use-sas-tokens-as-a-device) section of [Control access to IoT Hub using Shared Access Signatures](../iot-hub/iot-hub-dev-guide-sas.md).
  
    You can also use the [Azure IoT Hub extension for Visual Studio Code](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Generate-SAS-Token-for-Device) or the CLI extension command [az iot hub generate-sas-token](/cli/azure/iot/hub#az-iot-hub-generate-sas-token) to generate a SAS token. You can then copy and paste the SAS token into your own code for testing purposes.
  
    The extension generates a SAS token with the following structure:

    `HostName={iotHub-hostname};DeviceId=javadevice;SharedAccessSignature=SharedAccessSignature sr={iotHub-hostname}%2Fdevices%2FMyDevice01%2Fapi-version%3D2016-11-14&sig=vSgHBMUG.....Ntg%3d&se=1456481802`

    The part of this token to use as the **Password** field to connect using MQTT is:

    `SharedAccessSignature sr={iotHub-hostname}%2Fdevices%2FMyDevice01%2Fapi-version%3D2016-11-14&sig=vSgHBMUG.....Ntg%3d&se=1456481802`

The device application can specify a **Will** message in the **CONNECT** packet. The device application should use `devices/{device-id}/messages/events/` or `devices/{device-id}/messages/events/{property-bag}` as the **Will** topic name to define **Will** messages to be forwarded as a telemetry message. In this case, if the network connection is closed, but a **DISCONNECT** packet wasn't previously received from the device, then IoT Hub sends the **Will** message supplied in the **CONNECT** packet to the telemetry channel. The telemetry channel can be either the default **Events** endpoint or a custom endpoint defined by IoT Hub routing. The message has the **iothub-MessageType** property with a value of **Will** assigned to it.

## Use the MQTT protocol directly from a module

You can also connect to IoT Hub over MQTT using a module identity. This approach is similar to connecting as a device but, you need to use the following values:

* Set the client ID to `{device-id}/{module-id}`.

* If authenticating with username and password, set the username to `<hubname>.azure-devices.net/{device_id}/{module_id}/?api-version=2021-04-12`. If you're using SAS, use the SAS token associated with the module identity as your password.

* Use `devices/{device-id}/modules/{module-id}/messages/events/` as a topic for publishing telemetry.

* Use `devices/{device-id}/modules/{module-id}/messages/events/` as the **Will** topic.

* Use `devices/{device-id}/modules/{module-id}/#` as a topic for receiving messages.

* The twin GET and PATCH topics are the same for modules and devices.

* The twin status topic is the same for modules and devices.

For more information about using MQTT with modules, see [IoT Edge hub MQTT endpoint](https://github.com/Azure/iotedge/blob/main/doc/edgehub-api.md#edge-hub-mqtt-endpoint).

## Samples using MQTT without an Azure IoT device SDK

The [IoT MQTT Sample repository](https://github.com/Azure-Samples/IoTMQTTSample) contains C/C++, Python, and CLI samples that show you how to send telemetry messages, receive cloud-to-device messages, and use device twins without using the Azure device SDKs.

The C/C++ samples use the [Eclipse Mosquitto](https://mosquitto.org) library, the Python sample uses [Eclipse Paho](https://projects.eclipse.org/projects/iot.paho), and the CLI samples use `mosquitto_pub`.

To learn more, see [Tutorial - Use MQTT to develop an IoT device client without using a device SDK](./tutorial-use-mqtt.md).

## TLS configuration

To use the MQTT protocol directly, your client must connect over TLS 1.2. Any attempts to skip this step will fail with connection errors.

In order to establish a TLS connection, you might need to download and reference the DigiCert Global Root G2 root certificate that Azure uses. For more information about this certificate, see [Digicert's website](https://www.digicert.com/digicert-root-certificates.htm).

The following example demonstrates how to implement this configuration, by using the Python version of the [Paho MQTT library](https://pypi.python.org/pypi/paho-mqtt).

First, install the Paho library from your command-line environment:

```cmd/sh
pip install paho-mqtt
```

Then, implement the client in a Python script. Replace these placeholders in the following code snippet:

* `<local path to digicert.cer>` is the path to a local file that contains the DigiCert root certificate. You can create this file by copying the certificate information from [certs.c](https://github.com/Azure/azure-iot-sdk-c/blob/master/certs/certs.c) in the Azure IoT SDK for C. Include the lines `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----`, remove the `"` marks at the beginning and end of every line, and remove the `\r\n` characters at the end of every line.

* `<device id from device registry>` is the ID of a device you added to your IoT hub.

* `<generated SAS token>` is a SAS token for the device created as described previously in this article.

* `<iot hub name>` the name of your IoT hub.

```python
from paho.mqtt import client as mqtt
import ssl

path_to_root_cert = "<local path to digicert.cer file>"
device_id = "<device id from device registry>"
sas_token = "<generated SAS token>"
iot_hub_name = "<iot hub name>"


def on_connect(client, userdata, flags, rc):
    print("Device connected with result code: " + str(rc))


def on_disconnect(client, userdata, rc):
    print("Device disconnected with result code: " + str(rc))


def on_publish(client, userdata, mid):
    print("Device sent message")


client = mqtt.Client(client_id=device_id, protocol=mqtt.MQTTv311)

client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_publish = on_publish

client.username_pw_set(username=iot_hub_name+".azure-devices.net/" +
                       device_id + "/?api-version=2021-04-12", password=sas_token)

client.tls_set(ca_certs=path_to_root_cert, certfile=None, keyfile=None,
               cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2, ciphers=None)
client.tls_insecure_set(False)

client.connect(iot_hub_name+".azure-devices.net", port=8883)

client.publish("devices/" + device_id + "/messages/events/", '{"id":123}', qos=1)
client.loop_forever()
```

To authenticate using a device certificate, update the previous code snippet with the changes specified in the following code snippet. For more information about how to prepare for certificate-based authentication, see the [Get an X.509 CA certificate](../iot-hub/authenticate-authorize-x509.md#get-an-x509-ca-certificate) section of [Authenticate identities with X.509 certificates](../iot-hub/authenticate-authorize-x509.md).

```python
# Create the client as before
# ...

# Set the username but not the password on your client
client.username_pw_set(username=iot_hub_name+".azure-devices.net/" +
                       device_id + "/?api-version=2021-04-12", password=None)

# Set the certificate and key paths on your client
cert_file = "<local path to your certificate file>"
key_file = "<local path to your device key file>"
client.tls_set(ca_certs=path_to_root_cert, certfile=cert_file, keyfile=key_file,
               cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2, ciphers=None)

# Connect as before
client.connect(iot_hub_name+".azure-devices.net", port=8883)
```

## Send device-to-cloud messages

After a device connects, it can send messages to IoT Hub using `devices/{device-id}/messages/events/` or `devices/{device-id}/messages/events/{property-bag}` as a **Topic Name**. The `{property-bag}` element enables the device to send messages with other properties in a url-encoded format. For example:

```text
RFC 2396-encoded(<PropertyName1>)=RFC 2396-encoded(<PropertyValue1>)&RFC 2396-encoded(<PropertyName2>)=RFC 2396-encoded(<PropertyValue2>)…
```

This `{property_bag}` element uses the same encoding as query strings in the HTTPS protocol.

If you're routing D2C messages to an Azure Storage account and you want to use JSON encoding, you must specify the Content Type and Content Encoding information, including `$.ct=application%2Fjson&$.ce=utf-8`, as part of the `{property_bag}` mentioned in the previous note.

> [!NOTE]
> The format of these attributes is protocol-specific. IoT Hub translates these attributes into their corresponding system properties. For more information, see the [System properties](../iot-hub/iot-hub-devguide-routing-query-syntax.md#system-properties) section of [IoT Hub message routing query syntax](../iot-hub/iot-hub-devguide-routing-query-syntax.md).

The following list summarizes IoT Hub MQTT implementation-specific behaviors:

* IoT Hub doesn't support QoS 2 messages. If a device application publishes a message with **QoS 2**, IoT Hub closes the network connection.

* IoT Hub doesn't persist `Retain` messages. If a device sends a message with the **RETAIN** flag set to 1, IoT Hub adds the **mqtt-retain** application property to the message. In this case, instead of persisting the retained message, IoT Hub passes it to the backend application.

* IoT Hub only supports one active MQTT connection per device. Any new MQTT connection on behalf of the same device ID causes IoT Hub to drop the existing connection and write **400027 ConnectionForcefullyClosedOnNewConnection** into the IoT Hub logs

* To route messages based on message body, first add property `ct` to the end of the MQTT topic and set its value to `application/json;charset=utf-8` as shown in the following example. For more information about routing messages either based on message properties or message body, see the [IoT Hub message routing query syntax documentation](../iot-hub/iot-hub-devguide-routing-query-syntax.md).

    ```devices/{device-id}/messages/events/$.ct=application%2Fjson%3Bcharset%3Dutf-8```

For more information, see [Send and receive messages with IoT Hub](../iot-hub/iot-hub-devguide-messaging.md).

## Receive cloud-to-device messages

To receive messages from IoT Hub, a device should subscribe using `devices/{device-id}/messages/devicebound/#` as a **Topic Filter**. The multi-level wildcard `#` in the topic filter enables the device to receive more properties in the topic name. IoT Hub doesn't allow the usage of the `#` or `?` wildcards to filter subtopics. IoT Hub isn't a general-purpose publish-subscribe messaging broker, it only supports the documented topic names and topic filters. A device can only subscribe to five topics at a time.

The device doesn't receive any messages from IoT Hub until it successfully subscribes to its device-specific endpoint, represented by the `devices/{device-id}/messages/devicebound/#` topic filter. After a subscription is established, the device receives cloud-to-device messages that were sent to it after the time of the subscription. If the device connects with **CleanSession** flag set to **0**, the subscription is persisted across different sessions. In this case, the next time the device connects with **CleanSession 0** it receives any outstanding messages sent to it while disconnected. If the device uses **CleanSession** flag set to **1** though, it doesn't receive any messages from IoT Hub until it subscribes to its device-endpoint.

IoT Hub delivers messages with the **Topic Name** `devices/{device-id}/messages/devicebound/`, or `devices/{device-id}/messages/devicebound/{property-bag}` when there are message properties. `{property-bag}` contains url-encoded key/value pairs of message properties. Only application properties and user-settable system properties (such as **messageId** or **correlationId**) are included in the property bag. System property names have the prefix **$**, application properties use the original property name with no prefix. For more information about the format of the property bag, see [Sending device-to-cloud messages](#send-device-to-cloud-messages).

In cloud-to-device messages, values in the property bag are represented as in the following table:

| Property value | Representation | Description |
|----|----|----|
| `null` | `key` | Only the key appears in the property bag |
| empty string | `key=` | The key followed by an equal sign with no value |
| non-null, nonempty value | `key=value` | The key followed by an equal sign and the value |

The following example shows a property bag that contains three application properties: **prop1** with a value of `null`; **prop2**, an empty string (""); and **prop3** with a value of "a string".

```mqtt
/?prop1&prop2=&prop3=a%20string
```

When a device application subscribes to a topic with **QoS 2**, IoT Hub grants maximum QoS level 1 in the **SUBACK** packet. After that, IoT Hub delivers messages to the device using QoS 1.

## Retrieve device twin properties

First, a device subscribes to `$iothub/twin/res/#`, to receive the operation's responses. Then, it sends an empty message to topic `$iothub/twin/GET/?$rid={request id}`, with a populated value for **request ID**. The service then sends a response message containing the device twin data on topic `$iothub/twin/res/{status}/?$rid={request-id}`, using the same **request ID** as the request.

The request ID can be any valid value for a message property value, and status is validated as an integer. For more information, see [Send and receive messages with IoT Hub](../iot-hub/iot-hub-devguide-messaging.md). 

The response body contains the properties section of the device twin, as shown in the following response example:

```json
{
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
```

The possible status codes are:

|Status | Description |
| ----- | ----------- |
| 200 | Success |
| 429 | Too many requests (throttled). For more information, see [IoT Hub quotas and throttling](../iot-hub/iot-hub-devguide-quotas-throttling.md) |
| 5** | Server errors |

For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).

## Update device twin's reported properties

To update reported properties, the device issues a request to IoT Hub by publishing to a designated MQTT topic. After IoT Hub processes the request, it responds with the success or failure status of the update operation by publishing to another topic. The device can subscribe to this topic in order to receive notifications about the result of the twin update request. To implement this type of request/response interaction in MQTT, the device provides a request ID (`$rid`) in its initial update request. This request ID is then included in the response from IoT Hub to enable the device to correlate the response to the correct request.

The following sequence describes how a device updates the reported properties in the device twin in IoT Hub:

1. A device first subscribes to the `$iothub/twin/res/#` topic to enable it to receive responses from IoT Hub.

2. A device sends a message that contains the device twin update to the `$iothub/twin/PATCH/properties/reported/?$rid={request-id}` topic. This message includes a **request ID** value.

3. The service then sends a response message that contains the new ETag value for the reported properties collection on topic `$iothub/twin/res/{status}/?$rid={request-id}`. This response message uses the same **request ID** as the request.

The request message body contains a JSON document that contains new values for reported properties. Each member in the JSON document updates or add the corresponding member in the device twin's document. A member set to `null` deletes the member from the containing object. For example:

```json
{
    "telemetrySendFrequency": "35m",
    "batteryLevel": 60
}
```

The possible status codes are:

|Status | Description |
| ----- | ----------- |
| 204 | Success (no content is returned) |
| 400 | Bad Request. Malformed JSON |
| 429 | Too many requests (throttled), as per [IoT Hub quotas and throttling](../iot-hub/iot-hub-devguide-quotas-throttling.md) |
| 5** | Server errors |

The following Python code snippet demonstrates the twin reported properties update process over MQTT using the Paho MQTT client:

```python
from paho.mqtt import client as mqtt

# authenticate the client with IoT Hub (not shown here)

client.subscribe("$iothub/twin/res/#")
rid = "1"
twin_reported_property_patch = "{\"firmware_version\": \"v1.1\"}"
client.publish("$iothub/twin/PATCH/properties/reported/?$rid=" +
               rid, twin_reported_property_patch, qos=0)
```

When the twin reported properties update process succeeds, IoT Hub publishes a message to the following topic: `$iothub/twin/res/204/?$rid=1&$version=6`, where `204` is the status code indicating success, `$rid=1` corresponds to the request ID provided by the device in the code, and `$version` corresponds to the version of reported properties section of device twins after the update.

For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).

## Receive desired properties update notifications

When a device is connected, IoT Hub sends notifications to the topic `$iothub/twin/PATCH/properties/desired/?$version={new-version}`, which contain the content of the update performed by the solution back end. For example:

```json
{
    "telemetrySendFrequency": "5m",
    "route": null,
    "$version": 8
}
```

As for property updates, `null` values mean that the JSON object member is being deleted. Also, `$version` indicates the new version of the desired properties section of the twin.

> [!IMPORTANT]
> IoT Hub generates change notifications only when devices are connected. Make sure to implement the [device reconnection flow](../iot-hub/iot-hub-devguide-device-twins.md#device-reconnection-flow) to keep the desired properties synchronized between IoT Hub and the device application.

For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).

## Respond to a direct method

First, a device subscribes to `$iothub/methods/POST/#`. IoT Hub sends method requests to the topic `$iothub/methods/POST/{method-name}/?$rid={request-id}`, with either a valid JSON or an empty body.

To respond, the device sends a message with a valid JSON or empty body to the topic `$iothub/methods/res/{status}/?$rid={request-id}`. In this message, the **request ID** must match the one in the request message, and **status** must be an integer.

For more information, see [Understand and invoke direct methods from IoT Hub](../iot-hub/iot-hub-devguide-direct-methods.md).

## Next steps

To learn more about using MQTT, see:

* [MQTT documentation](https://mqtt.org/)
* [Tutorial - Use MQTT to develop an IoT device client without using a device SDK](./tutorial-use-mqtt.md)
* [MQTT application samples](https://github.com/Azure-Samples/MqttApplicationSamples)
* [Azure IoT SDKs](iot-sdks.md)
