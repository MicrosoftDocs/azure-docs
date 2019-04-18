---
title: Azure IoT Hub device streams C# quickstart (preview) | Microsoft Docs
description: In this quickstart, you will run two sample C# applications that communicate via a device stream established through IoT Hub.
author: rezasherafat
manager: briz
ms.service: iot-hub
services: iot-hub
ms.devlang: csharp
ms.topic: quickstart
ms.custom: mvc
ms.date: 03/14/2019
ms.author: rezas
---

# Quickstart: Communicate to device applications in C# via IoT Hub device streams (preview)

[!INCLUDE [iot-hub-quickstarts-3-selector](../../includes/iot-hub-quickstarts-3-selector.md)]

Microsoft Azure IoT Hub currently supports device streams as a [preview feature](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[IoT Hub device streams](./iot-hub-device-streams-overview.md) allow service and device applications to communicate in a secure and firewall-friendly manner. This quickstart involves two C# programs that leverage device streams to send data back and forth (echo).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

The preview of device streams is currently only supported for IoT Hubs created in the following regions:

  - **Central US**
  - **Central US EUAP**

The two sample applications you run in this quickstart are written using C#. You need the .NET Core SDK 2.1.0 or greater on your development machine.

You can download the .NET Core SDK for multiple platforms from [.NET](https://www.microsoft.com/net/download/all).

You can verify the current version of C# on your development machine using the following command:

```
dotnet --version
```

Run the following command to add the Microsoft Azure IoT Extension for Azure CLI to your Cloud Shell instance. The IOT Extension adds IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS) specific commands to Azure CLI.

```azurecli-interactive
az extension add --name azure-cli-iot-ext
```

Download the sample C# project from https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip and extract the ZIP archive. You will need it on both device and service side.

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub-device-streams.md)]

## Register a device

A device must be registered with your IoT hub before it can connect. In this quickstart, you use the Azure Cloud Shell to register a simulated device.

1. Run the following command in Azure Cloud Shell to create the device identity.

   **YourIoTHubName**: Replace this placeholder below with the name you choose for your IoT hub.

   **MyDevice**: This is the name given for the registered device. Use MyDevice as shown. If you choose a different name for your device, you will also need to use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az iot hub device-identity create --hub-name YourIoTHubName --device-id MyDevice
    ```

2. Run the following commands in Azure Cloud Shell to get the _device connection string_ for the device you just registered:

   **YourIoTHubName**: Replace this placeholder below with the name you choose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name YourIoTHubName --device-id MyDevice --output table
    ```

    Make a note of the device connection string, which looks like the following example:

   `HostName={YourIoTHubName}.azure-devices.net;DeviceId=MyDevice;SharedAccessKey={YourSharedAccessKey}`

    You use this value later in the quickstart.

3. You also need the _service connection string_ from your IoT hub to enable the service-side application to connect to your IoT hub and establish a device stream. The following command retrieves this value for your IoT hub:

   **YourIoTHubName**: Replace this placeholder below with the name you choose for your IoT hub.

    ```azurecli-interactive
    az iot hub show-connection-string --policy-name service --name YourIoTHubName
    ```

    Make a note of the returned value, which looks like this:

   `"HostName={YourIoTHubName}.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey={YourSharedAccessKey}"`

## Communicate between device and service via device streams

### Run the service-side application

Navigate to `iot-hub/Quickstarts/device-streams-echo/service` in your unzipped project folder. You will need the following information handy:

| Parameter name | Parameter value |
|----------------|-----------------|
| `ServiceConnectionString` | Provide the service connection string of your IoT Hub. |
| `DeviceId` | Provide the ID of the device you created earlier, for example, MyDevice. |

Compile and run the code as follows:

```
cd ./iot-hub/Quickstarts/device-streams-echo/service/

# Build the application
dotnet build

# Run the application
# In Linux/MacOS
dotnet run "<ServiceConnectionString>" "<MyDevice>"

# In Windows
dotnet run <ServiceConnectionString> <MyDevice>
```

> [!NOTE]
> A timeout occurs if the device-side application doesn't respond in time.

### Run the device-side application

Navigate to `iot-hub/Quickstarts/device-streams-echo/device` directory in your unzipped project folder. You will need the following information handy:

| Parameter name | Parameter value |
|----------------|-----------------|
| `DeviceConnectionString` | Provide the device connection string of your IoT Hub. |

Compile and run the code as follows:

```
cd ./iot-hub/Quickstarts/device-streams-echo/device/

# Build the application
dotnet build

# Run the application
# In Linux/MacOS
dotnet run "<DeviceConnectionString>"

# In Windows
dotnet run <DeviceConnectionString>
```

At the end of the last step, the service-side program will initiate a stream to your device and once established will send a string buffer to the service over the stream. In this sample, the service-side program simply echoes back the same data to the device, demonstrating successful bidirectional communication between the two applications. See figure below.

Console output on the device-side:
![alt text](./media/quickstart-device-streams-echo-csharp/device-console-output.png "Console output on the device-side")

Console output on the service-side:
![alt text](./media/quickstart-device-streams-echo-csharp/service-console-output.png "Console output on the service-side")

The traffic being sent over the stream will be tunneled through IoT Hub rather than being sent directly. This provides [these benefits](./iot-hub-device-streams-overview.md#benefits).

## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources](../../includes/iot-hub-quickstarts-clean-up-resources-device-streams.md)]

## Next steps

In this quickstart, you have set up an IoT hub, registered a device, established a device stream between C# applications on the device and service side, and used the stream to send data back and forth between the applications.

Use the links below to learn more about device streams:

> [!div class="nextstepaction"]
> [Device streams overview](./iot-hub-device-streams-overview.md)
