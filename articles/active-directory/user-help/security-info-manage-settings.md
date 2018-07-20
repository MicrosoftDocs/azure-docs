---
title: Manage your security info - Azure Active Directory | Microsoft Docs
description: Learn how to manage your security info, including how to work with your two-step verification settings.
services: active-directory
author: eross-msft
manager: mtillman
ms.reviewer: sahenry

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/25/2018
ms.author: lizross
---

# How to: Manage your security info (preview)

[!INCLUDE[preview-notice](../../../includes/active-directory-end-user-preview-notice-security-info.md)]

You can use your security info to sign in to your work or school account or to reset your password.

When you sign in, depending on your organization's settings, you might see a check box that says, **Don't ask again for X days**. This check box lets you stay signed in to your device for the number of days your administrator allows, without requiring reverification.

## Change your info
You can update or add security info or change your default, based on what's allowed by your administrator and your organization.

### To change your info

1. Sign in to your work or school account.

2. Go to myapps.microsoft.com, select your name from the upper right corner of the page, and then select **Profile**.

3. In the **Manage account** area, select **Edit security info**.

    ![Profile screen with Edit security info link highlighted](media/security-info/security-info-profile.png)

4. Use your default verification method to approve the access and to see your current security info details, if your admin has set this up for your organization.

5. On the **Keep your account secure** page, you can:

    - Select **Add security info** to add additional, available verification methods.

    - Select **Change default** to change your default verification method.

    - Select the **pencil** icon next to an existing verification method to update your info.

    ![Security info screen with existing, editable info](media/security-info/security-info-edit.png)

6. After you make your changes, you can leave the page and your changes will be saved.

If you don't see these options or you're unable to access the myapps.microsoft.com page, it's possible that your organization uses custom options or a custom page. You'll need to contact your administrator for more help.

## Manage your security info for a lost or potentially compromised device

If you lose your device or your device becomes compromised, you'll have to redo the verification process for all of your previously trusted devices.

### To manage your security info for lost or potentially compromised devices

1. Sign in to your work or school account.

2. Go to myapps.microsoft.com, select your name from the upper-right corner of the page, and then select **Profile**.

3. In the **Manage account** area, select **Forget MFA on remembered devices**.
    
    Choosing this option means that you'll have to go through the Multi-Factor Authentication process again after you sign in.

    ![Profile screen with the forget link highlighted](media/security-info/security-info-forget.png)

## Manage your app passwords

Certain non-browser apps, such as Outlook 2010, doesn't support two-step verification. This lack of support means that if you're using two-step verification, the app won't work. To get around this problem, you can create an auto-generated password to use with each non-browser app, separate from your normal password.

When using app passwords, it's important to remember:

- App passwords are auto-generated and only entered once per app.

- There's a limit of 40 passwords per user. If you try to create one after that limit, you'll be prompted to delete an existing password before being allowed to create the new one.

- Use one app password per device, not per app. For example, create a single password for all the apps on your laptop, and then another single password for all the apps on your desktop.

    >[!Note]
    >Office 2013 clients (including Outlook) support new authentication protocols and can be used with two-step verification. This support means that after two-step verification is turned on, you'll no longer need app passwords for Office 2013 clients. For more info, see the [How modern authentication works for Office 2013 and Office 2016 client apps](https://support.office.com/article/how-modern-authentication-works-for-office-2013-and-office-2016-client-apps-e4c45989-4b1a-462e-a81b-2a13191cf517) article.

### Where to create and delete your app passwords

You're given an app password during your initial two-step verification registration. If you need more than that one password, you can create additional passwords, based on how you use two-step verification:

