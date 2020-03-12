---
title: Register a web API that calls web APIs - Microsoft identity platform | Azure
description: Learn how to build a web API that calls downstream web APIs (app registration).
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
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs by using the Microsoft identity platform for developers.
---

# A web API that calls web APIs: App registration

A web API that calls downstream web APIs has the same registration as a protected web API. Therefore, you need to follow the instructions in [Protected web API: App registration](scenario-protected-web-api-app-registration.md).

Because the web app now calls web APIs, it becomes a confidential client application. That's why extra registration information is required: the app needs to share secrets (client credentials) with the Microsoft identity platform.

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-registration-client-secrets.md)]

## API permissions

Web apps call APIs on behalf of users for whom the bearer token was received. The web apps need to request delegated permissions. For more information, see [Add permissions to access web APIs](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis).

## Next steps

> [!div class="nextstepaction"]
> [A web API that calls web APIs: Code configuration](scenario-web-api-call-api-app-configuration.md)
