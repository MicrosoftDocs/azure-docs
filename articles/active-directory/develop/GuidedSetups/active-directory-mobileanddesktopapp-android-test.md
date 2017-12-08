---
title: "Azure AD v2.0 Android getting started: Test your code | Microsoft Docs"
description: How an Android application can call APIs that require access tokens by using Azure Active Directory v2.0 endpoint.
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
ms.custom: aaddev

---
## Test your code

1. Deploy your code to your device/emulator.
2. When you're ready to test your application, use a Microsoft Azure Active Directory account (work or school account) or a Microsoft account (live.com, outlook.com) to sign in. 

    ![Test your application](media/active-directory-mobileanddesktopapp-android-test/mainwindow.png)
    <br/><br/>
    ![Enter username and password](media/active-directory-mobileanddesktopapp-android-test/usernameandpassword.png)

### Provide consent for application access
The first time that you sign in to your application, you're prompted to provide your consent to allow the application to access your profile and to sign you in: 

![Provide your consent for application access](media/active-directory-mobileanddesktopapp-android-test/androidconsent.png)


### View application results
After you sign in, you should see the results that are returned by the call to the Microsoft Graph API. The call to the Microsoft Graph API **me** endpoint returns the user profile https://graph.microsoft.com/v1.0/me. For a list of common Microsoft Graph endpoints, see [the Microsoft Graph API developer documentation](https://developer.microsoft.com/graph/docs#common-microsoft-graph-queries).

<!--start-collapse-->
### More information about scopes and delegated permissions

The Microsoft Graph API requires the **user.read** scope to read a user's profile. This scope is automatically added by default in every application that's registered on the registration portal. Other APIs for Microsoft Graph, as well as custom APIs for your back-end server, might require additional scopes. The Microsoft Graph API requires the **Calendars.Read** scope to list the user’s calendars.

To access the user’s calendars in the context of an application, add the **Calendars.Read** delegated permission to the application registration information. Then, add the **Calendars.Read** scope to the **acquireTokenSilent** call. 

>[!NOTE]
>The user might be prompted for additional consents as you increase the number of scopes.

<!--end-collapse-->

[!INCLUDE  [Help and support](../../../../includes/active-directory-develop-help-support-include.md)]
