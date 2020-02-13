---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 02/12/2020
ms.author: dacoulte
---

|Name |Description |Effect(s) |Version |
|---|---|---|---|
|[Allowed locations](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/AllowedLocations_Deny.json) |This policy enables you to restrict the locations your organization can specify when deploying resources. Use to enforce your geo-compliance requirements. Excludes resource groups, Microsoft.AzureActiveDirectory/b2cDirectories, and resources that use the 'global' region. |deny |1.0.0 |
|[Allowed locations for resource groups](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/ResourceGroupAllowedLocations_Deny.json) |This policy enables you to restrict the locations your organization can create resource groups in. Use to enforce your geo-compliance requirements. |deny |1.0.0 |
|[Allowed resource types](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/AllowedResourceTypes_Deny.json) |This policy enables you to specify the resource types that your organization can deploy. Only resource types that support 'tags' and 'location' will be affected by this policy. To restrict all resources please duplicate this policy and change the 'mode' to 'All'. |deny |1.0.0 |
|[Audit resource location matches resource group location](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/ResourcesInResourceGroupLocation_Audit.json) |Audit that the resource location matches its resource group location |audit |1.0.0 |
|[Audit usage of custom RBAC rules](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/Subscription_AuditCustomRBACRoles_Audit.json) |Audit built-in roles such as 'Owner, Contributer, Reader' instead of custom RBAC roles, which are error prone. Using custom roles is treated as an exception and requires a rigorous review and threat modeling |Audit, Disabled |1.0.0 |
|[Custom subscription owner roles should not exist](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/CustomSubscription_OwnerRole_Audit.json) |This policy ensures that no custom subscription owner roles exist. |Audit, Disabled |1.0.0 |
|[Not allowed resource types](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/InvalidResourceTypes_Deny.json) |This policy enables you to specify the resource types that your organization cannot deploy. |Deny |1.0.0 |
