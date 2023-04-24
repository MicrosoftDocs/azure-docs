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
| [Allow access to blobs in specific containers from a specific subnet](#example-allow-access-to-blobs-in-specific-containers-from-a-specific-subnet) | Subnet | | | container name |
| [Require private link access to read blobs with high sensitivity](#example-require-private-link-access-to-read-blobs-with-high-sensitivity) | isPrivateLink | | | tags |
| [Allow access to a container only from a specific private endpoint](#example-allow-access-to-a-container-only-from-a-specific-private-endpoint) | Private endpoint | | | container name |
| [Example: Allow read access to highly sensitive blob data only from a specific private endpoint and by users tagged for access](#example-allow-read-access-to-highly-sensitive-blob-data-only-from-a-specific-private-endpoint-and-by-users-tagged-for-access) | Private endpoint | ID | | tags |

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

The condition can be added to a role assignment using either the Azure portal or Azure PowerShell.

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

# [Portal](#tab/portal)

In the portal, you can use the visual editor or code editor to build your condition and switch back and forth between them.

---

# [Visual editor](#tab/visual-editor/portal)

Here are the settings to add this condition using the visual condition editor in the Azure portal.

#### Add action

Select **Add action**, then select only the **Read a blob** suboperation as shown in the following table.

| Action                                    | Suboperation |
| ----------------------------------------- | ------------ |
| All read operations                       | Read a blob  |

Do not select the top-level **All read operations** action or any other suboperations as shown in the following image:

:::image type="content" source="./media/storage-auth-abac-examples/environ-action-select-read-a-blob-portal.png" alt-text="Screenshot of condition editor in Azure portal showing selection of just the read operation." lightbox="./media/storage-auth-abac-examples/environ-action-select-read-a-blob-portal.png":::

#### Build expression

Use the values in the following table to build the expression portion of the condition:

> | Setting | Value |
> | ------- | ----- |
> | Attribute source | [Resource](../../role-based-access-control/conditions-format.md#resource-attributes) |
> | Attribute | [Container name](storage-auth-abac-attributes.md#container-name) |
> | Operator | [StringEquals](../../role-based-access-control/conditions-format.md#stringequals) |
> | Value | `container1` |
> | Logical operator | ['AND'](../../role-based-access-control/conditions-format.md#and) |
> | Attribute source | [Environment](../../role-based-access-control/conditions-format.md#environment-attributes) |
> | Attribute | [UtcNow](storage-auth-abac-attributes.md#utc-now) |
> | Operator | [DateTimeGreaterThan](../../role-based-access-control/conditions-format.md#datetime-comparison-operators) |
> | Value | `2023-05-01T13:00:00.000Z` |

The following image shows the condition after the settings have been entered into the Azure portal. Note that you must group expressions to ensure correct evaluation.

:::image type="content" source="./media/storage-auth-abac-examples/environ-utcnow-containers-read-portal.png" alt-text="Screenshot of the condition editor in the Azure portal showing read access allowed after a specific date and time." lightbox="./media/storage-auth-abac-examples/environ-utcnow-containers-read-portal.png":::

# [Code editor](#tab/code-editor/portal)

To add the condition using the code editor, copy the condition code sample below and paste it into the code editor.

```
( 
 ( 
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'}) 
 ) 
 OR  
 ( 
  @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'container1'
  AND 
  @Environment[UtcNow] DateTimeGreaterThan '2023-05-01T13:00:00.000Z' 
 ) 
) 
```

After entering your code, switch back to the visual editor to validate it.

---

### Example: Allow access to blobs in specific containers from a specific subnet

This condition allows read, write, add and delete access to blobs in `container1` only from subnet `default` on virtual network `virtualnetwork1`.

There are five potential actions for read, write, add and delete access to existing blobs. To make this condition effective for principals that have multiple role assignments, you must add this condition to all role assignments that include any of the following actions.

| Action | Notes |
| ------ | ----- |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`                  |  |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write`                 |  |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action`            |  |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete`                |  |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | Add if role definition includes this action, such as Storage Blob Data Owner. |

The condition can be added to a role assignment using either the Azure portal or Azure PowerShell.

# [PowerShell](#tab/azure-powershell)

Here's how to add this condition for the Storage Blob Data Contributor role using Azure PowerShell.

```azurepowershell
$subId = "<your subscription id>"
$rgName = "<resource group name>"
$storageAccountName = "<storage account name>"
$roleDefinitionName = "Storage Blob Data Contributor"
$userUpn = "<user UPN>"
$userObjectID = (Get-AzADUser -UserPrincipalName $userUpn).Id
$containerName = "container1"
$vnetName = "virtualnetwork1"
$subnetName = "default"
$scope = "/subscriptions/$subId/resourceGroups/$rgName/providers/Microsoft.Storage/storageAccounts/$storageAccountName"

$condition = `
"( `
 ( `
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'}) `
  AND `
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write'}) `
  AND `
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action'}) `
  AND `
 !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete'}) `
 ) `
 OR ` 
 ( `
  @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals '$containerName' `
  AND `
  @Environment[Microsoft.Network/virtualNetworks/subnets] StringEqualsIgnoreCase '/subscriptions/$subId/resourceGroups/$rgName/providers/Microsoft.Network/virtualNetworks/$vnetName/subnets/$subnetName' `
 ) `
)"

$testRa = Get-AzRoleAssignment -Scope $scope -RoleDefinitionName $roleDefinitionName -ObjectId $userObjectID
$testRa.Condition = $condition
$testRa.ConditionVersion = "2.0"
Set-AzRoleAssignment -InputObject $testRa -PassThru
```

# [Portal](#tab/portal)

In the portal, you can use the visual editor or code editor to build your condition and switch back and forth between them.

---

# [Visual editor](#tab/visual-editor/portal)

Here are the settings to add this condition using the Azure portal.

#### Add action

Select **Add action**, then select only the top-level actions shown in the following table.

| Action                                    | Suboperation |
| ----------------------------------------- | ------------ |
| All read operations                       | *n/a*        |
| Write to a blob                           | *n/a*        |
| Create a blob or snapshot, or append data | *n/a*        |
| Delete a blob                             | *n/a*        |

Do not select any individual suboperations as shown in the following image:

:::image type="content" source="./media/storage-auth-abac-examples/environ-private-endpoint-containers-select-read-write-delete-portal.png" alt-text="Screenshot of condition editor in Azure portal showing selection of read, write, add and delete operations." lightbox="./media/storage-auth-abac-examples/environ-private-endpoint-containers-select-read-write-delete-portal.png":::

#### Build expression

Use the values in the following table to build the expression portion of the condition:

> | Setting | Value |
> | ------- | ----- |
> | Attribute source | [Resource](../../role-based-access-control/conditions-format.md#resource-attributes) |
> | Attribute | [Container name](storage-auth-abac-attributes.md#container-name) |
> | Operator | [StringEquals](../../role-based-access-control/conditions-format.md#stringequals) |
> | Value | `container1` |
> | Logical operator | ['AND'](../../role-based-access-control/conditions-format.md#and) |
> | Attribute source | [Environment](../../role-based-access-control/conditions-format.md#environment-attributes) |
> | Attribute | [Subnet](storage-auth-abac-attributes.md#subnet-name) |
> | Operator | [StringEqualsIgnoreCase](../../role-based-access-control/conditions-format.md#stringequals) |
> | Value | `/subscriptions/<your subscription id>/resourceGroups/<resource group name>/providers/Microsoft.Network/virtualNetworks/virtualnetwork1/subnets/default` |

The following image shows the condition after the settings have been entered into the Azure portal. Note that you must group expressions to ensure correct evaluation.

:::image type="content" source="./media/storage-auth-abac-examples/environ-subnet-containers-read-write-delete-portal.png" alt-text="Screenshot of the condition editor in the Azure portal showing read access to specific containers allowed from a specific subnet." lightbox="./media/storage-auth-abac-examples/environ-subnet-containers-read-write-delete-portal.png":::

# [Code editor](#tab/code-editor/portal)

To add the condition using the code editor, copy the condition code sample below and paste it into the code editor.

```
(
 (
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete'})
 )
 OR
 (
  @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name]StringEquals 'container1'
  AND
  @Environment[Microsoft.Network/virtualNetworks/subnets] StringEqualsIgnoreCase '/subscriptions/<your subscription id>/resourceGroups/example-group/providers/Microsoft.Network/virtualNetworks/virtualnetwork1/subnets/default'
 )
)
```

After entering your code, switch back to the visual editor to validate it.

---

## Next steps

- [Tutorial: Add a role assignment condition to restrict access to blobs using the Azure portal](storage-auth-abac-portal.md)
- [Actions and attributes for Azure role assignment conditions for Azure Blob Storage](storage-auth-abac-attributes.md)
- [Azure role assignment condition format and syntax](../../role-based-access-control/conditions-format.md)
- [Troubleshoot Azure role assignment conditions](../../role-based-access-control/conditions-troubleshoot.md)
