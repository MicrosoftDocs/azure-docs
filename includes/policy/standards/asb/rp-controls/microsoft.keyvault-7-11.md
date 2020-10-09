---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 10/07/2020
ms.author: dacoulte
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Key Vault objects should be recoverable](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0b60c0b2-2dc2-4e1c-b5c9-abbed971de53) |This policy audits if key vault objects are not recoverable. Soft Delete feature helps to effectively hold the resources for a given retention period (90 days) even after a DELETE operation, while giving the appearance that the object is deleted. When 'Purge protection' is on, a vault or an object in deleted state cannot be purged until the retention period of 90 days has passed. These vaults and objects can still be recovered, assuring customers that the retention policy will be followed. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/KeyVault_Recoverable_Audit.json) |
