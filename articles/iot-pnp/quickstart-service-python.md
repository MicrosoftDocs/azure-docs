---
title: Interact with an IoT Plug and Play Preview device connected to your Azure IoT solution (Python) | Microsoft Docs
description: Use Python to connect to and interact with an IoT Plug and Play Preview device that's connected to your Azure IoT solution.
author: elhorton
ms.author: elhorton
ms.date: 7/13/2020
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution builder, I want to connect to and interact with an IoT Plug and Play device that's connected to my solution. For example, to collect telemetry from the device or to control the behavior of the device.
---

# Quickstart: Interact with an IoT Plug and Play Preview device that's connected to your solution (Python)

[!INCLUDE [iot-pnp-quickstarts-service-selector.md](../../includes/iot-pnp-quickstarts-service-selector.md)]

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's model without knowledge of the underlying device implementation. This quickstart shows you how to use Python to connect to and control an IoT Plug and Play device that's connected to your solution.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this quickstart, you need Python 3.7 on your development machine. You can download the latest recommended version for multiple platforms from [python.org](https://www.python.org/). You can check your Python version with the following command:  

```cmd/sh
python --version
```

Install the [Python service SDK preview package](https://pypi.org/project/azure-iot-hub/2.2.1rc0/) by running the following command:

```cmd/sh
pip3 install azure-iot-hub==2.2.1rc0
```

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub. Make a note of this connection string, you use it later in this quickstart:

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

Run the following command to get the _device connection string_ for the device you added to the hub. Make a note of this connection string, you use it later in this quickstart:

```azurecli-interactive
az iot hub device-identity show-connection-string --hub-name <YourIoTHubName> --device-id <YourDeviceID> --output
```

## Run the sample device

In this quickstart, you use a sample thermostat device, written in Python, as the IoT Plug and Play device. To run the sample device:

1. Open a terminal window in a folder of your choice. Run the following command to clone the [Azure IoT Python SDK](https://github.com/Azure/azure-iot-sdk-python) GitHub repository into this location:

    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-python
    ```

1. This terminal window is used as your **device** terminal. Go to the folder of your cloned repository, and navigate to the */azure-iot-sdk-python/azure-iot-device/samples/pnp* folder.

1. Configure the _device connection string_:

    ```cmd/sh
    set IOTHUB_DEVICE_CONNECTION_STRING=<YourDeviceConnectionString>
    ```

1. Run the sample thermostat device with the following command:

    ```cmd/sh
    python pnp_thermostat.py
    ```

1. You see messages saying that the device has sent some information and reported itself online. These messages indicate that the device has begun sending telemetry data to the hub, and is now ready to receive commands and property updates. Don't close this terminal, you need it to confirm the service sample is working.

## Run the sample solution

In this quickstart, you use a sample IoT solution in Python to interact with the sample device you just set up.

1. Open another terminal window to use as your **service** terminal. The service SDK is in preview, so you need to clone the samples from a [preview branch of the Python SDK](https://github.com/Azure/azure-iot-sdk-python/tree/pnp-preview-refresh):

    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-python -b pnp-preview-refresh
    ```

1. Go to the folder of this cloned repository branch, and navigate to the */azure-iot-sdk-python/azure-iot-hub/samples* folder.

1. Configure environment variables for your device ID and _IoT Hub connection string_:

    ```cmd/sh
    set IOTHUB_CONNECTION_STRING=<YourIOTHubConnectionString>
    set IOTHUB_DEVICE_ID=<Your device ID>
    ```

1. In the samples folder, there are four sample files with a `pnp` prefix. These samples show how to use each API for interacting with IoT Plug and Play devices:

### Get digital twin

Use the following command in the **service** terminal to run this sample:

```cmd/sh
python pnp_get_digital_twin_sample.py
```

The output shows the device's digital twin and prints its model ID:

```cmd/sh
{'$dtId': 'mySimpleThermostat', '$metadata': {'$model': 'dtmi:com:example:Thermostat;1'}}
Model Id: dtmi:com:example:Thermostat;1
```

The following snippet shows the sample code from *pnp_get_digital_twin_sample.py*:

```python
    # Get digital twin and retrieve the modelId from it
    digital_twin = iothub_digital_twin_manager.get_digital_twin(device_id)
    if digital_twin:
        print(digital_twin)
        print("Model Id: " + digital_twin["$metadata"]["$model"])
    else:
        print("No digital_twin found")
```

### Update a digital twin

This sample shows you how to use a *patch* to update properties through your device's digital twin. The following snippet from *pnp_update_digital_twin_sample.py* shows how to construct the patch:

```python
# If you already have a component thermostat1:
# patch = [{"op": "replace", "path": "/thermostat1/targetTemperature", "value": 42}]
patch = [{"op": "add", "path": "/targetTemperature", "value": 42}]
iothub_digital_twin_manager.update_digital_twin(device_id, patch)
print("Patch has been succesfully applied")
```

Use the following command in the **service** terminal to run this sample:

```cmd/sh
python pnp_update_digital_twin_sample.py
```

You can verify that the update is applied in the **device** terminal that shows the following output:

```cmd/sh
the data in the desired properties patch was: {'targetTemperature': 42, '$version': 2}
previous values
42
```

The **service** terminal confirms that the patch was successful:

```cmd/sh
Patch has been successfully applied
```

### Invoke a command

To invoke a command, run the *pnp_invoke_command_sample.py* sample. This sample shows how to invoke a command in a simple thermostat device. Before you run this sample, set the `IOTHUB_COMMAND_NAME` and `IOTHUB_COMMAND_PAYLOAD` environment variables in the **service** terminal:

```cmd/sh
set IOTHUB_COMMAND_NAME="getMaxMinReport" # this is the relevant command for the thermostat sample
set IOTHUB_COMMAND_PAYLOAD="hello world" # this payload doesn't matter for this sample
```

In the **service** terminal, use the following command to run the sample:
  
```cmd/sh
python pnp_invoke_command_sample.py
```

The **service** terminal shows a confirmation message from the device:

```cmd/sh
{"tempReport": {"avgTemp": 34.5, "endTime": "13/07/2020 16:03:38", "maxTemp": 49, "minTemp": 11, "startTime": "13/07/2020 16:02:18"}}
```

In the **device** terminal, you see the device receives the command:

```cmd/sh
Command request received with payload
hello world
Will return the max, min and average temperature from the specified time hello to the current time
Done generating
{"tempReport": {"avgTemp": 34.2, "endTime": "09/07/2020 09:58:11", "maxTemp": 49, "minTemp": 10, "startTime": "09/07/2020 09:56:51"}}
Sent message
```

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about IoT Plug and Play device models, see:

> [!div class="nextstepaction"]
> [IoT Plug and Play Preview modeling developer guide](concepts-developer-guide.md)
