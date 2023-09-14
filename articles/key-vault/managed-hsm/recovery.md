---
title: Azure Key Vault Managed HSM recovery overview | Microsoft Docs
description: Managed HSM recovery features are designed to prevent the accidental or malicious deletion of your HSM resource and keys.
ms.service: key-vault
ms.subservice: managed-hsm
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: how-to
ms.author: mbaldwin
author: mbaldwin
ms.date: 11/14/2022
---

# Managed HSM soft-delete and purge protection

This article describes two recovery features of Managed HSM: soft-delete and purge protection. It provides an overview of these features and demonstrates how to manage them by using the Azure CLI and Azure PowerShell.

For more information, see [Managed HSM overview](overview.md).

## Prerequisites

* An Azure subscription. [Create one for free](https://azure.microsoft.com/free/dotnet).
* The [PowerShell module](/powershell/azure/install-azure-powershell).
* Azure CLI 2.25.0 or later. Run `az --version` to determine which version you have. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).
* A managed HSM. You can create one by using the [Azure CLI](./quick-create-cli.md) or [Azure PowerShell](./quick-create-powershell.md).
* Users will need the following permissions to perform operations on soft-deleted HSMs or keys:

  | Role assignment | Description |
  |---|---|
  |[Managed HSM Contributor](../../role-based-access-control/built-in-roles.md#managed-hsm-contributor)|List, recover, and purge soft-deleted HSMs|
  |[Managed HSM Crypto User](./built-in-roles.md)|List soft-deleted keys|
  |[Managed HSM Crypto Officer](./built-in-roles.md)|Purge and recover soft-deleted keys|



## What are soft-delete and purge protection?

[Soft-delete](soft-delete-overview.md) and purge protection are recovery features.


*Soft-delete* is designed to prevent accidental deletion of your HSM and keys. Soft-delete works like a recycle bin. When you delete an HSM or a key, it will remain recoverable for a configurable retention period or for a default period of 90 days. HSMs and keys in the soft-deleted state can also be *purged*, which means they're permanently deleted. Purging allows you to re-create HSMs and keys with the same name as the purged item. Both recovering and deleting HSMs and keys require specific role assignments. Soft-delete can't be disabled.

> [!NOTE]
> Because the underlying resources remain allocated to your HSM even when it's in a deleted state, the HSM resource will continue to accrue hourly charges while it's in that state.

Managed HSM names are globally unique in every cloud environment. So you can't create a managed HSM with the same name as one that exists in a soft-deleted state. Similarly, the names of keys are unique within an HSM. You can't create a key with the same name as one that exists in the soft-deleted state.

For more information, see [Managed HSM soft-delete overview](soft-delete-overview.md).

*Purge protection* is designed to prevent the deletion of your HSMs and keys by a malicious insider. It's like a recycle bin with a time-based lock. You can recover items at any point during the configurable retention period. You won't be able to permanently delete or purge an HSM or a key until the retention period ends. When the retention period ends, the HSM or key will be purged automatically.

> [!NOTE]
> No administrator role or permission can  override, disable, or circumvent purge protection. *If purge protection is enabled, it can't be disabled or overridden by anyone, including Microsoft.* So you must recover a deleted HSM or wait for the retention period to end before you can reuse the HSM name.

## Manage keys and managed HSMs

# [Azure CLI](#tab/azure-cli)

### Managed HSMs (CLI) 

* To check the status of soft-delete and purge protection for a managed HSM:

    ```azurecli
    az keyvault show --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} --hsm-name {HSM NAME}
    ```

* To delete an HSM:

    ```azurecli
    az keyvault delete --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} --hsm-name {HSM NAME}
    ```
    
  This action is recoverable because soft-delete is on by default.

* To list all soft-deleted HSMs:

    ```azurecli
    az keyvault list-deleted --subscription {SUBSCRIPTION ID} --resource-type hsm
    ```

* To recover a soft-deleted HSM:

    ```azurecli
    az keyvault recover --subscription {SUBSCRIPTION ID} --hsm-name {HSM NAME} --location {LOCATION}
    ```


* To purge a soft-deleted HSM:

    ```azurecli
    az keyvault purge --subscription {SUBSCRIPTION ID} --hsm-name {HSM NAME} --location {LOCATION}
    ```
    > [!WARNING] 
    > This operation will permanently delete your HSM.

* To enable purge protection on an HSM:

    ```azurecli
    az keyvault update-hsm --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} --hsm-name {HSM NAME} --enable-purge-protection true
    ```

### Keys (CLI)

* To delete a key:

    ```azurecli
    az keyvault key delete --subscription {SUBSCRIPTION ID} --hsm-name {HSM NAME} --name {KEY NAME}
    ```

* To list deleted keys:

    ```azurecli
    az keyvault key list-deleted --subscription {SUBSCRIPTION ID} --hsm-name {HSM NAME}
    ```

* To recover a deleted key:

    ```azurecli
    az keyvault key recover --subscription {SUBSCRIPTION ID} --hsm-name {HSM NAME} --name {KEY NAME}
    ```

* To purge a soft-deleted key: 

    ```azurecli
    az keyvault key purge --subscription {SUBSCRIPTION ID} --hsm-name {HSM NAME} --name {KEY NAME}
    ```
    > [!WARNING] 
    > This operation will permanently delete your key.

# [Azure PowerShell](#tab/azure-powershell)

### Managed HSMs (PowerShell)

* To check the status of soft-delete and purge protection for a managed HSM:

    ```powershell
    Get-AzKeyVaultManagedHsm -Name "ContosoHSM"
    ```

* To delete an HSM:

    ```powershell
    Remove-AzKeyVaultManagedHsm -Name 'ContosoHSM'
    ```
  This action is recoverable because soft-delete is on by default.

### Keys (PowerShell)

* To delete a key:

  ```powershell
  Remove-AzKeyVaultKey -HsmName ContosoHSM -Name 'MyKey'
  ```

* To list all deleted keys: 

  ```powershell
  Get-AzKeyVaultKey -HsmName ContosoHSM -InRemovedState
  ```

* To recover a soft-deleted key:

    ```powershell
    Undo-AzKeyVaultKeyRemoval -HsmName ContosoHSM -Name ContosoFirstKey
    ```

* To purge a soft-deleted key:

    ```powershell
    Remove-AzKeyVaultKey -HsmName ContosoHSM -Name ContosoFirstKey -InRemovedState
    ```
    > [!WARNING] 
    > This operation will permanently delete your key.
    
---

## Next steps

- [Managed HSM PowerShell cmdlets](/powershell/module/az.keyvault)
- [Key Vault Azure CLI commands](/cli/azure/keyvault)
- [Managed HSM full backup and restore](backup-restore.md)
- [How to enable Managed HSM logging](logging.md)
