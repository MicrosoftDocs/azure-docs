---
title: Signing Key Rollover in Microsoft identity platform
description: This article discusses the signing key rollover best practices for Microsoft Entra ID
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 03/16/2023
ms.author: ryanwi
ms.reviewer: paulgarn, ludwignick
ms.custom: aaddev
---

# Signing key rollover in the Microsoft identity platform
This article discusses what you need to know about the public keys that are used by the Microsoft identity platform to sign security tokens. It's important to note that these keys roll over on a periodic basis and, in an emergency, could be rolled over immediately. All applications that use the Microsoft identity platform should be able to programmatically handle the key rollover process. Continue reading to understand how the keys work, how to assess the impact of the rollover to your application and how to update your application or establish a periodic manual rollover process to handle key rollover if necessary.

## Overview of signing keys in the Microsoft identity platform
The Microsoft identity platform uses public-key cryptography built on industry standards to establish trust between itself and the applications that use it. In practical terms, this works in the following way: The Microsoft identity platform uses a signing key that consists of a public and private key pair. When a user signs in to an application that uses the Microsoft identity platform for authentication, the Microsoft identity platform creates a security token that contains information about the user. This token is signed by the Microsoft identity platform using its private key before it's sent back to the application. To verify that the token is valid and originated from Microsoft identity platform, the application must validate the token’s signature using the public keys exposed by the Microsoft identity platform that is contained in the tenant’s [OpenID Connect discovery document](https://openid.net/specs/openid-connect-discovery-1_0.html) or SAML/WS-Fed [federation metadata document](federation-metadata.md).

For security purposes, the Microsoft identity platform’s signing key rolls on a periodic basis and, in the case of an emergency, could be rolled over immediately. There's no set or guaranteed time between these key rolls - any application that integrates with the Microsoft identity platform should be prepared to handle a key rollover event no matter how frequently it may occur. If your application doesn't handle sudden refreshes, and attempts to use an expired key to verify the signature on a token, your application will incorrectly reject the token.  Checking every 24 hours for updates is a best practice, with throttled (once every five minutes at most) immediate refreshes of the key document if a token is encountered that doesn't validate with the keys in your application's cache. 

There's always more than one valid key available in the OpenID Connect discovery document and the federation metadata document. Your application should be prepared to use any and all of the keys specified in the document, since one key may be rolled soon, another may be its replacement, and so forth.  The number of keys present can change over time based on the internal architecture of the Microsoft identity platform as we support new platforms, new clouds, or new authentication protocols. Neither the order of the keys in the JSON response nor the order in which they were exposed should be considered meaningful to your app. 

Applications that support only a single signing key, or those that require manual updates to the signing keys, are inherently less secure and less reliable.  They should be updated to use [standard libraries](reference-v2-libraries.md) to ensure that they're always using up-to-date signing keys, among other best practices. 

## How to assess if your application will be affected and what to do about it
How your application handles key rollover depends on variables such as the type of application or what identity protocol and library was used. The sections below assess whether the most common types of applications are impacted by the key rollover and provide guidance on how to update the application to support automatic rollover or manually update the key.

