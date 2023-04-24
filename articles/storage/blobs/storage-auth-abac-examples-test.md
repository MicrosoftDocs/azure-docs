---
title: test dependent tabs
titleSuffix: Azure Storage
description: test dependent tabs
author: jimmart-dev

ms.service: storage
ms.topic: conceptual
ms.author: jammart
ms.reviewer: nachakra
ms.subservice: blobs
ms.custom: devx-track-azurepowershell
ms.date: 04/24/2023
#Customer intent: As a dev, devops, or it admin, I want to learn about the conditions so that I write more complex conditions.
---

# test dependent tabs

(article intro)

## Prerequisites

For information about the prerequisites to add or edit role assignment conditions, see [Conditions prerequisites](../../role-based-access-control/conditions-prerequisites.md).

## Summary of examples in this article

Use the following table to quickly locate an example that fits your ABAC scenario. The table includes a brief description of the scenario, plus a list of attributes used in the example by [source](../../role-based-access-control/conditions-format.md#attributes) (environment, principal, request and resource).

| Example | Environment | Principal | Request | Resource |
|---------|-------------|-----------|---------|----------|
| [Allow read access to blobs after a specific date and time](#example-allow-read-access-to-blobs-after-a-specific-date-and-time) | UtcNow | | | container name |

## Environment attributes

This section includes examples showing how to restrict access to objects based on the network environment or the current date and time.

### Example: Allow read access to blobs after a specific date and time

This condition allows read access to blob container `container1` only after 1 PM on May 1, 2023 Universal Coordinated Time (UTC).

There are two potential actions for reading existing blobs. To make this condition effective for principals that have multiple role assignments, you must add this condition to all role assignments that include any of the following actions.

> [!div class="mx-tableFixed"]
> | Action | Notes |
> | --- | --- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |  |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | Add if role definition includes this action, such as Storage Blob Data Owner. |

The condition can be added to a role assignment using either the Azure portal or Azure PowerShell. In the portal, you can use the visual editor or code editor to build your condition and switch back and forth between them. Select a tab below to view the examples for each type of editor.

# [Visual editor](#tab/visual-editor)

Here are the settings to add this condition using the visual condition editor in the Azure portal.

# [Code editor](#tab/code-editor)

To add the condition using the code editor, copy the condition code sample below and paste it into the code editor.

---

# [Portal](#tab/portal/visual-editor)

visual instructions

# [Portal](#tab/portal/code-editor)

code editor instructions

# [PowerShell](#tab/azure-powershell)

Here's how to add this condition for the Storage Blob Data Reader role using Azure PowerShell.

```azurepowershell
$subId = "<your subscription id>"
$rgName = "<resource group name>"
$storageAccountName = "<storage account name>"
$roleDefinitionName = "Storage Blob Data Reader"
$userUpn = "<user UPN>"
$userObjectID = (Get-AzADUser -UserPrincipalName $userUpn).Id
$containerName = "container1"
$dateTime = "2023-05-01T13:00:00.000Z"
$scope = "/subscriptions/$subId/resourceGroups/$rgName/providers/Microsoft.Storage/storageAccounts/$storageAccountName"

$condition = `
"( `
 ( `
 !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'}) `
 ) `
 OR ` 
 ( `
  @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals '$containerName' `
  AND `
  @Environment[UtcNow] DateTimeGreaterThan '$dateTime' `
 ) `
)"

$testRa = Get-AzRoleAssignment -Scope $scope -RoleDefinitionName $roleDefinitionName -ObjectId $userObjectID
$testRa.Condition = $condition
$testRa.ConditionVersion = "2.0"
Set-AzRoleAssignment -InputObject $testRa -PassThru
```

---

## Next steps

- [Tutorial: Add a role assignment condition to restrict access to blobs using the Azure portal](storage-auth-abac-portal.md)
- [Actions and attributes for Azure role assignment conditions for Azure Blob Storage](storage-auth-abac-attributes.md)
- [Azure role assignment condition format and syntax](../../role-based-access-control/conditions-format.md)
- [Troubleshoot Azure role assignment conditions](../../role-based-access-control/conditions-troubleshoot.md)
