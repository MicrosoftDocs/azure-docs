---
title: Custom certificate authority (CA) in Azure Kubernetes Service (AKS) (preview)
description: Learn how to use a custom certificate authority (CA) in an Azure Kubernetes Service (AKS) cluster.
author: rayoef
ms.author: rayoflores
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 04/25/2023
---

# Custom certificate authority (CA) in Azure Kubernetes Service (AKS) (preview)

AKS generates and uses the following certificates, Certificate Authorities (CAs), and Service Accounts (SAs):

* The AKS API server creates a CA called the Cluster CA.
* The API server has a Cluster CA, which signs certificates for one-way communication from the API server to kubelets.
* Each kubelet also creates a Certificate Signing Request (CSR), which is signed by the Cluster CA, for communication from the kubelet to the API server.
* The API aggregator uses the Cluster CA to issue certificates for communication with other APIs. The API aggregator can also have its own CA for issuing those certificates, but it currently uses the Cluster CA.
* Each node uses an SA token, which is signed by the Cluster CA.
* The `kubectl` client has a certificate for communicating with the AKS cluster.

You can also create custom certificate authorities, which allow you to establish trust between your Azure Kubernetes Service (AKS) clusters and workloads, such as private registries, proxies, and firewalls. A Kubernetes secret stores the certificate authority's information, and then it's passed to all nodes in the cluster. This feature is applied per node pool, so you need to enable it on new and existing node pools.

This article shows you how to create custom CAs and apply them to your AKS clusters.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free).
* [Azure CLI installed][azure-cli-install] (version 2.43.0 or greater).
* A base64 encoded certificate string or a text file with certificate.

## Limitations

* This feature currently isn't supported for Windows node pools.

## Install the `aks-preview` Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

1. Install the aks-preview extension using the [`az extension add`][az-extension-add] command.

    ```azurecli
    az extension add --name aks-preview
    ```

2. Update to the latest version of the extension using the [`az extension update`][az-extension-update] command.

    ```azurecli
    az extension update --name aks-preview
    ```

## Register the `CustomCATrustPreview` feature flag

1. Register the `CustomCATrustPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli
    az feature register --namespace "Microsoft.ContainerService" --name "CustomCATrustPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli
    az feature show --namespace "Microsoft.ContainerService" --name "CustomCATrustPreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli
    az provider register --namespace Microsoft.ContainerService
    ```

## Custom CA installation on AKS node pools

### Install CAs on AKS node pools

* If your environment requires your custom CAs to be added to node trust store for correct provisioning, you need to pass a text file containing up to 10 blank line separated certificates during [`az aks create`][az-aks-create] or [`az aks update`][az-aks-update] operations. Example text file:

    ```txt
    -----BEGIN CERTIFICATE-----
    cert1
    -----END CERTIFICATE-----

    -----BEGIN CERTIFICATE-----
    cert2
    -----END CERTIFICATE-----
    ```

#### Install CAs during node pool creation

