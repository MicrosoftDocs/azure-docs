---
title: 'Azure AD: Self-service password reset registration | Microsoft Docs'
description: Register authentication data for self-service password reset
services: active-directory
keywords: Active directory password management, password management, Azure AD self service password reset, SSPR
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/16/2017
ms.author: joflore
ms.custom: end-user

---
# Register for self-service password reset

As an end user if your administrator has enabled it, you can reset your password or unlock your account without having to speak to a person using self-service password reset (SSPR). Before you can use this functionality, you have to register authentication methods or confirm the predefined authentication methods your administrator has populated.

## Register or confirm authentication data with SSPR

1. Open the web browser on your device and go to the [password reset registration page](http://aka.ms/ssprsetup)
2. Enter your username and password provided by your administrator
3. Depending on the options your administrator has approved, you will see one or more of the following items for you to configure or verify to be used if you need to reset your password
    * Office phone - This option is only able to be set by your administrator
    * Authentication Phone - This option should be set to another phone number you would have access to like a cell phone that can receive a text or call (Your administrator may populate this for you with your cell phone number if they already have your permission to use that information)
    * Authentication Email - This option should be set to an alternative email address that you can access without the password you need to reset
    * Security Questions - This option gives you a list of questions your administrator has approved for you to answer. You may not use the same answer for more than one question.
4. Provide and verify the information required by your administrator. If more than one option is available we suggest that you register multiple methods to provide flexibility when another method is unavailable (Example: Traveling and unable to access your office phone)

    ![Register authentication methods and click finish][Register]

5. When done with step 4 choose **finish** and you will now be able to use self-service password reset when you need to in the future.

If you enter data in the Authentication Phone or Authentication Email, it is not visible in the global directory. The only people who can see this data are you and your administrators. Only you can see the answers to your Security Questions.

Administrators may require you to confirm your authentication methods after a period of time to make sure you still have the appropriate methods registered.

## Next Steps

* [How to change your password using self-service password reset](active-directory-passwords-update-your-own-password.md)
* [Password reset registration page](http://aka.ms/ssprsetup)
* [Password reset portal](https://passwordreset.microsoftonline.com/)
* [Can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant)

[Register]: ./media/active-directory-passwords-reset-register/register-2-methods.png "Password reset registration page showing registered methods and finish button"
