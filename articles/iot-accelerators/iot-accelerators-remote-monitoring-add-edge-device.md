---
title: Remote Monitoring solution add Edge device - Azure | Microsoft Docs 
description: This article describes how to add an IoT Edge device to a Remote Monitoring solution accelerator
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 10/09/2018
ms.topic: conceptual

# As an operator in the Remote Monitoring solution accelerator, I want add an IoT Edge deice to the solution so that I can receive telemetry from the device
---

# Add an IoT Edge device to your Remote Monitoring solution accelerator

To add an [IoT Edge](../iot-edge/about-iot-edge.md) device to your solution accelerator, you register it with the IoT hub that's part of your deployment. In the current version of the Remote Monitoring solution accelerator, you can use either the Azure portal or the Azure CLI to add an Edge device.

This article shows you how to use the Azure CLI to add an Edge device. You need the name you chose when you deployed your solution accelerator to complete the steps in this how-to guide.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Find your IoT hub

Before you can add a device, you need to know the name of your IoT hub. The IoT hub was created when you deployed the Remote Monitoring solution accelerator. The following command lists the contents in the resource group that contains all the Azure resources used by your Remote Monitoring solution. The name of the resource group is the name you chose when you deployed the Remote Monitoring solution accelerator:

```azurecli-interactive
# The resource group name is the name of your Remote Monitoring solution
# You can see a list of your resource groups using:
#   az group list -o table
az resource list -g {resource group name} -o table
```

Make a note of the name of the IoT hub, you need this name in the following section.

## Register your device to IoT Hub

Before an IoT Edge device can connect to an IoT hub, you must register it.

You have three options for registering an IoT Edge device. Make sure you add the Edge device to the IoT hub you identified in the previous section:

- [Register a new Azure IoT Edge device from the Azure portal](../iot-edge/how-to-register-device-portal.md)
- [Register a new Azure IoT Edge device with Azure CLI](../iot-edge/how-to-register-device-cli.md)
- [Register a new Azure IoT Edge device from Visual Studio Code](../iot-edge/how-to-register-device-vscode.md)

When you register a device with the IoT hub in the Remote Monitoring solution accelerator, it's listed on the **Devices** page in the web UI:

TODO - Add a screenshot here.

## Install the IoT Edge runtime

Before you can deploy modules to your Edge device, you must install the IoT Edge runtime on the physical device. The following how-to guides show you how to install the runtime on common device platforms:

- [Install the Azure IoT Edge runtime on Linux (x64)](../iot-edge/how-to-install-iot-edge-linux.md)
- [Install Azure IoT Edge runtime on Linux (ARM32v7/armhf)](../iot-edge/how-to-install-iot-edge-linux-arm.md)
- [Install Azure IoT Edge runtime on Windows to use with Windows containers](../iot-edge/how-to-install-iot-edge-windows-with-windows.md)
- [Install the Azure IoT Edge runtime on Windows to use with Linux containers](../iot-edge/how-to-install-iot-edge-windows-with-linux.md)
- [Install the IoT Edge runtime on Windows IoT Core](../iot-edge/how-to-install-iot-core.md)

## Next steps

TODO - make sure this next step is updated.
Now that you have prepared your IoT Edge device, the next step is to deploy modules to it.
