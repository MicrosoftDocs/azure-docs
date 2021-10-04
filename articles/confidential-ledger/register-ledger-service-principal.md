---
title: Register a Ledger Service Principal with Microsoft Azure Confidential Ledger
description: Register a Ledger Service Principal with Microsoft Azure Confidential Ledger
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 04/15/2021
ms.author: mbaldwin

---
# Register a Confidential Ledger service principal

To associate a storage account with your Confidential Ledger, you must first register Confidential Ledger service principal.

## Create a service principal

To create a service principal, run the Azure CLI [az ad sp create](/cli/azure/ad/sp#az_ad_sp_create) command or the Azure PowerShell [Connect-AzureAD](/powershell/module/azuread/connect-azuread) and [New-AzureADServicePrincipal](/powershell/module/azuread/new-azureadserviceprincipal) cmdlets.

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az ad sp create --id 4353526e-1c33-4fcf-9e82-9683edf52848
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell-interactive
Connect-AzureAD -TenantId "<tenant-id-of-customer>"
New-AzureADServicePrincipal -AppId 4353526e-1c33-4fcf-9e82-9683edf52848 -DisplayName ConfidentialLedger
```
---

## Assign roles

Set the IAM "[Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)" for the Confidential Ledger service principal for the Storage Account. You can do so with the Azure CLI [az role assignment create](/cli/azure/role/assignment) command or the Azure PowerShell [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) cmdlet.

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az role assignment create --role "Storage Blob Data Contributor" --assignee "4353526e-1c33-4fcf-9e82-9683edf52848" --scope "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>"
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell-interactive
New-AzRoleAssignment -ApplicationId 4353526e-1c33-4fcf-9e82-9683edf52848 -RoleDefinitionName "Storage Blob Data Contributor" -Scope "/subscriptions/<subscription-id>/resourceGroups/sample-resource-group/providers/Microsoft.Storage/storageAccounts/<storage-account>"
```
---

## Next steps

- [Overview of Microsoft Azure Confidential Ledger](overview.md)
