---
title: Use MQTT to communicate with Azure IoT Hub
titleSuffix: Azure IoT Hub
description: Support for devices that use MQTT to connect to an IoT Hub device-facing endpoint. Includes information about built-in MQTT support in the Azure IoT device SDKs.
author: kgremban
ms.service: iot
services: iot
ms.topic: conceptual
ms.date: 06/27/2023
ms.author: kgremban
ms.custom: [amqp, mqtt, 'Role: IoT Device', 'Role: Cloud Development', iot]
---

# Communicate with an IoT hub using the MQTT protocol

This article describes how devices can use supported MQTT behaviors to communicate with Azure IoT Hub. IoT Hub enables devices to communicate with the IoT Hub device endpoints using:

* [MQTT v3.1.1](https://mqtt.org/) on TCP port 8883
* MQTT v3.1.1 over WebSocket on TCP port 443.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

All device communication with IoT Hub must be secured using TLS/SSL. Therefore, IoT Hub doesn't support nonsecure connections over TCP port 1883.

## Compare MQTT support in IoT Hub and Event Grid

IoT Hub isn't a full-featured MQTT broker and doesn't support all the behaviors specified in the MQTT v3.1.1 standard. If your solution needs MQTT, we recommend [MQTT support in Azure Event Grid](../event-grid/mqtt-overview.md), currently in public preview. Event Grid enables bi-directional communication between MQTT clients on flexible hierarchical topics using a pub-sub messaging model. It also enables you to route MQTT messages to Azure services or custom endpoints for further processing.

The following table explains the differences in MQTT support between the two services:

| IoT Hub | Event Grid |
| ------- | ---------- |
| Client-server model with tight coupling between devices and cloud apps. | Publish-subscribe model that decouples publishers and subscribers. |
| Limited feature support for MQTT v3.1.1, and limited feature support for [MQTT v5 in preview](./iot-mqtt-5-preview.md). More feature support isn't planned. | MQTT v3.1.1 and v5 protocol support, with more feature support and industry compliance planned. |
| Static, predefined topics. | Custom hierarchical topics with wildcard support. |
| No support for cloud-to-device broadcasts and device-to-device communication. | Supports device-to-cloud, high fan-out cloud-to-device broadcasts, and device-to-device communication patterns. |
| 256-kb max message size. | 512-kb max message size. |

## Connecting to IoT Hub

A device can use the MQTT protocol to connect to an IoT hub using one of the following options:

* The [Azure IoT SDKs](iot-sdks.md).
* The MQTT protocol directly.

The MQTT port (TCP port 8883) is blocked in many corporate and educational networking environments. If you can't open port 8883 in your firewall, we recommend using MQTT over WebSockets. MQTT over WebSockets communicates over port 443, which is almost always open in networking environments. To learn how to specify the MQTT and MQTT over WebSockets protocols when using the Azure IoT SDKs, see [Using the device SDKs](#using-the-device-sdks).

## Using the device SDKs

[Device SDKs](https://github.com/Azure/azure-iot-sdks) that support the MQTT protocol are available for Java, Node.js, C, C#, and Python. The device SDKs use the chosen [authentication mechanism](../iot-hub/iot-concepts-and-iot-hub.md#device-identity-and-authentication) to establish a connection to an IoT hub. To use the MQTT protocol, the client protocol parameter must be set to **MQTT**. You can also specify MQTT over WebSockets in the client protocol parameter. By default, the device SDKs connect to an IoT Hub with the **CleanSession** flag set to **0** and use **QoS 1** for message exchange with the IoT hub. While it's possible to configure **QoS 0** for faster message exchange, you should note that the delivery isn't guaranteed nor acknowledged. For this reason, **QoS 0** is often referred as "fire and forget".

When a device is connected to an IoT hub, the device SDKs provide methods that enable the device to exchange messages with an IoT hub.

The following table contains links to code samples for each supported language and specifies the parameter to use to establish a connection to IoT Hub using the MQTT or the MQTT over WebSockets protocol.

| Language | MQTT protocol parameter | MQTT over WebSockets protocol parameter |
| --- | --- | --- |
| [Node.js](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/simple_sample_device.js) | azure-iot-device-mqtt.Mqtt | azure-iot-device-mqtt.MqttWs |
| [Java](https://github.com/Azure/azure-iot-sdk-java/blob/main/iothub/device/iot-device-samples/send-receive-sample/src/main/java/samples/com/microsoft/azure/sdk/iot/SendReceive.java) | [IotHubClientProtocol](/java/api/com.microsoft.azure.sdk.iot.device.iothubclientprotocol).MQTT | IotHubClientProtocol.MQTT_WS |
| [C](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/iothub_client_sample_mqtt_dm) | [MQTT_Protocol](https://github.com/Azure/azure-iot-sdk-c/blob/main/iothub_client/inc/iothubtransportmqtt.h) | [MQTT_WebSocket_Protocol](https://github.com/Azure/azure-iot-sdk-c/blob/main/iothub_client/inc/iothubtransportmqtt_websockets.h) |
| [C#](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples) | [TransportType](/dotnet/api/microsoft.azure.devices.client.transporttype).Mqtt | TransportType.Mqtt falls back to MQTT over WebSockets if MQTT fails. To specify MQTT over WebSockets only, use TransportType.Mqtt_WebSocket_Only |
| [Python](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples) | Supports MQTT by default | Add `websockets=True` in the call to create the client |

The following fragment shows how to specify the MQTT over WebSockets protocol when using the Azure IoT Node.js SDK:

```javascript
var Client = require('azure-iot-device').Client;
var Protocol = require('azure-iot-device-mqtt').MqttWs;
var client = Client.fromConnectionString(deviceConnectionString, Protocol);
```

The following fragment shows how to specify the MQTT over WebSockets protocol when using the Azure IoT Python SDK:

```python
from azure.iot.device.aio import IoTHubDeviceClient
device_client = IoTHubDeviceClient.create_from_connection_string(deviceConnectionString, websockets=True)
```

### Default keep-alive timeout

In order to ensure a client/IoT Hub connection stays alive, both the service and the client regularly send a *keep-alive* ping to each other. The client using IoT SDK sends a keep-alive at the interval defined in the following table:

|Language  |Default keep-alive interval  |Configurable  |
|---------|---------|---------|
|Node.js     |   180 seconds      |     No    |
|Java     |    230 seconds     |     [Yes](https://github.com/Azure/azure-iot-sdk-java/blob/main/iothub/device/iot-device-client/src/main/java/com/microsoft/azure/sdk/iot/device/ClientOptions.java#L64)    |
|C     | 240 seconds |  [Yes](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/Iothub_sdk_options.md#mqtt-transport)   |
|C#     | 300 seconds* |  [Yes](/dotnet/api/microsoft.azure.devices.client.transport.mqtt.mqtttransportsettings.keepaliveinseconds)   |
|Python   | 60 seconds |  [Yes](https://github.com/Azure/azure-iot-sdk-python/blob/v2/azure-iot-device/azure/iot/device/iothub/abstract_clients.py#L343)   |

*The C# SDK defines the default value of the MQTT KeepAliveInSeconds property as 300 seconds. In reality, the SDK sends a ping request four times per keep-alive duration set. In other words, the SDK sends a keep-alive ping once every 75 seconds.

Following the [MQTT v3.1.1 specification](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718081), IoT Hub's keep-alive ping interval is 1.5 times the client keep-alive value; however, IoT Hub limits the maximum server-side timeout to 29.45 minutes (1767 seconds). This limit exists because all Azure services are bound to the Azure load balancer TCP idle timeout, which is 29.45 minutes. 

For example, a device using the Java SDK sends the keep-alive ping, then loses network connectivity. 230 seconds later, the device misses the keep-alive ping because it's offline. However, IoT Hub doesn't close the connection immediately - it waits another `(230 * 1.5) - 230 = 115` seconds before disconnecting the device with the error [404104 DeviceConnectionClosedRemotely](../iot-hub/iot-hub-troubleshoot-error-404104-deviceconnectionclosedremotely.md). 

The maximum client keep-alive value you can set is `1767 / 1.5 = 1177` seconds. Any traffic resets the keep-alive. For example, a successful shared access signature (SAS) token refresh resets the keep-alive.

### Migrating a device app from AMQP to MQTT

If you're using the [device SDKs](https://github.com/Azure/azure-iot-sdks), switching from using AMQP to MQTT requires changing the protocol parameter in the client initialization, as stated previously.

When doing so, make sure to check the following items:

* AMQP returns errors for many conditions, while MQTT terminates the connection. As a result your exception handling logic might require some changes.

* MQTT doesn't support the *reject* operations when receiving [cloud-to-device messages](../iot-hub/iot-hub-devguide-messaging.md). If your back-end app needs to receive a response from the device app, consider using [direct methods](../iot-hub/iot-hub-devguide-direct-methods.md).

* AMQP isn't supported in the Python SDK.

## Using the MQTT protocol directly (as a device)

If a device can't use the device SDKs, it can still connect to the public device endpoints using the MQTT protocol on port 8883. 

In the **CONNECT** packet, the device should use the following values:

* For the **ClientId** field, use the **deviceId**.

* For the **Username** field, use `{iotHub-hostname}/{device-id}/?api-version=2021-04-12`, where `{iotHub-hostname}` is the full `CName` of the IoT hub.

    For example, if the name of your IoT hub is **contoso.azure-devices.net** and if the name of your device is **MyDevice01**, the full **Username** field should contain:

    `contoso.azure-devices.net/MyDevice01/?api-version=2021-04-12`

    It's recommended to include api-version in the field. Otherwise it could cause unexpected behaviors. 

* For the **Password** field, use a SAS token. The format of the SAS token is the same as for both the HTTPS and AMQP protocols:

  `SharedAccessSignature sig={signature-string}&se={expiry}&sr={URL-encoded-resourceURI}`

  > [!NOTE]
  > If you use X.509 certificate authentication, SAS token passwords are not required. For more information, see [Tutorial: Create and upload certificates for testing](../iot-hub/tutorial-x509-test-certs.md) and follow code instructions in the [TLS/SSL configuration section](#tlsssl-configuration).

  For more information about how to generate SAS tokens, see the [Use SAS tokens as a device](../iot-hub/iot-hub-dev-guide-sas.md#use-sas-tokens-as-a-device) section of [Control access to IoT Hub using Shared Access Signatures](../iot-hub/iot-hub-dev-guide-sas.md).

  You can also use the cross-platform [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) or the CLI extension command [az iot hub generate-sas-token](/cli/azure/iot/hub#az-iot-hub-generate-sas-token) to quickly generate a SAS token. You can then copy and paste the SAS token into your own code for testing purposes.

For a tutorial on using MQTT directly, see [Use MQTT to develop an IoT device client without using a device SDK](../iot-develop/tutorial-use-mqtt.md).

### Using the Azure IoT Hub extension for Visual Studio Code
  
1. In the side bar, expand the **Devices** node under the **Azure IoT Hub** section.

1. Right-click your IoT device and select **Generate SAS Token for Device** from the context menu. 
  
1. Enter the expiration time, in hours, for the SAS token in the input box, and then select the Enter key.
  
1. The SAS token is created and copied to clipboard.

   The SAS token that's generated has the following structure:

   `HostName={iotHub-hostname};DeviceId=javadevice;SharedAccessSignature=SharedAccessSignature sr={iotHub-hostname}%2Fdevices%2FMyDevice01%2Fapi-version%3D2016-11-14&sig=vSgHBMUG.....Ntg%3d&se=1456481802`

   The part of this token to use as the **Password** field to connect using MQTT is:

   `SharedAccessSignature sr={iotHub-hostname}%2Fdevices%2FMyDevice01%2Fapi-version%3D2016-11-14&sig=vSgHBMUG.....Ntg%3d&se=1456481802`

The device app can specify a **Will** message in the **CONNECT** packet. The device app should use `devices/{device-id}/messages/events/` or `devices/{device-id}/messages/events/{property-bag}` as the **Will** topic name to define **Will** messages to be forwarded as a telemetry message. In this case, if the network connection is closed, but a **DISCONNECT** packet wasn't previously received from the device, then IoT Hub sends the **Will** message supplied in the **CONNECT** packet to the telemetry channel. The telemetry channel can be either the default **Events** endpoint or a custom endpoint defined by IoT Hub routing. The message has the **iothub-MessageType** property with a value of **Will** assigned to it.

## Using the MQTT protocol directly (as a module)

You can connect to IoT Hub over MQTT using a module identity, similar to connecting to IoT Hub as a device. For more information about connecting to IoT Hub over MQTT as a device, see [Using the MQTT protocol directly (as a device)](#using-the-mqtt-protocol-directly-as-a-device). However, you need to use the following values:

* Set the client ID to `{device-id}/{module-id}`.

* If authenticating with username and password, set the username to `<hubname>.azure-devices.net/{device_id}/{module_id}/?api-version=2021-04-12` and use the SAS token associated with the module identity as your password.

* Use `devices/{device-id}/modules/{module-id}/messages/events/` as a topic for publishing telemetry.

* Use `devices/{device-id}/modules/{module-id}/messages/events/` as WILL topic.

* Use `devices/{device-id}/modules/{module-id}/#` as a topic for receiving messages.

* The twin GET and PATCH topics are identical for modules and devices.

* The twin status topic is identical for modules and devices.

For more information about using MQTT with modules, see [Publish and subscribe with IoT Edge](../iot-edge/how-to-publish-subscribe.md) and learn more about the [IoT Edge hub MQTT endpoint](https://github.com/Azure/iotedge/blob/main/doc/edgehub-api.md#edge-hub-mqtt-endpoint).

## Samples using MQTT without an Azure IoT SDK

The [IoT MQTT Sample repository](https://github.com/Azure-Samples/IoTMQTTSample) contains C/C++, Python, and CLI samples that show you how to send telemetry messages, receive cloud-to-device messages, and use device twins without using the Azure device SDKs.

The C/C++ samples use the [Eclipse Mosquitto](https://mosquitto.org) library, the Python sample uses [Eclipse Paho](https://www.eclipse.org/paho/), and the CLI samples use `mosquitto_pub`.

To learn more, see [Tutorial - Use MQTT to develop an IoT device client](../iot-develop/tutorial-use-mqtt.md).

## TLS/SSL configuration

To use the MQTT protocol directly, your client *must* connect over TLS/SSL. Attempts to skip this step fail with connection errors.

In order to establish a TLS connection, you may need to download and reference the DigiCert root certificate that Azure uses. Between February 15 and October 15, 2023, Azure IoT Hub is migrating its TLS root certificate from the DigiCert Baltimore Root Certificate to the DigiCert Global Root G2. During the migration period, you should have both certificates on your devices to ensure connectivity. For more information about the migration, see [Migrate IoT resources to a new TLS certificate root](../iot-hub/migrate-tls-certificate.md) For more information about these certificates, see [Digicert's website](https://www.digicert.com/digicert-root-certificates.htm).

The following example demonstrates how to implement this configuration, by using the Python version of the [Paho MQTT library](https://pypi.python.org/pypi/paho-mqtt) by the Eclipse Foundation.

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

To authenticate using a device certificate, update the previous code snippet with the changes specified in the following code snippet. For more information about how to prepare for certificate-based authentication, see the [Get an X.509 CA certificate](../iot-hub/iot-hub-x509ca-overview.md#get-an-x509-ca-certificate) section of [Authenticate devices using X.509 CA certificates](../iot-hub/iot-hub-x509ca-overview.md).

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

## Sending device-to-cloud messages

After a device connects, it can send messages to IoT Hub using `devices/{device-id}/messages/events/` or `devices/{device-id}/messages/events/{property-bag}` as a **Topic Name**. The `{property-bag}` element enables the device to send messages with other properties in a url-encoded format. For example:

```text
RFC 2396-encoded(<PropertyName1>)=RFC 2396-encoded(<PropertyValue1>)&RFC 2396-encoded(<PropertyName2>)=RFC 2396-encoded(<PropertyValue2>)…
```

> [!NOTE]
> This `{property_bag}` element uses the same encoding as query strings in the HTTPS protocol.

> [!NOTE]
> If you're routing D2C messages to an Azure Storage account and you want to leverage JSON encoding, you must specify the Content Type and Content Encoding information, including `$.ct=application%2Fjson&$.ce=utf-8`, as part of the `{property_bag}` mentioned in the previous note. 
> 
> The format of these attributes are protocol-specific. IoT Hub translates these attributes into their corresponding system properties. For more information, see the [System properties](../iot-hub/iot-hub-devguide-routing-query-syntax.md#system-properties) section of [IoT Hub message routing query syntax](../iot-hub/iot-hub-devguide-routing-query-syntax.md#system-properties).

The following list describes IoT Hub implementation-specific behaviors:

* IoT Hub doesn't support QoS 2 messages. If a device app publishes a message with **QoS 2**, IoT Hub closes the network connection.

* IoT Hub doesn't persist Retain messages. If a device sends a message with the **RETAIN** flag set to 1, IoT Hub adds the **mqtt-retain** application property to the message. In this case, instead of persisting the retain message, IoT Hub passes it to the backend app.

* IoT Hub only supports one active MQTT connection per device. Any new MQTT connection on behalf of the same device ID causes IoT Hub to drop the existing connection and **400027 ConnectionForcefullyClosedOnNewConnection** is logged into IoT Hub Logs

* To route messages based on message body, you must first add property 'contentType' (`ct`) to the end of the MQTT topic and set its value to be `application/json;charset=utf-8` as shown in the following example. For more information about routing messages either based on message properties or message body, see the [IoT Hub message routing query syntax documentation](../iot-hub/iot-hub-devguide-routing-query-syntax.md).

    ```devices/{device-id}/messages/events/$.ct=application%2Fjson%3Bcharset%3Dutf-8```

For more information, see [Send device-to-cloud and cloud-to-device messages with IoT Hub](../iot-hub/iot-hub-devguide-messaging.md).

## Receiving cloud-to-device messages

To receive messages from IoT Hub, a device should subscribe using `devices/{device-id}/messages/devicebound/#` as a **Topic Filter**. The multi-level wildcard `#` in the Topic Filter is used only to allow the device to receive more properties in the topic name. IoT Hub doesn't allow the usage of the `#` or `?` wildcards for filtering of subtopics. Since IoT Hub isn't a general-purpose pub-sub messaging broker, it only supports the documented topic names and topic filters. A device can only subscribe to five topics at a time.

The device doesn't receive any messages from IoT Hub until it has successfully subscribed to its device-specific endpoint, represented by the `devices/{device-id}/messages/devicebound/#` topic filter. After a subscription has been established, the device receives cloud-to-device messages that were sent to it after the time of the subscription. If the device connects with **CleanSession** flag set to **0**, the subscription is persisted across different sessions. In this case, the next time the device connects with **CleanSession 0** it receives any outstanding messages sent to it while disconnected. If the device uses **CleanSession** flag set to **1** though, it doesn't receive any messages from IoT Hub until it subscribes to its device-endpoint.

IoT Hub delivers messages with the **Topic Name** `devices/{device-id}/messages/devicebound/`, or `devices/{device-id}/messages/devicebound/{property-bag}` when there are message properties. `{property-bag}` contains url-encoded key/value pairs of message properties. Only application properties and user-settable system properties (such as **messageId** or **correlationId**) are included in the property bag. System property names have the prefix **$**, application properties use the original property name with no prefix. For more information about the format of the property bag, see [Sending device-to-cloud messages](#sending-device-to-cloud-messages).

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

When a device app subscribes to a topic with **QoS 2**, IoT Hub grants maximum QoS level 1 in the **SUBACK** packet. After that, IoT Hub delivers messages to the device using QoS 1.

## Retrieving a device twin's properties

First, a device subscribes to `$iothub/twin/res/#`, to receive the operation's responses. Then, it sends an empty message to topic `$iothub/twin/GET/?$rid={request id}`, with a populated value for **request ID**. The service then sends a response message containing the device twin data on topic `$iothub/twin/res/{status}/?$rid={request-id}`, using the same **request ID** as the request.

The request ID can be any valid value for a message property value, and status is validated as an integer. For more information, see [Send device-to-cloud and cloud-to-device messages with IoT Hub](../iot-hub/iot-hub-devguide-messaging.md). 

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
| 429 | Too many requests (throttled). For more information, see [IoT Hub throttling](../iot-hub/iot-hub-devguide-quotas-throttling.md) |
| 5** | Server errors |

For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).

## Update device twin's reported properties

To update reported properties, the device issues a request to IoT Hub via a publication over a designated MQTT topic. After IoT Hub processes the request, it responds the success or failure status of the update operation via a publication to another topic. The device can subscribe to this topic in order to notify it about the result of its twin update request. To implement this type of request/response interaction in MQTT, we use the notion of request ID (`$rid`) provided initially by the device in its update request. This request ID is also included in the response from IoT Hub to allow the device to correlate the response to its particular earlier request.

The following sequence describes how a device updates the reported properties in the device twin in IoT Hub:

1. A device must first subscribe to the `$iothub/twin/res/#` topic to receive the operation's responses from IoT Hub.

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
| 429 | Too many requests (throttled), as per [IoT Hub throttling](../iot-hub/iot-hub-devguide-quotas-throttling.md) |
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

Upon success of the twin reported properties update process in the previous code snippet, the publication message from IoT Hub has the following topic: `$iothub/twin/res/204/?$rid=1&$version=6`, where `204` is the status code indicating success, `$rid=1` corresponds to the request ID provided by the device in the code, and `$version` corresponds to the version of reported properties section of device twins after the update.

For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).

## Receiving desired properties update notifications

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
> IoT Hub generates change notifications only when devices are connected. Make sure to implement the [device reconnection flow](../iot-hub/iot-hub-devguide-device-twins.md#device-reconnection-flow) to keep the desired properties synchronized between IoT Hub and the device app.

For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).

## Respond to a direct method

First, a device has to subscribe to `$iothub/methods/POST/#`. IoT Hub sends method requests to the topic `$iothub/methods/POST/{method-name}/?$rid={request-id}`, with either a valid JSON or an empty body.

To respond, the device sends a message with a valid JSON or empty body to the topic `$iothub/methods/res/{status}/?$rid={request-id}`. In this message, the **request ID** must match the one in the request message, and **status** must be an integer.

For more information, see [Understand and invoke direct methods from IoT Hub](../iot-hub/iot-hub-devguide-direct-methods.md).

## Next steps

To learn more about using MQTT, see: 

* [MQTT documentation](https://mqtt.org/)
* [Use MQTT to develop an IoT device client without using a device SDK](../iot-develop/tutorial-use-mqtt.md)
* [MQTT application samples](https://github.com/Azure-Samples/MqttApplicationSamples)

To learn more about using IoT device SDKS, see:
* [Azure IoT SDKs](iot-sdks.md)

To learn more about planning your IoT Hub deployment, see:

* [Azure Certified Device Catalog](https://devicecatalog.azure.com/)
* [How an IoT Edge device can be used as a gateway](../iot-edge/iot-edge-as-gateway.md)
* [Connecting IoT Devices to Azure: IoT Hub and Event Hubs](../iot-hub/iot-hub-compare-event-hubs.md)
* [Choose the right IoT Hub tier for your solution](../iot-hub/iot-hub-scaling.md)