* Install CAs during node pool creation using the [`az aks create][az-aks-create] command and specifying your text file for the `--custom-ca-trust-certificates` parameter.

    ```azurecli
    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --node-count 2 \
        --enable-custom-ca-trust \
        --custom-ca-trust-certificates pathToFileWithCAs
    ```

#### CA rotation for availability during node pool boot up

* Update CAs passed to your cluster during boot up using the [`az aks update`][az-aks-update] command and specifying your text file for the `--custom-ca-trust-certificates` parameter.

    ```azurecli
    az aks update \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --custom-ca-trust-certificates pathToFileWithCAs
    ```

    > [!NOTE]
    > This operation triggers a model update, ensuring new nodes have the newest CAs required for correct provisioning. AKS creates additional nodes, drains existing ones, deletes them, and replaces them with nodes that have the new set of CAs installed.

### Install CAs after node pool creation

If your environment can be successfully provisioned without your custom CAs, you can provide the CAs by deploying a secret in the `kube-system` namespace. This approach allows for certificate rotation without the need for node recreation.

* Create a [Kubernetes secret][kubernetes-secrets] YAML manifest with your base64 encoded certificate string in the `data` field.

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

    Data from this secret is used to update CAs on all nodes. Make sure the secret is named `custom-ca-trust-secret` and is created in the `kube-system` namespace. Installing CAs using the secret in the `kube-system` namespace allows for CA rotation without the need for node recreation. To update or remove a CA, you can edit and apply the YAML manifest. The cluster polls for changes and updates the nodes accordingly. It may take a couple minutes before changes are applied.

    > [!NOTE]
    >
    > containerd restart on the node might be required for the CAs to be picked up properly. If it appears like CAs aren't correctly added to your node's trust store, you can trigger a restart using the following command from node's shell:
    >
    > ```systemctl restart containerd```

## Configure a new AKS cluster to use a custom CA

* Configure a new AKS cluster to use a custom CA using the [`az aks create`][az-aks-create] command with the `--enable-custom-ca-trust` parameter.

    ```azurecli
    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --node-count 2 \
        --enable-custom-ca-trust
    ```

## Configure a new AKS cluster to use a custom CA with CAs installed before node boots up

* Configure a new AKS cluster to use custom CA with CAs installed before the node boots up using the [`az aks create`][az-aks-create] command with the `--enable-custom-ca-trust` and `--custom-ca-trust-certificates` parameters.

    ```azurecli
    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --node-count 2 \
        --enable-custom-ca-trust \
        --custom-ca-trust-certificates pathToFileWithCAs
    ```

## Configure an existing AKS cluster to have custom CAs installed before node boots up

* Configure an existing AKS cluster to have your custom CAs added to node's trust store before it boots up using the [`az aks update`][az-aks-update] command with the `--custom-ca-trust-certificates` parameter.

    ```azurecli
    az aks update \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --custom-ca-trust-certificates pathToFileWithCAs
    ```

## Configure a new node pool to use a custom CA

* Configure a new node pool to use a custom CA using the [`az aks nodepool add`][az-aks-nodepool-add] command with the `--enable-custom-ca-trust` parameter.

    ```azurecli
    az aks nodepool add \
        --cluster-name myAKSCluster \
        --resource-group myResourceGroup \
        --name myNodepool \
        --enable-custom-ca-trust \
        --os-type Linux
    ```

    If no other node pools with the feature enabled exist, the cluster has to reconcile its settings for the changes to take effect. This operation happens automatically as a part of AKS's reconcile loop. Before the operation, the daemon set and pods don't appear on the cluster. You can trigger an immediate reconcile operation using the [`az aks update`][az-aks-update] command. The daemon set and pods appear after the update completes.

## Configure an existing node pool to use a custom CA

* Configure an existing node pool to use a custom CA using the [`az aks nodepool update`][az-aks-nodepool-update] command with the `--enable-custom-trust-ca` parameter.

    ```azurecli
    az aks nodepool update \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name myNodepool \
        --enable-custom-ca-trust
    ```

    If no other node pools with the feature enabled exist, the cluster has to reconcile its settings for the changes to take effect. This operation happens automatically as a part of AKS's reconcile loop. Before the operation, the daemon set and pods don't appear on the cluster. You can trigger an immediate reconcile operation using the [`az aks update`][az-aks-update] command. The daemon set and pods appear after the update completes.

## Troubleshooting

### Feature is enabled and secret with CAs is added, but operations are failing with X.509 Certificate Signed by Unknown Authority error

#### Incorrectly formatted certs passed in the secret

AKS requires certs passed in the user-created secret to be properly formatted and base64 encoded. Make sure the CAs you passed are properly base64 encoded and that files with CAs don't have CRLF line breaks.
Certificates passed to ```--custom-ca-trust-certificates``` shouldn't be base64 encoded.

#### containerd hasn't picked up new certs

From the node's shell, run ```systemctl restart containerd```. Once containerd is restarts, the new certs are properly picked up by the container runtime.

## Next steps

For more information on AKS security best practices, see [Best practices for cluster security and upgrades in Azure Kubernetes Service (AKS)][aks-best-practices-security-upgrades].

<!-- LINKS INTERNAL -->
[aks-best-practices-security-upgrades]: operator-best-practices-cluster-security.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-nodepool-add]: /cli/azure/aks#az-aks-nodepool-add
[az-aks-nodepool-update]: /cli/azure/aks#az-aks-update
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-provider-register]: /cli/azure/provider#az-provider-register
