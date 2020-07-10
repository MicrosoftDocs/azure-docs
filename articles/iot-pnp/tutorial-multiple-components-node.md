---
title: Connect IoT Plug and Play Preview sample Node.js device with components and root interface to Azure IoT Hub | Microsoft Docs
description: Use Node.js to build and run IoT Plug and Play Preview sample device code that connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: olivakar
ms.author: olkar
ms.date: 07/09/2020
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device developer, I want to see a working IoT Plug and Play device sample with components and root interface connecting to IoT Hub and sending properties, commands and telemetry. As a solution developer, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device with components reports to the IoT hub it connects to.
---

# Quickstart: Connect a sample IoT Plug and Play Preview device application with components and root interface to IoT Hub (Node.js)

[!INCLUDE [iot-pnp-quickstarts-device-selector.md](../../includes/iot-pnp-quickstarts-device-selector.md)]

This quickstart shows you how to build a sample IoT Plug and Play device application with components and root interface, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written for Node.js and is included in the Azure IoT Hub Device SDK for Node.js. A solution developer can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this quickstart, you need Node.js on your development machine. You can download the latest recommended version for multiple platforms from [nodejs.org](https://nodejs.org).

You can verify the current version of Node.js on your development machine using the following command:

```cmd/sh
node --version
```

### Install the Azure IoT explorer

Download and install the latest release of **Azure IoT explorer** from the tool's [repository](https://github.com/Azure/azure-iot-explorer/releases) page, by selecting the .msi file under "Assets" for the most recent update.

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub (note for use later):

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

## Prepare the development environment

In this quickstart, you prepare a development environment you can use to clone and build the Azure IoT Hub Device SDK for Node.js.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Microsoft Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) GitHub repository into this location:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-node -b master
```

This operation may take several minutes to complete.

## Install required libraries

You use the device SDK to build the included sample code. The application you build simulates a Plug and Play device with components and root interface that connects to an IoT hub. The application sends telemetry and properties and receives commands.

1. In a local terminal window, go to the folder of your cloned repository and navigate to the **/azure-iot-sdk-node/device/samples/pnp** folder. Then run the following command to install the required libraries:

```cmd/sh
npm install
```

This will install the relevant npm files required to run the samples in the folder.

1. Configure the _device connection string_:

```cmd/sh
set DEVICE_CONNECTION_STRING=<YourDeviceConnectionString>
```
## Overview of relevant files

Navigate to the **azure-iot-sdk-node/device/samples/pnp** folder.

The `azure-iot-sdk-node\device\samples\pnp` folder contains the sample code for the IoT Plug and Play device. These are the following javascript files in this folder:

- The files for the Temperature Controller Sample (PnP using Components):
    - `pnpTemperatureController.js`

- The files for the Thermostat sample (PnP without Components):
    - `simple_thermostat.js`

There are two samples, one that is simpler, self-contained, and uses the PnP specification without Components, based on the Thermostat DTMI. The other implements a Temperature controller that is more complex, with multiple components and a root interface, based on the Temperature Controller DTMI.

The complex Temperature Controller sample is **pnpTemperatureController.js**. This sample code implements a device with components and root interface that is IoT Plug and Play compatible using the Azure IoT Python Device Client Library.

## Advanced Multiple Components, Root Interface Scenario (Temperature Controller Sample)

Use the IoT Hub you created previously and create a device. Use the device connection string to create an environment variable named **DEVICE_CONNECTION_STRING**. The **pnpTemperatureController.js** file uses this environment variable.

Open the **pnpTemperatureController.js** file in an editor of your choice. Notice how it:

1. Defines the `modelId` which is the DTMI for the device that's being implemented. This DTMI is user-defined and must match the DTMI of the corresponding (Temperature Controller DTDL model)[https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json].

1. Utilizes 3 components which implements 2 interfaces based off the above DTDL. The components in a real temperature controller should implement these two interfaces. These two interfaces are already published in a central repository. For the current sample, these two interfaces represent:
    - Thermostat.
    - Device information developed by Azure.

3. Defines some component names given to the components in the DTDL json file. There are 2 thermostats in the DTDL and 1 device information component.

4. Defines some command names constants. These are the commands to which the device responds.

5. Defines a constant called `serialNumber`.A `serialNumber` can not change for any device.

6. Defines a handler that gets executed when the device receives PnP command requests.

7. Defines functions defined that sends command response. These are what the device responds with to the service with once it receives PnP command requests.

8. Defines some helper functions that log command requests.

9. Defines a helper function that creates the PnP readable properties and a defines function to update the PnP properties as well.

10. Defines another listener that listens for property updates.

11. Defines an input keyboard listener function that lets you quit the application.

12. Defines a function to send telemetry from this device. Both the thermostats as well as the root component are going to send telemetry,
so this function takes in a component name as well to differentiate from which component(or root) the telemetry is being sent.

13. Has a **main** function. The **main** function:

    1. Uses the device SDK to create a device client and connect to your IoT hub. At this point the device also supplies the `modelId` so that the Hub can identify the device as a PnP device.

    2. Starts listening for command requests using the **onDeviceMethod** function. The function sets up a 'listener' to listen for PnP command requests coming from the service.
        - The device DTDL defines two PnP commands that our Temperature Controller responds to: `reboot`, and `getMaxMinReport`.
        - The `commandHandler` function defines what the device should do when it receives a command. For instance, if your alarm goes off, the effect of receiving this command is you wake up. Think of this as the 'effect' of the command being invoked.

    3. Starts sending telemetry by using `setInterval` and **sendTelemetry**.

    4. The **main** function uses the **helperCreateReportedPropertiesPatch** function to create the PnP properties and **updateComponentReportedProperties** to update these properties.

    5. The **main** also uses **desiredPropertyPatchListener** to listen for property updates.

    6. Disables all the listeners and tasks, and exits the loop when you press **Q** or **q**.

Now that you've seen the code, use the following command to run the sample:


```cmd\sh
node pnpTemperatureController.js.js
```

You see the following output, indicating the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates.

![Device confirmation messages](media/quickstart-connect-device-node/device-confirmation-node.png)

Keep the sample running as you complete the next steps.

## Use the Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [Interact with an IoT Plug and Play Preview device that's connected to your solution](quickstart-service-node.md)
