---
title: Enable Cloud Controller Manager (Preview)
description: Learn how to enable the Out of Tree cloud provider
services: container-service
ms.topic: article
ms.date: 8/25/2021
ms.author: juda

---

# Enable Cloud Controller Manager (Preview)

As a Cloud Provider, Microsoft Azure works closely with the Kubernetes community to support our infrastructure on behalf of users.

Currently, Cloud provider integration within Kubernetes is "in-tree", where any changes to Cloud specific features must follow the standard Kubernetes release cycle.  When we find, fix issues, or need to roll out enhancements, we must do this within the Kubernetes community's release cycle.

The Kubernetes community is now adopting an "out-of-tree" model where the Cloud providers will control their releases independently of the core Kubernetes release schedule through the [cloud-provider-azure][cloud-provider-azure] component.  We have already rolled out the Cloud Storage Interface (CSI) drivers to be the default in Kubernetes version 1.21 and above.

> [!Note]
> When enabling Cloud Controller Manager on your AKS cluster, this will also enable the out of tree CSI drivers.

The Cloud Controller Manager will be the default controller from Kubernetes 1.22, supported by AKS.


[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

You must have the following resource installed:

* The Azure CLI
* The `aks-preview` extension version 0.5.5 or later
* Kubernetes version 1.20.x or above


### Register the `EnableCloudControllerManager` feature flag

To use the Cloud Controller Manager feature, you must enable the `EnableCloudControllerManager` feature flag on your subscription. 

```azurecli
az feature register --name EnableCloudControllerManager --namespace Microsoft.ContainerService
```
You can check on the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/EnableCloudControllerManager')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

### Install the aks-preview CLI extension

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

## Create an AKS cluster with Cloud Controller Manager

To create a cluster using the Cloud Controller Manager, pass `EnableCloudControllerManager=True` as a customer header to the Azure API using the Azure CLI.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
az aks create -n aks -g myResourceGroup --aks-custom-headers EnableCloudControllerManager=True
```

## Upgrade an AKS cluster to Cloud Controller Manager

To upgrade a cluster to use the Cloud Controller Manager, pass `EnableCloudControllerManager=True` as a customer header to the Azure API using the Azure CLI.

```azurecli-interactive
az aks upgrade -n aks -g myResourceGroup -k <version> --aks-custom-headers EnableCloudControllerManager=True
```

## Next steps

- For more information on CSI drivers, and the default behavior for Kubernetes versions above 1.21, please see our [documentation][csi-docs].

- You can find more information about the Kubernetes community direction regarding Out of Tree providers on the [community blog post][community-blog].


<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[csi-docs]: csi-storage-drivers.md

<!-- LINKS - External -->
[community-blog]: https://kubernetes.io/blog/2019/04/17/the-future-of-cloud-providers-in-kubernetes
[cloud-provider-azure]: https://github.com/kubernetes-sigs/cloud-provider-azure
