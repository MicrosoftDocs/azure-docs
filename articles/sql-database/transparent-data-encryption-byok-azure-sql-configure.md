---
title: "PowerShell and CLI: Enable SQL TDE - your key - Azure SQL Database | Microsoft Docs"
description: "Learn how to configure an Azure SQL Database and Data Warehouse to start using Transparent Data Encryption (TDE) for encryption-at-rest using PowerShell or CLI."
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: aliceku
ms.author: aliceku
ms.reviewer: vanto
manager: craigg
ms.date: 09/20/2018
---

# PowerShell and CLI: Enable Transparent Data Encryption using your own key from Azure Key Vault

This article walks through how to use a key from Azure Key Vault for Transparent Data Encryption (TDE) on a SQL Database or Data Warehouse. To learn more about the TDE with Bring Your Own Key (BYOK) Support, visit [TDE Bring Your Own Key to Azure SQL](transparent-data-encryption-byok-azure-sql.md). 

## Prerequisites for PowerShell

- You must have an Azure subscription and be an administrator on that subscription.
- [Recommended but Optional] Have a hardware security module (HSM) or local key store for creating a local copy of the TDE Protector key material.
- You must have Azure PowerShell version 4.2.0 or newer installed and running. 
- Create an Azure Key Vault and Key to use for TDE.
   - [PowerShell instructions from Key Vault](../key-vault/key-vault-get-started.md)
   - [Instructions for using a hardware security module (HSM) and Key Vault](../key-vault/key-vault-get-started.md#HSM)
 - The key vault must have the following property to be used for TDE:
   - [soft-delete](../key-vault/key-vault-ovw-soft-delete.md)
   - [How to use Key Vault soft-delete with PowerShell](../key-vault/key-vault-soft-delete-powershell.md) 
- The key must have the following attributes to be used for TDE:
   - No expiration date
   - Not disabled
   - Able to perform *get*, *wrap key*, *unwrap key* operations

## Step 1. Assign an Azure AD identity to your server 

If you have an existing server, use the following to add an Azure AD identity to your server:

   ```powershell
   $server = Set-AzSqlServer `
   -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> `
   -AssignIdentity
   ```

If you are creating a server, use the [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver) cmdlet with the tag -Identity to add an Azure AD identity during server creation:

   ```powershell
   $server = New-AzSqlServer `
   -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -Location <RegionName> `
   -ServerName <LogicalServerName> `
   -ServerVersion "12.0" `
   -SqlAdministratorCredentials <PSCredential> `
   -AssignIdentity 
   ```

## Step 2. Grant Key Vault permissions to your server

Use the [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy) cmdlet to grant your server access to the key vault before using a key from it for TDE.

   ```powershell
   Set-AzKeyVaultAccessPolicy  `
   -VaultName <KeyVaultName> `
   -ObjectId $server.Identity.PrincipalId `
   -PermissionsToKeys get, wrapKey, unwrapKey
   ```

## Step 3. Add the Key Vault key to the server and set the TDE Protector

- Use the [Add-AzSqlServerKeyVaultKey](/powershell/module/az.sql/add-azsqlserverkeyvaultkey) cmdlet to add the key from the Key Vault to the server.
- Use the [Set-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/set-azsqlservertransparentdataencryptionprotector) cmdlet to set the key as the TDE protector for all server resources.
- Use the [Get-AzSqlServerTransparentDataEncryptionProtector](/powershell/module/az.sql/get-azsqlservertransparentdataencryptionprotector) cmdlet to confirm that the TDE protector was configured as intended.

> [!Note]
> The combined length for the key vault name and key name cannot exceed 94 characters.
> 

>[!Tip]
>An example KeyId from Key Vault: https://contosokeyvault.vault.azure.net/keys/Key1/1a1a2b2b3c3c4d4d5e5e6f6f7g7g8h8h
>

   ```powershell
   <# Add the key from Key Vault to the server #>
   Add-AzSqlServerKeyVaultKey `
   -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> `
   -KeyId <KeyVaultKeyId>

   <# Set the key as the TDE protector for all resources under the server #>
   Set-AzSqlServerTransparentDataEncryptionProtector `
   -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> `
   -Type AzureKeyVault `
   -KeyId <KeyVaultKeyId> 

   <# To confirm that the TDE protector was configured as intended: #>
   Get-AzSqlServerTransparentDataEncryptionProtector `
   -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> 
   ```

## Step 4. Turn on TDE 

Use the [Set-AzSqlDatabaseTransparentDataEncryption](/powershell/module/az.sql/set-azsqldatabasetransparentdataencryption) cmdlet to turn on TDE.

   ```powershell
   Set-AzSqlDatabaseTransparentDataEncryption `
   -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> `
   -DatabaseName <DatabaseName> `
   -State "Enabled"
   ```

Now the database or data warehouse has TDE enabled with an encryption key in Key Vault.

## Step 5. Check the encryption state and encryption activity

Use the [Get-AzSqlDatabaseTransparentDataEncryption](/powershell/module/az.sql/get-azsqldatabasetransparentdataencryption) to get the encryption state and the [Get-AzSqlDatabaseTransparentDataEncryptionActivity](/powershell/module/az.sql/get-azsqldatabasetransparentdataencryptionactivity) to check the encryption progress for a database or data warehouse.

   ```powershell
   # Get the encryption state
   Get-AzSqlDatabaseTransparentDataEncryption `
   -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> `
   -DatabaseName <DatabaseName> `

   <# Check the encryption progress for a database or data warehouse #>
   Get-AzSqlDatabaseTransparentDataEncryptionActivity `
   -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -ServerName <LogicalServerName> `
   -DatabaseName <DatabaseName>  
   ```

## Other useful PowerShell cmdlets

- Use the [Set-AzSqlDatabaseTransparentDataEncryption](/powershell/module/az.sql/set-azsqldatabasetransparentdataencryption) cmdlet to turn off TDE.

   ```powershell
   Set-AzSqlDatabaseTransparentDataEncryption `
   -ServerName <LogicalServerName> `
   -ResourceGroupName <SQLDatabaseResourceGroupName> `
   -DatabaseName <DatabaseName> `
   -State "Disabled”
   ```
 
- Use the [Get-AzSqlServerKeyVaultKey](/powershell/module/az.sql/get-azsqlserverkeyvaultkey) cmdlet to return the list of Key Vault keys added to the server.

   ```powershell
   <# KeyId is an optional parameter, to return a specific key version #>
   Get-AzSqlServerKeyVaultKey `
   -ServerName <LogicalServerName> `
   -ResourceGroupName <SQLDatabaseResourceGroupName>
   ```
 
- Use the [Remove-AzSqlServerKeyVaultKey](/powershell/module/az.sql/remove-azsqlserverkeyvaultkey) to remove a Key Vault key from the server.

   ```powershell
   <# The key set as the TDE Protector cannot be removed. #>
   Remove-AzSqlServerKeyVaultKey `
   -KeyId <KeyVaultKeyId> `
   -ServerName <LogicalServerName> `
   -ResourceGroupName <SQLDatabaseResourceGroupName>   
   ```
 
## Troubleshooting

Check the following if an issue occurs:
- If the key vault cannot be found, make sure you're in the right subscription using the [Get-AzSubscription](/powershell/module/az.profile/get-azsubscription) cmdlet.

   ```powershell
   Get-AzSubscription `
   -SubscriptionId <SubscriptionId>
   ```

- If the new key cannot be added to the server, or the new key cannot be updated as the TDE Protector, check the following:
   - The key should not have an expiration date
   - The key must have the *get*, *wrap key*, and *unwrap key* operations enabled.

## Next steps

- Learn how to rotate the TDE Protector of a server to comply with security requirements: [Rotate the Transparent Data Encryption protector Using PowerShell](transparent-data-encryption-byok-azure-sql-key-rotation.md).
- In case of a security risk, learn how to remove a potentially compromised TDE Protector: [Remove a potentially compromised key](transparent-data-encryption-byok-azure-sql-remove-tde-protector.md). 

## Prerequisites for CLI

- You must have an Azure subscription and be an administrator on that subscription.
- [Recommended but Optional] Have a hardware security module (HSM) or local key store for creating a local copy of the TDE Protector key material.
- Command-Line Interface version 2.0 or later. To install the latest version and connect to your Azure subscription, see [Install and Configure the Azure Cross-Platform Command-Line Interface 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest). 
- Create an Azure Key Vault and Key to use for TDE.
   - [Manage Key Vault using CLI 2.0](../key-vault/key-vault-manage-with-cli2.md)
   - [Instructions for using a hardware security module (HSM) and Key Vault](../key-vault/key-vault-get-started.md#HSM)
 - The key vault must have the following property to be used for TDE:
   - [soft-delete](../key-vault/key-vault-ovw-soft-delete.md)
   - [How to use Key Vault soft-delete with CLI](../key-vault/key-vault-soft-delete-cli.md) 
- The key must have the following attributes to be used for TDE:
   - No expiration date
   - Not disabled
   - Able to perform *get*, *wrap key*, *unwrap key* operations
   
## Step 1. Create a server and assign an Azure AD identity to your server
      cli
      # create server (with identity) and database
      az sql server create -n "ServerName" -g "ResourceGroupName" -l "westus" -u "cloudsa" -p "YourFavoritePassWord99@34" -i 
      az sql db create -n "DatabaseName" -g "ResourceGroupName" -s "ServerName" 
      

 
## Step 2. Grant Key Vault permissions to your server
      cli
      # create key vault, key and grant permission
      az keyvault create -n "VaultName" -g "ResourceGroupName" 
      az keyvault key create -n myKey -p software --vault-name "VaultName" 
      az keyvault set-policy -n "VaultName" --object-id "ServerIdentityObjectId" -g "ResourceGroupName" --key-permissions wrapKey unwrapKey get list 
      

 
## Step 3. Add the Key Vault key to the server and set the TDE Protector
  
     cli
     # add server key and update encryption protector
      az sql server key create -g "ResourceGroupName" -s "ServerName" -t "AzureKeyVault" -u "FullVersionedKeyUri 
      az sql server tde-key update -g "ResourceGroupName" -s "ServerName" -t AzureKeyVault -u "FullVersionedKeyUri" 
      
  
  > [!Note]
> The combined length for the key vault name and key name cannot exceed 94 characters.
> 

>[!Tip]
>An example KeyId from Key Vault: https://contosokeyvault.vault.azure.net/keys/Key1/1a1a2b2b3c3c4d4d5e5e6f6f7g7g8h8h
>
  
## Step 4. Turn on TDE 
      cli
      # enable encryption
      az sql db tde create -n "DatabaseName" -g "ResourceGroupName" -s "ServerName" --status Enabled 
      

Now the database or data warehouse has TDE enabled with an encryption key in Key Vault.

## Step 5. Check the encryption state and encryption activity

     cli
      # get encryption scan progress
      az sql db tde show-activity -n "DatabaseName" -g "ResourceGroupName" -s "ServerName" 

      # get whether encryption is on or off
      az sql db tde show-configuration -n "DatabaseName" -g "ResourceGroupName" -s "ServerName" 

## SQL CLI References

https://docs.microsoft.com/cli/azure/sql?view=azure-cli-latest 

https://docs.microsoft.com/cli/azure/sql/server/key?view=azure-cli-latest 

https://docs.microsoft.com/cli/azure/sql/server/tde-key?view=azure-cli-latest 

https://docs.microsoft.com/cli/azure/sql/db/tde?view=azure-cli-latest 

