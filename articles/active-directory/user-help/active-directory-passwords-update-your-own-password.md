---
title: Reset your password - Azure Active Directory | Microsoft Docs
description: Use self-service password reset to regain access to your work or school user account
services: active-directory
author: eross-msft
manager: daveba
ms.reviewer: sahenry
ms.assetid: 7ba69b18-317a-4a62-afa3-924c4ea8fb49

ms.service: active-directory
ms.subservice: user-help
ms.workload: identity
ms.topic: conceptual
ms.date: 01/11/2018
ms.author: lizross
ms.custom: end-user
ms.collection: M365-identity-device-management
---

# Reset your work or school password

If you forgot your password, never received one from your company support, have been locked out of your account, or want to change it, we can help. If you know your password and just need to change it, continue to the [Change my password](#change-my-password) section.

   > [!NOTE]
   > If you're trying to get back in to your personal account like Xbox, hotmail.com, or outlook.com, try the suggestions in the [When you can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant) article.
   >

## Reset or unlock my password for a work or school account

You might be unable to access your Azure Active Directory (Azure AD) account because of one of the following reasons:

* Your password is not working, and you want to reset it.
* You know your password, but your account is locked out and you want to unlock it.

Use the following steps to access Azure AD self-service password reset (SSPR) and get back in to your account.

1. From any work or school **Sign-in** page, select the **Can't access your account?** link, and then select **Work or school account** or go directly to the [Password reset page](https://passwordreset.microsoftonline.com/).

    ![Can't access your account?][Login]

2. Enter your work or school **User ID**, prove you aren't a robot by entering the characters you see on the screen, and then select **Next**.

   > [!NOTE]
   > If your IT staff has not enabled this functionality, a "Contact your administrator" link appears so your IT staff can help via email or a web portal of their own.
   >
   > If you need to unlock your account, at this point select the option **I know my password, but still can't sign in.**
   >

3. Depending on how your IT staff has configured SSPR you should see one or more of the following authentication methods. Either you or your IT staff should have populated some of this information by following the steps in the [Register for self-service password reset](active-directory-passwords-reset-register.md) article.

   * **Email my alternate email**
   * **Text my mobile phone**
   * **Call my mobile phone**
   * **Call my office phone**
   * **Answer my security questions**

   Choose an option, provide the correct responses, and then select **Next**.

   ![Verify your authentication data][Verification]

4. Your IT staff might need more verification, and you might have to repeat step 3 with a different choice.
5. On the **Choose a new password** page, enter a new password, confirm your password, and then select **Finish**. Your work or school password might have certain requirements that you need to adhere to. We suggest that choose a password that's 8 to 16 characters long and includes uppercase and lowercase characters, a number, and a special character.
6. When you see the message **Your password has been reset**, you can sign in with your new password.

    ![Your password has been reset][Complete]

You should now be able to access your account. If you can't access your account, you should contact your organization's IT staff for further help.

You might receive a confirmation email that comes from an account like "Microsoft on behalf of \<your organization>." If you get an email like this one and you did not use self-service password reset to regain access to your account, contact your organization's IT staff.

## Change my password

If you know your password already and want to change it, use the following steps.

### Change your password from the Office 365 portal

Use this method if you normally access your applications through the Office portal:

1. Sign in to your [Office 365 account](https://www.office.com) with your existing password.
2. Select your profile on the upper-right side, and then select **View account**.
3. Select **Security & privacy** > **Password**.
4. Enter your old password, set and confirm your new password, and then select **Submit**.

### Change your password from the Azure Access Panel

Use this method if you normally access your applications from the Azure Access Panel (MyApps):

1. Sign in to the [Azure Access Panel](https://myapps.microsoft.com/) with your existing password.
2. Select your profile on the upper-right side, and then select **Profile**.
3. Select **Change password**.
4. Enter your old password, set and confirm your new password, and then select **Submit**.

## Reset password at sign-in

If your administrator has enabled the functionality, you can now see a link to **Reset password** at your Windows 10 Fall Creators Update sign-in screen.

![Sign-in screen][LoginScreen]

Select the **Reset password** link to open up the SSPR experience at the sign-in screen so that you can reset your password without having to sign in to access the normal web-based experience.

1. Confirm your user ID and select **Next**.
2. Select and confirm a contact method for verification. Your IT staff might need more verification, and you might have to repeat this step with a different choice.

   ![Contact method][ContactMethod]

3. On the **Create a new password** page, enter a new password, confirm your password, and then select **Next**. We suggest that your password is 8-16 characters long and consists of uppercase and lowercase letters, numbers, and special characters.

   ![Reset password][ResetPassword]

4. When you see the message **Your password has been reset**, select **Finish**.

You should now be able to access your account. If not, contact your organization's IT staff for further help.

## Common problems and their solutions

 Here are some common error cases and their solutions:

| Error case| What error do you see?| Solution |
| --- | --- | --- |
| I see an error when I try to change my password. | Unfortunately, your password contains a word, phrase, or pattern that makes your password easily guessable. Please try again with a different password. | Choose a password that is more difficult to guess. |
| I get a "Please contact your administrator" page after entering my user ID | Please contact your administrator. <br> <br> We've detected that your user account password is not managed by Microsoft. As a result, we are unable to automatically reset your password. <br> <br> You need to contact your IT staff for further assistance. | You're seeing this message because your IT staff manages your password in your on-premises environment. You can't reset your password from the "Can't access your account" link. <br> <br> To reset your password, contact your IT staff directly for help, and let them know you want to reset your password so they can enable this feature for you.|
| I get a "Your account is not enabled for password reset" error after entering my user ID | Your account is not enabled for password reset. <br> <br> We're sorry, but your IT staff has not set up your account to use this service. <br> <br> If you'd like, we can contact an administrator in your organization to reset your password for you. | You're seeing this message because your IT staff has not enabled password reset for your organization from the "Can't access your account" link, or hasn't licensed you to use the feature. <br> <br> To reset your password, select the "contact an administrator link" to send an email to your company's IT staff, and let them know you want to reset your password so they can enable this feature for you. |
| I get a "We could not verify your account" error after entering my user ID | We could not verify your account. <br> <br> If you'd like, we can contact an administrator in your organization to reset your password for you. | You're seeing this message because you're enabled for password reset, but you have not registered to use the service. To register for password reset, go to https://aka.ms/ssprsetup after you have regained access to your account. <br> <br> To reset your password, select the "contact an administrator" link to send an email to your company's IT staff. |

## Next steps

* [How to register to use self-service password reset](active-directory-passwords-reset-register.md)
* [Password reset registration page](https://aka.ms/ssprsetup)
* [Password reset portal](https://passwordreset.microsoftonline.com/)
* [Can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant)

[Login]: ./media/active-directory-passwords-update-your-own-password/reset-1-login.png "Login page Can't access your account?"
[Verification]: ./media/active-directory-passwords-update-your-own-password/reset-2-verification.png "Verify your authentication data"
[Change]: ./media/active-directory-passwords-update-your-own-password/reset-3-change.png "Change your password"
[Complete]: ./media/active-directory-passwords-update-your-own-password/reset-4-complete.png "Password has been reset"
[LoginScreen]: ./media/active-directory-passwords-update-your-own-password/login-screen.png "Windows 10 Fall Creators Update login screen Reset password link"
[ContactMethod]: ./media/active-directory-passwords-update-your-own-password/reset-contact-method-screen.png "Verify your authentication data"
[ResetPassword]: ./media/active-directory-passwords-update-your-own-password/reset-password-screen.png "Change your password"
