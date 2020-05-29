---
title: Register a web app that calls web APIs - Microsoft identity platform | Azure
description: Learn how to register a web app that calls web APIs
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a web app that calls web APIs by using the Microsoft identity platform for developers.
---

# A web app that calls web APIs: App registration

A web app that calls web APIs has the same registration as a web app that signs users in. So, follow the instructions in [A web app that signs in users: App registration](scenario-web-app-sign-user-app-registration.md).

However, because the web app now also calls web APIs, it becomes a confidential client application. That's why some extra registration is required. The app must share client credentials, or *secrets*, with the Microsoft identity platform.

[!INCLUDE [Registration of client secrets](../../../includes/active-directory-develop-scenarios-registration-client-secrets.md)]

## API permissions

Web apps call APIs on behalf of the signed-in user. To do that, they must request *delegated permissions*. For details, see [Add permissions to access web APIs](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis).

## Next steps

> [!div class="nextstepaction"]
> [A web app that calls web APIs: Code configuration](scenario-web-app-call-api-app-configuration.md)
