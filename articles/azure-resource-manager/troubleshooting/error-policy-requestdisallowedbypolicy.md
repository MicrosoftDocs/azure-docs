---
title: Request disallowed by policy error
description: Describes the error for request disallowed by policy when deploying resources with an Azure Resource Manager template (ARM template) or Bicep file.
ms.topic: troubleshooting
ms.custom: devx-track-bicep, devx-track-arm-template
ms.date: 10/20/2023
author: genlin
ms.author: genli
---

# Resolve errors for request disallowed by policy

When deploying an Azure Resource Manager template (ARM template) or Bicep file, you get the `RequestDisallowedByPolicy` error when one of the resources to deploy doesn't comply with an existing [Azure Policy](../../governance/policy/overview.md).

## Symptom

During a deployment, you might receive a `RequestDisallowedByPolicy` error that prevents you from creating a resource. Azure CLI, Azure PowerShell, and the Azure portal's activity log show similar information about the error. The key elements are the error code, policy assignment, and policy definition.

```Output
"statusMessage": "{"error":{"code":"RequestDisallowedByPolicy", "target":"examplenic1207",
  "message":"Resource `examplenic1207` was disallowed by policy. Policy identifiers:

"policyAssignment":{"name":"Network interfaces should not have public IPs",
  "id":"/subscriptions/{guid}/providers/Microsoft.Authorization/policyAssignments/1111aa2222bb3333cc4444dd"}

"policyDefinition":{"name":"Network interfaces should not have public IPs",
  "id":"/subscriptions/{guid}/providers/Microsoft.Authorization/policyDefinitions/83a86a26-fd1f-447c-b59d-e51f44264114"}
```

In the `id` string, the `{guid}` placeholder represents an Azure subscription ID. The name of a `policyAssignment` or `policyDefinition` is the last segment of the `id` string.

## Cause

Your organization assigns policies to enforce organizational standards and to assess compliance at-scale. If you're trying to deploy a resource that violates a policy, the deployment is blocked.

For example, your subscription can have a policy that prevents public IPs on network interfaces. If you attempt to create a network interface with a public IP address, the policy blocks you from creating the network interface.

## Solution

To resolve the `RequestDisallowedByPolicy` error when deploying an ARM template or Bicep file, you need to find which policy is blocking the deployment. Within that policy, you need to review the rules so you can update your deployment to comply with the policy.

The error message includes the names of the policy definition and policy assignment that caused the error. You need these names to get more information about the policy.

# [Azure CLI](#tab/azure-cli)

To get more information about a policy definition, use [az policy definition show](/cli/azure/policy/definition#az-policy-definition-show).

```azurecli
az policy definition show --name {policy-name}
```

To get more information about a policy assignment, use [az policy assignment show](/cli/azure/policy/assignment#az-policy-assignment-show).

```azurecli
az policy assignment show --name {assignment-name} --resource-group {resource-group-name}
```

# [PowerShell](#tab/azure-powershell)

To get more information about a policy definition, use [Get-AzPolicyDefinition](/powershell/module/az.resources/get-azpolicydefinition).

The `ConvertTo-Json` cmdlet has a `Depth` parameter that expands the output and the default value is 2. For more information, see [ConvertTo-Json](/powershell/module/microsoft.powershell.utility/convertto-json).

```azurepowershell
$subid = (Get-AzContext).Subscription.Id
$defname = "<policy definition name>"
(Get-AzPolicyDefinition -Id "/subscriptions/$subid/providers/Microsoft.Authorization/policyDefinitions") |
  Where-Object -Property Name -EQ -Value $defname |
    ConvertTo-Json -Depth 10
```

To get more information about a policy assignment, use [Get-AzPolicyAssignment](/powershell/module/az.resources/get-azpolicyassignment).

```azurepowershell
$rg = Get-AzResourceGroup -Name "<resource group name>"
$assignmentname = "<policy assignment name>"
Get-AzPolicyAssignment -Name $assignmentname -Scope $rg.ResourceId | ConvertTo-Json -Depth 5
```

---

Within the policy definition, you see a description of the policy and the rules that are applied. Review the rules and update your ARM template or Bicep file to comply with the rules. For example, if the rule states the public network access is disabled, you need to update the corresponding resource properties.

For more information, see the following articles:

- [What is Azure Policy?](../../governance/policy/overview.md)
- [Tutorial: Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md)
- [Azure Policy built-in policy definitions](../../governance/policy/samples/built-in-policies.md)
