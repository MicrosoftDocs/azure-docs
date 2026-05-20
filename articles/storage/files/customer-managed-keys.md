---
title: Configure Customer-Managed Keys for Azure Files
description: Learn how to configure customer-managed keys (CMK) in Azure Key Vault for encrypting Azure file share data at rest.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 05/07/2026
ms.author: kendownie
# Customer intent: "As a cloud admin, I want to learn how to configure customer-managed keys instead of using Microsoft-managed keys for encrypting Azure Files data at rest."
---

# Configure customer-managed keys for Azure Files encryption

:heavy_check_mark: **Applies to:** Classic SMB and NFS file shares created with the Microsoft.Storage resource provider

:heavy_multiplication_x: **Doesn't apply to:** File shares created with the Microsoft.FileShares resource provider (preview)

Azure encrypts all data in a storage account at rest, including Azure Files data, using AES-256 encryption. By default, Microsoft manages the encryption keys for a storage account. For more control over encryption keys, you can use [customer-managed keys](/azure/storage/common/customer-managed-keys-overview) (CMK) instead of Microsoft-managed keys to protect and control access to the encryption key that encrypts your data. This article explains how to configure customer-managed keys for Azure Files workloads.

When you configure customer-managed keys for a storage account, Azure Files data in that storage account is automatically encrypted using the customer key. No per-share opt-in is required.

These instructions are for storing customer-managed keys in [Azure Key Vault](/azure/key-vault/general/overview). Some steps and commands for [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview) (Hardware Security Module) might be slightly different.

Follow these steps to configure customer-managed keys for a storage account.

## Step 1: Create or configure a key vault

To enable customer managed keys, you need an Azure storage account along with an Azure Key Vault with purge protection enabled. You can use an existing key vault or create a new one. The storage account and key vault can be in different regions or subscriptions within the same Microsoft Entra tenant. For cross-tenant scenarios, see [Configure cross-tenant customer-managed keys for an existing storage account](/azure/storage/common/customer-managed-keys-configure-cross-tenant-existing-account).

### [Azure portal](#tab/portal)

To create a new key vault by using the Azure portal, follow these steps:

1. In the Azure portal, search for **Key vaults** and select **Create**.
1. Fill in the required fields (subscription, resource group, name, region).
1. Under **Recovery options**, select **Enable purge protection**.
1. Select **Review + create**, and then select **Create**.

If you want to use an existing key vault, follow these steps:

1. Go to your key vault in the Azure portal.
1. From the service menu, under **Settings**, select **Properties**.
1. In the **Purge protection** section, select **Enable purge protection**, and then select **Save**.
1. Make sure soft delete is enabled on your key vault. It's enabled by default for new key vaults.

### [PowerShell](#tab/powershell)

To create a new key vault with purge protection enabled, run the following cmdlet. Replace `<key-vault-name>`, `<resource-group>`, and `<region>` with your own values.

```azurepowershell
New-AzKeyVault `
    -Name <key-vault-name> `
    -ResourceGroupName <resource-group> `
    -Location <region> `
    -EnablePurgeProtection
```

To enable purge protection on an existing key vault, run the following cmdlet. Replace `<key-vault-name>` and `<resource-group>` with your own values.

```azurepowershell
Update-AzKeyVault `
    -VaultName <key-vault-name> `
    -ResourceGroupName <resource-group> `
    -EnablePurgeProtection
```

### [Azure CLI](#tab/cli)

To create a new key vault with purge protection enabled, run the following command. Replace `<key-vault-name>`, `<resource-group>`, and `<region>` with your own values.

```azurecli
az keyvault create \
    --name <key-vault-name> \
    --resource-group <resource-group> \
    --location <region> \
    --enable-purge-protection true
```

To enable purge protection on an existing key vault, run the following command. Replace `<key-vault-name>` and `<resource-group>` with your own values.

```azurecli
az keyvault update \
    --name <key-vault-name> \
    --resource-group <resource-group> \
    --enable-purge-protection true
