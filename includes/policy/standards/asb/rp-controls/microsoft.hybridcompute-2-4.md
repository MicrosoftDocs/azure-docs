---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 09/04/2020
ms.author: dacoulte
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Deploy prerequisites to audit Windows VMs on which the Log Analytics agent is not connected as expected](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F68511db2-bd02-41c4-ae6b-1900a012968a) |This policy creates a Guest Configuration assignment to audit Windows virtual machines on which the Log Analytics agent is not connected to the specified workspaces. It also creates a system-assigned managed identity and deploys the VM extension for Guest Configuration. This policy should only be used along with its corresponding audit policy in an initiative. For more information on Guest Configuration policies, please visit [https://aka.ms/gcpol](https://aka.ms/gcpol) |deployIfNotExists |[1.2.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_WindowsLogAnalyticsAgentConnection_Deploy.json) |
|[Show audit results from Windows VMs on which the Log Analytics agent is not connected as expected](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa030a57e-4639-4e8f-ade9-a92f33afe7ee) |This policy should only be used along with its corresponding deploy policy in an initiative. This definition allows Azure Policy to process the results of auditing Windows virtual machines on which the Log Analytics agent is not connected to the specified workspaces. For more information on Guest Configuration policies, please visit [https://aka.ms/gcpol](https://aka.ms/gcpol) |auditIfNotExists |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_WindowsLogAnalyticsAgentConnection_Audit.json) |
