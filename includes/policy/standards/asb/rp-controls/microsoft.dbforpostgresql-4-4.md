---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 09/04/2020
ms.author: dacoulte
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enforce SSL connection should be enabled for PostgreSQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd158790f-bfb0-486c-8631-2dc6b4e8e6af) |This policy audits any PostgreSQL server that is not enforcing SSL connection. Azure Database for PostgreSQL prefers connecting your client applications to the PostgreSQL service using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against 'man-in-the-middle' attacks by encrypting the data stream between the server and your application |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableSSL_Audit.json) |
