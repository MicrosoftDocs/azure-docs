---
title: Protected web API - overview
titleSuffix: Microsoft identity platform
description: Learn how to build a protected web API (overview).
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 07/14/2020
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40
#Customer intent: As an application developer, I want to know how to write a protected web API using the Microsoft identity platform for developers.
---

# Scenario: Protected web API

In this scenario, you learn how to expose a web API. You also learn how to protect the web API so that only authenticated users can access it.

To use your web API, you need to either enable authenticated users with both work and school accounts or enable Microsoft personal accounts.

## Prerequisites

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-prerequisites.md)]

## Specifics

Here is specific information you need to know to protect web APIs:

- Your app registration must expose at least one *scope* or one *application role*.
  - Scopes are exposed by web APIs that are called on behalf of a user.
  - Application roles are exposed by web APIs called by daemon applications (that calls your web API on their own behalf).
- If you create a new web API app registration, choose the [access token version](reference-app-manifest.md#accesstokenacceptedversion-attribute) accepted by your web API to `2`. For legacy web APIs, the accepted token version can be `null`, but this value restricts the sign-in audience to organizations only, and personal Microsoft accounts (MSA) won't be supported.
- The code configuration for the web API must validate the token used when the web API is called.
- The code in the controller actions must validate the roles or scopes in the token.

## Next steps

> [!div class="nextstepaction"]
> [App registration](scenario-protected-web-api-app-registration.md)
