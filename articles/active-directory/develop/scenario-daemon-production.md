---
title: Move a daemon app that calls web APIs to production - Microsoft identity platform | Azure
description: Learn how to move a daemon app that calls web APIs to production
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/30/2019
ms.author: jmprieur
ms.custom: aaddev

#Customer intent: As an application developer, I want to know how to write a daemon app that can call web APIs by using the Microsoft identity platform for developers.

---

# Daemon app that calls web APIs - move to production

Now that you know how to acquire and use a token for a service-to-service call, learn how to move your app to production.

## Deployment - multitenant daemon apps

If you're an ISV creating a daemon application that can run in several tenants, you need to make sure that the tenant admin:

- Provisions a service principal for the application.
- Grants consent to the application.

You'll need to explain to your customers how to perform these operations. For more info, see [Requesting consent for an entire tenant](v2-permissions-and-consent.md#requesting-consent-for-an-entire-tenant).

[!INCLUDE [Move to production common steps](../../../includes/active-directory-develop-scenarios-production.md)]

## Next steps

Here are a few links to help you learn more:

# [.NET](#tab/dotnet)

- Quickstart: [Acquire a token and call Microsoft Graph API from a console app by using app's identity](./quickstart-v2-netcore-daemon.md).
- Reference documentation for:
  - Instantiating [ConfidentialClientApplication](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.confidentialclientapplicationbuilder).
  - Calling [AcquireTokenForClient](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.acquiretokenforclientparameterbuilder).
- Other samples/tutorials:
  - [microsoft-identity-platform-console-daemon](https://github.com/Azure-Samples/microsoft-identity-platform-console-daemon) features a simple .NET Core daemon console application that displays the users of a tenant querying Microsoft Graph.

    ![Sample daemon app topology](media/scenario-daemon-app/daemon-app-sample.svg)

    The same sample also illustrates a variation with certificates:

    ![Sample daemon app topology - certificates](media/scenario-daemon-app/daemon-app-sample-with-certificate.svg)

  - [microsoft-identity-platform-aspnet-webapp-daemon](https://github.com/Azure-Samples/microsoft-identity-platform-aspnet-webapp-daemon) features an ASP.NET MVC web application that syncs data from Microsoft Graph by using the identity of the application instead of on behalf of a user. This sample also illustrates the admin consent process.

    ![topology](media/scenario-daemon-app/damon-app-sample-web.svg)

# [Python](#tab/python)

Try the quickstart [Acquire a token and call Microsoft Graph API from a Python console app using app's identity](./quickstart-v2-python-daemon.md).

# [Java](#tab/java)

MSAL Java is currently in public preview. For more info, see [MSAL Java dev samples](https://github.com/AzureAD/microsoft-authentication-library-for-java/tree/dev/src/samples).

---
