---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 09/19/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Azure Data Factory pipelines should only communicate with allowed domains](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d02a511-74e5-4dab-a5fd-878704d4a61a) |To prevent data & token exfiltration, set the domains that Azure Data Factory should be allowed to communicate with. Note: While in public preview, the compliance for this policy is not reported, & for policy to be applied to Data Factory, please enable outbound rules functionality in the ADF studio. For more information, visit [https://aka.ms/data-exfiltration-policy](https://aka.ms/data-exfiltration-policy). |Deny, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Data%20Factory/Factory_OutboundTraffic_Audit.json) |
