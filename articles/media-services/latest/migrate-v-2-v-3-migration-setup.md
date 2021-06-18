---
title: Media Services v2 to v3 migration setup 
description: This article will assist you with setting up your environment for migrating from Azure Media Services v2 to v3.
services: media-services
author: IngridAtMicrosoft
manager: femila
editor: ''
tags: ''
keywords: azure media services, migration, stream, broadcast, live, SDK
ms.service: media-services
ms.devlang: multiple
ms.topic: conceptual
ms.tgt_pltfrm: multiple
ms.workload: media
ms.date: 03/25/2021
ms.author: inhenkel
---

# Step 3 - Set up to migrate to the V3 REST API or client SDK

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

<hr color="#5ea0ef" size="10">

![migration steps 2](./media/migration-guide/steps-3.svg)

The following describes the steps to take to set up your environment to use the Media Services V3 API.

## SDK model

In the V2 API, there were two different client SDKs, one for the management API, which allowed programmatic creation of accounts, and one for resource management.

Previously, developers would work with an Azure service principal client ID and client secret, along with a specific V2 REST API endpoint for their AMS account.

The V3 API is Azure Resource Management (ARM) based. It uses Azure Active Directory (Azure AD) service principal IDs and keys to connect to the API. Developers will need to create service principals or managed identities to connect to the API. In the V3 API, the API uses standard ARM endpoints, uses a similar and consistent model to all other Azure
services.

Customers previously using the 2015-10-01 version of the ARM management API to manage their V2 accounts should use the 2020-05-01 version of the ARM management API supported for V3 API access.

## Create a new media services account for testing

Follow the quickstart steps for [setting up your environment](setup-azure-subscription-how-to.md?tabs=portal) using the Azure portal. Select API access and service principal authentication to generate a new Azure AD application ID and secrets for use with this test account.

[Create a media services account](account-create-how-to.md?tabs=portal).
[Get credentials to access Media Services API](access-api-howto.md?tabs=portal).

## Download client SDK of your choice and set up your environment

- SDKs available for [.NET](/dotnet/api/overview/azure/mediaservices/management), .NET Core, [Node.js](/javascript/api/overview/azure/mediaservices/management), [Python](/python/api/overview/azure/mediaservices/management), [Java](/java/api/overview/azure/mediaservices/management), [Go](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/mediaservices/mgmt/2018-07-01/media), and [Ruby](https://github.com/Azure/azure-sdk-for-ruby/blob/master/README.md).
- [Azure CLI](/cli/azure/ams) integration for simple scripting support.

> [!NOTE]
> A community PHP SDK is no longer available for Azure Media Services on V3. If you're using PHP on V2, you should migrate to the REST API directly in your code.

## Open API specifications

- V3 is based on a unified API surface, which exposes both management and operations functionality built on Azure Resource Manager. Azure Resource Manager templates can be used to create and deploy transforms, streaming endpoints, live events, and more.

- The [OpenAPI Specification](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2020-05-01) (formerly called Swagger) document explains the schema for all service components.

- All client SDKs are derived and generated from the Open API specification published on GitHub. At the time of publication of this article, the latest Open API specifications are maintained publicly in GitHub. The 2020-05-01 version is the [latest stable release](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2020-05-01).

## [REST](#tab/rest)

Use [Postman](./setup-postman-rest-how-to.md) for Media Services v3 REST API calls.
Read the [REST API reference pages](/rest/api/media/).

You should use the 2020-05-01 version string in the Postman collection.

## [.NET](#tab/net)

Read the article, [Connect to Media Services v3 API with .NET](configure-connect-dotnet-howto.md) to set up your environment.

If you simply want to install the latest SDK using PackageManager, use the following command:

```Install-Package Microsoft.Azure.Management.Media```

Or to install the latest SDK using the .NET CLI use the following command:

```dotnet add package Microsoft.Azure.Management.Media```

Additionally, full .NET samples are available in [Azure-Samples/media-services-v3-dotnet](https://github.com/Azure-Samples/media-services-v3-dotnet) for various scenarios. The projects in this repository show how to implement different Azure Media Services scenarios using the v3 version.

### Get started adjusting your code

Search your code base for instances of `CloudMediaContext` usage to begin the upgrade process to the V3 API.

The following code shows how the v2 API was previously accessed using the v2 .NET SDK. Developers would begin with creating a `CloudMediaContext` and create an instance with an `AzureAdTokenCredentials` object.

```dotnet

class Program
	{
	    // Read values from the App.config file.
        private static readonly string _AADTenantDomain =
            ConfigurationManager.AppSettings["AMSAADTenantDomain"];
        private static readonly string _RESTAPIEndpoint =
            ConfigurationManager.AppSettings["AMSRESTAPIEndpoint"];
        private static readonly string _AMSClientId =
            ConfigurationManager.AppSettings["AMSClientId"];
        private static readonly string _AMSClientSecret =
            ConfigurationManager.AppSettings["AMSClientSecret"];

	    private static CloudMediaContext _context = null;

	    static void Main(string[] args)
	    {
        try
        {
            AzureAdTokenCredentials tokenCredentials = 
                new AzureAdTokenCredentials(_AADTenantDomain,
                    new AzureAdClientSymmetricKey(_AMSClientId, _AMSClientSecret),
                    AzureEnvironments.AzureCloudEnvironment);

            var tokenProvider = new AzureAdTokenProvider(tokenCredentials);

            _context = new CloudMediaContext(new Uri(_RESTAPIEndpoint), tokenProvider);

```

## [Java](#tab/java)

Read the article, [Connect to Media Services v3 API with Java](configure-connect-java-howto.md) to set up your environment.

## [Python](#tab/python)

Read the article, [Connect to Azure Media Services v3 API - Python](configure-connect-python-howto.md) to set up your environment.

## [Node.js](#tab/nodejs)

Read the article [Connect to Azure Media Services v3 API - Node.js](configure-connect-nodejs-howto.md) to set up your environment.

## [Ruby](#tab/ruby)

- Get the [Ruby](https://github.com/Azure/azure-sdk-for-ruby/blob/master/README.md) SDK on GitHub.

## [Go](#tab/go)

Download the [Go](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/mediaservices/mgmt/2018-07-01/media) SDK.

---
