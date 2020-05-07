---
title: Connect IoT Plug and Play Preview sample device code to Azure IoT Hub | Microsoft Docs
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

Install this preview package from XXXX

```cmd/sh
pip install XXXX
```

## Run the sample device

The `pnp` folder contains the sample code for the IoT Plug and Play device. There are three files in this folder:

- pnp_sample_device.py  
- pnp_helper.py
- pnp_methods.py

The sample file is **pnp_sample_device.py**. This sample code uses methods from **pnp_methods.py**. The **pnp_methods.py** file uses Azure IoT Python SDK functionality to provide IoT Plug and Play compatible functionality. The **pnp_methods.py** file uses  helper functions in the **pnp_helper.py** file.

To run the sample, use the following command:

```cmd/sh
python pnp_environmental_monitor.py
```

The sample device sends telemetry messages every eight seconds to your IoT hub.

You see the following output, that indicates the device is sending telemetry data to the hub, and is now ready to receive commands and property updates.

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
