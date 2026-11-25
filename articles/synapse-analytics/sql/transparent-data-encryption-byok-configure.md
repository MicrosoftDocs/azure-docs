---
title: Enable TDE with Azure Key Vault
titleSuffix: Azure Synapse Analytics
description: Learn how to configure Azure Synapse Analytics to start using Transparent Data Encryption (TDE) for encryption-at-rest using PowerShell or Azure CLI.
author: Pietervanhove
ms.author: pivanho
ms.reviewer: vanto
ms.date: 10/06/2026
ms.service: azure-synapse-analytics
ms.topic: how-to
ms.custom:
  - devx-track-azurecli
  - devx-track-azurepowershell
---

# PowerShell and Azure CLI: Enable Transparent Data Encryption with customer-managed key from Azure Key Vault

**Applies to:** Azure Synapse Analytics dedicated SQL pools (formerly SQL DW)

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

This article walks through how to use a key from Azure Key Vault for transparent data encryption (TDE) on Azure Synapse Analytics. To learn more about the TDE with Azure Key Vault integration - Bring Your Own Key (BYOK) Support, visit [TDE with customer-managed keys in Azure Key Vault](transparent-data-encryption-byok-overview.md).

> [!NOTE]
> This article covers standalone dedicated SQL pools (formerly SQL DW).
>
> - For Azure Synapse Analytics dedicated SQL pools (formerly SQL DW), set the TDE protector at the server level. All encrypted databases associated with that server inherit the TDE protector.
> - Encrypt the data in dedicated SQL pools and serverless SQL pools in a Synapse workspace by using the customer-managed key configured at the workspace level. For more information on transparent data encryption for dedicated SQL pools inside Synapse workspaces, see [Azure Synapse Analytics encryption](/azure/synapse-analytics/security/workspaces-encryption).

## Prerequisites for PowerShell

- You must have an Azure subscription and be an administrator on that subscription.
- [Recommended but Optional] Have a hardware security module (HSM) or local key store for creating a local copy of the TDE Protector key material.
- You must have Azure PowerShell installed and running.
- Create an Azure Key Vault and Key to use for TDE.
  - [Instructions for using a hardware security module (HSM) and Azure Key Vault](/azure/key-vault/keys/hsm-protected-keys)
    - The key vault must have the following property to be used for TDE:
  - [soft-delete](/azure/key-vault/general/soft-delete-overview) and purge protection
- The key must have the following attributes to be used for TDE:
  - The activation date (if set) must be a date and time in the past
  - The expiration date (if set) must be a future date and time
  - The key must be in the Enabled state
  - Able to perform *get*, *wrap key*, *unwrap key* operations
- To use an Azure Key Vault Managed HSM key, follow instructions to [create and activate a Managed HSM using Azure CLI](/azure/key-vault/managed-hsm/quick-create-cli)

# [PowerShell](#tab/azure-powershell)

For Az PowerShell module installation instructions, see [Install Azure PowerShell](/powershell/azure/install-az-ps).

For specifics on Azure Key Vault, see [PowerShell instructions from Azure Key Vault](/azure/key-vault/secrets/quick-create-powershell) and [How to use Azure Key Vault soft-delete with PowerShell](/azure/key-vault/general/key-vault-recovery).

<a name='assign-an-azure-active-directory-azure-ad-identity-to-your-server'></a>

## Assign a Microsoft Entra identity to your server

If you have an existing [server](logical-servers.md), use the following instructions to add a Microsoft Entra identity to your server:

   ```powershell
   $server = Set-AzSqlServer -ResourceGroupName <SQLDatabaseResourceGroupName> -ServerName <LogicalServerName> -AssignIdentity
   ```

If you're creating a server, use the [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver) cmdlet with the `-Identity` tag to add a Microsoft Entra identity during server creation:

   ```powershell
   $server = New-AzSqlServer -ResourceGroupName <SQLDatabaseResourceGroupName> -Location <RegionName> `
       -ServerName <LogicalServerName> -ServerVersion "12.0" -SqlAdministratorCredentials <PSCredential> -AssignIdentity
   ```

## Grant Azure Key Vault permissions to your server

Use the [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy) cmdlet to grant your server access to the key vault before using a key from it for TDE.

   ```powershell
   Set-AzKeyVaultAccessPolicy -VaultName <KeyVaultName> `
       -ObjectId $server.Identity.PrincipalId -PermissionsToKeys get, wrapKey, unwrapKey
   ```

