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

[!INCLUDE [iot-pnp-quickstarts-3-selector.md](../../includes/iot-pnp-quickstarts-3-selector.md)]

IoT Plug and Play Preview simplifies IoT by enabling you to interact with a device's model without knowledge of the underlying device implementation. This quickstart shows you how to use Python to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

To complete this quickstart, you need Python on your development machine. Python 3.5+ preferably Python 3.7. You can check your python version by running  

```cmd/sh
python --version
```
You can download the latest recommended version for multiple platforms from [python.org](https://www.python.org/).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub (note for use later):

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

## Setup your environment
Install this preview package from XXXX
```cmd/sh
   pip install XXXX
```

## Run the sample device
Take a moment to examine the code in the folder pnp. There are 3 files in this folder.  

pnp_sample_device.py  

pnp_helper.py 

pnp_methods.py 

The sample file is “pnp_sample_device.py”. Notice that the sample uses methods from “pnp_methods.py”. This “pnp_methods.py” file uses our “azure-iot-device" SDK functionality to provide PNP compatible functionality. It uses certain helper functions that are present in the “pnp_helper.py” file.   

Look at “pnp_sample_device.py”.Go ahead and run the sample with: 
```cmd/sh
   python pnp_environmental_monitor.py
```
Now the device is sending telemetry messages every 8 seconds to your hub.

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
> [How-to: Connect to and interact with an IoT Plug and Play Preview device](howto-connect-pnp-device-solution.md)

