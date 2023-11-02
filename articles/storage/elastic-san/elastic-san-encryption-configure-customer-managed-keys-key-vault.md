---
title: Use customer-managed keys with an Azure Elastic SAN Preview
titleSuffix: Azure Elastic SAN
description: Learn how to configure Azure Elastic SAN encryption with customer-managed keys for an Elastic SAN volume group by using the Azure portal, PowerShell, or Azure CLI.
services: storage
author: roygara

ms.author: rogarana
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 11/06/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Configure customer-managed keys for An Azure Elastic SAN using Azure Key Vault

All data written to an Elastic SAN volume is automatically encrypted-at-rest with a data encryption key (DEK). Azure uses *[envelope encryption](../../security/fundamentals/encryption-atrest.md#envelope-encryption-with-a-key-hierarchy)* to encrypt the DEK using a Key Encryption Key (KEK). By default, the KEK is platform-managed (managed by Microsoft), but you can create and manage your own.

This article shows how to configure encryption of an Elastic SAN volume group with customer-managed keys stored in an Azure Key Vault.

To learn how to configure encryption with customer-managed keys stored in a managed HSM, see [Configure encryption with customer-managed keys stored in Azure Key Vault Managed HSM](elastic-san-encryption-configure-customer-managed-keys-hsm.md).

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Prerequisites

To perform the operations described in this article, you must prepare your Azure account and the management tools you plan to use. Preparation includes installing the necessary modules, logging in to your account, and setting variables for PowerShell and the Azure CLI. The same set of variables are used throughout this article, so setting them now allows you to use the same ones in all of the samples.
md#elastic-san-volume-group-owner) role.

### [PowerShell](#tab/azure-powershell)

To perform the operations described in this article using PowerShell:

1. Install [the latest version of Azure PowerShell](/powershell/azure/install-azure-powershell) if you haven't already.

1. Install [the latest version of PowerShellGet](/powershell/gallery/powershellget/install-powershellget).

    ```azurepowershell
    Install-Module -Name PowerShellGet -AllowPrerelease
    ```

    You might need to `Exit` out of the current PowerShell session after you run this command for the next step.

1. Install the prerelease version of the `Az.ElasticSan` module.

    ```azurepowershell
    Install-Module -Name Az.ElasticSan -AllowPrerelease
    ```

1. Install version 2.0.0 or later of the [Az.KeyVault](https://www.powershellgallery.com/packages/Az.KeyVault/2.0.0) PowerShell module.

    ```azurepowershell
    Install-Module -Name Az.ElasticSan -AllowPrerelease
    ```

1. Install the prerelease version of the `Az.ManagedServiceIdentity` module to perform the user-assigned managed identity operations in this article.

    ```azurepowershell
    Install-Module -Name Az.ManagedServiceIdentity -AllowPrerelease
    ```

1. Sign in to Azure.

    ```azurepowershell
    Connect-AzAccount
    ```

#### Create variables to be used in the PowerShell samples in this article

Copy the sample code and replace all placeholder text with your own values. Use the same variables in all of the examples in this article:


```azurepowershell
# Define some variables
# The name of the resource group where the resources will be deployed.
$RgName          = "<ResourceGroupName>"
# The name of the Elastic SAN that contains the volume group to be configured.
$EsanName        = "<ElasticSanName>"
# The name of the Elastic SAN volume group to be configured.
$EsanVgName      = "<ElasticSanVolumeGroupName>
# The region where the new resources will be created.
$Location        = "<Location>"
# The name of the Azure Key Vault that will contain the KEK.
$KvName          = "<KeyVaultName>"
# The name of the Azure Key Vault key that is the KEK.
$KeyName         = "<KeyName>"
# The name of the user-assigned managed identity, [if applicable](#choose-a-managed-identity-to-authorize-access-to-the-key-vault).
$ManagedUserName = "<ManagedUserName>"
```

### [Azure CLI](#tab/azure-cli)

To use the Azure CLI to configure Elastic SAN encryption:

1. Install the [latest version](/cli/azure/install-azure-cli).
1. Run `az extension add -n elastic-san` to install the extension for Elastic SAN.

#### Create variables to be used in the CLI samples in this article

Copy the sample code and replace all placeholder text with your own values. Use the same variables in all of the examples in this article:

```azurecli
# Define some variables.
# The name of the resource group where the resources will be deployed.
RgName="<ResourceGroupName>"
# The name of the Elastic SAN that contains the volume group to be configured.
EsanName="<ElasticSanName>"
# The name of the Elastic SAN volume group to be configured.
EsanVgName="<ElasticSanVolumeGroupName>"
# The region where the new resources will be created.
Location="<Location>"
# The name of the Azure Key Vault that will contain the KEK.
KvName="<KeyVaultName>"
# The name of the Azure Key Vault key that is the KEK.
KeyName="<KeyName>"
# The name of the user-assigned managed identity, [if applicable](#choose-a-managed-identity-to-authorize-access-to-the-key-vault).
ManagedUserName="<ManagedUserName>"
# The User Principal Name (UPN) of the administrator (you) who will create the KEK in the vault.
AdminUpn="<AdminUpn>"
```

---

## Configure the key vault

You can use a new or existing key vault to store customer-managed keys. The encrypted resource and the key vault may be in different regions or subscriptions in the same Microsoft Entra ID tenant. To learn more about Azure Key Vault, see [Azure Key Vault Overview](../../key-vault/general/overview.md) and [What is Azure Key Vault?](../../key-vault/general/basic-concepts.md).

Using customer-managed keys with encryption requires that both soft delete and purge protection be enabled for the key vault. Soft delete is enabled by default when you create a new key vault and cannot be disabled. You can enable purge protection either when you create the key vault or after it is created. Azure Elastic SAN encryption supports RSA and RSA-HSM keys of sizes 2048, 3072 and 4096.

Azure Key Vault supports authorization with Azure RBAC via an Azure RBAC permission model. Microsoft recommends using the Azure RBAC permission model over key vault access policies. For more information, see [Grant permission to applications to access an Azure key vault using Azure RBAC](../../key-vault/general/rbac-guide.md).

There are 2 steps involved in preparing a key vault as a store for your volume group KEKs:

> [!div class="checklist"]
> * Create a new key vault with soft delete and purge protection enabled, or enable purge protection for an existing one.
> * Assign the role of Key Vault Crypto Officer to your account to be able to create a key in the vault.

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
az keyvault create \
    --name $KvName \
    --resource-group $RgName \
    --location $Location \
    --enable-purge-protection \
    --enable-rbac-authorization
```

To learn how to enable purge protection on an existing key vault with Azure CLI, see [Azure Key Vault recovery overview](../../key-vault/general/key-vault-recovery.md?tabs=azure-cli).

After you have created the key vault, you'll need to assign the **Key Vault Crypto Officer** role to yourself. This role enables you to create a key in the key vault. The following example assigns this role to a user, scoped to the key vault:

```azurecli
KvResourceId=$(az keyvault show --resource-group $RgName \
    --name $KvName \
    --query id \
    --output tsv)

az role assignment create --assignee $AdminUpn \
    --role "Key Vault Crypto Officer" \
    --scope $KvResourceId \
    --assignee-principal-type User
```

For more information on how to assign an RBAC role with Azure CLI, see [Assign Azure roles using Azure CLI](../../role-based-access-control/role-assignments-cli.md).

---

## Add a key

Next, add a key to the key vault. Before you add the key, make sure that you have assigned to yourself the **Key Vault Crypto Officer** role.

Azure Storage and Elastic SAN encryption support RSA and RSA-HSM keys of sizes 2048, 3072 and 4096. For more information about supported key types, see [About keys](../../key-vault/keys/about-keys.md).

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

To add a key with Azure CLI, call [az keyvault key create](/cli/azure/keyvault/key#az-keyvault-key-create). Use the sample below and [the same variables you created previously in this article](#create-variables-to-be-used-in-the-cli-samples-in-this-article):

```azurecli
az keyvault key create \
    --name $KeyName \
    --vault-name $KvName
```

---

## Choose a key rotation strategy

Following cryptographic best practices means rotating the key that is protecting your Elastic SAN volume group on a regular schedule, typically at least every two years. Azure Elastic SAN never modifies the key in the key vault, but you can configure a key rotation policy to rotate the key according to your compliance requirements. For more information, see [Configure cryptographic key auto-rotation in Azure Key Vault](../../key-vault/keys/how-to-configure-key-rotation.md).

After the key is rotated in the key vault, the encryption configuration for your Elastic SAN volume group must be updated to use the new key version. Customer-managed keys support both automatic and manual updating of the KEK version. Decide which approach you want to use before you configure customer-managed keys for a new or existing volume group.

For more details on key rotation, see [Update the key version](elastic-san-encryption-manage-customer-keys.md#update-the-key-version).

> [!IMPORTANT]
> When you modify the key or the key version, the protection of the root data encryption key changes, but the data in your Azure Elastic SAN volume group remains encrypted at all times. There is no additional action required on your part to ensure that your data is protected. Rotating the key version doesn't impact performance, and there is no downtime associated with it.

### Automatic key version rotation

Azure Elastic SAN can automatically update the customer-managed key that is used for encryption to use the latest key version from the key vault. Elastic SAN checks the key vault daily for a new version of the key. When a new version becomes available, it automatically begins using the latest version of the key for encryption. When you rotate a key, be sure to wait 24 hours before disabling the older version.

> [!IMPORTANT]
>
> If the Elastic SAN volume group was previously configured for manual updating of the key version and you want to change it to update automatically, you might need to explicitly change the key version to an empty string. For more details on manually changing the key version, see elastic-san-encryption-mana[Automatically update the key version](elastic-san-encryption-manage-customer-keys.md#automatically-update-the-key-version).

### Manual key version rotation

If you prefer to update the key version manually, specify the URI for a specific version at the time that you configure encryption with customer-managed keys. In this case, Elastic SAN won't automatically update the key version when a new version is created in the key vault. For Elastic SAN to use a new key version, you must update it manually.

To locate the URI for a specific version of a key in the Azure portal:

1. Navigate to your key vault.
1. Under **Objects** select **Keys**.
1. Select the desired key to view its versions.
1. Select a key version to view the settings for that version.
1. Copy the value of the **Key Identifier** field, which provides the URI.
1. Save the copied text to use later when configuring encryption for your volume group.

:::image type="content" source="../common/media/customer-managed-keys-configure-new-account/portal-copy-key-identifier.png" alt-text="Screenshot showing key vault key URI in Azure portal." lightbox="../common/media/customer-managed-keys-configure-new-account/portal-copy-key-identifier.png":::

## Choose a managed identity to authorize access to the key vault

When you enable customer-managed encryption keys for an Elastic SAN volume group, you must specify a managed identity that will be used to authorize access to the key vault that contains the key. The managed identity must have the following permissions:
 - *get*
- *wrapkey*
- *unwrapkey*

The managed identity that is authorized access to the key vault may be either a user-assigned or system-assigned managed identity. To learn more about system-assigned versus user-assigned managed identities, see [Managed identity types](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

When a volume group is created, a system-assigned identity is automatically created for it. If you want to use a user-assigned identity, create it before you configure customer-managed encryption keys for your volume group. To learn how to create and manage a user-assigned managed identity, see [Manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

### Use a user-assigned managed identity to authorize access

When you enable customer-managed keys for a new volume group, you must specify a user-assigned managed identity. An existing volume group supports using either a user-assigned managed identity or a system-assigned managed identity to configure customer-managed keys.

When you configure customer-managed keys with a user-assigned managed identity, the user-assigned managed identity is used to authorize access to the key vault that contains the key. You must create the user-assigned identity before you configure customer-managed keys.

A user-assigned managed identity is a standalone Azure resource. To learn more about user-assigned managed identities, see [Managed identity types](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types). To learn how to create and manage a user-assigned managed identity, see [Manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

The user-assigned managed identity must have permissions to access the key in the key vault. Assign the **Key Vault Crypto Service Encryption User** role to the user-assigned managed identity with key vault scope to grant these permissions.

### [PowerShell](#tab/azure-powershell)

The following example shows how to:

> [!div class="checklist"]
> * Create a new user-assigned managed identity.
> * Wait for the creation of the user-assigned identity to complete.
> * Get the `PrincipalId` from the new identity.
> * Assign the required RBAC role to the new identity, scoped to the key vault.

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
> * Assign the required RBAC role to the new identity, scoped to the key vault.

Use the same [variables you defined previously](#create-variables-to-be-used-in-the-powershell-samples-in-this-article) in this article.

```azurecli
# Create a new user-assigned managed identity.
UserIdentity=az identity create \
    --resource-group $RgName \
    --name $ManagedUserName \
    --location $Location

identityResourceId=$(az identity show --name $ManagedUserName \
    --resource-group $RgName \
    --query id \
    --output tsv)

PrincipalId=$(az identity show --name $ManagedUserName \
    --resource-group $RgName \
    --query principalId \
    --output tsv)

az role assignment create --assignee-object-id $PrincipalId \
    --role "Key Vault Crypto Service Encryption User" \
    --scope $KvResourceId \
    --assignee-principal-type ServicePrincipal
```

---

### Use a system-assigned managed identity to authorize access

A system-assigned managed identity is associated with an instance of an Azure service, such as an Azure Elastic SAN volume group.

The system-assigned managed identity must have permissions to access the key in the key vault. Assign the **Key Vault Crypto Service Encryption User** role to the system-assigned managed identity with key vault scope to grant these permissions.

When a volume group is created, a system-assigned identity is automatically created for it if the `-IdentityType "SystemAssigned"` parameter is specified with the `New-AzElasticSanVolumeGroup` command. The system-assigned identity is not available until after the volume group has been created. You must also assign the **Key Vault Crypto Service Encryption User** role to the identity before it can access the encryption key in the key vault. So, you cannot configure customer-managed keys to use a system-assigned identity during creation of a volume group. Only existing Elastic SAN volume groups can be configured to use a system-assigned identity to authorize access to the key vault. New volume groups must use a user-assigned identity, if customer-managed keys are to be configured during volume group creation.

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

To authenticate access to the key vault with a system-assigned managed identity, first assign the system-assigned managed identity to the volume group by calling `az elastic-san volume-group update`. Use the sample below and [the same variables you created previously in this article](#create-variables-to-be-used-in-the-cli-samples-in-this-article):

```azurecli
az elastic-san volume-group update \
    --name $EsanVgName \
    --resource-group $RgName \
    --assign-identity
```

Next, assign to the system-assigned managed identity the required RBAC role, scoped to the key vault. Use the sample below and [the same variables you created previously in this article](#create-variables-to-be-used-in-the-cli-samples-in-this-article):

```azurecli
PrincipalId=$(az elastic-san volume-group show --name $EsanVgName \
    --resource-group $RgName \
    --query identity.principalId \
    --output tsv)

az role assignment create --assignee-object-id $PrincipalId \
    --role "Key Vault Crypto Service Encryption User" \
    --scope $KvResourceId
```

---

## Configure customer-managed keys for a volume group

Select the Azure portal, PowerShell, or the Azure CLI tab for instructions on how to configure customer-managed encryption keys using your preferred management tool. Then select the tab that corresponds to whether you want to configure the settings during creation of a new volume group, or update the settings for an existing one. Each set of tabs includes instructions for how to configure customer-managed encryption keys for automatic and manual updating of the key version.

### [PowerShell](#tab/azure-powershell)

### [Azure CLI](#tab/azure-cli)

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
    KeyVaultPropertyKeyName      = $KeyName
    KeyVaultPropertyKeyVaultUri  = $KeyVault.VaultUri
    IdentityType                 = "UserAssigned"
    IdentityUserAssignedIdentity = @{$UserIdentity.Id=$UserIdentity}
    EncryptionIdentityEncryptionUserAssignedIdentity = $UserIdentity.Id
}

# Create the volume group.
New-AzElasticSanVolumeGroup @NewVgArguments
```

To configure customer-managed keys with **manual** updating of the key version during creation of a new volume group using PowerShell, add the `KeyVaultPropertyKeyVersion` parameter as shown in this sample:

```azurepowershell
# Setup the parameters to create the volume group.
$NewVgArguments        = @{
    Name                         = $EsanVgName
    ElasticSanName               = $EsanName
    ResourceGroupName            = $RgName
    ProtocolType                 = "Iscsi"
    Encryption                   = "EncryptionAtRestWithCustomerManagedKey"
    KeyVaultPropertyKeyName      = $KeyName
    KeyVaultPropertyKeyVaultUri  = $KeyVault.VaultUri
    KeyVaultPropertyKeyVersion   = $Key.Version
    IdentityType                 = "UserAssigned"
    IdentityUserAssignedIdentity = @{$UserIdentity.Id=$UserIdentity}
    EncryptionIdentityEncryptionUserAssignedIdentity = $UserIdentity.Id
}

# Create the volume group.
New-AzElasticSanVolumeGroup @NewVgArguments
```

### [New volume group](#tab/new-vg/azure-cli)

Use the instructions below to configure customer-managed keys during creation of a new volume group using the Azure CLI.

To configure customer-managed keys for an existing volume group with automatic updating of the key version with Azure CLI, install [Azure CLI version 2.4.0](/cli/azure/release-notes-azure-cli#april-21-2020) or later. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).

Next, call `az elastic-san volume-group update` to update the volume group's encryption settings. Include the `--encryption-key-source` parameter and set it to `Microsoft.Keyvault` to enable customer-managed keys for the account, and set `encryption-key-version` to an empty string to enable automatic updating of the key version. If the volume group was previously configured for customer-managed keys with a specific key version, then setting the key version to an empty string will enable automatic updating of the key version going forward. Use the sample below and [the same variables you created previously in this article](#create-variables-to-be-used-in-the-cli-samples-in-this-article):

```azurecli
KeyVaultUri=$(az keyvault show \
    --name $KvName \
    --resource-group $RgName \
    --query properties.vaultUri \
    --output tsv)

# Use this form of the command with a user-assigned managed identity.
az elastic-san volume-group update \
    --name $EsanVgName \
    --resource-group $RgName \
    --identity-type SystemAssigned,UserAssigned \
    --user-identity-id $identityResourceId \
    --encryption-key-name $KeyName \
    --encryption-key-version "" \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $KeyVaultUri \
    --key-vault-user-identity-id $identityResourceId

# Use this form of the command with a system-assigned managed identity.
az elastic-san volume-group update \
    --name $EsanVgName \
    --resource-group $RgName \
    --encryption-key-name $KeyName \
    --encryption-key-version "" \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $KeyVaultUri
```

### [Existing volume group](#tab/existing-vg/azure-powershell)

This set of samples shows how to configure an existing volume group to use customer-managed keys with a system-assigned identity. The steps are:

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
    KeyVaultPropertyKeyName      = $KeyName
    KeyVaultPropertyKeyVaultUri  = $KeyVault.VaultUri
}

# Update the volume group.
Update-AzElasticSanVolumeGroup @UpdateVgArguments
```

To configure an existing volume group to use customer-managed keys with a system-assigned identity and **manual** updating of the key version using PowerShell, add the `KeyVaultPropertyKeyVersion` parameter as shown in this sample:

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
    KeyVaultPropertyKeyName      = $KeyName
    KeyVaultPropertyKeyVaultUri  = $KeyVault.VaultUri
    KeyVaultPropertyKeyVersion   = $Key.Version
}

# Update the volume group.
Update-AzElasticSanVolumeGroup @UpdateVgArguments
```

### [Existing volume group](#tab/existing-vg/azure-cli)

Use the instructions below to configure customer-managed keys dfor an existing volume group using the Azure CLI.

To configure customer-managed keys with manual updating of the key version, explicitly provide the key version when you configure encryption for the volume group. Call `az elastic-san volume-group update` to update the volume group's encryption settings, as shown in the following example. Include the `--encryption-key-source` parameter and set it to `Microsoft.Keyvault` to enable customer-managed keys for the account. Use the sample below and [the same variables you created previously in this article](#create-variables-to-be-used-in-the-cli-samples-in-this-article):

Remember to replace the placeholder values in brackets with your own values.

```azurecli
KeyVaultUri=$(az keyvault show \
    --name $KvName \
    --resource-group $RgName \
    --query properties.vaultUri \
    --output tsv)

KeyVersion=$(az keyvault key list-versions \
    --name $KeyName \
    --vault-name $KvName \
    --query [-1].kid \
    --output tsv | cut -d '/' -f 6)

# Use this form of the command with a user-assigned managed identity
az elastic-san volume-group update \
    --name $EsanVgName \
    --resource-group $RgName \
    --identity-type SystemAssigned,UserAssigned \
    --user-identity-id $identityResourceId \
    --encryption-key-name $KeyName \
    --encryption-key-version $KeyVersion \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $KeyVaultUri \
    --key-vault-user-identity-id $identityResourceId

# Use this form of the command with a system-assigned managed identity
az elastic-san volume-group update \
    --name $EsanVgName \
    --resource-group $RgName \
    --encryption-key-name $KeyName \
    --encryption-key-version $KeyVersion \
    --encryption-key-source Microsoft.Keyvault \
    --encryption-key-vault $KeyVaultUri
```

When you manually update the key version, you'll need to update the volume group's encryption settings to use the new version. First, query for the key vault URI by calling [az keyvault show](/cli/azure/keyvault#az-keyvault-show), and for the key version by calling [az keyvault key list-versions](/cli/azure/keyvault/key#az-keyvault-key-list-versions). Then call `az elastic-san volume-group update` to update the volume group's encryption settings to use the new version of the key, as shown in the previous example.

---

## Next steps

- [Manage customer keys for Azure Elastic SAN data encryption](elastic-san-encryption-manage-customer-keys.md)

## See also

- [Configure Elastic SAN data encryption with customer-managed keys stored in Azure Key Vault Managed HSM](elastic-san-encryption-configure-customer-managed-keys-hsm.md)