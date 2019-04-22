---
title: JavaScript Single Page Application - overview | Azure
description: Learn how to build a Single Page Application (overview)
services: active-directory
documentationcenter: dev-center-name
author: navyasric
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
ms.author: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a Single Page Application using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Single Page Application - overview

Learn all you need to build a Single Page Application.

## Pre-requisites

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-prerequisites.md)]

## Scenario overview

Many modern web applications are built as client side single page applications written using JavaScript or a SPA framework such as Angular, Vue.js and React.js. These applications run in a web browser and thus have different authentication characteristics than traditional server side web applications. The Microsoft identity platform enables single page applications to sign in users and get tokens to access backend services or web APIs using the [OAuth 2.0 implicit flow](./v2-oauth2-implicit-grant-flow.md). The implicit flow allows the application to get ID tokens to represent the authenticated user and also access tokens needed to call protected APIs.

![Single page apps](./media/scenarios/spa-app.svg)

Note that this authentication flow does not include application scenarios using cross-platform JavaScript frameworks such as Electron, React-Native, etc. since they require further capabilities for interaction with the native platforms.

### Getting started

You can create your first application by following the JS SPA quickstart:

> [!div class="nextstepaction"]
> [Single Page Application - Quickstart](./quickstart-v2-javascript.md)

### Specifics

The following aspects are required to enable this scenario for your application:

* Application registration with Azure AD involves enabling the implicit flow and setting a redirect URI to which tokens are returned.
* Application configuration with the registered application properties such as Application ID.
* Using MSAL library to perform the auth flow to sign in and acquire tokens.

## Next steps

> [!div class="nextstepaction"]
> [App registration](scenario-spa-app-registration.md)
