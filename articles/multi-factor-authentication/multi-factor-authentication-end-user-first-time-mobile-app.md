<properties 
	pageTitle="Use mobile app as your contact method with Azure MFA" 
	description="This page will show users how to use the mobile app as the primary contact method for Azure MFA." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenp" 
	editor="curtland"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/30/2016" 
	ms.author="billmath"/>

# Use mobile app as your contact method with Azure Multi-Factor Authentication

If you want to use the Microsoft Authenticator app as your primary contact method you can use this article.  It will walk you through setting up multi-factor authentication to use your mobile app as your primary contact method.

The Microsoft Authenticator app is available for [Windows Phone](http://go.microsoft.com/fwlink/?Linkid=825071), [Android](http://go.microsoft.com/fwlink/?Linkid=825072), and [IOS](http://go.microsoft.com/fwlink/?Linkid=825073).

## To use Microsoft Authenticator as your contact method


- On the Additional Security Verification screen select Mobile App from the drop-down.


![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/mobileapp.png)

- Select either Notification or One-time password and click Set up.
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


## Adding an account manually
If you want to add an account manually, select the enter account manually button.  

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/addaccount.png)


![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/addaccount2.png)

Now if you have an account that already has Azure MFA, enter the code and the url that is provided on the same page that shows you the barcode.  This goes in the code and url boxes on the mobile app.  This will begin the activation.

![Setup](./media/multi-factor-authentication-end-user-first-time-mobile-app/barcode2.png)

Once this has completed click Contact me. This will send either a notification or a verification code to your phone. Click verify.



 
