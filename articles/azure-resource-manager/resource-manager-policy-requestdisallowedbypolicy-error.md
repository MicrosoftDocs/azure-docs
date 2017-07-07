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
ms.date: 07/04/2017
ms.author: genli

---
# RequestDisallowedByPolicy error with the resource policy

## Symptoms

Your Microsoft Azure subscription has a [resource policy](resource-manager-policy.md) configured. When you try to perform an action during deployment, you might receive a **RequestDisallowedByPolicy** error that prevents the action be performed. The following is a sample of the error:

```
Policy identifier(s): '/subscriptions/{guid}/providers/Microsoft.Authorization/policyDefinitions/regionPolicyDefinition'
```

## Troubleshooting

To retrieve details about the policy that blocked your deployment, use the following one of the methods:

### Method 1

In **PowerShell**, provide that policy identifier as the **Id** parameter to retrieve details about the policy that blocked your deployment.

```PowerShell
(Get-AzureRmPolicyDefinition -Id "/subscriptions/{guid}/providers/Microsoft.Authorization/policyDefinitions/regionPolicyDefinition").Properties.policyRule | ConvertTo-Json
```

### Method 2 

In Azure CLI 2.0, provide the name of the policy definition: 

```Azure CLI
az policy definition show --name regionPolicyAssignment
```

## Solution

For security reasons, your IT department might enforce a resource policy that prohibits creation of Public IP address, Network Security Group, User-Defined Routes, or route tables if your subscription has an ExpressRoute circuit. In the sample of the error that is described in "Symptoms", the policy is named **regionPolicyDefinition**.

## More information

[Resource policy overview](resource-manager-policy.md)
[Common deployment errors-RequestDisallowedByPolicy](resource-manager-common-deployment-errors.md#requestdisallowedbypolicy)

 


