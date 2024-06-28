---
title: Create an IoT hub using the Azure CLI
description: Learn how to use the Azure CLI commands to create a resource group and then create an IoT hub in the resource group. Also learn how to remove the hub.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 08/23/2018
---

# Create an IoT hub using the Azure CLI

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

This article shows you how to create an IoT hub using Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

When you create an IoT hub, you must create it in a resource group. Either use an existing resource group, or run the following [command to create a resource group](/cli/azure/resource):

   ```azurecli-interactive
   az group create --name {your resource group name} --location westus
   ```

   > [!TIP]
   > The previous example creates the resource group in the West US location. You can view a list of available locations by running this command: 
   >
   > ```azurecli-interactive
   > az account list-locations -o table
   > ```

## Create an IoT hub

Use the Azure CLI to create a resource group and then add an IoT hub.

Run the following [command to create an IoT hub](/cli/azure/iot/hub#az-iot-hub-create) in your resource group, using a globally unique name for your IoT hub:

   ```azurecli-interactive
   az iot hub create --name {your iot hub name} \
      --resource-group {your resource group name} --sku S1
   ```

   [!INCLUDE [iot-hub-pii-note-naming-hub](../../includes/iot-hub-pii-note-naming-hub.md)]

The previous command creates an IoT hub in the S1 pricing tier for which you're billed. For more information, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

For more information on Azure IoT Hub commands, see the [`az iot hub`](/cli/azure/iot/hub) reference article.

## Update the IoT hub

You can change the settings of an existing IoT hub after it's created. Here are some properties you can set for an IoT hub:

**Pricing and scale**: Migrate to a different tier or set the number of IoT Hub units.

**IP Filter**: Specify a range of IP addresses that will be accepted or rejected by the IoT hub.

**Properties**: A list of properties that you can copy and use elsewhere, such as the resource ID, resource group, location, and so on.

For a complete list of options to update an IoT hub, see the [**az iot hub update** commands](/cli/azure/iot/hub#az-iot-hub-update) reference page.

## Register a new device in the IoT hub

In this section, you create a device identity in the identity registry in your IoT hub. A device can't connect to a hub unless it has an entry in the identity registry. For more information, see [Understand the identity registry in your IoT hub](iot-hub-devguide-identity-registry.md). This device identity is [IoT Edge](../iot-edge/index.yml) enabled.

Run the following command to create a device identity. Use your IoT hub name and create a new device ID name in place of `{iothub_name}` and `{device_id}`. This command creates a device identity with default authorization (shared private key).

```azurecli-interactive
az iot hub device-identity create -n {iothub_name} -d {device_id} --ee
```

The result is a JSON printout which includes your keys and other information.

Alternatively, there are several options to register a device using different kinds of authorization. To explore the options, see [Examples](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-create-examples) on the **az iot hub device-identity** reference page.

## Remove an IoT hub

There are various commands to [delete an individual resource](/cli/azure/resource), such as an IoT hub.

To [delete an IoT hub](/cli/azure/iot/hub#az-iot-hub-delete), run the following command:

```azurecli-interactive
az iot hub delete --name {your iot hub name} -\
  -resource-group {your resource group name}
```

## Next steps

Learn more about the commands available in the Microsoft Azure IoT extension for Azure CLI:

* [IoT Hub-specific commands (az iot hub)](/cli/azure/iot/hub)
* [All commands (az iot)](/cli/azure/iot)
