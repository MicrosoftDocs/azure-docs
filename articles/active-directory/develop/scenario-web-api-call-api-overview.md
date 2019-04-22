---
title: Web API that calls Web APIs - overview | Azure
description: Learn how to build a web API that calls Web APIs (overview)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
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
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a web API that calls Web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web API that calls Web APIs - overview

Learn all you need to build a web API that calls Web APIs.

## Prerequisites

This scenario "protected Web API that calls Web APIs" builds on top of the "Protect a Web API" scenario. If you have not already, please read [Protected Web API - Scenario](scenario-protected-web-api-overview.md) first.

## Scenario overview

- A client (Web, desktop, mobile, Single-page application) - not represented on the picture below - calls a protected Web API, providing a JWT bearer token in its "Authorization" Http Header.
- The protected Web API validates the token, and uses MSAL `AcquireTokenOnBehalfOf` method to request, to Azure AD, another token so that it can, itself, call a second Web API (named the downstream Web API) on behalf of the user.
- The protected Web API uses this token to call a downstream API, it can also later call `AcquireTokenSilent` to request tokens for other downstream APIs (but still on behalf of the same user). `AcquireTokenSilent` refreshes the token when needed.

![Web API calling a Web API](media/scenarios/web-api.svg)

## Specifics

The part of app registration related to the API permissions is classical. The application configuration involves using the OAuth 2.0 on behalf of flow to exchange the Jwt bearer token against a token for a downstream API. This token is added to the token cache where it's available in the Web API's controllers, which can acquire a token silently to call downstream APIs  

## Next steps

> [!div class="nextstepaction"]
> [App registration](scenario-web-api-call-api-app-registration.md)
