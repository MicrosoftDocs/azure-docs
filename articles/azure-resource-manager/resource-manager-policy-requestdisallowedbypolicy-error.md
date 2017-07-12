---
title: RequestDisallowedByPolicy error with the resource policy | Microsoft Docs
description: Describes the cause of the RequestDisallowedByPolicy error.
services: azure-resource-manager,azure-portal
documentationcenter: ''
author: genlin
manager: cshepard
editor: ''

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/12/2017
ms.author: genli

---
# RequestDisallowedByPolicy error with the resource policy

## Symptom

When you try to perform an action during deployment, you might receive a **RequestDisallowedByPolicy** error that prevents the action be performed. The following is a sample of the error:

```
{
  "statusCode": "Forbidden",
  "serviceRequestId": null,
  "statusMessage": "{\"error\":{\"code\":\"RequestDisallowedByPolicy\",\"message\":\"The resource action 'Microsoft.Network/publicIpAddresses/write' is disallowed by one or more policies. Policy identifier(s): '/subscriptions/{guid}/providers/Microsoft.Authorization/policyDefinitions/regionPolicyDefinition'.\"}}",
  "responseBody": "{\"error\":{\"code\":\"RequestDisallowedByPolicy\",\"message\":\"The resource action 'Microsoft.Network/publicIpAddresses/write' is disallowed by one or more policies. Policy identifier(s): '/subscriptions/{guid}/providers/Microsoft.Authorization/policyDefinitions/regionPolicyDefinition'.\"}}"
}
```

## Troubleshooting

To retrieve details about the policy that blocked your deployment, use the following one of the methods:

### Method 1

In PowerShell, provide that policy identifier as the **Id** parameter to retrieve details about the policy that blocked your deployment.

```PowerShell
(Get-AzureRmPolicyDefinition -Id "/subscriptions/{guid}/providers/Microsoft.Authorization/policyDefinitions/regionPolicyDefinition").Properties.policyRule | ConvertTo-Json
```

### Method 2 

In Azure CLI 2.0, provide the name of the policy definition: 

```azurecli
az policy definition show --name regionPolicyAssignment
```

## Solution

For security or compliance reasons, your IT department might enforce a resource policy that prohibits creation of Public IP address, Network Security Group, User-Defined Routes, or route tables. In the sample of the error that is described in "Symptoms", the policy is named **regionPolicyDefinition**, but it could be different. 

To resolve the problem, work with the IT Department to review the resource policies, and check how to perform the requested action in compliance. 

For more information, see the following articles:

- [Resource policy overview](resource-manager-policy.md)
- [Common deployment errors-RequestDisallowedByPolicy](resource-manager-common-deployment-errors.md#requestdisallowedbypolicy)

 


