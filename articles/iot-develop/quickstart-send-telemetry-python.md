---
title: Send device telemetry to Azure IoT Central quickstart (Python)
description: In this quickstart, you use the Azure IoT Hub Device SDK for Python to send telemetry from a device to IoT Central.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.devlang: python
ms.topic: quickstart
ms.date: 01/11/2021
---

# Quickstart: Send telemetry from a device to Azure IoT Central (Python)

**Applies to**: [Device application developers](about-iot-develop.md#device-application-development)<br>
**Completion time**:  12 minutes

In this quickstart, you learn a basic IoT application development workflow. First you create a cloud application to manage devices in  Azure IoT Central. Then, you use the Azure IoT Python SDK to build a simulated thermostat device,  connect it to IoT Central, and send telemetry.

## Prerequisites
- [Python 3.7](https://www.python.org/downloads/) or later. To check your Python version, run `python --version`. 

## Create an application
There are several ways to connect devices to Azure IoT. In this section, you learn how to connect a device by using Azure IoT Central. IoT Central is an IoT application platform that reduces the cost and complexity of managing devices in an IoT solution.

To create a new application:
1. Browse to [Azure IoT Central](https://apps.azureiotcentral.com/) and sign in with a Microsoft personal, work, or school account.
1. Navigate to **Build** and select **Custom apps**.
   :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-build.png" alt-text="IoT Central start page":::
1. In **Application name**, enter a unique name or use the generated name.
1. In **URL**, enter a memorable application URL prefix or use the generated URL prefix.
1. Leave **Application template** set to *Custom application*. 
1. Select a **Pricing plan** option. 
    - To use the application for free for seven days, select **Free**. You can convert a free application to standard pricing before it expires.
    - Optionally, you can select a standard pricing plan. If you select standard pricing, more options appear and you'll need to set a **Directory**, an **Azure subscription**, and a **Location**. To learn about pricing, see [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). 
        - **Directory** is the Azure Active Directory in which you create your application. An Azure Active Directory contains user identities, credentials, and other organizational information. If you don't have an Azure Active Directory, one is created when you create an Azure subscription.
        - An **Azure subscription** enables you to create instances of Azure services. IoT Central provisions resources in your subscription. If you don't have a subscription, you can create one for [free](https://aka.ms/createazuresubscription). If you have a subscription, you can select it in the dropdown.
        - **Location** is the [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/) in which you create an application. Select a location that's physically closest to your devices to get optimal performance. After you choose a location, you can't move the application to a different location.

    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-pricing.png" alt-text="IoT Central new application dialog":::
1. Select **Create**.
    
    After IoT Central creates the application, it redirects you to the application dashboard.
    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-created.png" alt-text="IoT Central new application dashboard":::

## Add a device
In this section, you add a new device to your IoT Central application. The device is an instance of a device template that represents a real or simulated device that you'll connect to the application. 

To create a new device:
1. In the left pane select **Devices**, then select **+New**.
1. Leave **Device template** set to *Unassigned*.

    > [!NOTE]
    > In this quickstart for simplicity, you connect a simulated device that uses an unassigned template. If you continue using IoT Central to manage devices, you'll learn about using device templates. For an overview of working with device templates, see [Quickstart: Add a simulated device to your IoT Central application](../iot-central/core/quick-create-simulated-device.md).
1. Set a friendly **Device name** and **Device ID**. Optionally, use the generated values.
    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-create-device.png" alt-text="IoT Central new device dialog":::
1. Select **Create**.

    The created device appears in the **All devices** list.
    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-devices-list.png" alt-text="IoT Central all devices list":::
    
To retrieve connection details for the new device:
1. In the **All devices** list, click the linked device name to display details. 
1. In the top menu, select **Connect**.

    The **Device connection** dialog displays the connection details:
    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-device-connect.png" alt-text="IoT Central device connection details":::
1. Copy the following values from the **Device connection** dialog to a safe location. You'll use these values in the next section to connect your device to IoT Central.
    * `ID scope`
    * `Device ID`
    * `Primary key`

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
    > [!NOTE]
    > If you have both Python 2 and Python 3 installed, and use a Python 3 environment, use the `pip3` command rather `pip` to install libraries. Running `pip3` ensures that the libraries are installed to your Python 3 runtime.

    ```console
    pip install azure-iot-device
    ```

1. Set each of the following environment variables, to enable your simulated device to connect to IoT Central. For `IOTHUB_DEVICE_DPS_ID_SCOPE`, `IOTHUB_DEVICE_DPS_DEVICE_KEY`, `IOTHUB_DEVICE_DPS_DEVICE_ID`, use the device connection values that you saved earlier.

    **Windows CMD**

    ```console
    set IOTHUB_DEVICE_SECURITY_TYPE=DPS
    set IOTHUB_DEVICE_DPS_ID_SCOPE=<application ID scope>
    set IOTHUB_DEVICE_DPS_DEVICE_KEY=<device primary key>
    set IOTHUB_DEVICE_DPS_DEVICE_ID=<your device ID>
    set IOTHUB_DEVICE_DPS_ENDPOINT=global.azure-devices-provisioning.net
    ```

    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the connection string or other variable values.

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

1. In your terminal, run the code for the sample file *simple_send_temperature.py*. Optionally, you can run the Python sample code in your Python IDE.
    ```console
    python temp_controller_with_thermostats.py
    ```

    After your simulated device connects to your IoT Central application, it connects to the device instance you created in the application and begins to send telemetry. The connection details and telemetry output are shown in your console: 
    
    ```console
    c:\azure-iot-sdk-python\azure-iot-device\samples\pnp>python temp_controller_with_thermostats.py
    Device was assigned
    iotc-55eb28ee-c912-4ffb-9188-4a2ffb83933d.azure-devices.net
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
> [Asynchronous Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/async-hub-scenarios)
> [!div class="nextstepaction"]
> [Synchronous Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/sync-samples)
