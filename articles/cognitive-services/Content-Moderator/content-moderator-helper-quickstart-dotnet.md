---
title: "Quickstart: Content Moderator SDK for .NET helper method"
titlesuffix: Azure Cognitive Services
description: How to return a Content Moderator client using Azure Content Moderator SDK for .NET
services: cognitive-services
author: sanjeev3
manager: cgronlun

ms.service: cognitive-services
ms.component: content-moderator
ms.topic: quickstart
ms.date: 01/04/2018
ms.author: sajagtap
---

# Quickstart: Helper code to return a Content Moderator client

This article provides information and code samples to help you get started using the Content Moderator SDK for .NET to create a Content Moderator client for your subscription.

The library is used by other quickstarts in this section.

This article assumes that you are already familiar with Visual Studio and C#.

> [!IMPORTANT]
> This class library contains code intended for demonstration purposes only.
> If you adapt this code for use in production, use a secure method of storing 
> and using your Content Moderator subscription key.

## Sign up for Content Moderator services

Before you can use Content Moderator services through the REST API or the SDK, you need a subscription key.
Refer to the [Quickstart](quick-start.md) to learn how you can obtain the key.

## Create your Visual Studio project

1. Create a new **Class Library (.NET Framework)** project.

   In the sample code, I named the project **ModeratorHelper**.

1. Add a reference to the **System.Configuration** Framework assembly.

### Install required packages

Install the following NuGet packages:

- Microsoft.Azure.CognitiveServices.ContentModerator
- Microsoft.Rest.ClientRuntime
- Newtonsoft.Json

### Create the Content Moderator client

Replace the contents of the ModeratorHelper.cs file with the following code:

	using Microsoft.CognitiveServices.ContentModerator;

	namespace ModeratorHelper
	{
    /// <summary>
    /// Wraps the creation and configuration of a Content Moderator client.
    /// </summary>
    /// <remarks>This class library contains insecure code. If you adapt this 
    /// code for use in production, use a secure method of storing and using
    /// your Content Moderator subscription key.</remarks>
    public static class Clients
    {
        /// <summary>
        /// The region/location for your Content Moderator account, 
        /// for example, westus.
        /// </summary>
        private static readonly string AzureRegion = "myRegion";

        /// <summary>
        /// The base URL fragment for Content Moderator calls.
        /// </summary>
        private static readonly string AzureBaseURL =
            $"{AzureRegion}.api.cognitive.microsoft.com";

        /// <summary>
        /// Your Content Moderator subscription key.
        /// </summary>
        private static readonly string CMSubscriptionKey = "myKey";

        /// <summary>
        /// Returns a new Content Moderator client for your subscription.
        /// </summary>
        /// <returns>The new client.</returns>
        /// <remarks>The <see cref="ContentModeratorClient"/> is disposable.
        /// When you have finished using the client,
        /// you should dispose of it either directly or indirectly. </remarks>
        public static ContentModeratorClient NewClient()
        {
            // Create and initialize an instance of the Content Moderator API wrapper.
            ContentModeratorClient client = new ContentModeratorClient(new ApiKeyServiceClientCredentials(CMSubscriptionKey));

            client.BaseUrl = AzureBaseURL;
            return client;
        }
    }
	}


> [!IMPORTANT]
> Update the **AzureRegion** and **CMSubscriptionKey** fields with 
> the values of your region identifier and subscription key.

You now have a quick way to create a Content Moderator client for your subscription.

## Next steps

[Download the Visual Studio solution](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/ContentModerator) for this and other Content Moderator quickstarts for .NET, and get started on your integration.
