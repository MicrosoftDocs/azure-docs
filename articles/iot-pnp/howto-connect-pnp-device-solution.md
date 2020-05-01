---
title: Interact with an IoT Plug and Play Preview device connected to your Azure IoT solution | Microsoft Docs
description: Use Node.js to connect to and interact with an IoT Plug and Play Preview device that's connected to your Azure IoT solution.
author: dominicbetts
ms.author: dobett
ms.date: 04/30/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.
---

# Interact with an IoT Plug and Play Preview device that's connected to your solution

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This how-to guide shows you how to use the samples in the Node service SDK that show you how your IoT Solution can interact with IoT Plug and Play Preview devices.

## Prerequisites

To complete the steps in this article, you need Node.js on your development machine. You can download the latest recommended version for multiple platforms from [nodejs.org](https://nodejs.org). The steps in this article assume that you're using a Windows development machine, but you can run the Node.js apps on other platforms.

You can verify the current version of Node.js on your development machine using the following command:

```cmd
node --version
```

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub. You use this value later in this article:

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

## Run the sample device

In this article, you use a sample environmental sensor written in Node.js to simulate the IoT Plug and Play device. The following instructions show you how to install and run the device:

1. Open a local command-prompt window and navigate to a folder of your choice. Execute the following command to clone the [Azure IoT Node.js SDK](https://github.com/Azure/azure-iot-sdk-node) GitHub repository into this location:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-node
    ```

1. This terminal window is your _device_ terminal. Navigate to the **/azure-iot-samples-node/digitaltwins/samples/device/javascript** folder in the cloned repository. Install all the dependencies by running the following command:

    ```cmd
    npm install
    ```

1. Configure the _device connection string_ using the device connection string you made a note of previously:

    ```cmd
    set DEVICE_CONNECTION_STRING=<YourDeviceConnectionString>
    ```

1. Run the sample app with the following command:

    ```cmd
    node sample_device.js
    ```

1. The terminal displays messages saying that the device has sent some information and reported itself online. These messages indicate that the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates. Don't close this terminal, you need it later to confirm the service sample is working.

## Run the sample solution

In this article, you use a sample IoT solution written in Node.js to interact with the sample device.

1. Open another local command-prompt window to use as your _service_ terminal. Navigate to the **/azure-iot-samples-node/azure-iot-sdk-node/digitaltwins/samples/service** folder in the cloned repository.

1. Install all the dependencies by running the following command:

    ```cmd
    npm install
    ```

1. Configure the _IoT hub connection string_ to allow the service to connect to it:

    ```cmd
    set IOTHUB_CONNECTION_STRING=<YourIoTHubConnectionString>
    ```

    > [!NOTE]
    > The device connection string and IoT Hub connection string are different.

1. Configure the _Device ID_ using the device ID you created previously:

    ```cmd
    set IOTHUB_DEVICE_ID=<YourDeviceID>
    ```

### Read a property

1. When you connected the _device_ in its terminal, you saw the following messages showing it connect:

    ```cmd
    Creating Digital Twin Client from provided device connection string.
    Adding the components to the DTClient.
    Enabling the commands on the DTClient
    Enabling property updates on the DTClient
    Reporting deviceInformation properties...
    Reporting environmentalSensor properties...
    ```

1. In the **/azure-iot-samples-node/digital-twins/Quickstarts/Service** folder, open the file **get_digital_twin.js** in a text editor. Replace the `<DEVICE_ID_GOES_HERE>` placeholder with your device ID and save the file.

1. Go to the _service_ terminal and use the following command to run the sample that reads device information:

    ```cmd
    node get_digital_twin.js
    ```

1. The _service_ terminal shows the digital twin for your device:

    ```JSON
    {
      "$model": "dtmi:YOUR_COMPANY_NAME_HERE:sample_device;1"
    }
    ```

### Invoke a command

1. Go to the _service_ terminal. Use the following command to run the sample that invokes the command:

    ```cmd
    node invoke_command.js
    ```

1. Output in the _service_ terminal shows the following confirmation:

    ```cmd
    invoking command turnon on component instancesensor for device yourdevice...
    "helpful response text"
    ```

1. Go to the _device_ terminal, you see the command has been acknowledged:

    ```cmd
    received command: turnon for component: sensor
    acknowledgement succeeded.
    ```

### Creating digital twin routes

Your solution can receive notifications of digital twin change events. To subscribe to these notifications, use the [IoT Hub routing feature](../iot-hub/iot-hub-devguide-endpoints.md) to send the notifications to an endpoint such as blob storage, EventGrid, Event Hubs, or a Service Bus queue.

To create a digital twin route:

1. In the Azure portal, go to your IoT Hub resource.
1. Select **Message routing**.
1. On the **Routes** tab, select **Add**.
1. Enter a value in the **Name** field and choose an **Endpoint**. If you haven't configured an endpoint, select **Add endpoint**.
1. In the **Data source** drop-down, select **Digital Twin Change Events**.
1. Select **Save**.

## Next steps

In this article, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see [How-to: Connect to and interact with a device](howto-develop-solution.md)
