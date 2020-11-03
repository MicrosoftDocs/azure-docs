---
title: Learn how the runtime manages devices - Azure IoT Edge | Microsoft Docs 
description: Learn how the IoT Edge runtime manages modules, security, communication, and reporting on your devices
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 10/08/2020
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom:  "amqp, mqtt, devx-track-csharp"
---

# Understand the Azure IoT Edge runtime and its architecture

The IoT Edge runtime is a collection of programs that turn a device into an IoT Edge device. Collectively, the IoT Edge runtime components enable IoT Edge devices to receive code to run at the edge and communicate the results.

The IoT Edge runtime is responsible for the following functions on IoT Edge devices:

* Install and update workloads on the device.
* Maintain Azure IoT Edge security standards on the device.
* Ensure that [IoT Edge modules](iot-edge-modules.md) are always running.
* Report module health to the cloud for remote monitoring.
* Manage communication between downstream devices and IoT Edge devices.
* Manage communication between modules on the IoT Edge device.
* Manage communication between IoT Edge devices.
* Manage communication between the IoT Edge device and the cloud.

![Runtime communicates insights and module health to IoT Hub](./media/iot-edge-runtime/Pipeline.png)

The responsibilities of the IoT Edge runtime fall into two categories: communication and module management. These two roles are performed by two components that are part of the IoT Edge runtime. The *IoT Edge agent* deploys and monitors the modules, while the *IoT Edge hub* is responsible for communication.

Both the IoT Edge agent and the IoT Edge hub are modules, just like any other module running on an IoT Edge device. They're sometimes referred to as the *runtime modules*.

<!-- The upcoming iotedged refactoring would be a good opportunity to document host components of the IoT Edge runtime -->

## IoT Edge agent

The IoT Edge agent is one of two modules that make up the Azure IoT Edge runtime. It is responsible for instantiating modules, ensuring that they continue to run, and reporting the status of the modules back to IoT Hub. This configuration data is written as a property of the IoT Edge agent module twin.

The [IoT Edge security daemon](iot-edge-security-manager.md) starts the IoT Edge agent on device startup. The agent retrieves its module twin from IoT Hub and inspects the deployment manifest. The deployment manifest is a JSON file that declares the modules that need to be started.

Each item in the deployment manifest contains specific information about a module and is used by the IoT Edge agent for controlling the module's lifecycle. For more information about all the properties used by the IoT Edge agent to control modules, read about the [Properties of the IoT Edge agent and IoT Edge hub module twins](module-edgeagent-edgehub.md).

<!-- I feel that most of these settings should be moved out of the conceptual docs. what do you think? -->
<!-- Commenting these out per Kelly and added pointer to module-edgeagent-edgehub.md instead
* **settings.image** – The container image that the IoT Edge agent uses to start the module. The IoT Edge agent must be configured with credentials for the container registry if the image is protected by a password. Credentials for the container registry can be configured remotely using the deployment manifest, or on the IoT Edge device itself by updating the `config.yaml` file in the IoT Edge program folder.
* **settings.createOptions** – A string that is passed directly to the Moby container daemon when starting a module's container. Adding options in this property allows for advanced configurations like port forwarding or mounting volumes into a module's container.  
* **status** – The state in which the IoT Edge agent places the module. Usually, this value is set to *running* as most people want the IoT Edge agent to immediately start all modules on the device. However, you could specify the initial state of a module to be stopped and wait for a future time to tell the IoT Edge agent to start a module. The IoT Edge agent reports the status of each module back to the cloud in the reported properties. A difference between the desired property and the reported property is an indicator of a misbehaving device. The supported statuses are:

  * Downloading
  * Running
  * Unhealthy
  * Failed
  * Stopped

* **restartPolicy** – How the IoT Edge agent restarts a module. Possible values include:
  
  * `never` – The IoT Edge agent never restarts the module.
  * `on-failure` - If the module crashes, the IoT Edge agent restarts it. If the module shuts down cleanly, the IoT Edge agent doesn't restart it.
  * `on-unhealthy` - If the module crashes or is considered unhealthy, the IoT Edge agent restarts it.
  * `always` - If the module crashes, is considered unhealthy, or shuts down in any way, the IoT Edge agent restarts it.

