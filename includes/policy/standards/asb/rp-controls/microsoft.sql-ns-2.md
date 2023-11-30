---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 11/21/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure SQL Managed Instances should disable public network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9dfea752-dd46-4766-aed1-c355fa93fb91) |Disabling public network access (public endpoint) on Azure SQL Managed Instances improves security by ensuring that they can only be accessed from inside their virtual networks or via Private Endpoints. To learn more about public network access, visit [https://aka.ms/mi-public-endpoint](https://aka.ms/mi-public-endpoint). |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlManagedInstance_PublicEndpoint_Audit.json) |
|[Private endpoint connections on Azure SQL Database should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7698e800-9299-47a6-b3b6-5a0fee576eed) |Private endpoint connections enforce secure communication by enabling private connectivity to Azure SQL Database. |Audit, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServer_PrivateEndpoint_Audit.json) |
|[Public network access on Azure SQL Database should be disabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1b8ca024-1d5c-4dec-8995-b1a932b41780) |Disabling the public network access property improves security by ensuring your Azure SQL Database can only be accessed from a private endpoint. This configuration denies all logins that match IP or virtual network based firewall rules. |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServer_PublicNetworkAccess_Audit.json) |
