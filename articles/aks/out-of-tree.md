---
title: Enable Cloud Controller Manager (preview)
description: Learn how to enable the Out of Tree cloud provider (preview)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 04/08/2022
ms.author: juda
---

# Enable Cloud Controller Manager (preview)

As a cloud provider, Microsoft Azure works closely with the Kubernetes community to support our infrastructure on behalf of users.

Previously, cloud provider integration with Kubernetes was "in-tree", where any changes to cloud specific features would follow the standard Kubernetes release cycle. When issues were fixed or enhancements were rolled out, they would need to be within the Kubernetes community's release cycle.

The Kubernetes community is now adopting an *out-of-tree* model, where the cloud providers controls their releases independently of the core Kubernetes release schedule through the [cloud-provider-azure][cloud-provider-azure] component. As part of this cloud-provider-azure component, we are also introducing a cloud-node-manager component, which is a component of the Kubernetes node lifecycle controller. This component is deployed by a DaemonSet in the *kube-system* namespace.

The Cloud Storage Interface (CSI) drivers are included by default in Kubernetes version 1.21 and higher.

> [!NOTE]
> When you enable the Cloud Controller Manager (preview) on your AKS cluster, it also enables the out of tree CSI drivers.

The Cloud Controller Manager (preview) is the default controller from Kubernetes 1.22, supported by AKS. If your cluster is running a version earlier than 1.22, perform the following steps.

## Prerequisites

You must have the following resources installed:

* The Azure CLI
* Kubernetes version 1.20.x and higher

## Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

## Register the 'EnableCloudControllerManager' feature flag

Register the `EnableCloudControllerManager` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "EnableCloudControllerManager"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "EnableCloudControllerManager"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Create a new AKS cluster with Cloud Controller Manager

To create a cluster using the Cloud Controller Manager, run the following command. Include the parameter `EnableCloudControllerManager=True` as a customer header to the Azure API using the Azure CLI.

```azurecli-interactive
az aks create -n aks -g myResourceGroup --aks-custom-headers EnableCloudControllerManager=True
```

## Upgrade an AKS cluster to Cloud Controller Manager on an existing cluster

To upgrade a cluster to use the Cloud Controller Manager, run the following command. Include the parameter `EnableCloudControllerManager=True` as a customer header to the Azure API using the Azure CLI.

```azurecli-interactive
az aks upgrade -n aks -g myResourceGroup -k <version> --aks-custom-headers EnableCloudControllerManager=True
```

## Verify component deployment

To view this component, run the following Azure CLI command:

```azurecli-interactive
kubectl get po -n kube-system | grep cloud-node-manager
```

## Next steps

- For more information on CSI drivers, and the default behavior for Kubernetes versions higher than 1.21, review [documentation][csi-docs].

- You can find more information about the Kubernetes community direction regarding out of tree providers on the [community blog post][community-blog].

<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[csi-docs]: csi-storage-drivers.md

<!-- LINKS - External -->
[community-blog]: https://kubernetes.io/blog/2019/04/17/the-future-of-cloud-providers-in-kubernetes
[cloud-provider-azure]: https://github.com/kubernetes-sigs/cloud-provider-azure
