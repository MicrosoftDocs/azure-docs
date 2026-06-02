---
title: Azure IoT Edge runtime and architecture explained
description: Discover how Azure IoT Edge runtime manages modules, security, and communication with IoT Hub to optimize IoT solutions.
author: sethmanheim
ms.author: sethm
ms.date: 03/02/2026
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
ms.custom:
  - amqp, mqtt, devx-track-csharp
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-gen-description
#customer intent: As a developer, I want to understand the Azure IoT Edge runtime architecture so that I can design and deploy IoT Edge solutions effectively.
---

# Azure IoT Edge runtime and architecture overview

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

The IoT Edge runtime is a set of programs that turn a device into an IoT Edge device. The runtime components let IoT Edge devices receive code to run at the edge, and then communicate results.

The IoT Edge runtime is responsible for the following functions on IoT Edge devices:

* Install and update workloads.
* Maintain Azure IoT Edge security standards.
* Ensure [IoT Edge modules](iot-edge-modules.md) keep running.
* Report module health to the cloud for remote monitoring.
* Manage communication between:
  - Downstream devices and IoT Edge devices
  - Modules on an IoT Edge device
  - An IoT Edge device and the cloud
  - IoT Edge devices

:::image type="content" source="./media/iot-edge-runtime/Pipeline.png" alt-text="Diagram showing how the runtime communicates insights and module health to IoT Hub." lightbox="./media/iot-edge-runtime/Pipeline.png":::

The responsibilities of the IoT Edge runtime fall into two categories: communication and module management. Two components of the IoT Edge runtime perform these roles. The *IoT Edge agent* deploys and monitors the modules, and the *IoT Edge hub* handles communication.

Both the IoT Edge agent and the IoT Edge hub are modules, just like any other module running on an IoT Edge device. They're sometimes referred to as the *runtime modules*.

## IoT Edge agent

The IoT Edge agent is one of two modules in the Azure IoT Edge runtime. It instantiates modules, ensures they keep running, and reports their status to IoT Hub. You write this configuration data as a property of the IoT Edge agent module twin.

The [IoT Edge security daemon](iot-edge-security-manager.md) starts the IoT Edge agent on device startup. The agent retrieves its module twin from IoT Hub and inspects the deployment manifest. The deployment manifest is a JSON file that declares the modules that need to be started.

Each item in the deployment manifest contains specific information about a module and is used by the IoT Edge agent for controlling the module's lifecycle. For more information about all the properties used by the IoT Edge agent to control modules, see [Properties of the IoT Edge agent and IoT Edge hub module twins](module-edgeagent-edgehub.md).

The IoT Edge agent sends runtime response to IoT Hub. Here's a list of possible responses:
  
* 200 - OK
* 400 - The deployment configuration is malformed or invalid.
* 417 - The device doesn't have a deployment configuration set.
* 412 - The schema version in the deployment configuration is invalid.
* 406 - The IoT Edge device is offline or not sending status reports.
* 500 - An error occurred in the IoT Edge runtime.

For more information about creating deployment manifests, see [Learn how to deploy modules and establish routes in IoT Edge](module-composition.md).

### Security

The IoT Edge agent plays a critical role in the security of an IoT Edge device. For example, it performs actions like verifying a module's image before starting it.

For more information about the Azure IoT Edge security framework, see [IoT Edge security manager](iot-edge-security-manager.md).

## IoT Edge hub

The IoT Edge hub is the other module that makes up the Azure IoT Edge runtime. It acts as a local proxy for IoT Hub by exposing the same protocol endpoints as IoT Hub. This consistency means that clients can connect to the IoT Edge runtime just as they would to IoT Hub.

The IoT Edge hub isn't a full local version of IoT Hub. It delegates some tasks to IoT Hub. For example, to enable a device to connect, the IoT Edge hub automatically downloads authorization information from IoT Hub on its first connection. After the first connection is established, the IoT Edge hub caches authorization information locally. Future connections from that device are authorized without needing to download authorization information from the cloud again.

