---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 11/06/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Cache for Redis should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7803067c-7d34-46e3-8c79-0ca68fc4036d) |Private endpoints lets you connect your virtual network to Azure services without a public IP address at the source or destination. By mapping private endpoints to your Azure Cache for Redis instances, data leakage risks are reduced. Learn more at: [https://docs.microsoft.com/azure/azure-cache-for-redis/cache-private-link](../../../../../articles/azure-cache-for-redis/cache-private-link.md). |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Cache/RedisCache_PrivateEndpoint_AuditIfNotExists.json) |
