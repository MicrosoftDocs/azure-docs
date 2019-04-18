---
title: Daemon app calling Web APIs - scenario landing page overview | Azure
description: Learn how to build a daemon app that calls web apis
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/18/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a daemon app that can call Web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Scenario - Daemon application that calls Web APIs

Learn all you need to build a daemon application that calls Web APIs.

## Scenario overview

Your application can acquire a token to call a Web API on behalf of itself (not on behalf of a user). This scenario is useful for daemon applications. It's using the standard OAuth 2 [client credentials](v2-oauth2-client-creds-grant-flow.md) grant.

![Daemon apps](./media/scenario-daemon-app/daemon-app.svg)

Here are some examples of use cases for daemon apps:

- Web applications that are used to provision or administer users, or do batch processes in a directory
- Desktop applications (such as windows services on Windows, or daemons processes on Linux) that perform batch jobs, or an operating system service running in the background
- Web APIs, that need to manipulate directories, not specific users

There is another common case where non-daemon applications use client credentials: even when they act on behalf of users, they need to access a Web API or a resource with their identity for technical reasons. Example of such are access to secrets in KeyVault, or an Azure SQL database for a cache.

Applications acquiring a token for their own identities:

- are confidential client applications. These apps, given that they access resources independently of a user need to prove their identity. They're also rather sensitive apps, which they need to be approved by the Azure Active Directory tenant admins.
- have registered a secret (application password or certificate) with Azure AD. This secret is passed-in during the call to Azure AD to get a token.

## Specifics

> [!IMPORTANT]
> it’s important to understand that:
>
> - user interaction is not possible with a daemon application, which requires the application to have its own identity. This type of application requests an access token by using its application identity and presenting its  Application ID, credential (password or certificate), and application ID URI to Azure AD. After successful authentication, the daemon receives an access token (and a refresh token) from the Microsoft identity platform endpoint, which is then used to call the web API (and is refreshed as needed)
>
> - because user interaction is not possible, incremental consent won't be possible. Therefore, the all the required API permissions need to be configured at application registration, and the code of the application just requests statically defined permissions. This also means that daemon applications won't support incremental consent

The end to end experience of developers for this scenario has, therefore, specific aspects as:

- Daemon applications can only work in Azure AD tenants. It wouldn't make sense to build a daemon application that attempts to manipulate Microsoft personal accounts. If you're a Line of business (LOB) developer, you'll create your daemon app in your tenant. If you're an ISV, you might want to create a multi-tenant daemon application. It will need to be consented by each tenant admin.
- During the [Application registration](./scenario-daemon-app-registration.md), the Reply URI isn't needed, you need to share secrets or certificates with Azure AD, and you need to request applications permissions and grant admin consent to use those app permissions.
- The [Application configuration](./scenario-daemon-app-configuration.md) needs to provide client credentials as shared with Azure AD during the application registration
- The [scope](scenario-daemon-app-configuration.md#scopes-to-request) used to acquire a token with the client credentials flow needs to be a static scope.

## Next steps

> [!div class="nextstepaction"]
> [Daemon app - app registration](./scenario-daemon-app-registration.md)
