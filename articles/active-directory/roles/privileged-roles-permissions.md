---
title: Privileged roles and permissions in Microsoft Entra ID (preview) - Microsoft Entra ID
description: Privileged roles and permissions in Microsoft Entra ID.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: roles
ms.topic: conceptual
ms.date: 09/14/2023
ms.author: rolyon
ms.custom: it-pro
---

# Privileged roles and permissions in Microsoft Entra ID (preview)

> [!IMPORTANT]
> Privileged roles and permissions are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Microsoft Entra ID has roles and permissions that are identified as privileged. These roles and permissions can be used to delegate management of directory resources to other users, modify credentials, authentication or authorization policies, or access restricted data. Privileged role assignments can lead to elevation of privilege if not used in a secure and intended manner. This article describes privileged roles and permissions and best practices for how to use.

## Which roles and permissions are privileged?

For a list of privileged roles and permissions, see [Microsoft Entra built-in roles](permissions-reference.md). You can also use the Microsoft Entra admin center, Microsoft Graph PowerShell, or Microsoft Graph API to identify roles, permissions, and role assignments that are identified as privileged.

# [Admin center](#tab/admin-center)

In the Microsoft Entra admin center, look for the **PRIVILEGED** label.

![Privileged label icon.](./media/permissions-reference/privileged-label.png)

On the **Roles and administrators** page, privileged roles are identified in the **Privileged** column. The **Assignments** column lists the number of role assignments. You can also filter privileged roles. 

:::image type="content" source="./media/privileged-roles-permissions/privileged-roles-portal.png" alt-text="Screenshot of the Microsoft Entra roles and administrators page that shows the Privileged and Assignments columns." lightbox="./media/privileged-roles-permissions/privileged-roles-portal.png":::

When you view the permissions for a privileged role, you can see which permissions are privileged. If you view the permissions as a default user, you won't be able to see which permissions are privileged.

:::image type="content" source="./media/privileged-roles-permissions/privileged-roles-permissions.png" alt-text="Screenshot of the Microsoft Entra roles and administrators page that shows the privileged permissions for a role." lightbox="./media/privileged-roles-permissions/privileged-roles-permissions.png":::

When you create a custom role, you can see which permissions are privileged and the custom role will be labeled as privileged.

:::image type="content" source="./media/privileged-roles-permissions/custom-role-privileged-permissions.png" alt-text="Screenshot of the New custom role page that shows a custom role with privileged permissions." lightbox="./media/privileged-roles-permissions/custom-role-privileged-permissions.png":::

# [PowerShell](#tab/ms-powershell)

In Microsoft Graph PowerShell, check whether the `IsPrivileged` property is set to `True`.

To list privileged roles, use the [Get-MgBetaRoleManagementDirectoryRoleDefinition](/powershell/module/microsoft.graph.beta.identity.governance/get-mgbetarolemanagementdirectoryroledefinition) command.

```powershell
Get-MgBetaRoleManagementDirectoryRoleDefinition -Filter "isPrivileged eq true" | Format-List
```

```Output
AllowedPrincipalTypes   :
Description             : Can manage all aspects of Azure AD and Microsoft services that use Azure AD identities.
DisplayName             : Global Administrator
Id                      : 62e90394-69f5-4237-9190-012177145e10
InheritsPermissionsFrom : {88d8e3e3-8f55-4a1e-953a-9b9898b8876b}
IsBuiltIn               : True
IsEnabled               : True
IsPrivileged            : True
ResourceScopes          : {/}
RolePermissions         : {Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphUnifiedRolePermission}
TemplateId              : 62e90394-69f5-4237-9190-012177145e10
Version                 : 1
AdditionalProperties    : {[inheritsPermissionsFrom@odata.context, https://graph.microsoft.com/beta/$metadata#roleManag
                          ement/directory/roleDefinitions('62e90394-69f5-4237-9190-012177145e10')/inheritsPermissionsFr
                          om]}

AllowedPrincipalTypes   :
Description             : Can manage all aspects of users and groups, including resetting passwords for limited admins.
DisplayName             : User Administrator
Id                      : fe930be7-5e62-47db-91af-98c3a49a38b1
InheritsPermissionsFrom : {88d8e3e3-8f55-4a1e-953a-9b9898b8876b}
IsBuiltIn               : True
IsEnabled               : True
IsPrivileged            : True
ResourceScopes          : {/}
RolePermissions         : {Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphUnifiedRolePermission}
TemplateId              : fe930be7-5e62-47db-91af-98c3a49a38b1
Version                 : 1
AdditionalProperties    : {[inheritsPermissionsFrom@odata.context, https://graph.microsoft.com/beta/$metadata#roleManag
                          ement/directory/roleDefinitions('fe930be7-5e62-47db-91af-98c3a49a38b1')/inheritsPermissionsFr
                          om]}

...
```

