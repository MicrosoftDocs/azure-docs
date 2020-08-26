---
title: Set up the IoT resources you need for IoT Plug and Play | Microsoft Docs
description: Create an IoT Hub and Device Provisioning Service instance to use with the IoT Plug and Play quickstarts and tutorials.
author: dominicbetts
ms.author: dobett
ms.date: 08/11/2020
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp

# Setup IoT Hub and DPS one time before completing any quickstart,tutorial,or how-to
---

# How to prepare the resources for IoT Plug and Play quickstarts and tutorials

Before you can complete any of the IoT Plug and Play quickstarts and tutorials, you need to configure an IoT hub and the Device Provisioning Service (DPS) in your Azure subscription.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create the resources

Create an Azure resource group for the resources:

```azurecli-interactive
az group create --name my-pnp-resourcegroup \
    --location centralus
```

### Create an IoT hub

The following command uses the the name `my-pnp-hub` as an example for the name of the IoT hub to create. Choose a unique name for your IoT hub to use in place of `my-pnp-hub`:

```azurecli-interactive
az iot hub create --name my-pnp-hub \
    --resource-group my-pnp-resourcegroup --sku F1
```

### Create DPS instance

The following command uses the the name `my-pnp-dps` as an example for the name of the DPS instance to create. Choose a unique name for your DPS instance to use in place of `my-pnp-dps`:

```azurecli-interactive
az iot dps create --name my-pnp-dps --resource-group my-pnp-resourcegroup
```

## Link your IoT hub to DPS

To link the DPS instance to your IoT hub you need the IoT hub connection string. You use the connection string when you configure the link. Replace `my-pnp-dps` and `my-pnp-hub` with the unique names you chose:

```azurecli-interactive
hubConnectionString=$(az iot hub show-connection-string --name my-pnp-hub --key primary --query connectionString -o tsv)
az iot dps linked-hub create --dps-name my-pnp-dps --resource-group my-pnp-resourcegroup --connection-string $hubConnectionString
```

To view your DPS configuration, use the following command. Replace `my-pnp-dps` with the unique name you chose:

```azurecli-interactive
az iot dps show --name my-pnp-dps
```

## Retrieve the IoT hub connection string

Some quickstarts and tutorials need the connection string for your IoT hub. You can retrieve the connection string and make a note of it now:

```azurecli-interactive
echo $hubConnectionString
```

## Download the model files

The quickstarts and tutorials use sample model files for the temperature controller and thermostat devices. To download the sample model files:

1. Create a folder called *models* on your local machine.

1. Right-click [TemperatureController.json](https://raw.githubusercontent.com/Azure/opendigitaltwins-dtdl/master/DTDL/v2/samples/TemperatureController.json) and save the JSON file to the *models* folder.

1. Right-click [Thermostat.json](https://raw.githubusercontent.com/Azure/opendigitaltwins-dtdl/master/DTDL/v2/samples/Thermostat.json) and save the JSON file to the *models* folder.

## Install the Azure IoT explorer

The quickstarts and tutorials use the **Azure IoT explorer** tool. [Download and install the latest release of Azure IoT explorer](./howto-use-iot-explorer.md) for your operating system.

## Remove the resources

You can use the IoT hub and DPS instance for all the IoT Plug and Play quickstarts and tutorials, so you only need to complete the steps in this article once. When you're finished, you can remove them from your subscription with the following command:

```azurecli-interactive
az group delete --name my-pnp-resourcegroup
```
