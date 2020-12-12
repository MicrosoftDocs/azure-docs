---
title: Quickstart - Create connected registry using the CLI
description: Use Azure Container Registry CLI commands to create a connected registry resource.
ms.topic: quickstart
ms.date: 12/03/2020
ms.author: memladen
author: toddysm
ms.custom:
---

# Quickstart: Create a connected registry using Azure Container Registry CLI commands

In this quickstart, you use [Azure Container Registry][container-registry-intro] commands to create a connected registry resource in Azure. You can review the [ACR connected registry introduction](intro-connected-registry.md) for details about the connected registry feature of Azure Container Registry. 

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

## Create a resource group

If you don't already have a container registry, first create a resource group with the [az group create][az-group-create] command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create a container registry

Create a container registry using the [az acr create][az-acr-create] command. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. In the following example, *mycontainerregistry001* is used. Update this to a unique value.

```azurecli-interactive
az acr create --resource-group myResourceGroup \
  --name mycontainerregistry001 \
  --sku Basic
```

This example creates a *Basic* registry, a cost-optimized option for developers learning about Azure Container Registry. For details on available service tiers, see [Container registry service tiers][container-registry-skus].

## Create a connected registry resource for pull/push functionality

Create a connected registry using the [az acr connected-registry create][az-acr-connected-registry-create] command. Name must start with a letter and contain only alphanumeric characters. It must be 5 to 40 chars long and unique in the hierarchy for this Azure Container Registry.

```azurecli-interactive
az acr connected-registry create --registry mycontainerregistry001 \
  --name myconnectedregistry \
  --repository "hello-world" "acr/connected-registry"
```

The above command will create a connected registry resource in Azure and link it to the *mycontainerregistry001* cloud ACR. The *hello-world* and *acr/connected-registry* repositories will be synchronized between the cloud ACR and the registry on premises. Because no `--mode` option is specified for the connected registry, it will allow _pull_ and _push_ functionality by default.

  > [!IMPORTANT]
  > To support nested scenarios where lower leyers have no Internet access, you must always allow synchronization of the `acr/connected-registry` repository. This repository contains the image for the connected registry runtime.

## Create a connected registry resource for pull-only functionality

You can use the connected registry [az acr connected-registry create][az-acr-connected-registry-create] command to create a connected registry with _pull_-only functionality. 

```azurecli-interactive
az acr connected-registry create --registry mycontainerregistry001 \
  --name myconnectedmirror \
  --repository "hello-world" \
  --mode mirror
```

The above command will create a connected registry resource in Azure and link it to the *mycontainerregistry001* cloud ACR. The *hello-world* repository will be synchronized between the cloud ACR and the registry on premises. This resource will be enabled for _pull_-only functionality once deployed.

## Verify that the resources are created

You can use the connected registry [az acr connected-registry list][az-acr-connected-registry-list] command to verify that the resources are created. 

```azurecli-interactive
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

## Troubleshooting

This section helps you troubleshoot problems you might encounter when creating connected registry resource.

### Symptoms

May include one or more of the following:

- Unable to create connected registry resource and you receive error `The registry must have data endpoint enabled.`

### Causes

- The data end point for the Azure Container Registry in the cloud does not have the data endpoint enabled.

### Potential solutions

#### Enable the data endpoint for the cloud registry

The data endpoint for the Azure Container Registry in the cloud should be  enabled by [az acr connected registry create][az-acr-connected-registry-create] command. If this doesn't happen, you can manually enable it by issuing the following command:

```azurecli-interactive
az acr update -n mycontainerregistry001 \
  --data-endpoint-enabled
```

## Next steps

In this quickstart, you used Azure CLI to create a connected registry resources in Azure. Those new connected registry resources are tied to your Azure Container Registry and allow synchronization of artifact between the cloud registry and the on-premises registry. Continue to the connected registry deployment guides to learn how to deploy the connected registry on your on-premises infrastructure.

> [!div class="nextstepaction"]
> [Quickstart: Deploy connected registry on IoT Edge][quickstart-deploy-connected-registry-iot-edge]

> [!div class="nextstepaction"]
> [Quickstart: Deploy connected registry on Azure Arc][quickstart-deploy-connected-registry-azure-arc]

<!-- LINKS - internal -->
[az-acr-connected-registry-create]: /cli/azure/acr#az-acr-connected-registry-create
[az-acr-connected-registry-list]: /cli/azure/acr#az-acr-connected-registry-list
[az-acr-create]: /cli/azure/acr#az-acr-create
[az-group-create]: /cli/azure/group#az-group-create
[container-registry-intro]: container-registry-intro.md
[container-registry-skus]: container-registry-skus.md
[quickstart-deploy-connected-registry-azure-arc]: quickstart-deploy-connected-registry-azure-arc.md
[quickstart-deploy-connected-registry-iot-edge-cli]: quickstart-deploy-connected-registry-iot-edge.md