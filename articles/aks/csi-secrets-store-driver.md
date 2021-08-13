---
title: Use the Secrets Store CSI driver for Azure Kubernetes Service secrets
description: Learn how to use the secrets store CSI driver to integrate secrets stores with Azure Kubernetes Service (AKS).
author: nickomang 
ms.author: nickoman
ms.service: container-service
ms.topic: how-to 
ms.date: 03/30/2021
ms.custom: template-how-to, devx-track-azurecli
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

You also need the *aks-preview* Azure CLI extension version 0.5.9 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. If you already have the extension installed, update to the latest available version by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

## Create an AKS cluster with Secrets Store CSI Driver support

First, create an Azure resource group:

```azurecli-interactive
az group create -n myResourceGroup -l eastus2
```

To create an AKS cluster with Secrets Store CSI Driver capability, use the [az aks create][az-aks-create] command with the addon `azure-keyvault-secrets-provider`.

```azurecli-interactive
az aks create -n myAKSCluster -g myResourceGroup --enable-addons azure-keyvault-secrets-provider --enable-managed-identity
```

A user-assigned managed identity is created by the addon for the purpose of accessing Azure resources, named `azurekeyvaultsecretsprovider-*`. We can use this identity to connect to the Azure Key Vault where our secrets will be stored. Take note of the identity's `clientId` in the output:

```json
...,
 "addonProfiles": {
    "azureKeyvaultSecretsProvider": {
      ...,
      "identity": {
        "clientId": "<client-id>",
        ...
      }
    }
```

## Upgrade an existing AKS cluster with Secrets Store CSI Driver support

To upgrade an existing AKS cluster with Secrets Store CSI Driver capability, use the [az aks enable-addons][az-aks-enable-addons] command with the addon `azure-keyvault-secrets-provider`:

```azurecli-interactive
az aks enable-addons --addons azure-keyvault-secrets-provider --name myAKSCluster --resource-group myResourceGroup
```

As stated above, the addon creates a user-assigned managed identity that can be used to authenticate to Azure Key Vault.

## Verify Secrets Store CSI Driver installation

The above will install the Secrets Store CSI Driver and the Azure Key Vault provider on your nodes. Verify completion by listing all pods with the secrets-store-csi-driver and secrets-store-provider-azure labels in the kube-system namespace, and ensure your output looks similar to the following:

```bash
kubectl get pods -n kube-system -l 'app in (secrets-store-csi-driver, secrets-store-provider-azure)'

NAMESPACE     NAME                                     READY   STATUS    RESTARTS   AGE
kube-system   aks-secrets-store-csi-driver-4vpkj       3/3     Running   2          4m25s
kube-system   aks-secrets-store-csi-driver-ctjq6       3/3     Running   2          4m21s
kube-system   aks-secrets-store-csi-driver-tlvlq       3/3     Running   2          4m24s
kube-system   aks-secrets-store-provider-azure-5p4nb   1/1     Running   0          4m21s
kube-system   aks-secrets-store-provider-azure-6pqmv   1/1     Running   0          4m24s
kube-system   aks-secrets-store-provider-azure-f5qlm   1/1     Running   0          4m25s
```

## Enabling and disabling autorotation

> [!NOTE]
> When enabled, the Secrets Store CSI Driver will update the pod mount and the Kubernetes Secret defined in secretObjects of the SecretProviderClass by polling for changes every two minutes.

To enable autorotation of secrets, use the flag `enable-secret-rotation` when creating your cluster:

```azurecli-interactive
az aks create -n myAKSCluster2 -g myResourceGroup --enable-addons azure-keyvault-secrets-provider --enable-secret-rotation
```

Or update an existing cluster with the addon enabled:

```azurecli-interactive
az aks update -g myResourceGroup -n myAKSCluster2 --enable-secret-rotation
```

To disable, use the flag `disable-secret-rotation`:

```azurecli-interactive
az aks update -g myResourceGroup -n myAKSCluster2 --disable-secret-rotation
```

## Create or use an existing Azure Key Vault

In addition to an AKS cluster, you will need an Azure Key Vault resource containing the secret content. Keep in mind that the Key Vault's name must be globally unique.

