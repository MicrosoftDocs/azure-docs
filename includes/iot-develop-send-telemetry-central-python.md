---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 04/27/2023
 ms.author: timlt
 ms.custom: include file
---

[![Browse code](../articles/iot-develop/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-python/tree/v2/samples/pnp)

In this quickstart, you learn a basic Azure IoT application development workflow. First you create an Azure IoT Central application for hosting devices. Then you use an Azure IoT device SDK sample to create a temperature controller, connect it securely to IoT Central, and send telemetry. The temperature controller sample application runs on your local machine and generates simulated sensor data to send to IoT Central.

> [!TIP]
> As a developer, you have some options for how to connect devices to Azure IoT. To learn about connection options, see [What is Azure IoT device and application development?](../articles/iot-develop/about-iot-develop.md#selecting-a-service).

## Prerequisites
This quickstart runs on Windows, Linux, and Raspberry Pi. It's been tested on the following OS and device versions:

- Windows 10 or Windows 11
- Ubuntu 20.04 LTS
- Raspberry Pi OS (Raspbian) version 10, running on a Raspberry Pi 3 Model B+
- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Install the following prerequisites on your development machine:

- [Python](https://www.python.org/downloads/) version 3.7 or later. To check your Python version, run `python3 --version`.
- [Git](https://git-scm.com/downloads).

[!INCLUDE [iot-develop-create-central-app-with-device](iot-develop-create-central-app-with-device.md)]

## Run the device sample
In this section, you configure your local environment, install the Azure IoT Python device SDK, and run a sample that creates a temperature controller.

### Configure your environment

1. Open a console such as Windows CMD, PowerShell, or Bash.

1. Set the following environment variables, using the appropriate commands for your console. The device uses these values to connect to IoT Central. For `IOTHUB_DEVICE_DPS_ID_SCOPE`, `IOTHUB_DEVICE_DPS_DEVICE_KEY`, and `IOTHUB_DEVICE_DPS_DEVICE_ID`, use the device connection values that you saved previously.

    **CMD (Windows)**

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

    **Bash**

    ```bash
    export IOTHUB_DEVICE_SECURITY_TYPE='DPS'
    export IOTHUB_DEVICE_DPS_ID_SCOPE='<application ID scope>'
    export IOTHUB_DEVICE_DPS_DEVICE_KEY='<device primary key>'
    export IOTHUB_DEVICE_DPS_DEVICE_ID='<your device ID>'
    export IOTHUB_DEVICE_DPS_ENDPOINT='global.azure-devices-provisioning.net' 
    ```

### Install the SDK and samples

1. Copy the Azure IoT Python device SDK to your local machine.

    ```console
    git clone --branch v2 https://github.com/Azure/azure-iot-sdk-python
    ```
1. Navigate to the sample directory.

    **Windows**
    ```console
    cd azure-iot-sdk-python\samples\pnp
    ```

    **Linux or Raspberry Pi OS**
    ```console
    cd azure-iot-sdk-python/samples/pnp
    ```

1. Install the Azure IoT Python SDK.
    ```console
    pip3 install azure-iot-device
    ```

### Run the code

1. In your console, run the following code sample from the SDK. The sample creates a temperature controller with thermostat sensors.
    ```console
    python temp_controller_with_thermostats.py
    ```

    After your device connects to your IoT Central application, it connects to the device instance you created in the application and begins to send telemetry. The connection details and telemetry output are shown in your console: 
    
    ```output
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
