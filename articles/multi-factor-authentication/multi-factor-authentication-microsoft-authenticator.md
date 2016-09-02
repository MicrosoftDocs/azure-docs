<properties
	pageTitle="Microsoft Authenticator app for mobile phones | Microsoft Azure"
	description="Learn how to upgrade to the latest version of Azure Authenticator."
	services="multi-factor-authentication"
	documentationCenter=""
	authors="billmath"
	manager="femila"
	editor="curtland"/>

<tags
	ms.service="multi-factor-authentication"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/22/2016"
	ms.author="billmath"/>

# Microsoft Authenticator

The Microsoft Authenticator app provides an additional level of security in your Azure account (for example, bsimon@contoso.onmicrosoft.com), your on-premises work account (for example, bsimon@contoso.com), or your Microsoft account (for example, bsimon@outlook.com).

The app works in one of two ways:

- **Notification**. The app can help prevent unauthorized access to accounts and stop fraudulent transactions by pushing a notification to your smartphone or tablet. Simply view the notification, and if it's legitimate, select **Verify**. Otherwise, you can select **Deny**. For information about denying notifications, see How to use the Deny and Report Fraud Feature for Multi-Factor Authentication.

- **Password with verification code**. The app can be used as a software token to generate an OATH verification code. You enter the code provided by the app into the sign-in screen, along with the user name and password, when prompted. The verification code provides a second form of authentication.

With the release of the Microsoft Authenticator app, the old Azure Authenticator app is being replaced.  The Azure Authenticator app will continue to work, but if you decide to move to the new Microsoft Authenticator app, this article can assist you.  

## Install the app

The Microsoft Authenticator app is available for [Windows Phone](http://go.microsoft.com/fwlink/?Linkid=825071), [Android](http://go.microsoft.com/fwlink/?Linkid=825072), and [IOS](http://go.microsoft.com/fwlink/?Linkid=825073).

## Add accounts to the app

For each account that you want to add to the Microsoft Authenticator app, use one of the following procedures.

### Add an account to the app by using the QR code scanner

1. Go to your security verification settings page.  For information on how to get to this page, see [Changing your Security Settings](multi-factor-authentication-end-user-manage-settings.md).

2. Select the Configure button.

	![Add Account](./media/multi-factor-authentication-azure-authenticator/azureauthe.png)

	This will bring up a screen with a barcode on it.

	![Scan barcode](./media/multi-factor-authentication-azure-authenticator/barcode2.png)

3. Open the Microsoft Authenticator app, you should be taken to the **accounts** page.  Here you will see a list of accounts that you have setup.  If you want to add a new account select the + sign, then specify that you want to add a work or school account.  This will open the scanner.

4. Scan the barcode.

	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan2.png)

5. Wait while the account is activated.

That's it.  You should now see the new account on the **accounts** page.

![Add Account](./media/multi-factor-authentication-azure-authenticator/addaccount2.png)

![Add Account](./media/multi-factor-authentication-azure-authenticator/accounts.png)

DELETE CONTENT BELOW AS NEEDED

1. On the phone that has the Microsoft Authenticator app installed, open the app and select the “+” to add a new account.
2. Specify that you select to add a work or school account, which will open the QR code scanner. If your camera is not working properly, you can select to enter your company information manually. For more information, see [Add an account manually](#add-an-account-manually).

	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan4.png)

	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan.png)

3. Scan the QR code picture that came up with the configure mobile app screen.  Select Done to close the QR code screen.  

	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan2.png)

	If you cannot get the QR code to scan you can enter the information manually.

	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/barcode.png)

4. On the phone, it will begin to activate, once this has completed select Contact me.  This will send either a notification or a verification code to your phone.  Select verify.

	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/verify.png)

5. Some companies may require a PIN when verifying.

	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan3.png)

6. Once this is complete you can select close.  At this point, your verification should be successful.
7. Now it is recommended that enter your mobile phone number in case you lose access to your mobile app. Specify your country from the drop-down and enter your mobile phone number in the box next to country.  Select Next.
8. At this point, you have setup your contact method and now it is time to setup app passwords for non-browser apps such as Outlook 2010 or older. If you do not use these apps select **Done**.  Otherwise continue to the next step.

	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/step4.png)

9. If you are using these apps then copy the app password provided and paste the password into your non-browser application. For steps on individual applications such as Outlook and Lync see How to change the password in your email to the app password and How to change the password in your application to the app password.
10. Select Done.

### Add an account to the app manually

1. Go to your security verification settings page.  For information on how to get to this page see [Changing your Security Settings](multi-factor-authentication-end-user-manage-settings.md).

2. Select the **Configure** button.

	![Add Account](./media/multi-factor-authentication-azure-authenticator/azureauthe.png)

	This will bring up a screen with a barcode on it.  Note the code and URL under the barcode.

	![Scan barcode](./media/multi-factor-authentication-azure-authenticator/barcode2.png)

3. Open the Microsoft Authenticator app. On the **accounts** page, select the + sign, and then specify that you want to add a work or school account.

	![Add Account](./media/multi-factor-authentication-azure-authenticator/addaccount3.png)

4. In the scanner, select **enter code manually**.

	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan2.png)

5. Enter the code and the URL in the appropriate boxes on the mobile app.

	![Add Account](./media/multi-factor-authentication-azure-authenticator/manual.png)

	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/addaccount2.png)

6. Wait while the account is activated.

That's it.  You should now see the new account on the **accounts** page.

![Add Account](./media/multi-factor-authentication-azure-authenticator/addaccount2.png)

![Add Account](./media/multi-factor-authentication-azure-authenticator/accounts.png)

DELETE CONTENT BELOW AS NEEDED

1. Select the enter account manually button.  

	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/addaccount.png)


	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/addaccount2.png)

2. If you have an account that already has Azure MFA, enter the code and the url that is provided on the same page that shows you the barcode.  This goes in the code and url boxes on the mobile app.  This will begin the activation.

	![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/barcode2.png)

3. Once this has completed select Contact me. This will send either a notification or a verification code to your phone. Select verify.

### Add an account to the app by using Touch ID

The Microsoft Authenticator mobile app on iOS supports Touch ID.  Azure Multi-Factor Authentication allows organizations to require a PIN in addition to having possession of their registered device. With this new feature, iOS users with Touch ID-enabled devices won’t need to enter the PIN anymore. Once set up, users just scan their fingerprint instead of entering PIN and tapping Approve.

Setting up Touch ID with Microsoft Authenticator is really simple. You just complete a normal verification challenge with PIN, and if your device supports Touch ID, we’ll automatically set it up for you.

![Touch ID](./media/multi-factor-authentication-azure-authenticator/touchid1.png)

From that point forward, when you are required to verify your sign-in, you tap on the push notification received and scan your fingerprint instead of entering your PIN.

![Touch ID](./media/multi-factor-authentication-azure-authenticator/touchid2.png)

## Uninstall the old Multi-Factor Authentication app

After you have added all the accounts to the new app, you can uninstall the old app from your phone.

## Delete an account

To remove an account from the Microsoft Authenticator app, select the account, and then select **Delete**.

![Remove account](./media/multi-factor-authentication-azure-authenticator/remove.png)
