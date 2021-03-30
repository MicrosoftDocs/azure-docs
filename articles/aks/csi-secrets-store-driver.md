---
title: Use the Secrets Store CSI driver for Azure Kubernetes Service secrets
description: Learn how to use the secrets store CSI driver to integrate secrets stores with Azure Kubernetes Service (AKS).
author: nickomang 
ms.author: nickoman
ms.service: container-service
ms.topic: how-to 
ms.date: 03/30/2021
ms.custom: template-how-to
---

# Use the Secrets Store CSI Driver for Kubernetes in an Azure Kubernetes Service (AKS) cluster (preview)

The Secrets Store CSI Driver for Kubernetes allows for the integration of various secrets stores with a Kubernetes cluster via a [CSI volume][kube-csi].

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Before you start, install the [Azure CLI](/cli/azure/install-azure-cli-windows).

## Features
- Mount secrets, keys, and/or certs to a pod using a CSI volume
- Supports CSI Inline volumes (Kubernetes version v1.15+)
- Supports mounting multiple secrets store objects as a single volume
- Supports multiple secrets stores as providers. Multiple providers can run in the same cluster simultaneously.
- Supports pod portability with the SecretProviderClass CRD
- Supports windows containers (Kubernetes version v1.18+)
- Sync with Kubernetes Secrets (Secrets Store CSI Driver v0.0.10+)

## Register the `???` preview feature

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

To create an AKS cluster that can use the Secrets Store CSI Driver, you must enable the `???` feature flag on your subscription.

Register the `???` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "???"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/???')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Create an AKS cluster with Secrets Store CSI Driver support

To create an AKS cluster with Secrets Store CSI Driver capability, use the [az-aks-create][az-aks-create] command with the `--???` flag:

```azurecli-interactive
az aks create -n myAKSCluster -g myResourceGroup --???
```

get-credentials too

## Install a Secrets Store CSI Driver provider

The Secrets Store CSI Driver for AKS supports a number of Secrets Store CSI Driver providers. To install, follow the linked instructions for your provider. Keep in mind some providers require additional steps for compatibility when creating an AKS Cluster.

### Supported Providers
- [Azure Key Vault][key-vault-provider-install]
- [HashiCorp Vault][hashicorp-vault-provider-install]
- [Google Secret Manager][google-secret-manager-provider-install]


## Create and deploy your own SecretProviderClass object

To use and configure the Secrets Store CSI driver for your AKS cluster, create a SecretProviderClass custom resource.

A SecretProviderClass custom resource has the following components at a minimum:

```yml
apiVersion: secrets-store.csi.x-k8s.io/v1alpha1
kind: SecretProviderClass
metadata:
  name: my-provider
spec:
  provider: azure                             # accepted provider options: azure or vault or gcp
  parameters:                                 # provider-specific parameters
```

For more details, see a [sample SecretProviderClass][sample-secret-provider-class].

Additional components or specific values may be required based on your provider. Be sure to follow any instructions from your provider's documentation in the [supported providers section](#supported-providers).

Next, deploy the SecretProviderClass you just created. For example:

```bash
kubectl apply -f ./new-secretproviderclass.yaml
```

## Update your cluster's deployment YAML

To ensure your cluster is using the new custom resource, update the deployment YAML. For a more comprehensive example, take a look at a [sample deployment][sample-deployment].

Again, your provider may require additional components or specific values. Follow the instructions from your provider's documentation in the [supported providers section](#supported-providers).

```yml
volumes:
  - name: secrets-store-inline
    csi:
      driver: secrets-store.csi.k8s.io
      readOnly: true
      volumeAttributes:
        secretProviderClass: "my-provider"
```

Apply the updated deployment to the cluster: 

```bash
kubectl apply -f ./my-deployment.yaml
```

## Validate the secrets

After the pod starts, the mounted content at the volume path specified in your deployment YAML is available.

```Bash
## show secrets held in secrets-store
kubectl exec secrets-store-inline -- ls /mnt/secrets-store/foo

## print a test secret held in secrets-store
kubectl exec secrets-store-inline -- cat /mnt/secrets-store/foo
```

## Next steps
<!-- Add a context sentence for the following links -->
After learning how to use the CSI Secrets Store Driver with an AKS Cluster, see the following resources:

- [Sync mounted content as a Kubernetes Secret][sync-kube-secret]
- [Auto rotation of mounted content and synced Kubernetes Secrets][auto-rotate-kube-secret]
- [Run the Azure Key Vault provider for Secrets Store CSI Driver][key-vault-provider]
- [Enable CSI drivers for Azure Disks and Azure Files on AKS][csi-storage-drivers]

<!-- Links -->
<!-- Internal -->
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-aks-create]: /cli/azure/aks#az_aks_create
[key-vault-provider]: ../key-vault/general/key-vault-integrate-kubernetes
[csi-storage-drivers]: ./csi-storage-drivers

<!-- External -->
[kube-csi]: https://kubernetes-csi.github.io/docs/
[key-vault-provider-install]: https://azure.github.io/secrets-store-csi-driver-provider-azure/
[hashicorp-vault-provider-install]: https://github.com/hashicorp/vault-csi-provider
[google-secret-manager-provider-install]: https://github.com/GoogleCloudPlatform/secrets-store-csi-driver-provider-gcp 
[sample-secret-provider-class]: https://github.com/kubernetes-sigs/secrets-store-csi-driver/blob/master/test/bats/tests/vault/vault_v1alpha1_secretproviderclass.yaml
[sample-deployment]: https://github.com/kubernetes-sigs/secrets-store-csi-driver/blob/master/test/bats/tests/vault/pod-vault-inline-volume-secretproviderclass.yaml
[sync-kube-secret]: https://secrets-store-csi-driver.sigs.k8s.io/topics/sync-as-kubernetes-secret.html
[auto-rotate-kube-secret]: https://secrets-store-csi-driver.sigs.k8s.io/topics/secret-auto-rotation.html
