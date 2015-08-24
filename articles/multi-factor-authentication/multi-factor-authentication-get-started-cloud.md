<properties 
	pageTitle="Getting started with Azure Multi-Factor Authentication in the cloud" 
	description="This is the Azure Multi-Factor authentication page that describes how to get started with Azure MFA in the cloud." 
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
	ms.topic="get-started-article" 
	ms.date="08/24/2015" 
	ms.author="billmath"/>

# Getting started with Azure Multi-Factor Authentication in the cloud



<center>![Cloud](./media/multi-factor-authentication-get-started-cloud/cloud2.png)</center>

Now that we have determined that we are using multi-factor authentication in the cloud, let's get going!  Please note that if you are using Multi-Factor Authentication for Office 365 or Multi-Factor Authentication for Azure Administrators you can skip to step 3.  Also, this document deals with 


1. **Sign up for an Azure subscription**
	- If you do not already have an Azure subscription, you need to sign-up for one. If you are just starting out and exploring using Azure MFA you can use a trial subscription
2. **Create a Multi-Factor Auth Provider or assign an Azure AD Premium or Enterprise Mobility Suite license to users**
	- You will need to either create an Azure Multi-Factor Auth Provider and assign it to your directory or assign licenses to your Azure AD Premium or EMS users. Azure Multi Factor Authentication is included in Azure Active Directory Premium and as a result it is also included with the Enterprise Mobility Suite. If you have Azure AD Premium or EMS you do not need to create a Multi-Factor Auth Provider, rather to enable MFA for an Azure AD Premium or EMS user, an Azure AD Premium or EMS license needs to be assigned to that user and then an Administrator can assign MFA to the user through the management portal. See the section below on how to assign licenses to users.
3. **Turn on Multi-Factor Authentication for your users** 
	- Enable Azure MFA on your users either through the Office 365 or Azure portal. See the section below for information on how to do this.
4. **Send email to end users to notify them about MFA**
	- Once a user has had multi-factor authentication turned on for their account, it is recommended that you send them an email notifying them of this. The user will be prompted to complete the process the next time they sign-in, so this lets them no what to expect. See the section below for an example email template.



## Creating an Azure Multi-Factor Auth Provider
Multi-factor authentication is available by default for global administrators who have a Azure Active Directory tenant. However, if you wish to extend multi-factor authentication to all of your users and/or want to your global administrators to be able to take advantage features such as the management portal, custom greetings, and reports, then you must purchase and configure an Multi-Factor Authentication Provider.



### To create a Multi-Factor Auth Provider
--------------------------------------------------------------------------------

1. Log on to the Azure Portal as an Administrator.
2. On the left, select Active Directory.
3. On the Active Directory page, at the top, select Multi-Factor Authentication Providers. Then at the bottom, click **New**.
4. Under App Services, select Active Auth Providers, and select Quick Create.
5. Fill in the following fields and select Create.
	1. Name – The name of the Active Auth Provider.
	2. Usage Model – The usage model of the Multi-Factor Authentication Provider.
		- Per Authentication – purchasing model that charges per authentication. Typically used for scenarios that use the Azure Multi-Factor Authentication in an application.
		- Per Enabled User – purchasing model that charges per enabled user. Typically used for scenarios such as Office 365.
	2. Directory – The Azure Active Directory tenant that the Multi-Factor Authentication Provider is associated with. Please be aware of the following:
		- You do not need an Azure AD directory to create a Multi-Factor Auth Provider.  This can be left blank if planning to use the Azure Multi-Factor Authentication Server or SDK only.
		- You will need to associate the Multi-Factor Auth Provider with an Azure AD directory if you wish to extend multi-factor authentication to all of your users and/or want your global administrators to be able to take advantage features such as the management portal, custom greetings, and reports.
		- DirSync or AAD Sync are only a requirement if you are synchronizing your on-premises Active Directory environment with an Azure AD directory.  If you only use an Azure AD directory that is not synchronized with an on-premises instance of Active Directory, you do not need DirSync or AAD Sync.
		



5. Once you click create, the Multi-Factor Authentication Provider will be created and you should see a message stating: Successfully created Multi-Factor Authentication Provider. Click Ok.

<center>![Cloud](./media/multi-factor-authentication-get-started-cloud/provider.png)</center>
	 
## Assigning an Azure AD Premium or Enterprise Mobility license to users

If you have Azure AD Premium or the Enterprise Mobility Suite, you do not need to create a Multi-Factor Auth provider.  You need to simply assign a user a license and then you can begin turning on mfa for users.

### To assign an Azure AD Premium or Enterprise Mobilitiy Suite License
--------------------------------------------------------------------------------
<ol>