```

---

### Assign the Key Vault Crypto Officer role

To create and manage keys in your key vault, you need the **Key Vault Crypto Officer** role on the key vault. You can assign this role to yourself by using the Azure portal, PowerShell, or Azure CLI. If you already have this role on the Key Vault, you can skip this section and proceed to Step 2.

You need the **Owner** or **User Access Administrator** RBAC role on the key vault scope to assign the **Key Vault Crypto Officer** role. Contact your admin if needed.

#### [Azure portal](#tab/portal)

To assign the **Key Vault Crypto Officer** role to yourself by using the Azure portal, follow these steps:

1. Go to your key vault.
1. From the service menu, select **Access control (IAM)**.
1. Under **Grant access to this resource**, select **Add role assignment**.
1. Search for and select **Key Vault Crypto Officer**, and then select **Next**.
1. Under **Assign access to**, select **User, group, or service principal**.
1. Under **Members**, choose **+Select members**.
1. Search for and select your own account, then choose **Select**.
1. Select **Review + assign**, and then **Review + assign** again.

#### [PowerShell](#tab/powershell)

To assign the **Key Vault Crypto Officer** role to yourself by using Azure PowerShell, run the following cmdlet. Replace `<key-vault-name>` with your own value.

```azurepowershell
$keyVault = Get-AzKeyVault -VaultName <key-vault-name>
$currentUser = (Get-AzADUser -SignedIn).Id

New-AzRoleAssignment `
    -ObjectId $currentUser `
    -RoleDefinitionName "Key Vault Crypto Officer" `
    -Scope $keyVault.ResourceId
```

#### [Azure CLI](#tab/cli)

To assign the **Key Vault Crypto Officer** role to yourself by using Azure CLI, run the following commands. Replace `<key-vault-name>` with your own value.

```azurecli
KV_RESOURCE_ID=$(az keyvault show --name <key-vault-name> --query id -o tsv)
CURRENT_USER=$(az ad signed-in-user show --query id -o tsv)

az role assignment create \
    --assignee-object-id $CURRENT_USER \
    --assignee-principal-type User \
    --role "Key Vault Crypto Officer" \
    --scope $KV_RESOURCE_ID
```

---

## Step 2: Create or import an encryption key

You need an RSA or RSA-HSM key of size 2048, 3072, or 4096. Generate or import an RSA key in your key vault. Before you generate a key, make sure you have the **Key Vault Crypto Officer** role on the key vault.

### [Azure portal](#tab/portal)

To generate a new RSA encryption key by using the Azure portal, follow these steps.

1. Go to your key vault in the Azure portal.
1. From the service menu, under **Objects**, select **Keys**.
1. Select **Generate/Import**. Under **Options**, select **Generate**.
1. Enter a name for the key. Key names can only contain alphanumeric characters and dashes.
1. Set **Key type** to **RSA** and **RSA key size** to **2048** (or 3072/4096).
1. Select **Create**.

To import an existing RSA encryption key by using the Azure portal, follow these steps.

1. Go to your key vault in the Azure portal.
1. From the service menu, under **Objects**, select **Keys**.
1. Select **Generate/Import**. Under **Options**, select **Import**.
1. Select your key to upload.
1. Enter a name for the key. Key names can only contain alphanumeric characters and dashes.
1. Set **Key type** to **RSA**.
1. Select **Create**.

### [PowerShell](#tab/powershell)

To create an RSA key by using Azure PowerShell, run the following cmdlet. Replace `<key-vault-name>` and `<key-name>` with your own values. For `-Size`, you can specify 2048, 3072, or 4096.

```azurepowershell
Add-AzKeyVaultKey `
    -VaultName <key-vault-name> `
    -Name <key-name> `
    -Destination Software `
    -KeyType RSA `
    -Size 2048
```

To import an existing RSA encryption key by using Azure PowerShell, run the following cmdlet. Replace `<key-vault-name>`, `<key-name>`, and `<key-path>` with your own values. If the key file doesn't have a password, omit the `-KeyFilePassword` parameter.

```azurepowershell
Add-AzKeyVaultKey `
    -VaultName <key-vault-name> `
    -Name <key-name> `
    -KeyFilePath <key-path> `
    -KeyFilePassword $password
```

### [Azure CLI](#tab/cli)

To create an RSA key by using Azure CLI, run the following command. Replace `<key-vault-name>` and `<key-name>` with your own values. For `--size`, you can specify 2048, 3072, or 4096.

```azurecli
az keyvault key create \
    --vault-name <key-vault-name> \
    --name <key-name> \
    --kty RSA \
    --size 2048
