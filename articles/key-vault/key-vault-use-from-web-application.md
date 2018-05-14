---
title: Use Azure Key Vault from a Web Application tutorial | Microsoft Docs
description: Use this tutorial to help you learn how to use Azure Key Vault from a web application.
services: key-vault
author: adhurwit
manager: mbaldwin
tags: azure-resource-manager

ms.assetid: 9b7d065e-1979-4397-8298-eeba3aec4792
ms.service: key-vault
ms.workload: identity
ms.topic: tutorial
ms.date: 05/14/2018
ms.author: adhurwit
# Customer intent: As a web developer, I want to access a secret from Azure Key Vault so that it can be used in a web application.
---
# Tutorial: Use Azure Key Vault from a web application
Use this tutorial to help you learn how to use Azure Key Vault from a web application in Azure. It shows the process of accessing a secret from an Azure Key Vault for use in a web application. This tutorial is designed for web developers that understand the basics of creating web applications on Azure. 

In this tutorial, you learn how to: 

> [!div class="checklist"]
> * Add application settings to the web.config file
> * Add a method to get an access token
> * Retrieve the token on Application Start
> * Authenticate with a certificate 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this tutorial, you must have the following items:

* A URI to a secret in an Azure Key Vault
* A Client ID and a Client Secret for a web application registered with Azure Active Directory that has access to your Key Vault
* A web application. This tutorial shows the steps for an ASP.NET MVC application deployed in Azure as a Web App.

Complete the steps in [Get Started with Azure Key Vault](key-vault-get-started.md) to get the URI to a secret, Client ID, Client Secret, and register the application. For more information about creating Azure Web Apps, see [Web Apps overview](../app-service/app-service-web-overview.md).

