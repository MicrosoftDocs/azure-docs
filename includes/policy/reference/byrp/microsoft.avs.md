---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 11/06/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enable logging by category group for AVS Private clouds (microsoft.avs/privateclouds) to Event Hub](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F73fb42d8-b57f-41cd-a840-8f4dedb1dd27) |Resource logs should be enabled to track activities and events that take place on your resources and give you visibility and insights into any changes that occur. This policy deploys a diagnostic setting using a category group to route logs to an Event Hub for AVS Private clouds (microsoft.avs/privateclouds). |DeployIfNotExists, AuditIfNotExists, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DiagSettings_eventHub_avs-privateclouds_DINE.json) |
|[Enable logging by category group for AVS Private clouds (microsoft.avs/privateclouds) to Log Analytics](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F69ab8bfc-dc5b-443d-93a7-7531551dec66) |Resource logs should be enabled to track activities and events that take place on your resources and give you visibility and insights into any changes that occur. This policy deploys a diagnostic setting using a category group to route logs to a Log Analytics workspace for AVS Private clouds (microsoft.avs/privateclouds). |DeployIfNotExists, AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DiagSettings_logAnalytics_avs-privateclouds_DINE.json) |
|[Enable logging by category group for AVS Private clouds (microsoft.avs/privateclouds) to Storage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50cebe4c-8021-4f07-bcb2-6c80622444a9) |Resource logs should be enabled to track activities and events that take place on your resources and give you visibility and insights into any changes that occur. This policy deploys a diagnostic setting using a category group to route logs to a Storage Account for AVS Private clouds (microsoft.avs/privateclouds). |DeployIfNotExists, AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/AzureMonitor_DiagSettings_storage_avs-privateclouds_Deploy.json) |
