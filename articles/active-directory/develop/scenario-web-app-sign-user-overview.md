---
title: Web app that signs in users (overview) - Microsoft identity platform
description: Learn how to build a web app that signs in users (overview)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a web app that signs-in users using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Scenario: Web app that signs in users

Learn all you need to build a web app that signs-in users with the Microsoft identity platform.

## Prerequisites

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-prerequisites.md)]

## Getting started

If you want to create your first portable (ASP.NET Core) web apps that sign in users, follow this quickstart:

> [!div class="nextstepaction"]
> [Quickstart: ASP.NET Core web app that signs-in users](quickstart-v2-aspnet-core-webapp.md)

If you prefer to stay with ASP.NET, try out the following tutorial:

> [!div class="nextstepaction"]
> [Quickstart: ASP.NET web app that signs-in users](quickstart-v2-aspnet-webapp.md)

## Overview

You add authentication to your web app, so that it can sign in users. Adding authentication enables your web app to access limited profile information, and, for instance customize the experience you offer to its users. Web apps authenticate a user in a web browser. In this scenario, the web application directs the user’s browser to sign them in to Azure AD. Azure AD returns a sign-in response through the user’s browser, which contains claims about the user in a security token. Signing-in users leverage the [Open ID Connect](./v2-protocols-oidc.md) standard protocol itself simplified by the use of middleware [libraries](scenario-web-app-sign-user-app-configuration.md#libraries-used-to-protect-web-apps).

![Web app signs-in users](./media/scenario-webapp/scenario-webapp-signs-in-users.svg)

As a second phase you can also enable your application to call Web APIs on behalf of the signed-in user. This next phase is a different scenario, which you'll find in [Web App calls Web APIs](scenario-web-app-call-api-overview.md)

> [!NOTE]
> Adding sign-in to a web app is about protecting the web app, and validating a user token, which is what  **middleware** libraries do. This scenario does not require yet the Microsoft Authentication Libraries (MSAL), which are about acquiring a token to call protected APIs. The authentication libraries will only be introduced in the follow-up scenario when the web app needs to call web APIs.

## Specifics

- During the application registration, you'll need to provide one, or several (if you deploy your app to several locations) Reply URIs. In some cases (ASP.NET/ASP.NET Core), you'll need to enable the IDToken. Finally you'll want to set up a sign-out URI so that your application reacts to users signing-out.
- In the code for your application, you'll need to provide the authority to which you web app delegates sign-in. You might want to customize token validation (in particular in ISV scenarios).
- Web applications support any account types. For more info, see [Supported account types](v2-supported-account-types.md).

## Next steps

> [!div class="nextstepaction"]
> [App registration](scenario-web-app-sign-user-app-registration.md)
