---
title: Use KMS etcd encryption in Azure Kubernetes Service (AKS) (Preview)
description: Learn how to use kms etc encryption with Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 03/21/2022

---

# Add KMS etcd encryption to an Azure Kubernetes Service (AKS) cluster

Enables encryption at rest of your Kubernetes data in etcd using Azure Key Vault. From the Kubernetes documentation on Encrypting Secret Data at Rest:

[KMS Plugin for Key Vault is] the recommended choice for using a third party tool for key management. Simplifies key rotation, with a new data encryption key (DEK) generated for each encryption, and key encryption key (KEK) rotation controlled by the user.

Features
* Use a key in Key Vault for etcd encryption
* Use a key in Key Vault protected by a Hardware Security Module (HSM)
* Bring your own keys
* Store secrets, keys, and certs in etcd, but manage them as part of Kubernetes

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

The following limitations apply when you integrate KMS with Azure Kubernetes Service:
* Changing of keys
* Disabling KMS
* System-Assigned Managed Identity
* Leveraging KeyVault with PrivateLink enabled.
* Using more than 2000 secrets in a cluster.

## Create a KeyVault and key

```azurecli
az keyvault create --name MyKevVault --resource-group MyResourceGroup
```

```azurecli
az keyvault key create --name MyKeyName --vault-name MyKevVault
```

```azurecli
export KEY_ID=$(az keyvault key show --name MyKeyName --vault-name MyKevVault --query 'key.kid' -o tsv)
echo $KEY_ID
```

## Create a user-assigned managed identity

```azurecli
az identity create --name MyIdentity --resource-group MyResourceGroup
```

```azurecli
IDENTITY_OBJECT_ID=$(az identity show --name MyIdentity --resource-group MyResourceGroup --query 'principalId' -o tsv)
```

```azurecli
echo $IDENTITY_OBJECT_ID
```

```azurecli
IDENTITY_RESOURCE_ID=$(az identity show --name MyIdentity --resource-group MyResourceGroupE --query 'id' -o tsv)
```

```azurecli
echo $IDENTITY_RESOURCE_ID
```


## Assign permissions (decrypt and encrypt) to access key vault

```azurecli-interactive
az keyvault set-policy -n $KEYVAULT_NAME --key-permissions decrypt encrypt --object-id $IDENTITY_OBJECT_ID
```

## Create an AKS cluster with KMS

```azurecli-interactive
az keyvault set-policy -n $KEYVAULT_NAME --key-permissions decrypt encrypt --object-id $IDENTITY_OBJECT_ID
```

## Next steps

In this article, you learned how to create an AKS cluster with a KMS. 

<!-- LINKS - Internal -->
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[azure-cli-install]: /cli/azure/install-azure-cli
