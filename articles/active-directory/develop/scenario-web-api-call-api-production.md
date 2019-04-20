---
title: web API that calls Web APIs - move to production | Azure
description: Learn how to build a web API that calls Web APIs (move to production)
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
#Customer intent: As an application developer, I want to know how to write a web API that calls Web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# web API that calls Web APIs - move to production

Now that you know how to acquire a token to call Web APIs, learn how to move to production.

## Next steps

[!INCLUDE [Move to production common steps](../../../includes/active-directory-develop-scenarios-production.md)]

## Learn more

Here is a tutorial explaining in depth how to build a protected Web API calling Web APIs

Sample | Platform | Description
------ | -------- | -----------
[active-directory-aspnetcore-webapi-tutorial-v2](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/tree/master/2.%20Web%20API%20now%20calls%20Microsoft%20Graph) | ASP.NET Core 2.2 Web API, Desktop (WPF) | ASP.NET Core 2.2 Web API calling Microsoft Graph, itself called from a WPF application using Azure AD V2