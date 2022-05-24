---
title: Publish and subscribe with Azure IoT Edge | Microsoft Docs
description: Use IoT Edge MQTT broker to publish and subscribe messages
services: iot-edge
keywords: 
author: PatAltimore
ms.author: patricka
ms.reviewer: ebertra
ms.date: 11/30/2021
ms.topic: conceptual
ms.service: iot-edge
monikerRange: ">=iotedge-2020-11"
---

# Publish and subscribe with Azure IoT Edge (preview)

[!INCLUDE [iot-edge-version-202011](../../includes/iot-edge-version-202011.md)]

You can use Azure IoT Edge MQTT broker to publish and subscribe to messages. This article shows you how to connect to this broker, publish and subscribe to messages over user-defined topics, and use IoT Hub messaging primitives. The IoT Edge MQTT broker is built in the IoT Edge hub. For more information, see [the brokering capabilities of the IoT Edge hub](iot-edge-runtime.md).

> [!NOTE]
> IoT Edge MQTT broker (currently in public preview) is being retired after the v1.2. We appreciate the feedback we received on the preview, and we are continuing to refine our plans for an MQTT broker. In the meantime, if you need a standards-compliant MQTT broker on IoT Edge, consider deploying an open-source broker like [Mosquitto](https://mosquitto.org/) as an IoT Edge module.

## Prerequisites

- An Azure account with a valid subscription.
- [Azure CLI](/cli/azure/) with the `azure-iot` CLI extension installed. For more information, see [the Azure IoT extension installation steps for Azure CLI](/cli/azure/azure-cli-reference-for-iot).
- An **IoT Hub** of SKU either F1, S1, S2, or S3.
- Have an **IoT Edge device** with version 1.2 or above. The device should include edgeAgent and edgeHub modules version 1.2 or above deployed, with the MQTT broker feature turned on and the edgeHub port 1883 bound to the host to enable non-TLS connections. For more information on automatically deploying IoT Edge 1.2 in an Azure VM, see [Run Azure IoT Edge on Ubuntu Virtual Machines](how-to-install-iot-edge-ubuntuvm.md). Since IoT Edge MQTT broker is currently in public preview, you need to also set the `experimentalFeatures__enabled` and `experimentalFeatures__mqttBrokerEnabled` environment variables to `true` on the edgeHub module to enable the MQTT broker.

   To quickly create an IoT Edge deployment that meets these criteria along with an open authorization policy on the `test_topic`, you can use the [sample deployment manifest](#appendix---sample-deployment-manifest) at the end of this article and follow these steps:

   1. Save the deployment file to your working folder.

   2. Apply this deployment to your IoT Edge device using the following Azure CLI command:

    ```azurecli
    az iot edge set-modules --device-id <device_id> --hub-name <hub_name> --content <deployment_file_path>
    ```

    For more information about this command, see [Deploy Azure IoT Edge modules with Azure CLI](how-to-deploy-modules-cli.md).

- **Mosquitto clients** installed on the IoT Edge device. This article uses the popular Mosquitto clients [MOSQUITTO_PUB](https://mosquitto.org/man/mosquitto_pub-1.html) and [MOSQUITTO_SUB](https://mosquitto.org/man/mosquitto_sub-1.html). Other MQTT clients could be used instead. To install the Mosquitto clients on an Ubuntu device, run the following command:

    ```cmd
    sudo apt-get update && sudo apt-get install mosquitto-clients
    ```

    > [!WARNING]
    > Don't install the Mosquitto server since it may block the MQTT ports (8883 and 1883) and conflict with the IoT Edge hub.

## Connect to IoT Edge hub

Connecting to IoT Edge hub follows the same steps as described in [Connecting to IoT Hub](../iot-hub/iot-hub-mqtt-support.md#connecting-to-iot-hub) or in [Connecting to the IoT Edge hub](../iot-edge/iot-edge-runtime.md#connecting-to-the-iot-edge-hub). These steps are:

1. Optionally, the MQTT client establishes a *secure connection* with the IoT Edge hub using Transport Layer Security (TLS).
2. The MQTT client *authenticates* itself to IoT Edge hub.
3. The IoT Edge hub *authorizes* the MQTT client per its authorization policy.

### Secure connection (TLS)

TLS is used to establish encrypted communication between the client and the IoT Edge hub.

- To *disable* TLS: use port 1883 (MQTT) and bind the edgeHub container to port 1883.

- To *enable* TLS: if a client connects on port 8883 (MQTTS) to the MQTT broker, a TLS channel will be initiated. The broker sends its certificate chain to be validated by the client. To validate the certificate chain, the root certificate of the MQTT broker must be installed as a trusted certificate on the client. If the root certificate isn't trusted, the client library will be rejected by the MQTT broker with a certificate verification error. The steps to install the root certificate of the broker on the client are the same as in the [transparent gateway](how-to-create-transparent-gateway.md) case and are described in the [Prepare a downstream device](how-to-connect-downstream-device.md#prepare-a-downstream-device) section of *How-to: Connect a downstream device to an Azure IoT Edge gateway*.

### Authentication

To authenticate itself, the MQTT client first needs to send a CONNECT packet to the MQTT broker to start a connection in its name. This packet provides three pieces of authentication information: a `client identifier`, a `username`, and a `password`:

- The `client identifier` field is the name of the device or module name in IoT Hub. It uses the following syntax:

  - For a device: `<device_name>`

  - For a module: `<device_name>/<module_name>`

   To connect to the MQTT broker, a device or a module must be registered in IoT Hub.

   The broker won't allow connections from multiple clients using the same credentials. The broker will disconnect the client that's already connected if a second client connects using the same credentials.

- The `username` field is derived from the device or module name, and the IoT hub name that the device belongs to. It uses the following syntax:

  - For a device: `<iot_hub_name>.azure-devices.net/<device_name>/?api-version=2018-06-30`

  - For a module: `<iot_hub_name>.azure-devices.net/<device_name>/<module_name>/?api-version=2018-06-30`

- The `password` field of the CONNECT packet depends on the authentication mode:

  - When using [symmetric keys authentication](how-to-authenticate-downstream-device.md#symmetric-key-authentication), the `password` field is a SAS token.
  - When using [X.509 self-signed authentication](how-to-authenticate-downstream-device.md#x509-self-signed-authentication), the `password` field isn't present. In this authentication mode, a TLS channel is required. The client needs to connect to port 8883 to establish a TLS connection. During the TLS handshake, the MQTT broker requests a client certificate. This certificate is used to verify the identity of the client and so the `password` field isn't needed later when the CONNECT packet is sent. Sending both a client certificate and the password field will lead to an error and the connection will be closed. MQTT libraries and TLS client libraries usually have a way to send a client certificate when starting a connection. You can see a step-by-step example in the [X.509 self-signed authentication](how-to-authenticate-downstream-device.md#x509-self-signed-authentication) section of *How-to: Authenticate a downstream device to Azure IoT Hub*.

Modules deployed by IoT Edge use [symmetric keys authentication](how-to-authenticate-downstream-device.md#symmetric-key-authentication) and can call the local [IoT Edge workload API](https://github.com/Azure/iotedge/blob/40f10950dc65dd955e20f51f35d69dd4882e1618/edgelet/workload/README.md) to programmatically get a SAS token even when offline.

### Authorization

Once an MQTT client is authenticated to an IoT Edge hub, it needs to be authorized to connect. Once connected, it needs to be authorized to publish or subscribe to specific topics. These authorizations are granted by the IoT Edge hub based on its authorization policy. The authorization policy is a set of statements expressed as a JSON structure that is sent to the IoT Edge hub via its twin. Edit an IoT Edge hub twin to configure its authorization policy.

> [!NOTE]
> For the public preview, only the Azure CLI supports deployments containing MQTT broker authorization policies. The Azure portal currently doesn't support editing the IoT Edge hub twin and its authorization policy.

Each authorization policy statement consists of the combination of `identities`, `allow` or `deny` effects, `operations`, and `resources`:

- `identities` describe the subject of the policy. It must map to the `username` sent by clients in their CONNECT packet and be in the format of `<iot_hub_name>.azure-devices.net/<device_name>` or `<iot_hub_name>.azure-devices.net/<device_name>/<module_name>`.
- `allow` or `deny` effects define whether to allow or deny operations.
- `operations` define the actions to authorize. `mqtt:connect`, `mqtt:publish`, and `mqtt:subscribe` are the three supported actions currently.
- `resources` define the object of the policy. It can be a topic or a topic pattern defined with [MQTT wildcards](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718107).

The following JSON snippet is an example of an authorization policy that explicitly doesn't allow the client "rogue_client" to connect, allows any Azure IoT clients to connect, and allows "sensor_1" to publish to topic `events/alerts`:

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
                  "identities":[
                     "<iot_hub_name>.azure-devices.net/rogue_client"
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
                  "identities":[
                     "<iot_hub_name>.azure-devices.net/sensor_1"
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

When writing your authorization policy, keep in mind:

- It requires `$edgeHub` twin schema version 1.2.
- By default, all operations are denied.
- Authorization statements are evaluated in the order that they appear in the JSON definition. It starts by looking at `identities` and then selects the first *allow* or *deny* statements that match the request. If there are conflicts between these statements, the *deny* statement wins.
- Several variables (for example, substitutions) can be used in the authorization policy:

  - `{{iot:identity}}` represents the identity of the currently connected client. For example, a device identity like `<iot_hub_name>.azure-devices.net/myDevice` or a module identity like `<iot_hub_name>.azure-devices.net/myEdgeDevice/SampleModule`.
  - `{{iot:device_id}}` represents the identity of the currently connected device. For example, a device identity like `myDevice` or the device identity where a module is running like `myEdgeDevice`.
  - `{{iot:module_id}}` represents the identity of the currently connected module. This variable is blank for connected devices, or a module identity like `SampleModule`.
  - `{{iot:this_device_id}}` represents the identity of the IoT Edge device running the authorization policy. For example, `myIoTEdgeDevice`.

Authorizations for IoT hub topics are handled slightly differently than user-defined topics. Here are the key points to keep in mind:

- Azure IoT devices or modules need an explicit authorization rule to connect to IoT Edge hub MQTT broker. A default connect authorization policy is provided below.
- Azure IoT devices or modules can access their own IoT hub topics by default without any explicit authorization rule. However, authorizations stem from parent/child relationships in that case and these relationships must be set. IoT Edge modules are automatically set as children of their IoT Edge device but devices need to explicitly be set as children of their IoT Edge gateway.

The following JSON snippet is an example of a default authorization policy that can be used to enable all Azure IoT devices or modules to **connect** to the broker:

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

Now that you understand how to connect to the IoT Edge MQTT broker, let's see how it can be used to publish and subscribe to messages first on user-defined topics, then on IoT Hub topics, and finally to another MQTT broker.

## Publish and subscribe on user-defined topics

In this section, you'll use one client named **sub_client** that subscribes to a topic and another client named **pub_client** that publishes to a topic. We'll use [symmetric key authentication](how-to-authenticate-downstream-device.md#symmetric-key-authentication), but the same can be done with [X.509 self-signed authentication](how-to-authenticate-downstream-device.md#x509-self-signed-authentication) or [X.509 CA-signed authentication](./how-to-authenticate-downstream-device.md#x509-ca-signed-authentication).

### Create publisher and subscriber clients

Open a terminal and use the Azure CLI commands described in this section to create two IoT devices in IoT Hub and get their passwords.

1. Run the following commands to create two IoT devices in IoT Hub:

   ```azurecli-interactive
   az iot hub device-identity create --device-id  sub_client --hub-name <iot_hub_name>
   az iot hub device-identity create --device-id  pub_client --hub-name <iot_hub_name>
   ```

2. Run the following commands to set the IoT devices' parent to be your IoT Edge device:

   ```azurecli-interactive
   az iot hub device-identity parent set --device-id  sub_client --hub-name <iot_hub_name> --pd <edge_device_id>
   az iot hub device-identity parent set --device-id  pub_client --hub-name <iot_hub_name> --pd <edge_device_id>
   ```


3. Run the following command for each IoT device or module to get their passwords by generating a SAS token:

   - For a device:

     ```azurecli-interactive
     az iot hub generate-sas-token -n <iot_hub_name> -d <device_name> --key-type primary --du 3600
     ```

   - For a module:

     ```azurecli-interactive
     az iot hub generate-sas-token -n <iot_hub_name> -d <device_name> -m <module_name> --key-type primary --du 3600
     ```

    > [!NOTE]
    > The value 3600 assigned to the `du` parameter in these commands corresponds to the duration of the SAS token in seconds. Assigning 3600 to the parameter would result in the token lasting 1 hour.

4. Copy the SAS token, which is the value corresponding to the `sas` key from the output. Here's an example output from the Azure CLI command that you ran in step 3:

   ```json
   {
      "sas": "SharedAccessSignature sr=example.azure-devices.net%2Fdevices%2Fdevice_1%2Fmodules%2Fmodule_a&sig=H5iMq8ZPJBkH3aBWCs0khoTPdFytHXk8VAxrthqIQS0%3D&se=1596249190"
   }
   ```

### Authorize publisher and subscriber clients

To authorize the publisher and subscriber, edit the IoT Edge hub twin in an IoT Edge deployment that includes the following authorization policy:

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
                     "<iot_hub_name>.azure-devices.net/sub_client"
                  ],
                  "allow":[
                     {
                        "operations":[
                           "mqtt:subscribe"
                        ],
                        "resources":[
                           "test_topic"
                        ]
                     }
                  ],
               },
               {
                  "identities": [
                     "<iot_hub_name>.azure-devices.net/pub_client"
                  ],
                  "allow":[
                     {
                        "operations":[
                           "mqtt:publish"
                        ],
                        "resources":[
                           "test_topic"
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

> [!NOTE]
> Currently, deployments that contain the MQTT authorization properties can only be applied to IoT Edge devices using the Azure CLI.

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

In this code snippet, `<edge_device_address>` would be `localhost` since the client is running on the same device as IoT Edge.

> [!NOTE]
> TLS isn't enabled in this first example, so port 1883 (MQTT) is used. For this example to work, edgeHub port 1883 needs to be bound to the host via its create options. An example is given in the [prerequisite section](#prerequisites). Another example with TLS enabled using port 8883 (MQTTS) is shown in the [Symmetric keys authentication with TLS section](#symmetric-keys-authentication-with-tls) further down in this article.

The **sub_client** MQTT client is now started and is waiting for incoming messages on `test_topic`.

#### Publish

Connect your **pub_client** MQTT client to the MQTT broker and publish a message on the same `test_topic` as above by running the following command on your IoT Edge device from another terminal:

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

In this code snippet, `<edge_device_address>` would be `localhost` since the client is running on the same device as IoT Edge.

Executing the command, the **sub_client** MQTT client receives the "hello" message.

### Symmetric keys authentication with TLS

To enable TLS, the port must be changed from 1883 (MQTT) to 8883 (MQTTS) and clients must have the root certificate of the MQTT broker to be able to validate the certificate chain sent by the MQTT broker. You can do so by following the steps provided in the [Secure connection (TLS) section](#secure-connection-tls).

Because the clients are running on the same device as the MQTT broker in the example above, the same steps apply to enable TLS by:

- Changing the port number from 1883 (MQTT) to 8883 (MQTTS)
- Passing the CA root certificate to the mosquitto_pub and mosquitto_sub clients using a parameter similar to `--cafile /certs/certs/azure-iot-test-only.root.ca.cert.pem`
- Passing the actual hostname set up in IoT Edge instead of `localhost` via the hostname parameter passed to the mosquitto_pub and mosquitto_sub clients to enable validation of the certificate chain

## Publish and subscribe on IoT Hub topics

The [Azure IoT Device SDKs](https://github.com/Azure/azure-iot-sdks) already let clients perform IoT Hub operations, but they don't allow publishing or subscribing to user-defined topics. IoT Hub operations can be performed using any MQTT clients using publish and subscribe semantics as long as IoT Hub primitive protocols are respected. The next sections of this guide go through the specifics to illustrate how these protocols work.

### Send messages

Sending telemetry data to IoT Hub, other devices, or other modules is similar to publishing on a user-defined topic, but using a specific IoT Hub topic:

- For a device, telemetry is sent on topic: `devices/<device_name>/messages/events/`
- For a module, telemetry is sent on topic: `devices/<device_name>/modules/<module_name>/messages/events/`

Additionally, route the message to its destination.

As with all IoT Edge messages, you can create a route such as `FROM /messages/* INTO $upstream` to send telemetry from the IoT Edge MQTT broker to the IoT hub. For more information about routing, see [Declare routes](module-composition.md#declare-routes).

Depending on the routing settings, the routing may define an input name, which will be attached to the topic when a message is getting forwarded. Also, Edge Hub (and the original sender) adds parameters to the message which is encoded in the topic structure. The following example shows a message routed with input name "TestInput". This message was sent by a module called "SenderModule", which name is also encoded in the topic:

`devices/TestEdgeDevice/modules/TestModule/inputs/TestInput/%24.cdid=TestEdgeDevice&%24.cmid=SenderModule`

Modules can also send messages on a specific output name. Output names help when messages from a module need to be routed to different destinations. When a module wants to send a message on a specific output, it sends the message as a regular telemetry message, except that it adds an additional system property to it. This system property is '$.on'. The '$' sign needs to be url encoded and it becomes %24 in the topic name. The following example shows a telemetry message sent with the output name 'alert':

`devices/TestEdgeDevice/modules/TestModule/messages/events/%24.on=alert/`

### Receive messages

A telemetry message sent by a device or module can be routed to another module. If a module wants to receive M2M messages, first it needs to subscribe to the topic which delivers them. The format of the subscription is:

`devices/{device_id}/modules/{module_id}/#`

### Get twin

Getting the device or module twin isn't a typical MQTT pattern. The client needs to issue a request for the twin that IoT Hub is going to serve.

To receive twins, the client needs to subscribe to the following topic specific to IoT Hub: `$iothub/twin/res/#`. This topic name is inherited from IoT Hub, and all clients need to subscribe to the same topic. It doesn't mean that devices or modules receive the twin of each other. IoT Hub and IoT Edge hub know which twin should be delivered where, even if all devices listen to the same topic name.

Once the subscription is made, the client needs to ask for the twin by publishing a message to the following topic specific to IoT Hub: `$iothub/twin/GET/?$rid=<request_id>/#`. The `<request_id>` in this code snippet is an arbitrary identifier. IoT Hub will then send its response with the requested data on the `$iothub/twin/res/200/?$rid=<request_id>` topic, which the client subscribes to. This process is how a client can pair its requests with the responses.

### Receive twin patches

To receive twin patches, a client needs to subscribe to the following special IoT Hub topic: `$iothub/twin/PATCH/properties/desired/#`. Once the subscription is made, the client receives the twin patches sent by IoT Hub on this topic.

### Receive direct methods

Receiving a direct method is similar to receiving full twins with the addition that the client needs to confirm back that it has received the call. First the client subscribes to the following special IoT Hub topic: `$iothub/methods/POST/#`. Once a direct method is received on this topic, the client needs to extract the request identifier `$rid` from the subtopic on which the direct method is received, and finally publish a confirmation message on the following special IoT Hub topic: `$iothub/methods/res/200/<request_id>`.

### Send direct methods

Sending a direct method is an HTTP call and so doesn't go through the MQTT broker. For more information on sending a direct method to IoT Hub, see [Understand and invoke direct methods](../iot-hub/iot-hub-devguide-direct-methods.md). For more information on sending a direct method locally to another module, see this [Azure IoT C# SDK direct method invocation example](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/device/src/ModuleClient.cs#L597).

## Publish and subscribe between MQTT brokers

To connect two MQTT brokers, the IoT Edge hub includes an MQTT bridge. An MQTT bridge is commonly used to connect a running MQTT broker to another MQTT broker. Only a subset of the local traffic is typically pushed to another broker.

> [!NOTE]
> The IoT Edge hub bridge can currently only be used between nested IoT Edge devices. It can't be used to send data to IoT Hub since IoT Hub isn't a full-featured MQTT broker. To learn more about IoT Hub MQTT broker features support, see [Communicate with your IoT hub using the MQTT protocol](../iot-hub/iot-hub-mqtt-support.md). To learn more about nesting IoT Edge devices, see [Connect a downstream IoT Edge device to an Azure IoT Edge gateway](how-to-connect-downstream-iot-edge-device.md).

In a nested configuration, the IoT Edge hub MQTT bridge acts as a client of the parent MQTT broker, so authorization rules must be set on the parent EdgeHub to allow the child EdgeHub to publish and subscribe to specific user-defined topics that the bridge is configured for.

The IoT Edge MQTT bridge is configured via a JSON structure that's sent to the IoT Edge hub via its twin. Edit an IoT Edge hub twin to configure its MQTT bridge.

> [!NOTE]
> For the public preview, only the Azure CLI supports deployments containing MQTT bridge configurations. The Azure portal currently doesn't support editing the IoT Edge hub twin and its MQTT bridge configuration.

The MQTT bridge can be configured to connect an IoT Edge hub MQTT broker to multiple external brokers. For each external broker, the following settings are required:

- `endpoint` is the address of the remote MQTT broker to connect to. Only parent IoT Edge devices are currently supported and are defined by the variable `$upstream`.
- `settings` defines which topics to bridge for an endpoint. There can be multiple settings per endpoint and the following values are used to configure it:
  - `direction` is either `in` to subscribe to the remote broker's topics or `out` to publish to the remote broker's topics.
  - `topic` is the core topic pattern to be matched. [MQTT wildcards](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718107) can be used to define this pattern. Different prefixes can be applied to this topic pattern on the local broker and remote broker.
  - `outPrefix` is the prefix that's applied to the `topic` pattern on the remote broker.
  - `inPrefix` is the prefix that's applied to the `topic` pattern on the local broker.

The following JSON snippet is an example of an IoT Edge MQTT bridge configuration that republishes all messages received on topics `alerts/#` of a parent IoT Edge device to a child IoT Edge device on the same topics, and republishes all messages sent on topics `/local/telemetry/#` of a child IoT Edge device to a parent IoT Edge device on topics `/remote/messages/#`:

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
                    "topic": "#",
                    "inPrefix": "/local/telemetry/",
                    "outPrefix": "/remote/messages/"
                }
            ]
        }]
    }
}
```

> [!NOTE]
> The MQTT protocol will automatically be used as upstream protocol when the MQTT broker is used and IoT Edge is in a nested configuration, for example, with a `parent_hostname` specified. To learn more about upstream protocols, see [Cloud communication](iot-edge-runtime.md#cloud-communication). To learn more about nested configurations, see [Connect a downstream IoT Edge device to an Azure IoT Edge gateway](how-to-connect-downstream-iot-edge-device.md).

## Next steps

To learn more about IoT Edge hub, see [Understand the IoT Edge hub](iot-edge-runtime.md#iot-edge-hub).

## Appendix - Sample deployment manifest

Below is the complete deployment manifest that you can use to enable the MQTT Broker in IoT Edge. It deploys IoT Edge version 1.2 with the MQTT broker feature enabled, edgeHub port 1883 enabled, and an open authorization policy on the `test_topic`.

```json
{
   "modulesContent":{
      "$edgeAgent":{
         "properties.desired":{
            "schemaVersion":"1.1",
            "runtime":{
               "type":"docker",
               "settings":{
                  "minDockerVersion":"v1.25",
                  "loggingOptions":"",
                  "registryCredentials":{
                     
                  }
               }
            },
            "systemModules":{
               "edgeAgent":{
                  "type":"docker",
                  "settings":{
                     "image":"mcr.microsoft.com/azureiotedge-agent:1.2",
                     "createOptions":"{}"
                  }
               },
               "edgeHub":{
                  "type":"docker",
                  "status":"running",
                  "restartPolicy":"always",
                  "settings":{
                     "image":"mcr.microsoft.com/azureiotedge-hub:1.2",
                     "createOptions":"{\"HostConfig\":{\"PortBindings\":{\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}],\"1883/tcp\":[{\"HostPort\":\"1883\"}]}}}"
                  },
                  "env":{
                     "experimentalFeatures__mqttBrokerEnabled":{
                        "value":"true"
                     },
                     "experimentalFeatures__enabled":{
                        "value":"true"
                     },
                     "RuntimeLogLevel":{
                        "value":"debug"
                     }
                  }
               }
            },
            "modules":{
               
            }
         }
      },
      "$edgeHub":{
         "properties.desired":{
            "schemaVersion":"1.2",
            "routes":{
               "Upstream":"FROM /messages/* INTO $upstream"
            },
            "storeAndForwardConfiguration":{
               "timeToLiveSecs":7200
            },
            "mqttBroker":{
               "authorizations":[
                  {
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
                     "identities":[
                        "{{iot:identity}}"
                     ],
                     "allow":[
                        {
                           "operations":[
                              "mqtt:publish",
                              "mqtt:subscribe"
                           ],
                           "resources":[
                              "test_topic"
                           ]
                        }
                     ]
                  }
               ]
            }
         }
      }
   }
}
```
