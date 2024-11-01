---
title: Export Azure Policy resources
description: Learn to export Azure Policy resources to GitHub, such as policy definitions and policy assignments.
ms.date: 10/03/2024
ms.topic: how-to
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.devlang: azurecli
---

# Export Azure Policy resources

This article provides information on how to export your existing Azure Policy resources. Exporting your resources is useful and recommended for backup, but is also an important step in your journey with Cloud Governance and treating your [policy-as-code](../concepts/policy-as-code.md). Azure Policy resources can be exported through [REST API](/rest/api/policy), [Azure CLI](#export-with-azure-cli), and [Azure PowerShell](#export-with-azure-powershell).

> [!NOTE]
> The portal experience for exporting definitions to GitHub was deprecated in April 2023.

## Export with Azure CLI

Azure Policy definitions, initiatives, and assignments can each be exported as JSON with [Azure CLI](/cli/azure/install-azure-cli). Each of these commands uses a `name` parameter to specify which object to get the JSON for. The `name` property is often a _GUID_ and isn't the `displayName` of the object.

The Azure CLI and Azure PowerShell example commands use a built-in Policy definition with the `name` `b2982f36-99f2-4db5-8eff-283140c09693` and the `displayName` _Storage accounts should disable public network access_.

- Definition - [az policy definition show](/cli/azure/policy/definition#az-policy-definition-show).
- Initiative - [az policy set-definition show](/cli/azure/policy/set-definition#az-policy-set-definition-show).
- Assignment - [az policy assignment show](/cli/azure/policy/assignment#az-policy-assignment-show).

```azurecli-interactive
az policy definition show --name 'b2982f36-99f2-4db5-8eff-283140c09693'
```

## Export with Azure PowerShell

Azure Policy definitions, initiatives, and assignments can each be exported as JSON with [Azure PowerShell](/powershell/azure/). Each of these cmdlets uses a `Name` parameter to specify which object to get the JSON for. The `Name` property is often a _GUID_ (Globally Unique Identifier) and isn't the `displayName` of the object.

- Definition - [Get-AzPolicyDefinition](/powershell/module/az.resources/get-azpolicydefinition).
- Initiative - [Get-AzPolicySetDefinition](/powershell/module/az.resources/get-azpolicysetdefinition).
- Assignment - [Get-AzPolicyAssignment](/powershell/module/az.resources/get-azpolicyassignment).

```azurepowershell-interactive
Get-AzPolicyDefinition -Name 'b2982f36-99f2-4db5-8eff-283140c09693' | Select-Object -Property * | ConvertTo-Json -Depth 10
```

## Export to CSV with Resource Graph in Azure portal

Azure Resource Graph gives the ability to query at scale with complex filtering, grouping and sorting. Azure Resource Graph supports the policy resources table, which contains policy resources such as definitions, assignments and exemptions. Review our [sample queries.](../samples/resource-graph-samples.md#azure-policy). The Resource Graph explorer portal experience allows downloads of query results to CSV using the ["Download to CSV"](../../resource-graph/first-query-portal.md#download-query-results-as-a-csv-file) toolbar option.

## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure-basics.md).
- Review [Understanding policy effects](../concepts/effect-basics.md).
- Understand how to [programmatically create policies](programmatically-create.md).
- Learn how to [remediate noncompliant resources](remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
