---
title: Use a customer-managed key to encrypt Azure disks in Azure Kubernetes Service (AKS)
description: Bring your own keys (BYOK) to encrypt AKS OS and Data disks.
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 01/01/2020
ms.author: mlearned
---

# Bring your own keys (BYOK) with Azure disks in Azure Kubernetes Service (AKS)

Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply [customer-managed keys][https://docs.microsoft.com/azure/virtual-machines/windows/disk-encryption#customer-managed-keys-public-preview] to use for encryption of both the OS and data disks for your AKS clusters.

> [!NOTE]
> New AKS clusters using Virtual Machine Scale Sets are required.  Existing clusters are not currently supported.

## Before you begin

* This article assumes that you are creating a new AKS cluster.  You will also need to use or create an instance of Azure Key Vault to store your encryption keys.

* You must enable soft delete and purge protection for Azure Key Vault when using Key Vault to encrypt managed disks.

* You need the Azure CLI version 2.0.77 or later and the aks-preview 0.4.18 extension

## Current supported regions

* Australia East
* Canada Central
* Canada East
* Central US
* East Asia
* East US
* East US 2
* France
* North Central US
* UK South
* North Europe
* South East Asia
* South Central US
* West Central US
* West Europe
* West US
* West US 2

## Install latest AKS CLI preview extension

To use private clusters, you need the *aks-preview* CLI extension version 0.4.18 or higher. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, then check for any available updates using the [az extension update][az-extension-update] command::

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```
> [!CAUTION]
> When you register a feature on a subscription, you can't currently un-register that feature. After you enable some preview features, defaults may be used for all AKS clusters then created in the subscription. Don't enable preview features on production subscriptions. Use a separate subscription to test preview features and gather feedback.

## Create Azure Key Valt instance to store your keys

Create a new Key Valut instance and enable soft delete and purge protection.

```azurecli-interactive
az keyvault create -n $keyVaultName -g $rgName -l $location --enable-purge-protection true --enable-soft-delete true
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKSPrivateLinkPreview')].{Name:name,State:properties.state}"
```

## Create a Disk Encryption Set

keyVaultId=$(az keyvault show --name $keyVaultName --query [id] -o tsv)
 
keyVaultKeyUrl=$(az keyvault key show --vault-name $keyVaultName --name $keyName --query [key.kid] -o tsv)
 
az group deployment create -g $rgName --template-uri "https://raw.githubusercontent.com/ramankumarlive/manageddiskscmkpreview/master/CreateDiskEncryptionSet.json" --parameters "diskEncryptionSetName=$diskEncryptionSetName" "keyVaultId=$keyVaultId" "keyVaultKeyUrl=$keyVaultKeyUrl" "region=$location" 

## Grant the Disk Encryption Set access to Key Vault

```azurecli-interactive
desIdentity=$(az ad sp list --display-name $diskEncryptionSetName --query [].[objectId] -o tsv) 
az keyvault set-policy -n $keyVaultName -g $rgName --object-id $desIdentity --key-permissions wrapkey unwrapkey get 
az role assignment create --assignee $desIdentity --role Reader --scope $keyVaultId 
```

## Create an AKS cluster with and encrypt the OS disk with a customer-manged key

Create a new AKS cluster and use your key to encrypt the OS disk.

```azurecli-interactive
diskEncryptionSetId=$(az resource show -n $diskEncryptionSetName -g ssecmktesting --resource-type "Microsoft.Compute/diskEncryptionSets" --query [id] -o tsv)
az group create -n resourceGroupName -l westcentralus
az aks create -n clusterName -g resourceGroupName --node-osdisk-diskencryptionsetid diskEncryptionId
```

## Encrypt an AKS cluster data disk with a customer-managed key

## Limitations

> OS Disk Encryption supported with Kubernetes version 1.17 and above   
> Available only in regions where BYOK is supported
> This is currently for new AKS clusters only, existing clusters cannot be upgraded
> AKS cluster using Virtual Machine Scale Sets are required, no support Virtual Machine Availablity Sets


## Next steps

For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

Learn more about Kubernetes persistent volumes using Azure disks.

> [!div class="nextstepaction"]
> [Kubernetes plugin for Azure disks][azure-disk-volume]

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/

<!-- LINKS - internal -->
[azure-disk-volume]: azure-disk-volume.md
[azure-files-pvc]: azure-files-dynamic-pv.md
[premium-storage]: ../virtual-machines/windows/disks-types.md
[az-disk-list]: /cli/azure/disk#az-disk-list
[az-snapshot-create]: /cli/azure/snapshot#az-snapshot-create
[az-disk-create]: /cli/azure/disk#az-disk-create
[az-disk-show]: /cli/azure/disk#az-disk-show
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[storage-class-concepts]: concepts-storage.md#storage-classes
