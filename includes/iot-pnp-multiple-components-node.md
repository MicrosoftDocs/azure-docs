---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

This tutorial shows you how to build a sample IoT Plug and Play device application with components, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written for Node.js and is included in the Azure IoT Hub Device SDK for Node.js. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[![Browse code](../articles/iot-central/core/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-node/tree/main/device/samples)

In this tutorial, you:

> [!div class="checklist"]
> * Download the sample code.
> * Run the sample device application and validate that it connects to your IoT hub.
> * Review the source code.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

To complete this tutorial, you need Node.js on your development machine. You can download the latest recommended version for multiple platforms from [nodejs.org](https://nodejs.org).

You can verify the current version of Node.js on your development machine using the following command:

```cmd/sh
node --version
```

## Download the code

If you completed [Tutorial: Connect a sample IoT Plug and Play device application running on Windows to IoT Hub (Node)](../articles/iot-develop/tutorial-connect-device.md), you've already cloned the repository.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Microsoft Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) GitHub repository into this location:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-node
```

## Install required libraries

You use the device SDK to build the included sample code. The application you build simulates a Plug and Play device with multiple components that connects to an IoT hub. The application sends telemetry and properties and receives commands.

1. In a local terminal window, go to the folder of your cloned repository and navigate to the */azure-iot-sdk-node/device/samples/javascript* folder. Then run the following command to install the required libraries:

```cmd/sh
npm install
```

This command installs the relevant npm files required to run the samples in the folder.

## Review the code

Navigate to the *azure-iot-sdk-node/device/samples/javascript* folder.

The *azure-iot-sdk-node/device/samples/javascript* folder contains the sample code for the IoT Plug and Play temperature controller device.

The code in the *pnp_temperature_controller.js* file implements an IoT Plug and Play temperature controller device. The model this sample implements uses [multiple components](../articles/iot-develop/concepts-modeling-guide.md). The [Digital Twins Definition Language (DTDL) V2 model file for the temperature device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) defines the telemetry, properties, and commands the device implements.

Open the *pnp_temperature_controller.js* file in a code editor of your choice. The sample code shows how to:

- Define the `modelId` that's the DTMI for the device you're implementing. This DTMI is user-defined and must match the DTMI of the [temperature controller DTDL model](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json).

- Implement the components defined in the temperature controller DTDL model. The components in a real temperature controller should implement these two interfaces. These two interfaces are already published in a central repository. In this sample, the two interfaces are:

  - Thermostat
  - Device information developed by Azure

- Define component names. This sample has two thermostats and one device information component.

- Define command names for the commands the device responds to.

- Define the `serialNumber` constant. The `serialNumber` is fixed any given device.

- Define the command handlers.

- Define the functions to send command responses.

- Define helper functions to log command requests.

- Define a helper function to create the properties.

- Define a listener for property updates.

- Define a function to send telemetry from this device. Both thermostats and the default component send telemetry. This function receives the component name as parameter.

- Define a `main` function that:

  - Uses the device SDK to create a device client and connect to your IoT hub. The device  supplies the `modelId` so that IoT Hub can identify the device as an IoT Plug and Play device.

  - Starts listening for command requests using the `onDeviceMethod` function. The function sets up a listener for command requests from the service:

    - The device DTDL defines the `reboot` and `getMaxMinReport` commands.
    - The `commandHandler` function defines how the device responds to a command.

  - Starts sending telemetry by using `setInterval` and `sendTelemetry`.

  - Uses the `helperCreateReportedPropertiesPatch` function to create the properties and the `updateComponentReportedProperties` to update the properties.

  - Uses `desiredPropertyPatchListener` to listen for property updates.

  - Disables all the listeners and tasks, and exits the loop when you press **Q** or **q**.

[!INCLUDE [iot-pnp-environment](iot-pnp-environment.md)]

To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/readme.md#iot-plug-and-play-device-samples).

Now that you've seen the code, use the following command to run the sample:

```cmd/sh
node pnp_temperature_controller.js
```

You see the following output, indicating the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates.

![Device confirmation messages](media/iot-pnp-multiple-components-node/multiple-component.png)

Keep the sample running as you complete the next steps.

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](iot-pnp-iot-explorer.md)]
