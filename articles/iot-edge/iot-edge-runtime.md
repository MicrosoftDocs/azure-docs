---
title: Learn how the runtime manages devices - Azure IoT Edge | Microsoft Docs 
description: Learn how the modules, security, communication, and reporting on your devices are managed by the Azure IoT Edge runtime
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 06/06/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Understand the Azure IoT Edge runtime and its architecture

The IoT Edge runtime is a collection of programs that turn a device into an IoT Edge device. Collectively, the IoT Edge runtime components enable IoT Edge devices to receive code to run at the edge, and communicate the results. 

The IoT Edge runtime performs the following functions on IoT Edge devices:

* Install and update workloads on the device.
* Maintain Azure IoT Edge security standards on the device.
* Ensure that [IoT Edge modules](iot-edge-modules.md) are always running.
* Report module health to the cloud for remote monitoring.
* Facilitate communication between downstream leaf devices and IoT Edge devices.
* Facilitate communication between modules on the IoT Edge device.
* Facilitate communication between the IoT Edge device and the cloud.

![Runtime communicates insights and module health to IoT Hub](./media/iot-edge-runtime/Pipeline.png)

The responsibilities of the IoT Edge runtime fall into two categories: communication and module management. These two roles are performed by two components that are part of the IoT Edge runtime. The *IoT Edge hub* is responsible for communication, while the *IoT Edge agent* deploys and monitors the modules. 

Both the IoT Edge hub and the IoT Edge agent are modules, just like any other module running on an IoT Edge device. 

## IoT Edge hub

The IoT Edge hub is one of two modules that make up the Azure IoT Edge runtime. It acts as a local proxy for IoT Hub by exposing the same protocol endpoints as IoT Hub. This consistency means that clients (whether devices or modules) can connect to the IoT Edge runtime just as they would to IoT Hub. 

>[!NOTE]
> IoT Edge hub supports clients that connect using MQTT or AMQP. It does not support clients that use HTTP. 

The IoT Edge hub is not a full version of IoT Hub running locally. There are some things that the IoT Edge hub silently delegates to IoT Hub. For example, IoT Edge hub forwards authentication requests to IoT Hub when a device first tries to connect. After the first connection is established, security information is cached locally by IoT Edge hub. Subsequent connections from that device are allowed without having to authenticate to the cloud. 

To reduce the bandwidth your IoT Edge solution uses, the IoT Edge hub optimizes how many actual connections are made to the cloud. IoT Edge hub takes logical connections from clients like modules or leaf devices and combines them for a single physical connection to the cloud. The details of this process are transparent to the rest of the solution. Clients think they have their own connection to the cloud even though they are all being sent over the same connection. 

![IoT Edge hub is a gateway between physical devices and IoT Hub](./media/iot-edge-runtime/Gateway.png)

IoT Edge hub can determine whether it's connected to IoT Hub. If the connection is lost, IoT Edge hub saves messages or twin updates locally. Once a connection is reestablished, it syncs all the data. The location used for this temporary cache is determined by a property of the IoT Edge hub’s module twin. The size of the cache is not capped and will grow as long as the device has storage capacity. For more information, see [Offline capabilities](offline-capabilities.md).

### Module communication

IoT Edge hub facilitates module to module communication. Using IoT Edge hub as a message broker keeps modules independent from each other. Modules only need to specify the inputs on which they accept messages and the outputs to which they write messages. A solution developer can stitch these inputs and outputs together so that the modules process data in the order specific to that solution. 

![IoT Edge Hub facilitates module-to-module communication](./media/iot-edge-runtime/module-endpoints.png)

To send data to the IoT Edge hub, a module calls the SendEventAsync method. The first argument specifies on which output to send the message. The following pseudocode sends a message on **output1**:

   ```csharp
   ModuleClient client = new ModuleClient.CreateFromEnvironmentAsync(transportSettings); 
   await client.OpenAsync(); 
   await client.SendEventAsync(“output1”, message); 
   ```

