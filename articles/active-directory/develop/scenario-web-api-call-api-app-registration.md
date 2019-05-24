---
title: Web API that calls downstream web APIs (app registration) - Microsoft identity platform
description: Learn how to build a web API that calls downstream web APIs (app registration)
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

# Web API that calls web APIs - app registration

A web API that calls downstream web APIs has the same registration as a protected web API. Therefore, you'll need to follow the instructions in [Protected Web API - app registration](scenario-protected-web-api-app-registration.md).

However, since the web app now calls web APIs, it becomes a confidential client application. That's why there's extra registration info that's required: the app needs to share secrets (client credentials) with the Microsoft identity platform.

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-registration-client-secrets.md)]

## API permissions

Web applications call APIs on behalf of the user for whom the bearer token was received. They need to request delegated permissions. For details, see [Add permissions to access web APIs](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis).

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-web-api-call-api-app-configuration.md)
