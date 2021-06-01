---
title: Best practices for Azure RBAC
description: Best practices for using Azure role-based access control (Azure RBAC).
services: active-directory
author: rolyon
manager: mtillman
ms.service: role-based-access-control
ms.topic: conceptual
ms.workload: identity
ms.date: 12/16/2020
ms.author: rolyon

#Customer intent: As a dev, devops, or it admin, I want to learn how to best use Azure RBAC.
---

# Best practices for Azure RBAC

This article describes some best practices for using Azure role-based access control (Azure RBAC). These best practices are derived from our experience with Azure RBAC and the experiences of customers like yourself.

## Only grant the access users need

Using Azure RBAC, you can segregate duties within your team and grant only the amount of access to users that they need to perform their jobs. Instead of giving everybody unrestricted permissions in your Azure subscription or resources, you can allow only certain actions at a particular scope.

When planning your access control strategy, it's a best practice to grant users the least privilege to get their work done. Avoid assigning broader roles at broader scopes even if it initially seems more convenient to do so. When creating custom roles, only include the permissions users need. By limiting roles and scopes, you limit what resources are at risk if the security principal is ever compromised.

The following diagram shows a suggested pattern for using Azure RBAC.

![Azure RBAC and least privilege](./media/best-practices/rbac-least-privilege.png)

For information about how to assign roles, see [Assign Azure roles using the Azure portal](role-assignments-portal.md).

## Limit the number of subscription owners

You should have a maximum of 3 subscription owners to reduce the potential for breach by a compromised owner. This recommendation can be monitored in Azure Security Center. For other identity and access recommendations in Security Center, see [Security recommendations - a reference guide](../security-center/recommendations-reference.md).

## Use Azure AD Privileged Identity Management

To protect privileged accounts from malicious cyber-attacks, you can use Azure Active Directory Privileged Identity Management (PIM) to lower the exposure time of privileges and increase your visibility into their use through reports and alerts. PIM helps protect privileged accounts by providing just-in-time privileged access to Azure AD and Azure resources. Access can be time bound after which privileges are revoked automatically. 

For more information, see [What is Azure AD Privileged Identity Management?](../active-directory/privileged-identity-management/pim-configure.md).

## Assign roles to groups, not users

To make role assignments more manageable, avoid assigning roles directly to users. Instead, assign roles to groups. Assigning roles to groups instead of users also helps minimize the number of role assignments, which has a [limit of 2,000 role assignments per subscription](troubleshooting.md#azure-role-assignments-limit). 

## Next steps

- [Troubleshoot Azure RBAC](troubleshooting.md)