To add permissions to your server on a Managed HSM, add the **Managed HSM Crypto Service Encryption User** local RBAC role to the server. This role enables the server to perform `get`, `wrap key`, and `unwrap key` operations on the keys in the Managed HSM. For more information, see [Managed HSM role management](/azure/key-vault/managed-hsm/role-management).

## Add the Azure Key Vault key to the server and set the TDE Protector

- Use the [Get-AzKeyVaultKey](/powershell/module/az.keyvault/get-azkeyvaultkey) cmdlet to retrieve the key ID from key vault.
- Use the [Add-AzSqlServerKeyVaultKey](/powershell/module/az.sql/add-azsqlserverkeyvaultkey) cmdlet to add the key from the Azure Key Vault to the server.
- Use the [Set-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/set-azsqlservertransparentdataencryptionprotector) cmdlet to set the key as the TDE protector for all server resources.
- Use the [Get-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/get-azsqlservertransparentdataencryptionprotector) cmdlet to confirm that the TDE protector was configured as intended.

> [!NOTE]
> For Managed HSM keys, use Az.Sql 2.11.1 version of PowerShell or higher.

> [!NOTE]
> The combined length for the key vault name and key name can't exceed 94 characters.

> [!TIP]
> **Using versioned Azure Key Vault keys for TDE**
>
> When setting the TDE protector, reference an Azure Key Vault key by using a specific key version.
>
> Example:
> - Key identifier that includes a specific version
> 
>     `https://<key-vault-name>.vault.azure.net/keys/<key-name>/<key-version>`

```powershell
# add the key from Azure Key Vault to the server
Add-AzSqlServerKeyVaultKey -ResourceGroupName <SQLDatabaseResourceGroupName> -ServerName <LogicalServerName> -KeyId <KeyVaultKeyId>

# set the key as the TDE protector for all resources under the server
Set-AzSqlServerTransparentDataEncryptionProtector -ResourceGroupName <SQLDatabaseResourceGroupName> -ServerName <LogicalServerName> `
   -Type AzureKeyVault -KeyId <KeyVaultKeyId>

# confirm the TDE protector was configured as intended
Get-AzSqlServerTransparentDataEncryptionProtector -ResourceGroupName <SQLDatabaseResourceGroupName> -ServerName <LogicalServerName>
```

## Turn on TDE

Use the [Set-AzSqlDatabaseTransparentDataEncryption](/powershell/module/az.sql/set-azsqldatabasetransparentdataencryption) cmdlet to turn on TDE.

```powershell
Set-AzSqlDatabaseTransparentDataEncryption -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> -DatabaseName <DatabaseName> -State "Enabled"
```

Now the database or data warehouse has TDE enabled with an encryption key in Azure Key Vault.

## Check the encryption state and encryption activity

Use the [Get-AzSqlDatabaseTransparentDataEncryption](/powershell/module/az.sql/get-azsqldatabasetransparentdataencryption) to get the encryption state for a database or data warehouse.

```powershell
# get the encryption state of the database
Get-AzSqlDatabaseTransparentDataEncryption -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> -DatabaseName <DatabaseName> `
```

# [The Azure CLI](#tab/azure-cli)

To install the required version of Azure CLI (version 2.0 or later) and connect to your Azure subscription, see [Install and Configure the Azure Cross-Platform Command-Line Interface 2.0](/cli/azure/install-azure-cli).

For specifics on Azure Key Vault, see [Manage Azure Key Vault using Azure CLI 2.0](/azure/key-vault/general/manage-with-cli2) and [How to use Azure Key Vault soft-delete with the CLI](/azure/key-vault/general/key-vault-recovery).

<a name='assign-an-azure-ad-identity-to-your-server'></a>

## Assign a Microsoft Entra identity to your server

```azurecli
# create server (with identity) and database
az sql server create --name <servername> --resource-group <rgname>  --location <location> --admin-user <user> --admin-password <password> --assign-identity
az sql db create --name <dbname> --server <servername> --resource-group <rgname>
```

