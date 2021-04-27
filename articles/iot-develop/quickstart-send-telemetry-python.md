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
**Completion time**:  15 minutes

In this quickstart, you learn a basic IoT application development workflow. First you create a cloud application to manage devices in  Azure IoT Central. Then, you use the Azure IoT Python SDK to build a simulated thermostat device,  connect it to IoT Central, and send telemetry.

## Prerequisites
- [Python 3.7](https://www.python.org/downloads/) or later. To check your Python version, run `python --version`. 
- An Azure account with an active subscription. Create an account for [free](https://aka.ms/createazuresubscription).
- In the Azure subscription, [add the user role](../role-based-access-control/role-assignments-portal.md) of **Contributor** to your account.


## Create an application
In this section, you create an IoT Central application. IoT Central is a portal-based IoT application platform that helps reduce the complexity and cost of developing and managing IoT solutions. 

To create an Azure IoT Central application:
1. Browse to [Azure IoT Central](https://apps.azureiotcentral.com/) and sign in with a Microsoft personal, work, or school account.
1. Navigate to **Build** and select **Custom apps**.
   :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-build.png" alt-text="IoT Central start page":::
1. In **Application name**, enter a unique name or use the generated name.
1. In **URL**, enter a memorable application URL prefix or use the generated URL prefix.
1. Leave **Application template** set to *Custom application*. The dropdown might show other options, if any templates already exist in your account.
1. Select a **Pricing plan** option. 
    - To use the application for free for seven days, select **Free**. You can convert a free application to standard pricing before it expires.
    - Optionally, you can select a standard pricing plan. If you select standard pricing, more options appear and you'll need to set a **Directory**, an **Azure subscription**, and a **Location**. To learn about pricing, see [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). 
        - **Directory** is the Azure Active Directory in which you create your application. An Azure Active Directory contains user identities, credentials, and other organizational information. If you don't have an Azure Active Directory, one is created when you create an Azure subscription.
        - An **Azure subscription** enables you to create instances of Azure services. IoT Central provisions resources in your subscription. If you have a subscription, you can select it in the dropdown.
        - **Location** is the [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/) in which you create an application. Select a location that's physically closest to your devices to get optimal performance. After you choose a location, you can't move the application to a different location.

    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-pricing.png" alt-text="IoT Central new application dialog":::
1. Select **Create**.
    
    After IoT Central creates the application, it redirects you to the application dashboard.
    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-created.png" alt-text="IoT Central new application dashboard":::

## Get connection information
To connect a real or simulated device to your IoT Central application, retrieve the following settings from the application. 

To get application connection settings:
1. Select **Administration > Device connection**.
1. In the **Device connection** dialog under **Enrollment groups**, select **SaS-IoT-Devices**.
1. In the **SaS-IoT-Devices** dialog, copy the following values. You'll use both in later steps.
    - **ID scope**. The application ID scope for devices.
    - **Primary key**. The group primary key for device groups.
    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-app-connection-settings.png" alt-text="IoT Central application device connection settings":::
1. Run the following code in the Azure Cloud Shell. This code generates a device key that devices use to connect to the application. 
    ```azurecli-interactive
    az extension add --name azure-iot
    az iot central device compute-device-key --device-id my-thermostat --pk <the group primary key value>
    ```
    Save the generated device key for use in the next section.

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

1. Set each of the following environment variables, to enable your simulated device to connect to IoT Central. For `IOTHUB_DEVICE_DPS_ID_SCOPE` and `IOTHUB_DEVICE_DPS_DEVICE_KEY`, use the values that you retrieved earlier.

    **Windows CMD**

    ```console
    set IOTHUB_DEVICE_SECURITY_TYPE=DPS
    set IOTHUB_DEVICE_DPS_ID_SCOPE=<application ID scope>
    set IOTHUB_DEVICE_DPS_DEVICE_KEY=<generated device key>
    set IOTHUB_DEVICE_DPS_ENDPOINT=global.azure-devices-provisioning.net
    ```

    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the connection string or other variable values.

    **PowerShell**

    ```azurepowershell
    $env:IOTHUB_DEVICE_SECURITY_TYPE='DPS'
    $env:IOTHUB_DEVICE_DPS_ID_SCOPE='<application ID scope>'
    $env:IOTHUB_DEVICE_DPS_DEVICE_KEY='<generated device key>'
    $env:IOTHUB_DEVICE_DPS_ENDPOINT='global.azure-devices-provisioning.net'
    ```

    **Bash (Linux or Windows)**

    ```bash
    export IOTHUB_DEVICE_SECURITY_TYPE='DPS'
    export IOTHUB_DEVICE_DPS_ID_SCOPE='<application ID scope>'
    export IOTHUB_DEVICE_DPS_DEVICE_KEY='<generated device key>'
    export IOTHUB_DEVICE_DPS_ENDPOINT='global.azure-devices-provisioning.net's
    ```

## Send telemetry
After configuring your system, you're ready to run the code. The code creates a simulated thermostat, 
connects to your IoT Central application and device instance, and sends telemetry.

1. In your terminal, run the code for the sample file *simple_send_temperature.py*. Optionally, you can run the Python sample code in your Python IDE.

    To run the Python sample from the terminal:
    ```console
    python temp_controller_with_thermostats.py
    ```

As the Python code sends a message from your device to your IoT Central application, it creates an instance of the device in the application and begins to receive telemetry. You might need to refresh the page to show recent messages.

To view device telemetry, select **Devices**, select your device, then select **Overview**. The overview provides a graphical view of device telemetry.

:::image type="content" source="media/quickstart-send-telemetry-python/iot-central-telemetry-overview.png" alt-text="IoT Central device telemetry overview":::

To view raw device telemetry, select **Raw** and expand some of the telemetry output.

:::image type="content" source="media/quickstart-send-telemetry-python/iot-central-telemetry-output.png" alt-text="IoT Central device telemetry raw output":::

Your device is now securely connected and sending telemetry to Azure IoT.

## Clean up resources
If you no longer need the IoT Central resources created in this tutorial, you can delete them from the IoT Central portal. Optionally, if you plan to continue following the documentation in this guide, you can keep the application you created and reuse it for other samples.

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
