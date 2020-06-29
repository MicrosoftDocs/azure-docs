---
title: Use the Azure IoT extension for Azure CLI to interact with IoT Plug and Play Preview devices | Microsoft Docs
description: Install the Azure IoT extension for Azure CLI and use it to interact with the IoT Plug and Play devices connected to my IoT hub.
author: Philmea
ms.author: philmea
ms.date: 12/26/2019
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to use the Azure IoT extension for the Azure CLI to interact with IoT Plug and Play devices connected to an IoT hub to test and verify their behavior.
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
- Use the extension to manage interfaces in the model repository.

## Install Azure IoT extension for the Azure CLI

### Step 1 - Install the Azure CLI

Follow the [installation instructions](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) to set up the Azure CLI in your environment. To use all the commands below, your Azure CLI version must be version 2.0.73 or above. Use `az -–version` to validate.

### Step 2 - Install IoT extension

[The IoT extension readme](https://github.com/Azure/azure-iot-cli-extension) describes several ways to install the extension. The simplest way is to run `az extension add --name azure-iot`. After installation, you can use `az extension list` to validate the currently installed extensions or `az extension show --name azure-iot` to see details about the IoT extension. To remove the extension, you can use `az extension remove --name azure-iot`.

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

- Some commands need the connection string for a company model repository. A model repository for your company is created when you first [onboard to the Azure Certified for IoT portal](howto-onboard-portal.md). A third party might share their model repository connection string with you to give you access to their interfaces and models.

### Interact with a device

You can use the extension to view and interact with IoT Plug and Play devices that are connected to an IoT hub. The extension works with the digital twin that represents the IoT Plug and Play device.

#### List devices and interfaces

List all devices on an IoT Hub:

```azurecli
az iot hub device-identity list --hub-name {YourIoTHubName}
```

List all interfaces registered by an IoT Plug and Play device:

```azurecli
az iot dt list-interfaces --hub-name {YourIoTHubName} --device-id {YourDeviceID}
```

#### Properties

List all properties and property values for an interface on a device:

```azurecli
az iot dt list-properties --hub-name {YourIoTHubName} --device-id {YourDeviceID} --interface {YourInterfaceID} --source private --repo-login "{YourCompanyModelRepoConnectionString}"
```

Set the value of a read-write property:

```azurecli
az iot dt update-property --hub-name {YourIoTHubName} --device-id {YourDeviceID} --interface-payload {JSONPayload or FilePath}
```

An example payload file to set the **name** property on the **sensor** interface of a device to **Contoso** looks like the following:

```json
{
  "sensor": {
    "properties": {
      "name": {
        "desired": {
          "value": "Contoso"
        }
      }
    }
  }
}
```

#### Commands

List all commands for an interface on a device:

```azurecli
az iot dt list-commands --hub-name {YourIoTHubName} --device-id {YourDeviceID} --interface {YourInterfaceID} --source private --repo-login {YourCompanyModelRepoConnectionString}
```

Without the `--repo-login` parameter, this command uses the public model repository.

Invoke a command:

```azurecli
az iot dt invoke-command --hub-name {YourIoTHubName} --device-id {YourDeviceID} --interface {YourInterfaceID} --cn {CommandName} --command-payload {CommandPayload or FilePath}
```

#### Digital twin events

Monitor all IoT Plug and Play digital twin events from a specific device and interface going to the **$Default** event hub consumer group:

```azurecli
az iot dt monitor-events --hub-name {YourIoTHubName} --device-id {YourDeviceID} --interface {YourInterfaceID}
```

Monitor all IoT Plug and Play digital twin events from a specific device and interface going a specific consumer group:

```azurecli
az iot dt monitor-events --hub-name {YourIoTHubName} --device-id {YourDeviceID} --interface {YourInterfaceID} --consumer-group {YourConsumerGroup}
```

### Manage interfaces in a model repository

The following commands use the public IoT Plug and Play model repository. To use a company model repository, add the `--login` argument with your model repository connection string.

List interfaces in the public IoT Plug and Play model repository:

```azurecli
az iot pnp interface list
```

Show an interface in the public IoT Plug and Play model repository:

```azurecli
az iot pnp interface show --interface {YourInterfaceId}
```

Create an interface in your IoT Plug and Play company model repository:

```azurecli
az iot pnp interface create --definition {JSONPayload or FilePath} --login {YourCompanyModelRepoConnectionString}
```

You can't directly create an interface in the public model repository.

Update an interface in your IoT Plug and Play company model repository:

```azurecli
az iot pnp interface update --definition {JSONPayload or FilePath} --login {YourCompanyModelRepoConnectionString}
```

You can't directly update an interface in the public model repository.

Publish an interface from your IoT Plug and Play company model repository to the public model repository. This operation makes the interface immutable:

```azurecli
az iot pnp interface publish --interface {YourInterfaceID} --login {YourCompanyModelRepoConnectionString}
```

Only Microsoft partners can publish interfaces to the public model repository.

### Manage device capability models in a model repository

The following commands use the public IoT Plug and Play model repository. To use a company model repository, add the `--login` argument with your model repository connection string.

List device capability models in the IoT Plug and Play public model repository:

```azurecli
az iot pnp capability-model list
```

Show a device capability model in the IoT Plug and Play public model repository:

```azurecli
az iot pnp capability-model show --model {YourModelID}
```

Create a device capability model in an IoT Plug and Play company model repository:

```azurecli
az iot pnp capability-model create --definition {JSONPayload or FilePath} --login {YourCompanyModelRepoConnectionString}
```

You can't directly create a model in the public model repository.

Update a device capability model in the IoT Plug and Play company model repository:

```azurecli
az iot pnp capability-model update --definition {JSONPayload or FilePath} --login {YourCompanyModelRepoConnectionString}
```

You can't directly update a model in the public model repository.

Publish a device capability model from your IoT Plug and Play company model repository to the public model repository. This operation makes the model immutable:

```azurecli
az iot pnp capability-model publish --model {YourModelID} --login {YourCompanyModelRepoConnectionString}
```

Only Microsoft partners can publish models to the public model repository.

## Next steps

In this how-to article, you've learned how to install and use the Azure IoT extension for the Azure CLI to interact with your Plug and Play devices. A suggested next step is to learn how to [Manage models](./howto-manage-models.md).
