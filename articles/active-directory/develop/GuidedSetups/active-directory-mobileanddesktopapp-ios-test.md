---
title: "Azure AD v2.0 iOS getting started: Test your application | Microsoft Docs"
description: How iOS (Swift) applications can call APIs that require access tokens by using Azure Active Directory v2.0 endpoint.
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mbaldwin
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/09/2017
ms.author: andret

---
## Test querying the Microsoft Graph API from your iOS application

To run the code in the simulator, press **Command** + **R**.

![Test your application in the simulator](media/active-directory-mobileanddesktopapp-ios-test/iostestscreenshot.png)

When you're ready to test, select **Call Microsoft Graph API**. When prompted, enter your username and password.

### Provide consent for application access
The first time that you sign in to your application, you're prompted to provide your consent to allow the application to access your profile and to sign you in:

![Provide your consent for application access](media/active-directory-mobileanddesktopapp-ios-test/iosconsentscreen.png)

### View application results
After you sign in, you should see your user profile information returned by the Microsoft Graph API call in the **Logging** section. 

<!--start-collapse-->
### More information about scopes and delegated permissions

The Microsoft Graph API requires the **user.read** scope to read a user's profile. This scope is automatically added by default in every application that's registered on the registration portal. Other APIs for Microsoft Graph, as well as custom APIs for your back-end server, might require additional scopes. The Microsoft Graph API requires the **Calendars.Read** scope to list the user’s calendars.

To access the user’s calendars in the context of an application, add the **Calendars.Read** delegated permission to the application registration information. Then, add the **Calendars.Read** scope to the **acquireTokenSilent** call. 

>[!NOTE]
>The user might be prompted for additional consents as you increase the number of scopes.

<!--end-collapse-->

[!INCLUDE  [Help and support](../../../../includes/active-directory-develop-help-support-include.md)]
