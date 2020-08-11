---
title: Connect IoT Plug and Play Preview sample Node.js component device code to IoT Hub | Microsoft Docs
description: Build and run IoT Plug and Play Preview sample Node.js device code that uses multiple components and connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: olivakar
ms.author: olkar
ms.date: 07/10/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp
ms.custom: devx-track-javascript

# As a device builder, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and using multiple components to send properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Tutorial: Connect a sample IoT Plug and Play Preview multiple component device application to IoT Hub (Node.js)

[!INCLUDE [iot-pnp-tutorials-device-selector.md](../../includes/iot-pnp-tutorials-device-selector.md)]

This tutorial shows you how to build a sample IoT Plug and Play device application with components and root interface, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written for Node.js and is included in the Azure IoT Hub Device SDK for Node.js. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this tutorial, you need Node.js on your development machine. You can download the latest recommended version for multiple platforms from [nodejs.org](https://nodejs.org).

You can verify the current version of Node.js on your development machine using the following command:

```cmd/sh
node --version
```

### Azure IoT explorer

To interact with the sample device in the second part of this tutorial, you use the **Azure IoT explorer** tool. [Download and install the latest release of Azure IoT explorer](./howto-use-iot-explorer.md) for your operating system.

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub. Make a note of this connection string, you use it later in this tutorial:

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

> [!TIP]
> You can also use the Azure IoT explorer tool to find the IoT hub connection string.

Run the following command to get the _device connection string_ for the device you added to the hub. Make a note of this connection string, you use it later in this tutorial:

```azurecli-interactive
az iot hub device-identity show-connection-string --hub-name <YourIoTHubName> --device-id <YourDeviceID> --output table
```

[!INCLUDE [iot-pnp-download-models.md](../../includes/iot-pnp-download-models.md)]

## Download the code

In this tutorial, you prepare a development environment you can use to clone and build the Azure IoT Hub Device SDK for Node.js.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Microsoft Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) GitHub repository into this location:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-node
```

This operation may take several minutes to complete.

## Install required libraries

You use the device SDK to build the included sample code. The application you build simulates a Plug and Play device with multiple components and root interface that connects to an IoT hub. The application sends telemetry and properties and receives commands.

1. In a local terminal window, go to the folder of your cloned repository and navigate to the */azure-iot-sdk-node/device/samples/pnp* folder. Then run the following command to install the required libraries:

```cmd/sh
npm install
```

This will install the relevant npm files required to run the samples in the folder.

1. Configure the environment variable with the device connection string you made a note of previously:

```cmd/sh
set DEVICE_CONNECTION_STRING=<YourDeviceConnectionString>
```

## Review the code

Navigate to the *azure-iot-sdk-node\device\samples\pnp* folder.

The *azure-iot-sdk-node\device\samples\pnp* folder contains the sample code for the IoT Plug and Play temperature controller device.

The code in the *pnpTemperatureController.js* file implements an IoT Plug and Play temperature controller device. The model this sample implements uses [multiple components](concepts-components.md). The [Digital Twins definition language (DTDL) model file for the temperature device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) defines the telemetry, properties, and commands the device implements.

Open the *pnpTemperatureController.js* file in a code editor of your choice. The sample code shows how to:

1. Define the `modelId` which is the DTMI for the device that's being implemented. This DTMI is user-defined and must match the DTMI of the [temperature controller DTDL model](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json).

2. Implement the components defined in the temperature controller DTDL model. The components in a real temperature controller should implement these two interfaces. These two interfaces are already published in a central repository. In this sample, the two interfaces are:
  - Thermostat
  - Device information developed by Azure

3. Define component names. This sample has two thermostats and one device information component.

4. Define command name. These are the commands the device responds to.

5. Define the `serialNumber` constant. The `serialNumber` is fixed any given device.

6. Define the command handlers.

7. Define the functions to send command responses.

8. Define helper functions to log command requests.

9. Define a helper function to create the properties.

10. Define a listener for property updates.

11. Define a function to send telemetry from this device. Both thermostats and the root component send telemetry. This function receives the component name as parameter.

12. Define a `main` function that:

    1. Uses the device SDK to create a device client and connect to your IoT hub. The device  supplies the `modelId` so that IoT Hub can identify the device as an IoT Plug and Play device.

    1. Starts listening for command requests using the `onDeviceMethod` function. The function sets up a listener for command requests from the service:
        - The device DTDL defines the `reboot` and `getMaxMinReport` commands.
        - The `commandHandler` function defines how the device responds to a command.

    1. Starts sending telemetry by using `setInterval` and `sendTelemetry`.

    1. Uses the `helperCreateReportedPropertiesPatch` function to create the properties and the `updateComponentReportedProperties` to update the properties.

    1. Uses `desiredPropertyPatchListener` to listen for property updates.

    1. Disables all the listeners and tasks, and exits the loop when you press **Q** or **q**.

Now that you've seen the code, use the following command to run the sample:

```cmd\sh
node pnpTemperatureController.js
```

You see the following output, indicating the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates.

![Device confirmation messages](media/tutorial-multiple-components-node/multiple-component.png)

Keep the sample running as you complete the next steps.

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this tutorial, you've learned how to connect an IoT Plug and Play device with components to an IoT hub. To learn more about IoT Plug and Play device models, see:

> [!div class="nextstepaction"]
> [IoT Plug and Play Preview modeling developer guide](concepts-developer-guide.md)
