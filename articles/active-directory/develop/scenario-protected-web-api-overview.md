---
title: Protected web API - overview
description: Learn how to build a protected web API (overview).
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 12/19/2022
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: aaddev, identityplatformtop40, engagement-fy23
#Customer intent: As an application developer, I want to know how to write a protected web API using the Microsoft identity platform for developers.
---

# Scenario: Protected web API

In this scenario, you'll learn how to expose a web API and how to protect it so that only authenticated users can access it.

To use your web API, you either enable authenticated users with both work and school accounts or enable Microsoft personal accounts.

## Specifics

The specific information you need to know to protect web APIs are:

- Your app registration must expose at least one _scope_ or one _application role_.
  - Scopes are exposed by web APIs that are called on behalf of a user.
  - Application roles are exposed by web APIs called by daemon applications (apps that call your web API on their own behalf).
- If you create a new web API app registration, choose the [access token version](reference-app-manifest.md#accesstokenacceptedversion-attribute) accepted by your web API to the value of `2`. For legacy web APIs, the accepted token version can be `null`, but this value restricts the sign-in audience to organizations only, and personal Microsoft accounts (MSA) won't be supported.
- The code configuration for the web API must validate the token used when the web API is called.
- The code in the controller actions must validate the roles or scopes in the token.

## Recommended reading

[!INCLUDE [recommended-topics](./includes/scenarios/scenarios-prerequisites.md)]

## Next steps

Move on to the next article in this scenario,
[App registration](scenario-protected-web-api-app-registration.md).
