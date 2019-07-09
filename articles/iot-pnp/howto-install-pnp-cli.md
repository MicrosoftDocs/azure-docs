---
title: Use the Azure IoT Extension for Azure CLI to interact with IoT Plug and Play devices | Microsoft Docs'
description: Install the Azure IoT Extension for Azure CLI and use it to interact with the Plug and Play devices connected to my IoT hub.
author: ChrisGMsft
ms.author: chrisgre
ms.date: 07/02/2019
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to use the Azure IoT Extension for Azure CLI to interact with IoT Plug and Play devices connected to an IoT hub to test and verify their behavior.
---

# Install and use the Azure IoT Extension for Azure CLI

[Azure CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest) is an open-source cross platform command-line tool for managing Azure resources such as IoT Hub. Azure CLI is available on Windows, Linux, and MacOS. Azure CLI enables you to manage Azure IoT Hub resources, Device Provisioning service instances, and linked-hubs out of the box.

The Azure IoT Extension for Azure CLI is a commandline tool for interacting with and testing IoT Plug and Play devices. After installing the extension on your local machine, you can use it to connect to a device. You can use the extension to view the telemetry the device is sending, work with device properties, and call commands.

This article shows you how to:

- Install and configure the Azure IoT Extension for Azure CLI.
- Use the extension to interact with and test your devices.
- Use the extension to manage interfaces in the model repository.

## Install Azure IoT Extension for Azure CLI

### Step 1 - Install Python

[Python 2.7x or Python 3.x](https://www.python.org/downloads/) is required.

### Step 2 - Install the Azure CLI

Follow the [installation instruction](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) to setup Azure CLI in your environment. At a minimum, your Azure CLI version must be 2.0.24 or above. Use `az –version` to validate. This version supports az extension commands and introduces the Knack command framework. One simple way to install on Windows is to download and install the [MSI](https://aka.ms/InstallAzureCliWindows).

### Step 3 - Install IoT extension

[The IoT extension readme](https://github.com/Azure/azure-iot-cli-extension) describes several ways to install the extension. The simplest way is to run `az extension add --name azure-cli-iot-ext`. After installation, you can use `az extension list` to validate the currently installed extensions or `az extension show --name azure-cli-iot-ext` to see details about the IoT extension. To remove the extension, you can use `az extension remove --name azure-cli-iot-ext`.

## Use Azure IoT Extension for Azure CLI

### Prerequisites

To use the Azure IoT Extension for Azure CLI, you need:

- An Azure IoT hub. There are many ways to add an IoT hub to your Azure subscription, such as [Create an IoT hub using the Azure CLI](../iot-hub/iot-hub-create-using-cli.md). You need the IoT hub's connection string to run the Azure IoT explorer tool. If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- A device registered in your IoT hub. You can use the following Azure CLI command to register a device, be sure to replace the `{YourIoTHubName}` and `{YourDeviceID}` placeholders with your values:

    ```azurecli-interactive
    az iot hub device-identity create --hub-name {YourIoTHubName} --device-id {YourDeviceID}
    ```
- (Optional) A model repository for your organization. This is done when you [onboard to the Azure Certified for IoT portal](howto-onboard-portal.md).

### Interact with a device

You can view and interact with IoT Plug and Play devices that represented by digital twins and are connected to an IoT Hub.

#### List devices and interfaces

List all IoT Plug and Play devices on an IoT Hub:

    az iot digitaltwin list-devices --hub-name [IoTHub Name]
    
List all IoT Plug and Play devices on an IoT Hub that implement a target interface:

    az iot digitaltwin list-devices --interface [Interface Id] --hub-name [IoTHub Name]

List all interfaces registered by an IoT Plug and Play device:

    az iot digitaltwin list-interfaces --hub-name [IoTHub Name] --device-id [Device Id]

#### Properties

List all properties and property values for a device

    az iot digitaltwin list-properties --hub-name [IoTHub Name] --device-id [Device Id]

Set the value of a read-write property.

    az iot digitaltwin update-property --property-name [Property Name] --property-value [Property Value] --interface [Interface Id] --hub-name [IoTHub Name] --device-id [Device Id]

#### Commands

List all commands for a device

    az iot digitaltwin list-commands --login [IoTHub Connection string] --device-id [Device ID] --repository [Plug and Play model repo end point]

Invoke a command 

    az iot digitaltwin invoke-command --command-name [Interface Command Name] --command-payload [Command Payload, may be file path] --interface [Interface Id] --hub-name [IoTHub Name] --device-id [Device Id]

#### Telemetry

Monitor all IoT Plug and Play telemetry from all devices and interfaces:
    
    az iot digitaltwin monitor-events --hub-name [IoTHub Name]

Monitor all telemetry from a particular IoT Plug and Play device:
    
    az iot digitaltwin monitor-events --hub-name [IoTHub Name] --device-id [Device Id]

### Manage interfaces in the model repository

List interfaces in the IoT Plug and Play model repository

    az iot pnp interface list --repository [Model repo name OR connection string]

Show an interface in the IoT Plug and Play model repository

    az iot pnp interface show --interface [Interface Id] --repository [Model repo name OR connection string]

Create an interface in the IoT Plug and Play model repository

    az iot pnp interface create --definition [Path to PnP Interface definition OR inline JSON-LD] --repository [Model repo name OR connection string]

Update an interface in the IoT Plug and Play model repository
    
    az iot pnp interface update --definition [Path to updated PnP Interface definition OR inline JSON-LD] --repository [Model repo name OR connection string]

Publish an interface on the the IoT Plug and Play model repository. This operation makes the interface immutable.

    az iot pnp interface publish --interface [Interface Id] --repository [Model repo name OR connection string]

## Next steps

In this how-to article, you've learned how to install and use Azure IoT explorer to interact with your Plug and Play devices. To learn about IoT Plug and Play, continue to the next article.