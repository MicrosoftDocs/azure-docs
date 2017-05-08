---
title: 'Manage Backups with Azure Role-Based Access Control | Microsoft Docs'
description: Use Role-based Access Control to manage access to backup management operations in Recovery Services vault.
services: backup
documentationcenter: ''
author: trinadhk
manager: shreeshd
editor: ''

ms.assetid: 3bd46b97-4b29-47a5-b5ac-ac174dd36760
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 2/10/2017
ms.author: trinadhk;markgal

---

# Use Role-Based Access Control to manage Azure Backup recovery points
Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure. Using RBAC, you can segregate duties within your team and grant only the amount of access to users that they need to perform their jobs.

> [!IMPORTANT]
> Roles provided by Azure Backup are limited to actions that can be performed in Azure portal or Recovery Services vault PowerShell cmdlets. Actions performed in Azure backup Agent Client UI or System center Data Protection Manager UI or Azure Backup Server UI are out of control of these roles.

Azure Backup provides 3 built-in roles to control backup management operations. Learn more on [Azure RBAC built-in roles](../active-directory/role-based-access-built-in-roles.md)

* [Backup Contributor](../active-directory/role-based-access-built-in-roles.md#backup-contributor) - This role has all permissions to create and manage backup except creating Recovery Services vault and giving access to others. Imagine this role as admin of backup management who can do every backup management operation.
* [Backup Operator](../active-directory/role-based-access-built-in-roles.md#backup-operator) - This role has permissions to everything a contributor does except removing backup and managing backup policies. This role is equivalent to contributor except it can't perform destructive operations such as stop backup with delete data or remove registration of on-premises resources.
* [Backup Reader](../active-directory/role-based-access-built-in-roles.md#backup-reader) - This role has permissions to view all backup management operations. Imagine this role to be a monitoring person.

If you're looking to define your own roles for even more control, see how to [build Custom roles](../active-directory/role-based-access-control-custom-roles.md) in Azure RBAC.



## Mapping Backup built-in roles to backup management actions
The following table captures the Backup management actions and corresponding minimum RBAC role required to perform that operation.

| Management Operation | Minimum RBAC role required |
| --- | --- |
| Create Recovery Services vault | Contributor on Resource group of vault |
| Enable backup of Azure VMs | Backup Operator on vault, Virtual machine contributor on VMs |
| On-demand backup of VM | Backup operator |
| Restore VM | Backup operator, Resource group contributor i|n which VM and Vnets are going to get deployed |
| Restore disks, individual files from VM backup | Backup operator |
| Create backup policy for Azure VM backup | Backup contributor |
| Modify backup policy of Azure VM backup | Backup contributor |
| Delete backup policy of Azure VM backup | Backup contributor |
| Stop backup (with retain data or delete data) on VM backup | Backup contributor |
| Register on-premises Windows Server/client/SCDPM or Azure Backup Server | Backup operator |
| Delete registered on-premises Windows Server/client/SCDPM or Azure Backup Server | Backup contributor |

## Next steps
* [Role Based Access Control](../active-directory/role-based-access-control-configure.md): Get started with RBAC in the Azure portal.
* Learn how to manage access with:
  * [PowerShell](../active-directory/role-based-access-control-manage-access-powershell.md)
  * [Azure CLI](../active-directory/role-based-access-control-manage-access-azure-cli.md)
  * [REST API](../active-directory/role-based-access-control-manage-access-rest.md)
* [Role-Based Access Control troubleshooting](../active-directory/role-based-access-control-troubleshooting.md): Get suggestions for fixing common issues.
