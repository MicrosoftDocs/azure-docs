<properties
	pageTitle="How to silently install the Azure AD Application Proxy Connector"
	description="Covers how to perform a silent installation of Azure AD Application Proxy Connector to provide secure remote access to your on-premises apps."
	services="active-directory"
	documentationCenter=""
	authors="rkarlin"
	manager="steven.powell"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/01/2015"
	ms.author="rkarlin"/>

# How to silently install the Azure AD Application Proxy Connector

You want to be able to send an installation script to multiple servers or to Windows Servers that don't have user interface enabled. This topic explains how to create a Windows PowerShell script that enables unattended installation and installs and registers your Azure AD Application Proxy Connector.

## Enabling Access
Application Proxy works by installing a slim Windows Server service called the Connector inside your network. For the Application Proxy Connector to work it has to be registered with your Azure AD directory using a global administrator and password. Ordinarily this is entered during Connector installation in a pop up dialog box. Instead, you can use Windows PowerShell to create a credential object and use the token it creates to enter your registration information, or you can create your own token to use to enter your registration information. 

## Step 1:  Install the Connector without registration


Install the Connector MSIs without registering the Connector as follows:


1. Open a command prompt.
2. Run the following command in which the /q means quite installation - the installation will not prompt you to accept the End User License Agreement.

        AADApplicationProxyConnectorInstaller.exe REGISTERCONNECTOR="false" /q

## Step 2: Register the Connector with Azure Active Directory
This can be accomplished using either of the following methods:
- Register the Connector using a Windows PowerShell credential object
- Register the Connector using a token created offline

### Register the Connector using a Windows PowerShell credential object


1. Create the Windows PowerShell Credentials object, by running the following, where <username> and <password> should be replaced with the username and password for your directory:

        $User = "<username>" 
        $PlainPassword = '<password>' 
        $SecurePassword = $PlainPassword | ConvertTo-SecureString -AsPlainText -Force 
        $cred = New-Object –TypeName System.Management.Automation.PSCredential –ArgumentList $User, $SecurePassword 
    
2. 	Go to **C:\Program Files\Microsoft AAD App Proxy Connector** and run the file **Register Connector.PS1** in Windows PowerShell.
3. Use the PowerShell credentials object you created to input your Connector registration username and password in your script, by running the following, where $cred is the name of the PowerShell credentials object you created:

        RegisterConnector.ps1 -modulePath "C:\Program Files\Microsoft AAD App Proxy Connector\Modules\" -moduleName "AppProxyPSModule" -Authenticationmode Credentials -Usercredentials $cred 


### Register the Connector using a token created offline

1. Create an offline token using the AuthenticationContext class, for example:

        #region constants /// /// The AAD authentication endpoint uri /// static readonly Uri AadAuthenticationEndpoint = new Uri("https://login.windows.net/common/oauth2/token?api-version=1.0");
        /// <summary>
        /// The application ID of the connector in AAD
        /// </summary>
        static readonly string ConnectorAppId = "55747057-9b5d-4bd4-b387-abf52a8bd489";

        /// <summary>
        /// The reply address of the connector application in AAD
        /// </summary>
		static readonly Uri ConnectorRedirectAddress = new Uri("urn:ietf:wg:oauth:2.0:oob");
		
		/// <summary>
		/// The AppIdUri of the registration service in AAD
		/// </summary>
		static readonly Uri RegistrationServiceAppIdUri = new Uri("https://proxy.cloudwebappproxy.net/registerapp");

		#endregion


		public static void GetAuthenticationToken()
		{
    		AuthenticationContext authContext = new AuthenticationContext(AadAuthenticationEndpoint.AbsoluteUri);
	    AuthenticationResult authResult = authContext.AcquireToken(RegistrationServiceAppIdUri.AbsoluteUri,
                ConnectorAppId,
                ConnectorRedirectAddress,
                PromptBehavior.Always);


	        if (authResult == null || string.IsNullOrEmpty(authResult.AccessToken) || string.IsNullOrEmpty(authResult.TenantId))
    	    {
          Trace.TraceError("Authentication result, token or tenant id returned are null");
          throw new InvalidOperationException("Authentication result, token or tenant id returned are null");
    	}

    	string token = authResult.AccessToken;
    	string tenantID = authResult.TenantId;
		}

2. Once you have the token create a SecureString using the token: <br>
`$SecureToken = $Token | ConvertTo-SecureString -AsPlainText -Force` 
3. Run the following Windows PowerShell command, where SecureToken is the name of the token you created above: <br>
`RegisterConnector.ps1 -modulePath "C:\Program Files\Microsoft AAD App Proxy Connector\Modules\" -moduleName "AppProxyPSModule" -Authenticationmode Token -Token $SecureToken -TenantId <tenant GUID>`



## What's next?
There's a lot more you can do with Application Proxy:


- [Publish applications using your own domain name](active-directory-application-proxy-custom-domains.md)
- [Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)
- [Working with claims aware applications](active-directory-application-proxy-claims-aware-apps.md)
- [Enable conditional access](active-directory-application-proxy-conditional-access.md)


### Learn more about Application Proxy
- [Take a look here at our online help](active-directory-application-proxy-enable.md)
- [Check out the Application Proxy blog](http://blogs.technet.com/b/applicationproxyblog/)
- [Watch our videos on Channel 9!](http://channel9.msdn.com/events/Ignite/2015/BRK3864)

## Additional resources
* [Sign up for Azure as an organization](../sign-up-organization.md)
* [Azure Identity](../fundamentals-identity.md)
