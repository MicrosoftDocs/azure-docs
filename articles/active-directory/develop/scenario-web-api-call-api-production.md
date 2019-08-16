---
title: Web API that calls web APIs (move to production) - Microsoft identity platform
description: Learn how to build a web API that calls downstream web APIs (move to production).
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

# Web API that calls web APIs - move to production

Once you've acquired a token to call web APIs, you can move your app to production.

[!INCLUDE [Move to production common steps](../../../includes/active-directory-develop-scenarios-production.md)]

## Learn more

Now that you know the basics of how to call web APIs from your own web API, you might be interested is this tutorial, which describes the code that's used to build a protected web API calling web APIs.

| Sample | Platform | Description |
|--------|----------|-------------|
| [active-directory-aspnetcore-webapi-tutorial-v2](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/tree/master/2.%20Web%20API%20now%20calls%20Microsoft%20Graph) | ASP.NET Core 2.2 Web API, Desktop (WPF) | ASP.NET Core 2.2 Web API calling Microsoft Graph, itself called from a WPF application using the Microsoft identity platform (v2.0) |
