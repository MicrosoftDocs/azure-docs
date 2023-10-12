---
title: Sign in users from a Web app
description: Learn how to build a web app that signs in users (overview)
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/12/2022
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: aaddev, identityplatformtop40, engagement-fy23
#Customer intent: As an application developer, I want to know how to write a web app that signs in users by using the Microsoft identity platform.
---

# Scenario: Web app that signs in users

Learn all you need to build a web app that uses the Microsoft identity platform to sign in users.

## Getting started

# [ASP.NET Core](#tab/aspnetcore)

If you want to create your first portable (ASP.NET Core) web app that signs in users, follow this quickstart:

[Quickstart: Use ASP.NET Core to add sign-in with Microsoft to a web app](quickstart-web-app-aspnet-core-sign-in.md)

# [ASP.NET](#tab/aspnet)

If you want to understand how to add sign-in to an existing ASP.NET web application, try the following quickstart:

[Quickstart: Use ASP.NET to add sign-in with Microsoft to a web app](quickstart-web-app-aspnet-sign-in.md)

# [Java](#tab/java)

If you're a Java developer, try the following quickstart:

[Quickstart: Use Java to add sign-in with Microsoft to a web app](quickstart-web-app-java-sign-in.md)

# [Node.js](#tab/nodejs)

If you're a Node.js developer, try the following quickstart:

[Quickstart: Use Node.js to add sign-in with Microsoft to a web app](quickstart-web-app-nodejs-msal-sign-in.md)

# [Python](#tab/python)

If you develop with Python, try the following quickstart:

[Quickstart: Use Python to add sign-in with Microsoft to a web app](quickstart-web-app-python-sign-in.md)

---

## Overview

You add authentication to your web app so that it can sign in users. Adding authentication enables your web app to access limited profile information in order to customize the experience for users.

Web apps authenticate a user in a web browser. In this scenario, the web app directs the user's browser to sign them in to Microsoft Entra ID. Microsoft Entra ID returns a sign-in response through the user's browser, which contains claims about the user in a security token. Signing in users takes advantage of the [OpenID Connect](./v2-protocols-oidc.md) standard protocol, simplified by the use of middleware [libraries](scenario-web-app-sign-user-app-configuration.md#microsoft-libraries-supporting-web-apps).

![Web app signs in users](./media/scenario-webapp/scenario-webapp-signs-in-users.svg)

As a second phase, you can enable your application to call web APIs on behalf of the signed-in user. This next phase is a different scenario, which you'll find in [Web app that calls web APIs](scenario-web-app-call-api-overview.md).

## Specifics

- During the application registration, provide one or several (if you deploy your app to several locations) reply URIs. For ASP.NET, you will need to select **ID tokens** under **Implicit grant and hybrid flows**. Finally, set up a sign-out URI so that the application reacts to users signing out.
- In the app's code, provide the authority to which the web app delegates sign-in. Consider customizing token validation for certain scenarios (in particular, in partner scenarios).
- Web applications support any account types. For more information, see [Supported account types](v2-supported-account-types.md).

## Recommended reading

[!INCLUDE [recommended-topics](./includes/scenarios/scenarios-prerequisites.md)]

## Next steps

# [ASP.NET Core](#tab/aspnetcore)

Move on to the next article in this scenario,
[App registration](./scenario-web-app-sign-user-app-registration.md?tabs=aspnetcore).

# [ASP.NET](#tab/aspnet)

Move on to the next article in this scenario,
[App registration](./scenario-web-app-sign-user-app-registration.md?tabs=aspnet).

# [Java](#tab/java)

Move on to the next article in this scenario,
[App registration](./scenario-web-app-sign-user-app-registration.md?tabs=java).

# [Node.js](#tab/nodejs)

Move on to the next article in this scenario,
[App registration](./scenario-web-app-sign-user-app-registration.md?tabs=nodejs).

# [Python](#tab/python)

Move on to the next article in this scenario,
[App registration](./scenario-web-app-sign-user-app-registration.md?tabs=python).

---
