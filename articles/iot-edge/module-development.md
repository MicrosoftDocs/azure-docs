---
title: Develop modules for Azure IoT Edge | Microsoft Docs 
description: Develop custom modules for Azure IoT Edge that can communicate with the runtime and IoT Hub
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 07/22/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Develop your own IoT Edge modules

Azure IoT Edge modules can connect with other Azure services and contribute to your larger cloud data pipeline. This article describes how you can develop modules to communicate with the IoT Edge runtime and IoT Hub, and therefore the rest of the Azure cloud.

## IoT Edge runtime environment

<!-- <1.1>
The IoT Edge runtime provides the infrastructure to integrate the functionality of multiple IoT Edge modules and to deploy them onto IoT Edge devices. Any program can be packaged as an IoT Edge module. To take full advantage of IoT Edge communication and management functionalities, a program running in a module can use the Azure IoT Device SDK to connect to the local IoT Edge hub.
</1.1> -->

<!-- <1.2> -->
The IoT Edge runtime provides the infrastructure to integrate the functionality of multiple IoT Edge modules and to deploy them onto IoT Edge devices. Any program can be packaged as an IoT Edge module. To take full advantage of IoT Edge communication and management functionalities, a program running in a module can either use the Azure IoT Device SDK to connect to the local IoT Edge hub or any MQTT client to connect to the local IoT Edge hub MQTT broker.
<!-- </1.2> -->

### Packaging your program as an IoT Edge module

