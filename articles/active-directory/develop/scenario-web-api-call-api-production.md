---
title: Move web API calling web APIs to production
description: Learn how to move a web API that calls web APIs to production.
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
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs using the Microsoft identity platform.
---

# A web API that calls web APIs: Move to production

After you've acquired a token to call web APIs, here are some things to consider when moving your application to production.

[!INCLUDE [Common steps to move to production](./includes/scenarios/scenarios-production.md)]

## Next steps

Now that you know the basics of how to call web APIs from your own web API, you might be interested in the following tutorial, which describes the code that's used to build a protected web API that calls web APIs.

| Sample | Platform | Description |
|--------|----------|-------------|
| [active-directory-aspnetcore-webapi-tutorial-v2](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/tree/master/2.%20Web%20API%20now%20calls%20Microsoft%20Graph) chapter 1 | ASP.NET Core web API, Desktop (WPF) | ASP.NET Core web API calls Microsoft Graph, which you call from a WPF application by using the Microsoft identity platform. |
