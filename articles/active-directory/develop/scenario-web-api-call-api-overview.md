---
title: Build a web API that calls web APIs | Azure
titleSuffix: Microsoft identity platform
description: Learn how to build a web API that calls downstream web APIs (overview).
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 03/03/2021
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs by using the Microsoft identity platform.
---

# Scenario: A web API that calls web APIs

Learn what you need to know to build a web API that calls web APIs.

## Prerequisites

This scenario, in which a protected web API calls other web APIs, builds on [Scenario: Protected web API](scenario-protected-web-api-overview.md).

## Overview

- A web, desktop, mobile, or single-page application client (not represented in the accompanying diagram) calls a protected web API and provides a JSON Web Token (JWT) bearer token in its "Authorization" HTTP header.
- The protected web API validates the token and uses the Microsoft Authentication Library (MSAL) `AcquireTokenOnBehalfOf` method to request another token from Azure Active Directory (Azure AD) so that the protected web API can call a second web API, or downstream web API, on behalf of the user. `AcquireTokenOnBehalfOf` refreshes the token when needed.
![Diagram of a web API calling a web API](media/scenarios/web-api.svg)

## Specifics

The app registration part that's related to API permissions is classical. The app configuration involves using the OAuth 2.0 On-Behalf-Of flow to exchange the JWT bearer token against a token for a downstream API. This token is added to the token cache, where it's available in the web API's controllers, and it can then acquire a token silently to call downstream APIs.

## Next steps

Move on to the next article in this scenario,
[App registration](scenario-web-api-call-api-app-registration.md).
