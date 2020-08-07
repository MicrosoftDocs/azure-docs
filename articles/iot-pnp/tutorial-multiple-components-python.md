---
title: Connect IoT Plug and Play Preview sample Python component device code to IoT Hub | Microsoft Docs
description: Build and run IoT Plug and Play Preview sample Python device code that uses multiple components and connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: ericmitt
ms.author: ericmitt
ms.date: 7/14/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp

# As a device builder, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and using multiple components to send properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Tutorial: Connect a sample IoT Plug and Play Preview multiple component device application to IoT Hub (Python)

[!INCLUDE [iot-pnp-tutorials-device-selector.md](../../includes/iot-pnp-tutorials-device-selector.md)]

This tutorial shows you how to build a sample IoT Plug and Play device application with components and root interface, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written in Python and is included in the Azure IoT device SDK for Python. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this tutorial, you need Python 3.7 on your development machine. You can download the latest recommended version for multiple platforms from [python.org](https://www.python.org/). You can check your Python version with the following command:  

```cmd/sh
python --version
```

You can download the latest recommended version for multiple platforms from [python.org](https://www.python.org/).

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

## Set up your environment

This package is published as a PIP for the public preview refresh. The package version should be latest or `2.1.4`

In your local python environment install the file as follows:

```cmd/sh
pip install azure-iot-device
```

Clone the Python SDK IoT repository and check out **pnp-preview-refresh**:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-python
```

## Review the code

This sample implements an IoT Plug and Play temperature controller device. The model this sample implements uses [multiple components](concepts-components.md). The [Digital Twins definition language (DTDL) model file for the temperature device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) defines the telemetry, properties, and commands the device implements.

The *azure-iot-sdk-python\azure-iot-device\samples\pnp* folder contains the sample code for the IoT Plug and Play device. The files for the temperature controller sample are:

- pnp_temp_controller_with_thermostats.py
- pnp_helper_preview_refresh.py

Temperature controller has multiple components and a root interface, based on the temperature controller DTDL model.

Open the *pnp_temp_controller_with_thermostats.py* file in an editor of your choice. The code in this file:

1. Imports `pnp_helper_preview_refresh.py` to get access to helper methods.

2. Defines two digital twin model identifiers (DTMIs) that uniquely represent two different interfaces, defined in the DTDL model. The components in a real temperature controller should implement these two interfaces. These two interfaces are already published in a central repository. These DTMIs must be known to the user and vary dependent on the scenario of device implementation. For the current sample, these two interfaces represent:

  - A thermostat
  - Device information developed by Azure.

3. Defines the DTMI `model_id` for the device that's being implemented. The DTMI is user-defined and must match the DTMI in the DTDL model file.

4. Defines the names given to the components in the DTDL file. There are two thermostats in the DTDL and one device information component. A constant called `serial_number` is also defined in the root interface. A `serial_number` can't change for a device.

5. Defines command handler implementations. These define what the device does when it receives command requests.

6. Defines functions to create a command response. These define how the device responds with to command requests. You create command response functions if a command needs to send a custom response back to the IoT hub. If a response function for a command isn't provided, a generic response is sent. In this sample, only the **getMaxMinReport** command has a custom response.

7. Defines a function to send telemetry from this device. Both the thermostats and the root interface send telemetry. This function takes in a optional component name parameter to enable it to identify which component sent the telemetry.

8. Defines a listener for command requests.

9. Defines a listener for desired property updates.

10. Has a `main` function that:

    1. Uses the device SDK to create a device client and connect to your IoT hub. The device sends the `model_id` so that the IoT hub can identify the device as an IoT Plug and Play device.

    1. Uses the `create_reported_properties` function in the helper file to create the properties. Pass the component name, and the properties as key value pairs to this function.

    1. Updates the readable properties for its components by calling `patch_twin_reported_properties`.

    1. Starts listening for command requests using the `execute_command_listener` function. The function sets up a listener for command requests from the service. When you set up the listener you provide a `method_name`, `user_command_handler`, and an optional `create_user_response_handler` as parameters.
        - The `method_name` defines the command request. In this sample the model defines the commands **reboot**, and **getMaxMinReport**.
        - The `user_command_handler` function defines what the device should do when it receives a command.
        - The `create_user_response_handler` function creates a response to be sent to your IoT hub when a command executes successfully. You can view this response in the portal. If this function isn't provided, a generic response is sent to the service.

    1. Uses `execute_property_listener` to listen for property updates.

    1. Starts sending telemetry using `send_telemetry`. The sample code uses a loop to call three telemetry sending functions. Each one is called every eight seconds

    1. Disables all the listeners and tasks, and exits the loop when you press **Q** or **q**.

Now that you've seen the code, create an environment variable called **IOTHUB_DEVICE_CONNECTION_STRING** to store the device connection string you made a note of previously.Use the following command to run the sample:

```cmd/sh
python pnp_temp_controller_with_thermostats.py
```

The sample device sends telemetry messages every few seconds to your IoT hub.

You see the following output, which indicates the device is sending telemetry data to the hub, and is now ready to receive commands and property updates.

![Device confirmation messages](media/tutorial-multiple-components-python/multiple-component.png)

Keep the sample running as you complete the next steps.

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this tutorial, you've learned how to connect an IoT Plug and Play device with components to an IoT hub. To learn more about IoT Plug and Play device models, see:

> [!div class="nextstepaction"]
> [IoT Plug and Play Preview modeling developer guide](concepts-developer-guide.md)
