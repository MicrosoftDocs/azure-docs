---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 08/03/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Log Analytics extension should be installed on your Linux Azure Arc machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F842c54e8-c2f9-4d79-ae8d-38d8b8019373) |This policy audits Linux Azure Arc machines if the Log Analytics extension is not installed. |AuditIfNotExists, Disabled |[1.0.1-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/Arc_Linux_LogAnalytics_Audit.json) |
|[\[Preview\]: Log Analytics extension should be installed on your Windows Azure Arc machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd69b1763-b96d-40b8-a2d9-ca31e9fd0d3e) |This policy audits Windows Azure Arc machines if the Log Analytics extension is not installed. |AuditIfNotExists, Disabled |[1.0.1-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/Arc_Windows_LogAnalytics_Audit.json) |
|[Linux machines should have Log Analytics agent installed on Azure Arc](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1e7fed80-8321-4605-b42c-65fc300f23a3) |Machines are non-compliant if Log Analytics agent is not installed on Azure Arc enabled Linux server. |AuditIfNotExists, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_LinuxLogAnalyticsAgentInstalled_AINE.json) |
|[Windows machines should have Log Analytics agent installed on Azure Arc](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4078e558-bda6-41fb-9b3c-361e8875200d) |Machines are non-compliant if Log Analytics agent is not installed on Azure Arc enabled windows server. |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_WindowsLogAnalyticsAgentInstalled_AINE.json) |
