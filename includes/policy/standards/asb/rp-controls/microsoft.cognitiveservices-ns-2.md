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
|[\[Deprecated\]: Cognitive Services should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcddd188c-4b82-4c48-a19d-ddf74ee66a01) |Azure Private Link lets you connect your virtual networks to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to Cognitive Services, you'll reduce the potential for data leakage. Learn more about private links at: [https://go.microsoft.com/fwlink/?linkid=2129800](https://go.microsoft.com/fwlink/?linkid=2129800). |Audit, Disabled |[3.0.1-deprecated](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Cognitive%20Services/EnablePrivateEndpoints_Audit.json) |
