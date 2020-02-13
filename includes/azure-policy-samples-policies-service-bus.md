---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 02/12/2020
ms.author: dacoulte
---

|Name |Description |Effect(s) |Version |
|---|---|---|---|
|[All authorization rules except RootManageSharedAccessKey should be removed from Service Bus namespace](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Service%20Bus/ServiceBus_AuditNamespaceAccessRules_Audit.json) |Service Bus clients should not use a namespace level access policy that provides access to all queues and topics in a namespace. To align with the least privilege security model, you should create access policies at the entity level for queues and topics to provide access to only the specific entity |Audit, Deny, Disabled |1.0.1 |
|[Diagnostic logs in Service Bus should be enabled](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Service%20Bus/ServiceBus_AuditDiagnosticLog_Audit.json) |Audit enabling of diagnostic logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |2.0.0 |
