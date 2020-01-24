---
title: Use a customer-managed key to encrypt Azure disks in Azure Kubernetes Service (AKS)
description: Bring your own keys (BYOK) to encrypt AKS OS and Data disks.
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 01/12/2020
ms.author: mlearned
---

# Bring your own keys (BYOK) with Azure disks in Azure Kubernetes Service (AKS)

Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply [customer-managed keys][customer-managed-keys] to use for encryption of both the OS and data disks for your AKS clusters.

> [!NOTE]
> BYOK Linux and Windows based AKS clusters are available in [Azure regions][supported-regions] that support server side encryption of Azure managed disks.

## Before you begin

* This article assumes that you are creating a *new AKS cluster*.

* You must enable soft delete and purge protection for *Azure Key Vault* when using Key Vault to encrypt managed disks.

* You need the Azure CLI version 2.0.79 or later and the aks-preview 0.4.26 extension

> [!IMPORTANT]
> AKS preview features are self-service opt-in. Previews are provided "as-is" and "as available" and are excluded from the service level agreements and limited warranty. AKS Previews are partially covered by customer support on best effort basis. As such, these features are not meant for production use. For additional infromation, please see the following support articles:
>
> * [AKS Support Policies](support-policies.md)
> * [Azure Support FAQ](faq.md)

## Install latest AKS CLI preview extension

To use customer-managed keys, you need the *aks-preview* CLI extension version 0.4.26 or higher. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, then check for any available updates using the [az extension update][az-extension-update] command:

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
```

## Create an Azure Key Vault instance

Use an Azure Key Vault instance to store your keys.  You can optionally use the Azure portal to [Configure customer-managed keys with Azure Key Vault][byok-azure-portal]

Create a new *resource group*, then create a new *Key Vault* instance and enable soft delete and purge protection.  Ensure you use the same region and resource group names for each command.

```azurecli-interactive
# Optionally retrieve Azure region short names for use on upcoming commands
az account list-locations
```

```azurecli-interactive
# Create new resource group in a supported Azure region
az group create -l myAzureRegionName -n myResourceGroup

# Create an Azure Key Vault resource in a supported Azure region
az keyvault create -n myKeyVaultName -g myResourceGroup -l myAzureRegionName  --enable-purge-protection true --enable-soft-delete true
```

## Create an instance of a DiskEncryptionSet

Replace *myKeyVaultName* with the name of your key vault.  You will also need a *key* stored in Azure Key Vault to complete the following steps.  Either store your existing Key in the Key Vault you created on the previous steps, or [generate a new key][key-vault-generate] and replace *myKeyName* below with the name of your key.
    
```azurecli-interactive
# Retrieve the Key Vault Id and store it in a variable
keyVaultId=$(az keyvault show --name myKeyVaultName --query [id] -o tsv)

# Retrieve the Key Vault key URL and store it in a variable
keyVaultKeyUrl=$(az keyvault key show --vault-name myKeyVaultName  --name myKeyName  --query [key.kid] -o tsv)

# Create a DiskEncryptionSet
az disk-encryption-set create -n myDiskEncryptionSetName  -l myAzureRegionName  -g myResourceGroup --source-vault $keyVaultId --key-url $keyVaultKeyUrl 
```

## Grant the DiskEncryptionSet access to key vault

Use the DiskEncryptionSet and resource groups you created on the prior steps, and grant the DiskEncryptionSet resource access to the Azure Key Vault.

```azurecli-interactive
# Retrieve the DiskEncryptionSet value and set a variable
desIdentity=$(az disk-encryption-set show -n myDiskEncryptionSetName  -g myResourceGroup --query [identity.principalId] -o tsv)

# Update security policy settings
az keyvault set-policy -n myKeyVaultName -g myResourceGroup --object-id $desIdentity --key-permissions wrapkey unwrapkey get

