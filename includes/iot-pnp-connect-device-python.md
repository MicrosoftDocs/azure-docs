---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

This tutorial shows you how to build a sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure IoT explorer tool to view the telemetry it sends. The sample application is written for Python and is included in the Azure IoT Hub Device SDK for Python. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[![Browse code](../articles/iot-central/core/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-python/tree/v2/samples/pnp)

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

To complete this tutorial, you need Python 3.7 on your development machine. You can download the latest recommended version for multiple platforms from [python.org](https://www.python.org/). You can check your Python version with the following command:  

```cmd/sh
python --version
```

In your local Python environment, install the package as follows:

```cmd/sh
pip install azure-iot-device
```

Clone the Python SDK IoT repository: 

```cmd/sh
git clone --branch v2 https://github.com/Azure/azure-iot-sdk-python
```

## Run the sample device

The *azure-iot-sdk-python/samples/pnp* folder contains the sample code for the IoT Plug and Play device. This tutorial uses the *simple_thermostat.py* file. This sample code implements an IoT Plug and Play compatible device and uses the Azure IoT Python Device Client Library.

Open the **simple_thermostat.py** file in a text editor. Notice how it:

1. Defines a single device twin model identifier (DTMI) that uniquely represents the [Thermostat](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json). A DTMI must be known to the user and varies dependent on the scenario of device implementation. For the current sample, the model represents a thermostat that has telemetry, properties, and commands associated with monitoring temperature.

1. Has functions to define command handler implementations. You write these handlers to define how the device responds to command requests.

1. Has a function to define a command response. You create command response functions to send a response back to your IoT hub.

1. Defines an input keyboard listener function to let you quit the application.

1. Has a **main** function. The **main** function:

    1. Uses the device SDK to create a device client and connect to your IoT hub.

    1. Updates properties. The **Thermostat** model defines `targetTemperature` and `maxTempSinceLastReboot` as the two properties for the Thermostat. Properties are updated using the `patch_twin_reported_properties` method defined on the `device_client`.

    1. Starts listening for command requests using the **execute_command_listener** function. The function sets up a 'listener' to listen for commands coming from the service. When you set up the listener, you provide a `method_name`, `user_command_handler`, and `create_user_response_handler`.
        - The `user_command_handler` function defines what the device should do when it receives a command.
        - The `create_user_response_handler` function creates a response to be sent to your IoT hub when a command executes successfully. You can view this response in the portal.

    1. Starts sending telemetry. The **pnp_send_telemetry** is defined in the pnp_methods.py file. The sample code uses a loop to call this function every eight seconds.

    1. Disables all the listeners and tasks, and exist the loop when you press **Q** or **q**.

[!INCLUDE [iot-pnp-environment](iot-pnp-environment.md)]

To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-python/blob/v2/samples/pnp/README.md).

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

[!INCLUDE [iot-pnp-iot-explorer.md](iot-pnp-iot-explorer.md)]
