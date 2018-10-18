---
title: Use Azure Key Vault from a Web Application tutorial | Microsoft Docs
description: Use this tutorial to help you learn how to use Azure Key Vault from a web application.
services: key-vault
author: barclayn
manager: mbaldwin
tags: azure-resource-manager

ms.assetid: 9b7d065e-1979-4397-8298-eeba3aec4792
ms.service: key-vault
ms.workload: identity
ms.topic: tutorial
ms.date: 10/09/2018
ms.author: barclayn
# Customer intent: As a web developer, I want to access a secret from Azure Key Vault so that it can be used in a web application.
---
# Tutorial: Use Azure Key Vault from a web application

Use this tutorial to help you learn how to use Azure Key Vault from a web application in Azure. It shows the process of accessing a secret from an Azure Key Vault for use in a web application. The tutorial then builds on the process and uses a certificate instead of a client secret. This tutorial is designed for web developers that understand the basics of creating web applications on Azure.

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

Complete the steps in [Get Started with Azure Key Vault](key-vault-get-started.md) to get the URI to a secret, Client ID, Client Secret, and register the application. The web application will access the vault and must be registered in Azure Active Directory. It also needs to have access rights to Key Vault. If not, go back to Register an Application in the Get Started tutorial and repeat the steps listed. For more information about creating Azure Web Apps, see [Web Apps overview](../app-service/app-service-web-overview.md).

This sample depends on manually provisioning Azure Active Directory identities. But you should use [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) instead, which automatically provisions Azure AD identities. For more information, see the [sample on GitHub](https://github.com/Azure-Samples/app-service-msi-keyvault-dotnet/) and the related [App Service and Functions tutorial](https://docs.microsoft.com/azure/app-service/app-service-managed-service-identity). You can also look at the Key Vault specific [Configure an Azure web application to read a secret from Key Vault tutorial](tutorial-web-application-keyvault.md).

## <a id="packages"></a>Add NuGet packages

There are two packages that your web application needs to have installed.

* Active Directory Authentication Library - has methods for interacting with Azure Active Directory and managing user identity
* Azure Key Vault Library - has methods for interacting with Azure Key Vault

Both of these packages can be installed using the Package Manager Console using the Install-Package command.

```powershell
Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory 
Install-Package Microsoft.Azure.KeyVault
```

## <a id="webconfig"></a>Modify web.config

There are three application settings that need to be added to the web.config file as follows. We'll be adding the actual values in the Azure portal for an additional level of security.

```xml
    <!-- ClientId and ClientSecret refer to the web application registration with Azure Active Directory -->
    <add key="ClientId" value="clientid" />
    <add key="ClientSecret" value="clientsecret" />

    <!-- SecretUri is the URI for the secret in Azure Key Vault -->
    <add key="SecretUri" value="secreturi" />
    <!-- If you aren't hosting your app as an Azure Web App, then you should use the actual ClientId, Client Secret, and Secret URI values -->
```



## <a id="gettoken"></a>Add method to get an access token

To use the Key Vault API, you need an access token. The Key Vault Client handles calls to the Key Vault API but you need to supply it with a function that gets the access token. The following example is code to get an access token from Azure Active Directory. This code can go anywhere in your application. I like to add a Utils or EncryptionHelper class.  

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
// Using Client ID and Client Secret is a way to authenticate an Azure AD application.
// Using it in your web application allows for a separation of duties and more control over your key management. 
// However, it does rely on putting the Client Secret in your configuration settings.
// For some people, this can be as risky as putting the secret in your configuration settings.
```

## <a id="appstart"></a>Retrieve the secret on Application Start

Now we need code to call the Key Vault API and retrieve the secret. The following code can be put anywhere as long as it's called before you need to use it. I've put this code in the Application Start event in the Global.asax so it runs once on start and makes the secret available for the application.

```cs
//add these using statements
using Microsoft.Azure.KeyVault;
using System.Web.Configuration;

// I put my GetToken method in a Utils class. Change for wherever you placed your method.
var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(Utils.GetToken));
var sec = await kv.GetSecretAsync(WebConfigurationManager.AppSettings["SecretUri"]);

//I put a variable in a Utils class to hold the secret for general application use.
Utils.EncryptSecret = sec.Value;
```

## <a id="portalsettings"></a>Add app settings in the Azure portal

In the Azure Web App, you can now add the actual values for the AppSettings in the Azure portal. By doing this step, the actual values won't be in the web.config but protected via the Portal where you have separate access control capabilities. These values will be substituted for the values that you entered in your web.config. Make sure that the names are the same.

![Application Settings displayed in Azure portal][1]

## Authenticate with a certificate instead of a client secret

Now that you understand authenticating an Azure AD app using Client ID and Client Secret, let's use a Client ID and a certificate. To use a certificate in an Azure Web App, use the following steps:

1. Get or create a Certificate
2. Associate the certificate with an Azure AD application
3. Add code to your web app to use the certificate
4. Add a certificate to your web app

### Get or create a certificate

 We'll make a test certificate for this tutorial. Here is a script to create a self-signed certificate. Change directory to where you want the cert files created.  For the beginning and ending date of the certificate, you can use the current date plus one year.

```powershell
#Create self-signed certificate and export pfx and cer files 
$PfxFilePath = 'KVWebApp.pfx'
$CerFilePath = 'KVWebApp.cer'
$DNSName = 'MyComputer.Contoso.com'
$Password = 'MyPassword"'

