---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mtillman
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/13/2018
ms.author: andret
ms.custom: include file 

---

## Test your app

1. Run your code to your device/emulator.

2. Try to sign in with a Azure Active Directory account (work or school account) or Microsoft account (live.com, outlook.com). 

    ![Test your application](media/active-directory-develop-guidedsetup-android-test/mainwindow.png)
    <br/><br/>
    ![Enter username and password](media/active-directory-develop-guidedsetup-android-test/usernameandpassword.png)

### Consent to your app
The first time a user signs in to your application, they will be prompted to consent to the permissions your app needs, as shown here: 

![Provide your consent for application access](media/active-directory-develop-guidedsetup-android-test/androidconsent.png)


### Success!
After you sign in & consent, the app will display response from the Microsoft Graph API. This specific call is to the **/me** endpoint and returns the [user profile](https://developer.microsoft.com/graph/docs/api-reference/v1.0/api/user_get). For a list of other Microsoft Graph endpoints, see [Microsoft Graph API developer documentation](https://developer.microsoft.com/graph/docs#common-microsoft-graph-queries).

<!--start-collapse-->
### Scopes and delegated permissions

The Microsoft Graph API requires the *User.Read* scope to read a user's profile. This scope is automatically in every app that's registered in the Application Registration Portal. Other APIs will require additional scopes. For example, the Microsoft Graph API requires the *Calendars.Read* scope to list the user’s calendars. 

To access the user’s calendars, add the *Calendars.Read* delegated permission to the application registration information. Then, add the *Calendars.Read* scope to the `acquireTokenSilent` call. 

>[!NOTE]
>Your users may be prompted for additional consent if you change your app registration.

<!--end-collapse-->

[!INCLUDE [Help and support](active-directory-develop-help-support-include.md)]
