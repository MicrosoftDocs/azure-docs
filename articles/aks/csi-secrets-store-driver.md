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

The Secrets Store CSI Driver for Kubernetes allows for the integration of Azure Key Vault as a secrets store with a Kubernetes cluster via a [CSI volume][kube-csi].

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Before you start, install the latest version of the [Azure CLI](/cli/azure/install-azure-cli-windows) and the *aks-preview* extension.

## Features

- Mount secrets, keys, and/or certs to a pod using a CSI volume
- Supports CSI Inline volumes (Kubernetes version v1.15+)
- Supports mounting multiple secrets store objects as a single volume
- Supports pod portability with the SecretProviderClass CRD
- Supports windows containers (Kubernetes version v1.18+)
- Sync with Kubernetes Secrets (Secrets Store CSI Driver v0.0.10+)
- Supports auto rotation of mounted contents and synced Kubernetes secrets (Secrets Store CSI Driver v0.0.15+)

## Register the `AKS-AzureKeyVaultSecretsProvider` preview feature

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

To create an AKS cluster that can use the Secrets Store CSI Driver, you must enable the `AKS-AzureKeyVaultSecretsProvider` feature flag on your subscription.

Register the `AKS-AzureKeyVaultSecretsProvider` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "AKS-AzureKeyVaultSecretsProvider"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKS-AzureKeyVaultSecretsProvider')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Install the aks-preview CLI extension

You also need the *aks-preview* Azure CLI extension version 0.5.10 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. If you already have the extension installed, update to the latest available version by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

## Create an AKS cluster with Secrets Store CSI Driver support

> [!NOTE]
> If you plan to provide access to the cluster via a user-assigned or system-assigned managed identity, enable Azure Active Directory on your cluster with the flag `enable-managed-identity`. See [Use managed identities in Azure Kubernetes Service][aks-managed-identity] for more.

To create an AKS cluster with Secrets Store CSI Driver capability, use the [az-aks-create][az-aks-create] command with the addon `azure-keyvault-secrets-provider`:

```azurecli-interactive
az aks create -n myAKSCluster -g myResourceGroup --enable-addons azure-keyvault-secrets-provider
```

## Upgrade an existing AKS cluster with Secrets Store CSI Driver support

> [!NOTE]
> If you plan to provide access to the cluster via a user-assigned or system-assigned managed identity, enable Azure Active Directory on your cluster with the flag `enable-managed-identity`. See [Use managed identities in Azure Kubernetes Service][aks-managed-identity] for more.

To upgrade an existing AKS cluster with Secrets Store CSI Driver capability, use the [az-aks-create][az-aks-create] command with the addon `azure-keyvault-secrets-provider`:

```azurecli-interactive
az aks upgrade -n myAKSCluster -g myResourceGroup --enable-addons azure-keyvault-secrets-provider
```

These commands will install the Secrets Store CSI Driver and the Azure Key Vault provider on your nodes. Verify by listing all pods from all namespaces and ensuring your output looks similar to the following:

```bash
kubectl get pods -n kube-system

NAMESPACE     NAME                                     READY   STATUS    RESTARTS   AGE
kube-system   aks-secrets-store-csi-driver-4vpkj       3/3     Running   2          4m25s
kube-system   aks-secrets-store-csi-driver-ctjq6       3/3     Running   2          4m21s
kube-system   aks-secrets-store-csi-driver-tlvlq       3/3     Running   2          4m24s
kube-system   aks-secrets-store-provider-azure-5p4nb   1/1     Running   0          4m21s
kube-system   aks-secrets-store-provider-azure-6pqmv   1/1     Running   0          4m24s
kube-system   aks-secrets-store-provider-azure-f5qlm   1/1     Running   0          4m25s
```

### Enabling autorotation

> [!NOTE]
> When enabled, the Secrets Store CSI Driver will update the pod mount and the Kubernetes Secret defined in secretObjects of the SecretProviderClass by polling for changes every two minutes.

To enable autorotation of secrets, use the flag `enable-secret-rotation` when creating your cluster:

```azurecli-interactive
az aks create -n myAKSCluster2 -g myResourceGroup --enable-addons azure-keyvault-secrets-provider --enable-secret-rotation --rotation-poll-interval 5m
```

## Create or use an existing Azure Key Vault

In addition to an AKS cluster, you will need an Azure Key Vault resource containing the secret content. To deploy an Azure Key Vault instance, follow these steps:

1. [Create a key vault][create-key-vault]
2. [Set a secret in a key vault][set-secret-key-vault]

Take note of the following properties for use in the next section:

- Name of secret object in Key Vault
- Secret content type (secret, key, cert)
- Name of Key Vault resource
- Azure Tenant ID the Subscription belongs to

## Create and apply your own SecretProviderClass object

To use and configure the Secrets Store CSI driver for your AKS cluster, create a SecretProviderClass custom resource.

Here is an example making use of a Service Principal to access the key vault:

