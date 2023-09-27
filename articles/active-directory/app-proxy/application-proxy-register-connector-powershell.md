---
title: Silent install Microsoft Entra application proxy connector
description: Covers how to perform an unattended installation of Microsoft Entra application proxy Connector to provide secure remote access to your on-premises apps.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: how-to
ms.date: 09/14/2023
ms.author: kenwith
ms.reviewer: ashishj
---

# Create an unattended installation script for the Microsoft Entra application proxy connector

This topic helps you create a Windows PowerShell script that enables unattended installation and registration for your Microsoft Entra application proxy connector.

This capability is useful when you want to:

* Install the connector on Windows servers that don't have user interface enabled, or that you can't access with Remote Desktop.
* Install and register many connectors at once.
* Integrate the connector installation and registration as part of another procedure.
* Create a standard server image that contains the connector bits but is not registered.

For the [Application Proxy connector](application-proxy-connectors.md) to work, it has to be registered with your Microsoft Entra directory using an application administrator and password. Ordinarily this information is entered during Connector installation in a pop-up dialog box, but you can use PowerShell to automate this process instead.

There are two steps for an unattended installation. First, install the connector. Second, register the connector with Microsoft Entra ID.

> [!IMPORTANT]
> If you are installing the connector for Azure Government cloud review the [pre-requisites](../hybrid/connect/reference-connect-government-cloud.md#allow-access-to-urls) and [installation steps](../hybrid/connect/reference-connect-government-cloud.md#install-the-agent-for-the-azure-government-cloud). This requires enabling access to a different set of URLs and an additional parameter to run the installation.

## Install the connector
Use the following steps to install the connector without registering it:

1. Open a command prompt.
2. Run the following command, in which the /q means quiet installation. A quiet installation doesn't prompt you to accept the End-User License Agreement.

   ```
   AADApplicationProxyConnectorInstaller.exe REGISTERCONNECTOR="false" /q
   ```

<a name='register-the-connector-with-azure-ad'></a>

## Register the connector with Microsoft Entra ID
There are two methods you can use to register the connector:

* Register the connector using a Windows PowerShell credential object
* Register the connector using a token created offline

### Register the connector using a Windows PowerShell credential object
1. Create a Windows PowerShell Credentials object `$cred` that contains an administrative username and password for your directory. Run the following command, replacing *\<username\>* , *\<password\>* and *\<tenantid\>*:

   ```powershell
   $User = "<username>"
   $PlainPassword = '<password>'
   $TenantId = '<tenantid>'
   $SecurePassword = $PlainPassword | ConvertTo-SecureString -AsPlainText -Force
   $cred = New-Object –TypeName System.Management.Automation.PSCredential –ArgumentList $User, $SecurePassword
   ```
2. Go to **C:\Program Files\Microsoft Azure AD App Proxy Connector** and run the following script using the `$cred` object that you created:

   ```powershell
   .\RegisterConnector.ps1 -modulePath "C:\Program Files\Microsoft AAD App Proxy Connector\Modules\" -moduleName "AppProxyPSModule" -Authenticationmode Credentials -Usercredentials $cred -Feature ApplicationProxy -TenantId $TenantId
   ```

### Register the connector using a token created offline
1. Create an offline token using the AuthenticationContext class using the values in this code snippet or PowerShell cmdlets below:

   **Using C#:**

   ```csharp
   using System;
   using System.Linq;
   using System.Collections.Generic;
   using Microsoft.Identity.Client;

   class Program
   {
      #region constants
      /// <summary>
      /// The AAD authentication endpoint uri
      /// </summary>
      static readonly string AadAuthenticationEndpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

      /// <summary>
      /// The application ID of the connector in AAD
      /// </summary>
      static readonly string ConnectorAppId = "55747057-9b5d-4bd4-b387-abf52a8bd489";
   
      /// <summary>
      /// The AppIdUri of the registration service in AAD
      /// </summary>
      static readonly string RegistrationServiceAppIdUri = "https://proxy.cloudwebappproxy.net/registerapp/user_impersonation";

      #endregion

      #region private members
      private string token;
      private string tenantID;
      #endregion

      public void GetAuthenticationToken()
      {
         IPublicClientApplication clientApp = PublicClientApplicationBuilder
            .Create(ConnectorAppId)
            .WithDefaultRedirectUri() // will automatically use the default Uri for native app
            .WithAuthority(AadAuthenticationEndpoint)
            .Build();

         AuthenticationResult authResult = null;

         IAccount account = null;

         IEnumerable<string> scopes = new string[] { RegistrationServiceAppIdUri };

         try
         {
         authResult = await clientApp.AcquireTokenSilent(scopes, account).ExecuteAsync();
         }
         catch (MsalUiRequiredException ex)
         {
         authResult = await clientApp.AcquireTokenInteractive(scopes).ExecuteAsync();
         }

         if (authResult == null || string.IsNullOrEmpty(authResult.AccessToken) || string.IsNullOrEmpty(authResult.TenantId))
         {
         Trace.TraceError("Authentication result, token or tenant id returned are null");
         throw new InvalidOperationException("Authentication result, token or tenant id returned are null");
         }

         token = authResult.AccessToken;
         tenantID = authResult.TenantId;
      }
   }
   ```

   **Using PowerShell:**

   ```powershell
   # Load MSAL (Tested with version 4.7.1) 

   Add-Type -Path "..\MSAL\Microsoft.Identity.Client.dll"

   # The AAD authentication endpoint uri

   $authority = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"

   #The application ID of the connector in AAD

   $connectorAppId = "55747057-9b5d-4bd4-b387-abf52a8bd489";

   #The AppIdUri of the registration service in AAD
   $registrationServiceAppIdUri = "https://proxy.cloudwebappproxy.net/registerapp/user_impersonation"

   # Define the resources and scopes you want to call

   $scopes = New-Object System.Collections.ObjectModel.Collection["string"] 

   $scopes.Add($registrationServiceAppIdUri)

   $app = [Microsoft.Identity.Client.PublicClientApplicationBuilder]::Create($connectorAppId).WithAuthority($authority).WithDefaultRedirectUri().Build()

   [Microsoft.Identity.Client.IAccount] $account = $null

   # Acquiring the token

   $authResult = $null

   $authResult = $app.AcquireTokenInteractive($scopes).WithAccount($account).ExecuteAsync().ConfigureAwait($false).GetAwaiter().GetResult()

   # Check AuthN result
   If (($authResult) -and ($authResult.AccessToken) -and ($authResult.TenantId)) {

      $token = $authResult.AccessToken
      $tenantId = $authResult.TenantId

      Write-Output "Success: Authentication result returned."
   }
   Else {

      Write-Output "Error: Authentication result, token or tenant id returned with null."

   } 
   ```

2. Once you have the token, create a SecureString using the token:

   ```powershell
   $SecureToken = $Token | ConvertTo-SecureString -AsPlainText -Force
   ```

3. Run the following Windows PowerShell command, replacing \<tenant GUID\> with your directory ID:

   ```powershell
   .\RegisterConnector.ps1 -modulePath "C:\Program Files\Microsoft AAD App Proxy Connector\Modules\" -moduleName "AppProxyPSModule" -Authenticationmode Token -Token $SecureToken -TenantId <tenant GUID> -Feature ApplicationProxy
   ```

## Next steps
* [Publish applications using your own domain name](application-proxy-configure-custom-domain.md)
* [Enable single-sign on](application-proxy-configure-single-sign-on-with-kcd.md)
* [Troubleshoot issues you're having with Application Proxy](application-proxy-troubleshoot.md)
