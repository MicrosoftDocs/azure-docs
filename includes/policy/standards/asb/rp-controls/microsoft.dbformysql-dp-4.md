---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 12/04/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[A Microsoft Entra administrator should be provisioned for MySQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F146412e9-005c-472b-9e48-c87b72ac229e) |Audit provisioning of a Microsoft Entra administrator for your MySQL server to enable Microsoft Entra authentication. Microsoft Entra authentication enables simplified permission management and centralized identity management of database users and other Microsoft services |AuditIfNotExists, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/MySQL_AuditServerADAdmins_Audit.json) |
|[Azure MySQL flexible server should have Microsoft Entra Only Authentication enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F40e85574-ef33-47e8-a854-7a65c7500560) |Disabling local authentication methods and allowing only Microsoft Entra Authentication improves security by ensuring that Azure MySQL flexible server can exclusively be accessed by Microsoft Entra identities. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/MySQL_FlexibleServers_ADOnlyEnabled_Audit.json) |