```yml
apiVersion: secrets-store.csi.x-k8s.io/v1alpha1
kind: SecretProviderClass
metadata:
  name: azure-kvname
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"         # [OPTIONAL] if not provided, will default to "false"
    keyvaultName: "kvname"          # the name of the KeyVault
    cloudName: ""                   # [OPTIONAL for Azure] if not provided, azure environment will default to AzurePublicCloud 
    objects:  |
      array:
        - |
          objectName: secret1
          objectType: secret        # object types: secret, key or cert
          objectVersion: ""         # [OPTIONAL] object versions, default to latest if empty
        - |
          objectName: key1
          objectType: key
          objectVersion: ""
    tenantId: "<tenant-id>"                 # the tenant ID of the KeyVault
```

For more information, see [Create your own SecretProviderClass Object][sample-secret-provider-class]. Be sure to use the values you took note of above.

## Provide identity to access Azure Key Vault

The example in this article uses a Service Principal, but the Azure Key Vault provider offers four methods of access. Review them and choose the one that best fits your use case. Be aware additional steps may be required depending on the chosen method, such as granting the Service Principal permissions to get secrets from key vault.

- [Service Principal][service-principal-access]
- [Pod Identity][pod-identity-access]
- [User-assigned Managed Identity][ua-mi-access]
- [System-assigned Managed Identity][sa-mi-access]

### Apply the SecretProviderClass to your cluster

Next, deploy the SecretProviderClass you created. For example:

```bash
kubectl apply -f ./new-secretproviderclass.yaml
```

## Update and apply your cluster's deployment YAML

To ensure your cluster is using the new custom resource, update the deployment YAML. For a more comprehensive example, take a look at a [sample deployment][sample-deployment] using Service Principal to access Azure Key Vault. Be sure to follow any additional steps from your chosen method of key vault access.

```yml
kind: Pod
apiVersion: v1
metadata:
  name: busybox-secrets-store-inline
spec:
  containers:
  - name: busybox
    image: k8s.gcr.io/e2e-test-images/busybox:1.29
    command:
      - "/bin/sh"
      - "10000"
    volumeMounts:
    - name: secrets-store-inline
      mountPath: "/mnt/secrets-store"
      readOnly: true
  volumes:
    - name: secrets-store-inline
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: "azure-kvname"
        nodePublishSecretRef:                       # Only required when using service principal mode
          name: secrets-store-creds                 # Only required when using service principal mode. The name of the Kubernetes secret that contains the service principal credentials to access keyvault.
```

Apply the updated deployment to the cluster:

```bash
kubectl apply -f ./my-deployment.yaml
```

## Validate the secrets

After the pod starts, the mounted content at the volume path specified in your deployment YAML is available.

```Bash
## show secrets held in secrets-store
kubectl exec busybox-secrets-store-inline -- ls /mnt/secrets-store/

## print a test secret 'secret1' held in secrets-store
kubectl exec busybox-secrets-store-inline -- cat /mnt/secrets-store/secret1
```

## Disable Secrets Store CSI Driver

To disable the Secrets Store CSI Driver capability in an existing cluster, use the az aks command with the disable-addon `azure-keyvault-secrets-provider`:

```azurecli-interactive
az aks disable-addons -n myAKSCluster -g myResourceGroup --addons azure-keyvault-secrets-provider
```

## Next steps
<!-- Add a context sentence for the following links -->
After learning how to use the CSI Secrets Store Driver with an AKS Cluster, see the following resources:

- [Run the Azure Key Vault provider for Secrets Store CSI Driver][key-vault-provider]
- [Enable CSI drivers for Azure Disks and Azure Files on AKS][csi-storage-drivers]

<!-- Links -->
<!-- Internal -->
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-aks-create]: /cli/azure/aks#az_aks_create
[key-vault-provider]: ../key-vault/general/key-vault-integrate-kubernetes.md
[csi-storage-drivers]: ./csi-storage-drivers.md
[create-key-vault]: ../key-vault/general/quick-create-cli.md
[set-secret-key-vault]: ../key-vault/secrets/quick-create-portal.md
[aks-managed-identity]: ./use-managed-identity.md

<!-- External -->
[kube-csi]: https://kubernetes-csi.github.io/docs/
[key-vault-provider-install]: https://azure.github.io/secrets-store-csi-driver-provider-azure/getting-started/installation
[sample-secret-provider-class]: https://azure.github.io/secrets-store-csi-driver-provider-azure/getting-started/usage/#create-your-own-secretproviderclass-object
[service-principal-access]: https://azure.github.io/secrets-store-csi-driver-provider-azure/configurations/identity-access-modes/service-principal-mode/
[pod-identity-access]: https://azure.github.io/secrets-store-csi-driver-provider-azure/configurations/identity-access-modes/pod-identity-mode/
[ua-mi-access]: https://azure.github.io/secrets-store-csi-driver-provider-azure/configurations/identity-access-modes/user-assigned-msi-mode/
[sa-mi-access]: https://azure.github.io/secrets-store-csi-driver-provider-azure/configurations/identity-access-modes/system-assigned-msi-mode/
[sample-deployment]: https://raw.githubusercontent.com/Azure/secrets-store-csi-driver-provider-azure/master/examples/service-principal/pod-inline-volume-service-principal.yaml
