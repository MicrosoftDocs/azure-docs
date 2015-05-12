<properties 
	pageTitle="Use Azure Key Vault from a Web Application | Overview" 
	description="Use this tutorial to help you learn how to use Azure Key Vault from a web application." 
	services="key-vault" 
	documentationCenter="" 
	authors="adamhurwitz" 
	manager=""/>

<tags 
	ms.service="key-vault" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/11/2015" 
	ms.author="adhurwit"/>

# Use Azure Key Vault from a Web Application #

## Introduction  
Use this tutorial to help you learn how to use Azure Key Vault—currently in preview—from a web application in Azure. It walks you through the process of accessing a secret from an Azure Key Vault so that it can be used in your web application.

**Estimated time to complete:** 15 minutes


For overview information about Azure Key Vault, see [What is Azure Key Vault?](key-vault-whatis.md)

## Prerequisites 

To complete this tutorial, you must have the following:

- A URI to a secret in an Azure Key Vault
- A Client ID and Client Secret for a web application registered with Azure Active Directory that has access to your Key Vault
- A web application. We will be showing the steps for an ASP.NET MVC application deployed in Azure as a Web App. 

It is essential that you have completed the steps listed in [Get Started with Azure Key Vault](keyvault-get-started.md). 

The web application that will be accessing the Key Vault is the one that is registered in Azure Active Directory and has been given access to your Key Vault. If this is not the case, go back to Register an Application in the Get Started tutorial and repeat the steps listed. 

This tutorial is designed for web developers that understand the basics of creating web applications on Azure. For more information about Azure Web Apps, see [Web Apps overview](app-service-web-overview.md).



## <a id="packages"></a>Add Nuget Packages ##
There are three packages that your web application needs to have installed. 

- Active Directory Authentication Library - contains methods for interacting with Azure Active Directory and managing user identity
- Azure Key Vault Library - contains methods for interacting with Azure Key Vault


All three of these packages can be installed using the Package Manager Console using the Install-Package command. 

	// this is the latest stable version of ADAL
	Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -Version 2.16.204221202

	//this is a preview version of the Key Vault Library
	Install-Package Microsoft.Azure.KeyVault -Pre


## <a id="webconfig"></a>Modify Web.Config ##
There are three application settings that need to be added to the web.config file as follows. 

    <add key="ClientId" value="clientid" />
    <add key="ClientSecret" value="clientsecret" />
    <add key="SecretUri" value="secreturi" />


If you are not going to host your application as an Azure Web App, then you should add the actual ClientId, Client Secret, and Secret URI values to the web.config. Otherwise we will be adding them via the Azure Portal for an additional level of security. 


## <a id="gettoken"></a>Add Method to GetToken ##
In order to access your Key Vault we will use the Key Vault Client. The Key Vault Client in turn makes use of a callback function that you need to supply that will get the access token for Key Vault. 

This code can go anywhere in your application. I like to add a Utils or EncryptionHelper class. I have also added a string called EncryptSecret which will hold the secret after it is retrieved. 

	//add these using statements
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
	using Microsoft.Azure;
	
	//this is a property to hold the secret after it is retrieved
	public static string EncryptSecret { get; set; }

	//the method that will be provided to the KeyVaultClient
	public async static Task<string> GetToken(string authority, string resource, string scope)
    {
	    var authContext = new AuthenticationContext(authority);
	    ClientCredential clientCred = new ClientCredential(CloudConfigurationManager.GetSetting("ClientId"),
	    CloudConfigurationManager.GetSetting("ClientSecret"));
	    AuthenticationResult result = await authContext.AcquireTokenAsync(resource, clientCred);
	    
	    if (result == null)
	    	throw new InvalidOperationException("Failed to obtain the JWT token");
	    
	    return result.AccessToken;
    }

## <a id="appstart"></a>Retrieve the secret on Application Start ##
You will now add code to access the Key Vault and retrieve the secret. It can be put anywhere as long as it is called before you need to use it. I will put this code in the Application Start event in the Global.asax so that it runs once on start and makes the secret available for the application.  

	// I put my GetToken method in a Utils class. Change for wherever you placed your method. 
    var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(Utils.GetToken));
	var sec = kv.GetSecretAsync(CloudConfigurationManager.GetSetting("SecretUri")).Result.Value;
	
	//I put a variable in a Utils class to hold the secret for general  application use. 
    Utils.EncryptSecret = sec;


## <a id="portalsettings"></a>Add App Settings in the Azure Portal (optional) ##
If you have an Azure Web App you can now add the actual values for the AppSettings in the Azure Portal. By doing this, the actual values will not be in the web.config but protected via the Portal where you have separate access control capabilities. These values will be substituted for the values that you entered in your web.config. Make sure that the names are the same.

![Application Settings displayed in Azure Portal][1]



## <a id="next"></a>Next steps ##


For programming references, see [Azure Key Vault C# Client API Reference](https://msdn.microsoft.com/library/azure/dn903628.aspx).


<!--Image references-->
[1]: ./media/key-vault-use-from-web-application/PortalAppSettings.png