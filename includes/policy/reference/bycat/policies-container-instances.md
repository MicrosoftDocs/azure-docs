---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 08/08/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure diagnostics for container group to log analytics workspace](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F21c469fa-a887-4363-88a9-60bfd6911a15) |Appends the specified log analytics workspaceId and workspaceKey when any container group which is missing these fields is created or updated. Does not modify the fields of container groups created before this policy was applied until those resource groups are changed. |Append, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Container%20Instances/ContainerInstance_LogAnalytics_Append.json) |
