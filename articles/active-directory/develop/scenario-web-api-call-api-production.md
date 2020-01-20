---
title: Move web API calling web APIs to production - Microsoft identity platform | Azure
description: Learn how to move a web API that calls web APIs to production.
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

# A web API that calls web APIs: Move to production

After you've acquired a token to call web APIs, you can move your app to production.

[!INCLUDE [Move to production common steps](../../../includes/active-directory-develop-scenarios-production.md)]

## Learn more

Now that you know the basics of how to call web APIs from your own web API, you might be interested in the following tutorial, which describes the code that's used to build a protected web API that calls web APIs.

| Sample | Platform | Description |
|--------|----------|-------------|
| [active-directory-aspnetcore-webapi-tutorial-v2](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/tree/master/2.%20Web%20API%20now%20calls%20Microsoft%20Graph) | ASP.NET Core 2.2 Web API, Desktop (WPF) | ASP.NET Core 2.2 Web API calls Microsoft Graph, which you call from a WPF application by using the Microsoft identity platform (v2.0). |
