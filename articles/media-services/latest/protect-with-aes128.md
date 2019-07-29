---
title: Use Azure Media Services to encrypt the video with AES-128 | Microsoft Docs
description: Deliver your content encrypted with AES 128-bit encryption keys by using Microsoft Azure Media Services. Media Services also provides the key delivery service that delivers encryption keys to authorized users. This topic shows how to dynamically encrypt with AES-128 and use the key delivery service.
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
ms.date: 04/21/2019
ms.author: juliako

---
# Tutorial: Use AES-128 dynamic encryption and the key delivery service

> [!NOTE]
> Even though the tutorial uses the [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.liveevent?view=azure-dotnet) examples, the general steps are the same for [REST API](https://docs.microsoft.com/rest/api/media/liveevents), [CLI](https://docs.microsoft.com/cli/azure/ams/live-event?view=azure-cli-latest), or other supported [SDKs](media-services-apis-overview.md#sdks).

You can use Media Services to deliver HTTP Live Streaming (HLS), MPEG-DASH, and Smooth Streaming encrypted with the AES by using 128-bit encryption keys. Media Services also provides the key delivery service that delivers encryption keys to authorized users. If you want for Media Services to dynamically encrypt your video, you associate the encryption key with Streaming Locator and also configure the content key policy. When a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content with AES-128. To decrypt the stream, the player requests the key from the key delivery service. To determine whether the user is authorized to get the key, the service evaluates the content key policy that you specified for the key.

You can encrypt each asset with multiple encryption types (AES-128, PlayReady, Widevine, FairPlay). See [Streaming protocols and encryption types](content-protection-overview.md#streaming-protocols-and-encryption-types), to see what makes sense to combine. Also, see [How to protect with DRM](protect-with-drm.md).

The output from the sample this article includes a URL to the Azure Media Player, manifest URL, and the AES token needed to play back the content. The sample sets the expiration of the JWT token to 1 hour. You can open a browser and paste the resulting URL to launch the Azure Media Player demo page with the URL and token filled out for you already in the following format: ```https://ampdemo.azureedge.net/?url= {dash Manifest URL} &aes=true&aestoken=Bearer%3D{ JWT Token here}```.

This tutorial shows you how to:    

> [!div class="checklist"]
> * Download the [EncryptWithAES](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithAES) sample described in the article
> * Start using Media Services APIs with .NET SDK
> * Create an output asset
> * Create an encoding Transform
> * Submit a Job
> * Wait for the Job to complete
> * Create a Content Key Policy
> * Configure the policy to use JWT token restriction 
> * Create a Streaming Locator
> * Configure the Streaming Locator to encrypt the video with AES (ClearKey)
> * Get a test token
> * Build a streaming URL
> * Clean up resources

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

The following are required to complete the tutorial.

* Review the [Content protection overview](content-protection-overview.md) article
* Install Visual Studio Code or Visual Studio
* [Create a Media Services account](create-account-cli-quickstart.md)
* Get credentials needed to use Media Services APIs by following [Access APIs](access-api-cli-how-to.md)

## Download code

Clone a GitHub repository that contains the full .NET sample discussed in this article to your machine using the following command:

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials.git
 ```
 
The "Encrypt with AES-128" sample is located in the [EncryptWithAES](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithAES) folder.

> [!NOTE]
> The sample creates unique resources every time you run the application. Typically, you will reuse existing resources like transforms and policies (if existing resource have required configurations). 

## Start using Media Services APIs with .NET SDK

To start using Media Services APIs with .NET, you need to create an **AzureMediaServicesClient** object. To create the object, you need to supply credentials needed for the client to connect to Azure using Azure AD. In the code you cloned at the beginning of the article, the **GetCredentialsAsync** function creates the ServiceClientCredentials object based on the credentials supplied in the local configuration file. 

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithAES/Program.cs#CreateMediaServicesClient)]

## Create an output asset  

The output [Asset](https://docs.microsoft.com/rest/api/media/assets) stores the result of your encoding job.  

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithAES/Program.cs#CreateOutputAsset)]
 
## Get or create an encoding Transform

When creating a new [Transform](https://docs.microsoft.com/rest/api/media/transforms) instance, you need to specify what you want it to produce as an output. The required parameter is a **TransformOutput** object, as shown in the code below. Each **TransformOutput** contains a **Preset**. **Preset** describes the step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. The sample described in this article uses a built-in Preset called **AdaptiveStreaming**. The Preset encodes the input video into an auto-generated bitrate ladder (bitrate-resolution pairs) based on the input resolution and bitrate, and produces ISO MP4 files with H.264 video and AAC audio corresponding to each bitrate-resolution pair. 

Before creating a new [Transform](https://docs.microsoft.com/rest/api/media/transforms), you should first check if one already exists using the **Get** method, as shown in the code that follows.  In Media Services v3, **Get** methods on entities return **null** if the entity doesn’t exist (a case-insensitive check on the name).

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithAES/Program.cs#EnsureTransformExists)]

## Submit Job

As mentioned above, the [Transform](https://docs.microsoft.com/rest/api/media/transforms) object is the recipe and a [Job](https://docs.microsoft.com/rest/api/media/jobs) is the actual request to Media Services to apply that **Transform** to a given input video or audio content. The **Job** specifies information like the location of the input video, and the location for the output.

In this tutorial, we create the job's input based on a file that is ingested directly from an [HTTPs source URL](job-input-from-http-how-to.md).

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithAES/Program.cs#SubmitJob)]

## Wait for the Job to complete

The job takes some time to complete and when it does you want to be notified. The code sample below shows how to poll the service for the status of the [Job](https://docs.microsoft.com/rest/api/media/jobs). Polling is not a recommended best practice for production applications because of potential latency. Polling can be throttled if overused on an account. Developers should instead use Event Grid. See [Route events to a custom web endpoint](job-state-events-cli-how-to.md).

The **Job** usually goes through the following states: **Scheduled**, **Queued**, **Processing**, **Finished** (the final state). If the job has encountered an error, you get the **Error** state. If the job is in the process of being canceled, you get **Canceling** and **Canceled** when it is done.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithAES/Program.cs#WaitForJobToFinish)]

## Create a Content Key Policy

A content key provides secure access to your Assets. You need to create a **Content Key Policy** that configures how the content key is delivered to end clients. The content key is associated with **Streaming Locator**. Media Services also provides the key delivery service that delivers encryption keys to authorized users. 

When a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content (in this case, by using AES encryption.) To decrypt the stream, the player requests the key from the key delivery service. To determine whether the user is authorized to get the key, the service evaluates the content key policy that you specified for the key.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithAES/Program.cs#GetOrCreateContentKeyPolicy)]

## Create a Streaming Locator

After the encoding is complete, and the content key policy is set, the next step is to make the video in the output Asset available to clients for playback. You accomplish this in two steps: 

1. Create a [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators)
2. Build the streaming URLs that clients can use. 

The process of creating the **Streaming Locator** is called publishing. By default, the **Streaming Locator** is valid immediately after you make the API calls, and lasts until it is deleted, unless you configure the optional start and end times. 

When creating a [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators), you will need to specify the desired **StreamingPolicyName**. In this tutorial, we are using one of the PredefinedStreamingPolicies, which tells Azure Media Services how to publish the content for streaming. In this example, the AES Envelope encryption is applied (also known as ClearKey encryption because the key is delivered to the playback client via HTTPS and not a DRM license).

> [!IMPORTANT]
> When using a custom [StreamingPolicy](https://docs.microsoft.com/rest/api/media/streamingpolicies), you should design a limited set of such policies for your Media Service account, and re-use them for your Streaming Locators whenever the same encryption options and protocols are needed. Your Media Service account has a quota for the number of StreamingPolicy entries. You should not be creating a new StreamingPolicy for each Streaming Locator.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithAES/Program.cs#CreateStreamingLocator)]

## Get a test token
        
In this tutorial, we specify for the content key policy to have a token restriction. The token-restricted policy must be accompanied by a token issued by a security token service (STS). Media Services supports tokens in the [JSON Web Token](https://msdn.microsoft.com/library/gg185950.aspx#BKMK_3) (JWT) formats and that is what we configure in the sample.

The ContentKeyIdentifierClaim is used in the **Content Key Policy**, which means that the token presented to the Key Delivery service must have the identifier of the content key in it. In the sample, we didn't specify a content key when creating the Streaming Locator, the system created a random one for us. In order to generate the test token, we must get the ContentKeyId to put in the ContentKeyIdentifierClaim claim.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithAES/Program.cs#GetToken)]

## Build a DASH streaming URL

Now that the [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators) has been created, you can get the streaming URLs. To build a URL, you need to concatenate the [StreamingEndpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints) host name and the **Streaming Locator** path. In this sample, the *default* **Streaming Endpoint** is used. When you first create a Media Service account, this *default* **Streaming Endpoint** will be in a stopped state, so you need to call **Start**.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithAES/Program.cs#GetMPEGStreamingUrl)]

## Clean up resources in your Media Services account

Generally, you should clean up everything except objects that you are planning to reuse (typically, you will reuse Transforms, and you will persist Streaming Locators, etc.). If you want for your account to be clean after experimenting, you should delete the resources that you do not plan to reuse.  For example, the following code deletes Jobs.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithAES/Program.cs#CleanUp)]

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this tutorial, delete the resource group you created earlier. 

Execute the following CLI command:

```azurecli
az group delete --name amsResourceGroup
```

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

> [!div class="nextstepaction"]
> [Protect with DRM](protect-with-drm.md)
