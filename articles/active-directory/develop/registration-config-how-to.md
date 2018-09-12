---
title: How to select permissions for a given API | Microsoft Docs
description: How to find the authentication endpoints for a custom application you are developing or registering with Azure AD.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/11/2018
ms.author: celested

---

# How to select permissions for a given API

You can find the authentication endpoints for your application in the [Azure portal](https://portal.azure.com).

-   Navigate to the [Azure portal](https://portal.azure.com).

-   From the left navigation pane, click **Azure Active Directory**.

-   Click **App Registrations** and choose **Endpoints**.

-   This open up the **Endpoints** page, which list all the authentication endpoints for your tenant.

-   Use the endpoint specific to the authentication protocol you are using, in conjunction with the application ID to craft the authentication request specific to your application.

## Next steps
[Azure Active Directory developer's guide](https://docs.microsoft.com/azure/active-directory/develop/active-directory-developers-guide#authentication-and-authorization-protocols)
