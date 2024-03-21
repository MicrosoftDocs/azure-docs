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
|[Container registries should not allow unrestricted network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd0793b48-0edc-4296-a390-4c75d1bdfd71) |Azure container registries by default accept connections over the internet from hosts on any network. To protect your registries from potential threats, allow access from only specific private endpoints, public IP addresses or address ranges. If your registry doesn't have network rules configured, it will appear in the unhealthy resources. Learn more about Container Registry network rules here: [https://aka.ms/acr/privatelink,](https://aka.ms/acr/privatelink,) [https://aka.ms/acr/portal/public-network](https://aka.ms/acr/portal/public-network) and [https://aka.ms/acr/vnet](https://aka.ms/acr/vnet). |Audit, Deny, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Container%20Registry/ACR_NetworkRulesExist_AuditDeny.json) |
