---
title: Azure IoT Hub device streams quickstart (NodeJS) | Microsoft Docs
description: In this quickstart, you will run a NodeJS service-side applications that communicates with an IoT device via a device stream.
author: rezasherafat
manager: briz
ms.service: iot-hub
services: iot-hub
ms.devlang: nodejs
ms.topic: quickstart
ms.custom: mvc
ms.date: 1/3/2019
ms.author: rezas
---

# Quickstart: Communicate to a device application via IoT Hub device streams (Node.js)

[!INCLUDE [iot-hub-quickstarts-3-selector](../../includes/iot-hub-quickstarts-3-selector.md)]

[IoT Hub device streams](./iot-hub-device-streams-overview.md) allow service and device applications to communicate in a secure and firewall-friendly manner. During public preview, Node.js SDK only supports device streams on the service side. As a result, this quickstart only covers instructions to run the service-side application. You should run an accompanying device-side application which is available in [C quickstart](./iot-hub-device-streams-c-echo-quickstart.md) or [C# quickstart](./iot-hub-device-streams-csharp-echo-quickstart.md) guides.

The service-side Node.js application in this quickstart has the following functionalities:

* Creates a device stream to an IoT device.

* Reads input from command line and sends it to the device application, which will echo it back.

The code will demonstrate the initiation of a device stream, and its use to send and receive data.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Prerequisites

To run the service-side application in this quickstart you need Node.js v4.x.x or later on your development machine.

You can download Node.js for multiple platforms from [Node.js.org](https://Node.js.org).

You can verify the current version of Node.js on your development machine using the following command:

```cmd/sh
node --version
```

If you haven't already done so, download the sample Node.js project from https://github.com/Azure-Samples/azure-iot-samples-node/archive/master.zip and extract the ZIP archive.

**Bug bash instructions:** Download the file from \\scratch2\scratch\rezas\devicstreamsbugbash\device-streams-nodejs.zip (`MD5=72AAFEC0C37976D60EF7B90CA92CE762`).


## Create an IoT hub

If you completed the previous [Quickstart: Send telemetry from a device to an IoT hub](quickstart-send-telemetry-node.md), you can skip this step.

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub-device-streams.md)]


## Register a device

If you completed the previous [Quickstart: Send telemetry from a device to an IoT hub](quickstart-send-telemetry-node.md), you can skip this step.

A device must be registered with your IoT hub before it can connect. In this quickstart, you use the Azure Cloud Shell to register a simulated device.

1. Run the following commands in Azure Cloud Shell to add the IoT Hub CLI extension and to create the device identity. 

   **YourIoTHubName**: Replace this placeholder below with the name you chose for your IoT hub.

   **MyDevice**: This is the name given for the registered device. Use MyDevice as shown. If you choose a different name for your device, you will also need to use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az extension add --name azure-cli-iot-ext
    az iot hub device-identity create --hub-name YourIoTHubName --device-id MyDevice
    ```

2. You also need a _service connection string_ to enable the back-end application to connect to your IoT hub and retrieve the messages. The following command retrieves the service connection string for your IoT hub:

    **YourIoTHubName**: Replace this placeholder below with the name you chose for your IoT hub.

    ```azurecli-interactive
    az iot hub show-connection-string --policy-name service --hub-name YourIoTHubName
    ```

    Make a note of the returned value, which looks like this:

   `"HostName={YourIoTHubName}.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey={YourSharedAccessKey}"`


## Communicate between device and service applications via IoT Hub device streams

### Run the device-side application

As mentioned earlier, IoT Hub Node.js SDK only supports device streams on the service side. For device-side application, use the accompanying device programs available in [C quickstart](./iot-hub-device-streams-c-echo-quickstart.md) or [C# quickstart](./iot-hub-device-streams-csharp-echo-quickstart.md) guides. Ensure the device-side application is running before proceeding to the next step.


### Run the service-side application

Assuming the device-side application is running, follow the steps below to run the service-side application in Node.js:

- Provide your service credentials and device ID as environment variables.
```cmd/sh
  # In Linux
  export IOTHUB_CONNECTION_STRING="<provide_your_service_connection_string>"
  export STREAMING_TARGET_DEVICE="MyDevice"

  # In Windows
  SET IOTHUB_CONNECTION_STRING=<provide_your_service_connection_string>
  SET STREAMING_TARGET_DEVICE=MyDevice
```
Change `MyDevice` to the device ID you chose for your device.

- Navigate to `service/samples` in your unzipped project folder and run the sample using node.
```cmd/sh
  cd ./service/samples
  npm install
  node c2d_tcp_streaming.js
```

**[Bugbash instructions]:** Use the following:
```cmd/sh
  cd ./bugbash-node/samples

  # Install the packages
  npm install
  npm install ../azure-iothub-1.10.0-preview.tgz

  # Run the application
  node c2d_tcp_streaming.js
```

At the end of the last step, the service-side program will initiate a stream to your device and once established will send a string buffer to the service over the stream. In this sample, the service-side program simply reads the stdin on the terminal and sends it to the device, which will then echo it back. This demonstrates successful bidirectional communication between the two applications.

<p>
    Console output on the service-side:
    <img src="./media/iot-hub-device-streams-nodejs-echo-quickstart/service-console-output.PNG"/>
</p>

You can then terminate the program by pressing enter again.


## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources](../../includes/iot-hub-quickstarts-clean-up-resources-device-streams.md)]


## Next steps

In this quickstart, you have set up an IoT hub, registered a device, established a device stream between applications on the device and service side, and used the stream to send data back and forth between the applications.

Use the links below to learn more about device streams:

> [!div class="nextstepaction"]
> [Device streams overview](./iot-hub-device-streams-overview.md)
> [Device streams tutorial](./iot-hub-device-streams-tutorial.md)
> [Try other quickstarts](/azure/iot-hub)