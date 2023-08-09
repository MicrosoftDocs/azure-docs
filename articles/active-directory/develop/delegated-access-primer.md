---
title: Microsoft identity platform delegated access scenario
description: Learn about when and how to use delegated access in the Microsoft identity platform endpoint.
services: active-directory
author: omondiatieno
manager: celesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 03/15/2023
ms.author: jomondi
ms.reviewer: jawoods, ludwignick, phsignor

---
# Understanding delegated access

When a user signs into an app and uses it to access some other resource, like Microsoft Graph, the app will first need to ask for permission to access this resource on the user’s behalf. This common scenario is called delegated access.

> [!VIDEO https://learn-video.azurefd.net/vod/player?show=one-dev-minute&ep=how-do-delegated-permissions-work]

## Why should I use delegated access?

People frequently use different applications to access their data from cloud services. For example, someone might want to use a favorite PDF reader application to view files stored in their OneDrive. Another example can be a company’s line-of-business application that might retrieve shared information about their coworkers so they can easily choose reviewers for a request. In such cases, the client application, the PDF reader, or the company’s request approval tool needs to be authorized to access this data on behalf of the user who signed into the application.

Use delegated access whenever you want to let a signed-in user work with their own resources or resources they can access. Whether it’s an admin setting up policies for their entire organization or a user deleting an email in their inbox, all scenarios involving user actions should use delegated access.

![Diagram shows illustration of delegated access scenario.](./media/delegated-access-primer/delegated-access.png)

In contrast, delegated access is usually a poor choice for scenarios that must run without a signed-in user, like automation. It may also be a poor choice for scenarios that involve accessing many users’ resources, like data loss prevention or backups. Consider using [application-only access](permissions-consent-overview.md) for these types of operations.

## Requesting scopes as a client app

Your app will need to ask the user to grant a specific scope, or set of scopes, for the resource app  you want to access. Scopes may also be referred to as delegated permissions. These scopes describe which resources and operations your app wants  to perform on the user’s behalf. For example, if you want your app to show the user a list of recently received mail messages and chat messages, you might ask the user to consent to the Microsoft Graph `Mail.Read` and `Chat.Read` scopes.

Once your app has requested a scope, a user or admin will need to grant the requested access. Consumer users with Microsoft Accounts, like Outlook.com or Xbox Live accounts, can always grant scopes for themselves. Organizational users with Azure AD accounts may or may not be able to grant scopes, depending on their organization’s settings. If an organizational user can't consent to scopes directly, they'll need to ask their organization’s administrator to consent for them.

Always follow the principle of least privilege: you should never request scopes that your app doesn’t need. This principle helps limit the security risk if your app is compromised and makes it easier for administrators to grant your app access. For example, if your app only needs to list the chats a user belongs to but doesn’t need to show the chat messages themselves, you should request the more limited Microsoft Graph `Chat.ReadBasic` scope instead of `Chat.Read`. For more information about openID scopes, see [OpenID scopes](scopes-oidc.md).

## Designing and publishing scopes for a resource  service

If you’re building an API and want to allow delegated access on behalf of users, you’ll need to create scopes that other apps can request. These scopes should describe the actions or resources available to the client. You should consider developer scenarios when designing your scopes.


## How does delegated access work?

The most important thing to remember about delegated access is that both your client app and the signed-in user need to be properly authorized. Granting a scope isn't enough. If either the client app doesn’t have the right scope, or the user doesn’t have sufficient rights to read or modify the resource, then the call will fail.

- **Client app authorization** - Client apps are authorized by granting scopes. When a client app is granted a scope by a user or admin to access some resource, that grant will be recorded in Azure AD. All delegated access tokens that are requested by the client to access the resource on behalf of the relevant user will then contain those scopes’ claim values in the `scp` claim. The resource app checks this claim to determine whether the client app has been granted the correct scope for the call.
- **User authorization** - Users are authorized by the resource you’re calling. Resource apps may use one or more systems for user authorization, such as [role-based access control](custom-rbac-for-developers.md), ownership/membership relationships, access control lists, or other checks. For example, Azure AD checks that a user has been assigned to an app management or general admin role before allowing them to delete an organization’s applications, but also allows all users to delete applications that they own. Similarly, SharePoint Online service checks that a user has appropriate owner or reader rights over a file before allowing that user to open it.

## Delegated access example – OneDrive via Microsoft Graph

Consider the following example: 

Alice wants to use a client app to open a file protected by a resource API, Microsoft Graph. For user authorization, the OneDrive service will check whether the file is stored in Alice’s drive. If it’s stored in another user’s drive, then OneDrive will deny Alice’s request as unauthorized, since Alice doesn't have the right to read other users’ drives. 

For client app authorization, OneDrive will check whether the client making the call has been granted the `Files.Read` scope on behalf of the signed-in user. In this case, the signed-in user is Alice. If `Files.Read` hasn’t been granted to the app for Alice, then OneDrive will also fail the request.

| GET /drives/{id}/files/{id} | Client app granted `Files.Read` scope for Alice | Client app not granted `Files.Read` scope for Alice |
| ----- | ----- | ----- |
| The document is in Alice’s OneDrive. | 200 – Access granted. | 403 - Unauthorized. Alice (or her admin) hasn’t allowed this client to read her files. |
| The document is in another user’s OneDrive*. | 403 - Unauthorized. Alice doesn’t have rights to read this file. Even though the client has been granted `Files.Read` it should be denied when acting on Alice’s behalf. | 403 – Unauthorized. Alice doesn’t have rights to read this file, and the client isn’t allowed to read files she has access to either. | 

The example given is simplified to illustrate delegated authorization. The production OneDrive service supports many other access scenarios, such as shared files.

## See also

- [Open connect scopes](scopes-oidc.md)
- [RBAC roles](custom-rbac-for-developers.md)
- [Overview of permissions in Microsoft Graph](/graph/permissions-overview)
- [Microsoft Graph permissions reference](/graph/permissions-reference)
