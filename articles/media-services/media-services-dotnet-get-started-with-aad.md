---
title: Use AAD authentication to access Azure Media Services API with .NET | Microsoft Docs
description: This topic shows how to use Azure Active Directory (AAD) authentication to access Azure Media Services (AMS) API with .NET.
services: media-services
documentationcenter: ''
author: Juliako
manager: erikre
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/17/2017
ms.author: juliako

---
# Use AAD authentication to access Azure Media Services API with .NET

Starting with windowsazure.mediaservices 4.0.0.4, Azure Media Services supports Azure Active Directory (AAD) based authentication. This topic shows how to use Azure Active Directory (AAD) authentication to access Azure Media Services (AMS) API with .NET.

## Prerequisites

- An Azure account. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/). 
- A Media Services account. For more information, see [Create an Azure Media Services account using the Azure portal](media-services-portal-create-account.md)
- The latest [NuGet](https://www.nuget.org/packages/windowsazure.mediaservices) package.
- Make sure to review the [Accessing Azure Media Services API with AAD authentication overview](media-services-use-aad-auth-to-access-ams-api.md) topic. 

When using AAD authentication with Azure Media Services (AMS), you can authenticate in one of two ways:

- **User authentication** is used to authenticate a person who is using the app to interact with AMS resources. The interactive application should first prompt the user for credentials. For example, a management console app used by authorized users to monitor encoding jobs or live streaming. 
- **Service principal authentication** is used to authenticate a service. Applications that commonly use this authentication method are apps that run daemon services, middle-tier services or scheduled jobs: Web Apps, Function Apps, Logic Apps, API, Microservice.

>[!IMPORTANT]
>AMS currently supports ACS authentication model. However, ACS auth is going to be deprecated on June 1st, 2018. We recommend that you migrate to AAD authentication model as soon as possible.

## Azure AD access token

To connect to the AMS API with AAD authentication, the client app needs to request an AAD access token. When using Media Services .NET client SDK, a lot of the details regarding acquiring an AAD access token is wrapped and simplified for you in the [AzureAdTokenProvider](https://github.com/Azure/azure-sdk-for-media-services/blob/dev/src/net/Client/Common/Common.Authentication/AzureAdTokenProvider.cs) and [AzureAdTokenCredentials](https://github.com/Azure/azure-sdk-for-media-services/blob/dev/src/net/Client/Common/Common.Authentication/AzureAdTokenCredentials.cs) classes. For example, you do not need to provide the AAD authority, Media services Resource URI or native AAD application details. These are well known values that are already configured by the AAD access token provider class. 

If you are not using AMS .NET client SDK, it is recommended to use the [ADAL Library](../active-directory/develop/active-directory-authentication-libraries.md). To get values for the parameters that you need to use with ADAL Library, see [Use the Azure portal to access AAD authentication settings](media-services-portal-get-started-with-aad.md).

You also have the option of replacing the default implementation of the **AzureAdTokenProvider** with your own implementation.

## Install and configure AMS .NET SDK

>[!NOTE] 
>To be able use AAD authentication with Media Services .NET SDK, make sure to get the latest [NuGet](https://www.nuget.org/packages/windowsazure.mediaservices) package. Also, add a reference to the **Microsoft.IdentityModel.Clients.ActiveDirectory** assembly. If you are are using an existing app, include the **Microsoft.WindowsAzure.MediaServices.Client.Common.Authentication.dll** assembly. 

1. Create a new C# Console Application in Visual Studio.
2. Use the [windowsazure.mediaservices](https://www.nuget.org/packages/windowsazure.mediaservices) NuGet package to install **Azure Media Services .NET SDK**. 

	To add references by using NuGet do the following: in Solution Explorer, click the right mouse button on the project name, select **Manage NuGet packages**. Then, search for **windowsazure.mediaservices** and click **Install**.
	
	-or-

	Run the following command in **Package Manager Console** in Visual Studio.

		Install-Package windowsazure.mediaservices -Version 4.0.0.4

3. Add **using** to your source code.

	using Microsoft.WindowsAzure.MediaServices.Client; 

## Use user authentication

To connect to the AMS API with the user authentication option, the client app needs to request an AAD token using the following parameters:  

1. AAD tenant endpoint

	The tenant information can be retrieved from the Azure portal. Hover over the logged in user in the top right corner.

2. Media Services resource URI, 
3. Media Services (native) application Client ID, 
4. Media Services (native) application redirect URI, 

The values for these parameters can be found in **AzureEnvironments.AzureCloudEnvironment**. The **AzureEnvironments.AzureCloudEnvironment** constant is a helper in the .NET SDK to get the right environment variable settings for a public Azure Data Center. It contains pre-defined environment settings for accessing Media Services in the public data centers only. For sovereign or government cloud regions, you can use the " AzureChinaCloudEnvironment", "AzureUsGovernmentEnvrionment", or "AzureGermanCloudEnvironment" respectively.

The following code example creates a token.
	
	var tokenCredentials = new AzureAdTokenCredentials("microsoft.onmicrosoft.com", AzureEnvironments.AzureCloudEnvironment);
	var tokenProvider = new AzureAdTokenProvider(tokenCredentials);
  
To start programming against Media Services you need to create a **CloudMediaContext** instance that represents the server context. The CloudMediaContext includes references to important collections including jobs, assets, files, access policies, and locators. 

You need to pass the **resource URI for Media REST Services** to the **CloudMediaContext** constructor. To get resource URI for Media REST Services, log in to the Azure portal, select your AMS account, select **API access** and click on **Connect to AMS with user authentication**. 

The following code example creates a CloudMediaContext instance.

	CloudMediaContext context = new CloudMediaContext(new Uri("YOUR REST API ENDPOINT HERE"), tokenProvider);

The following example shows how to create the AAD token and the context.

	namespace AADAuthSample
	{
	    class Program
	    {
	        static void Main(string[] args)
	        {
				// Specify your AAD tenant domain, for example "microsoft.onmicrosoft.com"
	            var tokenCredentials = new AzureAdTokenCredentials("{YOUR AAD TENANT DOMAIN HERE}", AzureEnvironments.AzureCloudEnvironment);
	
	            var tokenProvider = new AzureAdTokenProvider(tokenCredentials);
	
				// Specify your REST API endpoint, for example "https://accountname.restv2.westcentralus.media.azure.net/API"
	            CloudMediaContext context = new CloudMediaContext(new Uri("YOUR REST API ENDPOINT HERE"), tokenProvider);
	
	            var assets = context.Assets;
	            foreach (var a in assets)
	            {
	                Console.WriteLine(a.Name);
	            }
	        }
	
	    }
	}

>[!NOTE]
>If you get the "The remote server returned an error: (401) Unauthorized." exception, see the [Access control](media-services-use-aad-auth-to-access-ams-api.md#access-control) section.

## Use service principal authentication
	
To connect to the AMS API with the service principal option, your middle-tier app (Web API or Web Application) needs to requests an AAD token with the following parameters:  

1. **AAD tenant endpoint**

	The tenant information can be retrieved from the Azure portal. Hover over the logged in user in the top right corner.

2. **Media Services resource URI**, 
4. AAD application values: the **Client ID** and **Client secret**.

The values for the **Client ID** and **Client secret** parameters can be found in the Azure portal. For more information, see [Use the Azure portal to access AAD authentication settings](media-services-portal-get-started-with-aad.md) using the "service principal authentication option. 

The following code example creates a token using the **AzureAdTokenCredentials** constructor that takes **AzureAdClientSymmetricKey** as a parameter. 
	
	var tokenCredentials = new AzureAdTokenCredentials("{YOUR AAD TENANT DOMAIN HERE}", 
								new AzureAdClientSymmetricKey("{YOUR CLIENT ID HERE}", "{YOUR CLIENT SECRET}"), 
								AzureEnvironments.AzureCloudEnvironment);

	var tokenProvider = new AzureAdTokenProvider(tokenCredentials);

You can also specify to use the **AzureAdTokenCredentials** constructor that takes **AzureAdClientCertificate** as a parameter. For instructions on how to create and configure a certificate in a form consumable by Azure AD, see [this](https://github.com/Azure-Samples/active-directory-dotnet-daemon-certificate-credential/blob/master/Manual-Configuration-Steps.md) document.

    var tokenCredentials = new AzureAdTokenCredentials("{YOUR AAD TENANT DOMAIN HERE}", 
								new AzureAdClientCertificate("{YOUR CLIENT ID HERE}", "{YOUR CLIENT CERTIFICATE THUMBPRINT}"), 
								AzureEnvironments.AzureCloudEnvironment);

To start programming against Media Services you need to create a **CloudMediaContext** instance that represents the server context. You need to pass the **resource URI for Media REST Services** to the **CloudMediaContext** constructor. You can get the **resource URI for Media REST Services** value from the Azure portal as well.

The following code example creates a CloudMediaContext instance.

	CloudMediaContext context = new CloudMediaContext(new Uri("YOUR REST API ENDPOINT HERE"), tokenProvider);
	
The following example shows how to create the AAD token and the context.

	namespace AADAuthSample
	{
	
	    class Program
	    {
	        static void Main(string[] args)
	        {
				var tokenCredentials = new AzureAdTokenCredentials("{YOUR AAD TENANT DOMAIN HERE}", 
											new AzureAdClientSymmetricKey("{YOUR CLIENT ID HERE}", "{YOUR CLIENT SECRET}"), 
											AzureEnvironments.AzureCloudEnvironment);
			
				var tokenProvider = new AzureAdTokenProvider(tokenCredentials);
	
				// Specify your REST API endpoint, for example "https://accountname.restv2.westcentralus.media.azure.net/API"		
				CloudMediaContext context = new CloudMediaContext(new Uri("YOUR REST API ENDPOINT HERE"), tokenProvider);
	
	            var assets = context.Assets;
	            foreach (var a in assets)
	            {
	                Console.WriteLine(a.Name);
	            }
	
	            Console.ReadLine();
	        }
	
	    }
	}

## Next steps

Get started with [uploading files to your account](media-services-dotnet-upload-files.md)