$StoreLocation = 'CurrentUser' #be aware that LocalMachine requires elevated privileges
$CertBeginDate = Get-Date
$CertExpiryDate = $CertBeginDate.AddYears(1)

$SecStringPw = ConvertTo-SecureString -String $Password -Force -AsPlainText 
$Cert = New-SelfSignedCertificate -DnsName $DNSName -CertStoreLocation "cert:\$StoreLocation\My" -NotBefore $CertBeginDate -NotAfter $CertExpiryDate -KeySpec Signature
Export-PfxCertificate -cert $Cert -FilePath $PFXFilePath -Password $SecStringPw 
Export-Certificate -cert $Cert -FilePath $CerFilePath 
```

Make note of the end date and the password for the .pfx (in this example: May 15, 2019 and MyPassword). You'll need them for the script below. 
### Associate the certificate with an Azure AD application

Now that you have a certificate, you need to associate it with an Azure AD application. The association can be completed through PowerShell. Run the following commands to associate the certificate with the Azure AD application:

```powershell
$x509 = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
$x509.Import("C:\data\KVWebApp.cer")
$credValue = [System.Convert]::ToBase64String($x509.GetRawCertData())


$adapp = New-AzureRmADApplication -DisplayName "KVWebApp" -HomePage "http://kvwebapp" -IdentifierUris "http://kvwebapp" -CertValue $credValue -StartDate $x509.NotBefore -EndDate $x509.NotAfter


$sp = New-AzureRmADServicePrincipal -ApplicationId $adapp.ApplicationId


Set-AzureRmKeyVaultAccessPolicy -VaultName 'contosokv' -ServicePrincipalName "http://kvwebapp" -PermissionsToSecrets get,list,set,delete,backup,restore,recover,purge -ResourceGroupName 'contosorg'

# get the thumbprint to use in your app settings
$x509.Thumbprint
```

After you've run these commands, you can see the application in Azure AD. When searching the app registrations, make sure you select **My apps** instead of "All apps" in the search dialog. 

### Add code to your web app to use the certificate

Now we'll add code to your Web App to access the cert and use it for authentication. 

First, there's code to access the cert. Note that StoreLocation is CurrentUser instead of LocalMachine. And that we're supplying 'false' to the Find method because we're using a test cert.

```cs
//Add this using statement
using System.Security.Cryptography.X509Certificates;  

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



Next is code that uses the CertificateHelper and creates a ClientAssertionCertificate that is needed for authentication.

```cs
public static ClientAssertionCertificate AssertionCert { get; set; }

public static void GetCert()
{
    var clientAssertionCertPfx = CertificateHelper.FindCertificateByThumbprint(WebConfigurationManager.AppSettings["thumbprint"]);
    AssertionCert = new ClientAssertionCertificate(WebConfigurationManager.AppSettings["clientid"], clientAssertionCertPfx);
}
```

Here is the new code to get the access token. This code replaces the GetToken method in the preceding example. I've given it a different name for convenience. I've put all of this code into my Web App project's Utils class for ease of use.

```cs
public static async Task<string> GetAccessToken(string authority, string resource, string scope)
{
    var context = new AuthenticationContext(authority, TokenCache.DefaultShared);
    var result = await context.AcquireTokenAsync(resource, AssertionCert);
    return result.AccessToken;
}
```



The last code change is in the Application_Start method. First we need to call the GetCert() method to load the ClientAssertionCertificate. And then we change the callback method that we supply when creating a new KeyVaultClient. This code replaces the code that we had in the preceding example.

```cs
Utils.GetCert();
var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(Utils.GetAccessToken));
```

### Add a certificate to your web app through the Azure portal

Adding a Certificate to your Web App is a simple two-step process. First, go to the Azure portal and navigate to your Web App. On the Settings for your Web App, click on the entry for **SSL settings**. When it opens,  upload the Certificate that you created in the preceding example, KVWebApp.pfx. Make sure that you remember the password for the pfx.

![Adding a Certificate to a Web App in the Azure portal][2]

The last thing that you need to do is to add an Application Setting to your Web App that has the name WEBSITE\_LOAD\_CERTIFICATES and a value of *. This step will make sure that all Certificates are loaded. If you wanted to load only the Certificates that you've uploaded, then you can enter a comma-separated list of their thumbprints.


## Clean up resources
When no longer needed, delete the app service, key vault, and Azure AD application you used for the tutorial.  


## <a id="next"></a>Next steps
> [!div class="nextstepaction"]
>[Azure Key Vault Management API Reference](/dotnet/api/overview/azure/keyvault/management).


<!--Image references-->
[1]: ./media/key-vault-use-from-web-application/PortalAppSettings.png
[2]: ./media/key-vault-use-from-web-application/PortalAddCertificate.png
 