---
title: Azure IoT Hub device streams quickstart (C#) | Microsoft Docs
description: In this quickstart, you will run two sample C# applications that communicate via a device stream established through IoT Hub.
author: rezasherafat
manager: briz
ms.service: iot-hub
services: iot-hub
ms.devlang: csharp
ms.topic: quickstart
ms.custom: mvc
ms.date: 12/18/2018
ms.author: rezas
---

# Quickstart: Communicate to device applications via IoT Hub device streams (C#)

[!INCLUDE [iot-hub-quickstarts-3-selector](../../includes/iot-hub-quickstarts-3-selector.md)]

[IoT Hub device streams](./iot-hub-device-streams-overview.md) allow service and device applications to communicate in a secure and firewall-friendly manner. This quickstart involves two C# programs that leverage device streams to send data back and forth (echo).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

The two sample applications you run in this quickstart are written using C#. You need the .NET Core SDK 2.1.0 or greater on your development machine.

You can download the .NET Core SDK for multiple platforms from [.NET](https://www.microsoft.com/net/download/all).

You can verify the current version of C# on your development machine using the following command:

```cmd/sh
dotnet --version
```

**[TODO: update github link]**
Download the sample C# project from https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip and extract the ZIP archive.

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub-device-streams.md)]

## Register a device

A device must be registered with your IoT hub before it can connect. In this quickstart, you use the Azure Cloud Shell to register a simulated device.

1. Run the following commands in Azure Cloud Shell to add the IoT Hub CLI extension and to create the device identity. 

   **YourIoTHubName** : Replace this placeholder below with the name you choose for your IoT hub.

   **MyDevice** : This is the name given for the registered device. Use MyDevice as shown. If you choose a different name for your device, you will also need to use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az extension add --name azure-cli-iot-ext
    az iot hub device-identity create --hub-name YourIoTHubName --device-id MyDevice
    ```

2. Run the following commands in Azure Cloud Shell to get the _device connection string_ for the device you just registered:

   **YourIoTHubName** : Replace this placeholder below with the name you choose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name YourIoTHubName --device-id MyDevice --output table
    ```

    Make a note of the device connection string, which looks like:

   `HostName={YourIoTHubName}.azure-devices.net;DeviceId=MyNodeDevice;SharedAccessKey={YourSharedAccessKey}`

    You use this value later in the quickstart.

3. You also need the _service connection string_ from your IoT hub to enable the service-side application to connect to your IoT hub and establish a device stream. The following command retrieves this value for your IoT hub:

   **YourIoTHubName** : Replace this placeholder below with the name you choose for your IoT hub.

    ```azurecli-interactive
    az iot hub show-connection-string --policy-name service --hub-name YourIoTHubName
    ```

    Make a note of the returned value, which looks like this:

   `"HostName={YourIoTHubName}.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey={YourSharedAccessKey}"`
    

## Communicate between device and service apps via IoT Hub device streams

### Run the service-side application

Navigate to `ServiceClientC2DStreamingSample` in your unzipped project folder, and edit `App.config` file as follows:

| Parameter name | Parameter value |
|----------------|-----------------|
| `IotHubConnectionString` | Set the value to the service connection string of your IoT Hub. |
| `DeviceId` | Set the value to the device ID you created earlier. |

Compile and run the code as follows:

```azurecli-interactive
cd ./iot-hub/Samples/service/ServiceClientC2DStreamingSample/

# Build the application
dotnet build

# Run the application
dotnet run
```

### Run the device-side application

Navigate to `DeviceClientC2DStreamingSample` in your unzipped project folder, and edit `App.config` file as follows:

| Parameter name | Parameter value |
|----------------|-----------------|
| `DeviceConnectionString` | Set the value to the connection string of the device you created earlier. |

Compile and run the code as follows:

```azurecli-interactive
cd ./iot-hub/Samples/device/DeviceClientC2DStreamingSample/

# Build the application
dotnet build

# Run the application
dotnet run
```

At the end of the last step, the service-side program will initiate a stream to your device and once established will send a string buffer to the service over the stream. In this sample, the service-side program simply echos back the same data to the device, demonstrating successful bidirectional communication between the two applications. See figure below.

<p>
    Console output on the device-side:
    <img src="./media/iot-hub-device-streams-csharp-echo-quickstart/device-console-output.png"/>
</p>
<p>
    Console output on the service-side:
    <img src="./media/iot-hub-device-streams-csharp-echo-quickstart/service-console-output.png"/>
</p>


The traffic being sent over the stream will be tunneled through IoT Hub rather than being sent directly. This provides [these benefits](./iot-hub-device-streams-blog.md#benefits).

## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources](../../includes/iot-hub-quickstarts-clean-up-resources-device-streams.md)]

## Next steps

In this quickstart, you have set up an IoT hub, registered a device, established a device stream between C# applications on the device and service side, and used the stream to send data back and forth between the applications.

To learn how to use IoT Hub device streams for an existing client/server application such as SSH or RDP, continue to the next quickstart.

> [!div class="nextstepaction"]
> [Quickstart: SSH/RDP to your IoT devices using device streams (C#)](iot-hub-device-streams-csharp-proxy-quickstart.md)
> [Quickstart: SSH/RDP to your IoT devices using device streams (NodeJS)](iot-hub-device-streams-nodejs-proxy-quickstart.md)
> [Quickstart: SSH/RDP to your IoT devices using device streams (C)](iot-hub-device-streams-c-proxy-quickstart.md)
> [Quickstart: Communicate with IoT devices using device streams (echo) (NodeJS)](iot-hub-device-streams-nodejs-echo-quickstart.md)
> [Quickstart: Communicate with IoT devices using device streams (echo) (C)](iot-hub-device-streams-c-echo-quickstart.md)