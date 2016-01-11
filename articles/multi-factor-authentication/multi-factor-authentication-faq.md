<properties 
	pageTitle="Azure Multi-Factor Authentication FAQ" 
	description="Provides a list of frequently asked questions and answers related to Azure Multi-factor authentication (MFA). MFA is a method of verifying who you are that requires the use of more than just a username and password. It provides an additional layer of security to user sign-ins and transactions." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtand"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/11/2016" 
	ms.author="billmath"/>

# Azure Multi-Factor Authentication FAQ


This FAQ answers questions about Azure Multi-Factor Authentication. This FAQ covers questions about using the service, including the billing model and usability.

## General

**Q: How can I get help with Azure Multi-Factor Authentication?**

[Search the Microsoft Knowledge Base (KB)](http://search.microsoft.com/supportresults.aspx?form=mssupport&q=phonefactor)

- Search the Microsoft Knowledge Base (KB) for technical solutions to common break-fix issues about Support for Microsoft Azure Multi-Factor Authentication Server (PhoneFactor).

[Microsoft Azure Active Directory Forums](https://social.msdn.microsoft.com/Forums/azure/home?forum=WindowsAzureAD)

- You can search and browse for technical questions and answers from the community or ask your own question by clicking [here](https://social.msdn.microsoft.com/Forums/azure/newthread?category=windowsazureplatform&forum=WindowsAzureAD&prof=required).

[Password reset](mailto:phonefactorsupport@microsoft.com)

- Legacy PhoneFactor customers who have any queries around resetting your password or for help to get your password reset, please use the link below to open a support case.

[Microsoft Azure Multi-Factor Authentication Server (PhoneFactor) customer support](https://support.microsoft.com/oas/default.aspx?prid=14947)

- Use this link to contact a Microsoft support professional. We’ll ask you a few questions to help us determine what your support options are. The support options may include email, on-line submission or phone support.



**Q: How does the Azure Multi-Factor Authentication Server handle user data?**

When you use the Multi-Factor Authentication (MFA) Server on-premises, a user’s data is stored in the on-premises servers. No persistent user data is stored in the cloud. When the user performs a two-factor authentication, the MFA Server sends data to the Azure MFA cloud service to perform the authentication. When these authentication requests are sent to the cloud service, the following fields are sent in the request and logs so that they are available in the customer's authentication/usage reports. Some of the fields are optional so they can be enabled or disabled within the Multi-Factor Authentication Server. The communication from the MFA Server to the MFA cloud service uses SSL/TLS over port 443 outbound. These fields are:

- Unique ID - either username or internal MFA server ID
- First and Last Name - optional
- Email Address - optional
- Phone Number - when doing a voice call or SMS authentication
- Device token - when doing mobile app authentication
- Authentication Mode 
- Authentication Result 
- MFA Server Name 
- MFA Server IP 
- Client IP – if available



In addition to the fields above, the authentication result (success/denial) and reason for any denials is also stored with the authentication data and available through the authentication/usage reports.




## Billing

**Q: Will my organization be charged for phone calls or text messages used to authenticate my users?**

All costs are rolled into the per-user or per-authentication cost of the service. Organizations are not charged for individual phone calls placed or text messages sent to your end users when using Azure Multi-Factor Authentication. Phone owners may incur roaming-related or other costs from their telephone carriers to receive the phone calls or text messages.

**"Q: How is the organization billed for Azure Multi-Factor Authentication?"**

The ‘per user’ or ‘per authentication’ billing/usage model is chosen when creating a Multi-Factor Auth Provider in the Azure Management Portal. It is a consumption-based resource that is billed against the organization’s Azure subscription, just like virtual machines, websites, etc. are billed against the subscription.

**Q: Does the ‘per user’ billing model charge based on the number of users enabled for Multi-Factor Authentication or the number of users who perform the verifications?**

Billing is based on the number of users enabled for Multi-Factor Authentication.

## Usability

**Q: What do I do if I don’t receive a response on my phone or if I forgot my phone?**

If you previously configured a backup phone, try again by selecting that phone when prompted from the sign in page.  If you don’t have another method configured, contact your admin and ask them to update the number assigned to your primary phone – mobile or office.


**Q: What do I do if a user contacts me, the administrator, with an account that has been locked out?**

You can reset the user by forcing them to go through the registration process again. To do this see [Managing user and device settings with Azure Multi-Factor Authentication in the cloud](multi-factor-authentication-manage-users-and-devices.md)

**Q: What do I do if a user has lost or had a device stolen that is using app passwords?**

You can delete all of the users app passwords to prevent any unauthorized access. Once you have a replacement device, the user can recreate them. To do this see [Managing user and device settings with Azure Multi-Factor Authentication in the cloud](multi-factor-authentication-manage-users-and-devices.md)

**Q: What if the user is not able to sign into non-browser apps?**

- Users enabled for multi-factor authentication will require app password to sign into some non-browser apps.
- Users will need to clear the sign-in info (delete sign-in info), restart the application and sign-in with the their username and app password. 

For information on creating app passwords see [Help with app passwords](multi-factor-authentication-end-user-app-passwords.md)


>[AZURE.NOTE] Modern Authentication for the Office 2013 Clients
>
> Office 2013 clients (including Outlook) now support new Authentication Protocols and can be enabled to support Multi-Factor Authentication.  This means that once enabled, app passwords are not required for use with Office 2013 clients.  For more information see [Office 2013 modern authentication public preview announced](https://blogs.office.com/2015/03/23/office-2013-modern-authentication-public-preview-announced/).

**Q: What do I do if I do not receive a text message, or I reply to a two-way text message but the verification times out?**

The Azure Multi-Factor Authentication service sends text messages through SMS aggregators. Many factors may impact the reliability of text message delivery and receipt including the aggregator used, destination country, mobile phone carrier and signal strength. Therefore, delivery of text messages and receipt of SMS replies when performing two-way SMS is not guaranteed. Using one-way SMS is recommended over two-way SMS when possible because it is more reliable and prevents users from incurring global SMS charges caused by replying to a text message that was sent from another country. 

Text message verifications are also more reliable in some countries such as the United States and Canada. Users that experience difficulty receiving text messages reliably when using Azure Multi-Factor Authentication are encouraged to select the mobile app or phone call methods instead. The mobile app is great because mobile app notifications can be received over both cellular and Wi-Fi connections, and the mobile app passcode is displayed even when the device has no signal at all.  The Azure Authenticator app is available for [Windows Phone](http://www.windowsphone.com/store/app/azure-authenticator/03a5b2bf-6066-418f-b569-e8aecbc06e50), [Android](https://play.google.com/store/apps/details?id=com.azure.authenticator), and [IOS](https://itunes.apple.com/us/app/azure-authenticator/id983156458).

**Q:  Can I use hardware tokens with the Azure MFA server?**

If you are using the Azure MFA Server, third-party OATH TOTP tokens can be imported and used for MFA. We currently support the import of third-party OATH TOTP tokens in an older PSKC format that Gemalto can produce for their tokens and support importing tokens in CSV format. When importing tokens in CSV format, the CSV file must contain a serial number, secret key in Base32 format and a time interval (generally 30 seconds). 

So, if the ActiveIdentity tokens are OATH TOTP tokens and you can get the secret key file into a CSV file that can be imported into the Azure MFA Server, then you will be able to use them. OATH tokens can be used with AD FS, with RADIUS when the client system can process Access Challenge responses and with IIS Forms-based authentication.

**Q: Can I use the Azure MFA Server to secure Terminal Services**

Yes, but if you are using Windows Server 2012 R2 or later than this can only be done using a RD Gateway.

The way that the Azure MFA Server hooked into the LSA security package on Windows Server 2012 and earlier versions no longer works on Windows Server 2012 R2 due to some security changes.  So for versions of Terminal Services on Windows 2012 or earlier, you can simply follow [To secure an application with Windows Authentication](multi-factor-authentication-get-started-server-windows.md#to-secure-an-application-with-windows-authentication-use-the-following-procedure)

However, if you are using Windows Server 2012 R2, then you will need an RD Gateway.

## Errors

**Q: What do I do when I see an “Authentication request is not for an activated account” error when I authenticate by using mobile application notifications?**

- Go to [https://account.activedirectory.windowsazure.com/profile/](https://account.activedirectory.windowsazure.com/profile/) and sign in with your organizational account.
- If needed, click Other verification options and select a different option for completing the account verification.
- Click Additional Security Verification.
- Remove the existing account from your mobile application.
- Click Configure and follow the instructions to re-configure the mobile application.




**Q: What do I do when I see a 0x800434D4L error while attempting to sign-in using a non-browser application?**

Currently, additional security verification can only be used with applications/services that you can access through your browser. Non-browser applications (also referred to as rich client applications) which are installed on your local computer such as Windows Powershell will not work with accounts that are required for additional security verification. In this case, you may see the application generate error 0x800434D4L.

A workaround for this is to have a separate user account for admin-related operations vs. non-admin operations. You can later link mailboxes between your admin account and non-admin account so you can sign-in to outlook using your non-admin account. For more details about this, see [Give an Administrator the Ability to Open and View the Contents of a User's Mailbox](http://help.outlook.com/141/gg709759(d=loband).aspx?sl=1).









