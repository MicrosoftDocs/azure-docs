---
title: Use KMS etcd encryption in Azure Kubernetes Service (AKS) (Preview)
description: Learn how to use kms etcd encryption with Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 03/24/2022

---

# Add KMS etcd encryption to an Azure Kubernetes Service (AKS) cluster

Enables encryption at rest of your Kubernetes data in etcd using Azure Key Vault. From the Kubernetes documentation on [Encrypting Secret Data at Rest](https://kubernetes.io/docs/tasks/administer-cluster/kms-provider/):

KMS Plugin for Key Vault is the recommended choice for using a third party tool for key management. KMS plugin simplifies key rotation, with a new data encryption key (DEK) generated for each encryption, and key encryption key (KEK) rotation controlled by the user.

Features:
* Use a key in Key Vault for etcd encryption
* Bring your own keys
* Provide encryption at rest for secrets stored in etcd

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

> [!WARNING]
> Deleting the key, or the Key Vault is not supported as it will break the AKS cluster!

> [!NOTE]
> If you need to recover your Key Vault or key, reference the [Key Vault](https://docs.microsoft.com/azure/key-vault/general/key-vault-recovery?tabs=azure-cli) 

The following limitations apply when you integrate KMS etcd encryption with Azure Kubernetes Service:
* Disabling of the KMS etc encryption feature
* Changing of key Id (including key name and key version)
* Deletion of the key, Key Vault, or the associated identity
* System-Assigned Managed Identity
* Leveraging KeyVault with PrivateLink enabled.
* Using more than 2000 secrets in a cluster.
* Bring your own (BYO) key vault from another tenant.

> [!NOTE]
> KMS does not support System-Assigned Managed Identity because keyvault access-policy is required to be set before the feature is enabled.
> System-Assigned Managed Identity is not available until cluster creation, thus there is a cycle dependency.

## Create a KeyVault and key

Create a KeyVault.
```azurecli
az keyvault create --name MyKevVault --resource-group MyResourceGroup
```
Create a key.
```azurecli
az keyvault key create --name MyKeyName --vault-name MyKevVault
```
Export Key ID.
```azurecli
export KEY_ID=$(az keyvault key show --name MyKeyName --vault-name MyKevVault --query 'key.kid' -o tsv)
echo $KEY_ID
```

## Create a user-assigned managed identity

Create a User-assigned managed identity.
```azurecli
az identity create --name MyIdentity --resource-group MyResourceGroup
```

Get Identity Object Id
```azurecli
IDENTITY_OBJECT_ID=$(az identity show --name MyIdentity --resource-group MyResourceGroup --query 'principalId' -o tsv)
```

Show Identity Object Id
```azurecli
echo $IDENTITY_OBJECT_ID
```

Get Identity Resource Id
```azurecli
IDENTITY_RESOURCE_ID=$(az identity show --name MyIdentity --resource-group MyResourceGroupE --query 'id' -o tsv)
```

Show Identity Resource Id
```azurecli
echo $IDENTITY_RESOURCE_ID
```

## Assign permissions (decrypt and encrypt) to access key vault

Create an Azure KeyVault policy.
```azurecli-interactive
az keyvault set-policy -n MyKevVault --key-permissions decrypt encrypt --object-id $IDENTITY_OBJECT_ID
```

## Create an AKS cluster with KMS

Create an AKS cluster using the [az aks create][az-aks-create] command with the --enable-keyvault-kms and --azure-keyvault-kms-key-id parameters to enable KMS.
```azurecli-interactive
az aks create --name myAKSCluster --resource-group MyResourceGroup --assign-identity $IDENTITY_RESOURCE_ID --enable-azure-keyvault-kms --azure-keyvault-kms-key-id $KEY_ID
```

## Update AKS cluster to enable KMS etcd encryption 
You may add KMS etcd encryption to an existing AKS cluster. 
```azurecli-interactive
az aks update --name myAKSCluster --resource-group MyResourceGroup --enable-azure-keyvault-kms --azure-keyvault-kms-key-id $KEY_ID
```

## Next steps

In this article, you learned how to create an AKS cluster with a KMS. 

<!-- LINKS - Internal -->
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
