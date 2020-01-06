---
title: Register authentication info to reset your own password - Azure AD
description: Register your verification method information for Azure AD self-service password reset, so you can reset your own password without administrator help.
services: active-directory
author: eross-msft
manager: daveba
ms.reviewer: sahenry
ms.assetid:

ms.service: active-directory
ms.subservice: user-help
ms.workload: identity
ms.topic: conceptual
ms.date: 12/03/2019
ms.author: lizross
ms.collection: M365-identity-device-management
---

# Register your verification method info to reset your own password

If you forgot your work or school password, never got a password from your organization, or have been locked out of your account, you can use your security info and your mobile device to reset your work or school password.

Your administrator must turn on this feature for you to be able to register your information and reset your own password. If you don't see the **Forgot my password** option, it means that your administrator hasn't turned on the feature for your organization. If you believe this to be incorrect, contact your help desk for assistance.

>[!Important]
>This article is intended for users trying to use sign up for self-service password reset. This means that you’ll be able to reset your own work or school password (such as, alain@contoso.com), without requiring your administrator’s help. If you're an administrator looking for information about how to turn on self-service password reset for your employees or other users, see the [Deploy Azure AD self-service password reset and other articles]( https://docs.microsoft.com/azure/active-directory/authentication/howto-sspr-deployment).

## Register or confirm authentication data with SSPR

1. Open the web browser on your device and go to the [password reset registration page](https://account.activedirectory.windowsazure.com/PasswordReset/Register.aspx?regref=ssprsetup).
2. Enter your username and the password that your administrator provided.
3. Depending on how your IT staff has configured things, one or more of the following options are available for you to configure and verify. If your administrator has your permission to use your information, they can populate some of the information for you.
    * **Office phone**: Only your administrator can set this option.
    * **Authentication Phone**: Set this option to another phone number that you have access to. An example is a cell phone that can receive a text or a call.
    * **Authentication Email**: Set this option to an alternate email address that you can access without using the password you want to reset.
    * **Security Questions**: Your administrator has approved this list of questions for you to answer. You can't use the same question or answer more than once.
4. Provide and verify the information that your administrator requires. If more than one option is available, we suggest that you register multiple methods. This gives you flexibility when one of the methods isn't available. An example is when you're traveling and you're unable to access your office phone.

    ![Register verification methods and select finish][Register]

5. Select **finish**. You can now use SSPR when you need to in the future.

If you enter data for **Authentication Phone** or **Authentication Email**, it's not visible in the global directory. The only people who can see this data are you and your administrators. Only you can see the answers to your security questions.

Your administrators might require you to confirm your verification methods after a period of time to make sure you still have the appropriate methods registered.

## Common problems and their solutions

 Here are some common error cases and their solutions:

| Error case| What error do you see?| Solution |
| --- | --- | --- |
| I get a "please contact your administrator" page after entering my user ID | Please contact your administrator. <br> <br> We've detected that your user account password is not managed by Microsoft. As a result, we are unable to automatically reset your password. <br> <br> Contact your IT staff for any further assistance. | You're seeing this message because your IT staff manages your password in your on-premises environment and does not allow you to reset your password from the **Can't access your account** link. <br> <br> To reset your password, contact your IT staff directly for help. Let them know you want to reset your password so they can enable this feature for you.|
| I get a "your account is not enabled for password reset" error after entering my user ID | Your account is not enabled for password reset. <br> <br> We're sorry, but your IT staff has not set up your account for use with this service. <br> <br> If you'd like, we can contact an administrator in your organization to reset your password for you. | You're seeing this message because your IT staff has not enabled password reset for your organization from the **Can't access your account** link or hasn't licensed you to use the feature. <br> <br> To reset your password, select the **contact an administrator** link. An email will be sent to your company's IT staff. The email lets them know you want to reset your password, so they can enable this feature for you. |
| I get a "we could not verify your account" error after entering my user ID | We could not verify your account. <br> <br> If you'd like, we can contact an administrator in your organization to reset your password for you. | You're seeing this message because you're enabled for password reset, but you haven't registered to use the service. To register for password reset, go to the [password reset registration page](https://aka.ms/ssprsetup) after you have regained access to your account. <br> <br> To reset your password, select the **contact an administrator** link to send an email to your company's IT staff. |

## Next steps

* [Change your password by using self-service password reset](active-directory-passwords-update-your-own-password.md)
* [Password reset registration page](https://aka.ms/ssprsetup)
* [Password reset portal](https://passwordreset.microsoftonline.com/)
* [When you can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant)

[Register]: ./media/active-directory-passwords-reset-register/register-2-methods.png "Password Reset Registration page showing the registered methods and the finish button"