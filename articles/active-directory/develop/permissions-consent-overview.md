---
title: Overview of permissions and consent in the Microsoft identity platform
description: Learn about the foundational concepts and scenarios around consent and permissions in the Microsoft identity platform
services: active-directory
author: omondiatieno
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.custom: event-tier1-build-2022
ms.topic: overview
ms.date: 05/10/2022
ms.author: jomondi
ms.reviewer: jawoods, ludwignick, phsignor
#Customer intent: As and a developer or admin in the Microsoft identity platform, I want to understand the basic concept about managing how applications access resources through the permissions and consent framework.
---
# Introduction to permissions and consent

To _access_ a protected resource like email or calendar data, your application needs the resource owner's _authorization_. The resource owner can _consent_ to or deny your app's request. Understanding these foundational concepts will help you build more secure and trustworthy applications that request only the access they need, when they need it, from its users and administrators.

## Access scenarios

As an application developer, you must identify how your application will access data. The application can use delegated access, acting on behalf of a signed-in user, or direct access, acting only as the application's own identity.

![Image shows illustration of access scenarios.](./media/permissions-consent-overview/access-scenarios.png)

### Delegated access (access on behalf of a user)

In this access scenario, a user has signed into a client application. The client application accesses the resource on behalf of the user. Delegated access requires delegated permissions. Both the client and the user must be authorized separately to make the request.

For the client app, the correct delegated permissions must be granted. Delegated permissions can also be referred to as scopes. Scopes are permissions of a given resource that the client application exercises on behalf of a user. They're strings that represent what the application wants to do on behalf of the user. For more information about scopes, see [scopes and permissions](v2-permissions-and-consent.md#scopes-and-permissions).

For the user, the authorization relies on the privileges that the user has been granted for them to access the resource. For example, the user could be authorized to access directory resources by [Azure Active Directory (Azure AD) role-based access control (RBAC)](../roles/custom-overview.md) or to access mail and calendar resources by [Exchange Online RBAC](/exchange/permissions-exo/permissions-exo).

### Direct access (App-only access)

In this access scenario, the application acts on its own with no user signed in. Application access is used in scenarios such as automation, and backup. This scenario includes apps that run as background services or daemons. It's appropriate when it's undesirable to have a specific user signed in, or when the data required can't be scoped to a single user.

Direct access may require application permissions but this isn't the only way for granting an application direct access. Application permissions can be referred to as app roles. When app roles are granted to other applications, they can be called applications permissions. The appropriate application permissions or app roles must be granted to the application for it to access the resource. For more information about assigning app roles to applications, see [App roles for applications](howto-add-app-roles-in-azure-ad-apps.md).

## Types of permissions

**Delegated permissions** are used in the delegated access scenario. They're permissions that allow the application to act on a user's behalf. The application will never be able to access anything users themselves couldn't access.

For example, imagine an application that has been granted the Files.Read.All delegated permission on behalf of Tom, the user. The application will only be able to read files that Tom can personally access.

**Application permissions** are used in the direct access scenario, without a signed-in user present. The application will be able to access any data that the permission is associated with. For example, an application granted the Files.Read.All application permission will be able to read any file in the tenant.  Only an administrator or owner of the service principal can consent to application permissions.

There are other ways in which applications can be granted authorization for direct access. For example, an application can be assigned an Azure AD RBAC role.

## Consent
One way that applications are granted permissions is through consent. Consent is a process where users or admins authorize an application to access a protected resource. For example, when a user attempts to sign into an application for the first time, the application can request permission to see the user's profile and read the contents of the user's mailbox. The user sees the list of permissions the app is requesting through a consent prompt.

The key details of a consent prompt are the list of permissions the application requires and the publisher information. For more information about the consent prompt and the consent experience for both admins and end-users, see [application consent experience](application-consent-experience.md).

### User consent

User consent happens when a user attempts to sign into an application. The user provides their sign-in credentials. These credentials are checked to determine whether consent has already been granted. If no previous record of user or admin consent for the required permissions exists, the user is shown a consent prompt and asked to grant the application the requested permissions. In many cases, an admin may be required to grant consent on behalf of the user.

### Administrator consent

Depending on the permissions they require, some applications might require an administrator to be the one who grants consent. For example, application permissions can only be consented to by an administrator. Administrators can grant consent for themselves or for the entire organization. For more information about user and admin consent, see [user and admin consent overview](../manage-apps/consent-and-permissions-overview.md)

### Preauthorization

Preauthorization allows a resource application owner to grant permissions without requiring users to see a consent prompt for the same set of permissions that have been preauthorized. This way, an application that has been preauthorized won't ask users to consent to permissions. Resource owners can preauthorize client apps in the Azure portal or by using PowerShell and APIs, like Microsoft Graph.

## Next steps
- [User and admin consent overview](../manage-apps/consent-and-permissions-overview.md)
- [Scopes and permissions](v2-permissions-and-consent.md)
