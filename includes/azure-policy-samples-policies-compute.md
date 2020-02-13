---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 02/12/2020
ms.author: dacoulte
---

|Name |Description |Effect(s) |Version |
|---|---|---|---|
|[Allowed virtual machine SKUs](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMSkusAllowed_Deny.json) |This policy enables you to specify a set of virtual machine SKUs that your organization can deploy. |Deny |1.0.0 |
|[Audit virtual machines without disaster recovery configured](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/RecoveryServices_DisasterRecovery_Audit.json) |Audit virtual machines which do not have disaster recovery configured. To learn more about disaster recovery, visit https://aka.ms/asr-doc. |auditIfNotExists |1.0.0 |
|[Audit VMs that do not use managed disks](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMRequireManagedDisk_Audit.json) |This policy audits VMs that do not use managed disks |audit |1.0.0 |
|[Deploy default Microsoft IaaSAntimalware extension for Windows Server](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMAntimalwareExtension_Deploy.json) |This policy deploys a Microsoft IaaSAntimalware extension with a default configuration when a VM is not configured with the antimalware extension. |deployIfNotExists |1.0.0 |
|[Diagnostic logs in Virtual Machine Scale Sets should be enabled](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/ServiceFabric_and_VMSS_AuditVMSSDiagnostics.json) |It is recommended to enable Logs so that activity trail can be recreated when investigations are required in the event of an incident or a compromise. |AuditIfNotExists, Disabled |1.0.0 |
|[Microsoft Antimalware for Azure should be configured to automatically update protection signatures](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VirtualMachines_AntiMalwareAutoUpdate_AuditIfNotExists.json) |This policy audits any Windows virtual machine not configured with automatic update of Microsoft Antimalware protection signatures. |AuditIfNotExists, Disabled |1.0.0 |
|[Microsoft IaaSAntimalware extension should be deployed on Windows servers](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/WindowsServers_AntiMalware_AuditIfNotExists.json) |This policy audits any Windows server VM without Microsoft IaaSAntimalware extension deployed. |AuditIfNotExists, Disabled |1.0.0 |
|[Only approved VM extensions should be installed](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VirtualMachines_ApprovedExtensions_Audit.json) |This policy governs the virtual machine extensions that are not approved. |Audit, Deny, Disabled |1.0.0 |
|[Require automatic OS image patching on Virtual Machine Scale Sets](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMSSOSUpgradeHealthCheck_Deny.json) |This policy enforces enabling automatic OS image patching on Virtual Machine Scale Sets to always keep Virtual Machines secure by safely applying latest security patches every month. |deny |1.0.0 |
|[Unattached disks should be encrypted](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/UnattachedDisk_Encryption_Audit.json) |This policy audits any unattached disk without encryption enabled. |Audit, Disabled |1.0.0 |
|[Virtual machines should be migrated to new Azure Resource Manager resources](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/ClassicCompute_Audit.json) |Use new Azure Resource Manager for your virtual machines to provide security enhancements such as: stronger access control (RBAC), better auditing, ARM-based deployment and governance, access to managed identities, access to key vault for secrets, Azure AD-based authentication and support for tags and resource groups for easier security management |Audit, Deny, Disabled |1.0.0 |