* **imagePullPolicy** - Whether the IoT Edge agent attempts to pull the latest image for a module automatically or not. If you don't specify a value, the default is *onCreate*. Possible values include:

  * `on-create` - When starting a module or updating a module based on a new deployment manifest, the IoT Edge agent will attempt to pull the module image from the container registry.
  * `never` - The IoT Edge agent will never attempt to pull the module image from the container registry. With this configuration, then you're responsible for getting the module image onto the device and managing any image updates.

The IoT Edge agent sends runtime response to IoT Hub. Here is a list of possible responses:
  
* 200 - OK
* 400 - The deployment configuration is malformed or invalid.
* 417 - The device doesn't have a deployment configuration set.
* 412 - The schema version in the deployment configuration is invalid.
* 406 - The IoT Edge device is offline or not sending status reports.
* 500 - An error occurred in the IoT Edge runtime.

For more information, see [Learn how to deploy modules and establish routes in IoT Edge](module-composition.md). -->

### Security
<!-- This section probably needs an update too to convey that: 1/it is not the edgeAgent that takes care of security but all IoT Edge components and 2/ There is a lot more than IoT Edge does about security than verifying a module image before starting it. -->

The IoT Edge agent plays a critical role in the security of an IoT Edge device. For example, it performs actions like verifying a module's image before starting it.

For more information about the Azure IoT Edge security framework, read about the [IoT Edge security manager](iot-edge-security-manager.md).

## IoT Edge hub

The IoT Edge hub is the other module that makes up the Azure IoT Edge runtime. It acts as a local proxy for IoT Hub by exposing the same protocol endpoints as IoT Hub. This consistency means that clients can connect to the IoT Edge runtime just as they would to IoT Hub.

The IoT Edge hub isn't a full version of IoT Hub running locally. IoT Edge hub silently delegates some tasks to IoT Hub. For example, IoT Edge hub automatically downloads authorization information from IoT Hub on its first connection to enable a device to connect. After the first connection is established, authorization information is cached locally by IoT Edge hub. Future connections from that device are authorized without having to download authorization information from the cloud again.

### Cloud communication

To reduce the bandwidth that your IoT Edge solution uses, the IoT Edge hub optimizes how many actual connections are made to the cloud. IoT Edge hub takes logical connections from modules or downstream devices and combines them for a single physical connection to the cloud. The details of this process are transparent to the rest of the solution. Clients think they have their own connection to the cloud even though they are all being sent over the same connection. The IoT Edge hub can either use the AMQP or the MQTT protocol to communicate upstream with the cloud, independently from protocols used by downstream devices. However, the IoT Edge hub currently only supports combining logical connections into a single physical connection by using AMQP as the upstream protocol and its multiplexing capabilities. AMQP is the default upstream protocol.

<!-- TODO: remove the OT/IT boundary which would require t2o iot edge devices which would conceptually more correct to the reality + maybe add AMQP for the upstream link and AMQP or MQTT as downstream protocols-->
![IoT Edge hub is a gateway between physical devices and IoT Hub](./media/iot-edge-runtime/Gateway.png)

IoT Edge hub can determine whether it's connected to IoT Hub. If the connection is lost, IoT Edge hub saves messages or twin updates locally. Once a connection is reestablished, it syncs all the data. The location used for this temporary cache is determined by a property of the IoT Edge hub's module twin. The size of the cache is not capped and will grow as long as the device has storage capacity. For more information, see [Offline capabilities](offline-capabilities.md).

<!-- <1.1> -->
<!-- ### Module communication

IoT Edge hub facilitates module to module communication. Using IoT Edge hub as a message broker keeps modules independent from each other. Modules only need to specify the inputs on which they accept messages and the outputs to which they write messages. A solution developer can stitch these inputs and outputs together so that the modules process data in the order specific to that solution.

![IoT Edge Hub facilitates module-to-module communication](./media/iot-edge-runtime/module-endpoints.png)

