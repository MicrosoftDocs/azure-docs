---
title: Manage Backups with Azure role-based access control
description: Use Azure role-based access control to manage access to backup management operations in Recovery Services vault.
ms.reviewer: utraghuv
ms.topic: conceptual
ms.date: 03/09/2021
---

# Use Azure role-based access control to manage Azure Backup recovery points

Azure role-based access control (Azure RBAC) enables fine-grained access management for Azure. Using Azure RBAC, you can segregate duties within your team and grant only the amount of access to users that they need to perform their jobs.

> [!IMPORTANT]
> Roles provided by Azure Backup are limited to actions that can be performed in Azure portal or via REST API or Recovery Services vault PowerShell or CLI cmdlets. Actions performed in the Azure Backup agent client UI or System center Data Protection Manager UI or Azure Backup Server UI are out of control of these roles.

Azure Backup provides three built-in roles to control backup management operations. Learn more on [Azure built-in roles](../role-based-access-control/built-in-roles.md)

* [Backup Contributor](../role-based-access-control/built-in-roles.md#backup-contributor) - This role has all permissions to create and manage backup except deleting Recovery Services vault and giving access to others. Imagine this role as admin of backup management who can do every backup management operation.
* [Backup Operator](../role-based-access-control/built-in-roles.md#backup-operator) - This role has permissions to everything a contributor does except removing backup and managing backup policies. This role is equivalent to contributor except it can't perform destructive operations such as stop backup with delete data or remove registration of on-premises resources.
* [Backup Reader](../role-based-access-control/built-in-roles.md#backup-reader) - This role has permissions to view all backup management operations. Imagine this role to be a monitoring person.

If you're looking to define your own roles for even more control, see how to [build Custom roles](../role-based-access-control/custom-roles.md) in Azure RBAC.

## Mapping Backup built-in roles to backup management actions

### Minimum role requirements for Azure VM backup

The following table captures the Backup management actions and corresponding minimum Azure role required to perform that operation.

| Management Operation | Minimum Azure role required | Scope Required | Alternative |
| --- | --- | --- | --- |
| Create Recovery Services vault | Backup Contributor | Resource group containing the vault |   |
| Enable backup of Azure VMs | Backup Operator | Resource group containing the vault |   |
| | Virtual Machine Contributor | VM resource |  Alternatively, instead of a built-in-role, you can consider a custom role which has the following permissions: Microsoft.Compute/virtualMachines/write |
| On-demand backup of VM | Backup Operator | Recovery Services vault |   |
| Restore VM | Backup Operator | Recovery Services vault |   |
| | Contributor | Resource group in which VM will be deployed |   Alternatively, instead of a built-in-role, you can consider a custom role which has the following permissions:  Microsoft.Resources/subscriptions/resourceGroups/write Microsoft.DomainRegistration/domains/write, Microsoft.Compute/virtualMachines/write  Microsoft.Network/virtualNetworks/read Microsoft.Network/virtualNetworks/subnets/join/action |
| | Virtual Machine Contributor | Source VM that got backed up |   Alternatively, instead of a built-in-role, you can consider a custom role which has the following permissions: Microsoft.Compute/virtualMachines/write |
| Restore unmanaged disks VM backup | Backup Operator | Recovery Services vault |
| | Virtual Machine Contributor | Source VM that got backed up | Alternatively, instead of a built-in-role, you can consider a custom role which has the following permissions: Microsoft.Compute/virtualMachines/write |
| | Storage Account Contributor | Storage account resource where disks are going to be restored |   Alternatively, instead of a built-in-role, you can consider a custom role which has the following permissions: Microsoft.Storage/storageAccounts/write |
| Restore managed disks from VM backup | Backup Operator | Recovery Services vault |
| | Virtual Machine Contributor | Source VM that got backed up |    Alternatively, instead of a built-in-role, you can consider a custom role which has the following permissions: Microsoft.Compute/virtualMachines/write |
| | Storage Account Contributor | Temporary Storage account selected as part of restore to hold data from vault before converting them to managed disks |   Alternatively, instead of a built-in-role, you can consider a custom role which has the following permissions: Microsoft.Storage/storageAccounts/write |
| | Contributor | Resource group to which managed disk(s) will be restored | Alternatively, instead of a built-in-role, you can consider a custom role which has the following permissions: Microsoft.Resources/subscriptions/resourceGroups/write|
| Restore individual files from VM backup | Backup Operator | Recovery Services vault |
| | Virtual Machine Contributor | Source VM that got backed up | Alternatively, instead of a built-in-role, you can consider a custom role which has the following permissions: Microsoft.Compute/virtualMachines/write |
| Cross region restore | Backup Operator | Subscription of the recovery Services vault | This is in addition of the restore permissions mentioned above. Specifically for CRR, instead of a built-in-role, you can consider a custom role which has the following permissions:   "Microsoft.RecoveryServices/locations/backupAadProperties/read" "Microsoft.RecoveryServices/locations/backupCrrJobs/action"         "Microsoft.RecoveryServices/locations/backupCrrJob/action" "Microsoft.RecoveryServices/locations/backupCrossRegionRestore/action"          "Microsoft.RecoveryServices/locations/backupCrrOperationResults/read" "Microsoft.RecoveryServices/locations/backupCrrOperationsStatus/read" |
| Create backup policy for Azure VM backup | Backup Contributor | Recovery Services vault |
| Modify backup policy of Azure VM backup | Backup Contributor | Recovery Services vault |
| Delete backup policy of Azure VM backup | Backup Contributor | Recovery Services vault |
| Stop backup (with retain data or delete data) on VM backup | Backup Contributor | Recovery Services vault |
| Register on-premises Windows Server/client/SCDPM or Azure Backup Server | Backup Operator | Recovery Services vault |
| Delete registered on-premises Windows Server/client/SCDPM or Azure Backup Server | Backup Contributor | Recovery Services vault |

> [!IMPORTANT]
> If you specify VM Contributor at a VM resource scope and select **Backup** as part of VM settings, it will open the **Enable Backup** screen, even though the VM is already backed up. This is because the call to verify backup status works only at the subscription level. To avoid this, either go to the vault and open the backup item view of the VM or specify the VM Contributor role at a subscription level.

### Minimum role requirements for Azure workload backups (SQL and HANA DB backups)

The following table captures the Backup management actions and corresponding minimum Azure role required to perform that operation.

| Management Operation | Minimum Azure role required | Scope Required | Alternative |
| --- | --- | --- | --- |
| Create Recovery Services vault | Backup Contributor | Resource group containing the vault |   |
| Enable backup of SQL and/or HANA databases | Backup Operator | Resource group containing the vault |   |
| | Virtual Machine Contributor | VM resource where DB is installed |  Alternatively, instead of a built-in-role, you can consider a custom role which has the following permissions: Microsoft.Compute/virtualMachines/write |
| On-demand backup of DB | Backup Operator | Recovery Services vault |   |
| Restore database or Restore as files | Backup Operator | Recovery Services vault |   |
| | Virtual Machine Contributor | Source VM that got backed up |   Alternatively, instead of a built-in-role, you can consider a custom role which has the following permissions: Microsoft.Compute/virtualMachines/write |
| | Virtual Machine Contributor | Target VM in which DB will be restored or files are created |   Alternatively, instead of a built-in-role, you can consider a custom role which has the following permissions: Microsoft.Compute/virtualMachines/write |
| Create backup policy for Azure VM backup | Backup Contributor | Recovery Services vault |
| Modify backup policy of Azure VM backup | Backup Contributor | Recovery Services vault |
| Delete backup policy of Azure VM backup | Backup Contributor | Recovery Services vault |
| Stop backup (with retain data or delete data) on VM backup | Backup Contributor | Recovery Services vault |

### Minimum role requirements for the Azure File share backup

The following table captures the Backup management actions and corresponding role required to perform Azure File share operation.

| Management Operation | Role Required | Resources |
| --- | --- | --- |
| Enable backup of Azure File shares | Backup Contributor |Recovery Services vault |
| |Storage Account | Contributor Storage account resource |
| On-demand backup of VM | Backup Operator | Recovery Services vault |
| Restore File share | Backup Operator | Recovery Services vault |
| | Storage Account Contributor | Storage account resources where restore source and Target file shares are present |
| Restore Individual Files | Backup Operator | Recovery Services vault |
| |Storage Account Contributor|Storage account resources where restore source and Target file shares are present |
| Stop protection |Backup Contributor | Recovery Services vault |
| Unregister storage account from vault |Backup Contributor | Recovery Services vault |
| |Storage Account Contributor | Storage account resource|

## Next steps

* [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md): Get started with Azure RBAC in the Azure portal.
* Learn how to manage access with:
  * [PowerShell](../role-based-access-control/role-assignments-powershell.md)
  * [Azure CLI](../role-based-access-control/role-assignments-cli.md)
  * [REST API](../role-based-access-control/role-assignments-rest.md)
* [Azure role-based access control troubleshooting](../role-based-access-control/troubleshooting.md): Get suggestions for fixing common issues.
