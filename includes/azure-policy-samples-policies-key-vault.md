---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 02/10/2020
ms.author: dacoulte
---

|Name |Description |Effect(s) |Version |
|---|---|---|---|
|[Deploy Diagnostic Settings for Key Vault to Event Hub](https://github.com/Azure/azure-policy/blob/masterbuilt-in-policies/policyDefinitions/Key%20Vault/KeyVault_DiagnosticLog_Deploy.json) |Deploys the diagnostic settings for Key Vault to stream to a regional Event Hub when any Key Vault which is missing this diagnostic settings is created or updated. |deployIfNotExists |1.0.0 |
|[Diagnostic logs in Key Vault should be enabled](https://github.com/Azure/azure-policy/blob/masterbuilt-in-policies/policyDefinitions/Key%20Vault/KeyVault_AuditDiagnosticLog_Audit.json) |Audit enabling of diagnostic logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |1.0.0 |
|[Key Vault objects should be recoverable](https://github.com/Azure/azure-policy/blob/masterbuilt-in-policies/policyDefinitions/Key%20Vault/KeyVault_Recoverable_Audit.json) |This policy audits if key vault objects are not recoverable. Soft Delete feature helps to effectively hold the resources for a given retention period (90 days) even after a DELETE operation, while giving the appearance that the object is deleted. When 'Purge protection' is on, a vault or an object in deleted state cannot be purged until the retention period of 90 days has passed. These vaults and objects can still be recovered, assuring customers that the retention policy will be followed. |Audit, Disabled |1.0.0 |
