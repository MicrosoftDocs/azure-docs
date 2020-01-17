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
ms.date: 01/15/2020
ms.author: lizross
ms.collection: M365-identity-device-management
---

# Register your verification method info to reset your own password

If you forgot your work or school password, never got a password from your organization, or have been locked out of your account, you can use your security info and your mobile device to reset your work or school password.

Your administrator must turn on this feature for you to be able to register your information and reset your own password. If you don't see the **Forgot my password** option, it means that your administrator hasn't turned on the feature for your organization. If you believe this to be incorrect, contact your help desk for assistance.

>[!Important]
>This article is intended for users trying to use sign up for self-service password reset. This means that you’ll be able to reset your own work or school password (such as, alain@contoso.com), without requiring your administrator’s help. If you're an administrator looking for information about how to turn on self-service password reset for your employees or other users, see the [Deploy Azure AD self-service password reset and other articles](https://docs.microsoft.com/azure/active-directory/authentication/howto-sspr-deployment).

## Set up your password reset verification method

1. Open the web browser on your device and go to the [security info page](https://account.activedirectory.windowsazure.com/PasswordReset/Register.aspx?regref=ssprsetup).

2. Depending on how your administrator has set up your organization, one or more of the following options will be available for you to set up as your security verification method. If multiple options are available, we strongly recommend that you use more than one as your security verification method, in case one of your methods becomes unavailable.

    - **Authentication app.** Choose to use the Microsoft Authenticator app or other authenticator app as your security verification method. For more information about setting up the app, see [Set up the Microsoft Authenticator app as your verification method](security-info-setup-auth-app.md).

    - **Text messaging.** Choose to send yourself text messages to your mobile device. For more information about setting up text messaging, see [Set up text messaging as your verification method](security-info-setup-text-msg.md).

    - **Phone calls.** Choose to get a phone call to your registered phone number. For more information about setting up phone calls, see [Set up a phone number as your verification method](security-info-setup-phone-number.md).

    - **Security key.** Choose to use a Microsoft-compatible security key. For more information, see [Set up a security key as your verification method](security-info-setup-security-key.md).

    - **Email address.** Choose to use an alternate email address that can be used without requiring your forgotten or missing password. This only works for password reset, not as a security verification method. For more information about setting up an email address, see [Set up an email address as your verification method](security-info-setup-email.md).

    - **Security questions.** Choose to set up and answer pre-defined security questions set up by your administrator. This only works for password reset,  not as a security verification method. For more information about security questions, see [Set up security questions as your verification method](security-info-setup-questions.md).

3. After you select and set up your methods, choose **Finish** to complete the process.

    > [!Note]
    > Information added for your phone number or email address is not shared with your organization's global directory. The only people that can see this information are you and your administrator. Only you can see the answers to your security questions.

## Common problems and their solutions

 Here are some common error cases and their solutions:

| Error message |  Possible solution |
| --- | --- | --- |
| Please contact your administrator.<br>We've detected that your user account password is not managed by Microsoft. As a result, we are unable to automatically reset your password.<br>Contact your IT staff for any further assistance.| If you get this error message after typing your User ID, it means that your organization internally manages your password and doesn't want you to reset your password from the **Can't access your account** link. To reset your password in this situation, you must contact your organization's help desk or your administrator for help. |
| Your account is not enabled for password reset.<br>We're sorry, but your IT staff has not set up your account for use with this service.<br>If you'd like, we can contact an administrator in your organization to reset your password for you. | If you get this error message after typing your User ID, it means that either your organization hasn't turned on the password reset feature or you aren't allowed to use it. To reset your password in this situation, you must select the **Contact an administrator** link. After you click the link, an email is sent to your organization's help desk or administrator, letting them know you want to reset your password. |
| We could not verify your account.<br>If you'd like, we can contact an administrator in your organization to reset your password for you. | If you get this error message after typing your User ID, it means that your organization has turned on password reset and that you can use it, but that you haven't registered for the service. In this situation, you must contact your organization's help desk or administrator to reset your password. For information about to register for password reset after you are back on your device, see the process above in this article. |

## Next steps

- [Change your password by using self-service password reset](active-directory-passwords-update-your-own-password.md)

- [Security info page](https://mysignins.microsoft.com/security-info)

- [Password reset portal](https://passwordreset.microsoftonline.com/)

- [When you can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant)