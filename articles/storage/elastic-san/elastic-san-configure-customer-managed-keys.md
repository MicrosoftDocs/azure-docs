---
title: Use customer-managed keys - Azure Elastic SAN
description: Learn how to configure Azure Elastic SAN encryption with customer-managed keys for an Elastic SAN volume group by using the Azure PowerShell module or Azure CLI.
services: storage
author: roygara

ms.author: rogarana
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 05/31/2024
ms.custom: devx-track-azurepowershell, devx-track-azurecli, references_regions
---

# Configure customer-managed keys for an Azure Elastic SAN

All data written to an Elastic SAN volume is automatically encrypted-at-rest with a data encryption key (DEK). Azure uses *[envelope encryption](../../security/fundamentals/encryption-atrest.md#envelope-encryption-with-a-key-hierarchy)* to encrypt the DEK using a Key Encryption Key (KEK). By default, the KEK is platform-managed (managed by Microsoft), but you can create and manage your own.

This article shows how to configure encryption of an Elastic SAN volume group with customer-managed keys stored in an Azure Key Vault.

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Prerequisites

To perform the operations described in this article, you must prepare your Azure account and the management tools you plan to use. Preparation includes installing the necessary modules, logging in to your account, and setting variables for PowerShell and the Azure CLI. The same set of variables are used throughout this article, so setting them now allows you to use the same ones in all of the samples.


### [PowerShell](#tab/azure-powershell)

To perform the operations described in this article using PowerShell:

1. Install [the latest version of Azure PowerShell](/powershell/azure/install-azure-powershell) if you haven't already.
1. Once Azure PowerShell is installed, install version 0.1.2 or later, of the Elastic SAN extension with `Install-Module -Name Az.ElasticSan -Repository PSGallery`.
1. Sign in to Azure.

    ```azurepowershell
    Connect-AzAccount
    ```

#### Create variables to be used in the PowerShell samples in this article

Copy the sample code and replace all placeholder text with your own values. Use the same variables in all of the examples in this article:


```azurepowershell
# Define some variables
# The name of the resource group where the resources will be deployed.
$RgName          = "ResourceGroupName"

# The name of the Elastic SAN that contains the volume group to be configured.
$EsanName        = "ElasticSanName"

# The name of the Elastic SAN volume group to be configured.
$EsanVgName      = "ElasticSanVolumeGroupName"

# The region where the new resources will be created.
$Location        = "Location"

# The name of the Azure Key Vault that will contain the KEK.
$KvName          = "KeyVaultName"

# The name of the Azure Key Vault key that is the KEK.
$KeyName         = "KeyName"

# The name of the user-assigned managed identity, if applicable.
$ManagedUserName = "ManagedUserName"
```

### [Azure CLI](#tab/azure-cli)

To use the Azure CLI to configure Elastic SAN encryption:

1. Install the [latest version](/cli/azure/install-azure-cli).
1. Install version 1.0.0b2 or later of the Azure Elastic SAN CLI extension.
    1. If you don't have the extension installed, use `az extension add -n elastic-san` to install the extension for Elastic SAN.
    1. (Optional) if you already have the extension installed, run `az extension update -n elastic-san` to install the latest.

#### Create variables to be used in the CLI samples in this article

Copy the sample code and replace all placeholder text with your own values. Use the same variables in all of the examples in this article:

```azurecli

# The name of the resource group where the resources will be deployed.
RgName="ResourceGroupName"

# The name of the Elastic SAN that contains the volume group to be configured.
EsanName="ElasticSanName"

# The name of the Elastic SAN volume group to be configured.
EsanVgName="ElasticSanVolumeGroupName"

# The name of the Elastic SAN volume to be created
volume_name="ElasticSanVolumeName"

# The region where the new resources will be created.
Location="Location"

# The name of the Azure Key Vault that will contain the KEK.
KvName="KeyVaultName"

# The name of the Azure Key Vault key that is the KEK.
KeyName="KeyName"

# The name of the user-assigned managed identity, if applicable.
ManagedUserName="ManagedUserName"

```

---

## Configure the key vault

You can use a new or existing key vault to store customer-managed keys. The encrypted resource and the key vault can be in different regions or subscriptions in the same Microsoft Entra ID tenant. To learn more about Azure Key Vault, see [Azure Key Vault Overview](../../key-vault/general/overview.md) and [What is Azure Key Vault?](../../key-vault/general/basic-concepts.md).

Using customer-managed keys with encryption requires that both soft delete and purge protection are enabled for the key vault. Soft delete is enabled by default when you create a new key vault and can't be disabled. You can enable purge protection either when you create the key vault or after it's created. Azure Elastic SAN encryption supports RSA keys of sizes 2048, 3072 and 4096.

Azure Key Vault supports authorization with Azure RBAC via an Azure RBAC permission model. Microsoft recommends using the Azure RBAC permission model over key vault access policies. For more information, see [Grant permission to applications to access an Azure key vault using Azure RBAC](../../key-vault/general/rbac-guide.md).

There are two steps involved in preparing a key vault as a store for your volume group KEKs:

> [!div class="checklist"]
> * Create a new key vault with soft delete and purge protection enabled, or enable purge protection for an existing one.
> * Create or assign an Azure RBAC role that has the **backup create delete get import get list update restore** permissions.

# [PowerShell](#tab/azure-powershell)

The following example:

> [!div class="checklist"]
> * Creates a new key vault with soft delete and purge protection enabled.
> * Gets the UPN of your user account.
> * Assigns the Key Vault Crypto Officer role for the new key vault to your account.

Use the same [variables you defined previously](#create-variables-to-be-used-in-the-powershell-samples-in-this-article) in this article.

```azurepowershell
# Setup the parameters to create the key vault.
$NewKvArguments = @{
    Name                    = $KvName
    ResourceGroupName       = $RgName
    Location                = $Location
    EnablePurgeProtection   = $true
    EnableRbacAuthorization = $true
}

# Create the key vault.
$KeyVault = New-AzKeyVault @NewKvArguments

# Get the UPN of the currently loggged in user.
$MyAccountUpn = (Get-AzADUser -SignedIn).UserPrincipalName

# Setup the parameters to create the role assignment.
$CrptoOfficerRoleArguments = @{
    SignInName         = $MyAccountUpn
    RoleDefinitionName = "Key Vault Crypto Officer"
    Scope              = $KeyVault.ResourceId
}

# Assign the Cypto Officer role to your account for the key vault.
New-AzRoleAssignment @CrptoOfficerRoleArguments
```

To learn how to enable purge protection on an existing key vault with PowerShell, see [Azure Key Vault recovery overview](../../key-vault/general/key-vault-recovery.md?tabs=azure-powershell).

For more information on how to assign an RBAC role with PowerShell, see [Assign Azure roles using Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md).

# [Azure CLI](#tab/azure-cli)

To create a new key vault using Azure CLI, call [az keyvault create](/cli/azure/keyvault#az-keyvault-create). The following example creates a new key vault with soft delete and purge protection enabled. The key vault's permission model is set to use Azure RBAC. Remember to replace the placeholder values in brackets with your own values.

```azurecli

az keyvault create --name $KvName --resource-group $RgName --location $Location --enable-purge-protection --retention-days 7
```

To learn how to enable purge protection on an existing key vault with Azure CLI, see [Azure Key Vault recovery overview](../../key-vault/general/key-vault-recovery.md?tabs=azure-cli).

---

## Add a key

Next, add a key to the key vault. Before you add the key, make sure that you have assigned to yourself the **Key Vault Crypto Officer** role.

Azure Storage and Elastic SAN encryption support RSA keys of sizes 2048, 3072 and 4096. For more information about supported key types, see [About keys](../../key-vault/keys/about-keys.md).

# [PowerShell](#tab/azure-powershell)

Use these sample commands to add a key to the key vault with PowerShell. Use the same [variables you defined previously](#create-variables-to-be-used-in-the-powershell-samples-in-this-article) in this article.

```azurepowershell
# Get the key vault where the key is to be added.
$KeyVault = Get-AzKeyVault -ResourceGroupName $RgName -VaultName $KvName

# Setup the parameters to add the key to the vault.
$NewKeyArguments = @{
    Name        = $KeyName
    VaultName   = $KeyVault.VaultName
    Destination = "Software"
}

# Add the key to the vault.
$Key = Add-AzKeyVaultKey @NewKeyArguments
```

# [Azure CLI](#tab/azure-cli)

To add a key with Azure CLI, call [az keyvault key create](/cli/azure/keyvault/key#az-keyvault-key-create). You can also set a policy on your keyvault, to give permissions to specific users directly. Replace `youremail@here.com` then use the following sample and [the same variables you created previously in this article](#create-variables-to-be-used-in-the-cli-samples-in-this-article):

```azurecli
#### Get vault_url
vault_uri=$(az keyvault show --name $KvName --resource-group $RgName --query "properties.vaultUri" -o tsv)

#### Find your object id and set key policy
objectId=$(az ad user show --id youremail@here.com --query id -o tsv)

az keyvault set-policy -n $KvName --object-id $objectId --key-permissions backup create delete get import get list update restore

#### Create key
az keyvault key create --vault-name $KvName -n $KeyName --protection software
```

---

## Choose a key rotation strategy

Following cryptographic best practices means rotating the key that is protecting your Elastic SAN volume group on a regular schedule, typically at least every two years. Azure Elastic SAN never modifies the key in the key vault, but you can configure a key rotation policy to rotate the key according to your compliance requirements. For more information, see [Configure cryptographic key auto-rotation in Azure Key Vault](../../key-vault/keys/how-to-configure-key-rotation.md).

After the key is rotated in the key vault, the encryption configuration for your Elastic SAN volume group must be updated to use the new key version. Customer-managed keys support both automatic and manual updating of the KEK version. Decide which approach you want to use before you configure customer-managed keys for a new or existing volume group.

For more information on key rotation, see [Update the key version](elastic-san-encryption-manage-customer-keys.md#update-the-key-version).

> [!IMPORTANT]
> When you modify the key or the key version, the protection of the root data encryption key changes, but the data in your Azure Elastic SAN volume group remains encrypted at all times. There is no additional action required on your part to ensure that your data is protected. Rotating the key version doesn't impact performance, and there is no downtime associated with it.

### Automatic key version rotation

Azure Elastic SAN can automatically update the customer-managed key that is used for encryption to use the latest key version from the key vault. Elastic SAN checks the key vault daily for a new version of the key. When a new version becomes available, it automatically begins using the latest version of the key for encryption. When you rotate a key, be sure to wait 24 hours before disabling the older version.

> [!IMPORTANT]
>
> If the Elastic SAN volume group was configured for manual updating of the key version and you want to change it to update automatically, change the key version to an empty string. For more information on manually changing the key version, see [Automatically update the key version](elastic-san-encryption-manage-customer-keys.md#automatically-update-the-key-version).

### Manual key version rotation

If you prefer to update the key version manually, specify the URI for a specific version at the time that you configure encryption with customer-managed keys. When you specify the URI, your elastic SAN won't automatically update the key version when a new version is created in the key vault. For your elastic SAN to use a new key version, you must update it manually.

To locate the URI for a specific version of a key in the Azure portal:

1. Navigate to your key vault.
1. Under **Objects** select **Keys**.
1. Select the desired key to view its versions.
1. Select a key version to view the settings for that version.
1. Copy the value of the **Key Identifier** field, which provides the URI.
1. Save the copied text to use later when configuring encryption for your volume group.

:::image type="content" source="../common/media/customer-managed-keys-configure-new-account/portal-copy-key-identifier.png" alt-text="Screenshot showing key vault key URI in Azure portal." lightbox="../common/media/customer-managed-keys-configure-new-account/portal-copy-key-identifier.png":::

## Choose a managed identity to authorize access to the key vault

When you enable customer-managed encryption keys for an Elastic SAN volume group, you must specify a managed identity that is used to authorize access to the key vault that contains the key. The managed identity must have the following permissions:
 - *get*
- *wrapkey*
- *unwrapkey*

The managed identity that is authorized access to the key vault can be either a user-assigned or system-assigned managed identity. To learn more about system-assigned versus user-assigned managed identities, see [Managed identity types](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

When a volume group is created, a system-assigned identity is automatically created for it. If you want to use a user-assigned identity, create it before you configure customer-managed encryption keys for your volume group. To learn how to create and manage a user-assigned managed identity, see [Manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

### Use a user-assigned managed identity to authorize access

When you enable customer-managed keys for a new volume group, you must specify a user-assigned managed identity. An existing volume group supports using either a user-assigned managed identity or a system-assigned managed identity to configure customer-managed keys.

When you configure customer-managed keys with a user-assigned managed identity, the user-assigned managed identity is used to authorize access to the key vault that contains the key. You must create the user-assigned identity before you configure customer-managed keys.

A user-assigned managed identity is a standalone Azure resource. To learn more about user-assigned managed identities, see [Managed identity types](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types). To learn how to create and manage a user-assigned managed identity, see [Manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

The user-assigned managed identity must have permissions to access the key in the key vault. You can either manually grant permissions to the identity, or assign a built-in role with key vault scope to grant these permissions.

### [PowerShell](#tab/azure-powershell)

The following example shows how to:

> [!div class="checklist"]
> * Create a new user-assigned managed identity.
> * Wait for the creation of the user-assigned identity to complete.
> * Get the `PrincipalId` from the new identity.
> * Assign an RBAC role to the new identity, scoped to the key vault.

Use the same [variables you defined previously](#create-variables-to-be-used-in-the-powershell-samples-in-this-article) in this article.

```azurepowershell
# Create a new user-assigned managed identity.
$UserIdentity = New-AzUserAssignedIdentity -ResourceGroupName $RgName -Name $ManagedUserName -Location $Location
```

> [!TIP]
> Wait about 1 minute for the creation of the user-assigned identity to finish before proceeding. 

```azurepowershell
# Get the `PrincipalId` for the new identity.
$PrincipalId = $UserIdentity.PrincipalId

# Setup the parameters to assign the Crypto Service Encryption User role.
$CryptoUserRoleArguments = @{
    ObjectId           = $PrincipalId
    RoleDefinitionName = "Key Vault Crypto Service Encryption User"
    Scope              = $KeyVault.ResourceId
}

# Assign the Crypto Service Encryption User role to the managed identity so it can access the key in the vault.
New-AzRoleAssignment @CryptoUserRoleArguments
```

### [Azure CLI](#tab/azure-cli)

The following example shows how to:

> [!div class="checklist"]
> * Create a new user-assigned managed identity.
> * Wait for the creation of the user-assigned identity to complete.
> * Get the `PrincipalId` from the new identity.
> * Set a policy on your key vault, allowing access to your identity.

Use the same [variables you defined previously](#create-variables-to-be-used-in-the-powershell-samples-in-this-article) in this article.

```azurecli
### Create a user assigned identity and grant it the access to the key vault
uai=$(az identity create -g $RgName -n $ManagedUserName -o tsv --query id)

#### Get the properties
uai_principal_id=$(az identity show --ids $uai --query principalId -o tsv)
uai_id=$(az identity show --ids $uai --query id -o tsv)
uai_client_id=$(az identity show --ids $uai --query clientId -o tsv)

#### create a keyvault and get the vault url
az keyvault create --name $KvName --resource-group $RgName --location eastus2 --enable-purge-protection --retention-days 7
vault_uri=$(az keyvault show --name $KvName --resource-group $RgName --query "properties.vaultUri" -o tsv)

#### set policy for key permission
az keyvault set-policy -n $KvName --object-id $uai_principal_id --key-permissions get wrapkey unwrapkey

#### create key
az keyvault key create --vault-name $KvName -n $KeyName --protection software

### Create a volume group with customer-managed keys
az elastic-san volume-group create -e $EsanName -n $EsanVgName -g $RgName --encryption EncryptionAtRestWithCustomerManagedKey --protocol-type Iscsi --identity "{type:UserAssigned,user-assigned-identity:'$uai_id'}" --encryption-properties "{key-vault-properties:{key-name:'$KeyName',key-vault-uri:'$vault_uri'},identity:{user-assigned-identity:'$uai_id'}}"
az elastic-san volume create -g $RgName -e $EsanName -v $EsanVgName -n $volume_name --size-gib 2
```

---

### Use a system-assigned managed identity to authorize access

A system-assigned managed identity is associated with an instance of an Azure service, such as an Azure Elastic SAN volume group.

The system-assigned managed identity must have permissions to access the key in the key vault. This article uses the **Key Vault Crypto Service Encryption User** role to the system-assigned managed identity with key vault scope to grant these permissions.

When a volume group is created, a system-assigned identity is automatically created for it if the `-IdentityType "SystemAssigned"` parameter is specified with the `New-AzElasticSanVolumeGroup` command. The system-assigned identity isn't available until after the volume group has been created. You must also assign an appropriate role such as the **Key Vault Crypto Service Encryption User** role to the identity before it can access the encryption key in the key vault. So, you can't configure customer-managed keys to use a system-assigned identity during creation of a volume group. When you create a new volume group with customer-managed keys, you must use a user-assigned identity when you create the volume group, you can configure a system-assigned identity after it's created.

#### [PowerShell](#tab/azure-powershell)

Use this sample code to assign the required RBAC role to the system-assigned managed identity, scoped to the key vault. Use the same [variables you defined previously](#create-variables-to-be-used-in-the-powershell-samples-in-this-article) in this article.

```azurepowershell
# Get the Elastic SAN volume group.
$ElasticSanVolumeGroup = Get-AzElasticSanVolumeGroup -Name $EsanVgName -ElasticSanName $EsanName -ResourceGroupName $RgName

# Generate a system-assigned identity if one does not already exist.
If ($ElasticSanVolumeGroup.IdentityPrincipalId -eq $null) {
Update-AzElasticSanVolumeGroup -ResourceGroupName $RgName -ElasticSanName $EsanName -Name $EsanVgName -IdentityType "SystemAssigned"}

# Get the `PrincipalId` (system-assigned identity) of the volume group.
$PrincipalId = $ElasticSanVolumeGroup.IdentityPrincipalId

# Setup the parameters to assign the Crypto Service Encryption User role.
$CryptoUserRoleArguments = @{
    ObjectId           = $PrincipalId
    RoleDefinitionName = "Key Vault Crypto Service Encryption User"
    Scope              = $KeyVault.ResourceId
}

# Assign the Crypto Service Encryption User role.
New-AzRoleAssignment @CryptoUserRoleArguments
```

#### [Azure CLI](#tab/azure-cli)

To authenticate access to the key vault with a system-assigned managed identity, first assign the system-assigned managed identity to the volume group by calling `az elastic-san volume-group update`. Use the following sample and [the same variables you created previously in this article](#create-variables-to-be-used-in-the-cli-samples-in-this-article):

```azurecli
az elastic-san volume-group update \
    --name $EsanVgName \
    --resource-group $RgName \
    --identity
```

Next, assign to the system-assigned managed identity the required RBAC role, scoped to the key vault. Use the following sample and [the same variables you created previously in this article](#create-variables-to-be-used-in-the-cli-samples-in-this-article):

```azurecli
PrincipalId=$(az elastic-san volume-group show --name $EsanVgName \
    --resource-group $RgName \
    --query identity.principalId \
    --output tsv)

az role assignment create --assignee-object-id $PrincipalId \
    --role "Key Vault Crypto Service Encryption User" \
    --scope $vault_uri
```

---

## Configure customer-managed keys for a volume group

Select the Azure PowerShell module or the Azure CLI tab for instructions on how to configure customer-managed encryption keys using your preferred management tool.

### [PowerShell](#tab/azure-powershell)
Now that you've selected PowerShell, select the tab that corresponds to whether you want to configure the settings during creation of a new volume group, or update the settings for an existing one.

### [Azure CLI](#tab/azure-cli)
Now that you've selected CLI, select the tab that corresponds to whether you want to configure the settings during creation of a new volume group, or update the settings for an existing one.

---

### [New volume group](#tab/new-vg/azure-powershell)

Use this sample to configure customer-managed keys with **automatic** updating of the key version during creation of a new volume group using PowerShell:

```azurepowershell
# Setup the parameters to create the volume group.
$NewVgArguments        = @{
    Name                         = $EsanVgName
    ElasticSanName               = $EsanName
    ResourceGroupName            = $RgName
    ProtocolType                 = "Iscsi"
    Encryption                   = "EncryptionAtRestWithCustomerManagedKey"
    KeyName                      = $KeyName
    KeyVaultUri                  = $KeyVault.VaultUri
    IdentityType                 = "UserAssigned"
    IdentityUserAssignedIdentity = @{$UserIdentity.Id=$UserIdentity}
    EncryptionIdentityEncryptionUserAssignedIdentity = $UserIdentity.Id
}

# Create the volume group.
New-AzElasticSanVolumeGroup @NewVgArguments
```

To configure customer-managed keys with **manual** updating of the key version during creation of a new volume group using PowerShell, add the `KeyVersion` parameter as shown in this sample:

```azurepowershell
# Setup the parameters to create the volume group.
$NewVgArguments        = @{
    Name                         = $EsanVgName
    ElasticSanName               = $EsanName
    ResourceGroupName            = $RgName
    ProtocolType                 = "Iscsi"
    Encryption                   = "EncryptionAtRestWithCustomerManagedKey"
    KeyName                      = $KeyName
    KeyVaultUri                  = $KeyVault.VaultUri
    KeyVersion                   = $Key.Version
    IdentityType                 = "UserAssigned"
    IdentityUserAssignedIdentity = @{$UserIdentity.Id=$UserIdentity}
    EncryptionIdentityEncryptionUserAssignedIdentity = $UserIdentity.Id
}

# Create the volume group.
New-AzElasticSanVolumeGroup @NewVgArguments
```

### [New volume group](#tab/new-vg/azure-cli)

Use the following samples and [the same variables you created previously in this article](#create-variables-to-be-used-in-the-cli-samples-in-this-article) to configure customer-managed keys during creation of a new volume group:

#### Managed identity

```azurecli
vault_uri=$(az keyvault show --name $KvName --resource-group $RgName --query "properties.vaultUri" -o tsv)

#### set policy for key permission
az keyvault set-policy -n $KvName --object-id $uai_principal_id --key-permissions get wrapkey unwrapkey

#### create key
az keyvault key create --vault-name $KvName -n $KeyName --protection software

### Create a volume group with customer-managed keys
az elastic-san volume-group create -e $EsanName -n $EsanVgName -g $RgName \
    --encryption EncryptionAtRestWithCustomerManagedKey \
    --protocol-type Iscsi \
    --identity "{type:UserAssigned,user-assigned-identity:'$uai_id'}" \
    --encryption-properties "{key-vault-properties:{key-name:'$KeyName',key-vault-uri:'$vault_uri'},identity:{user-assigned-identity:'$uai_id'}}"

az elastic-san volume update -g $RgName -e $EsanName -v $EsanVgName -n $volume_name --size-gib 2     
```

#### System assigned identity

Replace `youremail@here.com` with the email of the user you'd like to assign permissions to, and run the following script:

```azurecli
#### Get vault_url
vault_uri=$(az keyvault show --name $KvName --resource-group $RgName --query "properties.vaultUri" -o tsv)

#### Find your object id and set key policy
objectId=$(az ad user show --id youremail@here.com --query id -o tsv)
az keyvault set-policy -n $KvName --object-id $objectId --key-permissions backup create delete get import get list update restore

#### Create key
az keyvault key create --vault-name $KvName -n $KeyName --protection software

### Create a volume group with platform-managed keys and a system assigned identity with it
#### Get the system identity's principalId from the response of PUT volume group request.
vg_identity_principal_id=$(az elastic-san volume-group create -e $EsanName -n $EsanVgName -g $RgName --encryption EncryptionAtRestWithPlatformKey --protocol-type Iscsi --identity '{type:SystemAssigned}' --query "identity.principalId" -o tsv)

### Grant access to  the system assigned identity to the key vault created in step1
#### (key permissions: Get, Unwrap Key, Wrap Key)
az keyvault set-policy -n $KvName --object-id $vg_identity_principal_id --key-permissions backup create delete get import get list update restore

### Update the volume group with the key created earlier
az elastic-san volume-group update -e $EsanName -n $EsanVgName -g $RgName --encryption EncryptionAtRestWithCustomerManagedKey --encryption-properties "{key-vault-properties:{key-name:'$KeyName',key-vault-uri:'$vault_uri'}}"
```

### [Existing volume group](#tab/existing-vg/azure-powershell)

These set of samples shows how to configure an existing volume group to use customer-managed keys with a system-assigned identity. The steps are:

> [!div class="checklist"]
> * Generate a system-assigned identity for the volume group.
> * Get the principal ID of the new system-assigned identity.
> * Assign the Key Vault Crypto Service Encryption User role to the new identity for the key vault.
> * Update the volume group to use customer-managed keys.

Use this sample to configure an existing volume group to use customer-managed keys with a system-assigned identity and **automatic** updating of the key version using PowerShell:

```azurepowershell
# Get the Elastic SAN volume group.
$ElasticSanVolumeGroup = Get-AzElasticSanVolumeGroup -Name $EsanVgName -ElasticSanName $EsanName -ResourceGroupName $RgName

# Generate a system-assigned identity if one does not already exist.
If ($ElasticSanVolumeGroup.IdentityPrincipalId -eq $null) {
Update-AzElasticSanVolumeGroup -ResourceGroupName $RgName -ElasticSanName $EsanName -Name $EsanVgName -IdentityType "SystemAssigned"}

# Get the `PrincipalId` (system-assigned identity) of the volume group.
$PrincipalId = $ElasticSanVolumeGroup.IdentityPrincipalId

# Setup the parameters to assign the Crypto Service Encryption User role.
$CryptoUserRoleArguments = @{
    ObjectId           = $PrincipalId
    RoleDefinitionName = "Key Vault Crypto Service Encryption User"
    Scope              = $KeyVault.ResourceId
}

# Assign the Crypto Service Encryption User role.
New-AzRoleAssignment @CryptoUserRoleArguments

# Setup the parameters to update the volume group.
$UpdateVgArguments        = @{
    Name                         = $EsanVgName
    ElasticSanName               = $EsanName
    ResourceGroupName            = $RgName
    ProtocolType                 = "Iscsi"
    Encryption                   = "EncryptionAtRestWithCustomerManagedKey"
    KeyName      = $KeyName
    KeyVaultUri  = $KeyVault.VaultUri
}

# Update the volume group.
Update-AzElasticSanVolumeGroup @UpdateVgArguments
```

To configure an existing volume group to use customer-managed keys with a system-assigned identity and **manual** updating of the key version using PowerShell, add the `KeyVersion` parameter as shown in this sample:

```azurepowershell
# Get the Elastic SAN volume group.
$ElasticSanVolumeGroup = Get-AzElasticSanVolumeGroup -Name $EsanVgName -ElasticSanName $EsanName -ResourceGroupName $RgName

# Generate a system-assigned identity if one does not already exist.
If ($ElasticSanVolumeGroup.IdentityPrincipalId -eq $null) {
Update-AzElasticSanVolumeGroup -ResourceGroupName $RgName -ElasticSanName $EsanName -Name $EsanVgName -IdentityType "SystemAssigned"}

# Get the `PrincipalId` (system-assigned identity) of the volume group.
$PrincipalId = $ElasticSanVolumeGroup.IdentityPrincipalId

# Setup the parameters to assign the Crypto Service Encryption User role.
$CryptoUserRoleArguments = @{
    ObjectId           = $PrincipalId
    RoleDefinitionName = "Key Vault Crypto Service Encryption User"
    Scope              = $KeyVault.ResourceId
}

# Assign the Crypto Service Encryption User role.
New-AzRoleAssignment @CryptoUserRoleArguments

# Setup the parameters to update the volume group.
$UpdateVgArguments        = @{
    Name                         = $EsanVgName
    ElasticSanName               = $EsanName
    ResourceGroupName            = $RgName
    ProtocolType                 = "Iscsi"
    Encryption                   = "EncryptionAtRestWithCustomerManagedKey"
    KeyName      = $KeyName
    KeyVaultUri  = $KeyVault.VaultUri
    KeyVersion   = $Key.Version
}

# Update the volume group.
Update-AzElasticSanVolumeGroup @UpdateVgArguments
```

### [Existing volume group](#tab/existing-vg/azure-cli)

Use the following samples  [the same variables you created previously in this article](#create-variables-to-be-used-in-the-cli-samples-in-this-article) to configure customer-managed keys for an existing volume group using the Azure CLI.

#### Managed identity

```azurecli
### update the volume group with the new user assigned identity
az elastic-san volume-group update -e $EsanName -n $EsanVgName -g $RgName --identity "{type:UserAssigned,user-assigned-identity:'$uai_id'}" --encryption EncryptionAtRestWithCustomerManagedKey --encryption-properties "{key-vault-properties:{key-name:'$KeyName',key-vault-uri:'$vault_uri'},identity:{user-assigned-identity:'$uai_id'}}"
```

#### System assigned identity

```azurecli
az elastic-san volume-group update -e $EsanName -n $EsanVgName -g $RgName --identity '{type:SystemAssigned}' --encryption EncryptionAtRestWithCustomerManagedKey --encryption-properties "{key-vault-properties:{key-name:'$KeyName',key-vault-uri:'$vault_uri'}}"
```

When you manually update the key version, you need to update the volume group's encryption settings to use the new version. First, query for the key vault URI by calling [az keyvault show](/cli/azure/keyvault#az-keyvault-show), and for the key version by calling [az keyvault key list-versions](/cli/azure/keyvault/key#az-keyvault-key-list-versions). Then call `az elastic-san volume-group update` to update the volume group's encryption settings to use the new version of the key, as shown in the previous example.

---

## Next steps

- [Manage customer keys for Azure Elastic SAN data encryption](elastic-san-encryption-manage-customer-keys.md)