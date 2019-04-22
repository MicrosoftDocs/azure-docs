---
title: Web API that calls Web APIs - app registration | Azure
description: Learn how to build a web API that calls Web APIs (app registration)
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

# Web API that calls Web APIs - app registration

This page explains the app registration specifics for a web API that calls Web APIs.

A Web API calling downstream Web APIs has the same registration as a protected Web API. You'll therefore need to follow the instructions in [Protected Web API - app registration](scenario-protected-web-api-app-registration.md)

However since the Web App now calls Web APIs, it becomes a confidential client application. That's why there's a bit of extra registration required: it needs to share secrets (client credentials) with the Microsoft identity platform.

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-registration-client-secrets.md)]

## API permissions

Web applications call APIs on behalf of the user for which the bearer token was received. They need to request delegated permissions. For details see [Add permissions to access web APIs](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis)

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-web-api-call-api-app-configuration.md)
