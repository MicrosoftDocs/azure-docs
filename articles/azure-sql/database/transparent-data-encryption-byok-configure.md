---
title: Enable SQL TDE with Azure Key Vault
titleSuffix: Azure SQL Database & SQL Managed Instance & Azure Synapse Analytics 
description: "Learn how to configure an Azure SQL Database and Azure Synapse Analytics to start using Transparent Data Encryption (TDE) for encryption-at-rest using PowerShell or the Azure CLI."
services: sql-database
ms.service: sql-db-mi
ms.subservice: security
ms.custom: seo-lt-2019 sqldbrb=1, devx-track-azurecli, devx-track-azurepowershell
ms.devlang:
ms.topic: how-to
author: shohamMSFT
ms.author: shohamd
ms.reviewer: vanto
ms.date: 06/23/2021
---

# PowerShell and the Azure CLI: Enable Transparent Data Encryption with customer-managed key from Azure Key Vault
[!INCLUDE[appliesto-sqldb-sqlmi-asa](../includes/appliesto-sqldb-sqlmi-asa.md)]

This article walks through how to use a key from Azure Key Vault for Transparent Data Encryption (TDE) on Azure SQL Database or Azure Synapse Analytics. To learn more about the TDE with Azure Key Vault integration - Bring Your Own Key (BYOK) Support, visit [TDE with customer-managed keys in Azure Key Vault](transparent-data-encryption-byok-overview.md). 

> [!NOTE] 
> Azure SQL now supports using a RSA key stored in a Managed HSM as TDE Protector. This feature is in **public preview**. Azure Key Vault Managed HSM is a fully managed, highly available, single-tenant, standards-compliant cloud service that enables you to safeguard cryptographic keys for your cloud applications, using FIPS 140-2 Level 3 validated HSMs. Learn more about [Managed HSMs](../../key-vault/managed-hsm/index.yml).

> [!NOTE]
> This article applies to Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics (dedicated SQL pools (formerly SQL DW)). For documentation on Transparent Data Encryption for dedicated SQL pools inside Synapse workspaces, see [Azure Synapse Analytics encryption](../../synapse-analytics/security/workspaces-encryption.md).

## Prerequisites for PowerShell

- You must have an Azure subscription and be an administrator on that subscription.
- [Recommended but Optional] Have a hardware security module (HSM) or local key store for creating a local copy of the TDE Protector key material.
- You must have Azure PowerShell installed and running.
- Create an Azure Key Vault and Key to use for TDE.
  - [Instructions for using a hardware security module (HSM) and Key Vault](../../key-vault/keys/hsm-protected-keys.md)
    - The key vault must have the following property to be used for TDE:
  - [soft-delete](../../key-vault/general/soft-delete-overview.md) and purge protection
- The key must have the following attributes to be used for TDE:
  - No expiration date
  - Not disabled
  - Able to perform *get*, *wrap key*, *unwrap key* operations
- **(In Preview)** To use a Managed HSM key, follow instructions to [create and activate a Managed HSM using Azure CLI](../../key-vault/managed-hsm/quick-create-cli.md)

# [PowerShell](#tab/azure-powershell)

For Az module installation instructions, see [Install Azure PowerShell](/powershell/azure/install-az-ps). For specific cmdlets, see [AzureRM.Sql](/powershell/module/AzureRM.Sql/).

For specifics on Key Vault, see [PowerShell instructions from Key Vault](../../key-vault/secrets/quick-create-powershell.md) and [How to use Key Vault soft-delete with PowerShell](../../key-vault/general/key-vault-recovery.md).

> [!IMPORTANT]
> The PowerShell Azure Resource Manager (RM) module is still supported, but all future development is for the Az.Sql module. The AzureRM module will continue to receive bug fixes until at least December 2020.  The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. For more about their compatibility, see [Introducing the new Azure PowerShell Az module](/powershell/azure/new-azureps-module-az).

## Assign an Azure Active Directory (Azure AD) identity to your server

