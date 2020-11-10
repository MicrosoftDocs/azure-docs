---
title: Quickstart - Connect IoT Plug and Play sample Python device code to Azure IoT Hub | Microsoft Docs
description: Quickstart - Use Python to build and run IoT Plug and Play sample device code that connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: ericmitt
ms.author: ericmitt
ms.date: 7/14/2020
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc, devx-track-azurecli

# As a device builder, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties, commands and telemetry. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect a sample IoT Plug and Play device application to IoT Hub (Python)

[!INCLUDE [iot-pnp-quickstarts-device-selector.md](../../includes/iot-pnp-quickstarts-device-selector.md)]

This quickstart shows you how to build a sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure IoT explorer tool to view the telemetry it sends. The sample application is written for Python and is included in the Azure IoT Hub Device SDK for Python. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](../../includes/iot-pnp-prerequisites.md)]

To complete this quickstart, you need Python 3.7 on your development machine. You can download the latest recommended version for multiple platforms from [python.org](https://www.python.org/). You can check your Python version with the following command:  

```cmd/sh
python --version
```

In your local python environment install the package as follows:

```cmd/sh
pip install azure-iot-device
```

Clone the Python SDK IoT repository and check out **master**:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-python
```

## Run the sample device

The *azure-iot-sdk-python\azure-iot-device\samples\pnp* folder contains the sample code for the IoT Plug and Play device. This quickstart uses the *simple_thermostat.py* file. This sample code implements an IoT Plug and Play compatible device and uses the Azure IoT Python Device Client Library.

Open the **simple_thermostat.py** file in a text editor. Notice how it:

1. Defines a single device twin model identifier (DTMI) that uniquely represents the [Thermostat](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json). A DTMI must be known to the user and varies dependent on the scenario of device implementation. For the current sample, the model represents a thermostat that has telemetry, properties, and commands associated with monitoring temperature.

1. Has functions to define command handler implementations. You write these handlers to define how the device responds to command requests.

1. Has a function to define a command response. You create command response functions to send a response back to your IoT hub.

1. Defines an input keyboard listener function to let you quit the application.

1. Has a **main** function. The **main** function:

    1. Uses the device SDK to create a device client and connect to your IoT hub.

    1. Updates properties. The model we are using, **Thermostat**, defines `targetTemperature` and `maxTempSinceLastReboot` as the two properties for our Thermostat, so that is what we will be using. Properties are updated using the `patch_twin_reported_properties` method defined on the `device_client`.

    1. Starts listening for command requests using the **execute_command_listener** function. The function sets up a 'listener' to listen for commands coming from the service. When you set up the listener you provide a `method_name`, `user_command_handler`, and `create_user_response_handler`.
        - The `user_command_handler` function defines what the device should do when it receives a command. For instance, if your alarm goes off, the effect of receiving this command is you wake up. Think of this as the 'effect' of the command being invoked.
        - The `create_user_response_handler` function creates a response to be sent to your IoT hub when a command executes successfully. For instance, if your alarm goes off, you respond by hitting snooze, which is feedback to the service. Think of this as the reply you give to the service. You can view this response in the portal.

    1. Starts sending telemetry. The **pnp_send_telemetry** is defined in the pnp_methods.py file. The sample code uses a loop to call this function every eight seconds.

    1. Disables all the listeners and tasks, and exist the loop when you press **Q** or **q**.

[!INCLUDE [iot-pnp-environment](../../includes/iot-pnp-environment.md)]

To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-python/blob/master/azure-iot-device/samples/pnp/README.md).

Now that you've seen the code, use the following command to run the sample:

```cmd/sh
python simple_thermostat.py
```

You see the following output, which indicates the device is sending telemetry data to the hub, and is now ready to receive commands and property updates:

```cmd/sh
Listening for command requests and property updates
Press Q to quit
Sending telemetry for temperature
Sent message
```

Keep the sample running as you complete the next steps.

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [Interact with an IoT Plug and Play device that's connected to your solution](quickstart-service-python.md)
