---
title: Azure Key Vault Recovery Overview | Microsoft Docs
description: Key Vault Recovery features are designed to prevent the accidental or malicious deletion of your key vault and secrets, keys, and certificate stored inside key-vault.
ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
author: ShaneBala-keyvault
ms.author: sudbalas
manager: ravijan
ms.date: 09/25/2020
---

# Azure Key Vault Recovery Overview

## What are soft-delete and purge protection

Soft delete and purge protection are two different key vault recovery features.
> [!IMPORTANT]
> Soft delete protection is required to be enabled on all key vaults. The ability to disable soft-delete protection will be deprecated by December 2020. Please see full details [**here**.](soft-delete-change.md)

**Soft delete** is designed to prevent accidental deletion of your key vault and keys, secrets, and certificates stored inside key vault. Think of soft-delete like a recycle bin. When you delete a key vault or a key vault object, it will remain recoverable for a user configurable retention period or a default of 90 days. Key vaults in the soft deleted state can also be purged or permanently deleted. This allows you to recreate key vaults and key vault objects with the same name. Both recovering and deleting key vaults and objects require elevated access policy permissions. **Once soft delete has been enabled, it cannot be disabled.**

> [!NOTE]
> It is important to note that key vault names are globally unique, so you won't be able to create a key vault with the same name as a key vault in the soft deleted state. You also won't be able to create a secret, key, or certificate with the same name as another object in the soft deleted state.

**Purge protection** is designed to prevent the deletion of your key vault, keys, secrets, and certificates by a malicious insider. Think of this as a recycle bin with a time based lock. You can recover items at any point during the configurable retention period. **You will not be able to permanently delete or purge a key vault until the retention period elapses.** Once the retention period elapses the key vault or key vault object will be purged automatically.

> [!NOTE]
> No administrator role or permission grants access to override purge protection. **Once purge protection is enabled, it cannot be disabled or overridden by anyone including Microsoft.**

# [Option 1](#tab/azure-portal)

## [Option 1a](#tab/azure-portal1)

CONTENT 1 - TEST

## [Option 1b](#tab/azure-portal2)

CONTENT 2 - TEST

## Grant access to recover and purge key vaults (Portal)

## Verify if my key vault has soft delete enabled (Portal)

## Enable soft delete on my key vault (Portal)

## Verify if a key vault or secret is soft-deleted (portal)

## Recover a soft-deleted key vault or secret (Portal)

## Permanently delete (purge) a key vault (Portal)

# [Option 2](#tab/azure-cli)

## Grant access to purge and recover keys, secrets, and certificates (CLI)

The following commands grant user@contoso.com permission to recover and purge keys, secrets, and certificates stored in **ContosoVault**

```azurecli
az keyvault set-policy --upn user@contoso.com --subscription {SUBSCRIPTION ID} --resource-group {RESOURCE GROUP NAME} --name ContosoVault --key-permissions recover purge --secret-permissions recover purge --certificate-permissions recover purge
```

## Verify if my key vault has soft delete enabled (CLI)

Look for the option that shows "Enabled Soft Delete" 

```azurecli
az keyvault show --subscription {SUBSCRIPTION ID} --resource-group {RESOURCE GROUP NAME} --name ContosoVault
```

## Enable soft delete on my key vault (CLI)

All new key vaults have soft delete enabled by default. If you currently have a key vault that does not have soft delete enabled, use the following command to enable soft delete.

```azurecli
az keyvault update --subscription {SUBSCRIPTION ID} --resource-group {RESOURCE GROUP NAME} --name ContosoVault --enable-soft-delete true
```

## Enable purge protection on my key vault (CLI)

```azurecli
az keyvault update --subscription {SUBSCRIPTION ID} --resource-group {RESOURCE GROUP NAME} --name ContosoVault --enable-purge-protection true
```

## Verify if a key vault or secret is soft-deleted (CLI)

List deleted key vault:

```azurecli
az keyvault list-deleted --subscription {SUBSCRIPTION ID} --resource-type vault
```

List deleted certificates:

```azurecli
az keyvault certificate list-deleted --subscription {SUBSCRIPTION ID} --vault-name ContosoVault
```

List deleted keys:

```azurecli
az keyvault key list-deleted --subscription {SUBSCRIPTION ID} --vault-name ContosoVault
```

List deleted secrets:

```azurecli
az keyvault secret list-deleted --subscription {SUBSCRIPTION ID} --vault-name ContosoVault
```

## Recover a soft-deleted key vault or secret (CLI)

Recover deleted key vault:

