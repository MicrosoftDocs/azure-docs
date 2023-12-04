---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 11/15/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Lab Services should enable all options for auto shutdown](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6e9cf2d-7d76-440e-b795-8da246bd3aab) |This policy provides helps with cost management by enforcing all automatic shutdown options are enabled for a lab. |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Lab%20Services/LabServicesEnforceAutoShutdown.json) |
|[Lab Services should not allow template virtual machines for labs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe8a5a3eb-1ab6-4657-a701-7ae432cf14e1) |This policy prevents creation and customization of a template virtual machines for labs managed through Lab Services. |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Lab%20Services/LabServicesTemplateLabsNotAllowed.json) |
|[Lab Services should require non-admin user for labs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0fd9915e-cab3-4f24-b200-6e20e1aa276a) |This policy requires non-admin user accounts to be created for the labs managed through lab-services. |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Lab%20Services/LabServicesRequireNonAdminUser.json) |
|[Lab Services should restrict allowed virtual machine SKU sizes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3e13d504-9083-4912-b935-39a085db2249) |This policy enables you to restrict certain Compute VM SKUs for labs managed through Lab Services. This will restrict certain virtual machine sizes. |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Lab%20Services/LabServicesListAllowedSkuNames.json) |
