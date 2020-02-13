---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 02/12/2020
ms.author: dacoulte
---

|Name |Description |Effect(s) |Version |
|---|---|---|---|
|[Diagnostic logs in Batch accounts should be enabled](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Batch/Batch_AuditDiagnosticLog_Audit.json) |Audit enabling of diagnostic logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |2.0.0 |
|[Metric alert rules should be configured on Batch accounts](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Batch/Batch_AuditMetricAlerts_Audit.json) |Audit configuration of metric alert rules on Batch account to enable the required metric |AuditIfNotExists, Disabled |1.0.0 |
