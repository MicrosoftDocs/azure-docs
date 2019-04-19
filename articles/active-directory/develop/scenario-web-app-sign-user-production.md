---
title: Web app that signs-in users - move to production | Azure
description: Learn how to build a Web app that signs-in users (move to production)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/18/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a Web app that signs-in users using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web app that signs-in users - move to production

Now that the Web app called web apis, learn how to move it to production.

## Improve your app

Now that you know how to acquire a token to call Web APIs, learn how to move it to production.

[!INCLUDE [Move to production common steps](../../../includes/active-directory-develop-scenarios-production.md)]

## Next steps

### Calling Web APIs scenario

Once your web app signs-in users, it can call Web APIs on behalf of the signed-in users. Calling Web APIs from our Web App is the object of the following scenario:

> [!div class="nextstepaction"]
> [Web app that calls web APIs](scenario-web-app-call-api-overview.md)

### Deep dive - Web App tutorial

Learn about other ways of sign-in users with the ASP.NET Core tutorial: [ms-identity-aspnetcore-webapp-tutorial](https://github.com/Azure-Samples/ms-identity-aspnetcore-webapp-tutorial). This is a progressive tutorial with production ready code for a Web app including how to add sign in.
  
  ![Tutorial overview](media/scenarios/aspnetcore-webapp-tutorial.svg)