# Assign the reader role
az role assignment create --assignee $desIdentity --role Reader --scope $keyVaultId
```

## Create a new AKS cluster and encrypt the OS disk

Create a **new resource group** and AKS cluster, then use your key to encrypt the OS disk. Customer-managed keys are only supported in Kubernetes versions greater than 1.17. 

> [!IMPORTANT]
> Ensure you create a new resoruce group for your AKS cluster

```azurecli-interactive
# Retrieve the DiskEncryptionSet value and set a variable
diskEncryptionSetId=$(az resource show -n diskEncryptionSetName -g myResourceGroup --resource-type "Microsoft.Compute/diskEncryptionSets" --query [id] -o tsv)

# Create a resource group for the AKS cluster
az group create -n myResourceGroup -l myAzureRegionName

# Create the AKS cluster
az aks create -n myAKSCluster -g myResourceGroup --node-osdisk-diskencryptionset-id $diskEncryptionSetId --kubernetes-version 1.17.0 --generate-ssh-keys
```

When new node pools are added to the cluster created above, the customer-managed key provided during the create is used to encrypt the OS disk.

## Encrypt your AKS cluster data disk

You can also encrypt the AKS data disks with your own keys.

> [!IMPORTANT]
> Ensure you have the proper AKS credentials. The Service principal will need to have contributor access to the resource group where the diskencryptionset is deployed. Otherwise, you will get an error suggesting that the service principal does not have permissions.

```azurecli-interactive
# Retrieve your Azure Subscription Id from id property as shown below
az account list
```

```
someuser@Azure:~$ az account list
[
  {
    "cloudName": "AzureCloud",
    "id": "666e66d8-1e43-4136-be25-f25bb5de5893",
    "isDefault": true,
    "name": "MyAzureSubscription",
    "state": "Enabled",
    "tenantId": "3ebbdf90-2069-4529-a1ab-7bdcb24df7cd",
    "user": {
      "cloudShellID": true,
      "name": "someuser@azure.com",
      "type": "user"
    }
  }
]
```

Create a file called **byok-azure-disk.yaml** that contains the following information.  Replace myAzureSubscriptionId, myResourceGroup, and myDiskEncrptionSetName with your values, and apply the yaml.  Make sure to use the resource group where your DiskEncryptionSet is deployed.  If you use the Azure Cloud Shell, this file can be created using vi or nano as if working on a virtual or physical system:

```
kind: StorageClass
apiVersion: storage.k8s.io/v1  
metadata:
  name: hdd
provisioner: kubernetes.io/azure-disk
parameters:
  skuname: Standard_LRS
  kind: managed
  diskEncryptionSetID: "/subscriptions/{myAzureSubscriptionId}/resourceGroups/{myResourceGroup}/providers/Microsoft.Compute/diskEncryptionSets/{myDiskEncryptionSetName}"
```
Next, run this deployment in your AKS cluster:
```azurecli-interactive
# Get credentials
az aks get-credentials --name myAksCluster --resource-group myResourceGroup --output table

# Update cluster
kubectl apply -f byok-azure-disk.yaml
```

## Limitations

* BYOK is only currently available in GA and Preview in certain [Azure regions][supported-regions]
* OS Disk Encryption supported with Kubernetes version 1.17 and above   
* Available only in regions where BYOK is supported
* Encryption with customer-managed keys currently is for new AKS clusters only, existing clusters cannot be upgraded
* AKS cluster using Virtual Machine Scale Sets are required, no support for Virtual Machine Availability Sets


## Next steps

Review [best practices for AKS cluster security][best-practices-security]

<!-- LINKS - external -->

<!-- LINKS - internal -->
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[best-practices-security]: /azure/aks/operator-best-practices-cluster-security
[byok-azure-portal]: /azure/storage/common/storage-encryption-keys-portal
[customer-managed-keys]: /azure/virtual-machines/windows/disk-encryption#customer-managed-keys
[key-vault-generate]: /azure/key-vault/key-vault-manage-with-cli2
[supported-regions]: /azure/virtual-machines/windows/disk-encryption#supported-regions
