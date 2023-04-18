---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 03/31/2023
 ms.author: rogarana
 ms.custom: include file, devx-track-azurecli
---
### Azure Key Vault

- Install the latest [Azure CLI](/cli/azure/install-az-cli2) and log to an Azure account in with [az login](/cli/azure/reference-index).
- Create an Azure Key Vault and encryption key.

When creating the Key Vault, you must enable purge protection. Purge protection ensures that a deleted key cannot be permanently deleted until the retention period lapses. These settings protect you from losing data due to accidental deletion. These settings are mandatory when using a Key Vault for encrypting managed disks.

> [!IMPORTANT]
> Don't camel case the region, if you do so, you may experience problems when assigning additional disks to the resource in the Azure portal.

```azurecli
subscriptionId=yourSubscriptionID
rgName=yourResourceGroupName
location=westcentralus
keyVaultName=yourKeyVaultName
keyName=yourKeyName
diskEncryptionSetName=yourDiskEncryptionSetName
diskName=yourDiskName

az account set --subscription $subscriptionId

az group create --resource-group $rgName --location $location

az keyvault create -n $keyVaultName \
-g $rgName \
-l $location \
--enable-purge-protection true 

az keyvault key create --vault-name $keyVaultName \
-n $keyName \
--protection software
```

- Create a DiskEncryptionSet. You can set enable-auto-key-rotation equal to true to enable automatic rotation of the key. When you enable automatic rotation, the system will automatically update all managed disks, snapshots, and images referencing the disk encryption set to use the new version of the key within one hour.

```azurecli
keyVaultKeyUrl=$(az keyvault key show --vault-name $keyVaultName --name $keyName --query [key.kid] -o tsv)

az disk-encryption-set create -n $diskEncryptionSetName \
-l $location \
-g $rgName \
--key-url $keyVaultKeyUrl \
--enable-auto-key-rotation false
```

- Grant the DiskEncryptionSet resource access to the key vault. 

> [!NOTE]
> It may take few minutes for Azure to create the identity of your DiskEncryptionSet in your Azure Active Directory. If you get an error like "Cannot find the Active Directory object" when running the following command, wait a few minutes and try again.

```azurecli
desIdentity=$(az disk-encryption-set show -n $diskEncryptionSetName -g $rgName --query [identity.principalId] -o tsv)

az keyvault set-policy -n $keyVaultName \
-g $rgName \
--object-id $desIdentity \
--key-permissions wrapkey unwrapkey get
```

### Azure Key Vault Managed HSM

Alternatively, you can use a Managed HSM to handle your keys.

To do this, you must complete the following prerequisites:

- Install the latest [Azure CLI](/cli/azure/install-az-cli2) and log in to an Azure account in with [az login](/cli/azure/reference-index).
- [Create and configure a managed HSM](../articles/key-vault/managed-hsm/quick-create-cli.md).
- [Assign permissions to a user, so they can manage your Managed HSM](../articles/key-vault/managed-hsm/role-management.md).

#### Configuration

Once you've created a Managed HSM and added permissions, enable purge protection and create an encryption key.

```azurecli
subscriptionId=yourSubscriptionID
rgName=yourResourceGroupName
location=westcentralus
keyVaultName=yourKeyVaultName
keyName=yourKeyName
diskEncryptionSetName=yourDiskEncryptionSetName
diskName=yourDiskName
    
az account set --subscription $subscriptionId
    
az keyvault update-hsm --subscription $subscriptionId -g $rgName --hsm-name $keyVaultName --enable-purge-protection true
    
az keyvault key create --hsm-name  $keyVaultName --name $keyName --ops wrapKey unwrapKey --kty RSA-HSM --size 2048
```

Then, create a DiskEncryptionSet.

```azurecli
keyVaultKeyUrl=$(az keyvault key show --vault-name $keyVaultName --name $keyName --query [key.kid] -o tsv)
    
az disk-encryption-set create -n $diskEncryptionSetName \
-l $location \
-g $rgName \
--key-url $keyVaultKeyUrl \
--enable-auto-key-rotation false
```

Finally, grant the DiskEncryptionSet access to the Managed HSM.

```azurecli
desIdentity=$(az disk-encryption-set show -n $diskEncryptionSetName -g $rgName --query [identity.principalId] -o tsv)
    
az keyvault role assignment create --hsm-name $keyVaultName --role "Managed HSM Crypto Service Encryption User" --assignee $desIdentity --scope /keys
```