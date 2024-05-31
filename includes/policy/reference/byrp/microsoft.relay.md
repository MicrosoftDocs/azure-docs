---
ms.service: azure-policy
ms.topic: include
ms.date: 05/30/2024
ms.author: davidsmatlak
author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enable logging by category group for Relays (microsoft.relay/namespaces) to Event Hub](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34705075-71e2-480c-a9cb-6e9387f47f0f) |Resource logs should be enabled to track activities and events that take place on your resources and give you visibility and insights into any changes that occur. This policy deploys a diagnostic setting using a category group to route logs to an Event Hub for Relays (microsoft.relay/namespaces). |DeployIfNotExists, AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DS_EH_relay-namespaces_DINE.json) |
|[Enable logging by category group for Relays (microsoft.relay/namespaces) to Log Analytics](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F56ae9f08-b8c9-4a0f-8f58-5dbcd63bef84) |Resource logs should be enabled to track activities and events that take place on your resources and give you visibility and insights into any changes that occur. This policy deploys a diagnostic setting using a category group to route logs to a Log Analytics workspace for Relays (microsoft.relay/namespaces). |DeployIfNotExists, AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DS_LA_relay-namespaces_DINE.json) |
|[Enable logging by category group for Relays (microsoft.relay/namespaces) to Storage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2853b2ac-3ce0-4e51-a1e3-086591e7028a) |Resource logs should be enabled to track activities and events that take place on your resources and give you visibility and insights into any changes that occur. This policy deploys a diagnostic setting using a category group to route logs to a Storage Account for Relays (microsoft.relay/namespaces). |DeployIfNotExists, AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DS_ST_relay-namespaces_DINE.json) |
