---
title: Web API that calls downstream web APIs (overview) - Microsoft identity platform
description: Learn how to build a web API that calls downstream web APIs (overview).
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
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Scenario: Web API that calls web APIs

Learn all you need to build a web API that calls web APIs.

## Prerequisites

This scenario, protected web API that calls web APIs, builds on top of the "Protect a web API" scenario. To learn more about this foundational scenario, see [Protected Web API - Scenario](scenario-protected-web-api-overview.md) first.

## Overview

- A client (web, desktop, mobile, or single-page application) - not represented on the diagram below - calls a protected web API and provides a JWT bearer token in its "Authorization" Http header.
- The protected web API validates the token and uses the MSAL `AcquireTokenOnBehalfOf` method to request (from Azure AD) another token so that it can, itself, call a second web API (named the downstream web API) on behalf of the user.
- The protected web API uses this token to call a downstream API. It can also call `AcquireTokenSilent`later to request tokens for other downstream APIs (but still on behalf of the same user). `AcquireTokenSilent` refreshes the token when needed.

![Web API calling a web API](media/scenarios/web-api.svg)

## Specifics

The part of app registration related to the API permissions is classical. The application configuration involves using the OAuth 2.0 on-behalf-of flow to exchange the JWT bearer token against a token for a downstream API. This token is added to the token cache, where it's available in the web API's controllers, and can acquire a token silently to call downstream APIs.

## Next steps

> [!div class="nextstepaction"]
> [App registration](scenario-web-api-call-api-app-registration.md)