This sample depends on an older way of manually provisioning AAD Identities. Currently, there is a new feature in preview called [Managed Service Identity (MSI)](https://docs.microsoft.com/azure/active-directory/msi-overview), which can automatically provision AAD Identities. For more information, see the sample on [GitHub](https://github.com/Azure-Samples/app-service-msi-keyvault-dotnet/).


## <a id="packages"></a>Add NuGet packages

There are two packages that your web application needs to have installed.

* Active Directory Authentication Library - contains methods for interacting with Azure Active Directory and managing user identity
* Azure Key Vault Library - contains methods for interacting with Azure Key Vault

Both of these packages can be installed using the Package Manager Console using the Install-Package command.

```
Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory 
Install-Package Microsoft.Azure.KeyVault
```

## <a id="webconfig"></a>Modify web.config

There are three application settings that need to be added to the web.config file as follows.

```xml
    <!-- ClientId and ClientSecret refer to the web application registration with Azure Active Directory -->
    <add key="ClientId" value="clientid" />
    <add key="ClientSecret" value="clientsecret" />

    <!-- SecretUri is the URI for the secret in Azure Key Vault -->
    <add key="SecretUri" value="secreturi" />
```

If you aren't going to host your application as an Azure Web App, then you should add the actual ClientId, Client Secret, and Secret URI values to the web.config. Otherwise, leave the dummy values. We'll be adding the actual values in the Azure portal for an additional level of security.

## <a id="gettoken"></a>Add method to get an access token

To use the Key Vault API, you need an access token. The Key Vault Client handles calls to the Key Vault API but you need to supply it with a function that gets the access token.  

Following is the code to get an access token from Azure Active Directory. This code can go anywhere in your application. I like to add a Utils or EncryptionHelper class.  

```cs
//add these using statements
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Threading.Tasks;
using System.Web.Configuration;

//this is an optional property to hold the secret after it is retrieved
public static string EncryptSecret { get; set; }

//the method that will be provided to the KeyVaultClient
public static async Task<string> GetToken(string authority, string resource, string scope)
{
    var authContext = new AuthenticationContext(authority);
    ClientCredential clientCred = new ClientCredential(WebConfigurationManager.AppSettings["ClientId"],
                WebConfigurationManager.AppSettings["ClientSecret"]);
    AuthenticationResult result = await authContext.AcquireTokenAsync(resource, clientCred);

    if (result == null)
        throw new InvalidOperationException("Failed to obtain the JWT token");

    return result.AccessToken;
}
```
 Using Client ID and Client Secret is another way to authenticate an Azure AD application. Using it in your web application allows for a separation of duties and more control over your key management. However, it does rely on putting the Client Secret in your configuration settings. This can be as risky as putting the secret that you want to protect in your configuration settings for some people. 

> [!NOTE]
> Currently, the new feature Managed Service Identity (MSI) is the easiest way to authenticate. For more information, see the following link to the sample using [Key Vault with MSI in an application in .NET](https://github.com/Azure-Samples/app-service-msi-keyvault-dotnet/) and related [MSI with App Service and Functions tutorial](https://docs.microsoft.com/azure/app-service/app-service-managed-service-identity). 

## <a id="appstart"></a>Retrieve the secret on Application Start

Now we need code to call the Key Vault API and retrieve the secret. The following code can be put anywhere as long as it's called before you need to use it. I've put this code in the Application Start event in the Global.asax so it runs once on start and makes the secret available for the application.

```cs
//add these using statements
using Microsoft.Azure.KeyVault;
using System.Web.Configuration;

// I put my GetToken method in a Utils class. Change for wherever you placed your method.
var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(Utils.GetToken));
var sec = await kv.GetSecretAsync(WebConfigurationManager.AppSettings["SecretUri"]);

//I put a variable in a Utils class to hold the secret for general  application use.
Utils.EncryptSecret = sec.Value;
```

## <a id="portalsettings"></a>Add app settings in the Azure portal (optional)

If you have an Azure Web App, you can now add the actual values for the AppSettings in the Azure portal. By doing this, the actual values won't be in the web.config but protected via the Portal where you have separate access control capabilities. These values will be substituted for the values that you entered in your web.config. Make sure that the names are the same.

![Application Settings displayed in Azure portal][1]

## Authenticate with a certificate instead of a client secret

Another way to authenticate an Azure AD application is by using a Client ID and a Certificate instead of a Client ID and Client Secret. To use a Certificate in an Azure Web App, use the following steps:

1. Get or Create a Certificate
2. Associate the Certificate with an Azure AD application
3. Add code to your Web App to use the Certificate
4. Add a Certificate to your Web App

### Get or create a certificate

 We'll make a test certificate for this tutorial. Here are some commands that you can use in a Developer Command Prompt to create a certificate. Change directory to where you want the cert files created.  For the beginning and ending date of the certificate, use the current date plus one year.

```
makecert -sv mykey.pvk -n "cn=KVWebApp" KVWebApp.cer -b 07/31/2017 -e 07/31/2018 -r
pvk2pfx -pvk mykey.pvk -spc KVWebApp.cer -pfx KVWebApp.pfx -po test123
```

Make note of the end date and the password for the .pfx (in this example: July 31, 2018 and test123). You'll need them for the script below.

For more information on creating a test certificate, see [How to: Create Your Own Test Certificate](https://msdn.microsoft.com/library/ff699202.aspx)

### Associate the certificate with an Azure AD application

Now that you have a certificate, you need to associate it with an Azure AD application. Presently, the Azure portal doesn't support this workflow; this can be completed through PowerShell. Run the following commands to associate the certificate with the Azure AD application:

```ps
$x509 = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
$x509.Import("C:\data\KVWebApp.cer")
$credValue = [System.Convert]::ToBase64String($x509.GetRawCertData())


$adapp = New-AzureRmADApplication -DisplayName "KVWebApp" -HomePage "http://kvwebapp" -IdentifierUris "http://kvwebapp" -CertValue $credValue -StartDate $x509.NotBefore -EndDate $x509.NotAfter


$sp = New-AzureRmADServicePrincipal -ApplicationId $adapp.ApplicationId


Set-AzureRmKeyVaultAccessPolicy -VaultName 'contosokv' -ServicePrincipalName "http://kvwebapp" -PermissionsToSecrets all -ResourceGroupName 'contosorg'

# get the thumbprint to use in your app settings
$x509.Thumbprint
```

After you've run these commands, you can see the application in Azure AD. When searching, make sure you select "Applications my company owns" instead of "Applications my company uses" in the search dialog.

To learn more about Azure AD Application Objects and ServicePrincipal Objects, see [Application Objects and Service Principal Objects](../active-directory/active-directory-application-objects.md).

### Add code to your web app to use the certificate

Now we'll add code to your Web App to access the cert and use it for authentication.

First there's code to access the cert.

```cs
public static class CertificateHelper
{
    public static X509Certificate2 FindCertificateByThumbprint(string findValue)
    {
        X509Store store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
        try
        {
            store.Open(OpenFlags.ReadOnly);
            X509Certificate2Collection col = store.Certificates.Find(X509FindType.FindByThumbprint,
                findValue, false); // Don't validate certs, since the test root isn't installed.
            if (col == null || col.Count == 0)
                return null;
            return col[0];
        }
        finally
        {
            store.Close();
        }
    }
}
```

Note that StoreLocation is CurrentUser instead of LocalMachine. And that we're supplying 'false' to the Find method because we're using a test cert.

Next is code that uses the CertificateHelper and creates a ClientAssertionCertificate that is needed for authentication.

```cs
public static ClientAssertionCertificate AssertionCert { get; set; }

public static void GetCert()
{
    var clientAssertionCertPfx = CertificateHelper.FindCertificateByThumbprint(WebConfigurationManager.AppSettings["thumbprint"]);
    AssertionCert = new ClientAssertionCertificate(WebConfigurationManager.AppSettings["clientid"], clientAssertionCertPfx);
}
```

Here is the new code to get the access token. This code replaces the GetToken method in the preceding example. I've given it a different name for convenience.

```cs
public static async Task<string> GetAccessToken(string authority, string resource, string scope)
{
    var context = new AuthenticationContext(authority, TokenCache.DefaultShared);
    var result = await context.AcquireTokenAsync(resource, AssertionCert);
    return result.AccessToken;
}
```

I've put all of this code into my Web App project's Utils class for ease of use.

The last code change is in the Application_Start method. First we need to call the GetCert() method to load the ClientAssertionCertificate. And then we change the callback method that we supply when creating a new KeyVaultClient. This code replaces the code that we had in the preceding example.

```cs
Utils.GetCert();
var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(Utils.GetAccessToken));
```

### Add a certificate to your web app through the Azure portal

Adding a Certificate to your Web App is a simple two-step process. First, go to the Azure portal and navigate to your Web App. On the Settings for your Web App, click on the entry for "Custom domains and SSL". When it opens,  upload the Certificate that you created in the preceding example, KVWebApp.pfx, make sure that you remember the password for the pfx.

![Adding a Certificate to a Web App in the Azure portal][2]

The last thing that you need to do is to add an Application Setting to your Web App that has the name WEBSITE\_LOAD\_CERTIFICATES and a value of *. This will make sure that all Certificates are loaded. If you wanted to load only the Certificates that you've uploaded, then you can enter a comma-separated list of their thumbprints.

To learn more about adding a Certificate to a Web App, see [Using Certificates in Azure Websites Applications](https://azure.microsoft.com/blog/2014/10/27/using-certificates-in-azure-websites-applications/)

### Add a certificate to Key Vault as a secret

Instead of uploading your certificate to the Web App service directly, you can store it in Key Vault as a secret and deploy it from there. This is a two-step process that is outlined in the following blog post, [Deploying Azure Web App Certificate through Key Vault](https://blogs.msdn.microsoft.com/appserviceteam/2016/05/24/deploying-azure-web-app-certificate-through-key-vault/)

## Clean up resources
When no longer needed, delete the app service, key vault, and Azure AD application you used for the tutorial.  


## <a id="next"></a>Next steps
> [!div class="nextstepaction"]
>[Azure Key Vault Management API Reference](/dotnet/api/overview/azure/keyvault/management).

> [!div class="nextstepaction"]
>[Azure Key Vault Client API Reference](/dotnet/api/overview/azure/keyvault/client).

<!--Image references-->
[1]: ./media/key-vault-use-from-web-application/PortalAppSettings.png
[2]: ./media/key-vault-use-from-web-application/PortalAddCertificate.png
 