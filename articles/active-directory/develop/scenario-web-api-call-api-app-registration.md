---
title: Register a web API that calls web APIs
description: Learn how to build a web API that calls downstream web APIs (app registration).
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs by using the Microsoft identity platform.
---

# A web API that calls web APIs: App registration

A web API that calls downstream web APIs has the same registration as a protected web API. Follow the instructions in [Protected web API: App registration](scenario-protected-web-api-app-registration.md).

Because the web app now calls web APIs, it becomes a confidential client application. That's why extra registration information is required: the app needs to share secrets (client credentials) with the Microsoft identity platform.

[!INCLUDE [Pre-requisites](./includes/scenarios/scenarios-registration-client-secrets.md)]

## API permissions

Web apps call APIs on behalf of users for whom the bearer token was received. The web apps need to request delegated permissions. For more information, see [Add permissions to access your web API](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-your-web-api).

## Next steps

Move on to the next article in this scenario,
[App Code configuration](scenario-web-api-call-api-app-configuration.md).
