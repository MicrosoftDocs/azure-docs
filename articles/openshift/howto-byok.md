---
title: Encrypt OS disks with a customer-managed key (CMK) on Azure Red Hat OpenShift
description: Encrypt OS disks with a customer-managed key (CMK) on Azure Red Hat OpenShift
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: encryption, byok, deploy, openshift, red hat, key
ms.topic: how-to
ms.date: 05/05/2023
ms.custom: template-how-to, ignite-fall-2021, devx-track-azurecli 
ms.devlang: azurecli
---

# Encrypt OS disks with a customer-managed key on Azure Red Hat OpenShift

By default, the OS disks of the virtual machines in an Azure Red Hat OpenShift cluster were encrypted with auto-generated keys managed by Microsoft Azure. For additional security, customers can encrypt the OS disks with self-managed keys when deploying an Azure Red Hat OpenShift cluster. This feature allows for more control by encrypting confidential data with customer-managed keys (CMK).

Clusters created with customer-managed keys have a default storage class enabled with their keys. Therefore, both OS disks and data disks are encrypted by these keys. The customer-managed keys are stored in Azure Key Vault. 

For more information about using Azure Key Vault to create and maintain keys, see [Server-side encryption of Azure Disk Storage](../key-vault/general/basic-concepts.md) in the Microsoft Azure documentation.

With host-based encryption, the data stored on the VM host of your Azure Red Hat OpenShift agent nodes' VMs is encrypted at rest and flows encrypted to the Storage service. Host-base encryption means the temp disks are encrypted at rest with platform-managed keys. 

The cache of OS and data disks is encrypted at rest with either platform-managed keys or customer-managed keys, depending on the encryption type set on those disks. By default, when using Azure Red Hat OpenShift, OS and data disks are encrypted at rest with platform-managed keys, meaning that the caches for these disks are also by default encrypted at rest with platform-managed keys. 

You can specify your own managed keys following the encryption steps below. The cache for these disks also will be encrypted using the key that you specify in this step.

## Limitation
It's the responsibility of customers to maintain the Key Vault and Disk Encryption Set in Azure. Failure to maintain the keys will result in broken Azure Red Hat OpenShift clusters. The VMs will stop working and, as a result, the entire Azure Red Hat OpenShift cluster will stop functioning. 

The Azure Red Hat OpenShift Engineering team can't access the keys. Therefore, they can't back up, replicate, or retrieve the keys. 

For details about using Disk Encryption Sets to manage your encryption keys, see [Server-side encryption of Azure Disk Storage](../virtual-machines/disk-encryption.md) in the Microsoft Azure documentation.

## Prerequisites
* [Verify your permissions](tutorial-create-cluster.md#verify-your-permissions). You must have either Contributor and User Access Administrator permissions or Owner permissions.
* If you have multiple Azure subscriptions, register the resource providers. For registration details, see [Register the resource providers](tutorial-create-cluster.md#register-the-resource-providers).
* You will need to have the EncryptionAtHost feature enabled on your subscription. You can enable it by running:

    ```azurecli-interactive
    az feature register --namespace Microsoft.Compute --name EncryptionAtHost
    ```
* You can check the current status of the feature by running:

    ```azurecli-interactive
    az feature show --namespace Microsoft.Compute --name EncryptionAtHost
    ```

## Create a virtual network containing two empty subnets
Create a virtual network containing two empty subnets. If you have an existing virtual network that meets your needs, you can skip this step. To review the procedure of creating a virtual network, see [Create a virtual network containing two empty subnets](tutorial-create-cluster.md#create-a-virtual-network-containing-two-empty-subnets).

## Create an Azure Key Vault instance
You must use an Azure Key Vault instance to store your keys. Create a new Key Vault with purge protection enabled. Then, create a new key within the Key Vault to store your own custom key.

1. Set more environment permissions:
    ```
    export KEYVAULT_NAME=$USER-enckv
    export KEYVAULT_KEY_NAME=$USER-key
    export DISK_ENCRYPTION_SET_NAME=$USER-des
    ```
1. Create a Key Vault and a key in the Key Vault:
    ```azurecli-interactive
    az keyvault create -n $KEYVAULT_NAME \
                   -g $RESOURCEGROUP \
                   -l $LOCATION \
                   --enable-purge-protection true

    az keyvault key create --vault-name $KEYVAULT_NAME \
                           -n $KEYVAULT_KEY_NAME \
                           --protection software

    KEYVAULT_ID=$(az keyvault show --name $KEYVAULT_NAME --query "[id]" -o tsv)

    KEYVAULT_KEY_URL=$(az keyvault key show --vault-name $KEYVAULT_NAME \
                                            --name $KEYVAULT_KEY_NAME \
                                            --query "[key.kid]" -o tsv)
    ```

## Create an Azure Disk Encryption Set
The Azure Disk Encryption Set is used as the reference point for disks in Azure Red Hat OpenShift clusters. It's connected to the Azure Key Vault that you created in the previous step, and pulls the customer-managed keys from that location.
```azurecli-interactive
az disk-encryption-set create -n $DISK_ENCRYPTION_SET_NAME \
                              -l $LOCATION \
                              -g $RESOURCEGROUP \
                              --source-vault $KEYVAULT_ID \
                              --key-url $KEYVAULT_KEY_URL

DES_ID=$(az disk-encryption-set show -n $DISK_ENCRYPTION_SET_NAME -g $RESOURCEGROUP --query 'id' -o tsv)

DES_IDENTITY=$(az disk-encryption-set show -n $DISK_ENCRYPTION_SET_NAME \
                                           -g $RESOURCEGROUP \
                                           --query "[identity.principalId]" \
                                           -o tsv)
```

## Grant permissions for the Disk Encryption Set to access the Key Vault
Use the Disk Encryption Set that you created in the previous step, and grant permission for the Disk Encryption Set to access and use the Azure Key Vault.
```azurecli-interactive
az keyvault set-policy -n $KEYVAULT_NAME \
                       -g $RESOURCEGROUP \
                       --object-id $DES_IDENTITY \
                       --key-permissions wrapkey unwrapkey get
```

## Create an Azure Red Hat OpenShift cluster
Create an Azure Red Hat OpenShift cluster to use the customer-managed keys.
```azurecli-interactive
az aro create --resource-group $RESOURCEGROUP \
              --name $CLUSTER  \
              --vnet aro-vnet  \
              --master-subnet master-subnet \
              --worker-subnet worker-subnet \
              --disk-encryption-set $DES_ID
```
After you create the Azure Red Hat OpenShift cluster, all VMs are encrypted with the customer-managed encryption keys.

To verify that you configured the keys correctly, run the following commands:
1. Get the name of the cluster Resource Group where the cluster VMs, disks, and so on are located:
    ```azurecli-interactive
    CLUSTERRESOURCEGROUP=$(az aro show --resource-group $RESOURCEGROUP --name $CLUSTER --query 'clusterProfile.resourceGroupId' -o tsv | cut -d '/' -f 5)
    ```
2. Check that the disks have the correct Disk Encryption Set attached:
    ```azurecli-interactive
    az disk list -g $CLUSTERRESOURCEGROUP --query '[].encryption'
    ```
    The field `diskEncryptionSetId` in the output must point to the Disk Encryption Set that you specified while creating the Azure Red Hat OpenShift cluster.
