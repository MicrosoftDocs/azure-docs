<properties
	pageTitle="Signing Key Rollover in Azure AD | Microsoft Azure"
	description="This article discusses the signing key rollover best practices for Azure Active Directory"
	services="active-directory"
	documentationCenter=".net"
	authors="gsacavdm"
	manager="krassk"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/18/2016"
	ms.author="gsacavdm"/>

# Signing key rollover in Azure Active Directory

This topic discusses what you need to know about the public keys that are used in Azure Active Directory (Azure AD) to sign security tokens. It is important to note that these keys rollover on a periodic basis and, in an emergency, could be rolled over immediately. All applications that use Azure AD should be able to programmatically handle the key rollover process. Continue reading to understand how the keys work, how to assess the impact of the rollover to your application and how to update your application to handle key rollover if necessary.

> [AZURE.IMPORTANT] The next signing key rollover is scheduled for August 15th, 2016 and will **not** affect applications added from the Azure AD Application Gallery (including Custom), on-premises applications published via application proxy, applications in Azure AD B2C tenants, applications integrating with ACS or ADFS.

## Overview of signing keys in Azure AD

Azure AD uses public-key cryptography built on industry standards to establish trust between itself and the applications that use it. In practical terms, this works in the following way: Azure AD uses a signing key that consists of a public and private key pair. When a user signs in to an application that uses Azure AD for authentication, Azure AD creates a security token that contains information about the user. This token is signed by Azure AD using its private key before it is sent back to the application. To verify that the token is valid and actually originated from Azure AD, the application must validate the token’s signature using the public key exposed by Azure AD that is contained in the tenant’s [OpenID Connect discovery document](http://openid.net/specs/openid-connect-discovery-1_0.html) or SAML/WS-Fed [federation metadata document](active-directory-federation-metadata.md).

For security purposes, Azure AD’s signing key rolls on a periodic basis and, in the case of an emergency, could be rolled over immediately. Any application that integrates with Azure AD should be prepared to handle a key rollover event no matter how frequently it may occur. If it doesn’t, and your application attempts to use an expired key to verify the signature on a token, the sign-in request will fail.

There is always more than one valid key available in the OpenID Connect discovery document and the federation metadata document. Your application should be prepared to use any of the keys specified in the document, since one key may be rolled soon, another may be its replacement, and so forth.

## How to assess if your application will be affected and what to do about it

How your application handles key rollover depends on variables such as the type of application or what identity protocol and library was used. The sections below assess whether the most common types of applications are impacted by the key rollover and provide guidance on how to update the application to support automatic rollover or manually update the key.

* [Native client applications accessing resources](#nativeclient)
* [Web applications / APIs accessing resources](#webclient)
* [Web applications / APIs protecting resources and built using Azure App Services](#appservices)
* [Web applications / APIs protecting resources using .NET OWIN OpenID Connect, WS-Fed or WindowsAzureActiveDirectoryBearerAuthentication middleware](#owin)
* [Web applications / APIs protecting resources using .NET Core OpenID Connect or  JwtBearerAuthentication middleware](#owincore)
* [Web applications / APIs protecting resources using Node.js passport-azure-ad module](#passport)
* [Web applications / APIs protecting resources and created with Visual Studio 2015](#vs2015)
* [Web applications protecting resources and created with Visual Studio 2013](#vs2013)
* [Web APIs protecting resources and created with Visual Studio 2013](#vs2013_webapi)
* [Web applications protecting resources and created with Visual Studio 2012](#vs2012)
* [Web applications protecting resources and created with Visual Studio 2010, 2008 o using Windows Identity Foundation](#vs2010)
* [Web applications / APIs protecting resources using any other libraries or manually implementing any of the supported protocols](#other)

### <a name="nativeclient"></a>Native client applications accessing resources

Applications that are only accessing resources (i.e Microsoft Graph, KeyVault, Outlook API and other Microsoft APIs) generally only obtain a token and pass it along to the resource owner. Given that they are not protecting any resources, they do not inspect the token and therefore do not need to ensure it is properly signed.

Native client applications, whether desktop or mobile, fall into this category and are thus not impacted by the rollover.

### <a name="webclient"></a>Web applications / APIs accessing resources

Applications that are only accessing resources (i.e Microsoft Graph, KeyVault, Outlook API and other Microsoft APIs) generally only obtain a token and pass it along to the resource owner. Given that they are not protecting any resources, they do not inspect the token and therefore do not need to ensure it is properly signed.

Web applications and web APIs that are using the app-only flow (client credentials / client certificate), fall into this category and are thus not impacted by the rollover.

### <a name="appservices"></a>Web applications / APIs protecting resources and built using Azure App Services

Azure App Services' Authentication / Authorization (EasyAuth) functionality already has the necessary logic to handle key rollover automatically.

### <a name="owin"></a>Web applications / APIs protecting resources using .NET OWIN OpenID Connect, WS-Fed or WindowsAzureActiveDirectoryBearerAuthentication middleware

If your application is using the .NET OWIN OpenID Connect, WS-Fed or WindowsAzureActiveDirectoryBearerAuthentication middleware, it already has the necessary logic to handle key rollover automatically.

You can confirm that your application is using any of these by looking for any of the following snippets in your application's Startup.cs or Startup.Auth.cs

```
app.UseOpenIdConnectAuthentication(
	 new OpenIdConnectAuthenticationOptions
	 {
		 // ...
	 });
```
```
app.UseWsFederationAuthentication(
    new WsFederationAuthenticationOptions
    {
	 // ...
 	});
```
```
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

### <a name="passport"></a>Web applications / APIs protecting resources using Node.js passport-azure-ad module

If your application is using the Node.js passport-ad module, it already has the necessary logic to handle key rollover automatically.

You can confirm that your application passport-ad by searching for the following snippet in your application's app.js

```
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

passport.use(new OIDCStrategy({
	//...
));
```

### <a name="vs2015"></a>Web applications / APIs protecting resources and created with Visual Studio 2015

If your application was built using a web application template in Visual Studio 2015 and you selected **Work And School Accounts** from the **Change Authentication** menu, it already has the necessary logic to handle key rollover automatically. This logic, embedded in the OWIN OpenID Connect middleware, retrieves and caches the keys from the OpenID Connect discovery document and periodically refreshes them.

If you added authentication to your solution manually, your application might not have the necessary key rollover logic. You will need to write it yourself, or follow the steps in [Web applications / APIs using any other libraries or manually implementing any of the supported protocols.](#other).

### <a name="vs2013"></a>Web applications protecting resources and created with Visual Studio 2013

If your application was built using a web application template in Visual Studio 2013 and you selected **Organizational Accounts** from the **Change Authentication** menu, it already has the necessary logic to handle key rollover automatically. This logic stores your organization’s unique identifier and the signing key information in two database tables associated with the project. You can find the connection string for the database in the project’s Web.config file.

If you added authentication to your solution manually, your application might not have the necessary key rollover logic. You will need to write it yourself, or follow the steps in [Web applications / APIs using any other libraries or manually implementing any of the supported protocols.](#other).

The following steps will help you verify that the logic is working properly in your application.

1. In Visual Studio 2013, open the solution, and then click on the **Server Explorer** tab on the right window.
2. Expand **Data Connections**, **DefaultConnection**, and then **Tables**. Locate the **IssuingAuthorityKeys** table, right-click it, and then click **Show Table Data**.
3. In the **IssuingAuthorityKeys** table, there will be at least one row, which corresponds to the thumbprint value for the key. Delete any rows in the table.
4. Right-click the **Tenants** table, and then click **Show Table Data**.
5. In the **Tenants** table, there will be at least one row, which corresponds to a unique directory tenant identifier. Delete any rows in the table. If you don't delete the rows in both the **Tenants** table and **IssuingAuthorityKeys** table, you will get an error at runtime.
6. Build and run the application. After you have logged in to your account, you can stop the application.
7. Return to the **Server Explorer** and look at the values in the **IssuingAuthorityKeys** and **Tenants** table. You’ll notice that they have been automatically repopulated with the appropriate information from the federation metadata document.

### <a name="vs2013"></a>Web APIs protecting resources and created with Visual Studio 2013

If you created a web API application in Visual Studio 2013 using the Web API template, and then selected **Organizational Accounts** from the **Change Authentication** menu, you already have the necessary logic in your application. If you manually configured authentication, follow the instructions below to learn how to configure your Web API to automatically update its key information.

The following code snippet demonstrates how to get the latest keys from the federation metadata document, and then use the [JWT Token Handler](https://msdn.microsoft.com/library/dn205065.aspx) to validate the token. The code snippet assumes that you will use your own caching mechanism for persisting the key to validate future tokens from Azure AD, whether it be in a database, configuration file, or elsewhere.

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
                AllowedAudience = "[Your App ID URI goes here, as registered in the Azure Classic Portal]",
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

If your application was built in Visual Studio 2012, you probably used the Identity and Access Tool to configure your application. It’s also likely that you are using the [Validating Issuer Name Registry (VINR)](https://msdn.microsoft.com/library/dn205067.aspx). The VINR is responsible for maintaining information about trusted identity providers (Azure AD) and the keys used to validate tokens issued by them. The VINR also makes it easy to automatically update the key information stored in a Web.config file by downloading the latest federation metadata document associated with your directory, checking if the configuration is out of date with the latest document, and updating the application to use the new key as necessary.

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

1. After you have verified that your application is using the code above, open the **Web.config** file and navigate to the **<issuerNameRegistry>** block, specifically looking for the following few lines:
```
<issuerNameRegistry type="System.IdentityModel.Tokens.ValidatingIssuerNameRegistry, System.IdentityModel.Tokens.ValidatingIssuerNameRegistry">
        <authority name="https://sts.windows.net/ec4187af-07da-4f01-b18f-64c2f5abecea/">
          <keys>
            <add thumbprint="3A38FA984E8560F19AADC9F86FE9594BB6AD049B" />
          </keys>
```
2. In the **<add thumbprint=””>** setting, change the thumbprint value by replacing any character with a different one. Save the **Web.config** file.

3. Build the application, and then run it. If you can complete the sign-in process, your application is successfully updating the key by downloading the required information from your directory’s federation metadata document. If you are having issues signing in, ensure the changes in your application are correct by reading the [Adding Sign-On to Your Web Application Using Azure AD](https://github.com/Azure-Samples/active-directory-dotnet-webapp-openidconnect) topic, or downloading and inspecting the following code sample: [Multi-Tenant Cloud Application for Azure Active Directory](https://code.msdn.microsoft.com/multi-tenant-cloud-8015b84b).


### <a name="vs2010"></a>Web applications protecting resources and created with Visual Studio 2008 or 2010 and Windows Identity Foundation (WIF) v1.0 for .NET 3.5

If you built an application on WIF v1.0, there is no provided mechanism to automatically refresh your application’s configuration to use a new key. The easiest way to update the key is to use the FedUtil tooling included in the WIF SDK, which can retrieve the latest metadata document and update your configuration. These instructions are included below. Alternatively, you can do one of the following:

- Follow the instructions in the Manually Retrieve the Latest Key and Update Your Application section below and write logic to perform the steps programmatically.
- Update your application to .NET 4.5, which includes the newest version of WIF located in the System namespace. You can then use the [Validating Issuer Name Registry (VINR)](https://msdn.microsoft.com/library/dn205067.aspx) to perform automatic updates of the application’s configuration.


1. Verify that you have the WIF v1.0 SDK installed on your development machine for Visual Studio 2008 or 2010. You can [download it from here](https://www.microsoft.com/en-us/download/details.aspx?id=4451) if you have not yet installed it.
2. In Visual Studio, open the solution, and then right-click the applicable project and select **Update federation metadata**. If this option is not available, FedUtil and/or the WIF v1.0 SDK has not been installed.
3. From the prompt, select **Update** to begin updating your federation metadata. If you have access to the server environment where the application is hosted, you can optionally use FedUtil’s [automatic metadata update scheduler](https://msdn.microsoft.com/library/ee517272.aspx).
4. Click **Finish** to complete the update process.

### <a name="other"></a>Web applications / APIs protecting resources using any other libraries or manually implementing any of the supported protocols

If you are using some other library or manually implemented any of the supported protocols, you'll need to review the library or your implementation to ensure that the key is being retrieved from either the OpenID Connect discovery document or the federation metadata document. One way to check for this is to do a search in your code or the library's code for any calls out to either the OpenID discovery document or the federation metadata document.

If they key is being stored somewhere or hardcoded in your application, you can manually retrieve the key and update it accordingly. **It is strongly encouraged that you enhance your application to support automatic rollover** using any of the approaches outline in this article to avoid future disruptions and overhead if Azure AD increases it's rollover cadence or has an emergency out-of-band rollover.

To manually retrieve the latest key from the OpenID discovery document:

1. In your web browser, go to `https://login.microsoftonline.com/your_directory_name/.well-known/openid-configuration`. You will see the contents of the OpenID Connect discovery document. For more information about this document, see the [OpenID Discovery Document specification](http://openid.net/specs/openid-connect-discovery-1_0.html).
2. Copy the link in value of jwks_uri
3. Open a new tab in your browser, and go to the URL that you just copied. You will see the contents of the JSON Web Key Set document.
4. For the purposes of updating an application to use a new key, locate each **x5c** element, and then copy the value of each. For example:
```
keys: [
	{
		kty: "RSA",
		use: "sig",
		kid: "MnC_VZcATfM5pOYiJHMba9goEKY",
		x5t: "MnC_VZcATfM5pOYiJHMba9goEKY",
		n: "vIqz-4-ER_vNW...ixLUQ",
		e: "AQAB",
		x5c: [
			"MIIC4jCCAcqgAw...dhXsIIKvJQ=="
		]
	},
```
5. After you’ve copied the value of the **<X509Certificate>** element, open a plain text editor and paste the value. Make sure that you remove any trailing whitespace, and then save the file with a **.cer** extension.

To manually retrieve the latest key from the federation metadata document:

1. In your web browser, go to `https://login.microsoftonline.com/your_directory_name/federationmetadata/2007-06/federationmetadata.xml`. You will see the contents of the Federation Metadata XML document. For more information about this document, see the [Federation Metadata](active-directory-federation-metadata.md) topic.
2. For the purposes of updating an application to use a new key, locate each **<RoleDescriptor>** block, and then copy the value of each block’s **<X509Certificate>** element. For example:
```
<RoleDescriptor xmlns:fed="http://docs.oasis-open.org/wsfed/federation/200706" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" protocolSupportEnumeration="http://docs.oasis-open.org/wsfed/federation/200706" xsi:type="fed:SecurityTokenServiceType">
      <KeyDescriptor use="signing">
            <KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
                <X509Data>
                    <X509Certificate>MIIDPjC…BcXWLAIarZ</X509Certificate>
```
3. After you’ve copied the value of the **<X509Certificate>** element, open a plain text editor and paste the value. Make sure that you remove any trailing whitespace, and then save the file with a **.cer** extension.

You’ve just created the X509 certificate that is used as the public key for Azure AD. Using the details of the certificate, such as its thumbprint and expiration date, you can manually or programmatically check that your application’s currently used certificate and thumbprint are valid.

## How to test your application to determine if it will be affected

You can validate whether your application supports automatic key rollover by downloading the scripts and following the instructions in [this GitHub repository.](https://github.com/AzureAD/azure-activedirectory-powershell-tokenkey)
