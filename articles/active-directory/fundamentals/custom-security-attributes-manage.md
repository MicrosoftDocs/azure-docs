---
title: Manage access to custom security attributes in Azure AD (Preview) - Azure Active Directory
description: Learn how to manage access to custom security attributes in Azure Active Directory.
services: active-directory
author: rolyon
ms.author: rolyon
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
ms.date: 09/15/2021
ms.collection: M365-identity-device-management
---

# Manage access to custom security attributes in Azure AD (Preview)

> [!IMPORTANT]
> Custom security attributes are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You can delegate the management of custom security attributes to others in your organization at the tenant level or at the attribute set level.

## Prerequisites

To manage access to custom security attributes, you must have:

- Azure AD Premium P1 or P2 license
- An Azure AD role with the following permissions, such as Attribute Assignment Administrator:

    - `microsoft.directory/attributeSets/allProperties/read`
    - `microsoft.directory/customSecurityAttributeDefinitions/allProperties/read`

    > [!IMPORTANT]
    > [Global Administrator](../roles/permissions-reference.md#global-administrator), [Global Reader](../roles/permissions-reference.md#global-reader), and [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator) do not have permissions to read, filter, define, manage, or assign custom security attributes.

## Example scenarios

The following are example scenarios to read, manage, and assign custom security attributes and attribute sets.

| Access | Scope | Role |
| --- | --- | --- |
| Read custom security attributes in a particular attribute set | Attribute set | Attribute Definition Reader |
| Read all custom security attributes | Tenant | Attribute Definition Reader |
| Manage custom security attributes in a particular attribute set | Attribute set | Attribute Definition Administrator |
| Manage all custom security attributes | Tenant | Attribute Definition Administrator |
| Read custom security attribute assignments for users, service principals, and devices from a particular attribute set | Attribute set | Attribute Assignment Reader |
| Read all custom security attribute assignments for users, service principals, and devices | Tenant | Attribute Assignment Reader |
| Assign custom security attributes to users, service principals, and devices from a particular attribute set | Attribute set | Attribute Assignment Administrator |
| Assign all custom security attributes to users, service principals, and devices | Tenant | Attribute Assignment Administrator |

## Grant access at the attribute set scope

1. Sign in to the Azure portal.

1. Click Azure Active Directory.

1. In the left navigation menu, click Custom security attributes (Preview).

1. Click the custom security attribute set you want grant access to.

1. Click Roles and administrators.

1. Add assignments to one of the following roles.

    - Attribute Assignment Administrator
    - Attribute Assignment Reader
    - Attribute Definition Administrator
    - Attribute Definition Reader

## Grant access at the tenant scope

1. Sign in to the Azure portal.

1. Click Azure Active Directory.

1. In the left navigation menu, click Roles and administrators.

1. Add assignments to one of the following roles.

    - Attribute Assignment Administrator
    - Attribute Assignment Reader
    - Attribute Definition Administrator
    - Attribute Definition Reader

## Next steps

- [Add or deactivate custom security attributes in Azure AD](custom-security-attributes-add.md)
- [Assign or remove custom security attributes for a user](../enterprise-users/users-custom-security-attributes.md)
- [Troubleshoot custom security attributes in Azure AD](custom-security-attributes-troubleshoot.md)
