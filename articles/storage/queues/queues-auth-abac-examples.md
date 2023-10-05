---
title: Example Azure role assignment conditions for Queue Storage
titleSuffix: Azure Storage
description: Example Azure role assignment conditions for Queue Storage.
author: pauljewellmsft

ms.service: azure-queue-storage
ms.topic: conceptual
ms.author: pauljewell
ms.reviewer: nachakra
ms.custom: devx-track-azurepowershell
ms.date: 10/05/2023
#Customer intent: As a dev, devops, or IT admin, I want to learn about the conditions so that I write more complex conditions.
---

# Example Azure role assignment conditions for Queue Storage

This article list some examples of role assignment conditions for controlling access to Azure Queue Storage.

[!INCLUDE [storage-abac-preview](../../../includes/storage-abac-preview.md)]

## Prerequisites

For information about the prerequisites to add or edit role assignment conditions, see [Conditions prerequisites](../../role-based-access-control/conditions-prerequisites.md).

## Summary of examples in this article

Use the following table to quickly locate an example that fits your ABAC scenario. The table includes a brief description of the scenario, plus a list of attributes used in the example by [source](../../role-based-access-control/conditions-format.md#attributes) (environment, principal, request and resource).

| Example | Environment | Principal | Request | Resource |
|---------|-------------|-----------|---------|----------|
| [Peek messages in a named queue](#example-peek-messages-in-a-named-queue) | | | | tags |
| [Read or write blobs based on blob index tags and custom security attributes](#example-read-or-write-blobs-based-on-blob-index-tags-and-custom-security-attributes) | | ID | tags | tags |
| [Read blobs based on blob index tags and multi-value custom security attributes](#example-read-blobs-based-on-blob-index-tags-and-multi-value-custom-security-attributes) | | ID | | tags |
| [Allow read access to blobs after a specific date and time](#example-allow-read-access-to-blobs-after-a-specific-date-and-time) | UtcNow | | | container name |
| [Allow access to blobs in specific containers from a specific subnet](#example-allow-access-to-blobs-in-specific-containers-from-a-specific-subnet) | Subnet | | | container name |
| [Require private link access to read blobs with high sensitivity](#example-require-private-link-access-to-read-blobs-with-high-sensitivity) | isPrivateLink | | | tags |
| [Allow access to a container only from a specific private endpoint](#example-allow-access-to-a-container-only-from-a-specific-private-endpoint) | Private endpoint | | | container name |
| [Example: Allow read access to highly sensitive blob data only from a specific private endpoint and by users tagged for access](#example-allow-read-access-to-highly-sensitive-blob-data-only-from-a-specific-private-endpoint-and-by-users-tagged-for-access) | Private endpoint | ID | | tags |

## Queue messages

This section includes examples involving blob index tags.

> [!IMPORTANT]
> Although the `Read content from a blob with tag conditions` suboperation is currently supported for compatibility with conditions implemented during the ABAC feature preview, it has been deprecated and Microsoft recommends using the [`Read a blob`](storage-auth-abac-attributes.md#read-a-blob) action instead.
>
> When configuring ABAC conditions in the Azure portal, you might see **DEPRECATED: Read content from a blob with tag conditions**. Microsoft recommends removing the operation and replacing it with the `Read a blob` action.
>
> If you are authoring your own condition where you want to restrict read access by tag conditions, please refer to [Example: Read blobs with a blob index tag](storage-auth-abac-examples.md#example-read-blobs-with-a-blob-index-tag).

### Example: Peek or clear messages in a named queue

This condition allows users to read blobs with a [blob index tag](storage-blob-index-how-to.md) key of Project and a value of Cascade. Attempts to access blobs without this key-value tag will not be allowed.

> [!IMPORTANT]
> For this condition to be effective for a security principal, you must add it to all role assignments for them that include the following actions.

> [!div class="mx-tableFixed"]
> | Action | Notes |
> | --- | --- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |  |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | Add if role definition includes this action, such as Storage Blob Data Owner. |

![Diagram of condition showing read access to blobs with a blob index tag.](./media/storage-auth-abac-examples/blob-index-tags-read.png)

```
(
 (
  !(ActionMatches{'Microsoft.Storage/storageAccounts/queueServices/queues/messages/read'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/queueServices/queues/messages/delete'})
 )
 OR 
 (
  @Resource[Microsoft.Storage/storageAccounts/queueServices/queues:name] StringEquals 'sample-queue'
 )
)
```

#### Azure portal

Here are the settings to add this condition using the Azure portal.

> [!div class="mx-tableFixed"]
> | Condition #1 | Setting |
> | --- | --- |
> | Actions | [Peek messages](queues-auth-abac-attributes.md#peek-messages)<br/>[Clear messages](queues-auth-abac-attributes.md#clear-messages) |
> | Attribute source | [Resource](../../role-based-access-control/conditions-format.md#resource-attributes) |
> | Attribute | [Queue name](queues-auth-abac-attributes.md#queue-name) |
> | Operator | [StringEquals](../../role-based-access-control/conditions-format.md#stringequals) |
> | Value | {queueName} |

:::image type="content" source="./media/storage-auth-abac-examples/peek-clear-messages.png" alt-text="Screenshot of condition editor in Azure portal showing peek or clear access to messages in a named queue." lightbox="./media/storage-auth-abac-examples/peek-clear-messages.png":::

#### Azure PowerShell

Here's how to add this condition using Azure PowerShell.

```azurepowershell
$condition = "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND NOT SubOperationMatches{'Blob.List'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<`$key_case_sensitive`$>] StringEquals 'Cascade'))"
$testRa = Get-AzRoleAssignment -Scope $scope -RoleDefinitionName $roleDefinitionName -ObjectId $userObjectID
$testRa.Condition = $condition
$testRa.ConditionVersion = "2.0"
Set-AzRoleAssignment -InputObject $testRa -PassThru
```

Here's how to test this condition.

```azurepowershell
$bearerCtx = New-AzStorageContext -StorageAccountName $storageAccountName
Get-AzStorageBlob -Container <containerName> -Blob <blobName> -Context $bearerCtx 
```

## Principal attributes

This section includes examples showing how to restrict access to queues based on custom security principals.

### Example: Read or write blobs based on blob index tags and custom security attributes

This condition allows read or write access to blobs if the user has a [custom security attribute](../../active-directory/fundamentals/custom-security-attributes-overview.md) that matches the [blob index tag](storage-blob-index-how-to.md).

For example, if Brenda has the attribute `Project=Baker`, she can only read or write blobs with the `Project=Baker` blob index tag. Similarly, Chandra can only read or write blobs with `Project=Cascade`.

You must add this condition to any role assignments that include the following actions.

> [!div class="mx-tableFixed"]
> | Action | Notes |
> | --- | --- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |  |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` |  |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` |  |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | Add if role definition includes this action, such as Storage Blob Data Owner. |

For more information, see [Allow read access to blobs based on tags and custom security attributes](../../role-based-access-control/conditions-custom-security-attributes.md).

![Diagram of condition showing read or write access to blobs based on blob index tags and custom security attributes.](./media/storage-auth-abac-examples/principal-blob-index-tags-read-write.png)

```
(
 (
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND NOT SubOperationMatches{'Blob.List'})
 )
 OR 
 (
  @Principal[Microsoft.Directory/CustomSecurityAttributes/Id:Engineering_Project] StringEquals @Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>]
 )
)
AND
(
 (
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write'} AND SubOperationMatches{'Blob.Write.WithTagHeaders'})
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action'} AND SubOperationMatches{'Blob.Write.WithTagHeaders'})
 )
 OR 
 (
  @Principal[Microsoft.Directory/CustomSecurityAttributes/Id:Engineering_Project] StringEquals @Request[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>]
 )
)
```

#### Azure portal

Here are the settings to add this condition using the Azure portal.

> [!div class="mx-tableFixed"]
> | Condition #1 | Setting |
> | --- | --- |
> | Actions | [Read a blob conditions](storage-auth-abac-attributes.md#read-content-from-a-blob-with-tag-conditions) |
> | Attribute source | [Principal](../../role-based-access-control/conditions-format.md#principal-attributes) |
> | Attribute | &lt;attributeset&gt;_&lt;key&gt; |
> | Operator | [StringEquals](../../role-based-access-control/conditions-format.md#stringequals) |
> | Option | Attribute |
> | Attribute source | [Resource](../../role-based-access-control/conditions-format.md#resource-attributes) |
> | Attribute | [Blob index tags [Values in key]](storage-auth-abac-attributes.md#blob-index-tags-values-in-key) |
> | Key | &lt;key&gt; |

> [!div class="mx-tableFixed"]
> | Condition #2 | Setting |
> | --- | --- |
> | Actions | [Write to a blob with blob index tags](storage-auth-abac-attributes.md#write-to-a-blob-with-blob-index-tags)<br/>[Write to a blob with blob index tags](storage-auth-abac-attributes.md#write-to-a-blob-with-blob-index-tags) |
> | Attribute source | [Principal](../../role-based-access-control/conditions-format.md#principal-attributes) |
> | Attribute | &lt;attributeset&gt;_&lt;key&gt; |
> | Operator | [StringEquals](../../role-based-access-control/conditions-format.md#stringequals) |
> | Option | Attribute |
> | Attribute source | Request |
> | Attribute | [Blob index tags [Values in key]](storage-auth-abac-attributes.md#blob-index-tags-values-in-key) |
> | Key | &lt;key&gt; |

### Example: Read blobs based on blob index tags and multi-value custom security attributes

This condition allows read access to blobs if the user has a [custom security attribute](../../active-directory/fundamentals/custom-security-attributes-overview.md) with any values that matches the [blob index tag](storage-blob-index-how-to.md).

For example, if Chandra has the Project attribute with the values Baker and Cascade, she can only read blobs with the `Project=Baker` or `Project=Cascade` blob index tag.

You must add this condition to any role assignments that include the following action.

> [!div class="mx-tableFixed"]
> | Action | Notes |
> | --- | --- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |  |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | Add if role definition includes this action, such as Storage Blob Data Owner. |

For more information, see [Allow read access to blobs based on tags and custom security attributes](../../role-based-access-control/conditions-custom-security-attributes.md).

![Diagram of condition showing read access to blobs based on blob index tags and multi-value custom security attributes.](./media/storage-auth-abac-examples/principal-blob-index-tags-multi-value-read.png)

```
(
 (
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND NOT SubOperationMatches{'Blob.List'})
 )
 OR 
 (
  @Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$key_case_sensitive$>] ForAnyOfAnyValues:StringEquals @Principal[Microsoft.Directory/CustomSecurityAttributes/Id:Engineering_Project]
 )
)
```

#### Azure portal

Here are the settings to add this condition using the Azure portal.

> [!div class="mx-tableFixed"]
> | Condition #1 | Setting |
> | --- | --- |
> | Actions | [Read a blob conditions](storage-auth-abac-attributes.md#read-content-from-a-blob-with-tag-conditions) |
> | Attribute source | [Resource](../../role-based-access-control/conditions-format.md#resource-attributes) |
> | Attribute | [Blob index tags [Values in key]](storage-auth-abac-attributes.md#blob-index-tags-values-in-key) |
> | Key | &lt;key&gt; |
> | Operator | [ForAnyOfAnyValues:StringEquals](../../role-based-access-control/conditions-format.md#foranyofanyvalues) |
> | Option | Attribute |
> | Attribute source | [Principal](../../role-based-access-control/conditions-format.md#principal-attributes) |
> | Attribute | &lt;attributeset&gt;_&lt;key&gt; |

## Environment attributes

This section includes examples showing how to restrict access to objects based on the network environment or the current date and time.

### Example: Allow peek access to messages after a specific date and time

This condition allows peek access to the queue `sample-queue` only after 1 PM on May 1, 2023 Universal Coordinated Time (UTC).

There are two potential actions for reading existing blobs. To make this condition effective for principals that have multiple role assignments, you must add this condition to all role assignments that include any of the following actions.

> [!div class="mx-tableFixed"]
> | Action | Notes |
> | --- | --- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |  |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | Add if role definition includes this action, such as Storage Blob Data Owner. |

The condition can be added to a role assignment using either the Azure portal or Azure PowerShell. The portal has two tools for building ABAC conditions - the visual editor and the code editor. You can switch between the two editors in the Azure portal to see your conditions in different views. Switch between the **Visual editor** tab and the **Code editor** tabs below to view the examples for your preferred portal editor.

# [Portal: Visual editor](#tab/portal-visual-editor)

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

# [Portal: Code editor](#tab/portal-code-editor)

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

### Example: Allow access to messages in specific queues from a specific subnet

This condition allows put or update access to messages in `sample-queue` only from subnet `default` on virtual network `virtualnetwork1`.

There are five potential actions for read, write, add and delete access to existing blobs. To make this condition effective for principals that have multiple role assignments, you must add this condition to all role assignments that include any of the following actions.

| Action | Notes |
| ------ | ----- |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`                  |  |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write`                 |  |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action`            |  |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete`                |  |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | Add if role definition includes this action, such as Storage Blob Data Owner. |

The condition can be added to a role assignment using either the Azure portal or Azure PowerShell. The portal has two tools for building ABAC conditions - the visual editor and the code editor. You can switch between the two editors in the Azure portal to see your conditions in different views. Switch between the **Visual editor** tab and the **Code editor** tabs below to view the examples for your preferred portal editor.

# [Portal: Visual editor](#tab/portal-visual-editor)

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
> | Attribute | [Subnet](storage-auth-abac-attributes.md#subnet) |
> | Operator | [StringEqualsIgnoreCase](../../role-based-access-control/conditions-format.md#stringequals) |
> | Value | `/subscriptions/<your subscription id>/resourceGroups/<resource group name>/providers/Microsoft.Network/virtualNetworks/virtualnetwork1/subnets/default` |

The following image shows the condition after the settings have been entered into the Azure portal. Note that you must group expressions to ensure correct evaluation.

:::image type="content" source="./media/storage-auth-abac-examples/environ-subnet-containers-read-write-delete-portal.png" alt-text="Screenshot of the condition editor in the Azure portal showing read access to specific containers allowed from a specific subnet." lightbox="./media/storage-auth-abac-examples/environ-subnet-containers-read-write-delete-portal.png":::

# [Portal: Code editor](#tab/portal-code-editor)

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

---

### Example: Allow access to a container only from a specific private endpoint

This condition requires that all peek, put/update, clear, or get/delete operations for messages in a queue named `sample-queue` be made through a private endpoint named `privateendpoint1`. For all other containers not named `sample-queue`, access does not need to be through the private endpoint.

There are four potential actions for peek, put/update, clear, or get/delete of messages. To make this condition effective for principals that have multiple role assignments, you must add this condition to all role assignments that include any of the following actions.

| Action                                                                                  | Notes |
| --------------------------------------------------------------------------------------- | ----- |
| `Microsoft.Storage/storageAccounts/queueServices/queues/messages/read`                  |       |
| `Microsoft.Storage/storageAccounts/queueServices/queues/messages/delete`                |       |
| `Microsoft.Storage/storageAccounts/queueServices/queues/messages/write`                 |       |
| `Microsoft.Storage/storageAccounts/queueServices/queues/messages/process/action`        |       |

The condition can be added to a role assignment using either the Azure portal or Azure PowerShell. The portal has two tools for building ABAC conditions - the visual editor and the code editor. You can switch between the two editors in the Azure portal to see your conditions in different views. Switch between the **Visual editor** tab and the **Code editor** tabs below to view the examples for your preferred portal editor.

# [Portal: Visual editor](#tab/portal-visual-editor)

Here are the settings to add this condition using the visual condition editor in the Azure portal.

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

> | Group | Setting | Value |
> | ----- | ------- | ----- |
> | Group #1 | | |
> | | Attribute source | [Resource](../../role-based-access-control/conditions-format.md#resource-attributes) |
> | | Attribute | [Container name](storage-auth-abac-attributes.md#container-name) |
> | | Operator | [StringEquals](../../role-based-access-control/conditions-format.md#stringequals) |
> | | Value | `container1` |
> | | Logical operator | 'AND' |
> | | Attribute source | [Environment](../../role-based-access-control/conditions-format.md#environment-attributes) |
> | | Attribute | [Private endpoint](storage-auth-abac-attributes.md#private-endpoint) |
> | | Operator | [StringEqualsIgnoreCase](../../role-based-access-control/conditions-format.md#stringequals) |
> | | Value | `/subscriptions/<your subscription id>/resourceGroups/<resource group name>/providers/Microsoft.Network/privateEndpoints/privateendpoint1` |
> | End of Group #1 | | |
> | | Logical operator | ['OR'](../../role-based-access-control/conditions-format.md#or) |
> | | Attribute source | [Resource](../../role-based-access-control/conditions-format.md#resource-attributes) |
> | | Attribute | [Container name](storage-auth-abac-attributes.md#container-name) |
> | | Operator | [StringNotEquals](../../role-based-access-control/conditions-format.md#stringnotequals) |
> | | Value | `container1` |

The following image shows the condition after the settings have been entered into the Azure portal. Note that you must group expressions to ensure correct evaluation.

:::image type="content" source="./media/storage-auth-abac-examples/environ-private-endpoint-containers-read-write-delete-portal.png" alt-text="Screenshot of condition editor in Azure portal showing read, write, or delete blobs in named containers with private endpoint environment attribute." lightbox="./media/storage-auth-abac-examples/environ-private-endpoint-containers-read-write-delete-portal.png":::

# [Portal: Code editor](#tab/portal-code-editor)

To add the condition using the code editor, choose one of the condition code samples below, depending on the role associated with the assignment.

**Storage Blob Data Owner:**

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
  AND
  !(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action'})
 )
 OR
 (
  (
   @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'container1'
   AND
   @Environment[Microsoft.Network/privateEndpoints] StringEqualsIgnoreCase '/subscriptions/<your subscription id>/resourceGroups/example-group/providers/Microsoft.Network/privateEndpoints/privateendpoint1'
  )
  OR
  @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringNotEquals 'container1'
 )
)
```

**Storage Blob Data Contributor:**

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
  (
   @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals 'container1'
   AND
   @Environment[Microsoft.Network/privateEndpoints] StringEqualsIgnoreCase '/subscriptions/<your subscription id>/resourceGroups/example-group/providers/Microsoft.Network/privateEndpoints/privateendpoint1'
  )
  OR
  @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringNotEquals 'container1'
 )
)
```

After entering your code, switch back to the visual editor to validate it.

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
$privateEndpointName = "privateendpoint1"
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
  ( `
   @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringEquals '$containerName' `
   AND `
   @Environment[Microsoft.Network/privateEndpoints] StringEqualsIgnoreCase '/subscriptions/$subId/resourceGroups/$rgName/providers/Microsoft.Network/privateEndpoints/$privateEndpointName' `
  ) `
  OR `
  @Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name] StringNotEquals '$containerName' `
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
