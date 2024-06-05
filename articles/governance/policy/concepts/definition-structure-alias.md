---
title: Details of the policy definition structure aliases
description: Describes how policy definition aliases are used to establish conventions for Azure resources in your organization.
ms.date: 04/01/2024
ms.topic: conceptual
---

# Azure Policy definition structure aliases

You use property aliases to access specific properties for a resource type. Aliases enable you to restrict what values or conditions are allowed for a property on a resource. Each alias maps to paths in different API versions for a given resource type. During policy evaluation, the policy engine gets the property path for that API version.

The list of aliases is always growing. To find which aliases Azure Policy supports, use one of the following methods:

- Azure Policy extension for Visual Studio Code (recommended)

  Use the [Azure Policy extension for Visual Studio Code](../how-to/extension-for-vscode.md) to view and discover aliases for resource properties.

  :::image type="content" source="../media/extension-for-vscode/extension-hover-shows-property-alias.png" alt-text="Screenshot of the Azure Policy extension for Visual Studio Code hovering over a property to display the alias names.":::

- Azure PowerShell

  ```azurepowershell-interactive
  # Login first with Connect-AzAccount if not using Cloud Shell

  # Use Get-AzPolicyAlias to list available providers
  Get-AzPolicyAlias -ListAvailable

  # Use Get-AzPolicyAlias to list aliases for a Namespace (such as Azure Compute -- Microsoft.Compute)
  (Get-AzPolicyAlias -NamespaceMatch 'compute').Aliases
  ```

  > [!NOTE]
  > To find aliases that can be used with the [modify](./effects.md#modify) effect, use the
  > following command in Azure PowerShell **4.6.0** or higher:
  >
  > ```azurepowershell-interactive
  > Get-AzPolicyAlias | Select-Object -ExpandProperty 'Aliases' | Where-Object { $_.DefaultMetadata.Attributes -eq 'Modifiable' }
  > ```

- Azure CLI

  ```azurecli-interactive
  # Login first with az login if not using Cloud Shell

  # List namespaces
  az provider list --query [*].namespace

  # Get Azure Policy aliases for a specific Namespace (such as Azure Compute -- Microsoft.Compute)
  az provider show --namespace Microsoft.Compute --expand "resourceTypes/aliases" --query "resourceTypes[].aliases[].name"
  ```

- REST API

  ```http
  GET https://management.azure.com/providers/?api-version=2019-10-01&$expand=resourceTypes/aliases
  ```

## Understanding the array alias

Several of the aliases that are available have a version that appears as a _normal_ name and another that has `[*]` attached to it, which is an array alias. For example:

- `Microsoft.Storage/storageAccounts/networkAcls.ipRules`
- `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*]`

- The _normal_ alias represents the field as a single value. This field is for exact match comparison scenarios when the entire set of values must be exactly as defined.
- The array alias `[*]` represents a collection of values selected from the elements of an array resource property. For example:

| Alias | Selected values |
|:---|:---|
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*]` | The elements of the `ipRules` array. |
| `Microsoft.Storage/storageAccounts/networkAcls.ipRules[*].action` | The values of the `action` property from each element of the `ipRules` array. |

When used in a [field](./definition-structure-policy-rule.md#fields) condition, array aliases make it possible to compare each individual array element to a target value. When used with [count](./definition-structure-policy-rule.md#count) expression, it's possible to:

- Check the size of an array.
- Check if all\any\none of the array elements meet a complex condition.
- Check if exactly `n` array elements meet a complex condition.

For more information and examples, see [Referencing array resource properties](../how-to/author-policies-for-arrays.md#referencing-array-resource-properties).

## Next steps

- For more information about policy definition structure, go to [basics](./definition-structure-basics.md), [parameters](./definition-structure-parameters.md), and [policy rule](./definition-structure-policy-rule.md).
- For initiatives, go to [initiative definition structure](./initiative-definition-structure.md).
- Review examples at [Azure Policy samples](../samples/index.md).
- Review [Understanding policy effects](effects.md).
- Understand how to [programmatically create policies](../how-to/programmatically-create.md).
- Learn how to [get compliance data](../how-to/get-compliance-data.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