To list privileged permissions, use the [Get-MgBetaRoleManagementDirectoryResourceNamespaceResourceAction](/powershell/module/microsoft.graph.beta.identity.governance/get-mgbetarolemanagementdirectoryresourcenamespaceresourceaction) command.

```powershell
Get-MgBetaRoleManagementDirectoryResourceNamespaceResourceAction -UnifiedRbacResourceNamespaceId "microsoft.directory" -Filter "isPrivileged eq true" | Format-List
```

```Output
ActionVerb                      : PATCH
AuthenticationContext           : Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphAuthenticationContextClassReference
AuthenticationContextId         :
Description                     : Update all properties (including privileged properties) on single-directory applications
Id                              : microsoft.directory-applications.myOrganization-allProperties-update-patch
IsAuthenticationContextSettable :
IsPrivileged                    : True
Name                            : microsoft.directory/applications.myOrganization/allProperties/update
ResourceScope                   : Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphUnifiedRbacResourceScope
ResourceScopeId                 :
AdditionalProperties            : {}

ActionVerb                      : PATCH
AuthenticationContext           : Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphAuthenticationContextClassReference
AuthenticationContextId         :
Description                     : Update credentials on single-directory applications
Id                              : microsoft.directory-applications.myOrganization-credentials-update-patch
IsAuthenticationContextSettable :
IsPrivileged                    : True
Name                            : microsoft.directory/applications.myOrganization/credentials/update
ResourceScope                   : Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphUnifiedRbacResourceScope
ResourceScopeId                 :
AdditionalProperties            : {}

...
```

To list privileged role assignments, use the [Get-MgBetaRoleManagementDirectoryRoleAssignment](/powershell/module/microsoft.graph.beta.identity.governance/get-mgbetarolemanagementdirectoryroleassignment) command.

```powershell
Get-MgBetaRoleManagementDirectoryRoleAssignment -ExpandProperty "roleDefinition" -Filter "roleDefinition/isPrivileged eq true" | Format-List
```

```Output
AppScope                : Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphAppScope
AppScopeId              :
Condition               :
DirectoryScope          : Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphDirectoryObject
DirectoryScopeId        : /
Id                      : <Id>
Principal               : Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphDirectoryObject
PrincipalId             : <PrincipalId>
PrincipalOrganizationId : <PrincipalOrganizationId>
ResourceScope           : /
RoleDefinition          : Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphUnifiedRoleDefinition
RoleDefinitionId        : 62e90394-69f5-4237-9190-012177145e10
AdditionalProperties    : {}

AppScope                : Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphAppScope
AppScopeId              :
Condition               :
DirectoryScope          : Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphDirectoryObject
DirectoryScopeId        : /
Id                      : <Id>
Principal               : Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphDirectoryObject
PrincipalId             : <PrincipalId>
PrincipalOrganizationId : <PrincipalOrganizationId>
ResourceScope           : /
RoleDefinition          : Microsoft.Graph.Beta.PowerShell.Models.MicrosoftGraphUnifiedRoleDefinition
RoleDefinitionId        : 62e90394-69f5-4237-9190-012177145e10
AdditionalProperties    : {}

...
```

# [Graph API](#tab/ms-graph)

In the Microsoft Graph API, check whether the `isPrivileged` property is set to `true`.

To list privileged roles, use the [List roleDefinitions](/graph/api/rbacapplication-list-roledefinitions?view=graph-rest-beta&preserve-view=true&branch=pr-en-us-18827) API.

```http
GET https://graph.microsoft.com/beta/roleManagement/directory/roleDefinitions?$filter=isPrivileged eq true
```

**Response**

