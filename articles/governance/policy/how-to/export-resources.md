---
title: Export Azure Policy resources
description: Learn to export Azure Policy resources to GitHub, such as policy definitions and policy assignments.
ms.date: 04/18/2022
ms.topic: how-to
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
author: davidsmatlak
ms.author: davidsmatlak
---
# Export Azure Policy resources

This article provides information on how to export your existing Azure Policy resources. Exporting
your resources is useful and recommended for backup, but is also an important step in your journey
with Cloud Governance and treating your [policy-as-code](../concepts/policy-as-code.md). Azure
Policy resources can be exported through [REST API](/rest/api/policy), [Azure CLI](#export-with-azure-cli), and [Azure PowerShell](#export-with-azure-powershell).

> [!NOTE]
> The portal experience for exporting definitions to GitHub was deprecated in April 2023. 

## Export with Azure CLI

Azure Policy definitions, initiatives, and assignments can each be exported as JSON with
[Azure CLI](/cli/azure/install-azure-cli). Each of these commands uses a **name** parameter to
specify which object to get the JSON for. The **name** property is often a _GUID_ and isn't the
**displayName** of the object.

- Definition - [az policy definition show](/cli/azure/policy/definition#az-policy-definition-show)
- Initiative - [az policy set-definition show](/cli/azure/policy/set-definition#az-policy-set-definition-show)
- Assignment - [az policy assignment show](/cli/azure/policy/assignment#az-policy-assignment-show)

Here's an example of getting the JSON for a policy definition with **name** of
_VirtualMachineStorage_:

```azurecli-interactive
az policy definition show --name 'VirtualMachineStorage'
```

## Export with Azure PowerShell

Azure Policy definitions, initiatives, and assignments can each be exported as JSON with [Azure
PowerShell](/powershell/azure/). Each of these cmdlets uses a **Name** parameter to specify which
object to get the JSON for. The **Name** property is often a _GUID_ (Globally Unique Identifier) and isn't the **displayName** of
the object.

- Definition - [Get-AzPolicyDefinition](/powershell/module/az.resources/get-azpolicydefinition)
- Initiative - [Get-AzPolicySetDefinition](/powershell/module/az.resources/get-azpolicysetdefinition)
- Assignment - [Get-AzPolicyAssignment](/powershell/module/az.resources/get-azpolicyassignment)

Here's an example of getting the JSON for a policy definition with **Name** (as mentioned previously, GUID) of
_d7fff7ea-9d47-4952-b854-b7da261e48f2_:

```azurepowershell-interactive
Get-AzPolicyDefinition -Name 'd7fff7ea-9d47-4952-b854-b7da261e48f2' | ConvertTo-Json -Depth 10
```

## Export to CSV with Resource Graph in Azure Portal

Azure Resource Graph gives the ability to query at scale with complex filtering, grouping and sorting. Azure Resource Graph supports the policy resources table, which contains policy resources such as definitions, assignments and exemptions. Review our [sample queries.](../../resource-graph/samples/samples-by-table.md#policyresources)
The Resource Graph explorer portal experience allows downloads of query results to CSV using the ["Download to CSV"](../../resource-graph/first-query-portal.md#download-query-results-as-a-csv-file) toolbar option.  


## Next steps

- Review examples at [Azure Policy samples](../samples/index.md).
- Review the [Azure Policy definition structure](../concepts/definition-structure.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Understand how to [programmatically create policies](programmatically-create.md).
- Learn how to [remediate noncompliant resources](remediate-resources.md).
- Review what a management group is with [Organize your resources with Azure management groups](../../management-groups/overview.md).
