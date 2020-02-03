---
title: Manage IoT Central from Azure CLI | Microsoft Docs
description: This article describes how to create and manage your IoT Central application using CLI. You can view, modify and remove the application using CLI.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 08/23/2019
ms.topic: conceptual
manager: philmea
---

# Manage IoT Central from Azure CLI

[!INCLUDE [iot-central-selector-manage](../../../includes/iot-central-selector-manage.md)]

Instead of creating and managing IoT Central applications on the [Azure IoT Central application manager](https://aka.ms/iotcentral) website, you can use [Azure CLI](/cli/azure/) to manage your applications.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

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
  --sku ST1 --template "iotc-demo@1.0.0" \
  --display-name "My Custom Display Name"
```

These commands first create a resource group in the east US location for the application. The following table describes the parameters used with the **az iotcentral app create** command:

| Parameter         | Description |
| ----------------- | ----------- |
| resource-group    | The resource group that contains the application. This resource group must already exist in your subscription. |
| location          | By default, this command uses the location from the resource group. Currently, you can create an IoT Central application in the **United States**, **Australia**, **Asia Pacific**, or in the **Europe** locations. |
| name              | The name of the application in the Azure portal. |
| subdomain         | The subdomain in the URL of the application. In the example, the application URL is https://mysubdomain.azureiotcentral.com. |
| sku               | Currently, you can use either **ST1** or **ST2**. See [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). |
| template          | The application template to use. For more information, see the following table: |
| display-name      | The name of the application as displayed in the UI. |

**Application template with generally available features**

| Template name            | Description |
| ------------------------ | ----------- |
| iotc-default@1.0.0       | Creates an empty application for you to populate with your own device templates and devices.


**Application templates with public preview features**

| Template name            | Description |
| ------------------------ | ----------- |
| iotc-pnp-preview@1.0.0   | Creates an empty plug and play preview application for you to populate with your own device templates and devices. |
| iotc-condition@1.0.0     | Creates an application with a in-store analytics – condition monitoring template. Use this template to connect and monitor store environment. |
| iotc-consumption@1.0.0   | Creates an application with water consumption monitoring template. Use this template to monitor and control water flow. |
| iotc-distribution@1.0.0  | Creates an application with a Digital distribution template. Use this template to improve warehouse output efficiency by digitalizing key assets and actions. |
| iotc-inventory@1.0.0     | Creates an application with a smart inventory management template. Use this template to automate receiving, product movement, cycle counting, and tracking of sensors. |
| iotc-logistics@1.0.0     | Creates an application with a Connected logistics template. Use this template to track your shipment in real-time across air, water and land with location and condition monitoring. |
| iotc-meter@1.0.0         | Creates an application with smart meter monitoring template. Use this template to monitor energy consumption, network status, and identify trends to improve customer support and smart meter management.  |
| iotc-patient@1.0.0       | Creates an application with continuous patient monitoring template. Use this template to extend patient care, re-admissions, and manage diseases. |
| iotc-power@1.0.0         | Creates an application with solar panel monitoring template. Use this template to monitor solar panel status, energy generation trends. |
| iotc-quality@1.0.0       | Creates an application with water quality monitoring template. Use this template to digitally monitor water quality.|
| iotc-store@1.0.0         | Creates an application with a in-store analytics – checkout template. Use this template to monitor and manage the checkout flow inside your store. |
| iotc-waste@1.0.0         | Creates an application with a Connected waste management template. Use this template to monitor waste bins and dispatch field operators. |

> [!NOTE]
> The preview application templates are currently only available in the **Europe** and **United States** locations.

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
