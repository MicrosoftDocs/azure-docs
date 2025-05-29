---
title: include file
description: include file
author: asergaz
ms.topic: include
ms.date: 05/29/2025
ms.author: sergaz
---

1. Create an Azure resource group. Only one Azure IoT Operations instance is supported per resource group. To create a new resource group, use the [az group create](/cli/azure/group#az-group-create) command. For the list of currently supported Azure regions, see [Supported regions](../overview-iot-operations.md#supported-regions).

   ```azurecli
   az group create --location <REGION> --resource-group <RESOURCE_GROUP> --subscription <SUBSCRIPTION_ID>
   ```

1. Follow the instructions in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md#arc-enable-your-cluster) to arc-enable your cluster in Ubuntu. 

1. Follow the instructions in [Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-deploy-iot-operations.md) to deploy Azure IoT Operations to your cluster.

> [!NOTE]
> You can start with test settings, and then [enable secure settings](../deploy-iot-ops/howto-enable-secure-settings.md) later.