```

To import an existing RSA encryption key by using Azure CLI, run the following command. Replace `<key-vault-name>`, `<key-name>`, and `<key-path>` with your own values. If the key file doesn't have a password, omit the `--password` parameter.

```azurecli
az keyvault key import \
    --vault-name <key-vault-name> \
    --name <key-name> \
    --pem-file <key-path> \
    --password <key-password>
```

---

## Step 3: Create a managed identity and assign permissions

The storage account needs a [managed identity](/entra/identity/managed-identities-azure-resources/overview) to authenticate to the key vault. By using a managed identity, the storage account can securely access the encryption key in your key vault without storing credentials.

Create a user-assigned managed identity and grant that identity the **Key Vault Crypto Service Encryption User** role on the key vault.

### Create a user-assigned managed identity

Create a user-assigned managed identity by using the Azure portal, Azure PowerShell, or Azure CLI.

#### [Azure portal](#tab/portal)

To create a user-assigned managed identity by using the Azure portal, follow these steps.

1. Search for **Managed Identities** and select **Create**.
1. Choose a subscription, resource group, region, and name.
1. Select **Review + create**, and then select **Create**.

#### [PowerShell](#tab/powershell)

To create a user-assigned managed identity by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>`, `<identity-name>`, and `<region>` with your own values.

```azurepowershell
New-AzUserAssignedIdentity `
    -ResourceGroupName <resource-group> `
    -Name <identity-name> `
    -Location <region>
```

#### [Azure CLI](#tab/cli)

To create a user-assigned managed identity by using Azure CLI, run the following command. Replace `<resource-group>`, `<identity-name>`, and `<region>` with your own values.

```azurecli
az identity create \
    --name <identity-name> \
    --resource-group <resource-group> \
    --location <region>
```

---

#### Assign the Key Vault Crypto Service Encryption User role to the managed identity

Assign the **Key Vault Crypto Service Encryption User** role to the managed identity you created by using the Azure portal, PowerShell, or Azure CLI.

##### [Azure portal](#tab/portal)

To assign the **Key Vault Crypto Service Encryption User** role to the managed identity by using the Azure portal, follow these steps:

1. Go to your key vault in the Azure portal.
1. From the service menu, select **Access control (IAM)**.
1. Under **Grant access to this resource**, select **Add role assignment**.
1. Search for and select **Key Vault Crypto Service Encryption User**, and then select **Next**.
1. Under **Assign access to**, select **Managed identity**.
1. Under **Members**, choose **+Select members**.
1. The **Select managed identities** window opens. Under **Managed identity**, select **User-assigned managed identity**.
1. Select the managed identity that you created, and then choose **Select**.
1. Select **Review + assign**, and then **Review + assign** again.

##### [PowerShell](#tab/powershell)

To assign the **Key Vault Crypto Service Encryption User** role to the user-assigned managed identity by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>`, `<identity-name>`, and `<key-vault-name>` with your own values.

```azurepowershell
$identity = Get-AzUserAssignedIdentity `
    -ResourceGroupName <resource-group> `
    -Name <identity-name>

$keyVault = Get-AzKeyVault -VaultName <key-vault-name>

New-AzRoleAssignment `
    -ObjectId $identity.PrincipalId `
    -RoleDefinitionName "Key Vault Crypto Service Encryption User" `
    -Scope $keyVault.ResourceId
```

##### [Azure CLI](#tab/cli)

To assign the **Key Vault Crypto Service Encryption User** role to the user-assigned managed identity by using Azure CLI, run the following commands. Replace `<resource-group>`, `<identity-name>`, and `<key-vault-name>` with your own values.

```azurecli
# Get the principal ID of the user-assigned managed identity
IDENTITY_PRINCIPAL_ID=$(az identity show \
    --name <identity-name> \
    --resource-group <resource-group> \
    --query principalId -o tsv)

# Get the key vault resource ID
KV_RESOURCE_ID=$(az keyvault show \
    --name <key-vault-name> \
    --query id -o tsv)

# Assign the Key Vault Crypto Service Encryption User role to the user-assigned managed identity
az role assignment create \
    --assignee-object-id $IDENTITY_PRINCIPAL_ID \
    --assignee-principal-type ServicePrincipal \
    --role "Key Vault Crypto Service Encryption User" \
    --scope $KV_RESOURCE_ID
