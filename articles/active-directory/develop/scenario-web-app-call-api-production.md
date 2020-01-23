---
title: Move web app calling web APIs to production - Microsoft identity platform | Azure
description: Learn how to move a web app that calls web APIs to production.
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
#Customer intent: As an application developer, I want to know how to write a Web app that calls Web APIs using the Microsoft identity platform for developers.
---

# Web app that calls web APIs - move to production

Now that you know how to acquire a token to call Web APIs, learn how to move to production.

[!INCLUDE [Move to production common steps](../../../includes/active-directory-develop-scenarios-production.md)]

## Next steps

Learn more by trying out the full ASP.NET Core web app progressive tutorial, which shows:

- How to sign in users with multiple audiences, national clouds, or with social identities
- Calls Microsoft Graph
- Calls several Microsoft APIs
- Handles incremental consent
- Calls your own Web API

> [!div class="nextstepaction"]
> [ASP.NET Core web app tutorial](https://github.com/Azure-Samples/ms-identity-aspnetcore-webapp-tutorial#scope-of-this-tutorial)

<!--- Removing this diagram as it's already shown from the next step linked tutorial

![Tutorial overview](media/scenarios/aspnetcore-webapp-tutorial.svg)

--->
