---
title: Use DRM dynamic encryption license delivery service with Azure Media Services| Microsoft Docs
description: You can use Azure Media Services to deliver your streams encrypted with Microsoft PlayReady, Google Widevine, or Apple FairPlay licenses.
services: media-services
documentationcenter: ''
author: juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 07/15/2018 
ms.author: juliako

---
# Use DRM dynamic encryption and license delivery service

You can use Azure Media Services to deliver MPEG-DASH, Smooth Streaming, and HTTP Live Streaming (HLS) streams protected with [PlayReady digital rights management (DRM)](https://www.microsoft.com/playready/overview/). You can also use Media Services to deliver encrypted DASH streams with **Google Widevine** DRM licenses. Both PlayReady and Widevine are encrypted per the common encryption (ISO/IEC 23001-7 CENC) specification. Media Services also enables you to encrypt your HLS content with **Apple FairPlay** (AES-128 CBC). 

Furthermore, Media Services provides a service for delivering PlayReady, Widevine, and FairPlay DRM licenses. When a user requests DRM-protected content, the player application requests a license from the Media Services license service. If the player application is authorized, the Media Services license service issues a license to the player. A license contains the decryption key that can be used by the client player to decrypt and stream the content.

This article is based on the [Encrypting with DRM](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithDRM) sample. Among other things, the sample demonstrates how to:

* Create an encoding Transform that uses a built-in preset for adaptive bitrate encoding and ingest a file directly from an [HTTPs source URL](job-input-from-http-how-to.md).
* Set the signing key used for verification of your token.
* Set the requirements (restrictions) on the content key policy that must be met to deliver keys with the specified configuration. 

    * Configuration 
    
        In this sample, the [PlayReady](playready-license-template-overview.md) and [Widevine](widevine-license-template-overview.md) licenses are configured so they can be delivered by the Media Services license delivery service. Even though, this sample app does not configure the [FairPlay](fairplay-license-overview.md) license, it contains a method that you can use to configure FairPlay. If you wish, you can add FairPlay configuration as another option.

    * Restriction

        The app sets a JWT token type restriction on the policy.

* Create a StreamingLocator for the specified asset and with the specified streaming policy name. In this case, the predefined policy is used. It sets two content keys on the StreamingLocator: AES-128 (envelope) and CENC (PlayReady and Widevine).  
    
    Once the StreamingLocator is created the output asset is published and available to clients for playback.

    > [!NOTE]
    > Make sure the StreamingEndpoint from which you want to stream is in the Running state.

* Create a URL, to the Azure Media Player, that includes both the DASH manifest and the PlayReady token needed to play back the PlayReady encrypted content. The sample sets the expiration of the token to 1 hour. 

    You can open a browser and paste the resulting URL to launch the Azure Media Player demo page with the URL and token filled out for you already.  

    ![protect with drm](./media/protect-with-drm/playready_encrypted_url.png)

> [!NOTE]
> You can encrypt each asset with multiple encryption types (AES-128, PlayReady, Widevine, FairPlay). See [Streaming protocols and encryption types](content-protection-overview.md#streaming-protocols-and-encryption-types), to see what makes sense to combine.

The sample described in this article produces the following result:

![protect with drm](./media/protect-with-drm/ams_player.png)

## Prerequisites

The following are required to complete the tutorial.

* Review the [Content protection overview](content-protection-overview.md) article.
* Review the [Design multi-drm content protection system with access control](design-multi-drm-system-with-access-control.md)
* Install Visual Studio Code or Visual Studio
* Create a new Azure Media Services account, as described in [this quickstart](create-account-cli-quickstart.md).
* Get credentials needed to use Media Services APIs by following [Access APIs](access-api-cli-how-to.md)
* Set the appropriate values in the application configuration file (appsettings.json).

## Download code

Clone a GitHub repository that contains the full .NET sample discussed in this article to your machine using the following command:

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials.git
 ```
 
The "Encrypt with DRM" sample is located in the [EncryptWithDRM](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithDRM) folder.

> [!NOTE]
> The sample creates unique resources every time you run the application. Typically, you will reuse existing resources like transforms and policies (if existing resource have required configurations). 

## Start using Media Services APIs with .NET SDK

To start using Media Services APIs with .NET, you need to create an **AzureMediaServicesClient** object. To create the object, you need to supply credentials needed for the client to connect to Azure using Azure AD. In the code you cloned at the beginning of the article, the **GetCredentialsAsync** function creates the ServiceClientCredentials object based on the credentials supplied in the local configuration file. 

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#CreateMediaServicesClient)]

## Create an output asset  

The output [Asset](https://docs.microsoft.com/rest/api/media/assets) stores the result of your encoding job.  

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#CreateOutputAsset)]
 
## Get or create an encoding Transform

When creating a new [Transform](https://docs.microsoft.com/rest/api/media/transforms) instance, you need to specify what you want it to produce as an output. The required parameter is a **TransformOutput** object, as shown in the code below. Each **TransformOutput** contains a **Preset**. **Preset** describes the step-by-step instructions of video and/or audio processing operations that are to be used to generate the desired **TransformOutput**. The sample described in this article uses a built-in Preset called **AdaptiveStreaming**. The Preset encodes the input video into an auto-generated bitrate ladder (bitrate-resolution pairs) based on the input resolution and bitrate, and produces ISO MP4 files with H.264 video and AAC audio corresponding to each bitrate-resolution pair. 

Before creating a new [Transform](https://docs.microsoft.com/rest/api/media/transforms), you should first check if one already exists using the **Get** method, as shown in the code that follows.  In Media Services v3, **Get** methods on entities return **null** if the entity doesn’t exist (a case-insensitive check on the name).

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#EnsureTransformExists)]

## Submit Job

As mentioned above, the [Transform](https://docs.microsoft.com/rest/api/media/transforms) object is the recipe and a [Job](https://docs.microsoft.com/rest/api/media/jobs) is the actual request to Media Services to apply that **Transform** to a given input video or audio content. The **Job** specifies information like the location of the input video, and the location for the output.

In this tutorial, we create the job's input based on a file that is ingested directly from an [HTTPs source URL](job-input-from-http-how-to.md).

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#SubmitJob)]

## Wait for the Job to complete

The job takes some time to complete and when it does you want to be notified. The code sample below shows how to poll the service for the status of the [Job](https://docs.microsoft.com/rest/api/media/jobs). Polling is not a recommended best practice for production applications because of potential latency. Polling can be throttled if overused on an account. Developers should instead use Event Grid. See [Route events to a custom web endpoint](job-state-events-cli-how-to.md).

The **Job** usually goes through the following states: **Scheduled**, **Queued**, **Processing**, **Finished** (the final state). If the job has encountered an error, you get the **Error** state. If the job is in the process of being canceled, you get **Canceling** and **Canceled** when it is done.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#WaitForJobToFinish)]

## Create a ContentKeyPolicy

A content key provides secure access to your Assets. You need to create a content key policy that configures how the content key is delivered to end clients. The content key is associated with StreamingLocator. Media Services also provides the key delivery service that delivers encryption keys and licenses to authorized users. 

You need to set the requirements (restrictions) on the content key policy that must be met to deliver keys with the specified configuration. In this example, we set the following configurations and requirements:

* Configuration 

    The [PlayReady](playready-license-template-overview.md) and [Widevine](widevine-license-template-overview.md) licenses are configured so they can be delivered by the Media Services license delivery service. Even though, this sample app does not configure the [FairPlay](fairplay-license-overview.md) license, it contains a method that you can use to configure FairPlay. You can  add FairPlay configuration as another option.

* Restriction

    The app sets a JWT token type restriction on the policy.

When a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content. To decrypt the stream, the player requests the key from the key delivery service. To determine whether the user is authorized to get the key, the service evaluates the content key policy that you specified for the key.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#GetOrCreateContentKeyPolicy)]

## Create a StreamingLocator

After the encoding is complete, and the content key policy is set, the next step is to make the video in the output Asset available to clients for playback. You accomplish this in two steps: 

1. Create a [StreamingLocator](https://docs.microsoft.com/rest/api/media/streaminglocators)
2. Build the streaming URLs that clients can use. 

The process of creating the **StreamingLocator** is called publishing. By default, the **StreamingLocator** is valid immediately after you make the API calls, and lasts until it is deleted, unless you configure the optional start and end times. 

When creating a [StreamingLocator](https://docs.microsoft.com/rest/api/media/streaminglocators), you need to specify the desired **StreamingPolicyName**. In this tutorial, we are using one of the PredefinedStreamingPolicies, which tells Azure Media Services how to publish the content for streaming. In this example, we set StreamingLocator.StreamingPolicyName to the SecureStreaming policy. This policy indicates that you want for two content keys (envelope and CENC) to get generated and set on the locator. Thus, the envelope, PlayReady, and Widevine encryptions are applied (the key is delivered to the playback client based on the configured DRM licenses). If you also want to encrypt your stream with CBCS (FairPlay), use PredefinedStreamingPolicy.SecureStreamingWithFairPlay. 

> [!IMPORTANT]
> When using a custom [StreamingPolicy](https://docs.microsoft.com/rest/api/media/streamingpolicies), you should design a limited set of such policies for your Media Service account, and re-use them for your StreamingLocators whenever the same encryption options and protocols are needed. Your Media Service account has a quota for the number of StreamingPolicy entries. You should not be creating a new StreamingPolicy for each StreamingLocator.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#CreateStreamingLocator)]

## Get a test token
        
In this tutorial, we specify for the content key policy to have a token restriction. The token-restricted policy must be accompanied by a token issued by a security token service (STS). Media Services supports tokens in the [JSON Web Token](https://msdn.microsoft.com/library/gg185950.aspx#BKMK_3) (JWT) formats and that is what we configure in the sample.

The ContentKeyIdentifierClaim is used in the ContentKeyPolicy, which means that the token presented to the key delivery service must have the identifier of the ContentKey in it. In the sample, we don't specify a content key when creating the StreamingLocator, the system creates a random one for us. In order to generate the test token, we must get the ContentKeyId to put in the ContentKeyIdentifierClaim claim.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#GetToken)]

## Build a DASH streaming URL

Now that the [StreamingLocator](https://docs.microsoft.com/rest/api/media/streaminglocators) has been created, you can get the streaming URLs. To build a URL, you need to concatenate the [StreamingEndpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints) host name and the **StreamingLocator** path. In this sample, the *default* **StreamingEndpoint** is used. When you first create a Media Service account, this *default* **StreamingEndpoint** will be in a stopped state, so you need to call **Start**.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#GetMPEGStreamingUrl)]

## Clean up resources in your Media Services account

Generally, you should clean up everything except objects that you are planning to reuse (typically, you will reuse Transforms, and you will persist StreamingLocators, etc.). If you want for your account to be clean after experimenting, you should delete the resources that you do not plan to reuse.  For example, the following code deletes Jobs.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#CleanUp)]

## Next steps

Check out how to [protect with AES-128](protect-with-aes128.md)
