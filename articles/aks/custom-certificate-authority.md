---
title: Custom certificate authority (CA) in Azure Kubernetes Service (AKS) (preview)
description: Learn how to use a custom certificate authority (CA) in an Azure Kubernetes Service (AKS) cluster.
services: container-service
author: rayoef
ms.author: rayoflores
ms.topic: article
ms.date: 4/12/2022
---

# Custom certificate authority (CA) in Azure Kubernetes Service (AKS) (preview)

Custom certificate authorities (CAs) allow you to establish trust between your Azure Kubernetes Service (AKS) cluster and your workloads, such as private registries, proxies, and firewalls. A Kubernetes secret is used to store the certificate authority's information, then it's passed to all nodes in the cluster.

This feature is applied per nodepool, so new and existing nodepools must be configured to enable this feature.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI installed][azure-cli-install].
* A base64 encoded certificate string.

### Limitations

This feature isn't currently supported for Windows nodepools.

### Install the `aks-preview` extension

You also need the *aks-preview* Azure CLI extensions version 0.5.72 or later. Install the *aks-preview* extension by using the [az extension add][az-extension-add] command, or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Register the `CustomCATrustPreview` preview feature

Register the `CustomCATrustPreview` feature flag by using the [az feature register][az-feature-register] command:

```azurecli
az feature register --namespace "Microsoft.ContainerService" --name "CustomCATrustPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli
az feature list --query "[?contains(name, 'Microsoft.ContainerService/CustomCATrustPreview')].{Name:name,State:properties.state}" -o table
```

Refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli
az provider register --namespace Microsoft.ContainerService
```

## Configure a new AKS cluster to use a custom CA

To configure a new AKS cluster to use a custom CA, run the [az aks create][az-aks-create] command with the `--enable-custom-ca-trust` parameter.

```azurecli
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 2 \
    --enable-custom-ca-trust
```

## Configure a new nodepool to use a custom CA

To configure a new nodepool to use a custom CA, run the [az aks nodepool add][az-aks-nodepool-add] command with the `--enable-custom-ca-trust` parameter.

```azurecli
az aks nodepool add \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup \
    --name myNodepool \
    --enable-custom-ca-trust \
    --os-type Linux
```

## Configure an existing nodepool to use a custom CA

To configure an existing nodepool to use a custom CA, run the [az aks nodepool update][az-aks-nodepool-update] command with the `--enable-custom-trust-ca` parameter.

```azurecli
az aks nodepool update \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name myNodepool \
    --enable-custom-ca-trust
```

## Create a Kubernetes secret with your CA information

Create a [Kubernetes secret][kubernetes-secrets] YAML manifest with your base64 encoded certificate string in the `data` field. Data from this secret is used to update CAs on all nodes.

You must ensure that:
* The secret is named `custom-ca-trust-secret`.
* The secret is created in the `kube-system` namespace.

```yaml
apiVersion: v1
kind: Secret
metadata: 
    name: custom-ca-trust-secret
    namespace: kube-system
type: Opaque
data:
    ca1.crt: |
      {base64EncodedCertStringHere}
    ca2.crt: |
      {anotherBase64EncodedCertStringHere}
```

To update or remove a CA, edit and apply the YAML manifest. The cluster will poll for changes and update the nodes accordingly. This process may take a couple of minutes before changes are applied.

## Next steps

For more information on AKS security best practices, see [Best practices for cluster security and upgrades in Azure Kubernetes Service (AKS)][aks-best-practices-security-upgrades].

<!-- LINKS EXTERNAL -->
[kubernetes-secrets]:https://kubernetes.io/docs/concepts/configuration/secret/

<!-- LINKS INTERNAL -->
[aks-best-practices-security-upgrades]: operator-best-practices-cluster-security.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-nodepool-add]: /cli/azure/aks#az-aks-nodepool-add
[az-aks-nodepool-update]: /cli/azure/aks#az-aks-update
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-provider-register]: /cli/azure/provider#az-provider-register
