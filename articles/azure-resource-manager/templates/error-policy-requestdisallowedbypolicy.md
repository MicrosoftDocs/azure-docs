---
title: RequestDisallowedByPolicy error
description: Describes the cause of the RequestDisallowedByPolicy error when deploying resources with Azure Resource Manager.
author: genlin
ms.topic: troubleshooting
ms.date: 10/31/2018
ms.author: genli
---
# RequestDisallowedByPolicy error with Azure resource policy

This article describes the cause of the RequestDisallowedByPolicy error, it also provides solution for this error.

## Symptom

During deployment, you might receive a **RequestDisallowedByPolicy** error that prevents you from creating the resources. The following example shows the error:

```json
{
  "statusCode": "Forbidden",
  "serviceRequestId": null,
  "statusMessage": "{\"error\":{\"code\":\"RequestDisallowedByPolicy\",\"message\":\"The resource action 'Microsoft.Network/publicIpAddresses/write' is disallowed by one or more policies. Policy identifier(s): '/subscriptions/{guid}/providers/Microsoft.Authorization/policyDefinitions/regionPolicyDefinition'.\"}}",
  "responseBody": "{\"error\":{\"code\":\"RequestDisallowedByPolicy\",\"message\":\"The resource action 'Microsoft.Network/publicIpAddresses/write' is disallowed by one or more policies. Policy identifier(s): '/subscriptions/{guid}/providers/Microsoft.Authorization/policyDefinitions/regionPolicyDefinition'.\"}}"
}
```

## Troubleshooting

To retrieve details about the policy that blocked your deployment, use the following one of the methods:

### PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

In PowerShell, provide that policy identifier as the `Id` parameter to retrieve details about the policy that blocked your deployment.

```powershell
(Get-AzPolicyDefinition -Id "/subscriptions/{guid}/providers/Microsoft.Authorization/policyDefinitions/regionPolicyDefinition").Properties.policyRule | ConvertTo-Json
```

### Azure CLI

In Azure CLI, provide the name of the policy definition:

```azurecli
az policy definition show --name regionPolicyAssignment
```

## Solution

For security or compliance, your subscription administrators might assign policies that limit how resources are deployed. For example, your subscription might have a policy that prevents creating Public IP addresses, Network Security Groups, User-Defined Routes, or route tables. The error message in the **Symptoms** section shows the name of the policy.
To resolve this problem, review the resource policies, and determine how to deploy resources that comply with those policies.

For more information, see the following articles:

- [What is Azure Policy?](../../governance/policy/overview.md)
- [Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md)
