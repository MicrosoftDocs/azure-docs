---
title: Implementing Sign-in with Microsoft on an Android application - Test
description: How to  implement demonstrates how to implement Sign-In with Microsoft on a native Android application using the OpenID Connect standard | Microsoft Azure
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
ms.date:
ms.author: andret

---
# Test your code

Deploy your code to your device/ emulator.

When you're ready to test, use a Microsoft Azure Active Directory (organizational account) or a Microsoft Account (live.com, outlook.com) account to sign in. 

![Sample screen shot](../../media/active-directory-mobileanddesktop-android-test/mainwindow.png)
<br/><br/>
![Sign-in](../../media/active-directory-mobileanddesktop-android-test/usernameandpassword.png)

### Consent
The first time a user signs in to your application, he/she will be presented with a consent screen similar to the below, where he/she needs to explicitly accept: 

![Consent](../../media/active-directory-mobileanddesktop-android-test/androidconsent.png)


### Expected Results
You should see the results of a call to Microsoft Graph API ‘me’ endpoint used to to obtain the user profile - https://graph.microsoft.com/v1.0/me. For a list of common Microsoft Graph endpoints, please see this [article](https://developer.microsoft.com/graph/docs#common-microsoft-graph-queries).

<!--start-collapse-->
### More information about scopes and delegated permissions
Graph API requires the `user.read` scope to read user profile. This scope is automatically added by default in every application being registered on our registration portal. Some other Graph APIs as well as custom APIs for your backend server require additional scopes. For example, for Graph, `Calendars.Read` is required to list user’s calendars. In order to access the user’s calendar in a context of an application, you need to add this delegated application registration’s information and then add `Calendars.Read` to the `AcquireTokenAsync` call. User may be prompted for additional consents as you increase the number of scopes.

If a backend API does not require a scope (not recommended), you can use the `ClientId` as scope in `AcquireTokenAsync` call.
<!--end-collapse-->
