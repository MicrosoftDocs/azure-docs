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
|[Cosmos DB database accounts should have local authentication methods disabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5450f5bd-9c72-4390-a9c4-a7aba4edfdd2) |Disabling local authentication methods improves security by ensuring that Cosmos DB database accounts exclusively require Azure Active Directory identities for authentication. Learn more at: [https://docs.microsoft.com/azure/cosmos-db/how-to-setup-rbac#disable-local-auth](../../../../../articles/cosmos-db/how-to-setup-rbac.md#disable-local-auth). |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Cosmos%20DB/Cosmos_DisableLocalAuth_AuditDeny.json) |
