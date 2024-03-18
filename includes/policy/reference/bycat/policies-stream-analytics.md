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
|[Azure Stream Analytics jobs should use customer-managed keys to encrypt data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F87ba29ef-1ab3-4d82-b763-87fcd4f531f7) |Use customer-managed keys when you want to securely store any metadata and private data assets of your Stream Analytics jobs in your storage account. This gives you total control over how your Stream Analytics data is encrypted. |audit, Audit, deny, Deny, disabled, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stream%20Analytics/CMK_Audit.json) |
|[Resource logs in Azure Stream Analytics should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff9be5368-9bf5-4b84-9e0a-7850da98bb46) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stream%20Analytics/AuditDiagnosticLog_Audit.json) |
|[Stream Analytics job should connect to trusted inputs and outputs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffe8684d6-3c5b-45c0-a08b-fa92653c2e1c) |Ensure that Stream Analytics jobs do not have arbitrary Input or Output connections that are not defined in the allow-list. This checks that Stream Analytics jobs don't exfiltrate data by connecting to arbitrary sinks outside your organization. |Deny, Disabled, Audit |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stream%20Analytics/DataExfiltration_Audit.json) |
|[Stream Analytics job should use managed identity to authenticate endpoints](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea6c4923-510a-4346-be26-1894919a5b97) |Ensure that Stream Analytics jobs only connect to endpoints using managed identity authentication. |Deny, Disabled, Audit |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stream%20Analytics/ManagedIdentity_Audit.json) |
