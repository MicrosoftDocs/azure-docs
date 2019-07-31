---
title: Daemon app calling web APIs (move to production) - Microsoft identity platform
description: Learn how to build a daemon app that calls web APIs (move to production)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a daemon app that can call web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Daemon app that calls web APIs - move to production

Now that you know how to acquire and use a token for a service-to-service call, learn how to move your app to production.

## Deployment - case of multi-tenant daemon apps

If you're an ISV creating a daemon application that can run in several tenants, you'll need to make sure that the tenant admins:

- Provisions a service principal for the application
- Grants consent to the application

You'll need to explain to your customers how to perform these operations. For more info, see [Requesting consent for an entire tenant](v2-permissions-and-consent.md#requesting-consent-for-an-entire-tenant).

[!INCLUDE [Move to production common steps](../../../includes/active-directory-develop-scenarios-production.md)]

## Next steps

Here are a few links to learn more:

### .NET

- If you have not already, try the quickstart [Acquire a token and call Microsoft Graph API from a console app using app's identity](./quickstart-v2-netcore-daemon.md).
- Reference documentation for:
  - Instantiating [ConfidentialClientApplication](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.confidentialclientapplicationbuilder)
  - Calling [AcquireTokenForClient](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.acquiretokenforclientparameterbuilder)
- Other samples/tutorials:
  - [microsoft-identity-platform-console-daemon](https://github.com/Azure-Samples/microsoft-identity-platform-console-daemon) features a simple .NET Core daemon console application that displays the users of a tenant querying the Microsoft Graph.

    ![topology](media/scenario-daemon-app/daemon-app-sample.svg)

    The same sample also illustrates the variation with certificates.

    ![topology](media/scenario-daemon-app/daemon-app-sample-with-certificate.svg)

  - [microsoft-identity-platform-aspnet-webapp-daemon](https://github.com/Azure-Samples/microsoft-identity-platform-aspnet-webapp-daemon) features an ASP.NET MVC web application that syncs data from Microsoft Graph using the identity of the application instead of on behalf of a user. The sample also illustrates the admin consent process.

    ![topology](media/scenario-daemon-app/damon-app-sample-web.svg)

### Python

MSAL Python is currently in public preview. For more info, see [MSAL Python client credentials in-repository sample](https://github.com/AzureAD/azure-activedirectory-library-for-python/blob/dev/sample/client_credentials_sample.py).

### Java

MSAL Python is currently in public preview. For more info, see [MSAL Java in-repository samples](https://github.com/AzureAD/azure-activedirectory-library-for-java/tree/dev/src/samples).