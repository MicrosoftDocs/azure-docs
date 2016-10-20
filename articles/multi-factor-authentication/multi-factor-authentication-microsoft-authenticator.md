<properties 
	pageTitle="Microsoft Authenticator app for mobile phones" 
	description="Learn how to upgrade to the latest version of Azure Authenticatior." 
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

The Microsoft Authenticator app provides an additional level of security that can be used in with either your Azure account (e.x. bsimon@contoso.onmicrosoft.com), your on-premises work account (e.x. bsimon@contoso.com), or your Microsoft account(e.x. bsimon@outlook.com).

## Download the Microsoft Authenticator app

The Microsoft Authenticator app is available for [Windows Phone](http://go.microsoft.com/fwlink/?Linkid=825071), [Android](http://go.microsoft.com/fwlink/?Linkid=825072), and [IOS](http://go.microsoft.com/fwlink/?Linkid=825073).

## How the Microsoft Authenticator app works
The app works by pushing a notification to the Microsoft Authenticator app on your smartphone or tablet. You simply tap “Verify” in the app to authenticate. 

Alternately, the app can also be used with a verification code.  You simply enter the code provided by the app into the sign-in screen when prompted.

These 2 different modes are the following:

**Notification** - In this mode, the Microsoft Authenticator app prevents unauthorized access to accounts and stops fraudulent transactions. This is done using a push notification to your phone or registered device. Simply view the notification and if it is legitimate select Authenticate. Otherwise you may choose Deny or choose to deny and report the fraudulent notification. For information on reporting fraudulent notifications see How to use the Deny and Report Fraud Feature for Multi-Factor Authentication.

**One-Time Password** - In this mode, the Microsoft Authenticator app can be used as a software token to generate an OATH verification code. This verification code can then be entered along with the username and password to provide the second form of authentication.

## Add an account to the Microsoft Authenticator app using QR code scanner

- On the phone that has the Microsoft Authenticator app installed, launch the app and click the “+” to add a new account. Next, specify that you would like to add a work or school account, which will launch the QR code scanner. If your camera is not working properly, you can select to enter your company information manually. [Adding an account manually](#adding-an-account-manually).

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan4.png)

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan.png)

- Scan the QR code picture that came up with the configure mobile app screen.  Click Done to close the QR code screen.  

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan2.png)

- If you cannot get the QR code to scan you can enter the information manually.

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/barcode.png)

- On the phone, it will begin to activate, once this has completed click Contact me.  This will send either a notification or a verification code to your phone.  Click verify.

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/verify.png)

- Some companies may require a PIN when verifying.

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan3.png)


- Once this is complete you can click close.  At this point, your verification should be successful.
- Now it is recommended that enter your mobile phone number in case you lose access to your mobile app.
- Specify your country from the drop-down and enter your mobile phone number in the box next to country.  Click Next.
- At this point, you have setup your contact method and now it is time to setup app passwords for non-browser apps such as Outlook 2010 or older. If you do not use these apps click **Done**.  Otherwise continue to the next step.

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/step4.png)

- If you are using these apps then copy the app password provided and paste the password into your non-browser application. For steps on individual applications such as Outlook and Lync see How to change the password in your email to the app password and How to change the password in your application to the app password.
- Click Done.


## Add an account to the Microsoft Authenticator app manually
If you want to add an account manually, select the enter account manually button.  

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/addaccount.png)


![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/addaccount2.png)

Now if you have an account that already has Azure MFA, enter the code and the url that is provided on the same page that shows you the barcode.  This goes in the code and url boxes on the mobile app.  This will begin the activation.

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/barcode2.png)

Once this has completed click Contact me. This will send either a notification or a verification code to your phone. Click verify.

## Moving to the new Microsoft Authenticator app

With the release of the Microsoft Authenticator app, the old Azure Authenticator app is being replaced.  The Azure Authenticator app will continue to work but should you decide to move to the new Microsoft Authenticator app then this article can assist you.  


### How to move to the new Microsoft Authenticator app 

**Step 1:** Install Microsoft Authenticator.


**Step 2:** Activate your accounts with the new app

First of all make sure, you have the QR code or code and URL for manual entry handy for the account you’d like to add to the app.

