---
title: Interact with an IoT Plug and Play Preview device connected to your Azure IoT solution | Microsoft Docs
description: Use Python to connect to and interact with an IoT Plug and Play Preview device that's connected to your Azure IoT solution.
author: ericmitt
ms.author: ericmitt
ms.date: 5/4/2020
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.
---

# Quickstart: Interact with an IoT Plug and Play Preview device that's connected to your solution (Python)

[!INCLUDE [iot-pnp-quickstarts-service-selector.md](../../includes/iot-pnp-quickstarts-service-selector.md)]

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's model without knowledge of the underlying device implementation. This quickstart shows you how to use Python to connect to and control an IoT Plug and Play device that's connected to your solution.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this quickstart, you need Python on your development machine. Python 3.5+ preferably Python 3.7. You can check your python version by running the following command:

```cmd/sh
python --version
```

You can download the latest recommended version for multiple platforms from [python.org](https://www.python.org/).

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub (note for use later):

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

---
**Installation for Bug Bash 5/8** 

For this bug bash, we'll use a private package. This will be published to pip for the public preview refresh.
You can download the Python package as a [.whl file here] (https://aka.ms/PythonServicePnP0508). Once downloaded, in your local python environment please install the file. 

```cmd/sh
pip install azure_iot_device-2.1.0-preview-pnp-py2.py3-none-any.whl 
```
---

## Run the sample device

In this quickstart, you use a sample environmental sensor that's written in Python as the IoT Plug and Play device. The following instructions show you how to install and run the device:

1. Open a terminal window in the directory of your choice. Execute the following command to clone the [Azure IoT Python SDK](https://github.com/Azure/azure-iot-sdk-python) GitHub repository into this location:

    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-python -b digitaltwins-preview
    ```

1. Configure the _device connection string_:

    ```cmd/sh
    set IOTHUB_DEVICE_CONNECTION_STRING=<YourIOTDeviceHubConnectionString>
    ```
1. Navigate to sample folder:

    ```azure-iot-sdk-python\azure-iot-hub\samples```
1. Run the sample with the following command:



    ```cmd/sh
    python iothub_digital_twin_manager_sample.py
    ```

1. You see messages saying that the device has sent some information and reported itself online. These messages indicate that the device is sending telemetry data to the hub, and is now ready to receive commands and property updates. Don't close this terminal, you need it later to confirm the service samples also worked.

### Get Digital Twin

```python
# Create IoTHubDigitalTwinManager
iothub_digital_twin_manager = IoTHubDigitalTwinManager(iothub_connection_str)
# Get digital twin
digital_twin = iothub_digital_twin_manager.get_digital_twin(device_id)
```

### Update a digital twin

```python
  # Update digital twin
    patch = []  # json-patch for digital twin
    updated_digital_twin = iothub_digital_twin_manager.update_digital_twin(device_id, patch)
```

### Invoke a command

```python
# Invoke component command
component_name = (
    "environmentalSensor"
)  # for the environmental sensor, try "environmentalSensor"
command_name = (
    "turnOff"
)  # for the environmental sensor, you can try "blink", "turnOff" or "turnOn"
payload = "hello"  # for the environmental sensor, it really doesn't matter. any string will do.
invoke_component_command_result = iothub_digital_twin_manager.invoke_component_command(
    device_id, component_name, command_name, payload
)
```

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
