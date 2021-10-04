---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 08/24/2021
 ms.author: rogarana
 ms.custom: include file, devx-track-azurecli
---
1. Make sure that you have installed the latest [Azure CLI](/cli/azure/install-az-cli2) and logged to an Azure account in with [az login](/cli/azure/reference-index).

1. Create an instance of Azure Key Vault and encryption key.

    When creating the Key Vault instance, you must enable purge protection. Purge protection ensures that a deleted key cannot be permanently deleted until the retention period lapses. These settings protect you from losing data due to accidental deletion. These settings are mandatory when using a Key Vault for encrypting managed disks.

    > [!IMPORTANT]
    > Do not camel case the region, if you do so you may experience problems when assigning additional disks to the resource in the Azure portal.

    ```azurecli
    subscriptionId=yourSubscriptionID
    rgName=yourResourceGroupName
    location=westcentralus
    keyVaultName=yourKeyVaultName
    keyName=yourKeyName
    diskEncryptionSetName=yourDiskEncryptionSetName
    diskName=yourDiskName

    az account set --subscription $subscriptionId

    az keyvault create -n $keyVaultName \
    -g $rgName \
    -l $location \
    --enable-purge-protection true 
                       
    az keyvault key create --vault-name $keyVaultName \
    -n $keyName \
    --protection software
    ```

1.    Create an instance of a DiskEncryptionSet. You can set enable-auto-key-rotation equal to true to enable automatic rotation of the key. When you enable automatic rotation, the system will automatically update all managed disks, snapshots, and images referencing the disk encryption set to use the new version of the key within one hour.
    
        ```azurecli
        keyVaultId=$(az keyvault show --name $keyVaultName --query [id] -o tsv)
    
        keyVaultKeyUrl=$(az keyvault key show --vault-name $keyVaultName --name $keyName --query [key.kid] -o tsv)
    
        az disk-encryption-set create -n $diskEncryptionSetName 
        -l $location \
        -g $rgName \
        --source-vault $keyVaultId \
        --key-url $keyVaultKeyUrl \
        --enable-auto-key-rotation false
        ```

1.    Grant the DiskEncryptionSet resource access to the key vault. 

        > [!NOTE]
        > It may take few minutes for Azure to create the identity of your DiskEncryptionSet in your Azure Active Directory. If you get an error like "Cannot find the Active Directory object" when running the following command, wait a few minutes and try again.

        ```azurecli
        desIdentity=$(az disk-encryption-set show -n $diskEncryptionSetName -g $rgName --query [identity.principalId] -o tsv)
    
        az keyvault set-policy -n $keyVaultName \
        -g $rgName \
        --object-id $desIdentity \
        --key-permissions wrapkey unwrapkey get
        ```
