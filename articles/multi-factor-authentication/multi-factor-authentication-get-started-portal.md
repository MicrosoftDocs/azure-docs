<properties 
	pageTitle="Deploying the user portal for the Azure Multi-Factor Authentication Server" 
	description="This is the Azure Multi-factor authentication page that describes how to get started with Azure MFA and the user portal." 
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
	ms.date="08/24/2015" 
	ms.author="billmath"/>

# Deploying the user portal for the Azure Multi-Factor Authentication Server

The User Portal allows the administrator to install and configure the Azure Multi-Factor Authentication User Portal. The User Portal is an IIS web site which allows users to enroll in Azure Multi-Factor Authentication and maintain their accounts. A user may change their phone number, change their PIN, or bypass Azure Multi-Factor Authentication during their next sign on. 

Users will log in to the User Portal using their normal username and password and will either complete a Azure Multi-Factor Authentication call or answer security questions to complete their authentication. If user enrollment is allowed, a user will configure their phone number and PIN the first time they log in to the User Portal. 

User Portal Administrators may be set up and granted permission to add new users and update existing users. 

<center>![Setup](./media/multi-factor-authentication-get-started-portal/install.png)</center>

## Deploying the user portal on the same server as the Azure Multi-Factor Authentication Server

The following pre-requisites are required for installing the Users Portal on the same server as the Azure Multi-Factor Authentication Server:

- IIS needs to be installed including asp.net and IIS 6 meta base compatibility (for IIS 7 or higher) 
- Logged in user must have admin rights for the computer and Domain if applicable.  This is because the account needs permissions to create Active Directory security groups.

### To deploy the user portal for the Azure Multi-Factor Authentication Server

