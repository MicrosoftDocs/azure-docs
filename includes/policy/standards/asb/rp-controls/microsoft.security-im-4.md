---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 03/18/2024
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[API endpoints in Azure API Management should be authenticated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8ac833bd-f505-48d5-887e-c993a1d3eea0) |API endpoints published within Azure API Management should enforce authentication to help minimize security risk. Authentication mechanisms are sometimes implemented incorrectly or are missing. This allows attackers to exploit implementation flaws and to access data. Learn More about the OWASP API Threat for Broken User Authentication here: [https://learn.microsoft.com/azure/api-management/mitigate-owasp-api-threats#broken-user-authentication](../../../../../articles/api-management/mitigate-owasp-api-threats.md#broken-user-authentication) |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_APIMApiEndpointsShouldbeAuthenticated_AINE.json) |
