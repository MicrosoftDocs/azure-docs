---
title: Connect IoT Plug and Play Preview Python sample device with components and root interface to Azure IoT Hub | Microsoft Docs
description: Use Python to build and run IoT Plug and Play Preview sample device code that connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: ericmitt
ms.author: ericmitt
ms.date: 7/8/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device developer, I want to see a working IoT Plug and Play device sample with components and root interface connecting to IoT Hub and sending properties, commands and telemetry. As a solution developer, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Tutorial: Connect a sample IoT Plug and Play Preview device with components and root interface application to IoT Hub (Python)

[!INCLUDE [iot-pnp-quickstarts-device-selector.md](../../includes/iot-pnp-quickstarts-device-selector.md)]

This tutorial shows you how to build a sample IoT Plug and Play device application with components and root interface, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written for Python and is included in the Azure IoT Hub Device SDK for Python. A solution developer can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this quickstart, you need Python on your development machine preferably Python 3.7. You can check your python version by running

```cmd/sh
python --version
```

You can download the latest recommended version for multiple platforms from [python.org](https://www.python.org/).

### Install the Azure IoT explorer

Download and install the latest release of **Azure IoT explorer** from the tool's [repository](https://github.com/Azure/azure-iot-explorer/releases) page, by selecting the .msi file under "Assets" for the most recent update.

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub (note for use later):

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

## Set up your environment

This package is published as a PIP for the public preview refresh. The package version should be latest or `2.1.4`

In your local python environment install the file as follows:

```cmd/sh
pip install azure-iot-device
```

Clone the Python SDK IoT repository and check out **master**:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-python -b master
```

## Overview of relevant files

The `azure-iot-sdk-python\azure-iot-device\samples\pnp` folder contains the sample code for the IoT Plug and Play device. These are the following Python files in this folder:

- The Files for the Temperature Controller Sample (PnP using Components):
    - `pnp_temp_controller_with_thermostats.py`
    - `pnp_helper_summer_refresh.py`

Temperature controller has multiple components and a root interface, based on the Temperature Controller DTMI.

The Temperature Controller sample is **pnp_temp_controller_with_thermostats.py**. This sample code uses helper methods from **pnp_helper_summer_refresh.py**.

## Advanced Multiple Components, Root Interface Scenario (Temperature Controller Sample)

Use the IoT Hub you created previously and create a device. Use the device connection string to create an environment variable named **IOTHUB_DEVICE_CONNECTION_STRING**. The **pnp_temp_controller_with_thermostats.py** file uses this environment variable.

Open the **pnp_temp_controller_with_thermostats.py** file in an editor of your choice. Notice how it:

1. Imports **pnp_helper_summer_refresh** to enable access to some helper methods.

2. Defines two digital twin model identifiers (DTMIs) that uniquely represent two different interfaces, based off the (Temperature Controller model)[https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json]. The components in a real temperature controller should implement these two interfaces. These two interfaces are already published in a central repository. These DTMIs must be known to the user and vary dependent on the scenario of device implementation. For the current sample, these two interfaces represent:
    - Thermostat.
    - Device information developed by Azure.

3. Defines the `model_id` which is the DTMI for the device that's being implemented. This DTMI is user-defined and must match the DTMI of the above DTDL file.

4. Defines some component names given to the components in the DTDL file. There are 2 thermostats in the DTDL and 1 device information component. A constant called `serial_number` is also defined at top. A `serial_number` can not change for any device.

5. Defines command handler implementations. These define what the device does once it receives PnP command requests.

6. Defines functions to create a command response. These define what the device responds with to the service with once it receives PnP command requests. Command response functions are created by the user if a command needs to send a custom response back to the IoT hub. If a response function for a command is not provided, a generic response is sent instead. In the current sample, only the **getMaxMinReport** command has a custom response.

7. Defines a function to send telemetry from this device. Both the thermostats and the root are going to send telemetry, so this function takes in a optional component name parameter as well to differentiate from which component the telemetry is being sent.

8. Defines a listener that listens for command requests. Defines another listener that listens for desired property updates.

9. Defines an input keyboard listener function to let you quit the application.

10. Has a **main** function. The **main** function:

    1. Uses the device SDK to create a device client and connect to your IoT hub. At this point the device also supplies the `model_id` so that the Hub can identify the device as a PnP device.

    2. The **main** function uses the **create_reported_properties** function defined in the helper file to create the PnP properties. The component name, and the properties as key value pairs needs to be passed to this function. Updates the readable properties for its components by calling **patch_twin_reported_properties**.

    3. Starts listening for command requests using the **execute_command_listener** function. The function sets up a 'listener' to listen for PnP command requests coming from the service. When you set up the listener you provide a `method_name`, `user_command_handler`, and an optional `create_user_response_handler`.
        - The `method_name` defines the command request. Our DTMI defines two PnP commands that our Temperature Controller responds to: `reboot`, and `getMaxMinReport`.
        - The `user_command_handler` function defines what the device should do when it receives a command. For instance, if your alarm goes off, the effect of receiving this command is you wake up. Think of this as the 'effect' of the command being invoked.
        - The `create_user_response_handler` function creates a response to be sent to your IoT hub when a command executes successfully. For instance, if your alarm goes off, you respond by hitting snooze, which is feedback to the service. Think of this as the reply you give to the service. You can view this response in the portal. If this fucntion is not provided a generic response will be sent back to the service.

    4. The **main** also uses **execute_property_listener** to listen for property updates.

    5. Starts sending telemetry using **send_telemetry**. The sample code uses a loop to call 3 telemetry sending functions which individually are called every eight seconds.

    6. Disables all the listeners and tasks, and exits the loop when you press **Q** or **q**.

Now that you've seen the code, use the following command to run the sample:

```cmd/sh
python pnp_temp_controller_with_thermostats.py
```

The sample device sends telemetry messages every few seconds to your IoT hub.

You see the following output, which indicates the device is sending telemetry data to the hub, and is now ready to receive commands and property updates.

![Device confirmation messages](media/quickstart-connect-device-node/device-confirmation-node.png)

Keep the sample running as you complete the next steps.

## Use the Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [Interact with an IoT Plug and Play Preview device that's connected to your solution](quickstart-service-python.md)
