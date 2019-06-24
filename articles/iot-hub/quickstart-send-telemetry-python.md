---
title: Send telemetry to Azure IoT Hub quickstart (Python) | Microsoft Docs
description: In this quickstart, you run a sample Python application to send simulated telemetry to an IoT hub and use a utility to read telemetry from the IoT hub.
author: wesmc7777
manager: philmea
ms.author: wesmc
ms.service: iot-hub
services: iot-hub
ms.devlang: python
ms.topic: quickstart
ms.custom: mvc
ms.date: 02/28/2019
# As a developer new to IoT Hub, I need to see how IoT Hub sends telemetry from a device to an IoT hub and how to read that telemetry data from the hub using a back-end application. 
---

# Quickstart: Send telemetry from a device to an IoT hub and read it with a back-end application (Python)

[!INCLUDE [iot-hub-quickstarts-1-selector](../../includes/iot-hub-quickstarts-1-selector.md)]

IoT Hub is an Azure service that enables you to ingest high volumes of telemetry from your IoT devices into the cloud for storage or processing. In this quickstart, you send telemetry from a simulated device application, through IoT Hub, to a back-end application for processing.

The quickstart uses a pre-written Python application to send the telemetry and a CLI utility to read the telemetry from the hub. Before you run these two applications, you create an IoT hub and register a device with the hub.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

The sample application you run in this quickstart is written using Python. Currently, the Microsoft Azure IoT SDKs for Python support only specific versions of Python for each platform. To learn more, see the [Python SDK Readme](https://github.com/Azure/azure-iot-sdk-python#important-installation-notes---dealing-with-importerror-issues).

This quickstart assumes you are using a Windows development machine. For Windows systems, only [Python 3.6.x](https://www.python.org/downloads/release/python-368/) is supported. The Python installer you choose should be based on the architecture of the system that you are working with. If your system CPU architecture is 32 bit, then download the x86 installer; for the 64-bit architecture, download the x86-64 installer. Additionally, make sure the [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads) is installed for your architecture (x86 or x64).

You can download Python for other platforms from [Python.org](https://www.python.org/downloads/).

You can verify the current version of Python on your development machine using one of the following commands:

```python
python --version
```

```python
python3 --version
```

Run the following command to add the Microsoft Azure IoT Extension for Azure CLI to your Cloud Shell instance. The IOT Extension adds IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS) specific commands to Azure CLI.

```azurecli-interactive
az extension add --name azure-cli-iot-ext
```

Download the sample Python project from https://github.com/Azure-Samples/azure-iot-samples-python/archive/master.zip and extract the ZIP archive.

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Register a device

A device must be registered with your IoT hub before it can connect. In this quickstart, you use the Azure Cloud Shell to register a simulated device.

1. Run the following command in Azure Cloud Shell to create the device identity.

    **YourIoTHubName**: Replace this placeholder below with the name you choose for your IoT hub.

    **MyPythonDevice**: This is the name given for the registered device. Use MyPythonDevice as shown. If you choose a different name for your device, you will also need to use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az iot hub device-identity create --hub-name YourIoTHubName --device-id MyPythonDevice
    ```

1. Run the following commands in Azure Cloud Shell to get the _device connection string_ for the device you registered:

    **YourIoTHubName**: Replace this placeholder below with the name you choose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name YourIoTHubName --device-id MyPythonDevice --output table
    ```

    Make a note of the device connection string, which looks like:

   `HostName={YourIoTHubName}.azure-devices.net;DeviceId=MyNodeDevice;SharedAccessKey={YourSharedAccessKey}`

    You use this value later in the quickstart.

## Send simulated telemetry

The simulated device application connects to a device-specific endpoint on your IoT hub and sends simulated temperature and humidity telemetry.

1. In a local terminal window, navigate to the root folder of the sample Python project. Then navigate to the **iot-hub\Quickstarts\simulated-device** folder.

1. Open the **SimulatedDevice.py** file in a text editor of your choice.

    Replace the value of the `CONNECTION_STRING` variable with the device connection string you made a note of previously. Then save your changes to **SimulatedDevice.py** file.

1. In the local terminal window, run the following commands to install the required libraries for the simulated device application:

    ```cmd/sh
    pip install azure-iothub-device-client
    ```

1. In the local terminal window, run the following commands to run the simulated device application:

    ```cmd/sh
    python SimulatedDevice.py
    ```

    The following screenshot shows the output as the simulated device application sends telemetry to your IoT hub:

    ![Run the simulated device](media/quickstart-send-telemetry-python/SimulatedDevice.png)
    
### To avoid the import iothub_client error
The current version of the Azure IoT SDK for Python is a wrapper over [our C SDK](https://github.com/azure/azure-iot-sdk-c). It is generated using the [Boost](https://www.boost.org/) library. Because of that, it comes with several significant limitations. See more details [here](https://github.com/Azure/azure-iot-sdk-python#important-installation-notes---dealing-with-importerror-issues)

1. Check that you have the right version of [Python](https://github.com/Azure/azure-iot-sdk-python#important-installation-notes---dealing-with-importerror-issues). Be aware that only certain versions works fine for this sample. 
2. Check that you have the right version of C++ runtime  [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads). (We recommend the latest).
3. Verify that you have installed the iothub client: `pip install azure-iothub-device-client`.

## Read the telemetry from your hub

The IoT Hub CLI extension can connect to the service-side **Events** endpoint on your IoT Hub. The extension receives the device-to-cloud messages sent from your simulated device. An IoT Hub back-end application typically runs in the cloud to receive and process device-to-cloud messages.

Run the following commands in Azure Cloud Shell, replacing `YourIoTHubName` with the name of your IoT hub:

```azurecli-interactive
az iot hub monitor-events --hub-name YourIoTHubName --device-id MyPythonDevice 
```

The following screenshot shows the output as the extension receives telemetry sent by the simulated device to the hub:

![Run the back-end application](media/quickstart-send-telemetry-python/ReadDeviceToCloud.png)

## Clean up resources

[!INCLUDE [iot-hub-quickstarts-clean-up-resources](../../includes/iot-hub-quickstarts-clean-up-resources.md)]

## Next steps

In this quickstart, you've setup an IoT hub, registered a device, sent simulated telemetry to the hub using a Python application, and read the telemetry from the hub using a simple back-end application.

To learn how to control your simulated device from a back-end application, continue to the next quickstart.

> [!div class="nextstepaction"]
> [Quickstart: Control a device connected to an IoT hub](quickstart-control-device-python.md)
