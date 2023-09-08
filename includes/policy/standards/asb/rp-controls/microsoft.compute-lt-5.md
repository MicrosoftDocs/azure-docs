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
|[Log Analytics agent should be installed on your virtual machine for Azure Security Center monitoring](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa4fe33eb-e377-4efb-ab31-0784311bc499) |This policy audits any Windows/Linux virtual machines (VMs) if the Log Analytics agent is not installed which Security Center uses to monitor for security vulnerabilities and threats |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_InstallLaAgentOnVm.json) |
|[Log Analytics agent should be installed on your virtual machine scale sets for Azure Security Center monitoring](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa3a6ea0c-e018-4933-9ef0-5aaa1501449b) |Security Center collects data from your Azure virtual machines (VMs) to monitor for security vulnerabilities and threats. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_InstallLaAgentOnVmss.json) |
