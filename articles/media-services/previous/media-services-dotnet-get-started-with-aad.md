---
title: Use Azure AD authentication to access Azure Media Services API with .NET | Microsoft Docs
description: This topic shows how to use Azure Active Directory (Azure AD) authentication to access Azure Media Services (AMS) API with .NET.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/18/2019
ms.author: juliako
ms.custom: has-adal-ref
---
# Use Azure AD authentication to access Azure Media Services API with .NET

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

Starting with windowsazure.mediaservices 4.0.0.4, Azure Media Services supports authentication based on Azure Active Directory (Azure AD). This topic shows you how to use Azure AD  authentication to access Azure Media Services API with Microsoft .NET.

## Prerequisites

- An Azure account. For details, see [Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
- A Media Services account. For more information, see [Create an Azure Media Services account using the Azure portal](media-services-portal-create-account.md).
- The latest [NuGet](https://www.nuget.org/packages/windowsazure.mediaservices) package.
- Familiarity with the topic [Accessing Azure Media Services API with Azure AD authentication overview](media-services-use-aad-auth-to-access-ams-api.md).

When you're using Azure AD authentication with Azure Media Services, you can authenticate in one of two ways:

- **User authentication** authenticates a person who is using the app to interact with Azure Media Services resources. The interactive application should first prompt the user for credentials. An example is a management console app that's used by authorized users to monitor encoding jobs or live streaming.
- **Service principal authentication** authenticates a service. Applications that commonly use this authentication method are apps that run daemon services, middle-tier services, or scheduled jobs, such as web apps, function apps, logic apps, APIs, or microservices.

>[!IMPORTANT]
>Azure Media Service currently supports an Azure Access Control Service  authentication model. However, Access Control authorization is going to be deprecated on June 22, 2018. We recommend that you migrate to an Azure Active Directory authentication model as soon as possible.

## Get an Azure AD access token

To connect to the Azure Media Services API with Azure AD authentication, the client app needs to request an Azure AD access token. When you use the Media Services .NET client SDK, many of the details about how to acquire an Azure AD access token are wrapped and simplified for you in the [AzureAdTokenProvider](https://github.com/Azure/azure-sdk-for-media-services/blob/dev/src/net/Client/Common/Common.Authentication/AzureAdTokenProvider.cs) and [AzureAdTokenCredentials](https://github.com/Azure/azure-sdk-for-media-services/blob/dev/src/net/Client/Common/Common.Authentication/AzureAdTokenCredentials.cs) classes.

For example, you don't need to provide the Azure AD authority, Media Services resource URI, or native Azure AD application details. These are well-known values that are already configured by the Azure AD access token provider class.

If you are not using Azure Media Service .NET SDK, we recommend that you use the [Azure AD Authentication Library](../../active-directory/azuread-dev/active-directory-authentication-libraries.md). To get values for the parameters that you need to use with Azure AD Authentication Library, see [Use the Azure portal to access Azure AD authentication settings](media-services-portal-get-started-with-aad.md).

You also have the option of replacing the default implementation of the **AzureAdTokenProvider** with your own implementation.

## Install and configure Azure Media Services .NET SDK

>[!NOTE]
>To use Azure AD authentication with the Media Services .NET SDK, you need to have the latest [NuGet](https://www.nuget.org/packages/windowsazure.mediaservices) package. Also, add a reference to the **Microsoft.IdentityModel.Clients.ActiveDirectory** assembly. If you are using an existing app, include the **Microsoft.WindowsAzure.MediaServices.Client.Common.Authentication.dll** assembly.

1. Create a new C# console application in Visual Studio.
2. Use the [windowsazure.mediaservices](https://www.nuget.org/packages/windowsazure.mediaservices) NuGet package to install **Azure Media Services .NET SDK**.

	To add references by using NuGet, take the following steps: in **Solution Explorer**, right-click the project name, and then select **Manage NuGet packages**. Then, search for **windowsazure.mediaservices** and select **Install**.

	-or-

	Run the following command in **Package Manager Console** in Visual Studio.

		Install-Package windowsazure.mediaservices -Version 4.0.0.4

3. Add **using** to your source code.

		using Microsoft.WindowsAzure.MediaServices.Client;

## Use user authentication

To connect to the Azure Media Service API with the user authentication option, the client app needs to request an Azure AD token by using the following parameters:

- Azure AD tenant endpoint. The tenant information can be retrieved from the Azure portal. Hover over the signed-in user in the upper-right corner.
- Media Services resource URI.
- Media Services (native) application client ID.
- Media Services (native) application redirect URI.

The values for these parameters can be found in **AzureEnvironments.AzureCloudEnvironment**. The **AzureEnvironments.AzureCloudEnvironment** constant is a helper in the .NET SDK to get the right environment variable settings for a public Azure Data Center.

It contains pre-defined environment settings for accessing Media Services in the public data centers only. For sovereign or government cloud regions, you can use **AzureChinaCloudEnvironment**, **AzureUsGovernmentEnvironment**, or **AzureGermanCloudEnvironment** respectively.

The following code example creates a token:

	var tokenCredentials = new AzureAdTokenCredentials("microsoft.onmicrosoft.com", AzureEnvironments.AzureCloudEnvironment);
	var tokenProvider = new AzureAdTokenProvider(tokenCredentials);

To start programming against Media Services, you need to create a **CloudMediaContext** instance that represents the server context. The **CloudMediaContext** includes references to important collections including jobs, assets, files, access policies, and locators.

You also need to pass the **resource URI for Media REST Services** to the **CloudMediaContext** constructor. To get the resource URI for Media REST Services, sign in to the Azure portal, select your Azure Media Services account, select **API access**, and then select **Connect to Azure Media Services with user authentication**.

The following code example creates a **CloudMediaContext** instance:

	CloudMediaContext context = new CloudMediaContext(new Uri("YOUR REST API ENDPOINT HERE"), tokenProvider);

The following example shows how to create the Azure AD token and the context:

	namespace AzureADAuthSample
	{
	    class Program
	    {
	        static void Main(string[] args)
	        {
				// Specify your Azure AD tenant domain, for example "microsoft.onmicrosoft.com".
	            var tokenCredentials = new AzureAdTokenCredentials("{YOUR Azure AD TENANT DOMAIN HERE}", AzureEnvironments.AzureCloudEnvironment);

	            var tokenProvider = new AzureAdTokenProvider(tokenCredentials);

				// Specify your REST API endpoint, for example "https://accountname.restv2.westcentralus.media.azure.net/API".
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
>If you get an exception that says "The remote server returned an error: (401) Unauthorized," see the [Access control](media-services-use-aad-auth-to-access-ams-api.md#access-control) section of Accessing Azure Media Services API with Azure AD authentication overview.

## Use service principal authentication

To connect to the Azure Media Services API with the service principal option, your middle-tier app (web API or web application) needs to requests an Azure AD token with the following parameters:

- Azure AD tenant endpoint. The tenant information can be retrieved from the Azure portal. Hover over the signed-in user in the upper-right corner.
- Media Services resource URI.
- Azure AD application values: the **Client ID** and **Client secret**.

The values for the **Client ID** and **Client secret** parameters can be found in the Azure portal. For more information, see [Getting started with Azure AD authentication using the Azure portal](media-services-portal-get-started-with-aad.md).

The following code example creates a token by using the **AzureAdTokenCredentials** constructor that takes **AzureAdClientSymmetricKey** as a parameter:

	var tokenCredentials = new AzureAdTokenCredentials("{YOUR Azure AD TENANT DOMAIN HERE}",
								new AzureAdClientSymmetricKey("{YOUR CLIENT ID HERE}", "{YOUR CLIENT SECRET}"),
								AzureEnvironments.AzureCloudEnvironment);

	var tokenProvider = new AzureAdTokenProvider(tokenCredentials);

You can also specify the **AzureAdTokenCredentials** constructor that takes **AzureAdClientCertificate** as a parameter.

For instructions about how to create and configure a certificate in a form that can be used by Azure AD, see [Authenticating to Azure AD in daemon apps with certificates - manual configuration steps](https://github.com/azure-samples/active-directory-dotnetcore-daemon-v2).

    var tokenCredentials = new AzureAdTokenCredentials("{YOUR Azure AD TENANT DOMAIN HERE}",
								new AzureAdClientCertificate("{YOUR CLIENT ID HERE}", "{YOUR CLIENT CERTIFICATE THUMBPRINT}"),
								AzureEnvironments.AzureCloudEnvironment);

To start programming against Media Services, you need to create a **CloudMediaContext** instance that represents the server context. You also need to pass the **resource URI for Media REST Services** to the **CloudMediaContext** constructor. You can get the **resource URI for Media REST Services** value from the Azure portal as well.

The following code example creates a **CloudMediaContext** instance:

	CloudMediaContext context = new CloudMediaContext(new Uri("YOUR REST API ENDPOINT HERE"), tokenProvider);

The following example shows how to create the Azure AD token and the context:

	namespace AzureADAuthSample
	{

	    class Program
	    {
	        static void Main(string[] args)
	        {
				var tokenCredentials = new AzureAdTokenCredentials("{YOUR Azure AD TENANT DOMAIN HERE}",
											new AzureAdClientSymmetricKey("{YOUR CLIENT ID HERE}", "{YOUR CLIENT SECRET}"),
											AzureEnvironments.AzureCloudEnvironment);

				var tokenProvider = new AzureAdTokenProvider(tokenCredentials);

				// Specify your REST API endpoint, for example "https://accountname.restv2.westcentralus.media.azure.net/API".
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

Get started with [uploading files to your account](media-services-dotnet-upload-files.md).
