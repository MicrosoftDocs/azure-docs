---
title: Quickstart - Create connected registry using the CLI
description: Use Azure Container Registry CLI commands to create a connected registry resource.
ms.topic: quickstart
ms.date: 08/25/2021
ms.author: memladen
author: toddysm
ms.custom:
---

# Quickstart: Create a connected registry using Azure Container Registry CLI commands

In this quickstart, you use the Azure CLI to create a [connected registry](intro-connected-registry.md) resource in Azure. The connected registry feature of Azure Container Registry allows you to deploy a registry on your premises and synchronize images between the cloud and your premises. It brings the container images and OCI artifacts closer to your container workloads on premises and increases their acquisition performance.

In this quickstart, you will create two connected registry resources for an Azure container registry: one connected registry allows artifact pull and push functionality and one allows only artifact pull functionality.

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

## Create a resource group

If you don't already have a container registry, first create a resource group with the [az group create][az-group-create] command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli
az group create --name myResourceGroup --location eastus
```

## Create a container registry

Create a container registry using the [az acr create][az-acr-create] command. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. In the following example, *mycontainerregistry001* is used. Update this to a unique value.

```azurecli
az acr create --resource-group myResourceGroup \
  --name mycontainerregistry001 \
  --sku Premium
```

This example creates a *Premium* registry. Connected registries are supported only in the *Premium* tier of Azure container registry. For details on available service tiers, see [Container registry service tiers][container-registry-skus].

## Enable the dedicated data endpoint for the cloud registry

For the connected registries to communicate with the cloud registry, the dedicated data endpoint for the Azure Container Registry in the cloud should be enabled by using the [az acr update][az-acr-update] command as follows:

```azurecli
az acr update -n mycontainerregistry001 \
  --data-endpoint-enabled
```

## Import images into the container registry

This and subsequent quickstart guides use two repositories:
- `acr/connected-registry` is the repository that contains the images used to deploy the connected registry on your premises. This repository will also be synchronized to the connected registry in case you want to implement nested registries scenario.
- `hello-world` is the repository that will be synchronized to the connected registry and pulled by the connected registry clients.

The easiest way to populate those repositories is to use the `az acr import` command as follows:

```azurecli
az acr import -n mycontainerregistry001 --source mcr.microsoft.com/acr/connected-registry:0.2.0
az acr import -n mycontainerregistry001 --source mcr.microsoft.com/azureiotedge-agent:1.2
az acr import -n mycontainerregistry001 --source mcr.microsoft.com/azureiotedge-hub:1.2
az acr import -n mycontainerregistry001 --source mcr.microsoft.com/azureiotedge-api-proxy:latest
az acr import -n mycontainerregistry001 --source mcr.microsoft.com/hello-world:latest
```

## Create a connected registry resource for pull/push functionality

Create a connected registry using the [az acr connected-registry create][az-acr-connected-registry-create] command. Name must start with a letter and contain only alphanumeric characters. It must be 5 to 40 characters long and unique in the hierarchy for this Azure Container Registry.

```azurecli
az acr connected-registry create --registry mycontainerregistry001 \
  --name myconnectedregistry \
  --repository "hello-world" "acr/connected-registry" "azureiotedge-agent" "azureiotedge-hub" "azureiotedge-api-proxy"
```

The above command will create a connected registry resource in Azure and link it to the *mycontainerregistry001* cloud ACR. The *hello-world* and *acr/connected-registry* repositories will be synchronized between the cloud ACR and the registry on premises. Because no `--mode` option is specified for the connected registry, it will allow _pull_ and _push_ functionality by default. Because there is no synchronization schedule defined for this connected registry, both repositories will be synchronized between the cloud registry and the connected registry without interruptions.

  > [!IMPORTANT]
  > To support nested scenarios where lower layers have no Internet access, you must always allow synchronization of the `acr/connected-registry` repository. This repository contains the image for the connected registry runtime.

## Create a connected registry resource for pull-only functionality

You can use the connected registry [az acr connected-registry create][az-acr-connected-registry-create] command to create a connected registry with _pull_-only functionality. 

```azurecli
az acr connected-registry create --registry mycontainerregistry001 \
  --parent myconnectedregistry \
  --name myconnectedmirror \
  --repository "hello-world" "acr/connected-registry" "azureiotedge-agent" "azureiotedge-hub" "azureiotedge-api-proxy" \
  --mode mirror
```

The above command will create a connected registry resource in Azure and link it to the *mycontainerregistry001* cloud ACR. The *hello-world* repository will be synchronized between the cloud ACR and the registry on premises. This resource will be enabled for _pull_-only functionality once deployed. Because there is no synchronization schedule defined for this connected registry, both repositories will be synchronized between the cloud registry and the connected registry without interruptions.

## Verify that the resources are created

You can use the connected registry [az acr connected-registry list][az-acr-connected-registry-list] command to verify that the resources are created. 

```azurecli
az acr connected-registry list \
  --registry mycontainerregistry001 \
  --output table
```

You should see a response as follows:

```
NAME                 MODE      STATUS    PARENT    LOGIN SERVER    LAST SYNC
-------------------  --------  --------  --------  --------------  -----------
myconnectedregistry  registry
myconnectedmirror    mirror
```

## Next steps

In this quickstart, you used Azure CLI to create a connected registry resources in Azure. Those new connected registry resources are tied to your Azure Container Registry and allow synchronization of artifact between the cloud registry and the on-premises registry. Continue to the connected registry deployment guides to learn how to deploy the connected registry on your on-premises infrastructure.

> [Quickstart: Deploy connected registry on IoT Edge][quickstart-deploy-connected-registry-iot-edge-cli]

<!-- LINKS - internal -->
[az-acr-connected-registry-create]: /cli/azure/acr/connected-registry#az_acr_connected_registry_create
[az-acr-connected-registry-list]: https://docs.microsoft.com/cli/azure/acr/connected-registry?view=azure-cli-latest#az_acr_connected_registry_list
[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-update]: /cli/azure/acr#az_acr_update
[az-group-create]: /cli/azure/group#az_group_create
[container-registry-intro]: https://docs.microsoft.com/azure/container-registry/container-registry-intro
[container-registry-skus]: container-registry-skus.md
[quickstart-deploy-connected-registry-iot-edge-cli]: quickstart-deploy-connected-registry-iot-edge-cli.md