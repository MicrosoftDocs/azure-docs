---
title: Use the Azure IoT extension for Azure CLI to interact with IoT Plug and Play devices | Microsoft Docs
description: Install the Azure IoT extension for Azure CLI and use it to interact with the Plug and Play devices connected to my IoT hub.
author: ChrisGMsft
ms.author: chrisgre
ms.date: 07/10/2019
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to use the Azure IoT extension for Azure CLI to interact with IoT Plug and Play devices connected to an IoT hub to test and verify their behavior.
---

# Install and use the Azure IoT extension for Azure CLI

[Azure CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest) is an open-source cross platform command-line tool for managing Azure resources such as IoT Hub. Azure CLI is available on Windows, Linux, and MacOS. The Azure CLI is also pre-installed in the [Azure Cloud Shell](https://shell.azure.com). Azure CLI lets you manage Azure IoT Hub resources, Device Provisioning Service instances, and linked-hubs without installing any extensions.

The Azure IoT extension for Azure CLI is a command-line tool for interacting with, and testing IoT Plug and Play devices. You can use the extension to:

- Connect to a device.
- View the telemetry the device sends.
- Work with device properties.
- Call device commands.

This article shows you how to:

- Install and configure the Azure IoT extension for Azure CLI.
- Use the extension to interact with and test your devices.
- Use the extension to manage interfaces in the model repository.

## Install Azure IoT extension for Azure CLI

### Step 1 - Install Python

[Python 2.7x or Python 3.x](https://www.python.org/downloads/) is required.

### Step 2 - Install the Azure CLI

Follow the [installation instruction](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) to set up Azure CLI in your environment. Your Azure CLI version must be version 2.0.24 or above. Use `az –version` to validate. This version supports az extension commands and introduces the Knack command framework. One simple way to install on Windows is to download and install the [MSI](https://aka.ms/InstallAzureCliWindows).

### Step 3 - Install IoT extension

[The IoT extension readme](https://github.com/Azure/azure-iot-cli-extension) describes several ways to install the extension. The simplest way is to run `az extension add --name azure-cli-iot-ext`. After installation, you can use `az extension list` to validate the currently installed extensions or `az extension show --name azure-cli-iot-ext` to see details about the IoT extension. To remove the extension, you can use `az extension remove --name azure-cli-iot-ext`.

## Use Azure IoT extension for Azure CLI

### Prerequisites

To use the Azure IoT extension for Azure CLI, you need:

- An Azure IoT hub. There are many ways to add an IoT hub to your Azure subscription, such as [Create an IoT hub using the Azure CLI](../iot-hub/iot-hub-create-using-cli.md). You need the IoT hub's connection string to run the Azure IoT extension commands. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- A device registered in your IoT hub. You can use the following Azure CLI command to register a device, be sure to replace the `{YourIoTHubName}` and `{YourDeviceID}` placeholders with your values:

```cmd/sh
az iot hub device-identity create --hub-name {YourIoTHubName} --device-id {YourDeviceID}
```

- (Optional) A model repository for your organization. A model repository for your organization is created when you [onboard to the Azure Certified for IoT portal](howto-onboard-portal.md).

### Interact with a device

You can use the extension to view and interact with IoT Plug and Play devices that are connected to an IoT hub. The extension works with the digital twin that represents the Plug and Play device.

#### List devices and interfaces

List all IoT Plug and Play devices on an IoT Hub:

```cmd/sh
az iot digitaltwin list-devices --hub-name {YourIoTHubName}
```

List all IoT Plug and Play devices on an IoT Hub that implement a target interface:

```cmd/sh
az iot digitaltwin list-devices --interface {YourInterfaceID} --hub-name {YourIoTHubName}
```

List all interfaces registered by an IoT Plug and Play device:

```cmd/sh
az iot digitaltwin list-interfaces --hub-name {YourIoTHubName}  --device-id {YourDeviceID}
```

#### Properties

List all properties and property values for a device:

```cmd/sh
az iot digitaltwin list-properties --hub-name {YourIoTHubName}  --device-id {YourDeviceID}
```

Set the value of a read-write property:

```cmd/sh
az iot digitaltwin update-property --property-name {TwinPropertyName} --property-value {TwinPropertyValue} --interface {YourInterfaceID} --hub-name {YourIoTHubName}  --device-id {YourDeviceID}
```

#### Commands

List all commands for a device:

```cmd/sh
az iot digitaltwin list-commands --login {YourIoTHubConnectionString}--device-id {YourDeviceID} --repository {PlugAndPlayRepositoryEndpoint}
```

Invoke a command:

```cmd/sh
az iot digitaltwin invoke-command --command-name [Interface Command Name] --command-payload {CommandPayloadOrFilePath} --interface {YourInterfaceID} --hub-name {YourIoTHubName}  --device-id {YourDeviceID}
```

#### Telemetry

Monitor all IoT Plug and Play telemetry from all devices and interfaces:

```cmd/sh
az iot digitaltwin monitor-events --hub-name {YourIoTHubName}
```

Monitor all telemetry from a particular IoT Plug and Play device:

```cmd/sh
az iot digitaltwin monitor-events --hub-name {YourIoTHubName}  --device-id {YourDeviceID}
```

### Manage interfaces in the model repository

List interfaces in the IoT Plug and Play model repository:

```cmd/sh
az iot pnp interface list --repository {ModelRepoNameOrConnectionString}
```

Show an interface in the IoT Plug and Play model repository:

```cmd/sh
az iot pnp interface show --interface {YourInterfaceID} --repository {ModelRepoNameOrConnectionString}
```

Create an interface in the IoT Plug and Play model repository:

```cmd/sh
az iot pnp interface create --definition {PathToUpdatedPnPInterfaceDefinitionOrInlineJSONLD} --repository {ModelRepoNameOrConnectionString}
```

Update an interface in the IoT Plug and Play model repository:

```cmd/sh
az iot pnp interface update --definition {PathToUpdatedPnPInterfaceDefinitionOrInlineJSONLD} --repository {ModelRepoNameOrConnectionString}
```

Publish an interface on the IoT Plug and Play model repository. This operation makes the interface immutable:

```cmd/sh
az iot pnp interface publish --interface {YourInterfaceID} --repository {ModelRepoNameOrConnectionString}
```

## Next steps

In this how-to article, you've learned how to install and use Azure IoT extension for Azure CLI to interact with your Plug and Play devices. To learn about IoT Plug and Play, continue to the next article.
