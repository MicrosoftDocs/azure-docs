---
title: Interact with an IoT Plug and Play Preview device connected to your Azure IoT solution (Python) | Microsoft Docs
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

**Install the Python Service SDK** 

You can install the [Python service SDK preview pacakge](https://pypi.org/project/azure-iot-hub/2.2.1rc0/) by running the following command: 

`pip3 install azure-iot-hub==2.2.1rc0`


## Run the sample device

In this quickstart, you use a sample thermostat device, written in Python, as the IoT Plug and Play device. For full instructions on how to set up this device, see [this page](dummy link to the Python no component device sample). The following instructions provide a quick overview of how to install and run the device:

1. Open a terminal window in the directory of your choice. Execute the following command to clone the [Azure IoT Python SDK](https://github.com/Azure/azure-iot-sdk-python) GitHub repository into this location:

    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-python
    ```
1. This terminal window is used as your _device_ terminal. Go to the folder of your cloned repository, and navigate to the **/azure-iot-sdk-python/azure-iot-device/samples/pnp** folder. 
 
1. Configure the _device connection string_:

    ```cmd/sh
    set IOTHUB_DEVICE_CONNECTION_STRING=<YourDeviceConnectionString>
    ```
1. Run the sample thermostat device with the following command:

    ```cmd/sh
    python pnp_thermostat.py
    ```
1. You see messages saying that the device has sent telemetry to your IoT hub. This indicates that the device is now ready to receive commands and property updates. Don't close this terminal, you'll need it later to confirm the service samples also worked.

## Run the sample solution

In this quickstart, you use a sample IoT solution in Python to interact with the sample device you just set up. 

1. Open another terminal window to use as your _service_ terminal. The service SDK is in preview, so you will need to clone the samples from a [preview branch of the Python SDK](https://github.com/Azure/azure-iot-sdk-python/tree/digitaltwins-preview):

    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-python -b digitaltwins-preview
    ```
1. Go to the folder of this cloned repository branch, and navigate to the **/azure-iot-sdk-python/azure-iot-hub/samples** folder.

1. Configure the environment variables for your _device id_ and _IoT Hub connections string_

    ```cmd/sh
    set IOTHUB_CONNECTION_STRING=<YourIOTHubConnectionString>
    set IOTHUB_DEVICE_ID=<Your device ID> (i.e. mySimpleThermostat)
    ```

1. If you look in the samples folder, you'll see four samples prefixed with `pnp`. These showcase how to use each API for interacting with PnP devices. We'll go through each one. 


### Get Digital Twin

After configuring the environment variables, you can run this sample with the following command:

```cmd/sh
python pnp_get_digital_twin_sample.py
```
It will return your device's digital twin and print its model ID. Notice how the code achieves this:

```python
    # Get digital twin and retrieve the modelId from it
    digital_twin = iothub_digital_twin_manager.get_digital_twin(device_id)
    if digital_twin:
        print(digital_twin)
        print("Model Id: " + digital_twin["$metadata"]["$model"])
    else:
        print("No digital_twin found")
```

You should see the following output:
```cmd/sh
{'$dtId': 'mySimpleThermostat', '$metadata': {'$model': 'dtmi:com:example:Thermostat;1'}}
Model Id: dtmi:com:example:Thermostat;1
```

### Update a digital twin

This sample allows you to update properties through your device's digital twin by sending over a "patch". Notice how the patch is constructed, along with an example for how this could be applied to a device with multiple components:

```python
# If you already have a component thermostat1:
# patch = [{"op": "replace", "path": "/thermostat1/targetTemperature", "value": 42}]
patch = [{"op": "add", "path": "/targetTemperature", "value": 42}]
iothub_digital_twin_manager.update_digital_twin(device_id, patch)
print("Patch has been succesfully applied")
```


You can run this sample with the following command.

```cmd/sh
python pnp_update_digital_twin_sample.py
```

You can verify that the update has been applied both in IoT Explorer and on the _device_ terminal that you have open, where you should see the following:

```cmd/sh
the data in the desired properties patch was: {'targetTemperature': 42, '$version': 2}
previous values
42
```

The _service_ terminal from which you ran the `pnp_update_digital_twin_sample.py` should just confirm that the patch was successful:

`Patch has been succesfully applied`

### Invoke a command

Finally, to invoke a command, you can run the `pnp_invoke_command_sample.py` sample. This sample showcases how to invoke a command on a no-component device like the simple thermostat (*note: the `invoke_component_command_sample.py` shows how to invoke a command on a specific component of a multiple component device)*. Before running this sample, be sure to set all of the necessary environment variables, specifically the `IOTHUB_COMMAND_NAME` and `IOTHUB_COMMAND_PAYLOAD`:

```cmd/sh
set IOTHUB_COMMAND_NAME="getMaxMinReport" # this is the relevant command for the thermostat sample
set IOTHUB_COMMAND_PAYLOAD="hello world" # this payload doesn't matter for this sample
```
    
You can then run the sample with:
  
```cmd/sh
python pnp_invoke_command_sample.py
```
    
On the _service_ terminal, you should see a confirmation from the device with `min\max response`.

On the _device_ terminal, you should see that the device received the command:

```cmd/sh
Command request received with payload
hello world
Will return the max, min and average temperature from the specified time hello to the current time
Done generating
{"tempReport": {"avgTemp": 34.2, "endTime": "09/07/2020 09:58:11", "maxTemp": 49, "minTemp": 10, "startTime": "09/07/2020 09:56:51"}}
Sent message
```
    
Congratulations! You've now interacted with your Plug and Play device from a Python solution. 

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you learned how to connect an IoT Plug and Play device to a IoT solution. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)
