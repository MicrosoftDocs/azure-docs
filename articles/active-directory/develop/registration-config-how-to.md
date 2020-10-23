---
title: Get the endpoints for an Azure AD app registration
titleSuffix: Microsoft identity platform
description: How to find the authentication endpoints for a custom application you're developing or registering with Azure AD.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev 
ms.workload: identity
ms.topic: conceptual
ms.date: 05/07/2020
ms.author: ryanwi
---

# How to discover endpoints

You can find the authentication endpoints for your application in the [Azure portal](https://portal.azure.com).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Azure Active Directory**.
1. Under **Manage**, select **App registrations**, and then select **Endpoints** in the top menu.

    The **Endpoints** page is displayed, showing the authentication endpoints for your tenant.
    
    Use the endpoint that matches the authentication protocol you're using in conjunction with the **Application (client) ID** to craft the authentication request specific to your application.

**National clouds** (for example Azure AD China, Germany, and US Government) have their own app registration portal and Azure AD authentication endpoints. Learn more in the [National clouds overview](authentication-national-cloud.md).

## Next steps

For more information about endpoints in the different Azure environments, see the [National clouds overview](authentication-national-cloud.md).