```azurecli
az keyvault create -n <keyvault-name> -g myResourceGroup -l eastus2
```

Azure Key Vault can store keys, secrets, and certificates. In this example, we'll set a plain text secret called `ExampleSecret`:

```azurecli
az keyvault secret set --vault-name <keyvault-name> -n ExampleSecret --value MyAKSExampleSecret
```

Take note of the following properties for use in the next section:

- Name of secret object in Key Vault
- Object type (secret, key, or certificate)
- Name of your Azure Key Vault resource
- Azure Tenant ID the Subscription belongs to

## Provide identity to access Azure Key Vault

Use the values from the previous steps to set permissions, allowing the addon-created managed identity to access keyvault objects:

```azurecli
az keyvault set-policy -n <keyvault-name> --<object-type>-permissions get --spn <client-id>
```

## Create and apply your own SecretProviderClass object

To use and configure the Secrets Store CSI driver for your AKS cluster, create a SecretProviderClass custom resource. Ensure the `objects` array matches the objects you've store in the Azure Key Vault instance:

```yml
apiVersion: secrets-store.csi.x-k8s.io/v1alpha1
kind: SecretProviderClass
metadata:
  name: <keyvault-name>
spec:
  provider: azure
  parameters:
    keyvaultName: "<keyvault-name>"       # The name of the Azure Key Vault
    useVMManagedIdentity: "true"         
    userAssignedIdentityID: "<client-id>" # The clientId of the addon-created managed identity
    cloudName: ""                         # [OPTIONAL for Azure] if not provided, Azure environment will default to AzurePublicCloud 
    objects:  |
      array:
        - |
          objectName: <secret-name>       # In this example, 'ExampleSecret'   
          objectType: secret              # Object types: secret, key or cert
          objectVersion: ""               # [OPTIONAL] object versions, default to latest if empty
    tenantId: "<tenant-id>"               # the tenant ID containing the Azure Key Vault instance
```

For more information, see [Create your own SecretProviderClass Object][sample-secret-provider-class]. Be sure to use the values you took note of above.

### Apply the SecretProviderClass to your cluster

Next, deploy the SecretProviderClass you created. For example:

```bash
kubectl apply -f ./new-secretproviderclass.yaml
```

## Update and apply your cluster's deployment YAML

To ensure your cluster is using the new custom resource, update the deployment YAML. For example:

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
      - "/bin/sleep"
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
          secretProviderClass: "<keyvault-name>"
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

## print a test secret 'ExampleSecret' held in secrets-store
kubectl exec busybox-secrets-store-inline -- cat /mnt/secrets-store/ExampleSecret
```

## Disable Secrets Store CSI Driver on an existing AKS Cluster

To disable the Secrets Store CSI Driver capability in an existing cluster, use the [az aks disable-addons][az-aks-disable-addons] command with the `azure-keyvault-secrets-provider` flag:

```azurecli-interactive
az aks disable-addons --addons azure-keyvault-secrets-provider -g myResourceGroup -n myAKSCluster
```

## Next steps
<!-- Add a context sentence for the following links -->
After learning how to use the CSI Secrets Store Driver with an AKS Cluster, see the following resources:

- [Enable CSI drivers for Azure Disks and Azure Files on AKS][csi-storage-drivers]

<!-- Links -->
<!-- Internal -->
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-enable-addons]: /cli/azure/aks#az_aks_enable_addons
[az-aks-disable-addons]: /cli/azure/aks#az_aks_disable_addons
[key-vault-provider]: ../key-vault/general/key-vault-integrate-kubernetes.md
[csi-storage-drivers]: ./csi-storage-drivers.md
[create-key-vault]: ../key-vault/general/quick-create-cli.md
[set-secret-key-vault]: ../key-vault/secrets/quick-create-portal.md
[aks-managed-identity]: ./use-managed-identity.md

<!-- External -->
[kube-csi]: https://kubernetes-csi.github.io/docs/
[key-vault-provider-install]: https://azure.github.io/secrets-store-csi-driver-provider-azure/getting-started/installation
[sample-secret-provider-class]: https://azure.github.io/secrets-store-csi-driver-provider-azure/getting-started/usage/#create-your-own-secretproviderclass-object
