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
|[Configure subscriptions to set up preview features](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe624c84f-2923-4437-9fd9-4115c6da3888) |This policy evaluates existing subscription's preview features. Subscriptions can be remediated to register to a new preview feature. New subscriptions will not be automatically registered. |AuditIfNotExists, DeployIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/subscriptionFeatureRegistration-DINE.json) |