```

---

## Step 4: Configure customer-managed keys on the storage account

With the key vault, key, and managed identity in place, you can enable customer-managed keys on the storage account.

Follow these steps to configure the storage account to use your key for encryption. The Azure portal always uses automatic key version updating. To use manual key version management instead, use Azure PowerShell or Azure CLI and specify a key version.

> [!IMPORTANT]
> For storage accounts that are associated with a [network security perimeter](files-network-security-perimeter.md), the key vault should ideally be in the same network security perimeter. If it isn't, then you must configure the network security perimeter profile of the key vault to allow the storage account to communicate with it.

### Configure customer-managed keys for an existing storage account

You can configure customer-managed keys on an existing storage account by using the Azure portal, Azure PowerShell, or Azure CLI.

#### [Azure portal](#tab/portal)

To configure customer-managed keys on an existing storage account by using the Azure portal, follow these steps. The portal uses automatic key version updating by default. You can't specify a key version.

1. Go to your storage account.
1. From the service menu, under **Security + networking**, select **Encryption**.
1. For **Encryption type**, select **Customer-Managed Keys**. If the storage account is already configured for CMK, select **Change key**.
1. For **Encryption key**, select **Select from key vault**.
1. Select **Select a key vault and key**, and then choose your key vault and key.
1. For **Identity type**, choose **User-assigned** to use your previously created user-assigned managed identity.
1. Search for and select the user-assigned managed identity and then select **Add**.
1. Select **Save**.

:::image type="content" source="media/customer-managed-keys/encryption-key-selection.png" alt-text="Screenshot showing the encryption selection and key selection for configuring customer managed keys.":::

#### [PowerShell](#tab/powershell)

To configure customer-managed keys on an existing storage account by using Azure PowerShell with automatic key version updating (recommended), run the following cmdlet. Replace `<resource-group>`, `<identity-name>`, `<storage-account-name>`, `<key-vault-name>`, and `<key-name>` with your own values.

The following cmdlet uses your previously created user-assigned managed identity. If you want to use the storage account's system identity instead, set `IdentityType` to `SystemAssigned` and omit the `$identity` variable, `UserAssignedIdentityId`, and `KeyVaultUserAssignedIdentityId`.

```azurepowershell
$identity = Get-AzUserAssignedIdentity `
    -ResourceGroupName <resource-group> `
    -Name <identity-name>

$keyVault = Get-AzKeyVault -VaultName <key-vault-name>
$key = Get-AzKeyVaultKey -VaultName <key-vault-name> -Name <key-name>

Set-AzStorageAccount `
    -ResourceGroupName <resource-group> `
    -Name <storage-account-name> `
    -IdentityType UserAssigned `
    -UserAssignedIdentityId $identity.Id `
    -KeyVaultUri $keyVault.VaultUri `
    -KeyName $key.Name `
    -KeyVaultEncryption `
    -KeyVaultUserAssignedIdentityId $identity.Id
```

To use manual key version updating instead of automatic updating, add the `-KeyVersion $key.Version` parameter to the `Set-AzStorageAccount` cmdlet.

#### [Azure CLI](#tab/cli)

To configure customer-managed keys on an existing storage account by using Azure CLI with automatic key version updating (recommended), run the following commands. Replace `<resource-group>`, `<identity-name>`, `<storage-account-name>`, `<key-vault-name>`, and `<key-name>` with your own values.

The following command uses your previously created user-assigned managed identity. If you want to use the storage account's system identity instead, set `--identity-type` to `SystemAssigned` and omit the `IDENTITY_RESOURCE_ID` variable, `--user-identity-id`, and `--key-vault-user-identity-id`.

```azurecli
# Using user-assigned managed identity. Omit for system assigned.
IDENTITY_RESOURCE_ID=$(az identity show \
    --name <identity-name> \
    --resource-group <resource-group> \
    --query id -o tsv)

# Get the key vault URI
KEY_VAULT_URI=$(az keyvault show \
    --name <key-vault-name> \
    --query properties.vaultUri -o tsv)

az storage account update \
    --name <storage-account-name> \
    --resource-group <resource-group> \
    --encryption-key-vault $KEY_VAULT_URI \
    --encryption-key-name <key-name> \
    --encryption-key-source Microsoft.Keyvault \
    --key-vault-user-identity-id $IDENTITY_RESOURCE_ID \
    --identity-type UserAssigned \
    --user-identity-id $IDENTITY_RESOURCE_ID
