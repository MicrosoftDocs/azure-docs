---
title: Privileged roles and permissions in Azure AD (preview) - Azure Active Directory
description: Privileged roles and permissions in Azure Active Directory.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: conceptual
ms.date: 07/28/2023
ms.author: rolyon
ms.custom: it-pro
---

# Privileged roles and permissions in Azure AD (preview)

> [!IMPORTANT]
> Privileged roles and permissions are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Active Directory (Azure AD) has roles and permissions that are identified as privileged. These roles and permissions can be used to delegate management of directory resources to other users or make either network or data security configuration changes. Privileged role assignments can lead to elevation of privilege if not used in a secure and intended manner. Privileged roles and permissions can pose a security threat so they should be used with caution. This article describes privileged roles and permissions and best practices for how to use.

## Which roles and permissions are privileged?

You can use the Azure portal, Microsoft Graph PowerShell, or Microsoft Graph API to identify roles, permissions, and role assignments that are identified as privileged.

# [Portal](#tab/portal)

In the Azure portal, look for the **PRIVILEGED** label.

![Privileged label icon.](./media/permissions-reference/privileged-label.png)

On the **Roles and administrators** page, privileged roles are identified in the **Privileged** column. The **Assignments** column lists the number or role assignments. You can also filter privileged roles. 

:::image type="content" source="./media/privileged-roles-permissions/privileged-roles-portal.png" alt-text="Screenshot of the Azure AD Roles and administrators page that shows the Privileged and Assignments columns." lightbox="./media/privileged-roles-permissions/privileged-roles-portal.png":::

When you create a custom role, you can see which permissions are privileged and the custom role will be labeled as privileged.

:::image type="content" source="./media/privileged-roles-permissions/custom-role-privileged-permissions.png" alt-text="Screenshot of the New custom role page that shows a custom role with privileged permissions." lightbox="./media/privileged-roles-permissions/custom-role-privileged-permissions.png":::

# [PowerShell](#tab/ms-powershell)

In Microsoft Graph PowerShell, check whether the `IsPrivileged` property is set to `True`.

To list privileged roles, use the [Get-MgBetaRoleManagementDirectoryRoleDefinition](/powershell/module/Microsoft.Graph.Beta.Identity.Governance/Get-MgBetaRoleManagementDirectoryRoleDefinition) command.

```powershell
Get-MgBetaRoleManagementDirectoryRoleDefinition -Filter "isPrivileged eq $true"
```

To list privileged permissions, use the [Get-MgBetaRoleManagementDirectoryResourceNamespaceResourceAction](/powershell/module/Microsoft.Graph.Beta.Identity.Governance/Get-MgBetaRoleManagementDirectoryResourceNamespaceResourceAction) command.

```powershell
Get-MgBetaRoleManagementDirectoryResourceNamespaceResourceAction -Filter "isPrivileged eq $true"
```

To list privileged role assignments, use the [Get-MgBetaRoleManagementDirectoryRoleAssignment](/powershell/module/Microsoft.Graph.Beta.Identity.Governance/Get-MgBetaRoleManagementDirectoryRoleAssignment) command.

```powershell
Get-MgBetaRoleManagementDirectoryRoleAssignment -Filter "isPrivileged eq $true"
```

# [Graph API](#tab/ms-graph)

In the Microsoft Graph API, check whether the `isPrivileged` property is set to `true`.

To list privileged roles, use the [List roleDefinitions](/graph/api/rbacapplication-list-roledefinitions?view=graph-rest-beta&preserve-view=true&branch=pr-en-us-18827) API.

```http
GET https://graph.microsoft.com/beta/roleManagement/directory/roleDefinitions?$filter=isPrivileged eq true
```

To list privileged permissions, use the [List resourceActions](/graph/api/unifiedrbacresourcenamespace-list-resourceactions?view=graph-rest-beta&preserve-view=true&branch=pr-en-us-18827) API.

```http
GET https://graph.microsoft.com/beta/roleManagement/directory/resourceNamespaces/microsoft.directory/resourceActions?$filter=isPrivileged eq true
```

To list privileged role assignments, use the [List unifiedRoleAssignments](/graph/api/rbacapplication-list-roleassignments?view=graph-rest-beta&preserve-view=true&branch=pr-en-us-18827) API.

