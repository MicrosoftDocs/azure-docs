---
title: Azure AD v2 iOS Getting Started - Test | Microsoft Docs
description: How iOS (Swift) applications can call an API that require access tokens by Azure Active Directory v2 endpoint
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mbaldwin
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/09/2017
ms.author: andret

---
## Test querying Microsoft Graph API from your iOS application

Press Command + `R` to run the code in the simulator.

![Sample screen shot](media/active-directory-mobileanddesktopapp-ios-test/iostestscreenshot.png)

When you're ready to test, select ‘Call Graph API’ and you will be prompted to type your username and password.

### Consent
The first time you sign in to your application, you will be presented with a consent screen similar to the below, where you need to explicitly accept:

![Consent Screen](media/active-directory-mobileanddesktopapp-ios-test/iosconsentscreen.png)

### Expected Results
You should see user profile information returned by the Microsoft Graph API call on the *Logging* section.

<!--start-collapse-->
### More information about scopes and delegated permissions

Graph API requires the `user.read` scope to read user profile. This scope is automatically added by default in every application being registered on our registration portal. Some other Graph APIs as well as custom APIs for your backend server require additional scopes. For example, for Graph, `Calendars.Read` is required to list user’s calendars. In order to access the user’s calendar in a context of an application, you need to add `Calendars.Read` delegated application registration’s information and then add `Calendars.Read` to the `AcquireTokenAsync` call. User may be prompted for additional consents as you increase the number of scopes.

<!--end-collapse-->



