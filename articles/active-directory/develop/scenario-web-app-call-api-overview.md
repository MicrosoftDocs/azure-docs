---
title: Build a web app that calls web APIs - Microsoft identity platform | Azure
description: Learn how to build a web app that calls web APIs (overview)
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a web app that calls web APIs by using the Microsoft identity platform for developers.
---

# Scenario: A web app that calls web APIs

Learn how to build a web app that signs users in to the Microsoft identity platform, and then calls web APIs on behalf of the signed-in user.

## Prerequisites

[!INCLUDE [Prerequisites](../../../includes/active-directory-develop-scenarios-prerequisites.md)]

This scenario assumes that you've already gone through the following scenario:

> [!div class="nextstepaction"]
> [Web app that signs in users](scenario-web-app-sign-user-overview.md)

## Overview

You add authentication to your web app so that it can sign users in and call a web API on behalf of the signed-in user.

![Web app that calls web APIs](./media/scenario-webapp/web-app.svg)

Web apps that call web APIs are confidential client applications.
That's why they register a secret (an application password or certificate) with Azure Active Directory (Azure AD). This secret is passed in during the call to Azure AD to get a token.

## Specifics

> [!NOTE]
> Adding sign-in to a web app is about protecting the web app itself. That protection is achieved by using *middleware* libraries, not the Microsoft Authentication Library (MSAL). The preceding scenario, [Web app that signs in users](scenario-web-app-sign-user-overview.md), covered that subject.
>
> This scenario covers how to call web APIs from a web app. You must get access tokens for those web APIs. You use MSAL libraries to acquire these tokens.

Development for this scenario involves these specific tasks:

- During [application registration](scenario-web-app-call-api-app-registration.md), you must provide a reply URI, secret, or certificate to be shared with Azure AD. If you deploy your app to several locations, you'll provide this information for each location.
- The [application configuration](scenario-web-app-call-api-app-configuration.md) must provide the client credentials that were shared with Azure AD during application registration.

## Next steps

> [!div class="nextstepaction"]
> [A web app that calls web APIs: App registration](scenario-web-app-call-api-app-registration.md)
