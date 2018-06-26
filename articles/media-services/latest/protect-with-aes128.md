---
title: Use AES-128 dynamic encryption and the key delivery service | Microsoft Docs
description: Deliver your content encrypted with AES 128-bit encryption keys by using Microsoft Azure Media Services. Media Services also provides the key delivery service that delivers encryption keys to authorized users. This topic shows how to dynamically encrypt with AES-128 and use the key delivery service.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/25/2017
ms.author: juliako

---
# Use AES-128 dynamic encryption and the key delivery service

You can use Media Services to deliver HTTP Live Streaming (HLS), MPEG-DASH and Smooth Streaming encrypted with the AES by using 128-bit encryption keys. Media Services also provides the key delivery service that delivers encryption keys to authorized users. If you want Media Services to encrypt an asset, you associate an encryption key with the asset and also configure authorization policies for the key. When a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content by using AES encryption. To decrypt the stream, the player requests the key from the key delivery service. To determine whether the user is authorized to get the key, the service evaluates the authorization policies that you specified for the key.

The article is based on the [EncodeHTTPAndPublishAESEncrypted](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/tree/master/NETCore/EncodeHTTPAndPublishAESEncrypted) sample. The sample demonstrates how to create an encoding Transform that uses a built-in preset for adaptive bitrate encoding and ingests a file directly from an [HTTPs source URL](job-input-from-http-how-to.md). The output asset is then published using Envelope (AES), or sometimes referred to as ClearKey, encryption. The sample publishes the asset on the "default" StreamingEndpoint. Make sure that you have already started the default endpoint, or modify the code to start the default or create a new Streaming Endpoint and autostart it. The output from the sample is a URL to the Azure Media Player, including both the DASH manifest and the AES token needed to play back the content. The sample sets the expiration of the JWT token to 1 hour. You can open a browser and paste the resulting URL to launch the Azure Media Player demo page with the URL and token filled out for you already: ``` https://ampdemo.azureedge.net/?url= {dash Manifest URL} &aes=true&aestoken=Bearer%3D{ JWT Token here}```.

The article descrbies the following common steps:

* Create the content key policy  
* Get or create an encoding Transform
* Create input job from HTTPS URL
* Create an output asset
* Submit job
* Wait for the job to finish
* Create a StreamingLocator
* Get ContentKeys
* Get token
* Get streaming endpoint
* Build streaming URLs

## Prerequisites

The following are required to complete the tutorial.

* Review the [Content protection overview](content-protection-overview.md) topic.
* Install Visual Studio Code or Visual Studio
* Create a new Azure Media Services account, as described in [this quickstart](create-account-cli-quickstart.md).
* Get credentials needed to use Media Services APIs by following [Access APIs](access-api-cli-how-to.md)

## Download code

Clone a GitHub repository that contains the full .NET Core sample to your machine using the following command:

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials.git
 ```
 
The "Encrypt with AES-128" sample is located in the [EncodeHTTPAndPublishAESEncrypted](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/tree/master/NETCore/EncodeHTTPAndPublishAESEncrypted) folder.

## Create Content Key Policy

Create the content key policy that configures how the content key is delivered to end clients via the Key Delivery component of Azure Media Services.

```csharp
private static ContentKeyPolicy EnsureContentKeyPolicyExists(IAzureMediaServicesClient client,
    string resourceGroup, string accountName, string contentKeyPolicyName)
{
    ContentKeyPolicySymmetricTokenKey primaryKey = new ContentKeyPolicySymmetricTokenKey(TokenSigningKey);
    List<ContentKeyPolicyRestrictionTokenKey> alternateKeys = null;
    List<ContentKeyPolicyTokenClaim> requiredClaims = new List<ContentKeyPolicyTokenClaim>()
    {
        ContentKeyPolicyTokenClaim.ContentKeyIdentifierClaim
    };

    List<ContentKeyPolicyOption> options = new List<ContentKeyPolicyOption>()
    {
        new ContentKeyPolicyOption(
            new ContentKeyPolicyClearKeyConfiguration(),
            new ContentKeyPolicyTokenRestriction(Issuer, Audience, primaryKey,
                ContentKeyPolicyRestrictionTokenType.Jwt, alternateKeys, requiredClaims))
    };

    // since we are randomly generating the signing key each time, make sure to create or update the policy each time.
    // Normally you would use a long lived key so you would just check for the policies existence with Get instead of
    // ensuring to create or update it each time.
    ContentKeyPolicy policy = client.ContentKeyPolicies.CreateOrUpdate(resourceGroup, accountName, contentKeyPolicyName, options);

    return policy;
}
```

## Get or create an encoding Transform

Ensure that you have customized encoding Transform.  This is really a one time setup operation.

```csharp
private static Transform EnsureTransformExists(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string transformName, Preset preset)
{
    Transform transform = client.Transforms.Get(resourceGroupName, accountName, transformName);

    if (transform == null)
    {
        TransformOutput[] outputs = new TransformOutput[]
        {
            new TransformOutput(preset),
        };

        transform = client.Transforms.CreateOrUpdate(resourceGroupName, accountName, transformName, outputs);
    }

    return transform;
}
```

## Create input job from HTTPS URL

In this sample we create an encoding Transform that uses a built-in preset for adaptive bitrate encoding and ingests a file directly from an [HTTPs source URL](job-input-from-http-how-to.md).

```csharp
var input = new JobInputHttp(
                    baseUri: "https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/",
                    files: new List<String> {"Ignite-short.mp4"},
                    label:"input1"
                    );
