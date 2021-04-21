---
title: Understand Azure IoT Hub MQTT support | Microsoft Docs
description: Support for devices connecting to an IoT Hub device-facing endpoint using the MQTT protocol. Includes information about built-in MQTT support in the Azure IoT device SDKs.
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 10/12/2018
ms.author: robinsh
ms.custom: [amqp, mqtt, 'Role: IoT Device', 'Role: Cloud Development', contperf-fy21q1, fasttrack-edit, iot]
---

# Communicate with your IoT hub using the MQTT protocol

IoT Hub enables devices to communicate with the IoT Hub device endpoints using:

* [MQTT v3.1.1](https://mqtt.org/) on port 8883
* MQTT v3.1.1 over WebSocket on port 443.

IoT Hub is not a full-featured MQTT broker and does not support all the behaviors specified in the MQTT v3.1.1 standard. This article describes how devices can use supported MQTT behaviors to communicate with IoT Hub.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

All device communication with IoT Hub must be secured using TLS/SSL. Therefore, IoT Hub doesn't support non-secure connections over port 1883.

## Connecting to IoT Hub

A device can use the MQTT protocol to connect to an IoT hub using any of the following options.

* Libraries in the [Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks).
* The MQTT protocol directly.

The MQTT port (8883) is blocked in many corporate and educational networking environments. If you can't open port 8883 in your firewall, we recommend using MQTT over Web Sockets. MQTT over Web Sockets communicates over port 443, which is almost always open in networking environments. To learn how to specify the MQTT and MQTT over Web Sockets protocols when using the Azure IoT SDKs, see [Using the device SDKs](#using-the-device-sdks).

## Using the device SDKs

[Device SDKs](https://github.com/Azure/azure-iot-sdks) that support the MQTT protocol are available for Java, Node.js, C, C#, and Python. The device SDKs use the standard IoT Hub connection string to establish a connection to an IoT hub. To use the MQTT protocol, the client protocol parameter must be set to **MQTT**. You can also specify MQTT over Web Sockets in the client protocol parameter. By default, the device SDKs connect to an IoT Hub with the **CleanSession** flag set to **0** and use **QoS 1** for message exchange with the IoT hub. While it's possible to configure **QoS 0** for faster message exchange, you should note that the delivery isn't guaranteed nor acknowledged. For this reason, **QoS 0** is often referred as "fire and forget".

When a device is connected to an IoT hub, the device SDKs provide methods that enable the device to exchange messages with an IoT hub.

The following table contains links to code samples for each supported language and specifies the parameter to use to establish a connection to IoT Hub using the MQTT or the MQTT over Web Sockets protocol.

| Language | MQTT protocol parameter | MQTT over Web Sockets protocol parameter
| --- | --- | --- |
| [Node.js](https://github.com/Azure/azure-iot-sdk-node/blob/master/device/samples/simple_sample_device.js) | azure-iot-device-mqtt.Mqtt | azure-iot-device-mqtt.MqttWs |
| [Java](https://github.com/Azure/azure-iot-sdk-java/blob/master/device/iot-device-samples/send-receive-sample/src/main/java/samples/com/microsoft/azure/sdk/iot/SendReceive.java) |[IotHubClientProtocol](/java/api/com.microsoft.azure.sdk.iot.device.iothubclientprotocol).MQTT | IotHubClientProtocol.MQTT_WS |
| [C](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/iothub_client_sample_mqtt_dm) | [MQTT_Protocol](/azure/iot-hub/iot-c-sdk-ref/iothubtransportmqtt-h/mqtt-protocol) | [MQTT_WebSocket_Protocol](/azure/iot-hub/iot-c-sdk-ref/iothubtransportmqtt-websockets-h/mqtt-websocket-protocol) |
| [C#](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/device/samples) | [TransportType](/dotnet/api/microsoft.azure.devices.client.transporttype).Mqtt | TransportType.Mqtt falls back to MQTT over Web Sockets if MQTT fails. To specify MQTT over Web Sockets only, use TransportType.Mqtt_WebSocket_Only |
| [Python](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples) | Supports MQTT by default | Add `websockets=True` in the call to create the client |

The following fragment shows how to specify the MQTT over Web Sockets protocol when using the Azure IoT Node.js SDK:

```javascript
var Client = require('azure-iot-device').Client;
var Protocol = require('azure-iot-device-mqtt').MqttWs;
var client = Client.fromConnectionString(deviceConnectionString, Protocol);
```

The following fragment shows how to specify the MQTT over Web Sockets protocol when using the Azure IoT Python SDK:

```python
from azure.iot.device.aio import IoTHubDeviceClient
device_client = IoTHubDeviceClient.create_from_connection_string(deviceConnectionString, websockets=True)
```

### Default keep-alive timeout

In order to ensure a client/IoT Hub connection stays alive, both the service and the client regularly send a *keep-alive* ping to each other. The client using IoT SDK sends a keep-alive at the interval defined in this table below:

|Language  |Default keep-alive interval  |Configurable  |
|---------|---------|---------|
|Node.js     |   180 seconds      |     No    |
|Java     |    230 seconds     |     No    |
|C     | 240 seconds |  [Yes](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/Iothub_sdk_options.md#mqtt-transport)   |
|C#     | 300 seconds |  [Yes](https://github.com/Azure/azure-iot-sdk-csharp/blob/master/iothub/device/src/Transport/Mqtt/MqttTransportSettings.cs#L89)   |
|Python   | 60 seconds |  No   |

Following the [MQTT spec](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718081), IoT Hub's keep-alive ping interval is 1.5 times the client keep-alive value. However, IoT Hub limits the maximum server-side timeout to 29.45 minutes (1767 seconds) because all Azure services are bound to the Azure load balancer TCP idle timeout, which is 29.45 minutes. 

For example, a device using the Java SDK sends the keep-alive ping, then loses network connectivity. 230 seconds later, the device misses the keep-alive ping because it's offline. However, IoT Hub doesn't close the connection immediately - it waits another `(230 * 1.5) - 230 = 115` seconds before disconnecting the device with the error [404104 DeviceConnectionClosedRemotely](iot-hub-troubleshoot-error-404104-deviceconnectionclosedremotely.md). 

The maximum client keep-alive value you can set is `1767 / 1.5 = 1177` seconds. Any traffic will reset the keep-alive. For example, a successful SAS token refresh resets the keep-alive.

### Migrating a device app from AMQP to MQTT

If you are using the [device SDKs](https://github.com/Azure/azure-iot-sdks), switching from using AMQP to MQTT requires changing the protocol parameter in the client initialization, as stated previously.

When doing so, make sure to check the following items:

* AMQP returns errors for many conditions, while MQTT terminates the connection. As a result your exception handling logic might require some changes.

* MQTT does not support the *reject* operations when receiving [cloud-to-device messages](iot-hub-devguide-messaging.md). If your back-end app needs to receive a response from the device app, consider using [direct methods](iot-hub-devguide-direct-methods.md).

* AMQP is not supported in the Python SDK.

## Example in C using MQTT without an Azure IoT SDK

In the [IoT MQTT Sample repository](https://github.com/Azure-Samples/IoTMQTTSample), you'll find a couple of C/C++ demo projects showing how to send telemetry messages, and receive events with an IoT hub without using the Azure IoT C SDK. 

These samples use the Eclipse Mosquitto library to send messages to the MQTT Broker implemented in the IoT hub.

To learn how to adapt the samples to use the [Azure IoT Plug and Play](../iot-pnp/overview-iot-plug-and-play.md) conventions, see [Tutorial - Use MQTT to develop an IoT Plug and Play device client](../iot-pnp/tutorial-use-mqtt.md).

This repository contains:

**For Windows:**

* TelemetryMQTTWin32: contains code to send a telemetry message to an Azure IoT hub, built and run on a Windows machine.

* SubscribeMQTTWin32: contains code to subscribe to events of a given IoT hub on a Windows machine.

* DeviceTwinMQTTWin32: contains code to query and subscribe to the device twin events of a device in the Azure IoT hub on a Windows machine.

* PnPMQTTWin32: contains code to send a telemetry message with IoT Plug and Play device capabilities to an Azure IoT hub, built and run on a Windows machine. You can read more on [IoT Plug and Play](../iot-pnp/overview-iot-plug-and-play.md)

**For Linux:**

* MQTTLinux: contains code and build script to run on Linux (WSL, Ubuntu, and Raspbian have been tested so far).

* LinuxConsoleVS2019: contains the same code but in a VS2019 project targeting WSL (Windows Linux sub system). This project allows you to debug the code running on Linux step by step from Visual Studio.

**For mosquitto_pub:**

This folder contains two samples commands used with mosquitto_pub utility tool provided by Mosquitto.org.

* Mosquitto_sendmessage: to send a simple text message to an Azure IoT hub acting as a device.

* Mosquitto_subscribe: to see events occurring in an Azure IoT hub.

## Using the MQTT protocol directly (as a device)

If a device cannot use the device SDKs, it can still connect to the public device endpoints using the MQTT protocol on port 8883. In the **CONNECT** packet, the device should use the following values:

* For the **ClientId** field, use the **deviceId**.

* For the **Username** field, use `{iothubhostname}/{device_id}/?api-version=2018-06-30`, where `{iothubhostname}` is the full CName of the IoT hub.

    For example, if the name of your IoT hub is **contoso.azure-devices.net** and if the name of your device is **MyDevice01**, the full **Username** field should contain:

    `contoso.azure-devices.net/MyDevice01/?api-version=2018-06-30`

    It's strongly recommended to include api-version in the field. Otherwise it could cause unexpected behaviors. 
    
* For the **Password** field, use a SAS token. The format of the SAS token is the same as for both the HTTPS and AMQP protocols:

  `SharedAccessSignature sig={signature-string}&se={expiry}&sr={URL-encoded-resourceURI}`

  > [!NOTE]
  > If you use X.509 certificate authentication, SAS token passwords are not required. For more information, see [Set up X.509 security in your Azure IoT Hub](iot-hub-security-x509-get-started.md) and follow code instructions in the [TLS/SSL configuration section](#tlsssl-configuration).

  For more information about how to generate SAS tokens, see the device section of [Using IoT Hub security tokens](iot-hub-devguide-security.md#use-sas-tokens-in-a-device-app).

  When testing, you can also use the cross-platform [Azure IoT Tools for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) or the CLI extension command [az iot hub generate-sas-token](/cli/azure/iot/hub#az_iot_hub_generate_sas_token) to quickly generate a SAS token that you can copy and paste into your own code.

### For Azure IoT Tools

1. Expand the **AZURE IOT HUB DEVICES** tab in the bottom left corner of Visual Studio Code.
  
2. Right-click your device and select **Generate SAS Token for Device**.
  
3. Set **expiration time** and press 'Enter'.
  
4. The SAS token is created and copied to clipboard.

   The SAS token that's generated has the following structure:

   `HostName={your hub name}.azure-devices.net;DeviceId=javadevice;SharedAccessSignature=SharedAccessSignature sr={your hub name}.azure-devices.net%2Fdevices%2FMyDevice01%2Fapi-version%3D2016-11-14&sig=vSgHBMUG.....Ntg%3d&se=1456481802`

   The part of this token to use as the **Password** field to connect using MQTT is:

   `SharedAccessSignature sr={your hub name}.azure-devices.net%2Fdevices%2FMyDevice01%2Fapi-version%3D2016-11-14&sig=vSgHBMUG.....Ntg%3d&se=1456481802`

For MQTT connect and disconnect packets, IoT Hub issues an event on the **Operations Monitoring** channel. This event has additional information that can help you to troubleshoot connectivity issues.

The device app can specify a **Will** message in the **CONNECT** packet. The device app should use `devices/{device_id}/messages/events/` or `devices/{device_id}/messages/events/{property_bag}` as the **Will** topic name to define **Will** messages to be forwarded as a telemetry message. In this case, if the network connection is closed, but a **DISCONNECT** packet was not previously received from the device, then IoT Hub sends the **Will** message supplied in the **CONNECT** packet to the telemetry channel. The telemetry channel can be either the default **Events** endpoint or a custom endpoint defined by IoT Hub routing. The message has the **iothub-MessageType** property with a value of **Will** assigned to it.

## Using the MQTT protocol directly (as a module)

Connecting to IoT Hub over MQTT using a module identity is similar to the device (described [in the section on using the MQTT protocol directly as a device](#using-the-mqtt-protocol-directly-as-a-device)) but you need to use the following:

* Set the client ID to `{device_id}/{module_id}`.

* If authenticating with username and password, set the username to `<hubname>.azure-devices.net/{device_id}/{module_id}/?api-version=2018-06-30` and use the SAS token associated with the module identity as your password.

* Use `devices/{device_id}/modules/{module_id}/messages/events/` as topic for publishing telemetry.

* Use `devices/{device_id}/modules/{module_id}/messages/events/` as WILL topic.

* The twin GET and PATCH topics are identical for modules and devices.

* The twin status topic is identical for modules and devices.

## TLS/SSL configuration

To use the MQTT protocol directly, your client *must* connect over TLS/SSL. Attempts to skip this step fail with connection errors.

In order to establish a TLS connection, you may need to download and reference the DigiCert Baltimore Root Certificate. This certificate is the one that Azure uses to secure the connection. You can find this certificate in the [Azure-iot-sdk-c](https://github.com/Azure/azure-iot-sdk-c/blob/master/certs/certs.c) repository. More information about these certificates can be found on [Digicert's website](https://www.digicert.com/digicert-root-certificates.htm).

An example of how to implement this using the Python version of the [Paho MQTT library](https://pypi.python.org/pypi/paho-mqtt) by the Eclipse Foundation might look like the following.

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
                       device_id + "/?api-version=2018-06-30", password=sas_token)

client.tls_set(ca_certs=path_to_root_cert, certfile=None, keyfile=None,
               cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2, ciphers=None)
client.tls_insecure_set(False)

client.connect(iot_hub_name+".azure-devices.net", port=8883)

client.publish("devices/" + device_id + "/messages/events/", "{id=123}", qos=1)
client.loop_forever()
```

To authenticate using a device certificate, update the code snippet above with the following changes (see [How to get an X.509 CA certificate](./iot-hub-x509ca-overview.md#how-to-get-an-x509-ca-certificate) on how to prepare for certificate-based authentication):

```python
# Create the client as before
# ...

# Set the username but not the password on your client
client.username_pw_set(username=iot_hub_name+".azure-devices.net/" +
                       device_id + "/?api-version=2018-06-30", password=None)

# Set the certificate and key paths on your client
cert_file = "<local path to your certificate file>"
key_file = "<local path to your device key file>"
client.tls_set(ca_certs=path_to_root_cert, certfile=cert_file, keyfile=key_file,
               cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2, ciphers=None)

# Connect as before
client.connect(iot_hub_name+".azure-devices.net", port=8883)
```

## Sending device-to-cloud messages

After making a successful connection, a device can send messages to IoT Hub using `devices/{device_id}/messages/events/` or `devices/{device_id}/messages/events/{property_bag}` as a **Topic Name**. The `{property_bag}` element enables the device to send messages with additional properties in a url-encoded format. For example:

```text
RFC 2396-encoded(<PropertyName1>)=RFC 2396-encoded(<PropertyValue1>)&RFC 2396-encoded(<PropertyName2>)=RFC 2396-encoded(<PropertyValue2>)…
```

> [!NOTE]
> This `{property_bag}` element uses the same encoding as query strings in the HTTPS protocol.

The following is a list of IoT Hub implementation-specific behaviors:

* IoT Hub does not support QoS 2 messages. If a device app publishes a message with **QoS 2**, IoT Hub closes the network connection.

* IoT Hub does not persist Retain messages. If a device sends a message with the **RETAIN** flag set to 1, IoT Hub adds the **mqtt-retain** application property to the message. In this case, instead of persisting the retain message, IoT Hub passes it to the backend app.

* IoT Hub only supports one active MQTT connection per device. Any new MQTT connection on behalf of the same device ID causes IoT Hub to drop the existing connection and **400027 ConnectionForcefullyClosedOnNewConnection** will be logged into IoT Hub Logs


For more information, see [Messaging developer's guide](iot-hub-devguide-messaging.md).

## Receiving cloud-to-device messages

To receive messages from IoT Hub, a device should subscribe using `devices/{device_id}/messages/devicebound/#` as a **Topic Filter**. The multi-level wildcard `#` in the Topic Filter is used only to allow the device to receive additional properties in the topic name. IoT Hub does not allow the usage of the `#` or `?` wildcards for filtering of subtopics. Since IoT Hub is not a general-purpose pub-sub messaging broker, it only supports the documented topic names and topic filters.

The device does not receive any messages from IoT Hub until it has successfully subscribed to its device-specific endpoint, represented by the `devices/{device_id}/messages/devicebound/#` topic filter. After a subscription has been established, the device receives cloud-to-device messages that were sent to it after the time of the subscription. If the device connects with **CleanSession** flag set to **0**, the subscription is persisted across different sessions. In this case, the next time the device connects with **CleanSession 0** it receives any outstanding messages sent to it while disconnected. If the device uses **CleanSession** flag set to **1** though, it does not receive any messages from IoT Hub until it subscribes to its device-endpoint.

IoT Hub delivers messages with the **Topic Name** `devices/{device_id}/messages/devicebound/`, or `devices/{device_id}/messages/devicebound/{property_bag}` when there are message properties. `{property_bag}` contains url-encoded key/value pairs of message properties. Only application properties and user-settable system properties (such as **messageId** or **correlationId**) are included in the property bag. System property names have the prefix **$**, application properties use the original property name with no prefix. For additional details about the format of the property bag, see [Sending device-to-cloud messages](#sending-device-to-cloud-messages).

In cloud-to-device messages, values in the property bag are represented as in the following table:

| Property value | Representation | Description |
|----|----|----|
| `null` | `key` | Only the key appears in the property bag |
| empty string | `key=` | The key followed by an equal sign with no value |
| non-null, non-empty value | `key=value` | The key followed by an equal sign and the value |

The following example shows a property bag that contains three application properties: **prop1** with a value of `null`; **prop2**, an empty string (""); and **prop3** with a value of "a string".

```mqtt
/?prop1&prop2=&prop3=a%20string
```

When a device app subscribes to a topic with **QoS 2**, IoT Hub grants maximum QoS level 1 in the **SUBACK** packet. After that, IoT Hub delivers messages to the device using QoS 1.

## Retrieving a device twin's properties

First, a device subscribes to `$iothub/twin/res/#`, to receive the operation's responses. Then, it sends an empty message to topic `$iothub/twin/GET/?$rid={request id}`, with a populated value for **request ID**. The service then sends a response message containing the device twin data on topic `$iothub/twin/res/{status}/?$rid={request id}`, using the same **request ID** as the request.

Request ID can be any valid value for a message property value, as per the [IoT Hub messaging developer's guide](iot-hub-devguide-messaging.md), and status is validated as an integer.

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
| 429 | Too many requests (throttled), as per [IoT Hub throttling](iot-hub-devguide-quotas-throttling.md) |
| 5** | Server errors |

For more information, see the [Device twins developer's guide](iot-hub-devguide-device-twins.md).

## Update device twin's reported properties

To update reported properties, the device issues a request to IoT Hub via a publication over a designated MQTT topic. After processing the request, IoT Hub responds the success or failure status of the update operation via a publication to another topic. This topic can be subscribed by the device in order to notify it about the result of its twin update request. To implement this type of request/response interaction in MQTT, we leverage the notion of request ID (`$rid`) provided initially by the device in its update request. This request ID is also included in the response from IoT Hub to allow the device to correlate the response to its particular earlier request.

The following sequence describes how a device updates the reported properties in the device twin in IoT Hub:

1. A device must first subscribe to the `$iothub/twin/res/#` topic to receive the operation's responses from IoT Hub.

2. A device sends a message that contains the device twin update to the `$iothub/twin/PATCH/properties/reported/?$rid={request id}` topic. This message includes a **request ID** value.

3. The service then sends a response message that contains the new ETag value for the reported properties collection on topic `$iothub/twin/res/{status}/?$rid={request id}`. This response message uses the same **request ID** as the request.

The request message body contains a JSON document, that contains new values for reported properties. Each member in the JSON document updates or add the corresponding member in the device twin's document. A member set to `null` deletes the member from the containing object. For example:

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
| 429 | Too many requests (throttled), as per [IoT Hub throttling](iot-hub-devguide-quotas-throttling.md) |
| 5** | Server errors |

The python code snippet below, demonstrates the twin reported properties update process over MQTT (using Paho MQTT client):

```python
from paho.mqtt import client as mqtt

# authenticate the client with IoT Hub (not shown here)

client.subscribe("$iothub/twin/res/#")
rid = "1"
twin_reported_property_patch = "{\"firmware_version\": \"v1.1\"}"
client.publish("$iothub/twin/PATCH/properties/reported/?$rid=" +
               rid, twin_reported_property_patch, qos=0)
```

Upon success of twin reported properties update operation above, the publication message from IoT Hub will have the following topic: `$iothub/twin/res/204/?$rid=1&$version=6`, where `204` is the status code indicating success, `$rid=1` corresponds to the request ID provided by the device in the code, and `$version` corresponds to the version of reported properties section of device twins after the update.

For more information, see the [Device twins developer's guide](iot-hub-devguide-device-twins.md).

## Receiving desired properties update notifications

When a device is connected, IoT Hub sends notifications to the topic `$iothub/twin/PATCH/properties/desired/?$version={new version}`, which contain the content of the update performed by the solution back end. For example:

```json
{
    "telemetrySendFrequency": "5m",
    "route": null,
    "$version": 8
}
```

As for property updates, `null` values mean that the JSON object member is being deleted. Also, note that `$version` indicates the new version of the desired properties section of the twin.

> [!IMPORTANT]
> IoT Hub generates change notifications only when devices are connected. Make sure to implement the [device reconnection flow](iot-hub-devguide-device-twins.md#device-reconnection-flow) to keep the desired properties synchronized between IoT Hub and the device app.

For more information, see the [Device twins developer's guide](iot-hub-devguide-device-twins.md).

## Respond to a direct method

First, a device has to subscribe to `$iothub/methods/POST/#`. IoT Hub sends method requests to the topic `$iothub/methods/POST/{method name}/?$rid={request id}`, with either a valid JSON or an empty body.

To respond, the device sends a message with a valid JSON or empty body to the topic `$iothub/methods/res/{status}/?$rid={request id}`. In this message, the **request ID** must match the one in the request message, and **status** must be an integer.

For more information, see the [Direct method developer's guide](iot-hub-devguide-direct-methods.md).

## Additional considerations

As a final consideration, if you need to customize the MQTT protocol behavior on the cloud side, you should review the [Azure IoT protocol gateway](iot-hub-protocol-gateway.md). This software enables you to deploy a high-performance custom protocol gateway that interfaces directly with IoT Hub. The Azure IoT protocol gateway enables you to customize the device protocol to accommodate brownfield MQTT deployments or other custom protocols. This approach does require, however, that you run and operate a custom protocol gateway.

## Next steps

To learn more about the MQTT protocol, see the [MQTT documentation](https://mqtt.org/).

To learn more about planning your IoT Hub deployment, see:

* [Azure Certified for IoT device catalog](https://devicecatalog.azure.com/)
* [Support additional protocols](iot-hub-protocol-gateway.md)
* [Compare with Event Hubs](iot-hub-compare-event-hubs.md)
* [Scaling, HA, and DR](iot-hub-scaling.md)

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide](iot-hub-devguide.md)
* [Deploying AI to edge devices with Azure IoT Edge](../iot-edge/quickstart-linux.md)
