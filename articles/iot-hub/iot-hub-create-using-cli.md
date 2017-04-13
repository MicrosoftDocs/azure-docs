---
title: Create an IoT Hub using Azure CLI (az.py) | Microsoft Docs
description: How to create an Azure IoT hub using the cross-platform Azure CLI 2.0 (az.py).
services: iot-hub
documentationcenter: .net
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 
ms.service: iot-hub
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/23/2017
ms.author: dobett

---
# Create an IoT hub using the Azure CLI 2.0

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

## Introduction

You can use Azure CLI 2.0 (az.py) to create and manage Azure IoT hubs programmatically. This article shows you how to use the Azure CLI 2.0 (az.py) to create an IoT hub.

You can complete the task using one of the following CLI versions:

* [Azure CLI (azure.js)](iot-hub-create-using-cli-nodejs.md) – the CLI for the classic and resource management deployment models.
* Azure CLI 2.0 (az.py) - the next generation CLI for the resource management deployment model as described in this article.

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.
* [Azure CLI 2.0][lnk-CLI-install].

## Sign in and set your Azure account

Sign in to your Azure account and select your subscription.

1. At the command prompt, run the [login command][lnk-login-command]:
    
    ```azurecli
    az login
    ```

    Follow the instructions to authenticate using the code and sign in to your Azure account through a web browser.

2. If you have multiple Azure subscriptions, signing in to Azure grants you access to all the Azure accounts associated with your credentials. Use the following [command to list the Azure accounts][lnk-az-account-command] available for you to use:
    
    ```azurecli
    az account list 
    ```

    Use the following command to select subscription that you want to use to run the commands to create your IoT hub. You can use either the subscription name or ID from the output of the previous command:

    ```azurecli
    az account set --subscription {your subscription name or id}
    ```

## Create an IoT Hub

Use the Azure CLI to create a resource group and then add an IoT hub.

1. When you create an IoT hub, you must create it in a resource group. Either use an existing resource group, or run the following [command to create a resource group][lnk-az-resource-command]:
    
    ```azurecli
     az group create --name {your resource group name} --location westus
    ```

    > [!TIP]
    > The previous example creates the resource group in the West US location. You can view a list of available locations by running the command `az account list-locations -o table`.
    >
    >

2. Run the following [command to create an IoT hub][lnk-az-iot-command] in your resource group:
    
    ```azurecli
    az iot hub create --name {your iot hub name} --resource-group {your resource group name} --sku S1
    ```

> [!NOTE]
> The name of your IoT hub must be globally unique. The previous command creates an IoT hub in the S1 pricing tier for which you are billed. For more information, see [Azure IoT Hub pricing][lnk-iot-pricing].
>
>

## Remove an IoT Hub

You can use the Azure CLI to [delete an individual resource][lnk-az-resource-command], such as an IoT hub, or delete a resource group and all its resources, including any IoT hubs.

To delete an IoT hub, run the following command:

```azurecli
az iot hub delete --name {your iot hub name} --resource-group {your resource group name}
```

To delete a resource group and all its resources, run the following command:

```azurecli
az group delete --name {your resource group name}
```

## Next steps
To learn more about developing for IoT Hub, see the following articles:

* [IoT Hub developer guide][lnk-devguide]

To further explore the capabilities of IoT Hub, see:

* [Using the Azure portal to manage IoT Hub][lnk-portal]

<!-- Links -->
[lnk-free-trial]: https://azure.microsoft.com/pricing/free-trial/
[lnk-CLI-install]: https://docs.microsoft.com/cli/azure/install-az-cli2
[lnk-login-command]: https://docs.microsoft.com/cli/azure/get-started-with-az-cli2
[lnk-az-account-command]: https://docs.microsoft.com/cli/azure/account
[lnk-az-register-command]: https://docs.microsoft.com/cli/azure/provider
[lnk-az-addcomponent-command]: https://docs.microsoft.com/cli/azure/component
[lnk-az-resource-command]: https://docs.microsoft.com/cli/azure/resource
[lnk-az-iot-command]: https://docs.microsoft.com/cli/azure/iot
[lnk-iot-pricing]: https://azure.microsoft.com/pricing/details/iot-hub/
[lnk-devguide]: iot-hub-devguide.md
[lnk-portal]: iot-hub-create-through-portal.md 
