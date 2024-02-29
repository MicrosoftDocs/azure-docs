---
title: include file
description: include file
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.topic: include
ms.date: 01/31/2023
---

In this section, you use Azure CLI to create an IoT hub and a resource group.  An Azure resource group is a logical container into which Azure resources are deployed and managed. An IoT hub acts as a central message hub for bi-directional communication between your IoT application and the devices.

If you already have an IoT hub in your Azure subscription, you can skip this section.

To create an IoT hub and a resource group:

1. Launch your CLI app. To run the CLI commands in the rest of this article, copy the command syntax, paste it into your CLI app, edit variable values, and press `Enter`.

    - If you're using Cloud Shell, select the **Try It** button on the CLI commands to launch Cloud Shell in a split browser window. Or you can open the [Cloud Shell](https://shell.azure.com/bash) in a separate browser tab.
    - If you're using Azure CLI locally, start your CLI console app and sign in to Azure CLI.

1. Run [az extension add](/cli/azure/extension#az-extension-add) to install or upgrade the *azure-iot* extension to the current version.

    ```azurecli-interactive
    az extension add --upgrade --name azure-iot
    ```

1. In your CLI app, run the [az group create](/cli/azure/group#az-group-create) command to create a resource group. The following command creates a resource group named *MyResourceGroup* in the *eastus* location.

    >[!NOTE]
    > Optionally, you can set a different location. To see available locations, run `az account list-locations`. This quickstart uses *eastus* as shown in the example command.

    ```azurecli-interactive
    az group create --name MyResourceGroup --location eastus
    ```

1. Run the [az iot hub create](/cli/azure/iot/hub#az-iot-hub-create) command to create an IoT hub. It might take a few minutes to create an IoT hub.

    *YourIotHubName*. Replace this placeholder and the surrounding braces in the following command, using the name you chose for your IoT hub. An IoT hub name must be globally unique in Azure. Use your IoT hub name in the rest of this quickstart wherever you see the placeholder.

    ```azurecli-interactive
    az iot hub create --resource-group MyResourceGroup --name {your_iot_hub_name}
    ```
