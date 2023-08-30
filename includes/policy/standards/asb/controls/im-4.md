---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 08/03/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[API Management calls to API backends should be authenticated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc15dcc82-b93c-4dcb-9332-fbf121685b54) |Calls from API Management to backends should use some form of authentication, whether via certificates or credentials. Does not apply to Service Fabric backends. |Audit, Disabled, Deny |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_BackendAuth_AuditDeny.json) |
|[API Management calls to API backends should not bypass certificate thumbprint or name validation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F92bb331d-ac71-416a-8c91-02f2cb734ce4) |To improve the API security, API Management should validate the backend server certificate for all API calls. Enable SSL certificate thumbprint and name validation. |Audit, Disabled, Deny |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_BackendCertificateChecks_AuditDeny.json) |