To send data to the IoT Edge hub, a module calls the SendEventAsync method. The first argument specifies on which output to send the message. The following pseudocode sends a message on **output1**:

   ```csharp
   ModuleClient client = await ModuleClient.CreateFromEnvironmentAsync(transportSettings);
   await client.OpenAsync();
   await client.SendEventAsync("output1", message);
   ```

To receive a message, register a callback that processes messages coming in on a specific input. The following pseudocode registers the function messageProcessor to be used for processing all messages received on **input1**:

   ```csharp
   await client.SetInputMessageHandlerAsync("input1", messageProcessor, userContext);
   ```

For more information about the ModuleClient class and its communication methods, see the API reference for your preferred SDK language: [C#](/dotnet/api/microsoft.azure.devices.client.moduleclient), [C](/azure/iot-hub/iot-c-sdk-ref/iothub-module-client-h), [Python](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient), [Java](/java/api/com.microsoft.azure.sdk.iot.device.moduleclient), or [Node.js](/javascript/api/azure-iot-device/moduleclient).

The solution developer is responsible for specifying the rules that determine how IoT Edge hub passes messages between modules. Routing rules are defined in the cloud and pushed down to IoT Edge hub in its module twin. The same syntax for IoT Hub routes is used to define routes between modules in Azure IoT Edge. For more information, see [Learn how to deploy modules and establish routes in IoT Edge](module-composition.md).

![Routes between modules go through IoT Edge hub](./media/iot-edge-runtime/module-endpoints-with-routes.png)
</1.1> -->

<!-- <1.2> -->
### Local communication

IoT Edge hub facilitates local communication. It enables device-to-module, module-to-module, device-to-device communications by brokering messages to keep devices and modules independent from each other.

>[!NOTE]
> The MQTT broker feature is in public preview with IoT Edge version 1.2. It must be explicitly enabled.

The IoT Edge hub supports two brokering mechanisms:
1. The [message routing features supported by IoT Hub](../iot-hub/iot-hub-devguide-messages-d2c.md) and,
2. A general-purpose MQTT broker that meets the [MQTT standard v3.1.1](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html)

The first brokering mechanism leverages the same routing APIs as IoT Hub. It leverages routes, an IoT Hub concept, to specify how messages are passed between devices or modules. It can be used by devices or modules built with the Azure IoT Hub SDKs that communicate either via the AMQP or the MQTT protocol. To use it, first devices or modules specify the inputs on which they accept messages and the outputs to which they write messages. Then, a solution developer can route messages between a source, e.g. outputs, and a destination, e.g. inputs, with potential filters. All messaging IoT Hub primitives, e.g. telemetry, direct methods, C2D, twins, are supported. All communication happens on special IoT Hub topics. As an example, the input queue of a module is available on special IoT Hub topic `devices/<device_name>/<module_name>/messages/inputs`. For more information about routes, see [Learn how to deploy modules and establish routes in IoT Edge](module-composition.md).

<!-- I dont think that we need this picture anymore
![IoT Edge Hub facilitates module-to-module communication](./media/iot-edge-runtime/module-endpoints.png) -->

![Routes between modules go through IoT Edge hub](./media/iot-edge-runtime/module-endpoints-with-routes.png)

The second brokering mechanism is based on a standard MQTT broker. MQTT is a simple message transfer protocol that guarantees optimal performances on resource constrained devices. It is a popular publish/subscribe protocol standard. IoT Edge hub implements its own v3.1.1 compatible MQTT broker built-in. This mechanism enables two extra communication patterns: local broadcasting and point-to-point communication. Local broadcasting is useful when one device or module needs to locally alert multiple other devices or modules. Point-to-point communication enables two IoT Edge devices or two IoT devices to communicate locally without round-trip to the cloud. It can be used by devices or modules built with either the Azure IoT Hub SDKs that communicate via the MQTT protocol or any general-purpose MQTT clients. To use it, first a device or module subscribes to a topic, then another device or module publishes a message on the same topic. This topic could be an IoT Hub special topic or a user-defined topic. Because IoT Hub special topics are supported, with the exception of C2D all messaging IoT Hub primitives, e.g. telemetry, direct methods, twins are supported. However, unlike with the routing mechanism, ordering of messages is only best-effort and not guaranteed and filtering of messages is not supported by the broker. The lack of these features enable the MQTT broker to be faster than routing. Lastly, a MQTT bridge is available to forward topics from the IoT Edge hub MQTT broker to another MQTT broker.

<!--TODO:Add new picture about the MQTT broker -->
![IoT Edge Hub facilitates module-to-module communication](./media/iot-edge-runtime/module-endpoints.png)

Here are the features available with each brokering mechanism:

|Features  | Routing  | MQTT broker  |
|---------|---------|---------|
| D2C telemetry    |     &#10004;    |         |
| Local telemetry     |     &#10004;    |    &#10004;     |
|DirectMethods     |    &#10004;     |    &#10004;     |
|Twin     |    &#10004;     |    &#10004;     |
|C2D for devices     |   &#10004;      |         |
|Ordering     |    &#10004;     |         |
|Filtering     |     &#10004;    |         |
|User-defined topics     |         |    &#10004;     |
|Device-to-Device     |         |    &#10004;     |
|Local broadcasting     |         |    &#10004;     |
|Performance     |         |    &#10004;     |

### Connecting to the IoT Edge hub

The IoT Edge hub accepts connections from device or module clients, either over the MQTT protocol or the AMQP protocol.

>[!NOTE]
> IoT Edge hub supports clients that connect using MQTT or AMQP. It does not support clients that use HTTP.

When a client connects to the IoT Edge hub, the following happens:

1. If Transport Layer Security (TLS) is used (recommended), a TLS channel is built to establish an encrypted communication between the client and the IoT Edge hub.
2. Authentication information is sent from the client to IoT Edge hub to identify itself.
3. IoT Edge hub authorizes or rejects the connection based on its authentication policy.

#### Secure connections (TLS)

By default, the IoT Edge hub only accepts connections secured with Transport Layer Security (TLS), e.g. encrypted connections that a third party cannot decrypt.

If a client connects on port 8883 (MQTTS) or 5671 (AMQPS) to the IoT Edge hub, a TLS channel must be built. During the TLS handshake, the IoT Edge hub sends its certificate chain that the client needs to validate. In order to validate the certificate chain, the root certificate of the IoT Edge hub must be installed as a trusted certificate on the client. If the root certificate is not trusted, the client library will be rejected by the IoT Edge hub with a certificate verification error.

The steps to follow to install this root certificate of the broker on device clients are described in the [transparent gateway](how-to-create-transparent-gateway.md) and in the [prepare a downstream device](how-to-connect-downstream-device.md#prepare-a-downstream-device) documentation. Modules can use the same root certificate as the IoT Edge hub by leveraging the IoT Edge daemon API. <!--Varun to verify this last sentence-->

#### Authentication

The IoT Edge Hub only accepts connections from devices or modules that have an IoT Hub identity, e.g. that have been registered in IoT Hub and have one of the three client authentication methods supported by IoT hub to provide prove their identity: [Symmetric keys authentication](how-to-authenticate-downstream-device.md#symmetric-key-authentication), [X.509 self-signed authentication](how-to-authenticate-downstream-device.md#x509-self-signed-authentication), [X.509 CA signed authentication](how-to-authenticate-downstream-device.md#x509-ca-signed-authentication).  These IoT Hub identities can be verified locally by the IoT Edge hub so connections can still be made while offline.

Notes:
- The IoT Edge hub will not allow connecting two clients using the same credentials information. It will disconnect the already connected client if a second client connects using the same credentials.
- IoT Edge modules currently only support symmetric key authentication.
- MQTT clients with only local username and passwords are not accepted by the IoT Edge hub MQTT broker, they must use IoT Hub identities.

<!-- 
Commented out per Kelly: To be moved to an how-to article
To authenticate with a MQTT client, you first need to send a CONNECT packet to to the MQTT broker to initiate the connection. This packet provides three authentication information: a `client identifier`, a `username` and `password`. The connect packet delivers the following credentials:

-	The `client identifier` field is the name of the device or module name in IoT Hub. It uses the following syntax:

    - For a device: `<device_name>`

    - For a module: `<device_name>/<module_name>`

- The `username` field is derived from the device or module name, and the IoTHub name the device belongs to using the following syntax:

    - For a device: `<iot_hub_name>.azure-devices.net/<device_name>/?api-version=2018-06-30`

    - For a module: `<iot_hub_name>.azure-devices.net/<device_name>/<module_name>/?api-version=2018-06-30`

- The `password` field of the CONNECT packet depends on the authentication mode:

    - In case of the [symmetric keys authentication](how-to-authenticate-downstream-device.md#symmetric-key-authentication), the `password` field is a SAS token. You can use the  [generate-token](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub?view=azure-cli-latest#ext_azure_cli_iot_ext_az_iot_hub_generate_sas_token&preserve-view=true) Azure CLI commands to generate SAS token for a device or module.
    - In case of the [X.509 self-signed authentication](how-to-authenticate-downstream-device.md), the `password` field is not present. In this authentication mode, a TLS channel is required. The client needs to connect to port 8883 to establish a TLS connection. During the TLS handshake, the MQTT broker requests a client certificate. This certificate is used to verify the identity of the client and thus the `password` field is not needed later when the CONNECT packet is sent. Sending both a client certificate and the password field will lead to an error and the connection will be closed. MQTT libraries and TLS client libraries usually have a way to send a client certificate when initiating a connection. You can see a step-by-step example in section [Using X509 Certificate for client authentication](how-to-authenticate-downstream-device.md). -->

#### Authorization

Once authenticated, the IoT Edge hub has two ways to authorize client connections:

1. By verifying that a client belongs to its set of trusted clients defined in IoT Hub. The set of trusted clients is specified by setting up parent/child or device/module relationships in IoT Hub. When a module is created in IoT Edge, a trust relationship is automatically established between this module and its IoT Edge device. This is the only authorization model supported by the routing brokering mechanism.
2. By setting up an authorization policy. This authorization policy is a document listing all the authorized client identities that can access resources on the IoT Edge hub. This is the primary authorization model used by the IoT Edge hub MQTT broker, though parent/child and device/module relationships can also be understood by the MQTT broker for IoT Hub topics.


### Remote configuration

The IoT Edge hub is entirely controlled by the cloud. It gets its configuration from IoT Hub via its [module twin](iot-edge-modules.md#module-twins). It includes:

- Routes configuration
- Authorization policies
- MQTT bridge policy

Additionally, several configuration can be done by setting up environment variables on the IoT Edge hub.
<!-- </1.2> -->

<!-- In my opinion, we should also explain the concepts about metrics, os updates, etc. -->

## Runtime quality telemetry

IoT Edge collects anonymous telemetry from the host runtime and system modules to improve product quality. This information is called runtime quality telemetry. The collected telemetry is periodically sent as device-to-cloud messages to IoT Hub from the IoT Edge agent. These messages do not appear in customer's regular telemetry and do not consume any message quota.

The IoT Edge agent and hub generate metrics that you can collect to understand device performance. A subset of these metrics is collected by the IoT Edge Agent as part of runtime quality telemetry. The metrics collected for runtime quality telemetry are labeled with the tag `ms_telemetry`. For information about all the available metrics, see [Access built-in metrics](how-to-access-built-in-metrics.md).

Any personally or organizationally identifiable information, such as device and module names, are removed before upload to ensure the anonymous nature of the runtime quality telemetry.

The IoT Edge agent collects the telemetry every hour and sends one message to IoT Hub every 24 hours.

If you wish to opt out of sending runtime telemetry from your devices, there are two ways to do so:

* Set the `SendRuntimeQualityTelemetry` environment variable to `false` for **edgeAgent**, or
* Uncheck the option in the Azure portal during deployment.

## Next steps

* [Understand Azure IoT Edge modules](iot-edge-modules.md)
* [Learn about IoT Edge runtime metrics](how-to-access-built-in-metrics.md)