<li>Sign-in to the Azure Portal as an Administrator.</li>
<li>On the left, select **Active Directory**.</li>
<li>On the Active Directory page, double-click on the directory that has the users you wish to enable.</li>
<li>At the top of the directory page, select **Licenses**.</li>
<li>On the Licenses page, select Active Directory Premium or Enterprise Mobility Suite, and then click **Assign**.</li>

<center>![Cloud](./media/multi-factor-authentication-get-started-cloud/license.png)</center>

<li>In the dialog box, select the users you want to assign licenses to, and then click the check mark icon to save the changes.</li>



## Turn-on multi-factor authentication for users

User accounts in Azure Multi-Factor Authentication have the following three distinct states:

State | Description |Non-browser apss affected| Notes 
:-------------: | :-------------: |:-------------: |:-------------: |
Disabled | The default state for a new user not enrolled in multi-factor authentication.|No|The user is currently not using multi-factor authentication.
Enabled |The user has been enrolled in multi-factor authentication.|No.  They will continue to work until the registration process is completed.|The user is enabled but has not completed the registration process. They will be prompted to complete the process at next sign-in.
Enforced|The user has been enrolled and has completed the registration process for using multi-factor authentication.|Yes.  They will not work until app passwords are created and used. | The user may or may not have completed registration. If they have completed the registration process then they are using multi-factor authentication. Otherwise, the user will be prompted to completer the process at next sign-in
Now that we have either an Auth provider or have assigned our users a licenses, the next step is to turn mfa on for the users in the directory.  Use the following procedure to enable mfa for you users.

### To turn on multi-factor authentication
--------------------------------------------------------------------------------
1.  Sign-in to the Azure Management Portal as an Administrator.
2.  On the left, click Active Directory.
3.  Under, Directory click on the directory for the user you wish to enable.
4.  At the top, click Users.
5.  At the bottom of the page, click Manage Multi-Factor Auth.
6.  Find the user that you wish to enable for multi-factor authentication. You may need to change the view at the top. Ensure that the user’s status is disabled and place a check in the box next to their name.
7.  This will bring up two options on the right, Enable and Manage user settings. Click Enable. This will bring up a pop-up that will specify the next steps you need to take with your users. Click enable multi-factor auth.
8.  Once you have enabled your users, it is advised that you send your users an email that informs them how they can use their non-browser apps and not be locked out.

<center>![Cloud](./media/multi-factor-authentication-get-started-cloud/user.png)</center>

To change the user's state using Windows PowerShell, you can use the following.  You can change `$st.State` to equal one of the states mentioned above.

		$st = New-Object -TypeName Microsoft.Online.Administration.StrongAuthenticationRequirement
		$st.RelyingParty = "*"
		$st.State = “Enabled”
		$sta = @($st)
		Set-MsolUser -UserPrincipalName bsimon@contoso.com -StrongAuthenticationRequirements $sta


## Send email to end users

Once you have enabled your users, it is advised that you send your users an email that informs them that they will need to provide there contact information. The following is an email template that can be used which includes a link to a video that the users can watch.

		Subject: ACTION REQUIRED: Your password for Outlook and other apps needs updated

		Body:

		For added security, we have enabled multi-factor authentication for your account. 

		Action Required: You will need to complete the enrollment steps below to make your account secure with multi-factor authentication.  

		What to expect once MFA is enabled:

		Multi-factor authentication requires a password that you know and a phone that you have in order to sign into browser applications and to access Office 365, Azure portals.

		For Office 365 non-browser applications such as outlook, lync, a mail client on your mobile device etc, a special password called an app password is required instead of your account password to sign in. App passwords are different than your account password, and are generated during the multi-factor authentication set up process. 

		Please follow these enrollment steps to avoid interruption of your Office 365 service:

			1.  Sign in to the Office 365 Portal at http://portal.microsoftonline.com.
			2.  Follow the instructions to set up your preferred multi-factor authentication method when signing into Office 365 using a web browser. 
			3.  Create one app password for each device.
			4.  Enter the same app password in all applicable apps on that device e.g. Outlook, Mail client, Lync, Word, Powerpoint, Excel, CRM etc. 
			5.  Update your Office client applications or other mobile applications to use an app password.

		You can visit http://aka.ms/mfasetup to create app passwords or change your MFA Setting.  Please bookmark this.

		NOTE: Before entering an app password, you will need to clear the sign-in information (delete sign-in info), restart the application,   and sign-in with the username and app password. Follow the steps documented : http://technet.microsoft.com/library/dn270518.aspx#apppassword.


		Watch a video showing these steps at http://g.microsoftonline.com/1AX00en/175.

		Best Regards,
		Your Administrator

## Next Steps
Now that you have setup multi-factor authentication in the cloud, you can move on to what's next by going to [Configuring Azure Multi-Factor Authentication.](multi-factor-authentication-whats-next.md)  There you will learn about reporting, fraud alert, customizing voice messages and all of the features that Azure Multi-Factor Authentication has to offer.  
