---
author: georgewallace
ms.service: azure-policy
ms.topic: include
ms.date: 01/18/2022
ms.author: gwallace
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit Windows machines that do not have the specified Windows PowerShell execution policy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc648fbbb-591c-4acd-b465-ce9b176ca173) |Requires that prerequisites are deployed to the policy assignment scope. For details, visit [https://aka.ms/gcpol](../../../../articles/governance/policy/concepts/guest-configuration.md). Machines are non-compliant if  the Windows PowerShell command Get-ExecutionPolicy returns a value other than what was selected in the policy parameter. |AuditIfNotExists, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_WindowsPowerShellExecutionPolicy_AINE.json) |