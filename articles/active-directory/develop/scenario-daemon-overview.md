---
title: Build a daemon app that calls web APIs
description: Learn how to build a daemon app that calls web APIs
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 12/19/2022
ms.author: dmwendia
ms.reviewer: jmprieur
ms.custom: aaddev, identityplatformtop40, engagement-fy23
#Customer intent: As an application developer, I want to know how to write a daemon app that can call web APIs by using the Microsoft identity platform.
---

# Scenario: Daemon application that calls web APIs

This scenario will guide you to build a daemon application that calls web APIs.

## Overview

Your application can acquire a token to call a web API on behalf of itself (not on behalf of a user). This scenario is useful for daemon applications. It uses the standard OAuth 2.0 [client credentials](v2-oauth2-client-creds-grant-flow.md) grant.

![Daemon apps](./media/scenario-daemon-app/daemon-app.svg)

Some examples of use cases for daemon apps include;

- Web applications that are used to provision or administer users or do batch processes in a directory
- Desktop applications (like Windows services on Windows or daemon processes on Linux) that perform batch jobs, or an operating system service that runs in the background
- Web APIs that need to manipulate directories, not specific users

There's another common case where non-daemon applications use client credentials, even when they act on behalf of users. This occurs when they need to access a web API or a resource under their own identity for technical reasons. An example is access to secrets in Azure Key Vault or Azure SQL Database for a cache.

You can't deploy a daemon application to a regular user's device, and a regular user can't access a daemon application. Only a limited set of IT administrators can access devices that have daemon applications running. This is so that a bad actor can't access a client secret or token from device traffic and act on behalf of the daemon application. The daemon application scenario doesn't replace device authentication.

Examples of non-daemon applications:
- A mobile application that accesses a web service on behalf of an application, but not on behalf of a user.
- An IoT device that accesses a web service on behalf of a device, but not on behalf of a user.

Applications that acquire a token for their own identities:

- Confidential client applications, given that they access resources independently of users, need to prove their identity. As they're rather sensitive apps, they need to be approved by the Microsoft Entra tenant admins.
- Have registered a secret (application password or certificate) with Microsoft Entra ID. This secret is passed in during the call to Microsoft Entra ID to get a token.

## Specifics

Users can't interact with a daemon application because it requires its own identity. This type of application requests an access token by using its application identity and presenting its application ID, credential (password or certificate), and application ID URI to Microsoft Entra ID. After successful authentication, the daemon receives an access token (and a refresh token) from the Microsoft identity platform. This token is then used to call the web API (and is refreshed as needed).

Because users can't interact with daemon applications, incremental consent isn't possible. All the required API permissions need to be configured at application registration. The code of the application just requests statically defined permissions. This also means that daemon applications won't support incremental consent.

For developers, the end-to-end experience for this scenario has the following aspects:

- Daemon applications can work only in Microsoft Entra tenants. It wouldn't make sense to build a daemon application that attempts to manipulate Microsoft personal accounts. If you're a line-of-business (LOB) app developer, you'll create your daemon app in your tenant. If you're an ISV, you might want to create a multitenant daemon application. Each tenant admin will need to provide consent.
- During [application registration](./scenario-daemon-app-registration.md), the reply URI isn't needed. Share secrets or certificates or signed assertions with Microsoft Entra ID. You also need to request application permissions and grant admin consent to use those app permissions.
- The [application configuration](./scenario-daemon-app-configuration.md) needs to provide client credentials as shared with Microsoft Entra ID during the application registration.
- The [scope](scenario-daemon-acquire-token.md#scopes-to-request) used to acquire a token with the client credentials flow needs to be a static scope.

## Recommended reading

[!INCLUDE [recommended-topics](./includes/scenarios/scenarios-prerequisites.md)]

## Next steps

Move on to the next article in this scenario,
[App registration](./scenario-daemon-app-registration.md).
