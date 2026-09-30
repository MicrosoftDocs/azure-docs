---
title: include file
description: include file with cluster prerequisites for Ubuntu and VKS clusters
author: dominicbetts
ms.topic: include
ms.date: 06/16/2025
ms.author: dobett
ms.service: azure-iot-operations
---

* An Azure subscription with either the **Owner** role or a combination of **Contributor** and **User Access Administrator** roles. You can check your access level by navigating to your subscription, selecting **Access control (IAM)** on the left-hand side of the Azure portal, and then selecting **View my access**. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

* The Azure CLI installed on your development machine. Check [Available Azure CLI extensions](/cli/azure/azure-cli-extensions-list) for the minimum required version for the **connectedk8s** extension. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).

* The **connectedk8s** extension for the Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```azurecli
  az extension add --upgrade --name connectedk8s
  ```

* An Azure resource group. Only one Azure IoT Operations instance is supported per resource group. To create a new resource group, use the [az group create](/cli/azure/group#az-group-create) command. For the list of currently supported Azure regions, see [Supported regions](../overview-support.md#supported-regions).

   ```azurecli
   az group create --location $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
   ```
