---
title: Azure Key Vault Managed HSM recovery overview | Microsoft Docs
description: Managed HSM Recovery features are designed to prevent the accidental or malicious deletion of your HSM resource and keys.
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: how-to
ms.author: mbaldwin
author: mbaldwin
ms.date: 06/01/2021
---

# Managed HSM soft delete and purge protection

This article covers two recovery features of Managed HSM, soft delete and purge protection. This document provides an overview of these features, and shows you how to manage them through Azure CLI and Azure PowerShell.

For more information about Managed HSM, see [Managed HSM overview](overview.md)

## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)
* [PowerShell module](/powershell/azure/install-az-ps).
* The Azure CLI version 2.25.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).
* A Managed HSM - you can create one using [Azure CLI](./quick-create-cli.md), or [Azure PowerShell](./quick-create-powershell.md)
* The user will need the following permissions to perform operations on soft-deleted HSMs or keys:

  | Role Assignment | Description |
  |---|---|
  |[Managed HSM Contributor](../../role-based-access-control/built-in-roles.md#managed-hsm-contributor)|To list, recover and purge soft-deleted HSMs|
  |[Managed HSM Crypto User](./built-in-roles.md)|List soft-deleted keys|
  |[Managed HSM Crypto Officer](./built-in-roles.md)|Purge or recover soft-deleted keys|



## What are soft-delete and purge protection

[Soft delete](soft-delete-overview.md) and purge protection are two different recovery features.


**Soft delete** is designed to prevent accidental deletion of your HSM and keys. Think of soft-delete like a recycle bin. When you delete an HSM or a key, it will remain recoverable for a user configurable retention period or a default of 90 days. HSMs and keys in the soft deleted state can also be **purged** which means they are permanently deleted. This allows you to recreate HSMs and keys with the same name. Both recovering and deleting HSMs and keys require specific role assignments. **Soft delete cannot be disabled.**

> [!NOTE]
> Since the underlying resources remain allocated to your HSM, even when it is in deleted state, the HSM resource will continue to accrue hourly charges while in deleted state.

It is important to note that **Managed HSM names are globally unique** in every cloud environment, so you won't be able to create a Managed HSM with the same name if one exists in a soft deleted state. Similarly, the names of keys are unique within an HSM. You won't be able to create a new key if one exists in the soft deleted state.

**Purge protection** is designed to prevent the deletion of your HSMs and keys by a malicious insider. Think of this as a recycle bin with a time based lock. You can recover items at any point during the configurable retention period. **You will not be able to permanently delete or purge an HSM or a key until the retention period elapses.** Once the retention period elapses the HSM or key will be purged automatically.

> [!NOTE]
> Purge Protection is designed so that no administrator role or permission can  override, disable, or circumvent purge protection. **Once purge protection is enabled, it cannot be disabled or overridden by anyone including Microsoft.** This means you must recover a deleted HSM or wait for the retention period to elapse before reusing the HSM name.

For more information about soft-delete, see [Managed HSM soft-delete overview](soft-delete-overview.md)


# [Azure CLI](#tab/azure-cli)

## Managed HSM (CLI)

* Check status of soft-delete and purge protection for a Managed HSM

    ```azurecli
    az keyvault show --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} --hsm-name {HSM NAME}
    ```

* Delete HSM (recoverable, since soft delete is enabled by default)

    ```azurecli
    az keyvault delete --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} --hsm-name {HSM NAME}
    ```

* List all soft-deleted HSMs

    ```azurecli
    az keyvault list-deleted --subscription {SUBSCRIPTION ID} --resource-type hsm
    ```

* Recover soft-deleted HSM

    ```azurecli
    az keyvault recover --subscription {SUBSCRIPTION ID} --hsm-name {HSM NAME} --location {LOCATION}
    ```


* Purge soft-deleted HSM

    ```azurecli
    az keyvault purge --subscription {SUBSCRIPTION ID} --hsm-name {HSM NAME} --location {LOCATION}
    ```
    > [!WARNING] 
    > This operation will permanently delete your HSM

* Enable purge-protection on HSM

    ```azurecli
    az keyvault update-hsm --subscription {SUBSCRIPTION ID} -g {RESOURCE GROUP} --hsm-name {HSM NAME} --enable-purge-protection true
    ```

## Keys (CLI)

* Delete key

    ```azurecli
    az keyvault key delete --subscription {SUBSCRIPTION ID} --hsm-name {HSM NAME} --name {KEY NAME}
    ```

* List deleted keys

    ```azurecli
    az keyvault key list-deleted --subscription {SUBSCRIPTION ID} --hsm-name {HSM NAME}
    ```

* Recover deleted key

    ```azurecli
    az keyvault key recover --subscription {SUBSCRIPTION ID} --hsm-name {HSM NAME} --name {KEY NAME}
    ```

* Purge soft-deleted key 

    ```azurecli
    az keyvault key purge --subscription {SUBSCRIPTION ID} --hsm-name {HSM NAME} --name {KEY NAME}
    ```
    > [!WARNING] 
    > This operation will permanently delete your key

# [Azure PowerShell](#tab/azure-powershell)

## Managed HSM (PowerShell)

* Check status of soft-delete and purge protection for a Managed HSM

    ```powershell
    Get-AzKeyVaultManagedHsm -Name "ContosoHSM"
    ```

* Delete HSM (recoverable, since soft-delete is on by default)

    ```powershell
    Remove-AzKeyVaultManagedHsm -Name 'ContosoHSM'
    ```
> [!NOTE]
> Additional Managed HSM soft-delete and purge protection PowerShell commands will be enabled soon.


## Keys (PowerShell)

* Delete a Key

  ```powershell
  Remove-AzKeyVaultKey -HsmName ContosoHSM -Name 'MyKey'
  ```

* List all deleted keys 

  ```powershell
  Get-AzKeyVaultKey -HsmName ContosoHSM -InRemovedState
  ```

* To recover a soft-deleted key

    ```powershell
    Undo-AzKeyVaultKeyRemoval -HsmName ContosoHSM -Name ContosoFirstKey
    ```

* Purge a soft-deleted key

    ```powershell
    Remove-AzKeyVaultKey -HsmName ContosoHSM -Name ContosoFirstKey -InRemovedState
    ```
    > [!WARNING] 
    > This operation will permanently delete your key
    
---

## Next steps

- [Managed HSM PowerShell cmdlets](/powershell/module/az.keyvault)
- [Key Vault Azure CLI commands](/cli/azure/keyvault)
- [Managed HSM full backup/restore](backup-restore.md)
- [How to enable Managed HSM logging](logging.md)
