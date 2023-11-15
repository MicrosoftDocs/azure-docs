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
|[\[Preview\]: Cosmos Database Accounts should be Zone Redundant](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F44c5a1f9-7ef6-4c38-880c-273e8f7a3c24) |Cosmos Database Accounts can be configured to be Zone Redundant or not. If the 'enableMultipleWriteLocations' is set to 'true' then all locations must have a 'isZoneRedundant' property and it must be set to 'true'. If the 'enableMultipleWriteLocations' is set to 'false' then the primary location ('failoverPriority' set to 0) must have a 'isZoneRedundant' property and it must be set to 'true'. Enforcing this policy ensures Cosmos Database Accounts are appropriately configured for zone redundancy. |Audit, Deny, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Resilience/DocumentDB_databaseAccounts_ZoneRedundant_Audit.json) |
|[\[Preview\]: Virtual Machine Scale Sets should be Zone Resilient](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd3903bdf-ab85-4cce-85d3-2934d77629d4) |Virtual Machine Scale Sets can be configured to be either Zone Aligned, Zone Redundant, or neither. Virtual Machine Scale Sets that have exactly one entry in their zones array are considered Zone Aligned. In contrast, Virtual Machine Scale Sets with 3 or more entries in their zones array and a capacity of at least 3 are recognized as Zone Redundant. This policy helps identify and enforce these resilience configurations. |Audit, Deny, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Resilience/Compute_virtualMachineScaleSets_ZoneResilient_Audit.json) |
|[\[Preview\]: Virtual Machines should be Zone Aligned](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F42f4f3a2-7d20-4c13-a05d-01857a626c22) |Virtual Machines can be configured to be Zone Aligned or not. They are considered Zone Aligned if they have only one entry in their zones array. This policy ensures that they are configured to operate within a single availability zone. |Audit, Deny, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Resilience/Compute_virtualMachines_ZoneAligned_Audit.json) |
