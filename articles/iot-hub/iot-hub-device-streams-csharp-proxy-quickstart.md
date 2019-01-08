---
title: Azure IoT Hub device streams quickstart for SSH/RDP (C#) | Microsoft Docs
description: In this quickstart, you will run two sample C# applications that enable SSH/RDP scenarios over an IoT Hub device stream.
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

# Quickstart: SSH/RDP over IoT Hub device streams (C#)

[!INCLUDE [iot-hub-quickstarts-4-selector](../../includes/iot-hub-quickstarts-4-selector.md)]

[IoT Hub device streams](./iot-hub-device-streams-overview.md) allow service and device applications to communicate in a secure and firewall-friendly manner. This quickstart involves two C# programs that enable SSH and RDP traffic to be sent over a device stream established through IoT Hub. See [this page](./iot-hub-device-streams-overview.md#local-proxies-sample-for-ssh-or-rdp) for an overview of the setup.

We first describe the setup for SSH (using port `22`). We then describe how to modify the setup for RDP (which uses port `3389`). Since device streams are application and protocol agnostic, the same sample can be modified (usually by changing the communication ports) to accommodate other types of application traffic.

### How it works?

The figure below, illustrates the setup of how the deivce- and service-local proxy programs in this sample will enable end-to-end connectivity between SSH client and SSH daemon. Here, we assume that the daemon is running on the same device as the device-local proxy.

<p>
    <img style="margin:auto;display:block;background-color:white;width:50%;" 
    src="./media/iot-hub-device-streams-csharp-proxy-quickstart/device-stream-proxy-diagram.svg">
</p>

1. Service-local proxy connects to IoT hub and initiates a device stream to the target device.
2. Device-local proxy completes the stream initiation handshake and establishes an end-to-end streaming tunnel through IoT Hub's streaming endpoint to the service side.
3. Device-local proxy connects to the SSH daemon (SSHD) listening on port `22` on the device (this is configurable, as described [below](#run-the-device-side-application)).
4. Service-local proxy awaits for new SSH connections from the user by listening on a designated port which in this case is port `2222` (this is also configurable, as described [below](#run-the-service-side-application)). When user connects via SSH client, the tunnel enables application traffic to be exchanged between the SSH client and server programs.

Note that the SSH traffic being sent over the stream will be tunneled through IoT Hub's streaming endpoint rather than being sent directly between service and device. This provides [these benefits](./iot-hub-device-streams-blog.md#benefits).

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
    

## SSH to a device via IoT Hub device streams

### Run the service-side proxy

Navigate to `ServiceLocalProxyC2DStreamingSample` in your unzipped project folder, and edit `App.config` file as follows:

| Parameter name | Parameter value |
|----------------|-----------------|
| `IotHubConnectionString` | Set the value to the service connection string of your IoT Hub. |
| `DeviceId` | Set the value to the device ID you created earlier. |
| `Port` | Set the value to the local port where your SSH client will connect (we use port `2222` in this sample, but you could modify this to other arbitrary numbers). |

Compile and run the code as follows:

```azurecli-interactive
cd ./iot-hub/Samples/service/ServiceLocalProxyC2DStreamingSample/

# Build the application
dotnet build

# Run the application
dotnet run
```

### Run the device-side proxy

Navigate to `DeviceLocalProxyC2DStreamingSample` in your unzipped project folder, and edit `App.config` file as follows:

| Parameter name | Parameter value |
|----------------|-----------------|
| `DeviceConnectionString` | Set the value to the connection string of the device you created earlier. |
| `RemoteHostName` | Set the value to the IP address where SSH daemon is listening on (this would be `localhost` if the daemon is running locally). |
| `RemotePort` | Set the value to the port which SSH daemon is listening on (by default, this would be port `22`).  |

Compile and run the code as follows:

```azurecli-interactive
cd ./iot-hub/Samples/device/DeviceLocalProxyC2DStreamingSample/

# Build the application
dotnet build

# Run the application
dotnet run
```

Now use your SSH client program and connect to service-local proxy on port `2222` (instead of the SSH daemon directly). 

```azurecli-interactive
ssh <username>@localhost -p 2222
```

At this point, you will be presented with the SSH login prompt to enter your credentials.

<p>
    Console output on the service-side (the service-local proxy listens on port <code>2222</code>):
    <img src="./media/iot-hub-device-streams-csharp-proxy-quickstart/service-console-output.png"/>
</p>

<p>
    Console output on the device-side (the device-local proxy connects to the SSH daemon at <code>IP_address:22</code>:
    <img src="./media/iot-hub-device-streams-csharp-proxy-quickstart/device-console-output.png"/>
</p>

<p>
    Console output of the SSH client program (SSH client communicates to SSH daemon by connecting to port <code>22</code> where service-local proxy is listening on):
    <img src="./media/iot-hub-device-streams-csharp-proxy-quickstart/ssh-console-output.png"/>
</p>

## RDP to a device via IoT Hub device streams

The setup for RDP is very similar to SSH (described above). We basically need to use the RDP destination IP and port `3389` instead and use RDP client (instead of SSH client).

### Run the service-side application

Navigate to `ServiceLocalProxyC2DStreamingSample` in your unzipped project folder, and edit `App.config` file as follows:

| Parameter name | Parameter value |
|----------------|-----------------|
| `IotHubConnectionString` | Set the value to the service connection string of your IoT Hub. |
| `DeviceId` | Set the value to the device ID you created earlier. |
| `Port` | Set the value to the local port where your RDP client will connect (we use port `2222` in this sample, but you could modify this to other arbitrary numbers). |

Compile and run the code as follows:

```azurecli-interactive
cd ./iothub/service/samples/ServiceLocalProxyC2DStreamingSample/

# Build the application
dotnet build

# Run the application
dotnet run
```

### Run the device-side application

Navigate to `DeviceLocalProxyC2DStreamingSample` in your unzipped project folder, and edit `App.config` file as follows:

| Parameter name | Parameter value |
|----------------|-----------------|
| `DeviceConnectionString` | Set the value to the connection string of the device you created earlier. |
| `RemoteHostName` | Set the value to the IP address where RDP server (this would be `localhost` if the same IP where device-local proxy is running). |
| `RemotePort` | Set the value to the RDP port (by default, this would be port `3389`).  |

Compile and run the code as follows:

```azurecli-interactive
cd ./iothub/device/samples/DeviceLocalProxyC2DStreamingSample/

# Build the application
dotnet build

# Run the application
dotnet run
```

Now use your RDP client program and connect to service-local proxy on port `2222`. 

<p>
    <img style="margin:auto;display:block;background-color:white;width:50%;" src="./media/iot-hub-device-streams-csharp-proxy-quickstart/rdp-screen-capture.PNG">
</p>

## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources](../../includes/iot-hub-quickstarts-clean-up-resources-device-streams)]

## Next steps

In this quickstart, you have set up an IoT hub, registered a device, deployed a device- and a service-local proxy program to establish a device stream through IoT Hub, and used the proxies to tunnel SSH or RDP traffic.

Use the links below to learn more about device stream:

> [!div class="nextstepaction"]
> [Quickstart: Communicate with IoT devices using device streams (echo) (C#)](iot-hub-device-streams-csharp-echo-quickstart.md)
> [Quickstart: Communicate with IoT devices using device streams (echo) (NodeJS)](iot-hub-device-streams-nodejs-echo-quickstart.md)
> [Quickstart: Communicate with IoT devices using device streams (echo) (C)](iot-hub-device-streams-c-echo-quickstart.md)
> [Quickstart: SSH/RDP to your IoT devices using device streams (NodeJS)](iot-hub-device-streams-nodejs-proxy-quickstart.md)
> [Quickstart: SSH/RDP to your IoT devices using device streams (C)](iot-hub-device-streams-c-proxy-quickstart.md)