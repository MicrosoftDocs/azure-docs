<properties
	pageTitle="Microsoft Authenticator app for mobile phones | Microsoft Azure"
	description="Learn how to upgrade to the latest version of Azure Authenticator."
	services="multi-factor-authentication"
	documentationCenter=""
	authors="kgremban"
	manager="femila"
	editor="curtland"/>

<tags
	ms.service="multi-factor-authentication"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/22/2016"
	ms.author="kgremban"/>

# Microsoft Authenticator

The Microsoft Authenticator app provides an additional level of security in your Azure account (for example, bsimon@contoso.onmicrosoft.com), your on-premises work account (for example, bsimon@contoso.com), or your Microsoft account (for example, bsimon@outlook.com).

The app works in one of two ways:

- **Notification**. The app can help prevent unauthorized access to accounts and stop fraudulent transactions by pushing a notification to your smartphone or tablet. Simply view the notification, and if it's legitimate, select **Verify**. Otherwise, you can select **Deny**. For information about denying notifications, see How to use the Deny and Report Fraud Feature for Multi-Factor Authentication.

- **Password with verification code**. The app can be used as a software token to generate an OAuth verification code. You enter the code provided by the app into the sign-in screen, along with the user name and password, when prompted. The verification code provides a second form of authentication.

With the release of the Microsoft Authenticator app, the old Azure Authenticator app is being replaced.  The Azure Authenticator app will continue to work, but if you decide to move to the new Microsoft Authenticator app, this article can assist you.  

## Install the app

The Microsoft Authenticator app is available for [Windows Phone](http://go.microsoft.com/fwlink/?Linkid=825071), [Android](http://go.microsoft.com/fwlink/?Linkid=825072), and [IOS](http://go.microsoft.com/fwlink/?Linkid=825073).

## Add accounts to the app

For each account that you want to add to the Microsoft Authenticator app, use one of the following procedures.

### Add an account to the app by using the QR code scanner

1. Go to the security verification settings screen.  For information on how to get to this screen, see [Changing your security settings](multi-factor-authentication-end-user-manage-settings.md).

2. Select **Configure**.

	![The Configure button on the security verification settings screen](./media/multi-factor-authentication-azure-authenticator/azureauthe.png)

	This brings up a screen with a QR code on it.

	![Screen that provides the QR code](./media/multi-factor-authentication-azure-authenticator/barcode2.png)

3. Open the Microsoft Authenticator app. On the **accounts** screen, select **+**, and then specify that you want to add a work or school account.

	![The accounts screen with plus sign](./media/multi-factor-authentication-azure-authenticator/addaccount3.png)

	![Screen for specifying a work or school account](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan.png)

4. Use the camera to scan the QR code, and then select **Done** to close the QR code screen.

	![Screen for scanning a QR code](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan2.png)

	If your camera is not working properly, you can enter the QR code and URL manually. For more information, see [Add an account to the app manually](#add-an-account-to-the-app-manually).

5. Wait while the account is activated. When activation finishes, select **Contact me**.  This sends either a notification or a verification code to your phone.  Select **Verify**.

	![Screen where you select Verify to sign in](./media/multi-factor-authentication-end-user-first-time-mobile-app/verify.png)

6. If your company requires a PIN for approving sign-in verification, enter it.

	![Box for entering a PIN](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan3.png)

7. After PIN entry is complete, select **Close**. At this point, your verification should be successful.
8. We recommend that you enter your mobile phone number in case you lose access to your app. Specify your country from the drop-down list, and enter your mobile phone number in the box next to the country name. Select **Next**.
9. At this point, you have set up your contact method. Now it's time to set up app passwords for non-browser apps, such as Outlook 2010 or older. If you don't use these apps, select **Done**. Otherwise, continue to the next step.

	![Screen for creating an app password](./media/multi-factor-authentication-end-user-first-time-mobile-app/step4.png)

10. If you're using non-browser apps, copy the provided app password and paste the password into your apps. For steps on individual apps such as Outlook and Lync, see How to change the password in your email to the app password and How to change the password in your application to the app password.
11. Select **Done**.

You should now see the new account on the **accounts** screen.

![Accounts screen](./media/multi-factor-authentication-azure-authenticator/accounts.png)

### Add an account to the app manually

1. Go to the security verification settings screen.  For information on how to get to this screen, see [Changing your security settings](multi-factor-authentication-end-user-manage-settings.md).

2. Select **Configure**.

	![The Configure button on the security verification settings screen](./media/multi-factor-authentication-azure-authenticator/azureauthe.png)

	This brings up a screen with a QR code on it.  Note the code and URL.

	![Screen that provides the QR code and URL](./media/multi-factor-authentication-azure-authenticator/barcode2.png)

3. Open the Microsoft Authenticator app. On the **accounts** screen, select **+**, and then specify that you want to add a work or school account.

	![The accounts screen with plus sign](./media/multi-factor-authentication-azure-authenticator/addaccount3.png)

	![Screen for specifying a work or school account](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan.png)

4. In the scanner, select **enter code manually**.

	![Screen for scanning a QR code](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan2.png)

5. Enter the code and the URL in the appropriate boxes in the app.

	![Screen for entering code and URL](./media/multi-factor-authentication-azure-authenticator/manual.png)

	![Screen for entering code and URL](./media/multi-factor-authentication-end-user-first-time-mobile-app/addaccount2.png)

6. Wait while the account is activated. When the activation finishes, select **Contact me**. This sends either a notification or a verification code to your phone. Select **Verify**.

You should now see the new account on the **accounts** screen.

![Accounts screen](./media/multi-factor-authentication-azure-authenticator/accounts.png)

### Add an account to the app by using Touch ID

The Microsoft Authenticator app on iOS supports Touch ID.  Azure Multi-Factor Authentication allows organizations to require a PIN for devices. With Touch ID, iOS users don’t need to enter a PIN. Instead, they can scan their fingerprint and select **Approve**.

Setting up Touch ID with Microsoft Authenticator is simple. You complete a normal verification challenge with a PIN. If your device supports Touch ID, Microsoft Authenticator will set it up automatically for that account.

![Verification of Touch ID setup](./media/multi-factor-authentication-azure-authenticator/touchid1.png)

From that point forward, when you're required to verify your sign-in, you select the received push notification and scan your fingerprint instead of entering your PIN.

![Push notification](./media/multi-factor-authentication-azure-authenticator/touchid2.png)

## Uninstall the old Azure Authentication app

After you have added all the accounts to the new app, you can uninstall the old app from your phone.

## Delete an account

To remove an account from the Microsoft Authenticator app, select the account, and then select **Delete**.

![Delete button](./media/multi-factor-authentication-azure-authenticator/remove.png)
