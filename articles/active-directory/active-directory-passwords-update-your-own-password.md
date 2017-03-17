---
title: How to update your own password by using Azure Active Directory | Microsoft Docs
description: Learn the ways you can register for password reset, how to change your password, and how to reset your own password in case you ever forget it.
services: active-directory
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
editor: curtand

ms.assetid: 7ba69b18-317a-4a62-afa3-924c4ea8fb49
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/10/2017
ms.author: joflore

---
# Update your own password
If you are unsure how to manage your work or school account password, you've come to the right place. Learn how to register for password reset, change a password, or reset a password and how to unlock your account.


## Register for password reset
> [!IMPORTANT]
> **Why am I seeing this?** If you followed a link to get here, you're probably seeing this because your administrator requires you to register for password reset to gain access to your app. You might be asked for phone or email information, or to set up security questions. Don’t worry--we only use this information to keep your account more secure. The steps presented here should help you to reach your goal.
>
>
The fastest way to register for password reset is to go to [http://aka.ms/ssprsetup](http://aka.ms/ssprsetup).  

1. Go to [http://aka.ms/ssprsetup](http://aka.ms/ssprsetup).
2. Enter your username and password.
3. Click **Set it up now** to choose an option to register for. This example shows how to register using **Authentication Phone**. Your administrator may require you to register for more than one option. 

   ![Setup options][101]
4. Select your country code from the drop-down list box, enter your **full phone number including area code**, and choose **text me** or **call me**. Either option provides you with a code.

   ![Phone verification][102]
5. Enter the code you received, and then click **verify**. 

   ![Verification code sample][103]
6. Click **finish** to complete your password reset. Now you can use what you registered for to reset your password at any time by going to [https://passwordreset.microsoftonline.com](https://passwordreset.microsoftonline.com).

   ![Recovery information][104]

   > [!IMPORTANT]
   > If your admin lets you register for more than one option, we highly recommend you also register a backup option in case you lose your phone or access to your email.
   >
   >

## Change your password in Office 365
Follow the steps below to change your work or school account password in Office 365. If you have forgotten your password and want to reset it, follow the steps to [Reset your password](#how-to-reset-your-password).

1. Sign in to Office 365 with your work or school account.
2. Go to **Settings** > **Office 365 settings** > **Password** > **Change password**.
3. Enter your old password, and then enter a new password and confirm it.
4. Click **Save**.

You can read more about this at the [Office 365 documentation center](https://support.office.com/article/Change-my-password-in-Office-365-for-business-d1efbaee-63a7-4c08-ab1d-71bf932bbb5d).

## Change your password from the Access Panel
Follow the steps below to change your work or school account password from the [Access Panel](https://myapps.microsoft.com). If you have forgotten your password and want to reset it, follow the steps [here](#how-to-reset-your-password).

1. Sign in to https://myapps.microsoft.com with your work or school account.
2. On the **Profile** tab, click **Change my password**.
3. Enter your old password, and then enter a new password and confirm it.
4. Click **Submit**.

Run into a problem changing your password? Read about [common problems and their solutions](#common-problems-and-their-solutions).

## Reset your password
Follow the steps below to reset your work or school account password from any work or school account sign-in page.

> [!IMPORTANT]
> This feature is available to you only if your admin has turned it on. If it's not turned on, you will see a message indicating your account is not enabled for this feature. Use the "Contact your administrator" link to get in touch with your admin to unlock your account.
>
> If your admin has enabled your account for this feature, you need to sign up before you can use it. You can do that at http://aka.ms/ssprsetup.
>
>

1. On any work or school account sign-in page, click the "Can't access your account?" link or go to https://passwordreset.microsoftonline.com.

   ![Account sign-in][110]

2. On the "Who are you?" page, enter your work or school account ID and prove you aren't a robot by passing the CAPTCHA challenge. Click **Next**.

   ![Identity confirmation][111]

3. Choose an option to reset your password. Depending on how your admin has configured the system, you might see one or more of the following choices:

   * **Email my alternate email:** Sends an email with a 6-digit code to either your **alternate email** or **authentication email** (you choose).
   * **Text my mobile phone:** Texts your phone with a 6-digit code to either your **mobile phone** or **authentication email** (you choose).
   * **Call my mobile phone:** Calls your **mobile phone** or **authentication phone** (you choose). Press the *#* key to verify the call.
   * **Call my office phone:** Calls your **office phone**. Press the *#* key to verify the call.
   * **Answer my security questions:** Displays your preregistered security questions for you to answer.

   ![Password reset options][109]

4. For phone-based options, enter your full phone number, and click **Text** to verify that it's correct. A text with a 6-digit code is then sent to your phone.

5. Enter the 6-digit code you received, and click **Next**.

6. Your administrator may require an additional verification step. If so, repeat step 3 with a different option selected.

7. On the "Choose a new password" page, enter a new password and confirm your choice, and then click **Finish**.

   ![New password confirmation][107]

8. After your password is accepted, you can sign in with the new password.

    ![Password reset confirmation][108]

Run into a problem resetting your password? Read about [common problems and their solutions](#common-problems-and-their-solutions).

## Unlock your account
Follow the steps below to unlock your local account from any work or school account sign-in page. 

> [!NOTE]
> You are only able to unlock your account if it has been locked on-premises.

> [!IMPORTANT]
> This feature is available to you only if your admin has turned it on. If it's not turned on, you will see a message indicating your account is not enabled for this feature. Use the "Contact your administrator" link to get in touch with your admin to unlock your account.
>
> If your admin has enabled your account for this feature, you need to sign up before you can use it. You can do that at http://aka.ms/ssprsetup.
>
>

1. On any work or school account sign-in page, click the "Can't access your account?" link or go to https://passwordreset.microsoftonline.com.

   ![Account sign-in][110]
2. On the "Who are you?" page, enter your work or school account ID and prove you aren't a robot by passing the CAPTCHA challenge. Click **Next**.

   ![Identity confirmation][111]
3. Choose an option to unlock your account. Depending on how your administrator has configured the system, you might see one or more of the following choices:

   * **Email my alternate email:** Sends an email with a 6-digit code to either your **alternate email** or **authentication email** (you choose).
   * **Text my mobile phone:** Texts your phone with a 6-digit code to either your **mobile phone** or **authentication email** (you choose).
   * **Call my mobile phone:** Calls your **mobile phone** or **authentication phone** (you choose). Press the *#* key to verify the call.
   * **Call my office phone:** Calls your **office phone**. Press the *#* key to verify the call.
   * **Answer my security questions:** Displays your pre-registered security questions for you to answer.

   ![Identity verification options][112]
4. With the "Answer my security questions" option selected, fill in the answers to your security questions, and click **Next** to verify your identity.

5. Your administrator may require an additional verification step. If so, repeat step 3 with a different option selected.
6. When you see the success page, you're good to go! Your on-premises account has been unlocked, and you can now sign in.

   ![Unlocked account sign-in][113]

   > [!IMPORTANT]
   > Make sure you update all your devices to your new password. Oftentimes a rogue app with an old password (like your phone email client) can be the culprit behind why your account got locked out in the first place.
   >
   >


## Common problems and their solutions
Here are some common error cases and their solutions:

<table>
          <tbody><tr>
            <td>
              <p>
                <strong>Error case</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>What error do you see?</strong>
              </p>
            </td>
            <td>
              <p>
                <strong>Solution</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p>I get a "Please contact your admin" page after entering my user ID</p>
            </td>
            <td>
              <p>Please contact your admin. <br><br>We've detected that your user account password is not managed by Microsoft. As a result, we are unable to automatically reset your password. <br><br>You will need to contact your admin or helpdesk for any further assistance. </p>
            </td>
            <td>
              <p>You are seeing this message because your administrator manages your password in your on-premises environment and does not allow you to reset your password from the <b>Can't access your account</b> link. <br><br> To reset your password, please contact your administrator directly for help. Let your admin know you want to reset your password from Office 365 so he or she can enable this feature for you.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>I get a "Your account is not enabled for password reset" error after entering my user ID</p>
            </td>
            <td>
              <p>Your account is not enabled for password reset.<br><br>Your administrator has not set up your account for use with this service.<br><br> If you'd like, we can contact an administrator in your organization to reset your password for you.</p>
            </td>
            <td>
              <p>You are seeing this message because your administrator has not enabled password reset for your organization from the <b>Can't access your account</b> link, or hasn't licensed you to use the feature. <br><br> To reset your password, click the <b>Contact an administrator</b> link to send an email to your organization's admin. Let your admin know you want to reset your password in Office 365 so that he or she can enable this feature for you.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>I get a "We could not verify your account" error after entering my user ID</p>
            </td>
            <td>
              <p>We could not verify your account.<br><br>If you'd like, we can contact an administrator in your organization to reset your password for you. </p>
            </td>
            <td>
              <p>You are seeing this message because you are enabled for password reset, but you have not registered to use the service. To register for password reset, go to http://aka.ms/ssprsetup after you have regained access to your account. <br><br> To reset your password, click the <b>Contact an administrator</b> link to send an email to your organization's admin.</p>
            </td>
          </tr>
        </tbody></table>

## Next steps
If you have further questions about Self-Service Password Rest (SSPR), please contact your administrator or follow the links below.

* [Need to register your SSPR information?](http://aka.ms/ssprsetup)
* [Can't access your account?](https://passwordreset.microsoftonline.com)
* [Office 365 password reset info](https://support.office.com/en-us/article/Reset-user-passwords-in-Office-365-3254c031-04c9-44f1-8fda-2563847a6b31?ui=en-US&rs=en-US&ad=US)
* [Access Panel](https://myapps.microsoft.com)

[101]: ./media/active-directory-passwords-update-your-own-password/password-1-dont-lose-access.png "password-1-dont-lose-access.png"
[102]: ./media/active-directory-passwords-update-your-own-password/password-2-verification-response.png "password-2-verification-response.png"
[103]: ./media/active-directory-passwords-update-your-own-password/password-2-verification-text.png "password-2-verification-text.png"
[104]: ./media/active-directory-passwords-update-your-own-password/password-3-registration-complete.png "password-3-registration-complete.png"
[105]: ./media/active-directory-passwords-update-your-own-password/password-4-reset-cant-access.png "password-4-reset-cant-access.png"
[106]: ./media/active-directory-passwords-update-your-own-password/password-4-reset-captcha.png "password-4-reset-captcha.png"
[107]: ./media/active-directory-passwords-update-your-own-password/password-4-reset-change.png "password-4-reset-change.png"
[108]: ./media/active-directory-passwords-update-your-own-password/password-4-reset-finished.png "password-4-reset-finished.png"
[109]: ./media/active-directory-passwords-update-your-own-password/password-4-reset-verification.png "password-4-reset-verification.png"
[110]: ./media/active-directory-passwords-update-your-own-password/password-5-unlock-cant-access.png "password-5-unlock-cant-access.png"
[111]: ./media/active-directory-passwords-update-your-own-password/password-5-unlock-captcha.png "password-5-unlock-captcha.png"
[112]: ./media/active-directory-passwords-update-your-own-password/password-5-unlock-verification.png "password-5-unlock-verification.png"
[113]: ./media/active-directory-passwords-update-your-own-password/password-5-unlock-finished.png "password-5-unlock-finished.png"