```

To use manual key version updating instead of automatic updating, add `--encryption-key-version <key-version>` to the `az storage account update` command.

---

### Configure customer-managed keys for a new storage account

You can configure customer-managed keys when you create a new storage account by using the Azure portal, Azure PowerShell, or Azure CLI.

You can't use a system-assigned identity during storage account creation because the identity doesn't exist until the storage account is created. You must use a user-assigned managed identity.

#### [Azure portal](#tab/portal)

To configure customer-managed keys for a new storage account by using the Azure portal, follow these steps. The portal uses automatic key version updating by default. You can't specify a key version.

1. On the **Encryption** tab during storage account creation, select **Customer-managed keys (CMK)** for **Encryption type**.
1. Under **Encryption key**, choose **Select a key vault and key**, then select your key vault and key.
1. Under **User-assigned identity**, choose **Select an identity**. The **Select user assigned managed identity** windows opens.
1. Search for and select your pre-created user-assigned managed identity. New storage accounts can't use a system-assigned managed identity.
1. Select **Add**.
1. Complete the remaining tabs and select **Review + create**.

#### [PowerShell](#tab/powershell)

To create a new storage account with customer-managed keys by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>`, `<identity-name>`, `<storage-account-name>`, `<key-vault-name>`, `<key-name>`, and `<region>` with your own values. You can specify different values for `-Kind` and `-SkuName` if desired.

```azurepowershell
$identity = Get-AzUserAssignedIdentity `
    -ResourceGroupName <resource-group> `
    -Name <identity-name>

$keyVault = Get-AzKeyVault -VaultName <key-vault-name>
$key = Get-AzKeyVaultKey -VaultName <key-vault-name> -Name <key-name>

New-AzStorageAccount `
    -ResourceGroupName <resource-group> `
    -Name <storage-account-name> `
    -Location <region> `
    -SkuName Standard_LRS `
    -Kind StorageV2 `
    -IdentityType UserAssigned `
    -UserAssignedIdentityId $identity.Id `
    -KeyVaultUri $keyVault.VaultUri `
    -KeyName $key.Name `
    -KeyVaultUserAssignedIdentityId $identity.Id
```

To use manual key version updating instead of automatic, add the `-KeyVersion $key.Version` parameter to the `New-AzStorageAccount` cmdlet.

#### [Azure CLI](#tab/cli)

To create a new storage account with customer-managed keys by using Azure CLI, run the following commands. Replace `<resource-group>`, `<identity-name>`, `<storage-account-name>`, `<key-vault-name>`, `<key-name>`, and `<region>` with your own values. You can specify different values for `--kind` and `--sku` if desired.

```azurecli
IDENTITY_RESOURCE_ID=$(az identity show \
    --name <identity-name> \
    --resource-group <resource-group> \
    --query id -o tsv)

# Get the key vault URI
KEY_VAULT_URI=$(az keyvault show \
    --name <key-vault-name> \
    --query properties.vaultUri -o tsv)

az storage account create \
    --name <storage-account-name> \
    --resource-group <resource-group> \
    --location <region> \
    --sku Standard_LRS \
    --kind StorageV2 \
    --identity-type UserAssigned \
    --user-identity-id $IDENTITY_RESOURCE_ID \
    --encryption-key-vault $KEY_VAULT_URI \
    --encryption-key-name <key-name> \
    --encryption-key-source Microsoft.Keyvault \
    --key-vault-user-identity-id $IDENTITY_RESOURCE_ID
```

To use manual key version updating instead of automatic, add `--encryption-key-version <key-version>` to the `az storage account create` command.

---

## Step 5: Verify the configuration

After you enable customer-managed keys, confirm that encryption is properly configured on your storage account. You can do this by using the Azure portal, Azure PowerShell, or Azure CLI.

### [Azure portal](#tab/portal)

To verify the storage account configuration by using the Azure portal, follow these steps:

1. Go to your storage account in the Azure portal.
1. From the service menu, under **Security + networking**, select **Encryption**.
1. Confirm that **Encryption type** shows **Customer-Managed Keys**.
1. Verify that the information under **Key selection** is correct.

### [PowerShell](#tab/powershell)

To verify the storage account configuration by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>` and `<storage-account-name>` with your own values.

```azurepowershell
$account = Get-AzStorageAccount `
    -ResourceGroupName <resource-group> `
    -Name <storage-account-name>

