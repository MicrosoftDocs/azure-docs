---
title: Manage IoT Central from Azure CLI | Microsoft Docs
description: Manage IoT Central from Azure CLI.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 02/07/2019
ms.topic: conceptual
manager: philmea
---

# Manage IoT Central from Azure CLI

[!INCLUDE [iot-central-selector-manage](../../includes/iot-central-selector-manage.md)]

Instead of creating and managing IoT Central applications from the IoT Central [Application Manager](https://aka.ms/iotcentral) page, you can use [Azure CLI](/cli/azure/) to manage your applications.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you prefer to run Azure CLI on your local machine, see [Install the Azure CLI](/cli/azure/install-azure-cli). When you run Azure CLI locally, use the **az login** command to sign in to Azure before you try the commands in this article.

## Create an application

Use the [az iotcentral app create](/cli/azure/iotcentral/app#az-iotcentral-app-create) command to create an IoT Central application in your Azure subscription. For example:

```azurecli-interactive
# Create a resource group for the IoT Central application
az group create --location "East US" \
    --name "MyIoTCentralResourceGroup"
```

```azurecli-interactive
# Create an IoT Central application
az iotcentral app create \
  --resource-group "MyIoTCentralResourceGroup" \
  --name "myiotcentralapp" --subdomain "mysubdomain" \
  --sku S1 --template "iotc-demo@1.0.0" \
  --display-name "My Custom Display Name"
```

These commands first create a resource group in the east US region for the application. The following table describes the parameters used with the **az iotcentral app create** command:

| Parameter         | Description |
| ----------------- | ----------- |
| resource-group    | The resource group that contains the application. This resource group must already exist in your subscription. |
| location          | By default, this command uses the location from the resource group. Currently, you can create an IoT Central application in the **East US**, **West US**, **North Europe**, or **West Europe** regions. |
| name              | The name of the application in the Azure portal. |
| subdomain         | The subdomain in the URL of the application. In the example, the application URL is https://mysubdomain.azureiotcentral.com. |
| sku               | Currently, the only value is **S1** (standard tier). See [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). |
| template          | The application template to use. For more information, see the following table: |
| display-name      | The name of the application as displayed in the UI. |

**Application templates**

| Template name            | Description |
| ------------------------ | ----------- |
| iotc-default@1.0.0       | Creates an empty application for you to populate with your own device templates and devices. |
| iotc-demo@1.0.0          | Creates an application that includes a device template already created for a Refrigerated Vending Machine. Use this template to get started exploring Azure IoT Central. |
| iotc-devkit-sample@1.0.0 | Creates an application with device templates ready for you to connect an MXChip or Raspberry Pi device. Use this template if you're a device developer experimenting with any of these devices. |

## View your applications

Use the [az iotcentral app list](/cli/azure/iotcentral/app#az-iotcentral-app-list) command to list your IoT Central applications and view metadata.

## Modify an application

Use the [az iotcentral app update](/cli/azure/iotcentral/app#az-iotcentral-app-update) command to update the metadata of an IoT Central application. For example, to change the display name of your application:

```azurecli-interactive
az iotcentral app update --name myiotcentralapp \
  --resource-group MyIoTCentralResourceGroup \
  --set displayName="My new display name"
```

## Remove an application

Use the [az iotcentral app delete](/cli/azure/iotcentral/app#az-iotcentral-app-delete) command to delete an IoT Central application. For example:

```azurecli-interactive
az iotcentral app delete --name myiotcentralapp \
  --resource-group MyIoTCentralResourceGroup
```

## Next steps

Now that you've learned how to manage Azure IoT Central applications from Azure CLI, here is the suggested next step:

> [!div class="nextstepaction"]
> [Administer your application](howto-administer.md)
