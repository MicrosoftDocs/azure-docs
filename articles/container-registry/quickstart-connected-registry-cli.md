---
title: Quickstart - Create connected registry using the CLI
description: Use Azure Container Registry CLI commands to create a connected registry resource.
ms.topic: quickstart
ms.date: 08/26/2021
ms.author: memladen
author: toddysm
ms.custom:
---

# Quickstart: Create a connected registry using Azure Container Registry CLI commands

In this quickstart, you use the Azure CLI to create a [connected registry](intro-connected-registry.md) resource in Azure. The connected registry feature of Azure Container Registry allows you to deploy a registry on your premises and synchronize images between the cloud and your premises. It brings the container images and OCI artifacts closer to your container workloads on-premises and speed up access to registry artifacts.

In this quickstart, you will create two connected registry resources for an Azure container registry: one connected registry allows artifact pull and push functionality and one allows only artifact pull functionality.

[!INCLUDE [Prepare Azure CLI environment](../../includes/azure-cli-prepare-your-environment.md)]

* **Container registry** - f you don't already have a container registry, [create one](container-registry-get-started-azure-cli.md) (Premium tier required). In the command examples in this article, this registry is named *$REGISTRY_NAME*.

## Enable the dedicated data endpoint for the cloud registry

For the connected registries to communicate with the cloud registry, the dedicated data endpoint for the Azure Container Registry in the cloud should be enabled by using the [az acr update][az-acr-update] command.

```azurecli
# Use the following variable in Azure CLI commands
REGISTRY_NAME=<container-registry-name>

az acr update --name $REGISTRY_NAME \
  --data-endpoint-enabled
```

## Import images into the container registry

This and subsequent quickstart guides use two repositories in the registry:
- `acr/connected-registry` - Images used to deploy the connected registry on your premises. This repository will also be synchronized to the connected registry in case you want to implement a nested registries scenario.
- `hello-world` - Sample image that will be synchronized to the connected registry and pulled by the connected registry clients.

The easiest way to populate those repositories is to use the [az acr import][az-acr-import] command as follows:

```azurecli
az acr import --name $REGISTRY_NAME \
  --source mcr.microsoft.com/acr/connected-registry:0.2.0
az acr import --name $REGISTRY_NAME \
  --source mcr.microsoft.com/azureiotedge-agent:1.2
az acr import --name $REGISTRY_NAME \
  --source mcr.microsoft.com/azureiotedge-hub:1.2
az acr import --name $REGISTRY_NAME \
  --source mcr.microsoft.com/azureiotedge-api-proxy:latest
az acr import --name $REGISTRY_NAME \
  --source mcr.microsoft.com/hello-world:latest
```

## Create a connected registry resource for pull and push functionality

Create a connected registry using the [az acr connected-registry create][az-acr-connected-registry-create] command. Name must start with a letter and contain only alphanumeric characters. It must be 5 to 40 characters long and unique in the hierarchy for this Azure container registry.

```azurecli
az acr connected-registry create --registry $REGISTRY_NAME \
  --name myconnectedregistry \
  --repository "hello-world" "acr/connected-registry" "azureiotedge-agent" "azureiotedge-hub" "azureiotedge-api-proxy"
```

This command creates a connected registry resource in Azure and links it to the *$REGISTRY_NAME* cloud registry. 
* The *hello-world* and *acr/connected-registry* repositories will be synchronized between the cloud ACR and the registry on-premises. 
* Because no `--mode` option is specified for the connected registry, it allows both pull and push functionality by default. 
* Because there is no synchronization schedule defined for this connected registry, both repositories will be synchronized between the cloud registry and the connected registry without interruptions.

  > [!IMPORTANT]
  > To support nested scenarios where lower layers have no Internet access, you must always allow synchronization of the `acr/connected-registry` repository. This repository contains the image for the connected registry runtime.

## Create a connected registry resource for pull-only functionality

You can use the connected registry [az acr connected-registry create][az-acr-connected-registry-create] command to create a connected registry with _pull_-only functionality. 

```azurecli
az acr connected-registry create --registry $REGISTRY_NAME \
  --parent myconnectedregistry \
  --name myconnectedmirror \
  --repository "hello-world" "acr/connected-registry" "azureiotedge-agent" "azureiotedge-hub" "azureiotedge-api-proxy" \
  --mode mirror
```

This command creates a connected registry resource in Azure and links it to the *$REGISTRY_NAME* cloud registry. 
* The *hello-world* repository will be synchronized between the cloud ACR and the registry on-premises.
* This resource will be enabled for pull-only functionality once deployed. 
* Because there is no synchronization schedule defined for this connected registry, both repositories will be synchronized between the cloud registry and the connected registry without interruptions.

## Verify that the resources are created

You can use the connected registry [az acr connected-registry list][az-acr-connected-registry-list] command to verify that the resources are created. 

```azurecli
az acr connected-registry list \
  --registry $REGISTRY_NAME \
  --output table
```

You should see a response as follows:

```
NAME                 MODE      CONNECTION STATE    PARENT               LOGIN SERVER    LAST SYNC (UTC)
-------------------  --------  ------------------  -------------------  --------------  -----------------
myconnectedregistry  Registry  Offline
myconnectedmirror    Mirror    Offline             myconnectedregistry
```

## Next steps

In this quickstart, you used the Azure CLI to create two connected registry resources in Azure. Those new connected registry resources are tied to your cloud registry and allow synchronization of artifacts between the cloud registry and the on-premises registry. Continue to the connected registry deployment guides to learn how to deploy and use a 

connected registry on your on-premises infrastructure.

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