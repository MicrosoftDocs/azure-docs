---
title: Build a web app that calls web APIs - Microsoft identity platform | Azure
description: Learn how to build a web app that calls web APIs (overview)
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
#Customer intent: As an application developer, I want to know how to write a Web app that calls web APIs using the Microsoft identity platform for developers.
---

# Scenario: Web app that calls web APIs

Learn how to build a web app that signs in users on the Microsoft identity platform and then calls web APIs on behalf of the signed-in user.

## Prerequisites

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-prerequisites.md)]

This scenario supposes that you've gone through the following scenario:

> [!div class="nextstepaction"]
> [Web app that signs-in users](scenario-web-app-sign-user-overview.md)

## Overview

You add authentication to your Web App, which can therefore sign in users and calls a web API on behalf of the signed-in user.

![Web app that calls web APIs](./media/scenario-webapp/web-app.svg)

Web Apps that calls web APIs:

- are confidential client applications.
- that's why they've registered a secret (application password or certificate) with Azure AD. This secret is passed-in during the call to Azure AD to get a token

## Specifics

> [!NOTE]
> Adding sign-in to a Web App does not use the MSAL libraries as this is about protecting the Web App. Protecting libraries is achieved by libraries named Middleware. This was the object of the previous scenario [Sign-in users to a Web App](scenario-web-app-sign-user-overview.md)
>
> When calling web APIs from a Web App, you will need to get access tokens for these web APIs. You can use MSAL libraries to acquire these tokens.

The end to end experience of developers for this scenario has, therefore, specific aspects as:

- During the [Application registration](scenario-web-app-call-api-app-registration.md), you'll need to provide one, or several (if you deploy your app to several locations) Reply URIs, secrets, or certificates need to be shared with Azure AD.
- The [Application configuration](scenario-web-app-call-api-app-configuration.md) needs to provide client credentials as shared with Azure AD during the application registration

## Next steps

> [!div class="nextstepaction"]
> [App registration](scenario-web-app-call-api-app-registration.md)
