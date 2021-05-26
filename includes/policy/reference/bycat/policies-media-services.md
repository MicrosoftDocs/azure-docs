---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 05/14/2021
ms.author: dacoulte
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Media Services jobs with HTTPS inputs should limit input URIs to permitted URI patterns](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe9914afe-31cd-4b8a-92fa-c887f847d477) |Restrict HTTPS inputs used by Media Services jobs to known endpoints. Inputs from HTTPS endpoints can be disabled entirely by setting an empty list of allowed job input patterns. Where job inputs specify a 'baseUri' the patterns will be matched against this value; when 'baseUri' is not set, the pattern is matched against the 'files' property. |Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Media%20Services/Jobs_RestrictHttpInputs.json) |
