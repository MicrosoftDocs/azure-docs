---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 04/24/2020
ms.author: dacoulte
ms.custom: generated
---

|Name |Description |Policies |Version |
|---|---|---|---|
|[Geo-redundant backup should be enabled for Azure Database for MariaDB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0ec47710-77ff-4a3d-9181-6aa50af424d0) |This policy audits any Azure Database for MariaDB with geo-redundant backup not enabled. |Audit, Disabled |1.0.0 |[Link](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/GeoRedundant_DBForMariaDB_Audit.json)
|[MariaDB server should use a virtual network service endpoint](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdfbd9a64-6114-48de-a47d-90574dc2e489) |This policy helps audit any MariaDB server not configured to use a virtual network service endpoint. |AuditIfNotExists, Disabled |1.0.0 |[Link](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/MariaDB_VirtualNetworkServiceEndpoint_Audit.json)
|[Private endpoint should be enabled for MariaDB servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0a1302fb-a631-4106-9753-f3d494733990) |This policy helps audit any MariaDB server not configured to use a private endpoint. |AuditIfNotExists, Disabled |1.0.0 |[Link](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/MariaDB_EnablePrivateEndPoint_Audit.json)
