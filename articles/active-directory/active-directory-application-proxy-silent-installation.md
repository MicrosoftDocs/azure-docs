<properties
	pageTitle="How to silently install the Azure AD Application Proxy Connector | Microsoft Azure"
	description="Covers how to perform a silent installation of Azure AD Application Proxy Connector to provide secure remote access to your on-premises apps."
	services="active-directory"
	documentationCenter=""
	authors="kgremban"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/22/2016"
	ms.author="kgremban"/>

# How to silently install the Azure AD Application Proxy Connector

You want to be able to send an installation script to multiple Windows servers or to Windows Servers that don't have user interface enabled. This topic explains how to create a Windows PowerShell script that enables unattended installation to install and register your Azure AD Application Proxy Connector.

## Enabling Access
Application Proxy works by installing a slim Windows Server service called the Connector inside your network. For the Application Proxy Connector to work it has to be registered with your Azure AD directory using a global administrator and password. Ordinarily this is entered during Connector installation in a pop up dialog box. Alternatively, you can use Windows PowerShell to create a credential object to enter your registration information, or you can create your own token and use it to enter your registration information.

## Step 1:  Install the Connector without registration


Install the Connector MSIs without registering the Connector as follows:


1. Open a command prompt.
2. Run the following command in which the /q means quiet installation - the installation will not prompt you to accept the End User License Agreement.

        AADApplicationProxyConnectorInstaller.exe REGISTERCONNECTOR="false" /q

## Step 2: Register the Connector with Azure Active Directory
This can be accomplished using either of the following methods:


- Register the Connector using a Windows PowerShell credential object
- Register the Connector using a token created offline

### Register the Connector using a Windows PowerShell credential object


1. Create the Windows PowerShell Credentials object by running the following, where "<username>" and "<password>" should be replaced with the username and password for your directory:

        $User = "<username>"
        $PlainPassword = '<password>'
        $SecurePassword = $PlainPassword | ConvertTo-SecureString -AsPlainText -Force
        $cred = New-Object –TypeName System.Management.Automation.PSCredential –ArgumentList $User, $SecurePassword

2. Go to **C:\Program Files\Microsoft AAD App Proxy Connector** and run the script using the PowerShell credentials object you created, where $cred is the name of the PowerShell credentials object you created:

        RegisterConnector.ps1 -modulePath "C:\Program Files\Microsoft AAD App Proxy Connector\Modules\" -moduleName "AppProxyPSModule" -Authenticationmode Credentials -Usercredentials $cred


### Register the Connector using a token created offline

1. Create an offline token using the AuthenticationContext class using the values in the code snippet:


        using System;
        using System.Diagnostics;
        using Microsoft.IdentityModel.Clients.ActiveDirectory;

        class Program
        {
        #region constants
        /// <summary>
        /// The AAD authentication endpoint uri
        /// </summary>
        static readonly Uri AadAuthenticationEndpoint = new Uri("https://login.windows.net/common/oauth2/token?api-version=1.0");

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

        #region private members
        private string token;
        private string tenantID;
        #endregion

        public void GetAuthenticationToken()
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

            token = authResult.AccessToken;
            tenantID = authResult.TenantId;
        }





2. Once you have the token create a SecureString using the token: <br>
`$SecureToken = $Token | ConvertTo-SecureString -AsPlainText -Force`
3. Run the following Windows PowerShell command, where SecureToken is the name of the token you created above and tenantID is your tenant's GUID: <br>
`RegisterConnector.ps1 -modulePath "C:\Program Files\Microsoft AAD App Proxy Connector\Modules\" -moduleName "AppProxyPSModule" -Authenticationmode Token -Token $SecureToken -TenantId <tenant GUID>`



## See also

- [Enable Application Proxy for Azure Active Directory](active-directory-application-proxy-enable.md)
- [Publish applications using your own domain name](active-directory-application-proxy-custom-domains.md)
- [Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)
- [Troubleshoot issues you're having with Application Proxy](active-directory-application-proxy-troubleshoot.md)

For the latest news and updates, check out the [Application Proxy blog](http://blogs.technet.com/b/applicationproxyblog/)
