---
title: include file
description: include file with cluster prerequisites for Ubuntu and Tanzu
author: dominicbetts
ms.topic: include
ms.date: 06/16/2025
ms.author: dobett
---

* An Azure subscription with either the **Owner** role or a combination of **Contributor** and **User Access Administrator** roles. You can check your access level by navigating to your subscription, selecting **Access control (IAM)** on the left-hand side of the Azure portal, and then selecting **View my access**. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* An Azure resource group. Only one Azure IoT Operations instance is supported per resource group. To create a new resource group, use the [az group create](/cli/azure/group#az-group-create) command. For the list of currently supported Azure regions, see [Supported regions](../overview-iot-operations.md#supported-regions).

   ```azurecli
   az group create --location <REGION> --resource-group <RESOURCE_GROUP> --subscription <SUBSCRIPTION_ID>
   ```

* Azure CLI version 2.62.0 or newer installed on your cluster machine. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

* The latest version of the **connectedk8s** extension for Azure CLI:

  ```bash
  az extension add --upgrade --name connectedk8s
  ```