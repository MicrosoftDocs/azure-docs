<properties
	pageTitle="How to: Change or Reset your Azure AD Password | Microsoft Azure"
	description="Learn how to register for password reset, how to change your password, and how to reset your own password in case you ever forget it."
	services="active-directory"
	documentationCenter=""
	authors="asteen"
	manager="femila"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/05/2016"
	ms.author="asteen"/>

# How to update your own password
If you are unsure how to manage your Work or School account password, you've come to the right place!  Read below to learn how to perform common steps, like changing a password, resetting a password, or registering for password reset.

* [**How to register for password reset**](#how-to-register-for-password-reset)
* [**How to change your password from Office 365**](#how-to-change-your-password-from-o365)
* [**How to change your password from the access panel**](#how-to-change-your-password-from-the-access-panel)
* [**How to reset your password**](#how-to-reset-your-password)
* [**How to unlock your account**](#how-to-unlock-your-account)
* [**Common problems and their solutions**](#common-problems-and-their-solutions)

## How to register for password reset

> [AZURE.IMPORTANT]
> **Why am I seeing this?** If you followed a link to get here, you're probably seeing this because your administrator requires you to register for password reset to gain access to your app. You might be asked for phone or email information, or to set up security questions.  Don’t worry – we won’t use this information to spam you, just to keep your account more secure. The steps presented here should help you to reach your goal.

The fastest way to register for password reset is to go to http://aka.ms/ssprsetup.  

 1. Navigate to http://aka.ms/ssprsetup.
 2. Enter your username and password.
 3. Choose an option to register for by clicking **set it up now**.  In this case, I'll demonstrate registering my **authentication phone**.

    ![][011]

 4. Select your country code from the dropdown and enter your **full phone number + area code**.

    ![][012]
    ![][013]

 5. Select one of the **text me** or **call me** options.  In this case, I'll select **text me**, which will send a 6 digit code to my phone.  Wait for the code to arrive on your phone.

    ![][014]

 6. Once the code arrives, enter it into the input box, and then click "verify."
 7. When you see **thanks**, that's it! Now you can use what you registered for to reset your password at any time by going to https://passwordreset.microsoftonline.com.

    ![][015]

 >[AZURE.IMPORTANT] If your admin lets you register for more than one option, we highly recommend you also register a back-up option in case you lose your phone or access to your email.

## How to change your password from O365
Follow the steps below to change your work or school account password in Office 365.  If you have forgotten your password and want to reset it, follow the steps [here](#how-to-reset-your-password).

 1. Sign in to Office 365 with your work or school account.
 2. Go to **Settings** > **Office 365 settings** > **Password** > **Change password**.
 3. Type your old password, and then type a new password and confirm it.
 4. Click **Save**.

You can read more about this on the [Office 365 documentation center](https://support.office.com/article/Change-my-password-in-Office-365-for-business-d1efbaee-63a7-4c08-ab1d-71bf932bbb5d).

## How to change your password from the access panel
Follow the steps below to change your work or school account password from the [Access Panel](https://myapps.microsoft.com).  If you have forgotten your password and want to reset it, follow the steps [here](#how-to-reset-your-password).

 1. Sign into https://myapps.microsoft.com with your work or school account.
 2. Click on the **profile** tab.
 3. Click on the **change my password** tile on the right hand side of the screen.
 4. Type your old password, and then type a new password and confirm it.
 5. Click **Submit**.

 Run into a problem changing your password?  Read about [common problems and their solutions](#common-problems-and-their-solutions).

## How to reset your password


Follow the steps below to reset your work or school account password from any work or school account sign in screen.

>[AZURE.IMPORTANT] This feature is only available to you if your admin has turned it on. If it's not turned on, you'll see a message indicating your account is not enabled for this feature.  You can use the "contact your administrator" link in this case to get in touch with your admin to unlock your account.
>
> If your admin has enabled you for this feature, you'll first need to sign up before you can use it. You can do that here: http://aka.ms/ssprsetup.


 1. On the any work or school account sign in page, click on one of the "can't access your account?" or "forgot your password?" links, or navigate to https://passwordreset.microsoftonline.com directly.

    ![][001]

 2. On the "who are you?" page, enter your work or school account ID and prove you aren't a robot by passing the CAPTCHA challenge.

    ![][002]

 3. Click the "next" button.
 4. Choose an option to reset your password.  Depending on how your admin has configured the system, you might see one or more of the following choices:
     * **Email my alternate email** - sends an email with a 6 digit code to either your **alternate email** or **authentication email** (you choose).
	 * **Text my mobile phone** - texts your phone with a 6 digit code to either your **mobile phone** or **authentication email** (you choose).
	 * **Call my mobile phone** - calls your **mobile phone** or **authentication phone** (you choose) - press the *#* key to verify the call.
	 * **Call my office phone** - calls your **office phone** - press the *#* key to verify the call.
	 * **Answer my security questions** - displays your pre-registered security questions for you to answer.

    ![][003]

 5. We'll use the "text my mobile phone" option as an example.  If you are using a phone based option, you'll need to verify your phone number before we'll send a text.  Enter your full phone number and then click **Next** to verify it's correct and send a text.

    ![][004]

 6. When you receive the text, make sure you use the verification code in the message body, not the number the code was sent from.  It might take a few minutes to get the text, so grab a coffee!

    ![][009]

 8. Now, enter the code you just received on your phone into the input box on the page.

    ![][005]

 9. Your admin may require a second verification step, in which case repeat step 4 with a different option selected.
 10. On the "choose a new password" screen, select a new password and confirm your choice, then click **Finish**.

    ![][006]
    ![][007]

 11. Once you see the success page, you are good to go!  You can now sign in with your new password.

    ![][008]

Run into a problem resetting your password?  Read about [common problems and their solutions](#common-problems-and-their-solutions).

## How to unlock your account
Follow the steps below to unlock your local account from any work or school account sign in screen.  **Note: You will only be able to unlock your account if it has been locked on-premises.**

>[AZURE.IMPORTANT] This feature is only available to you if your admin has turned it on.  If it's not turned on, you'll see a message indicating your account is not enabled for this feature.  You can use the "contact your administrator" link in this case to get in touch with your admin to unlock your account.
>
> If your admin has enabled you for this feature, you'll first need to sign up before you can use it.  You can do that here: http://aka.ms/ssprsetup.


 1. On the any work or school account sign in page, click on one of the "can't access your account?" or "forgot your password?" links, or navigate to https://passwordreset.microsoftonline.com directly.

    ![][001]

 2. On the "who are you?" page, enter your work or school account ID and prove you aren't a robot by passing the CAPTCHA challenge.

    ![][002]

 3. Click the "next" button.
 4. Choose an option to unlock your account.  Depending on how your admin has configured the system, you might see one or more of the following choices:
     * **Email my alternate email** - sends an email with a 6 digit code to either your **alternate email** or **authentication email** (you choose).
	 * **Text my mobile phone** - texts your phone with a 6 digit code to either your **mobile phone** or **authentication email** (you choose).
	 * **Call my mobile phone** - calls your **mobile phone** or **authentication phone** (you choose) - press the *#* key to verify the call.
	 * **Call my office phone** - calls your **office phone** - press the *#* key to verify the call.
	 * **Answer my security questions** - displays your pre-registered security questions for you to answer.

    ![][003]

 5. We'll use the "text my mobile phone" option as an example.  If you are using a phone based option, you'll need to verify your phone number before we'll send a text.  Enter your full phone number and then click **Next** to verify it's correct and send a text.

    ![][004]

 6. When you receive the text, make sure you use the verification code in the message body, not the number the code was sent from.  It might take a few minutes to get the text, so grab a coffee!

    ![][009]

 8. Now, enter the code you just received on your phone into the input box on the page.

    ![][005]

 9. Your admin may require a second verification step, in which case you must repeat step 4 with a different option selected.

 11. Once you see the success page, you are good to go!  Your on-premises account has been unlocked and you can now sign in once more.

    ![][010]

 >[AZURE.IMPORTANT] Make sure you update all your devices to your newest password, as often times a rogue app with an old password (like your phone email client) can be the culprit behind why your account got locked out in the first place.

Run into a problem unlocking your account?  Read about [common problems and their solutions](#common-problems-and-their-solutions).

## Common problems and their solutions
Here are some common error cases and their solutions:

<table>
          <tbody><tr>
            <td>
              <p>
                <strong>Error Case</strong>
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
              <p>I get a "please contact your admin" page after entering my user ID</p>
            </td>
            <td>
              <p>Please contact your admin <br><br>We've detected that your user account password is not managed by Microsoft. As a result, we are unable to automatically reset your password. <br><br>You will need to contact your admin or helpdesk for any further assistance. </p>
            </td>
            <td>
              <p>You are seeing this message because your administrator manages your password in your on-premises environment and does not allow you to reset your password from the <b>Can't access your account link</b>. <br><br> To reset your password, please contact your administrator directly for help, and let him or her know you want to reset your password from Office 365 so he or she can enable this feature for you.</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>I get a "your account is not enabled for password reset" error after entering my user ID</p>
            </td>
            <td>
              <p>Your account is not enabled for password reset<br><br>We're sorry, but your administrator has not set up your account for use with this service.<br><br> If you'd like, we can contact an administrator in your organization to reset your password for you.</p>
            </td>
            <td>
              <p>You are seeing this message because your administrator has not enabled password reset for your organization from the <b>Can't access your account</b> link, or hasn't licensed you to use the feature. <br><br> To reset your password, click the <b>contact an administrator</b> link to send an email to your company's admin, and let him or her know you want to reset your password from Office 365 so he or she can enable this feature for you.</p>
            </td>
          </tr>
		  <tr>
            <td>
              <p>I get a "we could not verify your account" error after entering my user ID</p>
            </td>
            <td>
              <p>We could not verify your account<br><br>If you'd like, we can contact an administrator in your organization to reset your password for you. </p>
            </td>
            <td>
              <p>You are seeing this message because you are enabled for password reset, but you have not registered to use the service.  To register for password reset, go to http://aka.ms/ssprsetup after you have regained access to your account. <br><br> To reset your password, click the <b>contact an administrator</b> link to send an email to your company's admin.</p>
            </td>
          </tr>
        </tbody></table>


## Links to password reset documentation
Below are links to all of the Azure AD Password Reset documentation pages:

* [**How it works**](active-directory-passwords-how-it-works.md) - learn about the six different components of the service and what each does
* [**Getting started**](active-directory-passwords-getting-started.md) - learn how to allow you users to reset and change their cloud or on-premises passwords
* [**Customize**](active-directory-passwords-customize.md) - learn how to customize the look & feel and behavior of the service to your organization's needs
* [**Best practices**](active-directory-passwords-best-practices.md) - learn how to quickly deploy and effectively manage passwords in your organization
* [**Get insights**](active-directory-passwords-get-insights.md) - learn about our integrated reporting capabilities
* [**FAQ**](active-directory-passwords-faq.md) - get answers to frequently asked questions
* [**Troubleshooting**](active-directory-passwords-troubleshoot.md) - learn how to quickly troubleshoot problems with the service
* [**Learn more**](active-directory-passwords-learn-more.md) - go deep into the technical details of how the service works



[001]: ./media/active-directory-passwords-update-your-own-password/001.jpg "Image_001.jpg"
[002]: ./media/active-directory-passwords-update-your-own-password/002.jpg "Image_002.jpg"
[003]: ./media/active-directory-passwords-update-your-own-password/003.jpg "Image_003.jpg"
[004]: ./media/active-directory-passwords-update-your-own-password/004.jpg "Image_004.jpg"
[005]: ./media/active-directory-passwords-update-your-own-password/005.jpg "Image_005.jpg"
[006]: ./media/active-directory-passwords-update-your-own-password/006.jpg "Image_006.jpg"
[007]: ./media/active-directory-passwords-update-your-own-password/007.jpg "Image_007.jpg"
[008]: ./media/active-directory-passwords-update-your-own-password/008.jpg "Image_008.jpg"
[009]: ./media/active-directory-passwords-update-your-own-password/009.jpg "Image_009.jpg"
[010]: ./media/active-directory-passwords-update-your-own-password/010.jpg "Image_010.jpg"
[011]: ./media/active-directory-passwords-update-your-own-password/011.jpg "Image_011.jpg"
[012]: ./media/active-directory-passwords-update-your-own-password/012.jpg "Image_012.jpg"
[013]: ./media/active-directory-passwords-update-your-own-password/013.jpg "Image_013.jpg"
[014]: ./media/active-directory-passwords-update-your-own-password/014.jpg "Image_014.jpg"
[015]: ./media/active-directory-passwords-update-your-own-password/015.jpg "Image_015.jpg"