1. Within the Azure Multi-Factor Authentication Server: click User Portal icon in the left menu, click Install User Portal button. 
1. Click Next.
1. Click Next.
1. If the computer is joined to a domain and the Active Directory configuration for securing communication between the User Portal and the Azure Multi-Factor Authentication service is incomplete, the Active Directory step will be displayed. Click the Next button to automatically complete this configuration.
1. Click Next.
1. Click Next.
1. Click Close.
1. Open a web browser from any computer and navigate to the URL where User Portal was installed (e.g. https://www.publicwebsite.com/MultiFactorAuth ). Ensure that no certificate warnings or errors are displayed.

<center>![Setup](./media/multi-factor-authentication-get-started-portal/portal.png)</center>

## Deploying the Azure Multi-Factor Authentication Server User Portal on a Separate Server

In order to use the Azure Multi-Factor Authentication App, the following are required so that the app can successfully communicate with User Portal: 

Please see Hardware and Software Requirements for hardware and software requirements:

- You must be using v6.0 or higher of the Azure Multi-Factor Authentication Server.
- User Portal must be installed on an Internet-facing web server running Microsoft® Internet Information Services (IIS) 6.x, IIS 7.x or higher.
- When using IIS 6.x, ensure ASP.NET v2.0.50727 is installed, registered and set to Allowed.
- Required role services when using IIS 7.x or higher include ASP.NET and IIS 6 Metabase Compatibility.
- User Portal should be secured with an SSL certificate.
- The Azure Multi-Factor Authentication Web Service SDK must be installed in IIS 6.x, IIS 7.x or higher on the server that the Azure Multi-Factor Authentication Server is installed on.
- The Azure Multi-Factor Authentication Web Service SDK must be secured with an SSL certificate.
- User Portal must be able to connect to the Azure Multi-Factor Authentication Web Service SDK over SSL.
- User Portal must be able to authenticate to the Azure Multi-Factor Authentication Web Service SDK using the credentials of a service account that is a member of a security group called “PhoneFactor Admins”. This service account and group exist in Active Directory if the Azure Multi-Factor Authentication Server is running on a domain-joined server. This service account and group exist locally on the Azure Multi-Factor Authentication Server if it is not joined to a domain.

Installing the user portal on a server other than the Azure Multi-Factor Authentication Server requires the following three steps:

1. Install the web service SDK
2. Install the user portal
3. Configure the User Portal Settings in the Azure Multi-Factor Authentication Server


### Install the web service SDK

If the Azure Multi-Factor Authentication Web Service SDK is not already installed on the Azure Multi-Factor Authentication Server, go to that server and open the Azure Multi-Factor Authentication Server. Click the Web Service SDK icon, click the Install Web Service SDK… button and follow the instructions presented. The Web Service SDK must be secured with an SSL certificate. A self-signed certificate is okay for this purpose, but it has to be imported into the “Trusted Root Certification Authorities” store of the Local Computer account on the User Portal web server so that it will trust that certificate when initiating the SSL connection. 

<center>![Setup](./media/multi-factor-authentication-get-started-portal/sdk.png)</center>

### Install the user portal

Before installing the user portal on a seperate server, be aware of the following:

- It is helpful to open a web browser on the Internet-facing web server and navigate to the URL of the Web Service SDK that was entered into the web.config file. If the browser can get to the web service successfully, it should prompt you for credentials. Enter the username and password that were entered into the web.config file exactly as it appears in the file. Ensure that no certificate warnings or errors are displayed.
- If a reverse proxy or firewall is sitting in front of the User Portal web server and performing SSL offloading, you can edit the User Portal web.config file and add the following key to the <appSettings> section so that the User Portal can use http instead of https. <add key="SSL_REQUIRED" value="false"/>

#### To install the user portal

1. Open Windows Explorer on the Azure Multi-Factor Authentication Server server and navigate to the folder where the Azure Multi-Factor Authentication Server is installed (e.g. C:\Program Files\Multi-Factor Authentication Server). Choose the 32-bit or 64-bit version of the MultiFactorAuthenticationUserPortalSetup installation file as appropriate for the server that User Portal will be installed on. Copy the installation file to the Internet-facing server.
2. On the Internet-facing web server, the setup file must be run with administrator rights. The easiest way to do this is to open a command prompt as an administrator and navigate to the location where the installation file was copied.
3. Run the MultiFactorAuthenticationUserPortalSetup64 install file, change the Site and Virtual Directory name if desired.
4. After finishing the install of the User Portal, browse to C:\inetpub\wwwroot\MultiFactorAuth (or appropriate directory based on the virtual directory name) and edit the web.config file.
5. Locate the USE_WEB_SERVICE_SDK key and change the value from false to true. Locate the WEB_SERVICE_SDK_AUTHENTICATION_USERNAME and WEB_SERVICE_SDK_AUTHENTICATION_PASSWORD keys and set the values to the username and password of the service account that is a member of the PhoneFactor Admins security group (see the Requirements section above). Be sure to enter the Username and Password in between the quotation marks at the end of the line, (value=””/>). It is recommended to use a qualified username (e.g. domain\username or machine\username)
6. Locate the pfup_pfwssdk_PfWsSdk setting and change the value from “http://localhost:4898/PfWsSdk.asmx” to the URL of the Web Service SDK that is running on the Azure Multi-Factor Authentication Server (e.g. https://computer1.domain.local/MultiFactorAuthWebServiceSdk/PfWsSdk.asmx). Since SSL is used for this connection, you must reference the Web Service SDK by server name and not IP address since the SSL certificate will have been issued for the server name and the URL used must match the name on the certificate. If the server name does not resolve to an IP address from the Internet-facing server, add an entry to the hosts file on that server to map the name of the Azure Multi-Factor Authentication Server to its IP address. Save the web.config file after changes have been made.
7. If the website that User Portal was installed under (e.g. Default Web Site) has not already been binded with a publicly-signed certificate, install the certificate on the server if not already installed, open IIS Manager and bind the certificate to the website.
8. Open a web browser from any computer and navigate to the URL where User Portal was installed (e.g. https://www.publicwebsite.com/MultiFactorAuth ). Ensure that no certificate warnings or errors are displayed.



## Configure the user portal settings in the Azure Multi-Factor Authentication Server
Now that the portal is installed, you need to configure the Azure Multi-Factor Authentication Server to work with the portal.

Azure Multi-Factor Authentication server provides several options for the user portal.  The following table provides a list of these options and an explaination of what they are used for.

User Portal Settings|Description|
:------------- | :------------- | 
User Portal URL| Allows you to enter the URL of where the portal is being hosted.
Primary authentication| Allows you to specify the type of authentication to use when signing in to the portal.  Either Windows, Radius, or LDAP authentication.
Allow users to log in|Allows users to enter a username and password on the sign in page for the User portal.  If this is not selected, the boxes will be greyed out.
Allow user enrollment|Allows user to enroll in multi-factor authentication by taking them to a setup screen that prompts them for additional information such as telephone number.  Prompt for backup phone allows users to specify a secondary phone number.  Prompt for third-party OATH token allows users to specify a 3rd party OATH token.
Allow users to initiate One-Time Bypass| This allows users to initiate a one-time bypass.  If a user sets this up it will take affect the next time the user signs in.  Prompt for bypass seconds provides the user with a box so they can change the default of 300 seconds.  Otherwise, the one-time bypass is only good for 300 seconds.
Allow users to select method| Allows users to specify their primary contact method.  This can be phone call, text message, mobile app, or OATH token.
Allow users to select language|  Allows the user to change the language that is used for the phone call, text message, mobile app, or OATH token.
Allow users to activate mobile app| Allows the users to generate an activation code to complete the mobile app activation process that is used with the server.  You can also set the number of devices they can activate this on.  Between 1 and 10.
Use security questions for fallback|Allows you to use security questions in case multi-factor authentication fails.  You can specify the number of security questions that must be successfully answered.
Allow users to associate third-party OATH token| Allows users to specify a third-party OATH token.
Use OATH token for fallback|Allows for the use of an OATH token in the event that multi-factor authentication is not successful.  You can also specify the session timeout in minutes.
Enable logging|Enables logging on the user portal.  The log files are located at: C:\Program Files\Multi-Factor Authentication Server\Logs.

The majority of these settings are visible to the user once they are enabled and the user signs into the user portal.

![User portal settings](./media/multi-factor-authentication-get-started-portal/portalsettings.png)



### To configure the user portal settings in the Azure Multi-Factor Authentication Server




1. In the Azure Multi-Factor Authentication Server, click on the User Portal icon. On the Settings tab, enter the URL to the User Portal in the User Portal URL textbox. This URL will be inserted into emails that are sent to users when they are imported into the Azure Multi-Factor Authentication Server if the email functionality has been enabled.
2. Choose the settings that you want to use in the User Portal. For example, if users are allowed to control their authentication methods, ensure that Allow users to select method is checked along with the methods they can choose from.
3. Click the Help link in the top right corner for help understanding any of the settings displayed.

<center>![Setup](./media/multi-factor-authentication-get-started-portal/config.png)</center>


## Administrators tab
This tab simply allows you to add users who will have administrative privileges.  When adding an administrator, you can fine tune the permissions that they receive.  This way, you can be sure to only grant the needed permissions to the administrator.  Simply click the Add button and then select and user and their permissions and then click Add.

![User portal administrators](./media/multi-factor-authentication-get-started-portal/admin.png)


## Security Questions
This tab allows you to specify the security questions that users will need to provide answers to if the Use security questions for fallback option is selected.  Azure Multi-Factor Authenticaton Server comes with default questions that you can use.  You can also change the order or add your own questions.  When adding your own questions, you can specify the language you would like those question to appear in as well.

![User portal security questions](./media/multi-factor-authentication-get-started-portal/secquestion.png)


## Passed Sessions

## SAML
Allows you to setup the user portal to accept claims from an identity provider using SAML.  You can specify the timeout session, specify the verification certificate and the Log out redirect URL.

![SAML](./media/multi-factor-authentication-get-started-portal/saml.png)

## Trusted IPs
This tab allows you to specify either single IP addresses or IP address ranges that can be added so that if a user is signing in from one of these IP addresses, then multi-factor authentication is bypassed. 

![User portal trusted IPs](./media/multi-factor-authentication-get-started-portal/trusted.png)

## Self-Service User Enrollment
If you want your users to sign in and enroll you must select the Allow users to login in and Allow user enrollment options. Remember that the settings you select will affect the user sign-in experience.

For example, when a user logs in to the User Portal and clicks the Log In button, they are then taken to the Azure Multi-Factor Authentication User Setup page.  Depending on how you have configured Azure Multi-Factor Authentication, the user may be able to select their authentication method.  

If they select the Voice Call authentication method or have been pre-configured to use that method, the page will prompt the user to enter their primary phone number and extension if applicable.  They may also be allowed to enter a backup phone number.  

![User portal trusted IPs](./media/multi-factor-authentication-get-started-portal/backupphone.png)

If the user is required to use a PIN when they authenticate, the page will also prompt them to enter a PIN.  After entering their phone number(s) and PIN (if applicable), the user clicks the Call Me Now to Authenticate button.  Azure Multi-Factor Authentication will perform a phone call authentication to the user’s primary phone number.  The user must answer the phone call and enter their PIN (if applicable) and press # to move on to the next step of the self-enrollment process.   

If the user selects the SMS Text authentication method or has been pre-configured to use that method, the page will prompt the user for their mobile phone number.  If the user is required to use a PIN when they authenticate, the page will also prompt them to enter a PIN.  After entering their phone number and PIN (if applicable), the user clicks the Text Me Now to Authenticate button.  Azure Multi-Factor Authentication will perform an SMS authentication to the user’s mobile phone.  The user must receive the SMS which contains a one- time-passcode (OTP) and reply to the message with that OTP plus their PIN if applicable) to move on to the next step of the self-enrollment process. 

![User portal SMS](./media/multi-factor-authentication-get-started-portal/text.png)   

If the user selects the Mobile app authentication method or has been pre-configured to use that method, the page will prompt the user to install the Azure Multi-Factor Authentication app on their device and generate an activation code.  After installing the Azure Multi-Factor Authentication app, the user clicks the Generate Activation Code button.    

>[AZURE.NOTE]In order to use the Azure Multi-Factor Authentication app, the user must enable push notifications for their device. 

The page then displays an activation code and a URL along with a barcode picture.  If the user is required to use a PIN when they authenticate, the page will also prompt them to enter a PIN.  The user enters the activation code and URL into the Azure Multi-Factor Authentication app or uses the barcode scanner to scan the barcode picture and clicks the Activate button.    

After the activation is complete, the user clicks the Authenticate Me Now button.  Azure Multi-Factor Authentication will perform an authentication to the user’s mobile app.  The user must enter their PIN (if applicable) and press the Authenticate button in their mobile app to move on to the next step of the self-enrollment process.  


If the administrators have configured the Azure Multi-Factor Authentication Server to collect security questions and answers, the user is then taken to the Security Questions page.  The user must select four security questions and provide answers to their selected questions.    

![User portal security questions](./media/multi-factor-authentication-get-started-portal/secq.png)  

The user self-enrollment is now complete and the user is logged in to the User Portal.  Users can log back in to the User Portal at any time in the future to change their phone numbers, PINs, authentication methods and security questions if allowed by their administrators.

 