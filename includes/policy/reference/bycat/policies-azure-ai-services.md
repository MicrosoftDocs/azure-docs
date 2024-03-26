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
|[Azure AI Services resources should have key access disabled (disable local authentication)](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F71ef260a-8f18-47b7-abcb-62d0673d94dc) |Key access (local authentication) is recommended to be disabled for security. Azure OpenAI Studio, typically used in development/testing, requires key access and will not function if key access is disabled. After disabling, Microsoft Entra ID becomes the only access method, which allows maintaining minimum privilege principle and granular control. Learn more at: [https://aka.ms/AI/auth](https://aka.ms/AI/auth) |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Ai%20Services/DisableLocalAuth_Audit.json) |
|[Azure AI Services resources should restrict network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F037eea7a-bd0a-46c5-9a66-03aea78705d3) |By restricting network access, you can ensure that only allowed networks can access the service. This can be achieved by configuring network rules so that only applications from allowed networks can access the Azure AI service. |Audit, Deny, Disabled |[3.2.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Ai%20Services/NetworkAcls_Audit.json) |
|[Diagnostic logs in Azure AI services resources should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1b4d1c4e-934c-4703-944c-27c82c06bebb) |Enable logs for Azure AI services resources. This enables you to recreate activity trails for investigation purposes, when a security incident occurs or your network is compromised |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Ai%20Services/DiagnosticLogs_Audit.json) |
