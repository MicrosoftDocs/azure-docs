---
title: Integrate with Microsoft identity platform | Azure
description: Learn about best practices and common oversights when integrating with the Microsoft identity platform.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: celested
ms.reviewer: lenalepa
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about security best practices so I can integrate my application with Microsoft identity platform.
---

# Microsoft identity platform integration checklist

## Introduction

The Microsoft identity platform allows developers to build applications that sign in all Microsoft identities and get tokens to call Microsoft APIs or APIs that developers have built. It’s a full-featured platform that consists of an authentication service, open-source libraries, application registration and configuration, documentation, code samples, and more.

This Microsoft identity platform integration checklist is intended to guide you to a high-quality and secure integration. It's not intended to review your entire application but rather focuses on highlighting best practices and common oversights when integrating with the Microsoft identity platform. It contains items that should be reviewed on a regular basis to ensure that a high-quality and secure integration is maintained. The contents of the checklist are subject to change as we make improvements to our platform.

If you’re just getting started, we recommend checking out our [documentation](index.yml).

## Testing your integration

Use the following checklist to ensure that your application is effectively integrated with the [Microsoft identity platform](https://docs.microsoft.com/legal/mdsa).

### Basics

> [!div class="checklist"]
> * Read and understand the [Microsoft Platform Policies](https://docs.microsoft.com/legal/mdsa). Ensure that your application adheres to the terms outlined as they are designed to protect our users and our platform.

### Ownership

> [!div class="checklist"]
> * Ensure the information associated with the account you use to register and manage apps is up to date.

### Branding

> [!div class="checklist"]
> * Ensure you adhere to our [Branding guidelines for applications](howto-add-branding-in-azure-ad-apps.md).
> * Ensure you have provided a meaningful name and logo for your application. This information appears on your application’s consent prompt. Ensure that your name and logo are representative of your company/product so that users can make informed decisions. Ensure that you are not violating any trademarks.

### Privacy

> [!div class="checklist"]
> * Ensure you have provided links to your terms of service and privacy statement.

### Security

> [!div class="checklist"]
> * Maintain ownership of all your redirect URIs and keep the DNS records for them up to date. Do not use wildcards (*) in your URIs. For web apps, ensure all URIs are secure and encrypted (e.g. using https schemes). For public clients, use platform-specific redirect URIs if applicable (mainly iOS and Android); otherwise, use redirect URIs with a high amount of randomness to prevent collisions when calling back to your app. If your app is being used from a isolated web agent, you may use https://login.microsoftonline.com/nativeclient. Review and trim all unused or unnecessary redirect URIs on a regular basis.
> * If your app is registered in a directory, minimize and manually monitor the list of app registration owners.
> * Do not enable support for the [OAuth2 implicit grant flow](v2-oauth2-implicit-grant-flow.md) unless explicitly required. Learn about the valid scenario [here](v1-oauth2-implicit-grant-flow.md#suitable-scenarios-for-the-oauth2-implicit-grant).
> * Do not use [resource owner password credential flow (ROPC)](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth-ropc) which directly handles users’ passwords. This flow requires a high degree of trust and user exposure and should only be used when other, more secure, flows cannot be used.
> * Protect and manage your app credentials. Use [certificate credentials](active-directory-certificate-credentials.md), not password credentials (client secrets). If you must use a password credential, do not set it manually. Do not store credentials in code or config, and never allow them to be handled by humans. If possible, use [managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) or [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis) to store and regularly rotate your credentials.
> * Ensure your application is requesting the least privilege permissions. You should only ask for permissions that your application absolutely needs, and only when you need them. Understand the different [types of permissions](v1-permissions-and-consent.md#types-of-permissions). Only use application permissions if required; use delegated permissions where possible. For a full list of Microsoft Graph permissions, see this [permissions reference](https://docs.microsoft.com/graph/permissions-reference).
> * If you are securing an API using the Microsoft identity platform, carefully think through the permissions it should expose. Consider what is the right granularity for your solution and which permission(s) require admin consent. Make sure to check for expected permissions in the incoming tokens before making any authorization decisions.

### Implementation

> [!div class="checklist"]
> * Use modern authentication solutions (OAuth 2.0, [OpenID Connect](v2-protocols-oidc.md)) to securely sign in your users.
> * Don’t implement the protocols yourself – use [Microsoft-supported authentication libraries](reference-v2-libraries.md) (MSAL, server middleware). Ensure you are using the latest version of the authentication library that you have integrated with.
> * If the data your app requires is available through [Microsoft Graph](https://developer.microsoft.com/graph), request permissions for this data using the Microsoft Graph endpoint rather than the individual API.

### End user experience

> [!div class="checklist"]
> * [Understand the consent experience](application-consent-experience.md) and thoughtfully configure the pieces of your app’s consent prompt so that end users and admins have enough information to determine if they trust your app.
> * Minimize the number of times a user needs to enter login credentials while using your app by attempting silent authentication (silent token acquisition) before interactive flows.
> * Do not use “prompt=consent” for every sign-in. Only use prompt=consent if you’ve determined that you need to ask for consent for additional permissions (e.g. if you’ve changed your app’s required permissions).
> * Where applicable, enrich your application with user data. Using the [Microsoft Graph API](https://developer.microsoft.com/graph) is an easy way to do this. The [Graph explorer](https://developer.microsoft.com/graph/graph-explorer) is a tool that can help you get started.
> * Register the full set of permissions your app requires so admins can grant consent easily to their tenant. Use [incremental consent](azure-ad-endpoint-comparison.md#incremental-and-dynamic-consent) at run time to help users understand why your app is requesting permissions that may concern or confuse users when requested on first start.
> * Implement a [clean single sign-out experience](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-6-SignOut). It’s both a privacy and a security requirement and makes for a good user experience.

### Testing

> [!div class="checklist"]
> * Ensure you have tested for [conditional access policies](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-6-SignOut) that may affect your users’ ability to use your application.
> * Ensure you have tested your application with all possible accounts that you plan to support (e.g. work or school accounts, personal Microsoft accounts, child accounts and sovereign accounts).
