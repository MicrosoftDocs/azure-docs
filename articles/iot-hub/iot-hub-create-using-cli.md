---
title: Create an IoT Hub using Azure CLI | Microsoft Docs
description: Learn how to use the Azure CLI commands to create a resource group and then create an IoT hub in the resource group. Also learn how to remove the hub.
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 08/23/2018
ms.author: robinsh
---

# Create an IoT hub using the Azure CLI

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

This article shows you how to create an IoT hub using Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

## Create an IoT Hub

Use the Azure CLI to create a resource group and then add an IoT hub.

1. When you create an IoT hub, you must create it in a resource group. Either use an existing resource group, or run the following [command to create a resource group](/cli/azure/resource):
    
   ```azurecli-interactive
   az group create --name {your resource group name} --location westus
   ```

   > [!TIP]
   > The previous example creates the resource group in the West US location. You can view a list of available locations by running this command: 
   >
   > ```azurecli-interactive
   > az account list-locations -o table
   > ```
   >

2. Run the following [command to create an IoT hub](/cli/azure/iot/hub#az_iot_hub_create) in your resource group, using a globally unique name for your IoT hub:
    
   ```azurecli-interactive
   az iot hub create --name {your iot hub name} \
      --resource-group {your resource group name} --sku S1
   ```

   [!INCLUDE [iot-hub-pii-note-naming-hub](../../includes/iot-hub-pii-note-naming-hub.md)]


The previous command creates an IoT hub in the S1 pricing tier for which you are billed. For more information, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

## Remove an IoT Hub

You can use Azure CLI to [delete an individual resource](/cli/azure/resource), such as an IoT hub, or delete a resource group and all its resources, including any IoT hubs.

To [delete an IoT hub](/cli/azure/iot/hub#az_iot_hub_delete), run the following command:

```azurecli-interactive
az iot hub delete --name {your iot hub name} -\
  -resource-group {your resource group name}
```

To [delete a resource group](/cli/azure/group#az_group_delete) and all its resources, run the following command:

```azurecli-interactive
az group delete --name {your resource group name}
```

## Next steps

To learn more about using an IoT hub, see the following articles:

* [IoT Hub developer guide](iot-hub-devguide.md)
* [Using the Azure portal to manage IoT Hub](iot-hub-create-through-portal.md)