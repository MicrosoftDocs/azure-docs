---
title: 'Azure AD: Reset Your Password | Microsoft Docs'
description: Use self-service password reset to regain access to your Work or School user account
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
ms.reviewer: gahug

ms.assetid: 7ba69b18-317a-4a62-afa3-924c4ea8fb49
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/25/2017
ms.author: joflore
ms.custom: end-user

---
# Help, I forgot my Azure AD password

If you forgot your password, never received one from your IT staff, been locked out of your account, or want to change it, we can help. If you know your password and just need to change it continue down to the section [Change my password](#change-my-password) below.

   > [!NOTE]
   > If you are trying to get back into your personal account like Xbox, hotmail.com, or outlook.com try the [suggestions found in this article](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant)
   >

## Reset or unlock my password for a work or school account

If you unable to access your account because of one of the following:

* Your password is not working and you would like to reset it.
* You know your password but your account is locked out and you would like to unlock your account.

Follow the steps that follow to access Azure AD self-service password reset, SSPR as we like to call it, and get back into your account.

1. From any work or school sign-in page, click the **Can't access your account?** link then click **Work or school account** or go directly to the [password reset page](https://passwordreset.microsoftonline.com/).

    ![Can't access your account?][Login]

2. Enter your work or school **User ID**, prove you aren't a robot by entering the characters you see on the screen, then click **Next**.

   > [!NOTE]
   > If your IT staff has not enabled this functionality, a "contact your administrator" link appears so your IT staff can help, via email or a web portal of their own.
   > 
   > If you need to unlock your account, at this point choose the option "I know my password, but still can't sign in".
   > 

3. Depending on how your IT staff has configured SSPR you see one or more of the following. Either you or your IT staff have populated some of this information before using the article [Register for self-service password reset](active-directory-passwords-reset-register.md).

   * **Email my alternate email**
   * **Text my mobile phone**
   * **Call my mobile phone**
   * **Call my office phone**
   * **Answer my security questions**

   Choose an option, provide the correct responses, and click **Next**.

   ![Verify your authentication data][Verification]

4. Your IT staff may need more verification and you may have to repeat step 3 again with a different choice.
5. On the **Choose a new password** page, enter a new password, confirm your password, and then click **Finish**. We suggest your password be 8-16 characters with uppercase and lowercase characters, numbers, and special characters.
6. When you see, **Your password has been reset**, you can sign in with your new password.

    ![Your password has been reset][Complete]

You should now be able to access your account, if not you should contact your organization's IT staff for further help.

You may receive a confirmation email that comes from an account like "Microsoft on behalf of \<your organization>". If you get an email like this, and you did not use self-service password reset to regain access to your account, contact your organization's IT staff.

## Change my password

If you know your password already and want to change it, use the steps that follow to change your password.

### Change your password from the Office 365 portal

Use this method if you normally access your applications using the Office portal

1. Sign into your [Office 365 account](https://www.office.com) using your existing password
2. Click on your profile on the upper right side, and click **View account**
3. Click **Security & privacy** > **Password**
4. Enter your old password, set and confirm your new password, and then click **Submit**

### Change your password from the Azure Access Panel

Use this method if you normally access your applications from the Azure Access Portal

1. Sign in to the [Azure Access Portal](https://myapps.microsoft.com/) using your existing password
2. Click on your profile on the upper right side, then click **Profile**
3. Click **Change password**
4. Enter your old password, set and confirm your new password, and then click **Submit**

## Common problems and their solutions

 Here are some common error cases and their solutions:

| Error Case| What error do you see?| Solution |
| --- | --- | --- |
| I get a "please contact your administrator" page after entering my user ID | Please contact your administrator <br> <br> We've detected that your user account password is not managed by Microsoft. As a result, we are unable to automatically reset your password. <br> <br> You need to contact your IT staff for any further assistance. | You are seeing this message because your IT staff manages your password in your on-premises environment and does not allow you to reset your password from the Can't access your account link. <br> <br> To reset your password,  contact your IT staff directly for help, and let them know you want to reset your password so they can enable this feature for you.|
| I get a "your account is not enabled for password reset" error after entering my user ID | Your account is not enabled for password reset <br> <br> We're sorry, but your IT staff has not set up your account for use with this service. <br> <br> If you'd like, we can contact an administrator in your organization to reset your password for you. | You are seeing this message because your IT staff has not enabled password reset for your organization from the Can't access your account link, or hasn't licensed you to use the feature. <br> <br> To reset your password, click the contact an administrator link to send an email to your company's IT staff, and let them know you want to reset your password so they can enable this feature for you. |
| I get a "we could not verify your account" error after entering my user ID | We could not verify your account <br> <br> If you'd like, we can contact an administrator in your organization to reset your password for you. | You are seeing this message because you are enabled for password reset, but you have not registered to use the service. To register for password reset, go to http://aka.ms/ssprsetup after you have regained access to your account. <br> <br> To reset your password, click the contact an administrator link to send an email to your company's IT staff. |

## Next steps

* [How to register to use self-service password reset](active-directory-passwords-reset-register.md)
* [Password reset registration page](http://aka.ms/ssprsetup)
* [Password reset portal](https://passwordreset.microsoftonline.com/)
* [Can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant)

[Login]: ./media/active-directory-passwords-update-your-own-password/reset-1-login.png "Login page Can't access your account?"
[Verification]: ./media/active-directory-passwords-update-your-own-password/reset-2-verification.png "Verify your authentication data"
[Change]: ./media/active-directory-passwords-update-your-own-password/reset-3-change.png "Change your password"
[Complete]: ./media/active-directory-passwords-update-your-own-password/reset-4-complete.png "Password has been reset"
