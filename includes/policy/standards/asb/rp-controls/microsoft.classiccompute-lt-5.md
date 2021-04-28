---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 04/21/2021
ms.author: dacoulte
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Log Analytics agent health issues should be resolved on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd62cfe2b-3ab0-4d41-980d-76803b58ca65) |Security Center uses the Log Analytics agent, formerly known as the Microsoft Monitoring Agent (MMA). To make sure your virtual machines are successfully monitored, you need to make sure the agent is installed on the virtual machines and properly collects security events to the configured workspace. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_ResolveLaHealthIssues.json) |
|[Log Analytics agent should be installed on your virtual machine for Azure Security Center monitoring](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa4fe33eb-e377-4efb-ab31-0784311bc499) |This policy audits any Windows/Linux virtual machines (VMs) if the Log Analytics agent is not installed which Security Center uses to monitor for security vulnerabilities and threats |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_InstallLaAgentOnVm.json) |
