---
title: Register a new Azure IoT Edge device (CLI) | Microsoft Docs 
description: Use the IoT extension for Azure CLI to register a new IoT Edge device
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 07/27/2018
ms.topic: conceptual
ms.reviewer: menchi
ms.service: iot-edge
services: iot-edge
---

# Register a new Azure IoT Edge device with Azure CLI

Before you can use your IoT devices with Azure IoT Edge, you need to register them with your IoT hub. Once you register a device, you receive a connection string that can be used to set up your device for Edge workloads. 

[Azure CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest) is an open-source cross platform command-line tool for managing Azure resources such as IoT Edge. It enables you to manage Azure IoT Hub resources, device provisioning service instances, and linked-hubs out of the box. The new IoT extension enriches Azure CLI with features such as device management and full IoT Edge capability.

This article shows how to register a new IoT Edge device using Azure CLI.

## Prerequisites

* An [IoT hub](../iot-hub/iot-hub-create-using-cli.md) in your Azure subscription. 
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) in your environment. At a minimum, your Azure CLI version must be 2.0.24 or above. Use `az –-version` to validate. This version supports az extension commands and introduces the Knack command framework. 
* The [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension).

## Create a device

Use the following command to create a new device identity in your IoT hub: 

   ```cli
   az iot hub device-identity create --device-id [device id] --hub-name [hub name] --edge-enabled
   ```

This command includes three parameters:
* **device-id**: Provide a descriptive name that's unique to your IoT hub.
* **hub-name**: Provide the name of your IoT hub.
* **edge-enabled**: This parameter declares that the device is for use with IoT Edge.

   ![Create IoT Edge device](./media/how-to-register-device-cli/Create-edge-device.png)

## View all devices

Use the following command to view all devices in your IoT hub:

   ```cli
   az iot hub device-identity list --hub-name [hub name]
   ```

Any device that is registered as an IoT Edge device will have the property **capabilities.iotEdge** set to **true**. 

## Retrieve the connection string

When you're ready to set up your device, you need the connection string that links your physical device with its identity in the IoT hub. Use the following command to return the connection string for a single device:

   ```cli
   az iot hub device-identity show-connection-string --device-id [device id] --hub-name [hub name] 
   ```

The device id parameter is case-sensitive. Don't copy the quotation marks around the connection string. 

## Next steps

Learn how to [Deploy modules to a device with Azure CLI](how-to-deploy-modules-cli.md)
