---
title: Web app that calls Web APIs - app registration | Azure
description: Learn how to build a Web app that calls Web APIs (app registration)
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
#Customer intent: As an application developer, I want to know how to write a Web app that calls Web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web app that calls Web APIs - app registration

A Web app calling Web APIs has the same registration as a Web App signing-in users. You'll therefore need to follow the instructions in [Web app that signs-in users - app registration](scenario-web-app-sign-user-app-registration.md)

However since the Web App now calls Web APIs, it becomes a confidential client application. That's why there is a bit of extra registration required: it needs to share secrets (client credentials) with the Microsoft identity platform.

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-registration-client-secrets.md)]

Finally since it calls APIs, it needs to declare the APIs it intends to call.

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-web-app-call-api-app-configuration.md)
