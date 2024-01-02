---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

This tutorial shows you how to build a sample IoT Plug and Play device application with components, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written in Python and is included in the Azure IoT device SDK for Python. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[![Browse code](../articles/iot-central/core/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-python/tree/v2/samples/pnp)

In this tutorial, you:

> [!div class="checklist"]
> * Download the sample code.
> * Run the sample device application and validate that it connects to your IoT hub.
> * Review the source code.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

You can run this tutorial on Linux or Windows. The shell commands in this tutorial follow the Linux convention for path separators '`/`', if you're following along on Windows be sure to swap these separators for '`\`'.

To complete this tutorial, you need Python 3.7 on your development machine. You can download the latest recommended version for multiple platforms from [python.org](https://www.python.org/). You can check your Python version with the following command:  

```cmd/sh
python --version
```

You can download the latest recommended version for multiple platforms from [python.org](https://www.python.org/).

## Download the code

The **azure-iot-device** package is published as a PIP.

In your local Python environment, install the package as follows:

```cmd/sh
pip install azure-iot-device
```

If you completed [Tutorial: Connect a sample IoT Plug and Play device application running on Windows to IoT Hub (Python)](../articles/iot-develop/tutorial-connect-device.md), you've already cloned the repository.

Clone the Python SDK IoT repository:

```cmd/sh
git clone --branch v2 https://github.com/Azure/azure-iot-sdk-python
```

## Review the code

This sample implements an IoT Plug and Play temperature controller device. The model this sample implements uses [multiple components](../articles/iot-develop/concepts-modeling-guide.md). The [Digital Twins Definition Language (DTDL) V2 model file for the temperature device](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) defines the telemetry, properties, and commands the device implements.

The *azure-iot-sdk-python/samples/pnp* folder contains the sample code for the IoT Plug and Play device. The files for the temperature controller sample are:

- temp_controller_with_thermostats.py
- pnp_helper.py

Temperature controller has multiple components and a default component, based on the temperature controller DTDL model.

Open the *temp_controller_with_thermostats.py* file in an editor of your choice. The code in this file:

1. Imports `pnp_helper.py` to get access to helper methods.

1. Defines two digital twin model identifiers (DTMIs) that uniquely represent two different interfaces, defined in the DTDL model. The components in a real temperature controller should implement these two interfaces. These two interfaces are already published in a central repository. These DTMIs must be known to the user and vary dependent on the scenario of device implementation. For the current sample, these two interfaces represent:

    - A thermostat
    - Device information developed by Azure.

1. Defines the DTMI `model_id` for the device that's being implemented. The DTMI is user-defined and must match the DTMI in the DTDL model file.

1. Defines the names given to the components in the DTDL file. There are two thermostats in the DTDL and one device information component. A constant called `serial_number` is also defined in the default component. A `serial_number` can't change for a device.

1. Defines command handler implementations. These handlers define what the device does when it receives command requests.

1. Defines functions to create a command response. These functions define how the device responds with to command requests. You create command response functions if a command needs to send a custom response back to the IoT hub. If a response function for a command isn't provided, a generic response is sent. In this sample, only the **getMaxMinReport** command has a custom response.

1. Defines a function to send telemetry from this device. Both the thermostats and the default component send telemetry. This function has an optional component name parameter to enable it to identify which component sent the telemetry.

1. Defines a listener for command requests.

1. Defines a listener for desired property updates.

1. Has a `main` function that:

    - Uses the device SDK to create a device client and connect to your IoT hub. The device sends the `model_id` so that the IoT hub can identify the device as an IoT Plug and Play device.

    - Uses the `create_reported_properties` function in the helper file to create the properties. Pass the component name, and the properties as key value pairs to this function.

    - Updates the readable properties for its components by calling `patch_twin_reported_properties`.

    - Starts listening for command requests using the `execute_command_listener` function. The function sets up a listener for command requests from the service. When you set up the listener, you provide a `method_name`, `user_command_handler`, and an optional `create_user_response_handler` as parameters.
        - The `method_name` defines the command request. In this sample, the model defines the commands **reboot**, and **getMaxMinReport**.
        - The `user_command_handler` function defines what the device should do when it receives a command.
        - The `create_user_response_handler` function creates a response to be sent to your IoT hub when a command executes successfully. You can view this response in the portal. If this function isn't provided, a generic response is sent to the service.

    - Uses `execute_property_listener` to listen for property updates.

    - Starts sending telemetry using `send_telemetry`. The sample code uses a loop to call three telemetry sending functions. Each one is called every eight seconds

    - Disables all the listeners and tasks, and exits the loop when you press **Q** or **q**.

[!INCLUDE [iot-pnp-environment](iot-pnp-environment.md)]

To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-python/blob/v2/samples/pnp/README.md).

Use the following command to run the sample:

```cmd/sh
python temp_controller_with_thermostats.py
```

The sample device sends telemetry messages every few seconds to your IoT hub.

You see the following output, which indicates the device is sending telemetry data to the hub, and is now ready to receive commands and property updates.

![Device confirmation messages](media/iot-pnp-multiple-components-python/multiple-component.png)

Keep the sample running as you complete the next steps.

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](iot-pnp-iot-explorer.md)]
