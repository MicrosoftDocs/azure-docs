---
title: Azure role-based access control (Azure RBAC) vs. access policies
description: A comparison of Azure role-based access control (Azure RBAC) and access policies
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: general
ms.topic: how-to
ms.date: 05/08/2023
ms.author: mbaldwin
ms.custom: "devx-track-azurepowershell, devx-track-azurecli"
---
# Azure role-based access control (Azure RBAC) vs. access policies

Azure Key Vault offers two authorization systems:
- **Azure role-based access control (Azure RBAC)** is built on [Azure Resource Manager](../../azure-resource-manager/management/overview.md) and provides fine-grained access management of Azure resources. With Azure RBAC you control access to resources by creating role assignments, which consist of three elements: a security principal, a role definition (predefined set of permissions), and a scope (group of resources or individual resource). For more information, see [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).
- The **access policy model** is an existing authorization system built in Key Vault to provide access to keys, secrets, and certificates. You can control access by assigning individual permissions to security principals (user, group, service principal, managed identity) at Key Vault scope.

Azure RBAC is the default and recommended authorization system for Azure Key Vault. It offers several advantages over vault access policies:
- Unified access control model for Azure resources by using the same API across Azure services
- Centralized access management for administrators - manage all Azure resources in one view
- Integration with [Privileged Identity Management](../../active-directory/privileged-identity-management/pim-configure.md) for time-based access control
- Deny assignments - ability to exclude security principals at a particular scope. For information, see [Understand Azure Deny Assignments](../../role-based-access-control/deny-assignments.md)

However, it has two disadvantages when compared to access policies:
- Latency. It can take several minutes for role assignments to be applied. Vault access policies are assigned instantly.
- Limited number of role assignments. Azure RBAC allows only 2000 roles assignments across all services per subscription versus 1024 access policies per Key Vault

To transition your key vaults from access policies to RBAC, see [Migrate from vault access policy to an Azure role-based access control permission model](rbac-migration.md).

## Learn more

- [Azure RBAC Overview](../../role-based-access-control/overview.md)
- [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md)
- [Migrating from an access policy to RBAC](../../role-based-access-control/tutorial-custom-role-cli.md)
- [Azure Key Vault best practices](best-practices.md)