```http
HTTP/1.1 200 OK
Content-type: application/json

{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#roleManagement/directory/roleDefinitions",
    "value": [
        {
            "id": "aaf43236-0c0d-4d5f-883a-6955382ac081",
            "description": "Can manage secrets for federation and encryption in the Identity Experience Framework (IEF).",
            "displayName": "B2C IEF Keyset Administrator",
            "isBuiltIn": true,
            "isEnabled": true,
            "isPrivileged": true,
            "resourceScopes": [
                "/"
            ],
            "templateId": "aaf43236-0c0d-4d5f-883a-6955382ac081",
            "version": "1",
            "rolePermissions": [
                {
                    "allowedResourceActions": [
                        "microsoft.directory/b2cTrustFrameworkKeySet/allProperties/allTasks"
                    ],
                    "condition": null
                }
            ],
            "inheritsPermissionsFrom@odata.context": "https://graph.microsoft.com/beta/$metadata#roleManagement/directory/roleDefinitions('aaf43236-0c0d-4d5f-883a-6955382ac081')/inheritsPermissionsFrom",
            "inheritsPermissionsFrom": [
                {
                    "id": "88d8e3e3-8f55-4a1e-953a-9b9898b8876b"
                }
            ]
        },
        {
            "id": "be2f45a1-457d-42af-a067-6ec1fa63bc45",
            "description": "Can configure identity providers for use in direct federation.",
            "displayName": "External Identity Provider Administrator",
            "isBuiltIn": true,
            "isEnabled": true,
            "isPrivileged": true,
            "resourceScopes": [
                "/"
            ],
            "templateId": "be2f45a1-457d-42af-a067-6ec1fa63bc45",
            "version": "1",
            "rolePermissions": [
                {
                    "allowedResourceActions": [
                        "microsoft.directory/domains/federation/update",
                        "microsoft.directory/identityProviders/allProperties/allTasks"
                    ],
                    "condition": null
                }
            ],
            "inheritsPermissionsFrom@odata.context": "https://graph.microsoft.com/beta/$metadata#roleManagement/directory/roleDefinitions('be2f45a1-457d-42af-a067-6ec1fa63bc45')/inheritsPermissionsFrom",
            "inheritsPermissionsFrom": [
                {
                    "id": "88d8e3e3-8f55-4a1e-953a-9b9898b8876b"
                }
            ]
        }
    ]
}
```

To list privileged permissions, use the [List resourceActions](/graph/api/unifiedrbacresourcenamespace-list-resourceactions?view=graph-rest-beta&preserve-view=true&branch=pr-en-us-18827) API.

```http
GET https://graph.microsoft.com/beta/roleManagement/directory/resourceNamespaces/microsoft.directory/resourceActions?$filter=isPrivileged eq true
```

**Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#roleManagement/directory/resourceNamespaces('microsoft.directory')/resourceActions",
    "value": [
        {
            "actionVerb": "PATCH",
            "description": "Update application credentials",
            "id": "microsoft.directory-applications-credentials-update-patch",
            "isPrivileged": true,
            "name": "microsoft.directory/applications/credentials/update",
            "resourceScopeId": null
        },
        {
            "actionVerb": null,
            "description": "Manage all aspects of authorization policy",
            "id": "microsoft.directory-authorizationPolicy-allProperties-allTasks",
            "isPrivileged": true,
            "name": "microsoft.directory/authorizationPolicy/allProperties/allTasks",
            "resourceScopeId": null
        }
    ]
}
```

To list privileged role assignments, use the [List unifiedRoleAssignments](/graph/api/rbacapplication-list-roleassignments?view=graph-rest-beta&preserve-view=true&branch=pr-en-us-18827) API.

```http
GET https://graph.microsoft.com/beta/roleManagement/directory/roleAssignments?$expand=roleDefinition&$filter=roleDefinition/isPrivileged eq true
```

**Response**

```http
HTTP/1.1 200 OK
Content-type: application/json

