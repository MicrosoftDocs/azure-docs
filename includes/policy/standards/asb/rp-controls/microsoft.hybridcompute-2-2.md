---
author: timwarner-msft
ms.service: azure-policy
ms.topic: include
ms.date: 03/10/2022
ms.author: timwarner
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit Windows machines on which the Log Analytics agent isn't connected as expected](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6265018c-d7e2-432f-a75d-094d5f6f4465) |Requires that prerequisites are deployed to the policy assignment scope. For details, visit [https://aka.ms/gcpol](../../../../../articles/governance/policy/concepts/guest-configuration.md). Machines are non-compliant if the agent isn't installed, or if it's installed but the COM object AgentConfigManager.MgmtSvcCfg returns that it's registered to a workspace other than the ID specified in the policy parameter. |auditIfNotExists |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_WindowsLogAnalyticsAgentConnection_AINE.json) |