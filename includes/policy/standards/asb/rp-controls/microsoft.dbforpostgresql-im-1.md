---
ms.service: azure-policy
ms.topic: include
ms.date: 07/15/2024
ms.author: davidsmatlak
author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Azure PostgreSQL flexible server should have Microsoft Entra Only Authentication enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffa498b91-8a7e-4710-9578-da944c68d1fe) |Disabling local authentication methods and allowing only Microsoft Entra Authentication improves security by ensuring that Azure PostgreSQL flexible server can exclusively be accessed by Microsoft Entra identities. |Audit, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_FlexibleServers_EnableEntraOnlyAuthentication_Audit.json) |
