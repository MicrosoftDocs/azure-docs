---
title: Web app that calls web APIs (app registration) - Microsoft identity platform
description: Learn how to build a web app that calls web APIs (app registration)
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
#Customer intent: As an application developer, I want to know how to write a Web app that calls web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web app that calls web APIs - app registration

A Web app calling web APIs has the same registration as a Web App signing-in users. You'll therefore need to follow the instructions in [Web app that signs-in users - app registration](scenario-web-app-sign-user-app-registration.md)

However since the Web App now calls web APIs, it becomes a confidential client application. That's why there is a bit of extra registration required: it needs to share secrets (client credentials) with the Microsoft identity platform.

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-registration-client-secrets.md)]

## API permissions

Web applications call APIs on behalf of the signed-in user. They need to request delegated permissions. For details see [Add permissions to access web APIs](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis)

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-web-app-call-api-app-configuration.md)
