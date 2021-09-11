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
- Attribute Assignment Administrator

> [!IMPORTANT]
> [Global Administrator](../roles/permissions-reference.md#global-administrator), [Global Reader](../roles/permissions-reference.md#global-reader), [Privileged Role Administrator](../roles/permissions-reference.md#privileged-role-administrator), and [User Administrator](../roles/permissions-reference.md#user-administrator) do not have permissions to read, filter, define, manage, or assign custom security attributes.

## Manage attributes without delegation

An administrator that has been assigned the Attribute Definition Administrator and Attribute Assignment Administrator roles at the tenant level can manage all aspects of custom security attributes. The following steps show how custom security attributes are defined and assigned by a single administrator.

1. The administrator adds attribute sets to group and manage related custom security attributes.

    ![Diagram showing adding an attribute set in Azure AD.](./media/custom-security-attributes-manage/attribute-sets-admin.png)

1. The administrator defines custom security attributes in the attribute sets.

    ![Diagram showing defining custom security attributes in an attribute set.](./media/custom-security-attributes-manage/attributes-define.png)

1. The administrator assigns custom security attributes to Azure AD objects.

    ![Diagram showing assigning custom security attributes to Azure AD objects.](./media/custom-security-attributes-manage/attributes-assign.png)

Advantages of not using delegation

- All custom security attributes can be managed by one or two administrators
- Can work for small organizations

Disadvantages of not using delegation

- Administrator might get several requests to define and assign custom security attributes
- Does not scale for large organizations

## Manage attributes with delegation

An administrator may not know all the situations of how custom security attributes should be defined and assigned. Typically it's users within the respective departments, teams, or projects who know the most about their area. Instead of assigning one or two administrators to manage all custom security attributes, you can instead delegate the management at the attribute set level. This also follows the best practice of least privilege to grant just the permissions other administrators need to do their job and avoid unnecessary access. The following steps show how the management of custom security attributes being delegated to multiple administrators.

1. The administrator adds attribute sets to group and manage related custom security attributes.

    ![Diagram showing adding multiple attribute sets in Azure AD.](./media/custom-security-attributes-manage/delegate-attribute-sets-admin.png)

1. The administrator specifies who can read, define, or assign custom security attributes in an attribute set.

    ![Diagram showing assigning attribute definition administrators and attribute assignment administrators to attribute sets.](./media/custom-security-attributes-manage/delegate-attribute-sets-manage.png)

1. The delegated administrators define custom security attributes in the attribute sets they have been granted access to.

    ![Diagram showing delegated administrators defining custom security attributes.](./media/custom-security-attributes-manage/delegate-attributes-define.png)

1. The delegated administrators assign custom security attributes they have been granted access to.

    ![Diagram showing delegated administrators assigning custom security attributes to Azure AD objects.](./media/custom-security-attributes-manage/delegate-attributes-assign.png)

Advantages of using delegation

- Management is distributed
- Allows delegated readers and administrators to read and manage their own custom security attributes
- Grants just the permissions delegated readers and administrators need

Disadvantages of using delegation

- Does require that an administrator to develop an attribute set strategy

## Which roles to assign

The following table lists which roles to assign and the scope to read, manage, and assign custom security attributes and attribute sets.

| I want to grant this access | Assign this role | Scope |
| --- | --- | --- |
| Read custom security attributes in a particular attribute set | Attribute Definition Reader | Attribute set |
| Read all custom security attributes | Attribute Definition Reader | Tenant |
| Manage custom security attributes in a particular attribute set | Attribute Definition Administrator | Attribute set |
| Manage all custom security attributes | Attribute Definition Administrator | Tenant |
| Read custom security attribute assignments for users and enterprise applications (service principals) from a particular attribute set | Attribute Assignment Reader | Attribute set |
| Read all custom security attribute assignments for users and enterprise applications (service principals) | Attribute Assignment Reader | Tenant |
| Assign custom security attributes to users and enterprise applications (service principals) from a particular attribute set | Attribute Assignment Administrator | Attribute set |
| Assign all custom security attributes to users and enterprise applications (service principals) | Attribute Assignment Administrator | Tenant |

## Grant access at the attribute set scope

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Click **Azure Active Directory**.

1. In the left navigation menu, click **Custom security attributes (Preview)**.

1. Click the attribute set you want grant access to.

1. Click **Roles and administrators**.

    ![Screenshot of assigning attribute roles at attribute set scope.](./media/custom-security-attributes-manage/manage-attribute-set.png)

1. Add assignments to one of the following roles:

    - Attribute Assignment Administrator
    - Attribute Assignment Reader
    - Attribute Definition Administrator
    - Attribute Definition Reader

    > [!NOTE]
    > If you are using Azure AD Privileged Identity Management (PIM), eligible role assignments at attribute set scope currently aren't supported. Permanent role assignments at attribute set scope are supported, but the **Assigned roles** page for a user doesn't list the role assignments.
    
    > [!NOTE]
    > Users with attribute set-level role assignments currently can see other attribute sets and custom security attribute definitions.
    
## Grant access at the tenant scope

1. Sign in to the [Azure portal](https://portal.azure.com) or [Azure AD admin center](https://aad.portal.azure.com).

1. Click **Azure Active Directory**.

1. In the left navigation menu, click **Roles and administrators**.

    ![Screenshot of assigning attribute roles at tenant scope.](./media/custom-security-attributes-manage/manage-tenant.png)

1. Add assignments to one of the following roles:

    - Attribute Assignment Administrator
    - Attribute Assignment Reader
    - Attribute Definition Administrator
    - Attribute Definition Reader

## Next steps

- [Add or deactivate custom security attributes in Azure AD](custom-security-attributes-add.md)
- [Assign or remove custom security attributes for a user](../enterprise-users/users-custom-security-attributes.md)
- [Troubleshoot custom security attributes in Azure AD](custom-security-attributes-troubleshoot.md)
