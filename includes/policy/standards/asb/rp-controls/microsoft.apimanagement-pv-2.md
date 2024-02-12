---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 01/22/2024
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[API Management direct management endpoint should not be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb741306c-968e-4b67-b916-5675e5c709f4) |The direct management REST API in Azure API Management bypasses Azure Resource Manager role-based access control, authorization, and throttling mechanisms, thus increasing the vulnerability of your service. |Audit, Disabled, Deny |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_DirectManagementAPIEnabled_AuditDeny.json) |
|[API Management minimum API version should be set to 2019-12-01 or higher](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F549814b6-3212-4203-bdc8-1548d342fb67) |To prevent service secrets from being shared with read-only users, the minimum API version should be set to 2019-12-01 or higher. |Audit, Deny, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_MinimumApiVersion_AuditDeny.json) |
|[Azure API Management platform version should be stv2](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1dc2fc00-2245-4143-99f4-874c937f13ef) |Azure API Management stv1 compute platform version will be retired effective 31 August 2024, and these instances should be migrated to stv2 compute platform for continued support. Learn more at [https://learn.microsoft.com/azure/api-management/breaking-changes/stv1-platform-retirement-august-2024](../../../../../articles/api-management/breaking-changes/stv1-platform-retirement-august-2024.md) |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/API%20Management/ApiManagement_PlatformVersion_AuditDeny.json) |
