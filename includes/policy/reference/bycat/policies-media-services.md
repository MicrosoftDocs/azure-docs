---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 06/11/2021
ms.author: dacoulte
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Media Services accounts should use an API that supports Private Link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa77d8bb4-8d22-4bc1-a884-f582a705b480) |Media Services accounts should be created with an API that supports private link. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Media%20Services/MediaServices_RequirePrivateLinkSupport_Audit.json) |
|[Azure Media Services accounts that allow access to the legacy v2 API should be blocked](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fccf93279-9c91-4143-a841-8d1f21505455) |The Media Services legacy v2 API allows requests that cannot be managed using Azure Policy. Media Services resources created using the 2020-05-01 API or later block access to the legacy v2 API. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Media%20Services/MediaServices_BlockRestV2_Audit.json) |
|[Azure Media Services content key policies should use token authentication](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdaccf7e4-9808-470c-a848-1c5b582a1afb) |Content key policies define the conditions that must be met to access content keys. A token restriction ensures content keys can only be accessed by users that have valid tokens from an authentication service, for example Azure Active Directory. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Media%20Services/ContentKeyPolicies_RequireTokenAuth_Audit.json) |
|[Azure Media Services jobs with HTTPS inputs should limit input URIs to permitted URI patterns](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe9914afe-31cd-4b8a-92fa-c887f847d477) |Restrict HTTPS inputs used by Media Services jobs to known endpoints. Inputs from HTTPS endpoints can be disabled entirely by setting an empty list of allowed job input patterns. Where job inputs specify a 'baseUri' the patterns will be matched against this value; when 'baseUri' is not set, the pattern is matched against the 'files' property. |Deny, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Media%20Services/Jobs_RestrictHttpInputs.json) |
