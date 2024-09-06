---
ms.service: azure-policy
ms.topic: include
ms.date: 08/16/2024
ms.author: davidsmatlak
author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure AI Services resources should encrypt data at rest with a customer-managed key (CMK)](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F67121cc7-ff39-4ab8-b7e3-95b84dab487d) |Using customer-managed keys to encrypt data at rest provides more control over the key lifecycle, including rotation and management. This is particularly relevant for organizations with related compliance requirements. This is not assessed by default and should only be applied when required by compliance or restrictive policy requirements. If not enabled, the data will be encrypted using platform-managed keys. To implement this, update the 'Effect' parameter in the Security Policy for the applicable scope. |Audit, Deny, Disabled |[2.2.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Cognitive%20Services/CustomerManagedKey_Audit.json) |