```http
GET https://graph.microsoft.com/beta/roleManagement/directory/roleAssignments?$expand=roleDefinition&$filter=roleDefinition/isPrivileged eq true
```

---

## Best practices for using privileged roles

Here are some best practices for using privileged roles.

- Manage to least privilege
- Use Privileged Identity Management to grant just-in-time access
- Turn on multi-factor authentication for all your administrator accounts
- Configure recurring access reviews to revoke unneeded permissions over time
- Limit the number of Global Administrators to less than 5
- Limit the number of privileged role assignments to less than 10

If you have 5 or more privileged Global Administrator role assignments, a **Global Administrators** alert card is displayed on the Azure AD Overview page to help you monitor Global Administrator role assignments.

:::image type="content" source="./media/privileged-roles-permissions/overview-privileged-roles-card.png" alt-text="Screenshot of the Azure AD Overview page that shows a card with the number of privileged role assignments." lightbox="./media/privileged-roles-permissions/overview-privileged-roles-card.png":::

If you exceed 10 privileged role assignments, a warning is displayed on the Roles and administrators page.

:::image type="content" source="./media/privileged-roles-permissions/privileged-role-assignments-warning.png" alt-text="Screenshot of the Azure AD Roles and administrators page that shows the privileged role assignments warning." lightbox="./media/privileged-roles-permissions/privileged-role-assignments-warning.png":::
For more information, see [Best practices for Azure AD roles](best-practices.md).

## Privileged permissions versus protected actions

Privileged permissions and protected actions are security-related capabilities that have different purposes. Permissions that have the **PRIVILEGED** label help you identify permissions that can lead to elevation of privilege if not used in a secure and intended manner. Protected actions are role permissions that have been assigned Conditional Access policies for added security, such as requiring multi-factor authentication. Conditional Access requirements are enforced when a user performs the protected action. Protected actions are currently in Preview. For more information, see [What are protected actions in Azure AD?](./protected-actions-overview.md).

| Capability | Privileged permission | Protected action |
| --- | --- | --- |
| Identify permissions that should be used in a secure manner | :heavy_check_mark: |  |
| Require additional security to perform an action  |  | :heavy_check_mark: |

## Terminology

To understand privileged roles and permissions in Azure AD, it helps to know some of the following terminology.

| Term | Definition |
| --- | --- |
| action | An activity a security principal can perform on an object type. Sometimes referred to as an operation. |
| permission | A definition that specifies the activity a security principal can perform on an object type. A permission includes one or more actions. |
| privileged permission | In Azure AD, permissions that can be used to delegate management of directory resources to other users or make either network or data security configuration changes. Privileged permissions can lead to elevation of privilege if not used in a secure and intended manner. |
| privileged role | A built-in or custom role that has one or more privileged permissions. |
| privileged role assignment | A role assignment that uses a privileged role. |
| elevation of privilege | When a security principal obtains more permissions than their assigned role initially provided by impersonating another role. |
| protected action | Permissions with Conditional Access applied for added security. |

## How to understand role permissions

The schema for permissions loosely follows the REST format of Microsoft Graph:

`<namespace>/<entity>/<propertySet>/<action>`

For example:

`microsoft.directory/applications/credentials/update`

| Permission element | Description |
| --- | --- |
| namespace | Product or service that exposes the task and is prepended with `microsoft`. For example, all tasks in Azure AD use the `microsoft.directory` namespace. |
| entity | Logical feature or component exposed by the service in Microsoft Graph. For example, Azure AD exposes User and Groups, OneNote exposes Notes, and Exchange exposes Mailboxes and Calendars. There is a special `allEntities` keyword for specifying all entities in a namespace. This is often used in roles that grant access to an entire product. |
| propertySet | Specific properties or aspects of the entity for which access is being granted. For example, `microsoft.directory/applications/authentication/read` grants the ability to read the reply URL, logout URL, and implicit flow property on the application object in Azure AD.<ul><li>`allProperties` designates all properties of the entity, including privileged properties.</li><li>`standard` designates common properties, but excludes privileged ones related to `read` action. For example, `microsoft.directory/user/standard/read` includes the ability to read standard properties like public phone number and email address, but not the private secondary phone number or email address used for multifactor authentication.</li><li>`basic` designates common properties, but excludes privileged ones related to the `update` action. The set of properties that you can read may be different from what you can update. That’s why there are `standard` and `basic` keywords to reflect that.</li></ul> |
| action | Operation being granted, most typically create, read, update, or delete (CRUD). There is a special `allTasks` keyword for specifying all of the above abilities (create, read, update, and delete). |

