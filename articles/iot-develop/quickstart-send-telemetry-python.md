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

**Applies to**: [Device application development](about-iot-develop.md#device-application-development)

In this quickstart, you learn a basic IoT device application development workflow. First you use Azure IoT Central to create a cloud application. Then you use the Azure IoT Python SDK to build a simulated device, connect to IoT Central, and send device-to-cloud telemetry. 

## Prerequisites
- [Python 3.7+](https://www.python.org/downloads/). For other versions of Python supported, see [Azure IoT Device Features](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device#azure-iot-device-features).
    
    To ensure that your Python version is up to date, run `python --version`. If you have both Python 2 and Python 3 installed, and are using a Python 3 environment, install all libraries using `pip3`. Running `pip3` ensures that the libraries are installed to your Python 3 runtime.
    > [!IMPORTANT]
    > In the Python installer, select the option to **Add Python to PATH**. If you already have Python 3.7 or higher installed, confirm that you've added the Python installation folder to the `PATH` environment variable.

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
        - An **Azure subscription** enables you to create instances of Azure services. IoT Central provisions resources in your subscription. If you don't have an Azure subscription, you can [create one for free](https://azure.microsoft.com/free/). After you create the subscription, return to the IoT Central **New application** page. Your new subscription appears in the **Azure subscription** drop-down.
        - **Location** is the [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/) in which you create an application. Select a location that's physically closest to your devices to get optimal performance. After you choose a location, you can't move the application to a different location.

    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-pricing.png" alt-text="IoT Central new application dialog":::
1. Select **Create**.
    
    After IoT Central creates the application, it redirects you to the application dashboard.
    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-created.png" alt-text="IoT Central new application dashboard":::

## Add a device
In this section, you add a new device to your IoT Central application. The device is an instance of a device template that represents a real or simulated device that you'll connect to the application. 

To create a new device:
1. In the left pane select **Devices**, then select **+New**. This opens the new device dialog.
1. Leave **Device template** set to *Unassigned*.

    > [!NOTE]
    > In this quickstart for simplicity, you connect a simulated device that uses an unassigned template. If you continue using IoT Central to manage devices, you'll learn about using device templates. For an overview of working with device templates, see [Quickstart: Add a simulated device to your IoT Central application](../iot-central/core/quick-create-simulated-device.md).
1. Set a friendly **Device name** and **Device ID**. Optionally, use the generated values.
    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-create-device.png" alt-text="IoT Central new device dialog":::
1. Select **Create**.

    The created device appears in the **All devices** list.
    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-devices-list.png" alt-text="IoT Central all devices list":::
    
To retrieve connection details for the new device:
1. In the **All devices** list, double-click the linked device name to display details. 
1. In the top menu, select **Connect**.

    The **Device connection** dialog displays the connection details:
    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-device-connect.png" alt-text="IoT Central device connection details":::
1. Copy the following values from the **Device connection** dialog to a safe location. You'll use these in the next section to connect your device to IoT Central.
    * `ID scope`
    * `Device ID`
    * `Primary key`

## Send messages and monitor telemetry
In this section, you will use the Python SDK to build a simulated device and send telemetry to your IoT Central application. 

1. Open a terminal using Windows CMD, or PowerShell, or Bash (for Windows or Linux). You'll use the terminal to install the Python SDK, update environment variables, and run the Python code sample.

1. Copy the [Azure IoT Python SDK device samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples) to your local machine.

    ```console
    git clone https://github.com/Azure/azure-iot-sdk-python
    ```

1. Navigate to the *azure-iot-sdk-python/azure-iot-device/samples* directory.

    ```console
    cd azure-iot-sdk-python/azure-iot-device/samples
    ```
1. Install the Azure IoT Python SDK.

    ```console
    pip install azure-iot-device
    ```

1. Set each of the following environment variables, to enable your simulated device to connect to IoT Central. For `ID_SCOPE`, `DEVICE_ID`, and `DEVICE_KEY`, use the values that you saved from the IoT Central *Device connection* dialog.

    **Windows CMD**

    ```console
    set PROVISIONING_HOST=global.azure-devices-provisioning.net
    ```
    ```console
    set ID_SCOPE=<your ID scope>
    ```
    ```console
    set DEVICE_ID=<your device ID>
    ```
    ```console
    set DEVICE_KEY=<your device's primary key>
    ```

    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the connection string or other variable values.

    **PowerShell**

    ```azurepowershell
    $env:PROVISIONING_HOST='global.azure-devices-provisioning.net'
    ```
    ```azurepowershell
    $env:ID_SCOPE='<your ID scope>'
    ```
    ```azurepowershell
    $env:DEVICE_ID='<your device ID>'
    ```
    ```azurepowershell
    $env:DEVICE_KEY='<your device's primary key>'
    ```

    **Bash (Linux or Windows)**

    ```bash
    export PROVISIONING_HOST='global.azure-devices-provisioning.net'
    ```
    ```bash
    export ID_SCOPE='<your ID scope>'
    ```
    ```bash
    export DEVICE_ID='<your device ID>'
    ```
    ```bash
    export DEVICE_KEY='<your device's primary key>'
    ```

1. In your terminal, run the code for the sample file *simple_send_temperature.py. This code accesses the simulated IoT device and sends a message to IoT Central.

    To run the Python sample from the terminal:
    ```console
    python ./simple_send_temperature.py
    ```

    Optionally, you can run the Python code from the sample in your Python IDE:
    ```python
    import asyncio
    import os
    from azure.iot.device.aio import ProvisioningDeviceClient
    from azure.iot.device.aio import IoTHubDeviceClient
    from azure.iot.device import Message
    import uuid
    import json
    import random

    # ensure environment variables are set for your device and IoT Central application credentials
    provisioning_host = os.getenv("PROVISIONING_HOST")
    id_scope = os.getenv("ID_SCOPE")
    registration_id = os.getenv("DEVICE_ID")
    symmetric_key = os.getenv("DEVICE_KEY")

    # allows the user to quit the program from the terminal
    def stdin_listener():
        """
        Listener for quitting the sample
        """
        while True:
            selection = input("Press Q to quit\n")
            if selection == "Q" or selection == "q":
                print("Quitting...")
                break

    async def main():

        # provisions the device to IoT Central-- this uses the Device Provisioning Service behind the scenes
        provisioning_device_client = ProvisioningDeviceClient.create_from_symmetric_key(
            provisioning_host=provisioning_host,
            registration_id=registration_id,
            id_scope=id_scope,
            symmetric_key=symmetric_key,
        )

        registration_result = await provisioning_device_client.register()

        print("The complete registration result is")
        print(registration_result.registration_state)

        if registration_result.status == "assigned":
            print("Your device has been provisioned. It will now begin sending telemetry.")
            device_client = IoTHubDeviceClient.create_from_symmetric_key(
                symmetric_key=symmetric_key,
                hostname=registration_result.registration_state.assigned_hub,
                device_id=registration_result.registration_state.device_id,
            )

            # Connect the client.
            await device_client.connect()

        # Send the current temperature as a telemetry message
        async def send_telemetry():
            print("Sending telemetry for temperature")

            while True:
                current_temp = random.randrange(10, 50)  # Current temperature in Celsius (randomly generated)
                # Send a single temperature report message
                temperature_msg = {"temperature": current_temp}

                msg = Message(json.dumps(temperature_msg))
                msg.content_encoding = "utf-8"
                msg.content_type = "application/json"
                print("Sent message")
                await device_client.send_message(msg)
                await asyncio.sleep(8)

        send_telemetry_task = asyncio.create_task(send_telemetry())

        # Run the stdin listener in the event loop
        loop = asyncio.get_running_loop()
        user_finished = loop.run_in_executor(None, stdin_listener)
        # Wait for user to indicate they are done listening for method calls
        await user_finished

        send_telemetry_task.cancel()
        # Finally, shut down the client
        await device_client.disconnect()

    if __name__ == "__main__":
        asyncio.run(main())

        # If using Python 3.6 or below, use the following code instead of asyncio.run(main()):
        # loop = asyncio.get_event_loop()
        # loop.run_until_complete(main())
        # loop.close()
    ```

As the Python code sends a message from your device to your IoT Central application, the messages appear in the **Raw data** tab of your device in IoT Central. You might need to refresh the page to show recent messages.

   :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-telemetry-output.png" alt-text="Screen shot of IoT Central raw data output":::

Your device is now securely connected and sending telemetry to Azure IoT.

## Clean up resources
If you no longer need the IoT Central resources created in this tutorial, you can delete them from the IoT Central portal. Optionally, if you plan to continue following the documentation in this guide, you can keep the application you created and reuse it for other samples.

To remove the Azure IoT Central sample application and all its devices and resources:
1. Select **Administration** > **Your application**.
1. Select **Delete**.

## Next steps

In this quickstart, you learned a basic Azure IoT application workflow for securely connecting a device to the cloud and sending device-to-cloud telemetry. You used the Azure IoT Central to create an application and a device, then you used the Azure IoT Python SDK to create a simulated device and send telemetry. You also used IoT Central to monitor the telemetry.

As a next step, explore the Azure IoT Python SDK through application samples.

- [Asynchronous Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/async-hub-scenarios): This directory contains asynchronous Python samples for additional IoT Hub scenarios.
- [Synchronous Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/sync-samples): This directory contains Python samples for use with Python 2.7 or synchronous compatibility scenarios for Python 3.5+
- [IoT Edge samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/async-edge-scenarios): This directory contains Python samples for working with Edge modules and downstream devices.
