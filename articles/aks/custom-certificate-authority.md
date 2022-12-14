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

This feature is applied per nodepool, so new and existing node pools must be configured to enable this feature.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI installed][azure-cli-install] (version 2.43.0 or greater).
* A base64 encoded certificate string or a text file with certificate.

### Limitations

This feature isn't currently supported for Windows node pools.

### Install the `aks-preview` extension

You also need the *aks-preview* Azure CLI extensions version 0.5.119 or later. Install the *aks-preview* extension by using the [az extension add][az-extension-add] command, or install any available updates by using the [az extension update][az-extension-update] command.

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

## Two ways for custom CA installation on AKS node pools

Two ways of installing custom CAs on your AKS cluster are available. They're intended for different use cases, which are outlined below.

### Install CAs during node pool boot up
If your environment requires your custom CAs to be added to node trust store for correct provisioning,
text file containing up to 10 blank line separated certificates needs to be passed during
[az aks create][az-aks-create] or [az aks update][az-aks-update] operations.

Example command:
```azurecli
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 2 \
    --enable-custom-ca-trust \
    --custom-ca-trust-certificates pathToFileWithCAs
```

Example file:
```
-----BEGIN CERTIFICATE-----
cert1
-----END CERTIFICATE-----

-----BEGIN CERTIFICATE-----
cert2
-----END CERTIFICATE-----
```

CAs will be added to node's trust store during node boot up process, allowing the node to, for example access a private registry.

#### CA rotation for availability during node pool boot up
To update CAs passed to cluster during boot up [az aks update][az-aks-update] operation has to be used.
```azurecli
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --custom-ca-trust-certificates pathToFileWithCAs
```

> [!NOTE]
> Running this operation will trigger a model update, to ensure that new nodes added during for example scale up operation have the newest CAs required for correct provisioning.
> This means that AKS will create additional nodes, drain currently existing ones, delete them and then replace them with nodes that have the new set of CAs installed.


### Install CAs once node pool is up and running
If your environment can be successfully provisioned without your custom CAs, you can provide the CAs using a secret deployed in the kube-system namespace.
This approach allows for certificate rotation without the need for node recreation.

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

To update or remove a CA, edit and apply the secret's YAML manifest. The cluster will poll for changes and update the nodes accordingly. This process may take a couple of minutes before changes are applied.

Sometimes containerd restart on the node might be required for the CAs to be picked up properly. If it appears like CAs aren't added correctly to your node's trust store, you can trigger such restart using the following command from node's shell:

```systemctl restart containerd```

> [!NOTE]
> Installing CAs using the secret in the kube-system namespace will allow for CA rotation without need for node recreation.

## Configure a new AKS cluster to use a custom CA

To configure a new AKS cluster to use a custom CA, run the [az aks create][az-aks-create] command with the `--enable-custom-ca-trust` parameter.

```azurecli
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 2 \
    --enable-custom-ca-trust
```

To configure a new AKS cluster to use custom CA with CAs installed before node boots up,  run the [az aks create][az-aks-create] command with the `--enable-custom-ca-trust` and `--custom-ca-trust-certificates` parameters.

```azurecli
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 2 \
    --enable-custom-ca-trust \
    --custom-ca-trust-certificates pathToFileWithCAs
```

## Configure an existing AKS cluster to have custom CAs installed before node boots up

To configure an existing AKS cluster to have your custom CAs added to node's trust store before it boots up, run  [az aks update][az-aks-update] command with the `--custom-ca-trust-certificates` parameter.

```azurecli
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --custom-ca-trust-certificates pathToFileWithCAs
```

## Configure a new node pool to use a custom CA

To configure a new node pool to use a custom CA, run the [az aks nodepool add][az-aks-nodepool-add] command with the `--enable-custom-ca-trust` parameter.

```azurecli
az aks nodepool add \
    --cluster-name myAKSCluster \
    --resource-group myResourceGroup \
    --name myNodepool \
    --enable-custom-ca-trust \
    --os-type Linux
```

If there are currently no other node pools with the feature enabled, cluster will have to reconcile its settings for
the changes to take effect. Before that happens, daemonset and pods, which install CAs won't appear on the cluster.
This operation will happen automatically as a part of AKS's reconcile loop.
You can trigger reconcile operation immediately by running the [az aks update][az-aks-update] command:

```azurecli
az aks update \
 --resource-group myResourceGroup \
 --name cluster-name
```

Once completed, the daemonset and pods will appear in the cluster.

## Configure an existing node pool to use a custom CA

To configure an existing node pool to use a custom CA, run the [az aks nodepool update][az-aks-nodepool-update] command with the `--enable-custom-trust-ca` parameter.

```azurecli
az aks nodepool update \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name myNodepool \
    --enable-custom-ca-trust
```

If there are currently no other node pools with the feature enabled, cluster will have to reconcile its settings for
the changes to take effect. Before that happens, daemon set and pods, which install CAs won't appear on the cluster.
This operation will happen automatically as a part of AKS's reconcile loop.
You can trigger reconcile operation by running the following command:

```azurecli
az aks update -g myResourceGroup --name cluster-name
```

Once complete, the daemonset and pods will appear in the cluster.

## Troubleshooting

### Feature is enabled and secret with CAs is added, but operations are failing with X.509 Certificate Signed by Unknown Authority error
#### Incorrectly formatted certs passed in the secret
AKS requires certs passed in the user-created secret to be properly formatted and base64 encoded. Make sure the CAs you passed are properly base64 encoded and that files with CAs don't have CRLF line breaks.
Certificates passed to ```--custom-ca-trust-certificates``` option shouldn't be base64 encoded.
#### Containerd hasn't picked up new certs
From node's shell, run ```systemctl restart containerd```, once containerd is restarted, new certs will be properly picked up by the container runtime.

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