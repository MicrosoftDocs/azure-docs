---
title: Communicate to a device app in Node.js via IoT Hub device streams (preview) | Microsoft Docs
description: In this quickstart, you will run a Node.js service-side applications that communicates with an IoT device via a device stream.
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.devlang: nodejs
ms.topic: quickstart
ms.custom: mvc
ms.date: 03/14/2019
ms.author: robinsh
---

# Quickstart: Communicate to a device application in Node.js via IoT Hub device streams (preview)

[!INCLUDE [iot-hub-quickstarts-3-selector](../../includes/iot-hub-quickstarts-3-selector.md)]

Microsoft Azure IoT Hub currently supports device streams as a [preview feature](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[IoT Hub device streams](./iot-hub-device-streams-overview.md) allow service and device applications to communicate in a secure and firewall-friendly manner. During public preview, Node.js SDK only supports device streams on the service side. As a result, this quickstart only covers instructions to run the service-side application. You should run an accompanying device-side application from one of the following quickstarts:

* [Communicate to device apps in C via IoT Hub device streams](./quickstart-device-streams-echo-c.md)

* [Communicate to device apps in C# via IoT Hub device streams](./quickstart-device-streams-echo-csharp.md).

The service-side Node.js application in this quickstart has the following functionalities:

* Creates a device stream to an IoT device.

* Reads input from command line and sends it to the device application, which will echo it back.

The code will demonstrate the initiation process of a device stream, as well as how to use it to send and receive data.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

The preview of device streams is currently only supported for IoT Hubs created in the following regions:

*  **Central US**

*  **Central US EUAP**

To run the service-side application in this quickstart you need Node.js v10.x.x or later on your development machine.

You can download Node.js for multiple platforms from [Nodejs.org](https://nodejs.org).

You can verify the current version of Node.js on your development machine using the following command:

```
node --version
```

Run the following command to add the Microsoft Azure IoT Extension for Azure CLI to your Cloud Shell instance. The IOT Extension adds IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS) specific commands to Azure CLI.

```azurecli-interactive
az extension add --name azure-cli-iot-ext
```

If you haven't already done so, download the sample Node.js project from https://github.com/Azure-Samples/azure-iot-samples-node/archive/streams-preview.zip and extract the ZIP archive.

## Create an IoT hub

If you completed the previous [Quickstart: Send telemetry from a device to an IoT hub](quickstart-send-telemetry-node.md), you can skip this step.

[!INCLUDE [iot-hub-include-create-hub-device-streams](../../includes/iot-hub-include-create-hub-device-streams.md)]

## Register a device

If you completed the previous [Quickstart: Send telemetry from a device to an IoT hub](quickstart-send-telemetry-node.md), you can skip this step.

A device must be registered with your IoT hub before it can connect. In this quickstart, you use the Azure Cloud Shell to register a simulated device.

1. Run the following command in Azure Cloud Shell to create the device identity.

   **YourIoTHubName**: Replace this placeholder below with the name you chose for your IoT hub.

   **MyDevice**: This is the name given for the registered device. Use MyDevice as shown. If you choose a different name for your device, you will also need to use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az iot hub device-identity create --hub-name YourIoTHubName --device-id MyDevice
    ```

2. You also need a *service connection string* to enable the back-end application to connect to your IoT hub and retrieve the messages. The following command retrieves the service connection string for your IoT hub:

    **YourIoTHubName**: Replace this placeholder below with the name you chose for your IoT hub.

    ```azurecli-interactive
    az iot hub show-connection-string --policy-name service --name YourIoTHubName
    ```

    Make a note of the returned value, which looks like this:

   `"HostName={YourIoTHubName}.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey={YourSharedAccessKey}"`

## Communicate between device and service via device streams

In this section, you run both the device-side application and the service-side application and communicate between the two.

### Run the device-side application

As mentioned earlier, IoT Hub Node.js SDK only supports device streams on the service side. For device-side application, use the accompanying device program available in one of these quickstarts:

   * [Communicate to device apps in C via IoT Hub device streams](./quickstart-device-streams-echo-c.md)

   * [Communicate to device apps in C# via IoT Hub device streams](./quickstart-device-streams-echo-csharp.md)

Ensure the device-side application is running before proceeding to the next step.

### Run the service-side application

Assuming the device-side application is running, follow the steps below to run the service-side application in Node.js:

* Provide your service credentials and device ID as environment variables.
 
   ```
   # In Linux
   export IOTHUB_CONNECTION_STRING="<provide_your_service_connection_string>"
   export STREAMING_TARGET_DEVICE="MyDevice"

   # In Windows
   SET IOTHUB_CONNECTION_STRING=<provide_your_service_connection_string>
   SET STREAMING_TARGET_DEVICE=MyDevice
   ```
  
   Change `MyDevice` to the device ID you chose for your device.

* Navigate to `Quickstarts/device-streams-service` in your unzipped project folder and run the sample using node.

   ```
   cd azure-iot-samples-node-streams-preview/iot-hub/Quickstarts/device-streams-service
    
   # Install the preview service SDK, and other dependencies
   npm install azure-iothub@streams-preview
   npm install

   node echo.js
   ```

At the end of the last step, the service-side program will initiate a stream to your device and once established will send a string buffer to the service over the stream. In this sample, the service-side program simply reads the `stdin` on the terminal and sends it to the device, which will then echo it back. This demonstrates successful bidirectional communication between the two applications.

![Service-side console output](./media/quickstart-device-streams-echo-nodejs/service-console-output.png)

You can then terminate the program by pressing enter again.

## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources-device-streams](../../includes/iot-hub-quickstarts-clean-up-resources-device-streams.md)]

## Next steps

In this quickstart, you have set up an IoT hub, registered a device, established a device stream between applications on the device and service side, and used the stream to send data back and forth between the applications.

Use the links below to learn more about device streams:

> [!div class="nextstepaction"]
> [Device streams overview](./iot-hub-device-streams-overview.md) 