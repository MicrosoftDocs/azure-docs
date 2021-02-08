---
title: Send device telemetry to Azure IoT Central quickstart (Python)
description: In this quickstart, you use the Azure IoT Hub Device SDK for Python to send telemetry from a device to IoT Central.
author: elhorton
ms.author: elhorton
ms.service: iot-develop
ms.devlang: python
ms.topic: quickstart
ms.date: 01/11/2021
---

# Quickstart: Send telemetry from a device to IoT Central (Python)

***Applies to**: device application developers*   


In this quickstart, you learn a basic IoT development workflow for securely connecting a device to the cloud, and sending telemetry. First you use Azure IoT Central to create a cloud application. Then you use the Azure IoT Python SDK to build a simulated device, connect to IoT Central, and send device-to-cloud telemetry. 

## Prerequisites
- [Python 3.7 or later](https://www.python.org/downloads/). For other versions of Python supported, see [Azure IoT Device Features](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device#azure-iot-device-features).
    - To check your version, run `python --version`. If you have both Python 2 and Python 3 installed, and are using a Python 3 environment for this SDK, use `pip3` to install all libraries. This ensures that the libraries are installed to your Python 3 runtime. 
        > [!IMPORTANT]
        > In the Python installer, select the option to **Add Python to PATH**. If you already have Python 3.7 or higher installed, confirm that you've added the Python installation folder to the `PATH` environment variable. 
- Port 8883 is open in your firewall. The device sample in this quickstart uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot-hub/iot-hub-mqtt-support.md).

## Create an application
In this section you create an IoT Central application. IoT Central is a portal-based IoT application platform that helps reduce the complexity and cost of developing and managing IoT solutions.

