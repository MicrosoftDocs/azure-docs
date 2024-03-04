---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 08/08/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Add user-assigned managed identity to enable Guest Configuration assignments on virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff40c7c00-b4e3-4068-a315-5fe81347a904) |This policy adds a user-assigned managed identity to virtual machines hosted in Azure that are supported by Guest Configuration. A user-assigned managed identity is a prerequisite for all Guest Configuration assignments and must be added to machines before using any Guest Configuration policy definitions. For more information on Guest Configuration, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). |AuditIfNotExists, DeployIfNotExists, Disabled |[2.0.1-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_AddUserIdentity_Prerequisite.json) |
|[\[Preview\]: Assign Built-In User-Assigned Managed Identity to Virtual Machine Scale Sets](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F516187d4-ef64-4a1b-ad6b-a7348502976c) |Create and assign a built-in user-assigned managed identity or assign a pre-created user-assigned managed identity at scale to virtual machine scale sets. For more detailed documentation, visit aka.ms/managedidentitypolicy. |AuditIfNotExists, DeployIfNotExists, Disabled |[1.0.5-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Managed%20Identity/ManagedIdentity_VMSS_UAI_DeployIfNotExists.json) |
|[\[Preview\]: Assign Built-In User-Assigned Managed Identity to Virtual Machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd367bd60-64ca-4364-98ea-276775bddd94) |Create and assign a built-in user-assigned managed identity or assign a pre-created user-assigned managed identity at scale to virtual machines. For more detailed documentation, visit aka.ms/managedidentitypolicy. |AuditIfNotExists, DeployIfNotExists, Disabled |[1.0.5-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Managed%20Identity/ManagedIdentity_VM_UAI_DeployIfNotExists.json) |
