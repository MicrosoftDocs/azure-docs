---
title: Create message schemas
description: Learn how to install schema registry on your cluster and create message schemas to use with dataflows.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.date: 08/03/2024

#CustomerIntent: As an operator, I want to understand how I can use message schemas to filter and transform messages.
---

# Create message schemas

Use schema registry to store and synchronize message schemas across the cloud and edge. Dataflows and other edge services use message schemas to filter and transform messages as they're routed across your industrial edge scenario.

## Create schema registry resources in Azure

1. Create a storage account with hierarchical namespace enabled.

   ```azurecli-interactive
   az storage account create -n <STORAGE_ACCOUNT_NAME> -g <RESOURCE_GROUP> --enable-hierarchical-namespace --sku Standard_LRS
   ```

1. Create a schema registry resource.

   ```azurecli-interactive
   az iot ops schema registry create -n <SCHEMA_REGISTRY_NAME> --sa-resource-id <STORAGE_ACCOUNT_RESOURCE_ID> --registry-namespace <SCHEMA_REGISTRY_NAME> -g <RESOURCE_GROUP>
   ```

## Install schema registry on your cluster

1. Install schema registry as part of Azure IoT Operations by using the `--sr-resource-id` parameter in the `az iot ops init` command. For example:

   ```azurecli
   az iot ops init --cluster <CLUSTER_NAME> -g <RESOURCE_GROUP> --sr-resource-id <SCHEMA_REGISTRY_RESOURCE_ID> -n <INSTANCE_NAME> --add-insecure-listener true
   ```

1. Verify that schema registry pods are running by using the `kubectl get pods` command.

   ```bash
   kubectl get pods -n azure-iot-operations
   ```

## Upload message schemas in the operations experience

TODO