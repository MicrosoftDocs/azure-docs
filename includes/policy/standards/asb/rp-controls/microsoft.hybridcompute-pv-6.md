---
ms.service: azure-policy
ms.topic: include
ms.date: 12/06/2024
ms.author: davidsmatlak
author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Machines should be configured to periodically check for missing system updates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd876905-5b84-4f73-ab2d-2e7a7c4568d9) |To ensure periodic assessments for missing system updates are triggered automatically every 24 hours, the AssessmentMode property should be set to 'AutomaticByPlatform'. Learn more about AssessmentMode property for Windows: [https://aka.ms/computevm-windowspatchassessmentmode,](https://aka.ms/computevm-windowspatchassessmentmode,) for Linux: [https://aka.ms/computevm-linuxpatchassessmentmode](https://aka.ms/computevm-linuxpatchassessmentmode). |Audit, Deny, Disabled |[3.7.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Update%20Manager/AzUpdateMgmtCenter_AutoAssessmentMode_Audit.json) |
