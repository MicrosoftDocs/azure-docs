---
title: Register a new Azure IoT Edge device | Microsoft Docs 
description: Use the IoT extension for Azure CLI to register a new IoT Edge device and retrieve the connection string
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 10/21/2009
ms.topic: conceptual
ms.reviewer: menchi
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Register a new Azure IoT Edge device

Before you can use your IoT devices with Azure IoT Edge, you need to register them with your IoT hub. Once a device is registered, you receive a connection string that can be used to set up your device for IoT Edge workloads.

You have the of choice of registering by using one of the following tools:

* [Azure portal](https://portal.azure.com). IoT Edge devices are created and managed separately from devices that connect to your IoT hub but aren't edge-enabled.
* [Azure CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest). You can use the Azure CLI to manage Azure IoT Hub resources, device provisioning service instances, and linked-hubs.
* [Visual Studio Code](https://code.visualstudio.com/). You can use Visual Studio Code manage Azure IoT Hub resources, device provisioning service instances, and linked-hubs.

## Prerequisites

An [IoT hub](../iot-hub/iot-hub-create-using-cli.md) in your Azure subscription is required to register a device.

You can perform all registration task in the Azure portal. If you are using the Azure CLI or Visual Studio code, you'll need the following:

| Tool | Prerequisites |
| --- | --- |
| Azure CLI | Azure CLI version must be 2.0.24 or above. Use `az --version` to validate. This version supports az extension commands and introduces the Knack command framework. |
| | Install the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension). |
| Visual Studio Code | Install the [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) for Visual Studio Code |

## Create a device

### Use the Azure Portal

In the Azure portal, IoT Edge devices are created and managed separately from devices that connect to your IoT hub but aren't edge-enabled.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.
2. Select **IoT Edge** from the menu.
3. Select **Add an IoT Edge device**.
4. Provide a descriptive device ID. Use the default settings to auto-generate authentication keys and connect the new device to your hub.
5. Select **Save**.

### Use Visual Studio Code

1. In Visual Studio Code, open the **Explorer** view **as shown here**:

1. Click on the **...** in the **Azure IoT Hub** section header. If you don't see the ellipsis, click on or hover over the header.

1. Choose **Select IoT Hub**.

1. If you aren't signed in to your Azure account, follow the prompts to do so.

1. Select your Azure subscription.

1. Select your IoT hub.

1. In the VS Code Explorer, expand the **Azure IoT Hub Devices** section.

1. Click on the **...** in the **Azure IoT Hub Devices** section header. If you don't see the ellipsis, click on or hover over the header.

1. Select **Create IoT Edge Device**.

1. In the text box that opens, give your device an ID.

In the output screen, you see the result of the command. The device info is printed, which includes the **deviceId** that you provided and the **connectionString** that you can use to connect your physical device to your IoT hub.

### Use the Azure CLI

Use the [az iot hub device-identity create](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-hub-device-identity-create) command to create a new device identity in your IoT hub. For example:

   ```cli
   az iot hub device-identity create --device-id [device id] --hub-name [hub name] --edge-enabled
   ```

This command includes three parameters:

* **device-id**: Provide a descriptive name that's unique to your IoT hub.

* **hub-name**: Provide the name of your IoT hub.

* **edge-enabled**: This parameter declares that the device is for use with IoT Edge **as shown here**:

## View all devices

### In the Azure Portal

All the edge-enabled devices that connect to your IoT hub are listed on the **IoT Edge** page.

### In Visual Studio Code

All the devices that connect to your IoT hub are listed in the **Azure IoT Hub** section of the Visual Studio Code Explorer. IoT Edge devices are distinguishable from non-Edge devices with a different icon, and the fact that the **$edgeAgent** and **$edgeHub** modules are deployed to each IoT Edge device **as shown here**:

### In the Azure CLI

Use the [az iot hub device-identity list](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-hub-device-identity-list) command to view all devices in your IoT hub. For example:

   ```cli
   az iot hub device-identity list --hub-name [hub name]
   ```

Any device that is registered as an IoT Edge device will have the property **capabilities.iotEdge** set to **true**.

## Retrieve the connection string

### Get from the Azure Portal

When you're ready to set up your device, you need the connection string that links your physical device with its identity in the IoT hub.

1. From the **IoT Edge** page in the portal, click on the device ID from the list of IoT Edge devices.
2. Copy the value of either **Connection string (primary key)** or **Connection string (secondary key)**.

### Get from Visual Studio Code

When you're ready to set up your device, you need the connection string that links your physical device with its identity in the IoT hub.

1. Right-click on the ID of your device in the **Azure IoT Hub** section.

1. Select **Copy Device Connection String**.

   The connection string is copied to your clipboard.

You can also select **Get Device Info** from the right-click menu to see all the device info, including the connection string, in the output window.

### Get from the Azure CLI

When you're ready to set up your device, you need the connection string that links your physical device with its identity in the IoT hub. Use the [az iot hub device-identity show-connection-string](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest#ext-azure-cli-iot-ext-az-iot-hub-device-identity-show-connection-string) command to return the connection string for a single device:

   ```cli
   az iot hub device-identity show-connection-string --device-id [device id] --hub-name [hub name]
   ```

The value for the `device-id` parameter is case-sensitive. Don't copy the quotation marks around the connection string.

## Next steps

Learn how to [Deploy modules to a device with Azure CLI](how-to-deploy-modules-cli.md).