### Cloud communication

To reduce the bandwidth that your IoT Edge solution uses, the IoT Edge hub optimizes how many actual connections are made to the cloud. The IoT Edge hub takes logical connections from modules or downstream devices and combines them for a single physical connection to the cloud. The details of this process are transparent to the rest of the solution. Clients think they have their own connection to the cloud even though they're all sent over the same connection. The IoT Edge hub can either use the AMQP or the MQTT protocol to communicate upstream with the cloud, independently from protocols used by downstream devices.

> [!IMPORTANT]
> IoT Edge hub only supports connection multiplexing (combining multiple logical connections into a single physical connection) when using AMQP as the upstream protocol. If you configure MQTT as the upstream protocol, each module and downstream device uses its own connection to IoT Hub. AMQP is the default upstream protocol.
>
> For more information about configuring the upstream protocol, see [Choose upstream protocol](production-checklist.md#choose-upstream-protocol).

:::image type="content" source="./media/iot-edge-runtime/gateway-communication.png" alt-text="Screenshot showing relationships to IoT Edge hub as a gateway between physical devices and IoT Hub." lightbox="./media/iot-edge-runtime/gateway-communication.png":::

The IoT Edge hub can determine whether it's connected to IoT Hub. If the connection is lost, the IoT Edge hub saves messages or twin updates locally. Once a connection is reestablished, it syncs all the data. A property of the IoT Edge hub's module twin determines the location used for this temporary cache. The size of the cache isn't capped and grows as long as the device has storage capacity. For more information, see [Offline capabilities](offline-capabilities.md).

### Local communication

The IoT Edge hub facilitates local communication. It enables device-to-module and module-to-module communications by brokering messages to keep devices and modules independent from each other. The IoT Edge hub supports the [message routing features supported by IoT Hub](../iot-hub/iot-hub-devguide-messages-d2c.md).

#### Using routing

The brokering mechanism uses the same routing features as the IoT Hub to specify how it passes messages between devices or modules. First, devices or modules specify the inputs on which they accept messages and the outputs to which they write messages. Then a solution developer can route messages between a source (for example, outputs), and a destination (for example, inputs), with potential filters.

:::image type="content" source="./media/iot-edge-runtime/module-endpoints-routing.png" alt-text="Screenshot showing how routes between modules go through IoT Edge hub." lightbox="./media/iot-edge-runtime/module-endpoints-routing.png":::

Devices or modules that use the Azure IoT Device SDKs with the AMQP protocol can use routing. All messaging IoT Hub primitives, such as telemetry, direct methods, C2D, and twins, are supported but communication over user-defined topics isn't supported.

For more information about routes, see [Learn how to deploy modules and establish routes in IoT Edge](module-composition.md).

The following brokering mechanism features are available:

|Features  | Routing  |
|---------|---------|
|D2C telemetry    |     &#10004;    |
|Local telemetry     |     &#10004;    |
|DirectMethods     |    &#10004;     |
|Twin     |    &#10004;     |
|C2D for devices     |   &#10004;      |
|Ordering     |    &#10004;     |
|Filtering     |     &#10004;    |
|User-defined topics     |         |
|Device-to-Device     |         |
|Local broadcasting     |         |

### Connecting to the IoT Edge hub

The IoT Edge hub accepts connections from device or module clients, either over the MQTT protocol or the AMQP protocol.

> [!NOTE]
> The IoT Edge hub supports clients that connect using MQTT or AMQP. It doesn't support clients that use HTTP.

When a client connects to the IoT Edge hub, the following steps happen:

1. If Transport Layer Security (TLS) is used (recommended), the client and the IoT Edge hub build a TLS channel to establish an encrypted communication.
1. The client sends authentication information to the IoT Edge hub to identify itself.
1. The IoT Edge hub authorizes or rejects the connection based on its authorization policy.

#### Secure connections (TLS)

By default, the IoT Edge hub only accepts connections secured with Transport Layer Security (TLS). For example, it accepts encrypted connections that a third party can't decrypt.

When a client connects to the IoT Edge hub on port 8883 (MQTTS) or 5671 (AMQPS), it establishes a TLS channel. During the TLS handshake, the IoT Edge hub sends its certificate chain that the client needs to validate. To validate the certificate chain, you must install the root certificate of the IoT Edge hub as a trusted certificate on the client. If the root certificate isn't trusted, the IoT Edge hub rejects the client library with a certificate verification error.

The [transparent gateway](how-to-create-transparent-gateway.md) and [prepare a downstream device](how-to-connect-downstream-device.md#prerequisites) documentation describe the steps to install this root certificate of the broker on device clients. Modules can use the same root certificate as the IoT Edge hub by using the IoT Edge daemon API.

#### Authentication

The IoT Edge Hub only accepts connections from devices or modules that have an IoT Hub identity. For example, these devices and modules are registered in IoT Hub and use one of the three client authentication methods that IoT Hub supports to prove their identity: [Symmetric keys authentication](how-to-authenticate-downstream-device.md#symmetric-key-authentication), [X.509 self-signed authentication](how-to-authenticate-downstream-device.md#x509-self-signed-authentication), or [X.509 CA signed authentication](how-to-authenticate-downstream-device.md#x509-ca-signed-authentication). The IoT Edge hub can verify these IoT Hub identities locally, so connections can still be made while offline.

IoT Edge modules currently only support symmetric key authentication.

#### Authorization

The IoT Edge hub verifies that a client belongs to its set of trusted clients defined in IoT Hub. You specify the set of trusted clients by setting up parent/child or device/module relationships in IoT Hub. When you create a module in IoT Edge, you automatically establish a trust relationship between this module and its IoT Edge device. This is the only authorization model supported by the routing brokering mechanism.

### Remote configuration

The cloud entirely controls the IoT Edge hub. It gets its configuration from IoT Hub via its [module twin](iot-edge-modules.md#module-twins). The twin contains a desired property called *routes* that declares how messages are passed within a deployment. For more information about routes, see [declare routes](module-composition.md#declare-routes).

Additionally, you can configure several settings by setting up [environment variables on the IoT Edge hub](https://github.com/Azure/iotedge/blob/main/doc/EnvironmentVariables.md).

## Runtime quality telemetry

IoT Edge collects anonymous telemetry from the host runtime and system modules to improve product quality. This information is called *runtime quality* telemetry. The IoT Edge agent periodically sends the collected telemetry as device-to-cloud messages to IoT Hub. These messages don't appear in your regular telemetry and don't consume any message quota.

The IoT Edge agent and hub generate metrics that you can collect to understand device performance. A subset of these metrics is collected by the IoT Edge Agent as part of runtime quality telemetry. The metrics collected for runtime quality telemetry are labeled with the tag `ms_telemetry`. For information about all the available metrics, see [Access built-in metrics](how-to-access-built-in-metrics.md).

Any personally or organizationally identifiable information, such as device and module names, are removed before upload to ensure the anonymous nature of the runtime quality telemetry.

The IoT Edge agent collects the runtime quality telemetry hourly and sends one message to IoT Hub every 24 hours.

If you want to opt out of sending runtime quality telemetry from your devices, use one of the following methods:

* Set the `SendRuntimeQualityTelemetry` environment variable to `false` for **edgeAgent**.
* Uncheck the option in the Azure portal during deployment.

## Next steps

* [Understand Azure IoT Edge modules](iot-edge-modules.md)
* [Learn how to deploy modules and establish routes in IoT Edge](module-composition.md)
* [Learn about IoT Edge runtime metrics](how-to-access-built-in-metrics.md)
