---
title: Configure encryption at rest with customer-managed keys
titleSuffix: Azure Files
description: Learn how to configure customer-managed keys (CMK) in Azure Key Vault for encrypting Azure file share data at rest.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 10/26/2026
ms.author: kendownie
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Configure encryption at rest with customer-managed keys for Azure Files
:heavy_check_mark: **Applies to:** Classic SMB and NFS file shares created with the Microsoft.Storage resource provider

:heavy_multiplication_x: **Doesn't apply to:** File shares created with the Microsoft.FileShares resource provider

Azure encrypts all data in a storage account at rest, including Azure Files data, by using AES-256 encryption. By default, Microsoft manages the encryption keys for a storage account. For more control over encryption keys, use [customer-managed keys](/azure/storage/common/customer-managed-keys-overview) (CMK) instead of Microsoft-managed keys to protect and control access to the encryption key that encrypts your data. This article explains how to configure customer-managed keys for Azure Files workloads. For an overview of encryption at rest and key options, see [Encryption at rest for Azure Files](files-encryption-at-rest.md).

When you configure customer-managed keys for a storage account, Azure Files data in that storage account is automatically encrypted by using the customer key. No per-share opt-in is required.

To use a key in [Azure Key Vault](/azure/key-vault/general/overview) in the same Microsoft Entra tenant as the storage account, complete these sections in order:

