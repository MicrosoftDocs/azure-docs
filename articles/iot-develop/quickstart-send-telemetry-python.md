---
title: Send device telemetry to Azure IoT Central quickstart (Python)
description: In this quickstart, you use the Azure IoT Hub Device SDK for Python to send telemetry from a device to IoT Central.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: python
ms.topic: quickstart
ms.date: 04/27/2021
---

# Quickstart: Send telemetry from a device to Azure IoT Central (Python)

**Applies to**: [Device application developers](about-iot-develop.md#device-application-development)<br>
**Completion time**:  12 minutes

In this quickstart, you learn a basic IoT application development workflow. First you create a cloud application to manage devices in  Azure IoT Central. Then, you use the Azure IoT Python SDK to build a simulated thermostat device,  connect it to IoT Central, and send telemetry.

## Prerequisites
- [Python 3.7](https://www.python.org/downloads/) or later. To check your Python version, run `python --version`. 

[!INCLUDE [iot-develop-create-central-app-with-device](../../includes/iot-develop-create-central-app-with-device.md)]

## Configure a simulated device
In this section, you use the Python SDK samples to configure a simulated thermostat device.

1. Open a terminal using Windows CMD, or PowerShell, or Bash (for Windows or Linux). You'll use the terminal to install the Python SDK, update environment variables, and run the Python code sample.

1. Copy the [Azure IoT Python SDK device samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples) to your local machine.

    ```console
    git clone https://github.com/Azure/azure-iot-sdk-python
    ```

1. Navigate to the samples directory.

    ```console
    cd azure-iot-sdk-python/azure-iot-device/samples/pnp
    ```
1. Install the Azure IoT Python SDK.
    ```console
    pip3 install azure-iot-device
    ```

1. Set each of the following environment variables, to enable your simulated device to connect to IoT Central. For `IOTHUB_DEVICE_DPS_ID_SCOPE`, `IOTHUB_DEVICE_DPS_DEVICE_KEY`, and `IOTHUB_DEVICE_DPS_DEVICE_ID`, use the device connection values that you saved.

    **Windows CMD**

    ```console
    set IOTHUB_DEVICE_SECURITY_TYPE=DPS
    set IOTHUB_DEVICE_DPS_ID_SCOPE=<application ID scope>
    set IOTHUB_DEVICE_DPS_DEVICE_KEY=<device primary key>
    set IOTHUB_DEVICE_DPS_DEVICE_ID=<your device ID>
    set IOTHUB_DEVICE_DPS_ENDPOINT=global.azure-devices-provisioning.net
    ```

    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the variable values.

    **PowerShell**

    ```azurepowershell
    $env:IOTHUB_DEVICE_SECURITY_TYPE='DPS'
    $env:IOTHUB_DEVICE_DPS_ID_SCOPE='<application ID scope>'
    $env:IOTHUB_DEVICE_DPS_DEVICE_KEY='<device primary key>'
    $env:IOTHUB_DEVICE_DPS_DEVICE_ID='<your device ID>'
    $env:IOTHUB_DEVICE_DPS_ENDPOINT='global.azure-devices-provisioning.net'
    ```

    **Bash (Linux or Windows)**

    ```bash
    export IOTHUB_DEVICE_SECURITY_TYPE='DPS'
    export IOTHUB_DEVICE_DPS_ID_SCOPE='<application ID scope>'
    export IOTHUB_DEVICE_DPS_DEVICE_KEY='<device primary key>'
    export IOTHUB_DEVICE_DPS_DEVICE_ID='<your device ID>'
    export IOTHUB_DEVICE_DPS_ENDPOINT='global.azure-devices-provisioning.net' 
    ```

## Send telemetry
After configuring your system, you're ready to run the code. The code creates a simulated thermostat, 
connects to your IoT Central application and device instance, and sends telemetry.

1. In your terminal, run the following code sample. Optionally, you can run the Python sample code in your Python IDE.
    ```console
    python temp_controller_with_thermostats.py
    ```

    After your simulated device connects to your IoT Central application, it connects to the device instance you created in the application and begins to send telemetry. The connection details and telemetry output are shown in your console: 
    
    ```output
    c:\azure-iot-sdk-python\azure-iot-device\samples\pnp>python temp_controller_with_thermostats.py
    Device was assigned
    iotc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azure-devices.net
    my-sdk-device
    Updating pnp properties for root interface
    {'serialNumber': 'alohomora'}
    Updating pnp properties for thermostat1
    {'thermostat1': {'maxTempSinceLastReboot': 98.34, '__t': 'c'}}
    Updating pnp properties for thermostat2
    {'thermostat2': {'maxTempSinceLastReboot': 48.92, '__t': 'c'}}
    Updating pnp properties for deviceInformation
    {'deviceInformation': {'swVersion': '5.5', 'manufacturer': 'Contoso Device Corporation', 'model': 'Contoso 4762B-turbo', 'osName': 'Mac Os', 'processorArchitecture': 'x86-64', 'processorManufacturer': 'Intel', 'totalStorage': 1024, 'totalMemory': 32, '__t': 'c'}}
    Listening for command requests and property updates
    Press Q to quit
    Sending telemetry from various components
    Sent message
    {"temperature": 33}
    ```

1. In IoT Central, select **Devices**, click your device name, then select the **Raw data** tab. This view displays the raw telemetry from the simulated device. 

    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-telemetry-output.png" alt-text="IoT Central device telemetry raw output":::
    
    Your device is now securely connected and sending telemetry to Azure IoT.
    
## Clean up resources
If you no longer need the IoT Central resources created in this quickstart, you can delete them. Optionally, if you plan to continue following the documentation in this guide, you can keep the application you created and reuse it for other samples.

To remove the Azure IoT Central sample application and all its devices and resources:
1. Select **Administration** > **Your application**.
1. Select **Delete**.

## Next steps

In this quickstart, you learned a basic Azure IoT application workflow for securely connecting a device to the cloud and sending device-to-cloud telemetry. You used the Azure IoT Central to create an application and a device, then you used the Azure IoT Python SDK to create a simulated device and send telemetry. You also used IoT Central to monitor the telemetry.

As a next step, explore IoT Central as a solution for hosting your devices, and explore the Azure SDK Python code samples.

> [!div class="nextstepaction"]
> [Create an IoT Central application](../iot-central/core/quick-deploy-iot-central.md)
> [!div class="nextstepaction"]
> [Asynchronous device amples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/async-hub-scenarios)
> [!div class="nextstepaction"]
> [Synchronous device samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/sync-samples)