To deploy your program on an IoT Edge device, it must first be containerized and run with a Docker-compatible engine. IoT Edge uses [Moby](https://github.com/moby/moby), the open-source project behind Docker, as its Docker-compatible engine. The same parameters that you're used to with Docker can be passed to your IoT Edge modules. For more information, see [How to configure container create options for IoT Edge modules](how-to-use-create-options.md). 

## Using the IoT Edge hub

The IoT Edge hub provides two main functionalities: proxy to IoT Hub, and local communications.

### Connecting to IoT Edge hub from a module

Connecting to the local IoT Edge hub from a module involves the same connection steps as for any clients as [described here](iot-edge-runtime.md#connecting-to-the-iot-edge-hub).

<!-- <1.2> -->
Two implementation options are available depending on which [brokering mechanism](iot-edge-runtime.md#local-communication) you want to use:
1. To use IoT Edge routing over AMQP or MQTT, you can use the ModuleClient from the Azure IoT SDK. Create a ModuleClient instance to connect your module to the IoT Edge hub running on the device, similar to how DeviceClient instances connect IoT devices to IoT Hub. For more information about the ModuleClient class and its communication methods, see the API reference for your preferred SDK language: [C#](/dotnet/api/microsoft.azure.devices.client.moduleclient), [C](/azure/iot-hub/iot-c-sdk-ref/iothub-module-client-h), [Python](/python/api/azure-iot-device/azure.iot.device.iothubmoduleclient), [Java](/java/api/com.microsoft.azure.sdk.iot.device.moduleclient), or [Node.js](/javascript/api/azure-iot-device/moduleclient).
2. To use IoT Edge MQTT broker, you need to bring your own MQTT client and initiate the connection yourself with information that you retrieve from the IoT Edge daemon Workload API. <!--Need to add details here-->
<!-- </1.2> -->

### MQTT broker primitives

#### Send a message on a user-defined topic

With the IoT Edge MQTT broker, you can publish messages on any user-defined topics. To do so, authorize your module to publish on specific topics then get a token from the workload API to use as a password when connecting to the MQTT broker, and finally publish messages on the authorized topics with the MQTT client of your choice.

#### Receive messages on a user-defined topic

With the IoT Edge MQTT broker, receiving messages is similar. First make sure that your module is authorized to subscribe to specific topics, then get a token from the workload API to use as a password when connecting to the MQTT broker, and finally subscribe to messages on the authorized topics with the MQTT client of your choice.

### IoT Hub primitives

IoT Hub sees a module instance analogously to a device, in the sense that:

* it can send [device-to-cloud messages](../iot-hub/iot-hub-devguide-messaging.md);
* it can receive [direct methods](../iot-hub/iot-hub-devguide-direct-methods.md) targeted specifically at its identity.
* it has a module twin that is distinct and isolated from the [device twin](../iot-hub/iot-hub-devguide-device-twins.md) and the other module twins of that device;

Currently, modules can't receive cloud-to-device messages or use the file upload feature.

<!-- <1.1>
When writing a module, you can use the [Azure IoT Device SDK](../iot-hub/iot-hub-devguide-sdks.md) to connect to the IoT Edge hub and use the above functionality as you would when using IoT Hub with a device application. The only difference between IoT Edge modules and IoT device applications is that you have to refer to the module identity instead of the device identity.
</1.1> -->

<!-- <1.2> -->
When writing a module, you can use the [Azure IoT Device SDK](../iot-hub/iot-hub-devguide-sdks.md) or a MQTT client to connect to the IoT Edge hub and use the above functionality as you would when using IoT Hub with a device application. The only difference between IoT Edge modules and IoT device applications is that you have to refer to the module identity instead of the device identity.
<!-- </1.2> -->

#### Device-to-cloud messages

An IoT Edge module can send messages to the cloud via the IoT Edge hub that acts as a local broker and propagates messages to the cloud. To enable complex processing of device-to-cloud messages, an IoT Edge module can also intercept and process messages sent by other modules or devices to its local IoT Edge hub and send new messages with processed data. Chains of IoT Edge modules can thus be created to build local processing pipelines.

To send device-to-cloud telemetry messages using routing, use the the ModuleClient of the Azure IoT SDK. With the Azure IoT SDK, each module has the concept of module *input* and *output* endpoints, which map to special MQTT topics. Use the `ModuleClient.sendMessageAsync` method and it will send messages on the output endpoint of your module. Then configure a route in edgeHub to send this output endpoint to IoT Hub.

Sending device-to-cloud telemetry messages with the MQTT broker is similar to publishing messages on user-defined topics, but using the following IoT Hub special topic for your module: `devices/<device_name>/<module_name>/messages/events`. Authorizations must be setup appropriately. The MQTT bridge must also be configured to forward the messages on this topic to the cloud. <!-- Is this true? -->

To process messages using routing, first set up a route to send messages coming from another endpoint (module or device) to the input endpoint of your module, then listen for messages on the input endpoint of your module. Each time a new message comes back, a callback function is triggered by the Azure IoT SDK. Process your message with this callback function and optionally send new messages on your module endpoint queue.

Processing messages using the MQTT broker is similar to subscribing to messages on user-defined topics, but using the IoT Edge special topics of your module's output queue: `devices/<device_name>/<module_name>/messages/events`. Authorizations must be setup appropriately. Optionally you can send new messages on the topics of your choice.

#### Twins

Twins are one of the primitives provided by IoT Hub. There are JSON documents that store state information including metadata, configurations and conditions. Each module or device has its own twin.

##### Get twins

To get a module twin with the Azure IoT SDK, call the `ModuleClient.getTwin` method.

To get a module twin with any MQTT client, a little bit more work is involved since getting a twin is not a typical MQTT pattern. The module must first subscribe to IoT Hub special topic `$iothub/twin/res/#`. This topic name is inherited from IoT Hub, and all devices/modules need to subscribe to the same topic. It does not mean that devices receive the twin of each other. IoT Hub and edgeHub knows which twin should be delivered where, even if all devices listen to the same topic name. Once the subscription is made, the module needs to ask for the twin by publishing a message to the following IoT Hub special topic with a request id `$iothub/twin/GET/?$rid=1234`. This request id is an arbitrary id, e.g. a GUID, which will be sent back by IoTHub along with the requested data. This is how a client can pair its requests with the responses. The result code is a HTTP-like status code, where successful is encoded as 200.

##### Receive twin patches

To receive a module twin patch with the Azure IoT SDK, implement a callback function and register it with the `ModuleClient.moduleTwinCallback` method from the Azure IoT SDK so that your callback function is triggered each time that a twin patch comes in.

To receive a module twin patch with any MQTT client, the process is very similar to receiving full twins: a client needs to subscribe to special IoTHub topic `$iothub/twin/PATCH/properties/desired/#`. After the subscription is made, when IoT Hub sends a change of the desired section of the twin, the client receives it.

#### Receive direct methods

To receive a direct method with the Azure IoT SDK, implement a callback function and register it with the `ModuleClient.methodCallback` method from the Azure IoT SDK so that your callback function is triggered each time that a direct method comes in.

To receive a direct method with any MQTT client, process is very similar to receiving twin patches with the addition that the client needs to confirm back that it has received the call and can send back some information at the same time. Special IoT Hub topic to subscribe to is `$iothub/methods/POST/#`.

## Language and architecture support

IoT Edge supports multiple operating systems, device architectures, and development languages so that you can build the scenario that matches your needs. Use this section to understand your options for developing custom IoT Edge modules. You can learn more about tooling support and requirements for each language in [Prepare your development and test environment for IoT Edge](development-environment.md).

### Linux

For all languages in the following table, IoT Edge supports development for AMD64 and ARM32 Linux devices.

| Development language | Development tools |
| -------------------- | ----------------- |
| C | Visual Studio Code<br>Visual Studio 2017/2019 |
| C# | Visual Studio Code<br>Visual Studio 2017/2019 |
| Java | Visual Studio Code |
| Node.js | Visual Studio Code |
| Python | Visual Studio Code |

>[!NOTE]
>Develop and debugging support for ARM64 Linux devices is in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). For more information, see [Develop and debug ARM64 IoT Edge modules in Visual Studio Code (preview)](https://devblogs.microsoft.com/iotdev/develop-and-debug-arm64-iot-edge-modules-in-visual-studio-code-preview).

### Windows

For all languages in the following table, IoT Edge supports development for AMD64 Windows devices.

| Development language | Development tools |
| -------------------- | ----------------- |
| C | Visual Studio 2017/2019 |
| C# | Visual Studio Code (no debugging capabilities)<br>Visual Studio 2017/2019 |

## Next steps

[Prepare your development and test environment for IoT Edge](development-environment.md)

[Use Visual Studio to develop C# modules for IoT Edge](how-to-visual-studio-develop-module.md)

[Use Visual Studio Code to develop modules for IoT Edge](how-to-vs-code-develop-module.md)

[Understand and use Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md)