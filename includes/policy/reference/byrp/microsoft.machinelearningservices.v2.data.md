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
|[\[Preview\]: Azure Machine Learning Deployments should only use approved Registry Models](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F12e5dd16-d201-47ff-849b-8454061c293d) |Restrict the deployment of Registry models to control externally created models used within your organization |Audit, Deny, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Machine%20Learning/AllowDeployRegistryModels_Audit.json) |
|[\[Preview\]: Azure Machine Learning Model Registry Deployments are restricted except for the allowed Registry](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F19539b54-c61e-4196-9a38-67598701be90) |Only deploy Registry Models in the allowed Registry and that are not restricted. |Deny, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Machine%20Learning/OnlyDeployAllowedRegistryModels_Deny.json) |
