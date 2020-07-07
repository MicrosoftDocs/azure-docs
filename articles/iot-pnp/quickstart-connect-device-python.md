---
title: Connect IoT Plug and Play Preview sample Python device code to Azure IoT Hub | Microsoft Docs
description: Use Python to build and run IoT Plug and Play Preview sample device code that connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: ericmitt
ms.author: ericmitt
ms.date: 5/4/2020
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device developer, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties, commands and telemetry. As a solution developer, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect a sample IoT Plug and Play Preview device application to IoT Hub (Python)

[!INCLUDE [iot-pnp-quickstarts-device-selector.md](../../includes/iot-pnp-quickstarts-device-selector.md)]

This quickstart shows you how to build a sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written for Python and is included in the Azure IoT Hub Device SDK for Python. A solution developer can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this quickstart, you need Python on your development machine. Python 3.5+ preferably Python 3.7. You can check your python version by running  

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

**Installation for Bug Bash 5/13** 

For the bug bash, use a private package. This package will be published as a PIP for the public preview refresh.

Go to https://aka.ms/PythonDevicePnP0508 and download the wheel (.why) file. Once downloaded, in your local python environment install the file as follows:

```cmd/sh
pip install azure_iot_device-2.1.0_pnp_preview_refresh.0-py2.py3-none-any.whl
```

Clone the Python SDK IoT repository and check out the preview branch called **digitaltwins-preview**:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-python -b digitaltwins-preview
```

## Run the sample device

The `azure-iot-sdk-python\azure-iot-device\samples\pnp` folder contains the sample code for the IoT Plug and Play device. These are the following Python files in this folder:

- The Files for the Temperature Controller Sample (PnP using Components):
    - `pnp_temp_controller_with_thermostats.py`
    - `pnp_helper.py`
    - `pnp_methods.py`

- The files for the Thermostat sample (PnP without Components):
    - `pnp_thermostat.py`

There are two samples, one that is simpler, self-contained, and uses the PnP specification without Components, based on the Thermostat DTMI. The other implements a Temperature controller that is more complex, with multiple components and a root interface, based on the Temperature Controller DTMI.

The Thermostat sample is **pnp_thermostat.py**. This sample code implements a device that is IoT Plug and Play compatible using the Azure IoT Python Device Client Library.   

The Temperature Controller sample is **pnp_temp_controller_with_thermostats.py**. This sample code uses methods from **pnp_methods.py**. The **pnp_methods.py** file uses  helper functions in the **pnp_helper.py** file. The **pnp_methods.py** file uses Azure IoT Python SDK functionality to provide IoT Plug and Play compatible functionality. 

### Run the Thermostat Sample (No Component)

Use the IoT Hub you created previously and create a device. Use the device connection string to create an environment variable named **IOTHUB_DEVICE_CONNECTION_STRING**. The **pnp_thermostat.py** file uses this environment variable.

Open the **pnp_thermostat.py** file in a text editor. Notice how it:

1. Defines a single (DTMIs) that uniquely represents the [Thermostat](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/Thermostat.json). A DTMI must be known to the user and varies dependent on the scenario of device implementation. For the current sample, the model represents:
    - A Thermostat that has telemetry, properties, and commands associated with monitoring temperature.


1. Defines the DTMI for the device that's being implemented. This DTMI is user-defined and  reflects the name for the device and the name of the user's organization. In this sample, the DTMI shows that the name of the device is **Thermostat**.

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

Now that you've seen the code, use the following command to run the sample:

```cmd/sh
python pnp_thermostat.py
```

The sample device sends telemetry messages every eight seconds to your IoT Hub.

You see the following output, which indicates the device is sending telemetry data to the hub, and is now ready to receive commands and property updates.

![Device confirmation messages](media/quickstart-connect-device-node/device-confirmation-node.png)

Keep the sample running as you complete the next steps.

### Run the Temperature Controller Sample (Multiple Components, Root Interface)

Use the IoT Hub you created previously and create a device. Use the device connection string to create an environment variable named **IOTHUB_DEVICE_CONNECTION_STRING**. The **pnp_temp_controller_with_thermostats.py** file uses this environment variable.

Open the **pnp_temp_controller_with_thermostats.py** file in a text editor. Notice how it:

1. Imports **pnp_methods** to enable access to these methods.

1. Defines three digital twin model identifiers (DTMIs) that uniquely represent three different interfaces, based off the (Temperature Controller model)[https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json]. The components in a real device should implement these three interfaces. These three interfaces are already published in a central repository. These DTMIs must be known to the user and vary dependent on the scenario of device implementation. For the current sample, these three interfaces represent:
    - An environmental sensor developed by Contoso.
    - Device information developed by Azure.
    - SDK information that relates to the SDK in use.

1. Defines the DTMI for the device that's being implemented. This DTMI is user-defined and  reflects the name for the device and the name of the user's organization. In this sample, the DTMI shows that the name of the device is **SampleDevice** and that it belongs to **my_company**.

1. Defines some component names from the existing DTMIs. The device information and SDK information component names are fixed and are present once for each device. The only user-defined component name is the name for the environmental sensor. This name is user-defined because you can have multiple sensors in your device and each must have a unique name. In the current sample, there's only one environmental sensor named **sensor**.

1. Has functions to define command handler implementations. You write these handlers to define how the device responds to command requests. The current sample has handlers for four commands.

1. Has a function to define a command response. You create command response functions if a command needs to send a custom response back to your IoT hub. If you don't provide a response function for a command, a generic response is sent instead. In the current sample, only the **blink** command has a custom response.

1. Defines an input keyboard listener function to let you quit the application.

1. Has a **main** function. The **main** function:

    1. Uses the device SDK to create a device client and connect to your IoT hub.

    1. Updates properties for three components. The **main** function uses the **pnp_update_property** function defined in the pnp_methods.py file to update the properties. You pass the client, the component name, and the properties as key value pairs to this function. The property update task for the SDK information interface has a key called **version** that's a constant imported from the device SDK.  

    1. Starts listening for command requests using the **execute_listener** function from the pnp_methods.py file. You pass the client, the component name, the method name, and the user handler as parameters. If the command needs to send a custom response, you also pass the user-defined command response function as a parameter.  
        - The user handler function defines what the device should do when it receives a command.
        - A response is sent to your IoT hub when a command executes successfully. You can view this response in the portal.
        - In this sample, only the **blink** command sends a custom response to your IoT hub.  

    1. Starts sending telemetry. The **pnp_send_telemetry** is defined in the pnp_methods.py file. The sample code uses a loop to call this function every eight seconds.

    1. Disables all the listeners and tasks, and exist the loop when you press **Q** or **q**.

Now that you've seen the code, use the following command to run the sample:

```cmd/sh
python pnp_sample_device.py
```

The sample device sends telemetry messages every eight seconds to your IoT hub.

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
