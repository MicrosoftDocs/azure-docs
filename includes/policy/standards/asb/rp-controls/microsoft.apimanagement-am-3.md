---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 11/21/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[API endpoints that are unused should be disabled and removed from the Azure API Management service](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc8acafaf-3d23-44d1-9624-978ef0f8652c) |As a security best practice, API endpoints that haven't received traffic for 30 days are considered unused and should be removed from the Azure API Management service. Keeping unused API endpoints may pose a security risk to your organization. These may be APIs that should have been deprecated from the Azure API Management service but may have been accidentally left active. Such APIs typically do not receive the most up to date security coverage. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_APIMUnusedApiEndpointsShouldbeRemoved_AuditIfNotExists.json) |
