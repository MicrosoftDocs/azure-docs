---
title: Protected Web API - overview | Azure
description: Learn how to build a protected Web API (overview)
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
ms.date: 04/22/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a protected Web API using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Protected Web API - overview

You expose a Web API and you want to protect it so that only authenticated user can access it. You want to enable authenticated users with both work and school accounts
or Microsoft personal accounts (formerly live account) to use your Web API.

## Prerequisites

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-prerequisites.md)]

## Specifics

You'll learn what is specific about protecting Web APIs:

- Your app registration needs to expose at least one scope. The token version accepted by your Web API depends on the sign in audience.
- The configuration of the code for the Web API needs to validate the token used when calling the Web API.

## Next steps

> [!div class="nextstepaction"]
> [App registration](scenario-protected-web-api-app-registration.md)
