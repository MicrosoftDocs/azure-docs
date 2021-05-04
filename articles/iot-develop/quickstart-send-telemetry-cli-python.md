---
title: Send device telemetry to Azure IoT Hub quickstart (Python) 
description: In this quickstart, you use the Azure IoT Hub Device SDK for Python to send telemetry from a device to an Iot hub.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: python
ms.topic: quickstart
ms.date: 03/24/2021
---

# Quickstart: Send telemetry from a device to an Azure IoT hub (Python)

**Applies to**: [Device application development](about-iot-develop.md#device-application-development)

In this quickstart, you learn a basic IoT device application development workflow. You use the Azure CLI to create an Azure IoT hub and a device, then you use the Azure IoT Python SDK to build a simulated client device and send telemetry to the hub. 

## Prerequisites
- If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Azure CLI. You can run all commands in this quickstart using the Azure Cloud Shell, an interactive CLI shell that runs in your browser. If you use the Cloud Shell, you don't need to install anything. If you prefer to use the CLI locally, this quickstart requires Azure CLI version 2.0.76 or later. Run az --version to find the version. To install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).
- [Python 3.7+](https://www.python.org/downloads/). For other versions of Python supported, see [Azure IoT Device Features](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device#azure-iot-device-features).
    
    To ensure that your Python version is up to date, run `python --version`. If you have both Python 2 and Python 3 installed, and are using a Python 3 environment, install all libraries using `pip3`. This command ensures that the libraries are installed to your Python 3 runtime.
    > [!IMPORTANT]
    > In the Python installer, select the option to **Add Python to PATH**. If you already have Python 3.7 or higher installed, confirm that you've added the Python installation folder to the `PATH` environment variable.

[!INCLUDE [iot-hub-include-create-hub-cli](../../includes/iot-hub-include-create-hub-cli.md)]

## Use the Python SDK to send messages
In this section, you will use the Python SDK to send messages from your simulated device to your IoT hub.

1. Open a new terminal window. You will use this terminal to install the Python SDK and work with Python sample code. You should now have two terminals open: the one you just opened to work with Python, and the CLI shell you used in previous sections to enter Azure CLI commands.       

1. Copy the [Azure IoT Python SDK device samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples) to your local machine:

    ```console
    git clone https://github.com/Azure/azure-iot-sdk-python
    ```
1. Navigate to the *azure-iot-sdk-python/azure-iot-device/samples/pnp* directory:

    ```console
    cd azure-iot-sdk-python/azure-iot-device/samples/pnp
    ```
1. Install the Azure IoT Python SDK:

    ```console
    pip install azure-iot-device
    ```
1. Set both of the following environment variables, to enable your simulated device to connect to Azure IoT.
    * Set an environment variable called `IOTHUB_DEVICE_CONNECTION_STRING`. For the variable value, use the device connection string that you saved in the previous section.
    * Set an environment variable called `IOTHUB_DEVICE_SECURITY_TYPE`. For the variable, use the literal string value `connectionString`.

    **Windows (cmd)**

    ```console
    set IOTHUB_DEVICE_CONNECTION_STRING=<your connection string here>
    ```
    ```console
    set IOTHUB_DEVICE_SECURITY_TYPE=connectionString
    ```

    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the string values for each variable.

    **PowerShell**

    ```azurepowershell
    $env:IOTHUB_DEVICE_CONNECTION_STRING='<your connection string here>'
    ```
    ```azurepowershell
    $env:IOTHUB_DEVICE_SECURITY_TYPE='connectionString'
    ```

    **Bash (Linux or Windows)**

    ```bash
    export IOTHUB_DEVICE_CONNECTION_STRING="<your connection string here>"
    ```
    ```bash
    export IOTHUB_DEVICE_SECURITY_TYPE="connectionString"
    ```

1. In your open CLI shell, run the [az iot hub monitor-events](/cli/azure/iot/hub#az_iot_hub_monitor_events) command to begin monitoring for events on your simulated IoT device.  Event messages print in the terminal as they arrive.

    ```azurecli
    az iot hub monitor-events --output table --hub-name {YourIoTHubName}
    ```

1. In your Python terminal, run the code for the installed sample file *simple_thermostat.py*. This code accesses the simulated IoT device and sends a message to the IoT hub.

    To run the Python sample from the terminal:
    ```console
    python ./simple_thermostat.py
    ```
    > [!NOTE]
    > This code sample uses Azure IoT Plug and Play, which lets you integrate smart devices into your solutions without any manual configuration.  By default, most samples in this documentation use IoT Plug and Play. To learn more about the advantages of IoT PnP, and cases for using or not using it, see [What is IoT Plug and Play?](../iot-pnp/overview-iot-plug-and-play.md)

 As the Python code sends a message from your device to the IoT hub, the message appears in your CLI shell that is monitoring events:

```output
Starting event monitor, use ctrl-c to stop...
event:
  component: ''
  interface: dtmi:com:example:Thermostat;1
  module: ''
  origin: <your device name>
  payload:
    temperature: 35
```

Your device is now securely connected and sending telemetry to Azure IoT Hub.

## Clean up resources
If you no longer need the Azure resources created in this quickstart, you can use the Azure CLI to delete them.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources.

To delete a resource group by name:
1. Run the [az group delete](/cli/azure/group#az_group_delete) command. This command removes the resource group, the IoT Hub, and the device registration you created.

    ```azurecli
    az group delete --name MyResourceGroup
    ```
1. Run the [az group list](/cli/azure/group#az_group_list) command to confirm the resource group is deleted.  

    ```azurecli
    az group list
    ```

## Next steps
In this quickstart, you learned a basic Azure IoT application workflow for securely connecting a device to the cloud and sending device-to-cloud telemetry. You used the Azure CLI to create an IoT hub and a device, then you used the Azure IoT Python SDK to build a simulated device and send telemetry to the hub. 

As a next step, explore the Azure IoT Python SDK through application samples.

- [Asynchronous Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/async-hub-scenarios): This directory contains asynchronous Python samples for more IoT Hub scenarios.
- [Synchronous Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/sync-samples): This directory contains Python samples for use with Python 2.7 or synchronous compatibility scenarios for Python 3.6+
- [IoT Edge samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/async-edge-scenarios): This directory contains Python samples for working with Edge modules and downstream devices.
