---
title: Enable double encryption at rest - Azure CLI - managed disks
description: Enable double encryption at rest for your managed disk data using the Azure CLI.
author: roygara
ms.date: 02/06/2023
ms.topic: how-to
ms.author: rogarana
ms.service: azure-disk-storage
ms.custom: references_regions, devx-track-azurecli
---

# Use the Azure CLI to enable double encryption at rest for managed disks

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

Azure Disk Storage supports double encryption at rest for managed disks. For conceptual information on double encryption at rest, and other managed disk encryption types, see the [Double encryption at rest](../disk-encryption.md#double-encryption-at-rest) section of our disk encryption article.

## Restrictions

Double encryption at rest isn't currently supported with either Ultra Disks or Premium SSD v2 disks.

## Prerequisites

Install the latest [Azure CLI](/cli/azure/install-az-cli2) and sign in to an Azure account with [az login](/cli/azure/reference-index).

## Getting started

1. Create an instance of Azure Key Vault and encryption key.

    When creating the Key Vault instance, you must enable soft delete and purge protection. Soft delete ensures that the Key Vault holds a deleted key for a given retention period (90 day default). Purge protection ensures that a deleted key can't be permanently deleted until the retention period lapses. These settings protect you from losing data due to accidental deletion. These settings are mandatory when using a Key Vault for encrypting managed disks.

    
    ```azurecli
    subscriptionId=yourSubscriptionID
    rgName=yourResourceGroupName
    location=westcentralus
    keyVaultName=yourKeyVaultName
    keyName=yourKeyName
    diskEncryptionSetName=yourDiskEncryptionSetName
    diskName=yourDiskName

    az account set --subscription $subscriptionId

    az keyvault create -n $keyVaultName -g $rgName -l $location --enable-purge-protection true --enable-soft-delete true

    az keyvault key create --vault-name $keyVaultName -n $keyName --protection software
    ```

1. Get the key URL of the key you created with `az keyvault key show`.

    ```azurecli
    az keyvault key show --name $keyName --vault-name $keyVaultName
    ```

1.    Create a DiskEncryptionSet with encryptionType set as EncryptionAtRestWithPlatformAndCustomerKeys. Replace `yourKeyURL` with the URL you received from `az keyvault key show`. 
    
        ```azurecli
        az disk-encryption-set create --resource-group $rgName --name $diskEncryptionSetName --key-url yourKeyURL --source-vault $keyVaultName --encryption-type EncryptionAtRestWithPlatformAndCustomerKeys
        ```

1.    Grant the DiskEncryptionSet resource access to the key vault. 

        > [!NOTE]
        > It may take few minutes for Azure to create the identity of your DiskEncryptionSet in your Microsoft Entra ID. If you get an error like "Cannot find the Active Directory object" when running the following command, wait a few minutes and try again.

        ```azurecli
        desIdentity=$(az disk-encryption-set show -n $diskEncryptionSetName -g $rgName --query [identity.principalId] -o tsv)

        az keyvault set-policy -n $keyVaultName -g $rgName --object-id $desIdentity --key-permissions wrapkey unwrapkey get
        ```

## Next steps

Now that you've created and configured these resources, you can use them to secure your managed disks. The following links contain example scripts, each with a respective scenario, that you can use to secure your managed disks.

- [Azure Resource Manager template samples](https://github.com/Azure-Samples/managed-disks-powershell-getting-started/tree/master/DoubleEncryption)
- [Enable customer-managed keys with server-side encryption - Examples](disks-enable-customer-managed-keys-cli.md#examples)
