---
title: Manage IoT Central from Azure CLI | Microsoft Docs
description: This article describes how to create and manage your IoT Central application using CLI. You can view, modify, and remove the application using CLI.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 03/27/2020
ms.topic: how-to 
ms.custom: devx-track-azurecli
manager: philmea
---

# Manage IoT Central from Azure CLI

[!INCLUDE [iot-central-selector-manage](../../../includes/iot-central-selector-manage.md)]

Instead of creating and managing IoT Central applications on the [Azure IoT Central application manager](https://aka.ms/iotcentral) website, you can use [Azure CLI](/cli/azure/) to manage your applications.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

 - If you need to run your CLI commands in a different Azure subscription, see [Change the active subscription](/cli/azure/manage-azure-subscriptions-azure-cli#change-the-active-subscription).

## Create an application

[!INCLUDE [Warning About Access Required](../../../includes/iot-central-warning-contribitorrequireaccess.md)]

Use the [az iot central app create](/cli/azure/iot/central/app#az_iot_central_app_create) command to create an IoT Central application in your Azure subscription. For example:

```azurecli-interactive
# Create a resource group for the IoT Central application
az group create --location "East US" \
    --name "MyIoTCentralResourceGroup"
```

```azurecli-interactive
# Create an IoT Central application
az iot central app create \
  --resource-group "MyIoTCentralResourceGroup" \
  --name "myiotcentralapp" --subdomain "mysubdomain" \
  --sku ST1 --template "iotc-pnp-preview" \
  --display-name "My Custom Display Name"
```

These commands first create a resource group in the east US region for the application. The following table describes the parameters used with the **az iot central app create** command:

| Parameter         | Description |
| ----------------- | ----------- |
| resource-group    | The resource group that contains the application. This resource group must already exist in your subscription. |
| location          | By default, this command uses the location from the resource group. Currently, you can create an IoT Central application in the **Australia**, **Asia Pacific**, **Europe**, **United States**, **United Kingdom**, and **Japan** geographies. |
| name              | The name of the application in the Azure portal. |
| subdomain         | The subdomain in the URL of the application. In the example, the application URL is `https://mysubdomain.azureiotcentral.com`. |
| sku               | Currently, you can use either **ST1** or **ST2**. See [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). |
| template          | The application template to use. For more information, see the following table. |
| display-name      | The name of the application as displayed in the UI. |

[!INCLUDE [iot-central-template-list](../../../includes/iot-central-template-list.md)]

## View your applications

Use the [az iot central app list](/cli/azure/iot/central/app#az_iot_central_app_list) command to list your IoT Central applications and view metadata.

## Modify an application

Use the [az iot central app update](/cli/azure/iot/central/app#az_iot_central_app_update) command to update the metadata of an IoT Central application. For example, to change the display name of your application:

```azurecli-interactive
az iot central app update --name myiotcentralapp \
  --resource-group MyIoTCentralResourceGroup \
  --set displayName="My new display name"
```

## Remove an application

Use the [az iot central app delete](/cli/azure/iot/central/app#az_iot_central_app_delete) command to delete an IoT Central application. For example:

```azurecli-interactive
az iot central app delete --name myiotcentralapp \
  --resource-group MyIoTCentralResourceGroup
```

## Next steps

Now that you've learned how to manage Azure IoT Central applications from Azure CLI, here is the suggested next step:

> [!div class="nextstepaction"]
> [Administer your application](howto-administer.md)
