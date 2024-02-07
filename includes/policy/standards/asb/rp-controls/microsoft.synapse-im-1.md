---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 02/06/2024
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Synapse Workspaces should have Microsoft Entra-only authentication enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6ea81a52-5ca7-4575-9669-eaa910b7edf8) |Require Synapse Workspaces to use Microsoft Entra-only authentication. This policy doesn't block workspaces from being created with local authentication enabled. It does block local authentication from being enabled on resources after create. Consider using the 'Microsoft Entra-only authentication' initiative instead to require both. Learn more at: [https://aka.ms/Synapse](https://aka.ms/Synapse). |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Synapse/SynapseWorkspaceDisableAadOnlyAuthentication_Audit.json) |
|[Synapse Workspaces should use only Microsoft Entra identities for authentication during workspace creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2158ddbe-fefa-408e-b43f-d4faef8ff3b8) |Require Synapse Workspaces to be created with Microsoft Entra-only authentication. This policy doesn't block local authentication from being re-enabled on resources after create. Consider using the 'Microsoft Entra-only authentication' initiative instead to require both. Learn more at: [https://aka.ms/Synapse](https://aka.ms/Synapse). |Audit, Deny, Disabled |[1.2.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Synapse/SynaspeWorkspaceAadOnlyAuthentication_Audit.json) |