If you have an existing [server](logical-servers.md), use the following to add an Azure Active Directory (Azure AD) identity to your server:

   ```powershell
   $server = Set-AzSqlServer -ResourceGroupName <SQLDatabaseResourceGroupName> -ServerName <LogicalServerName> -AssignIdentity
   ```

If you are creating a server, use the [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver) cmdlet with the tag -Identity to add an Azure AD identity during server creation:

   ```powershell
   $server = New-AzSqlServer -ResourceGroupName <SQLDatabaseResourceGroupName> -Location <RegionName> `
       -ServerName <LogicalServerName> -ServerVersion "12.0" -SqlAdministratorCredentials <PSCredential> -AssignIdentity
   ```

## Grant Key Vault permissions to your server

Use the [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy) cmdlet to grant your server access to the key vault before using a key from it for TDE.

   ```powershell
   Set-AzKeyVaultAccessPolicy -VaultName <KeyVaultName> `
       -ObjectId $server.Identity.PrincipalId -PermissionsToKeys get, wrapKey, unwrapKey
   ```
For adding permissions to your server on a Managed HSM, add the 'Managed HSM Crypto Service Encryption User' local RBAC role to the server. This will enable the server to perform get, wrap key, unwrap key operations on the keys in the Managed HSM.
[Instructions for provisioning server access on Managed HSM](../../key-vault/managed-hsm/role-management.md)

## Add the Key Vault key to the server and set the TDE Protector

- Use the [Get-AzKeyVaultKey](/powershell/module/az.keyvault/get-azkeyvaultkey) cmdlet to retrieve the key ID from key vault
- Use the [Add-AzSqlServerKeyVaultKey](/powershell/module/az.sql/add-azsqlserverkeyvaultkey) cmdlet to add the key from the Key Vault to the server.
- Use the [Set-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/set-azsqlservertransparentdataencryptionprotector) cmdlet to set the key as the TDE protector for all server resources.
- Use the [Get-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/get-azsqlservertransparentdataencryptionprotector) cmdlet to confirm that the TDE protector was configured as intended.

> [!NOTE]
> **(In Preview)** For Managed HSM keys, use Az.Sql 2.11.1 version of PowerShell.

> [!NOTE]
> The combined length for the key vault name and key name cannot exceed 94 characters.

> [!TIP]
> An example KeyId from Key Vault: `https://contosokeyvault.vault.azure.net/keys/Key1/1a1a2b2b3c3c4d4d5e5e6f6f7g7g8h8h`
>
> An example KeyId from Managed HSM:<br/>https://contosoMHSM.managedhsm.azure.net/keys/myrsakey

```powershell
# add the key from Key Vault to the server
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

Now the database or data warehouse has TDE enabled with an encryption key in Key Vault.

## Check the encryption state and encryption activity

Use the [Get-AzSqlDatabaseTransparentDataEncryption](/powershell/module/az.sql/get-azsqldatabasetransparentdataencryption) to get the encryption state and the [Get-AzSqlDatabaseTransparentDataEncryptionActivity](/powershell/module/az.sql/get-azsqldatabasetransparentdataencryptionactivity) to check the encryption progress for a database or data warehouse.

```powershell
# get the encryption state
Get-AzSqlDatabaseTransparentDataEncryption -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> -DatabaseName <DatabaseName> `

# check the encryption progress for a database or data warehouse
Get-AzSqlDatabaseTransparentDataEncryptionActivity -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> -DatabaseName <DatabaseName>  
```

# [The Azure CLI](#tab/azure-cli)

To install the required version of the Azure CLI (version 2.0 or later) and connect to your Azure subscription, see [Install and Configure the Azure Cross-Platform Command-Line Interface 2.0](/cli/azure/install-azure-cli).

For specifics on Key Vault, see [Manage Key Vault using the CLI 2.0](../../key-vault/general/manage-with-cli2.md) and [How to use Key Vault soft-delete with the CLI](../../key-vault/general/key-vault-recovery.md).

## Assign an Azure AD identity to your server