- **You use two-step verification with your Microsoft Azure account.** Create and delete your app passwords using the [Azure portal](https://portal.azure.com). For more info, see the [App passwords and two-step verification](https://support.microsoft.com/en-us/help/12409/microsoft-account-app-passwords-two-step-verification) article.

- **You use two-step verification with your personal Microsoft account.** Create and delete your app passwords using the [Security basics](https://account.microsoft.com/account/) page with your Microsoft account. For more info, see the [App passwords and two-step verification](https://support.microsoft.com/help/12409/microsoft-account-app-passwords-two-step-verification) article.

- **You use two-step verification with your work or school account and your Office 365 apps.** Create and delete your app passwords using the instructions in the [Create and delete app passwords using the Office 365 portal](#create-and-delete-app-passwords-using-the-office-365-portal) section of this article.

### Create and delete app passwords using the Office 365 portal

If you use two-step verification with your work or school account and your Office 365 apps, you can create and delete your app passwords using the Office 365 portal. You can have a maximum of 40 app passwords at any one time. If you need another app password after that limit, you'll have to delete one of your existing app passwords.

### To create app passwords using the Office 365 portal

1. Sign in to your work or school account.

2. Go to https://portal.office.com, select the **Settings** icon from the upper right of the **Office 365 portal** page, and then expand **Additional security verification**.

    ![Office portal showing expanded additional security verification area](media/security-info/security-info-o365password.png)

3. Select the text that says, **Create and manage app passwords** to open the **app passwords** page.

4. Select **Create**, type a friendly name for the app that needs the app password, and then select **Next**.

5. Select **Copy password to clipboard**, and then select **Close**.

6. Use the copied app password to sign in to your non-browser app. You only need to enter this password once and it's remembered for the future.

### To delete app passwords using the Office 365 portal

1. Sign in to your work or school account.

2. Go to https://portal.office.com, select the **Settings** icon from the upper right of the **Office 365 portal** page, and then select **Additional security verification**.

3. Select the text that says, **Create and manage app passwords** to open the **app passwords** page.

4. Select **Delete** for the app password to delete, select **Yes** in the confirmation box, and then select **Close**.

    The app password is successfully deleted.

5. Follow the steps for creating an app password to create your new app password.

## Common problems and solutions with your security info

This article helps you to troubleshoot your security info, including two-step verification-related problems.

|Problem|Solution|
|-------|--------|
|I don't have my phone with me|It's possible that you don't have your phone with you at all times, but that you'll still want to sign in to your work or school account. To fix this problem, you can sign in using a different authentication method that doesn't require your phone, such as your email address or your office phone number. To add additional verification methods to your security info, you can follow the steps in the [Change your info](#change-your-info) section.|
|I lost my phone or it was stolen|Unfortunately, losing your phone or it being stolen can happen. In this situation, it's highly recommended that you let your organization know so your IT staff can reset your app passwords and clear any remembered devices from your trusted devices list. You can also forget your own trusted devices by following the steps in the [Manage your security info for a lost or potentially compromised device](#manage-your-security-info-for-a-lost-or-potentially-compromised-device) section.|
|I got a new phone number|There are two ways to fix this problem. You can sign in using an alternate authentication method that doesn't require your phone number, such as email, or if that's not an option, you can contact your organization's IT staff and have them clear your settings. To add additional verification methods to your security info, you can follow the steps in the [Change your info](#change-your-info) section.|
|My default verification method is wrong|You can update your default verification method in your security options. For specific details, you can go to the [Change your info](#change-your-info) section.|
|I'm not receiving a text or call on my mobile device|If you've successfully received texts or phone calls to your mobile device in the past, then this issue is most-likely with the phone provider, not your account. Make sure that you have good cell signal, and that you're able to receive text messages and phone calls. You can ask a friend to call or text you as a test.<br><br>If you can successfully receive text and phone messages, but you still haven't gotten the notification, you can try using a different verification method. You can add additional verification methods to your security info by following the steps in the [Change your info](#change-your-info) section. If you don’t have another method to add, you can contact your company support and ask them to clear your settings so you can set up your verification methods the next time you sign in.<br><br>If you often have delays due to bad cell signal, we recommend you use the Microsoft Authenticator app on your mobile device. The app can generate random security codes that you use to sign in, and these codes don't require any cell signal or internet connection. For more info about the Microsoft Authenticator app, see the [Get started with the Microsoft Authenticator app](https://docs.microsoft.com/azure/multi-factor-authentication/end-user/microsoft-authenticator-app-how-to) article.|
|My app passwords aren't working|Make sure you typed your password correctly. If you're sure you entered your password correctly, you can try to sign in again and create a new app password. If neither of those options fix your problem, contact your company support so they can delete your existing app passwords, letting you create brand-new ones.|
|None of the options in this table has solved my problem|If you've tried these troubleshooting steps, but are still running into problems; contact your company support. Your company support should be able to assist you.|

## Next steps

- Learn about security info and two-step verification in the [Overview](user-help-overview.md) article

- Follow one of these how-to articles to learn about how to set up your devices in the security info area:

    - [Set up your security info to use the Microsoft Authenticator app](security-info-setup-auth-app.md)

    - [Set up your security info to use a phone number](security-info-setup-phone-number.md)

    - [Set up your security info to use a text message](security-info-setup-text-msg.md)

    - [Set up your security info to use an email address](security-info-setup-email.md)

    - [Set up your security info to use security questions](security-info-setup-questions.md)

- Reset your password if you've lost or forgotten it, from the [Password reset portal](https://passwordreset.microsoftonline.com/) or follow the steps in the [Reset your work or school password](user-help-reset-password.md) article.

- Get troubleshooting tips and help for sign-in problems in the [Can't sign in to your Microsoft account](https://support.microsoft.com/help/12429/microsoft-account-sign-in-cant) article.