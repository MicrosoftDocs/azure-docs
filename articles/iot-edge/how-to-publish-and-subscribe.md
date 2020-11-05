---
title: Publish and subscribe with Azure IoT Edge | Microsoft Docs
description: Use IoT Edge MQTT broker to publish and subscribe messages
services: iot-edge
keywords: 
author: kgremban

ms.author: kgremban
ms.reviewer: ebertra
ms.date: 11/09/2020
ms.topic: conceptual
ms.service: iot-edge
---

# Publish and subscribe with Azure IoT Edge

You can use Azure IoT Edge MQTT broker to publish and subscribe messages. This article shows you how to connect to this broker, publish and subscribe to messages over user-defined topics and use IoT Hub messaging primitives. The IoT Edge MQTT broker is built-in the IoT Edge hub. For more information, see [the brokering capabilities of the IoT Edge hub](iot-edge-runtime.md).

> [!NOTE]
> IoT Edge MQTT broker is currently in public preview.

## Pre-requisites

- An Azure account with a valid subscription
- [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest&preserve-view=true) with the `azure-iot` CLI extension installed. For more information, see [the Azure IoT extension installation steps for Azure Azure CLI](https://docs.microsoft.com/cli/azure/azure-cli-reference-for-iot).
- An **IoT Hub** of SKU either F1, S1, S2 or S3.
- Have an **IoT Edge device with version 1.2 or above**. Since IoT Edge MQTT broker is currently in public preview, set the following environment variables to true on the edgeHub container to enable the MQTT broker:

    - experimentalFeatures_enabled
    - mqttbroker_enabled

- **Mosquitto clients** installed on the IoT Edge device. This article uses the popular  Moquitto clients that includes [MOSQUITTO_PUB](https://mosquitto.org/man/mosquitto_pub-1.html) and [MOSQUITTO_SUB](https://mosquitto.org/man/mosquitto_sub-1.html). Other MQTT clients could be used instead. To install the Mosquitto clients on an Ubuntu device, run the following command:

    ```cmd
    sudo apt-get update && sudo apt-get install mosquitto-clients
    ```

    Do not install the Mosquitto server since it may cause blocking the MQTT ports (8883 and 1883) and conflict with the IoT Edge hub.

## Connect to IoT Edge hub

Connecting to IoT Edge hub follows the same steps as described in the [connecting to IoT Hub with a generic MQTT client article](../iot-hub/iot-hub-mqtt-support.md) or in the [conceptual description of the IoT Edge hub article](iot-edge-runtime.md). These steps are:

1. Optionally, the MQTT client establishes a *secure connection* with the IoT Edge hub using  Transport Layer Security (TLS)
2. The MQTT client *authenticates* itself to IoT Edge hub
3. The IoT Edge hub *authorizes* the MQTT client per its authorization policy

### Secure connection (TLS)

Transport Layer Security (TLS) is used to establish an encrypted communication between the client and the IoT Edge hub.

To disable TLS, use port 1883(MQTT) and bind the edgeHub container to port 1883.

To enable TLS, If a client connects on port 8883 (MQTTS) to the MQTT broker, a TLS channel will be initiated. The broker sends its certificate chain that the client needs to validate. In order to validate the certificate chain, the root certificate of the MQTT broker must be installed as a trusted certificate on the client. If the root certificate is not trusted, the client library will be rejected by the MQTT broker with a certificate verification error. The steps to follow to install this root certificate of the broker on the client are the same as in the [transparent gateway](how-to-create-transparent-gateway.md) case and are described in the [prepare a downstream device](how-to-connect-downstream-device.md#prepare-a-downstream-device) documentation.

### Authentication

For a MQTT client to authenticate itself, it first needs to send a CONNECT packet to the MQTT broker to initiate a connection in its name. This packet provides three pieces of authentication information: a `client identifier`, a `username` and `password`:

-	The `client identifier` field is the name of the device or module name in IoT Hub. It uses the following syntax:

    - For a device: `<device_name>`

    - For a module: `<device_name>/<module_name>`

   In order to connect to the MQTT broker, a device or a module must be registered in IoT Hub.

   Note that the broker will not allow connecting two clients using the same credentials. The broker will disconnect the already connected client if a second client connects using the same credentials.

- The `username` field is derived from the device or module name, and the IoTHub name the device belongs to using the following syntax:

    - For a device: `<iot_hub_name>.azure-devices.net/<device_name>/?api-version=2018-06-30`

    - For a module: `<iot_hub_name>.azure-devices.net/<device_name>/<module_name>/?api-version=2018-06-30`

- The `password` field of the CONNECT packet depends on the authentication mode:

    - In case of the [symmetric keys authentication](how-to-authenticate-downstream-device.md#symmetric-key-authentication), the `password` field is a SAS token.
    - In case of the [X.509 self-signed authentication](how-to-authenticate-downstream-device.md#x509-self-signed-authentication), the `password` field is not present. In this authentication mode, a TLS channel is required. The client needs to connect to port 8883 to establish a TLS connection. During the TLS handshake, the MQTT broker requests a client certificate. This certificate is used to verify the identity of the client and thus the `password` field is not needed later when the CONNECT packet is sent. Sending both a client certificate and the password field will lead to an error and the connection will be closed. MQTT libraries and TLS client libraries usually have a way to send a client certificate when initiating a connection. You can see a step-by-step example in section [Using X509 Certificate for client authentication](how-to-authenticate-downstream-device.md#using-x509-certificate-for-client-authentication).

Modules deployed by IoT Edge use [symmetric keys authentication](how-to-authenticate-downstream-device.md#symmetric-key-authentication) and can call the local [IoT Edge workload API](https://github.com/Azure/iotedge/blob/40f10950dc65dd955e20f51f35d69dd4882e1618/edgelet/workload/README.md) to programmatically get a SAS token even when offline.

### Authorization

Once a MQTT client is authenticated to IoT Edge hub, it needs to be authorized to connect. Once connected, it needs to be authorized to publish or subscribe on specific topics. These authorizations are granted by the IoT Edge hub based on its authorization policy. The authorization policy is a set of statements expressed as a JSON structure that is sent to the IoT Edge hub via its twin. Edit an IoT Edge hub twin to configure its authorization policy.

> [!NOTE]
> For the public preview, the editing of authorization policies of the MQTT broker is only available via Visual Studio, Visual Studio Code or Azure CLI. The Azure portal currently does not support editing the IoT Edge hub twin and its authorization policy.

Each authorization policy statement consists of the combination of `identities`, `allow` or `deny` effect, `operations`, `resources` and optional `description`:

- `identities` describe the subject of the policy. It must map to the `client identifier` sent by clients in their CONNECT packet.
- `allow` or `deny` effect define whether to allow or deny operations.
- `operations` define the actions to authorize. `connect`, `publish` and `subscribe` are the three supported actions today.
- `resources` define the object of the policy. It can be a topic or a topic pattern defined with [MQTT wildcards](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718107).

<!-- TODO: Ask Vadim if descriptions are supported. Where do they go? -->

Below is an example of an authorization policy that explicitly does not allow "rogue_client" client to connect, allows any Azure IoT clients to connect and allows "sensor_1" to publish to topic `events/alerts`.

```json
{
   "$edgeHub":{
      "properties.desired":{
         "schemaVersion":"1.2",
         "routes":{
            "Route1":"FROM /messages/* INTO $upstream"
         },
         "storeAndForwardConfiguration":{
            "timeToLiveSecs":7200
         },
         "mqttBroker":{
            "authorizations":[
               {
                  "description":"rogue_client is not allowed to connect",
                  "identities":[
                     "rogue_client"
                  ],
                  "deny":[
                     {
                        "operations":[
                           "mqtt:connect"
                        ]
                     }
                  ]
               },
               {
                  "description":"Allow all Azure IoT identities to connect",
                  "identities":[
                     "{{iot:identity}}"
                  ],
                  "allow":[
                     {
                        "operations":[
                           "mqtt:connect"
                        ]
                     }
                  ]
               },
               {
                  "description":"Allow sensor_1 to publish alerts",
                  "identities":[
                     "sensor_1"
                  ],
                  "allow":[
                     {
                        "operations":[
                           "mqtt:publish"
                        ],
                        "resources":[
                           "events/alerts"
                        ]
                     }
                  ]
               }
            ]
         }
      }
   }
}
```

A couple of things to keep in mind when writing your authorization policy:
- It requires `$edgeHub` twin schema version 1.2
- By default, all operations are denied.
- Authorization statements are evaluated in the order than they appear in the JSON definition. It starts by looking at `identities` and then select the first allow or deny statements that match the request. In case of conflicts between allow and deny statements, the deny statement wins.
- Several variables (e.g. substitutions) can be used in the authorization policy:
    - `{{iot:identity}}` represents any clients registered in IoT hub.
    - `{{iot:device_id}}` represents the identity of the currently connected device.
    - `{{iot:module_id}}` represents the identity of the currently connected module.

<!-- TODO: Check with Vadim if it is correct and if we are missing any -->

Authorization for IoT hub topics are handled slightly differently than user-defined topics. Here are the key points to remember:
- Azure IoT devices or modules need an explicit authorization rule to connect to IoT Edge hub MQTT broker. A default authorization policies is provided below.
- Azure IoT devices or modules can access by default to their own IoT hub topics without any explicit authorization rule.
- Azure IoT devices or modules can access the IoT hub topics of other devices or modules providing that appropriate explicit authorization rules are defined.

Here is a default authorization policy that can be used to enable all Azure IoT devices or modules to connect to the broker:

```json
{
   "$edgeHub":{
      "properties.desired":{
         "schemaVersion":"1.2",
         "mqttBroker":{
            "authorizations":[
               {
                  "identities": [
                     "{{iot:identity}}"
                  ],
                  "allow":[
                     {
                        "operations":[
                           "mqtt:connect"
                        ]
                     }
                  ]
               }
            ]
         }
      }
   }
}
```

Now that you understand how to connect to the IoT Edge MQTT broker, let's see how it can be used to publish and subscribe messages first on user-defined topics, then on IoT hub topics and finally to another MQTT broker.

## Publish / Subscribe on user-defined topics

In this article, you'll use one client named **sub_client** that subscribes to a topic and another client named **pub_client** that publishes to a topic. We'll use the [symmetric key authentication](how-to-authenticate-downstream-device.md#symmetric-key-authentication) but the same can be done with [X.509 self-signed authentication](how-to-authenticate-downstream-device.md#x509-self-signed-authentication) or [X.509 self-signed authentication](./how-to-authenticate-downstream-device.md#x509-self-signed-authentication).

### Create publisher and subscriber clients

Create two IoT Devices in IoT Hub, set your IoT Edge device as their parent and get their passwords.
<!-- TODO: Is the parent/child relationship still needed? -->

# [Portal](#tab/azure-portal)

<!--Todo: add portal experience-->

# [Azure CLI](#tab/azure-cli)

1. Create two IoT Devices in IoT Hub, parent them to your IoT Edge device:

```azurecli-interactive
az iot hub device-identity create --device-id  sub_client --hub-name <iot_hub_name> --pd <edge_device_id>
az iot hub device-identity create --device-id  pub_client --hub-name <iot_hub_name> --pd <edge_device_id>
```

2. Get their passwords by generating a SAS token:

- For a device:

   ```azurecli-interactive
   az iot hub generate-sas-token -n <iot_hub_name> -d <device_name> --key-type primary --du 3600
   ```

   where 3600 is the duration of SAS token in seconds (e.g. 3600 = 1 hour).

- For a module:

   ```azurecli-interactive
   az iot hub generate-sas-token -n <iot_hub_name> -d <device_name> -m <module_name> --key-type primary --du 3600
   ```

   where 3600 is the duration of SAS token in seconds (e.g. 3600 = 1 hour).

3. Copy the SAS token which is the value corresponding to the "sas" key from the output. Here is an example output from the Azure CLI command above:

```
{
   "sas": "SharedAccessSignature sr=example.azure-devices.net%2Fdevices%2Fdevice_1%2Fmodules%2Fmodule_a&sig=H5iMq8ZPJBkH3aBWCs0khoTPdFytHXk8VAxrthqIQS0%3D&se=1596249190"
}
```

---

### Authorize publisher and subscriber clients

To authorize the publisher and subscriber, edit the IoT Edge hub twin either via Azure CLI, Visual Studio or Visual Studio code to include the following authorization policy:

```json
{
   "$edgeHub":{
      "properties.desired":{
         "schemaVersion":"1.2",
         "mqttBroker":{
            "authorizations":[
               {
                  "identities": [
                     "{{iot:identity}}"
                  ],
                  "allow":[
                     {
                        "operations":[
                           "mqtt:connect"
                        ]
                     }
                  ]
               },
               {
                  "identities": [
                     "sub_client"
                  ],
                  "allow":[
                     {
                        "operations":[
                           "mqtt:subscribe"
                        ],
                        "resources":[
                           "test_topic"
                        ],
                     }
                  ],
               },
               {
                  "identities": [
                     "pub_client"
                  ],
                  "allow":[
                     {
                        "operations":[
                           "mqtt:publish"
                        ],
                        "resources":[
                           "test_topic"
                        ],
                     }
                  ],
               }
            ]
         }
      }
   }
}
```


### Symmetric keys authentication without TLS

#### Subscribe

Connect your **sub_client** MQTT client to the MQTT broker and subscribe to the `test_topic` by running the following command on your IoT Edge device:

```bash
mosquitto_sub \
    -t "test_topic" \
    -i "sub_client" \
    -u "<iot_hub_name>.azure-devices.net/sub_client/?api-version=2018-06-30" \
    -P "<sas_token>" \
    -h "<edge_device_address>" \
    -V mqttv311 \
    -p 1883
```

where `<edge_device_address>` = `localhost` in this example since the client is running on the same device as IoT Edge.

Note that port 1883 (MQTT), e.g. without TLS, is used in this first example. Another example with port 8883 (MQTTS), e.g. with TLS enabled, is shown in next section.

The **sub_client** MQTT client is now started and is waiting for incoming messages on `test_topic`.

#### Publish

Connect your **pub_client** MQTT client to the MQTT broker and publishes a message on the same `test_topic` as above by running the following command on your IoT Edge device from another terminal:

```bash
mosquitto_pub \
    -t "test_topic" \
    -i "pub_client" \
    -u "<iot_hub_name>.azure-devices.net/pub_client/?api-version=2018-06-30" \
    -P "<sas_token>" \
    -h "<edge_device_address>" \
    -V mqttv311 \
    -p 1883 \
    -m "hello"
```

where `<edge_device_address>` = `localhost` in this example since the client is running on the same device as IoT Edge.

Executing the command, the **sub_client** MQTT client receives the "hello" message.

### Symmetric keys authentication with TLS

To enable TLS, the port must be changed from 1883(MQTT) to 8883(MQTTS) and clients must have the root certificate of the MQTT broker to be able to validate the certificate chain sent by the MQTT broker. This can be done by following the steps provided in section [Secure connection (TLS)](#secure-connection-tls).

Because the clients are running on the same device as the MQTT broker in the example above, the same steps apply to enable TLS just by changing the port number from 1883 (MQTT) to 8883 (MQTTS).

## Publish and subscribe on IoT Hub topics

The [Azure IoT Device SDKs](https://github.com/Azure/azure-iot-sdks) already let clients perform IoT Hub operations but they do not allow publishing / subscribing on user-defined topics. IoT Hub operations can be performed using any MQTT clients using publish / subscribe semantics as long as IoT hub primitives protocols are respected. We'll go through the specificities to understand how these protocols work.

### Send telemetry data to IoT Hub

Sending telemetry data to IoT Hub is similar to publishing on a user-defined topic, but using a specific IoT Hub topic:

- For a device, telemetry is sent on topic: `devices/<device_name>/messages/events`
- For a module, telemetry is sent on topic: `devices/<device_name>/<module_name>/messages/events`

Additionally, create a route such as `FROM /messages/* INTO $upstream` to send telemetry from the IoT Edge MQTT broker to IoT hub. To learn more about routing, see [Declare routes](module-composition.md#declare-routes).

<!--TODO: mention that this is only valid when using AMQP?-->

### Get twin

Getting the device/module twin is not a typical MQTT pattern. The client needs to issue a request for the twin that IoT Hub is going to serve.

In order to receive twins, the client needs to subscribe to an IoT Hub specific topic `$iothub/twin/res/#`. This topic name is inherited from IoT Hub, and all clients need to subscribe to the same topic. It does not mean that devices or modules receive the twin of each other. IoT Hub and IoT Edge hub knows which twin should be delivered where, even if all devices listen to the same topic name. 

Once the subscription is made, the client needs to ask for the twin by publishing a message to an IoT Hub specific topic `$iothub/twin/GET/?rid=<request_id>/#` where  `<request_id>` is an arbitrary identifier. IoT hub will then send its response with the requested data on topic `$iothub/twin/res/200/?rid=<request_id>`, which the client subscribes to. This is how a client can pair its requests with the responses.

### Receive twin patches

To receive twin patches, a client needs to subscribe to special IoTHub topic `$iothub/twin/PATCH/properties/desired/#`. Once the subscription is made, the client receives the twin patches sent by IoT Hub on this topic. 

### Receive direct methods

Receiving a direct method is very similar to receiving full twins with the addition that the client needs to confirm back that it has received the call. First the client subscribe to IoT hub special topic `$iothub/methods/POST/#`. Then once a direct method is received on this topic the client needs to extract the request identifier `rid` from the sub-topic on which the direct method is received and finally publish a confirmation message on IoT hub special topic `$iothub/methods/res/200/<request_id>`.

<!--TODO: how to send direct methods-->

## Publish and subscribe between MQTT brokers

To connect two MQTT brokers such as two IoT Edge devices or an IoT Edge device and a third party MQTT broker,the IoT Edge hub includes a MQTT bridge. A MQTT bridge is commonly used to connect an MQTT broker running at the edge to a remote MQTT broker. Only a subset of the local traffic is typically pushed to a remote broker.

> [!NOTE]
> The IoT Edge hub bridge cannot be used to send data to IoT hub since IoT hub is not a full-featured MQTT broker. To learn more, see [Communicate with your IoT hub using the MQTT protocol](../iot-hub/iot-hub-mqtt-support.md)

<!-- TODO: Ask Varun: do I need to use MQTT as the upstream protocol to use the bridge? -->

The IoT Edge MQTT bridge works as a MQTT client that subscribes and publishes to topics on the other broker. As any other clients, the IoT Edge MQTT bridge needs to be authenticated and authorized to publish and subscribe to the other broker. For the public preview only IoT hub authentication is supported, it limits the other brokers to other IoT Edge devices only. Additionally, a parent / child relationship must be setup for the connection to be authorized.

<!-- TODO: Ask Varun/Vadim: I dont understand why the parent/chidl relationship is needed and why cant an authorization policy be used-->

<!--TODO: dont I also need to set the upstream protocol to MQTT? -->

The IoT Edge MQTT bridge is configured via a JSON structure that is sent to the IoT Edge hub via its twin. Edit an IoT Edge hub twin to configure its MQTT bridge.

> [!NOTE]
> For the public preview, the configuration of the MQTT bridge is only available via Visual Studio, Visual Studio Code or Azure CLI. The Azure portal currently does not support editing the IoT Edge hub twin and its MQTT bridge configuration.

The MQTT bridge can be configured to connect an IoT Edge hub MQTT broker to multiple external brokers. For each external broker, the following settings are required:

- `endpoint` is the address of the remote MQTT broker to connect to. Only parent IoT Edge devices are currently supported and are defined by the variable `$upstream`.
- `settings` defines which topics to bridge for an endpoint. There can be multiple settings per endpoint and the following values are used to configure it:
    - `direction`: either `in` to subscribe to the remote broker's topics or `out` to publish to the remote broker's topics
    - `topic`: core topic pattern to be matched. [MQTT wildcards](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718107) can be used to define this pattern. Different prefixes can be applied to this topic pattern on the local broker and remote broker.
    - `outPrefix`: Prefix that is applied to to the `topic` pattern on the remote broker.
    - `inPrefix`: Prefix that is applied to to the `topic` pattern on the local broker.

Below is an example of an IoT Edge MQTT bridge configuration that republishes all messages received on topics `alerts/#` of a parent IoT Edge device to a child IoT Edge device on the same topics, and republishes all messages sent on topics `/local/telemetry/#` of a child IoT Edge device to a parent IoT Edge device on topics `/remote/messages/#`.

```json
{
	"schemaVersion": "1.2",
	"mqttBroker": {
		"bridges": [{
			"endpoint": "$upstream",
			"settings": [{
					"direction": "in",
					"topic": "alerts/#"
				},
				{
					"direction": "out",
					"topic": "",
					"inPrefix": "/local/telemetry",
					"outPrefix": "/remote/messages"
				}
			]
		}]
	}
}
```

## Next steps

[Understand the IoT Edge hub](iot-edge-runtime.md#iot-edge-hub)


<!-- TODO: add to other sections

## 4. Configure the MQTT Broker

Several settings can be configured to modify the behavior of the MQTT Broker. They are described in this [configuration documentation](MQTTBrokerConfig.md).

Add a section on the peristence of messages

## 5. Troubleshoot

IoT Edge [official troubleshooting guide](https://docs.microsoft.com/azure/iot-edge/troubleshoot) still applies for this private preview. Below are a few more troubleshooting tips specific to the new MQTT broker.

### Check the IoT Edge hub container logs for issues

Since the MQTT broker is part of the IoT Edge hub, its logs are part of the IoT Edge hub module logs. You can get them by using the following command:

```cmd
iotedge logs edgeHub
```

### View the messages going through the MQTT broker

You can view the messages going through the MQTT broker by looking at the verbose logs from the edgeHub container (`iotedge logs edgeHub`) . To turn on verbose logs, set the `RuntimeLogLevel` environment variable to `debug` on the edgeHub container in your deployment manifest.

### I get connection refused when connecting to the broker

Verify that the ports of the IoT Edge hub are properly configured. They are set in the deployment manifest. See section 1 for more details.

### My MQTT client fails to authenticate

This can happen if the generated SAS token has expired. Follow steps in section 2 to generate a new SAS token. -->