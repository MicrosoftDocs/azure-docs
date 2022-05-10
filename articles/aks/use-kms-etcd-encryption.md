---
title: Use KMS etcd encryption in Azure Kubernetes Service (AKS) (Preview)
description: Learn how to use kms etcd encryption with Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 04/11/2022

---

# Add KMS etcd encryption to an Azure Kubernetes Service (AKS) cluster (Preview)

This article shows you how to enable encryption at rest for your Kubernetes data in etcd using Azure Key Vault with Key Management Service (KMS) plugin. The KMS plugin allows you to:

* Use a key in Key Vault for etcd encryption
* Bring your own keys
* Provide encryption at rest for secrets stored in etcd

For more information on using the KMS plugin, see [Encrypting Secret Data at Rest](https://kubernetes.io/docs/tasks/administer-cluster/kms-provider/).

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI installed](/cli/azure/install-azure-cli).

### Install the `aks-preview` Azure CLI

You also need the *aks-preview* Azure CLI extension version 0.5.58 or later. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview
# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

### Register the `AzureKeyVaultKmsPreview` preview feature

To use the feature, you must also enable the `AzureKeyVaultKmsPreview` feature flag on your subscription.

Register the `AzureKeyVaultKmsPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "AzureKeyVaultKmsPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AzureKeyVaultKmsPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Limitations

The following limitations apply when you integrate KMS etcd encryption with AKS:

* Disabling of the KMS etcd encryption feature.
* Changing of key ID, including key name and key version.
* Deletion of the key, Key Vault, or the associated identity.
* KMS etcd encryption doesn't work with System-Assigned Managed Identity. The keyvault access-policy is required to be set before the feature is enabled. In addition, System-Assigned Managed Identity isn't available until cluster creation, thus there's a cycle dependency.
* Using Azure Key Vault with PrivateLink enabled.
* Using more than 2000 secrets in a cluster.
* Managed HSM Support
* Bring your own (BYO) Azure Key Vault from another tenant.


## Create a KeyVault and key

> [!WARNING]
> Deleting the key or the Azure Key Vault is not supported and will cause your cluster to become unstable.
> 
> If you need to recover your Key Vault or key, see the [Azure Key Vault recovery management with soft delete and purge protection](../key-vault/general/key-vault-recovery.md?tabs=azure-cli) documentation.

Use `az keyvault create` to create a KeyVault.

```azurecli
az keyvault create --name MyKeyVault --resource-group MyResourceGroup
```

Use `az keyvault key create` to create a key.

```azurecli
az keyvault key create --name MyKeyName --vault-name MyKeyVault
```

Use `az keyvault key show` to export the Key ID.

```azurecli
export KEY_ID=$(az keyvault key show --name MyKeyName --vault-name MyKeyVault --query 'key.kid' -o tsv)
echo $KEY_ID
```

The above example stores the Key ID in *KEY_ID*.
 
## Create a user-assigned managed identity

Use `az identity create` to create a User-assigned managed identity.

```azurecli
az identity create --name MyIdentity --resource-group MyResourceGroup
```

Use `az identity show` to get Identity Object ID.

```azurecli
IDENTITY_OBJECT_ID=$(az identity show --name MyIdentity --resource-group MyResourceGroup --query 'principalId' -o tsv)
echo $IDENTITY_OBJECT_ID
```

The above example stores the value of the Identity Object ID in *IDENTITY_OBJECT_ID*.

Use `az identity show` to get Identity Resource ID.

```azurecli
IDENTITY_RESOURCE_ID=$(az identity show --name MyIdentity --resource-group MyResourceGroup --query 'id' -o tsv)
echo $IDENTITY_RESOURCE_ID
```

The above example stores the value of the Identity Resource ID in *IDENTITY_RESOURCE_ID*.

## Assign permissions (decrypt and encrypt) to access key vault

Use `az keyvault set-policy` to create an Azure KeyVault policy.

```azurecli-interactive
az keyvault set-policy -n MyKeyVault --key-permissions decrypt encrypt --object-id $IDENTITY_OBJECT_ID
```

## Create an AKS cluster with KMS etcd encryption enabled

Create an AKS cluster using the [az aks create][az-aks-create] command with the `--enable-azure-keyvault-kms` and `--azure-keyvault-kms-key-id` parameters to enable KMS etcd encryption.

```azurecli-interactive
az aks create --name myAKSCluster --resource-group MyResourceGroup --assign-identity $IDENTITY_RESOURCE_ID --enable-azure-keyvault-kms --azure-keyvault-kms-key-id $KEY_ID
```

## Update an exiting AKS cluster to enable KMS etcd encryption

Use [az aks update][az-aks-update] with the `--enable-azure-keyvault-kms` and `--azure-keyvault-kms-key-id` parameters to enable KMS etcd encryption on an existing cluster.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group MyResourceGroup --enable-azure-keyvault-kms --azure-keyvault-kms-key-id $KEY_ID
```

Use below command to update all secrets. Otherwise, the old secrets aren't encrypted. 

```azurecli-interactive
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!-- LINKS - Internal -->
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az extension add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-aks-update]: /cli/azure/aks#az_aks_update