$account.Encryption.KeySource
$account.Encryption.KeyVaultProperties
```

Confirm that `KeySource` is `Microsoft.Keyvault` and that `KeyVaultProperties` shows your key vault URI and key name.

### [Azure CLI](#tab/cli)

To verify the configuration by using Azure CLI, run the following command. Replace `<resource-group>` and `<storage-account-name>` with your own values.

```azurecli
az storage account show \
    --name <storage-account-name> \
    --resource-group <resource-group> \
    --query encryption
```

Confirm that `keySource` is `Microsoft.Keyvault` and the `keyVaultProperties` section shows your key vault URI and key name.

---

## Key rotation

Regularly rotating your encryption key limits the exposure if a key is ever compromised. There are two ways to rotate encryption for a storage account that uses customer-managed keys:

- **Rotate the key version** - Create a new version of the same key in the key vault. The key name stays the same, but the version changes.
- **Change the key** - Switch the storage account to use an entirely different key (with a different name) in the same or a different key vault.

> [!IMPORTANT]
> Azure checks the key vault for a new key version only once daily. After rotating a key, wait 24 hours before disabling the previous key version.

### Rotate the key version

For security best practices, rotate the key version at least once every two years.

#### Automatic key version rotation (recommended)

If you configured customer-managed keys without specifying a key version (the default when using the Azure portal), Azure automatically checks for new key versions daily. If you create a new version of the key in key vault, Azure picks it up within 24 hours. You can also configure [automatic key rotation in Azure Key Vault](/azure/key-vault/keys/how-to-configure-key-rotation) to generate new key versions on a schedule.

#### Manual key version rotation

If you specified a key version when configuring customer-managed keys using PowerShell or Azure CLI, Azure uses that specific version and doesn't automatically check for new versions. You must manually update the storage account configuration to point to the new key version.

##### [Azure portal](#tab/portal)

Manual key version rotation isn't supported in the Azure portal. To manually rotate the key version, use Azure PowerShell or Azure CLI.

##### [PowerShell](#tab/powershell)

To manually rotate the key version by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>`, `<storage-account-name>`, `<key-vault-name>`, and `<key-name>` with your own values.

```azurepowershell
$keyVault = Get-AzKeyVault -VaultName <key-vault-name>
$key = Get-AzKeyVaultKey -VaultName <key-vault-name> -Name <key-name>

Set-AzStorageAccount `
    -ResourceGroupName <resource-group> `
    -Name <storage-account-name> `
    -KeyVaultUri $keyVault.VaultUri `
    -KeyName $key.Name `
    -KeyVersion $key.Version `
    -KeyVaultEncryption
```

##### [Azure CLI](#tab/cli)

To manually rotate the key version by using Azure CLI, run the following commands. Replace `<storage-account-name>`, `<resource-group>`, `<key-vault-name>`, and `<key-name>` with your own values.

```azurecli
# Get the key vault URI
KEY_VAULT_URI=$(az keyvault show \
    --name <key-vault-name> \
    --query properties.vaultUri -o tsv)

# Get the latest key version
KEY_VERSION=$(az keyvault key show \
    --vault-name <key-vault-name> \
    --name <key-name> \
    --query key.kid -o tsv | sed -e 's|.*/||')

az storage account update \
    --name <storage-account-name> \
    --resource-group <resource-group> \
    --encryption-key-vault $KEY_VAULT_URI \
    --encryption-key-name <key-name> \
    --encryption-key-version $KEY_VERSION \
    --encryption-key-source Microsoft.Keyvault
```

---

### Change the key