> [AZURE.NOTE] Not sure of how to get the QR code? Contact your help desk for assistance.
> 
> Unable to activate your account with the new app? Contact your help desk.
>


Once you have the QR code in front of you, launch the app. Click +. 

Then specify that you would like to add a work or school account. This will launch the camera to scan the QR code.  If you are unable to scan the QR code, you always have the manual entry option. 

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan2.png)

To confirm that the account is successfully activated, verify that the new account shows up on the accounts pages. 


Follow this step for all your accounts that you’d like to migrate to the new app.



**Step 3:**  Uninstall the old Multi-Factor Authentication app from your phone.

Once you have added all the accounts to the new app uninstall the old app from your phone.



## How to add an account using the barcode scanner



- First, go to your security verification settings page.  For information on how to get to this page see [Changing your Security Settings](multi-factor-authentication-end-user-manage-settings.md).

- Click on the Configure button. 
 
![Add Account](./media/multi-factor-authentication-azure-authenticator/azureauthe.png)

- This will bring up a screen with a barcode on it.
  
![Scan barcode](./media/multi-factor-authentication-azure-authenticator/barcode2.png)

- Now open the Microsoft Authenticator app, you should be taken to the accounts page.  Here you will see a list of accounts that you have setup.  If you want to add a new account click the + sign, then specify that you would like to add a work or school account.  This will open the scanner.

- Scan the barcode. 

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan2.png)

- Wait while the account is activated.

- And that's it.  You should now see the new account on the accounts page.

![Add Account](./media/multi-factor-authentication-azure-authenticator/addaccount2.png)

![Add Account](./media/multi-factor-authentication-azure-authenticator/accounts.png)

## How to add an Azure account manually

If you want to add an account manually, you can do it by doing the following:

- First, go to your security verification settings page.  For information on how to get to this page see [Changing your Security Settings](multi-factor-authentication-end-user-manage-settings.md).

- Click on the Configure button. 
 
![Add Account](./media/multi-factor-authentication-azure-authenticator/azureauthe.png)

- This will bring up a screen with a barcode on it.  Note he code and URL under the barcode.
  
![Scan barcode](./media/multi-factor-authentication-azure-authenticator/barcode2.png)

- Now open the Microsoft Authenticator app, you should be taken to the accounts page.  Here you will see a list of accounts that you have setup.  If you want to add a new account click the + sign, then specify that you would like to add a work or school account.  This will open the scanner.
.  This will open the scanner.

![Add Account](./media/multi-factor-authentication-azure-authenticator/addaccount3.png)

- Click enter code manually at the bottom.

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/scan2.png)

- Enter the code and the url that is provided on the same page that shows you the barcode.  This goes in the code and url boxes on the mobile app.  This will begin the activation.

![Add Account](./media/multi-factor-authentication-azure-authenticator/manual.png)

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/addaccount2.png)

- Wait while the account is activated.

- And that's it.  You should now see the new account on the accounts page.

![Add Account](./media/multi-factor-authentication-azure-authenticator/addaccount2.png)

![Add Account](./media/multi-factor-authentication-azure-authenticator/accounts.png)


## How to add an account using TouchID
The Microsoft Authenticator mobile app on iOS supports Touch ID.  Azure Multi-Factor Authentication allows organizations to require a PIN in addition to having possession of their registered device. With this new feature, iOS users with Touch ID-enabled devices won’t need to enter the PIN anymore. Once set up, users just scan their fingerprint instead of entering PIN and tapping Approve.

Setting up Touch ID with Microsoft Authenticator is really simple. You just complete a normal verification challenge with PIN, and if your device supports Touch ID, we’ll automatically set it up for you. 

![Touch ID](./media/multi-factor-authentication-azure-authenticator/touchid1.png)

From that point forward, when you are required to verify your sign-in, you tap on the push notification received and scan your fingerprint instead of entering your PIN.

![Touch ID](./media/multi-factor-authentication-azure-authenticator/touchid2.png)

## How to delete an account

To remove individual accounts from the Microsoft Authenticator App simply tap on the account. You’ll get an option to “Delete”. 

![Remove account](./media/multi-factor-authentication-azure-authenticator/remove.png)
