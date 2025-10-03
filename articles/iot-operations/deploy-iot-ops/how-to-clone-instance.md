---
title: Clone an IoT Operations instance
description: Use the Azure CLI or Azure portal to clone your Azure IoT Operations instances.
author: SoniaLopezBravo
ms.author: sonialopez
ms.topic: how-to
ms.date: 10/02/2025
ms.custom:
  - devx-track-azurecli
  - sfi-image-nochange

#CustomerIntent: As an IT professional, I want to know how to clone an IoT Operations instance so that I can create a copy of my existing instance for testing or backup purposes.
---

# Clone an IoT Operations instance (preview)

You can clone an existing Azure IoT Operations instance to create a new instance with the same configuration and settings. Cloning is useful for creating a backup of your instance or for setting up a new instance with the same configuration for testing or development purposes.

> [!NOTE]
> The clone feature is in preview and under development.

## Prerequisites

* An Azure IoT Operations instance deployed to a cluster. For more information, see [Deploy Azure IoT Operations](./howto-deploy-iot-operations.md).

* Azure CLI installed on your development machine. This scenario requires Azure CLI version 2.53.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

* The Azure IoT Operations extension for Azure CLI. Clone is currently compatible with the following IoT Operations instance version range: `1.0.34>=,<1.2.0`. Use the following command to add the extension or update it if you already have it installed:

    ```azurecli
    az extension add --upgrade --name azure-iot-ops --version <VERSION_NUMBER>
    ```

### Clone instance 


Currently, the Azure portal doesn't support cloning an Azure IoT Operations instance. You can use the Azure CLI to clone an instance.

Use the [`az iot ops clone`](/cli/azure/iot/ops#az-iot-ops-clone) command to create a new Azure IoT Operations instance based on an existing one. You can apply the output of clone to another connected cluster, which is referred to as replication. You can also save the clone to a local directory for later use and perform some configuration changes before applying it to a cluster.


To clone an instance to another cluster, run:

```azurecli
az iot ops clone --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --to-cluster-id <CLUSTER_ID> 
```

To customize the replication to another cluster, use `--param` and specify the parameters you want to change in the format `key=value`. For example, to change the location of the cloned instance, run:

```azurecli
az iot ops clone --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --to-cluster-id <CLUSTER_ID> --param location=eastus
```

To clone an instance to a local directory, run:

```azurecli
az iot ops clone --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --to-dir <DIRECTORY>
```

> [!TIP]
> To clone an instance to the current directory, run `--to-dir .`

To clone an instance to a cluster, but splitting and serially applying asset related sub-deployments, run:

```azurecli
az iot ops clone --name <INSTANCE_NAME> --resource-group <RESOURCE_GROUP> --to-cluster-id <CLUSTER_ID> --mode linked
```