To switch the storage account to use an entirely different key, create or import a new key in your key vault (see [Create or import an encryption key](#step-2-create-or-import-an-encryption-key)), and then update the storage account encryption configuration to use the new key.

#### [Azure portal](#tab/portal)

To change the key by using the Azure portal, follow these steps:

1. Go to your storage account.
1. From the service menu, under **Security + networking**, select **Encryption**.
1. Select **Change key**.
1. Select **Select a key vault and key**, and then choose your key vault and new key.
1. Select **Save**.

#### [PowerShell](#tab/powershell)

To change the key by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>`, `<storage-account-name>`, `<key-vault-name>`, and `<new-key-name>` with your own values. To use automatic key version updating (recommended), omit the `-KeyVersion` parameter.

```azurepowershell
$keyVault = Get-AzKeyVault -VaultName <key-vault-name>
$key = Get-AzKeyVaultKey -VaultName <key-vault-name> -Name <new-key-name>

Set-AzStorageAccount `
    -ResourceGroupName <resource-group> `
    -Name <storage-account-name> `
    -KeyVaultUri $keyVault.VaultUri `
    -KeyName $key.Name `
    -KeyVaultEncryption
```

#### [Azure CLI](#tab/cli)

To change the key by using Azure CLI, run the following commands. Replace `<storage-account-name>`, `<resource-group>`, `<key-vault-name>`, and `<new-key-name>` with your own values. To use automatic key version updating (recommended), omit the `--encryption-key-version` parameter.

```azurecli
# Get the key vault URI
KEY_VAULT_URI=$(az keyvault show \
    --name <key-vault-name> \
    --query properties.vaultUri -o tsv)

az storage account update \
    --name <storage-account-name> \
    --resource-group <resource-group> \
    --encryption-key-vault $KEY_VAULT_URI \
    --encryption-key-name <new-key-name> \
    --encryption-key-source Microsoft.Keyvault
```

---

## Revoke access to file share data by disabling the key

You can immediately block access to encrypted file share data by disabling or deleting the customer-managed key. While the key is disabled, all Azure Files data plane operations fail with HTTP 403 (Forbidden), including:

- List directories and files
- Create/get/set directory or file
- Get/set file metadata
- Put range, copy file, rename file

To revoke access to your file share data, disable the key in key vault by using the Azure portal, Azure PowerShell, or Azure CLI. Re-enable the key to restore access.

### [Azure portal](#tab/portal)

To disable the key by using the Azure portal, follow these steps:

1. Go to your key vault in the Azure portal.
1. From the service menu, under **Objects**, select **Keys**.
1. Right-click the key and select **Disable**.

### [PowerShell](#tab/powershell)

To disable the key by using Azure PowerShell, run the following cmdlet. Replace `<key-vault-name>` and `<key-name>` with your own values.

```azurepowershell
Update-AzKeyVaultKey `
    -VaultName <key-vault-name> `
    -Name <key-name> `
    -Enable $false
```

### [Azure CLI](#tab/cli)

To disable the key by using Azure CLI, run the following command. Replace `<key-vault-name>` and `<key-name>` with your own values.

```azurecli
az keyvault key set-attributes \
    --vault-name <key-vault-name> \
    --name <key-name> \
    --enabled false
```

---

## Switch back to Microsoft-managed keys

If you no longer need customer-managed keys, you can switch the storage account back to using Microsoft-managed keys for encryption by using the Azure portal, Azure PowerShell, or Azure CLI.

### [Azure portal](#tab/portal)

To switch back to Microsoft-managed keys by using the Azure portal, follow these steps:

1. Go to your storage account in the Azure portal.
1. From the service menu, under **Security + networking**, select **Encryption**.
1. Change **Encryption type** to **Microsoft-Managed Keys**.
1. Select **Save**.

### [PowerShell](#tab/powershell)

To switch back to Microsoft-managed keys by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>` and `<storage-account-name>` with your own values.

```azurepowershell
Set-AzStorageAccount `
    -ResourceGroupName <resource-group> `
    -Name <storage-account-name> `
    -StorageEncryption
```

### [Azure CLI](#tab/cli)

To switch back to Microsoft-managed keys by using Azure CLI, run the following command. Replace `<resource-group>` and `<storage-account-name>` with your own values.

```azurecli
az storage account update \
    --name <storage-account-name> \
    --resource-group <resource-group> \
    --encryption-key-source Microsoft.Storage
```

---

## Related content

For more information about encryption and key management, see the following articles.

- [Azure Storage encryption for data at rest](/azure/storage/common/storage-service-encryption)
- [Customer-managed keys for Azure Storage encryption (overview)](/azure/storage/common/customer-managed-keys-overview)
- [Configure customer-managed keys in the same tenant for an existing storage account](/azure/storage/common/customer-managed-keys-configure-existing-account)
- [Configure cross-tenant customer-managed keys](/azure/storage/common/customer-managed-keys-configure-cross-tenant-existing-account)
- [Encryption for Azure Files](/azure/storage/files/storage-files-planning#encryption-for-azure-files)
- [What is Azure Key Vault?](/azure/key-vault/general/overview)
