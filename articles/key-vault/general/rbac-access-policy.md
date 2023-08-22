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
ms.custom:
---
# Azure role-based access control (Azure RBAC) vs. access policies (legacy)

Azure Key Vault offers two authorization systems: **Azure role-based access control (Azure RBAC)**, which operates on the management plane and data plane, and the legacy **access policy model**, which operates on the data plane only.

Azure RBAC is built on [Azure Resource Manager](../../azure-resource-manager/management/overview.md) and provides fine-grained access management of Azure resources with Priviliged Identity Management (PIM) integration. With Azure RBAC you control access to resources by creating role assignments, which consist of three elements: a security principal, a role definition (predefined set of permissions), and a scope (group of resources or individual resource). For more information, see [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).

The access policy model, on the other hand, is an legacy authorization system built in Key Vault to provide access to keys, secrets, and certificates. You can control access by assigning individual permissions to security principals (user, group, service principal, managed identity) at Key Vault scope.

## Data plane access control recommendation

Azure RBAC is the recommended authorization system for the Azure Key Vault data plane.

Azure RBAC offers several advantages over access policies:
- A unified access control model for Azure resource-- it uses the same API across Azure services.
- Centralized access management for administrators - manage all Azure resources in one view
- Improved security that requires Owner or User Access Administrator roles to manage access to keys, secrets, certificates
- Integration with [Privileged Identity Management](../../active-directory/privileged-identity-management/pim-configure.md) for time-based access control for privileged accounts
- Deny assignments - ability to exclude security principals at a particular scope. For information, see [Understand Azure Deny Assignments](../../role-based-access-control/deny-assignments.md)

To transition your Key Vault data plane access control from access policies to RBAC, see [Migrate from vault access policy to an Azure role-based access control permission model](rbac-migration.md).

## Learn more

- [Azure RBAC Overview](../../role-based-access-control/overview.md)
- [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md)
- [Migrating from an access policy to RBAC](../../role-based-access-control/tutorial-custom-role-cli.md)
- [Azure Key Vault best practices](best-practices.md)
