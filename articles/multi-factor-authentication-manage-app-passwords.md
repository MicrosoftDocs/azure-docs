<properties 
	pageTitle="Azure Multi-Factor Authentication App Passwords" 
	description="This describes how to use the Azure Multi-Factor Authentication feature - app passwords." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="terrylan" 
	editor="bryanla"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/02/2015" 
	ms.author="billmath"/>

# App Passwords in Azure Multi-Factor Authentication Server
In some apps, like Office 2010 or older and Apple Mail you can't use a phone to secure your account.  To use these apps, you'll need to use "app passwords" in place of your traditional password.

## Important things to know about app passwords

The following is an important list of things that you should know about app passwords.

Authentication Experience|For browser based apps|For non-browser based apps
:------------- | :------------- | 
|<li>The 1st factor of authentication is performed on-premises</li><li>The 2nd factor is a phone based method carried out by Cloud Identity.</li>|<li>Admins and users can use app passwords to sign-in.

- Users can have multiple app passwords which increases the surface area for theft. Since app passwords are hard to remember, it might encourage people to write this down. This is not recommended and should be discouraged because only one factor is required to login with app password.
- Apps which cache passwords and use it in on-premise scenarios might start failing since the app password will not be known outside of the organizational id. An example is Exchange emails that are on-premise but the archived mail is in the cloud. The same password will not work.
- The actual password is automatically generated and is not supplied by the user. This is because the automatically generated password, is harder for an attacker to guess and is more secure.
- Currently there is a limit of 40 passwords per user. You will be prompted to delete told to delete one of your existing app passwords in order to create a new one.


### Naming Guidance for App Passwords
It is recommended that app password names should reflect the device on which they will be used. For instance, if you have a laptop that has non-browser apps such as Outlook, Word, and Excel, you only need to create one app password named Laptop and use that app password in all of these applications. Although you can create separate passwords for all of these applications, it is not recommended. The recommend way is to use one app password per device.

### Federated (SSO) App Passwords
Azure AD supports federation with on-premises Windows Server Active Directory Domain Services (AD DS). If your organization is federated(SSO) with Azure AD and you are going to be using Azure Multi-Factor Authentication, then the following is important information that you should be aware when using app passwords. This applies only to federated(SSO) customers.

- The App Password is verified by Azure AD and hence bypasses federation. Federation is only actively used when setting up App Password.
- For federated(SSO) users, we will never go to the Identity Provider (IdP) unlike the passive flow. The passwords will be stored in the organizational id. If the user leaves the company, that info has to flow to organizational id using DirSync in real time. Account disable/deletion may take up to 3 hours to sync, delaying disable/deletion of App Password in Azure AD.
- On-premises Client Access Control settings are not honored by App Password
- No on-premises authentication logging / auditing capability is available for App Password
- More end-user education is required for the Microsoft Lync 2013 client. For the required steps, see How to change the password in your email to the app password.
- Certain advanced architectural designs may require using a combination of organizational username and passwords and app passwords when using multi-factor authentication with clients, depending on where they authenticate. For clients that authenticate against an on-premise infrastructure, you would use an organizational username and password. For clients that authenticate against Azure AD, you would use the app password.

For example, suppose you have an architecture that consists of the following:

- You are federating your on-premise instance of Active Directory with Azure AD
- You are using Exchange online
- You are using Lync that is specifically on-premise
- You are using Azure Multi-Factor Authentication


<center>![Proofup](./media/multi-factor-authentication-manage-app-passwords/federated.png)</center>

 In these instances, you must do the following:

- When signing-in to Lync, use your organizations’ username and password.
- When attempting to access the address book via an Outlook client that connects to Exchange online, use an app password.

### To enable users to create app passworsd



1. Sign-in to the Azure Management Portal.
2. On the left, click Active Directory.
3. Under, Directory click on the directory for the user you wish to enable.
4. At the top, click Users.
5. At the bottom of the page, click Manage Multi-Factor Auth. This will open the multi-factor authentication page.
6. At the top of the multi-factor authentication page, click Service Settings.
7. Ensure that the radio button next to Allow users to create app passwords to sign into non-browser applications is selected.

<center>![Cloud](./media/multi-factor-authentication-manage-trusted-ips/trustedips.png)</center>

**Additional Resources**
