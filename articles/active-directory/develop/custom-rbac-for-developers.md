---
title: Custom role-based access control for application developers
description: Learn about what custom RBAC is and why it's important to implement in applications.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity 
ms.date: 01/06/2023
ms.custom: template-concept, ignite-2022
ms.author: davidmu
ms.reviewer: john.garland, maggie.marxen, ian.bennett
#Customer intent: As a developer, I want to learn about custom RBAC and why I need to use it in my application.
---

# Role-based access control for application developers

Role-based access control (RBAC) allows certain users or groups to have specific permissions to access and manage resources. Application RBAC differs from [Azure role-based access control](../../role-based-access-control/overview.md) and [Azure AD role-based access control](../roles/custom-overview.md#understand-azure-ad-role-based-access-control). Azure custom roles and built-in roles are both part of Azure RBAC, which is used to help manage Azure resources. Azure AD RBAC is used to manage Azure AD resources. This article explains application-specific RBAC. For information about implementing application-specific RBAC, see [How to add app roles to your application and receive them in the token](./howto-add-app-roles-in-azure-ad-apps.md).

## Roles definitions

RBAC is a popular mechanism to enforce authorization in applications. When an organization uses RBAC, an application developer defines roles rather than authorizing individual users or groups. An administrator can then assign roles to different users and groups to control who has access to content and functionality.

RBAC helps an application developer to manage resources and their usage. RBAC also allows an application developer to control the areas of an application that users can access. Administrators can control which users have access to an application using the *User assignment required* property. Developers need to account for specific users within the application and what users can do within the application.

An application developer first creates a role definition within the registration section of the application in the Azure AD administration center. The role definition includes a value that is returned for users who are assigned to that role. A developer can then use this value to implement application logic to determine what those users can or can't do in an application.

## RBAC options

The following guidance should be applied when considering including role-based access control authorization in an application:

- Define the roles that are required for the authorization needs of the application.
- Apply, store, and retrieve the pertinent roles for authenticated users.
- Determine how the application behavior based on the roles assigned affects the current user.

After the roles are defined, the Microsoft identity platform supports several different solutions that can be used to apply, store, and retrieve role information for authenticated users. These solutions include app roles, Azure AD groups, and the use of custom datastores for user role information.

Developers have the flexibility to provide their own implementation for how role assignments are to be interpreted as application permissions. This interpretation of permissions can involve using middleware or other options provided by the platform of the applications or related libraries. Applications typically receive user role information as claims and then decides user permissions based on those claims.

### App roles

Azure AD allows you to [define app roles](./howto-add-app-roles-in-azure-ad-apps.md) for your application and assign those roles to users and other applications. The roles you assign to a user or application define their level of access to the resources and operations in your application.

When Azure AD issues an access token for an authenticated user or application, it includes the names of the roles you've assigned the entity (the user or application) in the access token's [`roles`](./access-tokens.md#payload-claims) claim. An application like a web API that receives that access token in a request can then make authorization decisions based on the values in the `roles` claim.

### Groups

Developers can also use [Azure AD groups](../fundamentals/active-directory-manage-groups.md) to implement RBAC in their applications, where the memberships of the user in specific groups are interpreted as their role memberships. When an organization uses Azure AD groups, a [groups claim](./access-tokens.md#payload-claims) is included in the token that specifies the identifiers of all of the groups to which the user is assigned within the current Azure AD tenant.

> [!IMPORTANT]
> When working with groups, developers need to be aware of the concept of an [overage claim](./access-tokens.md#payload-claims). By default, if a user is a member of more than the overage limit (150 for SAML tokens, 200 for JWT tokens, 6 if using the implicit flow), Azure AD doesn't emit a groups claim in the token. Instead, it includes an "overage claim" in the token that indicates the consumer of the token needs to query the Microsoft Graph API to retrieve the group memberships of the user. For more information about working with overage claims, see [Claims in access tokens](./access-tokens.md#claims-in-access-tokens). It's possible to only emit groups that are assigned to an application, though [group-based assignment](../manage-apps/assign-user-or-group-access-portal.md) does require Azure Active Directory Premium P1 or P2 edition.

### Custom data store

App roles and groups both store information about user assignments in the Azure AD directory. Another option for managing user role information that is available to developers is to maintain the information outside of the directory in a custom data store. For example, in a SQL database, Azure Table storage, or Azure Cosmos DB for Table.

Using custom storage allows developers extra customization and control over how to assign roles to users and how to represent them. However, the extra flexibility also introduces more responsibility. For example, there's no mechanism currently available to include this information in tokens returned from Azure AD. If developers maintain role information in a custom data store, they'll need to have the applications retrieve the roles. Retrieving the roles is typically done using extensibility points defined in the middleware available to the platform that's being used to develop the application. Developers are responsible for properly securing the custom data store.

Using [Azure AD B2C Custom policies](../../active-directory-b2c/custom-policy-overview.md) it's possible to interact with custom data stores and to include custom claims within a token.

## Choose an approach

In general, app roles are the recommended solution. App roles provide the simplest programming model and are purpose made for RBAC implementations. However, specific application requirements may indicate that a different approach would be a better solution.

Developers can use app roles to control whether a user can sign into an application, or an application can obtain an access token for a web API. App roles are preferred over Azure AD groups by developers when they want to describe and control the parameters of authorization in their applications. For example, an application using groups for authorization breaks in the next tenant as both the group identifier and name could be different. An application using app roles remains safe.

Although either app roles or groups can be used for authorization, key differences between them can influence which is the best solution for a given scenario.

|          |App Roles |Azure AD Groups |Custom Data Store|
|----------|-----------|------------|-----------------|
|**Programming model** |**Simplest**. They're specific to an application and are defined in the application registration. They move with the application.|**More complex**. Group identifiers vary between tenants and overage claims may need to be considered. Groups aren't specific to an application, but to an Azure AD tenant.|**Most complex**. Developers must implement means by which role information is both stored and retrieved.|
|**Role values are static between Azure AD tenants**|Yes  |No |Depends on the implementation.|
|**Role values can be used in multiple applications**|No (Unless role configuration is duplicated in each application registration.)|Yes |Yes |
|**Information stored within directory**|Yes  |Yes |No |
|**Information is delivered via tokens**|Yes (roles claim)  |Yes (If an overage, *groups claims* may need to be retrieved at runtime) |No (Retrieved at runtime via custom code.) |
|**Lifetime**|Lives in application registration in directory. Removed when the application registration is removed.|Lives in directory. Remain intact even if the application registration is removed. |Lives in custom data store. Not tied to application registration.|

## Next steps

- [Azure Identity Management and access control security best practices](../../security/fundamentals/identity-management-best-practices.md)
