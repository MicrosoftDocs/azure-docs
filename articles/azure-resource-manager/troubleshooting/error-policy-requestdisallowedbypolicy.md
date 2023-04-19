---
title: Request disallowed by policy error
description: Describes the error for request disallowed by policy when deploying resources with an Azure Resource Manager template (ARM template) or Bicep file.
ms.topic: troubleshooting
ms.custom: devx-track-bicep, devx-track-arm-template
ms.date: 04/05/2023
author: genlin
ms.author: genli
---

# Resolve errors for request disallowed by policy

This article describes the cause of the `RequestDisallowedByPolicy` error and provides a solution for the error. The request disallowed by policy error can occur when you deploy resources with an Azure Resource Manager template (ARM template) or Bicep file.

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

In this example, the error occurred when an administrator attempted to create a network interface with a public IP address. A policy assignment enables enforcement of a built-in policy definition that prevents public IPs on network interfaces.

You can use the name of a policy assignment or policy definition to get more details about a policy that caused the error. The example commands use placeholders for input. For example, replace `<policy definition name>` including the angle brackets, with the definition name from your error message.

# [Azure CLI](#tab/azure-cli)

To get more information about a policy definition, use [az policy definition show](/cli/azure/policy/definition#az-policy-definition-show).

```azurecli
defname=<policy definition name>
az policy definition show --name $defname
```

To get more information about a policy assignment, use [az policy assignment show](/cli/azure/policy/assignment#az-policy-assignment-show).

```azurecli
rg=<resource group name>
assignmentname=<policy assignment name>
az policy assignment show --name $assignmentname --resource-group $rg
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

## Solution

For security or compliance, your subscription administrators might assign policies that limit how resources are deployed. For example, policies that prevent creating public IP addresses, network security groups, user-defined routes, or route tables.

To resolve `RequestDisallowedByPolicy` errors, review the resource policies and determine how to deploy resources that comply with those policies. The error message displays the names of the policy definition and policy assignment.

For more information, see the following articles:

- [What is Azure Policy?](../../governance/policy/overview.md)
- [Tutorial: Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md)
- [Azure Policy built-in policy definitions](../../governance/policy/samples/built-in-policies.md)
