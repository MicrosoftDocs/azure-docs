---
title: JavaScript single-page application scenario overview - Microsoft identity platform
description: Learn how to build a single-page application (scenario overview) that integrates Microsoft identity platform.
services: active-directory
documentationcenter: dev-center-name
author: navyasric
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a single-page application using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Scenario: Single-page application

Learn all you need to build a single-page application (SPA).

## Prerequisites

[!INCLUDE [Prerequisites](../../../includes/active-directory-develop-scenarios-prerequisites.md)]

## Getting started

You can create your first application by following the JavaScript SPA quickstart:

> [!div class="nextstepaction"]
> [Quickstart: Single-page application](./quickstart-v2-javascript.md)

## Overview

Many modern web applications are built as client-side single-page applications written using JavaScript or a SPA framework such as Angular, Vue.js, and React.js. These applications run in a web browser and have different authentication characteristics than traditional server-side web applications. The Microsoft identity platform enables single-page applications to sign in users and get tokens to access backend services or web APIs using the [OAuth 2.0 implicit flow](./v2-oauth2-implicit-grant-flow.md). The implicit flow allows the application to get ID tokens to represent the authenticated user and also access tokens needed to call protected APIs.

![Single-page applications](./media/scenarios/spa-app.svg)

This authentication flow does not include application scenarios using cross-platform JavaScript frameworks such as Electron, React-Native and so on. since they require further capabilities for interaction with the native platforms.

## Specifics

The following aspects are required to enable this scenario for your application:

* Application registration with Azure AD involves enabling the implicit flow and setting a redirect URI to which tokens are returned.
* Application configuration with the registered application properties such as Application ID.
* Using MSAL library to do the auth flow to sign in and acquire tokens.

## Next steps

> [!div class="nextstepaction"]
> [App registration](scenario-spa-app-registration.md)
