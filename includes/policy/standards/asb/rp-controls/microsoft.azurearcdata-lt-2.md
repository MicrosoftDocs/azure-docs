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
|[Microsoft Defender for SQL status should be protected for Arc-enabled SQL Servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F938c4981-c2c9-4168-9cd6-972b8675f906) |Microsoft Defender for SQL provides functionality for surfacing and mitigating potential database vulnerabilities, detecting anomalous activities that could indicate threats to SQL databases, discovering and classifying sensitive data. Once enabled, the protection status indicates that the resource is actively monitored. Even when Defender is enabled, multiple configuration settings should be validated on the agent, machine, workspace and SQL server to ensure active protection. |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_ProtectDefenderForSQLOnArc_Audit.json) |