To receive a message, register a callback that processes messages coming in on a specific input. The following pseudocode registers the function messageProcessor to be used for processing all messages received on **input1**:

   ```csharp
   await client.SetInputMessageHandlerAsync(“input1”, messageProcessor, userContext);
   ```

For more information about the ModuleClient class and its communication methods, see the API reference for your preferred SDK language: [C#](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.moduleclient?view=azure-dotnet), [C and Python](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/iothub-module-client-h), [Java](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device.moduleclient?view=azure-java-stable), or [Node.js](https://docs.microsoft.com/javascript/api/azure-iot-device/moduleclient?view=azure-node-latest).

The solution developer is responsible for specifying the rules that determine how IoT Edge hub passes messages between modules. Routing rules are defined in the cloud and pushed down to IoT Edge hub in its device twin. The same syntax for IoT Hub routes is used to define routes between modules in Azure IoT Edge. For more information, see [Learn how to deploy modules and establish routes in IoT Edge](module-composition.md).   

![Routes between modules go through IoT Edge hub](./media/iot-edge-runtime/module-endpoints-with-routes.png)

## IoT Edge agent

The IoT Edge agent is the other module that makes up the Azure IoT Edge runtime. It is responsible for instantiating modules, ensuring that they continue to run, and reporting the status of the modules back to IoT Hub. Just like any other module, the IoT Edge agent uses its module twin to store this configuration data. 

The [IoT Edge security daemon](iot-edge-security-manager.md) starts the IoT Edge agent on device startup. The agent retrieves its module twin from IoT Hub and inspects the deployment manifest. The deployment manifest is a JSON file that declares the modules that need to be started. 

Each item in the deployment manifest contains specific information about a module and is used by the IoT Edge agent for controlling the module’s lifecycle. Some of the more interesting properties are: 

* **settings.image** – The container image that the IoT Edge agent uses to start the module. The IoT Edge agent must be configured with credentials for the container registry if the image is protected by a password. Credentials for the container registry can be configured remotely using the deployment manifest, or on the IoT Edge device itself by updating the `config.yaml` file in the IoT Edge program folder.
* **settings.createOptions** – A string that is passed directly to the Moby container daemon when starting a module’s container. Adding options in this property allows for advanced configurations like port forwarding or mounting volumes into a module’s container.  
* **status** – The state in which the IoT Edge agent places the module. Usually, this value is set to *running* as most people want the IoT Edge agent to immediately start all modules on the device. However, you could specify the initial state of a module to be stopped and wait for a future time to tell the IoT Edge agent to start a module. The IoT Edge agent reports the status of each module back to the cloud in the reported properties. A difference between the desired property and the reported property is an indicator of a misbehaving device. The supported statuses are:
   * Downloading
   * Running
   * Unhealthy
   * Failed
   * Stopped
* **restartPolicy** – How the IoT Edge agent restarts a module. Possible values include:
   * `never` – The IoT Edge agent never restarts the module.
   * `on-failure` - If the module crashes, the IoT Edge agent restarts it. If the module shuts down cleanly, the IoT Edge agent does not restart it.
   * `on-unhealthy` - If the module crashes or is considered unhealthy, the IoT Edge agent restarts it.
   * `always` - If the module crashes, is considered unhealthy, or shuts down in any way, the IoT Edge agent restarts it. 

The IoT Edge agent sends runtime response to IoT Hub. Here is a list of possible responses:
  * 200	- OK
  * 400	- The deployment configuration is malformed or invalid.
  * 417	- The device doesn't have a deployment configuration set.
  * 412	- The schema version in the deployment configuration is invalid.
  * 406	- The IoT Edge device is offline or not sending status reports.
  * 500	- An error occurred in the IoT Edge runtime.

For more information, see [Learn how to deploy modules and establish routes in IoT Edge](module-composition.md).   

### Security

The IoT Edge agent plays a critical role in the security of an IoT Edge device. For example, it performs actions like verifying a module’s image before starting it. 

For more information about the Azure IoT Edge security framework, read about the [IoT Edge security manager](iot-edge-security-manager.md).

## Next steps

[Understand Azure IoT Edge modules](iot-edge-modules.md)