To create an Azure IoT Central application:
1. Browse to [Azure IoT Central](https://apps.azureiotcentral.com/) and sign in with a Microsoft personal, work, or school account.
1. Navigate to **Build** and select **Custom apps**.
   :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-build.png" alt-text="IoT Central start page":::
1. In **Application name**, enter a unique name or use the generated name.
1. In **URL**, enter a memorable application URL prefix or use the generated URL prefix.
1. Leave **Application template** set to *Custom application*. The dropdown might show other templates if any exist for your account.
1. Select a **Pricing plan** option. 
    - To use the application for free for 7 days, select **Free**. You can convert a free application to standard pricing before it expires.
    - Optionally, you can select a standard pricing plan. If you select standard pricing, additional options appear and you'll need to set a **Directory**, an **Azure subscription**, and a **Location**. To learn about pricing, see [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). 
        - **Directory** is the Azure Active Directory in which you create your application. An Azure Active Directory contains user identities, credentials, and other organizational information. If you don't have an Azure Active Directory, one is created when you create an Azure subscription.
        - An **Azure subscription** enables you to create instances of Azure services. IoT Central provisions resources in your subscription. If you don't have an Azure subscription, you can [create one for free](https://azure.microsoft.com/free/). After you create the subscription, return to the IoT Central **New application** page. Your new subscription appears in the **Azure subscription** drop-down.
        - **Location** is the [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/) in which you create an application. Select a location that's physically closest to your devices to get optimal performance. After you choose a location, you can't move the application to a different location.

    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-pricing.png" alt-text="IoT Central new application dialog":::
1. Select **Create**.
    
    After IoT Central creates the application, it redirects you to the application dashboard.
    :::image type="content" source="media/quickstart-send-telemetry-python/iot-central-created.png" alt-text="IoT Central new application dashboard":::

## Add a device
In this section you add a new device to your IoT Central application. The device is an instance of a device template that represents a real or simulated device that you'll connect to the application. 

To create a new device:
1. In the left pane select **Devices**, then select **+New**. This opens the new device dialog.
1. Leave **Device template** set to *Unassigned*.

    > [!NOTE]
    > Later you'll learn more about creating and using device templates. In this quickstart for simplicity, you'll attach a simulated device that uses an unassigned template. For an overview of working with device templates, see [Quickstart: Add a simulated device to your IoT Central application](../iot-central/core/quick-create-simulated-device.md)
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
1. Note the following values from the **Device connection** dialog. You'll use these in the next section to connect your device to IoT Central.
    * `ID scope`
    * `Device ID`
    * `Primary key`

## Send messages and monitor telemetry
In this section, you will use the Python SDK to build a simulated device and send telemetry to your IoT Central application. 

1. Open a new terminal window. You will use this terminal to install the Python SDK and work with Python sample code. You should now have two terminals open: the one you just opened to work with Python, and the CLI shell that you used in previous sections to enter Azure CLI commands. 

1. Copy the [Azure IoT Python SDK device samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples) to your local machine:

    ```console
    git clone https://github.com/Azure/azure-iot-sdk-python
    ```

    and navigating to the *azure-iot-sdk-python/azure-iot-device/samples* directory:

    ```console
    cd azure-iot-sdk-python/azure-iot-device/samples
    ```
1. Install the Azure IoT Python SDK:

    ```console
    pip install azure-iot-device
    ```
1. Set the Device Connection String as an environment variable called `IOTHUB_DEVICE_CONNECTION_STRING`. This is the string you obtained in the previous section after creating your simulated Python device. 

    **Windows (cmd)**

    ```console
    set IOTHUB_DEVICE_CONNECTION_STRING=<your connection string here>
    ```

    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the connection string.

    **Linux (bash)**

    ```bash
    export IOTHUB_DEVICE_CONNECTION_STRING="<your connection string here>"
    ```

1. In your open CLI shell, run the [az iot hub monitor-events](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/hub?view=azure-cli-latest#ext-azure-iot-az-iot-hub-monitor-events&preserve-view=true) command to begin monitoring for events on your simulated IoT device.  Event messages will be printed in the terminal as they arrive.

    ```azurecli
    az iot hub monitor-events --output table --hub-name {YourIoTHubName}
    ```

1. In your Python terminal, run the code for the installed sample file *simple_send_message.py* . This code accesses the simulated IoT device and sends a message to the IoT hub.

    To run the Python sample from the terminal:
    ```console
    python ./simple_send_message.py
    ```

    Optionally, you can run the Python code from the sample in your Python IDE:
    ```python
    import os
    import asyncio
    from azure.iot.device.aio import IoTHubDeviceClient


    async def main():
        # Fetch the connection string from an environment variable
        conn_str = os.getenv("IOTHUB_DEVICE_CONNECTION_STRING")

        # Create instance of the device client using the authentication provider
        device_client = IoTHubDeviceClient.create_from_connection_string(conn_str)

        # Connect the device client.
        await device_client.connect()

        # Send a single message
        print("Sending message...")
        await device_client.send_message("This is a message that is being sent")
        print("Message successfully sent!")

        # finally, disconnect
        await device_client.disconnect()


    if __name__ == "__main__":
        asyncio.run(main())
    ```

As the Python code sends a message from your device to the IoT hub, the message appears in your CLI shell that is monitoring events:

```output
Starting event monitor, use ctrl-c to stop...
event:
origin: <your Device name>
payload: This is a message that is being sent
```

Your device is now securely connected and sending telemetry to Azure IoT Hub.

## View messaging metrics
IoT Central enables you to manage all aspects of your application and devices. In a typical IoT Hub application that ingests telemetry from devices, you might want to monitor devices or view metrics on device telemetry. 

To visualize messaging metrics in the Azure portal:
1. In the left navigation menu on the portal, select **All Resources**. This lists all resources in your subscription, including the IoT hub you created. 

1. Select the link on the IoT hub you created. The portal displays the overview page for the hub.

1. Select **Metrics** in the left pane of your IoT Hub. 

    ![IoT Hub messaging metrics](media/quickstart-send-telemetry-python/iot-hub-portal-metrics.png)

1. Enter your IoT hub name in **Scope**.

2. Select *Iot Hub Standard Metrics* in **Metric Namespace**.

3. Select *Telemetry messages sent* in **Metric**. 

4. Hover your mouse pointer over the area of the timeline in which your device sent messages. The total number of messages at a point in time appears in the lower left corner of the timeline.

    ![View Azure IoT Hub metrics](media/quickstart-send-telemetry-python/iot-hub-portal-view-metrics.png)

5. Optionally, use the **Metric** dropdown to display other metrics on your simulated device.  

## Clean up resources
If you no longer need the Azure resources created in this quickstart, you can use IoT Central delete them.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. 

To delete a resource group by name:
1. Run the [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-delete&preserve-view=true) command. This removes the resource group, the IoT Hub, and the device registration you created.

    ```azurecli
    az group delete --name MyResourceGroup
    ```
1. Run the [az group list](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-list&preserve-view=true) command to confirm the resource group is deleted.  

    ```azurecli
    az group list
    ```

## Next steps

In this quickstart, you learned a basic Azure IoT application workflow for securely connecting a device to the cloud and sending device-to-cloud telemetry. You used the Azure CLI to create an IoT hub and a simulated device, then you used the Azure IoT Python SDK to access the device and send telemetry to the hub. You also used the Azure portal to visualize device metrics.

As a next step, explore the Azure IoT Python SDK through application samples.

- [Asynchronous Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/async-hub-scenarios): This directory contains asynchronous Python samples for additional IoT Hub scenarios.
- [Synchronous Samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/sync-samples): This directory contains Python samples for use with Python 2.7 or synchronous compatibility scenarios for Python 3.5+
- [IoT Edge samples](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/async-edge-scenarios): This directory contains Python samples for working with Edge modules and downstream devices.
