---
title: Register daemon apps that call web APIs - Microsoft identity platform | Azure
description: Learn how to build a daemon app that calls web APIs - app registration
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/15/2019
ms.author: jmprieur
ms.custom: aaddev 

#Customer intent: As an application developer, I want to know how to write a daemon app that can call web APIs by using the Microsoft identity platform for developers.

---

# Daemon app that calls web APIs - app registration

For a daemon application, here's what you need to know when you register the app.

## Supported account types

Daemon applications make sense only in Azure AD tenants. So when you create the application, you need to choose one of the following options:

- **Accounts in this organizational directory only**. This choice is the most common one because daemon applications are usually written by line-of-business (LOB) developers.
- **Accounts in any organizational directory**. You'll make this choice if you're an ISV providing a utility tool to your customers. You'll need your customers' tenant admins to approve it.

## Authentication - no reply URI needed

In the case where your confidential client application uses *only* the client credentials flow, the reply URI doesn't need to be registered. It's not needed for the application configuration or construction. The client credentials flow doesn't use it.

## API permissions - app permissions and admin consent

A daemon application can request only application permissions to APIs (not delegated permissions). On the **API permissions** page for the application registration, after you've selected **Add a permission** and chosen the API family, choose **Application permissions**, and then select your permissions.

![App permissions and admin consent](media/scenario-daemon-app/app-permissions-and-admin-consent.png)

> [!NOTE]
> The web API that you want to call needs to define *application permissions (app roles)*, not delegated permissions. For details on how to expose such an API, see [Protected web API: App registration - when your web API is called by a daemon app](scenario-protected-web-api-app-registration.md#if-your-web-api-is-called-by-a-daemon-app).

Daemon applications require that a tenant admin pre-consent to the application calling the web API. Tenant admins provide this consent on the same **API permission** page by selecting **Grant admin consent to *our organization***

If you're an ISV building a multitenant application, you should read the section [Deployment - case of multitenant daemon apps](scenario-daemon-production.md#deployment---multitenant-daemon-apps).

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-registration-client-secrets.md)]

## Next steps

> [!div class="nextstepaction"]
> [Daemon app - app code configuration](./scenario-daemon-app-configuration.md)
