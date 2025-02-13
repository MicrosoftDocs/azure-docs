---
ms.service: azure-policy
ms.topic: include
ms.date: 02/10/2025
ms.author: davidsmatlak
author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[API Management minimum API version should be set to 2019-12-01 or higher](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F549814b6-3212-4203-bdc8-1548d342fb67) |To prevent service secrets from being shared with read-only users, the minimum API version should be set to 2019-12-01 or higher. |Audit, Deny, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/MinimumApiVersion_AuditDeny.json) |
|[API Management secret named values should be stored in Azure Key Vault](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff1cc7827-022c-473e-836e-5a51cae0b249) |Named values are a collection of name and value pairs in each API Management service. Secret values can be stored either as encrypted text in API Management (custom secrets) or by referencing secrets in Azure Key Vault. To improve security of API Management and secrets, reference secret named values from Azure Key Vault. Azure Key Vault supports granular access management and secret rotation policies. |Audit, Disabled, Deny |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/NamedValueSecretsInKV_AuditDeny.json) |
|[Machines should have secret findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3ac7c827-eea2-4bde-acc7-9568cd320efa) |Audits virtual machines to detect whether they contain secret findings from the secret scanning solutions on your virtual machines. |AuditIfNotExists, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_ServerSecretAssessment_Audit.json) |
