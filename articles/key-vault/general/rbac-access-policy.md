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

Azure Key Vault offers two authorization systems: **[Azure role-based access control](../../role-based-access-control/overview.md)** (Azure RBAC), which operates on Azure's [control and data planes](../../azure-resource-manager/management/control-plane-and-data-plane.md), and the **access policy model**, which operates on the data plane alone.

Azure RBAC is built on [Azure Resource Manager](../../azure-resource-manager/management/overview.md) and provides fine-grained access management of Azure resources. With Azure RBAC you control access to resources by creating role assignments, which consist of three elements: a security principal, a role definition (predefined set of permissions), and a scope (group of resources or individual resource).

The access policy model is a legacy authorization system, native to Key Vault, which provides access to keys, secrets, and certificates. You can control access by assigning individual permissions to security principals (users, groups, service principals, and managed identities) at Key Vault scope.

## Data plane access control recommendation

Azure RBAC is the recommended authorization system for the Azure Key Vault data plane. It offers several advantages over Key Vault access policies:
- Azure RBAC provides a unified access control model for Azure resources &mdash; the same APIs are used across all Azure services.
- Access management is centralized, providing administrators with a consistent view of access granted to Azure resources.
- The right to grant access to keys, secrets, and certificates is better controlled, requiring Owner or User Access Administrator role membership.
- Azure RBAC is integrated with [Privileged Identity Management](../../active-directory/privileged-identity-management/pim-configure.md), ensuring that privileged access rights are time-limited and expire automatically. 
- Security principals' access can be excluded at given scope(s) through the use of [Deny assignments](../../role-based-access-control/deny-assignments.md).

To transition your Key Vault data plane access control from access policies to RBAC, see [Migrate from vault access policy to an Azure role-based access control permission model](rbac-migration.md).

## Learn more

- [Azure RBAC Overview](../../role-based-access-control/overview.md)
- [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md)
- [Migrating from an access policy to RBAC](../../role-based-access-control/tutorial-custom-role-cli.md)
- [Azure Key Vault best practices](best-practices.md)
