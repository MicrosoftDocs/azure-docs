---
title: Enable Cloud Controller Manager (preview) on your Azure Kubernetes Service (AKS) cluster
description: Learn how to enable the Out of Tree cloud provider (preview) on your Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 06/19/2023
ms.author: juda
---

# Enable Cloud Controller Manager (preview) on your Azure Kubernetes Service (AKS) cluster

As a cloud provider, Microsoft Azure works closely with the Kubernetes community to support our infrastructure on behalf of users.

Previously, cloud provider integration with Kubernetes was *in-tree*, where any changes to cloud specific features would follow the standard Kubernetes release cycle. When issues were fixed or enhancements were rolled out, they would need to be within the Kubernetes community's release cycle.

The Kubernetes community is now adopting an ***out-of-tree*** model, where cloud providers control releases independently of the core Kubernetes release schedule through the [cloud-provider-azure][cloud-provider-azure] component. As part of this cloud-provider-azure component, we're also introducing a cloud-node-manager component, which is a component of the Kubernetes node lifecycle controller. A DaemonSet in the *kube-system* namespace deploys this component.

The Cloud Storage Interface (CSI) drivers are included by default in Kubernetes version 1.21 and higher.

> [!NOTE]
> When you enable the Cloud Controller Manager (preview) on your AKS cluster, it also enables the out-of-tree CSI drivers.

## Prerequisites

You must have the following resources installed:

* The Azure CLI. For more information, see [Install the Azure CLI][install-azure-cli].
* Kubernetes version 1.20.x or higher.

## Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

1. Install the aks-preview extension using the [`az extension add`][az-extension-add] command.

    ```azurecli
    az extension add --name aks-preview
    ```

2. Update to the latest version of the extension released using the [`az extension update`][az-extension-update] command.

    ```azurecli
    az extension update --name aks-preview
    ```

## Register the 'EnableCloudControllerManager' feature flag

1. Register the `EnableCloudControllerManager` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "EnableCloudControllerManager"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "EnableCloudControllerManager"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

## Create a new AKS cluster with Cloud Controller Manager

* Create a new AKS cluster with Cloud Controller Manager using the [`az aks create`][az-aks-create] command and include the parameter `EnableCloudControllerManager=True` as an `--aks-custom-header`.

    ```azurecli-interactive
    az aks create -n aks -g myResourceGroup --aks-custom-headers EnableCloudControllerManager=True
    ```

## Upgrade an AKS cluster to Cloud Controller Manager on an existing cluster

* Upgrade an existing AKS cluster with Cloud Controller Manager using the [`az aks upgrade`][az-aks-upgrade] command and include the parameter `EnableCloudControllerManager=True` as an `--aks-custom-header`.

    ```azurecli-interactive
    az aks upgrade -n aks -g myResourceGroup -k <version> --aks-custom-headers EnableCloudControllerManager=True
    ```

## Verify component deployment

* Verify the component deployment using the following `kubectl get po` command.

    ```azurecli-interactive
    kubectl get po -n kube-system | grep cloud-node-manager
    ```

## Next steps

* For more information on CSI drivers, and the default behavior for Kubernetes versions higher than 1.21, review the [CSI documentation][csi-docs].
* For more information on the Kubernetes community direction regarding out-of-tree providers, see the [community blog post][community-blog].

<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[csi-docs]: csi-storage-drivers.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-upgrade]: /cli/azure/aks#az-aks-upgrade

<!-- LINKS - External -->
[community-blog]: https://kubernetes.io/blog/2019/04/17/the-future-of-cloud-providers-in-kubernetes
[cloud-provider-azure]: https://github.com/kubernetes-sigs/cloud-provider-azure
