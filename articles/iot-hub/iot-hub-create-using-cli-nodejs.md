---
title: Create an IoT hub using Azure CLI (azure.js) | Microsoft Docs
description: How to create an Azure IoT hub using the cross-platform Azure CLI (azure.js).
services: iot-hub
documentationcenter: .net
author: BeatriceOltean
manager: timlt
editor: ''

ms.assetid: 46a17831-650c-41d9-b228-445c5bb423d3
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/04/2017
ms.author: boltean

---
# Create an IoT hub using the Azure CLI

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

## Introduction

You can use Azure CLI (azure.js) to create and manage Azure IoT hubs programmatically. This article shows you how to use the Azure CLI (azure.js) to create an IoT hub.

You can complete the task using one of the following CLI versions:

* Azure CLI (azure.js) – the CLI for the classic and resource management deployment models as described in this article.
* [Azure CLI 2.0 (az.py)](iot-hub-create-using-cli.md) - the next generation CLI for the resource management deployment model.

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.
* [Azure CLI 0.10.4][lnk-CLI-install] or later. If you already have the Azure CLI installed, you can validate the current version at the command prompt with the following command:

```azurecli
azure --version
```

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Azure Resource Manager and classic](../azure-resource-manager/resource-manager-deployment-model.md). The Azure CLI must be in Azure Resource Manager mode:
>
> ```azurecli
> azure config mode arm
> ```

## Set your Azure account and subscription

1. At the command prompt, login by typing the following command:

   ```azurecli
    azure login
   ```

   Use the suggested web browser and code to authenticate.
1. If you have multiple Azure subscriptions, connecting to Azure grants you access to all the Azure subscriptions associated with your credentials. You can view the Azure subscriptions, and identify which one is the default, using the command:

   ```azurecli
    azure account list
   ```

   To set the subscription context under which you want to run the rest of the commands use:

   ```azurecli
    azure account set <subscription name>
   ```

1. If you do not have a resource group, you can create one named **exampleResourceGroup**:

   ```azurecli
    azure group create -n exampleResourceGroup -l westus
   ```

> [!TIP]
> The article [Use the Azure CLI to manage Azure resources and resource groups][lnk-CLI-arm] provides more information about how to use the Azure CLI to manage Azure resources.

## Create an IoT Hub

Required parameters:

```azurecli
azure iothub create -g <resource-group> -n <name> -l <location> -s <sku-name> -u <units>
```

* **resource-group**. The resource group name. The format is case insensitive alphanumeric, underscore, and hyphen, 1-64 length.
* **name**. The name of the IoT hub to be created. The format is case insensitive alphanumeric, underscore, and hyphen, 3-50 length.
* **location**. The location (azure region/datacenter) to provision the IoT hub.
* **sku-name**. The name of the sku, one of: [F1, S1, S2, S3]. For the latest full list, refer to the pricing page for IoT Hub.
* **units**. The number of provisioned units. Range: F1 [1-1] : S1, S2 [1-200] : S3 [1-10]. IoT Hub units are based on your total message count and the number of devices you want to connect.

To see all the parameters available for creation, you can use the help command in command prompt:

```azurecli
azure iothub create -h
```

Quick example: To create an IoT Hub called **exampleIoTHubName** in the resource group **exampleResourceGroup**, run the following command:

```azurecli
azure iothub create -g exampleResourceGroup -n exampleIoTHubName -l westus -k s1 -u 1
```

> [!NOTE]
> This Azure CLI command creates an S1 Standard IoT Hub for which you are billed. You can delete the IoT hub **exampleIoTHubName** using following command:
>
> ```azurecli
> azure iothub delete -g exampleResourceGroup -n exampleIoTHubName
> ```

## Next steps

To learn more about developing for IoT Hub, see the following article:

* [IoT SDKs][lnk-sdks]

To further explore the capabilities of IoT Hub, see:

* [Using the Azure portal to manage IoT Hub][lnk-portal]

<!-- Links -->
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-azure-portal]: https://portal.azure.com/
[lnk-status]: https://azure.microsoft.com/status/
[lnk-CLI-install]:../cli-install-nodejs.md
[lnk-rest-api]: https://docs.microsoft.com/rest/api/iothub/iothubresource
[lnk-CLI-arm]: ../azure-resource-manager/xplat-cli-azure-resource-manager.md

[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-portal]: iot-hub-create-through-portal.md 
