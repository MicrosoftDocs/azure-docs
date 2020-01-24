---
title: Protected Web API - overview 
titleSuffix: Microsoft identity platform
description: Learn how to build a protected web API (overview).
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
ms.custom: aaddev, identityplatformtop40
#Customer intent: As an application developer, I want to know how to write a protected web API using the Microsoft identity platform for developers.
---

# Scenario: Protected web API

In this scenario, we'll show you how you can expose a web API and how you can protect it so that only authenticated users can access the API. You'll want to enable authenticated users with both work and school accounts, or personal Microsoft personal accounts to use your web API.

## Prerequisites

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-prerequisites.md)]

## Specifics

Here are some specifics you need to know to protect web APIs:

- Your app registration must expose at least one scope. The token version accepted by your web API depends on the sign in audience.
- The configuration of the code for the web API must validate the token that's used when calling the web API.

## Next steps

> [!div class="nextstepaction"]
> [App registration](scenario-protected-web-api-app-registration.md)
