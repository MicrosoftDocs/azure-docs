---
title: 'Azure Active Directory B2C: Call a web API from an Android application | Microsoft Docs'
description: This article will show you how to create an Android 'to-do list' app that calls a Node.js web API by using OAuth 2.0 bearer tokens. Both the Android app and the web API use Azure Active Directory B2C to manage user identities and authenticate users.
services: active-directory-b2c
documentationcenter: android
author: xerners
manager: mbaldwin
editor: ''

ms.assetid: d00947c3-dcaa-4cb3-8c2e-d94e0746d8b2
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: mobile-android
ms.devlang: java
ms.topic: article
ms.date: 01/31/2017
ms.author: brandwe

---
# Azure AD B2C: Call a web API from an Android application
> [!WARNING]
> We have published an updated Android code sample that can be found [here](https://github.com/Azure-Samples/active-directory-b2c-android-native-nodejs-webapi).  This sample is using a 3rd party library that has been tested for compatibility in basic scenarios with the Azure AD B2C.  This library utilizes embedded web-views rather than the system browser.  Google [has announced](https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html) that on April 20, 2017 they will no longer support Google Account sign in with embedded web-views at which point those wishing to support Google accounts will need to update libraries.  

>Microsoft does not provide fixes for 3rd party libraries and has not done a review of these libraries. Issues and feature requests should be directed to the library's open-source project. Please see [this article](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-libraries) for more information.
>
>

