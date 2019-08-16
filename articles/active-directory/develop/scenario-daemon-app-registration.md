---
title: Daemon app calling web APIs (app registration) - Microsoft identity platform
description: Learn how to build a daemon app that calls web APIs - app registration
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a daemon app that can call web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Daemon app that calls web APIs - app registration

For a daemon application, here's what you need to know when registering the app.

## Supported account types

Given that daemon applications only make sense in Azure AD tenant, when you create the application you will need to choose:

- either **Accounts in this organizational directory only**. This choice is the most common case, as daemon applications are usually written by line-of-business (LOB) developers.
- or **Accounts in any organizational directory**. You'll make this choice if you're an ISV providing a utility tool to your customers. You'll need customer's tenants admins to approve it.

## Authentication - no Reply URI needed

In the case where your confidential client application uses **only** the client credentials flow, the reply URL doesn't need to be registered. It's not needed either for the application configuration/construction. The client credentials flow doesn't use it.

## API Permissions - app permissions and admin consent

A daemon application can only request application permissions to APIs (not delegated permissions). In the **API Permission** page for the application registration, after you've selected **Add a permission** and chosen the API family, choose **Application permissions**, and then select your permissions

![App permissions and admin consent](media/scenario-daemon-app/app-permissions-and-admin-consent.png)

Daemon applications require have a tenant admin pre-consent to the application calling the web API. This consent is provided in the same **API Permission** page, by a tenant admin selecting **Grant admin consent to *our organization***

If you're an ISV building a multi-tenant application, you'd want to check the [Deployment - case of multi-tenant daemon apps](scenario-daemon-production.md#deployment---case-of-multi-tenant-daemon-apps) paragraph.

[!INCLUDE [Pre-requisites](../../../includes/active-directory-develop-scenarios-registration-client-secrets.md)]

## Next steps

> [!div class="nextstepaction"]
> [Daemon app - app code configuration](./scenario-daemon-app-configuration.md)
