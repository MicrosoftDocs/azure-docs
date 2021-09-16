---
title: Quickstart - Create connected registry using the CLI
description: Use Azure CLI commands to create a connected registry resource.
ms.topic: quickstart
ms.date: 09/01/2021
ms.author: memladen
author: toddysm
ms.custom:
---

# Quickstart: Create a connected registry using the Azure CLI

In this quickstart, you use the Azure CLI to create a [connected registry](intro-connected-registry.md) resource in Azure. The connected registry feature of Azure Container Registry allows you to deploy a registry remotely or on your premises and synchronize images and other artifacts with the cloud registry. 

In this quickstart, you create two connected registry resources for a cloud registry: one connected registry allows read and write (artifact pull and push) functionality and one allows read-only functionality. After creating a connected registry, you can follow other quickstart guides to deploy and use it on your on-premises or remote infrastructure.

[!INCLUDE [Prepare Azure CLI environment](../../includes/azure-cli-prepare-your-environment.md)]

* Azure Container registry - If you don't already have a container registry, [create one](container-registry-get-started-azure-cli.md) (Premium tier required). 

## Enable the dedicated data endpoint for the cloud registry

Enable the dedicated data endpoint for the Azure Container Registry in the cloud by using the [az acr update][az-acr-update] command. This step is needed for a connected registry to communicate with the cloud registry, t

```azurecli
# Use the REGISTRY_NAME variable in the following Azure CLI commands to identify the cloud registry
REGISTRY_NAME=<container-registry-name>

az acr update --name $REGISTRY_NAME \
  --data-endpoint-enabled
```

[!INCLUDE [container-registry-connected-import-images](../../includes/container-registry-connected-import-images.md)]

## Create a connected registry resource for read and write functionality

Create a connected registry using the [az acr connected-registry create][az-acr-connected-registry-create] command. The connected registry name must start with a letter and contain only alphanumeric characters. It must be 5 to 40 characters long and unique in the hierarchy for this Azure container registry.

```azurecli
# Use the CONNECTED_REGISTRY_RW variable in the following Azure CLI command to identify the connected registry with read/write functionality
CONNECTED_REGISTRY_RW=<connnected-registry-name>

az acr connected-registry create --registry $REGISTRY_NAME \
  --name $CONNECTED_REGISTRY_RW \
  --repository "hello-world" "acr/connected-registry" "azureiotedge-agent" "azureiotedge-hub" "azureiotedge-api-proxy"
```

This command creates a connected registry resource named *$CONNECTED_REGISTRY_RW* and links it to the *$REGISTRY_NAME* cloud registry. In later quickstart guides, you learn about options to deploy the connected registry. 
* The specified repositories will be synchronized between the cloud regsitry and the connected registry once it is deployed. 
* Because no `--mode` option is specified for the connected registry, it is created in the default ReadWrite mode. 
* Because there is no synchronization schedule defined for this connected registry, the repositories will be synchronized between the cloud registry and the connected registry without interruptions.

  > [!IMPORTANT]
  > To support nested scenarios where lower layers have no Internet access, you must always allow synchronization of the `acr/connected-registry` repository. This repository contains the image for the connected registry runtime.

## Create a connected registry resource for read-only functionality

You can also use the [az acr connected-registry create][az-acr-connected-registry-create] command to create a connected registry with read-only functionality. 

```azurecli
# Use the CONNECTED_REGISTRY_READ variable in the following Azure CLI command to identify the connected registry with read-only functionality
CONNECTED_REGISTRY_RO=<connnected-registry-name>
az acr connected-registry create --registry $REGISTRY_NAME \
  --parent $CONNECTED_REGISTRY_RW \
  --name $CONNECTED_REGISTRY_RO \
  --repository "hello-world" "acr/connected-registry" "azureiotedge-agent" "azureiotedge-hub" "azureiotedge-api-proxy" \
  --mode ReadOnly
```

This command creates a connected registry resource named *$CONNECTED_REGISTRY_RO* in Azure and links it to the *$REGISTRY_NAME* cloud registry. 
* The specified repositories will be synchronized between the parent *$CONNECTED_REGISTRY_RW* and the connected registry once deployed.
* This resource is created in the ReadOnly mode, which enables read-only (artifact pull) functionality once deployed. 
* Because there is no synchronization schedule defined for this connected registry, the repositories will be synchronized between the cloud registry and the connected registry without interruptions.

## Verify that the resources are created

You can use the connected registry [az acr connected-registry list][az-acr-connected-registry-list] command to verify that the resources are created. 

```azurecli
az acr connected-registry list \
  --registry $REGISTRY_NAME \
  --output table
```

You should see a response as follows:

```
NAME                 MODE        CONNECTION STATE    PARENT               LOGIN SERVER    LAST SYNC (UTC)
-------------------  --------    ------------------  -------------------  --------------  -----------------
myconnectedregrw    ReadWrite    Offline
myconnectedregro    ReadOnly     Offline             myconnectedregrw
```

## Next steps

In this quickstart, you used the Azure CLI to create two connected registry resources in Azure. Those new connected registry resources are tied to your cloud registry and allow synchronization of artifacts with the cloud registry.

Continue to the connected registry deployment guides to learn how to deploy and use a connected registry on your IoT Edge infrastructure.

> [!div class="nextstepaction"]
> [Quickstart: Deploy connected registry on IoT Edge][quickstart-deploy-connected-registry-iot-edge-cli]

<!-- LINKS - internal -->
[az-acr-connected-registry-create]: /cli/azure/acr/connected-registry#az_acr_connected_registry_create
[az-acr-connected-registry-list]: /cli/azure/acr/connected-registry#az_acr_connected_registry_list
[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-update]: /cli/azure/acr#az_acr_update
[az-acr-import]: /cli/azure/acr#az_acr_import
[az-group-create]: /cli/azure/group#az_group_create
[container-registry-intro]: container-registry-intro.md
[container-registry-skus]: container-registry-skus.md
[quickstart-deploy-connected-registry-iot-edge-cli]: quickstart-deploy-connected-registry-iot-edge-cli.md