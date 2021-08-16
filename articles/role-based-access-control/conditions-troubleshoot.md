---
title: Troubleshoot Azure role assignment conditions (preview)
description: Troubleshoot Azure role assignment conditions (preview)
services: active-directory
author: rolyon
manager: mtillman
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: troubleshooting
ms.workload: identity
ms.date: 09/15/2021
ms.author: rolyon

#Customer intent: 
---

# Troubleshoot Azure role assignment conditions (preview)

> [!IMPORTANT]
> Azure ABAC and Azure role assignment conditions are currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Symptom - Condition is not enforced

**Cause 1**

Security principals have one or more role assignments at the same or higher scope.

**Solution 1**

Ensure that the security principals don't have multiple role assignments (with or without conditions) that grant access to the same data action leading to non-enforcement of conditions. For information about the evaluation logic, see [How Azure RBAC determines if a user has access to a resource](overview.md#how-azure-rbac-determines-if-a-user-has-access-to-a-resource).

**Cause 2**

Your role assignment has multiple actions that grant a permission and your condition does not target all the actions. For example, you can create a blob if you have either `/blobs/write` or `/blobs/add/action` data actions. If your role assignment has both data actions and you target only one of them in a condition, the role assignment will grant the permission to create blobs and bypass the condition.

**Solution 2**

If your role assignment has multiple actions that grant a permission, ensure that you target all relevant actions.

**Cause 3**

When you add a condition to a role assignment, it can take up to 5 minutes for the condition to be enforced. When you add a condition, resource providers (such as Microsoft.Storage) are notified of the update. Resource providers make updates to their local caches immediately to ensure that they have the latest role assignments. This process completes in 1 or 2 minutes, but can take up to 5 minutes.

**Solution 3**

Wait for 5 minutes and test the condition again.

## Symptom - Condition is not valid error when adding a condition

When you try to add a role assignment with a condition, you get an error similar to:

`The given role assignment condition is invalid.`

**Cause**

Your condition is not formatted correctly. 

**Solution**

Fix any [condition format or syntax](conditions-format.md) issues. Alternatively, add the condition using the [visual editor in the Azure portal](conditions-role-assignments-portal.md).

## Symptom - Principal does not appear in Attribute source when adding a condition

When you try to add a role assignment with a condition, **Principal** does not appear in the **Attribute source** list.

![Screenshot showing Principal in Attribute source list when adding a condition.](./media/conditions-troubleshoot/attribute-source-principal.png)

**Cause**

You don't meet one or more of the requirements to use principal attributes.

**Solution**

To use principal attributes, you must have **all** of the following:

- Azure AD Premium P1 or P2 license
- Azure AD permissions, such as the Attribute Assignment Administrator role
- Custom security attributes defined in Azure AD

For more information about custom security attributes, see [Add or deactivate custom security attributes in Azure AD](../active-directory/fundamentals/custom-security-attributes-add.md).

## Symptom - Resource attribute is not valid error when adding a condition using Azure PowerShell

When you try to add a role assignment with a condition using Azure PowerShell, you get an error similar to:

```
New-AzRoleAssignment : Resource attribute
Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$> is not valid.
```

**Cause**

If your condition includes a dollar sign ($), you must prefix it with a backtick (\`).

**Solution**

Add a backtick (\`) before each dollar sign. The following shows an example. For more information about rules for quotation marks in PowerShell, see [About Quoting Rules](/powershell/module/microsoft.powershell.core/about/about_quoting_rules).

```azurepowershell
$condition = "((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND @Request[subOperation] ForAnyOfAnyValues:StringEqualsIgnoreCase {'Blob.Read.WithTagConditions'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<`$key_case_sensitive`$>] StringEquals 'Cascade'))"
```

## Symptom - Resource attribute is not valid error when adding a condition using Azure CLI

When you try to add a role assignment with a condition using Azure CLI, you get an error similar to:

```
Resource attribute Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<$> is not valid.
```

**Cause**

If your condition includes a dollar sign ($), you must prefix it with a backslash (\\).

**Solution**

Add a backslash (\\) before each dollar sign. The following shows an example. For more information about rules for quotation marks in Bash, see [Double Quotes](https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html).

```azurecli
condition="((!(ActionMatches{'Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read'} AND @Request[subOperation] ForAnyOfAnyValues:StringEqualsIgnoreCase {'Blob.Read.WithTagConditions'})) OR (@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:Project<\$key_case_sensitive\$>] StringEquals 'Cascade'))"
```

## Symptom - Error when assigning a condition string to a variable in Bash

When you try to assign a condition string to a variable in Bash, you get the `bash: !: event not found` message.

**Cause**

In Bash, if history expansion is enabled, you might see the message `bash: !: event not found` because of the exclamation point (!).

**Solution**

Disable history expansion with the command `set +H`. To re-enable history expansion, use `set -H`.

## Symptom - Unrecognized arguments error when adding a condition using Azure CLI

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

Updates were made to the condition that the visual editor is not able to parse.

**Solution**

Fix any [condition format or syntax](conditions-format.md) issues. Alternatively, you can delete the condition and try again.

## Symptom - Error when copying and pasting a condition

**Cause**

If you copy a condition from a document, it might include special characters and cause errors. Some editors (such as Microsoft Word) add control characters when formatting text that does not appear.

**Solution**

If you are certain that your condition is correct, delete all spaces and returns and then add back the relevant spaces.

## Next steps

- [Azure role assignment condition format and syntax (preview)](conditions-format.md)
- [FAQ for Azure role assignment conditions (preview)](conditions-faq.md)
- [Example Azure role assignment conditions (preview)](../storage/common/storage-auth-abac-examples.md)
