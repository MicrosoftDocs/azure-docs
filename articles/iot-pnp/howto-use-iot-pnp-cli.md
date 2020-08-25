---
title: Use the Azure IoT extension for Azure CLI to interact with IoT Plug and Play Preview devices | Microsoft Docs
description: Install the Azure IoT extension for Azure CLI and use it to interact with the IoT Plug and Play devices connected to my IoT hub.
author: dominicbetts
ms.author: dobett
ms.date: 07/20/2020
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp

# As a solution builder, I want to use the Azure IoT extension for the Azure CLI to interact with IoT Plug and Play devices connected to an IoT hub to test and verify their behavior.
---

# Install and use the Azure IoT extension for the Azure CLI

[The Azure CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest) is an open-source cross platform command-line tool for managing Azure resources such as IoT Hub. The Azure CLI is available on Windows, Linux, and MacOS. The Azure CLI is also pre-installed in the [Azure Cloud Shell](https://shell.azure.com). The Azure CLI lets you manage Azure IoT Hub resources, Device Provisioning Service instances, and linked-hubs without installing any extensions.

The Azure IoT extension for the Azure CLI is a command-line tool for interacting with, and testing IoT Plug and Play Preview devices. You can use the extension to:

- Connect to a device.
- View the telemetry the device sends.
- Work with device properties.
- Call device commands.

This article shows you how to:

- Install and configure the Azure IoT extension for the Azure CLI.
- Use the extension to interact with and test your devices.

## Install Azure IoT extension for the Azure CLI

### Step 1 - Install the Azure CLI

Follow the [installation instructions](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) to set up the Azure CLI in your environment. For the best experience, your Azure CLI version should be version 2.9.1 or above. Use `az -–version` to validate.

### Step 2 - Install IoT extension

[The IoT extension readme](https://github.com/Azure/azure-iot-cli-extension) describes several ways to install the extension. The simplest way is to run `az extension add --name azure-iot`. After installation, you can use `az extension list` to validate the currently installed extensions or `az extension show --name azure-iot` to see details about the IoT extension. At the time of writing, the extension version  number is `0.9.7`.

To remove the extension, you can use `az extension remove --name azure-iot`.

## Use Azure IoT extension for the Azure CLI

### Prerequisites

To sign in to your Azure subscription, run the following command:

```azurecli
az login
```

> [!NOTE]
> If you're using the Azure cloud shell, you're automatically signed in and don't need to run the previous command.

To use the Azure IoT extension for the Azure CLI, you need:

- An Azure IoT hub. There are many ways to add an IoT hub to your Azure subscription, such as [Create an IoT hub using the Azure CLI](../iot-hub/iot-hub-create-using-cli.md). You need the IoT hub's connection string to run the Azure IoT extension commands. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- A device registered in your IoT hub. You can use the following Azure CLI command to register a device, be sure to replace the `{YourIoTHubName}` and `{YourDeviceID}` placeholders with your values:

    ```azurecli
    az iot hub device-identity create --hub-name {YourIoTHubName} --device-id {YourDeviceID}
    ```

### Interact with a device

You can use the extension to view and interact with IoT Plug and Play devices that are connected to an IoT hub. The extension works with the digital twin that represents the IoT Plug and Play device.

#### List devices

List all devices on an IoT Hub:

```azurecli
az iot hub device-identity list --hub-name {YourIoTHubName}
```

#### View digital twin

View the digital twin of a device:

```azurecli
az iot pnp twin show -n {iothub_name} -d {device_id}
```

#### Properties

Set the value of a read-write property:

```azurecli
az iot pnp twin update --hub-name {iothub_name} --device-id {device_id} --json-patch '{"op":"add", "path":"/thermostat1/targetTemperature", "value": 54}'
```

#### Commands

Invoke a command:

```azurecli
az iot pnp twin invoke-command --cn getMaxMinReport -n {iothub_name} -d {device_id} --component-path thermostat1
```

#### Digital twin events

Monitor all IoT Plug and Play digital twin events from a specific device and interface going to the **$Default** event hub consumer group:

```azurecli
az iot hub monitor-events -n {iothub_name} -d {device_id} -i {interface_id}
```

## Next steps

In this how-to article, you've learned how to install and use the Azure IoT extension for the Azure CLI to interact with your Plug and Play devices. A suggested next step is to learn how to use the [Azure IoT explorer with your devices](./howto-use-iot-explorer.md).