## Compare authentication roles

[!INCLUDE [authentication-table-include](./includes/authentication-table-include.md)]

## Who can reset passwords

In the following table, the columns list the roles that can reset passwords and invalidate refresh tokens. The rows list the roles for which their password can be reset.

The following table is for roles assigned at the scope of a tenant. For roles assigned at the scope of an administrative unit, [further restrictions apply](admin-units-assign-roles.md#roles-that-can-be-assigned-with-administrative-unit-scope).

Role that password can be reset | Password Admin | Helpdesk Admin | Auth Admin | User Admin | Privileged Auth Admin | Global Admin
------ | ------ | ------ | ------ | ------ | ------ | ------
Auth Admin | &nbsp; | &nbsp; | :heavy_check_mark: | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
Directory Readers | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Global Admin | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:\*
Groups Admin | &nbsp; | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Guest Inviter | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Helpdesk Admin | &nbsp; | :heavy_check_mark: | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Message Center Reader | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Password Admin | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Privileged Auth Admin | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
Privileged Role Admin | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
Reports Reader | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
User<br/>(no admin role) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
User<br/>(no admin role, but member or owner of a [role-assignable group](groups-concept.md)) | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
User with a role scoped to a [restricted management administrative unit](./admin-units-restricted-management.md) | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
User Admin | &nbsp; | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Usage Summary Reports Reader | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
All custom roles |  |  |  |  | :heavy_check_mark: | :heavy_check_mark:

> [!IMPORTANT]
> The [Partner Tier2 Support](permissions-reference.md#partner-tier2-support) role can reset passwords and invalidate refresh tokens for all non-administrators and administrators (including Global Administrators). The [Partner Tier1 Support](permissions-reference.md#partner-tier1-support) role can reset passwords and invalidate refresh tokens for only non-administrators. These roles should not be used because they are deprecated.

The ability to reset a password includes the ability to update the following sensitive properties required for [self-service password reset](../authentication/concept-sspr-howitworks.md):
- businessPhones
- mobilePhone
- otherMails

## Who can perform sensitive actions

Some administrators can perform the following sensitive actions for some users. All users can read the sensitive properties.

| Sensitive action | Sensitive property name |
| --- | --- |
| Disable or enable users | `accountEnabled` |
| Update business phone | `businessPhones` |
| Update mobile phone | `mobilePhone` |
| Update on-premises immutable ID | `onPremisesImmutableId` |
| Update other emails | `otherMails` |
| Update password profile | `passwordProfile` |
| Update user principal name | `userPrincipalName` |
| Delete or restore users | Not applicable |

In the following table, the columns list the roles that can perform sensitive actions. The rows list the roles for which the sensitive action can be performed upon.

The following table is for roles assigned at the scope of a tenant. For roles assigned at the scope of an administrative unit, [further restrictions apply](admin-units-assign-roles.md#roles-that-can-be-assigned-with-administrative-unit-scope).

Role that sensitive action can be performed upon | Auth Admin | User Admin | Privileged Auth Admin | Global Admin
------ | ------ | ------ | ------ | ------
Auth Admin | :heavy_check_mark: | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
Directory Readers | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Global Admin | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
Groups Admin | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Guest Inviter | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Helpdesk Admin | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Message Center Reader | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Password Admin | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Privileged Auth Admin | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
Privileged Role Admin | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
Reports Reader | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
User<br/>(no admin role) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
User<br/>(no admin role, but member or owner of a [role-assignable group](groups-concept.md)) | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
User with a role scoped to a [restricted management administrative unit](./admin-units-restricted-management.md) | &nbsp; | &nbsp; | :heavy_check_mark: | :heavy_check_mark:
User Admin | &nbsp; | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Usage Summary Reports Reader | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
All custom roles |  |  | :heavy_check_mark: | :heavy_check_mark:

## Next steps

- [Best practices for Azure AD roles](best-practices.md)
- [Azure AD built-in roles](permissions-reference.md)