```

## Create an output asset

```csharp
private static Asset CreateOutputAsset(IAzureMediaServicesClient client, string resourceGroupName, string accountName,  string assetName)
{
    Asset input = new Asset();

    return client.Assets.CreateOrUpdate(resourceGroupName, accountName, assetName, input);
}
```        

## Submit job

```csharp
private static Job SubmitJob(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string transformName, string jobName, JobInput jobInput, string outputAssetName)
{
    JobOutput[] jobOutputs =
    {
        new JobOutputAsset(outputAssetName), 
    };

    Job job = client.Jobs.Create(
        resourceGroupName, 
        accountName,
        transformName,
        jobName,
        new Job
        {
            Input = jobInput,
            Outputs = jobOutputs,
        });

    return job;
}
```

## Wait for the job to finish

```csharp
private static Job WaitForJobToFinish(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string transformName, string jobName)
{
    const int SleepInterval = 10 * 1000;

    Job job = null;
    bool exit = false;

    do
    {
        job = client.Jobs.Get(resourceGroupName, accountName, transformName, jobName);
        
        if (job.State == JobState.Finished || job.State == JobState.Error || job.State == JobState.Canceled)
        {
            exit = true;
        }
        else
        {
            Console.WriteLine($"Job is {job.State}.");

            for (int i = 0; i < job.Outputs.Count; i++)
            {
                JobOutput output = job.Outputs[i];

                Console.Write($"\tJobOutput[{i}] is {output.State}.");

                if (output.State == JobState.Processing)
                {
                    Console.Write($"  Progress: {output.Progress}");
                }

                Console.WriteLine();
            }

            System.Threading.Thread.Sleep(SleepInterval);
        }
    }
    while (!exit);

    return job;
}
```

## Create a StreamingLocator

// Now that the content has been encoded, publish it for Streaming by creating
// a StreamingLocator.  Note that we are using one of the PredefinedStreamingPolicies
// which tell the Origin component of Azure Media Services how to publish the content
// for streaming.  In this case it applies AES Envelople encryption, which is also known
// ClearKey encryption (because the key is delivered to the playback client via HTTPS and
// not instead a DRM license).

```csharp
StreamingLocator locator = new StreamingLocator(
    assetName: outputAssetName,
    streamingPolicyName: PredefinedStreamingPolicy.ClearKey,
    defaultContentKeyPolicyName: ContentKeyPolicyName);

client.StreamingLocators.Create(config.ResourceGroup, config.AccountName, streamingLocatorName, locator);
```

## Get ContentKeys
        
// We are using the ContentKeyIdentifierClaim in the ContentKeyPolicy which means that the token presented
// to the Key Delivery Component must have the identifier of the content key in it.  Since we didn't specify
// a content key when creating the StreamingLocator, the system created a random one for us.  In order to 
// generate our test token we must get the ContentKeyId to put in the ContentKeyIdentifierClaim claim.

```csharp
var response = client.StreamingLocators.ListContentKeys(config.ResourceGroup, config.AccountName, streamingLocatorName);
string keyIdentifier = response.ContentKeys.First().Id.ToString();
```

## Get token

```csharp
private static string GetToken(string issuer, string audience, string keyIdentifier, byte[] tokenVerificationKey)
{
    var tokenSigningKey = new SymmetricSecurityKey(tokenVerificationKey);

    SigningCredentials cred = new SigningCredentials(
        tokenSigningKey,
        // Use the  HmacSha256 and not the HmacSha256Signature option, or the token will not work!
        SecurityAlgorithms.HmacSha256,
        SecurityAlgorithms.Sha256Digest);

    Claim[] claims = new Claim[]
    {
        new Claim(ContentKeyPolicyTokenClaim.ContentKeyIdentifierClaim.ClaimType, keyIdentifier)
    };

    JwtSecurityToken token = new JwtSecurityToken(
        issuer: issuer,
        audience: audience,
        claims: claims,
        notBefore: DateTime.Now.AddMinutes(-5),
        expires: DateTime.Now.AddMinutes(60), 
        signingCredentials: cred);

    JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
    
    return handler.WriteToken(token);
}

```

## Get streaming endpoint

The sample publishes the asset on the "default" StreamingEndpoint. Make sure that you have already started the default endpoint, or modify the code to start the default or create a new Streaming Endpoint and autostart it.

```csharp

 StreamingEndpoint streamingEndpoint = client.StreamingEndpoints.Get(resourceGroupName, accountName, "default");

    if (streamingEndpoint != null)
    {
        if (streamingEndpoint.ResourceState != StreamingEndpointResourceState.Running)
        {
            await client.StreamingEndpoints.StartAsync(resourceGroupName, accountName, DefaultStreamingEndpointName);
        }
    }
```

## Build streaming URLs

```csharp
for (int i = 0; i < paths.StreamingPaths.Count; i++)
{
    UriBuilder uriBuilder = new UriBuilder();
    uriBuilder.Scheme = "https";
    uriBuilder.Host = streamingEndpoint.HostName;

    if (paths.StreamingPaths[i].Paths.Count > 0)
    {
        // Look for just the DASH path and generate a URL for the Azure Media Player to playback the content with the AES token to decrypt.
        // Note that the JWT token is set to expire in 1 hour. 
        if (paths.StreamingPaths[i].StreamingProtocol== "Dash"){
            uriBuilder.Path = paths.StreamingPaths[i].Paths[0];
            var dashPath = uriBuilder.ToString();

            Console.WriteLine("Open the following URL in your browser to play back the file in the Azure Media Player");
            Console.WriteLine($"https://ampdemo.azureedge.net/?url={dashPath}&aes=true&aestoken=Bearer%3D{token}");
            Console.WriteLine();
        }
    }
}
```

## Next steps

[Protect with PlayReady and/or Widevine](protect-with-playready-widevine.md)