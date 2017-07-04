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

When your subscription includes a [resource  policy](resource-manager-policy.md) configured, you might receive a **RequestDisallowedByPolicy** error which prevents an action you are trying to perform during deployment. The following is a sample of the error:

```
{
  "statusCode": "Forbidden",
  "serviceRequestId": null,
  "statusMessage": "{\"error\":{\"code\":\"RequestDisallowedByPolicy\",\"message\":\"The resource action 'Microsoft.Network/publicIpAddresses/write' is disallowed by one or more policies. Policy identifier(s): '/subscriptions/<ID>/providers/Microsoft.Authorization/policyDefinitions/SDOStdPolicyNetwork'.\"}}",
  "responseBody": "{\"error\":{\"code\":\"RequestDisallowedByPolicy\",\"message\":\"The resource action 'Microsoft.Network/publicIpAddresses/write' is disallowed by one or more policies. Policy identifier(s): '/subscriptions/<ID>/providers/Microsoft.Authorization/policyDefinitions/SDOStdPolicyNetwork'.\"}}"
}
```

## Solution

For security reasons, your IT department might enforce a resource policy that prohibits creation of Public IP address, Network Security Group, User Defined Routes,or route tables if your subscription has an ExpressRoute circuit. Right now, the policy is named **SDOStdPolicyNetwork**. Howerver, the name could be changed later or that there is another policy named something different that enforces the same thing.
 

 


