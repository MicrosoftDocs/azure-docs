---
title: Set up your phone number as your verification method - Azure AD
description: How to set up your Security info (preview) page to verify your identity using your phone number and mobile device as your verification method.
services: active-directory
author: curtand
manager: daveba
ms.reviewer: sahenry

ms.service: active-directory
ms.workload: identity
ms.subservice: user-help
ms.topic: end-user-help
ms.date: 02/13/2019
ms.author: curtand
---

# Set up a phone number as your verification method

You can follow these steps to add your two-factor verification and password reset methods. After you've set this up the first time, you can return to the **Security info** page to add, update, or delete your security information.

If you're prompted to set this up immediately after you sign in to your work or school account, see the detailed steps in the [Set up your security info from the sign-in page prompt](security-info-setup-signin.md) article.

[!INCLUDE [preview-notice](../../../includes/active-directory-end-user-preview-notice-security-info.md)]

> [!Note]
> Security info doesn't support using phone extensions. Even if you add the proper format, +1 4255551234X12345, the extensions are removed before the call is placed.
>
> If you don't see a phone option, it's possible that your organization doesn't allow you to use this option for verification. In this case, you'll need to choose another method or contact your organization's help desk for more assistance.

## Security verification versus password reset authentication

Security info methods are used for both two-factor security verification and for password reset. However, not all methods can be used for both.

| Method | Used for |
| ------ | -------- |
| Authenticator app | Two-factor verification and password reset authentication. |
| Text messages | Two-factor verification and password reset authentication. |
| Phone calls | Two-factor verification and password reset authentication. |
| Security key | Two-factor verification and password reset authentication. |
| Email account | Password reset authentication only. You'll need to choose another method for two-factor verification. |
| Security questions | Password reset authentication only. You'll need to choose another method for two-factor verification. |

## Set up phone calls from the Security info page

Depending on your organization’s settings, you might be able to use phone calls as one of your security info methods.

>[!Note]
>If you want to receive a text message instead of a phone call, follow the steps in the [Set up security info to use text messaging](security-info-setup-text-msg.md) article.

### To set up phone calls

1. Sign in to your work or school account and then go to your https://myaccount.microsoft.com/ page.

    ![My Profile page, showing highlighted Security info links](media/security-info/securityinfo-myprofile-page.png)

2. Select **Security info** from the left navigation pane or from the link in the **Security info** block, and then select **Add method** from the **Security info** page.

    ![Security info page with highlighted Add method option](media/security-info/securityinfo-myprofile-addmethod-page.png)

3. On the **Add a method** page, select **Phone** from the drop-down list, and then select **Add**.

    ![Add method box, with Phone selected](media/security-info/securityinfo-myprofile-addphonetext.png)

4. On the **Phone** page, type the phone number for your mobile device, choose **Call me**, and then select **Next**.

    ![Add phone number and choose phone calls](media/security-info/securityinfo-myprofile-phonecall-addnumber.png)

5. Answer the verification phone call, sent to the phone number you entered, and follow the instructions.

    The page changes to show your success.

    ![Success notification, connecting the phone number, the choice to receive phone calls, and your account](media/security-info/securityinfo-myprofile-phonetext-success.png)

    Your security info is updated and you can use phone calls to verify your identity when using two-step verification or password reset. If you want to make phone calls your default method, see the [Change your default security info method](#change-your-default-security-info-method) section of this article.

## Delete phone calls from your security info methods

If you no longer want to use phone calls as a security info method, you can remove it from the **Security info** page.

>[!Important]
>If you delete phone calls by mistake, there's no way to undo it. You'll have to add the method again, following the steps in the [Set up phone calls](#set-up-phone-calls-from-the-security-info-page) section of this article.

### To delete phone calls

1. On the **Security info** page, select the **Delete** link next to the **Phone** option.

    ![Link to delete the phone method from security info](media/security-info/securityinfo-myprofile-phonetext-delete.png)

2. Select **Yes** from the confirmation box to delete the **Phone** number. After your phone number is deleted, it's removed from your security info and it disappears from the **Security info** page. If **Phone** is your default method, the default will change to another available method.

## Change your default security info method

If you want phone calls to be the default method used when you sign-in to your work or school account using two-factor verification or for password reset requests, you can set it from the **Security info** page.

### To change your default security info method

1. On the **Security info** page, select the **Change** link next to the **Default sign-in method** information.

    ![Change link for default sign-in method](media/security-info/securityinfo-myprofile-phonetext-defaultchange.png)

2. Select **Phone - call (*_your_phone_number_*)** from the drop-down list of available methods, and then select **Confirm**.

    ![Choose method for default sign-in](media/security-info/securityinfo-myprofile-phonecall-changeddefault.png)

    The default method used for sign-in changes to **Phone - call (*_your_phone_number_*)**.

## Additional security info methods

You have additional options for how your organization contacts you to verify your identity, based on what's you're trying to do. The options include:

- **Authenticator app.** Download and use an authenticator app to get either an approval notification or a randomly generated approval code for two-step verification or password reset. For step-by-step instructions about how to set up and use the Microsoft Authenticator app, see [Set up security info to use an authenticator app](security-info-setup-auth-app.md).

- **Mobile device text.** Enter your mobile device number and get a text a code you'll use for two-step verification or password reset. For step-by-step instructions about how to verify your identity with a text message (SMS), see [Set up security info to use text messaging (SMS)](security-info-setup-text-msg.md).

- **Security key.** Register your Microsoft-compatible security key and use it along with a PIN for two-step verification or password reset. For step-by-step instructions about how to verify your identity with a security key, see [Set up security info to use a security key](security-info-setup-security-key.md).

- **Email address.** Enter your work or school email address to get an email for password reset. This option isn't available for two-step verification. For step-by-step instructions about how to set up your email, see [Set up security info to use email](security-info-setup-email.md).

- **Security questions.** Answer some security questions created by your administrator for your organization. This option is only available for password reset and not for two-step verification. For step-by-step instructions about how to set up your security questions, see the [Set up security info to use security questions](security-info-setup-questions.md) article.

    >[!Note]
    >If some of these options are missing, it's most likely because your organization doesn't allow those methods. If this is the case, you'll need to choose an available method or contact your administrator for more help.

## Next steps

- Reset your password if you've lost or forgotten it, from the [Password reset portal](https://passwordreset.microsoftonline.com/) or follow the steps in the [Reset your work or school password](active-directory-passwords-update-your-own-password.md) article.

- Get troubleshooting tips and help for sign-in problems in the [Can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant) article.
