---
title: Troubleshoot Azure role assignment conditions (Preview)
description: Troubleshoot Azure role assignment conditions (Preview)
services: active-directory
author: rolyon
manager: mtillman
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: troubleshooting
ms.workload: identity
ms.date: 04/27/2021
ms.author: rolyon

#Customer intent: 
---

# Troubleshoot Azure role assignment conditions (Preview)

> [!IMPORTANT]
> Azure ABAC and Azure role assignment conditions are currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Symptom - Condition is not enforced

**Cause 1**

Security principals have one or more role assignments at the same or higher scope.

**Solution 1**

Ensure that the security principals don't have multiple role assignments (with or without conditions) that grant access to the same data action leading to non-enforcement of conditions.

**Cause 2**

Your role definition has multiple actions that grant a permission and your condition does not target all the actions. For example, you can create a blob if you have either `/blobs/write` or `/blobs/add/action` data actions. If your role definition has both data actions and you target only one of them in a condition, the role assignment will grant the permission to create blobs bypassing the condition.

**Solution 2**

If your role definition has multiple actions that grant a permission, ensure that you target all relevant actions.

**Cause 3**

When you add a condition to a role assignment, it can take up to 5 minutes for the condition to be enforced. When you add a condition, resource providers (such as Microsoft.Storage) are notified of the update. Resource providers make updates to their local caches immediately to ensure that they have the latest role assignments. This process completes in 1 or 2 minutes, but can take up to 5 minutes.

**Solution 3**

Wait for 5 minutes and test the condition again.

## Symptom - Adding a condition using Azure PowerShell results in an error

**Cause**

If you copy a condition from a document, it might include special characters and cause errors. Some editors (such as Microsoft Word) add control characters when formatting text that does not appear.

**Solution**

If you are certain that your condition is correct, delete all whitespaces (spaces and returns) and then add back the relevant spaces.

## Symptom - Adding a condition using Azure PowerShell results in a resource attribute is not valid error

When you try to add a role assignment with a condition using Azure PowerShell, you get an error similar to:

```
New-AzRoleAssignment : Resource attribute
Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$> is not valid.
```

**Cause**

If your condition includes a dollar sign ($), you must prefix it with a backtick (\`).

**Solution**

Add a backtick (\`) before each dollar sign. The following shows an example:

```azurepowershell
$condition = "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND SubOperationMatches{'Blobs.Read.WithTagConditions'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<`$key_case_sensitive`$>] StringEquals 'Cascade'))"
```

## Symptom - Adding a condition using Azure CLI results in an unrecognized arguments error

When you try to add a role assignment with a condition using Azure CLI, you get an error similar to:

`az: error: unrecognized arguments: --description {description} --condition {condition} --condition-version 2.0`

**Cause**

You are likely using an earlier version of Azure CLI that does not support role assignment condition parameters.

**Solution**

Update to the latest version of Azure CLI (2.18 or later). For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Symptom - Condition not recognized in visual editor

After using the code editor, you switch to the visual editor and get a message similar to the following:

`The current expression cannot be recognized. Switch to the code editor to edit the expression or delete the expression and add a new one.`

**Cause**

Updates have been to the condition that the visual editor is not able to parse.

**Solution**

Fix any [condition format or syntax](conditions-format.md) issues. Alternatively, you can delete the condition and try again.

## Next steps

- [Azure role assignment condition format and syntax (Preview)](conditions-format.md)
- [FAQ for Azure role assignment conditions (Preview)](conditions-faq.md)
- [Example Azure role assignment conditions (Preview)](../storage/common/storage-auth-abac-examples.md)
