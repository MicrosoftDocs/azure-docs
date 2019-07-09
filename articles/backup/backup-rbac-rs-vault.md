---
title: Manage Backups with Azure Role-Based Access Control'
description: Use Role-based Access Control to manage access to backup management operations in Recovery Services vault.
services: backup
author: utraghuv
manager: vijayts
ms.service: backup
ms.topic: conceptual
ms.date: 06/24/2019
ms.author: utraghuv
---

# Use Role-Based Access Control to manage Azure Backup recovery points
Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure. Using RBAC, you can segregate duties within your team and grant only the amount of access to users that they need to perform their jobs.

> [!IMPORTANT]
> Roles provided by Azure Backup are limited to actions that can be performed in Azure portal or via REST API or Recovery Services vault PowerShell or CLI cmdlets. Actions performed in Azure backup Agent Client UI or System center Data Protection Manager UI or Azure Backup Server UI are out of control of these roles.

Azure Backup provides three built-in roles to control backup management operations. Learn more on [Azure RBAC built-in roles](../role-based-access-control/built-in-roles.md)

* [Backup Contributor](../role-based-access-control/built-in-roles.md#backup-contributor) - This role has all permissions to create and manage backup except deleting Recovery Services vault and giving access to others. Imagine this role as admin of backup management who can do every backup management operation.
* [Backup Operator](../role-based-access-control/built-in-roles.md#backup-operator) - This role has permissions to everything a contributor does except removing backup and managing backup policies. This role is equivalent to contributor except it can't perform destructive operations such as stop backup with delete data or remove registration of on-premises resources.
* [Backup Reader](../role-based-access-control/built-in-roles.md#backup-reader) - This role has permissions to view all backup management operations. Imagine this role to be a monitoring person.

If you're looking to define your own roles for even more control, see how to [build Custom roles](../role-based-access-control/custom-roles.md) in Azure RBAC.



## Mapping Backup built-in roles to backup management actions
The following table captures the Backup management actions and corresponding minimum RBAC role required to perform that operation.

| Management Operation | Minimum RBAC role required | Scope Required |
| --- | --- | --- |
| Create Recovery Services vault | Backup Contributor | Resource group containing the vault |
| Enable backup of Azure VMs | Backup Operator | Resource group containing the vault |
| | Virtual Machine Contributor | VM resource |
| On-demand backup of VM | Backup Operator | Recovery vault resource |
| Restore VM | Backup Operator | Recovery Services vault |
| | Contributor | Resource group in which VM will be deployed |
| | Virtual Machine Contributor | Source VM which got backed up |
| Restore unmanaged disks VM backup | Backup Operator | Recovery vault resource |
| | Virtual Machine Contributor | Source VM which got backed up |
| | Storage Account Contributor | Storage account resource where disks are going to be restored |
| Restore managed disks from VM backup | Backup Operator | Recovery vault resource |
| | Virtual Machine Contributor | Source VM which got backed up |
| | Storage Account Contributor | Temporary Storage account selected as part of restore to hold data from vault before converting them to managed disks |
| | Contributor | Resource group to which managed disk(s) will be restored |
| Restore individual files from VM backup | Backup Operator | Recovery vault resource |
| | Virtual Machine Contributor | Source VM which got backed up |
| Create backup policy for Azure VM backup | Backup Contributor | Recovery vault resource |
| Modify backup policy of Azure VM backup | Backup Contributor | Recovery vault resource |
| Delete backup policy of Azure VM backup | Backup Contributor | Recovery vault resource |
| Stop backup (with retain data or delete data) on VM backup | Backup Contributor | Recovery vault resource |
| Register on-premises Windows Server/client/SCDPM or Azure Backup Server | Backup Operator | Recovery vault resource |
| Delete registered on-premises Windows Server/client/SCDPM or Azure Backup Server | Backup Contributor | Recovery vault resource |

> [!IMPORTANT]
> If you specify VM Contributor at a VM resource scope and click on Backup as part of VM settings, it will open 'Enable Backup' screen even though VM is already backed up as the call to verify backup status works only at subscription level. To avoid this, either go to vault and open the backup item view of the VM or specify VM Contributor role at a subscription level.

## Minimum role requirements for the Azure File share backup
The following table captures the Backup management actions and corresponding role required to perform Azure File share operation.

| Management Operation | Role Required | Resources |
| --- | --- | --- |
| Enable backup of Azure File shares | Backup Contributor |	Recovery Services vault |
| |	Storage Account | Contributor	Storage account resource |
| On-demand backup of VM | Backup Operator | Recovery Services vault |
| Restore File share | Backup Operator | Recovery Services vault |
| | Storage Account Contributor | Storage account resources where restore source and Target file shares are present |
| Restore Individual Files | Backup Operator | Recovery Services vault |
| |	Storage Account Contributor	|	Storage account resources where restore source and Target file shares are present |
| Stop protection |	Backup Contributor | Recovery Services vault |		
| Unregister storage account from vault |	Backup Contributor | Recovery Services vault |
| |	Storage Account Contributor | Storage account resource|


## Next steps
* [Role Based Access Control](../role-based-access-control/role-assignments-portal.md): Get started with RBAC in the Azure portal.
* Learn how to manage access with:
  * [PowerShell](../role-based-access-control/role-assignments-powershell.md)
  * [Azure CLI](../role-based-access-control/role-assignments-cli.md)
  * [REST API](../role-based-access-control/role-assignments-rest.md)
* [Role-Based Access Control troubleshooting](../role-based-access-control/troubleshooting.md): Get suggestions for fixing common issues.