> [!TIP]
> Keep the "principalID" from creating the server, it is the object ID used to assign Azure Key Vault permissions in the next step.

## Grant Azure Key Vault permissions to your server

```azurecli
# create Azure Key Vault, key and grant permission
az keyvault create --name <kvname> --resource-group <rgname> --location <location> --enable-soft-delete true
az keyvault key create --name <keyname> --vault-name <kvname> --protection software
az keyvault set-policy --name <kvname>  --object-id <objectid> --resource-group <rgname> --key-permissions wrapKey unwrapKey get
```

> [!TIP]
> Keep the key URI or key ID of the new key for the next step, for example: `https://contosokeyvault.vault.azure.net/keys/Key1/<key-id>`

## Add the Azure Key Vault key to the server and set the TDE Protector

```azurecli
# add server key and update encryption protector
az sql server key create --server <servername> --resource-group <rgname> --kid <keyID>
az sql server tde-key set --server <servername> --server-key-type AzureKeyVault  --resource-group <rgname> --kid <keyID>
```

> [!NOTE]
> The combined length for the key vault name and key name can't exceed 94 characters.

## Turn on TDE

```azurecli
# enable encryption
az sql db tde set --database <dbname> --server <servername> --resource-group <rgname> --status Enabled
```

Now the database or data warehouse has TDE enabled with a customer-managed encryption key in Azure Key Vault.

## Check the encryption state

```azurecli
# get whether encryption is on or off
az sql db tde show --database <dbname> --server <servername> --resource-group <rgname>
```

* * *

## Useful PowerShell cmdlets

# [PowerShell](#tab/azure-powershell)

- Use the [Set-AzSqlDatabaseTransparentDataEncryption](/powershell/module/az.sql/set-azsqldatabasetransparentdataencryption) cmdlet to turn off TDE.

   ```powershell
   Set-AzSqlDatabaseTransparentDataEncryption -ServerName <LogicalServerName> -ResourceGroupName <SQLDatabaseResourceGroupName> `
      -DatabaseName <DatabaseName> -State "Disabled"
   ```

- Use the [Get-AzSqlServerKeyVaultKey](/powershell/module/az.sql/get-azsqlserverkeyvaultkey) cmdlet to return the list of Azure Key Vault keys added to the server.

   ```powershell
   # KeyId is an optional parameter, to return a specific key version
   Get-AzSqlServerKeyVaultKey -ServerName <LogicalServerName> -ResourceGroupName <SQLDatabaseResourceGroupName>
   ```

- Use the [Remove-AzSqlServerKeyVaultKey](/powershell/module/az.sql/remove-azsqlserverkeyvaultkey) to remove an Azure Key Vault key from the server.

   ```powershell
   # the key set as the TDE Protector cannot be removed
   Remove-AzSqlServerKeyVaultKey -KeyId <KeyVaultKeyId> -ServerName <LogicalServerName> -ResourceGroupName <SQLDatabaseResourceGroupName>
   ```

# [Azure CLI](#tab/azure-cli)

- For general database settings, see [az sql](/cli/azure/sql).

- For vault key settings, see [az sql server key](/cli/azure/sql/server/key).

- For TDE settings, see [az sql server tde-key](/cli/azure/sql/server/tde-key) and [az sql db tde](/cli/azure/sql/db/tde).

* * *

## Troubleshooting

- If the key vault can't be found, ensure you're in the right subscription.

   # [PowerShell](#tab/azure-powershell)

   ```powershell
   Get-AzSubscription -SubscriptionId <SubscriptionId>
   ```

   # [Azure CLI](#tab/azure-cli)

   ```azurecli
   az account show - s <SubscriptionId>
   ```

   * * *

- If you can't add the new key to the server, or if you can't update the new key as the TDE Protector, check the following conditions:

  - The key shouldn't have an expiration date.
  - The key must have the *get*, *wrap key*, and *unwrap key* operations enabled.

## Related content

- To learn how to rotate the TDE Protector of a server to comply with security requirements, see [Rotate the Transparent Data Encryption protector Using PowerShell](transparent-data-encryption-byok-key-rotation.md).
- To learn how to remove a potentially compromised TDE Protector, see [Remove a potentially compromised key](transparent-data-encryption-byok-remove-tde-protector.md).