```azurecli
az keyvault recover --subscription {SUBSCRIPTION ID} --name ContosoVault
```

Recover deleted certificates:

```azurecli
az keyvault certificate recover --subscription {SUBSCRIPTION ID} --vault-name ContosoVault --name {CERTIFICATE NAME}
```

Recover deleted keys:

```azurecli
az keyvault key recover --subscription {SUBSCRIPTION ID} --vault-name ContosoVault --name {KEY NAME}
```

Recover deleted secrets:

```azurecli
az keyvault secret recover --subscription {SUBSCRIPTION ID} --vault-name ContosoVault --name {SECRET NAME}
```

## Permanently delete (purge) a key vault or secret (CLI)

Purge deleted key vault:

```azurecli
az keyvault purge --subscription {SUBSCRIPTION ID} --name ContosoVault
```

Purge deleted certificates:

```azurecli
az keyvault certificate purge --subscription {SUBSCRIPTION ID} --vault-name ContosoVault --name {CERTIFICATE NAME}
```

Purge deleted keys:

```azurecli
az keyvault key purge --subscription {SUBSCRIPTION ID} --vault-name ContosoVault --name {KEY NAME}
```

Purge deleted secrets:

```azurecli
az keyvault secret purge --subscription {SUBSCRIPTION ID} --vault-name ContosoVault --name {SECRET NAME}
```

# [Option 3](#tab/azure-powershell)

## Grant access to recover and purge key vaults (PowerShell)

```powershell
Set-AzKeyVaultAccessPolicy -VaultName ContosoVault -UserPrincipalName user@contoso.com -PermissionsToKeys recover,purge
```

## Verify if my key vault has soft delete enabled (PowerShell)

```powershell
Get-AzKeyVault -VaultName "ContosoVault"
```

## Enable soft delete on my key vault

```powershell
($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "ContosoVault").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enableSoftDelete" -Value "true"

Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
```
## Keys

To recover a soft-deleted key:

```powershell
Undo-AzKeyVaultKeyRemoval -VaultName ContosoVault -Name ContosoFirstKey
```

To permanently delete (also known as purging) a soft-deleted key:

> [!IMPORTANT]
> Purging a key will permanently delete it, and it will not be recoverable!

```powershell
Remove-AzKeyVaultKey -VaultName ContosoVault -Name ContosoFirstKey -InRemovedState
```

## Vault

DELETE KEY VAULT

```powershell
Remove-AzKeyVault -VaultName 'ContosoVault'
```

RECOVER KEY VAULT

```powershell
Undo-AzKeyVaultRemoval -VaultName ContosoVault -ResourceGroupName ContosoRG -Location westus
```

PURGE KEY VAULT

```powershell
Remove-AzKeyVault -VaultName ContosoVault -InRemovedState -Location westus
```

ADD PURGE PROTECTION

```powershell
($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "ContosoVault").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enablePurgeProtection" -Value "true"

Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
```

## Secrets

Like keys, secrets are managed with their own commands:

- Delete a secret named SQLPassword:

  ```powershell
  Remove-AzKeyVaultSecret -VaultName ContosoVault -name SQLPassword
  ```

- List all deleted secrets in a key vault:

  ```powershell
  Get-AzKeyVaultSecret -VaultName ContosoVault -InRemovedState
  ```

- Recover a secret in the deleted state:

  ```powershell
  Undo-AzKeyVaultSecretRemoval -VaultName ContosoVault -Name SQLPAssword
  ```

- Purge a secret in deleted state:

  > [!IMPORTANT]
  > Purging a secret will permanently delete it, and it will not be recoverable!

  ```powershell
  Remove-AzKeyVaultSecret -VaultName ContosoVault -InRemovedState -name SQLPassword
  ```

## Certificates

You can manage certificates using below commands:

- Delete a Certificate:

  ```powershell
  Remove-AzKeyVaultCertificate -VaultName ContosoVault -Name 'MyCert'
  ```

- List all deleted certificates in a key vault:

  ```powershell
  Get-AzKeyVaultCertificate -VaultName ContosoVault -InRemovedState
  ```

- Recover a certificate in the deleted state:

  ```powershell
  Undo-AzKeyVaultCertificateRemoval -VaultName ContosoVault -Name 'MyCert'
  ```

- Purge a certificate in deleted state:

  > [!IMPORTANT]
  > Purging a certificate will permanently delete it, and it will not be recoverable!

  ```powershell
  Remove-AzKeyVaultcertificate -VaultName ContosoVault -Name 'MyCert' -InRemovedState
  ```