* [Native client applications accessing resources](#nativeclient)
* [Web applications / APIs accessing resources](#webclient)
* [Web applications / APIs protecting resources and built using Azure App Services](#appservices)
* [Web applications / APIs protecting resources using .NET OWIN OpenID Connect, WS-Fed or WindowsAzureActiveDirectoryBearerAuthentication middleware](#owin)
* [Web applications / APIs protecting resources using .NET Core OpenID Connect or  JwtBearerAuthentication middleware](#owincore)
* [Web applications / APIs protecting resources using Node.js `passport-azure-ad` module](#passport)
* [Web applications / APIs protecting resources and created with Visual Studio 2015 or later](#vs2015)
* [Web applications protecting resources and created with Visual Studio 2013](#vs2013)
* Web APIs protecting resources and created with Visual Studio 2013
* [Web applications protecting resources and created with Visual Studio 2012](#vs2012)
* [Web applications / APIs protecting resources using any other libraries or manually implementing any of the supported protocols](#other)

This guidance is **not** applicable for:

* Applications added from Microsoft Entra Application Gallery (including Custom) have separate guidance with regard to signing keys. [More information.](../manage-apps/tutorial-manage-certificates-for-federated-single-sign-on.md)
* On-premises applications published via application proxy don't have to worry about signing keys.

### <a name="nativeclient"></a>Native client applications accessing resources
Applications that are only accessing resources (for example, Microsoft Graph, KeyVault, Outlook API, and other Microsoft APIs) only obtain a token and pass it along to the resource owner. Given that they aren't protecting any resources, they don't inspect the token and therefore don't need to ensure it's properly signed.

Native client applications, whether desktop or mobile, fall into this category and are thus not impacted by the rollover.

### <a name="webclient"></a>Web applications / APIs accessing resources
Applications that are only accessing resources (such as Microsoft Graph, KeyVault, Outlook API, and other Microsoft APIs) only obtain a token and pass it along to the resource owner. Given that they aren't protecting any resources, they don't inspect the token and therefore don't need to ensure it's properly signed.

Web applications and web APIs that are using the app-only flow (client credentials / client certificate) to request tokens fall into this category and are thus not impacted by the rollover.

### <a name="appservices"></a>Web applications / APIs protecting resources and built using Azure App Services
Azure App Services' Authentication / Authorization (EasyAuth) functionality already has the necessary logic to handle key rollover automatically.

### <a name="owin"></a>Web applications / APIs protecting resources using .NET OWIN OpenID Connect, WS-Fed or WindowsAzureActiveDirectoryBearerAuthentication middleware
If your application is using the .NET OWIN OpenID Connect, WS-Fed or WindowsAzureActiveDirectoryBearerAuthentication middleware, it already has the necessary logic to handle key rollover automatically.

You can confirm that your application is using any of these by looking for any of the following snippets in your application's Startup.cs or Startup.Auth.cs files.

```csharp
app.UseOpenIdConnectAuthentication(
    new OpenIdConnectAuthenticationOptions
    {
        // ...
    });
```

```csharp
app.UseWsFederationAuthentication(
    new WsFederationAuthenticationOptions
    {
        // ...
    });
```

```csharp
app.UseWindowsAzureActiveDirectoryBearerAuthentication(
    new WindowsAzureActiveDirectoryBearerAuthenticationOptions
    {
        // ...
    });
```

### <a name="owincore"></a>Web applications / APIs protecting resources using .NET Core OpenID Connect or  JwtBearerAuthentication middleware
If your application is using the .NET Core OWIN OpenID Connect  or JwtBearerAuthentication middleware, it already has the necessary logic to handle key rollover automatically.

You can confirm that your application is using any of these by looking for any of the following snippets in your application's Startup.cs or Startup.Auth.cs

```
app.UseOpenIdConnectAuthentication(
     new OpenIdConnectAuthenticationOptions
     {
         // ...
     });
```
```
app.UseJwtBearerAuthentication(
    new JwtBearerAuthenticationOptions
    {
     // ...
     });
```

### <a name="passport"></a>Web applications / APIs protecting resources using Node.js `passport-azure-ad` module

If your application is using the Node.js passport-ad module, it already has the necessary logic to handle key rollover automatically.

You can confirm that your application passport-ad by searching for the following snippet in your application's app.js

```
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

passport.use(new OIDCStrategy({
    //...
));
```

### <a name="vs2015"></a>Web applications / APIs protecting resources and created with Visual Studio 2015 or later
If your application was built using a web application template in Visual Studio 2015 or later and you selected **Work Or School Accounts** from the **Change Authentication** menu, it already has the necessary logic to handle key rollover automatically. This logic, embedded in the OWIN OpenID Connect middleware, retrieves and caches the keys from the OpenID Connect discovery document and periodically refreshes them.

If you added authentication to your solution manually, your application might not have the necessary key rollover logic. You'll need to write it yourself, or follow the steps in [Web applications / APIs using any other libraries or manually implementing any of the supported protocols](#other).

### <a name="vs2013"></a>Web applications protecting resources and created with Visual Studio 2013
If your application was built using a web application template in Visual Studio 2013 and you selected **Organizational Accounts** from the **Change Authentication** menu, it already has the necessary logic to handle key rollover automatically. This logic stores your organization’s unique identifier and the signing key information in two database tables associated with the project. You can find the connection string for the database in the project’s Web.config file.

If you added authentication to your solution manually, your application might not have the necessary key rollover logic. You'll need to write it yourself, or follow the steps in [Web applications / APIs using any other libraries or manually implementing any of the supported protocols.](#other).

The following steps help you verify that the logic is working properly in your application.

1. In Visual Studio 2013, open the solution, and then select on the **Server Explorer** tab on the right window.
2. Expand **Data Connections**, **DefaultConnection**, and then **Tables**. Locate the **IssuingAuthorityKeys** table, right-click it, and then select **Show Table Data**.
3. In the **IssuingAuthorityKeys** table, there will be at least one row, which corresponds to the thumbprint value for the key. Delete any rows in the table.
4. Right-click the **Tenants** table, and then click **Show Table Data**.
5. In the **Tenants** table, there will be at least one row, which corresponds to a unique directory tenant identifier. Delete any rows in the table. If you don't delete the rows in both the **Tenants** table and **IssuingAuthorityKeys** table, you will get an error at runtime.
6. Build and run the application. After you have logged in to your account, you can stop the application.
7. Return to the **Server Explorer** and look at the values in the **IssuingAuthorityKeys** and **Tenants** table. You’ll notice that they have been automatically repopulated with the appropriate information from the federation metadata document.

### <a name="vs2013"></a>Web APIs protecting resources and created with Visual Studio 2013
If you created a web API application in Visual Studio 2013 using the Web API template, and then selected **Organizational Accounts** from the **Change Authentication** menu, you already have the necessary logic in your application.

If you manually configured authentication, follow the instructions below to learn how to configure your web API to automatically update its key information.

The following code snippet demonstrates how to get the latest keys from the federation metadata document, and then use the [JWT Token Handler](/previous-versions/dotnet/framework/windows-identity-foundation/json-web-token-handler) to validate the token. The code snippet assumes that you will use your own caching mechanism for persisting the key to validate future tokens from Microsoft identity platform, whether it be in a database, configuration file, or elsewhere.

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IdentityModel.Tokens;
using System.Configuration;
using System.Security.Cryptography.X509Certificates;
using System.Xml;
using System.IdentityModel.Metadata;
using System.ServiceModel.Security;
using System.Threading;

namespace JWTValidation
{
    public class JWTValidator
    {
        private string MetadataAddress = "[Your Federation Metadata document address goes here]";

        // Validates the JWT Token that's part of the Authorization header in an HTTP request.
        public void ValidateJwtToken(string token)
        {
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler()
            {
                // Do not disable for production code
                CertificateValidator = X509CertificateValidator.None
            };

            TokenValidationParameters validationParams = new TokenValidationParameters()
            {
                AllowedAudience = "[Your App ID URI goes here]",
                ValidIssuer = "[The issuer for the token goes here, such as https://sts.windows.net/68b98905-130e-4d7c-b6e1-a158a9ed8449/]",
                SigningTokens = GetSigningCertificates(MetadataAddress)

                // Cache the signing tokens by your desired mechanism
            };

            Thread.CurrentPrincipal = tokenHandler.ValidateToken(token, validationParams);
        }

        // Returns a list of certificates from the specified metadata document.
        public List<X509SecurityToken> GetSigningCertificates(string metadataAddress)
        {
            List<X509SecurityToken> tokens = new List<X509SecurityToken>();

            if (metadataAddress == null)
            {
                throw new ArgumentNullException(metadataAddress);
            }

            using (XmlReader metadataReader = XmlReader.Create(metadataAddress))
            {
                MetadataSerializer serializer = new MetadataSerializer()
                {
                    // Do not disable for production code
                    CertificateValidationMode = X509CertificateValidationMode.None
                };

                EntityDescriptor metadata = serializer.ReadMetadata(metadataReader) as EntityDescriptor;

                if (metadata != null)
                {
                    SecurityTokenServiceDescriptor stsd = metadata.RoleDescriptors.OfType<SecurityTokenServiceDescriptor>().First();

                    if (stsd != null)
                    {
                        IEnumerable<X509RawDataKeyIdentifierClause> x509DataClauses = stsd.Keys.Where(key => key.KeyInfo != null && (key.Use == KeyType.Signing || key.Use == KeyType.Unspecified)).
                                                             Select(key => key.KeyInfo.OfType<X509RawDataKeyIdentifierClause>().First());

                        tokens.AddRange(x509DataClauses.Select(token => new X509SecurityToken(new X509Certificate2(token.GetX509RawData()))));
                    }
                    else
                    {
                        throw new InvalidOperationException("There is no RoleDescriptor of type SecurityTokenServiceType in the metadata");
                    }
                }
                else
                {
                    throw new Exception("Invalid Federation Metadata document");
                }
            }
            return tokens;
        }
    }
}
```

### <a name="vs2012"></a>Web applications protecting resources and created with Visual Studio 2012
If your application was built in Visual Studio 2012, you probably used the Identity and Access Tool to configure your application. It’s also likely that you are using the [Validating Issuer Name Registry (VINR)](/previous-versions/dotnet/framework/windows-identity-foundation/validating-issuer-name-registry). The VINR is responsible for maintaining information about trusted identity providers (Microsoft identity platform) and the keys used to validate tokens issued by them. The VINR also makes it easy to automatically update the key information stored in a Web.config file by downloading the latest federation metadata document associated with your directory, checking if the configuration is out of date with the latest document, and updating the application to use the new key as necessary.

If you created your application using any of the code samples or walkthrough documentation provided by Microsoft, the key rollover logic is already included in your project. You will notice that the code below already exists in your project. If your application does not already have this logic, follow the steps below to add it and to verify that it’s working correctly.

1. In **Solution Explorer**, add a reference to the **System.IdentityModel** assembly for the appropriate project.
2. Open the **Global.asax.cs** file and add the following using directives:
   ```
   using System.Configuration;
   using System.IdentityModel.Tokens;
   ```
3. Add the following method to the **Global.asax.cs** file:
   ```
   protected void RefreshValidationSettings()
   {
    string configPath = AppDomain.CurrentDomain.BaseDirectory + "\\" + "Web.config";
    string metadataAddress =
                  ConfigurationManager.AppSettings["ida:FederationMetadataLocation"];
    ValidatingIssuerNameRegistry.WriteToConfig(metadataAddress, configPath);
   }
   ```
4. Invoke the **RefreshValidationSettings()** method in the **Application_Start()** method in **Global.asax.cs** as shown:
   ```
   protected void Application_Start()
   {
    AreaRegistration.RegisterAllAreas();
    ...
    RefreshValidationSettings();
   }
   ```

Once you have followed these steps, your application’s Web.config will be updated with the latest information from the federation metadata document, including the latest keys. This update will occur every time your application pool recycles in IIS; by default IIS is set to recycle applications every 29 hours.

Follow the steps below to verify that the key rollover logic is working.

1. After you have verified that your application is using the code above, open the **Web.config** file and navigate to the **\<issuerNameRegistry>** block, specifically looking for the following few lines:
   ```
   <issuerNameRegistry type="System.IdentityModel.Tokens.ValidatingIssuerNameRegistry, System.IdentityModel.Tokens.ValidatingIssuerNameRegistry">
        <authority name="https://sts.windows.net/ec4187af-07da-4f01-b18f-64c2f5abecea/">
          <keys>
            <add thumbprint="3A38FA984E8560F19AADC9F86FE9594BB6AD049B" />
          </keys>
   ```
2. In the **\<add thumbprint="">** setting, change the thumbprint value by replacing any character with a different one. Save the **Web.config** file.
3. Build the application, and then run it. If you can complete the sign-in process, your application is successfully updating the key by downloading the required information from your directory’s federation metadata document. If you are having issues signing in, ensure the changes in your application are correct by reading the [Adding Sign-On to Your Web Application Using Microsoft identity platform](https://github.com/Azure-Samples/active-directory-dotnet-webapp-openidconnect) article, or downloading and inspecting the following code sample: [Multi-Tenant Cloud Application for Microsoft Entra ID](https://code.msdn.microsoft.com/multi-tenant-cloud-8015b84b).

### <a name="other"></a>Web applications / APIs protecting resources using any other libraries or manually implementing any of the supported protocols
If you are using some other library or manually implemented any of the supported protocols, you'll need to review the library or your implementation to ensure that the key is being retrieved from either the OpenID Connect discovery document or the federation metadata document. One way to check for this is to do a search in your code or the library's code for any calls out to either the OpenID discovery document or the federation metadata document.

If the key is being stored somewhere or hardcoded in your application, you can manually retrieve the key and update it accordingly by performing a manual rollover as per the instructions at the end of this guidance document. **It is strongly encouraged that you enhance your application to support automatic rollover** using any of the approaches outline in this article to avoid future disruptions and overhead if the Microsoft identity platform increases its rollover cadence or has an emergency out-of-band rollover.

## How to test your application to determine if it will be affected

You can validate whether your application supports automatic key rollover by using the following PowerShell scripts.

To check and update signing keys with PowerShell, you'll need the [MSIdentityTools](https://www.powershellgallery.com/packages/MSIdentityTools) PowerShell module.

1. Install the [MSIdentityTools](https://www.powershellgallery.com/packages/MSIdentityTools) PowerShell module:

    ```powershell
    Install-Module -Name MSIdentityTools
    ```

1. Sign in by using the Connect-MgGraph command with an admin account to consent to the required scopes:

   ```powershell
    Connect-MgGraph -Scope "Application.ReadWrite.All"
   ```

1. Get the list of available signing key thumbprints:

    ```powershell
    Get-MsIdSigningKeyThumbprint
    ```

1. Pick any of the key thumbprints and configure Microsoft Entra ID to use that key with your application (get the app ID from the [Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)):

    ```powershell
    Update-MsIdApplicationSigningKeyThumbprint -ApplicationId <ApplicationId> -KeyThumbprint <Thumbprint>
    ```

1. Test the web application by signing in to get a new token. The key update change is instantaneous, but make sure you use a new browser session (using, for example, Internet Explorer's "InPrivate," Chrome's "Incognito," or Firefox's "Private" mode) to ensure you are issued a new token.

1. For each of the returned signing key thumbprints, run the `Update-MsIdApplicationSigningKeyThumbprint` cmdlet and test your web application sign-in process.

1. If the web application signs you in properly, it supports automatic rollover. If it doesn't, modify your application to support manual rollover. Check out [Establishing a manual rollover process](#how-to-perform-a-manual-rollover-if-your-application-does-not-support-automatic-rollover) for more information.

1. Run the following script to revert to normal behavior:

    ```powershell
    Update-MsIdApplicationSigningKeyThumbprint -ApplicationId <ApplicationId> -Default
    ```

## How to perform a manual rollover if your application does not support automatic rollover
If your application doesn't support automatic rollover, you need to establish a process that periodically monitors Microsoft identity platform's signing keys and performs a manual rollover accordingly.

To check and update signing keys with PowerShell, you'll need the [`MSIdentityTools`](https://www.powershellgallery.com/packages/MSIdentityTools) PowerShell module.

1. Install the [`MSIdentityTools`](https://www.powershellgallery.com/packages/MSIdentityTools) PowerShell module:

    ```powershell
    Install-Module -Name MSIdentityTools
    ```

1. Get the latest signing key (get the tenant ID from the [Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview)):

    ```powershell
    Get-MsIdSigningKeyThumbprint -Tenant <tenandId> -Latest
    ```

1. Compare this key against the key your application is currently hardcoded or configured to use.

1. If the latest key is different from the key your application is using, download the latest signing key:

    ```powershell
    Get-MsIdSigningKeyThumbprint -Latest -DownloadPath <DownloadFolderPath>
    ```

1. Update your application's code or configuration to use the new key.

1. Configure Microsoft Entra ID to use that latest key with your application (get the app ID from the [Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)):

    ```powershell
    Get-MsIdSigningKeyThumbprint -Latest | Update-MsIdApplicationSigningKeyThumbprint -ApplicationId <ApplicationId>
    ```

1. Test the web application by signing in to get a new token. The key update change is instantaneous, but make sure you use a new browser session (using, for example, Internet Explorer's "InPrivate," Chrome's "Incognito," or Firefox's "Private" mode) to ensure you are issued a new token.

1. If you experience any issues, revert to the previous key you were using and contact Azure support:

    ```powershell
    Update-MsIdApplicationSigningKeyThumbprint -ApplicationId <ApplicationId> -KeyThumbprint <PreviousKeyThumbprint>
    ```

1. After you update your application to support manual rollover, revert to normal behavior:

    ```powershell
    Update-MsIdApplicationSigningKeyThumbprint -ApplicationId <ApplicationId> -Default
    ```
