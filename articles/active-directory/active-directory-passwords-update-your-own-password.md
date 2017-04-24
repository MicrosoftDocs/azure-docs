---
title: 'Azure AD: Reset Your Password | Microsoft Docs'
description: Use self-service password reset to regain access to your account
services: active-directory
keywords: Active directory password management, password management, Azure AD self service password reset, SSPR
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila


ms.assetid: 7ba69b18-317a-4a62-afa3-924c4ea8fb49
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/11/2017
ms.author: joflore
ms.custom: end-user

---
# Help I forgot my Azure AD password

If you forgot your password, never received one from your IT staff, been locked out of your account, or want to change it, we can help.

## Reset or unlock my password for a work or school account

To get into your work or school account, follow the steps below to access Azure AD self-service password reset, or SSPR as we like to call it.

1. From any work or school sign-in page, click the **Can't access your account?** link then click **Work or school account** or go directly to the [password reset page](https://passwordreset.microsoftonline.com/).

   > [!NOTE]
   > If you are trying to get back into a Personal account like hotmail.com or outlook.com try the [suggestions found in this article](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant)
   >
    ![Can't access your account?][Login]

2. Enter your work or school **User ID**, prove you aren't a robot by entering the characters you see on the screen, then click **Next**.

   > [!NOTE]
   > If your IT staff has not enabled this functionality, a "contact your administrator" link appears so your IT staff can help, via email or a web portal of their own.
   >

3. Depending on how your IT staff has configured SSPR you see one or more of the following. Either you or your IT staff have populated some of this information before using the information [here](active-directory-passwords-reset-register.md).
    * **Email my alternate email**
    * **Text my mobile phone**
    * **Call my mobile phone**
    * **Call my office phone**
    * **Answer my security questions**

    Choose an option, provide the correct responses, and click **Next**.

    ![Verify your authentication data][Verification]

4. Your IT staff may need more verification and you may have to repeat step 3 again with a different choice.
5. On the **Choose a new password** page, enter a new password, confirm your password, and then click **Finish**. We suggest your password be 8-16 characters with uppercase and lowercase characters, numbers, and special characters.

   > [!NOTE]
   > If you needed to unlock your account, at this point choose the option to unlock only, or change your password and unlock.
   >

6. When you see, **Your password has been reset**, you can sign in with your new password.

    ![Your password has been reset][Complete]

You should now be able to access your account, if not you should contact your organization's IT staff for further help.

You may receive a confirmation email that comes from an account like "Microsoft on behalf of <your organization>". If you get an email like this, and you did not use self-service password reset to regain access to your account, contact your organization's IT staff.

## Change my password

If you know your password already and want to change it, use the steps that follow to change your password.

### Change your password from the Office 365 portal

Use this method if you normally access your applications using the Office portal

1. Sign into your [Office 365 account](https://www.office.com)
2. Click on your profile on the upper right side, and click **View account**
3. Click **Security & privacy** > **Password**
4. Enter your old password, set and confirm your new password, and then click **Submit**

### Change your password from the Azure Access Panel

Use this method if you normally access your applications from the Azure Access Portal

1. Sign in to the [Azure Access Portal](https://myapps.microsoft.com/) using your existing password
2. Click on your profile on the upper right side, then click **Profile**
3. Click **Change password**
4. Enter your old password, set and confirm your new password, and then click **Submit**

## Next Steps

* [How to register to use self-service password reset](active-directory-passwords-reset-register.md)
* [Password reset registration page](http://aka.ms/ssprsetup)
* [Password reset portal](https://passwordreset.microsoftonline.com/)
* [Can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant)

[Login]: ./media/active-directory-passwords-update-your-own-password/reset-1-login.png "Login page Can't access your account?"
[Verification]: ./media/active-directory-passwords-update-your-own-password/reset-2-verification.png "Verify your authentication data"
[Change]: ./media/active-directory-passwords-update-your-own-password/reset-3-change.png "Change your password"
[Complete]: ./media/active-directory-passwords-update-your-own-password/reset-4-complete.png "Password has been reset"
