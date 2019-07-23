---
title: Add a native client application - Azure Active Directory B2C | Microsoft Docs
description: Learn how to add a native client application to your Active Directory B2C tenant.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.author: marsma
ms.date: 02/04/2019
ms.custom: mvc
ms.topic: conceptual
ms.service: active-directory
ms.subservice: B2C
---

# Add a native client application to your Azure Active Directory B2C tenant

Native client resources need to be registered in your tenant before your application can communicate with Azure Active Directory B2C.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Applications**, and then select **Add**.
2. Enter a name for the application. For example, *nativeapp1*.
3. For **Include web app/ web API**, select **No**.
4. For **Include native client**, select **Yes**.
5. For **Redirect URI**, enter a valid redirect URI with a custom scheme. There are two important considerations when choosing a redirect URI:

    - **Unique** - The scheme of the redirect URI should be unique for every application. In the example `com.onmicrosoft.contoso.appname://redirect/path`, `com.onmicrosoft.contoso.appname` is the scheme. This pattern should be followed. If two applications share the same scheme, the user is given a choice to choose an application. If the user makes an incorrect choice, the sign-in fails.
    - **Complete** - The redirect URI must have a scheme and a path. The path must contain at least one forward slash after the domain. For example, `//contoso/` works and `//contoso` fails. Make sure that the redirect URI doesn't include special characters, such as underscores.

6. Click **Create**.
7. On the properties page, record the application ID that you'll use when you configure your native client application.
