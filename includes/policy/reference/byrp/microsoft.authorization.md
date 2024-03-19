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
|[Audit usage of custom RBAC roles](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa451c1ef-c6ca-483d-87ed-f49761e3ffb5) |Audit built-in roles such as 'Owner, Contributer, Reader' instead of custom RBAC roles, which are error prone. Using custom roles is treated as an exception and requires a rigorous review and threat modeling |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/Subscription_AuditCustomRBACRoles_Audit.json) |
|[Exclude Usage Costs Resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F16fabb5c-7379-4433-8009-042066fa3a16) |This policy enables you to exlcude Usage Costs Resources. Usage costs include things like metered storage and Azure resources which are billed based on usage. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/ExcludeUsageCosts_Deny.json) |
|[SQL server-targeted autoprovisioning should be enabled for SQL servers on machines plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc6283572-73bb-4deb-bf2c-7a2b8f7462cb) |To ensure your SQL VMs and Arc-enabled SQL Servers are protected, ensure the SQL-targeted Azure Monitoring Agent is configured to automatically deploy. This is also necessary if you've previously configured autoprovisioning of the Microsoft Monitoring Agent, as that component is being deprecated. Learn more: [https://aka.ms/SQLAMAMigration](https://aka.ms/SQLAMAMigration) |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/MDC_DFSQL_AMA_Migration_Audit.json) |
