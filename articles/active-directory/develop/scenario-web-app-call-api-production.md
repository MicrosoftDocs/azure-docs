---
title: Move to production a web app that calls web APIs
description: Learn how to move to production a web app that calls web APIs.
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
#Customer intent: As an application developer, I want to know how to write a web app that calls web APIs by using the Microsoft identity platform.
---

# A web app that calls web APIs: Move to production

Now that you know how to acquire a token to call web APIs, here are some things to consider when moving your application to production.

[!INCLUDE [Common steps to move to production](./includes/scenarios/scenarios-production.md)]

## Next steps

Learn more by trying out the full, progressive tutorial for ASP.NET Core web apps. The tutorial:

- Shows how to sign users in to multiple audiences or to national clouds, or by using social identities.
- Calls Microsoft Graph.
- Calls several Microsoft APIs.
- Handles incremental consent.
- Calls your own web API.

> [!div class="nextstepaction"]
> [ASP.NET Core web app tutorial](https://github.com/Azure-Samples/ms-identity-aspnetcore-webapp-tutorial#scope-of-this-tutorial)

<!--- Removing this diagram as it's already shown from the next step linked tutorial

![Tutorial overview](media/scenarios/aspnetcore-webapp-tutorial.svg)

--->
