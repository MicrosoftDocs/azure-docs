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
# Register a Ledger Service Principal

To register a Ledger Service Principal, the Tenant Admin can run the following commands using Azure PowerShell:

- Install Azure Powershell. Instructions can be found here.
- o Run Connect-AzureAD -TenantId "[The tenant Id of the customer]"
- o Run New-AzureADServicePrincipal -AppId 4353526e-1c33-4fcf-9e82-9683edf52848 - DisplayName ConfidentialLedger
- Set IAM "Storage Blob Data Contributor" for the ConfidentialLedger service principal for the Storage Account via the [Azure CLI](../storage/common/storage-auth-aad-rbac-cli.md#container-scope) or [Azure PowerShell](../storage/common/storage-auth-aad-rbac-powershell.md#container-scope)

```azurepowershell-interactive
New-AzRoleAssignment -ApplicationId 4353526e-1c33-4fcf-9e82-9683edf52848 `-RoleDefinitionName "Storage Blob Data Reader"` -Scope "/subscriptions/<subscription>/resourceGroups/sample-resource-group/providers/Microsoft.Storage/storageAccounts/<storage-account>"
```

## Next steps

- [Overview of Microsoft Azure Confidential Ledger](overview.md)
