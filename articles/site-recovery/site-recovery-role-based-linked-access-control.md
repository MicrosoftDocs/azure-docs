---
title: Manage Azure role-based access control in Azure Site Recovery
description: This article describes how to apply Azure role-based access control (Azure RBAC) to manage Azure Site Recovery access.
ms.service: azure-site-recovery
ms.date: 07/21/2025
author: Jeronika-MS
ms.topic: overview
ms.author: v-gajeronika

# Customer intent: As an IT administrator, I want to manage access permissions for Azure Site Recovery using role-based access control, so that I can ensure appropriate access levels for team members involved in disaster recovery operations.
---
# Manage Site Recovery access with Azure role-based access control (Azure RBAC)

Azure role-based access control (Azure RBAC) enables fine-grained access management for Azure. Using Azure RBAC, you can segregate responsibilities within your team and grant only specific access permissions to users as needed to perform specific jobs.

Azure Site Recovery provides 3 built-in roles to control Site Recovery management operations. Learn more on [Azure built-in roles](../role-based-access-control/built-in-roles.md)

* [Site Recovery Contributor](../role-based-access-control/built-in-roles.md#site-recovery-contributor) - This role has all permissions required to manage Azure Site Recovery operations in a Recovery Services vault. A user with this role, however, can't create or delete a Recovery Services vault or assign access rights to other users. This role is best suited for disaster recovery administrators who can enable and manage disaster recovery for applications or entire organizations, as the case may be.
* [Site Recovery Operator](../role-based-access-control/built-in-roles.md#site-recovery-operator) - This role has permissions to execute and manage Failover and Failback operations. A user with this role can't enable or disable replication, create or delete vaults, register new infrastructure or assign access rights to other users. This role is best suited for a disaster recovery operator who can failover virtual machines or applications when instructed by application owners and IT administrators in an actual or simulated disaster situation such as a DR drill. Post resolution of the disaster, the DR operator can re-protect and failback the virtual machines.
* [Site Recovery Reader](../role-based-access-control/built-in-roles.md#site-recovery-reader) - This role has permissions to view all Site Recovery management operations. This role is best suited for an IT monitoring executive who can monitor the current state of protection and raise support tickets if required.

If you're looking to define your own roles for even more control, see how to [build custom roles](../role-based-access-control/custom-roles.md) in Azure.

## Permissions required to perform replication and failover actions on virtual machines
When you replicate a virtual machine by using Azure Site Recovery or perform other actions such as failover, Azure Site Recovery validates your access levels. This validation ensures you have the required permissions to use the Azure resources provided to Site Recovery.

> [!IMPORTANT]
> Add the relevant permissions for the user for each Site Recovery action they're allowed to perform.

> [!NOTE]
> If you are enabling replication for an Azure VM and want to allow Site Recovery to manage updates, then while enabling replication you may also want to create a new Automation account in which case you would need permission to create an automation account in the same subscription as the vault as well.

| **Operation Type** | **Permissions required** | **Scope required** |
| --- | --- | --- |
| Enable Replication, Add disks for replication, Update replication, Failover, Test Failover | Microsoft.Compute/virtualMachines/read | Source VM, Target Resource Group |
|  | Microsoft.Compute/disks/read | Source VM, Target Resource Group |
|  | Microsoft.Compute/virtualMachineScaleSets/read | Target Virtual Machine Scale Set (VMSS) |
|  | Microsoft.Compute/proximityPlacementGroups/read | Target Proximity Placement Group (PPG) |
|  | Microsoft.Compute/capacityReservationGroups/read | Target Capacity reservation group |
|  | Microsoft.Compute/diskEncryptionSets/read | Source VM, Target Resource Group |
|  | Microsoft.Network/virtualNetworks/read | Target Virtual Network |
|  | Microsoft.Storage/storageAccounts/read | Cache Storage Account |
|  | Microsoft.Automation/automationAccounts/read | Azure Automation Account (only if using ASR managed Site Recovery extension updates) | 

Consider using the [built-in roles](../role-based-access-control/built-in-roles.md).

## Next steps

- [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/role-assignments-portal): Get started with Azure RBAC in the Azure portal.
- Learn how to manage access with:
    - [PowerShell](../role-based-access-control/role-assignments-powershell.md)
    - [Azure CLI](../role-based-access-control/role-assignments-cli.md)
    - [REST API](../role-based-access-control/role-assignments-rest.md)
- [Azure RBAC troubleshooting](../role-based-access-control/troubleshooting.md): Get suggestions for fixing common issues.
