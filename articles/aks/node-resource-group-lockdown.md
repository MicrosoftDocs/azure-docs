---
title: Deploy a fully managed resource group with node resource group lockdown (preview) in Azure Kubernetes Service (AKS)
description: Learn how to deploy a fully managed resource group using node resource group lockdown (preview) in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: azure-kubernetes-service
ms.date: 04/16/2024
ms.author: schaffererin
author: schaffererin
---

# Deploy a fully managed resource group using node resource group lockdown (preview) in Azure Kubernetes Service (AKS)

AKS deploys infrastructure into your subscription for connecting to and running your applications. Changes made directly to resources in the [node resource group][whatis-nrg] can affect cluster operations or cause future issues. For example, scaling, storage, or network configurations should be made through the Kubernetes API and not directly on these resources.

To prevent changes from being made to the node resource group, you can apply a deny assignment and block users from modifying resources created as part of the AKS cluster.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

Before you begin, you need the following resources installed and configured:

* The Azure CLI version 2.44.0 or later. Run `az --version` to find the current version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].
* The `aks-preview` extension version 0.5.126 or later.
* The `NRGLockdownPreview` feature flag registered on your subscription.

### Install the `aks-preview` CLI extension

Install or update the `aks-preview` extension using the [`az extension add`][az-extension-add] or the [`az extension update`][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update to the latest version of the aks-preview extension
az extension update --name aks-preview
```

### Register the `NRGLockdownPreview` feature flag

1. Register the `NRGLockdownPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "NRGLockdownPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "NRGLockdownPreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

## Create an AKS cluster with node resource group lockdown

Create a cluster with node resource group lockdown using the [`az aks create`][az-aks-create] command with the `--nrg-lockdown-restriction-level` flag set to `ReadOnly`. This configuration allows you to view the resources but not modify them.

```azurecli-interactive
az aks create --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP_NAME --nrg-lockdown-restriction-level ReadOnly
```

## Update an existing cluster with node resource group lockdown

Update an existing cluster with node resource group lockdown using the [`az aks update`][az-aks-update] command with the `--nrg-lockdown-restriction-level` flag set to `ReadOnly`. This configuration allows you to view the resources but not modify them.

```azurecli-interactive
az aks update --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP_NAME --nrg-lockdown-restriction-level ReadOnly
```

## Remove node resource group lockdown from a cluster

Remove node resource group lockdown from an existing cluster using the [`az aks update`][az-aks-update] command with the `--nrg-restriction-level` flag set to `Unrestricted`. This configuration allows you to view and modify the resources.

```azurecli-interactive
az aks update --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP_NAME --nrg-lockdown-restriction-level Unrestricted
```

## Next steps

To learn more about the node resource group in AKS, see [Node resource group][whatis-nrg].

<!-- LINKS -->
[whatis-nrg]: ./concepts-clusters-workloads.md#node-resource-group
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az_feature_show
[az-provider-register]: /cli/azure/provider#az_provider_register