1. [Create or configure a key vault](#create-or-configure-a-key-vault)
2. [Create or import an encryption key](#create-or-import-an-encryption-key)
3. [Create a managed identity and assign permissions](#create-a-managed-identity-and-assign-permissions)
4. [Configure customer-managed keys on the storage account](#configure-customer-managed-keys-on-the-storage-account)
5. [Verify the configuration](#verify-the-configuration)

For other key locations, see these sections:

- To use a key in Azure Key Vault Managed HSM (Hardware Security Module), see [Use a key in Azure Key Vault Managed HSM](#use-a-key-in-azure-key-vault-managed-hsm).
- To use a key in a key vault in a different tenant, see [About cross-tenant customer-managed keys](#about-cross-tenant-customer-managed-keys).

## Create or configure a key vault
To enable customer-managed keys, you need an Azure storage account along with an Azure Key Vault with purge protection enabled. You can use an existing key vault or create a new one. The storage account and key vault can be in different regions or subscriptions within the same Microsoft Entra tenant. For cross-tenant scenarios, see [About cross-tenant customer-managed keys](#about-cross-tenant-customer-managed-keys).

# [Portal](#tab/azure-portal)
To create a new key vault by using the Azure portal, follow these steps:

1. In the Azure portal, search for **Key vaults** and select **Create**.
2. Fill in the required fields (subscription, resource group, name, region).
3. Under **Recovery options**, select **Enable purge protection**.
4. Select **Review + create**, and then select **Create**.

If you want to use an existing key vault, follow these steps:

1. Go to your key vault in the Azure portal.
2. From the service menu, under **Settings**, select **Properties**.
3. In the **Purge protection** section, select **Enable purge protection**, and then select **Save**.
4. Make sure soft delete is enabled on your key vault. It's enabled by default for new key vaults.

# [PowerShell](#tab/azure-powershell)
To create a new key vault with purge protection enabled, run the following cmdlet. Replace `<key-vault-name>`, `<resource-group>`, and `<region>` with your own values.

```azurepowershell
$vaultParams = @{
    Name = "<key-vault-name>"
    ResourceGroupName = "<resource-group>"
    Location = "<region>"
    EnablePurgeProtection = $true
}
New-AzKeyVault @vaultParams
```

To enable purge protection on an existing key vault, run the following cmdlet. Replace `<key-vault-name>` and `<resource-group>` with your own values.

```azurepowershell
$vaultParams = @{
    VaultName = "<key-vault-name>"
    ResourceGroupName = "<resource-group>"
    EnablePurgeProtection = $true
}
Update-AzKeyVault @vaultParams
```

# [Azure CLI](#tab/azure-cli)
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
To create and manage keys in your key vault, you need the **Key Vault Crypto Officer** role on the key vault. Assign this role to yourself by using the Azure portal, PowerShell, or Azure CLI. If you already have this role on the key vault, skip this section and go to [Create or import an encryption key](#create-or-import-an-encryption-key).

You need the **Owner** or **User Access Administrator** RBAC role on the key vault scope to assign the **Key Vault Crypto Officer** role. Contact your admin if needed.

# [Portal](#tab/azure-portal)
To assign the **Key Vault Crypto Officer** role to yourself by using the Azure portal, follow these steps:

1. Go to your key vault.
2. From the service menu, select **Access control (IAM)**.
3. Under **Grant access to this resource**, select **Add role assignment**.
4. Search for and select **Key Vault Crypto Officer**, and then select **Next**.
5. Under **Assign access to**, select **User, group, or service principal**.
6. Under **Members**, choose **+Select members**.
7. Search for and select your own account, then choose **Select**.
8. Select **Review + assign**, and then **Review + assign** again.

# [PowerShell](#tab/azure-powershell)
To assign the **Key Vault Crypto Officer** role to yourself by using Azure PowerShell, run the following cmdlet. Replace `<key-vault-name>` with your own value.

```azurepowershell
$keyVault = Get-AzKeyVault -VaultName "<key-vault-name>"
$currentUser = (Get-AzADUser -SignedIn).Id

$roleParams = @{
    ObjectId = $currentUser
    RoleDefinitionName = "Key Vault Crypto Officer"
    Scope = $keyVault.ResourceId
}
New-AzRoleAssignment @roleParams
```

# [Azure CLI](#tab/azure-cli)
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

## Create or import an encryption key
You need an RSA or RSA-HSM key of size 2048, 3072, or 4096. Generate or import an RSA key in your key vault. Before you generate a key, make sure you have the **Key Vault Crypto Officer** role on the key vault.

# [Portal](#tab/azure-portal)
To generate a new RSA encryption key by using the Azure portal, follow these steps:

1. Go to your key vault in the Azure portal.
2. From the service menu, under **Objects**, select **Keys**.
3. Select **Generate/Import**. Under **Options**, select **Generate**.
4. Enter a name for the key. Key names can only contain alphanumeric characters and dashes.
5. Set **Key type** to **RSA** and **RSA key size** to **2048**, **3072**, or **4096**.
6. Select **Create**.

To import an existing RSA encryption key by using the Azure portal, follow these steps:

1. Go to your key vault in the Azure portal.
2. From the service menu, under **Objects**, select **Keys**.
3. Select **Generate/Import**. Under **Options**, select **Import**.
4. Select your key to upload.
5. Enter a name for the key. Key names can only contain alphanumeric characters and dashes.
6. Set **Key type** to **RSA**.
7. Select **Create**.

# [PowerShell](#tab/azure-powershell)
To create an RSA key by using Azure PowerShell, run the following cmdlet. Replace `<key-vault-name>` and `<key-name>` with your own values. For `Size`, specify 2048, 3072, or 4096.

```azurepowershell
$keyParams = @{
    VaultName = "<key-vault-name>"
    Name = "<key-name>"
    Destination = "Software"
    KeyType = "RSA"
    Size = 2048
}
Add-AzKeyVaultKey @keyParams
```

To import an existing RSA encryption key by using Azure PowerShell, run the following cmdlet. Replace `<key-vault-name>`, `<key-name>`, and `<key-path>` with your own values. The first line prompts for the password of the key file. If the key file doesn't have a password, omit the `Read-Host` line and `KeyFilePassword`.

```azurepowershell
$password = Read-Host -Prompt "Key file password" -AsSecureString

$keyParams = @{
    VaultName = "<key-vault-name>"
    Name = "<key-name>"
    KeyFilePath = "<key-path>"
    KeyFilePassword = $password
}
Add-AzKeyVaultKey @keyParams
```

# [Azure CLI](#tab/azure-cli)
To create an RSA key by using Azure CLI, run the following command. Replace `<key-vault-name>` and `<key-name>` with your own values. For `--size`, specify 2048, 3072, or 4096.

```azurecli
az keyvault key create \
    --vault-name <key-vault-name> \
    --name <key-name> \
    --kty RSA \
    --size 2048
```

To import an existing RSA encryption key by using Azure CLI, run the following command. Replace `<key-vault-name>`, `<key-name>`, `<key-path>`, and `<key-password>` with your own values. If the key file doesn't have a password, omit the `--pem-password` parameter.

```azurecli
az keyvault key import \
    --vault-name <key-vault-name> \
    --name <key-name> \
    --pem-file <key-path> \
    --pem-password <key-password>
```

---

## Create a managed identity and assign permissions
The storage account needs a [managed identity](/entra/identity/managed-identities-azure-resources/overview) to authenticate to the key vault. By using a managed identity, the storage account can securely access the encryption key in your key vault without storing credentials.

Create a user-assigned managed identity and grant that identity the **Key Vault Crypto Service Encryption User** role on the key vault.

### Create a user-assigned managed identity
Create a user-assigned managed identity by using the Azure portal, Azure PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)
To create a user-assigned managed identity by using the Azure portal, follow these steps:

1. Search for **Managed Identities** and select **Create**.
2. Choose a subscription, resource group, region, and name.
3. Select **Review + create**, and then select **Create**.

# [PowerShell](#tab/azure-powershell)
To create a user-assigned managed identity by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>`, `<identity-name>`, and `<region>` with your own values.

```azurepowershell
$identityParams = @{
    ResourceGroupName = "<resource-group>"
    Name = "<identity-name>"
    Location = "<region>"
}
New-AzUserAssignedIdentity @identityParams
```

# [Azure CLI](#tab/azure-cli)
To create a user-assigned managed identity by using Azure CLI, run the following command. Replace `<resource-group>`, `<identity-name>`, and `<region>` with your own values.

```azurecli
az identity create \
    --name <identity-name> \
    --resource-group <resource-group> \
    --location <region>
```

---

### Assign the Key Vault Crypto Service Encryption User role to the managed identity
Assign the **Key Vault Crypto Service Encryption User** role to the managed identity you created by using the Azure portal, PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)
To assign the **Key Vault Crypto Service Encryption User** role to the managed identity by using the Azure portal, follow these steps:

1. Go to your key vault in the Azure portal.
2. From the service menu, select **Access control (IAM)**.
3. Under **Grant access to this resource**, select **Add role assignment**.
4. Search for and select **Key Vault Crypto Service Encryption User**, and then select **Next**.
5. Under **Assign access to**, select **Managed identity**.
6. Under **Members**, choose **+Select members**.
7. The **Select managed identities** window opens. Under **Managed identity**, select **User-assigned managed identity**.
8. Select the managed identity that you created, and then choose **Select**.
9. Select **Review + assign**, and then **Review + assign** again.

# [PowerShell](#tab/azure-powershell)
To assign the **Key Vault Crypto Service Encryption User** role to the user-assigned managed identity by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>`, `<identity-name>`, and `<key-vault-name>` with your own values.

```azurepowershell
$identityParams = @{
    ResourceGroupName = "<resource-group>"
    Name = "<identity-name>"
}
$identity = Get-AzUserAssignedIdentity @identityParams

$keyVault = Get-AzKeyVault -VaultName "<key-vault-name>"

$roleParams = @{
    ObjectId = $identity.PrincipalId
    RoleDefinitionName = "Key Vault Crypto Service Encryption User"
    Scope = $keyVault.ResourceId
}
New-AzRoleAssignment @roleParams
```

# [Azure CLI](#tab/azure-cli)
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

## Configure customer-managed keys on the storage account
With the key vault, key, and managed identity in place, you can enable customer-managed keys on the storage account.

If you don't specify a key version, the storage account uses automatic key version updating (recommended). To use manual key version updating, specify a key version.

> [!IMPORTANT]
> For storage accounts that are associated with a [network security perimeter](storage-files-networking-overview.md#network-security-perimeter), the key vault should ideally be in the same network security perimeter. If it isn't, then you must configure the network security perimeter profile of the key vault to allow the storage account to communicate with it.

### Configure customer-managed keys for an existing storage account
You can configure customer-managed keys on an existing storage account by using the Azure portal, Azure PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)
To configure customer-managed keys on an existing storage account by using the Azure portal, follow these steps. These steps use automatic key version updating. To use manual key version updating, select **Enter key URI** in step 4, and enter a key URI that includes the key version.

1. Go to your storage account.
2. From the service menu, under **Security + networking**, select **Encryption**.
3. For **Encryption type**, select **Customer-managed keys**. If the storage account is already configured for CMK, select **Change key**.
4. For **Encryption key**, select **Select from key vault**.
5. Select **Select a key vault and key**. For **Key store type**, select **Key vault**. Choose your key vault and key, and then choose **Select**.
6. For **Identity type**, choose **User-assigned** to use your previously created user-assigned managed identity.
7. Select **Select an identity**. Search for and select the user-assigned managed identity, and then select **Add**.
8. Select **Save**.

:::image type="content" source="media/customer-managed-keys/encryption-key-selection.png" alt-text="Screenshot showing the encryption selection and key selection for configuring customer-managed keys.":::

# [PowerShell](#tab/azure-powershell)
To configure customer-managed keys on an existing storage account by using Azure PowerShell with automatic key version updating (recommended), run the following cmdlet. Replace `<resource-group>`, `<identity-name>`, `<storage-account-name>`, `<key-vault-name>`, and `<key-name>` with your own values.

The following cmdlet uses your previously created user-assigned managed identity. If you want to use the storage account's system identity instead, set `IdentityType` to `SystemAssigned`, and remove the `Get-AzUserAssignedIdentity` lines, `UserAssignedIdentityId`, and `KeyVaultUserAssignedIdentityId`.

```azurepowershell
$resourceGroupName = "<resource-group>"
$keyVaultName = "<key-vault-name>"

$identityParams = @{
    ResourceGroupName = $resourceGroupName
    Name = "<identity-name>"
}
$identity = Get-AzUserAssignedIdentity @identityParams

$keyVault = Get-AzKeyVault -VaultName $keyVaultName
$key = Get-AzKeyVaultKey -VaultName $keyVaultName -Name "<key-name>"

$accountParams = @{
    ResourceGroupName = $resourceGroupName
    Name = "<storage-account-name>"
    IdentityType = "UserAssigned"
    UserAssignedIdentityId = $identity.Id
    KeyVaultUri = $keyVault.VaultUri
    KeyName = $key.Name
    KeyVaultEncryption = $true
    KeyVaultUserAssignedIdentityId = $identity.Id
}
Set-AzStorageAccount @accountParams
```

To use manual key version updating instead of automatic updating, add `KeyVersion = $key.Version` to `$accountParams`.

# [Azure CLI](#tab/azure-cli)
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

# [Portal](#tab/azure-portal)
To configure customer-managed keys for a new storage account by using the Azure portal, follow these steps. These steps use automatic key version updating. To use manual key version updating, select **Enter key from URI** in step 2, and enter a key URI that includes the key version.

1. On the **Encryption** tab during storage account creation, select **Customer-managed keys (CMK)** for **Encryption type**.
2. For **Encryption key**, select **Select a key vault and key**.
3. For **Subscription**, select the subscription that contains your key vault. The portal might default to a different subscription.
4. For **Key store type**, select **Key vault**.
5. Select your key vault and key.
6. Under **User-assigned identity**, choose **Select an identity**. The **Select user assigned managed identity** window opens.
7. Search for and select the user-assigned managed identity that you created. New storage accounts can't use a system-assigned managed identity.
8. Select **Add**.

    :::image type="content" source="media/customer-managed-keys/new-account-encryption-tab.png" alt-text="Screenshot of the Encryption tab of the Create a storage account page, with customer-managed keys, a key vault, a key, and a user-assigned identity selected.":::

9. Complete the remaining tabs, select **Review and create**, and then select **Create**.

# [PowerShell](#tab/azure-powershell)
To create a new storage account with customer-managed keys by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>`, `<identity-name>`, `<storage-account-name>`, `<key-vault-name>`, `<key-name>`, and `<region>` with your own values. You can specify different values for `Kind` and `SkuName`.

```azurepowershell
$resourceGroupName = "<resource-group>"
$keyVaultName = "<key-vault-name>"

$identityParams = @{
    ResourceGroupName = $resourceGroupName
    Name = "<identity-name>"
}
$identity = Get-AzUserAssignedIdentity @identityParams

$keyVault = Get-AzKeyVault -VaultName $keyVaultName
$key = Get-AzKeyVaultKey -VaultName $keyVaultName -Name "<key-name>"

$accountParams = @{
    ResourceGroupName = $resourceGroupName
    Name = "<storage-account-name>"
    Location = "<region>"
    SkuName = "Standard_LRS"
    Kind = "StorageV2"
    IdentityType = "UserAssigned"
    UserAssignedIdentityId = $identity.Id
    KeyVaultUri = $keyVault.VaultUri
    KeyName = $key.Name
    KeyVaultUserAssignedIdentityId = $identity.Id
}
New-AzStorageAccount @accountParams
```

To use manual key version updating instead of automatic, add `KeyVersion = $key.Version` to `$accountParams`.

# [Azure CLI](#tab/azure-cli)
To create a new storage account with customer-managed keys by using Azure CLI, run the following commands. Replace `<resource-group>`, `<identity-name>`, `<storage-account-name>`, `<key-vault-name>`, `<key-name>`, and `<region>` with your own values. You can specify different values for `--kind` and `--sku`.

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

## Verify the configuration
After you enable customer-managed keys, confirm that encryption is properly configured on your storage account. You can do this by using the Azure portal, Azure PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)
To verify the storage account configuration by using the Azure portal, follow these steps:

1. Go to your storage account in the Azure portal.
2. From the service menu, under **Security + networking**, select **Encryption**.
3. Confirm that **Encryption type** shows **Customer-managed keys**.
4. Verify that the information under **Key selection** is correct.

# [PowerShell](#tab/azure-powershell)
To verify the storage account configuration by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>` and `<storage-account-name>` with your own values.

```azurepowershell
$accountParams = @{
    ResourceGroupName = "<resource-group>"
    Name = "<storage-account-name>"
}
$account = Get-AzStorageAccount @accountParams

$account.Encryption.KeySource
$account.Encryption.KeyVaultProperties
```

Confirm that `KeySource` is `Microsoft.Keyvault` and that `KeyVaultProperties` shows your key vault URI and key name.

# [Azure CLI](#tab/azure-cli)
To verify the configuration by using Azure CLI, run the following command. Replace `<resource-group>` and `<storage-account-name>` with your own values.

```azurecli
az storage account show \
    --name <storage-account-name> \
    --resource-group <resource-group> \
    --query encryption
```

Confirm that `keySource` is `Microsoft.Keyvault` and the `keyVaultProperties` section shows your key vault URI and key name.

---

## Use a key in Azure Key Vault Managed HSM
You can store the customer-managed key in [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview) instead of Azure Key Vault. The steps are different from the Key Vault sections in these ways:

- Managed HSM uses its own local role-based access control (RBAC). You assign roles on the managed HSM, not with Azure RBAC on a key vault. Scope the role assignment for the storage account to the key, so that the managed identity can use only that key.
- Keys in a managed HSM are RSA-HSM keys. Use a key of size 2048, 3072, or 4096.
- The storage account uses the URI of the managed HSM in place of the key vault URI.

Before you begin, make sure that you have these items:

- A managed HSM that's provisioned and activated. For the steps, see [Quickstart: Provision and activate a managed HSM using Azure CLI](/azure/key-vault/managed-hsm/quick-create-cli).
- Purge protection enabled on the managed HSM. If purge protection isn't enabled, the storage account configuration fails with the error `Keyvault policy recoverable is not set`. You can't disable purge protection after you enable it. A deleted managed HSM continues to accrue charges until its retention period ends. For more information, see [Managed HSM soft-delete and purge protection](/azure/key-vault/managed-hsm/recovery).
- A local RBAC role on the managed HSM that lets you create keys, such as **Managed HSM Crypto User**.
- A user-assigned managed identity. For the steps, see [Create a user-assigned managed identity](#create-a-user-assigned-managed-identity).

Create a key in the managed HSM, assign the **Managed HSM Crypto Service Encryption User** role to the managed identity, and configure the storage account to use the key. Role assignments can take a few minutes to take effect. If the storage account configuration fails with an authorization error, wait a few minutes and try again.

# [Portal](#tab/azure-portal)
To create the key and assign the role, use the PowerShell or Azure CLI steps. Then configure the storage account in the Azure portal:

1. Go to your storage account.
2. From the service menu, under **Security + networking**, select **Encryption**.
3. For **Encryption type**, select **Customer-managed keys**. If the storage account is already configured for customer-managed keys, select **Change key**.
4. For **Encryption key**, select **Select from key vault**, and then select **Select a key vault and key**.
5. For **Key store type**, select **Managed HSM**.
6. Select your managed HSM and key, and then choose **Select**.
7. For **Identity type**, select **User-assigned**, and then select your user-assigned managed identity.
8. Select **Save**.

# [PowerShell](#tab/azure-powershell)
Run the following commands. Replace `<hsm-name>`, `<key-name>`, `<resource-group>`, `<identity-name>`, and `<storage-account-name>` with your own values.

```azurepowershell
$resourceGroupName = "<resource-group>"
$hsmName = "<hsm-name>"
$keyName = "<key-name>"

# Create an RSA-HSM key in the managed HSM
$keyParams = @{
    HsmName = $hsmName
    Name = $keyName
    KeyType = "RSA"
    Size = 2048
}
Add-AzKeyVaultKey @keyParams

# Assign the Managed HSM Crypto Service Encryption User role to the managed identity, scoped to the key
$identityParams = @{
    ResourceGroupName = $resourceGroupName
    Name = "<identity-name>"
}
$identity = Get-AzUserAssignedIdentity @identityParams

$roleParams = @{
    HsmName = $hsmName
    RoleDefinitionName = "Managed HSM Crypto Service Encryption User"
    ObjectId = $identity.PrincipalId
    Scope = "/keys/$keyName"
}
New-AzKeyVaultRoleAssignment @roleParams

# Configure customer-managed keys on the storage account
$hsm = Get-AzKeyVaultManagedHsm -Name $hsmName

$accountParams = @{
    ResourceGroupName = $resourceGroupName
    Name = "<storage-account-name>"
    IdentityType = "UserAssigned"
    UserAssignedIdentityId = $identity.Id
    KeyVaultUri = $hsm.HsmUri
    KeyName = $keyName
    KeyVaultEncryption = $true
    KeyVaultUserAssignedIdentityId = $identity.Id
}
Set-AzStorageAccount @accountParams
```

In a managed HSM, `Add-AzKeyVaultKey` with a key type of `RSA` creates an RSA-HSM key.

# [Azure CLI](#tab/azure-cli)
Run the following commands. Replace `<hsm-name>`, `<key-name>`, `<identity-name>`, `<resource-group>`, and `<storage-account-name>` with your own values.

```azurecli
HSM_NAME="<hsm-name>"
KEY_NAME="<key-name>"

# Create an RSA-HSM key in the managed HSM
az keyvault key create \
    --hsm-name $HSM_NAME \
    --name $KEY_NAME \
    --kty RSA-HSM \
    --size 2048

# Get the resource ID and principal ID of the user-assigned managed identity
IDENTITY_RESOURCE_ID=$(az identity show \
    --name <identity-name> \
    --resource-group <resource-group> \
    --query id -o tsv)
IDENTITY_PRINCIPAL_ID=$(az identity show \
    --name <identity-name> \
    --resource-group <resource-group> \
    --query principalId -o tsv)

# Assign the Managed HSM Crypto Service Encryption User role to the managed identity, scoped to the key
az keyvault role assignment create \
    --hsm-name $HSM_NAME \
    --role "Managed HSM Crypto Service Encryption User" \
    --assignee-object-id $IDENTITY_PRINCIPAL_ID \
    --assignee-principal-type ServicePrincipal \
    --scope /keys/$KEY_NAME

# Get the managed HSM URI
HSM_URI=$(az keyvault show \
    --hsm-name $HSM_NAME \
    --query properties.hsmUri -o tsv)

# Configure customer-managed keys on the storage account
az storage account update \
    --name <storage-account-name> \
    --resource-group <resource-group> \
    --identity-type UserAssigned \
    --user-identity-id $IDENTITY_RESOURCE_ID \
    --encryption-key-vault $HSM_URI \
    --encryption-key-name $KEY_NAME \
    --encryption-key-source Microsoft.Keyvault \
    --key-vault-user-identity-id $IDENTITY_RESOURCE_ID
```

---

To create a new storage account that uses a key in a managed HSM, follow the steps in [Configure customer-managed keys for a new storage account](#configure-customer-managed-keys-for-a-new-storage-account). Use the URI of the managed HSM as the key vault URI.

[!INCLUDE [entra-msi-cross-tenant-cmk-overview](~/reusable-content/ce-skilling/azure/includes/entra-msi-cross-tenant-cmk-overview.md)]

[!INCLUDE [entra-msi-cross-tenant-cmk-create-identities-authorize-key-vault](~/reusable-content/ce-skilling/azure/includes/entra-msi-cross-tenant-cmk-create-identities-authorize-key-vault.md)]

### The service provider configures customer-managed keys for an existing storage account
Up to this point, you configured the multitenant application on the ISV's tenant, installed the application on the customer's tenant, and configured the key vault and key on the customer's tenant. Next, you can configure customer-managed keys on an existing storage account with the key from the customer's tenant.

The following examples show how to configure customer-managed keys on an existing storage account by using a user-assigned managed identity to authorize access to the key vault. You can also use a system-assigned managed identity to configure customer-managed keys on an existing storage account. In either case, the managed identity must have appropriate permissions to access the key vault. For more information, see [Authenticate to Azure Key Vault](/azure/key-vault/general/authentication).

When you configure encryption with customer-managed keys for an existing storage account, you can choose to automatically update the key version used for encryption whenever a new version is available in the associated key vault. To enable this feature, omit the key version from the key URI. Alternatively, you can explicitly specify a key version to be used for encryption until the key version is manually updated. Including the key version on the key URI configures customer-managed keys for manual updating of the key version.

# [Portal](#tab/azure-portal)
To configure cross-tenant customer-managed keys for an existing storage account in the Azure portal, follow these steps:

1. Go to your storage account.
2. Under **Security + networking**, select **Encryption**. By default, key management is set to Microsoft-managed keys.
3. Select the **Customer-managed keys** option.
4. Choose the **Select from Key Vault** option.
5. Select **Enter key URI**, and specify the key URI. Omit the key version from the URI if you want Azure Files to automatically check for a new key version and update it.
6. Select the subscription that contains the key vault and key.
7. In the **Identity type** field, select **User-assigned**, then specify the managed identity with the federated identity credential that you created previously.
8. Expand the **Advanced** section, and select the multitenant registered application that you previously created in the ISV's tenant.

    :::image type="content" source="../common/media/customer-managed-keys-configure-cross-tenant-existing-account/portal-configure-cross-tenant-cmk.png" alt-text="Screenshot showing how to configure cross-tenant customer-managed keys for an existing storage account in Azure portal.":::

9. Save your changes.

After you specify the key from the key vault in the customer's tenant, the Azure portal indicates that customer-managed keys are configured with that key. It also indicates that automatic updating of the key version is enabled, and displays the key version currently in use for encryption. The portal also displays the type of managed identity used to authorize access to the key vault, the principal ID for the managed identity, and the application ID of the multitenant application.

:::image type="content" source="../common/media/customer-managed-keys-configure-cross-tenant-existing-account/portal-cross-tenant-cmk-settings.png" alt-text="Screenshot showing cross-tenant customer-managed key configuration.":::

# [PowerShell](#tab/azure-powershell)
To configure cross-tenant customer-managed keys for an existing storage account with PowerShell, first install the [Az.Storage PowerShell module](https://www.powershellgallery.com/packages/Az.Storage), version 5.1.0 or later. This module is installed with the [Az PowerShell module](https://www.powershellgallery.com/packages/Az), version 9.1.0 or later.

Next, call [Set-AzStorageAccount](/powershell/module/az.storage/set-azstorageaccount), providing the resource ID for the user-assigned managed identity that you configured previously in the ISV's subscription, and the application (client) ID for the multitenant application that you configured previously in the ISV's subscription. Provide the key vault URI and key name from the customer's key vault.

Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell
$accountName = "<storage-account>"
$kvUri = "<key-vault-uri>"
$keyName = "<key-name>"
$multiTenantAppId = "<multi-tenant-app-id>"

$accountParams = @{
    ResourceGroupName = $isvRgName
    Name = $accountName
    KeyVaultEncryption = $true
    UserAssignedIdentityId = $userIdentity.Id
    IdentityType = "SystemAssignedUserAssigned"
    KeyName = $keyName
    KeyVaultUri = $kvUri
    KeyVaultUserAssignedIdentityId = $userIdentity.Id
    KeyVaultFederatedClientId = $multiTenantAppId
}
Set-AzStorageAccount @accountParams
```

# [Azure CLI](#tab/azure-cli)
To configure cross-tenant customer-managed keys for an existing storage account with Azure CLI, first install the Azure CLI, version 2.42.0 or later. For more information about installing Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

Next, call [az storage account update](/cli/azure/storage/account#az-storage-account-update), providing the resource ID for the user-assigned managed identity that you configured previously in the ISV's subscription, and the application (client) ID for the multitenant application that you configured previously in the ISV's subscription. Provide the key vault URI and key name from the customer's key vault.

Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurecli
accountName="<storage-account>"
kvUri="<key-vault-uri>"
keyName="<key-name>"
multiTenantAppId="<multi-tenant-app-id>" # appId value from multi-tenant app

# Get the resource ID for the user-assigned managed identity.
identityResourceId=$(az identity show --name $userIdentityName \
    --resource-group $isvRgName \
    --query id \
    --output tsv)

az storage account update --name $accountName \
    --resource-group $isvRgName \
    --identity-type SystemAssigned,UserAssigned \
    --user-identity-id $identityResourceId \
    --encryption-key-vault $kvUri \
    --encryption-key-name $keyName \
    --encryption-key-source Microsoft.Keyvault \
    --key-vault-user-identity-id $identityResourceId \
    --key-vault-federated-client-id $multiTenantAppId
```

---

### The service provider creates a new storage account encrypted with the customer's key
You can also create a new storage account on the ISV's tenant and configure customer-managed keys with the key from the customer's tenant.

You must use an existing user-assigned managed identity to authorize access to the key vault when you configure customer-managed keys while creating the storage account. The user-assigned managed identity must have appropriate permissions to access the key vault. For more information, see [Authenticate to Azure Key Vault](/azure/key-vault/general/authentication).

When you configure encryption with customer-managed keys for a new storage account, you can choose to automatically update the key version used for encryption whenever a new version is available in the associated key vault. To do so, omit the key version from the key URI. Alternately, you can explicitly specify a key version to be used for encryption until the key version is manually updated. Including the key version on the key URI configures customer-managed keys for manual updating of the key version.

# [Portal](#tab/azure-portal)
To configure cross-tenant customer-managed keys for a new storage account in the Azure portal, follow these steps:

1. In the Azure portal, go to the **Storage accounts** page in the ISV's tenant, and select the **Create** button to create a new account.
2. Follow the steps outlined in [Create a classic file share](create-classic-file-share.md) to fill out the fields on the **Basics**, **Advanced**, **Networking**, and **Data Protection** tabs.
3. On the **Encryption** tab, indicate for which services you want to enable support for customer-managed keys in the **Enable support for customer-managed keys** field.
4. In the **Encryption type** field, select **Customer-managed keys (CMK)**.
5. In the **Encryption key** field, choose **Enter key from key vault**, and specify the key URI. Omit the key version from the URI if you want Azure Files to automatically check for a new key version and update it.
6. For the **User-assigned identity** field, search for the user-assigned managed identity that you created previously in the ISV's tenant.
7. Expand the **Advanced** section, and select the multitenant registered application that you previously created in the ISV's tenant.

    :::image type="content" source="../common/media/customer-managed-keys-configure-cross-tenant-new-account/portal-new-account-configure-cross-tenant-cmk.png" alt-text="Screenshot showing how to configure cross-tenant customer-managed keys for a new storage account in Azure portal.":::

8. Select the **Review** button to validate and create the account.

# [PowerShell](#tab/azure-powershell)
To configure cross-tenant customer-managed keys for a new storage account in PowerShell, first install the [Az.Storage PowerShell module](https://www.powershellgallery.com/packages/Az.Storage), version 5.1.0 or later. This module is installed with the [Az PowerShell module](https://www.powershellgallery.com/packages/Az), version 9.1.0 or later.

Next, call [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount), providing the resource ID for the user-assigned managed identity that you configured previously in the ISV's subscription, and the application (client) ID for the multitenant application that you configured previously in the ISV's subscription. Provide the key vault URI and key name from the customer's key vault.

Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell
$accountName = "<account-name>"
$kvUri = "<key-vault-uri>"
$keyName = "<key-name>"
$location = "<location>"
$multiTenantAppId = "<application-id>" # appId value from multi-tenant app

$userIdentity = Get-AzUserAssignedIdentity -Name "<user-assigned-identity>" -ResourceGroupName $isvRgName

$accountParams = @{
    ResourceGroupName = $isvRgName
    Name = $accountName
    Kind = "StorageV2"
    SkuName = "Standard_LRS"
    Location = $location
    UserAssignedIdentityId = $userIdentity.Id
    IdentityType = "SystemAssignedUserAssigned"
    KeyName = $keyName
    KeyVaultUri = $kvUri
    KeyVaultUserAssignedIdentityId = $userIdentity.Id
    KeyVaultFederatedClientId = $multiTenantAppId
}
New-AzStorageAccount @accountParams
```

# [Azure CLI](#tab/azure-cli)
To configure cross-tenant customer-managed keys for a new storage account with Azure CLI, first install the Azure CLI, version 2.42.0 or later. For more information about installing Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

Next, call [az storage account create](/cli/azure/storage/account#az-storage-account-create), providing the resource ID for the user-assigned managed identity that you configured previously in the ISV's subscription, and the application (client) ID for the multitenant application that you configured previously in the ISV's subscription. Provide the key vault URI and key name from the customer's key vault.

Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurecli
accountName="<storage-account>"
kvUri="<key-vault-uri>"
keyName="<key-name>"
multiTenantAppId="<multi-tenant-app-id>" # appId value from multi-tenant app

# Get the resource ID for the user-assigned managed identity.
identityResourceId=$(az identity show --name $userIdentityName \
    --resource-group $isvRgName \
    --query id \
    --output tsv)

az storage account create \
    --name $accountName \
    --resource-group $isvRgName \
    --location $isvLocation \
    --sku Standard_LRS \
    --kind StorageV2 \
    --identity-type SystemAssigned,UserAssigned \
    --user-identity-id $identityResourceId \
    --encryption-key-vault $kvUri \
    --encryption-key-name $keyName \
    --encryption-key-source Microsoft.Keyvault \
    --key-vault-user-identity-id $identityResourceId \
    --key-vault-federated-client-id $multiTenantAppId
```

---

You can also configure customer-managed keys with manual updating of the key version when you create a new storage account. To do so, include the key version when you specify the key URI.

To rotate or change the key, revoke access, or switch back to Microsoft-managed keys, use the steps in the following sections. These steps are the same for cross-tenant customer-managed keys.

## Key rotation
Regularly rotating your encryption key limits the exposure if a key is ever compromised. There are two ways to rotate encryption for a storage account that uses customer-managed keys:

- **Rotate the key version** - Create a new version of the same key in the key vault. The key name stays the same, but the version changes.
- **Change the key** - Switch the storage account to use an entirely different key (with a different name) in the same or a different key vault.

> [!IMPORTANT]
> Azure checks the key vault for a new key version only once daily. After rotating a key, wait 24 hours before disabling the previous key version.

### Rotate the key version
For security best practices, rotate the key version at least once every two years.

#### Automatic key version rotation (recommended)
If you configure customer-managed keys without specifying a key version (the default), Azure automatically checks for new key versions daily. If you create a new version of the key in key vault, Azure picks it up within 24 hours. You can also configure [automatic key rotation in Azure Key Vault](/azure/key-vault/keys/how-to-configure-key-rotation) to generate new key versions on a schedule.

#### Manual key version rotation
If you specify a key version when you configure customer-managed keys, Azure uses that specific version and doesn't automatically check for new versions. You must manually update the storage account configuration to point to the new key version.

# [Portal](#tab/azure-portal)
To manually rotate the key version by using the Azure portal, follow these steps:

1. Go to your key vault. From the service menu, under **Objects**, select **Keys**.
2. Select the key, and then select the new key version. Copy the value of **Key Identifier**. The value includes the key version.
3. Go to your storage account. From the service menu, under **Security + networking**, select **Encryption**.
4. Select **Change key**.
5. For **Encryption key**, select **Enter key URI**, and then paste the key identifier into **Key URI**.
6. Select **Save**.

# [PowerShell](#tab/azure-powershell)
To manually rotate the key version by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>`, `<storage-account-name>`, `<key-vault-name>`, and `<key-name>` with your own values.

```azurepowershell
$keyVaultName = "<key-vault-name>"
$keyVault = Get-AzKeyVault -VaultName $keyVaultName
$key = Get-AzKeyVaultKey -VaultName $keyVaultName -Name "<key-name>"

$accountParams = @{
    ResourceGroupName = "<resource-group>"
    Name = "<storage-account-name>"
    KeyVaultUri = $keyVault.VaultUri
    KeyName = $key.Name
    KeyVersion = $key.Version
    KeyVaultEncryption = $true
}
Set-AzStorageAccount @accountParams
```

# [Azure CLI](#tab/azure-cli)
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
To switch the storage account to use an entirely different key, create or import a new key in your key vault (see [Create or import an encryption key](#create-or-import-an-encryption-key)), and then update the storage account encryption configuration to use the new key.

# [Portal](#tab/azure-portal)
To change the key by using the Azure portal, follow these steps:

1. Go to your storage account.
2. From the service menu, under **Security + networking**, select **Encryption**.
3. Select **Change key**.
4. Select **Select a key vault and key**. For **Key store type**, select **Key vault**. Choose your key vault and new key, and then choose **Select**.
5. Select **Save**.

# [PowerShell](#tab/azure-powershell)
To change the key by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>`, `<storage-account-name>`, `<key-vault-name>`, and `<new-key-name>` with your own values.

The cmdlet sets `KeyVersion` to an empty value, which turns on automatic key version updating (recommended). If you omit `KeyVersion` and the storage account uses a key version that you specified earlier, the cmdlet keeps that version and fails, because the version doesn't exist for the new key. To use manual key version updating instead, set `KeyVersion` to `$key.Version`.

```azurepowershell
$keyVaultName = "<key-vault-name>"
$keyVault = Get-AzKeyVault -VaultName $keyVaultName
$key = Get-AzKeyVaultKey -VaultName $keyVaultName -Name "<new-key-name>"

$accountParams = @{
    ResourceGroupName = "<resource-group>"
    Name = "<storage-account-name>"
    KeyVaultUri = $keyVault.VaultUri
    KeyName = $key.Name
    KeyVersion = ""
    KeyVaultEncryption = $true
}
Set-AzStorageAccount @accountParams
```

# [Azure CLI](#tab/azure-cli)
To change the key by using Azure CLI, run the following commands. Replace `<storage-account-name>`, `<resource-group>`, `<key-vault-name>`, and `<new-key-name>` with your own values.

The command sets `--encryption-key-version` to an empty value, which turns on automatic key version updating (recommended). If you omit `--encryption-key-version` and the storage account uses a key version that you specified earlier, the command keeps that version and fails, because the version doesn't exist for the new key. To use manual key version updating instead, set `--encryption-key-version` to the version of the new key.

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
    --encryption-key-version "" \
    --encryption-key-source Microsoft.Keyvault
```

---

## Revoke access to file share data by disabling the key
You can block access to encrypted file share data by disabling or deleting the customer-managed key. Access isn't blocked immediately. It can take several minutes after you disable the key for data plane operations to start failing. While the key is disabled, all Azure Files data plane operations fail with HTTP 403 (Forbidden), including:

- List directories and files
- Create, get, or set directory or file
- Get or set file metadata
- Put range, copy file, rename file

To revoke access to your file share data, disable the key in key vault by using the Azure portal, Azure PowerShell, or Azure CLI. Re-enable the key to restore access.

# [Portal](#tab/azure-portal)
To disable the key by using the Azure portal, follow these steps:

1. Go to your key vault in the Azure portal.
2. From the service menu, under **Objects**, select **Keys**.
3. Right-click the key and select **Disable**.

# [PowerShell](#tab/azure-powershell)
To disable the key by using Azure PowerShell, run the following cmdlet. Replace `<key-vault-name>` and `<key-name>` with your own values.

```azurepowershell
$keyParams = @{
    VaultName = "<key-vault-name>"
    Name = "<key-name>"
    Enable = $false
}
Update-AzKeyVaultKey @keyParams
```

# [Azure CLI](#tab/azure-cli)
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

# [Portal](#tab/azure-portal)
To switch back to Microsoft-managed keys by using the Azure portal, follow these steps:

1. Go to your storage account in the Azure portal.
2. From the service menu, under **Security + networking**, select **Encryption**.
3. Change **Encryption type** to **Microsoft-managed keys**.
4. Select **Save**.

# [PowerShell](#tab/azure-powershell)
To switch back to Microsoft-managed keys by using Azure PowerShell, run the following cmdlet. Replace `<resource-group>` and `<storage-account-name>` with your own values.

```azurepowershell
$accountParams = @{
    ResourceGroupName = "<resource-group>"
    Name = "<storage-account-name>"
    StorageEncryption = $true
}
Set-AzStorageAccount @accountParams
```

# [Azure CLI](#tab/azure-cli)
To switch back to Microsoft-managed keys by using Azure CLI, run the following command. Replace `<resource-group>` and `<storage-account-name>` with your own values.

```azurecli
az storage account update \
    --name <storage-account-name> \
    --resource-group <resource-group> \
    --encryption-key-source Microsoft.Storage
```

---

## Related content
- [Encryption at rest for Azure Files](files-encryption-at-rest.md)
- [Secure your Azure file shares](secure-files.md)
- [What is Azure Key Vault?](/azure/key-vault/general/overview)