{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#roleManagement/directory/roleAssignments(roleDefinition())",
    "value": [
        {
            "id": "{id}",
            "principalId": "{principalId}",
            "principalOrganizationId": "{principalOrganizationId}",
            "resourceScope": "/",
            "directoryScopeId": "/",
            "roleDefinitionId": "b1be1c3e-b65d-4f19-8427-f6fa0d97feb9",
            "roleDefinition": {
                "id": "b1be1c3e-b65d-4f19-8427-f6fa0d97feb9",
                "description": "Can manage Conditional Access capabilities.",
                "displayName": "Conditional Access Administrator",
                "isBuiltIn": true,
                "isEnabled": true,
                "isPrivileged": true,
                "resourceScopes": [
                    "/"
                ],
                "templateId": "b1be1c3e-b65d-4f19-8427-f6fa0d97feb9",
                "version": "1",
                "rolePermissions": [
                    {
                        "allowedResourceActions": [
                            "microsoft.directory/namedLocations/create",
                            "microsoft.directory/namedLocations/delete",
                            "microsoft.directory/namedLocations/standard/read",
                            "microsoft.directory/namedLocations/basic/update",
                            "microsoft.directory/conditionalAccessPolicies/create",
                            "microsoft.directory/conditionalAccessPolicies/delete",
                            "microsoft.directory/conditionalAccessPolicies/standard/read",
                            "microsoft.directory/conditionalAccessPolicies/owners/read",
                            "microsoft.directory/conditionalAccessPolicies/policyAppliedTo/read",
                            "microsoft.directory/conditionalAccessPolicies/basic/update",
                            "microsoft.directory/conditionalAccessPolicies/owners/update",
                            "microsoft.directory/conditionalAccessPolicies/tenantDefault/update"
                        ],
                        "condition": null
                    }
                ]
            }
        },
        {
            "id": "{id}",
            "principalId": "{principalId}",
            "principalOrganizationId": "{principalOrganizationId}",
            "resourceScope": "/",
            "directoryScopeId": "/",
            "roleDefinitionId": "c4e39bd9-1100-46d3-8c65-fb160da0071f",
            "roleDefinition": {
                "id": "c4e39bd9-1100-46d3-8c65-fb160da0071f",
                "description": "Can access to view, set and reset authentication method information for any non-admin user.",
                "displayName": "Authentication Administrator",
                "isBuiltIn": true,
                "isEnabled": true,
                "isPrivileged": true,
                "resourceScopes": [
                    "/"
                ],
                "templateId": "c4e39bd9-1100-46d3-8c65-fb160da0071f",
                "version": "1",
                "rolePermissions": [
                    {
                        "allowedResourceActions": [
                            "microsoft.directory/users/authenticationMethods/create",
                            "microsoft.directory/users/authenticationMethods/delete",
                            "microsoft.directory/users/authenticationMethods/standard/restrictedRead",
                            "microsoft.directory/users/authenticationMethods/basic/update",
                            "microsoft.directory/deletedItems.users/restore",
                            "microsoft.directory/users/delete",
                            "microsoft.directory/users/disable",
                            "microsoft.directory/users/enable",
                            "microsoft.directory/users/invalidateAllRefreshTokens",
                            "microsoft.directory/users/restore",
                            "microsoft.directory/users/basic/update",
                            "microsoft.directory/users/manager/update",
                            "microsoft.directory/users/password/update",
                            "microsoft.directory/users/userPrincipalName/update",
                            "microsoft.azure.serviceHealth/allEntities/allTasks",
                            "microsoft.azure.supportTickets/allEntities/allTasks",
                            "microsoft.office365.serviceHealth/allEntities/allTasks",
                            "microsoft.office365.supportTickets/allEntities/allTasks",
                            "microsoft.office365.webPortal/allEntities/standard/read"
                        ],
                        "condition": null
                    }
                ]
            }
        }
    ]
}
```

---

## Best practices for using privileged roles

Here are some best practices for using privileged roles.

- Apply principle of least privilege
- Use Privileged Identity Management to grant just-in-time access
- Turn on multi-factor authentication for all your administrator accounts
- Configure recurring access reviews to revoke unneeded permissions over time
- Limit the number of Global Administrators to less than 5
- Limit the number of privileged role assignments to less than 10

For more information, see [Best practices for Microsoft Entra roles](best-practices.md).

## Privileged permissions versus protected actions

Privileged permissions and protected actions are security-related capabilities that have different purposes. Permissions that have the **PRIVILEGED** label help you identify permissions that can lead to elevation of privilege if not used in a secure and intended manner. Protected actions are role permissions that have been assigned Conditional Access policies for added security, such as requiring multi-factor authentication. Conditional Access requirements are enforced when a user performs the protected action. Protected actions are currently in Preview. For more information, see [What are protected actions in Microsoft Entra ID?](./protected-actions-overview.md).

| Capability | Privileged permission | Protected action |
| --- | --- | --- |
| Identify permissions that should be used in a secure manner | :white_check_mark: |  |
| Require additional security to perform an action  |  | :white_check_mark: |

## Terminology

To understand privileged roles and permissions in Microsoft Entra ID, it helps to know some of the following terminology.

| Term | Definition |
| --- | --- |
| action | An activity a security principal can perform on an object type. Sometimes referred to as an operation. |
| permission | A definition that specifies the activity a security principal can perform on an object type. A permission includes one or more actions. |
| privileged permission | In Microsoft Entra ID, permissions that can be used to delegate management of directory resources to other users, modify credentials, authentication or authorization policies, or access restricted data. |
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
| namespace | Product or service that exposes the task and is prepended with `microsoft`. For example, all tasks in Microsoft Entra ID use the `microsoft.directory` namespace. |
| entity | Logical feature or component exposed by the service in Microsoft Graph. For example, Microsoft Entra ID exposes User and Groups, OneNote exposes Notes, and Exchange exposes Mailboxes and Calendars. There is a special `allEntities` keyword for specifying all entities in a namespace. This is often used in roles that grant access to an entire product. |
| propertySet | Specific properties or aspects of the entity for which access is being granted. For example, `microsoft.directory/applications/authentication/read` grants the ability to read the reply URL, logout URL, and implicit flow property on the application object in Microsoft Entra ID.<ul><li>`allProperties` designates all properties of the entity, including privileged properties.</li><li>`standard` designates common properties, but excludes privileged ones related to `read` action. For example, `microsoft.directory/user/standard/read` includes the ability to read standard properties like public phone number and email address, but not the private secondary phone number or email address used for multifactor authentication.</li><li>`basic` designates common properties, but excludes privileged ones related to the `update` action. The set of properties that you can read may be different from what you can update. That’s why there are `standard` and `basic` keywords to reflect that.</li></ul> |
| action | Operation being granted, most typically create, read, update, or delete (CRUD). There is a special `allTasks` keyword for specifying all of the above abilities (create, read, update, and delete). |

## Compare authentication roles

[!INCLUDE [authentication-table-include](./includes/authentication-table-include.md)]

## Who can reset passwords

In the following table, the columns list the roles that can reset passwords and invalidate refresh tokens. The rows list the roles for which their password can be reset.

The following table is for roles assigned at the scope of a tenant. For roles assigned at the scope of an administrative unit, [further restrictions apply](admin-units-assign-roles.md#roles-that-can-be-assigned-with-administrative-unit-scope).

| Role that password can be reset | Password Admin | Helpdesk Admin | Auth Admin | User Admin | Privileged Auth Admin | Global Admin |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| Auth Admin | &nbsp; | &nbsp; | :white_check_mark: | &nbsp; | :white_check_mark: | :white_check_mark: |
| Directory Readers | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Global Admin | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :white_check_mark: | :white_check_mark:\* |
| Groups Admin | &nbsp; | &nbsp; | &nbsp; | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Guest Inviter | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Helpdesk Admin | &nbsp; | :white_check_mark: | &nbsp; | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Message Center Reader | &nbsp; | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Password Admin | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Privileged Auth Admin | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :white_check_mark: | :white_check_mark: |
| Privileged Role Admin | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :white_check_mark: | :white_check_mark: |
| Reports Reader | &nbsp; | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| User<br/>(no admin role) | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| User<br/>(no admin role, but member or owner of a [role-assignable group](groups-concept.md)) | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :white_check_mark: | :white_check_mark: |
| User with a role scoped to a [restricted management administrative unit](./admin-units-restricted-management.md) | &nbsp; | &nbsp; | &nbsp; | &nbsp; | :white_check_mark: | :white_check_mark: |
| User Admin | &nbsp; | &nbsp; | &nbsp; | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Usage Summary Reports Reader | &nbsp; | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| All custom roles |  |  |  |  | :white_check_mark: | :white_check_mark: |

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

| Role that sensitive action can be performed upon | Auth Admin | User Admin | Privileged Auth Admin | Global Admin |
| ------ | ------ | ------ | ------ | ------ |
| Auth Admin | :white_check_mark: | &nbsp; | :white_check_mark: | :white_check_mark: |
| Directory Readers | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Global Admin | &nbsp; | &nbsp; | :white_check_mark: | :white_check_mark: |
| Groups Admin | &nbsp; | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Guest Inviter | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Helpdesk Admin | &nbsp; | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Message Center Reader | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Password Admin | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Privileged Auth Admin | &nbsp; | &nbsp; | :white_check_mark: | :white_check_mark: |
| Privileged Role Admin | &nbsp; | &nbsp; | :white_check_mark: | :white_check_mark: |
| Reports Reader | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| User<br/>(no admin role) | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| User<br/>(no admin role, but member or owner of a [role-assignable group](groups-concept.md)) | &nbsp; | &nbsp; | :white_check_mark: | :white_check_mark: |
| User with a role scoped to a [restricted management administrative unit](./admin-units-restricted-management.md) | &nbsp; | &nbsp; | :white_check_mark: | :white_check_mark: |
| User Admin | &nbsp; | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Usage Summary Reports Reader | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| All custom roles |  |  | :white_check_mark: | :white_check_mark: |

## Next steps

- [Best practices for Microsoft Entra roles](best-practices.md)
- [Microsoft Entra built-in roles](permissions-reference.md)