```azurecli
# create server (with identity) and database
az sql server create --name <servername> --resource-group <rgname>  --location <location> --admin-user <user> --admin-password <password> --assign-identity
az sql db create --name <dbname> --server <servername> --resource-group <rgname>
```

> [!TIP]
> Keep the "principalID" from creating the server, it is the object id used to assign key vault permissions in the next step

## Grant Key Vault permissions to your server

```azurecli
# create key vault, key and grant permission
az keyvault create --name <kvname> --resource-group <rgname> --location <location> --enable-soft-delete true
az keyvault key create --name <keyname> --vault-name <kvname> --protection software
az keyvault set-policy --name <kvname>  --object-id <objectid> --resource-group <rgname> --key-permissions wrapKey unwrapKey get
```

> [!TIP]
> Keep the key URI or keyID of the new key for the next step, for example: `https://contosokeyvault.vault.azure.net/keys/Key1/1a1a2b2b3c3c4d4d5e5e6f6f7g7g8h8h`

## Add the Key Vault key to the server and set the TDE Protector

```azurecli
# add server key and update encryption protector
az sql server key create --server <servername> --resource-group <rgname> --kid <keyID>
az sql server tde-key set --server <servername> --server-key-type AzureKeyVault  --resource-group <rgname> --kid <keyID>
```

> [!NOTE]
> The combined length for the key vault name and key name cannot exceed 94 characters.

## Turn on TDE

```azurecli
# enable encryption
az sql db tde set --database <dbname> --server <servername> --resource-group <rgname> --status Enabled
```

Now the database or data warehouse has TDE enabled with a customer-managed encryption key in Azure Key Vault.

## Check the encryption state and encryption activity

```azurecli
# get encryption scan progress
az sql db tde list-activity --database <dbname> --server <servername> --resource-group <rgname>  

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

- Use the [Get-AzSqlServerKeyVaultKey](/powershell/module/az.sql/get-azsqlserverkeyvaultkey) cmdlet to return the list of Key Vault keys added to the server.

   ```powershell
   # KeyId is an optional parameter, to return a specific key version
   Get-AzSqlServerKeyVaultKey -ServerName <LogicalServerName> -ResourceGroupName <SQLDatabaseResourceGroupName>
   ```

- Use the [Remove-AzSqlServerKeyVaultKey](/powershell/module/az.sql/remove-azsqlserverkeyvaultkey) to remove a Key Vault key from the server.

   ```powershell
   # the key set as the TDE Protector cannot be removed
   Remove-AzSqlServerKeyVaultKey -KeyId <KeyVaultKeyId> -ServerName <LogicalServerName> -ResourceGroupName <SQLDatabaseResourceGroupName>
   ```

# [The Azure CLI](#tab/azure-cli)

- For general database settings, see [az sql](/cli/azure/sql).

- For vault key settings, see [az sql server key](/cli/azure/sql/server/key).

- For TDE settings, see [az sql server tde-key](/cli/azure/sql/server/tde-key) and [az sql db tde](/cli/azure/sql/db/tde).

* * *

## Troubleshooting

Check the following if an issue occurs:

- If the key vault cannot be found, make sure you're in the right subscription.

   # [PowerShell](#tab/azure-powershell)

   ```powershell
   Get-AzSubscription -SubscriptionId <SubscriptionId>
   ```

   # [The Azure CLI](#tab/azure-cli)

   ```azurecli
   az account show - s <SubscriptionId>
   ```

   * * *

- If the new key cannot be added to the server, or the new key cannot be updated as the TDE Protector, check the following:
   - The key should not have an expiration date
   - The key must have the *get*, *wrap key*, and *unwrap key* operations enabled.

## Next steps

- Learn how to rotate the TDE Protector of a server to comply with security requirements: [Rotate the Transparent Data Encryption protector Using PowerShell](transparent-data-encryption-byok-key-rotation.md).
- In case of a security risk, learn how to remove a potentially compromised TDE Protector: [Remove a potentially compromised key](transparent-data-encryption-byok-remove-tde-protector.md).
