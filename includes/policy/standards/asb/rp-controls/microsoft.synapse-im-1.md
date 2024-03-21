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
|[Synapse Workspaces should have Microsoft Entra-only authentication enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6ea81a52-5ca7-4575-9669-eaa910b7edf8) |Require Synapse Workspaces to use Microsoft Entra-only authentication. This policy doesn't block workspaces from being created with local authentication enabled. It does block local authentication from being enabled on resources after create. Consider using the 'Microsoft Entra-only authentication' initiative instead to require both. Learn more at: [https://aka.ms/Synapse](https://aka.ms/Synapse). |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Synapse/WorkspaceDisableAadOnlyAuthentication_Audit.json) |
