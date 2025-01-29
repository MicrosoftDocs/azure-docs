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
|[\[Preview\]: Load tests using Azure Load Testing should be run only against private endpoints from within a virtual network.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd855fd7a-9be5-4d84-8b75-28d41aadc158) |Azure Load Testing engine instances should use virtual network injection for the following purposes: 1. Isolate Azure Load Testing engines to a virtual network. 2. Enable Azure Load Testing engines to interact with systems in either on premises data centers or Azure service in other virtual networks. 3. Empower customers to control inbound and outbound network communications for Azure Load Testing engines. |Audit, Deny, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Load%20Testing/LoadTestService_NetworkIsolation_Audit.json) |
