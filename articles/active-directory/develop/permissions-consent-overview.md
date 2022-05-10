---
title: Overview of permissions and consent in the Microsoft Identity Platform
description: Learn about the foundational concepts and scenarios around consent and permissions in the Microsoft Identity Platform
services: active-directory
author: omondiatieno
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: overview
ms.date: 05/10/2022
ms.author: jomondi
ms.reviewer: jawoods, ludwignick, phsignor

---
# Introduction to permissions and consent

In this article, you’ll learn the foundational concepts and scenarios around consent and permissions in the Microsoft Identity Platform.

Access is the right to obtain data or perform an action on a given resource. Applications can access resources directly for themselves or on behalf of a user. For applications to access resources, they must request access by specifying permissions. The process of requesting, reviewing, and granting approval to access specific resources is called consent.

Depending on the type of access, your app must request either a delegated or application-only access token during authentication. Delegated access requires delegated permissions, or scopes, while app-only access requires application permissions, or app roles.

## Access scenarios

As an app developer, you must identify how your app accesses data: You either use delegated access; on behalf of a signed-in user, or direct access; with the client app's identity.

![Image shows illustration of access scenarios.](./media/permissions-consent-overview/access-scenarios.png)
 
### Delegated access (access on behalf of a user)

In this access scenario, a user has signed into a client application. The client application accesses the resource on behalf of the user. 
Both the client and the user must be authorized separately to make the request. For the client app, the correct delegated permissions (scopes) must be granted. 

For the user, the authorization relies on the privileges that the user has been granted for them to access the resource. For example, the user might be assigned a particular role in a role-based access control system (RBAC). See [role-based access control](custom-rbac-for-developers.md) to learn more about RBAC roles.

### Direct access (App-only access)

In this access scenario, the app acts on its own with no user signed in. Application access is used in scenarios such as automation, backup, and data loss prevention. This scenario includes apps that run as background services or daemons. It's appropriate when it's undesirable to have a specific user signed in, or when the data required can't be scoped to a single user. 

For direct access, the app must be granted the appropriate application permissions or app roles for it to access the resource. For more information about assigning app roles to applications, see [App roles for applications](howto-add-app-roles-in-azure-ad-apps.md)

## Types of permissions

**Delegated permissions** are used in the delegated access scenario. They're permissions that allow the app to act on a user's behalf. The app will never be able to access anything users themselves couldn't access. Delegated permissions are also referred to as scopes.

For example, imagine an application that has been granted the Files.Read.All delegated permission on behalf of Tom, the user. The app will only be able to read all files that only Tom can already access. It won't be able to read every file in the organization. For more information about scopes, see [openID connect scopes](v2-permissions-and-consent.md#openid-connect-scopes).

**Application permissions** are used in the direct access scenario, without a signed-in user present. The app will be able to access any data that the permission is associated with. For example, an app granted the Files.Read.All application permission will be able to read any file in the tenant.  Only an administrator can consent to application permissions.

Application permissions are also referred to as app roles. When app roles are granted to other applications, they're called applications permissions. There are other ways in which applications can be granted authorization for direct access. For example, an app can be assigned an Azure AD RBAC role. 

## How to grant permissions to applications

One way that applications are granted permissions is through consent.

## What is consent?

Consent is a process where users or admins authorize an application to access a protected resource. To indicate the level of access required, an application states the permissions it requires through a consent prompt.  For example, when a user attempts to sign into an application for the first time, the application could request permission to see the user’s profile and read the contents of the user's mailbox.

The key details of a consent prompt are the list of permissions the app requires and the publisher information. For more information about the consent prompt and the consent experience for both admins and end-users, see [application consent experience](application-consent-experience.md).

### User consent

User consent happens when a non-admin user attempts to sign into an application. The user provides their sign-in credentials. These credentials are checked to determine whether consent has already been granted. If no previous record of user or admin consent for the required permissions exists, the user is shown a consent prompt and asked to grant the application the requested permissions. In many cases, an admin may be required to grant consent on behalf of the user.

### Admin consent

Depending on the permissions they require, some applications might require an administrator to be the one who grants consent. For example, application permissions can only be consented to by an admin. Admins can grant consent for themselves or for the entire organization. For more information about user and admin consent, see [user and admin consent overview](../manage-apps/consent-and-permissions-overview.md)

### Preauthorization
 
Preauthorization allows a resource app owner to grant permissions without requiring callers to see a consent prompt. This way, an application that has been preauthorized won’t ask users to consent to permissions. Resource owners can perform preauthorization by making calls to Microsoft graph or by running scripts.

## Next steps
- [User and admin consent overview](../manage-apps/consent-and-permissions-overview.md)
- [Scopes and permissions](v2-permissions-and-consent.md)
